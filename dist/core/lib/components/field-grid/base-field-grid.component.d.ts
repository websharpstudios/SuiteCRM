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
import { Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FieldGridRow, LabelDisplay } from './field-grid.model';
import { ScreenSizeMap } from 'common';
import * as ɵngcc0 from '@angular/core';
export declare abstract class BaseFieldGridComponent implements OnInit, OnDestroy {
    protected breakpointObserver: BreakpointObserver;
    special: boolean;
    actions: boolean;
    appendActions: boolean;
    labelDisplay: LabelDisplay;
    labelClass: {
        [klass: string]: any;
    };
    inputClass: {
        [klass: string]: any;
    };
    rowClass: {
        [klass: string]: any;
    };
    colClass: {
        [klass: string]: any;
    };
    maxColumns: number;
    sizeMap: ScreenSizeMap;
    fieldGrid: FieldGridRow[];
    baseColClass: {
        col: boolean;
        'form-group': boolean;
        'm-1': boolean;
    };
    baseRowClass: {
        'form-row': boolean;
        'align-items-center': boolean;
    };
    baseLabelClass: {
        'col-form-label-sm': boolean;
        'mb-0': boolean;
    };
    baseInputClass: {
        'form-control': boolean;
        'form-control-sm': boolean;
    };
    protected currentSize: string;
    protected subscriptions: Subscription[];
    protected constructor(breakpointObserver: BreakpointObserver);
    ngOnInit(): void;
    ngOnDestroy(): void;
    get colNumber(): number;
    protected addSpecialSlots(grid: FieldGridRow[]): void;
    protected getNeededExtraSlots(): string[];
    protected fillRow(row: FieldGridRow): void;
    protected initScreenSizeObserver(breakpointObserver: BreakpointObserver): void;
    abstract buildGrid(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<BaseFieldGridComponent, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDeclaration<BaseFieldGridComponent, never, never, { "special": "special"; "actions": "actions"; "appendActions": "appendActions"; "labelDisplay": "labelDisplay"; "labelClass": "labelClass"; "inputClass": "inputClass"; "rowClass": "rowClass"; "colClass": "colClass"; "sizeMap": "sizeMap"; "maxColumns": "maxColumns"; }, {}, never>;
}

//# sourceMappingURL=base-field-grid.component.d.ts.map