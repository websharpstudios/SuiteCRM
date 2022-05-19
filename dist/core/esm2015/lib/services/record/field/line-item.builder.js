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
import { deepClone } from 'common';
import { ValidationManager } from '../validation/validation.manager';
import { DataTypeFormatter } from '../../formatters/data-type.formatter.service';
import { Injectable } from '@angular/core';
import { AttributeBuilder } from './attribute.builder';
import { FormGroup } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "../validation/validation.manager";
import * as i2 from "../../formatters/data-type.formatter.service";
export class LineItemBuilder extends AttributeBuilder {
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
     * @param {function} buildLineItemFunction
     */
    addLineItems(record, fields, viewField, language, buildLineItemFunction) {
        const fieldKeys = Object.keys(fields) || [];
        if (fieldKeys.length < 1) {
            return;
        }
        fieldKeys.forEach(key => {
            const field = fields[key];
            this.addFieldLineItems(record, field, language, buildLineItemFunction);
        });
    }
    /**
     * Create and add attributes fields to field
     *
     * @param {object} record Record
     * @param {object} field Field
     * @param {object} language LanguageStore
     * @param {function} buildLineItemFunction
     */
    addFieldLineItems(record, field, language, buildLineItemFunction) {
        const definition = (field && field.definition) || {};
        const type = (field && field.type) || '';
        const items = (field.valueObjectArray && field.valueObjectArray) || [];
        if (type !== 'line-items' || !items.length) {
            return;
        }
        const itemDefinition = (definition.lineItems && definition.lineItems.definition) || {};
        field.items = [];
        items.forEach(item => {
            this.addLineItem(itemDefinition, item, buildLineItemFunction, language, record, field);
        });
    }
    /**
     * Build line item and and to record
     * @param {object} itemDefinition
     * @param {object }item
     * @param {object} buildLineItemFunction
     * @param {object} language
     * @param {object} parentRecord
     * @param {object} parentField
     */
    addLineItem(itemDefinition, item, buildLineItemFunction, language, parentRecord, parentField) {
        const itemViewField = {
            name: itemDefinition.name,
            label: itemDefinition.vname,
            type: itemDefinition.type,
            fieldDefinition: deepClone(itemDefinition)
        };
        const itemRecord = {
            id: item.id || '',
            type: item.type || '',
            module: item.module || '',
            attributes: item.attributes || {},
            fields: {},
            formGroup: new FormGroup({})
        };
        buildLineItemFunction(itemRecord, itemViewField, language);
        parentField.itemFormArray.push(itemRecord.formGroup);
        parentField.items.push(itemRecord);
    }
}
LineItemBuilder.ɵprov = i0.ɵɵdefineInjectable({ factory: function LineItemBuilder_Factory() { return new LineItemBuilder(i0.ɵɵinject(i1.ValidationManager), i0.ɵɵinject(i2.DataTypeFormatter)); }, token: LineItemBuilder, providedIn: "root" });
LineItemBuilder.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
LineItemBuilder.ctorParameters = () => [
    { type: ValidationManager },
    { type: DataTypeFormatter }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS1pdGVtLmJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc2VydmljZXMvcmVjb3JkL2ZpZWxkL2xpbmUtaXRlbS5idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFnRSxNQUFNLFFBQVEsQ0FBQztBQUVoRyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUNuRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUMvRSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQUt6QyxNQUFNLE9BQU8sZUFBZ0IsU0FBUSxnQkFBZ0I7SUFFakQsWUFDYyxpQkFBb0MsRUFDcEMsYUFBZ0M7UUFFMUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBSDlCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDcEMsa0JBQWEsR0FBYixhQUFhLENBQW1CO0lBRzlDLENBQUM7SUFHRDs7Ozs7Ozs7T0FRRztJQUNJLFlBQVksQ0FDZixNQUFjLEVBQ2QsTUFBZ0IsRUFDaEIsU0FBOEIsRUFDOUIsUUFBdUIsRUFDdkIscUJBQStCO1FBRS9CLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRzVDLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdEIsT0FBTztTQUNWO1FBRUQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLGlCQUFpQixDQUNsQixNQUFNLEVBQ04sS0FBSyxFQUNMLFFBQVEsRUFDUixxQkFBcUIsQ0FDeEIsQ0FBQTtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxpQkFBaUIsQ0FDcEIsTUFBYyxFQUNkLEtBQVksRUFDWixRQUF1QixFQUN2QixxQkFBK0I7UUFHL0IsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyRCxNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pDLE1BQU0sS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLGdCQUFnQixJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUV2RSxJQUFJLElBQUksS0FBSyxZQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ3hDLE9BQU87U0FDVjtRQUVELE1BQU0sY0FBYyxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2RixLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUVqQixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLElBQWMsRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JHLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ksV0FBVyxDQUNkLGNBQStCLEVBQy9CLElBQVksRUFDWixxQkFBK0IsRUFDL0IsUUFBdUIsRUFDdkIsWUFBb0IsRUFDcEIsV0FBa0I7UUFHbEIsTUFBTSxhQUFhLEdBQUc7WUFDbEIsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJO1lBQ3pCLEtBQUssRUFBRSxjQUFjLENBQUMsS0FBSztZQUMzQixJQUFJLEVBQUUsY0FBYyxDQUFDLElBQUk7WUFDekIsZUFBZSxFQUFFLFNBQVMsQ0FBQyxjQUFjLENBQUM7U0FDN0MsQ0FBQztRQUVGLE1BQU0sVUFBVSxHQUFHO1lBQ2YsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRTtZQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO1lBQ3JCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUU7WUFDekIsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRTtZQUNqQyxNQUFNLEVBQUUsRUFBRTtZQUNWLFNBQVMsRUFBRSxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUM7U0FDckIsQ0FBQztRQUVaLHFCQUFxQixDQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFM0QsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXJELFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Ozs7WUF0SEosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFSTyxpQkFBaUI7WUFDakIsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge2RlZXBDbG9uZSwgRmllbGQsIEZpZWxkRGVmaW5pdGlvbiwgRmllbGRNYXAsIFJlY29yZCwgVmlld0ZpZWxkRGVmaW5pdGlvbn0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZX0gZnJvbSAnLi4vLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtWYWxpZGF0aW9uTWFuYWdlcn0gZnJvbSAnLi4vdmFsaWRhdGlvbi92YWxpZGF0aW9uLm1hbmFnZXInO1xuaW1wb3J0IHtEYXRhVHlwZUZvcm1hdHRlcn0gZnJvbSAnLi4vLi4vZm9ybWF0dGVycy9kYXRhLXR5cGUuZm9ybWF0dGVyLnNlcnZpY2UnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QXR0cmlidXRlQnVpbGRlcn0gZnJvbSAnLi9hdHRyaWJ1dGUuYnVpbGRlcic7XG5pbXBvcnQge0Zvcm1Hcm91cH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIExpbmVJdGVtQnVpbGRlciBleHRlbmRzIEF0dHJpYnV0ZUJ1aWxkZXIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCB2YWxpZGF0aW9uTWFuYWdlcjogVmFsaWRhdGlvbk1hbmFnZXIsXG4gICAgICAgIHByb3RlY3RlZCB0eXBlRm9ybWF0dGVyOiBEYXRhVHlwZUZvcm1hdHRlclxuICAgICkge1xuICAgICAgICBzdXBlcih2YWxpZGF0aW9uTWFuYWdlciwgdHlwZUZvcm1hdHRlcik7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW5kIGFkZCBhdHRyaWJ1dGVzIGZpZWxkcyB0byBmaWVsZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlY29yZCBSZWNvcmRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZmllbGRzIEZpZWxkTWFwXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHZpZXdGaWVsZCBWaWV3RmllbGREZWZpbml0aW9uXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGxhbmd1YWdlIExhbmd1YWdlU3RvcmVcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBidWlsZExpbmVJdGVtRnVuY3Rpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkTGluZUl0ZW1zKFxuICAgICAgICByZWNvcmQ6IFJlY29yZCxcbiAgICAgICAgZmllbGRzOiBGaWVsZE1hcCxcbiAgICAgICAgdmlld0ZpZWxkOiBWaWV3RmllbGREZWZpbml0aW9uLFxuICAgICAgICBsYW5ndWFnZTogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgYnVpbGRMaW5lSXRlbUZ1bmN0aW9uOiBGdW5jdGlvbixcbiAgICApOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZmllbGRLZXlzID0gT2JqZWN0LmtleXMoZmllbGRzKSB8fCBbXTtcblxuXG4gICAgICAgIGlmIChmaWVsZEtleXMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZmllbGRLZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gZmllbGRzW2tleV07XG4gICAgICAgICAgICB0aGlzLmFkZEZpZWxkTGluZUl0ZW1zKFxuICAgICAgICAgICAgICAgIHJlY29yZCxcbiAgICAgICAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICAgICAgICBsYW5ndWFnZSxcbiAgICAgICAgICAgICAgICBidWlsZExpbmVJdGVtRnVuY3Rpb24sXG4gICAgICAgICAgICApXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuZCBhZGQgYXR0cmlidXRlcyBmaWVsZHMgdG8gZmllbGRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWNvcmQgUmVjb3JkXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGZpZWxkIEZpZWxkXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGxhbmd1YWdlIExhbmd1YWdlU3RvcmVcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBidWlsZExpbmVJdGVtRnVuY3Rpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkRmllbGRMaW5lSXRlbXMoXG4gICAgICAgIHJlY29yZDogUmVjb3JkLFxuICAgICAgICBmaWVsZDogRmllbGQsXG4gICAgICAgIGxhbmd1YWdlOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICBidWlsZExpbmVJdGVtRnVuY3Rpb246IEZ1bmN0aW9uLFxuICAgICk6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IGRlZmluaXRpb24gPSAoZmllbGQgJiYgZmllbGQuZGVmaW5pdGlvbikgfHwge307XG4gICAgICAgIGNvbnN0IHR5cGUgPSAoZmllbGQgJiYgZmllbGQudHlwZSkgfHwgJyc7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gKGZpZWxkLnZhbHVlT2JqZWN0QXJyYXkgJiYgZmllbGQudmFsdWVPYmplY3RBcnJheSkgfHwgW107XG5cbiAgICAgICAgaWYgKHR5cGUgIT09ICdsaW5lLWl0ZW1zJyB8fCAhaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpdGVtRGVmaW5pdGlvbiA9IChkZWZpbml0aW9uLmxpbmVJdGVtcyAmJiBkZWZpbml0aW9uLmxpbmVJdGVtcy5kZWZpbml0aW9uKSB8fCB7fTtcbiAgICAgICAgZmllbGQuaXRlbXMgPSBbXTtcblxuICAgICAgICBpdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRMaW5lSXRlbShpdGVtRGVmaW5pdGlvbiwgaXRlbSBhcyBSZWNvcmQsIGJ1aWxkTGluZUl0ZW1GdW5jdGlvbiwgbGFuZ3VhZ2UsIHJlY29yZCwgZmllbGQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBsaW5lIGl0ZW0gYW5kIGFuZCB0byByZWNvcmRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gaXRlbURlZmluaXRpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdCB9aXRlbVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBidWlsZExpbmVJdGVtRnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbGFuZ3VhZ2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyZW50UmVjb3JkXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmVudEZpZWxkXG4gICAgICovXG4gICAgcHVibGljIGFkZExpbmVJdGVtKFxuICAgICAgICBpdGVtRGVmaW5pdGlvbjogRmllbGREZWZpbml0aW9uLFxuICAgICAgICBpdGVtOiBSZWNvcmQsXG4gICAgICAgIGJ1aWxkTGluZUl0ZW1GdW5jdGlvbjogRnVuY3Rpb24sXG4gICAgICAgIGxhbmd1YWdlOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICBwYXJlbnRSZWNvcmQ6IFJlY29yZCxcbiAgICAgICAgcGFyZW50RmllbGQ6IEZpZWxkXG4gICAgKSB7XG5cbiAgICAgICAgY29uc3QgaXRlbVZpZXdGaWVsZCA9IHtcbiAgICAgICAgICAgIG5hbWU6IGl0ZW1EZWZpbml0aW9uLm5hbWUsXG4gICAgICAgICAgICBsYWJlbDogaXRlbURlZmluaXRpb24udm5hbWUsXG4gICAgICAgICAgICB0eXBlOiBpdGVtRGVmaW5pdGlvbi50eXBlLFxuICAgICAgICAgICAgZmllbGREZWZpbml0aW9uOiBkZWVwQ2xvbmUoaXRlbURlZmluaXRpb24pXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaXRlbVJlY29yZCA9IHtcbiAgICAgICAgICAgIGlkOiBpdGVtLmlkIHx8ICcnLFxuICAgICAgICAgICAgdHlwZTogaXRlbS50eXBlIHx8ICcnLFxuICAgICAgICAgICAgbW9kdWxlOiBpdGVtLm1vZHVsZSB8fCAnJyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGl0ZW0uYXR0cmlidXRlcyB8fCB7fSxcbiAgICAgICAgICAgIGZpZWxkczoge30sXG4gICAgICAgICAgICBmb3JtR3JvdXA6IG5ldyBGb3JtR3JvdXAoe30pXG4gICAgICAgIH0gYXMgUmVjb3JkO1xuXG4gICAgICAgIGJ1aWxkTGluZUl0ZW1GdW5jdGlvbihpdGVtUmVjb3JkLCBpdGVtVmlld0ZpZWxkLCBsYW5ndWFnZSk7XG5cbiAgICAgICAgcGFyZW50RmllbGQuaXRlbUZvcm1BcnJheS5wdXNoKGl0ZW1SZWNvcmQuZm9ybUdyb3VwKTtcblxuICAgICAgICBwYXJlbnRGaWVsZC5pdGVtcy5wdXNoKGl0ZW1SZWNvcmQpO1xuICAgIH1cbn1cbiJdfQ==