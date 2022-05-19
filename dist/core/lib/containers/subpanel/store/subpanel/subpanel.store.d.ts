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
import { StateStore } from '../../../../store/state';
import { RecordList, RecordListStore } from '../../../../store/record-list/record-list.store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { RecordListStoreFactory } from '../../../../store/record-list/record-list.store.factory';
import { LanguageStore } from '../../../../store/language/language.store';
import { SubPanelDefinition } from 'common';
import { Statistic, StatisticsMap, StatisticsQuery, StatisticsQueryMap } from 'common';
import { SingleValueStatisticsStore } from '../../../../store/single-value-statistics/single-value-statistics.store';
import { SingleValueStatisticsStoreFactory } from '../../../../store/single-value-statistics/single-value-statistics.store.factory';
import { StatisticWidgetOptions } from 'common';
import { Record } from 'common';
import * as ɵngcc0 from '@angular/core';
export interface SubpanelStoreMap {
    [key: string]: SubpanelStore;
}
export interface SingleValueStatisticsStoreMap {
    [key: string]: SingleValueStatisticsStore;
}
export declare class SubpanelStore implements StateStore {
    protected listStoreFactory: RecordListStoreFactory;
    protected languageStore: LanguageStore;
    protected statisticsStoreFactory: SingleValueStatisticsStoreFactory;
    show: boolean;
    parentModule: string;
    parentId: string;
    parentRecord$: Observable<Record>;
    parentRecord: Record;
    recordList: RecordListStore;
    statistics: SingleValueStatisticsStoreMap;
    metadata$: Observable<SubPanelDefinition>;
    metadata: SubPanelDefinition;
    loading$: Observable<boolean>;
    protected metadataState: BehaviorSubject<SubPanelDefinition>;
    protected subs: Subscription[];
    constructor(listStoreFactory: RecordListStoreFactory, languageStore: LanguageStore, statisticsStoreFactory: SingleValueStatisticsStoreFactory);
    getTitle(): string;
    getIcon(): string;
    clear(): void;
    clearAuthBased(): void;
    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} parentModule name
     * @param {string} parentId id
     * @param {object} meta to use
     * @param {object} parentRecord$ to use
     */
    init(parentModule: string, parentId: string, meta: SubPanelDefinition, parentRecord$?: Observable<Record>): void;
    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<RecordList>
     */
    load(useCache?: boolean): Observable<RecordList>;
    /**
     * Get statistic store
     *
     * @param {string} key key of statistic
     * @returns {object} SingleValueStatisticsStore
     */
    getStatistic(key: string): SingleValueStatisticsStore;
    /**
     * Load / reload statistics
     *
     * @param {string} key of statistic
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<Statistic>
     */
    loadStatistics(key: string, useCache?: boolean): Observable<Statistic>;
    /**
     * Load / reload all statistics
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<Statistic>
     */
    loadAllStatistics(useCache?: boolean): Observable<StatisticsMap>;
    /**
     * Should batch statistic
     *
     * @returns {boolean} shouldBatch
     */
    shouldBatchStatistic(): boolean;
    /**
     * Set loading
     *
     * @param {string} key of statistic
     * @param {boolean} loading bool
     */
    setStatisticsLoading(key: string, loading: boolean): void;
    /**
     * Set all statistics loading
     *
     * @param {boolean} loading bool
     */
    setAllStatisticsLoading(loading: boolean): void;
    /**
     * Set Statistic value
     *
     * @param {string} key of statistic
     * @param {object} statistic Statistic
     * @param {boolean} cache bool
     */
    setStatistics(key: string, statistic: Statistic, cache?: boolean): void;
    /**
     * Get statistic query
     *
     * @param {string} key of statistic
     * @returns {object} StatisticsQuery
     */
    getStatisticQuery(key: string): StatisticsQuery;
    /**
     * Get all statistics queries
     *
     * @returns {object} StatisticsQuery
     */
    getAllStatisticQuery(): StatisticsQueryMap;
    /**
     * Get widget layout
     *
     * @returns {any} any
     */
    getWidgetLayout(): StatisticWidgetOptions;
    /**
     * Init search criteria
     *
     * @param {string} parentModule name
     * @param {string} parentId id
     * @param {string} subpanel name
     */
    protected initSearchCriteria(parentModule: string, parentId: string, subpanel: string): void;
    /**
     * Init statistics store
     *
     * @param {object} meta for subpanel
     * @param {string} parentModule name
     * @param {string} parentId {id}
     */
    protected initStatistics(meta: SubPanelDefinition, parentModule: string, parentId: string): void;
    /**
     * Init a single value statistic
     *
     * @param {string} statisticKey to use
     * @param {object} meta SubPanelDefinition
     * @param {string} parentModule to use
     * @param {string} parentId to use
     */
    protected initStatistic(statisticKey: string, meta: SubPanelDefinition, parentModule: string, parentId: string): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<SubpanelStore, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<SubpanelStore>;
}

//# sourceMappingURL=subpanel.store.d.ts.map