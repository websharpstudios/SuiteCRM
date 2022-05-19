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
import { ListViewStore } from '../../store/list-view/list-view.store';
import { FilterAdapter } from '../../adapters/filter.adapter';
import { ModuleNavigation } from '../../../../services/navigation/module-navigation/module-navigation.service';
import { RecordPanelConfig } from '../../../../containers/record-panel/components/record-panel/record-panel.model';
import { Subscription } from 'rxjs';
import { RecordPanelAdapter } from '../../adapters/record-panel.adapter';
import * as ɵngcc0 from '@angular/core';
export declare class ListHeaderComponent implements OnInit, OnDestroy {
    filterAdapter: FilterAdapter;
    protected listStore: ListViewStore;
    protected moduleNavigation: ModuleNavigation;
    protected recordPanelAdapter: RecordPanelAdapter;
    displayResponsiveTable: boolean;
    actionPanel: string;
    recordPanelConfig: RecordPanelConfig;
    protected subs: Subscription[];
    constructor(filterAdapter: FilterAdapter, listStore: ListViewStore, moduleNavigation: ModuleNavigation, recordPanelAdapter: RecordPanelAdapter);
    get moduleTitle(): string;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<ListHeaderComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<ListHeaderComponent, "scrm-list-header", never, {}, {}, never, never>;
}

//# sourceMappingURL=list-header.component.d.ts.map