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
import { StateStore } from '../state';
import { BehaviorSubject, Observable } from 'rxjs';
import { Statistic, StatisticsMap, StatisticsQuery, StatisticsState, ViewContext } from 'common';
import { StatisticsFetchGQL } from './graphql/api.statistics.get';
import * as ɵngcc0 from '@angular/core';
export declare class StatisticsStore implements StateStore {
    protected fetchGQL: StatisticsFetchGQL;
    state$: Observable<StatisticsState>;
    statistic$: Observable<Statistic>;
    loading$: Observable<boolean>;
    protected cache$: Observable<any>;
    protected internalState: StatisticsState;
    protected store: BehaviorSubject<StatisticsState>;
    constructor(fetchGQL: StatisticsFetchGQL);
    clear(): void;
    clearAuthBased(): void;
    /**
     * Get Statistic query
     *
     * @returns {object} StatisticsQuery
     */
    getQuery(): StatisticsQuery;
    get context(): ViewContext;
    set context(context: ViewContext);
    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @param {object} query to use
     * @param {boolean} load if to load
     * @returns {object} Observable<any>
     */
    init(module: string, query: StatisticsQuery, load?: boolean): Observable<Statistic>;
    /**
     * Load / reload statistics
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<ListViewState>
     */
    load(useCache?: boolean): Observable<Statistic>;
    /**
     * Set loading
     *
     * @param {boolean} loading bool
     */
    setLoading(loading: boolean): void;
    /**
     * Set Statistic value
     *
     * @param {string} key string
     * @param {object} statistic Statistic
     * @param {boolean} cache bool
     */
    setStatistic(key: string, statistic: Statistic, cache?: boolean): void;
    protected addNewState(statistic: Statistic): void;
    protected mapStatistics(data: StatisticsMap): Statistic;
    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: StatisticsState): void;
    /**
     * Get records cached Observable or call the backend
     *
     * @param {string} module to use
     * @param {object} query to use
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<any>
     */
    protected fetchStatistics(module: string, query: StatisticsQuery, useCache?: boolean): Observable<StatisticsMap>;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<StatisticsStore, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<StatisticsStore>;
}

//# sourceMappingURL=statistics.store.d.ts.map