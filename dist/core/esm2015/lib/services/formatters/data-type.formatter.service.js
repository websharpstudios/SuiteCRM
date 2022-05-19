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
import { NumberFormatter } from './number/number-formatter.service';
import { DatetimeFormatter } from './datetime/datetime-formatter.service';
import { CurrencyFormatter } from './currency/currency-formatter.service';
import { DateFormatter } from './datetime/date-formatter.service';
import { PhoneFormatter } from './phone/phone-formatter.service';
import * as i0 from "@angular/core";
import * as i1 from "./currency/currency-formatter.service";
import * as i2 from "./number/number-formatter.service";
import * as i3 from "./datetime/date-formatter.service";
import * as i4 from "./datetime/datetime-formatter.service";
import * as i5 from "./phone/phone-formatter.service";
export class DataTypeFormatter {
    constructor(currencyFormatter, numberFormatter, dateFormatter, datetimeFormatter, phoneFormatter) {
        this.currencyFormatter = currencyFormatter;
        this.numberFormatter = numberFormatter;
        this.dateFormatter = dateFormatter;
        this.datetimeFormatter = datetimeFormatter;
        this.phoneFormatter = phoneFormatter;
        this.map = {};
        this.map.int = numberFormatter;
        this.map.float = numberFormatter;
        this.map.date = dateFormatter;
        this.map.datetime = datetimeFormatter;
        this.map.currency = currencyFormatter;
        this.map.phone = phoneFormatter;
    }
    toUserFormat(dataType, value, options) {
        if (!dataType) {
            return value;
        }
        const formatter = this.map[dataType];
        if (!formatter) {
            return value;
        }
        return formatter.toUserFormat(value, options);
    }
    toInternalFormat(dataType, value) {
        if (!dataType) {
            return value;
        }
        const formatter = this.map[dataType];
        if (!formatter) {
            return value;
        }
        return formatter.toInternalFormat(value);
    }
}
DataTypeFormatter.ɵprov = i0.ɵɵdefineInjectable({ factory: function DataTypeFormatter_Factory() { return new DataTypeFormatter(i0.ɵɵinject(i1.CurrencyFormatter), i0.ɵɵinject(i2.NumberFormatter), i0.ɵɵinject(i3.DateFormatter), i0.ɵɵinject(i4.DatetimeFormatter), i0.ɵɵinject(i5.PhoneFormatter)); }, token: DataTypeFormatter, providedIn: "root" });
DataTypeFormatter.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
DataTypeFormatter.ctorParameters = () => [
    { type: CurrencyFormatter },
    { type: NumberFormatter },
    { type: DateFormatter },
    { type: DatetimeFormatter },
    { type: PhoneFormatter }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10eXBlLmZvcm1hdHRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3NlcnZpY2VzL2Zvcm1hdHRlcnMvZGF0YS10eXBlLmZvcm1hdHRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNsRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUV4RSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUN4RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFDaEUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGlDQUFpQyxDQUFDOzs7Ozs7O0FBUy9ELE1BQU0sT0FBTyxpQkFBaUI7SUFJMUIsWUFDYyxpQkFBb0MsRUFDcEMsZUFBZ0MsRUFDaEMsYUFBNEIsRUFDNUIsaUJBQW9DLEVBQ3BDLGNBQThCO1FBSjlCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDcEMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDcEMsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBUDVDLFFBQUcsR0FBcUIsRUFBRSxDQUFDO1FBU3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLGVBQWUsQ0FBQztRQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxlQUFlLENBQUM7UUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDO1FBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLGlCQUFpQixDQUFDO1FBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLGlCQUFpQixDQUFDO1FBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsWUFBWSxDQUFDLFFBQWdCLEVBQUUsS0FBYSxFQUFFLE9BQXVCO1FBRWpFLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDWCxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNaLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsT0FBTyxTQUFTLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsUUFBZ0IsRUFBRSxLQUFhO1FBRTVDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDWCxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNaLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsT0FBTyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0MsQ0FBQzs7OztZQWhESixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQVZPLGlCQUFpQjtZQUhqQixlQUFlO1lBSWYsYUFBYTtZQUhiLGlCQUFpQjtZQUlqQixjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOdW1iZXJGb3JtYXR0ZXJ9IGZyb20gJy4vbnVtYmVyL251bWJlci1mb3JtYXR0ZXIuc2VydmljZSc7XG5pbXBvcnQge0RhdGV0aW1lRm9ybWF0dGVyfSBmcm9tICcuL2RhdGV0aW1lL2RhdGV0aW1lLWZvcm1hdHRlci5zZXJ2aWNlJztcbmltcG9ydCB7Rm9ybWF0T3B0aW9ucywgRm9ybWF0dGVyfSBmcm9tICcuL2Zvcm1hdHRlci5tb2RlbCc7XG5pbXBvcnQge0N1cnJlbmN5Rm9ybWF0dGVyfSBmcm9tICcuL2N1cnJlbmN5L2N1cnJlbmN5LWZvcm1hdHRlci5zZXJ2aWNlJztcbmltcG9ydCB7RGF0ZUZvcm1hdHRlcn0gZnJvbSAnLi9kYXRldGltZS9kYXRlLWZvcm1hdHRlci5zZXJ2aWNlJztcbmltcG9ydCB7UGhvbmVGb3JtYXR0ZXJ9IGZyb20gJy4vcGhvbmUvcGhvbmUtZm9ybWF0dGVyLnNlcnZpY2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFR5cGVGb3JtYXR0ZXJNYXAge1xuICAgIFtrZXk6IHN0cmluZ106IEZvcm1hdHRlcjtcbn1cblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBEYXRhVHlwZUZvcm1hdHRlciB7XG5cbiAgICBtYXA6IFR5cGVGb3JtYXR0ZXJNYXAgPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgY3VycmVuY3lGb3JtYXR0ZXI6IEN1cnJlbmN5Rm9ybWF0dGVyLFxuICAgICAgICBwcm90ZWN0ZWQgbnVtYmVyRm9ybWF0dGVyOiBOdW1iZXJGb3JtYXR0ZXIsXG4gICAgICAgIHByb3RlY3RlZCBkYXRlRm9ybWF0dGVyOiBEYXRlRm9ybWF0dGVyLFxuICAgICAgICBwcm90ZWN0ZWQgZGF0ZXRpbWVGb3JtYXR0ZXI6IERhdGV0aW1lRm9ybWF0dGVyLFxuICAgICAgICBwcm90ZWN0ZWQgcGhvbmVGb3JtYXR0ZXI6IFBob25lRm9ybWF0dGVyLFxuICAgICkge1xuICAgICAgICB0aGlzLm1hcC5pbnQgPSBudW1iZXJGb3JtYXR0ZXI7XG4gICAgICAgIHRoaXMubWFwLmZsb2F0ID0gbnVtYmVyRm9ybWF0dGVyO1xuICAgICAgICB0aGlzLm1hcC5kYXRlID0gZGF0ZUZvcm1hdHRlcjtcbiAgICAgICAgdGhpcy5tYXAuZGF0ZXRpbWUgPSBkYXRldGltZUZvcm1hdHRlcjtcbiAgICAgICAgdGhpcy5tYXAuY3VycmVuY3kgPSBjdXJyZW5jeUZvcm1hdHRlcjtcbiAgICAgICAgdGhpcy5tYXAucGhvbmUgPSBwaG9uZUZvcm1hdHRlcjtcbiAgICB9XG5cbiAgICB0b1VzZXJGb3JtYXQoZGF0YVR5cGU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgb3B0aW9ucz86IEZvcm1hdE9wdGlvbnMpOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICghZGF0YVR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZvcm1hdHRlciA9IHRoaXMubWFwW2RhdGFUeXBlXTtcbiAgICAgICAgaWYgKCFmb3JtYXR0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3JtYXR0ZXIudG9Vc2VyRm9ybWF0KHZhbHVlLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICB0b0ludGVybmFsRm9ybWF0KGRhdGFUeXBlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICghZGF0YVR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZvcm1hdHRlciA9IHRoaXMubWFwW2RhdGFUeXBlXTtcbiAgICAgICAgaWYgKCFmb3JtYXR0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3JtYXR0ZXIudG9JbnRlcm5hbEZvcm1hdCh2YWx1ZSk7XG4gICAgfVxufVxuIl19