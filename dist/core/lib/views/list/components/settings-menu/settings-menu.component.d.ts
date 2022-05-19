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
import { ButtonGroupInterface, ButtonInterface, DropdownButtonInterface, SearchCriteriaFilter } from 'common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { ListViewStore } from '../../store/list-view/list-view.store';
import { SystemConfigStore } from '../../../../store/system-config/system-config.store';
import { ScreenSize, ScreenSizeObserverService } from '../../../../services/ui/screen-size-observer/screen-size-observer.service';
import { SavedFilter } from '../../../../store/saved-filters/saved-filter.model';
import * as ɵngcc0 from '@angular/core';
export declare class SettingsMenuComponent implements OnInit {
    protected listStore: ListViewStore;
    protected modalService: NgbModal;
    protected screenSize: ScreenSizeObserverService;
    protected systemConfigStore: SystemConfigStore;
    configState: BehaviorSubject<ButtonGroupInterface>;
    config$: import("rxjs").Observable<ButtonGroupInterface>;
    vm$: import("rxjs").Observable<{
        widgets: boolean;
        displayFilters: boolean;
        criteria: import("common").SearchCriteria;
        screenSize: ScreenSize;
        showSidebarWidgets: boolean;
        savedFilters: SavedFilter[];
    }>;
    protected screen: ScreenSize;
    protected defaultBreakpoint: number;
    protected breakpoint: number;
    constructor(listStore: ListViewStore, modalService: NgbModal, screenSize: ScreenSizeObserverService, systemConfigStore: SystemConfigStore);
    ngOnInit(): void;
    getButtonGroupConfig(): ButtonGroupInterface;
    getFilters(): SearchCriteriaFilter;
    getBreakpoint(): number;
    getFilterButton(): DropdownButtonInterface;
    getMyFiltersButton(): DropdownButtonInterface;
    getClearButton(): ButtonInterface;
    getChartsButton(): ButtonInterface;
    getDisplayAsButton(): DropdownButtonInterface;
    getColumnChooserButton(): ButtonInterface;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<SettingsMenuComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<SettingsMenuComponent, "scrm-settings-menu", never, {}, {}, never, never>;
}

//# sourceMappingURL=settings-menu.component.d.ts.map