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
import { DataTypeFormatter } from '../formatters/data-type.formatter.service';
import { isVoid } from 'common';
import { LanguageStore } from '../../store/language/language.store';
import get from 'lodash-es/get';
import * as i0 from "@angular/core";
import * as i1 from "../formatters/data-type.formatter.service";
import * as i2 from "../../store/language/language.store";
export class DynamicLabelService {
    constructor(typeFormatter, language) {
        this.typeFormatter = typeFormatter;
        this.language = language;
        this.valuePipes = {};
        this.fieldPipes = {};
        this.valuePipes.int = (value) => this.valueTypeFormat('int', value);
        this.valuePipes.float = (value) => this.valueTypeFormat('float', value);
        this.valuePipes.date = (value) => this.valueTypeFormat('date', value);
        this.valuePipes.datetime = (value) => this.valueTypeFormat('datetime', value);
        this.valuePipes.currency = (value) => this.valueTypeFormat('currency', value);
        this.valuePipes.phone = (value) => this.valueTypeFormat('phone', value);
        this.fieldPipes.int = (value) => this.fieldTypeFormat('int', value);
        this.fieldPipes.float = (value) => this.fieldTypeFormat('float', value);
        this.fieldPipes.date = (value) => this.fieldTypeFormat('date', value);
        this.fieldPipes.datetime = (value) => this.fieldTypeFormat('datetime', value);
        this.fieldPipes.currency = (value) => this.fieldTypeFormat('currency', value);
        this.fieldPipes.phone = (value) => this.fieldTypeFormat('phone', value);
        this.fieldPipes.enum = (value) => this.enumFormat(value);
        this.fieldPipes.dynamicenum = (value) => this.enumFormat(value);
        this.fieldPipes.multienum = (value) => this.multiEnumFormat(value);
    }
    addValuePipe(name, processor) {
        this.valuePipes[name] = processor;
    }
    addFieldPipe(name, processor) {
        this.fieldPipes[name] = processor;
    }
    parse(template, context, fields) {
        if (!template) {
            return template;
        }
        const regex = /({{[\s\S]+?}})/g;
        const matches = template.match(regex);
        if (!matches || matches.length < 1) {
            return template;
        }
        let parsedTemplate = template;
        const module = (context && context.module) || '';
        matches.forEach((regexMatch) => {
            if (!parsedTemplate.includes(regexMatch)) {
                return;
            }
            let filter = '';
            let value = '';
            let source = 'context';
            let parts = [];
            let variableName = '' + regexMatch;
            variableName = variableName.replace('{{', '');
            variableName = variableName.replace('}}', '');
            variableName = variableName.trim();
            let path = variableName;
            if (variableName.includes('|')) {
                const [name, pipe] = variableName.split('|');
                filter = pipe.trim();
                variableName = name.trim();
                path = name.trim();
            }
            if (variableName.includes('.')) {
                parts = variableName.split('.');
                source = parts[0];
                variableName = parts[1];
            }
            let sourceValues = context;
            if (source === 'fields') {
                sourceValues = fields;
            }
            if (!sourceValues || !(variableName in sourceValues)) {
                parsedTemplate = parsedTemplate.replace(regexMatch, value);
                return;
            }
            if (source === 'fields') {
                const field = fields[variableName];
                if (!field) {
                    parsedTemplate = parsedTemplate.replace(regexMatch, '');
                    return;
                }
                if (parts[2] && parts[2] === 'value' && field.type in this.fieldPipes) {
                    value = this.fieldPipes[field.type](field);
                    parsedTemplate = parsedTemplate.replace(regexMatch, value);
                    return;
                }
                if (parts[2] && parts[2] === 'label') {
                    value = this.getFieldLabel(field.labelKey, module);
                    parsedTemplate = parsedTemplate.replace(regexMatch, value);
                    return;
                }
                value = get({ fields }, path, '');
                parsedTemplate = parsedTemplate.replace(regexMatch, value);
                return;
            }
            value = get({ context }, path, '');
            if (filter in this.valuePipes) {
                value = this.valuePipes[filter](value);
            }
            parsedTemplate = parsedTemplate.replace(regexMatch, value);
        });
        return parsedTemplate;
    }
    valueTypeFormat(type, value) {
        return this.typeFormatter.toUserFormat(type, value);
    }
    fieldTypeFormat(type, field) {
        return this.typeFormatter.toUserFormat(type, field.value);
    }
    enumFormat(field) {
        if (isVoid(field.definition.options) || isVoid(field.value)) {
            return '';
        }
        return this.language.getListLabel(field.definition.options, field.value);
    }
    multiEnumFormat(field) {
        if (isVoid(field.definition.options) || isVoid(field.valueList) || field.valueList.length < 1) {
            return '';
        }
        const result = [];
        field.valueList.forEach(value => {
            if (isVoid(value)) {
                return;
            }
            result.push(this.language.getListLabel(field.definition.options, value));
        });
        return result.join(', ');
    }
    getFieldLabel(labelKey, module = '') {
        if (isVoid(labelKey)) {
            return '';
        }
        return this.language.getFieldLabel(labelKey, module);
    }
}
DynamicLabelService.??prov = i0.????defineInjectable({ factory: function DynamicLabelService_Factory() { return new DynamicLabelService(i0.????inject(i1.DataTypeFormatter), i0.????inject(i2.LanguageStore)); }, token: DynamicLabelService, providedIn: "root" });
DynamicLabelService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
DynamicLabelService.ctorParameters = () => [
    { type: DataTypeFormatter },
    { type: LanguageStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1sYWJlbC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3NlcnZpY2VzL2xhbmd1YWdlL2R5bmFtaWMtbGFiZWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwyQ0FBMkMsQ0FBQztBQUU1RSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUVsRSxPQUFPLEdBQUcsTUFBTSxlQUFlLENBQUM7Ozs7QUF5QmhDLE1BQU0sT0FBTyxtQkFBbUI7SUFJNUIsWUFBc0IsYUFBZ0MsRUFBWSxRQUF1QjtRQUFuRSxrQkFBYSxHQUFiLGFBQWEsQ0FBbUI7UUFBWSxhQUFRLEdBQVIsUUFBUSxDQUFlO1FBSC9FLGVBQVUsR0FBMkIsRUFBRSxDQUFDO1FBQ3hDLGVBQVUsR0FBMkIsRUFBRSxDQUFDO1FBSTlDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBYSxFQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwRixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQWEsRUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFhLEVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3RGLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBYSxFQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5RixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxDQUFDLEtBQWEsRUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFhLEVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhGLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBWSxFQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuRixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQVksRUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFZLEVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JGLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBWSxFQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3RixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxDQUFDLEtBQVksRUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFZLEVBQVUsRUFB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LEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRVMsZUFBZSxDQUFDLEtBQVk7UUFDbEMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMzRixPQUFPLEVBQUUsQ0FBQztTQUNiO1FBRUQsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBRTVCLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzVCLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNmLE9BQU87YUFDVjtZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM3RSxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMsYUFBYSxDQUFDLFFBQWdCLEVBQUUsTUFBTSxHQUFHLEVBQUU7UUFDakQsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDbEIsT0FBTyxFQUFFLENBQUM7U0FDYjtRQUVELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELENBQUM7Ozs7WUE3S0osVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUE3Qk8saUJBQWlCO1lBR2pCLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RhdGFUeXBlRm9ybWF0dGVyfSBmcm9tICcuLi9mb3JtYXR0ZXJzL2RhdGEtdHlwZS5mb3JtYXR0ZXIuc2VydmljZSc7XG5pbXBvcnQge0ZpZWxkLCBGaWVsZE1hcH0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7aXNWb2lkfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtMYW5ndWFnZVN0b3JlfSBmcm9tICcuLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5pbXBvcnQge1N0cmluZ01hcH0gZnJvbSAnY29tbW9uJztcbmltcG9ydCBnZXQgZnJvbSAnbG9kYXNoLWVzL2dldCc7XG5cblxuZXhwb3J0IGRlY2xhcmUgdHlwZSBUZW1wbGF0ZVZhbHVlRmlsdGVyID0gKHZhbHVlOiBzdHJpbmcpID0+IHN0cmluZztcbmV4cG9ydCBkZWNsYXJlIHR5cGUgVGVtcGxhdGVGaWVsZEZpbHRlciA9ICh2YWx1ZTogRmllbGQpID0+IHN0cmluZztcblxuZXhwb3J0IGludGVyZmFjZSBUZW1wbGF0ZVZhbHVlRmlsdGVyTWFwIHtcbiAgICBba2V5OiBzdHJpbmddOiBUZW1wbGF0ZVZhbHVlRmlsdGVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRlbXBsYXRlRmllbGRGaWx0ZXJNYXAge1xuICAgIFtrZXk6IHN0cmluZ106IFRlbXBsYXRlRmllbGRGaWx0ZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHluYW1pY0xhYmVsU2VydmljZUludGVyZmFjZSB7XG4gICAgYWRkVmFsdWVQaXBlKG5hbWU6IHN0cmluZywgcHJvY2Vzc29yOiBUZW1wbGF0ZVZhbHVlRmlsdGVyKTogdm9pZDtcblxuICAgIGFkZEZpZWxkUGlwZShuYW1lOiBzdHJpbmcsIHByb2Nlc3NvcjogVGVtcGxhdGVGaWVsZEZpbHRlcik6IHZvaWQ7XG5cbiAgICBwYXJzZSh0ZW1wbGF0ZTogc3RyaW5nLCBjb250ZXh0OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9LCBmaWVsZHM6IEZpZWxkTWFwKTogc3RyaW5nO1xufVxuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIER5bmFtaWNMYWJlbFNlcnZpY2UgaW1wbGVtZW50cyBEeW5hbWljTGFiZWxTZXJ2aWNlSW50ZXJmYWNlIHtcbiAgICBwcm90ZWN0ZWQgdmFsdWVQaXBlczogVGVtcGxhdGVWYWx1ZUZpbHRlck1hcCA9IHt9O1xuICAgIHByb3RlY3RlZCBmaWVsZFBpcGVzOiBUZW1wbGF0ZUZpZWxkRmlsdGVyTWFwID0ge307XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgdHlwZUZvcm1hdHRlcjogRGF0YVR5cGVGb3JtYXR0ZXIsIHByb3RlY3RlZCBsYW5ndWFnZTogTGFuZ3VhZ2VTdG9yZSkge1xuXG4gICAgICAgIHRoaXMudmFsdWVQaXBlcy5pbnQgPSAodmFsdWU6IHN0cmluZyk6IHN0cmluZyA9PiB0aGlzLnZhbHVlVHlwZUZvcm1hdCgnaW50JywgdmFsdWUpO1xuICAgICAgICB0aGlzLnZhbHVlUGlwZXMuZmxvYXQgPSAodmFsdWU6IHN0cmluZyk6IHN0cmluZyA9PiB0aGlzLnZhbHVlVHlwZUZvcm1hdCgnZmxvYXQnLCB2YWx1ZSk7XG4gICAgICAgIHRoaXMudmFsdWVQaXBlcy5kYXRlID0gKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcgPT4gdGhpcy52YWx1ZVR5cGVGb3JtYXQoJ2RhdGUnLCB2YWx1ZSk7XG4gICAgICAgIHRoaXMudmFsdWVQaXBlcy5kYXRldGltZSA9ICh2YWx1ZTogc3RyaW5nKTogc3RyaW5nID0+IHRoaXMudmFsdWVUeXBlRm9ybWF0KCdkYXRldGltZScsIHZhbHVlKTtcbiAgICAgICAgdGhpcy52YWx1ZVBpcGVzLmN1cnJlbmN5ID0gKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcgPT4gdGhpcy52YWx1ZVR5cGVGb3JtYXQoJ2N1cnJlbmN5JywgdmFsdWUpO1xuICAgICAgICB0aGlzLnZhbHVlUGlwZXMucGhvbmUgPSAodmFsdWU6IHN0cmluZyk6IHN0cmluZyA9PiB0aGlzLnZhbHVlVHlwZUZvcm1hdCgncGhvbmUnLCB2YWx1ZSk7XG5cbiAgICAgICAgdGhpcy5maWVsZFBpcGVzLmludCA9ICh2YWx1ZTogRmllbGQpOiBzdHJpbmcgPT4gdGhpcy5maWVsZFR5cGVGb3JtYXQoJ2ludCcsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5maWVsZFBpcGVzLmZsb2F0ID0gKHZhbHVlOiBGaWVsZCk6IHN0cmluZyA9PiB0aGlzLmZpZWxkVHlwZUZvcm1hdCgnZmxvYXQnLCB2YWx1ZSk7XG4gICAgICAgIHRoaXMuZmllbGRQaXBlcy5kYXRlID0gKHZhbHVlOiBGaWVsZCk6IHN0cmluZyA9PiB0aGlzLmZpZWxkVHlwZUZvcm1hdCgnZGF0ZScsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5maWVsZFBpcGVzLmRhdGV0aW1lID0gKHZhbHVlOiBGaWVsZCk6IHN0cmluZyA9PiB0aGlzLmZpZWxkVHlwZUZvcm1hdCgnZGF0ZXRpbWUnLCB2YWx1ZSk7XG4gICAgICAgIHRoaXMuZmllbGRQaXBlcy5jdXJyZW5jeSA9ICh2YWx1ZTogRmllbGQpOiBzdHJpbmcgPT4gdGhpcy5maWVsZFR5cGVGb3JtYXQoJ2N1cnJlbmN5JywgdmFsdWUpO1xuICAgICAgICB0aGlzLmZpZWxkUGlwZXMucGhvbmUgPSAodmFsdWU6IEZpZWxkKTogc3RyaW5nID0+IHRoaXMuZmllbGRUeXBlRm9ybWF0KCdwaG9uZScsIHZhbHVlKTtcbiAgICAgICAgdGhpcy5maWVsZFBpcGVzLmVudW0gPSAodmFsdWU6IEZpZWxkKTogc3RyaW5nID0+IHRoaXMuZW51bUZvcm1hdCh2YWx1ZSk7XG4gICAgICAgIHRoaXMuZmllbGRQaXBlcy5keW5hbWljZW51bSA9ICh2YWx1ZTogRmllbGQpOiBzdHJpbmcgPT4gdGhpcy5lbnVtRm9ybWF0KHZhbHVlKTtcbiAgICAgICAgdGhpcy5maWVsZFBpcGVzLm11bHRpZW51bSA9ICh2YWx1ZTogRmllbGQpOiBzdHJpbmcgPT4gdGhpcy5tdWx0aUVudW1Gb3JtYXQodmFsdWUpO1xuICAgIH1cblxuICAgIGFkZFZhbHVlUGlwZShuYW1lOiBzdHJpbmcsIHByb2Nlc3NvcjogVGVtcGxhdGVWYWx1ZUZpbHRlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnZhbHVlUGlwZXNbbmFtZV0gPSBwcm9jZXNzb3I7XG4gICAgfVxuXG4gICAgYWRkRmllbGRQaXBlKG5hbWU6IHN0cmluZywgcHJvY2Vzc29yOiBUZW1wbGF0ZUZpZWxkRmlsdGVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZmllbGRQaXBlc1tuYW1lXSA9IHByb2Nlc3NvcjtcbiAgICB9XG5cbiAgICBwYXJzZSh0ZW1wbGF0ZTogc3RyaW5nLCBjb250ZXh0OiBTdHJpbmdNYXAsIGZpZWxkczogRmllbGRNYXApOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICghdGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gLyh7e1tcXHNcXFNdKz99fSkvZztcblxuICAgICAgICBjb25zdCBtYXRjaGVzID0gdGVtcGxhdGUubWF0Y2gocmVnZXgpO1xuXG4gICAgICAgIGlmICghbWF0Y2hlcyB8fCBtYXRjaGVzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwYXJzZWRUZW1wbGF0ZSA9IHRlbXBsYXRlO1xuXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IChjb250ZXh0ICYmIGNvbnRleHQubW9kdWxlKSB8fCAnJztcblxuICAgICAgICBtYXRjaGVzLmZvckVhY2goKHJlZ2V4TWF0Y2gpID0+IHtcblxuICAgICAgICAgICAgaWYgKCFwYXJzZWRUZW1wbGF0ZS5pbmNsdWRlcyhyZWdleE1hdGNoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGZpbHRlciA9ICcnO1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gJyc7XG4gICAgICAgICAgICBsZXQgc291cmNlID0gJ2NvbnRleHQnO1xuICAgICAgICAgICAgbGV0IHBhcnRzID0gW107XG5cbiAgICAgICAgICAgIGxldCB2YXJpYWJsZU5hbWUgPSAnJyArIHJlZ2V4TWF0Y2g7XG4gICAgICAgICAgICB2YXJpYWJsZU5hbWUgPSB2YXJpYWJsZU5hbWUucmVwbGFjZSgne3snLCAnJyk7XG4gICAgICAgICAgICB2YXJpYWJsZU5hbWUgPSB2YXJpYWJsZU5hbWUucmVwbGFjZSgnfX0nLCAnJyk7XG4gICAgICAgICAgICB2YXJpYWJsZU5hbWUgPSB2YXJpYWJsZU5hbWUudHJpbSgpO1xuXG4gICAgICAgICAgICBsZXQgcGF0aCA9IHZhcmlhYmxlTmFtZTtcblxuICAgICAgICAgICAgaWYgKHZhcmlhYmxlTmFtZS5pbmNsdWRlcygnfCcpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgW25hbWUsIHBpcGVdID0gdmFyaWFibGVOYW1lLnNwbGl0KCd8Jyk7XG4gICAgICAgICAgICAgICAgZmlsdGVyID0gcGlwZS50cmltKCk7XG4gICAgICAgICAgICAgICAgdmFyaWFibGVOYW1lID0gbmFtZS50cmltKCk7XG4gICAgICAgICAgICAgICAgcGF0aCA9IG5hbWUudHJpbSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodmFyaWFibGVOYW1lLmluY2x1ZGVzKCcuJykpIHtcbiAgICAgICAgICAgICAgICBwYXJ0cyA9IHZhcmlhYmxlTmFtZS5zcGxpdCgnLicpO1xuICAgICAgICAgICAgICAgIHNvdXJjZSA9IHBhcnRzWzBdO1xuICAgICAgICAgICAgICAgIHZhcmlhYmxlTmFtZSA9IHBhcnRzWzFdO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGxldCBzb3VyY2VWYWx1ZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgRmllbGQgfSA9IGNvbnRleHQ7XG4gICAgICAgICAgICBpZiAoc291cmNlID09PSAnZmllbGRzJykge1xuICAgICAgICAgICAgICAgIHNvdXJjZVZhbHVlcyA9IGZpZWxkcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFzb3VyY2VWYWx1ZXMgfHwgISh2YXJpYWJsZU5hbWUgaW4gc291cmNlVmFsdWVzKSkge1xuICAgICAgICAgICAgICAgIHBhcnNlZFRlbXBsYXRlID0gcGFyc2VkVGVtcGxhdGUucmVwbGFjZShyZWdleE1hdGNoLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc291cmNlID09PSAnZmllbGRzJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gZmllbGRzW3ZhcmlhYmxlTmFtZV07XG5cbiAgICAgICAgICAgICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnNlZFRlbXBsYXRlID0gcGFyc2VkVGVtcGxhdGUucmVwbGFjZShyZWdleE1hdGNoLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocGFydHNbMl0gJiYgcGFydHNbMl0gPT09ICd2YWx1ZScgJiYgZmllbGQudHlwZSBpbiB0aGlzLmZpZWxkUGlwZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmZpZWxkUGlwZXNbZmllbGQudHlwZV0oZmllbGQpO1xuICAgICAgICAgICAgICAgICAgICBwYXJzZWRUZW1wbGF0ZSA9IHBhcnNlZFRlbXBsYXRlLnJlcGxhY2UocmVnZXhNYXRjaCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHBhcnRzWzJdICYmIHBhcnRzWzJdID09PSAnbGFiZWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5nZXRGaWVsZExhYmVsKGZpZWxkLmxhYmVsS2V5LCBtb2R1bGUpO1xuICAgICAgICAgICAgICAgICAgICBwYXJzZWRUZW1wbGF0ZSA9IHBhcnNlZFRlbXBsYXRlLnJlcGxhY2UocmVnZXhNYXRjaCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBnZXQoe2ZpZWxkc30sIHBhdGgsICcnKTtcblxuICAgICAgICAgICAgICAgIHBhcnNlZFRlbXBsYXRlID0gcGFyc2VkVGVtcGxhdGUucmVwbGFjZShyZWdleE1hdGNoLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWx1ZSA9IGdldCh7Y29udGV4dH0sIHBhdGgsICcnKTtcblxuICAgICAgICAgICAgaWYgKGZpbHRlciBpbiB0aGlzLnZhbHVlUGlwZXMpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMudmFsdWVQaXBlc1tmaWx0ZXJdKHZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyc2VkVGVtcGxhdGUgPSBwYXJzZWRUZW1wbGF0ZS5yZXBsYWNlKHJlZ2V4TWF0Y2gsIHZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlZFRlbXBsYXRlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB2YWx1ZVR5cGVGb3JtYXQodHlwZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZUZvcm1hdHRlci50b1VzZXJGb3JtYXQodHlwZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBmaWVsZFR5cGVGb3JtYXQodHlwZTogc3RyaW5nLCBmaWVsZDogRmllbGQpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy50eXBlRm9ybWF0dGVyLnRvVXNlckZvcm1hdCh0eXBlLCBmaWVsZC52YWx1ZSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGVudW1Gb3JtYXQoZmllbGQ6IEZpZWxkKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKGlzVm9pZChmaWVsZC5kZWZpbml0aW9uLm9wdGlvbnMpIHx8IGlzVm9pZChmaWVsZC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmxhbmd1YWdlLmdldExpc3RMYWJlbChmaWVsZC5kZWZpbml0aW9uLm9wdGlvbnMsIGZpZWxkLnZhbHVlKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbXVsdGlFbnVtRm9ybWF0KGZpZWxkOiBGaWVsZCk6IHN0cmluZyB7XG4gICAgICAgIGlmIChpc1ZvaWQoZmllbGQuZGVmaW5pdGlvbi5vcHRpb25zKSB8fCBpc1ZvaWQoZmllbGQudmFsdWVMaXN0KSB8fCBmaWVsZC52YWx1ZUxpc3QubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0OiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIGZpZWxkLnZhbHVlTGlzdC5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgICAgIGlmIChpc1ZvaWQodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmxhbmd1YWdlLmdldExpc3RMYWJlbChmaWVsZC5kZWZpbml0aW9uLm9wdGlvbnMsIHZhbHVlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQuam9pbignLCAnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0RmllbGRMYWJlbChsYWJlbEtleTogc3RyaW5nLCBtb2R1bGUgPSAnJyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChpc1ZvaWQobGFiZWxLZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5sYW5ndWFnZS5nZXRGaWVsZExhYmVsKGxhYmVsS2V5LCBtb2R1bGUpO1xuICAgIH1cbn1cbiJdfQ==