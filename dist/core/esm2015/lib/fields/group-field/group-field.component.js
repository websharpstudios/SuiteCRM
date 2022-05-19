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
import { BaseFieldComponent } from '../base/base-field.component';
import { FieldLogicManager } from '../field-logic/field-logic.manager';
import { DataTypeFormatter } from '../../services/formatters/data-type.formatter.service';
import { StandardFieldRegistry } from '../standard-field.registry';
export class GroupFieldComponent extends BaseFieldComponent {
    constructor(typeFormatter, registry, logic) {
        super(typeFormatter, logic);
        this.typeFormatter = typeFormatter;
        this.registry = registry;
        this.logic = logic;
    }
    getComponentType(type, definition) {
        let module = (this.record && this.record.module) || 'default';
        const displayType = (definition && definition.displayType) || '';
        return this.registry.getDisplayType(module, type, displayType, this.mode);
    }
    /**
     * Get the group fields from the record
     *
     * @returns {object} Field[]
     */
    getFields() {
        const fields = [];
        this.field.definition.layout.forEach(name => {
            if (!this.record.fields[name] || this.record.fields[name].display === 'none') {
                return;
            }
            fields.push(this.record.fields[name]);
        });
        return fields;
    }
    getModule() {
        if (!this.record) {
            return null;
        }
        return this.record.module;
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
        return this.hasDisplay() && this.hasLayout() && this.hasGroupFields();
    }
    showLabel(fieldName) {
        const definition = this.field.definition || null;
        const showLabel = definition.showLabel || null;
        if (!definition || !showLabel) {
            return false;
        }
        const showLabelOptions = definition.showLabel[this.mode] || null;
        // showLabel > viewMode not defined || defined without any values e.g. edit:
        if (!showLabelOptions || typeof (showLabelOptions) === 'undefined') {
            return false;
        }
        return (showLabelOptions.includes('*') || showLabelOptions.includes(fieldName));
    }
    isModeEnabled(mode, groupField) {
        const modes = groupField.definition.modes;
        if (!modes || modes.length < 1) {
            return true;
        }
        return modes.includes(mode);
    }
    /**
     * Check if groupFields are configured
     *
     * @returns {boolean} has groupFields
     */
    hasGroupFields() {
        return !!(this.field.definition.groupFields && Object.keys(this.field.definition.groupFields).length);
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
}
GroupFieldComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-group-field',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container *ngIf=\"!isConfigured()\">\n    <scrm-label labelKey=\"LBL_BAD_GROUP_FIELD_CONFIG\"></scrm-label>\n</ng-container>\n\n<ng-container *ngIf=\"isConfigured()\">\n    <div class=\"d-flex {{getDirection()}} justify-content-start align-items-start field-group h-100\">\n\n        <ng-container *ngFor=\"let groupField of getFields()\">\n\n            <div *ngIf=\"isModeEnabled(mode, groupField)\"\n                 [class.flex-fill]=\"mode ==='edit' && getDirection() === 'flex-row'\"\n                 class=\"field-group-item d-flex flex-column justify-content-end h-100 w-100\">\n\n                <!-- LABEL -->\n                <span *ngIf=\"groupField.labelKey && showLabel(groupField.definition.name)\"\n                      class=\"field-group-label pt-2 pr-1\">\n                    <label>\n                        <scrm-label [labelKey]=\"groupField.labelKey\" [module]=\"getModule()\"></scrm-label>\n                    </label>\n                </span>\n\n                <!-- VALUE -->\n                <span *ngIf=\"groupField.type\" class=\"field-group-field pr-1\">\n\n                    <scrm-dynamic-field [componentType]=\"getComponentType(groupField.type, groupField.definition)\"\n                                        [field]=\"groupField\"\n                                        [klass]=\"klass\"\n                                        [mode]=\"mode\"\n                                        [record]=\"record\"\n                                        [parent]=\"parent\"\n                                        [type]=\"groupField.type\">\n                    </scrm-dynamic-field>\n\n                </span>\n            </div>\n        </ng-container>\n\n    </div>\n</ng-container>\n\n\n"
            },] }
];
GroupFieldComponent.ctorParameters = () => [
    { type: DataTypeFormatter },
    { type: StandardFieldRegistry },
    { type: FieldLogicManager }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAtZmllbGQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2ZpZWxkcy9ncm91cC1maWVsZC9ncm91cC1maWVsZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFeEMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDaEUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDckUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sdURBQXVELENBQUM7QUFDeEYsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFPakUsTUFBTSxPQUFPLG1CQUFvQixTQUFRLGtCQUFrQjtJQUV2RCxZQUFzQixhQUFnQyxFQUFZLFFBQStCLEVBQVksS0FBd0I7UUFDakksS0FBSyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQURWLGtCQUFhLEdBQWIsYUFBYSxDQUFtQjtRQUFZLGFBQVEsR0FBUixRQUFRLENBQXVCO1FBQVksVUFBSyxHQUFMLEtBQUssQ0FBbUI7SUFFckksQ0FBQztJQUVELGdCQUFnQixDQUFDLElBQVksRUFBRSxVQUEyQjtRQUN0RCxJQUFJLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUM7UUFFOUQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVqRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUs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QUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNPLFVBQVU7UUFDaEIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO0lBQzNDLENBQUM7OztZQTFISixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsb2pHQUEyQzthQUU5Qzs7O1lBUE8saUJBQWlCO1lBQ2pCLHFCQUFxQjtZQUZyQixpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RmllbGQsIEZpZWxkRGVmaW5pdGlvbiwgVmlld01vZGV9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge0Jhc2VGaWVsZENvbXBvbmVudH0gZnJvbSAnLi4vYmFzZS9iYXNlLWZpZWxkLmNvbXBvbmVudCc7XG5pbXBvcnQge0ZpZWxkTG9naWNNYW5hZ2VyfSBmcm9tICcuLi9maWVsZC1sb2dpYy9maWVsZC1sb2dpYy5tYW5hZ2VyJztcbmltcG9ydCB7RGF0YVR5cGVGb3JtYXR0ZXJ9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Zvcm1hdHRlcnMvZGF0YS10eXBlLmZvcm1hdHRlci5zZXJ2aWNlJztcbmltcG9ydCB7U3RhbmRhcmRGaWVsZFJlZ2lzdHJ5fSBmcm9tICcuLi9zdGFuZGFyZC1maWVsZC5yZWdpc3RyeSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1ncm91cC1maWVsZCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2dyb3VwLWZpZWxkLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIEdyb3VwRmllbGRDb21wb25lbnQgZXh0ZW5kcyBCYXNlRmllbGRDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHR5cGVGb3JtYXR0ZXI6IERhdGFUeXBlRm9ybWF0dGVyLCBwcm90ZWN0ZWQgcmVnaXN0cnk6IFN0YW5kYXJkRmllbGRSZWdpc3RyeSwgcHJvdGVjdGVkIGxvZ2ljOiBGaWVsZExvZ2ljTWFuYWdlcikge1xuICAgICAgICBzdXBlcih0eXBlRm9ybWF0dGVyLCBsb2dpYyk7XG4gICAgfVxuXG4gICAgZ2V0Q29tcG9uZW50VHlwZSh0eXBlOiBzdHJpbmcsIGRlZmluaXRpb246IEZpZWxkRGVmaW5pdGlvbik6IGFueSB7XG4gICAgICAgIGxldCBtb2R1bGUgPSAodGhpcy5yZWNvcmQgJiYgdGhpcy5yZWNvcmQubW9kdWxlKSB8fCAnZGVmYXVsdCc7XG5cbiAgICAgICAgY29uc3QgZGlzcGxheVR5cGUgPSAoZGVmaW5pdGlvbiAmJiBkZWZpbml0aW9uLmRpc3BsYXlUeXBlKSB8fCAnJztcblxuICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RyeS5nZXREaXNwbGF5VHlwZShtb2R1bGUsIHR5cGUsIGRpc3BsYXlUeXBlLCB0aGlzLm1vZGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgZ3JvdXAgZmllbGRzIGZyb20gdGhlIHJlY29yZFxuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gRmllbGRbXVxuICAgICAqL1xuICAgIGdldEZpZWxkcygpOiBGaWVsZFtdIHtcbiAgICAgICAgY29uc3QgZmllbGRzOiBGaWVsZFtdID0gW107XG5cbiAgICAgICAgdGhpcy5maWVsZC5kZWZpbml0aW9uLmxheW91dC5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnJlY29yZC5maWVsZHNbbmFtZV0gfHwgdGhpcy5yZWNvcmQuZmllbGRzW25hbWVdLmRpc3BsYXkgPT09ICdub25lJyl7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaWVsZHMucHVzaCh0aGlzLnJlY29yZC5maWVsZHNbbmFtZV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgIH1cblxuICAgIGdldE1vZHVsZSgpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlY29yZC5tb2R1bGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGZsZXggZGlyZWN0aW9uIHRvIGJlIHVzZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGRpcmVjdGlvblxuICAgICAqL1xuICAgIGdldERpcmVjdGlvbigpOiBzdHJpbmcge1xuICAgICAgICBsZXQgZGlyZWN0aW9uID0gJ2ZsZXgtY29sdW1uJztcblxuICAgICAgICBpZiAodGhpcy5maWVsZC5kZWZpbml0aW9uLmRpc3BsYXkgPT09ICdpbmxpbmUnKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSAnZmxleC1yb3cnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRpcmVjdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBpcyBjb25maWd1cmVkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gaXMgY29uZmlndXJlZFxuICAgICAqL1xuICAgIGlzQ29uZmlndXJlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzRGlzcGxheSgpICYmIHRoaXMuaGFzTGF5b3V0KCkgJiYgdGhpcy5oYXNHcm91cEZpZWxkcygpO1xuICAgIH1cblxuICAgIHNob3dMYWJlbChmaWVsZE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBkZWZpbml0aW9uID0gdGhpcy5maWVsZC5kZWZpbml0aW9uIHx8IG51bGw7XG4gICAgICAgIGNvbnN0IHNob3dMYWJlbCA9IGRlZmluaXRpb24uc2hvd0xhYmVsIHx8IG51bGw7XG5cbiAgICAgICAgaWYgKCFkZWZpbml0aW9uIHx8ICFzaG93TGFiZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNob3dMYWJlbE9wdGlvbnMgPSBkZWZpbml0aW9uLnNob3dMYWJlbFt0aGlzLm1vZGVdIHx8IG51bGw7XG5cbiAgICAgICAgLy8gc2hvd0xhYmVsID4gdmlld01vZGUgbm90IGRlZmluZWQgfHwgZGVmaW5lZCB3aXRob3V0IGFueSB2YWx1ZXMgZS5nLiBlZGl0OlxuICAgICAgICBpZiAoIXNob3dMYWJlbE9wdGlvbnMgfHwgdHlwZW9mIChzaG93TGFiZWxPcHRpb25zKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoc2hvd0xhYmVsT3B0aW9ucy5pbmNsdWRlcygnKicpIHx8IHNob3dMYWJlbE9wdGlvbnMuaW5jbHVkZXMoZmllbGROYW1lKSk7XG4gICAgfVxuXG4gICAgaXNNb2RlRW5hYmxlZChtb2RlOiBzdHJpbmcsIGdyb3VwRmllbGQ6IEZpZWxkKSB7XG4gICAgICAgIGNvbnN0IG1vZGVzID0gZ3JvdXBGaWVsZC5kZWZpbml0aW9uLm1vZGVzO1xuICAgICAgICBpZiAoIW1vZGVzIHx8IG1vZGVzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1vZGVzLmluY2x1ZGVzKG1vZGUgYXMgVmlld01vZGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGdyb3VwRmllbGRzIGFyZSBjb25maWd1cmVkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gaGFzIGdyb3VwRmllbGRzXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGhhc0dyb3VwRmllbGRzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISEodGhpcy5maWVsZC5kZWZpbml0aW9uLmdyb3VwRmllbGRzICYmIE9iamVjdC5rZXlzKHRoaXMuZmllbGQuZGVmaW5pdGlvbi5ncm91cEZpZWxkcykubGVuZ3RoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBsYXlvdXQgaXMgY29uZmlndXJlZFxuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IGhhcyBsYXlvdXRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaGFzTGF5b3V0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISEodGhpcy5maWVsZC5kZWZpbml0aW9uLmxheW91dCAmJiB0aGlzLmZpZWxkLmRlZmluaXRpb24ubGF5b3V0Lmxlbmd0aCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgZGlzcGxheSBpcyBjb25maWd1cmVkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gaGFzIGRpc3BsYXlcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaGFzRGlzcGxheSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5maWVsZC5kZWZpbml0aW9uLmRpc3BsYXk7XG4gICAgfVxufVxuIl19