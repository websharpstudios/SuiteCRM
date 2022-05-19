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
import { deepClone } from 'common';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NavigationStore } from '../../../../store/navigation/navigation.store';
import { MetadataStore } from '../../../../store/metadata/metadata.store.service';
import { LanguageStore } from '../../../../store/language/language.store';
import { ModuleNavigation } from '../../../../services/navigation/module-navigation/module-navigation.service';
import { MessageService } from '../../../../services/message/message.service';
import { RecordListStoreFactory } from '../../../../store/record-list/record-list.store.factory';
import { AppStateStore } from '../../../../store/app-state/app-state.store';
import { ViewStore } from '../../../../store/view/view.store';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ColumnChooserComponent } from "../../../../components/columnchooser/columnchooser.component";
import { FilterListStoreFactory } from '../../../../store/saved-filters/filter-list.store.factory';
import { ConfirmationModalService } from '../../../../services/modals/confirmation-modal.service';
const initialFilter = {
    key: 'default',
    module: 'saved-search',
    attributes: {
        contents: ''
    },
    criteria: {
        name: 'default',
        filters: {}
    }
};
const initialFilters = {
    'default': deepClone(initialFilter)
};
const initialState = {
    module: '',
    widgets: true,
    actionPanel: '',
    showSidebarWidgets: false,
    recordPanelConfig: {},
    activeFilters: deepClone(initialFilters),
    openFilter: deepClone(initialFilter)
};
export class ListViewStore extends ViewStore {
    constructor(appStateStore, languageStore, navigationStore, moduleNavigation, metadataStore, localStorage, message, listStoreFactory, modalService, filterListStoreFactory, confirmation) {
        super(appStateStore, languageStore, navigationStore, moduleNavigation, metadataStore);
        this.appStateStore = appStateStore;
        this.languageStore = languageStore;
        this.navigationStore = navigationStore;
        this.moduleNavigation = moduleNavigation;
        this.metadataStore = metadataStore;
        this.localStorage = localStorage;
        this.message = message;
        this.listStoreFactory = listStoreFactory;
        this.modalService = modalService;
        this.filterListStoreFactory = filterListStoreFactory;
        this.confirmation = confirmation;
        /** Internal Properties */
        this.cache$ = null;
        this.internalState = deepClone(initialState);
        this.store = new BehaviorSubject(this.internalState);
        this.state$ = this.store.asObservable();
        this.subs = [];
        this.recordList = this.listStoreFactory.create();
        this.columns$ = metadataStore.listViewColumns$;
        this.lineActions$ = metadataStore.listViewLineActions$;
        this.records$ = this.recordList.records$;
        this.criteria$ = this.recordList.criteria$;
        this.context$ = this.recordList.criteria$.pipe(map(() => this.getViewContext()));
        this.sort$ = this.recordList.sort$;
        this.pagination$ = this.recordList.pagination$;
        this.selection$ = this.recordList.selection$;
        this.selectedCount$ = this.recordList.selectedCount$;
        this.selectedStatus$ = this.recordList.selectedStatus$;
        this.loading$ = this.recordList.loading$;
        this.moduleName$ = this.state$.pipe(map(state => state.module), distinctUntilChanged());
        this.widgets$ = this.state$.pipe(map(state => state.widgets), distinctUntilChanged());
        this.showSidebarWidgets$ = this.state$.pipe(map(state => state.showSidebarWidgets));
        this.displayFilters$ = this.state$.pipe(map(state => state.actionPanel === 'filters'), distinctUntilChanged());
        this.actionPanel$ = this.state$.pipe(map(state => state.actionPanel), distinctUntilChanged());
        this.activeFilters$ = this.state$.pipe(map(state => state.activeFilters), distinctUntilChanged());
        this.openFilter$ = this.state$.pipe(map(state => state.openFilter), distinctUntilChanged());
        const data$ = combineLatest([this.records$, this.criteria$, this.pagination$, this.selection$, this.loading$]).pipe(map(([records, criteria, pagination, selection, loading]) => {
            this.data = { records, criteria, pagination, selection, loading };
            return this.data;
        }));
        this.vm$ = combineLatest([data$, this.appData$, this.metadata$]).pipe(map(([data, appData, metadata]) => {
            this.vm = { data, appData, metadata };
            return this.vm;
        }));
        this.subs.push(this.recordList.loading$.subscribe((loading) => {
            this.appStateStore.updateLoading(`${this.internalState.module}-list-fetch`, loading);
        }, () => {
            this.appStateStore.updateLoading(`${this.internalState.module}-list-fetch`, false);
        }));
        let listViewColumns = [];
        this.subs.push(metadataStore.listViewColumns$.subscribe(cols => {
            listViewColumns = cols;
        }));
        this.columns = new BehaviorSubject(listViewColumns);
        this.columns$ = this.columns.asObservable();
        this.initDataUpdateState();
        this.initDataSetUpdatedState();
        this.filterList = this.filterListStoreFactory.create();
    }
    get actionPanel() {
        return this.internalState.actionPanel;
    }
    get showFilters() {
        return this.internalState.actionPanel === 'filters';
    }
    set showFilters(show) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { actionPanel: show ? 'filters' : '' }));
    }
    get widgets() {
        return this.internalState.widgets;
    }
    set widgets(show) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { widgets: show }));
    }
    get showSidebarWidgets() {
        return this.internalState.showSidebarWidgets;
    }
    set showSidebarWidgets(show) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { showSidebarWidgets: show }));
    }
    get recordPanelConfig() {
        return this.internalState.recordPanelConfig;
    }
    isRecordPanelOpen() {
        return this.internalState.actionPanel === 'recordPanel';
    }
    openRecordPanel(config) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { actionPanel: 'recordPanel', recordPanelConfig: config }));
    }
    closeRecordPanel() {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { actionPanel: '', recordPanelConfig: {} }));
    }
    getModuleName() {
        return this.internalState.module;
    }
    getViewContext() {
        const context = {
            module: this.getModuleName(),
        };
        context.criteria = this.recordList.criteria;
        context.sort = this.recordList.sort;
        return context;
    }
    /**
     * Clean destroy
     */
    destroy() {
        this.clear();
        this.subs.forEach(sub => sub.unsubscribe());
    }
    /**
     * get active filters
     *
     * @returns {object} active filters
     */
    get activeFilters() {
        return deepClone(this.internalState.activeFilters);
    }
    /**
     * Clear observable cache
     */
    clear() {
        this.cache$ = null;
        this.updateState(deepClone(initialState));
        this.recordList.clear();
    }
    clearAuthBased() {
        this.clear();
        this.recordList.clearAuthBased();
    }
    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @returns {object} Observable<any>
     */
    init(module) {
        this.internalState.module = module;
        this.recordList.init(module, false);
        this.filterList.init(module);
        this.filterList.load(false).pipe(take(1)).subscribe();
        this.calculateShowWidgets();
        this.storageLoad(module, 'active-filters', (storage) => this.setFilters(storage, false));
        this.storageLoad(module, 'sort-selection', (storage) => this.recordList.sort = storage);
        return this.load();
    }
    /**
     * Set open filters
     *
     * @param {object} filter to set
     */
    setOpenFilter(filter) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { openFilter: deepClone(filter) }));
    }
    /**
     * Set active filters
     *
     * @param {object} filters to set
     * @param {boolean} reload flag
     */
    setFilters(filters, reload = true) {
        var _a, _b;
        const filterKey = Object.keys(filters).shift();
        const filter = filters[filterKey];
        this.updateState(Object.assign(Object.assign({}, this.internalState), { activeFilters: deepClone(filters), openFilter: deepClone(filter) }));
        if (filter.criteria) {
            const orderBy = (_a = filter.criteria.orderBy) !== null && _a !== void 0 ? _a : '';
            const sortOrder = (_b = filter.criteria.sortOrder) !== null && _b !== void 0 ? _b : '';
            let direction = this.recordList.mapSortOrder(sortOrder);
            this.recordList.updateSorting(orderBy, direction, false);
            this.updateLocalStorage();
        }
        this.updateSearchCriteria(reload);
    }
    /**
     * Update filters
     *
     * @param {object} filter to set
     */
    addSavedFilter(filter) {
        const newState = Object.assign({}, this.internalState);
        const activeFilters = this.activeFilters;
        if (filter.key && activeFilters[filter.key]) {
            activeFilters[filter.key] = filter;
            newState.activeFilters = activeFilters;
        }
        newState.openFilter = filter;
        this.filterList.addFilter(filter);
        this.updateState(newState);
    }
    /**
     * Update filters
     *
     * @param {object} filter to set
     */
    removeSavedFilter(filter) {
        if (!filter || !filter.key) {
            return;
        }
        this.filterList.removeFilter(filter);
        const newState = Object.assign({}, this.internalState);
        if (newState.openFilter && newState.openFilter.key === filter.key) {
            this.resetFilters(true);
        }
    }
    /**
     * Reset active filters
     *
     * @param {boolean} reload flag
     */
    resetFilters(reload = true) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { activeFilters: deepClone(initialFilters), openFilter: deepClone(initialFilter) }));
        this.updateSearchCriteria(reload);
    }
    /**
     * Update the search criteria
     *
     * @param {boolean} reload flag
     */
    updateSearchCriteria(reload = true) {
        const filters = Object.assign({}, this.internalState.activeFilters);
        const filterKey = Object.keys(filters).shift();
        const filter = filters[filterKey];
        this.recordList.updateSearchCriteria(filter.criteria, reload);
        if (reload) {
            this.updateLocalStorage();
        }
    }
    updateLocalStorage() {
        this.storageSave(this.internalState.module, 'active-filters', this.internalState.activeFilters);
        this.storageSave(this.internalState.module, 'sort-selection', this.recordList.sort);
    }
    triggerDataUpdate() {
        this.dataUpdateState.next(true);
    }
    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<ListViewState>
     */
    load(useCache = true) {
        this.storageSave(this.internalState.module, 'active-filters', this.internalState.activeFilters);
        this.storageSave(this.internalState.module, 'sort-selection', this.recordList.sort);
        return this.recordList.load(useCache);
    }
    /**
     * Internal API
     */
    /**
     * Update the state
     *
     * @param {object} state to set
     */
    updateState(state) {
        this.store.next(this.internalState = state);
    }
    /**
     * Calculate if widgets are to display
     */
    calculateShowWidgets() {
        let show = false;
        const meta = this.metadataStore.get() || {};
        const listViewMeta = meta.listView || {};
        const sidebarWidgetsConfig = listViewMeta.sidebarWidgets || [];
        if (sidebarWidgetsConfig && sidebarWidgetsConfig.length > 0) {
            show = true;
        }
        this.showSidebarWidgets = show;
        this.widgets = show;
    }
    /**
     * Store the data in local storage
     *
     * @param {string} module to store in
     * @param {string} storageKey to store in
     * @param {} data to store
     */
    storageSave(module, storageKey, data) {
        let storage = this.localStorage.get(storageKey);
        if (!storage) {
            storage = {};
        }
        storage[module] = data;
        this.localStorage.set(storageKey, storage);
    }
    /**
     * Store the key in local storage
     *
     * @param {string} module to load from
     * @param {string} storageKey from load from
     * @param {Function} loader to store in
     */
    storageLoad(module, storageKey, loader) {
        const storage = this.localStorage.get(storageKey);
        if (!storage || !storage[module]) {
            return;
        }
        loader(storage[module]);
    }
    openColumnChooserDialog() {
        const modalRef = this.modalService.open(ColumnChooserComponent, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            size: 'lg',
            windowClass: 'column-chooser-modal'
        });
        const displayedColumns = this.columns.getValue().filter(function (col) {
            return !col.hasOwnProperty('default')
                || (col.hasOwnProperty('default') && col.default === true);
        });
        const hiddenColumns = this.columns.getValue().filter(function (col) {
            return col.hasOwnProperty('default') && col.default === false;
        });
        modalRef.componentInstance.displayed = displayedColumns;
        modalRef.componentInstance.hidden = hiddenColumns;
        modalRef.result.then((result) => {
            let allColumns = [];
            const selectedDisplayColumns = result.displayed;
            const selectedHideColumns = result.hidden;
            selectedDisplayColumns.forEach(function (column) {
                column.default = true;
            });
            selectedHideColumns.forEach(function (column) {
                column.default = false;
            });
            allColumns.push(...selectedDisplayColumns, ...selectedHideColumns);
            this.columns.next(allColumns);
        });
    }
    /**
     * Initialize data update state.
     * It should be emitted on any change in values on the record list.
     * Reload/Pagination is not considered as a data update
     */
    initDataUpdateState() {
        this.dataUpdateState = new BehaviorSubject(true);
        this.dataUpdate$ = this.dataUpdateState.asObservable();
    }
    /**
     *  Initialize the dataSet update state.
     *  It should be emitted on any change in dataSet e.g. due to data filter, due to data delete,
     *  due to data edit or any event which causes change in the resulting dataSet.
     */
    initDataSetUpdatedState() {
        this.dataSetUpdate$ = combineLatest([this.criteria$, this.dataUpdate$]).pipe(map(() => true));
    }
}
ListViewStore.decorators = [
    { type: Injectable }
];
ListViewStore.ctorParameters = () => [
    { type: AppStateStore },
    { type: LanguageStore },
    { type: NavigationStore },
    { type: ModuleNavigation },
    { type: MetadataStore },
    { type: LocalStorageService },
    { type: MessageService },
    { type: RecordListStoreFactory },
    { type: NgbModal },
    { type: FilterListStoreFactory },
    { type: ConfirmationModalService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC12aWV3LnN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3ZpZXdzL2xpc3Qvc3RvcmUvbGlzdC12aWV3L2xpc3Qtdmlldy5zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUdILFNBQVMsRUFTWixNQUFNLFFBQVEsQ0FBQztBQUNoQixPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBMkIsTUFBTSxNQUFNLENBQUM7QUFDOUUsT0FBTyxFQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSwrQ0FBK0MsQ0FBQztBQUU5RSxPQUFPLEVBQVcsYUFBYSxFQUFDLE1BQU0sbURBQW1ELENBQUM7QUFFMUYsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBQ3hFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDZFQUE2RSxDQUFDO0FBQzdHLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUM1RSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx5REFBeUQsQ0FBQztBQUMvRixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sNkNBQTZDLENBQUM7QUFDMUUsT0FBTyxFQUFVLFNBQVMsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDBEQUEwRCxDQUFDO0FBQzdGLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSw4REFBOEQsQ0FBQztB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RyxLQUFLLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7WUFDSCxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsc0JBQXNCLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdEOzs7O09BSUc7SUFDTyxtQkFBbUI7UUFDekIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGVBQWUsQ0FBVSxJQUFJLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0QsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyx1QkFBdUI7UUFDN0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQy9CLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQ3JDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7OztZQTdmSixVQUFVOzs7WUE5REgsYUFBYTtZQUpiLGFBQWE7WUFKYixlQUFlO1lBS2YsZ0JBQWdCO1lBSE4sYUFBYTtZQVF2QixtQkFBbUI7WUFKbkIsY0FBYztZQUNkLHNCQUFzQjtZQUl0QixRQUFRO1lBSVIsc0JBQXNCO1lBQ3RCLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtcbiAgICBBY3Rpb24sXG4gICAgQ29sdW1uRGVmaW5pdGlvbixcbiAgICBkZWVwQ2xvbmUsXG4gICAgTGlzdFZpZXdNZXRhLFxuICAgIFBhZ2luYXRpb24sXG4gICAgUmVjb3JkLFxuICAgIFJlY29yZFNlbGVjdGlvbixcbiAgICBTZWFyY2hDcml0ZXJpYSxcbiAgICBTZWxlY3Rpb25TdGF0dXMsXG4gICAgU29ydGluZ1NlbGVjdGlvbixcbiAgICBWaWV3Q29udGV4dFxufSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2Rpc3RpbmN0VW50aWxDaGFuZ2VkLCBtYXAsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05hdmlnYXRpb25TdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLnN0b3JlJztcbmltcG9ydCB7UmVjb3JkTGlzdCwgUmVjb3JkTGlzdFN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9yZWNvcmQtbGlzdC9yZWNvcmQtbGlzdC5zdG9yZSc7XG5pbXBvcnQge01ldGFkYXRhLCBNZXRhZGF0YVN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9tZXRhZGF0YS9tZXRhZGF0YS5zdG9yZS5zZXJ2aWNlJztcbmltcG9ydCB7U3RhdGVTdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvc3RhdGUnO1xuaW1wb3J0IHtMYW5ndWFnZVN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5pbXBvcnQge01vZHVsZU5hdmlnYXRpb259IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24vbW9kdWxlLW5hdmlnYXRpb24vbW9kdWxlLW5hdmlnYXRpb24uc2VydmljZSc7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9tZXNzYWdlL21lc3NhZ2Uuc2VydmljZSc7XG5pbXBvcnQge1JlY29yZExpc3RTdG9yZUZhY3Rvcnl9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3JlY29yZC1saXN0L3JlY29yZC1saXN0LnN0b3JlLmZhY3RvcnknO1xuaW1wb3J0IHtBcHBTdGF0ZVN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9hcHAtc3RhdGUvYXBwLXN0YXRlLnN0b3JlJztcbmltcG9ydCB7QXBwRGF0YSwgVmlld1N0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS92aWV3L3ZpZXcuc3RvcmUnO1xuaW1wb3J0IHtMb2NhbFN0b3JhZ2VTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9sb2NhbC1zdG9yYWdlL2xvY2FsLXN0b3JhZ2Uuc2VydmljZSc7XG5pbXBvcnQge05nYk1vZGFsfSBmcm9tIFwiQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXBcIjtcbmltcG9ydCB7Q29sdW1uQ2hvb3NlckNvbXBvbmVudH0gZnJvbSBcIi4uLy4uLy4uLy4uL2NvbXBvbmVudHMvY29sdW1uY2hvb3Nlci9jb2x1bW5jaG9vc2VyLmNvbXBvbmVudFwiO1xuaW1wb3J0IHtTYXZlZEZpbHRlciwgU2F2ZWRGaWx0ZXJNYXB9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3NhdmVkLWZpbHRlcnMvc2F2ZWQtZmlsdGVyLm1vZGVsJztcbmltcG9ydCB7RmlsdGVyTGlzdFN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9zYXZlZC1maWx0ZXJzL2ZpbHRlci1saXN0LnN0b3JlJztcbmltcG9ydCB7RmlsdGVyTGlzdFN0b3JlRmFjdG9yeX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvc2F2ZWQtZmlsdGVycy9maWx0ZXItbGlzdC5zdG9yZS5mYWN0b3J5JztcbmltcG9ydCB7Q29uZmlybWF0aW9uTW9kYWxTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9tb2RhbHMvY29uZmlybWF0aW9uLW1vZGFsLnNlcnZpY2UnO1xuaW1wb3J0IHtSZWNvcmRQYW5lbE1ldGFkYXRhfSBmcm9tICcuLi8uLi8uLi8uLi9jb250YWluZXJzL3JlY29yZC1wYW5lbC9zdG9yZS9yZWNvcmQtcGFuZWwvcmVjb3JkLXBhbmVsLnN0b3JlLm1vZGVsJztcblxuZXhwb3J0IGludGVyZmFjZSBMaXN0Vmlld0RhdGEge1xuICAgIHJlY29yZHM6IFJlY29yZFtdO1xuICAgIHBhZ2luYXRpb24/OiBQYWdpbmF0aW9uO1xuICAgIGNyaXRlcmlhPzogU2VhcmNoQ3JpdGVyaWE7XG4gICAgc29ydD86IFNvcnRpbmdTZWxlY3Rpb247XG4gICAgc2VsZWN0aW9uPzogUmVjb3JkU2VsZWN0aW9uO1xuICAgIGxvYWRpbmc6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlzdFZpZXdNb2RlbCB7XG4gICAgZGF0YTogTGlzdFZpZXdEYXRhO1xuICAgIGFwcERhdGE6IEFwcERhdGE7XG4gICAgbWV0YWRhdGE6IE1ldGFkYXRhO1xufVxuXG5jb25zdCBpbml0aWFsRmlsdGVyOiBTYXZlZEZpbHRlciA9IHtcbiAgICBrZXk6ICdkZWZhdWx0JyxcbiAgICBtb2R1bGU6ICdzYXZlZC1zZWFyY2gnLFxuICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgY29udGVudHM6ICcnXG4gICAgfSxcbiAgICBjcml0ZXJpYToge1xuICAgICAgICBuYW1lOiAnZGVmYXVsdCcsXG4gICAgICAgIGZpbHRlcnM6IHt9XG4gICAgfVxufTtcblxuY29uc3QgaW5pdGlhbEZpbHRlcnM6IFNhdmVkRmlsdGVyTWFwID0ge1xuICAgICdkZWZhdWx0JzogZGVlcENsb25lKGluaXRpYWxGaWx0ZXIpXG59O1xuXG5jb25zdCBpbml0aWFsU3RhdGU6IExpc3RWaWV3U3RhdGUgPSB7XG4gICAgbW9kdWxlOiAnJyxcbiAgICB3aWRnZXRzOiB0cnVlLFxuICAgIGFjdGlvblBhbmVsOiAnJyxcbiAgICBzaG93U2lkZWJhcldpZGdldHM6IGZhbHNlLFxuICAgIHJlY29yZFBhbmVsQ29uZmlnOiB7fSBhcyBSZWNvcmRQYW5lbE1ldGFkYXRhLFxuICAgIGFjdGl2ZUZpbHRlcnM6IGRlZXBDbG9uZShpbml0aWFsRmlsdGVycyksXG4gICAgb3BlbkZpbHRlcjogZGVlcENsb25lKGluaXRpYWxGaWx0ZXIpXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIExpc3RWaWV3U3RhdGUge1xuICAgIG1vZHVsZTogc3RyaW5nO1xuICAgIHdpZGdldHM6IGJvb2xlYW47XG4gICAgYWN0aW9uUGFuZWw6IHN0cmluZztcbiAgICBzaG93U2lkZWJhcldpZGdldHM6IGJvb2xlYW47XG4gICAgcmVjb3JkUGFuZWxDb25maWc6IFJlY29yZFBhbmVsTWV0YWRhdGE7XG4gICAgYWN0aXZlRmlsdGVyczogU2F2ZWRGaWx0ZXJNYXA7XG4gICAgb3BlbkZpbHRlcjogU2F2ZWRGaWx0ZXI7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMaXN0Vmlld1N0b3JlIGV4dGVuZHMgVmlld1N0b3JlIGltcGxlbWVudHMgU3RhdGVTdG9yZSB7XG5cbiAgICAvKipcbiAgICAgKiBQdWJsaWMgbG9uZy1saXZlZCBvYnNlcnZhYmxlIHN0cmVhbXNcbiAgICAgKi9cbiAgICBtb2R1bGVOYW1lJDogT2JzZXJ2YWJsZTxzdHJpbmc+O1xuICAgIGNvbHVtbnM6IEJlaGF2aW9yU3ViamVjdDxDb2x1bW5EZWZpbml0aW9uW10+O1xuICAgIGNvbHVtbnMkOiBPYnNlcnZhYmxlPENvbHVtbkRlZmluaXRpb25bXT47XG4gICAgbGluZUFjdGlvbnMkOiBPYnNlcnZhYmxlPEFjdGlvbltdPjtcbiAgICByZWNvcmRzJDogT2JzZXJ2YWJsZTxSZWNvcmRbXT47XG4gICAgY3JpdGVyaWEkOiBPYnNlcnZhYmxlPFNlYXJjaENyaXRlcmlhPjtcbiAgICBjb250ZXh0JDogT2JzZXJ2YWJsZTxWaWV3Q29udGV4dD47XG4gICAgc29ydCQ6IE9ic2VydmFibGU8U29ydGluZ1NlbGVjdGlvbj47XG4gICAgcGFnaW5hdGlvbiQ6IE9ic2VydmFibGU8UGFnaW5hdGlvbj47XG4gICAgc2VsZWN0aW9uJDogT2JzZXJ2YWJsZTxSZWNvcmRTZWxlY3Rpb24+O1xuICAgIHNlbGVjdGVkQ291bnQkOiBPYnNlcnZhYmxlPG51bWJlcj47XG4gICAgc2VsZWN0ZWRTdGF0dXMkOiBPYnNlcnZhYmxlPFNlbGVjdGlvblN0YXR1cz47XG4gICAgbG9hZGluZyQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgd2lkZ2V0cyQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgc2hvd1NpZGViYXJXaWRnZXRzJDogT2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICBkaXNwbGF5RmlsdGVycyQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgYWN0aW9uUGFuZWwkOiBPYnNlcnZhYmxlPHN0cmluZz47XG4gICAgcmVjb3JkTGlzdDogUmVjb3JkTGlzdFN0b3JlO1xuICAgIGRhdGFVcGRhdGUkOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIGRhdGFTZXRVcGRhdGUkOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIGFjdGl2ZUZpbHRlcnMkOiBPYnNlcnZhYmxlPFNhdmVkRmlsdGVyTWFwPjtcbiAgICBvcGVuRmlsdGVyJDogT2JzZXJ2YWJsZTxTYXZlZEZpbHRlcj47XG4gICAgZmlsdGVyTGlzdDogRmlsdGVyTGlzdFN0b3JlO1xuXG4gICAgLyoqXG4gICAgICogVmlldy1tb2RlbCB0aGF0IHJlc29sdmVzIG9uY2UgYWxsIHRoZSBkYXRhIGlzIHJlYWR5IChvciB1cGRhdGVkKS5cbiAgICAgKi9cbiAgICB2bSQ6IE9ic2VydmFibGU8TGlzdFZpZXdNb2RlbD47XG4gICAgdm06IExpc3RWaWV3TW9kZWw7XG4gICAgZGF0YTogTGlzdFZpZXdEYXRhO1xuXG4gICAgLyoqIEludGVybmFsIFByb3BlcnRpZXMgKi9cbiAgICBwcm90ZWN0ZWQgY2FjaGUkOiBPYnNlcnZhYmxlPGFueT4gPSBudWxsO1xuICAgIHByb3RlY3RlZCBpbnRlcm5hbFN0YXRlOiBMaXN0Vmlld1N0YXRlID0gZGVlcENsb25lKGluaXRpYWxTdGF0ZSk7XG4gICAgcHJvdGVjdGVkIHN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxMaXN0Vmlld1N0YXRlPih0aGlzLmludGVybmFsU3RhdGUpO1xuICAgIHByb3RlY3RlZCBzdGF0ZSQgPSB0aGlzLnN0b3JlLmFzT2JzZXJ2YWJsZSgpO1xuICAgIHByb3RlY3RlZCBkYXRhVXBkYXRlU3RhdGU6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPjtcbiAgICBwcm90ZWN0ZWQgc3ViczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgYXBwU3RhdGVTdG9yZTogQXBwU3RhdGVTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlU3RvcmU6IExhbmd1YWdlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBuYXZpZ2F0aW9uU3RvcmU6IE5hdmlnYXRpb25TdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIG1vZHVsZU5hdmlnYXRpb246IE1vZHVsZU5hdmlnYXRpb24sXG4gICAgICAgIHByb3RlY3RlZCBtZXRhZGF0YVN0b3JlOiBNZXRhZGF0YVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbG9jYWxTdG9yYWdlOiBMb2NhbFN0b3JhZ2VTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgbWVzc2FnZTogTWVzc2FnZVNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBsaXN0U3RvcmVGYWN0b3J5OiBSZWNvcmRMaXN0U3RvcmVGYWN0b3J5LFxuICAgICAgICBwcm90ZWN0ZWQgbW9kYWxTZXJ2aWNlOiBOZ2JNb2RhbCxcbiAgICAgICAgcHJvdGVjdGVkIGZpbHRlckxpc3RTdG9yZUZhY3Rvcnk6IEZpbHRlckxpc3RTdG9yZUZhY3RvcnksXG4gICAgICAgIHByb3RlY3RlZCBjb25maXJtYXRpb246IENvbmZpcm1hdGlvbk1vZGFsU2VydmljZSxcbiAgICApIHtcblxuICAgICAgICBzdXBlcihhcHBTdGF0ZVN0b3JlLCBsYW5ndWFnZVN0b3JlLCBuYXZpZ2F0aW9uU3RvcmUsIG1vZHVsZU5hdmlnYXRpb24sIG1ldGFkYXRhU3RvcmUpO1xuXG4gICAgICAgIHRoaXMucmVjb3JkTGlzdCA9IHRoaXMubGlzdFN0b3JlRmFjdG9yeS5jcmVhdGUoKTtcblxuICAgICAgICB0aGlzLmNvbHVtbnMkID0gbWV0YWRhdGFTdG9yZS5saXN0Vmlld0NvbHVtbnMkO1xuICAgICAgICB0aGlzLmxpbmVBY3Rpb25zJCA9IG1ldGFkYXRhU3RvcmUubGlzdFZpZXdMaW5lQWN0aW9ucyQ7XG4gICAgICAgIHRoaXMucmVjb3JkcyQgPSB0aGlzLnJlY29yZExpc3QucmVjb3JkcyQ7XG4gICAgICAgIHRoaXMuY3JpdGVyaWEkID0gdGhpcy5yZWNvcmRMaXN0LmNyaXRlcmlhJDtcbiAgICAgICAgdGhpcy5jb250ZXh0JCA9IHRoaXMucmVjb3JkTGlzdC5jcml0ZXJpYSQucGlwZShtYXAoKCkgPT4gdGhpcy5nZXRWaWV3Q29udGV4dCgpKSk7XG4gICAgICAgIHRoaXMuc29ydCQgPSB0aGlzLnJlY29yZExpc3Quc29ydCQ7XG4gICAgICAgIHRoaXMucGFnaW5hdGlvbiQgPSB0aGlzLnJlY29yZExpc3QucGFnaW5hdGlvbiQ7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uJCA9IHRoaXMucmVjb3JkTGlzdC5zZWxlY3Rpb24kO1xuICAgICAgICB0aGlzLnNlbGVjdGVkQ291bnQkID0gdGhpcy5yZWNvcmRMaXN0LnNlbGVjdGVkQ291bnQkO1xuICAgICAgICB0aGlzLnNlbGVjdGVkU3RhdHVzJCA9IHRoaXMucmVjb3JkTGlzdC5zZWxlY3RlZFN0YXR1cyQ7XG4gICAgICAgIHRoaXMubG9hZGluZyQgPSB0aGlzLnJlY29yZExpc3QubG9hZGluZyQ7XG4gICAgICAgIHRoaXMubW9kdWxlTmFtZSQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5tb2R1bGUpLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcbiAgICAgICAgdGhpcy53aWRnZXRzJCA9IHRoaXMuc3RhdGUkLnBpcGUobWFwKHN0YXRlID0+IHN0YXRlLndpZGdldHMpLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcbiAgICAgICAgdGhpcy5zaG93U2lkZWJhcldpZGdldHMkID0gdGhpcy5zdGF0ZSQucGlwZShtYXAoc3RhdGUgPT4gc3RhdGUuc2hvd1NpZGViYXJXaWRnZXRzKSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUZpbHRlcnMkID0gdGhpcy5zdGF0ZSQucGlwZShtYXAoc3RhdGUgPT4gc3RhdGUuYWN0aW9uUGFuZWwgPT09ICdmaWx0ZXJzJyksIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpO1xuICAgICAgICB0aGlzLmFjdGlvblBhbmVsJCA9IHRoaXMuc3RhdGUkLnBpcGUobWFwKHN0YXRlID0+IHN0YXRlLmFjdGlvblBhbmVsKSwgZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG4gICAgICAgIHRoaXMuYWN0aXZlRmlsdGVycyQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5hY3RpdmVGaWx0ZXJzKSwgZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG4gICAgICAgIHRoaXMub3BlbkZpbHRlciQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5vcGVuRmlsdGVyKSwgZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG5cbiAgICAgICAgY29uc3QgZGF0YSQgPSBjb21iaW5lTGF0ZXN0KFxuICAgICAgICAgICAgW3RoaXMucmVjb3JkcyQsIHRoaXMuY3JpdGVyaWEkLCB0aGlzLnBhZ2luYXRpb24kLCB0aGlzLnNlbGVjdGlvbiQsIHRoaXMubG9hZGluZyRdXG4gICAgICAgICkucGlwZShcbiAgICAgICAgICAgIG1hcCgoW3JlY29yZHMsIGNyaXRlcmlhLCBwYWdpbmF0aW9uLCBzZWxlY3Rpb24sIGxvYWRpbmddKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0ge3JlY29yZHMsIGNyaXRlcmlhLCBwYWdpbmF0aW9uLCBzZWxlY3Rpb24sIGxvYWRpbmd9IGFzIExpc3RWaWV3RGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnZtJCA9IGNvbWJpbmVMYXRlc3QoW2RhdGEkLCB0aGlzLmFwcERhdGEkLCB0aGlzLm1ldGFkYXRhJF0pLnBpcGUoXG4gICAgICAgICAgICBtYXAoKFtkYXRhLCBhcHBEYXRhLCBtZXRhZGF0YV0pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnZtID0ge2RhdGEsIGFwcERhdGEsIG1ldGFkYXRhfSBhcyBMaXN0Vmlld01vZGVsO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZtO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIHRoaXMuc3Vicy5wdXNoKHRoaXMucmVjb3JkTGlzdC5sb2FkaW5nJC5zdWJzY3JpYmUoXG4gICAgICAgICAgICAobG9hZGluZzogYm9vbGVhbikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwU3RhdGVTdG9yZS51cGRhdGVMb2FkaW5nKGAke3RoaXMuaW50ZXJuYWxTdGF0ZS5tb2R1bGV9LWxpc3QtZmV0Y2hgLCBsb2FkaW5nKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBTdGF0ZVN0b3JlLnVwZGF0ZUxvYWRpbmcoYCR7dGhpcy5pbnRlcm5hbFN0YXRlLm1vZHVsZX0tbGlzdC1mZXRjaGAsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKSk7XG5cbiAgICAgICAgbGV0IGxpc3RWaWV3Q29sdW1uczogQ29sdW1uRGVmaW5pdGlvbltdID0gW107XG4gICAgICAgIHRoaXMuc3Vicy5wdXNoKG1ldGFkYXRhU3RvcmUubGlzdFZpZXdDb2x1bW5zJC5zdWJzY3JpYmUoY29scyA9PiB7XG4gICAgICAgICAgICBsaXN0Vmlld0NvbHVtbnMgPSBjb2xzO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgdGhpcy5jb2x1bW5zID0gbmV3IEJlaGF2aW9yU3ViamVjdDxDb2x1bW5EZWZpbml0aW9uW10+KGxpc3RWaWV3Q29sdW1ucyk7XG4gICAgICAgIHRoaXMuY29sdW1ucyQgPSB0aGlzLmNvbHVtbnMuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICAgICAgdGhpcy5pbml0RGF0YVVwZGF0ZVN0YXRlKCk7XG4gICAgICAgIHRoaXMuaW5pdERhdGFTZXRVcGRhdGVkU3RhdGUoKTtcblxuICAgICAgICB0aGlzLmZpbHRlckxpc3QgPSB0aGlzLmZpbHRlckxpc3RTdG9yZUZhY3RvcnkuY3JlYXRlKCk7XG4gICAgfVxuXG4gICAgZ2V0IGFjdGlvblBhbmVsKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsU3RhdGUuYWN0aW9uUGFuZWw7XG4gICAgfVxuXG4gICAgZ2V0IHNob3dGaWx0ZXJzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN0YXRlLmFjdGlvblBhbmVsID09PSAnZmlsdGVycyc7XG4gICAgfVxuXG4gICAgc2V0IHNob3dGaWx0ZXJzKHNob3c6IGJvb2xlYW4pIHtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHtcbiAgICAgICAgICAgIC4uLnRoaXMuaW50ZXJuYWxTdGF0ZSxcbiAgICAgICAgICAgIGFjdGlvblBhbmVsOiBzaG93ID8gJ2ZpbHRlcnMnIDogJydcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IHdpZGdldHMoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsU3RhdGUud2lkZ2V0cztcbiAgICB9XG5cbiAgICBzZXQgd2lkZ2V0cyhzaG93OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoe1xuICAgICAgICAgICAgLi4udGhpcy5pbnRlcm5hbFN0YXRlLFxuICAgICAgICAgICAgd2lkZ2V0czogc2hvd1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXQgc2hvd1NpZGViYXJXaWRnZXRzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN0YXRlLnNob3dTaWRlYmFyV2lkZ2V0cztcbiAgICB9XG5cbiAgICBzZXQgc2hvd1NpZGViYXJXaWRnZXRzKHNob3c6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSh7XG4gICAgICAgICAgICAuLi50aGlzLmludGVybmFsU3RhdGUsXG4gICAgICAgICAgICBzaG93U2lkZWJhcldpZGdldHM6IHNob3dcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IHJlY29yZFBhbmVsQ29uZmlnKCk6IFJlY29yZFBhbmVsTWV0YWRhdGEge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN0YXRlLnJlY29yZFBhbmVsQ29uZmlnO1xuICAgIH1cblxuICAgIGlzUmVjb3JkUGFuZWxPcGVuKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN0YXRlLmFjdGlvblBhbmVsID09PSAncmVjb3JkUGFuZWwnO1xuICAgIH1cblxuICAgIG9wZW5SZWNvcmRQYW5lbChjb25maWc6IFJlY29yZFBhbmVsTWV0YWRhdGEpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSh7XG4gICAgICAgICAgICAuLi50aGlzLmludGVybmFsU3RhdGUsXG4gICAgICAgICAgICBhY3Rpb25QYW5lbDogJ3JlY29yZFBhbmVsJyxcbiAgICAgICAgICAgIHJlY29yZFBhbmVsQ29uZmlnOiBjb25maWdcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2xvc2VSZWNvcmRQYW5lbCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSh7XG4gICAgICAgICAgICAuLi50aGlzLmludGVybmFsU3RhdGUsXG4gICAgICAgICAgICBhY3Rpb25QYW5lbDogJycsXG4gICAgICAgICAgICByZWNvcmRQYW5lbENvbmZpZzoge30gYXMgUmVjb3JkUGFuZWxNZXRhZGF0YVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGdldE1vZHVsZU5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxTdGF0ZS5tb2R1bGU7XG4gICAgfVxuXG4gICAgZ2V0Vmlld0NvbnRleHQoKTogVmlld0NvbnRleHQge1xuXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB7XG4gICAgICAgICAgICBtb2R1bGU6IHRoaXMuZ2V0TW9kdWxlTmFtZSgpLFxuICAgICAgICB9IGFzIFZpZXdDb250ZXh0O1xuXG4gICAgICAgIGNvbnRleHQuY3JpdGVyaWEgPSB0aGlzLnJlY29yZExpc3QuY3JpdGVyaWE7XG4gICAgICAgIGNvbnRleHQuc29ydCA9IHRoaXMucmVjb3JkTGlzdC5zb3J0O1xuXG4gICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFuIGRlc3Ryb3lcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICB0aGlzLnN1YnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBhY3RpdmUgZmlsdGVyc1xuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gYWN0aXZlIGZpbHRlcnNcbiAgICAgKi9cbiAgICBnZXQgYWN0aXZlRmlsdGVycygpOiBTYXZlZEZpbHRlck1hcCB7XG4gICAgICAgIHJldHVybiBkZWVwQ2xvbmUodGhpcy5pbnRlcm5hbFN0YXRlLmFjdGl2ZUZpbHRlcnMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFyIG9ic2VydmFibGUgY2FjaGVcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2FjaGUkID0gbnVsbDtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZShkZWVwQ2xvbmUoaW5pdGlhbFN0YXRlKSk7XG4gICAgICAgIHRoaXMucmVjb3JkTGlzdC5jbGVhcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhckF1dGhCYXNlZCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICB0aGlzLnJlY29yZExpc3QuY2xlYXJBdXRoQmFzZWQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsIGxpc3QgcmVjb3JkcyBsb2FkIGlmIG5vdCBjYWNoZWQgYW5kIHVwZGF0ZSBzdGF0ZS5cbiAgICAgKiBSZXR1cm5zIG9ic2VydmFibGUgdG8gYmUgdXNlZCBpbiByZXNvbHZlciBpZiBuZWVkZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2R1bGUgdG8gdXNlXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxhbnk+XG4gICAgICovXG4gICAgcHVibGljIGluaXQobW9kdWxlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFJlY29yZExpc3Q+IHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbFN0YXRlLm1vZHVsZSA9IG1vZHVsZTtcbiAgICAgICAgdGhpcy5yZWNvcmRMaXN0LmluaXQobW9kdWxlLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuZmlsdGVyTGlzdC5pbml0KG1vZHVsZSk7XG5cbiAgICAgICAgdGhpcy5maWx0ZXJMaXN0LmxvYWQoZmFsc2UpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCk7XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVTaG93V2lkZ2V0cygpO1xuXG4gICAgICAgIHRoaXMuc3RvcmFnZUxvYWQobW9kdWxlLCAnYWN0aXZlLWZpbHRlcnMnLCAoc3RvcmFnZSkgPT4gdGhpcy5zZXRGaWx0ZXJzKHN0b3JhZ2UsIGZhbHNlKSk7XG4gICAgICAgIHRoaXMuc3RvcmFnZUxvYWQobW9kdWxlLCAnc29ydC1zZWxlY3Rpb24nLCAoc3RvcmFnZSkgPT4gdGhpcy5yZWNvcmRMaXN0LnNvcnQgPSBzdG9yYWdlKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5sb2FkKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IG9wZW4gZmlsdGVyc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGZpbHRlciB0byBzZXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0T3BlbkZpbHRlcihmaWx0ZXI6IFNhdmVkRmlsdGVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoey4uLnRoaXMuaW50ZXJuYWxTdGF0ZSwgb3BlbkZpbHRlcjogZGVlcENsb25lKGZpbHRlcil9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgYWN0aXZlIGZpbHRlcnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmaWx0ZXJzIHRvIHNldFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVsb2FkIGZsYWdcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0RmlsdGVycyhmaWx0ZXJzOiBTYXZlZEZpbHRlck1hcCwgcmVsb2FkID0gdHJ1ZSk6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IGZpbHRlcktleSA9IE9iamVjdC5rZXlzKGZpbHRlcnMpLnNoaWZ0KCk7XG4gICAgICAgIGNvbnN0IGZpbHRlciA9IGZpbHRlcnNbZmlsdGVyS2V5XTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHsuLi50aGlzLmludGVybmFsU3RhdGUsIGFjdGl2ZUZpbHRlcnM6IGRlZXBDbG9uZShmaWx0ZXJzKSwgb3BlbkZpbHRlcjogZGVlcENsb25lKGZpbHRlcil9KTtcblxuICAgICAgICBpZiAoZmlsdGVyLmNyaXRlcmlhKSB7XG4gICAgICAgICAgICBjb25zdCBvcmRlckJ5ID0gZmlsdGVyLmNyaXRlcmlhLm9yZGVyQnkgPz8gJyc7XG4gICAgICAgICAgICBjb25zdCBzb3J0T3JkZXIgPSBmaWx0ZXIuY3JpdGVyaWEuc29ydE9yZGVyID8/ICcnO1xuICAgICAgICAgICAgbGV0IGRpcmVjdGlvbiA9IHRoaXMucmVjb3JkTGlzdC5tYXBTb3J0T3JkZXIoc29ydE9yZGVyKTtcblxuICAgICAgICAgICAgdGhpcy5yZWNvcmRMaXN0LnVwZGF0ZVNvcnRpbmcob3JkZXJCeSwgZGlyZWN0aW9uLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVTZWFyY2hDcml0ZXJpYShyZWxvYWQpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIGZpbHRlcnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmaWx0ZXIgdG8gc2V0XG4gICAgICovXG4gICAgcHVibGljIGFkZFNhdmVkRmlsdGVyKGZpbHRlcjogU2F2ZWRGaWx0ZXIpOiB2b2lkIHtcblxuICAgICAgICBjb25zdCBuZXdTdGF0ZSA9IHsuLi50aGlzLmludGVybmFsU3RhdGV9O1xuICAgICAgICBjb25zdCBhY3RpdmVGaWx0ZXJzID0gdGhpcy5hY3RpdmVGaWx0ZXJzO1xuXG4gICAgICAgIGlmIChmaWx0ZXIua2V5ICYmIGFjdGl2ZUZpbHRlcnNbZmlsdGVyLmtleV0pIHtcbiAgICAgICAgICAgIGFjdGl2ZUZpbHRlcnNbZmlsdGVyLmtleV0gPSBmaWx0ZXI7XG4gICAgICAgICAgICBuZXdTdGF0ZS5hY3RpdmVGaWx0ZXJzID0gYWN0aXZlRmlsdGVycztcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld1N0YXRlLm9wZW5GaWx0ZXIgPSBmaWx0ZXI7XG5cbiAgICAgICAgdGhpcy5maWx0ZXJMaXN0LmFkZEZpbHRlcihmaWx0ZXIpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUobmV3U3RhdGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSBmaWx0ZXJzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZmlsdGVyIHRvIHNldFxuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmVTYXZlZEZpbHRlcihmaWx0ZXI6IFNhdmVkRmlsdGVyKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKCFmaWx0ZXIgfHwgIWZpbHRlci5rZXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmlsdGVyTGlzdC5yZW1vdmVGaWx0ZXIoZmlsdGVyKTtcblxuICAgICAgICBjb25zdCBuZXdTdGF0ZSA9IHsuLi50aGlzLmludGVybmFsU3RhdGV9O1xuXG4gICAgICAgIGlmIChuZXdTdGF0ZS5vcGVuRmlsdGVyICYmIG5ld1N0YXRlLm9wZW5GaWx0ZXIua2V5ID09PSBmaWx0ZXIua2V5KSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0RmlsdGVycyh0cnVlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgYWN0aXZlIGZpbHRlcnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVsb2FkIGZsYWdcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVzZXRGaWx0ZXJzKHJlbG9hZCA9IHRydWUpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHtcbiAgICAgICAgICAgIC4uLnRoaXMuaW50ZXJuYWxTdGF0ZSxcbiAgICAgICAgICAgIGFjdGl2ZUZpbHRlcnM6IGRlZXBDbG9uZShpbml0aWFsRmlsdGVycyksXG4gICAgICAgICAgICBvcGVuRmlsdGVyOiBkZWVwQ2xvbmUoaW5pdGlhbEZpbHRlcilcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTZWFyY2hDcml0ZXJpYShyZWxvYWQpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBzZWFyY2ggY3JpdGVyaWFcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVsb2FkIGZsYWdcbiAgICAgKi9cbiAgICBwdWJsaWMgdXBkYXRlU2VhcmNoQ3JpdGVyaWEocmVsb2FkID0gdHJ1ZSk6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IGZpbHRlcnMgPSB7Li4udGhpcy5pbnRlcm5hbFN0YXRlLmFjdGl2ZUZpbHRlcnN9O1xuICAgICAgICBjb25zdCBmaWx0ZXJLZXkgPSBPYmplY3Qua2V5cyhmaWx0ZXJzKS5zaGlmdCgpO1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSBmaWx0ZXJzW2ZpbHRlcktleV07XG5cbiAgICAgICAgdGhpcy5yZWNvcmRMaXN0LnVwZGF0ZVNlYXJjaENyaXRlcmlhKGZpbHRlci5jcml0ZXJpYSwgcmVsb2FkKTtcbiAgICAgICAgaWYgKHJlbG9hZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVMb2NhbFN0b3JhZ2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RvcmFnZVNhdmUodGhpcy5pbnRlcm5hbFN0YXRlLm1vZHVsZSwgJ2FjdGl2ZS1maWx0ZXJzJywgdGhpcy5pbnRlcm5hbFN0YXRlLmFjdGl2ZUZpbHRlcnMpO1xuICAgICAgICB0aGlzLnN0b3JhZ2VTYXZlKHRoaXMuaW50ZXJuYWxTdGF0ZS5tb2R1bGUsICdzb3J0LXNlbGVjdGlvbicsIHRoaXMucmVjb3JkTGlzdC5zb3J0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdHJpZ2dlckRhdGFVcGRhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGF0YVVwZGF0ZVN0YXRlLm5leHQodHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9hZCAvIHJlbG9hZCByZWNvcmRzIHVzaW5nIGN1cnJlbnQgcGFnaW5hdGlvbiBhbmQgY3JpdGVyaWFcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdXNlQ2FjaGUgaWYgdG8gdXNlIGNhY2hlXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxMaXN0Vmlld1N0YXRlPlxuICAgICAqL1xuICAgIHB1YmxpYyBsb2FkKHVzZUNhY2hlID0gdHJ1ZSk6IE9ic2VydmFibGU8UmVjb3JkTGlzdD4ge1xuXG4gICAgICAgIHRoaXMuc3RvcmFnZVNhdmUodGhpcy5pbnRlcm5hbFN0YXRlLm1vZHVsZSwgJ2FjdGl2ZS1maWx0ZXJzJywgdGhpcy5pbnRlcm5hbFN0YXRlLmFjdGl2ZUZpbHRlcnMpO1xuICAgICAgICB0aGlzLnN0b3JhZ2VTYXZlKHRoaXMuaW50ZXJuYWxTdGF0ZS5tb2R1bGUsICdzb3J0LXNlbGVjdGlvbicsIHRoaXMucmVjb3JkTGlzdC5zb3J0KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5yZWNvcmRMaXN0LmxvYWQodXNlQ2FjaGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludGVybmFsIEFQSVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBzdGF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHN0YXRlIHRvIHNldFxuICAgICAqL1xuICAgIHByb3RlY3RlZCB1cGRhdGVTdGF0ZShzdGF0ZTogTGlzdFZpZXdTdGF0ZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0b3JlLm5leHQodGhpcy5pbnRlcm5hbFN0YXRlID0gc3RhdGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZSBpZiB3aWRnZXRzIGFyZSB0byBkaXNwbGF5XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNhbGN1bGF0ZVNob3dXaWRnZXRzKCk6IHZvaWQge1xuICAgICAgICBsZXQgc2hvdyA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IG1ldGEgPSB0aGlzLm1ldGFkYXRhU3RvcmUuZ2V0KCkgfHwge307XG4gICAgICAgIGNvbnN0IGxpc3RWaWV3TWV0YSA9IG1ldGEubGlzdFZpZXcgfHwge30gYXMgTGlzdFZpZXdNZXRhO1xuICAgICAgICBjb25zdCBzaWRlYmFyV2lkZ2V0c0NvbmZpZyA9IGxpc3RWaWV3TWV0YS5zaWRlYmFyV2lkZ2V0cyB8fCBbXTtcblxuICAgICAgICBpZiAoc2lkZWJhcldpZGdldHNDb25maWcgJiYgc2lkZWJhcldpZGdldHNDb25maWcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2hvdyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNob3dTaWRlYmFyV2lkZ2V0cyA9IHNob3c7XG4gICAgICAgIHRoaXMud2lkZ2V0cyA9IHNob3c7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RvcmUgdGhlIGRhdGEgaW4gbG9jYWwgc3RvcmFnZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZHVsZSB0byBzdG9yZSBpblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdG9yYWdlS2V5IHRvIHN0b3JlIGluXG4gICAgICogQHBhcmFtIHt9IGRhdGEgdG8gc3RvcmVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc3RvcmFnZVNhdmUobW9kdWxlOiBzdHJpbmcsIHN0b3JhZ2VLZXk6IHN0cmluZywgZGF0YTogYW55KTogdm9pZCB7XG4gICAgICAgIGxldCBzdG9yYWdlID0gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0KHN0b3JhZ2VLZXkpO1xuXG4gICAgICAgIGlmICghc3RvcmFnZSkge1xuICAgICAgICAgICAgc3RvcmFnZSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgc3RvcmFnZVttb2R1bGVdID0gZGF0YTtcblxuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zZXQoc3RvcmFnZUtleSwgc3RvcmFnZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RvcmUgdGhlIGtleSBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kdWxlIHRvIGxvYWQgZnJvbVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdG9yYWdlS2V5IGZyb20gbG9hZCBmcm9tXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbG9hZGVyIHRvIHN0b3JlIGluXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHN0b3JhZ2VMb2FkKG1vZHVsZTogc3RyaW5nLCBzdG9yYWdlS2V5OiBzdHJpbmcsIGxvYWRlcjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc3RvcmFnZSA9IHRoaXMubG9jYWxTdG9yYWdlLmdldChzdG9yYWdlS2V5KTtcblxuICAgICAgICBpZiAoIXN0b3JhZ2UgfHwgIXN0b3JhZ2VbbW9kdWxlXSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9hZGVyKHN0b3JhZ2VbbW9kdWxlXSk7XG4gICAgfVxuXG4gICAgb3BlbkNvbHVtbkNob29zZXJEaWFsb2coKTogdm9pZCB7XG5cbiAgICAgICAgY29uc3QgbW9kYWxSZWYgPSB0aGlzLm1vZGFsU2VydmljZS5vcGVuKENvbHVtbkNob29zZXJDb21wb25lbnQsIHtcbiAgICAgICAgICAgIGFyaWFMYWJlbGxlZEJ5OiAnbW9kYWwtYmFzaWMtdGl0bGUnLFxuICAgICAgICAgICAgY2VudGVyZWQ6IHRydWUsXG4gICAgICAgICAgICBzaXplOiAnbGcnLFxuICAgICAgICAgICAgd2luZG93Q2xhc3M6ICdjb2x1bW4tY2hvb3Nlci1tb2RhbCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZGlzcGxheWVkQ29sdW1ucyA9IHRoaXMuY29sdW1ucy5nZXRWYWx1ZSgpLmZpbHRlcihmdW5jdGlvbiAoY29sKSB7XG4gICAgICAgICAgICByZXR1cm4gIWNvbC5oYXNPd25Qcm9wZXJ0eSgnZGVmYXVsdCcpXG4gICAgICAgICAgICAgICAgfHwgKGNvbC5oYXNPd25Qcm9wZXJ0eSgnZGVmYXVsdCcpICYmIGNvbC5kZWZhdWx0ID09PSB0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgaGlkZGVuQ29sdW1ucyA9IHRoaXMuY29sdW1ucy5nZXRWYWx1ZSgpLmZpbHRlcihmdW5jdGlvbiAoY29sKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sLmhhc093blByb3BlcnR5KCdkZWZhdWx0JykgJiYgY29sLmRlZmF1bHQgPT09IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBtb2RhbFJlZi5jb21wb25lbnRJbnN0YW5jZS5kaXNwbGF5ZWQgPSBkaXNwbGF5ZWRDb2x1bW5zO1xuICAgICAgICBtb2RhbFJlZi5jb21wb25lbnRJbnN0YW5jZS5oaWRkZW4gPSBoaWRkZW5Db2x1bW5zO1xuXG4gICAgICAgIG1vZGFsUmVmLnJlc3VsdC50aGVuKChyZXN1bHQpID0+IHtcblxuICAgICAgICAgICAgbGV0IGFsbENvbHVtbnM6IENvbHVtbkRlZmluaXRpb25bXSA9IFtdO1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWREaXNwbGF5Q29sdW1uczogQ29sdW1uRGVmaW5pdGlvbltdID0gcmVzdWx0LmRpc3BsYXllZDtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkSGlkZUNvbHVtbnM6IENvbHVtbkRlZmluaXRpb25bXSA9IHJlc3VsdC5oaWRkZW47XG5cbiAgICAgICAgICAgIHNlbGVjdGVkRGlzcGxheUNvbHVtbnMuZm9yRWFjaChmdW5jdGlvbiAoY29sdW1uKSB7XG4gICAgICAgICAgICAgICAgY29sdW1uLmRlZmF1bHQgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZWxlY3RlZEhpZGVDb2x1bW5zLmZvckVhY2goZnVuY3Rpb24gKGNvbHVtbikge1xuICAgICAgICAgICAgICAgIGNvbHVtbi5kZWZhdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGFsbENvbHVtbnMucHVzaCguLi5zZWxlY3RlZERpc3BsYXlDb2x1bW5zLCAuLi5zZWxlY3RlZEhpZGVDb2x1bW5zKTtcbiAgICAgICAgICAgIHRoaXMuY29sdW1ucy5uZXh0KGFsbENvbHVtbnMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgZGF0YSB1cGRhdGUgc3RhdGUuXG4gICAgICogSXQgc2hvdWxkIGJlIGVtaXR0ZWQgb24gYW55IGNoYW5nZSBpbiB2YWx1ZXMgb24gdGhlIHJlY29yZCBsaXN0LlxuICAgICAqIFJlbG9hZC9QYWdpbmF0aW9uIGlzIG5vdCBjb25zaWRlcmVkIGFzIGEgZGF0YSB1cGRhdGVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW5pdERhdGFVcGRhdGVTdGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kYXRhVXBkYXRlU3RhdGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KHRydWUpO1xuICAgICAgICB0aGlzLmRhdGFVcGRhdGUkID0gdGhpcy5kYXRhVXBkYXRlU3RhdGUuYXNPYnNlcnZhYmxlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogIEluaXRpYWxpemUgdGhlIGRhdGFTZXQgdXBkYXRlIHN0YXRlLlxuICAgICAqICBJdCBzaG91bGQgYmUgZW1pdHRlZCBvbiBhbnkgY2hhbmdlIGluIGRhdGFTZXQgZS5nLiBkdWUgdG8gZGF0YSBmaWx0ZXIsIGR1ZSB0byBkYXRhIGRlbGV0ZSxcbiAgICAgKiAgZHVlIHRvIGRhdGEgZWRpdCBvciBhbnkgZXZlbnQgd2hpY2ggY2F1c2VzIGNoYW5nZSBpbiB0aGUgcmVzdWx0aW5nIGRhdGFTZXQuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGluaXREYXRhU2V0VXBkYXRlZFN0YXRlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRhdGFTZXRVcGRhdGUkID0gY29tYmluZUxhdGVzdChcbiAgICAgICAgICAgIFt0aGlzLmNyaXRlcmlhJCwgdGhpcy5kYXRhVXBkYXRlJF1cbiAgICAgICAgKS5waXBlKG1hcCgoKSA9PiB0cnVlKSk7XG4gICAgfVxufVxuIl19