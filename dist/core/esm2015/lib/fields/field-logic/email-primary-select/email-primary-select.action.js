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
import { isTrue } from 'common';
import * as i0 from "@angular/core";
export class EmailPrimarySelectAction extends FieldLogicActionHandler {
    constructor() {
        super();
        this.key = 'emailPrimarySelect';
        this.modes = ['edit', 'create', 'massupdate'];
    }
    run(data, action) {
        const record = data.record;
        const field = data.field;
        if (!record || !field) {
            return;
        }
        const items = field.items;
        if (!field || !items || !items.length) {
            return;
        }
        const activeItems = items.filter(item => !(item && item.attributes && item.attributes.deleted));
        // Auto-select the primary, only when the number of displayed rows equal to one;
        // This logic applies either via Add or Remove
        if (activeItems && activeItems.length !== 1) {
            return;
        }
        const item = activeItems[0];
        const emailField = (item.fields && item.fields['email-fields']) || {};
        const primary = (emailField.attributes && emailField.attributes['primary_address']) || null;
        if (primary && !isTrue(primary.value)) {
            primary.value = 'true';
            primary.formControl.setValue('true');
            // re-validate the parent form-control after value update
            emailField.formControl.updateValueAndValidity({ onlySelf: true, emitEvent: true });
        }
    }
}
EmailPrimarySelectAction.ɵprov = i0.ɵɵdefineInjectable({ factory: function EmailPrimarySelectAction_Factory() { return new EmailPrimarySelectAction(); }, token: EmailPrimarySelectAction, providedIn: "root" });
EmailPrimarySelectAction.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
EmailPrimarySelectAction.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1haWwtcHJpbWFyeS1zZWxlY3QuYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2ZpZWxkcy9maWVsZC1sb2dpYy9lbWFpbC1wcmltYXJ5LXNlbGVjdC9lbWFpbC1wcmltYXJ5LXNlbGVjdC5hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUF1Qix1QkFBdUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3BGLE9BQU8sRUFBZ0IsTUFBTSxFQUFXLE1BQU0sUUFBUSxDQUFDOztBQUt2RCxNQUFNLE9BQU8sd0JBQXlCLFNBQVEsdUJBQXVCO0lBS2pFO1FBQ0ksS0FBSyxFQUFFLENBQUM7UUFKWixRQUFHLEdBQUcsb0JBQW9CLENBQUM7UUFDM0IsVUFBSyxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQWUsQ0FBQztJQUl2RCxDQUFDO0lBRUQsR0FBRyxDQUFDLElBQTBCLEVBQUUsTUFBYztRQUMxQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFekIsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNuQixPQUFPO1NBQ1Y7UUFFRCxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBRTFCLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ25DLE9BQU87U0FDVjtRQUVELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBRWhHLGdGQUFnRjtRQUNoRiw4Q0FBOEM7UUFDOUMsSUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDekMsT0FBTztTQUNWO1FBRUQsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksRUFBVyxDQUFDO1FBQy9FLE1BQU0sT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7UUFFNUYsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ25DLE9BQU8sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JDLHlEQUF5RDtZQUN6RCxVQUFVLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztTQUNwRjtJQUNMLENBQUM7Ozs7WUE1Q0osVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGaWVsZExvZ2ljQWN0aW9uRGF0YSwgRmllbGRMb2dpY0FjdGlvbkhhbmRsZXJ9IGZyb20gJy4uL2ZpZWxkLWxvZ2ljLmFjdGlvbic7XG5pbXBvcnQge0FjdGlvbiwgRmllbGQsIGlzVHJ1ZSwgVmlld01vZGV9IGZyb20gJ2NvbW1vbic7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgRW1haWxQcmltYXJ5U2VsZWN0QWN0aW9uIGV4dGVuZHMgRmllbGRMb2dpY0FjdGlvbkhhbmRsZXIge1xuXG4gICAga2V5ID0gJ2VtYWlsUHJpbWFyeVNlbGVjdCc7XG4gICAgbW9kZXMgPSBbJ2VkaXQnLCAnY3JlYXRlJywgJ21hc3N1cGRhdGUnXSBhcyBWaWV3TW9kZVtdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcnVuKGRhdGE6IEZpZWxkTG9naWNBY3Rpb25EYXRhLCBhY3Rpb246IEFjdGlvbik6IHZvaWQge1xuICAgICAgICBjb25zdCByZWNvcmQgPSBkYXRhLnJlY29yZDtcbiAgICAgICAgY29uc3QgZmllbGQgPSBkYXRhLmZpZWxkO1xuXG4gICAgICAgIGlmICghcmVjb3JkIHx8ICFmaWVsZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXRlbXMgPSBmaWVsZC5pdGVtcztcblxuICAgICAgICBpZiAoIWZpZWxkIHx8ICFpdGVtcyB8fCAhaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhY3RpdmVJdGVtcyA9IGl0ZW1zLmZpbHRlcihpdGVtID0+ICEoaXRlbSAmJiBpdGVtLmF0dHJpYnV0ZXMgJiYgaXRlbS5hdHRyaWJ1dGVzLmRlbGV0ZWQpKTtcblxuICAgICAgICAvLyBBdXRvLXNlbGVjdCB0aGUgcHJpbWFyeSwgb25seSB3aGVuIHRoZSBudW1iZXIgb2YgZGlzcGxheWVkIHJvd3MgZXF1YWwgdG8gb25lO1xuICAgICAgICAvLyBUaGlzIGxvZ2ljIGFwcGxpZXMgZWl0aGVyIHZpYSBBZGQgb3IgUmVtb3ZlXG4gICAgICAgIGlmIChhY3RpdmVJdGVtcyAmJiBhY3RpdmVJdGVtcy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBhY3RpdmVJdGVtc1swXTtcbiAgICAgICAgY29uc3QgZW1haWxGaWVsZCA9IChpdGVtLmZpZWxkcyAmJiBpdGVtLmZpZWxkc1snZW1haWwtZmllbGRzJ10pIHx8IHt9IGFzIEZpZWxkO1xuICAgICAgICBjb25zdCBwcmltYXJ5ID0gKGVtYWlsRmllbGQuYXR0cmlidXRlcyAmJiBlbWFpbEZpZWxkLmF0dHJpYnV0ZXNbJ3ByaW1hcnlfYWRkcmVzcyddKSB8fCBudWxsO1xuXG4gICAgICAgIGlmIChwcmltYXJ5ICYmICFpc1RydWUocHJpbWFyeS52YWx1ZSkpIHtcbiAgICAgICAgICAgIHByaW1hcnkudmFsdWUgPSAndHJ1ZSc7XG4gICAgICAgICAgICBwcmltYXJ5LmZvcm1Db250cm9sLnNldFZhbHVlKCd0cnVlJyk7XG4gICAgICAgICAgICAvLyByZS12YWxpZGF0ZSB0aGUgcGFyZW50IGZvcm0tY29udHJvbCBhZnRlciB2YWx1ZSB1cGRhdGVcbiAgICAgICAgICAgIGVtYWlsRmllbGQuZm9ybUNvbnRyb2wudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogdHJ1ZX0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19