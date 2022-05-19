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
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ViewContext } from 'common';
import { MaxColumnsCalculator } from '../../../../services/ui/max-columns-calculator/max-columns-calculator.service';
import { LanguageStore } from '../../../../store/language/language.store';
import { ScreenSize } from '../../../../services/ui/screen-size-observer/screen-size-observer.service';
import { ListViewStore } from '../../store/list-view/list-view.store';
import { TableConfig } from '../../../../components/table/table.model';
import { TableAdapter } from '../../adapters/table.adapter';
import { ListViewSidebarWidgetAdapter } from '../../adapters/sidebar-widget.adapter';
import { WidgetMetadata } from 'common';
import * as ɵngcc0 from '@angular/core';
export interface ListContainerState {
    sidebarWidgetConfig: {
        widgets: WidgetMetadata[];
        show: boolean;
        widgetsEnabled: boolean;
    };
}
export declare class ListContainerComponent implements OnInit {
    store: ListViewStore;
    protected adapter: TableAdapter;
    protected maxColumnCalculator: MaxColumnsCalculator;
    languageStore: LanguageStore;
    protected sidebarWidgetAdapter: ListViewSidebarWidgetAdapter;
    module: any;
    screen: ScreenSize;
    maxColumns: number;
    tableConfig: TableConfig;
    vm$: Observable<ListContainerState>;
    constructor(store: ListViewStore, adapter: TableAdapter, maxColumnCalculator: MaxColumnsCalculator, languageStore: LanguageStore, sidebarWidgetAdapter: ListViewSidebarWidgetAdapter);
    ngOnInit(): void;
    getMaxColumns(): Observable<number>;
    getDisplayWidgets(): boolean;
    getDisplay(display: boolean): string;
    getViewContext(): ViewContext;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<ListContainerComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<ListContainerComponent, "scrm-list-container", never, { "module": "module"; }, {}, never, never>;
}

//# sourceMappingURL=list-container.component.d.ts.map