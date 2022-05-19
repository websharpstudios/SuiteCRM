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
import { Action, ColumnDefinition, Pagination, Record, RecordSelection, SearchCriteria, SelectionStatus, SortingSelection, ViewContext } from 'common';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NavigationStore } from '../../../../store/navigation/navigation.store';
import { RecordList, RecordListStore } from '../../../../store/record-list/record-list.store';
import { Metadata, MetadataStore } from '../../../../store/metadata/metadata.store.service';
import { StateStore } from '../../../../store/state';
import { LanguageStore } from '../../../../store/language/language.store';
import { ModuleNavigation } from '../../../../services/navigation/module-navigation/module-navigation.service';
import { MessageService } from '../../../../services/message/message.service';
import { RecordListStoreFactory } from '../../../../store/record-list/record-list.store.factory';
import { AppStateStore } from '../../../../store/app-state/app-state.store';
import { AppData, ViewStore } from '../../../../store/view/view.store';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SavedFilter, SavedFilterMap } from '../../../../store/saved-filters/saved-filter.model';
import { FilterListStore } from '../../../../store/saved-filters/filter-list.store';
import { FilterListStoreFactory } from '../../../../store/saved-filters/filter-list.store.factory';
import { ConfirmationModalService } from '../../../../services/modals/confirmation-modal.service';
import { RecordPanelMetadata } from '../../../../containers/record-panel/store/record-panel/record-panel.store.model';
import * as ɵngcc0 from '@angular/core';
export interface ListViewData {
    records: Record[];
    pagination?: Pagination;
    criteria?: SearchCriteria;
    sort?: SortingSelection;
    selection?: RecordSelection;
    loading: boolean;
}
export interface ListViewModel {
    data: ListViewData;
    appData: AppData;
    metadata: Metadata;
}
export interface ListViewState {
    module: string;
    widgets: boolean;
    actionPanel: string;
    showSidebarWidgets: boolean;
    recordPanelConfig: RecordPanelMetadata;
    activeFilters: SavedFilterMap;
    openFilter: SavedFilter;
}
export declare class ListViewStore extends ViewStore implements StateStore {
    protected appStateStore: AppStateStore;
    protected languageStore: LanguageStore;
    protected navigationStore: NavigationStore;
    protected moduleNavigation: ModuleNavigation;
    protected metadataStore: MetadataStore;
    protected localStorage: LocalStorageService;
    protected message: MessageService;
    protected listStoreFactory: RecordListStoreFactory;
    protected modalService: NgbModal;
    protected filterListStoreFactory: FilterListStoreFactory;
    protected confirmation: ConfirmationModalService;
    /**
     * Public long-lived observable streams
     */
    moduleName$: Observable<string>;
    columns: BehaviorSubject<ColumnDefinition[]>;
    columns$: Observable<ColumnDefinition[]>;
    lineActions$: Observable<Action[]>;
    records$: Observable<Record[]>;
    criteria$: Observable<SearchCriteria>;
    context$: Observable<ViewContext>;
    sort$: Observable<SortingSelection>;
    pagination$: Observable<Pagination>;
    selection$: Observable<RecordSelection>;
    selectedCount$: Observable<number>;
    selectedStatus$: Observable<SelectionStatus>;
    loading$: Observable<boolean>;
    widgets$: Observable<boolean>;
    showSidebarWidgets$: Observable<boolean>;
    displayFilters$: Observable<boolean>;
    actionPanel$: Observable<string>;
    recordList: RecordListStore;
    dataUpdate$: Observable<boolean>;
    dataSetUpdate$: Observable<boolean>;
    activeFilters$: Observable<SavedFilterMap>;
    openFilter$: Observable<SavedFilter>;
    filterList: FilterListStore;
    /**
     * View-model that resolves once all the data is ready (or updated).
     */
    vm$: Observable<ListViewModel>;
    vm: ListViewModel;
    data: ListViewData;
    /** Internal Properties */
    protected cache$: Observable<any>;
    protected internalState: ListViewState;
    protected store: BehaviorSubject<ListViewState>;
    protected state$: Observable<ListViewState>;
    protected dataUpdateState: BehaviorSubject<boolean>;
    protected subs: Subscription[];
    constructor(appStateStore: AppStateStore, languageStore: LanguageStore, navigationStore: NavigationStore, moduleNavigation: ModuleNavigation, metadataStore: MetadataStore, localStorage: LocalStorageService, message: MessageService, listStoreFactory: RecordListStoreFactory, modalService: NgbModal, filterListStoreFactory: FilterListStoreFactory, confirmation: ConfirmationModalService);
    get actionPanel(): string;
    get showFilters(): boolean;
    set showFilters(show: boolean);
    get widgets(): boolean;
    set widgets(show: boolean);
    get showSidebarWidgets(): boolean;
    set showSidebarWidgets(show: boolean);
    get recordPanelConfig(): RecordPanelMetadata;
    isRecordPanelOpen(): boolean;
    openRecordPanel(config: RecordPanelMetadata): void;
    closeRecordPanel(): void;
    getModuleName(): string;
    getViewContext(): ViewContext;
    /**
     * Clean destroy
     */
    destroy(): void;
    /**
     * get active filters
     *
     * @returns {object} active filters
     */
    get activeFilters(): SavedFilterMap;
    /**
     * Clear observable cache
     */
    clear(): void;
    clearAuthBased(): void;
    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @returns {object} Observable<any>
     */
    init(module: string): Observable<RecordList>;
    /**
     * Set open filters
     *
     * @param {object} filter to set
     */
    setOpenFilter(filter: SavedFilter): void;
    /**
     * Set active filters
     *
     * @param {object} filters to set
     * @param {boolean} reload flag
     */
    setFilters(filters: SavedFilterMap, reload?: boolean): void;
    /**
     * Update filters
     *
     * @param {object} filter to set
     */
    addSavedFilter(filter: SavedFilter): void;
    /**
     * Update filters
     *
     * @param {object} filter to set
     */
    removeSavedFilter(filter: SavedFilter): void;
    /**
     * Reset active filters
     *
     * @param {boolean} reload flag
     */
    resetFilters(reload?: boolean): void;
    /**
     * Update the search criteria
     *
     * @param {boolean} reload flag
     */
    updateSearchCriteria(reload?: boolean): void;
    updateLocalStorage(): void;
    triggerDataUpdate(): void;
    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<ListViewState>
     */
    load(useCache?: boolean): Observable<RecordList>;
    /**
     * Internal API
     */
    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: ListViewState): void;
    /**
     * Calculate if widgets are to display
     */
    protected calculateShowWidgets(): void;
    /**
     * Store the data in local storage
     *
     * @param {string} module to store in
     * @param {string} storageKey to store in
     * @param {} data to store
     */
    protected storageSave(module: string, storageKey: string, data: any): void;
    /**
     * Store the key in local storage
     *
     * @param {string} module to load from
     * @param {string} storageKey from load from
     * @param {Function} loader to store in
     */
    protected storageLoad(module: string, storageKey: string, loader: Function): void;
    openColumnChooserDialog(): void;
    /**
     * Initialize data update state.
     * It should be emitted on any change in values on the record list.
     * Reload/Pagination is not considered as a data update
     */
    protected initDataUpdateState(): void;
    /**
     *  Initialize the dataSet update state.
     *  It should be emitted on any change in dataSet e.g. due to data filter, due to data delete,
     *  due to data edit or any event which causes change in the resulting dataSet.
     */
    protected initDataSetUpdatedState(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<ListViewStore, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<ListViewStore>;
}

//# sourceMappingURL=list-view.store.d.ts.map