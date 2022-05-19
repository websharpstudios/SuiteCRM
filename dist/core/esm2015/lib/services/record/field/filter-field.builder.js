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
import { FieldBuilder } from './field.builder';
import { Injectable } from '@angular/core';
import { ValidationManager } from '../validation/validation.manager';
import { DataTypeFormatter } from '../../formatters/data-type.formatter.service';
import { deepClone } from 'common';
import * as i0 from "@angular/core";
import * as i1 from "../validation/validation.manager";
import * as i2 from "../../formatters/data-type.formatter.service";
export class FilterFieldBuilder extends FieldBuilder {
    constructor(validationManager, typeFormatter) {
        super(validationManager, typeFormatter);
        this.validationManager = validationManager;
        this.typeFormatter = typeFormatter;
    }
    /**
     * Build filter field
     *
     * @param {object} savedFilter SavedFilter
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @returns {object} Field
     */
    buildFilterField(savedFilter, viewField, language = null) {
        const definition = (viewField && viewField.fieldDefinition) || {};
        const { validators, asyncValidators } = this.getFilterValidators(savedFilter, viewField);
        const field = this.setupField(savedFilter.searchModule, viewField, null, null, null, savedFilter, definition, validators, asyncValidators, language);
        field.criteria = this.initFieldFilter(savedFilter.criteria, viewField, field);
        return field;
    }
    /**
     * Get Filter Validators for given field definition
     *
     * @param {object} record  Record
     * @param {object} viewField ViewFieldDefinition
     * @returns {object} validator map
     */
    getFilterValidators(record, viewField) {
        const validators = this.validationManager.getFilterValidations(record.searchModule, viewField, record);
        const asyncValidators = [];
        return { validators, asyncValidators };
    }
    /**
     * Init filter fields
     *
     * @param {object} searchCriteria to use
     * @param {object} viewField to init
     * @param {object} field to init
     * @returns {object} SearchCriteriaFieldFilter
     */
    initFieldFilter(searchCriteria, viewField, field) {
        let fieldCriteria;
        const fieldName = viewField.name;
        let fieldType = viewField.type;
        if (fieldType === 'composite') {
            fieldType = field.definition.type;
        }
        if (searchCriteria.filters[fieldName]) {
            fieldCriteria = deepClone(searchCriteria.filters[fieldName]);
        }
        else {
            fieldCriteria = {
                field: fieldName,
                fieldType,
                operator: '',
                values: []
            };
        }
        return fieldCriteria;
    }
    /**
     * Is criteria field initialized in record
     *
     * @param {object} record Record
     * @param {string} fieldName field
     * @returns {boolean} isInitialized
     */
    isCriteriaFieldInitialized(record, fieldName) {
        return !!record.criteriaFields[fieldName];
    }
    /**
     * Add field to SavedFilter
     *
     * @param {object} savedFilter SavedFilter
     * @param {string} name string
     * @param {object} field Field
     */
    addToSavedFilter(savedFilter, name, field) {
        if (!savedFilter || !name || !field) {
            return;
        }
        if (!savedFilter.criteriaFields) {
            savedFilter.criteriaFields = {};
        }
        savedFilter.criteriaFields[name] = field;
        if (!savedFilter.criteria.filters) {
            savedFilter.criteria.filters = {};
        }
        savedFilter.criteria.filters[name] = field.criteria;
        if (savedFilter.criteriaFormGroup && field.formControl) {
            savedFilter.criteriaFormGroup.addControl(name, field.formControl);
        }
    }
}
FilterFieldBuilder.ɵprov = i0.ɵɵdefineInjectable({ factory: function FilterFieldBuilder_Factory() { return new FilterFieldBuilder(i0.ɵɵinject(i1.ValidationManager), i0.ɵɵinject(i2.DataTypeFormatter)); }, token: FilterFieldBuilder, providedIn: "root" });
FilterFieldBuilder.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
FilterFieldBuilder.ctorParameters = () => [
    { type: ValidationManager },
    { type: DataTypeFormatter }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLWZpZWxkLmJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc2VydmljZXMvcmVjb3JkL2ZpZWxkL2ZpbHRlci1maWVsZC5idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUNuRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUUvRSxPQUFPLEVBQ0gsU0FBUyxFQU1aLE1BQU0sUUFBUSxDQUFDOzs7O0FBT2hCLE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxZQUFZO0lBRWhELFlBQ2MsaUJBQW9DLEVBQ3BDLGFBQWdDO1FBRTFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUg5QixzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQ3BDLGtCQUFhLEdBQWIsYUFBYSxDQUFtQjtJQUc5QyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLGdCQUFnQixDQUFDLFdBQXdCLEVBQUUsU0FBOEIsRUFBRSxXQUEwQixJQUFJO1FBRTVHLE1BQU0sVUFBVSxHQUFHLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFxQixDQUFDO1FBQ3JGLE1BQU0sRUFBQyxVQUFVLEVBQUUsZUFBZSxFQUFDLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUV2RixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUN6QixXQUFXLENBQUMsWUFBWSxFQUN4QixTQUFTLEVBQ1QsSUFBSSxFQUNKLElBQUksRUFDSixJQUFJLEVBQ0osV0FBVyxFQUNYLFVBQVUsRUFDVixVQUFVLEVBQ1YsZUFBZSxFQUNmLFFBQVEsQ0FDWCxDQUFDO1FBQ0YsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlFLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxtQkFBbUIsQ0FDdEIsTUFBbUIsRUFDbkIsU0FBOEI7UUFHOUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZHLE1BQU0sZUFBZSxHQUF1QixFQUFFLENBQUM7UUFFL0MsT0FBTyxFQUFDLFVBQVUsRUFBRSxlQUFlLEVBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLGVBQWUsQ0FBQyxjQUE4QixFQUFFLFNBQThCLEVBQUUsS0FBWTtRQUMvRixJQUFJLGFBQXdDLENBQUM7UUFFN0MsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztRQUNqQyxJQUFJLFNBQVMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBRS9CLElBQUksU0FBUyxLQUFLLFdBQVcsRUFBRTtZQUMzQixTQUFTLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7U0FDckM7UUFFRCxJQUFJLGNBQWMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDbkMsYUFBYSxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7U0FDaEU7YUFBTTtZQUNILGFBQWEsR0FBRztnQkFDWixLQUFLLEVBQUUsU0FBUztnQkFDaEIsU0FBUztnQkFDVCxRQUFRLEVBQUUsRUFBRTtnQkFDWixNQUFNLEVBQUUsRUFBRTthQUNiLENBQUM7U0FDTDtRQUVELE9BQU8sYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSwwQkFBMEIsQ0FBQyxNQUFtQixFQUFFLFNBQWlCO1FBQ3BFLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLGdCQUFnQixDQUFDLFdBQXdCLEVBQUUsSUFBWSxFQUFFLEtBQVk7UUFFeEUsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNqQyxPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRTtZQUM3QixXQUFXLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztTQUNuQztRQUVELFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBRXpDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtZQUMvQixXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7U0FDckM7UUFFRCxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBRXBELElBQUksV0FBVyxDQUFDLGlCQUFpQixJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDcEQsV0FBVyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3JFO0lBQ0wsQ0FBQzs7OztZQWxJSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQWhCTyxpQkFBaUI7WUFDakIsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0ZpZWxkQnVpbGRlcn0gZnJvbSAnLi9maWVsZC5idWlsZGVyJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1ZhbGlkYXRpb25NYW5hZ2VyfSBmcm9tICcuLi92YWxpZGF0aW9uL3ZhbGlkYXRpb24ubWFuYWdlcic7XG5pbXBvcnQge0RhdGFUeXBlRm9ybWF0dGVyfSBmcm9tICcuLi8uLi9mb3JtYXR0ZXJzL2RhdGEtdHlwZS5mb3JtYXR0ZXIuc2VydmljZSc7XG5pbXBvcnQge1NhdmVkRmlsdGVyfSBmcm9tICcuLi8uLi8uLi9zdG9yZS9zYXZlZC1maWx0ZXJzL3NhdmVkLWZpbHRlci5tb2RlbCc7XG5pbXBvcnQge1xuICAgIGRlZXBDbG9uZSxcbiAgICBGaWVsZCxcbiAgICBGaWVsZERlZmluaXRpb24sXG4gICAgU2VhcmNoQ3JpdGVyaWEsXG4gICAgU2VhcmNoQ3JpdGVyaWFGaWVsZEZpbHRlcixcbiAgICBWaWV3RmllbGREZWZpbml0aW9uXG59IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmV9IGZyb20gJy4uLy4uLy4uL3N0b3JlL2xhbmd1YWdlL2xhbmd1YWdlLnN0b3JlJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdG9yRm59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBGaWx0ZXJGaWVsZEJ1aWxkZXIgZXh0ZW5kcyBGaWVsZEJ1aWxkZXIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCB2YWxpZGF0aW9uTWFuYWdlcjogVmFsaWRhdGlvbk1hbmFnZXIsXG4gICAgICAgIHByb3RlY3RlZCB0eXBlRm9ybWF0dGVyOiBEYXRhVHlwZUZvcm1hdHRlclxuICAgICkge1xuICAgICAgICBzdXBlcih2YWxpZGF0aW9uTWFuYWdlciwgdHlwZUZvcm1hdHRlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgZmlsdGVyIGZpZWxkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc2F2ZWRGaWx0ZXIgU2F2ZWRGaWx0ZXJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmlld0ZpZWxkIFZpZXdGaWVsZERlZmluaXRpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbGFuZ3VhZ2UgTGFuZ3VhZ2VTdG9yZVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IEZpZWxkXG4gICAgICovXG4gICAgcHVibGljIGJ1aWxkRmlsdGVyRmllbGQoc2F2ZWRGaWx0ZXI6IFNhdmVkRmlsdGVyLCB2aWV3RmllbGQ6IFZpZXdGaWVsZERlZmluaXRpb24sIGxhbmd1YWdlOiBMYW5ndWFnZVN0b3JlID0gbnVsbCk6IEZpZWxkIHtcblxuICAgICAgICBjb25zdCBkZWZpbml0aW9uID0gKHZpZXdGaWVsZCAmJiB2aWV3RmllbGQuZmllbGREZWZpbml0aW9uKSB8fCB7fSBhcyBGaWVsZERlZmluaXRpb247XG4gICAgICAgIGNvbnN0IHt2YWxpZGF0b3JzLCBhc3luY1ZhbGlkYXRvcnN9ID0gdGhpcy5nZXRGaWx0ZXJWYWxpZGF0b3JzKHNhdmVkRmlsdGVyLCB2aWV3RmllbGQpO1xuXG4gICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5zZXR1cEZpZWxkKFxuICAgICAgICAgICAgc2F2ZWRGaWx0ZXIuc2VhcmNoTW9kdWxlLFxuICAgICAgICAgICAgdmlld0ZpZWxkLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgc2F2ZWRGaWx0ZXIsXG4gICAgICAgICAgICBkZWZpbml0aW9uLFxuICAgICAgICAgICAgdmFsaWRhdG9ycyxcbiAgICAgICAgICAgIGFzeW5jVmFsaWRhdG9ycyxcbiAgICAgICAgICAgIGxhbmd1YWdlXG4gICAgICAgICk7XG4gICAgICAgIGZpZWxkLmNyaXRlcmlhID0gdGhpcy5pbml0RmllbGRGaWx0ZXIoc2F2ZWRGaWx0ZXIuY3JpdGVyaWEsIHZpZXdGaWVsZCwgZmllbGQpO1xuICAgICAgICByZXR1cm4gZmllbGQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IEZpbHRlciBWYWxpZGF0b3JzIGZvciBnaXZlbiBmaWVsZCBkZWZpbml0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkICBSZWNvcmRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmlld0ZpZWxkIFZpZXdGaWVsZERlZmluaXRpb25cbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSB2YWxpZGF0b3IgbWFwXG4gICAgICovXG4gICAgcHVibGljIGdldEZpbHRlclZhbGlkYXRvcnMoXG4gICAgICAgIHJlY29yZDogU2F2ZWRGaWx0ZXIsXG4gICAgICAgIHZpZXdGaWVsZDogVmlld0ZpZWxkRGVmaW5pdGlvblxuICAgICk6IHsgdmFsaWRhdG9yczogVmFsaWRhdG9yRm5bXTsgYXN5bmNWYWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZuW10gfSB7XG5cbiAgICAgICAgY29uc3QgdmFsaWRhdG9ycyA9IHRoaXMudmFsaWRhdGlvbk1hbmFnZXIuZ2V0RmlsdGVyVmFsaWRhdGlvbnMocmVjb3JkLnNlYXJjaE1vZHVsZSwgdmlld0ZpZWxkLCByZWNvcmQpO1xuICAgICAgICBjb25zdCBhc3luY1ZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm5bXSA9IFtdO1xuXG4gICAgICAgIHJldHVybiB7dmFsaWRhdG9ycywgYXN5bmNWYWxpZGF0b3JzfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0IGZpbHRlciBmaWVsZHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZWFyY2hDcml0ZXJpYSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmlld0ZpZWxkIHRvIGluaXRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZmllbGQgdG8gaW5pdFxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IFNlYXJjaENyaXRlcmlhRmllbGRGaWx0ZXJcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdEZpZWxkRmlsdGVyKHNlYXJjaENyaXRlcmlhOiBTZWFyY2hDcml0ZXJpYSwgdmlld0ZpZWxkOiBWaWV3RmllbGREZWZpbml0aW9uLCBmaWVsZDogRmllbGQpOiBTZWFyY2hDcml0ZXJpYUZpZWxkRmlsdGVyIHtcbiAgICAgICAgbGV0IGZpZWxkQ3JpdGVyaWE6IFNlYXJjaENyaXRlcmlhRmllbGRGaWx0ZXI7XG5cbiAgICAgICAgY29uc3QgZmllbGROYW1lID0gdmlld0ZpZWxkLm5hbWU7XG4gICAgICAgIGxldCBmaWVsZFR5cGUgPSB2aWV3RmllbGQudHlwZTtcblxuICAgICAgICBpZiAoZmllbGRUeXBlID09PSAnY29tcG9zaXRlJykge1xuICAgICAgICAgICAgZmllbGRUeXBlID0gZmllbGQuZGVmaW5pdGlvbi50eXBlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlYXJjaENyaXRlcmlhLmZpbHRlcnNbZmllbGROYW1lXSkge1xuICAgICAgICAgICAgZmllbGRDcml0ZXJpYSA9IGRlZXBDbG9uZShzZWFyY2hDcml0ZXJpYS5maWx0ZXJzW2ZpZWxkTmFtZV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmllbGRDcml0ZXJpYSA9IHtcbiAgICAgICAgICAgICAgICBmaWVsZDogZmllbGROYW1lLFxuICAgICAgICAgICAgICAgIGZpZWxkVHlwZSxcbiAgICAgICAgICAgICAgICBvcGVyYXRvcjogJycsXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBbXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWVsZENyaXRlcmlhO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElzIGNyaXRlcmlhIGZpZWxkIGluaXRpYWxpemVkIGluIHJlY29yZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlY29yZCBSZWNvcmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmllbGROYW1lIGZpZWxkXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IGlzSW5pdGlhbGl6ZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNDcml0ZXJpYUZpZWxkSW5pdGlhbGl6ZWQocmVjb3JkOiBTYXZlZEZpbHRlciwgZmllbGROYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhcmVjb3JkLmNyaXRlcmlhRmllbGRzW2ZpZWxkTmFtZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGZpZWxkIHRvIFNhdmVkRmlsdGVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc2F2ZWRGaWx0ZXIgU2F2ZWRGaWx0ZXJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBzdHJpbmdcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZmllbGQgRmllbGRcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkVG9TYXZlZEZpbHRlcihzYXZlZEZpbHRlcjogU2F2ZWRGaWx0ZXIsIG5hbWU6IHN0cmluZywgZmllbGQ6IEZpZWxkKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKCFzYXZlZEZpbHRlciB8fCAhbmFtZSB8fCAhZmllbGQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2F2ZWRGaWx0ZXIuY3JpdGVyaWFGaWVsZHMpIHtcbiAgICAgICAgICAgIHNhdmVkRmlsdGVyLmNyaXRlcmlhRmllbGRzID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlZEZpbHRlci5jcml0ZXJpYUZpZWxkc1tuYW1lXSA9IGZpZWxkO1xuXG4gICAgICAgIGlmICghc2F2ZWRGaWx0ZXIuY3JpdGVyaWEuZmlsdGVycykge1xuICAgICAgICAgICAgc2F2ZWRGaWx0ZXIuY3JpdGVyaWEuZmlsdGVycyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZWRGaWx0ZXIuY3JpdGVyaWEuZmlsdGVyc1tuYW1lXSA9IGZpZWxkLmNyaXRlcmlhO1xuXG4gICAgICAgIGlmIChzYXZlZEZpbHRlci5jcml0ZXJpYUZvcm1Hcm91cCAmJiBmaWVsZC5mb3JtQ29udHJvbCkge1xuICAgICAgICAgICAgc2F2ZWRGaWx0ZXIuY3JpdGVyaWFGb3JtR3JvdXAuYWRkQ29udHJvbChuYW1lLCBmaWVsZC5mb3JtQ29udHJvbCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=