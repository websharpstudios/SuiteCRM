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
import { Component, } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { isEmptyString } from 'common';
import { BaseDateTimeComponent } from '../../../base/datetime/base-datetime.component';
import { DataTypeFormatter } from '../../../../services/formatters/data-type.formatter.service';
import { DateParserFormatter } from '../../../base/datetime/date/date-parser-formatter.service';
import { DateFormatter } from '../../../../services/formatters/datetime/date-formatter.service';
import { DateAdapter } from '../../../base/datetime/date/date-adapter.service';
import { FieldLogicManager } from '../../../field-logic/field-logic.manager';
export class DateFilterFieldComponent extends BaseDateTimeComponent {
    constructor(formatter, typeFormatter, logic) {
        super(formatter, typeFormatter, logic);
        this.formatter = formatter;
        this.typeFormatter = typeFormatter;
        this.logic = logic;
    }
    ngOnInit() {
        super.ngOnInit();
        let current = '';
        if (this.field.criteria.values && this.field.criteria.values.length > 0) {
            current = this.field.criteria.values[0];
        }
        let formattedValue = null;
        if (!isEmptyString(current)) {
            current = current.trim();
            formattedValue = this.typeFormatter.toUserFormat(this.field.type, current, { mode: 'edit' });
        }
        this.field.value = current;
        this.field.formControl.setValue(formattedValue);
        this.field.formControl.markAsDirty();
        this.setModel(current);
        this.subscribeValueChanges();
    }
    ngOnDestroy() {
        this.unsubscribeAll();
    }
    setModel($event) {
        this.dateModel = this.formatter.userDateFormatToStruct($event);
    }
    getOpenButton(datepicker) {
        return {
            klass: 'btn btn-sm btn-outline-secondary m-0 border-0',
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            onClick: () => {
                datepicker.toggle();
                datepicker.navigateTo(this.dateModel);
            },
            icon: 'calendar'
        };
    }
    getPlacement() {
        return ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
    }
    setFieldValue(newValue) {
        this.field.value = newValue;
        this.field.criteria.operator = '=';
        this.field.criteria.values = [newValue];
    }
}
DateFilterFieldComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-date-filter',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<div class=\"input-group\">\n    <input ngbDatepicker\n           [ngClass]=\"klass\"\n           [placement]=\"getPlacement()\"\n           [placeholder]=\"getDateFormat().toLowerCase()\"\n           [class.is-invalid]=\"field.formControl.invalid && field.formControl.touched\"\n           [formControl]=\"field.formControl\"\n           [startDate]=\"dateModel\"\n           (ngModelChange)=\"setModel($event)\"\n           #datepicker=\"ngbDatepicker\">\n    <span class=\"input-group-append align-items-end\">\n        <scrm-button [config]=\"getOpenButton(datepicker)\">\n        </scrm-button>\n    </span>\n</div>\n",
                providers: [
                    { provide: NgbDateAdapter, useClass: DateAdapter },
                    { provide: NgbDateParserFormatter, useClass: DateParserFormatter }
                ]
            },] }
];
DateFilterFieldComponent.ctorParameters = () => [
    { type: DateFormatter },
    { type: DataTypeFormatter },
    { type: FieldLogicManager }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvZmllbGRzL2RhdGUvdGVtcGxhdGVzL2ZpbHRlci9kYXRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFNBQVMsR0FBcUIsTUFBTSxlQUFlLENBQUM7QUFDNUQsT0FBTyxFQUFDLGNBQWMsRUFBRSxzQkFBc0IsRUFBb0MsTUFBTSw0QkFBNEIsQ0FBQztBQUNySCxPQUFPLEVBQWtCLGFBQWEsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUV0RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQztBQUNyRixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw2REFBNkQsQ0FBQztBQUM5RixPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSwyREFBMkQsQ0FBQztBQUM5RixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0saUVBQWlFLENBQUM7QUFDOUYsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGtEQUFrRCxDQUFDO0FBQzdFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDBDQUEwQyxDQUFDO0FBWTNFLE1BQU0sT0FBTyx3QkFBeUIsU0FBUSxxQkFBcUI7SUFJL0QsWUFDYyxTQUF3QixFQUN4QixhQUFnQyxFQUNoQyxLQUF3QjtRQUVsQyxLQUFLLENBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUo3QixjQUFTLEdBQVQsU0FBUyxDQUFlO1FBQ3hCLGtCQUFhLEdBQWIsYUFBYSxDQUFtQjtRQUNoQyxVQUFLLEdBQUwsS0FBSyxDQUFtQjtJQUd0QyxDQUFDO0lBRUQsUUFBUTtRQUNKLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVqQixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDckUsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMzQztRQUVELElBQUksY0FBYyxHQUFHLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3pCLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDekIsY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1NBQzlGO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVyQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXZCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxRQUFRLENBQUMsTUFBVztRQUNoQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELGFBQWEsQ0FBQyxVQUE4QjtRQUN4QyxPQUFPO1lBQ0gsS0FBSyxFQUFFLCtDQUErQztZQUN0RCw0RUFBNEU7WUFDNUUsT0FBTyxFQUFFLEdBQUcsRUFBRTtnQkFDVixVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3BCLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFDLENBQUM7WUFDRCxJQUFJLEVBQUUsVUFBVTtTQUNuQixDQUFDO0lBQ04sQ0FBQztJQUVELFlBQVk7UUFDUixPQUFPLENBQUMsYUFBYSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVTLGFBQWEsQ0FBQyxRQUFRO1FBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ25DLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVDLENBQUM7OztZQXZFSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsMjlEQUFvQztnQkFFcEMsU0FBUyxFQUFFO29CQUNQLEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFDO29CQUNoRCxFQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUM7aUJBQ25FO2FBQ0o7OztZQWJPLGFBQWE7WUFGYixpQkFBaUI7WUFJakIsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgT25EZXN0cm95LCBPbkluaXQsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiRGF0ZUFkYXB0ZXIsIE5nYkRhdGVQYXJzZXJGb3JtYXR0ZXIsIE5nYkRhdGVTdHJ1Y3QsIE5nYklucHV0RGF0ZXBpY2tlcn0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHtCdXR0b25JbnRlcmZhY2UsIGlzRW1wdHlTdHJpbmd9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge1BsYWNlbWVudEFycmF5fSBmcm9tICdAbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC91dGlsL3Bvc2l0aW9uaW5nJztcbmltcG9ydCB7QmFzZURhdGVUaW1lQ29tcG9uZW50fSBmcm9tICcuLi8uLi8uLi9iYXNlL2RhdGV0aW1lL2Jhc2UtZGF0ZXRpbWUuY29tcG9uZW50JztcbmltcG9ydCB7RGF0YVR5cGVGb3JtYXR0ZXJ9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL2Zvcm1hdHRlcnMvZGF0YS10eXBlLmZvcm1hdHRlci5zZXJ2aWNlJztcbmltcG9ydCB7RGF0ZVBhcnNlckZvcm1hdHRlcn0gZnJvbSAnLi4vLi4vLi4vYmFzZS9kYXRldGltZS9kYXRlL2RhdGUtcGFyc2VyLWZvcm1hdHRlci5zZXJ2aWNlJztcbmltcG9ydCB7RGF0ZUZvcm1hdHRlcn0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZXMvZm9ybWF0dGVycy9kYXRldGltZS9kYXRlLWZvcm1hdHRlci5zZXJ2aWNlJztcbmltcG9ydCB7RGF0ZUFkYXB0ZXJ9IGZyb20gJy4uLy4uLy4uL2Jhc2UvZGF0ZXRpbWUvZGF0ZS9kYXRlLWFkYXB0ZXIuc2VydmljZSc7XG5pbXBvcnQge0ZpZWxkTG9naWNNYW5hZ2VyfSBmcm9tICcuLi8uLi8uLi9maWVsZC1sb2dpYy9maWVsZC1sb2dpYy5tYW5hZ2VyJztcblxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tZGF0ZS1maWx0ZXInLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9kYXRlLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFtdLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7cHJvdmlkZTogTmdiRGF0ZUFkYXB0ZXIsIHVzZUNsYXNzOiBEYXRlQWRhcHRlcn0sXG4gICAgICAgIHtwcm92aWRlOiBOZ2JEYXRlUGFyc2VyRm9ybWF0dGVyLCB1c2VDbGFzczogRGF0ZVBhcnNlckZvcm1hdHRlcn1cbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIERhdGVGaWx0ZXJGaWVsZENvbXBvbmVudCBleHRlbmRzIEJhc2VEYXRlVGltZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIHB1YmxpYyBkYXRlTW9kZWw6IE5nYkRhdGVTdHJ1Y3Q7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGZvcm1hdHRlcjogRGF0ZUZvcm1hdHRlcixcbiAgICAgICAgcHJvdGVjdGVkIHR5cGVGb3JtYXR0ZXI6IERhdGFUeXBlRm9ybWF0dGVyLFxuICAgICAgICBwcm90ZWN0ZWQgbG9naWM6IEZpZWxkTG9naWNNYW5hZ2VyXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGZvcm1hdHRlciwgdHlwZUZvcm1hdHRlciwgbG9naWMpO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBzdXBlci5uZ09uSW5pdCgpO1xuXG4gICAgICAgIGxldCBjdXJyZW50ID0gJyc7XG4gICAgICAgIGlmICh0aGlzLmZpZWxkLmNyaXRlcmlhLnZhbHVlcyAmJiB0aGlzLmZpZWxkLmNyaXRlcmlhLnZhbHVlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjdXJyZW50ID0gdGhpcy5maWVsZC5jcml0ZXJpYS52YWx1ZXNbMF07XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZm9ybWF0dGVkVmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAoIWlzRW1wdHlTdHJpbmcoY3VycmVudCkpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnRyaW0oKTtcbiAgICAgICAgICAgIGZvcm1hdHRlZFZhbHVlID0gdGhpcy50eXBlRm9ybWF0dGVyLnRvVXNlckZvcm1hdCh0aGlzLmZpZWxkLnR5cGUsIGN1cnJlbnQsIHttb2RlOiAnZWRpdCd9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpZWxkLnZhbHVlID0gY3VycmVudDtcbiAgICAgICAgdGhpcy5maWVsZC5mb3JtQ29udHJvbC5zZXRWYWx1ZShmb3JtYXR0ZWRWYWx1ZSk7XG4gICAgICAgIHRoaXMuZmllbGQuZm9ybUNvbnRyb2wubWFya0FzRGlydHkoKTtcblxuICAgICAgICB0aGlzLnNldE1vZGVsKGN1cnJlbnQpO1xuXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlVmFsdWVDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmVBbGwoKTtcbiAgICB9XG5cbiAgICBzZXRNb2RlbCgkZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLmRhdGVNb2RlbCA9IHRoaXMuZm9ybWF0dGVyLnVzZXJEYXRlRm9ybWF0VG9TdHJ1Y3QoJGV2ZW50KTtcbiAgICB9XG5cbiAgICBnZXRPcGVuQnV0dG9uKGRhdGVwaWNrZXI6IE5nYklucHV0RGF0ZXBpY2tlcik6IEJ1dHRvbkludGVyZmFjZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBrbGFzczogJ2J0biBidG4tc20gYnRuLW91dGxpbmUtc2Vjb25kYXJ5IG0tMCBib3JkZXItMCcsXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2V4cGxpY2l0LWZ1bmN0aW9uLXJldHVybi10eXBlXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZGF0ZXBpY2tlci50b2dnbGUoKTtcbiAgICAgICAgICAgICAgICBkYXRlcGlja2VyLm5hdmlnYXRlVG8odGhpcy5kYXRlTW9kZWwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGljb246ICdjYWxlbmRhcidcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRQbGFjZW1lbnQoKTogUGxhY2VtZW50QXJyYXkge1xuICAgICAgICByZXR1cm4gWydib3R0b20tbGVmdCcsICdib3R0b20tcmlnaHQnLCAndG9wLWxlZnQnLCAndG9wLXJpZ2h0J107XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldEZpZWxkVmFsdWUobmV3VmFsdWUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5maWVsZC52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB0aGlzLmZpZWxkLmNyaXRlcmlhLm9wZXJhdG9yID0gJz0nO1xuICAgICAgICB0aGlzLmZpZWxkLmNyaXRlcmlhLnZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuXG59XG4iXX0=