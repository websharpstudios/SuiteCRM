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
import { Component, ViewChild } from '@angular/core';
import { TagInputComponent } from 'ngx-chips';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModuleNameMapper } from '../../../../services/navigation/module-name-mapper/module-name-mapper.service';
import { DataTypeFormatter } from '../../../../services/formatters/data-type.formatter.service';
import { RecordListModalComponent } from '../../../../containers/record-list-modal/components/record-list-modal/record-list-modal.component';
import { BaseRelateComponent } from '../../../base/base-relate.component';
import { LanguageStore } from '../../../../store/language/language.store';
import { RelateService } from '../../../../services/record/relate/relate.service';
import { FieldLogicManager } from '../../../field-logic/field-logic.manager';
export class RelateEditFieldComponent extends BaseRelateComponent {
    /**
     * Constructor
     *
     * @param {object} languages service
     * @param {object} typeFormatter service
     * @param {object} relateService service
     * @param {object} moduleNameMapper service
     * @param {object} modalService service
     * @param {object} logic
     */
    constructor(languages, typeFormatter, relateService, moduleNameMapper, modalService, logic) {
        super(languages, typeFormatter, relateService, moduleNameMapper, logic);
        this.languages = languages;
        this.typeFormatter = typeFormatter;
        this.relateService = relateService;
        this.moduleNameMapper = moduleNameMapper;
        this.modalService = modalService;
        this.logic = logic;
        this.selectButton = {
            klass: ['btn', 'btn-sm', 'btn-outline-secondary', 'select-button', 'm-0'],
            onClick: () => {
                this.showSelectModal();
            },
            icon: 'cursor'
        };
    }
    /**
     * On init handler
     */
    ngOnInit() {
        super.ngOnInit();
        this.init();
    }
    init() {
        super.init();
        this.initValue();
        const idFieldName = this.getRelateIdField();
        if (idFieldName && this.record && this.record.fields && this.record.fields[idFieldName]) {
            this.idField = this.record.fields[idFieldName];
        }
    }
    initValue() {
        if (!this.field.valueObject) {
            this.selectedValues = [];
            return;
        }
        if (!this.field.valueObject.id) {
            this.selectedValues = [];
            return;
        }
        this.selectedValues = [];
        this.selectedValues.push(this.field.valueObject);
    }
    /**
     * Handle newly added item
     *
     * @param {object} item added
     */
    onAdd(item) {
        if (item) {
            const relateName = this.getRelateFieldName();
            this.setValue(item.id, item[relateName]);
            return;
        }
        this.setValue('', '');
        this.selectedValues = [];
        return;
    }
    /**
     * Handle item removal
     */
    onRemove() {
        this.setValue('', '');
        this.selectedValues = [];
        setTimeout(() => {
            this.tag.focus(true, true);
        }, 200);
    }
    /**
     * Set value on field
     *
     * @param {string} id to set
     * @param {string} relateValue to set
     */
    setValue(id, relateValue) {
        const relate = this.buildRelate(id, relateValue);
        this.field.value = relateValue;
        this.field.valueObject = relate;
        this.field.formControl.setValue(relateValue);
        this.field.formControl.markAsDirty();
        if (this.idField) {
            this.idField.value = id;
            this.idField.formControl.setValue(id);
            this.idField.formControl.markAsDirty();
        }
    }
    /**
     * Show record selection modal
     */
    showSelectModal() {
        const modal = this.modalService.open(RecordListModalComponent, { size: 'xl', scrollable: true });
        modal.componentInstance.module = this.getRelatedModule();
        modal.result.then((data) => {
            if (!data || !data.selection || !data.selection.selected) {
                return;
            }
            const record = this.getSelectedRecord(data);
            this.setItem(record);
        });
    }
    /**
     * Get Selected Record
     *
     * @param {object} data RecordListModalResult
     * @returns {object} Record
     */
    getSelectedRecord(data) {
        let id = '';
        Object.keys(data.selection.selected).some(selected => {
            id = selected;
            return true;
        });
        let record = null;
        data.records.some(rec => {
            if (rec && rec.id === id) {
                record = rec;
                return true;
            }
        });
        return record;
    }
    /**
     * Set the record as the selected item
     *
     * @param {object} record to set
     */
    setItem(record) {
        this.tag.writeValue([record.attributes]);
        this.onAdd(record.attributes);
    }
    selectFirstElement() {
        const filteredElements = this.tag.dropdown.items;
        if (filteredElements.length !== 0) {
            const firstElement = filteredElements[0];
            this.selectedValues.push(firstElement);
            this.onAdd(firstElement);
            this.tag.dropdown.hide();
        }
    }
}
RelateEditFieldComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-relate-edit',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<div class=\"d-flex\">\n    <ng-container *ngIf=\"initModule\">\n        <div class=\"flex-grow-1\">\n            <tag-input #tag\n                       (keyup.enter)=\"selectFirstElement()\"\n                       (onAdd)=\"onAdd($event)\"\n                       (onBlur)=\"resetStatus()\"\n                       (onRemove)=\"onRemove()\"\n                       [(ngModel)]=\"selectedValues\"\n                       [class]=\"getInvalidClass()\"\n                       [clearOnBlur]=\"true\"\n                       [displayBy]=\"getRelateFieldName()\"\n                       [inputClass]=\"getInvalidClass()\"\n                       [onTextChangeDebounce]=\"500\"\n                       [onlyFromAutocomplete]=\"true\"\n                       [placeholder]=\"getPlaceholderLabel()\"\n                       [secondaryPlaceholder]=\"getPlaceholderLabel()\"\n                       maxItems=\"1\">\n                <tag-input-dropdown [autocompleteObservable]=\"search\"\n                                    [displayBy]=\"getRelateFieldName()\"\n                                    [keepOpen]=\"false\"\n                                    [showDropdownIfEmpty]=\"true\">\n                </tag-input-dropdown>\n            </tag-input>\n        </div>\n        <div class=\"relate-btn\">\n            <scrm-button [config]=\"selectButton\">\n            </scrm-button>\n        </div>\n    </ng-container>\n</div>\n<small *ngIf=\"getMessage()\" class=\"text-danger form-text text-muted\">\n    <scrm-label [labelKey]=\"getMessage()\" [module]=\"module\"></scrm-label>\n</small>\n",
                providers: [RelateService]
            },] }
];
RelateEditFieldComponent.ctorParameters = () => [
    { type: LanguageStore },
    { type: DataTypeFormatter },
    { type: RelateService },
    { type: ModuleNameMapper },
    { type: NgbModal },
    { type: FieldLogicManager }
];
RelateEditFieldComponent.propDecorators = {
    tag: [{ type: ViewChild, args: ['tag',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsYXRlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9maWVsZHMvcmVsYXRlL3RlbXBsYXRlcy9lZGl0L3JlbGF0ZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUU1QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDcEQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sK0VBQStFLENBQUM7QUFDL0csT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sNkRBQTZELENBQUM7QUFDOUYsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sbUdBQW1HLENBQUM7QUFDM0ksT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBQ3hFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtREFBbUQsQ0FBQztBQUdoRixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwwQ0FBMEMsQ0FBQztBQVEzRSxNQUFNLE9BQU8sd0JBQXlCLFNBQVEsbUJBQW1CO0lBSzdEOzs7Ozs7Ozs7T0FTRztJQUNILFlBQ2MsU0FBd0IsRUFDeEIsYUFBZ0MsRUFDaEMsYUFBNEIsRUFDNUIsZ0JBQWtDLEVBQ2xDLFlBQXNCLEVBQ3RCLEtBQXdCO1FBRWxDLEtBQUssQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQztRQVA5RCxjQUFTLEdBQVQsU0FBUyxDQUFl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LFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsbTZGQUFzQztnQkFFdEMsU0FBUyxFQUFFLENBQUMsYUFBYSxDQUFDO2FBQzdCOzs7WUFYTyxhQUFhO1lBSGIsaUJBQWlCO1lBSWpCLGFBQWE7WUFMYixnQkFBZ0I7WUFEaEIsUUFBUTtZQVNSLGlCQUFpQjs7O2tCQVNwQixTQUFTLFNBQUMsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1RhZ0lucHV0Q29tcG9uZW50fSBmcm9tICduZ3gtY2hpcHMnO1xuaW1wb3J0IHtCdXR0b25JbnRlcmZhY2UsIEZpZWxkLCBSZWNvcmR9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge05nYk1vZGFsfSBmcm9tICdAbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcCc7XG5pbXBvcnQge01vZHVsZU5hbWVNYXBwZXJ9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24vbW9kdWxlLW5hbWUtbWFwcGVyL21vZHVsZS1uYW1lLW1hcHBlci5zZXJ2aWNlJztcbmltcG9ydCB7RGF0YVR5cGVGb3JtYXR0ZXJ9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL2Zvcm1hdHRlcnMvZGF0YS10eXBlLmZvcm1hdHRlci5zZXJ2aWNlJztcbmltcG9ydCB7UmVjb3JkTGlzdE1vZGFsQ29tcG9uZW50fSBmcm9tICcuLi8uLi8uLi8uLi9jb250YWluZXJzL3JlY29yZC1saXN0LW1vZGFsL2NvbXBvbmVudHMvcmVjb3JkLWxpc3QtbW9kYWwvcmVjb3JkLWxpc3QtbW9kYWwuY29tcG9uZW50JztcbmltcG9ydCB7QmFzZVJlbGF0ZUNvbXBvbmVudH0gZnJvbSAnLi4vLi4vLi4vYmFzZS9iYXNlLXJlbGF0ZS5jb21wb25lbnQnO1xuaW1wb3J0IHtMYW5ndWFnZVN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5pbXBvcnQge1JlbGF0ZVNlcnZpY2V9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL3JlY29yZC9yZWxhdGUvcmVsYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHtSZWNvcmRMaXN0TW9kYWxSZXN1bHR9IGZyb20gJy4uLy4uLy4uLy4uL2NvbnRhaW5lcnMvcmVjb3JkLWxpc3QtbW9kYWwvY29tcG9uZW50cy9yZWNvcmQtbGlzdC1tb2RhbC9yZWNvcmQtbGlzdC1tb2RhbC5tb2RlbCc7XG5pbXBvcnQge1RhZ01vZGVsfSBmcm9tIFwibmd4LWNoaXBzL2NvcmUvYWNjZXNzb3JcIjtcbmltcG9ydCB7RmllbGRMb2dpY01hbmFnZXJ9IGZyb20gJy4uLy4uLy4uL2ZpZWxkLWxvZ2ljL2ZpZWxkLWxvZ2ljLm1hbmFnZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tcmVsYXRlLWVkaXQnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9yZWxhdGUuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogW10sXG4gICAgcHJvdmlkZXJzOiBbUmVsYXRlU2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgUmVsYXRlRWRpdEZpZWxkQ29tcG9uZW50IGV4dGVuZHMgQmFzZVJlbGF0ZUNvbXBvbmVudCB7XG4gICAgQFZpZXdDaGlsZCgndGFnJykgdGFnOiBUYWdJbnB1dENvbXBvbmVudDtcbiAgICBzZWxlY3RCdXR0b246IEJ1dHRvbkludGVyZmFjZTtcbiAgICBpZEZpZWxkOiBGaWVsZDtcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbGFuZ3VhZ2VzIHNlcnZpY2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdHlwZUZvcm1hdHRlciBzZXJ2aWNlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlbGF0ZVNlcnZpY2Ugc2VydmljZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBtb2R1bGVOYW1lTWFwcGVyIHNlcnZpY2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbW9kYWxTZXJ2aWNlIHNlcnZpY2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbG9naWNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlczogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIHR5cGVGb3JtYXR0ZXI6IERhdGFUeXBlRm9ybWF0dGVyLFxuICAgICAgICBwcm90ZWN0ZWQgcmVsYXRlU2VydmljZTogUmVsYXRlU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIG1vZHVsZU5hbWVNYXBwZXI6IE1vZHVsZU5hbWVNYXBwZXIsXG4gICAgICAgIHByb3RlY3RlZCBtb2RhbFNlcnZpY2U6IE5nYk1vZGFsLFxuICAgICAgICBwcm90ZWN0ZWQgbG9naWM6IEZpZWxkTG9naWNNYW5hZ2VyXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGxhbmd1YWdlcywgdHlwZUZvcm1hdHRlciwgcmVsYXRlU2VydmljZSwgbW9kdWxlTmFtZU1hcHBlciwgbG9naWMpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0QnV0dG9uID0ge1xuICAgICAgICAgICAga2xhc3M6IFsnYnRuJywgJ2J0bi1zbScsICdidG4tb3V0bGluZS1zZWNvbmRhcnknLCAnc2VsZWN0LWJ1dHRvbicsICdtLTAnXSxcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dTZWxlY3RNb2RhbCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGljb246ICdjdXJzb3InXG4gICAgICAgIH0gYXMgQnV0dG9uSW50ZXJmYWNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uIGluaXQgaGFuZGxlclxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuXG4gICAgICAgIHN1cGVyLm5nT25Jbml0KCk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0KCk6IHZvaWQge1xuXG4gICAgICAgIHN1cGVyLmluaXQoKTtcblxuICAgICAgICB0aGlzLmluaXRWYWx1ZSgpO1xuXG4gICAgICAgIGNvbnN0IGlkRmllbGROYW1lID0gdGhpcy5nZXRSZWxhdGVJZEZpZWxkKCk7XG4gICAgICAgIGlmIChpZEZpZWxkTmFtZSAmJiB0aGlzLnJlY29yZCAmJiB0aGlzLnJlY29yZC5maWVsZHMgJiYgdGhpcy5yZWNvcmQuZmllbGRzW2lkRmllbGROYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5pZEZpZWxkID0gdGhpcy5yZWNvcmQuZmllbGRzW2lkRmllbGROYW1lXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0VmFsdWUoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5maWVsZC52YWx1ZU9iamVjdCkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmZpZWxkLnZhbHVlT2JqZWN0LmlkKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkVmFsdWVzID0gW107XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbGVjdGVkVmFsdWVzID0gW107XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRWYWx1ZXMucHVzaCh0aGlzLmZpZWxkLnZhbHVlT2JqZWN0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgbmV3bHkgYWRkZWQgaXRlbVxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGl0ZW0gYWRkZWRcbiAgICAgKi9cbiAgICBvbkFkZChpdGVtKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0ZU5hbWUgPSB0aGlzLmdldFJlbGF0ZUZpZWxkTmFtZSgpO1xuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShpdGVtLmlkLCBpdGVtW3JlbGF0ZU5hbWVdKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0VmFsdWUoJycsICcnKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFZhbHVlcyA9IFtdO1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgaXRlbSByZW1vdmFsXG4gICAgICovXG4gICAgb25SZW1vdmUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoJycsICcnKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFZhbHVlcyA9IFtdO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50YWcuZm9jdXModHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIH0sIDIwMCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHZhbHVlIG9uIGZpZWxkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgdG8gc2V0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0ZVZhbHVlIHRvIHNldFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBzZXRWYWx1ZShpZDogc3RyaW5nLCByZWxhdGVWYWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJlbGF0ZSA9IHRoaXMuYnVpbGRSZWxhdGUoaWQsIHJlbGF0ZVZhbHVlKTtcbiAgICAgICAgdGhpcy5maWVsZC52YWx1ZSA9IHJlbGF0ZVZhbHVlO1xuICAgICAgICB0aGlzLmZpZWxkLnZhbHVlT2JqZWN0ID0gcmVsYXRlO1xuICAgICAgICB0aGlzLmZpZWxkLmZvcm1Db250cm9sLnNldFZhbHVlKHJlbGF0ZVZhbHVlKTtcbiAgICAgICAgdGhpcy5maWVsZC5mb3JtQ29udHJvbC5tYXJrQXNEaXJ0eSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmlkRmllbGQpIHtcbiAgICAgICAgICAgIHRoaXMuaWRGaWVsZC52YWx1ZSA9IGlkO1xuICAgICAgICAgICAgdGhpcy5pZEZpZWxkLmZvcm1Db250cm9sLnNldFZhbHVlKGlkKTtcbiAgICAgICAgICAgIHRoaXMuaWRGaWVsZC5mb3JtQ29udHJvbC5tYXJrQXNEaXJ0eSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdyByZWNvcmQgc2VsZWN0aW9uIG1vZGFsXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNob3dTZWxlY3RNb2RhbCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbW9kYWwgPSB0aGlzLm1vZGFsU2VydmljZS5vcGVuKFJlY29yZExpc3RNb2RhbENvbXBvbmVudCwge3NpemU6ICd4bCcsIHNjcm9sbGFibGU6IHRydWV9KTtcblxuICAgICAgICBtb2RhbC5jb21wb25lbnRJbnN0YW5jZS5tb2R1bGUgPSB0aGlzLmdldFJlbGF0ZWRNb2R1bGUoKTtcblxuICAgICAgICBtb2RhbC5yZXN1bHQudGhlbigoZGF0YTogUmVjb3JkTGlzdE1vZGFsUmVzdWx0KSA9PiB7XG5cbiAgICAgICAgICAgIGlmICghZGF0YSB8fCAhZGF0YS5zZWxlY3Rpb24gfHwgIWRhdGEuc2VsZWN0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldFNlbGVjdGVkUmVjb3JkKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5zZXRJdGVtKHJlY29yZCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBTZWxlY3RlZCBSZWNvcmRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIFJlY29yZExpc3RNb2RhbFJlc3VsdFxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IFJlY29yZFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXRTZWxlY3RlZFJlY29yZChkYXRhOiBSZWNvcmRMaXN0TW9kYWxSZXN1bHQpOiBSZWNvcmQge1xuICAgICAgICBsZXQgaWQgPSAnJztcbiAgICAgICAgT2JqZWN0LmtleXMoZGF0YS5zZWxlY3Rpb24uc2VsZWN0ZWQpLnNvbWUoc2VsZWN0ZWQgPT4ge1xuICAgICAgICAgICAgaWQgPSBzZWxlY3RlZDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgcmVjb3JkOiBSZWNvcmQgPSBudWxsO1xuXG4gICAgICAgIGRhdGEucmVjb3Jkcy5zb21lKHJlYyA9PiB7XG4gICAgICAgICAgICBpZiAocmVjICYmIHJlYy5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZWNvcmQgPSByZWM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSByZWNvcmQgYXMgdGhlIHNlbGVjdGVkIGl0ZW1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWNvcmQgdG8gc2V0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNldEl0ZW0ocmVjb3JkOiBSZWNvcmQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50YWcud3JpdGVWYWx1ZShbcmVjb3JkLmF0dHJpYnV0ZXNdKTtcbiAgICAgICAgdGhpcy5vbkFkZChyZWNvcmQuYXR0cmlidXRlcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHNlbGVjdEZpcnN0RWxlbWVudCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZmlsdGVyZWRFbGVtZW50czogVGFnTW9kZWwgPSB0aGlzLnRhZy5kcm9wZG93bi5pdGVtcztcbiAgICAgICAgaWYgKGZpbHRlcmVkRWxlbWVudHMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBmaXJzdEVsZW1lbnQgPSBmaWx0ZXJlZEVsZW1lbnRzWzBdO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFZhbHVlcy5wdXNoKGZpcnN0RWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLm9uQWRkKGZpcnN0RWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLnRhZy5kcm9wZG93bi5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdfQ==