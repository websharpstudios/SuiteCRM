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
import { Statistic } from 'common';
import { StatisticsFetchGQL } from '../statistics/graphql/api.statistics.get';
import { StatisticsStore } from '../statistics/statistics.store';
import { FieldManager } from '../../services/record/field/field.manager';
import { SingleValueStatisticsState, SingleValueStatisticsStoreInterface } from 'common';
import * as ɵngcc0 from '@angular/core';
export declare class SingleValueStatisticsStore extends StatisticsStore implements SingleValueStatisticsStoreInterface {
    protected fetchGQL: StatisticsFetchGQL;
    protected fieldManager: FieldManager;
    state$: Observable<SingleValueStatisticsState>;
    statistic$: Observable<Statistic>;
    loading$: Observable<boolean>;
    protected cache$: Observable<any>;
    protected internalState: SingleValueStatisticsState;
    protected store: BehaviorSubject<SingleValueStatisticsState>;
    constructor(fetchGQL: StatisticsFetchGQL, fieldManager: FieldManager);
    protected addNewState(statistic: Statistic): void;
    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: SingleValueStatisticsState): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<SingleValueStatisticsStore, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<SingleValueStatisticsStore>;
}

//# sourceMappingURL=single-value-statistics.store.d.ts.map