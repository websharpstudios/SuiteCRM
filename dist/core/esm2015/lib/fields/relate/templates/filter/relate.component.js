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
import { deepClone } from 'common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModuleNameMapper } from '../../../../services/navigation/module-name-mapper/module-name-mapper.service';
import { DataTypeFormatter } from '../../../../services/formatters/data-type.formatter.service';
import { RecordListModalComponent } from '../../../../containers/record-list-modal/components/record-list-modal/record-list-modal.component';
import { BaseRelateComponent } from '../../../base/base-relate.component';
import { LanguageStore } from '../../../../store/language/language.store';
import { RelateService } from '../../../../services/record/relate/relate.service';
import { FieldLogicManager } from '../../../field-logic/field-logic.manager';
import { EMPTY, of } from 'rxjs';
export class RelateFilterFieldComponent extends BaseRelateComponent {
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
        const filter = this.record;
        this.field.valueList = [];
        this.field.valueObjectArray = [];
        const values = (this.field && this.field.criteria && this.field.criteria.values) || [];
        if (values.length > 0) {
            this.field.valueList = values;
            this.selectedTags = values;
        }
        const valueObjectArray = (this.field && this.field.criteria && this.field.criteria.valueObjectArray) || [];
        if (valueObjectArray.length > 0) {
            this.field.valueObjectArray = deepClone(valueObjectArray);
            this.selectedTags = deepClone(valueObjectArray);
        }
        super.ngOnInit();
        const idFieldName = this.getRelateIdField();
        if (idFieldName && filter && filter.criteriaFields && filter.criteriaFields[idFieldName]) {
            this.idField = filter.criteriaFields[idFieldName];
            this.idField.valueList = [];
            const idValues = (this.idField && this.idField.criteria && this.idField.criteria.values) || [];
            if (idValues.length > 0) {
                this.idField.valueList = deepClone(idValues);
            }
        }
    }
    /**
     * Handle newly added item
     *
     * @param {object} item added
     */
    onAdd(item) {
        if (item) {
            this.setValue(item);
            return;
        }
    }
    onAdding(item) {
        if (!item) {
            return EMPTY;
        }
        if (this.idField && this.idField.valueList.includes(item.id)) {
            return EMPTY;
        }
        const relateName = this.getRelateFieldName();
        if (!this.idField && this.field.valueList.includes(item[relateName])) {
            return EMPTY;
        }
        return of(item);
    }
    /**
     * Handle item removal
     */
    onRemove(item) {
        var _a, _b;
        const id = (_a = item.id) !== null && _a !== void 0 ? _a : '';
        const value = (_b = item.name) !== null && _b !== void 0 ? _b : '';
        this.field.valueList = this.field.valueList.filter(element => element !== value);
        this.field.valueObjectArray = this.field.valueObjectArray.filter(element => element.id !== id);
        this.updateSearchCriteria(this.field);
        this.field.criteria.valueObjectArray = deepClone(this.field.valueObjectArray);
        if (this.idField && id) {
            this.idField.valueList = this.idField.valueList.filter(element => element !== id);
            this.updateSearchCriteria(this.idField);
        }
        setTimeout(() => {
            this.tag.focus(true, true);
        }, 200);
    }
    selectFirstElement() {
        const filteredElements = this.tag.dropdown.items;
        if (filteredElements.length !== 0) {
            const firstElement = filteredElements[0];
            this.tag.appendTag(firstElement);
            this.onAdd(firstElement);
            this.tag.dropdown.hide();
        }
    }
    /**
     * Set value on field
     *
     * @param item: any
     */
    setValue(item) {
        const relateName = this.getRelateFieldName();
        const id = item.id;
        const relateValue = item[relateName];
        if (this.idField && this.idField.valueList.includes(id)) {
            return;
        }
        if (!this.idField && this.field.valueList.includes(relateValue)) {
            return;
        }
        const valueObject = {};
        valueObject.id = id;
        valueObject[relateName] = relateValue;
        this.field.valueObjectArray.push(valueObject);
        this.field.valueList.push(relateValue);
        if (this.idField) {
            this.idField.valueList.push(id);
            this.updateSearchCriteria(this.idField);
        }
        this.updateSearchCriteria(this.field);
        if (!this.field.criteria.valueObjectArray) {
            this.field.criteria.valueObjectArray = [];
        }
        this.field.criteria.valueObjectArray.push(valueObject);
    }
    /**
     * Set value on field criteria and form
     */
    updateSearchCriteria(field) {
        field.criteria.operator = '=';
        field.criteria.values = field.valueList;
        field.formControl.setValue(field.valueList);
        field.formControl.markAsDirty();
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
            const found = this.field.valueObjectArray.find(element => element.id === record.id);
            if (found) {
                return;
            }
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
        this.tag.appendTag(record.attributes);
        this.onAdd(record.attributes);
    }
}
RelateFilterFieldComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-relate-filter',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<div class=\"d-flex\">\n    <div class=\"flex-grow-1\">\n        <tag-input #tag\n                   (keyup.enter)=\"selectFirstElement()\"\n                   (onAdd)=\"onAdd($event)\"\n                   (onBlur)=\"resetStatus()\"\n                   (onRemove)=\"onRemove($event)\"\n                   [(ngModel)]=\"selectedTags\"\n                   [class]=\"getInvalidClass()\"\n                   [clearOnBlur]=\"true\"\n                   [identifyBy]=\"'id'\"\n                   [displayBy]=\"getRelateFieldName()\"\n                   [inputClass]=\"getInvalidClass()\"\n                   [onTextChangeDebounce]=\"500\"\n                   [onlyFromAutocomplete]=\"true\"\n                   [placeholder]=\"getPlaceholderLabel()\"\n                   [secondaryPlaceholder]=\"getPlaceholderLabel()\">\n            <tag-input-dropdown [autocompleteObservable]=\"search\"\n                                [identifyBy]=\"'id'\"\n                                [displayBy]=\"getRelateFieldName()\"\n                                [keepOpen]=\"false\"\n                                [showDropdownIfEmpty]=\"true\">\n            </tag-input-dropdown>\n        </tag-input>\n    </div>\n   <div class=\"relate-btn\">\n        <scrm-button [config]=\"selectButton\">\n        </scrm-button>\n    </div>\n</div>\n<small *ngIf=\"getMessage()\" class=\"text-danger form-text text-muted\">\n    <scrm-label [labelKey]=\"getMessage()\" [module]=\"module\"></scrm-label>\n</small>\n",
                providers: [RelateService]
            },] }
];
RelateFilterFieldComponent.ctorParameters = () => [
    { type: LanguageStore },
    { type: DataTypeFormatter },
    { type: RelateService },
    { type: ModuleNameMapper },
    { type: NgbModal },
    { type: FieldLogicManager }
];
RelateFilterFieldComponent.propDecorators = {
    tag: [{ type: ViewChild, args: ['tag',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsYXRlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9maWVsZHMvcmVsYXRlL3RlbXBsYXRlcy9maWx0ZXIvcmVsYXRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQzVDLE9BQU8sRUFBaUMsU0FBUyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQ2pFLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSwrRUFBK0UsQ0FBQztBQUMvRyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw2REFBNkQsQ0FBQztBQUM5RixPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxtR0FBbUcsQ0FBQztBQUMzSSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUN4RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFDeEUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1EQUFtRCxDQUFDO0FBR2hGLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDBDQUEwQyxDQUFDO0FBRTNFLE9BQU8sRUFBQyxLQUFLLEVBQWMsRUFBRSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBUTNDLE1BQU0sT0FBTywwQkFBMkIsU0FBUSxtQkFBbUI7SUFNL0Q7Ozs7Ozs7OztPQVNHO0lBQ0gsWUFDYyxTQUF3QixFQUN4QixhQUFnQyxFQUNoQyxhQUE0QixFQUM1QixnQkFBa0MsRUFDbEMsWUFBc0IsRUFDdEIsS0FBd0I7UUFF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MkI7UUFDbkQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNqRCxFQUFFLEdBQUcsUUFBUSxDQUFDO1lBQ2QsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLE1BQU0sR0FBVyxJQUFJLENBQUM7UUFFMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDcEIsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3RCLE1BQU0sR0FBRyxHQUFHLENBQUM7Z0JBQ2IsT0FBTyxJQUFJLENBQUM7YUFDZjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyxPQUFPLENBQUMsTUFBYztRQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7O1lBalFKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QiwwekZBQXNDO2dCQUV0QyxTQUFTLEVBQUUsQ0FBQyxhQUFhLENBQUM7YUFDN0I7OztZQWJPLGFBQWE7WUFIYixpQkFBaUI7WUFJakIsYUFBYTtZQUxiLGdCQUFnQjtZQURoQixRQUFRO1lBU1IsaUJBQWlCOzs7a0JBV3BCLFNBQVMsU0FBQyxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgVmlld0NoaWxkfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VGFnSW5wdXRDb21wb25lbnR9IGZyb20gJ25neC1jaGlwcyc7XG5pbXBvcnQge0J1dHRvbkludGVyZmFjZSwgRmllbGQsIFJlY29yZCwgZGVlcENsb25lfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtOZ2JNb2RhbH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHtNb2R1bGVOYW1lTWFwcGVyfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uL21vZHVsZS1uYW1lLW1hcHBlci9tb2R1bGUtbmFtZS1tYXBwZXIuc2VydmljZSc7XG5pbXBvcnQge0RhdGFUeXBlRm9ybWF0dGVyfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9mb3JtYXR0ZXJzL2RhdGEtdHlwZS5mb3JtYXR0ZXIuc2VydmljZSc7XG5pbXBvcnQge1JlY29yZExpc3RNb2RhbENvbXBvbmVudH0gZnJvbSAnLi4vLi4vLi4vLi4vY29udGFpbmVycy9yZWNvcmQtbGlzdC1tb2RhbC9jb21wb25lbnRzL3JlY29yZC1saXN0LW1vZGFsL3JlY29yZC1saXN0LW1vZGFsLmNvbXBvbmVudCc7XG5pbXBvcnQge0Jhc2VSZWxhdGVDb21wb25lbnR9IGZyb20gJy4uLy4uLy4uL2Jhc2UvYmFzZS1yZWxhdGUuY29tcG9uZW50JztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtSZWxhdGVTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9yZWNvcmQvcmVsYXRlL3JlbGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7UmVjb3JkTGlzdE1vZGFsUmVzdWx0fSBmcm9tICcuLi8uLi8uLi8uLi9jb250YWluZXJzL3JlY29yZC1saXN0LW1vZGFsL2NvbXBvbmVudHMvcmVjb3JkLWxpc3QtbW9kYWwvcmVjb3JkLWxpc3QtbW9kYWwubW9kZWwnO1xuaW1wb3J0IHtUYWdNb2RlbH0gZnJvbSAnbmd4LWNoaXBzL2NvcmUvYWNjZXNzb3InO1xuaW1wb3J0IHtGaWVsZExvZ2ljTWFuYWdlcn0gZnJvbSAnLi4vLi4vLi4vZmllbGQtbG9naWMvZmllbGQtbG9naWMubWFuYWdlcic7XG5pbXBvcnQge1NhdmVkRmlsdGVyfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9zYXZlZC1maWx0ZXJzL3NhdmVkLWZpbHRlci5tb2RlbCc7XG5pbXBvcnQge0VNUFRZLCBPYnNlcnZhYmxlLCBvZn0gZnJvbSAncnhqcyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1yZWxhdGUtZmlsdGVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vcmVsYXRlLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFtdLFxuICAgIHByb3ZpZGVyczogW1JlbGF0ZVNlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIFJlbGF0ZUZpbHRlckZpZWxkQ29tcG9uZW50IGV4dGVuZHMgQmFzZVJlbGF0ZUNvbXBvbmVudCB7XG4gICAgQFZpZXdDaGlsZCgndGFnJykgdGFnOiBUYWdJbnB1dENvbXBvbmVudDtcbiAgICBzZWxlY3RCdXR0b246IEJ1dHRvbkludGVyZmFjZTtcbiAgICBzZWxlY3RlZFRhZ3M6IHN0cmluZ1tdIHwgVGFnTW9kZWxbXTtcbiAgICBpZEZpZWxkOiBGaWVsZDtcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbGFuZ3VhZ2VzIHNlcnZpY2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdHlwZUZvcm1hdHRlciBzZXJ2aWNlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlbGF0ZVNlcnZpY2Ugc2VydmljZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBtb2R1bGVOYW1lTWFwcGVyIHNlcnZpY2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbW9kYWxTZXJ2aWNlIHNlcnZpY2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbG9naWNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlczogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIHR5cGVGb3JtYXR0ZXI6IERhdGFUeXBlRm9ybWF0dGVyLFxuICAgICAgICBwcm90ZWN0ZWQgcmVsYXRlU2VydmljZTogUmVsYXRlU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIG1vZHVsZU5hbWVNYXBwZXI6IE1vZHVsZU5hbWVNYXBwZXIsXG4gICAgICAgIHByb3RlY3RlZCBtb2RhbFNlcnZpY2U6IE5nYk1vZGFsLFxuICAgICAgICBwcm90ZWN0ZWQgbG9naWM6IEZpZWxkTG9naWNNYW5hZ2VyXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGxhbmd1YWdlcywgdHlwZUZvcm1hdHRlciwgcmVsYXRlU2VydmljZSwgbW9kdWxlTmFtZU1hcHBlciwgbG9naWMpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0QnV0dG9uID0ge1xuICAgICAgICAgICAga2xhc3M6IFsnYnRuJywgJ2J0bi1zbScsICdidG4tb3V0bGluZS1zZWNvbmRhcnknLCAnc2VsZWN0LWJ1dHRvbicsICdtLTAnXSxcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dTZWxlY3RNb2RhbCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGljb246ICdjdXJzb3InXG4gICAgICAgIH0gYXMgQnV0dG9uSW50ZXJmYWNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uIGluaXQgaGFuZGxlclxuICAgICAqL1xuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSB0aGlzLnJlY29yZCBhcyBTYXZlZEZpbHRlcjtcblxuICAgICAgICB0aGlzLmZpZWxkLnZhbHVlTGlzdCA9IFtdO1xuXG4gICAgICAgIHRoaXMuZmllbGQudmFsdWVPYmplY3RBcnJheSA9IFtdO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9ICh0aGlzLmZpZWxkICYmIHRoaXMuZmllbGQuY3JpdGVyaWEgJiYgdGhpcy5maWVsZC5jcml0ZXJpYS52YWx1ZXMpIHx8IFtdO1xuXG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5maWVsZC52YWx1ZUxpc3QgPSB2YWx1ZXM7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkVGFncyA9IHZhbHVlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHZhbHVlT2JqZWN0QXJyYXkgPSAodGhpcy5maWVsZCAmJiB0aGlzLmZpZWxkLmNyaXRlcmlhICYmIHRoaXMuZmllbGQuY3JpdGVyaWEudmFsdWVPYmplY3RBcnJheSkgfHwgW107XG5cbiAgICAgICAgaWYgKHZhbHVlT2JqZWN0QXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5maWVsZC52YWx1ZU9iamVjdEFycmF5ID0gZGVlcENsb25lKHZhbHVlT2JqZWN0QXJyYXkpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFRhZ3MgPSBkZWVwQ2xvbmUodmFsdWVPYmplY3RBcnJheSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdXBlci5uZ09uSW5pdCgpO1xuXG4gICAgICAgIGNvbnN0IGlkRmllbGROYW1lID0gdGhpcy5nZXRSZWxhdGVJZEZpZWxkKCk7XG5cbiAgICAgICAgaWYgKGlkRmllbGROYW1lICYmIGZpbHRlciAmJiBmaWx0ZXIuY3JpdGVyaWFGaWVsZHMgJiYgZmlsdGVyLmNyaXRlcmlhRmllbGRzW2lkRmllbGROYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5pZEZpZWxkID0gZmlsdGVyLmNyaXRlcmlhRmllbGRzW2lkRmllbGROYW1lXTtcbiAgICAgICAgICAgIHRoaXMuaWRGaWVsZC52YWx1ZUxpc3QgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGlkVmFsdWVzID0gKHRoaXMuaWRGaWVsZCAmJiB0aGlzLmlkRmllbGQuY3JpdGVyaWEgJiYgdGhpcy5pZEZpZWxkLmNyaXRlcmlhLnZhbHVlcykgfHwgW107XG5cbiAgICAgICAgICAgIGlmIChpZFZhbHVlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pZEZpZWxkLnZhbHVlTGlzdCA9IGRlZXBDbG9uZShpZFZhbHVlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgbmV3bHkgYWRkZWQgaXRlbVxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGl0ZW0gYWRkZWRcbiAgICAgKi9cbiAgICBvbkFkZChpdGVtKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKGl0ZW0pIHtcblxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShpdGVtKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQWRkaW5nKGl0ZW0pOiBPYnNlcnZhYmxlPFRhZ01vZGVsPiB7XG5cbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gRU1QVFk7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLmlkRmllbGQgJiYgdGhpcy5pZEZpZWxkLnZhbHVlTGlzdC5pbmNsdWRlcyhpdGVtLmlkKSl7XG4gICAgICAgICAgICByZXR1cm4gRU1QVFk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZWxhdGVOYW1lID0gdGhpcy5nZXRSZWxhdGVGaWVsZE5hbWUoKTtcblxuICAgICAgICBpZighdGhpcy5pZEZpZWxkICYmIHRoaXMuZmllbGQudmFsdWVMaXN0LmluY2x1ZGVzKGl0ZW1bcmVsYXRlTmFtZV0pKXtcbiAgICAgICAgICAgIHJldHVybiBFTVBUWTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvZihpdGVtKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgaXRlbSByZW1vdmFsXG4gICAgICovXG4gICAgb25SZW1vdmUoaXRlbSk6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IGlkID0gaXRlbS5pZCA/PyAnJztcbiAgICAgICAgY29uc3QgdmFsdWUgPSBpdGVtLm5hbWUgPz8gJyc7XG4gICAgICAgIHRoaXMuZmllbGQudmFsdWVMaXN0ID0gdGhpcy5maWVsZC52YWx1ZUxpc3QuZmlsdGVyKGVsZW1lbnQgPT4gZWxlbWVudCAhPT0gdmFsdWUpO1xuXG4gICAgICAgIHRoaXMuZmllbGQudmFsdWVPYmplY3RBcnJheSA9IHRoaXMuZmllbGQudmFsdWVPYmplY3RBcnJheS5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50LmlkICE9PSBpZCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTZWFyY2hDcml0ZXJpYSh0aGlzLmZpZWxkKTtcblxuICAgICAgICB0aGlzLmZpZWxkLmNyaXRlcmlhLnZhbHVlT2JqZWN0QXJyYXkgPSBkZWVwQ2xvbmUodGhpcy5maWVsZC52YWx1ZU9iamVjdEFycmF5KTtcblxuICAgICAgICBpZih0aGlzLmlkRmllbGQgJiYgaWQpe1xuICAgICAgICAgICAgdGhpcy5pZEZpZWxkLnZhbHVlTGlzdCA9IHRoaXMuaWRGaWVsZC52YWx1ZUxpc3QuZmlsdGVyKGVsZW1lbnQgPT4gZWxlbWVudCAhPT0gaWQpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTZWFyY2hDcml0ZXJpYSh0aGlzLmlkRmllbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRhZy5mb2N1cyh0cnVlLCB0cnVlKTtcbiAgICAgICAgfSwgMjAwKTtcbiAgICB9XG5cbiAgICBzZWxlY3RGaXJzdEVsZW1lbnQoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkRWxlbWVudHM6IFRhZ01vZGVsID0gdGhpcy50YWcuZHJvcGRvd24uaXRlbXM7XG4gICAgICAgIGlmIChmaWx0ZXJlZEVsZW1lbnRzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgY29uc3QgZmlyc3RFbGVtZW50ID0gZmlsdGVyZWRFbGVtZW50c1swXTtcbiAgICAgICAgICAgIHRoaXMudGFnLmFwcGVuZFRhZyhmaXJzdEVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5vbkFkZChmaXJzdEVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy50YWcuZHJvcGRvd24uaGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHZhbHVlIG9uIGZpZWxkXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaXRlbTogYW55XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNldFZhbHVlKGl0ZW06IGFueSk6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IHJlbGF0ZU5hbWUgPSB0aGlzLmdldFJlbGF0ZUZpZWxkTmFtZSgpO1xuICAgICAgICBjb25zdCBpZCA9IGl0ZW0uaWQ7XG4gICAgICAgIGNvbnN0IHJlbGF0ZVZhbHVlID0gaXRlbVtyZWxhdGVOYW1lXTtcblxuICAgICAgICBpZih0aGlzLmlkRmllbGQgJiYgdGhpcy5pZEZpZWxkLnZhbHVlTGlzdC5pbmNsdWRlcyhpZCkpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIXRoaXMuaWRGaWVsZCAmJiB0aGlzLmZpZWxkLnZhbHVlTGlzdC5pbmNsdWRlcyhyZWxhdGVWYWx1ZSkpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdmFsdWVPYmplY3QgPSB7fSBhcyBhbnk7XG4gICAgICAgIHZhbHVlT2JqZWN0LmlkID0gaWQ7XG4gICAgICAgIHZhbHVlT2JqZWN0W3JlbGF0ZU5hbWVdID0gcmVsYXRlVmFsdWU7XG5cbiAgICAgICAgdGhpcy5maWVsZC52YWx1ZU9iamVjdEFycmF5LnB1c2godmFsdWVPYmplY3QpO1xuICAgICAgICB0aGlzLmZpZWxkLnZhbHVlTGlzdC5wdXNoKHJlbGF0ZVZhbHVlKTtcblxuICAgICAgICBpZiAodGhpcy5pZEZpZWxkKXtcbiAgICAgICAgICAgIHRoaXMuaWRGaWVsZC52YWx1ZUxpc3QucHVzaChpZCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNlYXJjaENyaXRlcmlhKHRoaXMuaWRGaWVsZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZVNlYXJjaENyaXRlcmlhKHRoaXMuZmllbGQpO1xuXG4gICAgICAgIGlmKCF0aGlzLmZpZWxkLmNyaXRlcmlhLnZhbHVlT2JqZWN0QXJyYXkpe1xuICAgICAgICAgICAgdGhpcy5maWVsZC5jcml0ZXJpYS52YWx1ZU9iamVjdEFycmF5ID0gW107XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZpZWxkLmNyaXRlcmlhLnZhbHVlT2JqZWN0QXJyYXkucHVzaCh2YWx1ZU9iamVjdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHZhbHVlIG9uIGZpZWxkIGNyaXRlcmlhIGFuZCBmb3JtXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVNlYXJjaENyaXRlcmlhKGZpZWxkOiBGaWVsZCk6IHZvaWQge1xuICAgICAgICBmaWVsZC5jcml0ZXJpYS5vcGVyYXRvciA9ICc9JztcbiAgICAgICAgZmllbGQuY3JpdGVyaWEudmFsdWVzID0gZmllbGQudmFsdWVMaXN0O1xuICAgICAgICBmaWVsZC5mb3JtQ29udHJvbC5zZXRWYWx1ZShmaWVsZC52YWx1ZUxpc3QpO1xuICAgICAgICBmaWVsZC5mb3JtQ29udHJvbC5tYXJrQXNEaXJ0eSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3cgcmVjb3JkIHNlbGVjdGlvbiBtb2RhbFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBzaG93U2VsZWN0TW9kYWwoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG1vZGFsID0gdGhpcy5tb2RhbFNlcnZpY2Uub3BlbihSZWNvcmRMaXN0TW9kYWxDb21wb25lbnQsIHtzaXplOiAneGwnLCBzY3JvbGxhYmxlOiB0cnVlfSk7XG5cbiAgICAgICAgbW9kYWwuY29tcG9uZW50SW5zdGFuY2UubW9kdWxlID0gdGhpcy5nZXRSZWxhdGVkTW9kdWxlKCk7XG5cbiAgICAgICAgbW9kYWwucmVzdWx0LnRoZW4oKGRhdGE6IFJlY29yZExpc3RNb2RhbFJlc3VsdCkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIWRhdGEgfHwgIWRhdGEuc2VsZWN0aW9uIHx8ICFkYXRhLnNlbGVjdGlvbi5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXRTZWxlY3RlZFJlY29yZChkYXRhKTtcblxuICAgICAgICAgICAgY29uc3QgZm91bmQgPSB0aGlzLmZpZWxkLnZhbHVlT2JqZWN0QXJyYXkuZmluZChlbGVtZW50ID0+IGVsZW1lbnQuaWQgPT09IHJlY29yZC5pZCk7XG5cbiAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZXRJdGVtKHJlY29yZCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBTZWxlY3RlZCBSZWNvcmRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIFJlY29yZExpc3RNb2RhbFJlc3VsdFxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IFJlY29yZFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXRTZWxlY3RlZFJlY29yZChkYXRhOiBSZWNvcmRMaXN0TW9kYWxSZXN1bHQpOiBSZWNvcmQge1xuICAgICAgICBsZXQgaWQgPSAnJztcbiAgICAgICAgT2JqZWN0LmtleXMoZGF0YS5zZWxlY3Rpb24uc2VsZWN0ZWQpLnNvbWUoc2VsZWN0ZWQgPT4ge1xuICAgICAgICAgICAgaWQgPSBzZWxlY3RlZDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgcmVjb3JkOiBSZWNvcmQgPSBudWxsO1xuXG4gICAgICAgIGRhdGEucmVjb3Jkcy5zb21lKHJlYyA9PiB7XG4gICAgICAgICAgICBpZiAocmVjICYmIHJlYy5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZWNvcmQgPSByZWM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSByZWNvcmQgYXMgdGhlIHNlbGVjdGVkIGl0ZW1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWNvcmQgdG8gc2V0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNldEl0ZW0ocmVjb3JkOiBSZWNvcmQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50YWcuYXBwZW5kVGFnKHJlY29yZC5hdHRyaWJ1dGVzKTtcbiAgICAgICAgdGhpcy5vbkFkZChyZWNvcmQuYXR0cmlidXRlcyk7XG4gICAgfVxuXG59XG4iXX0=