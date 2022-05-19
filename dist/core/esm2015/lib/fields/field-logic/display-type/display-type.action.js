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
import * as i0 from "@angular/core";
export class DisplayTypeAction extends FieldLogicActionHandler {
    constructor() {
        super();
        this.key = 'displayType';
        this.modes = ['edit', 'detail', 'list', 'create', 'massupdate', 'filter'];
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
        const targetDisplay = action.params && action.params.targetDisplayType;
        if (!targetDisplay) {
            return;
        }
        let isActive = this.isActive(relatedFields, record, activeOnFields, relatedAttributesFields, activeOnAttributes);
        let display = data.field.defaultDisplay;
        if (isActive) {
            display = targetDisplay;
        }
        data.field.display = display;
        const resetOn = (action.params && action.params.resetOn) || 'none';
        if (resetOn === display) {
            if (data.field.valueList && data.field.valueList.length) {
                data.field.valueList = [];
            }
            if (data.field.value) {
                data.field.value = '';
            }
        }
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
DisplayTypeAction.ɵprov = i0.ɵɵdefineInjectable({ factory: function DisplayTypeAction_Factory() { return new DisplayTypeAction(); }, token: DisplayTypeAction, providedIn: "root" });
DisplayTypeAction.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
DisplayTypeAction.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzcGxheS10eXBlLmFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9maWVsZHMvZmllbGQtbG9naWMvZGlzcGxheS10eXBlL2Rpc3BsYXktdHlwZS5hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUF1Qix1QkFBdUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDOztBQU1wRixNQUFNLE9BQU8saUJBQWtCLFNBQVEsdUJBQXVCO0lBSzFEO1FBQ0ksS0FBSyxFQUFFLENBQUM7UUFKWixRQUFHLEdBQUcsYUFBYSxDQUFDO1FBQ3BCLFVBQUssR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFlLENBQUM7SUFJbkYsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUEwQixFQUFFLE1BQWM7UUFDMUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRXpCLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDbkIsT0FBTztTQUNWO1FBRUQsTUFBTSxjQUFjLEdBQW1CLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQW9CLENBQUM7UUFDL0csTUFBTSxhQUFhLEdBQWEsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUU1RCxNQUFNLGtCQUFrQixHQUFzQixDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQXVCLENBQUM7UUFDN0gsTUFBTSx1QkFBdUIsR0FBYSxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFMUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUU7WUFDMUQsT0FBTztTQUNWO1FBRUQsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBRXZFLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDaEIsT0FBTztTQUNWO1FBRUQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSx1QkFBdUIsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBRWpILElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO1FBQ3hDLElBQUksUUFBUSxFQUFFO1lBQ1YsT0FBTyxHQUFHLGFBQWEsQ0FBQztTQUMzQjtRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUU3QixNQUFNLE9BQU8sR0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUM7UUFFM0UsSUFBSSxPQUFPLEtBQUssT0FBTyxFQUFFO1lBQ3JCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO2dCQUNyRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7YUFDN0I7WUFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO2dCQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7YUFDekI7U0FDSjtJQUVMLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ08sUUFBUSxDQUNkLGFBQXVCLEVBQ3ZCLE1BQWMsRUFDZCxjQUE4QixFQUM5Qix1QkFBaUMsRUFDakMsa0JBQXFDO1FBRXJDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUUzRSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ1gsUUFBUSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztTQUM1RjtRQUVELE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLG1CQUFtQixDQUN6Qix1QkFBaUMsRUFDakMsTUFBYyxFQUNkLGtCQUFxQztRQUVyQyxPQUFPLHVCQUF1QixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUUzQyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQzdCLE1BQU0sS0FBSyxHQUFHLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7WUFDMUQsTUFBTSxVQUFVLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzdGLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO2dCQUM3QyxPQUFPO2FBQ1Y7WUFFRCxPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQ2xDLE1BQU0sWUFBWSxHQUFHLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNoRSxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBRXJFLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNyRCxPQUFPO2lCQUNWO2dCQUVELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLGVBQWUsQ0FBQyxhQUF1QixFQUFFLE1BQWMsRUFBRSxjQUE4QjtRQUM3RixPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFFakMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUM3QixNQUFNLEtBQUssR0FBRyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO1lBQzFELE1BQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU5QyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRTtnQkFDakQsT0FBTzthQUNWO1lBRUQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sYUFBYSxDQUFDLEtBQVksRUFBRSxZQUFzQjtRQUN4RCxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFFckIsSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO1lBQzNDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN6QixPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7b0JBQ25DLElBQUksV0FBVyxLQUFLLEtBQUssRUFBRTt3QkFDdkIsUUFBUSxHQUFHLElBQUksQ0FBQzt3QkFDaEIsT0FBTyxJQUFJLENBQUM7cUJBQ2Y7Z0JBQ0wsQ0FBQyxDQUFDLENBQUE7WUFDTixDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sUUFBUSxDQUFDO1NBQ25CO1FBRUQsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQ2IsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFFNUIsSUFBSSxXQUFXLEtBQUssS0FBSyxDQUFDLEtBQUssRUFBRTtvQkFDN0IsUUFBUSxHQUFHLElBQUksQ0FBQztpQkFDbkI7WUFFTCxDQUFDLENBQUMsQ0FBQTtTQUNMO1FBRUQsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQzs7OztZQXpLSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0ZpZWxkTG9naWNBY3Rpb25EYXRhLCBGaWVsZExvZ2ljQWN0aW9uSGFuZGxlcn0gZnJvbSAnLi4vZmllbGQtbG9naWMuYWN0aW9uJztcbmltcG9ydCB7QWN0aW9uLCBGaWVsZCwgUmVjb3JkLCBTdHJpbmdBcnJheU1hcCwgU3RyaW5nQXJyYXlNYXRyaXgsIFZpZXdNb2RlfSBmcm9tICdjb21tb24nO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIERpc3BsYXlUeXBlQWN0aW9uIGV4dGVuZHMgRmllbGRMb2dpY0FjdGlvbkhhbmRsZXIge1xuXG4gICAga2V5ID0gJ2Rpc3BsYXlUeXBlJztcbiAgICBtb2RlcyA9IFsnZWRpdCcsICdkZXRhaWwnLCAnbGlzdCcsICdjcmVhdGUnLCAnbWFzc3VwZGF0ZScsICdmaWx0ZXInXSBhcyBWaWV3TW9kZVtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcnVuKGRhdGE6IEZpZWxkTG9naWNBY3Rpb25EYXRhLCBhY3Rpb246IEFjdGlvbik6IHZvaWQge1xuICAgICAgICBjb25zdCByZWNvcmQgPSBkYXRhLnJlY29yZDtcbiAgICAgICAgY29uc3QgZmllbGQgPSBkYXRhLmZpZWxkO1xuXG4gICAgICAgIGlmICghcmVjb3JkIHx8ICFmaWVsZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWN0aXZlT25GaWVsZHM6IFN0cmluZ0FycmF5TWFwID0gKGFjdGlvbi5wYXJhbXMgJiYgYWN0aW9uLnBhcmFtcy5hY3RpdmVPbkZpZWxkcykgfHwge30gYXMgU3RyaW5nQXJyYXlNYXA7XG4gICAgICAgIGNvbnN0IHJlbGF0ZWRGaWVsZHM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMoYWN0aXZlT25GaWVsZHMpO1xuXG4gICAgICAgIGNvbnN0IGFjdGl2ZU9uQXR0cmlidXRlczogU3RyaW5nQXJyYXlNYXRyaXggPSAoYWN0aW9uLnBhcmFtcyAmJiBhY3Rpb24ucGFyYW1zLmFjdGl2ZU9uQXR0cmlidXRlcykgfHwge30gYXMgU3RyaW5nQXJyYXlNYXRyaXg7XG4gICAgICAgIGNvbnN0IHJlbGF0ZWRBdHRyaWJ1dGVzRmllbGRzOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKGFjdGl2ZU9uQXR0cmlidXRlcyk7XG5cbiAgICAgICAgaWYgKCFyZWxhdGVkRmllbGRzLmxlbmd0aCAmJiAhcmVsYXRlZEF0dHJpYnV0ZXNGaWVsZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0YXJnZXREaXNwbGF5ID0gYWN0aW9uLnBhcmFtcyAmJiBhY3Rpb24ucGFyYW1zLnRhcmdldERpc3BsYXlUeXBlO1xuXG4gICAgICAgIGlmICghdGFyZ2V0RGlzcGxheSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGlzQWN0aXZlID0gdGhpcy5pc0FjdGl2ZShyZWxhdGVkRmllbGRzLCByZWNvcmQsIGFjdGl2ZU9uRmllbGRzLCByZWxhdGVkQXR0cmlidXRlc0ZpZWxkcywgYWN0aXZlT25BdHRyaWJ1dGVzKTtcblxuICAgICAgICBsZXQgZGlzcGxheSA9IGRhdGEuZmllbGQuZGVmYXVsdERpc3BsYXk7XG4gICAgICAgIGlmIChpc0FjdGl2ZSkge1xuICAgICAgICAgICAgZGlzcGxheSA9IHRhcmdldERpc3BsYXk7XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhLmZpZWxkLmRpc3BsYXkgPSBkaXNwbGF5O1xuXG4gICAgICAgIGNvbnN0IHJlc2V0T246IHN0cmluZyA9IChhY3Rpb24ucGFyYW1zICYmIGFjdGlvbi5wYXJhbXMucmVzZXRPbikgfHwgJ25vbmUnO1xuXG4gICAgICAgIGlmIChyZXNldE9uID09PSBkaXNwbGF5KSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5maWVsZC52YWx1ZUxpc3QgJiYgZGF0YS5maWVsZC52YWx1ZUxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5maWVsZC52YWx1ZUxpc3QgPSBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRhdGEuZmllbGQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBkYXRhLmZpZWxkLnZhbHVlID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGFueSBvZiB0aGUgY29uZmlndXJlZCB2YWx1ZXMgaXMgY3VycmVudGx5IHNldFxuICAgICAqIEBwYXJhbSB7YXJyYXl9IHJlbGF0ZWRGaWVsZHNcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGFjdGl2ZU9uRmllbGRzXG4gICAgICogQHBhcmFtIHthcnJheX0gcmVsYXRlZEF0dHJpYnV0ZXNGaWVsZHNcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gYWN0aXZlT25BdHRyaWJ1dGVzXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGlzQWN0aXZlKFxuICAgICAgICByZWxhdGVkRmllbGRzOiBzdHJpbmdbXSxcbiAgICAgICAgcmVjb3JkOiBSZWNvcmQsXG4gICAgICAgIGFjdGl2ZU9uRmllbGRzOiBTdHJpbmdBcnJheU1hcCxcbiAgICAgICAgcmVsYXRlZEF0dHJpYnV0ZXNGaWVsZHM6IHN0cmluZ1tdLFxuICAgICAgICBhY3RpdmVPbkF0dHJpYnV0ZXM6IFN0cmluZ0FycmF5TWF0cml4XG4gICAgKSB7XG4gICAgICAgIGxldCBpc0FjdGl2ZSA9IHRoaXMuYXJlRmllbGRzQWN0aXZlKHJlbGF0ZWRGaWVsZHMsIHJlY29yZCwgYWN0aXZlT25GaWVsZHMpO1xuXG4gICAgICAgIGlmICghaXNBY3RpdmUpIHtcbiAgICAgICAgICAgIGlzQWN0aXZlID0gdGhpcy5hcmVBdHRyaWJ1dGVzQWN0aXZlKHJlbGF0ZWRBdHRyaWJ1dGVzRmllbGRzLCByZWNvcmQsIGFjdGl2ZU9uQXR0cmlidXRlcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNBY3RpdmU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXJlIGF0dHJpYnV0ZXMgYWN0aXZlXG4gICAgICogQHBhcmFtIHthcnJheX0gcmVsYXRlZEF0dHJpYnV0ZXNGaWVsZHNcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGFjdGl2ZU9uQXR0cmlidXRlc1xuICAgICAqL1xuICAgIHByb3RlY3RlZCBhcmVBdHRyaWJ1dGVzQWN0aXZlKFxuICAgICAgICByZWxhdGVkQXR0cmlidXRlc0ZpZWxkczogc3RyaW5nW10sXG4gICAgICAgIHJlY29yZDogUmVjb3JkLFxuICAgICAgICBhY3RpdmVPbkF0dHJpYnV0ZXM6IFN0cmluZ0FycmF5TWF0cml4XG4gICAgKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiByZWxhdGVkQXR0cmlidXRlc0ZpZWxkcy5zb21lKGZpZWxkS2V5ID0+IHtcblxuICAgICAgICAgICAgY29uc3QgZmllbGRzID0gcmVjb3JkLmZpZWxkcztcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gKGZpZWxkcyAmJiByZWNvcmQuZmllbGRzW2ZpZWxkS2V5XSkgfHwgbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBhY3RpdmVPbkF0dHJpYnV0ZXNbZmllbGRLZXldICYmIE9iamVjdC5rZXlzKGFjdGl2ZU9uQXR0cmlidXRlc1tmaWVsZEtleV0pO1xuICAgICAgICAgICAgaWYgKCFmaWVsZCB8fCAhYXR0cmlidXRlcyB8fCAhYXR0cmlidXRlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVzLnNvbWUoYXR0cmlidXRlS2V5ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVWYWx1ZXMgPSBhY3RpdmVPbkF0dHJpYnV0ZXNbZmllbGRLZXldW2F0dHJpYnV0ZUtleV07XG4gICAgICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlID0gZmllbGQuYXR0cmlidXRlcyAmJiBmaWVsZC5hdHRyaWJ1dGVzW2F0dHJpYnV0ZUtleV07XG5cbiAgICAgICAgICAgICAgICBpZiAoIWFjdGl2ZVZhbHVlcyB8fCAhYWN0aXZlVmFsdWVzLmxlbmd0aCB8fCAhYXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbHVlQWN0aXZlKGF0dHJpYnV0ZSwgYWN0aXZlVmFsdWVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcmUgZmllbGRzIGFjdGl2ZVxuICAgICAqIEBwYXJhbSB7YXJyYXl9IHJlbGF0ZWRGaWVsZHNcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGFjdGl2ZU9uRmllbGRzXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFyZUZpZWxkc0FjdGl2ZShyZWxhdGVkRmllbGRzOiBzdHJpbmdbXSwgcmVjb3JkOiBSZWNvcmQsIGFjdGl2ZU9uRmllbGRzOiBTdHJpbmdBcnJheU1hcCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gcmVsYXRlZEZpZWxkcy5zb21lKGZpZWxkS2V5ID0+IHtcblxuICAgICAgICAgICAgY29uc3QgZmllbGRzID0gcmVjb3JkLmZpZWxkcztcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gKGZpZWxkcyAmJiByZWNvcmQuZmllbGRzW2ZpZWxkS2V5XSkgfHwgbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2ZVZhbHVlcyA9IGFjdGl2ZU9uRmllbGRzW2ZpZWxkS2V5XTtcblxuICAgICAgICAgICAgaWYgKCFmaWVsZCB8fCAhYWN0aXZlVmFsdWVzIHx8ICFhY3RpdmVWYWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbHVlQWN0aXZlKGZpZWxkLCBhY3RpdmVWYWx1ZXMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJcyB2YWx1ZSBhY3RpdmVcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZmllbGRcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBhY3RpdmVWYWx1ZXNcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaXNWYWx1ZUFjdGl2ZShmaWVsZDogRmllbGQsIGFjdGl2ZVZhbHVlczogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGlzQWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKGZpZWxkLnZhbHVlTGlzdCAmJiBmaWVsZC52YWx1ZUxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICBmaWVsZC52YWx1ZUxpc3Quc29tZSh2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdGl2ZVZhbHVlcy5zb21lKGFjdGl2ZVZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBpc0FjdGl2ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWVsZC52YWx1ZSkge1xuICAgICAgICAgICAgYWN0aXZlVmFsdWVzLnNvbWUoYWN0aXZlVmFsdWUgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVZhbHVlID09PSBmaWVsZC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzQWN0aXZlO1xuICAgIH1cbn1cbiJdfQ==