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
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { DateTime } from 'luxon';
import { FormControlUtils } from '../../record/field/form-control.utils';
import * as i0 from "@angular/core";
import * as i1 from "../../../store/user-preference/user-preference.store";
import * as i2 from "../../record/field/form-control.utils";
export class DatetimeFormatter {
    constructor(preferences, formUtils, locale) {
        this.preferences = preferences;
        this.formUtils = formUtils;
        this.locale = locale;
        this.format$ = combineLatest([
            this.preferences.userPreferences$
        ]).pipe(map(() => {
            const date = this.getDateFormat();
            const time = this.getTimeFormat();
            return { date, time };
        }));
    }
    getDateFormat() {
        const dateFormatPreference = this.preferences.getUserPreference('date_format');
        if (dateFormatPreference) {
            return dateFormatPreference;
        }
        return this.getInternalTimeFormat();
    }
    getTimeFormat() {
        const timeFormatPreference = this.preferences.getUserPreference('time_format');
        if (timeFormatPreference) {
            let format = timeFormatPreference;
            if (format.includes('aaaaaa')) {
                format = format.replace('aaaaaa', 'aaaaa\'m\'');
            }
            return format;
        }
        return this.getInternalTimeFormat();
    }
    getDateTimeFormat() {
        const dateFormat = this.getDateFormat();
        const timeFormat = this.getTimeFormat();
        return dateFormat + ' ' + timeFormat;
    }
    getInternalDateFormat() {
        return 'yyyy-MM-dd';
    }
    getInternalTimeFormat() {
        return 'HH:mm:ss';
    }
    getInternalDateTimeFormat() {
        const dateFormat = this.getInternalDateFormat();
        const timeFormat = this.getInternalTimeFormat();
        return dateFormat + ' ' + timeFormat;
    }
    getInternalFormat() {
        return this.getInternalDateTimeFormat();
    }
    getUserFormat() {
        return this.getDateTimeFormat();
    }
    toUserFormat(dateString, options) {
        const fromFormat = (options && options.fromFormat) || '';
        return dateString ? this.formatDateTime(dateString, this.getUserFormat(), fromFormat) : '';
    }
    toInternalFormat(dateString, options) {
        const fromFormat = (options && options.fromFormat) || '';
        return dateString ? this.formatDateTime(dateString, this.getInternalFormat(), fromFormat) : '';
    }
    formatDateTime(dateString, format, fromFormat = '') {
        const dateTime = this.toDateTime(dateString, fromFormat);
        if (!dateTime.isValid) {
            return dateString;
        }
        return formatDate(dateTime.toJSDate(), format, this.locale);
    }
    toDateTime(datetimeString, fromFormat = '') {
        if (!datetimeString) {
            return DateTime.invalid('empty');
        }
        if (fromFormat) {
            return DateTime.fromFormat(datetimeString, fromFormat);
        }
        let dateTime = this.fromUserFormat(datetimeString);
        if (!dateTime.isValid) {
            dateTime = this.fromInternalFormat(datetimeString);
        }
        return dateTime;
    }
    userDateTimeFormatToStruct(datetime) {
        if (!datetime) {
            return null;
        }
        const dateTime = this.toDateTime(datetime);
        if (!dateTime.isValid) {
            return null;
        }
        return {
            date: {
                day: dateTime.day,
                month: dateTime.month,
                year: dateTime.year
            },
            time: {
                hour: dateTime.hour,
                minute: dateTime.minute,
                second: dateTime.second,
            }
        };
    }
    userDateFormatToStruct(datetime) {
        if (!datetime) {
            return null;
        }
        const dateTime = this.toDateTime(datetime);
        if (!dateTime.isValid) {
            return null;
        }
        return {
            day: dateTime.day,
            month: dateTime.month,
            year: dateTime.year
        };
    }
    userTimeFormatToStruct(datetime) {
        if (!datetime) {
            return null;
        }
        const dateTime = this.toDateTime(datetime);
        if (!dateTime.isValid) {
            return null;
        }
        return {
            hour: dateTime.hour,
            minute: dateTime.minute,
            second: dateTime.second
        };
    }
    fromUserFormat(datetime) {
        datetime = datetime.toString();
        datetime = datetime.replace('a', 'A');
        datetime = datetime.replace('p', 'P');
        datetime = datetime.replace('m', 'M');
        let format = this.getUserFormat();
        format = format.replace('aaaaa\'m\'', 'a');
        return DateTime.fromFormat(datetime, format);
    }
    fromInternalFormat(datetime) {
        const format = this.getInternalFormat();
        return DateTime.fromFormat(datetime.toString(), format);
    }
    validateUserFormat(inputValue) {
        const trimmedInputValue = this.formUtils.getTrimmedInputValue(inputValue);
        if (this.formUtils.isEmptyInputValue(trimmedInputValue)) {
            return false;
        }
        const dateTime = this.fromUserFormat(trimmedInputValue);
        return !dateTime.isValid;
    }
}
DatetimeFormatter.ɵprov = i0.ɵɵdefineInjectable({ factory: function DatetimeFormatter_Factory() { return new DatetimeFormatter(i0.ɵɵinject(i1.UserPreferenceStore), i0.ɵɵinject(i2.FormControlUtils), i0.ɵɵinject(i0.LOCALE_ID)); }, token: DatetimeFormatter, providedIn: "root" });
DatetimeFormatter.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
DatetimeFormatter.ctorParameters = () => [
    { type: UserPreferenceStore },
    { type: FormControlUtils },
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWUtZm9ybWF0dGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc2VydmljZXMvZm9ybWF0dGVycy9kYXRldGltZS9kYXRldGltZS1mb3JtYXR0ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHNEQUFzRCxDQUFDO0FBQ3pGLE9BQU8sRUFBQyxhQUFhLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ25DLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUUzQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBRS9CLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHVDQUF1QyxDQUFDOzs7O0FBYXZFLE1BQU0sT0FBTyxpQkFBaUI7SUFjMUIsWUFDYyxXQUFnQyxFQUNoQyxTQUEyQixFQUNYLE1BQWM7UUFGOUIsZ0JBQVcsR0FBWCxXQUFXLENBQXFCO1FBQ2hDLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQ1gsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQWY1QyxZQUFPLEdBQWdDLGFBQWEsQ0FBQztZQUNqRCxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQjtTQUNwQyxDQUFDLENBQUMsSUFBSSxDQUNILEdBQUcsQ0FBQyxHQUFHLEVBQUU7WUFFTCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDbEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFD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QUNsQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0MsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsa0JBQWtCLENBQUMsUUFBZ0I7UUFDL0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDeEMsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsa0JBQWtCLENBQUMsVUFBZTtRQUU5QixNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUUsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLEVBQUU7WUFDckQsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFDRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDeEQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7SUFDN0IsQ0FBQzs7OztZQTFNSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQW5CTyxtQkFBbUI7WUFPbkIsZ0JBQWdCO3lDQThCZixNQUFNLFNBQUMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGUsIExPQ0FMRV9JRH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1VzZXJQcmVmZXJlbmNlU3RvcmV9IGZyb20gJy4uLy4uLy4uL3N0b3JlL3VzZXItcHJlZmVyZW5jZS91c2VyLXByZWZlcmVuY2Uuc3RvcmUnO1xuaW1wb3J0IHtjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge2Zvcm1hdERhdGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nYkRhdGVTdHJ1Y3QsIE5nYlRpbWVTdHJ1Y3R9IGZyb20gJ0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwJztcbmltcG9ydCB7RGF0ZVRpbWV9IGZyb20gJ2x1eG9uJztcbmltcG9ydCB7Rm9ybWF0T3B0aW9ucywgRm9ybWF0dGVyfSBmcm9tICcuLi9mb3JtYXR0ZXIubW9kZWwnO1xuaW1wb3J0IHtGb3JtQ29udHJvbFV0aWxzfSBmcm9tICcuLi8uLi9yZWNvcmQvZmllbGQvZm9ybS1jb250cm9sLnV0aWxzJztcblxuZXhwb3J0IGludGVyZmFjZSBEYXRldGltZUZvcm1hdHMge1xuICAgIGRhdGU6IHN0cmluZztcbiAgICB0aW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGF0ZVRpbWVTdHJ1Y3QgZXh0ZW5kcyBOZ2JEYXRlU3RydWN0LCBOZ2JUaW1lU3RydWN0IHtcbn1cblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBEYXRldGltZUZvcm1hdHRlciBpbXBsZW1lbnRzIEZvcm1hdHRlciB7XG5cbiAgICBmb3JtYXQkOiBPYnNlcnZhYmxlPERhdGV0aW1lRm9ybWF0cz4gPSBjb21iaW5lTGF0ZXN0KFtcbiAgICAgICAgdGhpcy5wcmVmZXJlbmNlcy51c2VyUHJlZmVyZW5jZXMkXG4gICAgXSkucGlwZShcbiAgICAgICAgbWFwKCgpID0+IHtcblxuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IHRoaXMuZ2V0RGF0ZUZvcm1hdCgpO1xuICAgICAgICAgICAgY29uc3QgdGltZSA9IHRoaXMuZ2V0VGltZUZvcm1hdCgpO1xuXG4gICAgICAgICAgICByZXR1cm4ge2RhdGUsIHRpbWV9O1xuICAgICAgICB9KVxuICAgICk7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHByZWZlcmVuY2VzOiBVc2VyUHJlZmVyZW5jZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgZm9ybVV0aWxzOiBGb3JtQ29udHJvbFV0aWxzLFxuICAgICAgICBASW5qZWN0KExPQ0FMRV9JRCkgcHVibGljIGxvY2FsZTogc3RyaW5nXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBnZXREYXRlRm9ybWF0KCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGRhdGVGb3JtYXRQcmVmZXJlbmNlID0gdGhpcy5wcmVmZXJlbmNlcy5nZXRVc2VyUHJlZmVyZW5jZSgnZGF0ZV9mb3JtYXQnKTtcblxuICAgICAgICBpZiAoZGF0ZUZvcm1hdFByZWZlcmVuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRlRm9ybWF0UHJlZmVyZW5jZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmdldEludGVybmFsVGltZUZvcm1hdCgpO1xuICAgIH1cblxuICAgIGdldFRpbWVGb3JtYXQoKTogc3RyaW5nIHtcblxuICAgICAgICBjb25zdCB0aW1lRm9ybWF0UHJlZmVyZW5jZSA9IHRoaXMucHJlZmVyZW5jZXMuZ2V0VXNlclByZWZlcmVuY2UoJ3RpbWVfZm9ybWF0Jyk7XG5cbiAgICAgICAgaWYgKHRpbWVGb3JtYXRQcmVmZXJlbmNlKSB7XG4gICAgICAgICAgICBsZXQgZm9ybWF0OiBzdHJpbmcgPSB0aW1lRm9ybWF0UHJlZmVyZW5jZTtcblxuICAgICAgICAgICAgaWYgKGZvcm1hdC5pbmNsdWRlcygnYWFhYWFhJykpIHtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZSgnYWFhYWFhJywgJ2FhYWFhXFwnbVxcJycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW50ZXJuYWxUaW1lRm9ybWF0KCk7XG4gICAgfVxuXG4gICAgZ2V0RGF0ZVRpbWVGb3JtYXQoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgZGF0ZUZvcm1hdCA9IHRoaXMuZ2V0RGF0ZUZvcm1hdCgpO1xuICAgICAgICBjb25zdCB0aW1lRm9ybWF0ID0gdGhpcy5nZXRUaW1lRm9ybWF0KCk7XG4gICAgICAgIHJldHVybiBkYXRlRm9ybWF0ICsgJyAnICsgdGltZUZvcm1hdDtcbiAgICB9XG5cbiAgICBnZXRJbnRlcm5hbERhdGVGb3JtYXQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICd5eXl5LU1NLWRkJztcbiAgICB9XG5cbiAgICBnZXRJbnRlcm5hbFRpbWVGb3JtYXQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdISDptbTpzcyc7XG4gICAgfVxuXG4gICAgZ2V0SW50ZXJuYWxEYXRlVGltZUZvcm1hdCgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBkYXRlRm9ybWF0ID0gdGhpcy5nZXRJbnRlcm5hbERhdGVGb3JtYXQoKTtcbiAgICAgICAgY29uc3QgdGltZUZvcm1hdCA9IHRoaXMuZ2V0SW50ZXJuYWxUaW1lRm9ybWF0KCk7XG4gICAgICAgIHJldHVybiBkYXRlRm9ybWF0ICsgJyAnICsgdGltZUZvcm1hdDtcbiAgICB9XG5cbiAgICBnZXRJbnRlcm5hbEZvcm1hdCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnRlcm5hbERhdGVUaW1lRm9ybWF0KCk7XG4gICAgfVxuXG4gICAgZ2V0VXNlckZvcm1hdCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXREYXRlVGltZUZvcm1hdCgpO1xuICAgIH1cblxuICAgIHRvVXNlckZvcm1hdChkYXRlU3RyaW5nOiBzdHJpbmcsIG9wdGlvbnM/OiBGb3JtYXRPcHRpb25zKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgZnJvbUZvcm1hdCA9IChvcHRpb25zICYmIG9wdGlvbnMuZnJvbUZvcm1hdCkgfHwgJyc7XG4gICAgICAgIHJldHVybiBkYXRlU3RyaW5nID8gdGhpcy5mb3JtYXREYXRlVGltZShkYXRlU3RyaW5nLCB0aGlzLmdldFVzZXJGb3JtYXQoKSwgZnJvbUZvcm1hdCkgOiAnJztcbiAgICB9XG5cbiAgICB0b0ludGVybmFsRm9ybWF0KGRhdGVTdHJpbmc6IHN0cmluZywgb3B0aW9ucz86IEZvcm1hdE9wdGlvbnMpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBmcm9tRm9ybWF0ID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5mcm9tRm9ybWF0KSB8fCAnJztcbiAgICAgICAgcmV0dXJuIGRhdGVTdHJpbmcgPyB0aGlzLmZvcm1hdERhdGVUaW1lKGRhdGVTdHJpbmcsIHRoaXMuZ2V0SW50ZXJuYWxGb3JtYXQoKSwgZnJvbUZvcm1hdCkgOiAnJztcbiAgICB9XG5cbiAgICBmb3JtYXREYXRlVGltZShkYXRlU3RyaW5nOiBzdHJpbmcsIGZvcm1hdDogc3RyaW5nLCBmcm9tRm9ybWF0ID0gJycpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBkYXRlVGltZSA9IHRoaXMudG9EYXRlVGltZShkYXRlU3RyaW5nLCBmcm9tRm9ybWF0KTtcblxuICAgICAgICBpZiAoIWRhdGVUaW1lLmlzVmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRlU3RyaW5nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmb3JtYXREYXRlKGRhdGVUaW1lLnRvSlNEYXRlKCksIGZvcm1hdCwgdGhpcy5sb2NhbGUpO1xuICAgIH1cblxuICAgIHRvRGF0ZVRpbWUoZGF0ZXRpbWVTdHJpbmc6IHN0cmluZywgZnJvbUZvcm1hdCA9ICcnKTogRGF0ZVRpbWUge1xuICAgICAgICBpZiAoIWRhdGV0aW1lU3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gRGF0ZVRpbWUuaW52YWxpZCgnZW1wdHknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmcm9tRm9ybWF0KSB7XG4gICAgICAgICAgICByZXR1cm4gRGF0ZVRpbWUuZnJvbUZvcm1hdChkYXRldGltZVN0cmluZywgZnJvbUZvcm1hdCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZGF0ZVRpbWUgPSB0aGlzLmZyb21Vc2VyRm9ybWF0KGRhdGV0aW1lU3RyaW5nKTtcblxuICAgICAgICBpZiAoIWRhdGVUaW1lLmlzVmFsaWQpIHtcbiAgICAgICAgICAgIGRhdGVUaW1lID0gdGhpcy5mcm9tSW50ZXJuYWxGb3JtYXQoZGF0ZXRpbWVTdHJpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGVUaW1lO1xuICAgIH1cblxuICAgIHVzZXJEYXRlVGltZUZvcm1hdFRvU3RydWN0KGRhdGV0aW1lOiBzdHJpbmcpOiB7IGRhdGU6IE5nYkRhdGVTdHJ1Y3Q7IHRpbWU6IE5nYlRpbWVTdHJ1Y3QgfSB7XG4gICAgICAgIGlmICghZGF0ZXRpbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0ZVRpbWUgPSB0aGlzLnRvRGF0ZVRpbWUoZGF0ZXRpbWUpO1xuXG4gICAgICAgIGlmICghZGF0ZVRpbWUuaXNWYWxpZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF0ZToge1xuICAgICAgICAgICAgICAgIGRheTogZGF0ZVRpbWUuZGF5LFxuICAgICAgICAgICAgICAgIG1vbnRoOiBkYXRlVGltZS5tb250aCxcbiAgICAgICAgICAgICAgICB5ZWFyOiBkYXRlVGltZS55ZWFyXG4gICAgICAgICAgICB9IGFzIE5nYkRhdGVTdHJ1Y3QsXG4gICAgICAgICAgICB0aW1lOiB7XG4gICAgICAgICAgICAgICAgaG91cjogZGF0ZVRpbWUuaG91cixcbiAgICAgICAgICAgICAgICBtaW51dGU6IGRhdGVUaW1lLm1pbnV0ZSxcbiAgICAgICAgICAgICAgICBzZWNvbmQ6IGRhdGVUaW1lLnNlY29uZCxcbiAgICAgICAgICAgIH0gYXMgTmdiVGltZVN0cnVjdFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHVzZXJEYXRlRm9ybWF0VG9TdHJ1Y3QoZGF0ZXRpbWU6IHN0cmluZyk6IE5nYkRhdGVTdHJ1Y3Qge1xuICAgICAgICBpZiAoIWRhdGV0aW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGVUaW1lID0gdGhpcy50b0RhdGVUaW1lKGRhdGV0aW1lKTtcblxuICAgICAgICBpZiAoIWRhdGVUaW1lLmlzVmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRheTogZGF0ZVRpbWUuZGF5LFxuICAgICAgICAgICAgbW9udGg6IGRhdGVUaW1lLm1vbnRoLFxuICAgICAgICAgICAgeWVhcjogZGF0ZVRpbWUueWVhclxuICAgICAgICB9IGFzIE5nYkRhdGVTdHJ1Y3Q7XG4gICAgfVxuXG4gICAgdXNlclRpbWVGb3JtYXRUb1N0cnVjdChkYXRldGltZTogc3RyaW5nKTogTmdiVGltZVN0cnVjdCB7XG4gICAgICAgIGlmICghZGF0ZXRpbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0ZVRpbWUgPSB0aGlzLnRvRGF0ZVRpbWUoZGF0ZXRpbWUpO1xuXG4gICAgICAgIGlmICghZGF0ZVRpbWUuaXNWYWxpZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaG91cjogZGF0ZVRpbWUuaG91cixcbiAgICAgICAgICAgIG1pbnV0ZTogZGF0ZVRpbWUubWludXRlLFxuICAgICAgICAgICAgc2Vjb25kOiBkYXRlVGltZS5zZWNvbmRcbiAgICAgICAgfSBhcyBOZ2JUaW1lU3RydWN0O1xuICAgIH1cblxuICAgIGZyb21Vc2VyRm9ybWF0KGRhdGV0aW1lOiBzdHJpbmcpOiBEYXRlVGltZSB7XG4gICAgICAgIGRhdGV0aW1lID0gZGF0ZXRpbWUudG9TdHJpbmcoKTtcbiAgICAgICAgZGF0ZXRpbWUgPSBkYXRldGltZS5yZXBsYWNlKCdhJywgJ0EnKTtcbiAgICAgICAgZGF0ZXRpbWUgPSBkYXRldGltZS5yZXBsYWNlKCdwJywgJ1AnKTtcbiAgICAgICAgZGF0ZXRpbWUgPSBkYXRldGltZS5yZXBsYWNlKCdtJywgJ00nKTtcblxuICAgICAgICBsZXQgZm9ybWF0ID0gdGhpcy5nZXRVc2VyRm9ybWF0KCk7XG4gICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKCdhYWFhYVxcJ21cXCcnLCAnYScpO1xuICAgICAgICByZXR1cm4gRGF0ZVRpbWUuZnJvbUZvcm1hdChkYXRldGltZSwgZm9ybWF0KTtcbiAgICB9XG5cbiAgICBmcm9tSW50ZXJuYWxGb3JtYXQoZGF0ZXRpbWU6IHN0cmluZyk6IERhdGVUaW1lIHtcbiAgICAgICAgY29uc3QgZm9ybWF0ID0gdGhpcy5nZXRJbnRlcm5hbEZvcm1hdCgpO1xuICAgICAgICByZXR1cm4gRGF0ZVRpbWUuZnJvbUZvcm1hdChkYXRldGltZS50b1N0cmluZygpLCBmb3JtYXQpO1xuICAgIH1cblxuICAgIHZhbGlkYXRlVXNlckZvcm1hdChpbnB1dFZhbHVlOiBhbnkpOiBib29sZWFuIHtcblxuICAgICAgICBjb25zdCB0cmltbWVkSW5wdXRWYWx1ZSA9IHRoaXMuZm9ybVV0aWxzLmdldFRyaW1tZWRJbnB1dFZhbHVlKGlucHV0VmFsdWUpO1xuICAgICAgICBpZiAodGhpcy5mb3JtVXRpbHMuaXNFbXB0eUlucHV0VmFsdWUodHJpbW1lZElucHV0VmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0ZVRpbWUgPSB0aGlzLmZyb21Vc2VyRm9ybWF0KHRyaW1tZWRJbnB1dFZhbHVlKTtcbiAgICAgICAgcmV0dXJuICFkYXRlVGltZS5pc1ZhbGlkO1xuICAgIH1cblxufVxuIl19