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
import { OnDestroy, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ButtonInterface } from 'common';
import { BaseDateTimeComponent } from '../../../base/datetime/base-datetime.component';
import { DataTypeFormatter } from '../../../../services/formatters/data-type.formatter.service';
import { DateFormatter } from '../../../../services/formatters/datetime/date-formatter.service';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';
import { FieldLogicManager } from '../../../field-logic/field-logic.manager';
import * as ɵngcc0 from '@angular/core';
export declare class DateEditFieldComponent extends BaseDateTimeComponent implements OnInit, OnDestroy {
    protected formatter: DateFormatter;
    protected dateAdapter: NgbDateAdapter<string>;
    protected typeFormatter: DataTypeFormatter;
    protected logic: FieldLogicManager;
    dateModel: NgbDateStruct;
    constructor(formatter: DateFormatter, dateAdapter: NgbDateAdapter<string>, typeFormatter: DataTypeFormatter, logic: FieldLogicManager);
    ngOnInit(): void;
    ngOnDestroy(): void;
    setModel($event: any): void;
    getOpenButton(datepicker: NgbInputDatepicker): ButtonInterface;
    getPlacement(): PlacementArray;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<DateEditFieldComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<DateEditFieldComponent, "scrm-date-edit", never, {}, {}, never, never>;
}

//# sourceMappingURL=date.component.d.ts.map