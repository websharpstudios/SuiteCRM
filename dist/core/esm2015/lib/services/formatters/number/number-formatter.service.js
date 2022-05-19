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
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { UserPreferenceStore } from '../../../store/user-preference/user-preference.store';
import { formatNumber } from '@angular/common';
import { isVoid } from 'common';
import { FormControlUtils } from '../../record/field/form-control.utils';
import * as i0 from "@angular/core";
import * as i1 from "../../../store/user-preference/user-preference.store";
import * as i2 from "../../record/field/form-control.utils";
export class NumberFormatter {
    constructor(preferences, formUtils, locale) {
        this.preferences = preferences;
        this.formUtils = formUtils;
        this.locale = locale;
    }
    toUserFormat(value) {
        if (isVoid(value) || value === '') {
            return '';
        }
        const formatted = formatNumber(Number(value), this.locale);
        return this.replaceSeparators(formatted);
    }
    toInternalFormat(value) {
        if (!value) {
            return value;
        }
        const decimalSymbol = this.getDecimalsSymbol() || '.';
        const groupSymbol = this.getGroupSymbol() || ',';
        let decimalSymbolRegex = new RegExp(decimalSymbol, 'g');
        if (decimalSymbol === '.') {
            decimalSymbolRegex = new RegExp('\\.', 'g');
        }
        let groupSymbolRegex = new RegExp(groupSymbol, 'g');
        if (groupSymbol === '.') {
            groupSymbolRegex = new RegExp('\\.', 'g');
        }
        value = value.replace(groupSymbolRegex, 'group_separator');
        value = value.replace(decimalSymbolRegex, 'decimal_separator');
        value = value.replace(/decimal_separator/g, '.');
        value = value.replace(/group_separator/g, '');
        return value;
    }
    getFloatUserFormatPattern() {
        const group = this.getGroupSymbol();
        const decimals = this.getDecimalsSymbol();
        let pattern = '^(';
        pattern += '(\\d{1,3}(\\' + group + '\\d{3})*(\\' + decimals + '\\d+)?)|';
        pattern += '\\d*|';
        pattern += '(\\d+(\\' + decimals + '\\d+)?)|';
        pattern += '(\\d+(\\.\\d+)?)';
        pattern += ')$';
        return pattern;
    }
    getIntUserFormatPattern() {
        const group = this.getGroupSymbol();
        let pattern = '^(';
        pattern += '(\\d{1,3}(\\' + group + '\\d{3})*)|';
        pattern += '\\d*';
        pattern += ')$';
        return pattern;
    }
    getGroupSymbol() {
        const separator = this.preferences.getUserPreference('num_grp_sep');
        if (separator) {
            return separator;
        }
        return ',';
    }
    getDecimalsSymbol() {
        const separator = this.preferences.getUserPreference('dec_sep');
        if (separator) {
            return separator;
        }
        return '.';
    }
    replaceSeparators(transformed) {
        if (!transformed) {
            return transformed;
        }
        transformed = transformed.replace(/,/g, 'group_separator');
        transformed = transformed.replace(/\./g, 'decimal_separator');
        const decimalSymbol = this.getDecimalsSymbol() || '.';
        const groupSymbol = this.getGroupSymbol() || ',';
        transformed = transformed.replace(/decimal_separator/g, decimalSymbol);
        transformed = transformed.replace(/group_separator/g, groupSymbol);
        return transformed;
    }
    validateIntUserFormat(inputValue) {
        const trimmedInputValue = this.formUtils.getTrimmedInputValue(inputValue);
        if (this.formUtils.isEmptyInputValue(trimmedInputValue)) {
            return false;
        }
        const regex = new RegExp(this.getIntUserFormatPattern());
        if (regex.test(trimmedInputValue)) {
            return false;
        }
    }
    validateFloatUserFormat(inputValue) {
        const trimmedInputValue = this.formUtils.getTrimmedInputValue(inputValue);
        if (this.formUtils.isEmptyInputValue(trimmedInputValue)) {
            return false;
        }
        const regex = new RegExp(this.getFloatUserFormatPattern());
        return !regex.test(trimmedInputValue);
    }
}
NumberFormatter.ɵprov = i0.ɵɵdefineInjectable({ factory: function NumberFormatter_Factory() { return new NumberFormatter(i0.ɵɵinject(i1.UserPreferenceStore), i0.ɵɵinject(i2.FormControlUtils), i0.ɵɵinject(i0.LOCALE_ID)); }, token: NumberFormatter, providedIn: "root" });
NumberFormatter.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
NumberFormatter.ctorParameters = () => [
    { type: UserPreferenceStore },
    { type: FormControlUtils },
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyLWZvcm1hdHRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3NlcnZpY2VzL2Zvcm1hdHRlcnMvbnVtYmVyL251bWJlci1mb3JtYXR0ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHNEQUFzRCxDQUFDO0FBQ3pGLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUU3QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHVDQUF1QyxDQUFDOzs7O0FBS3ZFLE1BQU0sT0FBTyxlQUFlO0lBRXhCLFlBQ2MsV0FBZ0MsRUFDaEMsU0FBMkIsRUFDWCxNQUFjO1FBRjlCLGdCQUFXLEdBQVgsV0FBVyxDQUFxQjtRQUNoQyxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUNYLFdBQU0sR0FBTixNQUFNLENBQVE7SUFFNUMsQ0FBQztJQUVELFlBQVksQ0FBQyxLQUFhO1FBRXRCLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7WUFDL0IsT0FBTyxFQUFFLENBQUM7U0FDYjtRQUVELE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNELE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxLQUFhO1FBRTFCLElBQUksQ0FB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QU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFFMUMsQ0FBQzs7OztZQXpJSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQVJPLG1CQUFtQjtZQUluQixnQkFBZ0I7eUNBVWYsTUFBTSxTQUFDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0LCBJbmplY3RhYmxlLCBMT0NBTEVfSUR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtVc2VyUHJlZmVyZW5jZVN0b3JlfSBmcm9tICcuLi8uLi8uLi9zdG9yZS91c2VyLXByZWZlcmVuY2UvdXNlci1wcmVmZXJlbmNlLnN0b3JlJztcbmltcG9ydCB7Zm9ybWF0TnVtYmVyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtGb3JtYXR0ZXJ9IGZyb20gJy4uL2Zvcm1hdHRlci5tb2RlbCc7XG5pbXBvcnQge2lzVm9pZH0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7Rm9ybUNvbnRyb2xVdGlsc30gZnJvbSAnLi4vLi4vcmVjb3JkL2ZpZWxkL2Zvcm0tY29udHJvbC51dGlscyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTnVtYmVyRm9ybWF0dGVyIGltcGxlbWVudHMgRm9ybWF0dGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgcHJlZmVyZW5jZXM6IFVzZXJQcmVmZXJlbmNlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBmb3JtVXRpbHM6IEZvcm1Db250cm9sVXRpbHMsXG4gICAgICAgIEBJbmplY3QoTE9DQUxFX0lEKSBwdWJsaWMgbG9jYWxlOiBzdHJpbmdcbiAgICApIHtcbiAgICB9XG5cbiAgICB0b1VzZXJGb3JtYXQodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG5cbiAgICAgICAgaWYgKGlzVm9pZCh2YWx1ZSkgfHwgdmFsdWUgPT09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmb3JtYXR0ZWQgPSBmb3JtYXROdW1iZXIoTnVtYmVyKHZhbHVlKSwgdGhpcy5sb2NhbGUpO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlU2VwYXJhdG9ycyhmb3JtYXR0ZWQpO1xuICAgIH1cblxuICAgIHRvSW50ZXJuYWxGb3JtYXQodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG5cbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGVjaW1hbFN5bWJvbCA9IHRoaXMuZ2V0RGVjaW1hbHNTeW1ib2woKSB8fCAnLic7XG4gICAgICAgIGNvbnN0IGdyb3VwU3ltYm9sID0gdGhpcy5nZXRHcm91cFN5bWJvbCgpIHx8ICcsJztcblxuICAgICAgICBsZXQgZGVjaW1hbFN5bWJvbFJlZ2V4ID0gbmV3IFJlZ0V4cChkZWNpbWFsU3ltYm9sLCAnZycpO1xuICAgICAgICBpZiAoZGVjaW1hbFN5bWJvbCA9PT0gJy4nKSB7XG4gICAgICAgICAgICBkZWNpbWFsU3ltYm9sUmVnZXggPSBuZXcgUmVnRXhwKCdcXFxcLicsICdnJyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZ3JvdXBTeW1ib2xSZWdleCA9IG5ldyBSZWdFeHAoZ3JvdXBTeW1ib2wsICdnJyk7XG4gICAgICAgIGlmIChncm91cFN5bWJvbCA9PT0gJy4nKSB7XG4gICAgICAgICAgICBncm91cFN5bWJvbFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFxcXC4nLCAnZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKGdyb3VwU3ltYm9sUmVnZXgsICdncm91cF9zZXBhcmF0b3InKTtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKGRlY2ltYWxTeW1ib2xSZWdleCwgJ2RlY2ltYWxfc2VwYXJhdG9yJyk7XG5cblxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL2RlY2ltYWxfc2VwYXJhdG9yL2csICcuJyk7XG4gICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvZ3JvdXBfc2VwYXJhdG9yL2csICcnKTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0RmxvYXRVc2VyRm9ybWF0UGF0dGVybigpOiBzdHJpbmcge1xuXG4gICAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5nZXRHcm91cFN5bWJvbCgpO1xuICAgICAgICBjb25zdCBkZWNpbWFscyA9IHRoaXMuZ2V0RGVjaW1hbHNTeW1ib2woKTtcblxuICAgICAgICBsZXQgcGF0dGVybiA9ICdeKCc7XG4gICAgICAgIHBhdHRlcm4gKz0gJyhcXFxcZHsxLDN9KFxcXFwnICsgZ3JvdXAgKyAnXFxcXGR7M30pKihcXFxcJyArIGRlY2ltYWxzICsgJ1xcXFxkKyk/KXwnO1xuICAgICAgICBwYXR0ZXJuICs9ICdcXFxcZCp8JztcbiAgICAgICAgcGF0dGVybiArPSAnKFxcXFxkKyhcXFxcJyArIGRlY2ltYWxzICsgJ1xcXFxkKyk/KXwnO1xuICAgICAgICBwYXR0ZXJuICs9ICcoXFxcXGQrKFxcXFwuXFxcXGQrKT8pJztcbiAgICAgICAgcGF0dGVybiArPSAnKSQnO1xuICAgICAgICByZXR1cm4gcGF0dGVybjtcbiAgICB9XG5cbiAgICBnZXRJbnRVc2VyRm9ybWF0UGF0dGVybigpOiBzdHJpbmcge1xuXG4gICAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5nZXRHcm91cFN5bWJvbCgpO1xuXG4gICAgICAgIGxldCBwYXR0ZXJuID0gJ14oJztcbiAgICAgICAgcGF0dGVybiArPSAnKFxcXFxkezEsM30oXFxcXCcgKyBncm91cCArICdcXFxcZHszfSkqKXwnO1xuICAgICAgICBwYXR0ZXJuICs9ICdcXFxcZConO1xuICAgICAgICBwYXR0ZXJuICs9ICcpJCc7XG4gICAgICAgIHJldHVybiBwYXR0ZXJuO1xuICAgIH1cblxuICAgIGdldEdyb3VwU3ltYm9sKCk6IHN0cmluZyB7XG5cbiAgICAgICAgY29uc3Qgc2VwYXJhdG9yID0gdGhpcy5wcmVmZXJlbmNlcy5nZXRVc2VyUHJlZmVyZW5jZSgnbnVtX2dycF9zZXAnKTtcblxuICAgICAgICBpZiAoc2VwYXJhdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VwYXJhdG9yO1xuICAgICAgICB9XG5cblxuICAgICAgICByZXR1cm4gJywnO1xuICAgIH1cblxuICAgIGdldERlY2ltYWxzU3ltYm9sKCk6IHN0cmluZyB7XG5cbiAgICAgICAgY29uc3Qgc2VwYXJhdG9yID0gdGhpcy5wcmVmZXJlbmNlcy5nZXRVc2VyUHJlZmVyZW5jZSgnZGVjX3NlcCcpO1xuXG4gICAgICAgIGlmIChzZXBhcmF0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXBhcmF0b3I7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJy4nO1xuICAgIH1cblxuICAgIHJlcGxhY2VTZXBhcmF0b3JzKHRyYW5zZm9ybWVkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRyYW5zZm9ybWVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNmb3JtZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB0cmFuc2Zvcm1lZCA9IHRyYW5zZm9ybWVkLnJlcGxhY2UoLywvZywgJ2dyb3VwX3NlcGFyYXRvcicpO1xuICAgICAgICB0cmFuc2Zvcm1lZCA9IHRyYW5zZm9ybWVkLnJlcGxhY2UoL1xcLi9nLCAnZGVjaW1hbF9zZXBhcmF0b3InKTtcblxuICAgICAgICBjb25zdCBkZWNpbWFsU3ltYm9sID0gdGhpcy5nZXREZWNpbWFsc1N5bWJvbCgpIHx8ICcuJztcbiAgICAgICAgY29uc3QgZ3JvdXBTeW1ib2wgPSB0aGlzLmdldEdyb3VwU3ltYm9sKCkgfHwgJywnO1xuXG4gICAgICAgIHRyYW5zZm9ybWVkID0gdHJhbnNmb3JtZWQucmVwbGFjZSgvZGVjaW1hbF9zZXBhcmF0b3IvZywgZGVjaW1hbFN5bWJvbCk7XG4gICAgICAgIHRyYW5zZm9ybWVkID0gdHJhbnNmb3JtZWQucmVwbGFjZSgvZ3JvdXBfc2VwYXJhdG9yL2csIGdyb3VwU3ltYm9sKTtcblxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtZWQ7XG4gICAgfVxuXG4gICAgdmFsaWRhdGVJbnRVc2VyRm9ybWF0KGlucHV0VmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuXG4gICAgICAgIGNvbnN0IHRyaW1tZWRJbnB1dFZhbHVlID0gdGhpcy5mb3JtVXRpbHMuZ2V0VHJpbW1lZElucHV0VmFsdWUoaW5wdXRWYWx1ZSk7XG4gICAgICAgIGlmICh0aGlzLmZvcm1VdGlscy5pc0VtcHR5SW5wdXRWYWx1ZSh0cmltbWVkSW5wdXRWYWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAodGhpcy5nZXRJbnRVc2VyRm9ybWF0UGF0dGVybigpKTtcbiAgICAgICAgaWYgKHJlZ2V4LnRlc3QodHJpbW1lZElucHV0VmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YWxpZGF0ZUZsb2F0VXNlckZvcm1hdChpbnB1dFZhbHVlOiBhbnkpOiBib29sZWFuIHtcblxuICAgICAgICBjb25zdCB0cmltbWVkSW5wdXRWYWx1ZSA9IHRoaXMuZm9ybVV0aWxzLmdldFRyaW1tZWRJbnB1dFZhbHVlKGlucHV0VmFsdWUpO1xuICAgICAgICBpZiAodGhpcy5mb3JtVXRpbHMuaXNFbXB0eUlucHV0VmFsdWUodHJpbW1lZElucHV0VmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKHRoaXMuZ2V0RmxvYXRVc2VyRm9ybWF0UGF0dGVybigpKTtcbiAgICAgICAgcmV0dXJuICFyZWdleC50ZXN0KHRyaW1tZWRJbnB1dFZhbHVlKTtcblxuICAgIH1cblxufVxuIl19