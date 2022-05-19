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
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { deepClone } from 'common';
import { distinctUntilChanged, map, shareReplay, tap } from 'rxjs/operators';
import { StatisticsFetchGQL } from './graphql/api.statistics.get';
const ɵ0 = {};
const initialState = {
    module: '',
    query: {},
    statistic: {
        id: '',
        data: ɵ0
    },
    loading: false
};
export class StatisticsStore {
    constructor(fetchGQL) {
        this.fetchGQL = fetchGQL;
        this.cache$ = null;
        this.internalState = deepClone(initialState);
        this.store = new BehaviorSubject(this.internalState);
        this.state$ = this.store.asObservable();
        this.statistic$ = this.state$.pipe(map(state => state.statistic), distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading), distinctUntilChanged());
    }
    clear() {
        this.store.unsubscribe();
        this.cache$ = null;
    }
    clearAuthBased() {
        this.clear();
    }
    /**
     * Get Statistic query
     *
     * @returns {object} StatisticsQuery
     */
    getQuery() {
        return deepClone(this.internalState.query);
    }
    get context() {
        return this.internalState.query.context;
    }
    set context(context) {
        const query = deepClone(this.internalState.query);
        query.context = context;
        this.updateState(Object.assign(Object.assign({}, this.internalState), { query }));
    }
    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @param {object} query to use
     * @param {boolean} load if to load
     * @returns {object} Observable<any>
     */
    init(module, query, load = true) {
        this.internalState.module = module;
        this.updateState(Object.assign(Object.assign({}, this.internalState), { module,
            query }));
        if (load === false) {
            return null;
        }
        return this.load();
    }
    /**
     * Load / reload statistics
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<ListViewState>
     */
    load(useCache = true) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { loading: true }));
        return this.fetchStatistics(this.internalState.module, this.getQuery(), useCache).pipe(map((data) => this.mapStatistics(data)), tap((statistic) => {
            this.addNewState(statistic);
        }));
    }
    /**
     * Set loading
     *
     * @param {boolean} loading bool
     */
    setLoading(loading) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { loading }));
    }
    /**
     * Set Statistic value
     *
     * @param {string} key string
     * @param {object} statistic Statistic
     * @param {boolean} cache bool
     */
    setStatistic(key, statistic, cache = false) {
        this.addNewState(statistic);
        if (!cache) {
            return;
        }
        const statMap = {};
        statMap[key] = statistic;
        this.cache$ = of(statMap).pipe(shareReplay(1));
    }
    addNewState(statistic) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { statistic, loading: false }));
    }
    mapStatistics(data) {
        const keys = Object.keys(data);
        const key = keys && keys.length && keys[0];
        let statistic = { id: '', data: {} };
        if (key) {
            statistic = data[key];
        }
        return statistic;
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
     * Get records cached Observable or call the backend
     *
     * @param {string} module to use
     * @param {object} query to use
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<any>
     */
    fetchStatistics(module, query, useCache = true) {
        const queries = {};
        queries[query.key] = query;
        if (this.cache$ == null || useCache === false) {
            this.cache$ = this.fetchGQL.fetch(module, queries).pipe(shareReplay(1));
        }
        return this.cache$;
    }
}
StatisticsStore.decorators = [
    { type: Injectable }
];
StatisticsStore.ctorParameters = () => [
    { type: StatisticsFetchGQL }
];
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGlzdGljcy5zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zdG9yZS9zdGF0aXN0aWNzL3N0YXRpc3RpY3Muc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLGVBQWUsRUFBYyxFQUFFLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDckQsT0FBTyxFQUFDLFNBQVMsRUFBMEUsTUFBTSxRQUFRLENBQUM7QUFDMUcsT0FBTyxFQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0UsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sOEJBQThCLENBQUM7V0FPbEQsRUFBRTtBQUxoQixNQUFNLFlBQVksR0FBRztJQUNqQixNQUFNLEVBQUUsRUFBRTtJQUNWLEtBQUssRUFBRSxFQUFxQjtJQUM1QixTQUFTLEVBQUU7UUFDUCxFQUFFLEVBQUUsRUFBRTtRQUNOLElBQUksSUFBSTtLQUNFO0lBQ2QsT0FBTyxFQUFFLEtBQUs7Q0FDRSxDQUFDO0FBR3JCLE1BQU0sT0FBTyxlQUFlO0lBUXhCLFlBQ2MsUUFBNEI7UUFBNUIsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFMaEMsV0FBTSxHQUFvQixJQUFJLENBQUM7UUFDL0Isa0JBQWEsR0FBb0IsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3pELFVBQUssR0FBRyxJQUFJLGVBQWUsQ0FBa0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBS3ZFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsVUFBVSxHQUFHLElB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QUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUNuRCxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQ2pCLENBQUM7U0FDTDtRQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDOzs7WUFqTEosVUFBVTs7O1lBWkgsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdGF0ZVN0b3JlfSBmcm9tICcuLi9zdGF0ZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgb2Z9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWVwQ2xvbmUsIFN0YXRpc3RpYywgU3RhdGlzdGljc01hcCwgU3RhdGlzdGljc1F1ZXJ5LCBTdGF0aXN0aWNzU3RhdGUsIFZpZXdDb250ZXh0fSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtkaXN0aW5jdFVudGlsQ2hhbmdlZCwgbWFwLCBzaGFyZVJlcGxheSwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1N0YXRpc3RpY3NGZXRjaEdRTH0gZnJvbSAnLi9ncmFwaHFsL2FwaS5zdGF0aXN0aWNzLmdldCc7XG5cbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcbiAgICBtb2R1bGU6ICcnLFxuICAgIHF1ZXJ5OiB7fSBhcyBTdGF0aXN0aWNzUXVlcnksXG4gICAgc3RhdGlzdGljOiB7XG4gICAgICAgIGlkOiAnJyxcbiAgICAgICAgZGF0YToge31cbiAgICB9IGFzIFN0YXRpc3RpYyxcbiAgICBsb2FkaW5nOiBmYWxzZVxufSBhcyBTdGF0aXN0aWNzU3RhdGU7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdGF0aXN0aWNzU3RvcmUgaW1wbGVtZW50cyBTdGF0ZVN0b3JlIHtcbiAgICBzdGF0ZSQ6IE9ic2VydmFibGU8U3RhdGlzdGljc1N0YXRlPjtcbiAgICBzdGF0aXN0aWMkOiBPYnNlcnZhYmxlPFN0YXRpc3RpYz47XG4gICAgbG9hZGluZyQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgcHJvdGVjdGVkIGNhY2hlJDogT2JzZXJ2YWJsZTxhbnk+ID0gbnVsbDtcbiAgICBwcm90ZWN0ZWQgaW50ZXJuYWxTdGF0ZTogU3RhdGlzdGljc1N0YXRlID0gZGVlcENsb25lKGluaXRpYWxTdGF0ZSk7XG4gICAgcHJvdGVjdGVkIHN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxTdGF0aXN0aWNzU3RhdGU+KHRoaXMuaW50ZXJuYWxTdGF0ZSk7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGZldGNoR1FMOiBTdGF0aXN0aWNzRmV0Y2hHUUwsXG4gICAgKSB7XG4gICAgICAgIHRoaXMuc3RhdGUkID0gdGhpcy5zdG9yZS5hc09ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5zdGF0aXN0aWMkID0gdGhpcy5zdGF0ZSQucGlwZShtYXAoc3RhdGUgPT4gc3RhdGUuc3RhdGlzdGljKSwgZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG4gICAgICAgIHRoaXMubG9hZGluZyQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5sb2FkaW5nKSwgZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG4gICAgfVxuXG4gICAgY2xlYXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RvcmUudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy5jYWNoZSQgPSBudWxsO1xuICAgIH1cblxuICAgIGNsZWFyQXV0aEJhc2VkKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IFN0YXRpc3RpYyBxdWVyeVxuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gU3RhdGlzdGljc1F1ZXJ5XG4gICAgICovXG4gICAgcHVibGljIGdldFF1ZXJ5KCk6IFN0YXRpc3RpY3NRdWVyeSB7XG4gICAgICAgIHJldHVybiBkZWVwQ2xvbmUodGhpcy5pbnRlcm5hbFN0YXRlLnF1ZXJ5KTtcbiAgICB9XG5cbiAgICBnZXQgY29udGV4dCgpOiBWaWV3Q29udGV4dCB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsU3RhdGUucXVlcnkuY29udGV4dDtcbiAgICB9XG5cbiAgICBzZXQgY29udGV4dChjb250ZXh0OiBWaWV3Q29udGV4dCkge1xuICAgICAgICBjb25zdCBxdWVyeSA9IGRlZXBDbG9uZSh0aGlzLmludGVybmFsU3RhdGUucXVlcnkpO1xuICAgICAgICBxdWVyeS5jb250ZXh0ID0gY29udGV4dDtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHtcbiAgICAgICAgICAgIC4uLnRoaXMuaW50ZXJuYWxTdGF0ZSxcbiAgICAgICAgICAgIHF1ZXJ5XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWwgbGlzdCByZWNvcmRzIGxvYWQgaWYgbm90IGNhY2hlZCBhbmQgdXBkYXRlIHN0YXRlLlxuICAgICAqIFJldHVybnMgb2JzZXJ2YWJsZSB0byBiZSB1c2VkIGluIHJlc29sdmVyIGlmIG5lZWRlZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZHVsZSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcXVlcnkgdG8gdXNlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBsb2FkIGlmIHRvIGxvYWRcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBPYnNlcnZhYmxlPGFueT5cbiAgICAgKi9cbiAgICBwdWJsaWMgaW5pdChtb2R1bGU6IHN0cmluZywgcXVlcnk6IFN0YXRpc3RpY3NRdWVyeSwgbG9hZCA9IHRydWUpOiBPYnNlcnZhYmxlPFN0YXRpc3RpYz4ge1xuICAgICAgICB0aGlzLmludGVybmFsU3RhdGUubW9kdWxlID0gbW9kdWxlO1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHtcbiAgICAgICAgICAgIC4uLnRoaXMuaW50ZXJuYWxTdGF0ZSxcbiAgICAgICAgICAgIG1vZHVsZSxcbiAgICAgICAgICAgIHF1ZXJ5XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChsb2FkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5sb2FkKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9hZCAvIHJlbG9hZCBzdGF0aXN0aWNzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVzZUNhY2hlIGlmIHRvIHVzZSBjYWNoZVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IE9ic2VydmFibGU8TGlzdFZpZXdTdGF0ZT5cbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZCh1c2VDYWNoZSA9IHRydWUpOiBPYnNlcnZhYmxlPFN0YXRpc3RpYz4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHtcbiAgICAgICAgICAgIC4uLnRoaXMuaW50ZXJuYWxTdGF0ZSxcbiAgICAgICAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoU3RhdGlzdGljcyh0aGlzLmludGVybmFsU3RhdGUubW9kdWxlLCB0aGlzLmdldFF1ZXJ5KCksIHVzZUNhY2hlKS5waXBlKFxuICAgICAgICAgICAgbWFwKChkYXRhOiBTdGF0aXN0aWNzTWFwKSA9PiB0aGlzLm1hcFN0YXRpc3RpY3MoZGF0YSkpLFxuICAgICAgICAgICAgdGFwKChzdGF0aXN0aWM6IFN0YXRpc3RpYykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkTmV3U3RhdGUoc3RhdGlzdGljKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IGxvYWRpbmdcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbG9hZGluZyBib29sXG4gICAgICovXG4gICAgcHVibGljIHNldExvYWRpbmcobG9hZGluZzogYm9vbGVhbik6IHZvaWQge1xuXG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoe1xuICAgICAgICAgICAgLi4udGhpcy5pbnRlcm5hbFN0YXRlLFxuICAgICAgICAgICAgbG9hZGluZ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgU3RhdGlzdGljIHZhbHVlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IHN0cmluZ1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0aXN0aWMgU3RhdGlzdGljXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjYWNoZSBib29sXG4gICAgICovXG4gICAgcHVibGljIHNldFN0YXRpc3RpYyhrZXk6IHN0cmluZywgc3RhdGlzdGljOiBTdGF0aXN0aWMsIGNhY2hlID0gZmFsc2UpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLmFkZE5ld1N0YXRlKHN0YXRpc3RpYyk7XG5cbiAgICAgICAgaWYgKCFjYWNoZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhdE1hcDogU3RhdGlzdGljc01hcCA9IHt9O1xuICAgICAgICBzdGF0TWFwW2tleV0gPSBzdGF0aXN0aWM7XG5cbiAgICAgICAgdGhpcy5jYWNoZSQgPSBvZihzdGF0TWFwKS5waXBlKHNoYXJlUmVwbGF5KDEpKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWRkTmV3U3RhdGUoc3RhdGlzdGljOiBTdGF0aXN0aWMpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSh7XG4gICAgICAgICAgICAuLi50aGlzLmludGVybmFsU3RhdGUsXG4gICAgICAgICAgICBzdGF0aXN0aWMsXG4gICAgICAgICAgICBsb2FkaW5nOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbWFwU3RhdGlzdGljcyhkYXRhOiBTdGF0aXN0aWNzTWFwKTogU3RhdGlzdGljIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuICAgICAgICBjb25zdCBrZXkgPSBrZXlzICYmIGtleXMubGVuZ3RoICYmIGtleXNbMF07XG4gICAgICAgIGxldCBzdGF0aXN0aWMgPSB7aWQ6ICcnLCBkYXRhOiB7fX0gYXMgU3RhdGlzdGljO1xuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICBzdGF0aXN0aWMgPSBkYXRhW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YXRpc3RpYztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIHN0YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc3RhdGUgdG8gc2V0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVN0YXRlKHN0YXRlOiBTdGF0aXN0aWNzU3RhdGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdG9yZS5uZXh0KHRoaXMuaW50ZXJuYWxTdGF0ZSA9IHN0YXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmVjb3JkcyBjYWNoZWQgT2JzZXJ2YWJsZSBvciBjYWxsIHRoZSBiYWNrZW5kXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kdWxlIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBxdWVyeSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVzZUNhY2hlIGlmIHRvIHVzZSBjYWNoZVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IE9ic2VydmFibGU8YW55PlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBmZXRjaFN0YXRpc3RpY3MoXG4gICAgICAgIG1vZHVsZTogc3RyaW5nLFxuICAgICAgICBxdWVyeTogU3RhdGlzdGljc1F1ZXJ5LFxuICAgICAgICB1c2VDYWNoZSA9IHRydWVcbiAgICApOiBPYnNlcnZhYmxlPFN0YXRpc3RpY3NNYXA+IHtcblxuICAgICAgICBjb25zdCBxdWVyaWVzID0ge307XG4gICAgICAgIHF1ZXJpZXNbcXVlcnkua2V5XSA9IHF1ZXJ5O1xuXG4gICAgICAgIGlmICh0aGlzLmNhY2hlJCA9PSBudWxsIHx8IHVzZUNhY2hlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5jYWNoZSQgPSB0aGlzLmZldGNoR1FMLmZldGNoKG1vZHVsZSwgcXVlcmllcykucGlwZShcbiAgICAgICAgICAgICAgICBzaGFyZVJlcGxheSgxKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZSQ7XG4gICAgfVxuXG59XG4iXX0=