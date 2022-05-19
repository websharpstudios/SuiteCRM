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
import { deepClone, PageSelection, SelectionStatus, SortDirection } from 'common';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, shareReplay, take, tap } from 'rxjs/operators';
import { AppStateStore } from '../app-state/app-state.store';
import { Injectable } from '@angular/core';
import { ListGQL } from './graphql/api.list.get';
import { SystemConfigStore } from '../system-config/system-config.store';
import { UserPreferenceStore } from '../user-preference/user-preference.store';
import { LanguageStore } from '../language/language.store';
import { MessageService } from '../../services/message/message.service';
const initialSearchCriteria = {
    filters: {}
};
const initialListSort = {
    orderBy: '',
    sortOrder: SortDirection.DESC
};
const initialSelection = {
    all: false,
    status: SelectionStatus.NONE,
    selected: {},
    count: 0
};
const initialState = {
    module: '',
    records: [],
    criteria: deepClone(initialSearchCriteria),
    sort: deepClone(initialListSort),
    pagination: {
        pageSize: 5,
        current: 0,
        previous: 0,
        next: 5,
        last: 0,
        total: 0,
        pageFirst: 0,
        pageLast: 0
    },
    selection: deepClone(initialSelection),
    loading: false,
};
export class RecordListStore {
    constructor(listGQL, configStore, preferencesStore, appStateStore, languageStore, message) {
        this.listGQL = listGQL;
        this.configStore = configStore;
        this.preferencesStore = preferencesStore;
        this.appStateStore = appStateStore;
        this.languageStore = languageStore;
        this.message = message;
        /** Internal Properties */
        this.cache$ = null;
        this.internalState = deepClone(initialState);
        this.store = new BehaviorSubject(this.internalState);
        this.state$ = this.store.asObservable();
        this.records$ = this.state$.pipe(map(state => state.records), distinctUntilChanged());
        this.criteria$ = this.state$.pipe(map(state => state.criteria), distinctUntilChanged());
        this.sort$ = this.state$.pipe(map(state => state.sort), distinctUntilChanged());
        this.pagination$ = this.state$.pipe(map(state => state.pagination), distinctUntilChanged());
        this.selection$ = this.state$.pipe(map(state => state.selection), distinctUntilChanged());
        this.selectedCount$ = this.state$.pipe(map(state => state.selection.count), distinctUntilChanged());
        this.selectedStatus$ = this.state$.pipe(map(state => state.selection.status), distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading));
    }
    connect() {
        return this.records$;
    }
    disconnect() {
    }
    get criteria() {
        if (!this.internalState.criteria) {
            return deepClone(initialSearchCriteria);
        }
        return deepClone(this.internalState.criteria);
    }
    set criteria(criteria) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { criteria }));
    }
    get sort() {
        if (!this.internalState.sort) {
            return deepClone(initialListSort);
        }
        return deepClone(this.internalState.sort);
    }
    set sort(sort) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { sort }));
    }
    get selection() {
        if (!this.internalState.selection) {
            return deepClone(initialSelection);
        }
        return deepClone(this.internalState.selection);
    }
    get records() {
        if (!this.internalState.records) {
            return [];
        }
        return this.internalState.records;
    }
    getModule() {
        return this.internalState.module;
    }
    getRecord(id) {
        let record = null;
        this.records.some(item => {
            if (item.id === id) {
                record = item;
                return true;
            }
        });
        return record;
    }
    /**
     * Clean destroy
     */
    destroy() {
        this.clear();
    }
    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @param {boolean} load if to load
     * @param {string} pageSizeConfigKey string
     * @returns {object} Observable<any>
     */
    init(module, load = true, pageSizeConfigKey = 'list_max_entries_per_page') {
        this.internalState.module = module;
        this.watchPageSize(pageSizeConfigKey);
        if (load === false) {
            return null;
        }
        return this.load();
    }
    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<ListViewState>
     */
    load(useCache = true) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { loading: true }));
        return this.getRecords(this.internalState.module, this.internalState.criteria, this.internalState.sort, this.internalState.pagination, useCache).pipe(catchError(() => {
            this.message.addDangerMessageByKey('LBL_GET_RECORD_LIST_ERROR');
            return of({
                records: [],
                criteria: deepClone(initialSearchCriteria),
                sort: deepClone(initialListSort),
                pagination: {
                    pageSize: 5,
                    current: 0,
                    previous: 0,
                    next: 5,
                    last: 0,
                    total: 0,
                    pageFirst: 0,
                    pageLast: 0
                },
                selection: deepClone(initialSelection),
            });
        }), tap((data) => {
            this.calculatePageCount(data.records, data.pagination);
            this.updateState(Object.assign(Object.assign({}, this.internalState), { records: data.records, pagination: data.pagination, loading: false }));
        }));
    }
    /**
     * Update the search criteria
     *
     * @param {object} criteria to set
     * @param {boolean} reload flag
     */
    updateSearchCriteria(criteria, reload = true) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { criteria }));
        if (reload) {
            this.updateSelection(SelectionStatus.NONE);
            // Reset pagination to default first page
            this.resetPagination();
        }
    }
    /**
     * Reset search criteria
     * @param {boolean} reload flag
     */
    resetSearchCriteria(reload = true) {
        this.updateSearchCriteria(deepClone(initialSearchCriteria), reload);
    }
    /**
     * Update current list view sorting
     *
     * @param {string} orderBy to set
     * @param {string} sortOrder to set
     * @param {boolean} reload flag
     */
    updateSorting(orderBy, sortOrder, reload = true) {
        if (sortOrder === SortDirection.NONE) {
            orderBy = '';
            sortOrder = SortDirection.DESC;
        }
        const sort = { orderBy, sortOrder };
        this.updateState(Object.assign(Object.assign({}, this.internalState), { sort }));
        if (reload) {
            this.load(false).pipe(take(1)).subscribe();
        }
    }
    /**
     * Map sort order to SortDirection enum
     * @param {string} sortOrder to map
     * @returns {string} SortDirection
     */
    mapSortOrder(sortOrder) {
        let direction = SortDirection.NONE;
        const sort = sortOrder.toLowerCase();
        if (sort === 'asc') {
            direction = SortDirection.ASC;
        }
        else if (sort === 'desc') {
            direction = SortDirection.DESC;
        }
        return direction;
    }
    /**
     * Update the pagination
     *
     * @param {number} current to set
     */
    updatePagination(current) {
        const pagination = Object.assign(Object.assign({}, this.internalState.pagination), { current });
        this.updateState(Object.assign(Object.assign({}, this.internalState), { pagination }));
        this.load(false).pipe(take(1)).subscribe();
    }
    /**
     * Reset/Clear the pagination
     */
    resetPagination() {
        this.updatePagination(0);
    }
    /**
     * Clear observable cache
     */
    clear() {
        this.cache$ = null;
        this.store.unsubscribe();
        this.preferencesSub.unsubscribe();
    }
    clearAuthBased() {
        this.clear();
    }
    /**
     * Selection public api
     */
    getSelectionStatus() {
        return this.selectedStatus$;
    }
    getSelectedCount() {
        return this.selectedCount$;
    }
    updateSelection(state) {
        if (state === SelectionStatus.NONE) {
            this.clearSelection();
            return;
        }
        if (state === SelectionStatus.ALL) {
            this.selectAll();
            return;
        }
        if (state === SelectionStatus.PAGE) {
            this.selectPage();
            return;
        }
    }
    clearSelection() {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { selection: deepClone(initialSelection) }));
    }
    selectAll() {
        const total = this.internalState.pagination.total;
        this.updateState(Object.assign(Object.assign({}, this.internalState), { selection: {
                all: true,
                status: SelectionStatus.ALL,
                selected: {},
                count: total
            } }));
    }
    selectPage() {
        const selected = Object.assign({}, this.internalState.selection.selected);
        if (this.internalState.records && this.internalState.records.length) {
            this.internalState.records.forEach(value => {
                if (value && value.id) {
                    selected[value.id] = value.id;
                }
            });
        }
        this.updateState(Object.assign(Object.assign({}, this.internalState), { selection: {
                all: false,
                status: SelectionStatus.SOME,
                selected,
                count: Object.keys(selected).length
            } }));
    }
    toggleSelection(id) {
        const selection = deepClone(this.internalState.selection);
        if (selection.selected[id]) {
            delete selection.selected[id];
        }
        else {
            selection.selected[id] = id;
        }
        selection.count = Object.keys(selection.selected).length;
        if (selection.count === 0) {
            selection.status = SelectionStatus.NONE;
        }
        else {
            selection.status = SelectionStatus.SOME;
        }
        this.updateState(Object.assign(Object.assign({}, this.internalState), { selection }));
    }
    /**
     * Pagination Public API
     */
    getPaginationCount() {
        return this.pagination$.pipe(map(pagination => ({
            pageFirst: pagination.pageFirst,
            pageLast: pagination.pageLast,
            total: pagination.total
        })), distinctUntilChanged());
    }
    getPagination() {
        return this.store.value.pagination;
    }
    changePage(page) {
        let pageToLoad = 0;
        const pageMap = {};
        pageMap[PageSelection.FIRST] = 0;
        pageMap[PageSelection.PREVIOUS] = this.internalState.pagination.previous;
        pageMap[PageSelection.NEXT] = this.internalState.pagination.next;
        pageMap[PageSelection.LAST] = this.internalState.pagination.last;
        if (page in pageMap && pageMap[page] >= 0) {
            pageToLoad = pageMap[page];
            if (pageToLoad > this.internalState.pagination.last) {
                return;
            }
            if (pageToLoad < 0) {
                return;
            }
            this.updatePagination(pageToLoad);
        }
    }
    /**
     * Set Pagination page size
     *
     * @param {number} pageSize to set
     */
    setPageSize(pageSize) {
        const pagination = Object.assign(Object.assign({}, this.internalState.pagination), { pageSize });
        this.updateState(Object.assign(Object.assign({}, this.internalState), { pagination }));
    }
    /**
     * Internal API
     */
    /**
     * Subscribe to page size changes
     *
     * @param {string} pageSizeConfigKey key
     */
    watchPageSize(pageSizeConfigKey) {
        const pageSizePreference = this.preferencesStore.getUserPreference(pageSizeConfigKey);
        const pageSizeConfig = this.configStore.getConfigValue(pageSizeConfigKey);
        this.determinePageSize(pageSizePreference, pageSizeConfig);
        this.preferencesSub = combineLatest([this.configStore.configs$, this.preferencesStore.userPreferences$])
            .pipe(tap(([configs, preferences]) => {
            const key = pageSizeConfigKey;
            const sizePreference = (preferences && preferences[key]) || null;
            const sizeConfig = (configs && configs[key] && configs[key].value) || null;
            this.determinePageSize(sizePreference, sizeConfig);
        })).subscribe();
    }
    /**
     * Determine page size to use
     *
     * @param {} pageSizePreference to use
     * @param {string} pageSizeConfig to use
     */
    determinePageSize(pageSizePreference, pageSizeConfig) {
        let size = 0;
        if (pageSizePreference) {
            size = pageSizePreference;
        }
        else if (pageSizeConfig) {
            size = parseInt(pageSizeConfig, 10);
        }
        this.setPageSize(size);
    }
    /**
     * Update the state
     *
     * @param {object} state to set
     */
    updateState(state) {
        this.store.next(this.internalState = state);
    }
    /**
     * Calculate page count
     *
     * @param {object} records list
     * @param {object} pagination info
     */
    calculatePageCount(records, pagination) {
        const recordCount = (records && records.length) || 0;
        let pageFirst = 0;
        let pageLast = 0;
        if (recordCount > 0) {
            pageFirst = pagination.current + 1;
            pageLast = pagination.current + recordCount;
        }
        pagination.pageFirst = pageFirst;
        pagination.pageLast = pageLast;
    }
    /**
     * Get records cached Observable or call the backend
     *
     * @param {string} module to use
     * @param {object} criteria to use
     * @param {object} sort to use
     * @param {object} pagination to use
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<any>
     */
    getRecords(module, criteria, sort, pagination, useCache = true) {
        if (this.cache$ == null || useCache === false) {
            this.cache$ = this.listGQL.get(module, criteria, sort, pagination).pipe(shareReplay(1));
        }
        return this.cache$;
    }
}
RecordListStore.decorators = [
    { type: Injectable }
];
RecordListStore.ctorParameters = () => [
    { type: ListGQL },
    { type: SystemConfigStore },
    { type: UserPreferenceStore },
    { type: AppStateStore },
    { type: LanguageStore },
    { type: MessageService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLWxpc3Quc3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc3RvcmUvcmVjb3JkLWxpc3QvcmVjb3JkLWxpc3Quc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFDSCxTQUFTLEVBQ1QsYUFBYSxFQVFiLGVBQWUsRUFDZixhQUFhLEVBRWhCLE1BQU0sUUFBUSxDQUFDO0FBQ2hCLE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFjLEVBQUUsRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUNsRixPQUFPLEVBQUMsVUFBVSxFQUFFLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTdGLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUUzRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMvQyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUN2RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSwwQ0FBMEMsQ0FBQztBQUM3RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDekQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBRXRFLE1BQU0scUJBQXFCLEdBQUc7SUFDMUIsT0FBTyxFQUFFLEVBQUU7Q0FDZCxDQUFDO0FBRUYsTUFBTSxlQUFlLEdBQUc7SUFDcEIsT0FBTyxFQUFFLEVBQUU7SUFDWCxTQUFTLEVBQUUsYUFBYSxDQUFDLElBQUk7Q0FDaEMsQ0FBQztBQUVGLE1BQU0sZ0JBQWdCLEdBQW9CO0lB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T0FTRztJQUNPLFVBQVUsQ0FDaEIsTUFBYyxFQUNkLFFBQXdCLEVBQ3hCLElBQXNCLEVBQ3RCLFVBQXNCLEVBQ3RCLFFBQVEsR0FBRyxJQUFJO1FBR2YsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxRQUFRLEtBQUssS0FBSyxFQUFFO1lBQzNDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUNuRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQ2pCLENBQUM7U0FDTDtRQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDOzs7WUFsaEJKLFVBQVU7OztZQTNESCxPQUFPO1lBQ1AsaUJBQWlCO1lBQ2pCLG1CQUFtQjtZQUxuQixhQUFhO1lBTWIsYUFBYTtZQUNiLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7XG4gICAgZGVlcENsb25lLFxuICAgIFBhZ2VTZWxlY3Rpb24sXG4gICAgUGFnaW5hdGlvbixcbiAgICBQYWdpbmF0aW9uQ291bnQsXG4gICAgUGFnaW5hdGlvbkRhdGFTb3VyY2UsXG4gICAgUmVjb3JkLFxuICAgIFJlY29yZFNlbGVjdGlvbixcbiAgICBTZWFyY2hDcml0ZXJpYSxcbiAgICBTZWxlY3Rpb25EYXRhU291cmNlLFxuICAgIFNlbGVjdGlvblN0YXR1cyxcbiAgICBTb3J0RGlyZWN0aW9uLFxuICAgIFNvcnRpbmdTZWxlY3Rpb25cbn0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBvZiwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7Y2F0Y2hFcnJvciwgZGlzdGluY3RVbnRpbENoYW5nZWQsIG1hcCwgc2hhcmVSZXBsYXksIHRha2UsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtTdGF0ZVN0b3JlfSBmcm9tICcuLi9zdGF0ZSc7XG5pbXBvcnQge0FwcFN0YXRlU3RvcmV9IGZyb20gJy4uL2FwcC1zdGF0ZS9hcHAtc3RhdGUuc3RvcmUnO1xuaW1wb3J0IHtEYXRhU291cmNlfSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TGlzdEdRTH0gZnJvbSAnLi9ncmFwaHFsL2FwaS5saXN0LmdldCc7XG5pbXBvcnQge1N5c3RlbUNvbmZpZ1N0b3JlfSBmcm9tICcuLi9zeXN0ZW0tY29uZmlnL3N5c3RlbS1jb25maWcuc3RvcmUnO1xuaW1wb3J0IHtVc2VyUHJlZmVyZW5jZVN0b3JlfSBmcm9tICcuLi91c2VyLXByZWZlcmVuY2UvdXNlci1wcmVmZXJlbmNlLnN0b3JlJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZX0gZnJvbSAnLi4vbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtNZXNzYWdlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWVzc2FnZS9tZXNzYWdlLnNlcnZpY2UnO1xuXG5jb25zdCBpbml0aWFsU2VhcmNoQ3JpdGVyaWEgPSB7XG4gICAgZmlsdGVyczoge31cbn07XG5cbmNvbnN0IGluaXRpYWxMaXN0U29ydCA9IHtcbiAgICBvcmRlckJ5OiAnJyxcbiAgICBzb3J0T3JkZXI6IFNvcnREaXJlY3Rpb24uREVTQ1xufTtcblxuY29uc3QgaW5pdGlhbFNlbGVjdGlvbjogUmVjb3JkU2VsZWN0aW9uID0ge1xuICAgIGFsbDogZmFsc2UsXG4gICAgc3RhdHVzOiBTZWxlY3Rpb25TdGF0dXMuTk9ORSxcbiAgICBzZWxlY3RlZDoge30sXG4gICAgY291bnQ6IDBcbn07XG5cblxuZXhwb3J0IGludGVyZmFjZSBSZWNvcmRMaXN0IHtcbiAgICByZWNvcmRzOiBSZWNvcmRbXTtcbiAgICBwYWdpbmF0aW9uPzogUGFnaW5hdGlvbjtcbiAgICBjcml0ZXJpYT86IFNlYXJjaENyaXRlcmlhO1xuICAgIHNvcnQ/OiBTb3J0aW5nU2VsZWN0aW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlY29yZExpc3RTdGF0ZSB7XG4gICAgbW9kdWxlOiBzdHJpbmc7XG4gICAgcmVjb3JkczogUmVjb3JkW107XG4gICAgcGFnaW5hdGlvbj86IFBhZ2luYXRpb247XG4gICAgY3JpdGVyaWE/OiBTZWFyY2hDcml0ZXJpYTtcbiAgICBzb3J0PzogU29ydGluZ1NlbGVjdGlvbjtcbiAgICBzZWxlY3Rpb246IFJlY29yZFNlbGVjdGlvbjtcbiAgICBsb2FkaW5nOiBib29sZWFuO1xufVxuXG5jb25zdCBpbml0aWFsU3RhdGU6IFJlY29yZExpc3RTdGF0ZSA9IHtcbiAgICBtb2R1bGU6ICcnLFxuICAgIHJlY29yZHM6IFtdLFxuICAgIGNyaXRlcmlhOiBkZWVwQ2xvbmUoaW5pdGlhbFNlYXJjaENyaXRlcmlhKSxcbiAgICBzb3J0OiBkZWVwQ2xvbmUoaW5pdGlhbExpc3RTb3J0KSxcbiAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgIHBhZ2VTaXplOiA1LFxuICAgICAgICBjdXJyZW50OiAwLFxuICAgICAgICBwcmV2aW91czogMCxcbiAgICAgICAgbmV4dDogNSxcbiAgICAgICAgbGFzdDogMCxcbiAgICAgICAgdG90YWw6IDAsXG4gICAgICAgIHBhZ2VGaXJzdDogMCxcbiAgICAgICAgcGFnZUxhc3Q6IDBcbiAgICB9LFxuICAgIHNlbGVjdGlvbjogZGVlcENsb25lKGluaXRpYWxTZWxlY3Rpb24pLFxuICAgIGxvYWRpbmc6IGZhbHNlLFxufTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJlY29yZExpc3RTdG9yZSBpbXBsZW1lbnRzIFN0YXRlU3RvcmUsIERhdGFTb3VyY2U8UmVjb3JkPiwgU2VsZWN0aW9uRGF0YVNvdXJjZSwgUGFnaW5hdGlvbkRhdGFTb3VyY2Uge1xuXG4gICAgLyoqXG4gICAgICogUHVibGljIGxvbmctbGl2ZWQgb2JzZXJ2YWJsZSBzdHJlYW1zXG4gICAgICovXG4gICAgcmVjb3JkcyQ6IE9ic2VydmFibGU8UmVjb3JkW10+O1xuICAgIGNyaXRlcmlhJDogT2JzZXJ2YWJsZTxTZWFyY2hDcml0ZXJpYT47XG4gICAgc29ydCQ6IE9ic2VydmFibGU8U29ydGluZ1NlbGVjdGlvbj47XG4gICAgcGFnaW5hdGlvbiQ6IE9ic2VydmFibGU8UGFnaW5hdGlvbj47XG4gICAgc2VsZWN0aW9uJDogT2JzZXJ2YWJsZTxSZWNvcmRTZWxlY3Rpb24+O1xuICAgIHNlbGVjdGVkQ291bnQkOiBPYnNlcnZhYmxlPG51bWJlcj47XG4gICAgc2VsZWN0ZWRTdGF0dXMkOiBPYnNlcnZhYmxlPFNlbGVjdGlvblN0YXR1cz47XG4gICAgbG9hZGluZyQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG5cbiAgICAvKiogSW50ZXJuYWwgUHJvcGVydGllcyAqL1xuICAgIHByb3RlY3RlZCBjYWNoZSQ6IE9ic2VydmFibGU8YW55PiA9IG51bGw7XG4gICAgcHJvdGVjdGVkIGludGVybmFsU3RhdGU6IFJlY29yZExpc3RTdGF0ZSA9IGRlZXBDbG9uZShpbml0aWFsU3RhdGUpO1xuICAgIHByb3RlY3RlZCBzdG9yZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UmVjb3JkTGlzdFN0YXRlPih0aGlzLmludGVybmFsU3RhdGUpO1xuICAgIHByb3RlY3RlZCBzdGF0ZSQgPSB0aGlzLnN0b3JlLmFzT2JzZXJ2YWJsZSgpO1xuICAgIHByb3RlY3RlZCBwcmVmZXJlbmNlc1N1YjogU3Vic2NyaXB0aW9uO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBsaXN0R1FMOiBMaXN0R1FMLFxuICAgICAgICBwcm90ZWN0ZWQgY29uZmlnU3RvcmU6IFN5c3RlbUNvbmZpZ1N0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgcHJlZmVyZW5jZXNTdG9yZTogVXNlclByZWZlcmVuY2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIGFwcFN0YXRlU3RvcmU6IEFwcFN0YXRlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBsYW5ndWFnZVN0b3JlOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbWVzc2FnZTogTWVzc2FnZVNlcnZpY2UsXG4gICAgKSB7XG4gICAgICAgIHRoaXMucmVjb3JkcyQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5yZWNvcmRzKSwgZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG4gICAgICAgIHRoaXMuY3JpdGVyaWEkID0gdGhpcy5zdGF0ZSQucGlwZShtYXAoc3RhdGUgPT4gc3RhdGUuY3JpdGVyaWEpLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcbiAgICAgICAgdGhpcy5zb3J0JCA9IHRoaXMuc3RhdGUkLnBpcGUobWFwKHN0YXRlID0+IHN0YXRlLnNvcnQpLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcbiAgICAgICAgdGhpcy5wYWdpbmF0aW9uJCA9IHRoaXMuc3RhdGUkLnBpcGUobWFwKHN0YXRlID0+IHN0YXRlLnBhZ2luYXRpb24pLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb24kID0gdGhpcy5zdGF0ZSQucGlwZShtYXAoc3RhdGUgPT4gc3RhdGUuc2VsZWN0aW9uKSwgZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRDb3VudCQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5zZWxlY3Rpb24uY291bnQpLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFN0YXR1cyQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5zZWxlY3Rpb24uc3RhdHVzKSwgZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG4gICAgICAgIHRoaXMubG9hZGluZyQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5sb2FkaW5nKSk7XG4gICAgfVxuXG4gICAgY29ubmVjdCgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWNvcmRzJDtcbiAgICB9XG5cbiAgICBkaXNjb25uZWN0KCk6IHZvaWQge1xuICAgIH1cblxuICAgIGdldCBjcml0ZXJpYSgpOiBTZWFyY2hDcml0ZXJpYSB7XG4gICAgICAgIGlmICghdGhpcy5pbnRlcm5hbFN0YXRlLmNyaXRlcmlhKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVlcENsb25lKGluaXRpYWxTZWFyY2hDcml0ZXJpYSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVlcENsb25lKHRoaXMuaW50ZXJuYWxTdGF0ZS5jcml0ZXJpYSk7XG4gICAgfVxuXG4gICAgc2V0IGNyaXRlcmlhKGNyaXRlcmlhOiBTZWFyY2hDcml0ZXJpYSkge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHtcbiAgICAgICAgICAgIC4uLnRoaXMuaW50ZXJuYWxTdGF0ZSxcbiAgICAgICAgICAgIGNyaXRlcmlhXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBzb3J0KCk6IFNvcnRpbmdTZWxlY3Rpb24ge1xuICAgICAgICBpZiAoIXRoaXMuaW50ZXJuYWxTdGF0ZS5zb3J0KSB7XG4gICAgICAgICAgICByZXR1cm4gZGVlcENsb25lKGluaXRpYWxMaXN0U29ydCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVlcENsb25lKHRoaXMuaW50ZXJuYWxTdGF0ZS5zb3J0KTtcbiAgICB9XG5cbiAgICBzZXQgc29ydChzb3J0OiBTb3J0aW5nU2VsZWN0aW9uKSB7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoe1xuICAgICAgICAgICAgLi4udGhpcy5pbnRlcm5hbFN0YXRlLFxuICAgICAgICAgICAgc29ydFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXQgc2VsZWN0aW9uKCk6IFJlY29yZFNlbGVjdGlvbiB7XG4gICAgICAgIGlmICghdGhpcy5pbnRlcm5hbFN0YXRlLnNlbGVjdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGRlZXBDbG9uZShpbml0aWFsU2VsZWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWVwQ2xvbmUodGhpcy5pbnRlcm5hbFN0YXRlLnNlbGVjdGlvbik7XG4gICAgfVxuXG4gICAgZ2V0IHJlY29yZHMoKTogUmVjb3JkW10ge1xuICAgICAgICBpZiAoIXRoaXMuaW50ZXJuYWxTdGF0ZS5yZWNvcmRzKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN0YXRlLnJlY29yZHM7XG4gICAgfVxuXG4gICAgZ2V0TW9kdWxlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsU3RhdGUubW9kdWxlO1xuICAgIH1cblxuICAgIGdldFJlY29yZChpZDogc3RyaW5nKTogUmVjb3JkIHtcbiAgICAgICAgbGV0IHJlY29yZDogUmVjb3JkID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZWNvcmRzLnNvbWUoaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZWNvcmQgPSBpdGVtO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFuIGRlc3Ryb3lcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWwgbGlzdCByZWNvcmRzIGxvYWQgaWYgbm90IGNhY2hlZCBhbmQgdXBkYXRlIHN0YXRlLlxuICAgICAqIFJldHVybnMgb2JzZXJ2YWJsZSB0byBiZSB1c2VkIGluIHJlc29sdmVyIGlmIG5lZWRlZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZHVsZSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGxvYWQgaWYgdG8gbG9hZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYWdlU2l6ZUNvbmZpZ0tleSBzdHJpbmdcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBPYnNlcnZhYmxlPGFueT5cbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdChtb2R1bGU6IHN0cmluZywgbG9hZCA9IHRydWUsIHBhZ2VTaXplQ29uZmlnS2V5ID0gJ2xpc3RfbWF4X2VudHJpZXNfcGVyX3BhZ2UnKTogT2JzZXJ2YWJsZTxSZWNvcmRMaXN0PiB7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxTdGF0ZS5tb2R1bGUgPSBtb2R1bGU7XG5cbiAgICAgICAgdGhpcy53YXRjaFBhZ2VTaXplKHBhZ2VTaXplQ29uZmlnS2V5KTtcblxuICAgICAgICBpZiAobG9hZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZCgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogTG9hZCAvIHJlbG9hZCByZWNvcmRzIHVzaW5nIGN1cnJlbnQgcGFnaW5hdGlvbiBhbmQgY3JpdGVyaWFcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdXNlQ2FjaGUgaWYgdG8gdXNlIGNhY2hlXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxMaXN0Vmlld1N0YXRlPlxuICAgICAqL1xuICAgIHB1YmxpYyBsb2FkKHVzZUNhY2hlID0gdHJ1ZSk6IE9ic2VydmFibGU8UmVjb3JkTGlzdD4ge1xuXG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoe1xuICAgICAgICAgICAgLi4udGhpcy5pbnRlcm5hbFN0YXRlLFxuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5nZXRSZWNvcmRzKFxuICAgICAgICAgICAgdGhpcy5pbnRlcm5hbFN0YXRlLm1vZHVsZSxcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuYWxTdGF0ZS5jcml0ZXJpYSxcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuYWxTdGF0ZS5zb3J0LFxuICAgICAgICAgICAgdGhpcy5pbnRlcm5hbFN0YXRlLnBhZ2luYXRpb24sXG4gICAgICAgICAgICB1c2VDYWNoZVxuICAgICAgICApLnBpcGUoXG4gICAgICAgICAgICBjYXRjaEVycm9yKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UuYWRkRGFuZ2VyTWVzc2FnZUJ5S2V5KCdMQkxfR0VUX1JFQ09SRF9MSVNUX0VSUk9SJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mKHtcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkczogW10sXG4gICAgICAgICAgICAgICAgICAgIGNyaXRlcmlhOiBkZWVwQ2xvbmUoaW5pdGlhbFNlYXJjaENyaXRlcmlhKSxcbiAgICAgICAgICAgICAgICAgICAgc29ydDogZGVlcENsb25lKGluaXRpYWxMaXN0U29ydCksXG4gICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VTaXplOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZpb3VzOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dDogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Q6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VGaXJzdDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VMYXN0OiAwXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbjogZGVlcENsb25lKGluaXRpYWxTZWxlY3Rpb24pLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB0YXAoXG4gICAgICAgICAgICAgICAgKGRhdGE6IFJlY29yZExpc3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVQYWdlQ291bnQoZGF0YS5yZWNvcmRzLCBkYXRhLnBhZ2luYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuaW50ZXJuYWxTdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZHM6IGRhdGEucmVjb3JkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2luYXRpb246IGRhdGEucGFnaW5hdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBzZWFyY2ggY3JpdGVyaWFcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjcml0ZXJpYSB0byBzZXRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJlbG9hZCBmbGFnXG4gICAgICovXG4gICAgcHVibGljIHVwZGF0ZVNlYXJjaENyaXRlcmlhKGNyaXRlcmlhOiBTZWFyY2hDcml0ZXJpYSwgcmVsb2FkID0gdHJ1ZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHsuLi50aGlzLmludGVybmFsU3RhdGUsIGNyaXRlcmlhfSk7XG5cbiAgICAgICAgaWYgKHJlbG9hZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTZWxlY3Rpb24oU2VsZWN0aW9uU3RhdHVzLk5PTkUpO1xuICAgICAgICAgICAgLy8gUmVzZXQgcGFnaW5hdGlvbiB0byBkZWZhdWx0IGZpcnN0IHBhZ2VcbiAgICAgICAgICAgIHRoaXMucmVzZXRQYWdpbmF0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldCBzZWFyY2ggY3JpdGVyaWFcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJlbG9hZCBmbGFnXG4gICAgICovXG4gICAgcHVibGljIHJlc2V0U2VhcmNoQ3JpdGVyaWEocmVsb2FkID0gdHJ1ZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZVNlYXJjaENyaXRlcmlhKGRlZXBDbG9uZShpbml0aWFsU2VhcmNoQ3JpdGVyaWEpLCByZWxvYWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSBjdXJyZW50IGxpc3QgdmlldyBzb3J0aW5nXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3JkZXJCeSB0byBzZXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc29ydE9yZGVyIHRvIHNldFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVsb2FkIGZsYWdcbiAgICAgKi9cbiAgICB1cGRhdGVTb3J0aW5nKG9yZGVyQnk6IHN0cmluZywgc29ydE9yZGVyOiBTb3J0RGlyZWN0aW9uLCByZWxvYWQgPSB0cnVlKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKHNvcnRPcmRlciA9PT0gU29ydERpcmVjdGlvbi5OT05FKSB7XG4gICAgICAgICAgICBvcmRlckJ5ID0gJyc7XG4gICAgICAgICAgICBzb3J0T3JkZXIgPSBTb3J0RGlyZWN0aW9uLkRFU0M7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzb3J0ID0ge29yZGVyQnksIHNvcnRPcmRlcn0gYXMgU29ydGluZ1NlbGVjdGlvbjtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHsuLi50aGlzLmludGVybmFsU3RhdGUsIHNvcnR9KTtcblxuICAgICAgICBpZiAocmVsb2FkKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWQoZmFsc2UpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNYXAgc29ydCBvcmRlciB0byBTb3J0RGlyZWN0aW9uIGVudW1cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc29ydE9yZGVyIHRvIG1hcFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFNvcnREaXJlY3Rpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgbWFwU29ydE9yZGVyKHNvcnRPcmRlcjogc3RyaW5nKTogU29ydERpcmVjdGlvbiB7XG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSBTb3J0RGlyZWN0aW9uLk5PTkU7XG4gICAgICAgIGNvbnN0IHNvcnQgPSBzb3J0T3JkZXIudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBpZiAoc29ydCA9PT0gJ2FzYycpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IFNvcnREaXJlY3Rpb24uQVNDXG4gICAgICAgIH0gZWxzZSBpZiAoc29ydCA9PT0gJ2Rlc2MnKSB7XG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBTb3J0RGlyZWN0aW9uLkRFU0NcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkaXJlY3Rpb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBwYWdpbmF0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY3VycmVudCB0byBzZXRcbiAgICAgKi9cbiAgICBwdWJsaWMgdXBkYXRlUGFnaW5hdGlvbihjdXJyZW50OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcGFnaW5hdGlvbiA9IHsuLi50aGlzLmludGVybmFsU3RhdGUucGFnaW5hdGlvbiwgY3VycmVudH07XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoey4uLnRoaXMuaW50ZXJuYWxTdGF0ZSwgcGFnaW5hdGlvbn0pO1xuXG4gICAgICAgIHRoaXMubG9hZChmYWxzZSkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldC9DbGVhciB0aGUgcGFnaW5hdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyByZXNldFBhZ2luYXRpb24oKTogdm9pZCB7XG4gICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhciBvYnNlcnZhYmxlIGNhY2hlXG4gICAgICovXG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNhY2hlJCA9IG51bGw7XG4gICAgICAgIHRoaXMuc3RvcmUudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy5wcmVmZXJlbmNlc1N1Yi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhckF1dGhCYXNlZCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbGVjdGlvbiBwdWJsaWMgYXBpXG4gICAgICovXG5cbiAgICBnZXRTZWxlY3Rpb25TdGF0dXMoKTogT2JzZXJ2YWJsZTxTZWxlY3Rpb25TdGF0dXM+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRTdGF0dXMkO1xuICAgIH1cblxuICAgIGdldFNlbGVjdGVkQ291bnQoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRDb3VudCQ7XG4gICAgfVxuXG4gICAgdXBkYXRlU2VsZWN0aW9uKHN0YXRlOiBTZWxlY3Rpb25TdGF0dXMpOiB2b2lkIHtcbiAgICAgICAgaWYgKHN0YXRlID09PSBTZWxlY3Rpb25TdGF0dXMuTk9ORSkge1xuICAgICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXRlID09PSBTZWxlY3Rpb25TdGF0dXMuQUxMKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdEFsbCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXRlID09PSBTZWxlY3Rpb25TdGF0dXMuUEFHRSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RQYWdlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhclNlbGVjdGlvbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSh7XG4gICAgICAgICAgICAuLi50aGlzLmludGVybmFsU3RhdGUsXG4gICAgICAgICAgICBzZWxlY3Rpb246IGRlZXBDbG9uZShpbml0aWFsU2VsZWN0aW9uKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzZWxlY3RBbGwoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHRvdGFsID0gdGhpcy5pbnRlcm5hbFN0YXRlLnBhZ2luYXRpb24udG90YWw7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoe1xuICAgICAgICAgICAgLi4udGhpcy5pbnRlcm5hbFN0YXRlLFxuICAgICAgICAgICAgc2VsZWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgYWxsOiB0cnVlLFxuICAgICAgICAgICAgICAgIHN0YXR1czogU2VsZWN0aW9uU3RhdHVzLkFMTCxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZDoge30sXG4gICAgICAgICAgICAgICAgY291bnQ6IHRvdGFsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNlbGVjdFBhZ2UoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gey4uLnRoaXMuaW50ZXJuYWxTdGF0ZS5zZWxlY3Rpb24uc2VsZWN0ZWR9O1xuXG4gICAgICAgIGlmICh0aGlzLmludGVybmFsU3RhdGUucmVjb3JkcyAmJiB0aGlzLmludGVybmFsU3RhdGUucmVjb3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuYWxTdGF0ZS5yZWNvcmRzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5pZCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFt2YWx1ZS5pZF0gPSB2YWx1ZS5pZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoe1xuICAgICAgICAgICAgLi4udGhpcy5pbnRlcm5hbFN0YXRlLFxuICAgICAgICAgICAgc2VsZWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgYWxsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IFNlbGVjdGlvblN0YXR1cy5TT01FLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkLFxuICAgICAgICAgICAgICAgIGNvdW50OiBPYmplY3Qua2V5cyhzZWxlY3RlZCkubGVuZ3RoXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRvZ2dsZVNlbGVjdGlvbihpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IGRlZXBDbG9uZSh0aGlzLmludGVybmFsU3RhdGUuc2VsZWN0aW9uKTtcblxuICAgICAgICBpZiAoc2VsZWN0aW9uLnNlbGVjdGVkW2lkXSkge1xuICAgICAgICAgICAgZGVsZXRlIHNlbGVjdGlvbi5zZWxlY3RlZFtpZF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxlY3Rpb24uc2VsZWN0ZWRbaWRdID0gaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxlY3Rpb24uY291bnQgPSBPYmplY3Qua2V5cyhzZWxlY3Rpb24uc2VsZWN0ZWQpLmxlbmd0aDtcblxuICAgICAgICBpZiAoc2VsZWN0aW9uLmNvdW50ID09PSAwKSB7XG4gICAgICAgICAgICBzZWxlY3Rpb24uc3RhdHVzID0gU2VsZWN0aW9uU3RhdHVzLk5PTkU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxlY3Rpb24uc3RhdHVzID0gU2VsZWN0aW9uU3RhdHVzLlNPTUU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHtcbiAgICAgICAgICAgIC4uLnRoaXMuaW50ZXJuYWxTdGF0ZSxcbiAgICAgICAgICAgIHNlbGVjdGlvblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYWdpbmF0aW9uIFB1YmxpYyBBUElcbiAgICAgKi9cblxuICAgIGdldFBhZ2luYXRpb25Db3VudCgpOiBPYnNlcnZhYmxlPFBhZ2luYXRpb25Db3VudD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wYWdpbmF0aW9uJC5waXBlKG1hcChwYWdpbmF0aW9uID0+ICh7XG4gICAgICAgICAgICBwYWdlRmlyc3Q6IHBhZ2luYXRpb24ucGFnZUZpcnN0LFxuICAgICAgICAgICAgcGFnZUxhc3Q6IHBhZ2luYXRpb24ucGFnZUxhc3QsXG4gICAgICAgICAgICB0b3RhbDogcGFnaW5hdGlvbi50b3RhbFxuICAgICAgICB9IGFzIFBhZ2luYXRpb25Db3VudCkpLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcbiAgICB9XG5cbiAgICBnZXRQYWdpbmF0aW9uKCk6IFBhZ2luYXRpb24ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS52YWx1ZS5wYWdpbmF0aW9uO1xuICAgIH1cblxuICAgIGNoYW5nZVBhZ2UocGFnZTogUGFnZVNlbGVjdGlvbik6IHZvaWQge1xuICAgICAgICBsZXQgcGFnZVRvTG9hZCA9IDA7XG5cbiAgICAgICAgY29uc3QgcGFnZU1hcCA9IHt9O1xuICAgICAgICBwYWdlTWFwW1BhZ2VTZWxlY3Rpb24uRklSU1RdID0gMDtcbiAgICAgICAgcGFnZU1hcFtQYWdlU2VsZWN0aW9uLlBSRVZJT1VTXSA9IHRoaXMuaW50ZXJuYWxTdGF0ZS5wYWdpbmF0aW9uLnByZXZpb3VzO1xuICAgICAgICBwYWdlTWFwW1BhZ2VTZWxlY3Rpb24uTkVYVF0gPSB0aGlzLmludGVybmFsU3RhdGUucGFnaW5hdGlvbi5uZXh0O1xuICAgICAgICBwYWdlTWFwW1BhZ2VTZWxlY3Rpb24uTEFTVF0gPSB0aGlzLmludGVybmFsU3RhdGUucGFnaW5hdGlvbi5sYXN0O1xuXG4gICAgICAgIGlmIChwYWdlIGluIHBhZ2VNYXAgJiYgcGFnZU1hcFtwYWdlXSA+PSAwKSB7XG4gICAgICAgICAgICBwYWdlVG9Mb2FkID0gcGFnZU1hcFtwYWdlXTtcblxuICAgICAgICAgICAgaWYgKHBhZ2VUb0xvYWQgPiB0aGlzLmludGVybmFsU3RhdGUucGFnaW5hdGlvbi5sYXN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGFnZVRvTG9hZCA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbihwYWdlVG9Mb2FkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBQYWdpbmF0aW9uIHBhZ2Ugc2l6ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhZ2VTaXplIHRvIHNldFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRQYWdlU2l6ZShwYWdlU2l6ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHBhZ2luYXRpb24gPSB7Li4udGhpcy5pbnRlcm5hbFN0YXRlLnBhZ2luYXRpb24sIHBhZ2VTaXplfTtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSh7Li4udGhpcy5pbnRlcm5hbFN0YXRlLCBwYWdpbmF0aW9ufSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgQVBJXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBTdWJzY3JpYmUgdG8gcGFnZSBzaXplIGNoYW5nZXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYWdlU2l6ZUNvbmZpZ0tleSBrZXlcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgd2F0Y2hQYWdlU2l6ZShwYWdlU2l6ZUNvbmZpZ0tleTogc3RyaW5nKTogdm9pZCB7XG5cbiAgICAgICAgY29uc3QgcGFnZVNpemVQcmVmZXJlbmNlID0gdGhpcy5wcmVmZXJlbmNlc1N0b3JlLmdldFVzZXJQcmVmZXJlbmNlKHBhZ2VTaXplQ29uZmlnS2V5KTtcbiAgICAgICAgY29uc3QgcGFnZVNpemVDb25maWcgPSB0aGlzLmNvbmZpZ1N0b3JlLmdldENvbmZpZ1ZhbHVlKHBhZ2VTaXplQ29uZmlnS2V5KTtcbiAgICAgICAgdGhpcy5kZXRlcm1pbmVQYWdlU2l6ZShwYWdlU2l6ZVByZWZlcmVuY2UsIHBhZ2VTaXplQ29uZmlnKTtcblxuICAgICAgICB0aGlzLnByZWZlcmVuY2VzU3ViID0gY29tYmluZUxhdGVzdChbdGhpcy5jb25maWdTdG9yZS5jb25maWdzJCwgdGhpcy5wcmVmZXJlbmNlc1N0b3JlLnVzZXJQcmVmZXJlbmNlcyRdKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgdGFwKChbY29uZmlncywgcHJlZmVyZW5jZXNdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHBhZ2VTaXplQ29uZmlnS2V5O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaXplUHJlZmVyZW5jZSA9IChwcmVmZXJlbmNlcyAmJiBwcmVmZXJlbmNlc1trZXldKSB8fCBudWxsO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaXplQ29uZmlnID0gKGNvbmZpZ3MgJiYgY29uZmlnc1trZXldICYmIGNvbmZpZ3Nba2V5XS52YWx1ZSkgfHwgbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRldGVybWluZVBhZ2VTaXplKHNpemVQcmVmZXJlbmNlLCBzaXplQ29uZmlnKTtcblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApLnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERldGVybWluZSBwYWdlIHNpemUgdG8gdXNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge30gcGFnZVNpemVQcmVmZXJlbmNlIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYWdlU2l6ZUNvbmZpZyB0byB1c2VcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZGV0ZXJtaW5lUGFnZVNpemUocGFnZVNpemVQcmVmZXJlbmNlOiBhbnksIHBhZ2VTaXplQ29uZmlnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgbGV0IHNpemUgPSAwO1xuXG4gICAgICAgIGlmIChwYWdlU2l6ZVByZWZlcmVuY2UpIHtcbiAgICAgICAgICAgIHNpemUgPSBwYWdlU2l6ZVByZWZlcmVuY2U7XG4gICAgICAgIH0gZWxzZSBpZiAocGFnZVNpemVDb25maWcpIHtcbiAgICAgICAgICAgIHNpemUgPSBwYXJzZUludChwYWdlU2l6ZUNvbmZpZywgMTApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRQYWdlU2l6ZShzaXplKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIHN0YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc3RhdGUgdG8gc2V0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVN0YXRlKHN0YXRlOiBSZWNvcmRMaXN0U3RhdGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdG9yZS5uZXh0KHRoaXMuaW50ZXJuYWxTdGF0ZSA9IHN0YXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGUgcGFnZSBjb3VudFxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlY29yZHMgbGlzdFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYWdpbmF0aW9uIGluZm9cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgY2FsY3VsYXRlUGFnZUNvdW50KHJlY29yZHM6IFJlY29yZFtdLCBwYWdpbmF0aW9uOiBQYWdpbmF0aW9uKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJlY29yZENvdW50ID0gKHJlY29yZHMgJiYgcmVjb3Jkcy5sZW5ndGgpIHx8IDA7XG4gICAgICAgIGxldCBwYWdlRmlyc3QgPSAwO1xuICAgICAgICBsZXQgcGFnZUxhc3QgPSAwO1xuXG4gICAgICAgIGlmIChyZWNvcmRDb3VudCA+IDApIHtcbiAgICAgICAgICAgIHBhZ2VGaXJzdCA9IHBhZ2luYXRpb24uY3VycmVudCArIDE7XG4gICAgICAgICAgICBwYWdlTGFzdCA9IHBhZ2luYXRpb24uY3VycmVudCArIHJlY29yZENvdW50O1xuICAgICAgICB9XG4gICAgICAgIHBhZ2luYXRpb24ucGFnZUZpcnN0ID0gcGFnZUZpcnN0O1xuICAgICAgICBwYWdpbmF0aW9uLnBhZ2VMYXN0ID0gcGFnZUxhc3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJlY29yZHMgY2FjaGVkIE9ic2VydmFibGUgb3IgY2FsbCB0aGUgYmFja2VuZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZHVsZSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gY3JpdGVyaWEgdG8gdXNlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHNvcnQgdG8gdXNlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhZ2luYXRpb24gdG8gdXNlXG4gICAgICogQHBhcmFtIHtib29sZWFufSB1c2VDYWNoZSBpZiB0byB1c2UgY2FjaGVcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBPYnNlcnZhYmxlPGFueT5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0UmVjb3JkcyhcbiAgICAgICAgbW9kdWxlOiBzdHJpbmcsXG4gICAgICAgIGNyaXRlcmlhOiBTZWFyY2hDcml0ZXJpYSxcbiAgICAgICAgc29ydDogU29ydGluZ1NlbGVjdGlvbixcbiAgICAgICAgcGFnaW5hdGlvbjogUGFnaW5hdGlvbixcbiAgICAgICAgdXNlQ2FjaGUgPSB0cnVlXG4gICAgKTogT2JzZXJ2YWJsZTxSZWNvcmRMaXN0PiB7XG5cbiAgICAgICAgaWYgKHRoaXMuY2FjaGUkID09IG51bGwgfHwgdXNlQ2FjaGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlJCA9IHRoaXMubGlzdEdRTC5nZXQobW9kdWxlLCBjcml0ZXJpYSwgc29ydCwgcGFnaW5hdGlvbikucGlwZShcbiAgICAgICAgICAgICAgICBzaGFyZVJlcGxheSgxKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZSQ7XG4gICAgfVxufVxuIl19