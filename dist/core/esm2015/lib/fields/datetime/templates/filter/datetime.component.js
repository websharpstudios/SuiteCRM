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
import { Component, ViewChild, } from '@angular/core';
import { NgbCalendar, NgbPopover, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { isEmptyString } from 'common';
import { BaseDateTimeComponent } from '../../../base/datetime/base-datetime.component';
import { DataTypeFormatter } from '../../../../services/formatters/data-type.formatter.service';
import { DatetimeFormatter } from "../../../../services/formatters/datetime/datetime-formatter.service";
import { DateTimeModel } from "../../datetime.model";
import { FieldLogicManager } from '../../../field-logic/field-logic.manager';
export class DateTimeFilterFieldComponent extends BaseDateTimeComponent {
    constructor(formatter, typeFormatter, calendar, config, logic) {
        super(formatter, typeFormatter, logic);
        this.formatter = formatter;
        this.typeFormatter = typeFormatter;
        this.calendar = calendar;
        this.config = config;
        this.logic = logic;
        this.dateTimeModel = new DateTimeModel();
        config.autoClose = "outside";
        config.placement = this.getPlacement();
    }
    ngOnInit() {
        super.ngOnInit();
        const values = (this.field && this.field.criteria && this.field.criteria.values) || [];
        let criteria = '';
        if (values.length > 0) {
            criteria = this.field.criteria.values[0];
        }
        // Note: handle NgbDatePicker default validation
        // Note: convert empty form value to null for the ngb date validator to pass it
        if (isEmptyString(criteria)) {
            this.dateTimeModel.date = this.calendar.getToday();
            this.dateTimeModel.time = { hour: 0, minute: 0, second: 0 };
            this.field.formControl.setValue(null);
        }
        else {
            this.dateTimeModel = DateTimeModel.toDateTimeStruct(this.formatter, criteria);
            if (this.dateTimeModel === null) {
                this.field.formControl.setValue(null);
                return;
            }
            this.setFormValues(this.dateTimeModel.toUserFormat(this.formatter));
        }
        // enable seconds in timepicker
        if (this.formatter.getTimeFormat().includes('ss')) {
            this.dateTimeModel.displaySeconds = true;
        }
        this.subscribeValueChanges();
    }
    ngOnDestroy() {
        this.unsubscribeAll();
    }
    setFormValues(dateTimeString) {
        this.field.formControl.setValue(dateTimeString);
        this.field.formControl.markAsDirty();
    }
    setFieldValue(newValue) {
        this.field.value = newValue;
        this.field.criteria.operator = '=';
        this.field.criteria.values = [newValue];
    }
    onDateChange(date) {
        this.dateTimeModel.date = date;
        this.setFormValues(this.dateTimeModel.toUserFormat(this.formatter));
    }
    onTimeChange(time) {
        this.dateTimeModel.time = time;
        this.setFormValues(this.dateTimeModel.toUserFormat(this.formatter));
    }
    onInputChange($event) {
        const dateTimeModel = DateTimeModel.toDateTimeStruct(this.formatter, $event.target.value);
        if (!dateTimeModel) {
            return;
        }
        this.dateTimeModel = dateTimeModel;
    }
    getOpenButton() {
        return {
            klass: 'btn btn-sm btn-outline-secondary m-0 border-0',
            icon: 'calendar'
        };
    }
    getPlacement() {
        return ['bottom-right', 'top-right', 'bottom-left', 'top-left'];
    }
}
DateTimeFilterFieldComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-datetime-filter',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n\n<div class=\"input-group mr-2\">\n\n    <input\n        [ngClass]=\"klass\"\n        [placeholder]=\"getDateTimeFormat().toLowerCase()\"\n        [class.is-invalid]=\"field.formControl.invalid && field.formControl.touched\"\n        [formControl]=\"field.formControl\"\n        (change)=\"onInputChange($event)\"\n    >\n\n    <div class=\"input-group-append\">\n        <scrm-button [config]=\"getOpenButton()\" [ngbPopover]=\"calendarContent\">\n        </scrm-button>\n    </div>\n</div>\n\n<ng-template #calendarContent>\n    <div>\n        <div>\n            <ngb-datepicker name=\"datepicker\"\n                            [ngModel]=\"dateTimeModel.date\"\n                            (dateSelect)=\"onDateChange($event)\" [startDate]=\"dateTimeModel.date\"></ngb-datepicker>\n        </div>\n\n        <div class=\"d-flex justify-content-center mt-auto\">\n            <ngb-timepicker name=\"timepicker\"\n                            [ngModel]=\"dateTimeModel.time\" (ngModelChange)=\"onTimeChange($event)\"\n                            [seconds]=\"dateTimeModel.displaySeconds\" [hourStep]=\"dateTimeModel.hourStep\"\n                            [minuteStep]=\"dateTimeModel.minuteStep\"\n                            [secondStep]=\"dateTimeModel.secondStep\">\n            </ngb-timepicker>\n        </div>\n    </div>\n</ng-template>\n"
            },] }
];
DateTimeFilterFieldComponent.ctorParameters = () => [
    { type: DatetimeFormatter },
    { type: DataTypeFormatter },
    { type: NgbCalendar },
    { type: NgbPopoverConfig },
    { type: FieldLogicManager }
];
DateTimeFilterFieldComponent.propDecorators = {
    popover: [{ type: ViewChild, args: [NgbPopover, { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2ZpZWxkcy9kYXRldGltZS90ZW1wbGF0ZXMvZmlsdGVyL2RhdGV0aW1lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBcUIsU0FBUyxHQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxXQUFXLEVBQWlCLFVBQVUsRUFBRSxnQkFBZ0IsRUFBZ0IsTUFBTSw0QkFBNEIsQ0FBQztBQUNuSCxPQUFPLEVBQWtCLGFBQWEsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUN0RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQztBQUNyRixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw2REFBNkQsQ0FBQztBQUM5RixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxxRUFBcUUsQ0FBQztBQUN0RyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFbkQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFPM0UsTUFBTSxPQUFPLDRCQUE2QixTQUFRLHFCQUFxQjtJQU9uRSxZQUNjLFNBQTRCLEVBQzVCLGFBQWdDLEVBQ2hDLFFBQXFCLEVBQ3JCLE1BQXdCLEVBQ3hCLEtBQXdCO1FBRWxDLEtBQUssQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBTjdCLGNBQVMsR0FBVCxTQUFTLENBQW1CO1FBQzVCLGtCQUFhLEdBQWIsYUFBYSxDQUFtQjtRQUNoQyxhQUFRLEdBQVIsUUFBUSxDQUFhO1FBQ3JCLFdBQU0sR0FBTixNQUFNLENBQWtCO1FBQ3hCLFVBQUssR0FBTCxLQUFLLENBQW1C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RUQsWUFBWSxDQUFDLElBQTBCO1FBQ25DLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUMvQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxhQUFhLENBQUMsTUFBVztRQUNyQixNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFGLElBQUcsQ0FBQyxhQUFhLEVBQUM7WUFDZCxPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsYUFBYTtRQUNULE9BQU87WUFDSCxLQUFLLEVBQUUsK0NBQStDO1lBQ3RELElBQUksRUFBRSxVQUFVO1NBQ25CLENBQUM7SUFDTixDQUFDO0lBRUQsWUFBWTtRQUNSLE9BQU8sQ0FBQyxjQUFjLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNwRSxDQUFDOzs7WUFuR0osU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLCtxRkFBd0M7YUFFM0M7OztZQVRPLGlCQUFpQjtZQURqQixpQkFBaUI7WUFIakIsV0FBVztZQUE2QixnQkFBZ0I7WUFPeEQsaUJBQWlCOzs7c0JBU3BCLFNBQVMsU0FBQyxVQUFVLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgT25EZXN0cm95LCBPbkluaXQsIFZpZXdDaGlsZCx9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ2JDYWxlbmRhciwgTmdiRGF0ZVN0cnVjdCwgTmdiUG9wb3ZlciwgTmdiUG9wb3ZlckNvbmZpZywgTmdiVGltZVN0cnVjdH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHtCdXR0b25JbnRlcmZhY2UsIGlzRW1wdHlTdHJpbmd9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge0Jhc2VEYXRlVGltZUNvbXBvbmVudH0gZnJvbSAnLi4vLi4vLi4vYmFzZS9kYXRldGltZS9iYXNlLWRhdGV0aW1lLmNvbXBvbmVudCc7XG5pbXBvcnQge0RhdGFUeXBlRm9ybWF0dGVyfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9mb3JtYXR0ZXJzL2RhdGEtdHlwZS5mb3JtYXR0ZXIuc2VydmljZSc7XG5pbXBvcnQge0RhdGV0aW1lRm9ybWF0dGVyfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmljZXMvZm9ybWF0dGVycy9kYXRldGltZS9kYXRldGltZS1mb3JtYXR0ZXIuc2VydmljZVwiO1xuaW1wb3J0IHtEYXRlVGltZU1vZGVsfSBmcm9tIFwiLi4vLi4vZGF0ZXRpbWUubW9kZWxcIjtcbmltcG9ydCB7UGxhY2VtZW50QXJyYXl9IGZyb20gXCJAbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC91dGlsL3Bvc2l0aW9uaW5nXCI7XG5pbXBvcnQge0ZpZWxkTG9naWNNYW5hZ2VyfSBmcm9tICcuLi8uLi8uLi9maWVsZC1sb2dpYy9maWVsZC1sb2dpYy5tYW5hZ2VyJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLWRhdGV0aW1lLWZpbHRlcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2RhdGV0aW1lLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIERhdGVUaW1lRmlsdGVyRmllbGRDb21wb25lbnQgZXh0ZW5kcyBCYXNlRGF0ZVRpbWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICBAVmlld0NoaWxkKE5nYlBvcG92ZXIsIHtzdGF0aWM6IHRydWV9KVxuICAgIHByaXZhdGUgcG9wb3ZlcjogTmdiUG9wb3ZlcjtcblxuICAgIGRhdGVUaW1lTW9kZWw6IERhdGVUaW1lTW9kZWwgPSBuZXcgRGF0ZVRpbWVNb2RlbCgpO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBmb3JtYXR0ZXI6IERhdGV0aW1lRm9ybWF0dGVyLFxuICAgICAgICBwcm90ZWN0ZWQgdHlwZUZvcm1hdHRlcjogRGF0YVR5cGVGb3JtYXR0ZXIsXG4gICAgICAgIHByb3RlY3RlZCBjYWxlbmRhcjogTmdiQ2FsZW5kYXIsXG4gICAgICAgIHByb3RlY3RlZCBjb25maWc6IE5nYlBvcG92ZXJDb25maWcsXG4gICAgICAgIHByb3RlY3RlZCBsb2dpYzogRmllbGRMb2dpY01hbmFnZXJcbiAgICApIHtcbiAgICAgICAgc3VwZXIoZm9ybWF0dGVyLCB0eXBlRm9ybWF0dGVyLCBsb2dpYyk7XG4gICAgICAgIGNvbmZpZy5hdXRvQ2xvc2UgPSBcIm91dHNpZGVcIjtcbiAgICAgICAgY29uZmlnLnBsYWNlbWVudCA9IHRoaXMuZ2V0UGxhY2VtZW50KCk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm5nT25Jbml0KCk7XG5cbiAgICAgICAgY29uc3QgdmFsdWVzID0gKHRoaXMuZmllbGQgJiYgdGhpcy5maWVsZC5jcml0ZXJpYSAmJiB0aGlzLmZpZWxkLmNyaXRlcmlhLnZhbHVlcykgfHwgW107XG5cbiAgICAgICAgbGV0IGNyaXRlcmlhID0gJyc7XG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY3JpdGVyaWEgPSB0aGlzLmZpZWxkLmNyaXRlcmlhLnZhbHVlc1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdGU6IGhhbmRsZSBOZ2JEYXRlUGlja2VyIGRlZmF1bHQgdmFsaWRhdGlvblxuICAgICAgICAvLyBOb3RlOiBjb252ZXJ0IGVtcHR5IGZvcm0gdmFsdWUgdG8gbnVsbCBmb3IgdGhlIG5nYiBkYXRlIHZhbGlkYXRvciB0byBwYXNzIGl0XG4gICAgICAgIGlmIChpc0VtcHR5U3RyaW5nKGNyaXRlcmlhKSkge1xuICAgICAgICAgICAgdGhpcy5kYXRlVGltZU1vZGVsLmRhdGUgPSB0aGlzLmNhbGVuZGFyLmdldFRvZGF5KCkgYXMgTmdiRGF0ZVN0cnVjdDtcbiAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVNb2RlbC50aW1lID0ge2hvdXI6IDAsIG1pbnV0ZTogMCwgc2Vjb25kOiAwfSBhcyBOZ2JUaW1lU3RydWN0O1xuICAgICAgICAgICAgdGhpcy5maWVsZC5mb3JtQ29udHJvbC5zZXRWYWx1ZShudWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVNb2RlbCA9IERhdGVUaW1lTW9kZWwudG9EYXRlVGltZVN0cnVjdCh0aGlzLmZvcm1hdHRlciwgY3JpdGVyaWEpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0ZVRpbWVNb2RlbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQuZm9ybUNvbnRyb2wuc2V0VmFsdWUobnVsbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRGb3JtVmFsdWVzKHRoaXMuZGF0ZVRpbWVNb2RlbC50b1VzZXJGb3JtYXQodGhpcy5mb3JtYXR0ZXIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGVuYWJsZSBzZWNvbmRzIGluIHRpbWVwaWNrZXJcbiAgICAgICAgaWYgKHRoaXMuZm9ybWF0dGVyLmdldFRpbWVGb3JtYXQoKS5pbmNsdWRlcygnc3MnKSkge1xuICAgICAgICAgICAgdGhpcy5kYXRlVGltZU1vZGVsLmRpc3BsYXlTZWNvbmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlVmFsdWVDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmVBbGwoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0Rm9ybVZhbHVlcyhkYXRlVGltZVN0cmluZzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZmllbGQuZm9ybUNvbnRyb2wuc2V0VmFsdWUoZGF0ZVRpbWVTdHJpbmcpO1xuICAgICAgICB0aGlzLmZpZWxkLmZvcm1Db250cm9sLm1hcmtBc0RpcnR5KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldEZpZWxkVmFsdWUobmV3VmFsdWUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5maWVsZC52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB0aGlzLmZpZWxkLmNyaXRlcmlhLm9wZXJhdG9yID0gJz0nO1xuICAgICAgICB0aGlzLmZpZWxkLmNyaXRlcmlhLnZhbHVlcyA9IFtuZXdWYWx1ZV07XG4gICAgfVxuXG4gICAgb25EYXRlQ2hhbmdlKGRhdGU6IE5nYkRhdGVTdHJ1Y3QgfCBudWxsKSB7XG4gICAgICAgIHRoaXMuZGF0ZVRpbWVNb2RlbC5kYXRlID0gZGF0ZTtcbiAgICAgICAgdGhpcy5zZXRGb3JtVmFsdWVzKHRoaXMuZGF0ZVRpbWVNb2RlbC50b1VzZXJGb3JtYXQodGhpcy5mb3JtYXR0ZXIpKTtcbiAgICB9XG5cbiAgICBvblRpbWVDaGFuZ2UodGltZTogTmdiVGltZVN0cnVjdCB8IG51bGwpIHtcbiAgICAgICAgdGhpcy5kYXRlVGltZU1vZGVsLnRpbWUgPSB0aW1lO1xuICAgICAgICB0aGlzLnNldEZvcm1WYWx1ZXModGhpcy5kYXRlVGltZU1vZGVsLnRvVXNlckZvcm1hdCh0aGlzLmZvcm1hdHRlcikpO1xuICAgIH1cblxuICAgIG9uSW5wdXRDaGFuZ2UoJGV2ZW50OiBhbnkpIHtcbiAgICAgICAgY29uc3QgZGF0ZVRpbWVNb2RlbCA9IERhdGVUaW1lTW9kZWwudG9EYXRlVGltZVN0cnVjdCh0aGlzLmZvcm1hdHRlciwgJGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgIGlmKCFkYXRlVGltZU1vZGVsKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGVUaW1lTW9kZWwgPSBkYXRlVGltZU1vZGVsO1xuICAgIH1cblxuICAgIGdldE9wZW5CdXR0b24oKTogQnV0dG9uSW50ZXJmYWNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtsYXNzOiAnYnRuIGJ0bi1zbSBidG4tb3V0bGluZS1zZWNvbmRhcnkgbS0wIGJvcmRlci0wJyxcbiAgICAgICAgICAgIGljb246ICdjYWxlbmRhcidcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRQbGFjZW1lbnQoKTogUGxhY2VtZW50QXJyYXkge1xuICAgICAgICByZXR1cm4gWydib3R0b20tcmlnaHQnLCAndG9wLXJpZ2h0JywgJ2JvdHRvbS1sZWZ0JywgJ3RvcC1sZWZ0J107XG4gICAgfVxuXG59XG4iXX0=