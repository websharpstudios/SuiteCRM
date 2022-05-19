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
import { FieldLogicActionHandler } from '../field-logic.action';
import { RequiredValidator } from '../../../services/record/validation/validators/required.validator';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/record/validation/validators/required.validator";
export class RequiredAction extends FieldLogicActionHandler {
    constructor(requiredValidator) {
        super();
        this.requiredValidator = requiredValidator;
        this.key = 'required';
        this.modes = ['edit', 'create', 'massupdate', 'filter'];
    }
    run(data, action) {
        const record = data.record;
        const field = data.field;
        if (!record || !field) {
            return;
        }
        const activeOnFields = (action.params && action.params.activeOnFields) || {};
        const relatedFields = Object.keys(activeOnFields);
        const activeOnAttributes = (action.params && action.params.activeOnAttributes) || {};
        const relatedAttributesFields = Object.keys(activeOnAttributes);
        if (!relatedFields.length && !relatedAttributesFields.length) {
            return;
        }
        const isActive = this.isActive(relatedFields, record, activeOnFields, relatedAttributesFields, activeOnAttributes);
        let required = false;
        let validators = [...data.field.validators || []];
        if (isActive) {
            required = true;
            validators = validators.concat(this.requiredValidator.getValidator(field));
        }
        data.field.definition.required = required;
        data.field.formControl.setValidators(validators);
        data.field.formControl.updateValueAndValidity({ onlySelf: true, emitEvent: true });
        record.formGroup.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    }
    /**
     * Check if any of the configured values is currently set
     * @param {array} relatedFields
     * @param {object} record
     * @param {object} activeOnFields
     * @param {array} relatedAttributesFields
     * @param {object} activeOnAttributes
     */
    isActive(relatedFields, record, activeOnFields, relatedAttributesFields, activeOnAttributes) {
        let isActive = this.areFieldsActive(relatedFields, record, activeOnFields);
        if (!isActive) {
            isActive = this.areAttributesActive(relatedAttributesFields, record, activeOnAttributes);
        }
        return isActive;
    }
    /**
     * Are attributes active
     * @param {array} relatedAttributesFields
     * @param {object} record
     * @param {object} activeOnAttributes
     */
    areAttributesActive(relatedAttributesFields, record, activeOnAttributes) {
        return relatedAttributesFields.some(fieldKey => {
            const fields = record.fields;
            const field = (fields && record.fields[fieldKey]) || null;
            const attributes = activeOnAttributes[fieldKey] && Object.keys(activeOnAttributes[fieldKey]);
            if (!field || !attributes || !attributes.length) {
                return;
            }
            return attributes.some(attributeKey => {
                const activeValues = activeOnAttributes[fieldKey][attributeKey];
                const attribute = field.attributes && field.attributes[attributeKey];
                if (!activeValues || !activeValues.length || !attribute) {
                    return;
                }
                return this.isValueActive(attribute, activeValues);
            });
        });
    }
    /**
     * Are fields active
     * @param {array} relatedFields
     * @param {object} record
     * @param {object} activeOnFields
     */
    areFieldsActive(relatedFields, record, activeOnFields) {
        return relatedFields.some(fieldKey => {
            const fields = record.fields;
            const field = (fields && record.fields[fieldKey]) || null;
            const activeValues = activeOnFields[fieldKey];
            if (!field || !activeValues || !activeValues.length) {
                return;
            }
            return this.isValueActive(field, activeValues);
        });
    }
    /**
     * Is value active
     * @param {object} field
     * @param {array} activeValues
     */
    isValueActive(field, activeValues) {
        let isActive = false;
        if (field.valueList && field.valueList.length) {
            field.valueList.some(value => {
                return activeValues.some(activeValue => {
                    if (activeValue === value) {
                        isActive = true;
                        return true;
                    }
                });
            });
            return isActive;
        }
        if (field.value) {
            activeValues.some(activeValue => {
                if (activeValue === field.value) {
                    isActive = true;
                }
            });
        }
        return isActive;
    }
}
RequiredAction.ɵprov = i0.ɵɵdefineInjectable({ factory: function RequiredAction_Factory() { return new RequiredAction(i0.ɵɵinject(i1.RequiredValidator)); }, token: RequiredAction, providedIn: "root" });
RequiredAction.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
RequiredAction.ctorParameters = () => [
    { type: RequiredValidator }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZWQuYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2ZpZWxkcy9maWVsZC1sb2dpYy9yZXF1aXJlZC9yZXF1aXJlZC5hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUF1Qix1QkFBdUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3BGLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1FQUFtRSxDQUFDOzs7QUFLcEcsTUFBTSxPQUFPLGNBQWUsU0FBUSx1QkFBdUI7SUFLdkQsWUFBc0IsaUJBQW9DO1FBQ3RELEtBQUssRUFBRSxDQUFDO1FBRFUsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUgxRCxRQUFHLEdBQUcsVUFBVSxDQUFDO1FBQ2pCLFVBQUssR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBZSxDQUFDO0lBSWpFLENBQUM7SUFFRCxHQUFHLENBQUMsSUFBMEIsRUFBRSxNQUFjO1FBQzFDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUV6QixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ25CLE9BQU87U0FDVjtRQUVELE1BQU0sY0FBYyxHQUFtQixDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFvQixDQUFDO1FBQy9HLE1BQU0sYUFBYSxHQUFhLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFNUQsTUFBTSxrQkFBa0IsR0FBc0Is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LEdBQUcsSUFBSSxDQUFDO3dCQUNoQixPQUFPLElBQUksQ0FBQztxQkFDZjtnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxRQUFRLENBQUM7U0FDbkI7UUFFRCxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7WUFDYixZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO2dCQUU1QixJQUFJLFdBQVcsS0FBSyxLQUFLLENBQUMsS0FBSyxFQUFFO29CQUM3QixRQUFRLEdBQUcsSUFBSSxDQUFDO2lCQUNuQjtZQUVMLENBQUMsQ0FBQyxDQUFDO1NBQ047UUFFRCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDOzs7O1lBM0pKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7O1lBSk8saUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBY3Rpb24sIEZpZWxkLCBSZWNvcmQsIFN0cmluZ0FycmF5TWFwLCBTdHJpbmdBcnJheU1hdHJpeCwgVmlld01vZGV9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge0ZpZWxkTG9naWNBY3Rpb25EYXRhLCBGaWVsZExvZ2ljQWN0aW9uSGFuZGxlcn0gZnJvbSAnLi4vZmllbGQtbG9naWMuYWN0aW9uJztcbmltcG9ydCB7UmVxdWlyZWRWYWxpZGF0b3J9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL3JlY29yZC92YWxpZGF0aW9uL3ZhbGlkYXRvcnMvcmVxdWlyZWQudmFsaWRhdG9yJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBSZXF1aXJlZEFjdGlvbiBleHRlbmRzIEZpZWxkTG9naWNBY3Rpb25IYW5kbGVyIHtcblxuICAgIGtleSA9ICdyZXF1aXJlZCc7XG4gICAgbW9kZXMgPSBbJ2VkaXQnLCAnY3JlYXRlJywgJ21hc3N1cGRhdGUnLCAnZmlsdGVyJ10gYXMgVmlld01vZGVbXTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZXF1aXJlZFZhbGlkYXRvcjogUmVxdWlyZWRWYWxpZGF0b3IpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBydW4oZGF0YTogRmllbGRMb2dpY0FjdGlvbkRhdGEsIGFjdGlvbjogQWN0aW9uKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IGRhdGEucmVjb3JkO1xuICAgICAgICBjb25zdCBmaWVsZCA9IGRhdGEuZmllbGQ7XG5cbiAgICAgICAgaWYgKCFyZWNvcmQgfHwgIWZpZWxkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhY3RpdmVPbkZpZWxkczogU3RyaW5nQXJyYXlNYXAgPSAoYWN0aW9uLnBhcmFtcyAmJiBhY3Rpb24ucGFyYW1zLmFjdGl2ZU9uRmllbGRzKSB8fCB7fSBhcyBTdHJpbmdBcnJheU1hcDtcbiAgICAgICAgY29uc3QgcmVsYXRlZEZpZWxkczogc3RyaW5nW10gPSBPYmplY3Qua2V5cyhhY3RpdmVPbkZpZWxkcyk7XG5cbiAgICAgICAgY29uc3QgYWN0aXZlT25BdHRyaWJ1dGVzOiBTdHJpbmdBcnJheU1hdHJpeCA9IChhY3Rpb24ucGFyYW1zICYmIGFjdGlvbi5wYXJhbXMuYWN0aXZlT25BdHRyaWJ1dGVzKSB8fCB7fSBhcyBTdHJpbmdBcnJheU1hdHJpeDtcbiAgICAgICAgY29uc3QgcmVsYXRlZEF0dHJpYnV0ZXNGaWVsZHM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMoYWN0aXZlT25BdHRyaWJ1dGVzKTtcblxuICAgICAgICBpZiAoIXJlbGF0ZWRGaWVsZHMubGVuZ3RoICYmICFyZWxhdGVkQXR0cmlidXRlc0ZpZWxkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gdGhpcy5pc0FjdGl2ZShyZWxhdGVkRmllbGRzLCByZWNvcmQsIGFjdGl2ZU9uRmllbGRzLCByZWxhdGVkQXR0cmlidXRlc0ZpZWxkcywgYWN0aXZlT25BdHRyaWJ1dGVzKTtcblxuICAgICAgICBsZXQgcmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IHZhbGlkYXRvcnMgPSBbLi4uZGF0YS5maWVsZC52YWxpZGF0b3JzIHx8IFtdXTtcbiAgICAgICAgaWYgKGlzQWN0aXZlKSB7XG4gICAgICAgICAgICByZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAgICB2YWxpZGF0b3JzID0gdmFsaWRhdG9ycy5jb25jYXQodGhpcy5yZXF1aXJlZFZhbGlkYXRvci5nZXRWYWxpZGF0b3IoZmllbGQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEuZmllbGQuZGVmaW5pdGlvbi5yZXF1aXJlZCA9IHJlcXVpcmVkO1xuICAgICAgICBkYXRhLmZpZWxkLmZvcm1Db250cm9sLnNldFZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gICAgICAgIGRhdGEuZmllbGQuZm9ybUNvbnRyb2wudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogdHJ1ZX0pO1xuICAgICAgICByZWNvcmQuZm9ybUdyb3VwLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IHRydWV9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBhbnkgb2YgdGhlIGNvbmZpZ3VyZWQgdmFsdWVzIGlzIGN1cnJlbnRseSBzZXRcbiAgICAgKiBAcGFyYW0ge2FycmF5fSByZWxhdGVkRmllbGRzXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlY29yZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhY3RpdmVPbkZpZWxkc1xuICAgICAqIEBwYXJhbSB7YXJyYXl9IHJlbGF0ZWRBdHRyaWJ1dGVzRmllbGRzXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGFjdGl2ZU9uQXR0cmlidXRlc1xuICAgICAqL1xuICAgIHByb3RlY3RlZCBpc0FjdGl2ZShcbiAgICAgICAgcmVsYXRlZEZpZWxkczogc3RyaW5nW10sXG4gICAgICAgIHJlY29yZDogUmVjb3JkLFxuICAgICAgICBhY3RpdmVPbkZpZWxkczogU3RyaW5nQXJyYXlNYXAsXG4gICAgICAgIHJlbGF0ZWRBdHRyaWJ1dGVzRmllbGRzOiBzdHJpbmdbXSxcbiAgICAgICAgYWN0aXZlT25BdHRyaWJ1dGVzOiBTdHJpbmdBcnJheU1hdHJpeFxuICAgICkge1xuICAgICAgICBsZXQgaXNBY3RpdmUgPSB0aGlzLmFyZUZpZWxkc0FjdGl2ZShyZWxhdGVkRmllbGRzLCByZWNvcmQsIGFjdGl2ZU9uRmllbGRzKTtcblxuICAgICAgICBpZiAoIWlzQWN0aXZlKSB7XG4gICAgICAgICAgICBpc0FjdGl2ZSA9IHRoaXMuYXJlQXR0cmlidXRlc0FjdGl2ZShyZWxhdGVkQXR0cmlidXRlc0ZpZWxkcywgcmVjb3JkLCBhY3RpdmVPbkF0dHJpYnV0ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzQWN0aXZlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFyZSBhdHRyaWJ1dGVzIGFjdGl2ZVxuICAgICAqIEBwYXJhbSB7YXJyYXl9IHJlbGF0ZWRBdHRyaWJ1dGVzRmllbGRzXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlY29yZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhY3RpdmVPbkF0dHJpYnV0ZXNcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXJlQXR0cmlidXRlc0FjdGl2ZShcbiAgICAgICAgcmVsYXRlZEF0dHJpYnV0ZXNGaWVsZHM6IHN0cmluZ1tdLFxuICAgICAgICByZWNvcmQ6IFJlY29yZCxcbiAgICAgICAgYWN0aXZlT25BdHRyaWJ1dGVzOiBTdHJpbmdBcnJheU1hdHJpeFxuICAgICk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gcmVsYXRlZEF0dHJpYnV0ZXNGaWVsZHMuc29tZShmaWVsZEtleSA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpZWxkcyA9IHJlY29yZC5maWVsZHM7XG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9IChmaWVsZHMgJiYgcmVjb3JkLmZpZWxkc1tmaWVsZEtleV0pIHx8IG51bGw7XG4gICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gYWN0aXZlT25BdHRyaWJ1dGVzW2ZpZWxkS2V5XSAmJiBPYmplY3Qua2V5cyhhY3RpdmVPbkF0dHJpYnV0ZXNbZmllbGRLZXldKTtcbiAgICAgICAgICAgIGlmICghZmllbGQgfHwgIWF0dHJpYnV0ZXMgfHwgIWF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlcy5zb21lKGF0dHJpYnV0ZUtleSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlVmFsdWVzID0gYWN0aXZlT25BdHRyaWJ1dGVzW2ZpZWxkS2V5XVthdHRyaWJ1dGVLZXldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGZpZWxkLmF0dHJpYnV0ZXMgJiYgZmllbGQuYXR0cmlidXRlc1thdHRyaWJ1dGVLZXldO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFhY3RpdmVWYWx1ZXMgfHwgIWFjdGl2ZVZhbHVlcy5sZW5ndGggfHwgIWF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWx1ZUFjdGl2ZShhdHRyaWJ1dGUsIGFjdGl2ZVZhbHVlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXJlIGZpZWxkcyBhY3RpdmVcbiAgICAgKiBAcGFyYW0ge2FycmF5fSByZWxhdGVkRmllbGRzXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlY29yZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhY3RpdmVPbkZpZWxkc1xuICAgICAqL1xuICAgIHByb3RlY3RlZCBhcmVGaWVsZHNBY3RpdmUocmVsYXRlZEZpZWxkczogc3RyaW5nW10sIHJlY29yZDogUmVjb3JkLCBhY3RpdmVPbkZpZWxkczogU3RyaW5nQXJyYXlNYXApOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWRGaWVsZHMuc29tZShmaWVsZEtleSA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpZWxkcyA9IHJlY29yZC5maWVsZHM7XG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9IChmaWVsZHMgJiYgcmVjb3JkLmZpZWxkc1tmaWVsZEtleV0pIHx8IG51bGw7XG4gICAgICAgICAgICBjb25zdCBhY3RpdmVWYWx1ZXMgPSBhY3RpdmVPbkZpZWxkc1tmaWVsZEtleV07XG5cbiAgICAgICAgICAgIGlmICghZmllbGQgfHwgIWFjdGl2ZVZhbHVlcyB8fCAhYWN0aXZlVmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWx1ZUFjdGl2ZShmaWVsZCwgYWN0aXZlVmFsdWVzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSXMgdmFsdWUgYWN0aXZlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGZpZWxkXG4gICAgICogQHBhcmFtIHthcnJheX0gYWN0aXZlVmFsdWVzXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGlzVmFsdWVBY3RpdmUoZmllbGQ6IEZpZWxkLCBhY3RpdmVWYWx1ZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBpc0FjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChmaWVsZC52YWx1ZUxpc3QgJiYgZmllbGQudmFsdWVMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgZmllbGQudmFsdWVMaXN0LnNvbWUodmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBhY3RpdmVWYWx1ZXMuc29tZShhY3RpdmVWYWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVWYWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGlzQWN0aXZlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpZWxkLnZhbHVlKSB7XG4gICAgICAgICAgICBhY3RpdmVWYWx1ZXMuc29tZShhY3RpdmVWYWx1ZSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlVmFsdWUgPT09IGZpZWxkLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzQWN0aXZlO1xuICAgIH1cbn1cbiJdfQ==