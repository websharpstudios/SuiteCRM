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
import { FieldMap, Panel, Record } from 'common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BaseFieldGridComponent } from '../field-grid/base-field-grid.component';
import { FieldLayoutConfig, FieldLayoutDataSource } from './field-layout.model';
import * as ɵngcc0 from '@angular/core';
export declare class FieldLayoutComponent extends BaseFieldGridComponent {
    protected breakpointObserver: BreakpointObserver;
    dataSource: FieldLayoutDataSource;
    config: FieldLayoutConfig;
    layout: Panel;
    fields: FieldMap;
    record: Record;
    baseColClass: {
        col: boolean;
        'form-group': boolean;
        'm-1': boolean;
        'm-0': boolean;
        'pl-3': boolean;
        'pb-2': boolean;
        'pr-3': boolean;
    };
    constructor(breakpointObserver: BreakpointObserver);
    ngOnInit(): void;
    buildGrid(): void;
    get colNumber(): number;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<FieldLayoutComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<FieldLayoutComponent, "scrm-field-layout", never, { "dataSource": "dataSource"; }, {}, never, ["[field-grid-actions]", "[field-grid-special]"]>;
}

//# sourceMappingURL=field-layout.component.d.ts.map