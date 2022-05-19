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
import { BehaviorSubject, Observable } from 'rxjs';
import { ChartDataSource, ChartOptions, SeriesResult, SeriesStatistic, Statistic } from 'common';
import { SeriesStatisticsState, SeriesStatisticsStore } from '../series-statistics/series-statistics.store';
import { StatisticsFetchGQL } from '../statistics/graphql/api.statistics.get';
import { DataTypeFormatter } from '../../services/formatters/data-type.formatter.service';
import { SeriesMapper } from '../../services/statistics/series/mapper/series-mapper.service';
import * as ɵngcc0 from '@angular/core';
export interface ChartDataState extends SeriesStatisticsState {
    dataSource?: ChartDataSource;
}
export declare class ChartDataStore extends SeriesStatisticsStore {
    protected fetchGQL: StatisticsFetchGQL;
    protected formatter: DataTypeFormatter;
    protected seriesMapper: SeriesMapper;
    state$: Observable<ChartDataState>;
    statistic$: Observable<SeriesStatistic>;
    loading$: Observable<boolean>;
    protected internalState: ChartDataState;
    protected store: BehaviorSubject<ChartDataState>;
    protected defaultOptions: ChartOptions;
    constructor(fetchGQL: StatisticsFetchGQL, formatter: DataTypeFormatter, seriesMapper: SeriesMapper);
    setDefaultOptions(chartOptions: ChartOptions): void;
    getDataSource(): ChartDataSource;
    protected addNewState(statistic: Statistic): void;
    protected injectDefaultValues(statistic: Statistic): void;
    protected buildCharDataSource(statistic: Statistic): ChartDataSource;
    protected buildSeriesResult(statistic: Statistic): SeriesResult;
    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: ChartDataState): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<ChartDataStore, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<ChartDataStore>;
}

//# sourceMappingURL=chart-data.store.d.ts.map