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
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { deepClone, isVoid } from 'common';
import { catchError, distinctUntilChanged, finalize, map, take, tap } from 'rxjs/operators';
import { NavigationStore } from '../../../../store/navigation/navigation.store';
import { RecordSaveGQL } from '../../../../store/record/graphql/api.record.save';
import { LanguageStore } from '../../../../store/language/language.store';
import { ModuleNavigation } from '../../../../services/navigation/module-navigation/module-navigation.service';
import { MetadataStore } from '../../../../store/metadata/metadata.store.service';
import { MessageService } from '../../../../services/message/message.service';
import { AppStateStore } from '../../../../store/app-state/app-state.store';
import { RecordManager } from '../../../../services/record/record.manager';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { SubpanelStoreFactory } from '../../../../containers/subpanel/store/subpanel/subpanel.store.factory';
import { ViewStore } from '../../../../store/view/view.store';
import { RecordFetchGQL } from '../../../../store/record/graphql/api.record.get';
import { StatisticsBatch } from '../../../../store/statistics/statistics-batch.service';
import { RecordStoreFactory } from '../../../../store/record/record.store.factory';
const initialState = {
    module: '',
    recordID: '',
    loading: false,
    widgets: false,
    showSidebarWidgets: false,
    showTopWidget: false,
    showSubpanels: false,
    mode: 'detail',
    params: {
        returnModule: '',
        returnId: '',
        returnAction: ''
    }
};
export class RecordViewStore extends ViewStore {
    constructor(recordFetchGQL, recordSaveGQL, appStateStore, languageStore, navigationStore, moduleNavigation, metadataStore, localStorage, message, subpanelFactory, recordManager, statisticsBatch, recordStoreFactory) {
        super(appStateStore, languageStore, navigationStore, moduleNavigation, metadataStore);
        this.recordFetchGQL = recordFetchGQL;
        this.recordSaveGQL = recordSaveGQL;
        this.appStateStore = appStateStore;
        this.languageStore = languageStore;
        this.navigationStore = navigationStore;
        this.moduleNavigation = moduleNavigation;
        this.metadataStore = metadataStore;
        this.localStorage = localStorage;
        this.message = message;
        this.subpanelFactory = subpanelFactory;
        this.recordManager = recordManager;
        this.statisticsBatch = statisticsBatch;
        this.recordStoreFactory = recordStoreFactory;
        /** Internal Properties */
        this.cache$ = null;
        this.internalState = deepClone(initialState);
        this.store = new BehaviorSubject(this.internalState);
        this.state$ = this.store.asObservable();
        this.subpanelReloadSubject = new BehaviorSubject({});
        this.subpanelReloadSub = [];
        this.subs = [];
        this.recordStore = recordStoreFactory.create(this.getViewFieldsObservable());
        this.record$ = this.recordStore.state$.pipe(distinctUntilChanged());
        this.stagingRecord$ = this.recordStore.staging$.pipe(distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading));
        this.widgets$ = this.state$.pipe(map(state => state.widgets));
        this.showSidebarWidgets$ = this.state$.pipe(map(state => state.showSidebarWidgets));
        this.showTopWidget$ = this.state$.pipe(map(state => state.showTopWidget));
        this.showSubpanels$ = this.state$.pipe(map(state => state.showSubpanels));
        this.mode$ = this.state$.pipe(map(state => state.mode));
        this.subpanelReload$ = this.subpanelReloadSubject.asObservable();
        const data$ = combineLatest([this.record$, this.loading$]).pipe(map(([record, loading]) => {
            this.data = { record, loading };
            return this.data;
        }));
        this.vm$ = combineLatest([data$, this.appData$, this.metadata$]).pipe(map(([data, appData, metadata]) => {
            this.vm = { data, appData, metadata };
            return this.vm;
        }));
        this.subpanelsState = new BehaviorSubject({});
        this.subpanels$ = this.subpanelsState.asObservable();
        this.viewContext$ = this.record$.pipe(map(() => {
            return this.getViewContext();
        }));
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
    get showTopWidget() {
        return this.internalState.showTopWidget;
    }
    set showTopWidget(show) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { showTopWidget: show }));
    }
    get showSubpanels() {
        return this.internalState.showTopWidget;
    }
    set showSubpanels(show) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { showSubpanels: show }));
    }
    get params() {
        return this.internalState.params || {};
    }
    set params(params) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { params }));
    }
    getModuleName() {
        return this.internalState.module;
    }
    getRecordId() {
        return this.internalState.recordID;
    }
    getViewContext() {
        return {
            module: this.getModuleName(),
            id: this.getRecordId(),
            record: this.getBaseRecord()
        };
    }
    getSubpanels() {
        return this.subpanels;
    }
    /**
     * Clean destroy
     */
    destroy() {
        this.clear();
    }
    /**
     * Initial record load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @param {string} recordID to use
     * @param {string} mode to use
     * @param {object} params to set
     * @returns {object} Observable<any>
     */
    init(module, recordID, mode = 'detail', params = {}) {
        this.internalState.module = module;
        this.internalState.recordID = recordID;
        this.setMode(mode);
        this.initSubpanels(module, recordID);
        this.calculateShowWidgets();
        return this.load().pipe(tap(() => {
            this.showTopWidget = true;
            this.loadSubpanelStatistics(module);
            this.parseParams(params);
        }));
    }
    /**
     * Clear observable cache
     */
    clear() {
        this.cache$ = null;
        this.clearSubpanels();
        this.subpanelsState.unsubscribe();
        this.updateState(deepClone(initialState));
    }
    /**
     * Get staging record
     *
     * @returns {string} ViewMode
     */
    getBaseRecord() {
        if (!this.internalState) {
            return null;
        }
        return this.recordStore.getBaseRecord();
    }
    /**
     * Get current view mode
     *
     * @returns {string} ViewMode
     */
    getMode() {
        if (!this.internalState) {
            return null;
        }
        return this.internalState.mode;
    }
    /**
     * Set new mode
     *
     * @param {string} mode ViewMode
     */
    setMode(mode) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { mode }));
    }
    save() {
        this.appStateStore.updateLoading(`${this.internalState.module}-record-save`, true);
        return this.recordStore.save().pipe(catchError(() => {
            this.message.addDangerMessageByKey('LBL_ERROR_SAVING');
            return of({});
        }), finalize(() => {
            this.setMode('detail');
            this.appStateStore.updateLoading(`${this.internalState.module}-record-save`, false);
        }));
    }
    /**
     * Load / reload record using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<RecordViewState>
     */
    load(useCache = true) {
        this.appStateStore.updateLoading(`${this.internalState.module}-record-fetch`, true);
        return this.recordStore.retrieveRecord(this.internalState.module, this.internalState.recordID, useCache).pipe(tap((data) => {
            this.appStateStore.updateLoading(`${this.internalState.module}-record-fetch`, false);
            this.updateState(Object.assign(Object.assign({}, this.internalState), { recordID: data.id, module: data.module }));
        }));
    }
    /**
     * Get summary template
     *
     * @returns {string} summary template label
     */
    getSummaryTemplate() {
        const metadata = this.metadata || {};
        const recordMeta = metadata.recordView || {};
        const templates = recordMeta.summaryTemplates || {};
        return templates[this.getMode()] || '';
    }
    /**
     * Parse query params
     *
     * @param {object} params to set
     */
    parseParams(params = {}) {
        if (!params) {
            return;
        }
        const currentParams = Object.assign({}, this.internalState.params);
        Object.keys(params).forEach(paramKey => {
            if (!isVoid(currentParams[paramKey])) {
                currentParams[paramKey] = params[paramKey];
                return;
            }
        });
        this.params = params;
    }
    /**
     * Load all statistics
     *
     * @param {string} module if to use cache
     */
    loadSubpanelStatistics(module) {
        const subpanels = this.subpanelsState.value;
        if (!subpanels) {
            return;
        }
        const queries = {};
        Object.keys(subpanels).forEach(subpanelKey => {
            const subpanel = subpanels[subpanelKey];
            const statsMap = subpanel.statistics;
            if (!statsMap || !Object.keys(statsMap).length) {
                return;
            }
            if (subpanel.shouldBatchStatistic() === false) {
                subpanel.loadAllStatistics().pipe(take(1)).subscribe();
                return;
            }
            const subpanelQueries = subpanel.getAllStatisticQuery();
            Object.keys(subpanelQueries).forEach(subpanelQueryKey => {
                const queryKey = this.buildStatKey(subpanelKey, subpanelQueryKey);
                queries[queryKey] = subpanelQueries[subpanelQueryKey];
            });
            subpanel.setAllStatisticsLoading(true);
        });
        this.statisticsBatch.fetch(module, queries)
            .pipe(take(1))
            .subscribe((stats) => {
            Object.keys(subpanels).forEach(subpanelKey => {
                const subpanel = subpanels[subpanelKey];
                const subpanelQueries = subpanel.getAllStatisticQuery();
                Object.keys(subpanelQueries).forEach(subpanelQueryKey => {
                    const queryKey = this.buildStatKey(subpanelKey, subpanelQueryKey);
                    const stat = stats[queryKey];
                    if (!stat) {
                        return;
                    }
                    subpanel.setStatistics(subpanelQueryKey, stat, true);
                });
                subpanel.setAllStatisticsLoading(false);
            });
        });
    }
    buildStatKey(subpanelKey, subpanelQueryKey) {
        subpanelKey = subpanelKey.replace(/_/g, '-');
        subpanelQueryKey = subpanelQueryKey.replace(/_/g, '-');
        return subpanelKey + '-' + subpanelQueryKey;
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
     * Init subpanels
     *
     * @param {string} module parent module
     * @param {string} recordId id
     */
    initSubpanels(module, recordId) {
        this.showSubpanels = true;
        this.metadataStore.subPanelMetadata$.subscribe((meta) => {
            this.clearSubpanels();
            Object.keys(meta).forEach((key) => {
                this.subpanels[key] = this.subpanelFactory.create();
                this.subpanels[key].init(module, recordId, meta[key], this.record$);
            });
            this.subpanelsState.next(this.subpanels);
            Object.keys(this.subpanels).forEach(subpanelKey => {
                const subpanel = this.subpanels[subpanelKey];
                this.subpanelReloadSub.push(subpanel.recordList.records$.pipe(tap(() => {
                    const update = {};
                    update[subpanelKey] = true;
                    this.subpanelReloadSubject.next(update);
                })).subscribe());
            });
        });
    }
    clearSubpanels() {
        if (this.subpanels) {
            Object.keys(this.subpanels).forEach((key) => {
                this.subpanels[key].clear();
            });
        }
        if (this.subpanelReloadSub.length) {
            this.subpanelReloadSub.forEach(sub => sub.unsubscribe());
            this.subpanelReloadSub = [];
        }
        this.subpanels = {};
    }
    /**
     * Calculate if widgets are to display
     */
    calculateShowWidgets() {
        let show = false;
        const recordViewMeta = this.getRecordViewMetadata();
        const sidebarWidgetsConfig = recordViewMeta.sidebarWidgets || [];
        if (sidebarWidgetsConfig && sidebarWidgetsConfig.length > 0) {
            show = true;
        }
        this.showSidebarWidgets = show;
        this.widgets = show;
    }
    /**
     * Get record view metadata
     *
     * @returns {object} metadata RecordViewMetadata
     */
    getRecordViewMetadata() {
        const meta = this.metadataStore.get() || {};
        return meta.recordView || {};
    }
    /**
     * Get vardefs
     *
     * @returns {object} vardefs FieldDefinitionMap
     */
    getVardefs() {
        const meta = this.getRecordViewMetadata();
        return meta.vardefs || {};
    }
    /**
     * Get view fields observable
     *
     * @returns {object} Observable<ViewFieldDefinition[]>
     */
    getViewFieldsObservable() {
        return this.metadataStore.recordViewMetadata$.pipe(map((recordMetadata) => {
            const fields = [];
            recordMetadata.panels.forEach(panel => {
                panel.rows.forEach(row => {
                    row.cols.forEach(col => {
                        fields.push(col);
                    });
                });
            });
            return fields;
        }));
    }
}
RecordViewStore.decorators = [
    { type: Injectable }
];
RecordViewStore.ctorParameters = () => [
    { type: RecordFetchGQL },
    { type: RecordSaveGQL },
    { type: AppStateStore },
    { type: LanguageStore },
    { type: NavigationStore },
    { type: ModuleNavigation },
    { type: MetadataStore },
    { type: LocalStorageService },
    { type: MessageService },
    { type: SubpanelStoreFactory },
    { type: RecordManager },
    { type: StatisticsBatch },
    { type: RecordStoreFactory }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLXZpZXcuc3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvdmlld3MvcmVjb3JkL3N0b3JlL3JlY29yZC12aWV3L3JlY29yZC12aWV3LnN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFjLEVBQUUsRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUNsRixPQUFPLEVBRUgsU0FBUyxFQUVULE1BQU0sRUFRVCxNQUFNLFFBQVEsQ0FBQztBQUNoQixPQUFPLEVBQUMsVUFBVSxFQUFFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTFGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSwrQ0FBK0MsQ0FBQztBQUU5RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0RBQWtELENBQUM7QUFDL0UsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBQ3hFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDZFQUE2RSxDQUFDO0FBQzdHLE9BQU8sRUFFSCxhQUFhLEVBR2hCLE1BQU0sbURBQW1ELENBQUM7QUFDM0QsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDhDQUE4QyxDQUFDO0FBRTVFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSw2Q0FBNkMsQ0FBQztBQUMxRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sNENBQTRDLENBQUM7QUFFekUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sMERBQTBELENBQUM7QUFDN0YsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0s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YTtZQUhiLGVBQWU7WUFJZixnQkFBZ0I7WUFHcEIsYUFBYTtZQVNULG1CQUFtQjtZQUxuQixjQUFjO1lBTWQsb0JBQW9CO1lBSHBCLGFBQWE7WUFPYixlQUFlO1lBQ2Ysa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIG9mLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgICBCb29sZWFuTWFwLFxuICAgIGRlZXBDbG9uZSxcbiAgICBGaWVsZERlZmluaXRpb25NYXAsXG4gICAgaXNWb2lkLFxuICAgIFJlY29yZCxcbiAgICBTdGF0aXN0aWNzTWFwLFxuICAgIFN0YXRpc3RpY3NRdWVyeU1hcCxcbiAgICBTdWJQYW5lbE1ldGEsXG4gICAgVmlld0NvbnRleHQsXG4gICAgVmlld0ZpZWxkRGVmaW5pdGlvbixcbiAgICBWaWV3TW9kZVxufSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtjYXRjaEVycm9yLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgZmluYWxpemUsIG1hcCwgdGFrZSwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1JlY29yZFZpZXdEYXRhLCBSZWNvcmRWaWV3TW9kZWwsIFJlY29yZFZpZXdTdGF0ZX0gZnJvbSAnLi9yZWNvcmQtdmlldy5zdG9yZS5tb2RlbCc7XG5pbXBvcnQge05hdmlnYXRpb25TdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLnN0b3JlJztcbmltcG9ydCB7U3RhdGVTdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvc3RhdGUnO1xuaW1wb3J0IHtSZWNvcmRTYXZlR1FMfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9yZWNvcmQvZ3JhcGhxbC9hcGkucmVjb3JkLnNhdmUnO1xuaW1wb3J0IHtMYW5ndWFnZVN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5pbXBvcnQge01vZHVsZU5hdmlnYXRpb259IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24vbW9kdWxlLW5hdmlnYXRpb24vbW9kdWxlLW5hdmlnYXRpb24uc2VydmljZSc7XG5pbXBvcnQge1xuICAgIE1ldGFkYXRhLFxuICAgIE1ldGFkYXRhU3RvcmUsXG4gICAgUmVjb3JkVmlld01ldGFkYXRhLFxuICAgIFN1bW1hcnlUZW1wbGF0ZXNcbn0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvbWV0YWRhdGEvbWV0YWRhdGEuc3RvcmUuc2VydmljZSc7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9tZXNzYWdlL21lc3NhZ2Uuc2VydmljZSc7XG5pbXBvcnQge1N1YnBhbmVsU3RvcmVNYXB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbnRhaW5lcnMvc3VicGFuZWwvc3RvcmUvc3VicGFuZWwvc3VicGFuZWwuc3RvcmUnO1xuaW1wb3J0IHtBcHBTdGF0ZVN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9hcHAtc3RhdGUvYXBwLXN0YXRlLnN0b3JlJztcbmltcG9ydCB7UmVjb3JkTWFuYWdlcn0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZXMvcmVjb3JkL3JlY29yZC5tYW5hZ2VyJztcbmltcG9ydCB7UmVjb3JkU3RvcmV9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3JlY29yZC9yZWNvcmQuc3RvcmUnO1xuaW1wb3J0IHtMb2NhbFN0b3JhZ2VTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9sb2NhbC1zdG9yYWdlL2xvY2FsLXN0b3JhZ2Uuc2VydmljZSc7XG5pbXBvcnQge1N1YnBhbmVsU3RvcmVGYWN0b3J5fSBmcm9tICcuLi8uLi8uLi8uLi9jb250YWluZXJzL3N1YnBhbmVsL3N0b3JlL3N1YnBhbmVsL3N1YnBhbmVsLnN0b3JlLmZhY3RvcnknO1xuaW1wb3J0IHtWaWV3U3RvcmV9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3ZpZXcvdmlldy5zdG9yZSc7XG5pbXBvcnQge1JlY29yZEZldGNoR1FMfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9yZWNvcmQvZ3JhcGhxbC9hcGkucmVjb3JkLmdldCc7XG5pbXBvcnQge1BhcmFtc30gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7U3RhdGlzdGljc0JhdGNofSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9zdGF0aXN0aWNzL3N0YXRpc3RpY3MtYmF0Y2guc2VydmljZSc7XG5pbXBvcnQge1JlY29yZFN0b3JlRmFjdG9yeX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvcmVjb3JkL3JlY29yZC5zdG9yZS5mYWN0b3J5JztcblxuY29uc3QgaW5pdGlhbFN0YXRlOiBSZWNvcmRWaWV3U3RhdGUgPSB7XG4gICAgbW9kdWxlOiAnJyxcbiAgICByZWNvcmRJRDogJycsXG4gICAgbG9hZGluZzogZmFsc2UsXG4gICAgd2lkZ2V0czogZmFsc2UsXG4gICAgc2hvd1NpZGViYXJXaWRnZXRzOiBmYWxzZSxcbiAgICBzaG93VG9wV2lkZ2V0OiBmYWxzZSxcbiAgICBzaG93U3VicGFuZWxzOiBmYWxzZSxcbiAgICBtb2RlOiAnZGV0YWlsJyxcbiAgICBwYXJhbXM6IHtcbiAgICAgICAgcmV0dXJuTW9kdWxlOiAnJyxcbiAgICAgICAgcmV0dXJuSWQ6ICcnLFxuICAgICAgICByZXR1cm5BY3Rpb246ICcnXG4gICAgfVxufTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJlY29yZFZpZXdTdG9yZSBleHRlbmRzIFZpZXdTdG9yZSBpbXBsZW1lbnRzIFN0YXRlU3RvcmUge1xuXG4gICAgLyoqXG4gICAgICogUHVibGljIGxvbmctbGl2ZWQgb2JzZXJ2YWJsZSBzdHJlYW1zXG4gICAgICovXG4gICAgcmVjb3JkJDogT2JzZXJ2YWJsZTxSZWNvcmQ+O1xuICAgIHN0YWdpbmdSZWNvcmQkOiBPYnNlcnZhYmxlPFJlY29yZD47XG4gICAgbG9hZGluZyQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgd2lkZ2V0cyQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgc2hvd1NpZGViYXJXaWRnZXRzJDogT2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICBzaG93VG9wV2lkZ2V0JDogT2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICBzaG93U3VicGFuZWxzJDogT2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICBtb2RlJDogT2JzZXJ2YWJsZTxWaWV3TW9kZT47XG4gICAgc3VicGFuZWxzJDogT2JzZXJ2YWJsZTxTdWJwYW5lbFN0b3JlTWFwPjtcbiAgICB2aWV3Q29udGV4dCQ6IE9ic2VydmFibGU8Vmlld0NvbnRleHQ+O1xuICAgIHN1YnBhbmVsUmVsb2FkJDogT2JzZXJ2YWJsZTxCb29sZWFuTWFwPjtcblxuXG4gICAgLyoqXG4gICAgICogVmlldy1tb2RlbCB0aGF0IHJlc29sdmVzIG9uY2UgYWxsIHRoZSBkYXRhIGlzIHJlYWR5IChvciB1cGRhdGVkKS5cbiAgICAgKi9cbiAgICB2bSQ6IE9ic2VydmFibGU8UmVjb3JkVmlld01vZGVsPjtcbiAgICB2bTogUmVjb3JkVmlld01vZGVsO1xuICAgIGRhdGE6IFJlY29yZFZpZXdEYXRhO1xuICAgIHJlY29yZFN0b3JlOiBSZWNvcmRTdG9yZTtcblxuICAgIC8qKiBJbnRlcm5hbCBQcm9wZXJ0aWVzICovXG4gICAgcHJvdGVjdGVkIGNhY2hlJDogT2JzZXJ2YWJsZTxhbnk+ID0gbnVsbDtcbiAgICBwcm90ZWN0ZWQgaW50ZXJuYWxTdGF0ZTogUmVjb3JkVmlld1N0YXRlID0gZGVlcENsb25lKGluaXRpYWxTdGF0ZSk7XG4gICAgcHJvdGVjdGVkIHN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxSZWNvcmRWaWV3U3RhdGU+KHRoaXMuaW50ZXJuYWxTdGF0ZSk7XG4gICAgcHJvdGVjdGVkIHN0YXRlJCA9IHRoaXMuc3RvcmUuYXNPYnNlcnZhYmxlKCk7XG4gICAgcHJvdGVjdGVkIHN1YnBhbmVsczogU3VicGFuZWxTdG9yZU1hcDtcbiAgICBwcm90ZWN0ZWQgc3VicGFuZWxzU3RhdGU6IEJlaGF2aW9yU3ViamVjdDxTdWJwYW5lbFN0b3JlTWFwPjtcbiAgICBwcm90ZWN0ZWQgc3VicGFuZWxSZWxvYWRTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxCb29sZWFuTWFwPih7fSBhcyBCb29sZWFuTWFwKTtcbiAgICBwcm90ZWN0ZWQgc3VicGFuZWxSZWxvYWRTdWI6IFN1YnNjcmlwdGlvbltdID0gW107XG4gICAgcHJvdGVjdGVkIHN1YnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlY29yZEZldGNoR1FMOiBSZWNvcmRGZXRjaEdRTCxcbiAgICAgICAgcHJvdGVjdGVkIHJlY29yZFNhdmVHUUw6IFJlY29yZFNhdmVHUUwsXG4gICAgICAgIHByb3RlY3RlZCBhcHBTdGF0ZVN0b3JlOiBBcHBTdGF0ZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbGFuZ3VhZ2VTdG9yZTogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIG5hdmlnYXRpb25TdG9yZTogTmF2aWdhdGlvblN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbW9kdWxlTmF2aWdhdGlvbjogTW9kdWxlTmF2aWdhdGlvbixcbiAgICAgICAgcHJvdGVjdGVkIG1ldGFkYXRhU3RvcmU6IE1ldGFkYXRhU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBsb2NhbFN0b3JhZ2U6IExvY2FsU3RvcmFnZVNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBtZXNzYWdlOiBNZXNzYWdlU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIHN1YnBhbmVsRmFjdG9yeTogU3VicGFuZWxTdG9yZUZhY3RvcnksXG4gICAgICAgIHByb3RlY3RlZCByZWNvcmRNYW5hZ2VyOiBSZWNvcmRNYW5hZ2VyLFxuICAgICAgICBwcm90ZWN0ZWQgc3RhdGlzdGljc0JhdGNoOiBTdGF0aXN0aWNzQmF0Y2gsXG4gICAgICAgIHByb3RlY3RlZCByZWNvcmRTdG9yZUZhY3Rvcnk6IFJlY29yZFN0b3JlRmFjdG9yeVxuICAgICkge1xuXG4gICAgICAgIHN1cGVyKGFwcFN0YXRlU3RvcmUsIGxhbmd1YWdlU3RvcmUsIG5hdmlnYXRpb25TdG9yZSwgbW9kdWxlTmF2aWdhdGlvbiwgbWV0YWRhdGFTdG9yZSk7XG5cbiAgICAgICAgdGhpcy5yZWNvcmRTdG9yZSA9IHJlY29yZFN0b3JlRmFjdG9yeS5jcmVhdGUodGhpcy5nZXRWaWV3RmllbGRzT2JzZXJ2YWJsZSgpKTtcblxuICAgICAgICB0aGlzLnJlY29yZCQgPSB0aGlzLnJlY29yZFN0b3JlLnN0YXRlJC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpO1xuICAgICAgICB0aGlzLnN0YWdpbmdSZWNvcmQkID0gdGhpcy5yZWNvcmRTdG9yZS5zdGFnaW5nJC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpO1xuICAgICAgICB0aGlzLmxvYWRpbmckID0gdGhpcy5zdGF0ZSQucGlwZShtYXAoc3RhdGUgPT4gc3RhdGUubG9hZGluZykpO1xuICAgICAgICB0aGlzLndpZGdldHMkID0gdGhpcy5zdGF0ZSQucGlwZShtYXAoc3RhdGUgPT4gc3RhdGUud2lkZ2V0cykpO1xuICAgICAgICB0aGlzLnNob3dTaWRlYmFyV2lkZ2V0cyQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5zaG93U2lkZWJhcldpZGdldHMpKTtcbiAgICAgICAgdGhpcy5zaG93VG9wV2lkZ2V0JCA9IHRoaXMuc3RhdGUkLnBpcGUobWFwKHN0YXRlID0+IHN0YXRlLnNob3dUb3BXaWRnZXQpKTtcbiAgICAgICAgdGhpcy5zaG93U3VicGFuZWxzJCA9IHRoaXMuc3RhdGUkLnBpcGUobWFwKHN0YXRlID0+IHN0YXRlLnNob3dTdWJwYW5lbHMpKTtcbiAgICAgICAgdGhpcy5tb2RlJCA9IHRoaXMuc3RhdGUkLnBpcGUobWFwKHN0YXRlID0+IHN0YXRlLm1vZGUpKTtcbiAgICAgICAgdGhpcy5zdWJwYW5lbFJlbG9hZCQgPSB0aGlzLnN1YnBhbmVsUmVsb2FkU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICAgICAgICBjb25zdCBkYXRhJCA9IGNvbWJpbmVMYXRlc3QoXG4gICAgICAgICAgICBbdGhpcy5yZWNvcmQkLCB0aGlzLmxvYWRpbmckXVxuICAgICAgICApLnBpcGUoXG4gICAgICAgICAgICBtYXAoKFtyZWNvcmQsIGxvYWRpbmddKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0ge3JlY29yZCwgbG9hZGluZ30gYXMgUmVjb3JkVmlld0RhdGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy52bSQgPSBjb21iaW5lTGF0ZXN0KFtkYXRhJCwgdGhpcy5hcHBEYXRhJCwgdGhpcy5tZXRhZGF0YSRdKS5waXBlKFxuICAgICAgICAgICAgbWFwKChbZGF0YSwgYXBwRGF0YSwgbWV0YWRhdGFdKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy52bSA9IHtkYXRhLCBhcHBEYXRhLCBtZXRhZGF0YX0gYXMgUmVjb3JkVmlld01vZGVsO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZtO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIHRoaXMuc3VicGFuZWxzU3RhdGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFN1YnBhbmVsU3RvcmVNYXA+KHt9IGFzIFN1YnBhbmVsU3RvcmVNYXApO1xuICAgICAgICB0aGlzLnN1YnBhbmVscyQgPSB0aGlzLnN1YnBhbmVsc1N0YXRlLmFzT2JzZXJ2YWJsZSgpO1xuXG5cbiAgICAgICAgdGhpcy52aWV3Q29udGV4dCQgPSB0aGlzLnJlY29yZCQucGlwZShtYXAoKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Vmlld0NvbnRleHQoKTtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIGdldCB3aWRnZXRzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN0YXRlLndpZGdldHM7XG4gICAgfVxuXG4gICAgc2V0IHdpZGdldHMoc2hvdzogYm9vbGVhbikge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHtcbiAgICAgICAgICAgIC4uLnRoaXMuaW50ZXJuYWxTdGF0ZSxcbiAgICAgICAgICAgIHdpZGdldHM6IHNob3dcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IHNob3dTaWRlYmFyV2lkZ2V0cygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxTdGF0ZS5zaG93U2lkZWJhcldpZGdldHM7XG4gICAgfVxuXG4gICAgc2V0IHNob3dTaWRlYmFyV2lkZ2V0cyhzaG93OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoe1xuICAgICAgICAgICAgLi4udGhpcy5pbnRlcm5hbFN0YXRlLFxuICAgICAgICAgICAgc2hvd1NpZGViYXJXaWRnZXRzOiBzaG93XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldCBzaG93VG9wV2lkZ2V0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN0YXRlLnNob3dUb3BXaWRnZXQ7XG4gICAgfVxuXG4gICAgc2V0IHNob3dUb3BXaWRnZXQoc2hvdzogYm9vbGVhbikge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHtcbiAgICAgICAgICAgIC4uLnRoaXMuaW50ZXJuYWxTdGF0ZSxcbiAgICAgICAgICAgIHNob3dUb3BXaWRnZXQ6IHNob3dcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IHNob3dTdWJwYW5lbHMoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsU3RhdGUuc2hvd1RvcFdpZGdldDtcbiAgICB9XG5cbiAgICBzZXQgc2hvd1N1YnBhbmVscyhzaG93OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoe1xuICAgICAgICAgICAgLi4udGhpcy5pbnRlcm5hbFN0YXRlLFxuICAgICAgICAgICAgc2hvd1N1YnBhbmVsczogc2hvd1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXQgcGFyYW1zKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN0YXRlLnBhcmFtcyB8fCB7fTtcbiAgICB9XG5cbiAgICBzZXQgcGFyYW1zKHBhcmFtczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHtcbiAgICAgICAgICAgIC4uLnRoaXMuaW50ZXJuYWxTdGF0ZSxcbiAgICAgICAgICAgIHBhcmFtc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRNb2R1bGVOYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsU3RhdGUubW9kdWxlO1xuICAgIH1cblxuICAgIGdldFJlY29yZElkKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsU3RhdGUucmVjb3JkSUQ7XG4gICAgfVxuXG4gICAgZ2V0Vmlld0NvbnRleHQoKTogVmlld0NvbnRleHQge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbW9kdWxlOiB0aGlzLmdldE1vZHVsZU5hbWUoKSxcbiAgICAgICAgICAgIGlkOiB0aGlzLmdldFJlY29yZElkKCksXG4gICAgICAgICAgICByZWNvcmQ6IHRoaXMuZ2V0QmFzZVJlY29yZCgpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0U3VicGFuZWxzKCk6IFN1YnBhbmVsU3RvcmVNYXAge1xuICAgICAgICByZXR1cm4gdGhpcy5zdWJwYW5lbHM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xlYW4gZGVzdHJveVxuICAgICAqL1xuICAgIHB1YmxpYyBkZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbCByZWNvcmQgbG9hZCBpZiBub3QgY2FjaGVkIGFuZCB1cGRhdGUgc3RhdGUuXG4gICAgICogUmV0dXJucyBvYnNlcnZhYmxlIHRvIGJlIHVzZWQgaW4gcmVzb2x2ZXIgaWYgbmVlZGVkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kdWxlIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWNvcmRJRCB0byB1c2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIHRvIHNldFxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IE9ic2VydmFibGU8YW55PlxuICAgICAqL1xuICAgIHB1YmxpYyBpbml0KG1vZHVsZTogc3RyaW5nLCByZWNvcmRJRDogc3RyaW5nLCBtb2RlID0gJ2RldGFpbCcgYXMgVmlld01vZGUsIHBhcmFtczogUGFyYW1zID0ge30pOiBPYnNlcnZhYmxlPFJlY29yZD4ge1xuICAgICAgICB0aGlzLmludGVybmFsU3RhdGUubW9kdWxlID0gbW9kdWxlO1xuICAgICAgICB0aGlzLmludGVybmFsU3RhdGUucmVjb3JkSUQgPSByZWNvcmRJRDtcbiAgICAgICAgdGhpcy5zZXRNb2RlKG1vZGUpO1xuICAgICAgICB0aGlzLmluaXRTdWJwYW5lbHMobW9kdWxlLCByZWNvcmRJRCk7XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVTaG93V2lkZ2V0cygpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmxvYWQoKS5waXBlKFxuICAgICAgICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dUb3BXaWRnZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZFN1YnBhbmVsU3RhdGlzdGljcyhtb2R1bGUpO1xuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VQYXJhbXMocGFyYW1zKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xlYXIgb2JzZXJ2YWJsZSBjYWNoZVxuICAgICAqL1xuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jYWNoZSQgPSBudWxsO1xuICAgICAgICB0aGlzLmNsZWFyU3VicGFuZWxzKCk7XG4gICAgICAgIHRoaXMuc3VicGFuZWxzU3RhdGUudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZShkZWVwQ2xvbmUoaW5pdGlhbFN0YXRlKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHN0YWdpbmcgcmVjb3JkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBWaWV3TW9kZVxuICAgICAqL1xuICAgIGdldEJhc2VSZWNvcmQoKTogUmVjb3JkIHtcbiAgICAgICAgaWYgKCF0aGlzLmludGVybmFsU3RhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnJlY29yZFN0b3JlLmdldEJhc2VSZWNvcmQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgY3VycmVudCB2aWV3IG1vZGVcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFZpZXdNb2RlXG4gICAgICovXG4gICAgZ2V0TW9kZSgpOiBWaWV3TW9kZSB7XG4gICAgICAgIGlmICghdGhpcy5pbnRlcm5hbFN0YXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN0YXRlLm1vZGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IG5ldyBtb2RlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZSBWaWV3TW9kZVxuICAgICAqL1xuICAgIHNldE1vZGUobW9kZTogVmlld01vZGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSh7Li4udGhpcy5pbnRlcm5hbFN0YXRlLCBtb2RlfSk7XG4gICAgfVxuXG4gICAgc2F2ZSgpOiBPYnNlcnZhYmxlPFJlY29yZD4ge1xuICAgICAgICB0aGlzLmFwcFN0YXRlU3RvcmUudXBkYXRlTG9hZGluZyhgJHt0aGlzLmludGVybmFsU3RhdGUubW9kdWxlfS1yZWNvcmQtc2F2ZWAsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJlY29yZFN0b3JlLnNhdmUoKS5waXBlKFxuICAgICAgICAgICAgY2F0Y2hFcnJvcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlLmFkZERhbmdlck1lc3NhZ2VCeUtleSgnTEJMX0VSUk9SX1NBVklORycpO1xuICAgICAgICAgICAgICAgIHJldHVybiBvZih7fSBhcyBSZWNvcmQpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBmaW5hbGl6ZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRNb2RlKCdkZXRhaWwnIGFzIFZpZXdNb2RlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcFN0YXRlU3RvcmUudXBkYXRlTG9hZGluZyhgJHt0aGlzLmludGVybmFsU3RhdGUubW9kdWxlfS1yZWNvcmQtc2F2ZWAsIGZhbHNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9hZCAvIHJlbG9hZCByZWNvcmQgdXNpbmcgY3VycmVudCBwYWdpbmF0aW9uIGFuZCBjcml0ZXJpYVxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSB1c2VDYWNoZSBpZiB0byB1c2UgY2FjaGVcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBPYnNlcnZhYmxlPFJlY29yZFZpZXdTdGF0ZT5cbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZCh1c2VDYWNoZSA9IHRydWUpOiBPYnNlcnZhYmxlPFJlY29yZD4ge1xuICAgICAgICB0aGlzLmFwcFN0YXRlU3RvcmUudXBkYXRlTG9hZGluZyhgJHt0aGlzLmludGVybmFsU3RhdGUubW9kdWxlfS1yZWNvcmQtZmV0Y2hgLCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5yZWNvcmRTdG9yZS5yZXRyaWV2ZVJlY29yZChcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuYWxTdGF0ZS5tb2R1bGUsXG4gICAgICAgICAgICB0aGlzLmludGVybmFsU3RhdGUucmVjb3JkSUQsXG4gICAgICAgICAgICB1c2VDYWNoZVxuICAgICAgICApLnBpcGUoXG4gICAgICAgICAgICB0YXAoKGRhdGE6IFJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwU3RhdGVTdG9yZS51cGRhdGVMb2FkaW5nKGAke3RoaXMuaW50ZXJuYWxTdGF0ZS5tb2R1bGV9LXJlY29yZC1mZXRjaGAsIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmludGVybmFsU3RhdGUsXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZElEOiBkYXRhLmlkLFxuICAgICAgICAgICAgICAgICAgICBtb2R1bGU6IGRhdGEubW9kdWxlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgc3VtbWFyeSB0ZW1wbGF0ZVxuICAgICAqXG4gICAgICogQHJldHVybnMge3N0cmluZ30gc3VtbWFyeSB0ZW1wbGF0ZSBsYWJlbFxuICAgICAqL1xuICAgIGdldFN1bW1hcnlUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHRoaXMubWV0YWRhdGEgfHwge30gYXMgTWV0YWRhdGE7XG4gICAgICAgIGNvbnN0IHJlY29yZE1ldGEgPSBtZXRhZGF0YS5yZWNvcmRWaWV3IHx8IHt9IGFzIFJlY29yZFZpZXdNZXRhZGF0YTtcbiAgICAgICAgY29uc3QgdGVtcGxhdGVzID0gcmVjb3JkTWV0YS5zdW1tYXJ5VGVtcGxhdGVzIHx8IHt9IGFzIFN1bW1hcnlUZW1wbGF0ZXM7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZXNbdGhpcy5nZXRNb2RlKCldIHx8ICcnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIHF1ZXJ5IHBhcmFtc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyB0byBzZXRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgcGFyc2VQYXJhbXMocGFyYW1zOiBQYXJhbXMgPSB7fSk6IHZvaWQge1xuICAgICAgICBpZiAoIXBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3VycmVudFBhcmFtcyA9IHsuLi50aGlzLmludGVybmFsU3RhdGUucGFyYW1zfTtcbiAgICAgICAgT2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKHBhcmFtS2V5ID0+IHtcbiAgICAgICAgICAgIGlmICghaXNWb2lkKGN1cnJlbnRQYXJhbXNbcGFyYW1LZXldKSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQYXJhbXNbcGFyYW1LZXldID0gcGFyYW1zW3BhcmFtS2V5XTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogTG9hZCBhbGwgc3RhdGlzdGljc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZHVsZSBpZiB0byB1c2UgY2FjaGVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgbG9hZFN1YnBhbmVsU3RhdGlzdGljcyhtb2R1bGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBzdWJwYW5lbHMgPSB0aGlzLnN1YnBhbmVsc1N0YXRlLnZhbHVlO1xuXG4gICAgICAgIGlmICghc3VicGFuZWxzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBxdWVyaWVzOiBTdGF0aXN0aWNzUXVlcnlNYXAgPSB7fTtcblxuICAgICAgICBPYmplY3Qua2V5cyhzdWJwYW5lbHMpLmZvckVhY2goc3VicGFuZWxLZXkgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCBzdWJwYW5lbCA9IHN1YnBhbmVsc1tzdWJwYW5lbEtleV07XG4gICAgICAgICAgICBjb25zdCBzdGF0c01hcCA9IHN1YnBhbmVsLnN0YXRpc3RpY3M7XG5cbiAgICAgICAgICAgIGlmICghc3RhdHNNYXAgfHwgIU9iamVjdC5rZXlzKHN0YXRzTWFwKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdWJwYW5lbC5zaG91bGRCYXRjaFN0YXRpc3RpYygpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHN1YnBhbmVsLmxvYWRBbGxTdGF0aXN0aWNzKCkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHN1YnBhbmVsUXVlcmllcyA9IHN1YnBhbmVsLmdldEFsbFN0YXRpc3RpY1F1ZXJ5KCk7XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHN1YnBhbmVsUXVlcmllcykuZm9yRWFjaChzdWJwYW5lbFF1ZXJ5S2V5ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBxdWVyeUtleSA9IHRoaXMuYnVpbGRTdGF0S2V5KHN1YnBhbmVsS2V5LCBzdWJwYW5lbFF1ZXJ5S2V5KTtcbiAgICAgICAgICAgICAgICBxdWVyaWVzW3F1ZXJ5S2V5XSA9IHN1YnBhbmVsUXVlcmllc1tzdWJwYW5lbFF1ZXJ5S2V5XTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzdWJwYW5lbC5zZXRBbGxTdGF0aXN0aWNzTG9hZGluZyh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zdGF0aXN0aWNzQmF0Y2guZmV0Y2gobW9kdWxlLCBxdWVyaWVzKVxuICAgICAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKHN0YXRzOiBTdGF0aXN0aWNzTWFwKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhzdWJwYW5lbHMpLmZvckVhY2goc3VicGFuZWxLZXkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN1YnBhbmVsID0gc3VicGFuZWxzW3N1YnBhbmVsS2V5XTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VicGFuZWxRdWVyaWVzID0gc3VicGFuZWwuZ2V0QWxsU3RhdGlzdGljUXVlcnkoKTtcblxuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhzdWJwYW5lbFF1ZXJpZXMpLmZvckVhY2goc3VicGFuZWxRdWVyeUtleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBxdWVyeUtleSA9IHRoaXMuYnVpbGRTdGF0S2V5KHN1YnBhbmVsS2V5LCBzdWJwYW5lbFF1ZXJ5S2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXQgPSBzdGF0c1txdWVyeUtleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXN0YXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJwYW5lbC5zZXRTdGF0aXN0aWNzKHN1YnBhbmVsUXVlcnlLZXksIHN0YXQsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBzdWJwYW5lbC5zZXRBbGxTdGF0aXN0aWNzTG9hZGluZyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYnVpbGRTdGF0S2V5KHN1YnBhbmVsS2V5OiBzdHJpbmcsIHN1YnBhbmVsUXVlcnlLZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHN1YnBhbmVsS2V5ID0gc3VicGFuZWxLZXkucmVwbGFjZSgvXy9nLCAnLScpO1xuICAgICAgICBzdWJwYW5lbFF1ZXJ5S2V5ID0gc3VicGFuZWxRdWVyeUtleS5yZXBsYWNlKC9fL2csICctJyk7XG5cbiAgICAgICAgcmV0dXJuIHN1YnBhbmVsS2V5ICsgJy0nICsgc3VicGFuZWxRdWVyeUtleTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIHN0YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc3RhdGUgdG8gc2V0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVN0YXRlKHN0YXRlOiBSZWNvcmRWaWV3U3RhdGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdG9yZS5uZXh0KHRoaXMuaW50ZXJuYWxTdGF0ZSA9IHN0YXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0IHN1YnBhbmVsc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZHVsZSBwYXJlbnQgbW9kdWxlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlY29yZElkIGlkXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGluaXRTdWJwYW5lbHMobW9kdWxlOiBzdHJpbmcsIHJlY29yZElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zaG93U3VicGFuZWxzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tZXRhZGF0YVN0b3JlLnN1YlBhbmVsTWV0YWRhdGEkLnN1YnNjcmliZSgobWV0YTogU3ViUGFuZWxNZXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyU3VicGFuZWxzKCk7XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKG1ldGEpLmZvckVhY2goKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJwYW5lbHNba2V5XSA9IHRoaXMuc3VicGFuZWxGYWN0b3J5LmNyZWF0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3VicGFuZWxzW2tleV0uaW5pdChtb2R1bGUsIHJlY29yZElkLCBtZXRhW2tleV0sIHRoaXMucmVjb3JkJCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zdWJwYW5lbHNTdGF0ZS5uZXh0KHRoaXMuc3VicGFuZWxzKTtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5zdWJwYW5lbHMpLmZvckVhY2goc3VicGFuZWxLZXkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1YnBhbmVsID0gdGhpcy5zdWJwYW5lbHNbc3VicGFuZWxLZXldO1xuICAgICAgICAgICAgICAgIHRoaXMuc3VicGFuZWxSZWxvYWRTdWIucHVzaChzdWJwYW5lbC5yZWNvcmRMaXN0LnJlY29yZHMkLnBpcGUodGFwKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlID0ge30gYXMgQm9vbGVhbk1hcDtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlW3N1YnBhbmVsS2V5XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VicGFuZWxSZWxvYWRTdWJqZWN0Lm5leHQodXBkYXRlKTtcbiAgICAgICAgICAgICAgICB9KSkuc3Vic2NyaWJlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBjbGVhclN1YnBhbmVscygpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc3VicGFuZWxzKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnN1YnBhbmVscykuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnBhbmVsc1trZXldLmNsZWFyKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnN1YnBhbmVsUmVsb2FkU3ViLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5zdWJwYW5lbFJlbG9hZFN1Yi5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgICAgICAgICB0aGlzLnN1YnBhbmVsUmVsb2FkU3ViID0gW107XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN1YnBhbmVscyA9IHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZSBpZiB3aWRnZXRzIGFyZSB0byBkaXNwbGF5XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNhbGN1bGF0ZVNob3dXaWRnZXRzKCk6IHZvaWQge1xuICAgICAgICBsZXQgc2hvdyA9IGZhbHNlO1xuICAgICAgICBjb25zdCByZWNvcmRWaWV3TWV0YSA9IHRoaXMuZ2V0UmVjb3JkVmlld01ldGFkYXRhKCk7XG4gICAgICAgIGNvbnN0IHNpZGViYXJXaWRnZXRzQ29uZmlnID0gcmVjb3JkVmlld01ldGEuc2lkZWJhcldpZGdldHMgfHwgW107XG5cbiAgICAgICAgaWYgKHNpZGViYXJXaWRnZXRzQ29uZmlnICYmIHNpZGViYXJXaWRnZXRzQ29uZmlnLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNob3cgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93U2lkZWJhcldpZGdldHMgPSBzaG93O1xuICAgICAgICB0aGlzLndpZGdldHMgPSBzaG93O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByZWNvcmQgdmlldyBtZXRhZGF0YVxuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gbWV0YWRhdGEgUmVjb3JkVmlld01ldGFkYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldFJlY29yZFZpZXdNZXRhZGF0YSgpOiBSZWNvcmRWaWV3TWV0YWRhdGEge1xuICAgICAgICBjb25zdCBtZXRhID0gdGhpcy5tZXRhZGF0YVN0b3JlLmdldCgpIHx8IHt9O1xuICAgICAgICByZXR1cm4gbWV0YS5yZWNvcmRWaWV3IHx8IHt9IGFzIFJlY29yZFZpZXdNZXRhZGF0YTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdmFyZGVmc1xuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gdmFyZGVmcyBGaWVsZERlZmluaXRpb25NYXBcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0VmFyZGVmcygpOiBGaWVsZERlZmluaXRpb25NYXAge1xuICAgICAgICBjb25zdCBtZXRhID0gdGhpcy5nZXRSZWNvcmRWaWV3TWV0YWRhdGEoKTtcbiAgICAgICAgcmV0dXJuIG1ldGEudmFyZGVmcyB8fCB7fSBhcyBGaWVsZERlZmluaXRpb25NYXA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHZpZXcgZmllbGRzIG9ic2VydmFibGVcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IE9ic2VydmFibGU8Vmlld0ZpZWxkRGVmaW5pdGlvbltdPlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXRWaWV3RmllbGRzT2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPFZpZXdGaWVsZERlZmluaXRpb25bXT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5tZXRhZGF0YVN0b3JlLnJlY29yZFZpZXdNZXRhZGF0YSQucGlwZShtYXAoKHJlY29yZE1ldGFkYXRhOiBSZWNvcmRWaWV3TWV0YWRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkczogVmlld0ZpZWxkRGVmaW5pdGlvbltdID0gW107XG4gICAgICAgICAgICByZWNvcmRNZXRhZGF0YS5wYW5lbHMuZm9yRWFjaChwYW5lbCA9PiB7XG4gICAgICAgICAgICAgICAgcGFuZWwucm93cy5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJvdy5jb2xzLmZvckVhY2goY29sID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkcy5wdXNoKGNvbCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgICAgIH0pKTtcbiAgICB9XG59XG4iXX0=