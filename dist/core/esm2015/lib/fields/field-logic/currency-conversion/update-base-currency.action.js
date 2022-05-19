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
export class UpdateBaseCurrencyAction extends FieldLogicActionHandler {
    constructor(currencyService) {
        super();
        this.currencyService = currencyService;
        this.key = 'update-base-currency';
        this.modes = ['edit', 'create', 'massupdate', 'filter'];
    }
    run(data, action) {
        var _a, _b, _c, _d, _e, _f;
        const record = data.record;
        const field = data.field;
        if (!record || !field) {
            return;
        }
        const currencyIdFieldName = (_a = action.params.currencyIdField) !== null && _a !== void 0 ? _a : 'currency_id';
        const currencyFieldName = (_b = action.params.currencyField) !== null && _b !== void 0 ? _b : 'amount';
        const currencyId = (_d = (_c = record === null || record === void 0 ? void 0 : record.fields[currencyIdFieldName]) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : null;
        let value = parseFloat((_f = (_e = record === null || record === void 0 ? void 0 : record.fields[currencyFieldName]) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : null);
        if (!isFinite(value)) {
            return;
        }
        if (currencyId === null) {
            this.updateValue(field, value, record);
        }
        const baseValue = this.currencyService.currencyToBase(currencyId, value);
        if (!isFinite(baseValue)) {
            return;
        }
        this.updateValue(field, baseValue, record);
    }
    updateValue(field, baseValue, record) {
        field.value = baseValue.toString();
        field.formControl.setValue(baseValue.toString());
        // re-validate the parent form-control after value update
        record.formGroup.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    }
}
UpdateBaseCurrencyAction.ɵprov = i0.ɵɵdefineInjectable({ factory: function UpdateBaseCurrencyAction_Factory() { return new UpdateBaseCurrencyAction(i0.ɵɵinject(i1.CurrencyService)); }, token: UpdateBaseCurrencyAction, providedIn: "root" });
UpdateBaseCurrencyAction.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
UpdateBaseCurrencyAction.ctorParameters = () => [
    { type: CurrencyService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLWJhc2UtY3VycmVuY3kuYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2ZpZWxkcy9maWVsZC1sb2dpYy9jdXJyZW5jeS1jb252ZXJzaW9uL3VwZGF0ZS1iYXNlLWN1cnJlbmN5LmFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQXVCLHVCQUF1QixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDcEYsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDZDQUE2QyxDQUFDOzs7QUFLNUUsTUFBTSxPQUFPLHdCQUF5QixTQUFRLHVCQUF1QjtJQUtqRSxZQUFzQixlQUFnQztRQUNsRCxLQUFLLEVBQUUsQ0FBQztRQURVLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUh0RCxRQUFHLEdBQUcsc0JBQXNCLENBQUM7UUFDN0IsVUFBSyxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFlLENBQUM7SUFJakUsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUEwQixFQUFFLE1BQWM7O1FBQzFDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUV6QixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ25CLE9BQU87U0FDVjtRQUVELE1BQU0sbUJBQW1CLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsbUNBQUksYUFBYSxDQUFDO1FBQzNFLE1BQU0saUJBQWlCLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsbUNBQUksUUFBUSxDQUFDO1FBRWxFLE1BQU0sVUFBVSxHQUFHLE1BQUEsTUFBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsTUFBTSxDQUFDLG1CQUFtQixDQUFDLDBDQUFFLEtBQUssbUNBQUksSUFBSSxDQUFDO1FBQ3RFLElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFBLE1BQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQywwQ0FBRSxLQUFLLG1DQUFJLElBQUksQ0FBQyxDQUFDO1FBRXpFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbEIsT0FBTztTQUNWO1FBRUQsSUFBSSxVQUFVLEtBQUssSUFBSSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztTQUMxQztRQUVELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV6RSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3RCLE9BQU87U0FDVjtRQUVELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRVMsV0FBVyxDQUFDLEtBQVksRUFBRSxTQUFpQixFQUFFLE1BQWM7UUFDakUsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDakQseURBQXlEO1FBQ3pELE1BQU0sQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQy9FLENBQUM7Ozs7WUFoREosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFKTyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBY3Rpb24sIEZpZWxkLCBSZWNvcmQsIFZpZXdNb2RlfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtGaWVsZExvZ2ljQWN0aW9uRGF0YSwgRmllbGRMb2dpY0FjdGlvbkhhbmRsZXJ9IGZyb20gJy4uL2ZpZWxkLWxvZ2ljLmFjdGlvbic7XG5pbXBvcnQge0N1cnJlbmN5U2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY3VycmVuY3kvY3VycmVuY3kuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgVXBkYXRlQmFzZUN1cnJlbmN5QWN0aW9uIGV4dGVuZHMgRmllbGRMb2dpY0FjdGlvbkhhbmRsZXIge1xuXG4gICAga2V5ID0gJ3VwZGF0ZS1iYXNlLWN1cnJlbmN5JztcbiAgICBtb2RlcyA9IFsnZWRpdCcsICdjcmVhdGUnLCAnbWFzc3VwZGF0ZScsICdmaWx0ZXInXSBhcyBWaWV3TW9kZVtdO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGN1cnJlbmN5U2VydmljZTogQ3VycmVuY3lTZXJ2aWNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcnVuKGRhdGE6IEZpZWxkTG9naWNBY3Rpb25EYXRhLCBhY3Rpb246IEFjdGlvbik6IHZvaWQge1xuICAgICAgICBjb25zdCByZWNvcmQgPSBkYXRhLnJlY29yZDtcbiAgICAgICAgY29uc3QgZmllbGQgPSBkYXRhLmZpZWxkO1xuXG4gICAgICAgIGlmICghcmVjb3JkIHx8ICFmaWVsZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3VycmVuY3lJZEZpZWxkTmFtZSA9IGFjdGlvbi5wYXJhbXMuY3VycmVuY3lJZEZpZWxkID8/ICdjdXJyZW5jeV9pZCc7XG4gICAgICAgIGNvbnN0IGN1cnJlbmN5RmllbGROYW1lID0gYWN0aW9uLnBhcmFtcy5jdXJyZW5jeUZpZWxkID8/ICdhbW91bnQnO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbmN5SWQgPSByZWNvcmQ/LmZpZWxkc1tjdXJyZW5jeUlkRmllbGROYW1lXT8udmFsdWUgPz8gbnVsbDtcbiAgICAgICAgbGV0IHZhbHVlID0gcGFyc2VGbG9hdChyZWNvcmQ/LmZpZWxkc1tjdXJyZW5jeUZpZWxkTmFtZV0/LnZhbHVlID8/IG51bGwpO1xuXG4gICAgICAgIGlmICghaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVuY3lJZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZShmaWVsZCwgdmFsdWUsIHJlY29yZCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBiYXNlVmFsdWUgPSB0aGlzLmN1cnJlbmN5U2VydmljZS5jdXJyZW5jeVRvQmFzZShjdXJyZW5jeUlkLCB2YWx1ZSk7XG5cbiAgICAgICAgaWYgKCFpc0Zpbml0ZShiYXNlVmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKGZpZWxkLCBiYXNlVmFsdWUsIHJlY29yZCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVZhbHVlKGZpZWxkOiBGaWVsZCwgYmFzZVZhbHVlOiBudW1iZXIsIHJlY29yZDogUmVjb3JkKTogdm9pZCB7XG4gICAgICAgIGZpZWxkLnZhbHVlID0gYmFzZVZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIGZpZWxkLmZvcm1Db250cm9sLnNldFZhbHVlKGJhc2VWYWx1ZS50b1N0cmluZygpKTtcbiAgICAgICAgLy8gcmUtdmFsaWRhdGUgdGhlIHBhcmVudCBmb3JtLWNvbnRyb2wgYWZ0ZXIgdmFsdWUgdXBkYXRlXG4gICAgICAgIHJlY29yZC5mb3JtR3JvdXAudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogdHJ1ZX0pO1xuICAgIH1cbn1cbiJdfQ==