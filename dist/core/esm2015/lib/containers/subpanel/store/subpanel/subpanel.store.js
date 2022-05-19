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
import { BehaviorSubject, forkJoin } from 'rxjs';
import { RecordListStoreFactory } from '../../../../store/record-list/record-list.store.factory';
import { LanguageStore } from '../../../../store/language/language.store';
import { SingleValueStatisticsStoreFactory } from '../../../../store/single-value-statistics/single-value-statistics.store.factory';
import { deepClone } from 'common';
export class SubpanelStore {
    constructor(listStoreFactory, languageStore, statisticsStoreFactory) {
        this.listStoreFactory = listStoreFactory;
        this.languageStore = languageStore;
        this.statisticsStoreFactory = statisticsStoreFactory;
        this.show = false;
        this.subs = [];
        this.recordList = listStoreFactory.create();
        this.statistics = {};
        this.metadataState = new BehaviorSubject({});
        this.metadata$ = this.metadataState.asObservable();
        this.loading$ = this.recordList.loading$;
    }
    getTitle() {
        let label = this.languageStore.getFieldLabel(this.metadata.title_key, this.parentModule);
        if (!label) {
            const moduleList = this.languageStore.getAppListString('moduleList');
            label = (moduleList && moduleList[this.metadata.title_key]) || '';
        }
        return label;
    }
    getIcon() {
        return this.metadata.icon;
    }
    clear() {
        this.metadataState.unsubscribe();
        this.metadataState = null;
        this.recordList.clear();
        this.recordList = null;
        this.subs.forEach(sub => sub.unsubscribe());
    }
    clearAuthBased() {
        this.recordList.clearAuthBased();
    }
    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} parentModule name
     * @param {string} parentId id
     * @param {object} meta to use
     * @param {object} parentRecord$ to use
     */
    init(parentModule, parentId, meta, parentRecord$ = null) {
        this.parentModule = parentModule;
        this.parentId = parentId;
        this.metadata = meta;
        this.metadataState.next(this.metadata);
        this.recordList.init(meta.module, false, 'list_max_entries_per_subpanel');
        this.initStatistics(meta, parentModule, parentId);
        this.initSearchCriteria(parentModule, parentId, meta.name);
        if (parentRecord$) {
            this.parentRecord$ = parentRecord$;
            this.parentRecord$.subscribe(record => this.parentRecord = record);
        }
    }
    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<RecordList>
     */
    load(useCache = true) {
        return this.recordList.load(useCache);
    }
    /**
     * Get statistic store
     *
     * @param {string} key key of statistic
     * @returns {object} SingleValueStatisticsStore
     */
    getStatistic(key) {
        if (!this.statistics[key]) {
            return null;
        }
        return this.statistics[key];
    }
    /**
     * Load / reload statistics
     *
     * @param {string} key of statistic
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<Statistic>
     */
    loadStatistics(key, useCache = true) {
        if (!this.statistics[key]) {
            return null;
        }
        return this.statistics[key].load(useCache);
    }
    /**
     * Load / reload all statistics
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<Statistic>
     */
    loadAllStatistics(useCache = true) {
        if (!this.statistics || !Object.keys(this.statistics).length) {
            return null;
        }
        const stats$ = {};
        Object.keys(this.statistics).forEach(statisticKey => {
            if (!this.statistics[statisticKey]) {
                return;
            }
            stats$[statisticKey] = this.loadStatistics(statisticKey, useCache);
        });
        return forkJoin(stats$);
    }
    /**
     * Should batch statistic
     *
     * @returns {boolean} shouldBatch
     */
    shouldBatchStatistic() {
        const metadata = this.metadata || {};
        return !(metadata.insightWidget && metadata.insightWidget.batch && metadata.insightWidget.batch === false);
    }
    /**
     * Set loading
     *
     * @param {string} key of statistic
     * @param {boolean} loading bool
     */
    setStatisticsLoading(key, loading) {
        if (!this.statistics[key]) {
            return;
        }
        this.statistics[key].setLoading(loading);
    }
    /**
     * Set all statistics loading
     *
     * @param {boolean} loading bool
     */
    setAllStatisticsLoading(loading) {
        if (!this.statistics || !Object.keys(this.statistics).length) {
            return;
        }
        Object.keys(this.statistics).forEach(statisticKey => {
            if (!this.statistics[statisticKey]) {
                return;
            }
            this.setStatisticsLoading(statisticKey, loading);
        });
    }
    /**
     * Set Statistic value
     *
     * @param {string} key of statistic
     * @param {object} statistic Statistic
     * @param {boolean} cache bool
     */
    setStatistics(key, statistic, cache = false) {
        if (!this.statistics[key]) {
            return;
        }
        this.statistics[key].setStatistic(key, statistic, cache);
    }
    /**
     * Get statistic query
     *
     * @param {string} key of statistic
     * @returns {object} StatisticsQuery
     */
    getStatisticQuery(key) {
        return this.statistics[key].getQuery();
    }
    /**
     * Get all statistics queries
     *
     * @returns {object} StatisticsQuery
     */
    getAllStatisticQuery() {
        if (!this.statistics || !Object.keys(this.statistics).length) {
            return {};
        }
        const queriesMap = {};
        Object.keys(this.statistics).forEach(statisticKey => {
            if (!this.statistics[statisticKey]) {
                return;
            }
            queriesMap[statisticKey] = this.getStatisticQuery(statisticKey);
        });
        return queriesMap;
    }
    /**
     * Get widget layout
     *
     * @returns {any} any
     */
    getWidgetLayout() {
        const meta = this.metadata;
        if (!meta || !meta.insightWidget || !meta.insightWidget.options || !meta.insightWidget.options.insightWidget) {
            return { rows: [] };
        }
        const layout = deepClone(meta.insightWidget.options.insightWidget);
        if (!layout.rows || !layout.rows.length) {
            layout.rows = {};
        }
        return layout;
    }
    /**
     * Init search criteria
     *
     * @param {string} parentModule name
     * @param {string} parentId id
     * @param {string} subpanel name
     */
    initSearchCriteria(parentModule, parentId, subpanel) {
        this.recordList.criteria = {
            preset: {
                type: 'subpanel',
                params: {
                    subpanel,
                    parentModule,
                    parentId
                }
            }
        };
    }
    /**
     * Init statistics store
     *
     * @param {object} meta for subpanel
     * @param {string} parentModule name
     * @param {string} parentId {id}
     */
    initStatistics(meta, parentModule, parentId) {
        const layout = this.getWidgetLayout();
        layout.rows.forEach(row => {
            if (!row.cols || !row.cols.length) {
                return;
            }
            row.cols.forEach(col => {
                if (!col.statistic || typeof col.statistic !== 'string') {
                    return;
                }
                this.initStatistic(col.statistic, meta, parentModule, parentId);
                col.store = this.statistics[col.statistic];
            });
        });
    }
    /**
     * Init a single value statistic
     *
     * @param {string} statisticKey to use
     * @param {object} meta SubPanelDefinition
     * @param {string} parentModule to use
     * @param {string} parentId to use
     */
    initStatistic(statisticKey, meta, parentModule, parentId) {
        this.statistics[statisticKey] = this.statisticsStoreFactory.create();
        this.statistics[statisticKey].init(meta.module, {
            key: statisticKey,
            context: { module: parentModule, id: parentId },
            params: { subpanel: meta.name }
        }, false);
    }
}
SubpanelStore.decorators = [
    { type: Injectable }
];
SubpanelStore.ctorParameters = () => [
    { type: RecordListStoreFactory },
    { type: LanguageStore },
    { type: SingleValueStatisticsStoreFactory }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VicGFuZWwuc3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29udGFpbmVycy9zdWJwYW5lbC9zdG9yZS9zdWJwYW5lbC9zdWJwYW5lbC5zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUd6QyxPQUFPLEVBQUMsZUFBZSxFQUFFLFFBQVEsRUFBMkIsTUFBTSxNQUFNLENBQUM7QUFDekUsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0seURBQXlELENBQUM7QUFDL0YsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBSXhFLE9BQU8sRUFBQyxpQ0FBaUMsRUFBQyxNQUFNLGlGQUFpRixDQUFDO0FBQ2xJLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFhakMsTUFBTSxPQUFPLGFBQWE7SUFldEIsWUFDYyxnQkFBd0MsRUFDeEMsYUFBNEIsRUFDNUIsc0JBQXlEO1FBRnpELHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBd0I7UUFDeEMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUFtQztRQWpCdkUsU0FBSSxHQUFHLEtBQUssQ0FBQztRQVdILFNBQUksR0FBbUIsRUFBRSxDQUFDO1FBUWhDLElBQUksQ0FBQyxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBcUIsRUFBd0IsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVB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OUIsSUFBSSxDQUFDLE1BQU0sRUFDWDtZQUNJLEdBQUcsRUFBRSxZQUFZO1lBQ2pCLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBQztZQUM3QyxNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBQztTQUNiLEVBQ3BCLEtBQUssQ0FDUixDQUFDO0lBQ04sQ0FBQzs7O1lBdlVKLFVBQVU7OztZQWxCSCxzQkFBc0I7WUFDdEIsYUFBYTtZQUliLGlDQUFpQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3RhdGVTdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvc3RhdGUnO1xuaW1wb3J0IHtSZWNvcmRMaXN0LCBSZWNvcmRMaXN0U3RvcmV9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3JlY29yZC1saXN0L3JlY29yZC1saXN0LnN0b3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBmb3JrSm9pbiwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7UmVjb3JkTGlzdFN0b3JlRmFjdG9yeX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvcmVjb3JkLWxpc3QvcmVjb3JkLWxpc3Quc3RvcmUuZmFjdG9yeSc7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmV9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL2xhbmd1YWdlL2xhbmd1YWdlLnN0b3JlJztcbmltcG9ydCB7U3ViUGFuZWxEZWZpbml0aW9ufSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtTdGF0aXN0aWMsIFN0YXRpc3RpY3NNYXAsIFN0YXRpc3RpY3NRdWVyeSwgU3RhdGlzdGljc1F1ZXJ5TWFwfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtTaW5nbGVWYWx1ZVN0YXRpc3RpY3NTdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvc2luZ2xlLXZhbHVlLXN0YXRpc3RpY3Mvc2luZ2xlLXZhbHVlLXN0YXRpc3RpY3Muc3RvcmUnO1xuaW1wb3J0IHtTaW5nbGVWYWx1ZVN0YXRpc3RpY3NTdG9yZUZhY3Rvcnl9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3NpbmdsZS12YWx1ZS1zdGF0aXN0aWNzL3NpbmdsZS12YWx1ZS1zdGF0aXN0aWNzLnN0b3JlLmZhY3RvcnknO1xuaW1wb3J0IHtkZWVwQ2xvbmV9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge1N0YXRpc3RpY1dpZGdldE9wdGlvbnN9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge1JlY29yZH0gZnJvbSAnY29tbW9uJztcblxuZXhwb3J0IGludGVyZmFjZSBTdWJwYW5lbFN0b3JlTWFwIHtcbiAgICBba2V5OiBzdHJpbmddOiBTdWJwYW5lbFN0b3JlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNpbmdsZVZhbHVlU3RhdGlzdGljc1N0b3JlTWFwIHtcbiAgICBba2V5OiBzdHJpbmddOiBTaW5nbGVWYWx1ZVN0YXRpc3RpY3NTdG9yZTtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN1YnBhbmVsU3RvcmUgaW1wbGVtZW50cyBTdGF0ZVN0b3JlIHtcbiAgICBzaG93ID0gZmFsc2U7XG4gICAgcGFyZW50TW9kdWxlOiBzdHJpbmc7XG4gICAgcGFyZW50SWQ6IHN0cmluZztcbiAgICBwYXJlbnRSZWNvcmQkOiBPYnNlcnZhYmxlPFJlY29yZD47XG4gICAgcGFyZW50UmVjb3JkOiBSZWNvcmQ7XG4gICAgcmVjb3JkTGlzdDogUmVjb3JkTGlzdFN0b3JlO1xuICAgIHN0YXRpc3RpY3M6IFNpbmdsZVZhbHVlU3RhdGlzdGljc1N0b3JlTWFwO1xuICAgIG1ldGFkYXRhJDogT2JzZXJ2YWJsZTxTdWJQYW5lbERlZmluaXRpb24+O1xuICAgIG1ldGFkYXRhOiBTdWJQYW5lbERlZmluaXRpb247XG4gICAgbG9hZGluZyQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgcHJvdGVjdGVkIG1ldGFkYXRhU3RhdGU6IEJlaGF2aW9yU3ViamVjdDxTdWJQYW5lbERlZmluaXRpb24+O1xuICAgIHByb3RlY3RlZCBzdWJzOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGxpc3RTdG9yZUZhY3Rvcnk6IFJlY29yZExpc3RTdG9yZUZhY3RvcnksXG4gICAgICAgIHByb3RlY3RlZCBsYW5ndWFnZVN0b3JlOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgc3RhdGlzdGljc1N0b3JlRmFjdG9yeTogU2luZ2xlVmFsdWVTdGF0aXN0aWNzU3RvcmVGYWN0b3J5XG4gICAgKSB7XG4gICAgICAgIHRoaXMucmVjb3JkTGlzdCA9IGxpc3RTdG9yZUZhY3RvcnkuY3JlYXRlKCk7XG4gICAgICAgIHRoaXMuc3RhdGlzdGljcyA9IHt9O1xuICAgICAgICB0aGlzLm1ldGFkYXRhU3RhdGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFN1YlBhbmVsRGVmaW5pdGlvbj4oe30gYXMgU3ViUGFuZWxEZWZpbml0aW9uKTtcbiAgICAgICAgdGhpcy5tZXRhZGF0YSQgPSB0aGlzLm1ldGFkYXRhU3RhdGUuYXNPYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMubG9hZGluZyQgPSB0aGlzLnJlY29yZExpc3QubG9hZGluZyQ7XG4gICAgfVxuXG4gICAgZ2V0VGl0bGUoKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGxhYmVsID0gdGhpcy5sYW5ndWFnZVN0b3JlLmdldEZpZWxkTGFiZWwodGhpcy5tZXRhZGF0YS50aXRsZV9rZXksIHRoaXMucGFyZW50TW9kdWxlKTtcblxuICAgICAgICBpZiAoIWxhYmVsKSB7XG4gICAgICAgICAgICBjb25zdCBtb2R1bGVMaXN0ID0gdGhpcy5sYW5ndWFnZVN0b3JlLmdldEFwcExpc3RTdHJpbmcoJ21vZHVsZUxpc3QnKTtcbiAgICAgICAgICAgIGxhYmVsID0gKG1vZHVsZUxpc3QgJiYgbW9kdWxlTGlzdFt0aGlzLm1ldGFkYXRhLnRpdGxlX2tleV0pIHx8ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxhYmVsO1xuICAgIH1cblxuICAgIGdldEljb24oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWV0YWRhdGEuaWNvbjtcbiAgICB9XG5cbiAgICBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tZXRhZGF0YVN0YXRlLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMubWV0YWRhdGFTdGF0ZSA9IG51bGw7XG4gICAgICAgIHRoaXMucmVjb3JkTGlzdC5jbGVhcigpO1xuICAgICAgICB0aGlzLnJlY29yZExpc3QgPSBudWxsO1xuICAgICAgICB0aGlzLnN1YnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICAgIH1cblxuICAgIGNsZWFyQXV0aEJhc2VkKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlY29yZExpc3QuY2xlYXJBdXRoQmFzZWQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsIGxpc3QgcmVjb3JkcyBsb2FkIGlmIG5vdCBjYWNoZWQgYW5kIHVwZGF0ZSBzdGF0ZS5cbiAgICAgKiBSZXR1cm5zIG9ic2VydmFibGUgdG8gYmUgdXNlZCBpbiByZXNvbHZlciBpZiBuZWVkZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJlbnRNb2R1bGUgbmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJlbnRJZCBpZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBtZXRhIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJlbnRSZWNvcmQkIHRvIHVzZVxuICAgICAqL1xuICAgIHB1YmxpYyBpbml0KHBhcmVudE1vZHVsZTogc3RyaW5nLCBwYXJlbnRJZDogc3RyaW5nLCBtZXRhOiBTdWJQYW5lbERlZmluaXRpb24sIHBhcmVudFJlY29yZCQ6IE9ic2VydmFibGU8UmVjb3JkPiA9IG51bGwpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wYXJlbnRNb2R1bGUgPSBwYXJlbnRNb2R1bGU7XG4gICAgICAgIHRoaXMucGFyZW50SWQgPSBwYXJlbnRJZDtcbiAgICAgICAgdGhpcy5tZXRhZGF0YSA9IG1ldGE7XG4gICAgICAgIHRoaXMubWV0YWRhdGFTdGF0ZS5uZXh0KHRoaXMubWV0YWRhdGEpO1xuICAgICAgICB0aGlzLnJlY29yZExpc3QuaW5pdChtZXRhLm1vZHVsZSwgZmFsc2UsICdsaXN0X21heF9lbnRyaWVzX3Blcl9zdWJwYW5lbCcpO1xuXG4gICAgICAgIHRoaXMuaW5pdFN0YXRpc3RpY3MobWV0YSwgcGFyZW50TW9kdWxlLCBwYXJlbnRJZCk7XG5cbiAgICAgICAgdGhpcy5pbml0U2VhcmNoQ3JpdGVyaWEocGFyZW50TW9kdWxlLCBwYXJlbnRJZCwgbWV0YS5uYW1lKTtcblxuICAgICAgICBpZiAocGFyZW50UmVjb3JkJCkge1xuICAgICAgICAgICAgdGhpcy5wYXJlbnRSZWNvcmQkID0gcGFyZW50UmVjb3JkJDtcbiAgICAgICAgICAgIHRoaXMucGFyZW50UmVjb3JkJC5zdWJzY3JpYmUocmVjb3JkID0+IHRoaXMucGFyZW50UmVjb3JkID0gcmVjb3JkKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9hZCAvIHJlbG9hZCByZWNvcmRzIHVzaW5nIGN1cnJlbnQgcGFnaW5hdGlvbiBhbmQgY3JpdGVyaWFcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdXNlQ2FjaGUgaWYgdG8gdXNlIGNhY2hlXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxSZWNvcmRMaXN0PlxuICAgICAqL1xuICAgIHB1YmxpYyBsb2FkKHVzZUNhY2hlID0gdHJ1ZSk6IE9ic2VydmFibGU8UmVjb3JkTGlzdD4ge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJlY29yZExpc3QubG9hZCh1c2VDYWNoZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHN0YXRpc3RpYyBzdG9yZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBrZXkgb2Ygc3RhdGlzdGljXG4gICAgICogQHJldHVybnMge29iamVjdH0gU2luZ2xlVmFsdWVTdGF0aXN0aWNzU3RvcmVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0U3RhdGlzdGljKGtleTogc3RyaW5nKTogU2luZ2xlVmFsdWVTdGF0aXN0aWNzU3RvcmUge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGlzdGljc1trZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpc3RpY3Nba2V5XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2FkIC8gcmVsb2FkIHN0YXRpc3RpY3NcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgb2Ygc3RhdGlzdGljXG4gICAgICogQHBhcmFtIHtib29sZWFufSB1c2VDYWNoZSBpZiB0byB1c2UgY2FjaGVcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBPYnNlcnZhYmxlPFN0YXRpc3RpYz5cbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZFN0YXRpc3RpY3Moa2V5OiBzdHJpbmcsIHVzZUNhY2hlID0gdHJ1ZSk6IE9ic2VydmFibGU8U3RhdGlzdGljPiB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0aXN0aWNzW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGlzdGljc1trZXldLmxvYWQodXNlQ2FjaGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvYWQgLyByZWxvYWQgYWxsIHN0YXRpc3RpY3NcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdXNlQ2FjaGUgaWYgdG8gdXNlIGNhY2hlXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxTdGF0aXN0aWM+XG4gICAgICovXG4gICAgcHVibGljIGxvYWRBbGxTdGF0aXN0aWNzKHVzZUNhY2hlID0gdHJ1ZSk6IE9ic2VydmFibGU8U3RhdGlzdGljc01hcD4ge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGlzdGljcyB8fCAhT2JqZWN0LmtleXModGhpcy5zdGF0aXN0aWNzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhdHMkID0ge307XG5cbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5zdGF0aXN0aWNzKS5mb3JFYWNoKHN0YXRpc3RpY0tleSA9PiB7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0aXN0aWNzW3N0YXRpc3RpY0tleV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0cyRbc3RhdGlzdGljS2V5XSA9IHRoaXMubG9hZFN0YXRpc3RpY3Moc3RhdGlzdGljS2V5LCB1c2VDYWNoZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmb3JrSm9pbihzdGF0cyQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3VsZCBiYXRjaCBzdGF0aXN0aWNcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBzaG91bGRCYXRjaFxuICAgICAqL1xuICAgIHB1YmxpYyBzaG91bGRCYXRjaFN0YXRpc3RpYygpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGE6IFN1YlBhbmVsRGVmaW5pdGlvbiA9IHRoaXMubWV0YWRhdGEgfHwge30gYXMgU3ViUGFuZWxEZWZpbml0aW9uO1xuICAgICAgICByZXR1cm4gIShtZXRhZGF0YS5pbnNpZ2h0V2lkZ2V0ICYmIG1ldGFkYXRhLmluc2lnaHRXaWRnZXQuYmF0Y2ggJiYgbWV0YWRhdGEuaW5zaWdodFdpZGdldC5iYXRjaCA9PT0gZmFsc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBsb2FkaW5nXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IG9mIHN0YXRpc3RpY1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbG9hZGluZyBib29sXG4gICAgICovXG4gICAgcHVibGljIHNldFN0YXRpc3RpY3NMb2FkaW5nKGtleTogc3RyaW5nLCBsb2FkaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0aXN0aWNzW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXRpc3RpY3Nba2V5XS5zZXRMb2FkaW5nKGxvYWRpbmcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBhbGwgc3RhdGlzdGljcyBsb2FkaW5nXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGxvYWRpbmcgYm9vbFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRBbGxTdGF0aXN0aWNzTG9hZGluZyhsb2FkaW5nOiBib29sZWFuKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKCF0aGlzLnN0YXRpc3RpY3MgfHwgIU9iamVjdC5rZXlzKHRoaXMuc3RhdGlzdGljcykubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnN0YXRpc3RpY3MpLmZvckVhY2goc3RhdGlzdGljS2V5ID0+IHtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRpc3RpY3Nbc3RhdGlzdGljS2V5XSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGlzdGljc0xvYWRpbmcoc3RhdGlzdGljS2V5LCBsb2FkaW5nKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IFN0YXRpc3RpYyB2YWx1ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBvZiBzdGF0aXN0aWNcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc3RhdGlzdGljIFN0YXRpc3RpY1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2FjaGUgYm9vbFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRTdGF0aXN0aWNzKGtleTogc3RyaW5nLCBzdGF0aXN0aWM6IFN0YXRpc3RpYywgY2FjaGUgPSBmYWxzZSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGlzdGljc1trZXldKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0aXN0aWNzW2tleV0uc2V0U3RhdGlzdGljKGtleSwgc3RhdGlzdGljLCBjYWNoZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHN0YXRpc3RpYyBxdWVyeVxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBvZiBzdGF0aXN0aWNcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBTdGF0aXN0aWNzUXVlcnlcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0U3RhdGlzdGljUXVlcnkoa2V5OiBzdHJpbmcpOiBTdGF0aXN0aWNzUXVlcnkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aXN0aWNzW2tleV0uZ2V0UXVlcnkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYWxsIHN0YXRpc3RpY3MgcXVlcmllc1xuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gU3RhdGlzdGljc1F1ZXJ5XG4gICAgICovXG4gICAgcHVibGljIGdldEFsbFN0YXRpc3RpY1F1ZXJ5KCk6IFN0YXRpc3RpY3NRdWVyeU1hcCB7XG5cbiAgICAgICAgaWYgKCF0aGlzLnN0YXRpc3RpY3MgfHwgIU9iamVjdC5rZXlzKHRoaXMuc3RhdGlzdGljcykubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBxdWVyaWVzTWFwID0ge307XG5cbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5zdGF0aXN0aWNzKS5mb3JFYWNoKHN0YXRpc3RpY0tleSA9PiB7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0aXN0aWNzW3N0YXRpc3RpY0tleV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxdWVyaWVzTWFwW3N0YXRpc3RpY0tleV0gPSB0aGlzLmdldFN0YXRpc3RpY1F1ZXJ5KHN0YXRpc3RpY0tleSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBxdWVyaWVzTWFwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB3aWRnZXQgbGF5b3V0XG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7YW55fSBhbnlcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0V2lkZ2V0TGF5b3V0KCk6IFN0YXRpc3RpY1dpZGdldE9wdGlvbnMge1xuXG4gICAgICAgIGNvbnN0IG1ldGEgPSB0aGlzLm1ldGFkYXRhO1xuICAgICAgICBpZiAoIW1ldGEgfHwgIW1ldGEuaW5zaWdodFdpZGdldCB8fCAhbWV0YS5pbnNpZ2h0V2lkZ2V0Lm9wdGlvbnMgfHwgIW1ldGEuaW5zaWdodFdpZGdldC5vcHRpb25zLmluc2lnaHRXaWRnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiB7cm93czogW119IGFzIFN0YXRpc3RpY1dpZGdldE9wdGlvbnM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsYXlvdXQgPSBkZWVwQ2xvbmUobWV0YS5pbnNpZ2h0V2lkZ2V0Lm9wdGlvbnMuaW5zaWdodFdpZGdldCk7XG5cbiAgICAgICAgaWYgKCFsYXlvdXQucm93cyB8fCAhbGF5b3V0LnJvd3MubGVuZ3RoKSB7XG4gICAgICAgICAgICBsYXlvdXQucm93cyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxheW91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0IHNlYXJjaCBjcml0ZXJpYVxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmVudE1vZHVsZSBuYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmVudElkIGlkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN1YnBhbmVsIG5hbWVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW5pdFNlYXJjaENyaXRlcmlhKHBhcmVudE1vZHVsZTogc3RyaW5nLCBwYXJlbnRJZDogc3RyaW5nLCBzdWJwYW5lbDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVjb3JkTGlzdC5jcml0ZXJpYSA9IHtcbiAgICAgICAgICAgIHByZXNldDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdzdWJwYW5lbCcsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnBhbmVsLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRNb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudElkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXQgc3RhdGlzdGljcyBzdG9yZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG1ldGEgZm9yIHN1YnBhbmVsXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmVudE1vZHVsZSBuYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmVudElkIHtpZH1cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW5pdFN0YXRpc3RpY3MobWV0YTogU3ViUGFuZWxEZWZpbml0aW9uLCBwYXJlbnRNb2R1bGU6IHN0cmluZywgcGFyZW50SWQ6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IGxheW91dCA9IHRoaXMuZ2V0V2lkZ2V0TGF5b3V0KCk7XG5cbiAgICAgICAgbGF5b3V0LnJvd3MuZm9yRWFjaChyb3cgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIXJvdy5jb2xzIHx8ICFyb3cuY29scy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJvdy5jb2xzLmZvckVhY2goY29sID0+IHtcblxuICAgICAgICAgICAgICAgIGlmICghY29sLnN0YXRpc3RpYyB8fCB0eXBlb2YgY29sLnN0YXRpc3RpYyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFN0YXRpc3RpYyhjb2wuc3RhdGlzdGljLCBtZXRhLCBwYXJlbnRNb2R1bGUsIHBhcmVudElkKTtcbiAgICAgICAgICAgICAgICBjb2wuc3RvcmUgPSB0aGlzLnN0YXRpc3RpY3NbY29sLnN0YXRpc3RpY107XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdCBhIHNpbmdsZSB2YWx1ZSBzdGF0aXN0aWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0aXN0aWNLZXkgdG8gdXNlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG1ldGEgU3ViUGFuZWxEZWZpbml0aW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmVudE1vZHVsZSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyZW50SWQgdG8gdXNlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGluaXRTdGF0aXN0aWMoc3RhdGlzdGljS2V5OiBzdHJpbmcsIG1ldGE6IFN1YlBhbmVsRGVmaW5pdGlvbiwgcGFyZW50TW9kdWxlOiBzdHJpbmcsIHBhcmVudElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGF0aXN0aWNzW3N0YXRpc3RpY0tleV0gPSB0aGlzLnN0YXRpc3RpY3NTdG9yZUZhY3RvcnkuY3JlYXRlKCk7XG5cbiAgICAgICAgdGhpcy5zdGF0aXN0aWNzW3N0YXRpc3RpY0tleV0uaW5pdChcbiAgICAgICAgICAgIG1ldGEubW9kdWxlLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogc3RhdGlzdGljS2V5LFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IHttb2R1bGU6IHBhcmVudE1vZHVsZSwgaWQ6IHBhcmVudElkfSxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtzdWJwYW5lbDogbWV0YS5uYW1lfVxuICAgICAgICAgICAgfSBhcyBTdGF0aXN0aWNzUXVlcnksXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgIH1cbn1cbiJdfQ==