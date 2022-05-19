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
import { PageSelection, Pagination, PaginationCount, PaginationDataSource, Record, RecordSelection, SearchCriteria, SelectionDataSource, SelectionStatus, SortDirection, SortingSelection } from 'common';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { StateStore } from '../state';
import { AppStateStore } from '../app-state/app-state.store';
import { DataSource } from '@angular/cdk/table';
import { ListGQL } from './graphql/api.list.get';
import { SystemConfigStore } from '../system-config/system-config.store';
import { UserPreferenceStore } from '../user-preference/user-preference.store';
import { LanguageStore } from '../language/language.store';
import { MessageService } from '../../services/message/message.service';
import * as ɵngcc0 from '@angular/core';
export interface RecordList {
    records: Record[];
    pagination?: Pagination;
    criteria?: SearchCriteria;
    sort?: SortingSelection;
}
export interface RecordListState {
    module: string;
    records: Record[];
    pagination?: Pagination;
    criteria?: SearchCriteria;
    sort?: SortingSelection;
    selection: RecordSelection;
    loading: boolean;
}
export declare class RecordListStore implements StateStore, DataSource<Record>, SelectionDataSource, PaginationDataSource {
    protected listGQL: ListGQL;
    protected configStore: SystemConfigStore;
    protected preferencesStore: UserPreferenceStore;
    protected appStateStore: AppStateStore;
    protected languageStore: LanguageStore;
    protected message: MessageService;
    /**
     * Public long-lived observable streams
     */
    records$: Observable<Record[]>;
    criteria$: Observable<SearchCriteria>;
    sort$: Observable<SortingSelection>;
    pagination$: Observable<Pagination>;
    selection$: Observable<RecordSelection>;
    selectedCount$: Observable<number>;
    selectedStatus$: Observable<SelectionStatus>;
    loading$: Observable<boolean>;
    /** Internal Properties */
    protected cache$: Observable<any>;
    protected internalState: RecordListState;
    protected store: BehaviorSubject<RecordListState>;
    protected state$: Observable<RecordListState>;
    protected preferencesSub: Subscription;
    constructor(listGQL: ListGQL, configStore: SystemConfigStore, preferencesStore: UserPreferenceStore, appStateStore: AppStateStore, languageStore: LanguageStore, message: MessageService);
    connect(): Observable<any>;
    disconnect(): void;
    get criteria(): SearchCriteria;
    set criteria(criteria: SearchCriteria);
    get sort(): SortingSelection;
    set sort(sort: SortingSelection);
    get selection(): RecordSelection;
    get records(): Record[];
    getModule(): string;
    getRecord(id: string): Record;
    /**
     * Clean destroy
     */
    destroy(): void;
    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @param {boolean} load if to load
     * @param {string} pageSizeConfigKey string
     * @returns {object} Observable<any>
     */
    init(module: string, load?: boolean, pageSizeConfigKey?: string): Observable<RecordList>;
    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<ListViewState>
     */
    load(useCache?: boolean): Observable<RecordList>;
    /**
     * Update the search criteria
     *
     * @param {object} criteria to set
     * @param {boolean} reload flag
     */
    updateSearchCriteria(criteria: SearchCriteria, reload?: boolean): void;
    /**
     * Reset search criteria
     * @param {boolean} reload flag
     */
    resetSearchCriteria(reload?: boolean): void;
    /**
     * Update current list view sorting
     *
     * @param {string} orderBy to set
     * @param {string} sortOrder to set
     * @param {boolean} reload flag
     */
    updateSorting(orderBy: string, sortOrder: SortDirection, reload?: boolean): void;
    /**
     * Map sort order to SortDirection enum
     * @param {string} sortOrder to map
     * @returns {string} SortDirection
     */
    mapSortOrder(sortOrder: string): SortDirection;
    /**
     * Update the pagination
     *
     * @param {number} current to set
     */
    updatePagination(current: number): void;
    /**
     * Reset/Clear the pagination
     */
    resetPagination(): void;
    /**
     * Clear observable cache
     */
    clear(): void;
    clearAuthBased(): void;
    /**
     * Selection public api
     */
    getSelectionStatus(): Observable<SelectionStatus>;
    getSelectedCount(): Observable<number>;
    updateSelection(state: SelectionStatus): void;
    clearSelection(): void;
    selectAll(): void;
    selectPage(): void;
    toggleSelection(id: string): void;
    /**
     * Pagination Public API
     */
    getPaginationCount(): Observable<PaginationCount>;
    getPagination(): Pagination;
    changePage(page: PageSelection): void;
    /**
     * Set Pagination page size
     *
     * @param {number} pageSize to set
     */
    setPageSize(pageSize: number): void;
    /**
     * Internal API
     */
    /**
     * Subscribe to page size changes
     *
     * @param {string} pageSizeConfigKey key
     */
    protected watchPageSize(pageSizeConfigKey: string): void;
    /**
     * Determine page size to use
     *
     * @param {} pageSizePreference to use
     * @param {string} pageSizeConfig to use
     */
    protected determinePageSize(pageSizePreference: any, pageSizeConfig: string): void;
    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: RecordListState): void;
    /**
     * Calculate page count
     *
     * @param {object} records list
     * @param {object} pagination info
     */
    protected calculatePageCount(records: Record[], pagination: Pagination): void;
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
    protected getRecords(module: string, criteria: SearchCriteria, sort: SortingSelection, pagination: Pagination, useCache?: boolean): Observable<RecordList>;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<RecordListStore, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<RecordListStore>;
}

//# sourceMappingURL=record-list.store.d.ts.map