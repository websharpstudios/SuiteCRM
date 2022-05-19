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
import { CurrencyUnitConverter } from './currency/currency.unit-converter';
import * as i0 from "@angular/core";
import * as i1 from "./currency/currency.unit-converter";
export class DataTypeUnitConverter {
    constructor(currencyUnitConverter) {
        this.currencyUnitConverter = currencyUnitConverter;
        this.map = {};
        this.addUnitConverter('currency', currencyUnitConverter);
    }
    addUnitConverter(unitType, unitConverter) {
        this.map[unitType] = unitConverter;
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
DataTypeUnitConverter.ɵprov = i0.ɵɵdefineInjectable({ factory: function DataTypeUnitConverter_Factory() { return new DataTypeUnitConverter(i0.ɵɵinject(i1.CurrencyUnitConverter)); }, token: DataTypeUnitConverter, providedIn: "root" });
DataTypeUnitConverter.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
DataTypeUnitConverter.ctorParameters = () => [
    { type: CurrencyUnitConverter }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10eXBlLnVuaXQtY29udmVydGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc2VydmljZXMvdW5pdC1jb252ZXJ0ZXJzL2RhdGEtdHlwZS51bml0LWNvbnZlcnRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDOzs7QUFTekUsTUFBTSxPQUFPLHFCQUFxQjtJQUk5QixZQUNjLHFCQUE0QztRQUE1QywwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBSDFELFFBQUcsR0FBcUIsRUFBRSxDQUFDO1FBS3ZCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUscUJBQXFCLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsUUFBZ0IsRUFBRSxhQUE0QjtRQUMzRCxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLGFBQWEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsWUFBWSxDQUFDLFFBQWdCLEVBQUUsS0FBYSxFQUFFLE9BQThCO1FBRXhFLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDWCxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNaLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsT0FBTyxTQUFTLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsUUFBZ0IsRUFBRSxLQUFhO1FBRTVDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDWCxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNaLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsT0FBTyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0MsQ0FBQzs7OztZQTNDSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQVJPLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VW5pdENvbnZlcnRlciwgVW5pdENvbnZlcnRlck9wdGlvbnN9IGZyb20gJy4vdW5pdC1jb252ZXJ0ZXIubW9kZWwnO1xuaW1wb3J0IHtDdXJyZW5jeVVuaXRDb252ZXJ0ZXJ9IGZyb20gJy4vY3VycmVuY3kvY3VycmVuY3kudW5pdC1jb252ZXJ0ZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIFVuaXRDb252ZXJ0ZXJNYXAge1xuICAgIFtrZXk6IHN0cmluZ106IFVuaXRDb252ZXJ0ZXI7XG59XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgRGF0YVR5cGVVbml0Q29udmVydGVyIHtcblxuICAgIG1hcDogVW5pdENvbnZlcnRlck1hcCA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBjdXJyZW5jeVVuaXRDb252ZXJ0ZXI6IEN1cnJlbmN5VW5pdENvbnZlcnRlcixcbiAgICApIHtcbiAgICAgICAgdGhpcy5hZGRVbml0Q29udmVydGVyKCdjdXJyZW5jeScsIGN1cnJlbmN5VW5pdENvbnZlcnRlcik7XG4gICAgfVxuXG4gICAgYWRkVW5pdENvbnZlcnRlcih1bml0VHlwZTogc3RyaW5nLCB1bml0Q29udmVydGVyOiBVbml0Q29udmVydGVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMubWFwW3VuaXRUeXBlXSA9IHVuaXRDb252ZXJ0ZXI7XG4gICAgfVxuXG4gICAgdG9Vc2VyRm9ybWF0KGRhdGFUeXBlOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIG9wdGlvbnM/OiBVbml0Q29udmVydGVyT3B0aW9ucyk6IHN0cmluZyB7XG5cbiAgICAgICAgaWYgKCFkYXRhVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZm9ybWF0dGVyID0gdGhpcy5tYXBbZGF0YVR5cGVdO1xuICAgICAgICBpZiAoIWZvcm1hdHRlcikge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdHRlci50b1VzZXJGb3JtYXQodmFsdWUsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHRvSW50ZXJuYWxGb3JtYXQoZGF0YVR5cGU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG5cbiAgICAgICAgaWYgKCFkYXRhVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZm9ybWF0dGVyID0gdGhpcy5tYXBbZGF0YVR5cGVdO1xuICAgICAgICBpZiAoIWZvcm1hdHRlcikge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdHRlci50b0ludGVybmFsRm9ybWF0KHZhbHVlKTtcbiAgICB9XG59XG4iXX0=