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
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { deepClone } from 'common';
import { catchError, distinctUntilChanged, finalize, map, take, tap } from 'rxjs/operators';
const initialState = {
    module: '',
    recordId: '',
    loading: {
        data: false,
        metadata: false
    },
    mode: 'detail',
};
export class BaseRecordContainerStore {
    constructor(appStateStore, meta, message, fieldManager, language, storeFactory) {
        this.appStateStore = appStateStore;
        this.meta = meta;
        this.message = message;
        this.fieldManager = fieldManager;
        this.language = language;
        this.storeFactory = storeFactory;
        /** Internal Properties */
        this.internalState = deepClone(initialState);
        this.metadataState = deepClone({});
        this.store = new BehaviorSubject(this.internalState);
        this.state$ = this.store.asObservable();
        this.metadataStore = new BehaviorSubject({});
        this.metadataState$ = this.metadataStore.asObservable();
        this.subs = [];
        this.meta$ = this.metadataState$;
        this.recordStore = storeFactory.create(this.getViewFields$());
        this.record$ = this.recordStore.state$.pipe(distinctUntilChanged());
        this.stagingRecord$ = this.recordStore.staging$.pipe(distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading.data || state.loading.metadata));
        this.mode$ = this.state$.pipe(map(state => state.mode));
        this.vm$ = this.state$;
    }
    /**
     * Get current module name
     * @returns {string} module
     */
    getModuleName() {
        return this.internalState.module;
    }
    /**
     * Get current record id
     * @returns {string} id
     */
    getRecordId() {
        return this.internalState.recordId;
    }
    /**
     * Get View Context
     * @returns {object} ViewContext
     */
    getViewContext() {
        return {
            module: this.getModuleName(),
            id: this.getRecordId(),
        };
    }
    /**
     * Initial record load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @param {string} recordId to use
     * @param {string} mode to use
     * @returns {object} Observable<any>
     */
    init(module, recordId, mode = 'detail') {
        this.baseInit(module, recordId, mode);
        this.setMetadataLoading(true);
        const dataMap = {
            $meta: this.loadMetadata(),
            record: this.load()
        };
        const $data = forkJoin(dataMap);
        return $data.pipe(map(({ meta, record }) => record));
    }
    /**
     * Init record
     *
     * @param {object} record to use
     * @param {string} mode to use
     * @param {boolean} loadMetadata to use
     * @returns {object} Observable<any>
     */
    initRecord(record, mode = 'detail', loadMetadata = true) {
        this.baseInit(record.module, record.id, mode);
        if (loadMetadata) {
            this.loadMetadata().pipe(take(1), tap(() => {
                this.setRecord(record);
            })).subscribe();
        }
    }
    /**
     * Init staging
     * @param {object} record
     */
    initStaging(record) {
        const baseRecord = deepClone(this.recordStore.extractBaseRecord(record));
        this.recordStore.setStaging(baseRecord);
    }
    /**
     * Set Record
     * @param {object} record
     */
    setRecord(record) {
        const baseRecord = deepClone(this.recordStore.extractBaseRecord(record));
        this.recordStore.setRecord(baseRecord);
    }
    /**
     * Set Metadata
     * @param {object} meta
     */
    setMetadata(meta) {
        this.updateMetadataState(meta);
        this.setMetadataLoading(false);
    }
    /**
     * Clean destroy
     */
    destroy() {
        this.clear();
    }
    /**
     * Clear observable cache
     */
    clear() {
        this.updateState(deepClone(initialState));
        this.recordStore.destroy();
        this.recordStore = null;
    }
    /**
     * Clear observable cache
     */
    clearAuthBased() {
        this.clear();
    }
    /**
     * Get staging record
     *
     * @returns {string} ViewMode
     */
    getBaseRecord() {
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
    /**
     * Set loading flag
     *
     * @param {boolean} loading flag
     */
    setDataLoading(loading) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { loading: Object.assign(Object.assign({}, this.internalState.loading), { data: loading }) }));
    }
    /**
     * Set loading flag
     *
     * @param {boolean} loading flag
     */
    setMetadataLoading(loading) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { loading: Object.assign(Object.assign({}, this.internalState.loading), { metadata: loading }) }));
    }
    /**
     * Save record
     */
    save() {
        this.setDataLoading(true);
        return this.recordStore.save().pipe(catchError(() => {
            this.message.addDangerMessageByKey('LBL_ERROR_SAVING');
            return of({});
        }), finalize(() => {
            this.setDataLoading(false);
        }));
    }
    /**
     * Validate search filter fields
     *
     * @returns {object} Observable<boolean>
     */
    validate() {
        return this.recordStore.validate();
    }
    /**
     * Load / reload record using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<RecordViewState>
     */
    load(useCache = true) {
        this.setDataLoading(true);
        return this.recordStore.retrieveRecord(this.internalState.module, this.internalState.recordId, useCache).pipe(tap((data) => {
            this.updateState(Object.assign(Object.assign({}, this.internalState), { recordId: data.id, module: data.module }));
        }), finalize(() => {
            this.setDataLoading(false);
        }));
    }
    /**
     * Load / reload record using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<RecordViewState>
     */
    loadMetadata(useCache = true) {
        this.setMetadataLoading(true);
        return this.meta.getMetadata(this.internalState.module).pipe(map(metadata => metadata.recordView), tap((meta) => {
            this.updateMetadataState(meta);
        }), finalize(() => {
            this.setMetadataLoading(false);
        }));
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
     * Update the metadata state
     *
     * @param {object} state to set
     */
    updateMetadataState(state) {
        this.metadataStore.next(this.metadataState = state);
    }
    /**
     * Get record view metadata
     *
     * @returns {object} metadata M
     */
    getMetadata() {
        return deepClone(this.metadataState);
    }
    /**
     * Base store initialization
     * @param module
     * @param recordId
     * @param mode
     */
    baseInit(module, recordId, mode = 'detail') {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { module,
            recordId,
            mode }));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1yZWNvcmQtY29udGFpbmVyLnN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3N0b3JlL3JlY29yZC1jb250YWluZXIvYmFzZS1yZWNvcmQtY29udGFpbmVyLnN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsZUFBZSxFQUFFLFFBQVEsRUFBYyxFQUFFLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFDN0UsT0FBTyxFQUFDLFNBQVMsRUFBcUQsTUFBTSxRQUFRLENBQUM7QUFDckYsT0FBTyxFQUFDLFVBQVUsRUFBRSxvQkFBb0IsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQVcxRixNQUFNLFlBQVksR0FBeUI7SUFDdkMsTUFBTSxFQUFFLEVBQUU7SUFDVixRQUFRLEVBQUUsRUFBRTtJQUNaLE9BQU8sRUFBRTtRQUNMLElBQUksRUFBRSxLQUFLO1FBQ1gsUUFBUSxFQUFFLEtBQUs7S0FDbEI7SUFDRCxJQUFJLEVBQUUsUUFBUTtDQUNqQixDQUFDO0FBRUYsTUFBTSxPQUFnQix3QkFBd0I7SUEwQjFDLFlBQ2MsYUFBNEIsRUFDNUIsSUFBbUIsRUFDbkIsT0FBdUIsRUFDdkIsWUFBMEIsRUFDMUIsUUFBdUIsRUFDdkIsWUFBZ0M7UUFMaEMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsU0FBSSxHQUFKLElBQUksQ0FBZTtRQUNuQixZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUN2QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixhQUFRLEdBQVIsUUFBUSxDQUFlO1FBQ3ZCLGlCQUFZLEdBQVosWUFBWSxDQUFvQjtRQWY5QywwQkFBMEI7UUFDaEIsa0JBQWEsR0FBeUIsU0FBUyxDQUFDLFlBQVksQ0FBQyxD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VUFBVSxDQUFDLEVBQ3BDLEdBQUcsQ0FBQyxDQUFDLElBQU8sRUFBRSxFQUFFO1lBQ1osSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxFQUNGLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDVixJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQ0wsQ0FBQztJQUNOLENBQUM7SUFVRDs7OztPQUlHO0lBQ08sV0FBVyxDQUFDLEtBQTJCO1FBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyxtQkFBbUIsQ0FBQyxLQUFRO1FBQ2xDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyxXQUFXO1FBQ2pCLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDTyxRQUFRLENBQUMsTUFBYyxFQUFFLFFBQWdCLEVBQUUsT0FBaUIsUUFBb0I7UUFDdEYsSUFBSSxDQUFDLFdBQVcsaUNBQ1QsSUFBSSxDQUFDLGFBQWEsS0FDckIsTUFBTTtZQUNOLFFBQVE7WUFDUixJQUFJLElBQ04sQ0FBQztJQUNQLENBQUM7Q0FFSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGZvcmtKb2luLCBPYnNlcnZhYmxlLCBvZiwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZGVlcENsb25lLCBSZWNvcmQsIFZpZXdDb250ZXh0LCBWaWV3RmllbGREZWZpbml0aW9uLCBWaWV3TW9kZX0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7Y2F0Y2hFcnJvciwgZGlzdGluY3RVbnRpbENoYW5nZWQsIGZpbmFsaXplLCBtYXAsIHRha2UsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtSZWNvcmRTdG9yZX0gZnJvbSAnLi4vcmVjb3JkL3JlY29yZC5zdG9yZSc7XG5pbXBvcnQge0FwcFN0YXRlU3RvcmV9IGZyb20gJy4uL2FwcC1zdGF0ZS9hcHAtc3RhdGUuc3RvcmUnO1xuaW1wb3J0IHtNZXRhZGF0YVN0b3JlfSBmcm9tICcuLi9tZXRhZGF0YS9tZXRhZGF0YS5zdG9yZS5zZXJ2aWNlJztcbmltcG9ydCB7RmllbGRNYW5hZ2VyfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZWNvcmQvZmllbGQvZmllbGQubWFuYWdlcic7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tZXNzYWdlL21lc3NhZ2Uuc2VydmljZSc7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmV9IGZyb20gJy4uL2xhbmd1YWdlL2xhbmd1YWdlLnN0b3JlJztcbmltcG9ydCB7UmVjb3JkU3RvcmVGYWN0b3J5fSBmcm9tICcuLi9yZWNvcmQvcmVjb3JkLnN0b3JlLmZhY3RvcnknO1xuaW1wb3J0IHtTdGF0ZVN0b3JlfSBmcm9tICcuLi9zdGF0ZSc7XG5pbXBvcnQge1JlY29yZENvbnRhaW5lclN0YXRlfSBmcm9tICcuL3JlY29yZC1jb250YWluZXIuc3RvcmUubW9kZWwnO1xuXG5jb25zdCBpbml0aWFsU3RhdGU6IFJlY29yZENvbnRhaW5lclN0YXRlID0ge1xuICAgIG1vZHVsZTogJycsXG4gICAgcmVjb3JkSWQ6ICcnLFxuICAgIGxvYWRpbmc6IHtcbiAgICAgICAgZGF0YTogZmFsc2UsXG4gICAgICAgIG1ldGFkYXRhOiBmYWxzZVxuICAgIH0sXG4gICAgbW9kZTogJ2RldGFpbCcsXG59O1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZVJlY29yZENvbnRhaW5lclN0b3JlPE0+IGltcGxlbWVudHMgU3RhdGVTdG9yZSB7XG5cbiAgICAvKipcbiAgICAgKiBQdWJsaWMgbG9uZy1saXZlZCBvYnNlcnZhYmxlIHN0cmVhbXNcbiAgICAgKi9cbiAgICByZWNvcmQkOiBPYnNlcnZhYmxlPFJlY29yZD47XG4gICAgc3RhZ2luZ1JlY29yZCQ6IE9ic2VydmFibGU8UmVjb3JkPjtcbiAgICBsb2FkaW5nJDogT2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICBtb2RlJDogT2JzZXJ2YWJsZTxWaWV3TW9kZT47XG4gICAgbWV0YSQ6IE9ic2VydmFibGU8TT47XG5cbiAgICAvKipcbiAgICAgKiBWaWV3LW1vZGVsIHRoYXQgcmVzb2x2ZXMgb25jZSBhbGwgdGhlIGRhdGEgaXMgcmVhZHkgKG9yIHVwZGF0ZWQpLlxuICAgICAqL1xuICAgIHZtJDogT2JzZXJ2YWJsZTxSZWNvcmRDb250YWluZXJTdGF0ZT47XG4gICAgcmVjb3JkU3RvcmU6IFJlY29yZFN0b3JlO1xuXG4gICAgLyoqIEludGVybmFsIFByb3BlcnRpZXMgKi9cbiAgICBwcm90ZWN0ZWQgaW50ZXJuYWxTdGF0ZTogUmVjb3JkQ29udGFpbmVyU3RhdGUgPSBkZWVwQ2xvbmUoaW5pdGlhbFN0YXRlKTtcbiAgICBwcm90ZWN0ZWQgbWV0YWRhdGFTdGF0ZTogTSA9IGRlZXBDbG9uZSh7fSBhcyBNKTtcbiAgICBwcm90ZWN0ZWQgc3RvcmUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFJlY29yZENvbnRhaW5lclN0YXRlPih0aGlzLmludGVybmFsU3RhdGUpO1xuICAgIHByb3RlY3RlZCBzdGF0ZSQgPSB0aGlzLnN0b3JlLmFzT2JzZXJ2YWJsZSgpO1xuICAgIHByb3RlY3RlZCBtZXRhZGF0YVN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxNPih7fSBhcyBNKTtcbiAgICBwcm90ZWN0ZWQgbWV0YWRhdGFTdGF0ZSQgPSB0aGlzLm1ldGFkYXRhU3RvcmUuYXNPYnNlcnZhYmxlKCk7XG4gICAgcHJvdGVjdGVkIHN1YnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGFwcFN0YXRlU3RvcmU6IEFwcFN0YXRlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBtZXRhOiBNZXRhZGF0YVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbWVzc2FnZTogTWVzc2FnZVNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBmaWVsZE1hbmFnZXI6IEZpZWxkTWFuYWdlcixcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgc3RvcmVGYWN0b3J5OiBSZWNvcmRTdG9yZUZhY3RvcnlcbiAgICApIHtcbiAgICAgICAgdGhpcy5tZXRhJCA9IHRoaXMubWV0YWRhdGFTdGF0ZSQ7XG5cbiAgICAgICAgdGhpcy5yZWNvcmRTdG9yZSA9IHN0b3JlRmFjdG9yeS5jcmVhdGUodGhpcy5nZXRWaWV3RmllbGRzJCgpKTtcblxuICAgICAgICB0aGlzLnJlY29yZCQgPSB0aGlzLnJlY29yZFN0b3JlLnN0YXRlJC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpO1xuICAgICAgICB0aGlzLnN0YWdpbmdSZWNvcmQkID0gdGhpcy5yZWNvcmRTdG9yZS5zdGFnaW5nJC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpO1xuICAgICAgICB0aGlzLmxvYWRpbmckID0gdGhpcy5zdGF0ZSQucGlwZShtYXAoc3RhdGUgPT4gc3RhdGUubG9hZGluZy5kYXRhIHx8IHN0YXRlLmxvYWRpbmcubWV0YWRhdGEpKTtcbiAgICAgICAgdGhpcy5tb2RlJCA9IHRoaXMuc3RhdGUkLnBpcGUobWFwKHN0YXRlID0+IHN0YXRlLm1vZGUpKTtcbiAgICAgICAgdGhpcy52bSQgPSB0aGlzLnN0YXRlJDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgY3VycmVudCBtb2R1bGUgbmFtZVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IG1vZHVsZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRNb2R1bGVOYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsU3RhdGUubW9kdWxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBjdXJyZW50IHJlY29yZCBpZFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGlkXG4gICAgICovXG4gICAgcHVibGljIGdldFJlY29yZElkKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsU3RhdGUucmVjb3JkSWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IFZpZXcgQ29udGV4dFxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IFZpZXdDb250ZXh0XG4gICAgICovXG4gICAgcHVibGljIGdldFZpZXdDb250ZXh0KCk6IFZpZXdDb250ZXh0IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG1vZHVsZTogdGhpcy5nZXRNb2R1bGVOYW1lKCksXG4gICAgICAgICAgICBpZDogdGhpcy5nZXRSZWNvcmRJZCgpLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWwgcmVjb3JkIGxvYWQgaWYgbm90IGNhY2hlZCBhbmQgdXBkYXRlIHN0YXRlLlxuICAgICAqIFJldHVybnMgb2JzZXJ2YWJsZSB0byBiZSB1c2VkIGluIHJlc29sdmVyIGlmIG5lZWRlZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZHVsZSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVjb3JkSWQgdG8gdXNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGUgdG8gdXNlXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxhbnk+XG4gICAgICovXG4gICAgcHVibGljIGluaXQobW9kdWxlOiBzdHJpbmcsIHJlY29yZElkOiBzdHJpbmcsIG1vZGU6IFZpZXdNb2RlID0gJ2RldGFpbCcgYXMgVmlld01vZGUpOiBPYnNlcnZhYmxlPFJlY29yZD4ge1xuXG4gICAgICAgIHRoaXMuYmFzZUluaXQobW9kdWxlLCByZWNvcmRJZCwgbW9kZSk7XG5cbiAgICAgICAgdGhpcy5zZXRNZXRhZGF0YUxvYWRpbmcodHJ1ZSk7XG5cbiAgICAgICAgY29uc3QgZGF0YU1hcCA9IHtcbiAgICAgICAgICAgICRtZXRhOiB0aGlzLmxvYWRNZXRhZGF0YSgpLFxuICAgICAgICAgICAgcmVjb3JkOiB0aGlzLmxvYWQoKVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0ICRkYXRhID0gZm9ya0pvaW4oZGF0YU1hcCk7XG5cbiAgICAgICAgcmV0dXJuICRkYXRhLnBpcGUoXG4gICAgICAgICAgICBtYXAoKHttZXRhLCByZWNvcmR9KSA9PiByZWNvcmQpLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXQgcmVjb3JkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RlIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbG9hZE1ldGFkYXRhIHRvIHVzZVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IE9ic2VydmFibGU8YW55PlxuICAgICAqL1xuICAgIHB1YmxpYyBpbml0UmVjb3JkKHJlY29yZDogUmVjb3JkLCBtb2RlOiBWaWV3TW9kZSA9ICdkZXRhaWwnIGFzIFZpZXdNb2RlLCBsb2FkTWV0YWRhdGEgPSB0cnVlKTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5iYXNlSW5pdChyZWNvcmQubW9kdWxlLCByZWNvcmQuaWQsIG1vZGUpO1xuXG4gICAgICAgIGlmIChsb2FkTWV0YWRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZE1ldGFkYXRhKCkucGlwZShcbiAgICAgICAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICAgICAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0UmVjb3JkKHJlY29yZCk7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICApLnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdCBzdGFnaW5nXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlY29yZFxuICAgICAqL1xuICAgIHB1YmxpYyBpbml0U3RhZ2luZyhyZWNvcmQ6IFJlY29yZCkge1xuICAgICAgICBjb25zdCBiYXNlUmVjb3JkOiBSZWNvcmQgPSBkZWVwQ2xvbmUodGhpcy5yZWNvcmRTdG9yZS5leHRyYWN0QmFzZVJlY29yZChyZWNvcmQpKTtcbiAgICAgICAgdGhpcy5yZWNvcmRTdG9yZS5zZXRTdGFnaW5nKGJhc2VSZWNvcmQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBSZWNvcmRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkXG4gICAgICovXG4gICAgcHVibGljIHNldFJlY29yZChyZWNvcmQ6IFJlY29yZCkge1xuICAgICAgICBjb25zdCBiYXNlUmVjb3JkOiBSZWNvcmQgPSBkZWVwQ2xvbmUodGhpcy5yZWNvcmRTdG9yZS5leHRyYWN0QmFzZVJlY29yZChyZWNvcmQpKTtcbiAgICAgICAgdGhpcy5yZWNvcmRTdG9yZS5zZXRSZWNvcmQoYmFzZVJlY29yZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IE1ldGFkYXRhXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG1ldGFcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0TWV0YWRhdGEobWV0YTogTSkge1xuICAgICAgICB0aGlzLnVwZGF0ZU1ldGFkYXRhU3RhdGUobWV0YSk7XG4gICAgICAgIHRoaXMuc2V0TWV0YWRhdGFMb2FkaW5nKGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhbiBkZXN0cm95XG4gICAgICovXG4gICAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhciBvYnNlcnZhYmxlIGNhY2hlXG4gICAgICovXG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKGRlZXBDbG9uZShpbml0aWFsU3RhdGUpKTtcbiAgICAgICAgdGhpcy5yZWNvcmRTdG9yZS5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMucmVjb3JkU3RvcmUgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFyIG9ic2VydmFibGUgY2FjaGVcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xlYXJBdXRoQmFzZWQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgc3RhZ2luZyByZWNvcmRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFZpZXdNb2RlXG4gICAgICovXG4gICAgcHVibGljIGdldEJhc2VSZWNvcmQoKTogUmVjb3JkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVjb3JkU3RvcmUuZ2V0QmFzZVJlY29yZCgpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgdmlldyBtb2RlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBWaWV3TW9kZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRNb2RlKCk6IFZpZXdNb2RlIHtcbiAgICAgICAgaWYgKCF0aGlzLmludGVybmFsU3RhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsU3RhdGUubW9kZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgbmV3IG1vZGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RlIFZpZXdNb2RlXG4gICAgICovXG4gICAgcHVibGljIHNldE1vZGUobW9kZTogVmlld01vZGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSh7Li4udGhpcy5pbnRlcm5hbFN0YXRlLCBtb2RlfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IGxvYWRpbmcgZmxhZ1xuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSBsb2FkaW5nIGZsYWdcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0RGF0YUxvYWRpbmcobG9hZGluZzogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHtcbiAgICAgICAgICAgIC4uLnRoaXMuaW50ZXJuYWxTdGF0ZSxcbiAgICAgICAgICAgIGxvYWRpbmc6IHtcbiAgICAgICAgICAgICAgICAuLi50aGlzLmludGVybmFsU3RhdGUubG9hZGluZyxcbiAgICAgICAgICAgICAgICBkYXRhOiBsb2FkaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBsb2FkaW5nIGZsYWdcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbG9hZGluZyBmbGFnXG4gICAgICovXG4gICAgcHVibGljIHNldE1ldGFkYXRhTG9hZGluZyhsb2FkaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoe1xuICAgICAgICAgICAgLi4udGhpcy5pbnRlcm5hbFN0YXRlLFxuICAgICAgICAgICAgbG9hZGluZzoge1xuICAgICAgICAgICAgICAgIC4uLnRoaXMuaW50ZXJuYWxTdGF0ZS5sb2FkaW5nLFxuICAgICAgICAgICAgICAgIG1ldGFkYXRhOiBsb2FkaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNhdmUgcmVjb3JkXG4gICAgICovXG4gICAgcHVibGljIHNhdmUoKTogT2JzZXJ2YWJsZTxSZWNvcmQ+IHtcbiAgICAgICAgdGhpcy5zZXREYXRhTG9hZGluZyh0cnVlKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5yZWNvcmRTdG9yZS5zYXZlKCkucGlwZShcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZS5hZGREYW5nZXJNZXNzYWdlQnlLZXkoJ0xCTF9FUlJPUl9TQVZJTkcnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2Yoe30gYXMgUmVjb3JkKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgZmluYWxpemUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YUxvYWRpbmcoZmFsc2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGF0ZSBzZWFyY2ggZmlsdGVyIGZpZWxkc1xuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxib29sZWFuPlxuICAgICAqL1xuICAgIHB1YmxpYyB2YWxpZGF0ZSgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcblxuICAgICAgICByZXR1cm4gdGhpcy5yZWNvcmRTdG9yZS52YWxpZGF0ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvYWQgLyByZWxvYWQgcmVjb3JkIHVzaW5nIGN1cnJlbnQgcGFnaW5hdGlvbiBhbmQgY3JpdGVyaWFcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdXNlQ2FjaGUgaWYgdG8gdXNlIGNhY2hlXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxSZWNvcmRWaWV3U3RhdGU+XG4gICAgICovXG4gICAgcHVibGljIGxvYWQodXNlQ2FjaGUgPSB0cnVlKTogT2JzZXJ2YWJsZTxSZWNvcmQ+IHtcblxuICAgICAgICB0aGlzLnNldERhdGFMb2FkaW5nKHRydWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJlY29yZFN0b3JlLnJldHJpZXZlUmVjb3JkKFxuICAgICAgICAgICAgdGhpcy5pbnRlcm5hbFN0YXRlLm1vZHVsZSxcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuYWxTdGF0ZS5yZWNvcmRJZCxcbiAgICAgICAgICAgIHVzZUNhY2hlXG4gICAgICAgICkucGlwZShcbiAgICAgICAgICAgIHRhcCgoZGF0YTogUmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuaW50ZXJuYWxTdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkSWQ6IGRhdGEuaWQsXG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZTogZGF0YS5tb2R1bGUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGZpbmFsaXplKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGFMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9hZCAvIHJlbG9hZCByZWNvcmQgdXNpbmcgY3VycmVudCBwYWdpbmF0aW9uIGFuZCBjcml0ZXJpYVxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSB1c2VDYWNoZSBpZiB0byB1c2UgY2FjaGVcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBPYnNlcnZhYmxlPFJlY29yZFZpZXdTdGF0ZT5cbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZE1ldGFkYXRhKHVzZUNhY2hlID0gdHJ1ZSk6IE9ic2VydmFibGU8TT4ge1xuXG4gICAgICAgIHRoaXMuc2V0TWV0YWRhdGFMb2FkaW5nKHRydWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1ldGEuZ2V0TWV0YWRhdGEodGhpcy5pbnRlcm5hbFN0YXRlLm1vZHVsZSkucGlwZShcbiAgICAgICAgICAgIG1hcChtZXRhZGF0YSA9PiBtZXRhZGF0YS5yZWNvcmRWaWV3KSxcbiAgICAgICAgICAgIHRhcCgobWV0YTogTSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTWV0YWRhdGFTdGF0ZShtZXRhKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgZmluYWxpemUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TWV0YWRhdGFMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHZpZXcgZmllbGRzIG9ic2VydmFibGVcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IE9ic2VydmFibGU8Vmlld0ZpZWxkRGVmaW5pdGlvbltdPlxuICAgICAqL1xuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRWaWV3RmllbGRzJCgpOiBPYnNlcnZhYmxlPFZpZXdGaWVsZERlZmluaXRpb25bXT47XG5cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aGUgc3RhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZSB0byBzZXRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgdXBkYXRlU3RhdGUoc3RhdGU6IFJlY29yZENvbnRhaW5lclN0YXRlKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RvcmUubmV4dCh0aGlzLmludGVybmFsU3RhdGUgPSBzdGF0ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBtZXRhZGF0YSBzdGF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHN0YXRlIHRvIHNldFxuICAgICAqL1xuICAgIHByb3RlY3RlZCB1cGRhdGVNZXRhZGF0YVN0YXRlKHN0YXRlOiBNKTogdm9pZCB7XG4gICAgICAgIHRoaXMubWV0YWRhdGFTdG9yZS5uZXh0KHRoaXMubWV0YWRhdGFTdGF0ZSA9IHN0YXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmVjb3JkIHZpZXcgbWV0YWRhdGFcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IG1ldGFkYXRhIE1cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0TWV0YWRhdGEoKTogTSB7XG4gICAgICAgIHJldHVybiBkZWVwQ2xvbmUodGhpcy5tZXRhZGF0YVN0YXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCYXNlIHN0b3JlIGluaXRpYWxpemF0aW9uXG4gICAgICogQHBhcmFtIG1vZHVsZVxuICAgICAqIEBwYXJhbSByZWNvcmRJZFxuICAgICAqIEBwYXJhbSBtb2RlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGJhc2VJbml0KG1vZHVsZTogc3RyaW5nLCByZWNvcmRJZDogc3RyaW5nLCBtb2RlOiBWaWV3TW9kZSA9ICdkZXRhaWwnIGFzIFZpZXdNb2RlKSB7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoe1xuICAgICAgICAgICAgLi4udGhpcy5pbnRlcm5hbFN0YXRlLFxuICAgICAgICAgICAgbW9kdWxlLFxuICAgICAgICAgICAgcmVjb3JkSWQsXG4gICAgICAgICAgICBtb2RlXG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuIl19