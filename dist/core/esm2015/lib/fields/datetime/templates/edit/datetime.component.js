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
export class DateTimeEditFieldComponent extends BaseDateTimeComponent {
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
        // Note: handle NgbDatePicker default validation
        // Note: convert empty form value to null for the ngb date validator to pass it
        if (isEmptyString(this.field.value)) {
            this.dateTimeModel.date = this.calendar.getToday();
            this.dateTimeModel.time = { hour: 0, minute: 0, second: 0 };
            this.field.formControl.setValue(null);
        }
        else {
            this.dateTimeModel = DateTimeModel.toDateTimeStruct(this.formatter, this.field.value);
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
        this.field.value = dateTimeString;
        this.field.formControl.setValue(dateTimeString);
        this.field.formControl.markAsDirty();
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
DateTimeEditFieldComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-datetime-edit',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n\n<div class=\"input-group mr-2\">\n\n    <input\n        [ngClass]=\"klass\"\n        [placeholder]=\"getDateTimeFormat().toLowerCase()\"\n        [class.is-invalid]=\"field.formControl.invalid && field.formControl.touched\"\n        [formControl]=\"field.formControl\"\n        (change)=\"onInputChange($event)\"\n    >\n\n    <div class=\"input-group-append\">\n        <scrm-button [config]=\"getOpenButton()\" [ngbPopover]=\"calendarContent\">\n        </scrm-button>\n    </div>\n</div>\n\n<ng-template #calendarContent>\n    <div>\n        <div>\n            <ngb-datepicker name=\"datepicker\"\n                            [ngModel]=\"dateTimeModel.date\"\n                            (dateSelect)=\"onDateChange($event)\" [startDate]=\"dateTimeModel.date\"></ngb-datepicker>\n        </div>\n\n        <div class=\"d-flex justify-content-center mt-auto\">\n            <ngb-timepicker name=\"timepicker\"\n                            [ngModel]=\"dateTimeModel.time\" (ngModelChange)=\"onTimeChange($event)\"\n                            [seconds]=\"dateTimeModel.displaySeconds\" [hourStep]=\"dateTimeModel.hourStep\"\n                            [minuteStep]=\"dateTimeModel.minuteStep\"\n                            [secondStep]=\"dateTimeModel.secondStep\">\n            </ngb-timepicker>\n        </div>\n    </div>\n</ng-template>\n"
            },] }
];
DateTimeEditFieldComponent.ctorParameters = () => [
    { type: DatetimeFormatter },
    { type: DataTypeFormatter },
    { type: NgbCalendar },
    { type: NgbPopoverConfig },
    { type: FieldLogicManager }
];
DateTimeEditFieldComponent.propDecorators = {
    popover: [{ type: ViewChild, args: [NgbPopover, { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2ZpZWxkcy9kYXRldGltZS90ZW1wbGF0ZXMvZWRpdC9kYXRldGltZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQXFCLFNBQVMsR0FBRSxNQUFNLGVBQWUsQ0FBQztBQUN2RSxPQUFPLEVBQ0gsV0FBVyxFQUVYLFVBQVUsRUFBRSxnQkFBZ0IsRUFFL0IsTUFBTSw0QkFBNEIsQ0FBQztBQUNwQyxPQUFPLEVBQWtCLGFBQWEsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUN0RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQztBQUNyRixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw2REFBNkQsQ0FBQztBQUM5RixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxxRUFBcUUsQ0FBQztBQUN0RyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFbkQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFPM0UsTUFBTSxPQUFPLDBCQUEyQixTQUFRLHFCQUFxQjtJQU9qRSxZQUNjLFNBQTRCLEVBQzVCLGFBQWdDLEVBQ2hDLFFBQXFCLEVBQ3JCLE1BQXdCLEVBQ3hCLEtBQXdCO1FBRWxDLEtBQUssQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBTjdCLGNBQVMsR0FBVCxTQUFTLENBQW1CO1FBQzVCLGtCQUFhLEdBQWIsYUFBYSxDQUFtQjtRQUNoQyxhQUFRLEdBQVIsUUFBUSxDQUFhO1FBQ3JCLFdBQU0sR0FBTixNQUFNLENBQWtCO1FBQ3hCLFVBQUssR0FBTCxLQUFLLENBQW1CO1FBUHRDLGtCQUFhLEdBQWtCLElBQUksYUFBYSxFQUFFLENBQUM7UUFVL0MsTUFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDN0IsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUVELFFBQVE7UUFFSixnREFBZ0Q7UUFDaEQsK0VBQStFO1FBQy9FLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDakMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQW1CLENBQUM7WUFDcEUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsRUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBa0IsQ0FBQztZQUMzRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekM7YUFBTTtZQUNILElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0RixJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssSUFBSSxFQUFFO2dCQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RDLE9BQU87YUFDVjtZQUNELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7U0FDdkU7UUFFRCwrQkFBK0I7UUFDL0IsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMvQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7U0FDNUM7UUFFRCxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRVMsYUFBYSxDQUFDLGNBQXNCO1FBQzFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQztRQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUEwQjtRQUNuQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDL0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsWUFBWSxDQUFDLElBQTBCO1FBQ25DLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUMvQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxhQUFhLENBQUMsTUFBVztRQUNyQixNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFGLElBQUcsQ0FBQyxhQUFhLEVBQUM7WUFDZCxPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsYUFBYTtRQUNULE9BQU87WUFDSCxLQUFLLEVBQUUsK0NBQStDO1lBQ3RELElBQUksRUFBRSxVQUFVO1NBQ25CLENBQUM7SUFDTixDQUFDO0lBRUQsWUFBWTtRQUNSLE9BQU8sQ0FBQyxjQUFjLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNwRSxDQUFDOzs7WUF0RkosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLCtxRkFBd0M7YUFFM0M7OztZQVRPLGlCQUFpQjtZQURqQixpQkFBaUI7WUFQckIsV0FBVztZQUVDLGdCQUFnQjtZQVN4QixpQkFBaUI7OztzQkFTcEIsU0FBUyxTQUFDLFVBQVUsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBPbkRlc3Ryb3ksIE9uSW5pdCwgVmlld0NoaWxkLH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIE5nYkNhbGVuZGFyLFxuICAgIE5nYkRhdGVTdHJ1Y3QsXG4gICAgTmdiUG9wb3ZlciwgTmdiUG9wb3ZlckNvbmZpZyxcbiAgICBOZ2JUaW1lU3RydWN0XG59IGZyb20gJ0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwJztcbmltcG9ydCB7QnV0dG9uSW50ZXJmYWNlLCBpc0VtcHR5U3RyaW5nfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtCYXNlRGF0ZVRpbWVDb21wb25lbnR9IGZyb20gJy4uLy4uLy4uL2Jhc2UvZGF0ZXRpbWUvYmFzZS1kYXRldGltZS5jb21wb25lbnQnO1xuaW1wb3J0IHtEYXRhVHlwZUZvcm1hdHRlcn0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZXMvZm9ybWF0dGVycy9kYXRhLXR5cGUuZm9ybWF0dGVyLnNlcnZpY2UnO1xuaW1wb3J0IHtEYXRldGltZUZvcm1hdHRlcn0gZnJvbSBcIi4uLy4uLy4uLy4uL3NlcnZpY2VzL2Zvcm1hdHRlcnMvZGF0ZXRpbWUvZGF0ZXRpbWUtZm9ybWF0dGVyLnNlcnZpY2VcIjtcbmltcG9ydCB7RGF0ZVRpbWVNb2RlbH0gZnJvbSBcIi4uLy4uL2RhdGV0aW1lLm1vZGVsXCI7XG5pbXBvcnQge1BsYWNlbWVudEFycmF5fSBmcm9tIFwiQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdXRpbC9wb3NpdGlvbmluZ1wiO1xuaW1wb3J0IHtGaWVsZExvZ2ljTWFuYWdlcn0gZnJvbSAnLi4vLi4vLi4vZmllbGQtbG9naWMvZmllbGQtbG9naWMubWFuYWdlcic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1kYXRldGltZS1lZGl0JyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vZGF0ZXRpbWUuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogW11cbn0pXG5leHBvcnQgY2xhc3MgRGF0ZVRpbWVFZGl0RmllbGRDb21wb25lbnQgZXh0ZW5kcyBCYXNlRGF0ZVRpbWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICBAVmlld0NoaWxkKE5nYlBvcG92ZXIsIHtzdGF0aWM6IHRydWV9KVxuICAgIHByaXZhdGUgcG9wb3ZlcjogTmdiUG9wb3ZlcjtcblxuICAgIGRhdGVUaW1lTW9kZWw6IERhdGVUaW1lTW9kZWwgPSBuZXcgRGF0ZVRpbWVNb2RlbCgpO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBmb3JtYXR0ZXI6IERhdGV0aW1lRm9ybWF0dGVyLFxuICAgICAgICBwcm90ZWN0ZWQgdHlwZUZvcm1hdHRlcjogRGF0YVR5cGVGb3JtYXR0ZXIsXG4gICAgICAgIHByb3RlY3RlZCBjYWxlbmRhcjogTmdiQ2FsZW5kYXIsXG4gICAgICAgIHByb3RlY3RlZCBjb25maWc6IE5nYlBvcG92ZXJDb25maWcsXG4gICAgICAgIHByb3RlY3RlZCBsb2dpYzogRmllbGRMb2dpY01hbmFnZXJcbiAgICApIHtcbiAgICAgICAgc3VwZXIoZm9ybWF0dGVyLCB0eXBlRm9ybWF0dGVyLCBsb2dpYyk7XG4gICAgICAgIGNvbmZpZy5hdXRvQ2xvc2UgPSBcIm91dHNpZGVcIjtcbiAgICAgICAgY29uZmlnLnBsYWNlbWVudCA9IHRoaXMuZ2V0UGxhY2VtZW50KCk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG5cbiAgICAgICAgLy8gTm90ZTogaGFuZGxlIE5nYkRhdGVQaWNrZXIgZGVmYXVsdCB2YWxpZGF0aW9uXG4gICAgICAgIC8vIE5vdGU6IGNvbnZlcnQgZW1wdHkgZm9ybSB2YWx1ZSB0byBudWxsIGZvciB0aGUgbmdiIGRhdGUgdmFsaWRhdG9yIHRvIHBhc3MgaXRcbiAgICAgICAgaWYgKGlzRW1wdHlTdHJpbmcodGhpcy5maWVsZC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0ZVRpbWVNb2RlbC5kYXRlID0gdGhpcy5jYWxlbmRhci5nZXRUb2RheSgpIGFzIE5nYkRhdGVTdHJ1Y3Q7XG4gICAgICAgICAgICB0aGlzLmRhdGVUaW1lTW9kZWwudGltZSA9IHtob3VyOiAwLCBtaW51dGU6IDAsIHNlY29uZDogMH0gYXMgTmdiVGltZVN0cnVjdDtcbiAgICAgICAgICAgIHRoaXMuZmllbGQuZm9ybUNvbnRyb2wuc2V0VmFsdWUobnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRhdGVUaW1lTW9kZWwgPSBEYXRlVGltZU1vZGVsLnRvRGF0ZVRpbWVTdHJ1Y3QodGhpcy5mb3JtYXR0ZXIsIHRoaXMuZmllbGQudmFsdWUpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0ZVRpbWVNb2RlbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmllbGQuZm9ybUNvbnRyb2wuc2V0VmFsdWUobnVsbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRGb3JtVmFsdWVzKHRoaXMuZGF0ZVRpbWVNb2RlbC50b1VzZXJGb3JtYXQodGhpcy5mb3JtYXR0ZXIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGVuYWJsZSBzZWNvbmRzIGluIHRpbWVwaWNrZXJcbiAgICAgICAgaWYgKHRoaXMuZm9ybWF0dGVyLmdldFRpbWVGb3JtYXQoKS5pbmNsdWRlcygnc3MnKSkge1xuICAgICAgICAgICAgdGhpcy5kYXRlVGltZU1vZGVsLmRpc3BsYXlTZWNvbmRzID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlVmFsdWVDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmVBbGwoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0Rm9ybVZhbHVlcyhkYXRlVGltZVN0cmluZzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZmllbGQudmFsdWUgPSBkYXRlVGltZVN0cmluZztcbiAgICAgICAgdGhpcy5maWVsZC5mb3JtQ29udHJvbC5zZXRWYWx1ZShkYXRlVGltZVN0cmluZyk7XG4gICAgICAgIHRoaXMuZmllbGQuZm9ybUNvbnRyb2wubWFya0FzRGlydHkoKTtcbiAgICB9XG5cbiAgICBvbkRhdGVDaGFuZ2UoZGF0ZTogTmdiRGF0ZVN0cnVjdCB8IG51bGwpIHtcbiAgICAgICAgdGhpcy5kYXRlVGltZU1vZGVsLmRhdGUgPSBkYXRlO1xuICAgICAgICB0aGlzLnNldEZvcm1WYWx1ZXModGhpcy5kYXRlVGltZU1vZGVsLnRvVXNlckZvcm1hdCh0aGlzLmZvcm1hdHRlcikpO1xuICAgIH1cblxuICAgIG9uVGltZUNoYW5nZSh0aW1lOiBOZ2JUaW1lU3RydWN0IHwgbnVsbCkge1xuICAgICAgICB0aGlzLmRhdGVUaW1lTW9kZWwudGltZSA9IHRpbWU7XG4gICAgICAgIHRoaXMuc2V0Rm9ybVZhbHVlcyh0aGlzLmRhdGVUaW1lTW9kZWwudG9Vc2VyRm9ybWF0KHRoaXMuZm9ybWF0dGVyKSk7XG4gICAgfVxuXG4gICAgb25JbnB1dENoYW5nZSgkZXZlbnQ6IGFueSkge1xuICAgICAgICBjb25zdCBkYXRlVGltZU1vZGVsID0gRGF0ZVRpbWVNb2RlbC50b0RhdGVUaW1lU3RydWN0KHRoaXMuZm9ybWF0dGVyLCAkZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgaWYoIWRhdGVUaW1lTW9kZWwpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0ZVRpbWVNb2RlbCA9IGRhdGVUaW1lTW9kZWw7XG4gICAgfVxuXG4gICAgZ2V0T3BlbkJ1dHRvbigpOiBCdXR0b25JbnRlcmZhY2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2xhc3M6ICdidG4gYnRuLXNtIGJ0bi1vdXRsaW5lLXNlY29uZGFyeSBtLTAgYm9yZGVyLTAnLFxuICAgICAgICAgICAgaWNvbjogJ2NhbGVuZGFyJ1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldFBsYWNlbWVudCgpOiBQbGFjZW1lbnRBcnJheSB7XG4gICAgICAgIHJldHVybiBbJ2JvdHRvbS1yaWdodCcsICd0b3AtcmlnaHQnLCAnYm90dG9tLWxlZnQnLCAndG9wLWxlZnQnXTtcbiAgICB9XG5cbn1cbiJdfQ==