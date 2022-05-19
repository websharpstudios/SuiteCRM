/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */
import { Component, Input } from '@angular/core';
import { isVoid } from 'common';
import { DataTypeFormatter } from '../../services/formatters/data-type.formatter.service';
import { debounceTime } from 'rxjs/operators';
import { FieldLogicManager } from '../field-logic/field-logic.manager';
export class BaseFieldComponent {
    constructor(typeFormatter, logic) {
        this.typeFormatter = typeFormatter;
        this.logic = logic;
        this.klass = null;
        this.dependentFields = [];
        this.dependentAttributes = [];
        this.subs = [];
    }
    ngOnInit() {
        this.baseInit();
    }
    baseInit() {
        this.initDependencyHandlers();
    }
    /**
     * Calculate and init dependency handlers
     */
    initDependencyHandlers() {
        if (!this.record) {
            return;
        }
        const fieldKeys = (this.record.fields && Object.keys(this.record.fields)) || [];
        if (fieldKeys.length > 1) {
            this.calculateDependentFields(fieldKeys);
            if (this.field.valueChanges$ && (this.dependentFields.length || this.dependentAttributes.length)) {
                this.subs.push(this.field.valueChanges$.pipe(debounceTime(500)).subscribe(() => {
                    this.dependentFields.forEach(fieldKey => {
                        const field = this.record.fields[fieldKey] || null;
                        if (!field) {
                            return;
                        }
                        this.logic.runLogic(field, this.mode, this.record);
                    });
                    this.dependentAttributes.forEach(dependency => {
                        const field = this.record.fields[dependency.field] || {};
                        const attribute = (field && field.attributes && field.attributes[dependency.attribute]) || null;
                        if (!attribute) {
                            return;
                        }
                        this.logic.runLogic(attribute, this.mode, this.record);
                    });
                }));
            }
        }
    }
    /**
     * Calculate dependent fields
     * @param {array} fieldKeys
     */
    calculateDependentFields(fieldKeys) {
        fieldKeys.forEach(key => {
            if (this.field.source === 'field') {
                this.addFieldDependency(key, this.dependentFields, this.dependentAttributes);
                return;
            }
            if (this.field.source === 'attribute') {
                this.addAttributeDependency(key, this.dependentFields, this.dependentAttributes);
                return;
            }
        });
    }
    /**
     * Add field dependency
     * @param {string} fieldKey
     * @param {array} dependentFields
     * @param {object} dependentAttributes
     */
    addFieldDependency(fieldKey, dependentFields, dependentAttributes) {
        const field = this.record.fields[fieldKey];
        const name = this.field.name || this.field.definition.name || '';
        if (fieldKey === name || !field) {
            return;
        }
        if (field.fieldDependencies && field.fieldDependencies.length && this.isDependencyField(field.fieldDependencies)) {
            dependentFields.push(fieldKey);
        }
        const attributeKeys = (field.attributes && Object.keys(field.attributes)) || [];
        attributeKeys.forEach(attributeKey => {
            const attribute = field.attributes[attributeKey];
            if (!attribute || !attribute.fieldDependencies || !attribute.fieldDependencies.length) {
                return;
            }
            if (this.isDependencyField(attribute.fieldDependencies)) {
                dependentAttributes.push({
                    field: fieldKey,
                    attribute: attributeKey
                });
            }
        });
    }
    /**
     * Check if field is dependency
     * @param dependencies
     * @returns {boolean}
     */
    isDependencyField(dependencies) {
        const name = this.field.name || this.field.definition.name || '';
        return dependencies.some(dependency => name === dependency);
    }
    /**
     * Add attribute dependency
     * @param {string} fieldKey
     * @param {array} dependentFields
     * @param {object} dependentAttributes
     */
    addAttributeDependency(fieldKey, dependentFields, dependentAttributes) {
        const field = this.record.fields[fieldKey];
        const name = this.field.name || this.field.definition.name || '';
        if (fieldKey === name || !field) {
            return;
        }
        if (field.attributeDependencies && field.attributeDependencies.length && this.isDependencyAttribute(field.attributeDependencies)) {
            dependentFields.push(fieldKey);
        }
        const attributeKeys = (field.attributes && Object.keys(field.attributes)) || [];
        attributeKeys.forEach(attributeKey => {
            const attribute = field.attributes[attributeKey];
            if (!attribute || !attribute.attributeDependencies || !attribute.attributeDependencies.length) {
                return;
            }
            if (this.isDependencyAttribute(attribute.attributeDependencies)) {
                dependentAttributes.push({
                    field: fieldKey,
                    attribute: attributeKey
                });
            }
        });
    }
    /**
     * Check if attribute is dependency
     * @param {object} attributeDependencies
     * @returns {boolean}
     */
    isDependencyAttribute(attributeDependencies) {
        const parentKey = this.field.parentKey || '';
        const name = this.field.name || this.field.definition.name || '';
        return attributeDependencies.some(dependency => parentKey === dependency.field && name === dependency.attribute);
    }
    subscribeValueChanges() {
        if (this.field && this.field.formControl) {
            this.subs.push(this.field.formControl.valueChanges.subscribe(value => {
                if (!isVoid(value)) {
                    value = value.trim();
                }
                else {
                    value = '';
                }
                if (this.typeFormatter && this.field.type) {
                    value = this.typeFormatter.toInternalFormat(this.field.type, value);
                }
                this.setFieldValue(value);
            }));
        }
    }
    setFieldValue(newValue) {
        this.field.value = newValue;
    }
    unsubscribeAll() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
BaseFieldComponent.decorators = [
    { type: Component, args: [{ template: '' },] }
];
BaseFieldComponent.ctorParameters = () => [
    { type: DataTypeFormatter },
    { type: FieldLogicManager }
];
BaseFieldComponent.propDecorators = {
    mode: [{ type: Input }],
    field: [{ type: Input }],
    record: [{ type: Input }],
    parent: [{ type: Input }],
    klass: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1maWVsZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvZmllbGRzL2Jhc2UvYmFzZS1maWVsZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBRXZELE9BQU8sRUFBNkIsTUFBTSxFQUFtQixNQUFNLFFBQVEsQ0FBQztBQUU1RSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx1REFBdUQsQ0FBQztBQUN4RixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFHckUsTUFBTSxPQUFPLGtCQUFrQjtJQVUzQixZQUFzQixhQUFnQyxFQUFZLEtBQXdCO1FBQXBFLGtCQUFhLEdBQWIsYUFBYSxDQUFtQjtRQUFZLFVBQUssR0FBTCxLQUFLLENBQW1CO1FBTGpGLFVBQUssR0FBNkIsSUFBSSxDQUFDO1FBQ2hELG9CQUFlLEdBQWEsRUFBRSxDQUFDO1FBQy9CLHdCQUFtQixHQUEwQixFQUFFLENBQUM7UUFDdEMsU0FBSSxHQUFtQixFQUFFLENBQUM7SUFHcEMsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVTLFFBQVE7UUFDZCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7O09BRUc7SUFDTyxzQkFBc0I7UUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZCxPQUFPO1NBQ1Y7UUFDRCxNQUFNLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLE1BQU0s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LENBQUMsQ0FBQyxDQUFDO1NBQ1A7SUFDTCxDQUFDO0lBRVMsYUFBYSxDQUFDLFFBQVE7UUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO0lBQ2hDLENBQUM7SUFFUyxjQUFjO1FBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQzs7O1lBeE1KLFNBQVMsU0FBQyxFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUM7OztZQUpqQixpQkFBaUI7WUFFakIsaUJBQWlCOzs7bUJBSXBCLEtBQUs7b0JBQ0wsS0FBSztxQkFDTCxLQUFLO3FCQUNMLEtBQUs7b0JBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGaWVsZENvbXBvbmVudEludGVyZmFjZX0gZnJvbSAnLi9maWVsZC5pbnRlcmZhY2UnO1xuaW1wb3J0IHtBdHRyaWJ1dGVEZXBlbmRlbmN5LCBGaWVsZCwgaXNWb2lkLCBSZWNvcmQsIFZpZXdNb2RlfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtEYXRhVHlwZUZvcm1hdHRlcn0gZnJvbSAnLi4vLi4vc2VydmljZXMvZm9ybWF0dGVycy9kYXRhLXR5cGUuZm9ybWF0dGVyLnNlcnZpY2UnO1xuaW1wb3J0IHtkZWJvdW5jZVRpbWV9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7RmllbGRMb2dpY01hbmFnZXJ9IGZyb20gJy4uL2ZpZWxkLWxvZ2ljL2ZpZWxkLWxvZ2ljLm1hbmFnZXInO1xuXG5AQ29tcG9uZW50KHt0ZW1wbGF0ZTogJyd9KVxuZXhwb3J0IGNsYXNzIEJhc2VGaWVsZENvbXBvbmVudCBpbXBsZW1lbnRzIEZpZWxkQ29tcG9uZW50SW50ZXJmYWNlLCBPbkluaXQge1xuICAgIEBJbnB1dCgpIG1vZGU6IHN0cmluZztcbiAgICBASW5wdXQoKSBmaWVsZDogRmllbGQ7XG4gICAgQElucHV0KCkgcmVjb3JkOiBSZWNvcmQ7XG4gICAgQElucHV0KCkgcGFyZW50OiBSZWNvcmQ7XG4gICAgQElucHV0KCkga2xhc3M6IHsgW2tsYXNzOiBzdHJpbmddOiBhbnkgfSA9IG51bGw7XG4gICAgZGVwZW5kZW50RmllbGRzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGRlcGVuZGVudEF0dHJpYnV0ZXM6IEF0dHJpYnV0ZURlcGVuZGVuY3lbXSA9IFtdO1xuICAgIHByb3RlY3RlZCBzdWJzOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHR5cGVGb3JtYXR0ZXI6IERhdGFUeXBlRm9ybWF0dGVyLCBwcm90ZWN0ZWQgbG9naWM6IEZpZWxkTG9naWNNYW5hZ2VyKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYmFzZUluaXQoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYmFzZUluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5pdERlcGVuZGVuY3lIYW5kbGVycygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZSBhbmQgaW5pdCBkZXBlbmRlbmN5IGhhbmRsZXJzXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGluaXREZXBlbmRlbmN5SGFuZGxlcnMoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaWVsZEtleXMgPSAodGhpcy5yZWNvcmQuZmllbGRzICYmIE9iamVjdC5rZXlzKHRoaXMucmVjb3JkLmZpZWxkcykpIHx8IFtdO1xuXG4gICAgICAgIGlmIChmaWVsZEtleXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVEZXBlbmRlbnRGaWVsZHMoZmllbGRLZXlzKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZmllbGQudmFsdWVDaGFuZ2VzJCAmJiAodGhpcy5kZXBlbmRlbnRGaWVsZHMubGVuZ3RoIHx8IHRoaXMuZGVwZW5kZW50QXR0cmlidXRlcy5sZW5ndGgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJzLnB1c2godGhpcy5maWVsZC52YWx1ZUNoYW5nZXMkLnBpcGUoZGVib3VuY2VUaW1lKDUwMCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwZW5kZW50RmllbGRzLmZvckVhY2goZmllbGRLZXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLnJlY29yZC5maWVsZHNbZmllbGRLZXldIHx8IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ2ljLnJ1bkxvZ2ljKGZpZWxkLCB0aGlzLm1vZGUgYXMgVmlld01vZGUsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBlbmRlbnRBdHRyaWJ1dGVzLmZvckVhY2goZGVwZW5kZW5jeSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMucmVjb3JkLmZpZWxkc1tkZXBlbmRlbmN5LmZpZWxkXSB8fCB7fSBhcyBGaWVsZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IChmaWVsZCAmJiBmaWVsZC5hdHRyaWJ1dGVzICYmIGZpZWxkLmF0dHJpYnV0ZXNbZGVwZW5kZW5jeS5hdHRyaWJ1dGVdKSB8fCBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dpYy5ydW5Mb2dpYyhhdHRyaWJ1dGUsIHRoaXMubW9kZSBhcyBWaWV3TW9kZSwgdGhpcy5yZWNvcmQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlIGRlcGVuZGVudCBmaWVsZHNcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBmaWVsZEtleXNcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgY2FsY3VsYXRlRGVwZW5kZW50RmllbGRzKGZpZWxkS2V5czogc3RyaW5nW10pOiB2b2lkIHtcbiAgICAgICAgZmllbGRLZXlzLmZvckVhY2goa2V5ID0+IHtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZmllbGQuc291cmNlID09PSAnZmllbGQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRGaWVsZERlcGVuZGVuY3koa2V5LCB0aGlzLmRlcGVuZGVudEZpZWxkcywgdGhpcy5kZXBlbmRlbnRBdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmZpZWxkLnNvdXJjZSA9PT0gJ2F0dHJpYnV0ZScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEF0dHJpYnV0ZURlcGVuZGVuY3koa2V5LCB0aGlzLmRlcGVuZGVudEZpZWxkcywgdGhpcy5kZXBlbmRlbnRBdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGZpZWxkIGRlcGVuZGVuY3lcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmllbGRLZXlcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBkZXBlbmRlbnRGaWVsZHNcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGVwZW5kZW50QXR0cmlidXRlc1xuICAgICAqL1xuICAgIHByb3RlY3RlZCBhZGRGaWVsZERlcGVuZGVuY3koZmllbGRLZXk6IHN0cmluZywgZGVwZW5kZW50RmllbGRzOiBzdHJpbmdbXSwgZGVwZW5kZW50QXR0cmlidXRlczogQXR0cmlidXRlRGVwZW5kZW5jeVtdKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5yZWNvcmQuZmllbGRzW2ZpZWxkS2V5XTtcbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMuZmllbGQubmFtZSB8fCB0aGlzLmZpZWxkLmRlZmluaXRpb24ubmFtZSB8fCAnJztcbiAgICAgICAgaWYgKGZpZWxkS2V5ID09PSBuYW1lIHx8ICFmaWVsZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpZWxkLmZpZWxkRGVwZW5kZW5jaWVzICYmIGZpZWxkLmZpZWxkRGVwZW5kZW5jaWVzLmxlbmd0aCAmJiB0aGlzLmlzRGVwZW5kZW5jeUZpZWxkKGZpZWxkLmZpZWxkRGVwZW5kZW5jaWVzKSkge1xuICAgICAgICAgICAgZGVwZW5kZW50RmllbGRzLnB1c2goZmllbGRLZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXR0cmlidXRlS2V5cyA9IChmaWVsZC5hdHRyaWJ1dGVzICYmIE9iamVjdC5rZXlzKGZpZWxkLmF0dHJpYnV0ZXMpKSB8fCBbXTtcblxuICAgICAgICBhdHRyaWJ1dGVLZXlzLmZvckVhY2goYXR0cmlidXRlS2V5ID0+IHtcblxuICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlID0gZmllbGQuYXR0cmlidXRlc1thdHRyaWJ1dGVLZXldO1xuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGUgfHwgIWF0dHJpYnV0ZS5maWVsZERlcGVuZGVuY2llcyB8fCAhYXR0cmlidXRlLmZpZWxkRGVwZW5kZW5jaWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNEZXBlbmRlbmN5RmllbGQoYXR0cmlidXRlLmZpZWxkRGVwZW5kZW5jaWVzKSkge1xuICAgICAgICAgICAgICAgIGRlcGVuZGVudEF0dHJpYnV0ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkOiBmaWVsZEtleSxcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlOiBhdHRyaWJ1dGVLZXlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgZmllbGQgaXMgZGVwZW5kZW5jeVxuICAgICAqIEBwYXJhbSBkZXBlbmRlbmNpZXNcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaXNEZXBlbmRlbmN5RmllbGQoZGVwZW5kZW5jaWVzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5maWVsZC5uYW1lIHx8IHRoaXMuZmllbGQuZGVmaW5pdGlvbi5uYW1lIHx8ICcnO1xuICAgICAgICByZXR1cm4gZGVwZW5kZW5jaWVzLnNvbWUoZGVwZW5kZW5jeSA9PiBuYW1lID09PSBkZXBlbmRlbmN5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYXR0cmlidXRlIGRlcGVuZGVuY3lcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmllbGRLZXlcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBkZXBlbmRlbnRGaWVsZHNcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGVwZW5kZW50QXR0cmlidXRlc1xuICAgICAqL1xuICAgIHByb3RlY3RlZCBhZGRBdHRyaWJ1dGVEZXBlbmRlbmN5KGZpZWxkS2V5OiBzdHJpbmcsIGRlcGVuZGVudEZpZWxkczogc3RyaW5nW10sIGRlcGVuZGVudEF0dHJpYnV0ZXM6IEF0dHJpYnV0ZURlcGVuZGVuY3lbXSk6IHZvaWQge1xuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMucmVjb3JkLmZpZWxkc1tmaWVsZEtleV07XG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmZpZWxkLm5hbWUgfHwgdGhpcy5maWVsZC5kZWZpbml0aW9uLm5hbWUgfHwgJyc7XG4gICAgICAgIGlmIChmaWVsZEtleSA9PT0gbmFtZSB8fCAhZmllbGQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWVsZC5hdHRyaWJ1dGVEZXBlbmRlbmNpZXMgJiYgZmllbGQuYXR0cmlidXRlRGVwZW5kZW5jaWVzLmxlbmd0aCAmJiB0aGlzLmlzRGVwZW5kZW5jeUF0dHJpYnV0ZShmaWVsZC5hdHRyaWJ1dGVEZXBlbmRlbmNpZXMpKSB7XG4gICAgICAgICAgICBkZXBlbmRlbnRGaWVsZHMucHVzaChmaWVsZEtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVLZXlzID0gKGZpZWxkLmF0dHJpYnV0ZXMgJiYgT2JqZWN0LmtleXMoZmllbGQuYXR0cmlidXRlcykpIHx8IFtdO1xuXG4gICAgICAgIGF0dHJpYnV0ZUtleXMuZm9yRWFjaChhdHRyaWJ1dGVLZXkgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSBmaWVsZC5hdHRyaWJ1dGVzW2F0dHJpYnV0ZUtleV07XG4gICAgICAgICAgICBpZiAoIWF0dHJpYnV0ZSB8fCAhYXR0cmlidXRlLmF0dHJpYnV0ZURlcGVuZGVuY2llcyB8fCAhYXR0cmlidXRlLmF0dHJpYnV0ZURlcGVuZGVuY2llcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzRGVwZW5kZW5jeUF0dHJpYnV0ZShhdHRyaWJ1dGUuYXR0cmlidXRlRGVwZW5kZW5jaWVzKSkge1xuICAgICAgICAgICAgICAgIGRlcGVuZGVudEF0dHJpYnV0ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkOiBmaWVsZEtleSxcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlOiBhdHRyaWJ1dGVLZXlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgYXR0cmlidXRlIGlzIGRlcGVuZGVuY3lcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gYXR0cmlidXRlRGVwZW5kZW5jaWVzXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGlzRGVwZW5kZW5jeUF0dHJpYnV0ZShhdHRyaWJ1dGVEZXBlbmRlbmNpZXM6IEF0dHJpYnV0ZURlcGVuZGVuY3lbXSk6IGJvb2xlYW4ge1xuXG4gICAgICAgIGNvbnN0IHBhcmVudEtleSA9IHRoaXMuZmllbGQucGFyZW50S2V5IHx8ICcnO1xuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5maWVsZC5uYW1lIHx8IHRoaXMuZmllbGQuZGVmaW5pdGlvbi5uYW1lIHx8ICcnO1xuXG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVEZXBlbmRlbmNpZXMuc29tZShkZXBlbmRlbmN5ID0+IHBhcmVudEtleSA9PT0gZGVwZW5kZW5jeS5maWVsZCAmJiBuYW1lID09PSBkZXBlbmRlbmN5LmF0dHJpYnV0ZSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHN1YnNjcmliZVZhbHVlQ2hhbmdlcygpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZmllbGQgJiYgdGhpcy5maWVsZC5mb3JtQ29udHJvbCkge1xuICAgICAgICAgICAgdGhpcy5zdWJzLnB1c2godGhpcy5maWVsZC5mb3JtQ29udHJvbC52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKHZhbHVlID0+IHtcblxuICAgICAgICAgICAgICAgIGlmICghaXNWb2lkKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGVGb3JtYXR0ZXIgJiYgdGhpcy5maWVsZC50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy50eXBlRm9ybWF0dGVyLnRvSW50ZXJuYWxGb3JtYXQodGhpcy5maWVsZC50eXBlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRGaWVsZFZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXRGaWVsZFZhbHVlKG5ld1ZhbHVlKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZmllbGQudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdW5zdWJzY3JpYmVBbGwoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3Vicy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgfVxufVxuIl19