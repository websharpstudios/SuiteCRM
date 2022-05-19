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
import { SystemConfigStore } from '../../store/system-config/system-config.store';
import { divide, multiply, round } from 'mathjs';
import { UserPreferenceStore } from '../../store/user-preference/user-preference.store';
import * as i0 from "@angular/core";
import * as i1 from "../../store/system-config/system-config.store";
import * as i2 from "../../store/user-preference/user-preference.store";
export class CurrencyService {
    constructor(config, preferences) {
        this.config = config;
        this.preferences = preferences;
    }
    getFieldCurrencyValue(field, record) {
        const isBase = this.isBase(field);
        const currencyId = this.getCurrencyId(record);
        if (!isBase && currencyId !== null) {
            return field.value;
        }
        const value = parseFloat(field.value);
        if (!isFinite(value)) {
            return field.value;
        }
        const userCurrency = this.getUserCurrency();
        return this.baseToCurrency(userCurrency.id, value).toString();
    }
    baseToCurrency(currencyId, value) {
        const conversionRate = this.getConversionRate(currencyId);
        if (!isFinite(conversionRate)) {
            return value;
        }
        return this.round(multiply(value, conversionRate));
    }
    currencyToBase(currencyId, value) {
        const conversionRate = this.getConversionRate(currencyId);
        if (!isFinite(conversionRate)) {
            return value;
        }
        return this.round(divide(value, conversionRate));
    }
    round(value) {
        const precision = this.getPrecision();
        return round(value, precision);
    }
    getCurrencyId(record) {
        var _a, _b, _c;
        return (_c = (_b = (_a = record === null || record === void 0 ? void 0 : record.fields) === null || _a === void 0 ? void 0 : _a.currency_id) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : null;
    }
    isBase(field) {
        var _a, _b;
        return (_b = (_a = field === null || field === void 0 ? void 0 : field.metadata) === null || _a === void 0 ? void 0 : _a.isBaseCurrency) !== null && _b !== void 0 ? _b : false;
    }
    getCurrency(id) {
        var _a;
        const currencies = this.config.getConfigValue('currencies');
        return (_a = currencies[id]) !== null && _a !== void 0 ? _a : [];
    }
    getBaseCurrency() {
        return this.config.getConfigValue('currency');
    }
    getUserCurrency() {
        return this.preferences.getUserPreference('currency');
    }
    getPrecision() {
        const userPrecision = parseInt(this.preferences.getUserPreference('default_currency_significant_digits'));
        if (isFinite(userPrecision)) {
            return userPrecision;
        }
        const systemPrecision = parseInt(this.config.getConfigValue('default_currency_significant_digits'));
        if (isFinite(systemPrecision)) {
            return systemPrecision;
        }
        return 0;
    }
    getConversionRate(id) {
        const currency = this.getCurrency(id);
        return parseFloat(currency['conversion_rate']);
    }
    getCode(id) {
        return this.getCurrency(id).iso4217;
    }
    getSymbol(id) {
        return this.getCurrency(id).symbol;
    }
}
CurrencyService.ɵprov = i0.ɵɵdefineInjectable({ factory: function CurrencyService_Factory() { return new CurrencyService(i0.ɵɵinject(i1.SystemConfigStore), i0.ɵɵinject(i2.UserPreferenceStore)); }, token: CurrencyService, providedIn: "root" });
CurrencyService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
CurrencyService.ctorParameters = () => [
    { type: SystemConfigStore },
    { type: UserPreferenceStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3kuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zZXJ2aWNlcy9jdXJyZW5jeS9jdXJyZW5jeS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLCtDQUErQyxDQUFDO0FBRWhGLE9BQU8sRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMvQyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxtREFBbUQsQ0FBQzs7OztBQUt0RixNQUFNLE9BQU8sZUFBZTtJQUV4QixZQUNjLE1BQXlCLEVBQ3pCLFdBQWdDO1FBRGhDLFdBQU0sR0FBTixNQUFNLENBQW1CO1FBQ3pCLGdCQUFXLEdBQVgsV0FBVyxDQUFxQjtJQUU5QyxDQUFDO0lBRUQscUJBQXFCLENBQUMsS0FBWSxFQUFFLE1BQWM7UUFDOUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlDLElBQUksQ0FBQyxNQUFNLElBQUksVUFBVSxLQUFLLElBQUksRUFBRTtZQUNoQyxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7U0FDdEI7UUFFRCxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbEIsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDO1NBQ3RCO1FBRUQsTUFBTSxZQUFZLEdBQUcsSUFB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QyxPQUFPLENBQUM7SUFDeEMsQ0FBQztJQUVELFNBQVMsQ0FBQyxFQUFVO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDdkMsQ0FBQzs7OztZQXpHSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQVBPLGlCQUFpQjtZQUdqQixtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N5c3RlbUNvbmZpZ1N0b3JlfSBmcm9tICcuLi8uLi9zdG9yZS9zeXN0ZW0tY29uZmlnL3N5c3RlbS1jb25maWcuc3RvcmUnO1xuaW1wb3J0IHtGaWVsZCwgUmVjb3JkfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtkaXZpZGUsIG11bHRpcGx5LCByb3VuZH0gZnJvbSAnbWF0aGpzJztcbmltcG9ydCB7VXNlclByZWZlcmVuY2VTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvdXNlci1wcmVmZXJlbmNlL3VzZXItcHJlZmVyZW5jZS5zdG9yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQ3VycmVuY3lTZXJ2aWNlIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgY29uZmlnOiBTeXN0ZW1Db25maWdTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIHByZWZlcmVuY2VzOiBVc2VyUHJlZmVyZW5jZVN0b3JlXG4gICAgKSB7XG4gICAgfVxuXG4gICAgZ2V0RmllbGRDdXJyZW5jeVZhbHVlKGZpZWxkOiBGaWVsZCwgcmVjb3JkOiBSZWNvcmQpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBpc0Jhc2UgPSB0aGlzLmlzQmFzZShmaWVsZCk7XG4gICAgICAgIGNvbnN0IGN1cnJlbmN5SWQgPSB0aGlzLmdldEN1cnJlbmN5SWQocmVjb3JkKTtcblxuICAgICAgICBpZiAoIWlzQmFzZSAmJiBjdXJyZW5jeUlkICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmllbGQudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2YWx1ZSA9IHBhcnNlRmxvYXQoZmllbGQudmFsdWUpO1xuXG4gICAgICAgIGlmICghaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmllbGQudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1c2VyQ3VycmVuY3kgPSB0aGlzLmdldFVzZXJDdXJyZW5jeSgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmJhc2VUb0N1cnJlbmN5KHVzZXJDdXJyZW5jeS5pZCwgdmFsdWUpLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgYmFzZVRvQ3VycmVuY3koY3VycmVuY3lJZDogc3RyaW5nLCB2YWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcblxuICAgICAgICBjb25zdCBjb252ZXJzaW9uUmF0ZSA9IHRoaXMuZ2V0Q29udmVyc2lvblJhdGUoY3VycmVuY3lJZCk7XG4gICAgICAgIGlmICghaXNGaW5pdGUoY29udmVyc2lvblJhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5yb3VuZChtdWx0aXBseSh2YWx1ZSwgY29udmVyc2lvblJhdGUpKTtcbiAgICB9XG5cbiAgICBjdXJyZW5jeVRvQmFzZShjdXJyZW5jeUlkOiBzdHJpbmcsIHZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xuXG4gICAgICAgIGNvbnN0IGNvbnZlcnNpb25SYXRlID0gdGhpcy5nZXRDb252ZXJzaW9uUmF0ZShjdXJyZW5jeUlkKTtcbiAgICAgICAgaWYgKCFpc0Zpbml0ZShjb252ZXJzaW9uUmF0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJvdW5kKGRpdmlkZSh2YWx1ZSwgY29udmVyc2lvblJhdGUpKTtcbiAgICB9XG5cbiAgICByb3VuZCh2YWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgcHJlY2lzaW9uID0gdGhpcy5nZXRQcmVjaXNpb24oKTtcbiAgICAgICAgcmV0dXJuIHJvdW5kKHZhbHVlLCBwcmVjaXNpb24pO1xuICAgIH1cblxuICAgIGdldEN1cnJlbmN5SWQocmVjb3JkOiBSZWNvcmQpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gcmVjb3JkPy5maWVsZHM/LmN1cnJlbmN5X2lkPy52YWx1ZSA/PyBudWxsO1xuICAgIH1cblxuICAgIGlzQmFzZShmaWVsZDogRmllbGQpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkPy5tZXRhZGF0YT8uaXNCYXNlQ3VycmVuY3kgPz8gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0Q3VycmVuY3koaWQ6IHN0cmluZyk6IGFueSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbmNpZXMgPSB0aGlzLmNvbmZpZy5nZXRDb25maWdWYWx1ZSgnY3VycmVuY2llcycpO1xuXG4gICAgICAgIHJldHVybiBjdXJyZW5jaWVzW2lkXSA/PyBbXTtcbiAgICB9XG5cbiAgICBnZXRCYXNlQ3VycmVuY3koKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmdldENvbmZpZ1ZhbHVlKCdjdXJyZW5jeScpO1xuICAgIH1cblxuICAgIGdldFVzZXJDdXJyZW5jeSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVmZXJlbmNlcy5nZXRVc2VyUHJlZmVyZW5jZSgnY3VycmVuY3knKTtcbiAgICB9XG5cbiAgICBnZXRQcmVjaXNpb24oKTogbnVtYmVyIHtcblxuICAgICAgICBjb25zdCB1c2VyUHJlY2lzaW9uID0gcGFyc2VJbnQodGhpcy5wcmVmZXJlbmNlcy5nZXRVc2VyUHJlZmVyZW5jZSgnZGVmYXVsdF9jdXJyZW5jeV9zaWduaWZpY2FudF9kaWdpdHMnKSk7XG5cbiAgICAgICAgaWYgKGlzRmluaXRlKHVzZXJQcmVjaXNpb24pKSB7XG4gICAgICAgICAgICByZXR1cm4gdXNlclByZWNpc2lvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN5c3RlbVByZWNpc2lvbiA9IHBhcnNlSW50KHRoaXMuY29uZmlnLmdldENvbmZpZ1ZhbHVlKCdkZWZhdWx0X2N1cnJlbmN5X3NpZ25pZmljYW50X2RpZ2l0cycpKTtcblxuICAgICAgICBpZiAoaXNGaW5pdGUoc3lzdGVtUHJlY2lzaW9uKSkge1xuICAgICAgICAgICAgcmV0dXJuIHN5c3RlbVByZWNpc2lvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGdldENvbnZlcnNpb25SYXRlKGlkOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBjdXJyZW5jeSA9IHRoaXMuZ2V0Q3VycmVuY3koaWQpO1xuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChjdXJyZW5jeVsnY29udmVyc2lvbl9yYXRlJ10pO1xuICAgIH1cblxuICAgIGdldENvZGUoaWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEN1cnJlbmN5KGlkKS5pc280MjE3O1xuICAgIH1cblxuICAgIGdldFN5bWJvbChpZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3VycmVuY3koaWQpLnN5bWJvbDtcbiAgICB9XG59XG4iXX0=