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
import * as i0 from "@angular/core";
import * as i1 from "../validation/validation.manager";
import * as i2 from "../../formatters/data-type.formatter.service";
export class GroupFieldBuilder extends FieldBuilder {
    constructor(validationManager, typeFormatter) {
        super(validationManager, typeFormatter);
        this.validationManager = validationManager;
        this.typeFormatter = typeFormatter;
    }
    /**
     * Create and add group fields to record
     *
     * @param {object} record Record
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @param {function} isInitializedFunction
     * @param {function} buildFieldFunction
     * @param {function} addRecordFunction
     */
    addGroupFields(record, viewField, language, isInitializedFunction, buildFieldFunction, addRecordFunction) {
        const definition = (viewField && viewField.fieldDefinition) || {};
        const groupFields = definition.groupFields || {};
        const groupFieldsKeys = Object.keys(groupFields);
        groupFieldsKeys.forEach(key => {
            const fieldDefinition = groupFields[key];
            if (isInitializedFunction(record, key)) {
                return;
            }
            const groupViewField = {
                name: fieldDefinition.name,
                label: fieldDefinition.vname,
                type: fieldDefinition.type,
                fieldDefinition
            };
            const groupField = buildFieldFunction(record, groupViewField, language);
            addRecordFunction(record, fieldDefinition.name, groupField);
        });
    }
}
GroupFieldBuilder.ɵprov = i0.ɵɵdefineInjectable({ factory: function GroupFieldBuilder_Factory() { return new GroupFieldBuilder(i0.ɵɵinject(i1.ValidationManager), i0.ɵɵinject(i2.DataTypeFormatter)); }, token: GroupFieldBuilder, providedIn: "root" });
GroupFieldBuilder.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
GroupFieldBuilder.ctorParameters = () => [
    { type: ValidationManager },
    { type: DataTypeFormatter }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAtZmllbGQuYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zZXJ2aWNlcy9yZWNvcmQvZmllbGQvZ3JvdXAtZmllbGQuYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRzdDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDbkUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sOENBQThDLENBQUM7Ozs7QUFLL0UsTUFBTSxPQUFPLGlCQUFrQixTQUFRLFlBQVk7SUFFL0MsWUFDYyxpQkFBb0MsRUFDcEMsYUFBZ0M7UUFFMUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBSDlCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDcEMsa0JBQWEsR0FBYixhQUFhLENBQW1CO0lBRzlDLENBQUM7SUFHRDs7Ozs7Ozs7O09BU0c7SUFDSSxjQUFjLENBQ2pCLE1BQWMsRUFDZCxTQUE4QixFQUM5QixRQUF1QixFQUN2QixxQkFBK0IsRUFDL0Isa0JBQTRCLEVBQzVCLGlCQUEyQjtRQUczQixNQUFNLFVBQVUsR0FBRyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2xFLE1BQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO1FBQ2pELE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFakQsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUMxQixNQUFNLGVBQWUsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFekMsSUFBSSxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ3BDLE9BQU87YUFDVjtZQUVELE1BQU0sY0FBYyxHQUFHO2dCQUNuQixJQUFJLEVBQUUsZUFBZSxDQUFDLElBQUk7Z0JBQzFCLEtBQUssRUFBRSxlQUFlLENBQUMsS0FBSztnQkFDNUIsSUFBSSxFQUFFLGVBQWUsQ0FBQyxJQUFJO2dCQUMxQixlQUFlO2FBQ2xCLENBQUM7WUFFRixNQUFNLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3hFLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7OztZQXJESixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQUxPLGlCQUFpQjtZQUNqQixpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7RmllbGRCdWlsZGVyfSBmcm9tICcuL2ZpZWxkLmJ1aWxkZXInO1xuaW1wb3J0IHtSZWNvcmQsIFZpZXdGaWVsZERlZmluaXRpb259IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmV9IGZyb20gJy4uLy4uLy4uL3N0b3JlL2xhbmd1YWdlL2xhbmd1YWdlLnN0b3JlJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1ZhbGlkYXRpb25NYW5hZ2VyfSBmcm9tICcuLi92YWxpZGF0aW9uL3ZhbGlkYXRpb24ubWFuYWdlcic7XG5pbXBvcnQge0RhdGFUeXBlRm9ybWF0dGVyfSBmcm9tICcuLi8uLi9mb3JtYXR0ZXJzL2RhdGEtdHlwZS5mb3JtYXR0ZXIuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgR3JvdXBGaWVsZEJ1aWxkZXIgZXh0ZW5kcyBGaWVsZEJ1aWxkZXIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCB2YWxpZGF0aW9uTWFuYWdlcjogVmFsaWRhdGlvbk1hbmFnZXIsXG4gICAgICAgIHByb3RlY3RlZCB0eXBlRm9ybWF0dGVyOiBEYXRhVHlwZUZvcm1hdHRlclxuICAgICkge1xuICAgICAgICBzdXBlcih2YWxpZGF0aW9uTWFuYWdlciwgdHlwZUZvcm1hdHRlcik7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW5kIGFkZCBncm91cCBmaWVsZHMgdG8gcmVjb3JkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkIFJlY29yZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB2aWV3RmllbGQgVmlld0ZpZWxkRGVmaW5pdGlvblxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsYW5ndWFnZSBMYW5ndWFnZVN0b3JlXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaXNJbml0aWFsaXplZEZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gYnVpbGRGaWVsZEZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gYWRkUmVjb3JkRnVuY3Rpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkR3JvdXBGaWVsZHMoXG4gICAgICAgIHJlY29yZDogUmVjb3JkLFxuICAgICAgICB2aWV3RmllbGQ6IFZpZXdGaWVsZERlZmluaXRpb24sXG4gICAgICAgIGxhbmd1YWdlOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICBpc0luaXRpYWxpemVkRnVuY3Rpb246IEZ1bmN0aW9uLFxuICAgICAgICBidWlsZEZpZWxkRnVuY3Rpb246IEZ1bmN0aW9uLFxuICAgICAgICBhZGRSZWNvcmRGdW5jdGlvbjogRnVuY3Rpb24sXG4gICAgKTogdm9pZCB7XG5cbiAgICAgICAgY29uc3QgZGVmaW5pdGlvbiA9ICh2aWV3RmllbGQgJiYgdmlld0ZpZWxkLmZpZWxkRGVmaW5pdGlvbikgfHwge307XG4gICAgICAgIGNvbnN0IGdyb3VwRmllbGRzID0gZGVmaW5pdGlvbi5ncm91cEZpZWxkcyB8fCB7fTtcbiAgICAgICAgY29uc3QgZ3JvdXBGaWVsZHNLZXlzID0gT2JqZWN0LmtleXMoZ3JvdXBGaWVsZHMpO1xuXG4gICAgICAgIGdyb3VwRmllbGRzS2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaWVsZERlZmluaXRpb24gPSBncm91cEZpZWxkc1trZXldO1xuXG4gICAgICAgICAgICBpZiAoaXNJbml0aWFsaXplZEZ1bmN0aW9uKHJlY29yZCwga2V5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZ3JvdXBWaWV3RmllbGQgPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogZmllbGREZWZpbml0aW9uLm5hbWUsXG4gICAgICAgICAgICAgICAgbGFiZWw6IGZpZWxkRGVmaW5pdGlvbi52bmFtZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBmaWVsZERlZmluaXRpb24udHlwZSxcbiAgICAgICAgICAgICAgICBmaWVsZERlZmluaXRpb25cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IGdyb3VwRmllbGQgPSBidWlsZEZpZWxkRnVuY3Rpb24ocmVjb3JkLCBncm91cFZpZXdGaWVsZCwgbGFuZ3VhZ2UpO1xuICAgICAgICAgICAgYWRkUmVjb3JkRnVuY3Rpb24ocmVjb3JkLCBmaWVsZERlZmluaXRpb24ubmFtZSwgZ3JvdXBGaWVsZCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuIl19