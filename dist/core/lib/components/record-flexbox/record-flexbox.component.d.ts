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
import { ContentAlign, ContentJustify, Field, Record, ScreenSizeMap, StatisticWidgetLayoutRow, TextColor, TextSizes, ViewFieldDefinition, ViewMode } from 'common';
import { Observable } from 'rxjs';
import { FieldFlexboxCol, RecordFlexboxConfig, RecordFlexboxViewModel } from './record-flexbox.model';
import { LabelDisplay } from '../field-grid/field-grid.model';
import * as ɵngcc0 from '@angular/core';
export declare class RecordFlexboxComponent {
    config: RecordFlexboxConfig;
    mode: ViewMode;
    maxColumns: number;
    sizeMap: ScreenSizeMap;
    vm$: Observable<RecordFlexboxViewModel>;
    constructor();
    ngOnInit(): void;
    getRowClass(): {
        [klass: string]: any;
    };
    getColClass(): {
        [klass: string]: any;
    };
    getSizeClass(size: TextSizes): string;
    getFontWeight(bold: string | boolean): string;
    getColor(color: TextColor): string;
    getJustify(justify: ContentJustify): string;
    getAlign(align: ContentAlign): string;
    getLayoutRowClass(row: StatisticWidgetLayoutRow): string;
    getClass(layoutCol: FieldFlexboxCol): string;
    getLabelDisplay(col: FieldFlexboxCol): LabelDisplay;
    getField(record: Record, field: ViewFieldDefinition): Field;
    getFieldClass(col: FieldFlexboxCol): {
        [key: string]: any;
    };
    getLabelClass(col: FieldFlexboxCol): {
        [key: string]: any;
    };
    shouldDisplay(col: FieldFlexboxCol, field: Field): boolean;
    getDisplay(col: FieldFlexboxCol): string;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<RecordFlexboxComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<RecordFlexboxComponent, "scrm-record-flexbox", never, { "config": "config"; }, {}, never, never>;
}

//# sourceMappingURL=record-flexbox.component.d.ts.map