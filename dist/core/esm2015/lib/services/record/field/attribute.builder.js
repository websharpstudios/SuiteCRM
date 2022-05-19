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
import { ValidationManager } from '../validation/validation.manager';
import { DataTypeFormatter } from '../../formatters/data-type.formatter.service';
import { Injectable } from '@angular/core';
import isObjectLike from 'lodash-es/isObjectLike';
import * as i0 from "@angular/core";
import * as i1 from "../validation/validation.manager";
import * as i2 from "../../formatters/data-type.formatter.service";
export class AttributeBuilder extends FieldBuilder {
    constructor(validationManager, typeFormatter) {
        super(validationManager, typeFormatter);
        this.validationManager = validationManager;
        this.typeFormatter = typeFormatter;
    }
    /**
     * Create and add attributes fields to field
     *
     * @param {object} record Record
     * @param {object} fields FieldMap
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @param {function} buildAttributeFunction
     * @param {function} addAttributeFunction
     */
    addAttributes(record, fields, viewField, language, buildAttributeFunction, addAttributeFunction) {
        const fieldKeys = Object.keys(fields) || [];
        if (fieldKeys.length < 1) {
            return;
        }
        fieldKeys.forEach(key => {
            const field = fields[key];
            this.addFieldAttributes(record, field, language, buildAttributeFunction, addAttributeFunction);
        });
    }
    /**
     * Create and add attributes fields to field
     *
     * @param {object} record Record
     * @param {object} field Field
     * @param {object} language LanguageStore
     * @param {function} buildAttributeFunction
     * @param {function} addAttributeFunction
     */
    addFieldAttributes(record, field, language, buildAttributeFunction, addAttributeFunction) {
        const definition = (field && field.definition) || {};
        const attributes = definition.attributeFields || {};
        const attributeKeys = Object.keys(attributes);
        attributeKeys.forEach(key => {
            const attributeDefinition = attributes[key];
            if (!!field.attributes[key]) {
                return;
            }
            const attributeViewField = {
                name: attributeDefinition.name,
                label: attributeDefinition.vname,
                type: attributeDefinition.type,
                fieldDefinition: attributeDefinition
            };
            const attributeField = buildAttributeFunction(record, field, attributeViewField, language);
            addAttributeFunction(record, field, attributeDefinition.name, attributeField);
        });
    }
    /**
     * Build field
     *
     * @param {object} record Record
     * @param {object} parentField Field
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @returns {object} FieldAttribute
     */
    buildAttribute(record, parentField, viewField, language = null) {
        const definition = (viewField && viewField.fieldDefinition) || {};
        const { value, valueList, valueObject } = this.parseAttributeValue(viewField, definition, record, parentField);
        const { validators, asyncValidators } = this.getSaveValidators(record, viewField);
        const field = this.setupField(record.module, viewField, value, valueList, valueObject, record, definition, validators, asyncValidators, language);
        const fieldAttribute = field;
        fieldAttribute.valuePath = definition.valuePath;
        fieldAttribute.valueParent = definition.valueParent;
        fieldAttribute.source = 'attribute';
        fieldAttribute.parentKey = parentField.name;
        return fieldAttribute;
    }
    /**
     * Add attribute to record
     *
     * @param {object} record Record
     * @param {object} field Field
     * @param {string} name string
     * @param {object} attribute FieldAttribute
     */
    addAttributeToRecord(record, field, name, attribute) {
        if (!record || !name || !field || !attribute) {
            return;
        }
        field.attributes = field.attributes || {};
        field.attributes[name] = attribute;
        if (record.formGroup && attribute.formControl) {
            record.formGroup.addControl(name, attribute.formControl);
        }
    }
    /**
     * Parse attribute from field
     *
     * @param {object} viewField ViewFieldDefinition
     * @param {object} definition FieldDefinition
     * @param {object} record Record
     * @param {object} field Field
     * @returns {object} value object
     */
    parseAttributeValue(viewField, definition, record, field) {
        const type = (viewField && viewField.type) || '';
        const source = (definition && definition.source) || '';
        const rname = (definition && definition.rname) || 'name';
        const viewName = viewField.name || '';
        let value;
        let valueList = null;
        if (type === 'relate' && source === 'non-db' && rname !== '') {
            value = this.getParentValue(record, field, viewName, definition)[rname];
            const valueObject = this.getParentValue(record, field, viewName, definition);
            return { value, valueList, valueObject };
        }
        if (!viewName) {
            value = '';
        }
        else {
            value = this.getParentValue(record, field, viewName, definition);
        }
        value = this.getParentValue(record, field, viewName, definition);
        if (Array.isArray(value)) {
            return {
                value: null,
                valueList: value,
                valueObject: null
            };
        }
        if (isObjectLike(value)) {
            return {
                value: null,
                valueList: null,
                valueObject: value
            };
        }
        return { value, valueList: null, valueObject: null };
    }
}
AttributeBuilder.ɵprov = i0.ɵɵdefineInjectable({ factory: function AttributeBuilder_Factory() { return new AttributeBuilder(i0.ɵɵinject(i1.ValidationManager), i0.ɵɵinject(i2.DataTypeFormatter)); }, token: AttributeBuilder, providedIn: "root" });
AttributeBuilder.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
AttributeBuilder.ctorParameters = () => [
    { type: ValidationManager },
    { type: DataTypeFormatter }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0cmlidXRlLmJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc2VydmljZXMvcmVjb3JkL2ZpZWxkL2F0dHJpYnV0ZS5idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFHN0MsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDbkUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sOENBQThDLENBQUM7QUFDL0UsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLFlBQVksTUFBTSx3QkFBd0IsQ0FBQzs7OztBQUtsRCxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsWUFBWTtJQUU5QyxZQUNjLGlCQUFvQyxFQUNwQyxhQUFnQztRQUUxQyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFIOUIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNwQyxrQkFBYSxHQUFiLGFBQWEsQ0FBbUI7SUFHOUMsQ0FBQztJQUdEOzs7Ozs7Ozs7T0FTRztJQUNJLGFBQWEsQ0FDaEIsTUFBYyxFQUNkLE1BQWdCLEVBQ2hCLFNBQThCLEVBQzlCLFFBQXVCLEVBQ3ZCLHNCQUFnQyxFQUNoQyxvQkFBOEI7UUFFOUIsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFHNUMsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN0QixPQUFPO1NBQ1Y7UUFFRCxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3BCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFH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TyxFQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFDLENBQUM7U0FDMUM7UUFFRCxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ1gsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNkO2FBQU07WUFDSCxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztTQUNwRTtRQUVELEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRWpFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN0QixPQUFPO2dCQUNILEtBQUssRUFBRSxJQUFJO2dCQUNYLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixXQUFXLEVBQUUsSUFBSTthQUNwQixDQUFBO1NBQ0o7UUFFRCxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNyQixPQUFPO2dCQUNILEtBQUssRUFBRSxJQUFJO2dCQUNYLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFdBQVcsRUFBRSxLQUFLO2FBQ3JCLENBQUE7U0FDSjtRQUVELE9BQU8sRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFDLENBQUM7SUFDdkQsQ0FBQzs7OztZQTlNSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQVBPLGlCQUFpQjtZQUNqQixpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7RmllbGRCdWlsZGVyfSBmcm9tICcuL2ZpZWxkLmJ1aWxkZXInO1xuaW1wb3J0IHtGaWVsZCwgRmllbGRBdHRyaWJ1dGUsIEZpZWxkRGVmaW5pdGlvbiwgRmllbGRNYXAsIFJlY29yZCwgVmlld0ZpZWxkRGVmaW5pdGlvbn0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZX0gZnJvbSAnLi4vLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtWYWxpZGF0aW9uTWFuYWdlcn0gZnJvbSAnLi4vdmFsaWRhdGlvbi92YWxpZGF0aW9uLm1hbmFnZXInO1xuaW1wb3J0IHtEYXRhVHlwZUZvcm1hdHRlcn0gZnJvbSAnLi4vLi4vZm9ybWF0dGVycy9kYXRhLXR5cGUuZm9ybWF0dGVyLnNlcnZpY2UnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCBpc09iamVjdExpa2UgZnJvbSAnbG9kYXNoLWVzL2lzT2JqZWN0TGlrZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQXR0cmlidXRlQnVpbGRlciBleHRlbmRzIEZpZWxkQnVpbGRlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHZhbGlkYXRpb25NYW5hZ2VyOiBWYWxpZGF0aW9uTWFuYWdlcixcbiAgICAgICAgcHJvdGVjdGVkIHR5cGVGb3JtYXR0ZXI6IERhdGFUeXBlRm9ybWF0dGVyXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKHZhbGlkYXRpb25NYW5hZ2VyLCB0eXBlRm9ybWF0dGVyKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYWRkIGF0dHJpYnV0ZXMgZmllbGRzIHRvIGZpZWxkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkIFJlY29yZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmaWVsZHMgRmllbGRNYXBcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmlld0ZpZWxkIFZpZXdGaWVsZERlZmluaXRpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbGFuZ3VhZ2UgTGFuZ3VhZ2VTdG9yZVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGJ1aWxkQXR0cmlidXRlRnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGRBdHRyaWJ1dGVGdW5jdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRBdHRyaWJ1dGVzKFxuICAgICAgICByZWNvcmQ6IFJlY29yZCxcbiAgICAgICAgZmllbGRzOiBGaWVsZE1hcCxcbiAgICAgICAgdmlld0ZpZWxkOiBWaWV3RmllbGREZWZpbml0aW9uLFxuICAgICAgICBsYW5ndWFnZTogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgYnVpbGRBdHRyaWJ1dGVGdW5jdGlvbjogRnVuY3Rpb24sXG4gICAgICAgIGFkZEF0dHJpYnV0ZUZ1bmN0aW9uOiBGdW5jdGlvbixcbiAgICApOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZmllbGRLZXlzID0gT2JqZWN0LmtleXMoZmllbGRzKSB8fCBbXTtcblxuXG4gICAgICAgIGlmIChmaWVsZEtleXMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZmllbGRLZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gZmllbGRzW2tleV07XG4gICAgICAgICAgICB0aGlzLmFkZEZpZWxkQXR0cmlidXRlcyhcbiAgICAgICAgICAgICAgICByZWNvcmQsXG4gICAgICAgICAgICAgICAgZmllbGQsXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2UsXG4gICAgICAgICAgICAgICAgYnVpbGRBdHRyaWJ1dGVGdW5jdGlvbixcbiAgICAgICAgICAgICAgICBhZGRBdHRyaWJ1dGVGdW5jdGlvblxuICAgICAgICAgICAgKVxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgYWRkIGF0dHJpYnV0ZXMgZmllbGRzIHRvIGZpZWxkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkIFJlY29yZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmaWVsZCBGaWVsZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsYW5ndWFnZSBMYW5ndWFnZVN0b3JlXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gYnVpbGRBdHRyaWJ1dGVGdW5jdGlvblxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGFkZEF0dHJpYnV0ZUZ1bmN0aW9uXG4gICAgICovXG4gICAgcHVibGljIGFkZEZpZWxkQXR0cmlidXRlcyhcbiAgICAgICAgcmVjb3JkOiBSZWNvcmQsXG4gICAgICAgIGZpZWxkOiBGaWVsZCxcbiAgICAgICAgbGFuZ3VhZ2U6IExhbmd1YWdlU3RvcmUsXG4gICAgICAgIGJ1aWxkQXR0cmlidXRlRnVuY3Rpb246IEZ1bmN0aW9uLFxuICAgICAgICBhZGRBdHRyaWJ1dGVGdW5jdGlvbjogRnVuY3Rpb25cbiAgICApOiB2b2lkIHtcblxuICAgICAgICBjb25zdCBkZWZpbml0aW9uID0gKGZpZWxkICYmIGZpZWxkLmRlZmluaXRpb24pIHx8IHt9O1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gZGVmaW5pdGlvbi5hdHRyaWJ1dGVGaWVsZHMgfHwge307XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZUtleXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKTtcblxuICAgICAgICBhdHRyaWJ1dGVLZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZURlZmluaXRpb24gPSBhdHRyaWJ1dGVzW2tleV07XG5cbiAgICAgICAgICAgIGlmICghIWZpZWxkLmF0dHJpYnV0ZXNba2V5XSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlVmlld0ZpZWxkID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IGF0dHJpYnV0ZURlZmluaXRpb24ubmFtZSxcbiAgICAgICAgICAgICAgICBsYWJlbDogYXR0cmlidXRlRGVmaW5pdGlvbi52bmFtZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBhdHRyaWJ1dGVEZWZpbml0aW9uLnR5cGUsXG4gICAgICAgICAgICAgICAgZmllbGREZWZpbml0aW9uOiBhdHRyaWJ1dGVEZWZpbml0aW9uXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGVGaWVsZCA9IGJ1aWxkQXR0cmlidXRlRnVuY3Rpb24ocmVjb3JkLCBmaWVsZCwgYXR0cmlidXRlVmlld0ZpZWxkLCBsYW5ndWFnZSk7XG4gICAgICAgICAgICBhZGRBdHRyaWJ1dGVGdW5jdGlvbihyZWNvcmQsIGZpZWxkLCBhdHRyaWJ1dGVEZWZpbml0aW9uLm5hbWUsIGF0dHJpYnV0ZUZpZWxkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgZmllbGRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWNvcmQgUmVjb3JkXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmVudEZpZWxkIEZpZWxkXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHZpZXdGaWVsZCBWaWV3RmllbGREZWZpbml0aW9uXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGxhbmd1YWdlIExhbmd1YWdlU3RvcmVcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBGaWVsZEF0dHJpYnV0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBidWlsZEF0dHJpYnV0ZShyZWNvcmQ6IFJlY29yZCwgcGFyZW50RmllbGQ6IEZpZWxkLCB2aWV3RmllbGQ6IFZpZXdGaWVsZERlZmluaXRpb24sIGxhbmd1YWdlOiBMYW5ndWFnZVN0b3JlID0gbnVsbCk6IEZpZWxkQXR0cmlidXRlIHtcblxuICAgICAgICBjb25zdCBkZWZpbml0aW9uID0gKHZpZXdGaWVsZCAmJiB2aWV3RmllbGQuZmllbGREZWZpbml0aW9uKSB8fCB7fSBhcyBGaWVsZERlZmluaXRpb247XG4gICAgICAgIGNvbnN0IHt2YWx1ZSwgdmFsdWVMaXN0LCB2YWx1ZU9iamVjdH0gPSB0aGlzLnBhcnNlQXR0cmlidXRlVmFsdWUodmlld0ZpZWxkLCBkZWZpbml0aW9uLCByZWNvcmQsIHBhcmVudEZpZWxkKTtcbiAgICAgICAgY29uc3Qge3ZhbGlkYXRvcnMsIGFzeW5jVmFsaWRhdG9yc30gPSB0aGlzLmdldFNhdmVWYWxpZGF0b3JzKHJlY29yZCwgdmlld0ZpZWxkKTtcblxuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuc2V0dXBGaWVsZChcbiAgICAgICAgICAgIHJlY29yZC5tb2R1bGUsXG4gICAgICAgICAgICB2aWV3RmllbGQsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIHZhbHVlTGlzdCxcbiAgICAgICAgICAgIHZhbHVlT2JqZWN0LFxuICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgZGVmaW5pdGlvbixcbiAgICAgICAgICAgIHZhbGlkYXRvcnMsXG4gICAgICAgICAgICBhc3luY1ZhbGlkYXRvcnMsXG4gICAgICAgICAgICBsYW5ndWFnZVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGZpZWxkQXR0cmlidXRlID0gZmllbGQgYXMgRmllbGRBdHRyaWJ1dGU7XG4gICAgICAgIGZpZWxkQXR0cmlidXRlLnZhbHVlUGF0aCA9IGRlZmluaXRpb24udmFsdWVQYXRoO1xuICAgICAgICBmaWVsZEF0dHJpYnV0ZS52YWx1ZVBhcmVudCA9IGRlZmluaXRpb24udmFsdWVQYXJlbnQ7XG4gICAgICAgIGZpZWxkQXR0cmlidXRlLnNvdXJjZSA9ICdhdHRyaWJ1dGUnO1xuICAgICAgICBmaWVsZEF0dHJpYnV0ZS5wYXJlbnRLZXkgPSBwYXJlbnRGaWVsZC5uYW1lO1xuXG4gICAgICAgIHJldHVybiBmaWVsZEF0dHJpYnV0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYXR0cmlidXRlIHRvIHJlY29yZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlY29yZCBSZWNvcmRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZmllbGQgRmllbGRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBzdHJpbmdcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gYXR0cmlidXRlIEZpZWxkQXR0cmlidXRlXG4gICAgICovXG4gICAgcHVibGljIGFkZEF0dHJpYnV0ZVRvUmVjb3JkKHJlY29yZDogUmVjb3JkLCBmaWVsZDogRmllbGQsIG5hbWU6IHN0cmluZywgYXR0cmlidXRlOiBGaWVsZEF0dHJpYnV0ZSk6IHZvaWQge1xuXG4gICAgICAgIGlmICghcmVjb3JkIHx8ICFuYW1lIHx8ICFmaWVsZCB8fCAhYXR0cmlidXRlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmaWVsZC5hdHRyaWJ1dGVzID0gZmllbGQuYXR0cmlidXRlcyB8fCB7fTtcblxuICAgICAgICBmaWVsZC5hdHRyaWJ1dGVzW25hbWVdID0gYXR0cmlidXRlO1xuXG4gICAgICAgIGlmIChyZWNvcmQuZm9ybUdyb3VwICYmIGF0dHJpYnV0ZS5mb3JtQ29udHJvbCkge1xuICAgICAgICAgICAgcmVjb3JkLmZvcm1Hcm91cC5hZGRDb250cm9sKG5hbWUsIGF0dHJpYnV0ZS5mb3JtQ29udHJvbCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIGF0dHJpYnV0ZSBmcm9tIGZpZWxkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmlld0ZpZWxkIFZpZXdGaWVsZERlZmluaXRpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGVmaW5pdGlvbiBGaWVsZERlZmluaXRpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkIFJlY29yZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmaWVsZCBGaWVsZFxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IHZhbHVlIG9iamVjdFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBwYXJzZUF0dHJpYnV0ZVZhbHVlKFxuICAgICAgICB2aWV3RmllbGQ6IFZpZXdGaWVsZERlZmluaXRpb24sXG4gICAgICAgIGRlZmluaXRpb246IEZpZWxkRGVmaW5pdGlvbixcbiAgICAgICAgcmVjb3JkOiBSZWNvcmQsXG4gICAgICAgIGZpZWxkOiBGaWVsZFxuICAgICk6IHsgdmFsdWU6IHN0cmluZzsgdmFsdWVMaXN0OiBzdHJpbmdbXTsgdmFsdWVPYmplY3Q/OiBhbnkgfSB7XG5cbiAgICAgICAgY29uc3QgdHlwZSA9ICh2aWV3RmllbGQgJiYgdmlld0ZpZWxkLnR5cGUpIHx8ICcnO1xuICAgICAgICBjb25zdCBzb3VyY2UgPSAoZGVmaW5pdGlvbiAmJiBkZWZpbml0aW9uLnNvdXJjZSkgfHwgJyc7XG4gICAgICAgIGNvbnN0IHJuYW1lID0gKGRlZmluaXRpb24gJiYgZGVmaW5pdGlvbi5ybmFtZSkgfHwgJ25hbWUnO1xuICAgICAgICBjb25zdCB2aWV3TmFtZSA9IHZpZXdGaWVsZC5uYW1lIHx8ICcnO1xuICAgICAgICBsZXQgdmFsdWU6IHN0cmluZztcbiAgICAgICAgbGV0IHZhbHVlTGlzdDogc3RyaW5nW10gPSBudWxsO1xuXG4gICAgICAgIGlmICh0eXBlID09PSAncmVsYXRlJyAmJiBzb3VyY2UgPT09ICdub24tZGInICYmIHJuYW1lICE9PSAnJykge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmdldFBhcmVudFZhbHVlKHJlY29yZCwgZmllbGQsIHZpZXdOYW1lLCBkZWZpbml0aW9uKVtybmFtZV07XG4gICAgICAgICAgICBjb25zdCB2YWx1ZU9iamVjdCA9IHRoaXMuZ2V0UGFyZW50VmFsdWUocmVjb3JkLCBmaWVsZCwgdmlld05hbWUsIGRlZmluaXRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIHt2YWx1ZSwgdmFsdWVMaXN0LCB2YWx1ZU9iamVjdH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXZpZXdOYW1lKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmdldFBhcmVudFZhbHVlKHJlY29yZCwgZmllbGQsIHZpZXdOYW1lLCBkZWZpbml0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlID0gdGhpcy5nZXRQYXJlbnRWYWx1ZShyZWNvcmQsIGZpZWxkLCB2aWV3TmFtZSwgZGVmaW5pdGlvbik7XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgICAgIHZhbHVlTGlzdDogdmFsdWUsXG4gICAgICAgICAgICAgICAgdmFsdWVPYmplY3Q6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc09iamVjdExpa2UodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgICAgICAgICAgIHZhbHVlTGlzdDogbnVsbCxcbiAgICAgICAgICAgICAgICB2YWx1ZU9iamVjdDogdmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7dmFsdWUsIHZhbHVlTGlzdDogbnVsbCwgdmFsdWVPYmplY3Q6IG51bGx9O1xuICAgIH1cblxufVxuIl19