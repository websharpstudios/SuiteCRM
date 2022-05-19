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
import { Injectable } from '@angular/core';
import { ValidationManager } from '../validation/validation.manager';
import { DataTypeFormatter } from '../../formatters/data-type.formatter.service';
import { BaseField } from 'common';
import { FormArray, FormControl } from '@angular/forms';
import get from 'lodash-es/get';
import * as i0 from "@angular/core";
import * as i1 from "../validation/validation.manager";
import * as i2 from "../../formatters/data-type.formatter.service";
export class FieldBuilder {
    constructor(validationManager, typeFormatter) {
        this.validationManager = validationManager;
        this.typeFormatter = typeFormatter;
    }
    /**
     * Build field
     *
     * @param {object} record Record
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @returns {object}Field
     */
    buildField(record, viewField, language = null) {
        const definition = (viewField && viewField.fieldDefinition) || {};
        const { value, valueList, valueObject } = this.parseValue(viewField, definition, record);
        const { validators, asyncValidators } = this.getSaveValidators(record, viewField);
        return this.setupField(record.module, viewField, value, valueList, valueObject, record, definition, validators, asyncValidators, language);
    }
    getFieldLabel(label, module, language) {
        const languages = language.getLanguageStrings();
        return language.getFieldLabel(label, module, languages);
    }
    /**
     * Parse value from record
     *
     * @param {object} viewField ViewFieldDefinition
     * @param {object} definition FieldDefinition
     * @param {object} record Record
     * @returns {object} value object
     */
    parseValue(viewField, definition, record) {
        const type = (viewField && viewField.type) || '';
        const source = (definition && definition.source) || '';
        const rname = (definition && definition.rname) || 'name';
        const viewName = viewField.name || '';
        let value = null;
        let valueList = null;
        if (!viewName || !record.attributes[viewName]) {
            value = '';
        }
        else if (type === 'relate' && source === 'non-db' && rname !== '') {
            value = record.attributes[viewName][rname];
            const valueObject = record.attributes[viewName];
            return { value, valueList, valueObject };
        }
        else {
            value = record.attributes[viewName];
        }
        if (type === 'line-items') {
            return { value: null, valueList };
        }
        if (Array.isArray(value)) {
            valueList = value;
            value = null;
        }
        if (!value && definition.default) {
            value = definition.default;
        }
        else if (value === null) {
            value = '';
        }
        return { value, valueList };
    }
    /**
     * Build and initialize field object
     *
     * @param {string} module to use
     * @param {object} viewField ViewFieldDefinition
     * @param {string} value string
     * @param {[]} valueList string[]
     * @param {} valueObject value object
     * @param {object} record Record
     * @param {object} definition FieldDefinition
     * @param {[]} validators ValidatorFn[]
     * @param {[]} asyncValidators AsyncValidatorFn[]
     * @param {object} language LanguageStore
     * @returns {object} BaseField
     */
    setupField(module, viewField, value, valueList, valueObject, record, definition, validators, asyncValidators, language) {
        const formattedValue = this.typeFormatter.toUserFormat(viewField.type, value, { mode: 'edit' });
        const metadata = viewField.metadata || definition.metadata || {};
        if (viewField.link) {
            metadata.link = viewField.link;
        }
        const field = new BaseField();
        field.type = viewField.type || definition.type;
        field.name = viewField.name || definition.name || '';
        field.display = viewField.display || definition.display || 'default';
        field.defaultDisplay = field.display;
        field.value = value;
        field.metadata = metadata;
        field.definition = definition;
        field.labelKey = viewField.label || definition.vname || '';
        field.validators = validators;
        field.asyncValidators = asyncValidators;
        if (field.type === 'line-items') {
            field.valueObjectArray = record.attributes[field.name];
            field.itemFormArray = new FormArray([], validators, asyncValidators);
            field.formControl = new FormControl(formattedValue);
        }
        else {
            field.formControl = new FormControl(formattedValue, validators, asyncValidators);
        }
        field.attributes = {};
        field.source = 'field';
        field.logic = viewField.logic || definition.logic || null;
        if (field.logic && Object.keys(field.logic).length) {
            const attributeDependencies = {};
            const fieldDependencies = {};
            Object.keys(field.logic).forEach(logicKey => {
                const entry = field.logic[logicKey] || {};
                if (!entry.params) {
                    return;
                }
                if (entry.params && entry.params.attributeDependencies) {
                    entry.params.attributeDependencies.forEach(dependency => {
                        const dependencyKey = dependency.field + '.' + dependency.attribute;
                        attributeDependencies[dependencyKey] = dependency;
                    });
                }
                if (entry.params && entry.params.fieldDependencies) {
                    entry.params.fieldDependencies.forEach(dependency => {
                        fieldDependencies[dependency] = dependency;
                    });
                }
            });
            field.attributeDependencies = Object.keys(attributeDependencies).map(key => attributeDependencies[key]);
            field.fieldDependencies = Object.keys(fieldDependencies);
        }
        if (valueList) {
            field.valueList = valueList;
        }
        if (valueObject) {
            field.valueObject = valueObject;
        }
        if (language) {
            field.label = this.getFieldLabel(viewField.label, module, language);
        }
        if (!field.labelKey && viewField.label) {
            field.labelKey = viewField.label;
        }
        return field;
    }
    /**
     * Get save validators for the given field definition
     *
     * @param {object} record Record
     * @param {object} viewField ViewFieldDefinition
     * @returns {object} Validator map
     */
    getSaveValidators(record, viewField) {
        const validators = this.validationManager.getSaveValidations(record.module, viewField, record);
        const asyncValidators = this.validationManager.getAsyncSaveValidations(record.module, viewField, record);
        return { validators, asyncValidators };
    }
    /**
     * Set attribute value on parent
     *
     * @param {object} record Record
     * @param {object} field Field
     * @param {string} name String
     * @param {object} definition FieldDefinition
     * @returns any
     */
    getParentValue(record, field, name, definition) {
        var _a;
        const valueParent = (_a = definition.valueParent) !== null && _a !== void 0 ? _a : 'field';
        const parent = valueParent === 'record' ? record : field;
        if (definition.valuePath) {
            return get(parent, definition.valuePath, '');
        }
        if (valueParent === 'record') {
            return get(record.attributes, name, '');
        }
        return get(field.valueObject, name, '');
    }
}
FieldBuilder.ɵprov = i0.ɵɵdefineInjectable({ factory: function FieldBuilder_Factory() { return new FieldBuilder(i0.ɵɵinject(i1.ValidationManager), i0.ɵɵinject(i2.DataTypeFormatter)); }, token: FieldBuilder, providedIn: "root" });
FieldBuilder.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
FieldBuilder.ctorParameters = () => [
    { type: ValidationManager },
    { type: DataTypeFormatter }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQuYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zZXJ2aWNlcy9yZWNvcmQvZmllbGQvZmllbGQuYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUNuRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUMvRSxPQUFPLEVBRUgsU0FBUyxFQU9aLE1BQU0sUUFBUSxDQUFDO0FBQ2hCLE9BQU8sRUFBbUIsU0FBUyxFQUFFLFdBQVcsRUFBYyxNQUFNLGdCQUFnQixDQUFDO0FBRXJGLE9BQU8sR0FBRyxNQUFNLGVBQWUsQ0FBQzs7OztBQU1oQyxNQUFNLE9BQU8sWUFBWTtJQUVyQixZQUNjLGlCQUFvQyxFQUNwQyxhQUFnQztRQURoQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQ3BDLGtCQUFhLEdBQWIsYUFBYSxDQUFtQjtJQUU5QyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLFVBQVUsQ0FBQyxNQUFjLEVBQUUsU0FBOEIsRUFBRSxXQUEwQixJQUFJO1FBRTVGLE1BQU0sVUFBVSxHQUFHLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFxQixDQUFDO1FBQ3JGLE1BQU0sRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2RixNQUFNLEVBQUMsVUFBVSxFQUFFLGVBQWUsRUFBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVB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QUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDL0YsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3pHLE9BQU8sRUFBQyxVQUFVLEVBQUUsZUFBZSxFQUFDLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ08sY0FBYyxDQUFDLE1BQWMsRUFBRSxLQUFZLEVBQUUsSUFBWSxFQUFFLFVBQTJCOztRQUM1RixNQUFNLFdBQVcsR0FBRyxNQUFBLFVBQVUsQ0FBQyxXQUFXLG1DQUFJLE9BQU8sQ0FBQztRQUN0RCxNQUFNLE1BQU0sR0FBRyxXQUFXLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUV6RCxJQUFJLFVBQVUsQ0FBQyxTQUFTLEVBQUU7WUFDdEIsT0FBTyxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDaEQ7UUFFRCxJQUFJLFdBQVcsS0FBSyxRQUFRLEVBQUU7WUFDMUIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDM0M7UUFFRCxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM1QyxDQUFDOzs7O1lBblBKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7O1lBbkJPLGlCQUFpQjtZQUNqQixpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1ZhbGlkYXRpb25NYW5hZ2VyfSBmcm9tICcuLi92YWxpZGF0aW9uL3ZhbGlkYXRpb24ubWFuYWdlcic7XG5pbXBvcnQge0RhdGFUeXBlRm9ybWF0dGVyfSBmcm9tICcuLi8uLi9mb3JtYXR0ZXJzL2RhdGEtdHlwZS5mb3JtYXR0ZXIuc2VydmljZSc7XG5pbXBvcnQge1xuICAgIEF0dHJpYnV0ZURlcGVuZGVuY3ksXG4gICAgQmFzZUZpZWxkLFxuICAgIEZpZWxkLFxuICAgIEZpZWxkRGVmaW5pdGlvbixcbiAgICBGaWVsZExvZ2ljLFxuICAgIFJlY29yZCxcbiAgICBTdHJpbmdNYXAsXG4gICAgVmlld0ZpZWxkRGVmaW5pdGlvblxufSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtBc3luY1ZhbGlkYXRvckZuLCBGb3JtQXJyYXksIEZvcm1Db250cm9sLCBWYWxpZGF0b3JGbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtMYW5ndWFnZVN0b3JlfSBmcm9tICcuLi8uLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5pbXBvcnQgZ2V0IGZyb20gJ2xvZGFzaC1lcy9nZXQnO1xuXG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgRmllbGRCdWlsZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgdmFsaWRhdGlvbk1hbmFnZXI6IFZhbGlkYXRpb25NYW5hZ2VyLFxuICAgICAgICBwcm90ZWN0ZWQgdHlwZUZvcm1hdHRlcjogRGF0YVR5cGVGb3JtYXR0ZXJcbiAgICApIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBmaWVsZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlY29yZCBSZWNvcmRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmlld0ZpZWxkIFZpZXdGaWVsZERlZmluaXRpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbGFuZ3VhZ2UgTGFuZ3VhZ2VTdG9yZVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9RmllbGRcbiAgICAgKi9cbiAgICBwdWJsaWMgYnVpbGRGaWVsZChyZWNvcmQ6IFJlY29yZCwgdmlld0ZpZWxkOiBWaWV3RmllbGREZWZpbml0aW9uLCBsYW5ndWFnZTogTGFuZ3VhZ2VTdG9yZSA9IG51bGwpOiBGaWVsZCB7XG5cbiAgICAgICAgY29uc3QgZGVmaW5pdGlvbiA9ICh2aWV3RmllbGQgJiYgdmlld0ZpZWxkLmZpZWxkRGVmaW5pdGlvbikgfHwge30gYXMgRmllbGREZWZpbml0aW9uO1xuICAgICAgICBjb25zdCB7dmFsdWUsIHZhbHVlTGlzdCwgdmFsdWVPYmplY3R9ID0gdGhpcy5wYXJzZVZhbHVlKHZpZXdGaWVsZCwgZGVmaW5pdGlvbiwgcmVjb3JkKTtcbiAgICAgICAgY29uc3Qge3ZhbGlkYXRvcnMsIGFzeW5jVmFsaWRhdG9yc30gPSB0aGlzLmdldFNhdmVWYWxpZGF0b3JzKHJlY29yZCwgdmlld0ZpZWxkKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5zZXR1cEZpZWxkKFxuICAgICAgICAgICAgcmVjb3JkLm1vZHVsZSxcbiAgICAgICAgICAgIHZpZXdGaWVsZCxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgdmFsdWVMaXN0LFxuICAgICAgICAgICAgdmFsdWVPYmplY3QsXG4gICAgICAgICAgICByZWNvcmQsXG4gICAgICAgICAgICBkZWZpbml0aW9uLFxuICAgICAgICAgICAgdmFsaWRhdG9ycyxcbiAgICAgICAgICAgIGFzeW5jVmFsaWRhdG9ycyxcbiAgICAgICAgICAgIGxhbmd1YWdlXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEZpZWxkTGFiZWwobGFiZWw6IHN0cmluZywgbW9kdWxlOiBzdHJpbmcsIGxhbmd1YWdlOiBMYW5ndWFnZVN0b3JlKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgbGFuZ3VhZ2VzID0gbGFuZ3VhZ2UuZ2V0TGFuZ3VhZ2VTdHJpbmdzKCk7XG4gICAgICAgIHJldHVybiBsYW5ndWFnZS5nZXRGaWVsZExhYmVsKGxhYmVsLCBtb2R1bGUsIGxhbmd1YWdlcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgdmFsdWUgZnJvbSByZWNvcmRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB2aWV3RmllbGQgVmlld0ZpZWxkRGVmaW5pdGlvblxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkZWZpbml0aW9uIEZpZWxkRGVmaW5pdGlvblxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWNvcmQgUmVjb3JkXG4gICAgICogQHJldHVybnMge29iamVjdH0gdmFsdWUgb2JqZWN0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHBhcnNlVmFsdWUoXG4gICAgICAgIHZpZXdGaWVsZDogVmlld0ZpZWxkRGVmaW5pdGlvbixcbiAgICAgICAgZGVmaW5pdGlvbjogRmllbGREZWZpbml0aW9uLFxuICAgICAgICByZWNvcmQ6IFJlY29yZFxuICAgICk6IHsgdmFsdWU6IHN0cmluZzsgdmFsdWVMaXN0OiBzdHJpbmdbXTsgdmFsdWVPYmplY3Q/OiBhbnkgfSB7XG5cbiAgICAgICAgY29uc3QgdHlwZSA9ICh2aWV3RmllbGQgJiYgdmlld0ZpZWxkLnR5cGUpIHx8ICcnO1xuICAgICAgICBjb25zdCBzb3VyY2UgPSAoZGVmaW5pdGlvbiAmJiBkZWZpbml0aW9uLnNvdXJjZSkgfHwgJyc7XG4gICAgICAgIGNvbnN0IHJuYW1lID0gKGRlZmluaXRpb24gJiYgZGVmaW5pdGlvbi5ybmFtZSkgfHwgJ25hbWUnO1xuICAgICAgICBjb25zdCB2aWV3TmFtZSA9IHZpZXdGaWVsZC5uYW1lIHx8ICcnO1xuICAgICAgICBsZXQgdmFsdWU6IHN0cmluZyA9IG51bGw7XG4gICAgICAgIGxldCB2YWx1ZUxpc3Q6IHN0cmluZ1tdID0gbnVsbDtcblxuICAgICAgICBpZiAoIXZpZXdOYW1lIHx8ICFyZWNvcmQuYXR0cmlidXRlc1t2aWV3TmFtZV0pIHtcbiAgICAgICAgICAgIHZhbHVlID0gJyc7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3JlbGF0ZScgJiYgc291cmNlID09PSAnbm9uLWRiJyAmJiBybmFtZSAhPT0gJycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gcmVjb3JkLmF0dHJpYnV0ZXNbdmlld05hbWVdW3JuYW1lXTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlT2JqZWN0ID0gcmVjb3JkLmF0dHJpYnV0ZXNbdmlld05hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIHt2YWx1ZSwgdmFsdWVMaXN0LCB2YWx1ZU9iamVjdH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHJlY29yZC5hdHRyaWJ1dGVzW3ZpZXdOYW1lXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlID09PSAnbGluZS1pdGVtcycpIHtcbiAgICAgICAgICAgIHJldHVybiB7dmFsdWU6IG51bGwsIHZhbHVlTGlzdH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbHVlTGlzdCA9IHZhbHVlO1xuICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF2YWx1ZSAmJiBkZWZpbml0aW9uLmRlZmF1bHQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gZGVmaW5pdGlvbi5kZWZhdWx0O1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHt2YWx1ZSwgdmFsdWVMaXN0fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhbmQgaW5pdGlhbGl6ZSBmaWVsZCBvYmplY3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2R1bGUgdG8gdXNlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHZpZXdGaWVsZCBWaWV3RmllbGREZWZpbml0aW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIHN0cmluZ1xuICAgICAqIEBwYXJhbSB7W119IHZhbHVlTGlzdCBzdHJpbmdbXVxuICAgICAqIEBwYXJhbSB7fSB2YWx1ZU9iamVjdCB2YWx1ZSBvYmplY3RcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkIFJlY29yZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkZWZpbml0aW9uIEZpZWxkRGVmaW5pdGlvblxuICAgICAqIEBwYXJhbSB7W119IHZhbGlkYXRvcnMgVmFsaWRhdG9yRm5bXVxuICAgICAqIEBwYXJhbSB7W119IGFzeW5jVmFsaWRhdG9ycyBBc3luY1ZhbGlkYXRvckZuW11cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbGFuZ3VhZ2UgTGFuZ3VhZ2VTdG9yZVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IEJhc2VGaWVsZFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBzZXR1cEZpZWxkKFxuICAgICAgICBtb2R1bGU6IHN0cmluZyxcbiAgICAgICAgdmlld0ZpZWxkOiBWaWV3RmllbGREZWZpbml0aW9uLFxuICAgICAgICB2YWx1ZTogc3RyaW5nLFxuICAgICAgICB2YWx1ZUxpc3Q6IHN0cmluZ1tdLFxuICAgICAgICB2YWx1ZU9iamVjdDogYW55LFxuICAgICAgICByZWNvcmQ6IFJlY29yZCxcbiAgICAgICAgZGVmaW5pdGlvbjogRmllbGREZWZpbml0aW9uLFxuICAgICAgICB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdLFxuICAgICAgICBhc3luY1ZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm5bXSxcbiAgICAgICAgbGFuZ3VhZ2U6IExhbmd1YWdlU3RvcmVcbiAgICApOiBCYXNlRmllbGQge1xuXG4gICAgICAgIGNvbnN0IGZvcm1hdHRlZFZhbHVlID0gdGhpcy50eXBlRm9ybWF0dGVyLnRvVXNlckZvcm1hdCh2aWV3RmllbGQudHlwZSwgdmFsdWUsIHttb2RlOiAnZWRpdCd9KTtcblxuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHZpZXdGaWVsZC5tZXRhZGF0YSB8fCBkZWZpbml0aW9uLm1ldGFkYXRhIHx8IHt9O1xuXG4gICAgICAgIGlmICh2aWV3RmllbGQubGluaykge1xuICAgICAgICAgICAgbWV0YWRhdGEubGluayA9IHZpZXdGaWVsZC5saW5rO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmllbGQgPSBuZXcgQmFzZUZpZWxkKCk7XG5cbiAgICAgICAgZmllbGQudHlwZSA9IHZpZXdGaWVsZC50eXBlIHx8IGRlZmluaXRpb24udHlwZTtcbiAgICAgICAgZmllbGQubmFtZSA9IHZpZXdGaWVsZC5uYW1lIHx8IGRlZmluaXRpb24ubmFtZSB8fCAnJztcbiAgICAgICAgZmllbGQuZGlzcGxheSA9IHZpZXdGaWVsZC5kaXNwbGF5IHx8IGRlZmluaXRpb24uZGlzcGxheSB8fCAnZGVmYXVsdCc7XG4gICAgICAgIGZpZWxkLmRlZmF1bHREaXNwbGF5ID0gZmllbGQuZGlzcGxheTtcbiAgICAgICAgZmllbGQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgZmllbGQubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgZmllbGQuZGVmaW5pdGlvbiA9IGRlZmluaXRpb247XG4gICAgICAgIGZpZWxkLmxhYmVsS2V5ID0gdmlld0ZpZWxkLmxhYmVsIHx8IGRlZmluaXRpb24udm5hbWUgfHwgJyc7XG5cbiAgICAgICAgZmllbGQudmFsaWRhdG9ycyA9IHZhbGlkYXRvcnM7XG4gICAgICAgIGZpZWxkLmFzeW5jVmFsaWRhdG9ycyA9IGFzeW5jVmFsaWRhdG9ycztcblxuICAgICAgICBpZiAoZmllbGQudHlwZSA9PT0gJ2xpbmUtaXRlbXMnKSB7XG4gICAgICAgICAgICBmaWVsZC52YWx1ZU9iamVjdEFycmF5ID0gcmVjb3JkLmF0dHJpYnV0ZXNbZmllbGQubmFtZV07XG4gICAgICAgICAgICBmaWVsZC5pdGVtRm9ybUFycmF5ID0gbmV3IEZvcm1BcnJheShbXSwgdmFsaWRhdG9ycywgYXN5bmNWYWxpZGF0b3JzKTtcbiAgICAgICAgICAgIGZpZWxkLmZvcm1Db250cm9sID0gbmV3IEZvcm1Db250cm9sKGZvcm1hdHRlZFZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpZWxkLmZvcm1Db250cm9sID0gbmV3IEZvcm1Db250cm9sKGZvcm1hdHRlZFZhbHVlLCB2YWxpZGF0b3JzLCBhc3luY1ZhbGlkYXRvcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZmllbGQuYXR0cmlidXRlcyA9IHt9O1xuICAgICAgICBmaWVsZC5zb3VyY2UgPSAnZmllbGQnO1xuICAgICAgICBmaWVsZC5sb2dpYyA9IHZpZXdGaWVsZC5sb2dpYyB8fCBkZWZpbml0aW9uLmxvZ2ljIHx8IG51bGw7XG5cbiAgICAgICAgaWYgKGZpZWxkLmxvZ2ljICYmIE9iamVjdC5rZXlzKGZpZWxkLmxvZ2ljKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZURlcGVuZGVuY2llczogeyBba2V5OiBzdHJpbmddOiBBdHRyaWJ1dGVEZXBlbmRlbmN5IH0gPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkRGVwZW5kZW5jaWVzOiBTdHJpbmdNYXAgPSB7fTtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoZmllbGQubG9naWMpLmZvckVhY2gobG9naWNLZXkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gZmllbGQubG9naWNbbG9naWNLZXldIHx8IHt9IGFzIEZpZWxkTG9naWM7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWVudHJ5LnBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGVudHJ5LnBhcmFtcyAmJiBlbnRyeS5wYXJhbXMuYXR0cmlidXRlRGVwZW5kZW5jaWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5LnBhcmFtcy5hdHRyaWJ1dGVEZXBlbmRlbmNpZXMuZm9yRWFjaChkZXBlbmRlbmN5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlcGVuZGVuY3lLZXkgPSBkZXBlbmRlbmN5LmZpZWxkICsgJy4nICsgZGVwZW5kZW5jeS5hdHRyaWJ1dGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVEZXBlbmRlbmNpZXNbZGVwZW5kZW5jeUtleV0gPSBkZXBlbmRlbmN5O1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChlbnRyeS5wYXJhbXMgJiYgZW50cnkucGFyYW1zLmZpZWxkRGVwZW5kZW5jaWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGVudHJ5LnBhcmFtcy5maWVsZERlcGVuZGVuY2llcy5mb3JFYWNoKGRlcGVuZGVuY3kgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV0gPSBkZXBlbmRlbmN5O1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmaWVsZC5hdHRyaWJ1dGVEZXBlbmRlbmNpZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVEZXBlbmRlbmNpZXMpLm1hcChrZXkgPT4gYXR0cmlidXRlRGVwZW5kZW5jaWVzW2tleV0pO1xuICAgICAgICAgICAgZmllbGQuZmllbGREZXBlbmRlbmNpZXMgPSBPYmplY3Qua2V5cyhmaWVsZERlcGVuZGVuY2llcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWVMaXN0KSB7XG4gICAgICAgICAgICBmaWVsZC52YWx1ZUxpc3QgPSB2YWx1ZUxpc3Q7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWVPYmplY3QpIHtcbiAgICAgICAgICAgIGZpZWxkLnZhbHVlT2JqZWN0ID0gdmFsdWVPYmplY3Q7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIGZpZWxkLmxhYmVsID0gdGhpcy5nZXRGaWVsZExhYmVsKHZpZXdGaWVsZC5sYWJlbCwgbW9kdWxlLCBsYW5ndWFnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWZpZWxkLmxhYmVsS2V5ICYmIHZpZXdGaWVsZC5sYWJlbCkge1xuICAgICAgICAgICAgZmllbGQubGFiZWxLZXkgPSB2aWV3RmllbGQubGFiZWw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpZWxkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBzYXZlIHZhbGlkYXRvcnMgZm9yIHRoZSBnaXZlbiBmaWVsZCBkZWZpbml0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkIFJlY29yZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB2aWV3RmllbGQgVmlld0ZpZWxkRGVmaW5pdGlvblxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IFZhbGlkYXRvciBtYXBcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0U2F2ZVZhbGlkYXRvcnMoXG4gICAgICAgIHJlY29yZDogUmVjb3JkLFxuICAgICAgICB2aWV3RmllbGQ6IFZpZXdGaWVsZERlZmluaXRpb25cbiAgICApOiB7IHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW107IGFzeW5jVmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbltdIH0ge1xuXG4gICAgICAgIGNvbnN0IHZhbGlkYXRvcnMgPSB0aGlzLnZhbGlkYXRpb25NYW5hZ2VyLmdldFNhdmVWYWxpZGF0aW9ucyhyZWNvcmQubW9kdWxlLCB2aWV3RmllbGQsIHJlY29yZCk7XG4gICAgICAgIGNvbnN0IGFzeW5jVmFsaWRhdG9ycyA9IHRoaXMudmFsaWRhdGlvbk1hbmFnZXIuZ2V0QXN5bmNTYXZlVmFsaWRhdGlvbnMocmVjb3JkLm1vZHVsZSwgdmlld0ZpZWxkLCByZWNvcmQpO1xuICAgICAgICByZXR1cm4ge3ZhbGlkYXRvcnMsIGFzeW5jVmFsaWRhdG9yc307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IGF0dHJpYnV0ZSB2YWx1ZSBvbiBwYXJlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWNvcmQgUmVjb3JkXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGZpZWxkIEZpZWxkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgU3RyaW5nXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRlZmluaXRpb24gRmllbGREZWZpbml0aW9uXG4gICAgICogQHJldHVybnMgYW55XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldFBhcmVudFZhbHVlKHJlY29yZDogUmVjb3JkLCBmaWVsZDogRmllbGQsIG5hbWU6IHN0cmluZywgZGVmaW5pdGlvbjogRmllbGREZWZpbml0aW9uKTogYW55IHtcbiAgICAgICAgY29uc3QgdmFsdWVQYXJlbnQgPSBkZWZpbml0aW9uLnZhbHVlUGFyZW50ID8/ICdmaWVsZCc7XG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHZhbHVlUGFyZW50ID09PSAncmVjb3JkJyA/IHJlY29yZCA6IGZpZWxkO1xuXG4gICAgICAgIGlmIChkZWZpbml0aW9uLnZhbHVlUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldChwYXJlbnQsIGRlZmluaXRpb24udmFsdWVQYXRoLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWVQYXJlbnQgPT09ICdyZWNvcmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0KHJlY29yZC5hdHRyaWJ1dGVzLCBuYW1lLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2V0KGZpZWxkLnZhbHVlT2JqZWN0LCBuYW1lLCAnJyk7XG4gICAgfVxuXG59XG4iXX0=