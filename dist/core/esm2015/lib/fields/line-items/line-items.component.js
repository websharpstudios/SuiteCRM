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
import { DataTypeFormatter } from '../../services/formatters/data-type.formatter.service';
import { RecordManager } from '../../services/record/record.manager';
import { FieldLogicManager } from '../field-logic/field-logic.manager';
import { BaseLineItemsComponent } from '../base/base-line-items.component';
import { FieldManager } from '../../services/record/field/field.manager';
import { FieldRegistry } from '../field.registry';
export class LineItemsComponent extends BaseLineItemsComponent {
    constructor(typeFormatter, registry, recordManager, logic, fieldManager) {
        super(typeFormatter, registry, recordManager, logic, fieldManager);
        this.typeFormatter = typeFormatter;
        this.registry = registry;
        this.recordManager = recordManager;
        this.logic = logic;
        this.fieldManager = fieldManager;
    }
    /**
     * Add item button config
     * @returns {object} ButtonInterface
     */
    getAddItemButton() {
        return {
            klass: 'btn btn-sm btn-outline-secondary m-0 border-0',
            icon: 'plus',
            onClick: () => {
                this.addEmptyItem();
            },
        };
    }
    /**
     * Remove item button config
     * @param {object} item
     * @param {number} index
     * @returns {object} ButtonInterface
     */
    getRemoveItemButton(item, index) {
        return {
            klass: 'btn btn-sm btn-outline-secondary m-0 border-0',
            icon: 'minimise',
            onClick: () => {
                this.removeItem(index);
            },
        };
    }
}
LineItemsComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-line-items-field',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container *ngIf=\"!isConfigured()\">\n    <scrm-label labelKey=\"LBL_LINE_ITEMS_FIELD_CONFIG\"></scrm-label>\n</ng-container>\n\n<ng-container *ngIf=\"isConfigured()\">\n    <div class=\"line-items d-flex flex-column {{field.type}} {{field.name}}\">\n\n        <div class=\"d-flex {{getDirection()}} justify-content-start align-items-end line-item h-100\">\n            <ng-container *ngFor=\"let item of getItems(); index as i\">\n                <div *ngIf=\"!(item && item.attributes && item.attributes.deleted)\"\n                     class=\"d-flex flex-row line-item-entry w-100 align-items-end\">\n\n                    <div class=\"flex-grow-1 line-item-entry-composite\">\n                        <div *ngFor=\"let itemField of getItemFields(item)\"\n                             class=\"{{itemField.type}} {{itemField.name}}\">\n                            <scrm-dynamic-field [componentType]=\"getComponentType(itemField.type, itemField.definition)\"\n                                                [field]=\"itemField\"\n                                                [klass]=\"klass\"\n                                                [mode]=\"mode\"\n                                                [record]=\"item\"\n                                                [parent]=\"parent\"\n                                                [type]=\"itemField.type\">\n                            </scrm-dynamic-field>\n                        </div>\n                    </div>\n\n                    <div class=\"line-item-entry-buttons mb-1\">\n                        <scrm-button *ngIf=\"isEditable()\" [config]=\"getRemoveItemButton(item, i)\">\n                        </scrm-button>\n                    </div>\n                </div>\n            </ng-container>\n\n\n        </div>\n        <div class=\"line-item-buttons d-flex justify-content-end mt-1\">\n            <scrm-button *ngIf=\"isEditable()\" [config]=\"getAddItemButton()\">\n            </scrm-button>\n        </div>\n\n        <ng-container *ngIf=\"isEditable() && field.itemFormArray && field.itemFormArray.errors\">\n            <ng-container *ngIf=\"field.itemFormArray.invalid\">\n                <div *ngFor=\"let item of field.itemFormArray.errors | keyvalue\" class=\"invalid-feedback d-block\">\n                    <scrm-dynamic-label [context]=\"getMessageContext(item.value, record)\"\n                                        [fields]=\"{field: field}\"\n                                        [labelKey]=\"getMessageLabelKey(item.value)\">\n                    </scrm-dynamic-label>\n                </div>\n            </ng-container>\n        </ng-container>\n    </div>\n</ng-container>\n"
            },] }
];
LineItemsComponent.ctorParameters = () => [
    { type: DataTypeFormatter },
    { type: FieldRegistry },
    { type: RecordManager },
    { type: FieldLogicManager },
    { type: FieldManager }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS1pdGVtcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvZmllbGRzL2xpbmUtaXRlbXMvbGluZS1pdGVtcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sdURBQXVELENBQUM7QUFDeEYsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQ25FLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ3JFLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBRXpFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSwyQ0FBMkMsQ0FBQztBQUN2RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFPaEQsTUFBTSxPQUFPLGtCQUFtQixTQUFRLHNCQUFzQjtJQUUxRCxZQUNjLGFBQWdDLEVBQ2hDLFFBQXVCLEVBQ3ZCLGFBQTRCLEVBQzVCLEtBQXdCLEVBQ3hCLFlBQTBCO1FBRXBDLEtBQUssQ0FBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFOekQsa0JBQWEsR0FBYixhQUFhLENBQW1CO1FBQ2hDLGFBQVEsR0FBUixRQUFRLENBQWU7UUFDdkIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUFDeEIsaUJBQVksR0FBWixZQUFZLENBQWM7SUFHeEMsQ0FBQztJQUVEOzs7T0FHRztJQUNILGdCQUFnQjtRQUNaLE9BQU87WUFDSCxLQUFLLEVBQUUsK0NBQStDO1lBQ3RELElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEdBQVMsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3hCLENBQUM7U0FFSixDQUFDO0lBQ04sQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsbUJBQW1CLENBQUMsSUFBZSxFQUFFLEtBQWE7UUFDOUMsT0FBTztZQUNILEtBQUssRUFBRSwrQ0FBK0M7WUFDdEQsSUFBSSxFQUFFLFVBQVU7WUFDaEIsT0FBTyxFQUFFLEdBQVMsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQixDQUFDO1NBQ0osQ0FBQztJQUNOLENBQUM7OztZQTlDSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLHVCQUF1QjtnQkFDakMsbS9IQUEwQzthQUU3Qzs7O1lBWk8saUJBQWlCO1lBTWpCLGFBQWE7WUFMYixhQUFhO1lBQ2IsaUJBQWlCO1lBR2pCLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RGF0YVR5cGVGb3JtYXR0ZXJ9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Zvcm1hdHRlcnMvZGF0YS10eXBlLmZvcm1hdHRlci5zZXJ2aWNlJztcbmltcG9ydCB7UmVjb3JkTWFuYWdlcn0gZnJvbSAnLi4vLi4vc2VydmljZXMvcmVjb3JkL3JlY29yZC5tYW5hZ2VyJztcbmltcG9ydCB7RmllbGRMb2dpY01hbmFnZXJ9IGZyb20gJy4uL2ZpZWxkLWxvZ2ljL2ZpZWxkLWxvZ2ljLm1hbmFnZXInO1xuaW1wb3J0IHtCYXNlTGluZUl0ZW1zQ29tcG9uZW50fSBmcm9tICcuLi9iYXNlL2Jhc2UtbGluZS1pdGVtcy5jb21wb25lbnQnO1xuaW1wb3J0IHtCdXR0b25JbnRlcmZhY2UsIE9iamVjdE1hcH0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7RmllbGRNYW5hZ2VyfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZWNvcmQvZmllbGQvZmllbGQubWFuYWdlcic7XG5pbXBvcnQge0ZpZWxkUmVnaXN0cnl9IGZyb20gJy4uL2ZpZWxkLnJlZ2lzdHJ5JztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLWxpbmUtaXRlbXMtZmllbGQnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9saW5lLWl0ZW1zLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIExpbmVJdGVtc0NvbXBvbmVudCBleHRlbmRzIEJhc2VMaW5lSXRlbXNDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCB0eXBlRm9ybWF0dGVyOiBEYXRhVHlwZUZvcm1hdHRlcixcbiAgICAgICAgcHJvdGVjdGVkIHJlZ2lzdHJ5OiBGaWVsZFJlZ2lzdHJ5LFxuICAgICAgICBwcm90ZWN0ZWQgcmVjb3JkTWFuYWdlcjogUmVjb3JkTWFuYWdlcixcbiAgICAgICAgcHJvdGVjdGVkIGxvZ2ljOiBGaWVsZExvZ2ljTWFuYWdlcixcbiAgICAgICAgcHJvdGVjdGVkIGZpZWxkTWFuYWdlcjogRmllbGRNYW5hZ2VyLFxuICAgICkge1xuICAgICAgICBzdXBlcih0eXBlRm9ybWF0dGVyLCByZWdpc3RyeSwgcmVjb3JkTWFuYWdlciwgbG9naWMsIGZpZWxkTWFuYWdlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGl0ZW0gYnV0dG9uIGNvbmZpZ1xuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IEJ1dHRvbkludGVyZmFjZVxuICAgICAqL1xuICAgIGdldEFkZEl0ZW1CdXR0b24oKTogQnV0dG9uSW50ZXJmYWNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtsYXNzOiAnYnRuIGJ0bi1zbSBidG4tb3V0bGluZS1zZWNvbmRhcnkgbS0wIGJvcmRlci0wJyxcbiAgICAgICAgICAgIGljb246ICdwbHVzJyxcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEVtcHR5SXRlbSgpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBpdGVtIGJ1dHRvbiBjb25maWdcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gaXRlbVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IEJ1dHRvbkludGVyZmFjZVxuICAgICAqL1xuICAgIGdldFJlbW92ZUl0ZW1CdXR0b24oaXRlbTogT2JqZWN0TWFwLCBpbmRleDogbnVtYmVyKTogQnV0dG9uSW50ZXJmYWNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtsYXNzOiAnYnRuIGJ0bi1zbSBidG4tb3V0bGluZS1zZWNvbmRhcnkgbS0wIGJvcmRlci0wJyxcbiAgICAgICAgICAgIGljb246ICdtaW5pbWlzZScsXG4gICAgICAgICAgICBvbkNsaWNrOiAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVJdGVtKGluZGV4KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfVxuXG59XG4iXX0=