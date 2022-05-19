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
import { Component } from '@angular/core';
import { BaseFieldComponent } from './base-field.component';
import { DataTypeFormatter } from '../../services/formatters/data-type.formatter.service';
import { StandardFieldRegistry } from '../standard-field.registry';
import { RecordManager } from '../../services/record/record.manager';
import { emptyObject } from 'common';
import set from 'lodash-es/set';
import { FieldLogicManager } from '../field-logic/field-logic.manager';
export class BaseComposite extends BaseFieldComponent {
    constructor(typeFormatter, registry, recordManager, logic) {
        super(typeFormatter, logic);
        this.typeFormatter = typeFormatter;
        this.registry = registry;
        this.recordManager = recordManager;
        this.logic = logic;
    }
    ngOnInit() {
        super.ngOnInit();
        this.initUpdateParentSubscription();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    getComponentType(type, definition) {
        let module = (this.record && this.record.module) || 'default';
        const displayType = (definition && definition.displayType) || '';
        return this.registry.getDisplayType(module, type, displayType, this.getMode());
    }
    /**
     * Get the attribute fields from the field
     *
     * @returns {object} Field[]
     */
    getAttributes() {
        const fields = [];
        this.field.definition.layout.forEach(name => {
            if (!this.field.attributes[name] || this.field.attributes[name].display === 'none') {
                return;
            }
            fields.push(this.field.attributes[name]);
        });
        return fields;
    }
    getModule() {
        if (!this.record) {
            return null;
        }
        return this.record.module;
    }
    getMode() {
        if (this.mode === 'filter') {
            return 'edit';
        }
        return this.mode;
    }
    /**
     * Get flex direction to be used
     *
     * @returns {string} direction
     */
    getDirection() {
        let direction = 'flex-column';
        if (this.field.definition.display === 'inline') {
            direction = 'flex-row';
        }
        return direction;
    }
    /**
     * Check if is configured
     *
     * @returns {boolean} is configured
     */
    isConfigured() {
        return this.hasDisplay() && this.hasLayout() && this.hasAttributes();
    }
    /**
     * Show label
     * @param attribute
     */
    showLabel(attribute) {
        const definition = attribute.definition || null;
        const showLabel = definition.showLabel || null;
        const labelDisplay = (attribute.metadata && attribute.metadata.labelDisplay) || '';
        if (!definition || !showLabel || labelDisplay === 'hide') {
            return false;
        }
        return (showLabel.includes('*') || showLabel.includes(this.mode));
    }
    /**
     * Check if groupFields are configured
     *
     * @returns {boolean} has groupFields
     */
    hasAttributes() {
        return !!(this.field.definition.attributeFields && !emptyObject(this.field.definition.attributeFields));
    }
    /**
     * Check if layout is configured
     *
     * @returns {boolean} has layout
     */
    hasLayout() {
        return !!(this.field.definition.layout && this.field.definition.layout.length);
    }
    /**
     * Check if display is configured
     *
     * @returns {boolean} has display
     */
    hasDisplay() {
        return !!this.field.definition.display;
    }
    /**
     * Init Update parent subscription
     */
    initUpdateParentSubscription() {
        if (!this.field.attributes) {
            return;
        }
        Object.keys(this.field.attributes).forEach(attributeKey => {
            const attribute = this.field.attributes[attributeKey];
            if (!attribute.valueChanges$) {
                return;
            }
            this.subs.push(attribute.valueChanges$.subscribe(value => {
                const val = value.valueObject || value.valueList || value.value;
                this.setValueOnParent(attribute, val);
            }));
        });
    }
    /**
     * Set attribute value on parent
     *
     * @param {object} attribute
     * @param {} value
     */
    setValueOnParent(attribute, value) {
        var _a;
        const valueParent = (_a = attribute.valueParent) !== null && _a !== void 0 ? _a : 'field';
        const parent = valueParent === 'record' ? this.record : this.field;
        if (attribute.valuePath) {
            set(parent, attribute.valuePath, value);
            return;
        }
        if (valueParent === 'record') {
            set(this.record.attributes, attribute.name, value);
        }
        else {
            set(this.field.valueObject, attribute.name, value);
        }
    }
}
BaseComposite.decorators = [
    { type: Component, args: [{ template: '' },] }
];
BaseComposite.ctorParameters = () => [
    { type: DataTypeFormatter },
    { type: StandardFieldRegistry },
    { type: RecordManager },
    { type: FieldLogicManager }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1jb21wb3NpdGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2ZpZWxkcy9iYXNlL2Jhc2UtY29tcG9zaXRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBb0IsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDMUQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sdURBQXVELENBQUM7QUFDeEYsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDakUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQ25FLE9BQU8sRUFBQyxXQUFXLEVBQXlDLE1BQU0sUUFBUSxDQUFDO0FBQzNFLE9BQU8sR0FBRyxNQUFNLGVBQWUsQ0FBQztBQUNoQyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUdyRSxNQUFNLE9BQU8sYUFBYyxTQUFRLGtCQUFrQjtJQUVqRCxZQUNjLGFBQWdDLEVBQ2hDLFFBQStCLEVBQy9CLGFBQTRCLEVBQzVCLEtBQXdCO1FBRWxDLEtBQUssQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFMbEIsa0JBQWEsR0FBYixhQUFhLENBQW1CO1FBQ2hDLGFBQVEsR0FBUixRQUFRLENBQXVCO1FBQy9CLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLFVBQUssR0FBTCxLQUFLLENBQW1CO0lBR3RDLENBQUM7SUFFRCxRQUFRO1FBQ0osS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxXQUFXO1FBQ1As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UixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLGdCQUFnQixDQUFDLFNBQXlCLEVBQUUsS0FBVTs7UUFDNUQsTUFBTSxXQUFXLEdBQUcsTUFBQSxTQUFTLENBQUMsV0FBVyxtQ0FBSSxPQUFPLENBQUM7UUFDckQsTUFBTSxNQUFNLEdBQUcsV0FBVyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUVuRSxJQUFJLFNBQVMsQ0FBQyxTQUFTLEVBQUU7WUFDckIsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3hDLE9BQU87U0FDVjtRQUVELElBQUksV0FBVyxLQUFLLFFBQVEsRUFBRTtZQUMxQixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN0RDthQUFNO1lBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDdEQ7SUFDTCxDQUFDOzs7WUE1S0osU0FBUyxTQUFDLEVBQUMsUUFBUSxFQUFFLEVBQUUsRUFBQzs7O1lBUGpCLGlCQUFpQjtZQUNqQixxQkFBcUI7WUFDckIsYUFBYTtZQUdiLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIE9uRGVzdHJveSwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmFzZUZpZWxkQ29tcG9uZW50fSBmcm9tICcuL2Jhc2UtZmllbGQuY29tcG9uZW50JztcbmltcG9ydCB7RGF0YVR5cGVGb3JtYXR0ZXJ9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Zvcm1hdHRlcnMvZGF0YS10eXBlLmZvcm1hdHRlci5zZXJ2aWNlJztcbmltcG9ydCB7U3RhbmRhcmRGaWVsZFJlZ2lzdHJ5fSBmcm9tICcuLi9zdGFuZGFyZC1maWVsZC5yZWdpc3RyeSc7XG5pbXBvcnQge1JlY29yZE1hbmFnZXJ9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3JlY29yZC9yZWNvcmQubWFuYWdlcic7XG5pbXBvcnQge2VtcHR5T2JqZWN0LCBGaWVsZCwgRmllbGRBdHRyaWJ1dGUsIEZpZWxkRGVmaW5pdGlvbn0gZnJvbSAnY29tbW9uJztcbmltcG9ydCBzZXQgZnJvbSAnbG9kYXNoLWVzL3NldCc7XG5pbXBvcnQge0ZpZWxkTG9naWNNYW5hZ2VyfSBmcm9tICcuLi9maWVsZC1sb2dpYy9maWVsZC1sb2dpYy5tYW5hZ2VyJztcblxuQENvbXBvbmVudCh7dGVtcGxhdGU6ICcnfSlcbmV4cG9ydCBjbGFzcyBCYXNlQ29tcG9zaXRlIGV4dGVuZHMgQmFzZUZpZWxkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCB0eXBlRm9ybWF0dGVyOiBEYXRhVHlwZUZvcm1hdHRlcixcbiAgICAgICAgcHJvdGVjdGVkIHJlZ2lzdHJ5OiBTdGFuZGFyZEZpZWxkUmVnaXN0cnksXG4gICAgICAgIHByb3RlY3RlZCByZWNvcmRNYW5hZ2VyOiBSZWNvcmRNYW5hZ2VyLFxuICAgICAgICBwcm90ZWN0ZWQgbG9naWM6IEZpZWxkTG9naWNNYW5hZ2VyXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKHR5cGVGb3JtYXR0ZXIsIGxvZ2ljKTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIubmdPbkluaXQoKTtcbiAgICAgICAgdGhpcy5pbml0VXBkYXRlUGFyZW50U3Vic2NyaXB0aW9uKCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3Vicy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgfVxuXG4gICAgZ2V0Q29tcG9uZW50VHlwZSh0eXBlOiBzdHJpbmcsIGRlZmluaXRpb246IEZpZWxkRGVmaW5pdGlvbik6IGFueSB7XG4gICAgICAgIGxldCBtb2R1bGUgPSAodGhpcy5yZWNvcmQgJiYgdGhpcy5yZWNvcmQubW9kdWxlKSB8fCAnZGVmYXVsdCc7XG5cbiAgICAgICAgY29uc3QgZGlzcGxheVR5cGUgPSAoZGVmaW5pdGlvbiAmJiBkZWZpbml0aW9uLmRpc3BsYXlUeXBlKSB8fCAnJztcblxuICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RyeS5nZXREaXNwbGF5VHlwZShtb2R1bGUsIHR5cGUsIGRpc3BsYXlUeXBlLCB0aGlzLmdldE1vZGUoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBhdHRyaWJ1dGUgZmllbGRzIGZyb20gdGhlIGZpZWxkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBGaWVsZFtdXG4gICAgICovXG4gICAgZ2V0QXR0cmlidXRlcygpOiBGaWVsZFtdIHtcbiAgICAgICAgY29uc3QgZmllbGRzOiBGaWVsZFtdID0gW107XG5cbiAgICAgICAgdGhpcy5maWVsZC5kZWZpbml0aW9uLmxheW91dC5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmZpZWxkLmF0dHJpYnV0ZXNbbmFtZV0gfHwgdGhpcy5maWVsZC5hdHRyaWJ1dGVzW25hbWVdLmRpc3BsYXkgPT09ICdub25lJykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKHRoaXMuZmllbGQuYXR0cmlidXRlc1tuYW1lXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgfVxuXG4gICAgZ2V0TW9kdWxlKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVjb3JkLm1vZHVsZTtcbiAgICB9XG5cbiAgICBnZXRNb2RlKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLm1vZGUgPT09ICdmaWx0ZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2VkaXQnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgZmxleCBkaXJlY3Rpb24gdG8gYmUgdXNlZFxuICAgICAqXG4gICAgICogQHJldHVybnMge3N0cmluZ30gZGlyZWN0aW9uXG4gICAgICovXG4gICAgZ2V0RGlyZWN0aW9uKCk6IHN0cmluZyB7XG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSAnZmxleC1jb2x1bW4nO1xuXG4gICAgICAgIGlmICh0aGlzLmZpZWxkLmRlZmluaXRpb24uZGlzcGxheSA9PT0gJ2lubGluZScpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9ICdmbGV4LXJvdyc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGlyZWN0aW9uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGlzIGNvbmZpZ3VyZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBpcyBjb25maWd1cmVkXG4gICAgICovXG4gICAgaXNDb25maWd1cmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNEaXNwbGF5KCkgJiYgdGhpcy5oYXNMYXlvdXQoKSAmJiB0aGlzLmhhc0F0dHJpYnV0ZXMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IGxhYmVsXG4gICAgICogQHBhcmFtIGF0dHJpYnV0ZVxuICAgICAqL1xuICAgIHNob3dMYWJlbChhdHRyaWJ1dGU6IEZpZWxkQXR0cmlidXRlKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGRlZmluaXRpb24gPSBhdHRyaWJ1dGUuZGVmaW5pdGlvbiB8fCBudWxsO1xuICAgICAgICBjb25zdCBzaG93TGFiZWwgPSBkZWZpbml0aW9uLnNob3dMYWJlbCB8fCBudWxsO1xuICAgICAgICBjb25zdCBsYWJlbERpc3BsYXkgPSAoYXR0cmlidXRlLm1ldGFkYXRhICYmIGF0dHJpYnV0ZS5tZXRhZGF0YS5sYWJlbERpc3BsYXkpIHx8ICcnO1xuXG4gICAgICAgIGlmICghZGVmaW5pdGlvbiB8fCAhc2hvd0xhYmVsIHx8IGxhYmVsRGlzcGxheSA9PT0gJ2hpZGUnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKHNob3dMYWJlbC5pbmNsdWRlcygnKicpIHx8IHNob3dMYWJlbC5pbmNsdWRlcyh0aGlzLm1vZGUpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBncm91cEZpZWxkcyBhcmUgY29uZmlndXJlZFxuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IGhhcyBncm91cEZpZWxkc1xuICAgICAqL1xuICAgIHByb3RlY3RlZCBoYXNBdHRyaWJ1dGVzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISEodGhpcy5maWVsZC5kZWZpbml0aW9uLmF0dHJpYnV0ZUZpZWxkcyAmJiAhZW1wdHlPYmplY3QodGhpcy5maWVsZC5kZWZpbml0aW9uLmF0dHJpYnV0ZUZpZWxkcykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGxheW91dCBpcyBjb25maWd1cmVkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gaGFzIGxheW91dFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBoYXNMYXlvdXQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhISh0aGlzLmZpZWxkLmRlZmluaXRpb24ubGF5b3V0ICYmIHRoaXMuZmllbGQuZGVmaW5pdGlvbi5sYXlvdXQubGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBkaXNwbGF5IGlzIGNvbmZpZ3VyZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBoYXMgZGlzcGxheVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBoYXNEaXNwbGF5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLmZpZWxkLmRlZmluaXRpb24uZGlzcGxheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0IFVwZGF0ZSBwYXJlbnQgc3Vic2NyaXB0aW9uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGluaXRVcGRhdGVQYXJlbnRTdWJzY3JpcHRpb24oKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5maWVsZC5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmZpZWxkLmF0dHJpYnV0ZXMpLmZvckVhY2goYXR0cmlidXRlS2V5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IHRoaXMuZmllbGQuYXR0cmlidXRlc1thdHRyaWJ1dGVLZXldO1xuXG4gICAgICAgICAgICBpZiAoIWF0dHJpYnV0ZS52YWx1ZUNoYW5nZXMkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnN1YnMucHVzaChhdHRyaWJ1dGUudmFsdWVDaGFuZ2VzJC5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbCA9IHZhbHVlLnZhbHVlT2JqZWN0IHx8IHZhbHVlLnZhbHVlTGlzdCB8fCB2YWx1ZS52YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZhbHVlT25QYXJlbnQoYXR0cmlidXRlLCB2YWwpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgYXR0cmlidXRlIHZhbHVlIG9uIHBhcmVudFxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGF0dHJpYnV0ZVxuICAgICAqIEBwYXJhbSB7fSB2YWx1ZVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBzZXRWYWx1ZU9uUGFyZW50KGF0dHJpYnV0ZTogRmllbGRBdHRyaWJ1dGUsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdmFsdWVQYXJlbnQgPSBhdHRyaWJ1dGUudmFsdWVQYXJlbnQgPz8gJ2ZpZWxkJztcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdmFsdWVQYXJlbnQgPT09ICdyZWNvcmQnID8gdGhpcy5yZWNvcmQgOiB0aGlzLmZpZWxkO1xuXG4gICAgICAgIGlmIChhdHRyaWJ1dGUudmFsdWVQYXRoKSB7XG4gICAgICAgICAgICBzZXQocGFyZW50LCBhdHRyaWJ1dGUudmFsdWVQYXRoLCB2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWVQYXJlbnQgPT09ICdyZWNvcmQnKSB7XG4gICAgICAgICAgICBzZXQodGhpcy5yZWNvcmQuYXR0cmlidXRlcywgYXR0cmlidXRlLm5hbWUsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldCh0aGlzLmZpZWxkLnZhbHVlT2JqZWN0LCBhdHRyaWJ1dGUubmFtZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19