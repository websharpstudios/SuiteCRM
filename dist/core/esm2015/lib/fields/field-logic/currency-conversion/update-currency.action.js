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
import { CurrencyService } from '../../../services/currency/currency.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/currency/currency.service";
export class UpdateCurrencyAction extends FieldLogicActionHandler {
    constructor(currencyService) {
        super();
        this.currencyService = currencyService;
        this.key = 'update-currency';
        this.modes = ['edit', 'create', 'massupdate', 'filter'];
    }
    run(data, action) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const record = data.record;
        const field = data.field;
        const isBaseCurrency = (_c = (_b = (_a = field === null || field === void 0 ? void 0 : field.definition) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.isBaseCurrency) !== null && _c !== void 0 ? _c : false;
        if (!record || !field || isBaseCurrency) {
            return;
        }
        const currencyIdFieldName = (_d = action.params.currencyIdField) !== null && _d !== void 0 ? _d : 'currency_id';
        const baseCurrencyFieldName = (_e = action.params.baseCurrencyField) !== null && _e !== void 0 ? _e : 'amount_usdollar';
        const currencyId = (_g = (_f = record === null || record === void 0 ? void 0 : record.fields[currencyIdFieldName]) === null || _f === void 0 ? void 0 : _f.value) !== null && _g !== void 0 ? _g : null;
        let value = parseFloat((_h = field === null || field === void 0 ? void 0 : field.value) !== null && _h !== void 0 ? _h : null);
        let baseValue = parseFloat((_k = (_j = record === null || record === void 0 ? void 0 : record.fields[baseCurrencyFieldName]) === null || _j === void 0 ? void 0 : _j.value) !== null && _k !== void 0 ? _k : null);
        if (!isFinite(value) || !isFinite(baseValue) || currencyId === null) {
            return;
        }
        const newValue = this.currencyService.baseToCurrency(currencyId, baseValue);
        if (!isFinite(newValue)) {
            return;
        }
        this.updateValue(field, newValue, record);
    }
    updateValue(field, value, record) {
        field.value = value.toString();
        field.formControl.setValue(value.toString());
        // re-validate the parent form-control after value update
        record.formGroup.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    }
}
UpdateCurrencyAction.ɵprov = i0.ɵɵdefineInjectable({ factory: function UpdateCurrencyAction_Factory() { return new UpdateCurrencyAction(i0.ɵɵinject(i1.CurrencyService)); }, token: UpdateCurrencyAction, providedIn: "root" });
UpdateCurrencyAction.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
UpdateCurrencyAction.ctorParameters = () => [
    { type: CurrencyService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLWN1cnJlbmN5LmFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9maWVsZHMvZmllbGQtbG9naWMvY3VycmVuY3ktY29udmVyc2lvbi91cGRhdGUtY3VycmVuY3kuYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBdUIsdUJBQXVCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNwRixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sNkNBQTZDLENBQUM7OztBQUs1RSxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsdUJBQXVCO0lBSzdELFlBQXNCLGVBQWdDO1FBQ2xELEtBQUssRUFBRSxDQUFDO1FBRFUsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBSHRELFFBQUcsR0FBRyxpQkFBaUIsQ0FBQztRQUN4QixVQUFLLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxRQUFRLENBQWUsQ0FBQztJQUlqRSxDQUFDO0lBRUQsR0FBRyxDQUFDLElBQTBCLEVBQUUsTUFBYzs7UUFDMUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pCLE1BQU0sY0FBYyxHQUFHLE1BQUEsTUFBQSxNQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxVQUFVLDBDQUFFLFFBQVEsMENBQUUsY0FBYyxtQ0FBSSxLQUFLLENBQUM7UUFFNUUsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEtBQUssSUFBSSxjQUFjLEVBQUU7WUFDckMsT0FBTztTQUNWO1FBRUQsTUFBTSxtQkFBbUIsR0FBRyxNQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxtQ0FBSSxhQUFhLENBQUM7UUFDM0UsTUFBTSxxQkFBcUIsR0FBRyxNQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLG1DQUFJLGlCQUFpQixDQUFDO1FBRW5GLE1BQU0sVUFBVSxHQUFHLE1BQUEsTUFBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsTUFBTSxDQUFDLG1CQUFtQixDQUFDLDBDQUFFLEtBQUssbUNBQUksSUFBSSxDQUFDO1FBQ3RFLElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxLQUFLLG1DQUFJLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQUksU0FBUyxHQUFHLFVBQVUsQ0FBQyxNQUFBLE1BQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQywwQ0FBRSxLQUFLLG1DQUFJLElBQUksQ0FBQyxDQUFDO1FBRWpGLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksVUFBVSxLQUFLLElBQUksRUFBRTtZQUNqRSxPQUFPO1NBQ1Y7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFNUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNyQixPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVTLFdBQVcsQ0FBQyxLQUFZLEVBQUUsS0FBYSxFQUFFLE1BQWM7UUFDN0QsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDL0IsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDN0MseURBQXlEO1FBQ3pELE1BQU0sQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQy9FLENBQUM7Ozs7WUE5Q0osVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFKTyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBY3Rpb24sIEZpZWxkLCBSZWNvcmQsIFZpZXdNb2RlfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtGaWVsZExvZ2ljQWN0aW9uRGF0YSwgRmllbGRMb2dpY0FjdGlvbkhhbmRsZXJ9IGZyb20gJy4uL2ZpZWxkLWxvZ2ljLmFjdGlvbic7XG5pbXBvcnQge0N1cnJlbmN5U2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY3VycmVuY3kvY3VycmVuY3kuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgVXBkYXRlQ3VycmVuY3lBY3Rpb24gZXh0ZW5kcyBGaWVsZExvZ2ljQWN0aW9uSGFuZGxlciB7XG5cbiAgICBrZXkgPSAndXBkYXRlLWN1cnJlbmN5JztcbiAgICBtb2RlcyA9IFsnZWRpdCcsICdjcmVhdGUnLCAnbWFzc3VwZGF0ZScsICdmaWx0ZXInXSBhcyBWaWV3TW9kZVtdO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGN1cnJlbmN5U2VydmljZTogQ3VycmVuY3lTZXJ2aWNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcnVuKGRhdGE6IEZpZWxkTG9naWNBY3Rpb25EYXRhLCBhY3Rpb246IEFjdGlvbik6IHZvaWQge1xuICAgICAgICBjb25zdCByZWNvcmQgPSBkYXRhLnJlY29yZDtcbiAgICAgICAgY29uc3QgZmllbGQgPSBkYXRhLmZpZWxkO1xuICAgICAgICBjb25zdCBpc0Jhc2VDdXJyZW5jeSA9IGZpZWxkPy5kZWZpbml0aW9uPy5tZXRhZGF0YT8uaXNCYXNlQ3VycmVuY3kgPz8gZmFsc2U7XG5cbiAgICAgICAgaWYgKCFyZWNvcmQgfHwgIWZpZWxkIHx8IGlzQmFzZUN1cnJlbmN5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJyZW5jeUlkRmllbGROYW1lID0gYWN0aW9uLnBhcmFtcy5jdXJyZW5jeUlkRmllbGQgPz8gJ2N1cnJlbmN5X2lkJztcbiAgICAgICAgY29uc3QgYmFzZUN1cnJlbmN5RmllbGROYW1lID0gYWN0aW9uLnBhcmFtcy5iYXNlQ3VycmVuY3lGaWVsZCA/PyAnYW1vdW50X3VzZG9sbGFyJztcblxuICAgICAgICBjb25zdCBjdXJyZW5jeUlkID0gcmVjb3JkPy5maWVsZHNbY3VycmVuY3lJZEZpZWxkTmFtZV0/LnZhbHVlID8/IG51bGw7XG4gICAgICAgIGxldCB2YWx1ZSA9IHBhcnNlRmxvYXQoZmllbGQ/LnZhbHVlID8/IG51bGwpO1xuICAgICAgICBsZXQgYmFzZVZhbHVlID0gcGFyc2VGbG9hdChyZWNvcmQ/LmZpZWxkc1tiYXNlQ3VycmVuY3lGaWVsZE5hbWVdPy52YWx1ZSA/PyBudWxsKTtcblxuICAgICAgICBpZiAoIWlzRmluaXRlKHZhbHVlKSB8fCAhaXNGaW5pdGUoYmFzZVZhbHVlKSB8fCBjdXJyZW5jeUlkID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMuY3VycmVuY3lTZXJ2aWNlLmJhc2VUb0N1cnJlbmN5KGN1cnJlbmN5SWQsIGJhc2VWYWx1ZSk7XG5cbiAgICAgICAgaWYgKCFpc0Zpbml0ZShuZXdWYWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWUoZmllbGQsIG5ld1ZhbHVlLCByZWNvcmQpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB1cGRhdGVWYWx1ZShmaWVsZDogRmllbGQsIHZhbHVlOiBudW1iZXIsIHJlY29yZDogUmVjb3JkKTogdm9pZCB7XG4gICAgICAgIGZpZWxkLnZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgZmllbGQuZm9ybUNvbnRyb2wuc2V0VmFsdWUodmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICAgIC8vIHJlLXZhbGlkYXRlIHRoZSBwYXJlbnQgZm9ybS1jb250cm9sIGFmdGVyIHZhbHVlIHVwZGF0ZVxuICAgICAgICByZWNvcmQuZm9ybUdyb3VwLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IHRydWV9KTtcbiAgICB9XG59XG4iXX0=