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
import { __rest } from "tslib";
import { deepClone } from 'common';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, shareReplay, startWith, take, tap } from 'rxjs/operators';
const initialState = {
    id: '',
    type: '',
    module: '',
    attributes: {},
    acls: []
};
export class RecordStore {
    constructor(definitions$, recordSaveGQL, recordFetchGQL, message, recordManager, recordMappers) {
        this.definitions$ = definitions$;
        this.recordSaveGQL = recordSaveGQL;
        this.recordFetchGQL = recordFetchGQL;
        this.message = message;
        this.recordManager = recordManager;
        this.recordMappers = recordMappers;
        this.cache$ = null;
        this.internalState = deepClone(initialState);
        this.stagingState = deepClone(initialState);
        this.store = new BehaviorSubject(this.internalState);
        this.staging = new BehaviorSubject(this.stagingState);
        this.definitions = [];
        this.subs = [];
        this.fieldsMetadata = {
            fields: [
                '_id',
                'id',
                'attributes',
                'module',
                'type',
                'acls'
            ]
        };
        this.state$ = this.store.asObservable().pipe(distinctUntilChanged());
        this.staging$ = this.staging.asObservable();
        this.subs.push(this.state$.subscribe(record => {
            this.updateStaging(record);
        }));
        this.subs.push(definitions$.subscribe(definitions => {
            this.definitions = definitions;
            this.init(this.internalState);
        }));
    }
    init(record) {
        const newRecord = Object.assign({}, record);
        this.initRecord(newRecord);
        this.updateState(newRecord);
    }
    getStaging() {
        if (!this.stagingState) {
            return null;
        }
        return this.stagingState;
    }
    setStaging(record) {
        this.initRecord(record);
        this.staging.next(this.stagingState = record);
    }
    setRecord(record) {
        this.initRecord(record);
        this.updateState(record);
    }
    save() {
        this.mapStagingFields();
        return this.recordSaveGQL.save(this.stagingState).pipe(tap((record) => {
            this.initRecord(record);
            this.updateState(record);
        }));
    }
    validate() {
        this.stagingState.formGroup.markAllAsTouched();
        return this.stagingState.formGroup.statusChanges.pipe(startWith(this.stagingState.formGroup.status), filter(status => status !== 'PENDING'), take(1), map(status => status === 'VALID'));
    }
    resetStaging() {
        this.updateStaging(this.internalState);
    }
    destroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    /**
     * Get record
     *
     * @returns {object} Record
     */
    getBaseRecord() {
        if (!this.internalState) {
            return null;
        }
        const baseRecord = {
            id: this.internalState.id,
            type: this.internalState.type,
            module: this.internalState.module,
            attributes: this.internalState.attributes,
            acls: this.internalState.acls
        };
        return deepClone(baseRecord);
    }
    /**
     * Get record
     *
     * @returns {object} Record
     */
    getBaseStaging() {
        if (!this.stagingState) {
            return null;
        }
        this.mapStagingFields();
        const baseRecord = {
            id: this.stagingState.id,
            type: this.stagingState.type,
            module: this.stagingState.module,
            attributes: this.stagingState.attributes,
            acls: this.stagingState.acls
        };
        return deepClone(baseRecord);
    }
    /**
     * Extract base record
     *
     * @returns {object} Record
     */
    extractBaseRecord(record) {
        const { fields, formGroup } = record, base = __rest(record, ["fields", "formGroup"]);
        return Object.assign({}, base);
    }
    /**
     * Is staging record dirty
     *
     * @returns {object} Record
     */
    isDirty() {
        if (!this.stagingState || !this.stagingState.formGroup) {
            return false;
        }
        return this.stagingState.formGroup.dirty;
    }
    /**
     * Get record cached Observable or call the backend
     *
     * @param {string} module to use
     * @param {string} recordId to use
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<any>
     */
    retrieveRecord(module, recordId, useCache = true) {
        if (this.cache$ == null || useCache === false) {
            this.cache$ = this.fetch(module, recordId).pipe(tap(record => this.init(record)), shareReplay(1));
        }
        return this.cache$;
    }
    /**
     * Internal API
     */
    /**
     * Update the state
     *
     * @param {object} state to set
     */
    updateState(state) {
        this.store.next(this.internalState = state);
    }
    /**
     * Update the staging
     *
     * @param {object} state to set
     */
    updateStaging(state) {
        const newState = deepClone(this.extractBaseRecord(state));
        this.initRecord(newState);
        this.staging.next(this.stagingState = newState);
    }
    /**
     * Map staging fields
     */
    mapStagingFields() {
        const mappers = this.recordMappers.get(this.stagingState.module);
        Object.keys(mappers).forEach(key => {
            const mapper = mappers[key];
            mapper.map(this.stagingState);
        });
    }
    /**
     * Init record fields
     *
     * @param {object} record Record
     */
    initRecord(record) {
        if (record.module && this.definitions && this.definitions.length > 0) {
            record.fields = this.recordManager.initFields(record, this.definitions);
        }
    }
    /**
     * Fetch the record from the backend
     *
     * @param {string} module to use
     * @param {string} recordID to use
     * @returns {object} Observable<any>
     */
    fetch(module, recordID) {
        return this.recordFetchGQL.fetch(module, recordID, this.fieldsMetadata)
            .pipe(map(({ data }) => {
            const record = {
                type: '',
                module: '',
                attributes: {},
                acls: []
            };
            if (!data) {
                return record;
            }
            const id = data.getRecord.attributes.id;
            if (!id) {
                this.message.addDangerMessageByKey('LBL_RECORD_DOES_NOT_EXIST');
                return record;
            }
            record.id = id;
            record.module = module;
            record.type = data.getRecord.attributes && data.getRecord.attributes.object_name;
            record.attributes = data.getRecord.attributes;
            record.acls = data.getRecord.acls;
            return record;
        }), catchError(err => throwError(err)));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLnN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3N0b3JlL3JlY29yZC9yZWNvcmQuc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRzs7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUE0RSxNQUFNLFFBQVEsQ0FBQztBQUM1RyxPQUFPLEVBQUMsZUFBZSxFQUE0QixVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDM0UsT0FBTyxFQUFDLFVBQVUsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBTWhILE1BQU0sWUFBWSxHQUFHO0lBQ2pCLEVBQUUsRUFBRSxFQUFFO0lBQ04sSUFBSSxFQUFFLEVBQUU7SUFDUixNQUFNLEVBQUUsRUFBRTtJQUNWLFVBQVUsRUFBRSxFQUFFO0lBQ2QsSUFBSSxFQUFFLEVBQUU7Q0FDRCxDQUFDO0FBRVosTUFBTSxPQUFPLFdBQVc7SUFzQnBCLFlBQ2MsWUFBK0MsRUFDL0MsYUFBNEIsRUFDNUIsY0FBOEIsRUFDOUIsT0FBdUIsRUFDdkIsYUFBNEIsRUFDNUIsYUFBbUM7UUFMbkMsaUJBQVksR0FBWixZQUFZLENBQW1DO1FBQy9DLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUN2QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixrQkFBYSxHQUFiLGFBQWEsQ0FBc0I7UUF4QnZDLFdBQU0sR0FBb0IsSUFBSSxDQUFDO1FBQy9CLGtCQUFhLEdBQVcsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2hELGlCQUFZLEdBQVcsU0FBUyxDQUFDLFlBQVks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bnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtkZWVwQ2xvbmUsIE1hcEVudHJ5LCBSZWNvcmQsIFJlY29yZE1hcHBlciwgUmVjb3JkTWFwcGVyUmVnaXN0cnksIFZpZXdGaWVsZERlZmluaXRpb259IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uLCB0aHJvd0Vycm9yfSBmcm9tICdyeGpzJztcbmltcG9ydCB7Y2F0Y2hFcnJvciwgZGlzdGluY3RVbnRpbENoYW5nZWQsIGZpbHRlciwgbWFwLCBzaGFyZVJlcGxheSwgc3RhcnRXaXRoLCB0YWtlLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7UmVjb3JkRmV0Y2hHUUx9IGZyb20gJy4vZ3JhcGhxbC9hcGkucmVjb3JkLmdldCc7XG5pbXBvcnQge1JlY29yZFNhdmVHUUx9IGZyb20gJy4vZ3JhcGhxbC9hcGkucmVjb3JkLnNhdmUnO1xuaW1wb3J0IHtNZXNzYWdlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWVzc2FnZS9tZXNzYWdlLnNlcnZpY2UnO1xuaW1wb3J0IHtSZWNvcmRNYW5hZ2VyfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZWNvcmQvcmVjb3JkLm1hbmFnZXInO1xuXG5jb25zdCBpbml0aWFsU3RhdGUgPSB7XG4gICAgaWQ6ICcnLFxuICAgIHR5cGU6ICcnLFxuICAgIG1vZHVsZTogJycsXG4gICAgYXR0cmlidXRlczoge30sXG4gICAgYWNsczogW11cbn0gYXMgUmVjb3JkO1xuXG5leHBvcnQgY2xhc3MgUmVjb3JkU3RvcmUge1xuXG4gICAgc3RhdGUkOiBPYnNlcnZhYmxlPFJlY29yZD47XG4gICAgc3RhZ2luZyQ6IE9ic2VydmFibGU8UmVjb3JkPjtcbiAgICBwcm90ZWN0ZWQgY2FjaGUkOiBPYnNlcnZhYmxlPGFueT4gPSBudWxsO1xuICAgIHByb3RlY3RlZCBpbnRlcm5hbFN0YXRlOiBSZWNvcmQgPSBkZWVwQ2xvbmUoaW5pdGlhbFN0YXRlKTtcbiAgICBwcm90ZWN0ZWQgc3RhZ2luZ1N0YXRlOiBSZWNvcmQgPSBkZWVwQ2xvbmUoaW5pdGlhbFN0YXRlKTtcbiAgICBwcm90ZWN0ZWQgc3RvcmUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFJlY29yZD4odGhpcy5pbnRlcm5hbFN0YXRlKTtcbiAgICBwcm90ZWN0ZWQgc3RhZ2luZyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UmVjb3JkPih0aGlzLnN0YWdpbmdTdGF0ZSk7XG4gICAgcHJvdGVjdGVkIGRlZmluaXRpb25zOiBWaWV3RmllbGREZWZpbml0aW9uW10gPSBbXTtcbiAgICBwcm90ZWN0ZWQgc3ViczogU3Vic2NyaXB0aW9uW10gPSBbXTtcbiAgICBwcm90ZWN0ZWQgZmllbGRzTWV0YWRhdGEgPSB7XG4gICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgJ19pZCcsXG4gICAgICAgICAgICAnaWQnLFxuICAgICAgICAgICAgJ2F0dHJpYnV0ZXMnLFxuICAgICAgICAgICAgJ21vZHVsZScsXG4gICAgICAgICAgICAndHlwZScsXG4gICAgICAgICAgICAnYWNscydcbiAgICAgICAgXVxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGRlZmluaXRpb25zJDogT2JzZXJ2YWJsZTxWaWV3RmllbGREZWZpbml0aW9uW10+LFxuICAgICAgICBwcm90ZWN0ZWQgcmVjb3JkU2F2ZUdRTDogUmVjb3JkU2F2ZUdRTCxcbiAgICAgICAgcHJvdGVjdGVkIHJlY29yZEZldGNoR1FMOiBSZWNvcmRGZXRjaEdRTCxcbiAgICAgICAgcHJvdGVjdGVkIG1lc3NhZ2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgcmVjb3JkTWFuYWdlcjogUmVjb3JkTWFuYWdlcixcbiAgICAgICAgcHJvdGVjdGVkIHJlY29yZE1hcHBlcnM6IFJlY29yZE1hcHBlclJlZ2lzdHJ5LFxuICAgICkge1xuXG5cbiAgICAgICAgdGhpcy5zdGF0ZSQgPSB0aGlzLnN0b3JlLmFzT2JzZXJ2YWJsZSgpLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG4gICAgICAgIHRoaXMuc3RhZ2luZyQgPSB0aGlzLnN0YWdpbmcuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICAgICAgdGhpcy5zdWJzLnB1c2godGhpcy5zdGF0ZSQuc3Vic2NyaWJlKHJlY29yZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YWdpbmcocmVjb3JkKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHRoaXMuc3Vicy5wdXNoKGRlZmluaXRpb25zJC5zdWJzY3JpYmUoZGVmaW5pdGlvbnMgPT4ge1xuICAgICAgICAgICAgdGhpcy5kZWZpbml0aW9ucyA9IGRlZmluaXRpb25zO1xuICAgICAgICAgICAgdGhpcy5pbml0KHRoaXMuaW50ZXJuYWxTdGF0ZSk7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBpbml0KHJlY29yZDogUmVjb3JkKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5ld1JlY29yZCA9IHtcbiAgICAgICAgICAgIC4uLnJlY29yZCxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmluaXRSZWNvcmQobmV3UmVjb3JkKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKG5ld1JlY29yZCk7XG4gICAgfVxuXG4gICAgZ2V0U3RhZ2luZygpOiBSZWNvcmQge1xuICAgICAgICBpZiAoIXRoaXMuc3RhZ2luZ1N0YXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zdGFnaW5nU3RhdGU7XG4gICAgfVxuXG4gICAgc2V0U3RhZ2luZyhyZWNvcmQ6IFJlY29yZCk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMuaW5pdFJlY29yZChyZWNvcmQpO1xuXG4gICAgICAgIHRoaXMuc3RhZ2luZy5uZXh0KHRoaXMuc3RhZ2luZ1N0YXRlID0gcmVjb3JkKTtcbiAgICB9XG5cbiAgICBzZXRSZWNvcmQocmVjb3JkOiBSZWNvcmQpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLmluaXRSZWNvcmQocmVjb3JkKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHJlY29yZCk7XG4gICAgfVxuXG4gICAgc2F2ZSgpOiBPYnNlcnZhYmxlPFJlY29yZD4ge1xuXG4gICAgICAgIHRoaXMubWFwU3RhZ2luZ0ZpZWxkcygpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJlY29yZFNhdmVHUUwuc2F2ZSh0aGlzLnN0YWdpbmdTdGF0ZSkucGlwZShcbiAgICAgICAgICAgIHRhcCgocmVjb3JkOiBSZWNvcmQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRSZWNvcmQocmVjb3JkKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHJlY29yZCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHZhbGlkYXRlKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuXG4gICAgICAgIHRoaXMuc3RhZ2luZ1N0YXRlLmZvcm1Hcm91cC5tYXJrQWxsQXNUb3VjaGVkKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YWdpbmdTdGF0ZS5mb3JtR3JvdXAuc3RhdHVzQ2hhbmdlcy5waXBlKFxuICAgICAgICAgICAgc3RhcnRXaXRoKHRoaXMuc3RhZ2luZ1N0YXRlLmZvcm1Hcm91cC5zdGF0dXMpLFxuICAgICAgICAgICAgZmlsdGVyKHN0YXR1cyA9PiBzdGF0dXMgIT09ICdQRU5ESU5HJyksXG4gICAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICAgICAgbWFwKHN0YXR1cyA9PiBzdGF0dXMgPT09ICdWQUxJRCcpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmVzZXRTdGFnaW5nKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YWdpbmcodGhpcy5pbnRlcm5hbFN0YXRlKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN1YnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByZWNvcmRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IFJlY29yZFxuICAgICAqL1xuICAgIGdldEJhc2VSZWNvcmQoKTogUmVjb3JkIHtcbiAgICAgICAgaWYgKCF0aGlzLmludGVybmFsU3RhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYmFzZVJlY29yZCA9IHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmludGVybmFsU3RhdGUuaWQsXG4gICAgICAgICAgICB0eXBlOiB0aGlzLmludGVybmFsU3RhdGUudHlwZSxcbiAgICAgICAgICAgIG1vZHVsZTogdGhpcy5pbnRlcm5hbFN0YXRlLm1vZHVsZSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRoaXMuaW50ZXJuYWxTdGF0ZS5hdHRyaWJ1dGVzLFxuICAgICAgICAgICAgYWNsczogdGhpcy5pbnRlcm5hbFN0YXRlLmFjbHNcbiAgICAgICAgfSBhcyBSZWNvcmQ7XG5cbiAgICAgICAgcmV0dXJuIGRlZXBDbG9uZShiYXNlUmVjb3JkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmVjb3JkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBSZWNvcmRcbiAgICAgKi9cbiAgICBnZXRCYXNlU3RhZ2luZygpOiBSZWNvcmQge1xuICAgICAgICBpZiAoIXRoaXMuc3RhZ2luZ1N0YXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWFwU3RhZ2luZ0ZpZWxkcygpO1xuXG4gICAgICAgIGNvbnN0IGJhc2VSZWNvcmQgPSB7XG4gICAgICAgICAgICBpZDogdGhpcy5zdGFnaW5nU3RhdGUuaWQsXG4gICAgICAgICAgICB0eXBlOiB0aGlzLnN0YWdpbmdTdGF0ZS50eXBlLFxuICAgICAgICAgICAgbW9kdWxlOiB0aGlzLnN0YWdpbmdTdGF0ZS5tb2R1bGUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB0aGlzLnN0YWdpbmdTdGF0ZS5hdHRyaWJ1dGVzLFxuICAgICAgICAgICAgYWNsczogdGhpcy5zdGFnaW5nU3RhdGUuYWNsc1xuICAgICAgICB9IGFzIFJlY29yZDtcblxuICAgICAgICByZXR1cm4gZGVlcENsb25lKGJhc2VSZWNvcmQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3QgYmFzZSByZWNvcmRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IFJlY29yZFxuICAgICAqL1xuICAgIGV4dHJhY3RCYXNlUmVjb3JkKHJlY29yZDogUmVjb3JkKTogUmVjb3JkIHtcbiAgICAgICAgY29uc3Qge2ZpZWxkcywgZm9ybUdyb3VwLCAuLi5iYXNlfSA9IHJlY29yZDtcblxuICAgICAgICByZXR1cm4gey4uLmJhc2V9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSXMgc3RhZ2luZyByZWNvcmQgZGlydHlcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IFJlY29yZFxuICAgICAqL1xuICAgIGlzRGlydHkoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5zdGFnaW5nU3RhdGUgfHwgIXRoaXMuc3RhZ2luZ1N0YXRlLmZvcm1Hcm91cCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhZ2luZ1N0YXRlLmZvcm1Hcm91cC5kaXJ0eTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgcmVjb3JkIGNhY2hlZCBPYnNlcnZhYmxlIG9yIGNhbGwgdGhlIGJhY2tlbmRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2R1bGUgdG8gdXNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlY29yZElkIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdXNlQ2FjaGUgaWYgdG8gdXNlIGNhY2hlXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxhbnk+XG4gICAgICovXG4gICAgcHVibGljIHJldHJpZXZlUmVjb3JkKFxuICAgICAgICBtb2R1bGU6IHN0cmluZyxcbiAgICAgICAgcmVjb3JkSWQ6IHN0cmluZyxcbiAgICAgICAgdXNlQ2FjaGUgPSB0cnVlXG4gICAgKTogT2JzZXJ2YWJsZTxSZWNvcmQ+IHtcbiAgICAgICAgaWYgKHRoaXMuY2FjaGUkID09IG51bGwgfHwgdXNlQ2FjaGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlJCA9IHRoaXMuZmV0Y2gobW9kdWxlLCByZWNvcmRJZCkucGlwZShcbiAgICAgICAgICAgICAgICB0YXAocmVjb3JkID0+IHRoaXMuaW5pdChyZWNvcmQpKSxcbiAgICAgICAgICAgICAgICBzaGFyZVJlcGxheSgxKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZSQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgQVBJXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIHN0YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc3RhdGUgdG8gc2V0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVN0YXRlKHN0YXRlOiBSZWNvcmQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdG9yZS5uZXh0KHRoaXMuaW50ZXJuYWxTdGF0ZSA9IHN0YXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIHN0YWdpbmdcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZSB0byBzZXRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgdXBkYXRlU3RhZ2luZyhzdGF0ZTogUmVjb3JkKTogdm9pZCB7XG5cbiAgICAgICAgY29uc3QgbmV3U3RhdGUgPSBkZWVwQ2xvbmUodGhpcy5leHRyYWN0QmFzZVJlY29yZChzdGF0ZSkpO1xuICAgICAgICB0aGlzLmluaXRSZWNvcmQobmV3U3RhdGUpO1xuXG4gICAgICAgIHRoaXMuc3RhZ2luZy5uZXh0KHRoaXMuc3RhZ2luZ1N0YXRlID0gbmV3U3RhdGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1hcCBzdGFnaW5nIGZpZWxkc1xuICAgICAqL1xuICAgIHByb3RlY3RlZCBtYXBTdGFnaW5nRmllbGRzKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBtYXBwZXJzOiBNYXBFbnRyeTxSZWNvcmRNYXBwZXI+ID0gdGhpcy5yZWNvcmRNYXBwZXJzLmdldCh0aGlzLnN0YWdpbmdTdGF0ZS5tb2R1bGUpO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKG1hcHBlcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1hcHBlciA9IG1hcHBlcnNba2V5XTtcbiAgICAgICAgICAgIG1hcHBlci5tYXAodGhpcy5zdGFnaW5nU3RhdGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0IHJlY29yZCBmaWVsZHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWNvcmQgUmVjb3JkXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGluaXRSZWNvcmQocmVjb3JkOiBSZWNvcmQpOiB2b2lkIHtcblxuICAgICAgICBpZiAocmVjb3JkLm1vZHVsZSAmJiB0aGlzLmRlZmluaXRpb25zICYmIHRoaXMuZGVmaW5pdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmVjb3JkLmZpZWxkcyA9IHRoaXMucmVjb3JkTWFuYWdlci5pbml0RmllbGRzKHJlY29yZCwgdGhpcy5kZWZpbml0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaCB0aGUgcmVjb3JkIGZyb20gdGhlIGJhY2tlbmRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2R1bGUgdG8gdXNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlY29yZElEIHRvIHVzZVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IE9ic2VydmFibGU8YW55PlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBmZXRjaChtb2R1bGU6IHN0cmluZywgcmVjb3JkSUQ6IHN0cmluZyk6IE9ic2VydmFibGU8UmVjb3JkPiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlY29yZEZldGNoR1FMLmZldGNoKG1vZHVsZSwgcmVjb3JkSUQsIHRoaXMuZmllbGRzTWV0YWRhdGEpXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBtYXAoKHtkYXRhfSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlY29yZDogUmVjb3JkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGU6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczoge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2xzOiBbXVxuICAgICAgICAgICAgICAgICAgICB9IGFzIFJlY29yZDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGRhdGEuZ2V0UmVjb3JkLmF0dHJpYnV0ZXMuaWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZS5hZGREYW5nZXJNZXNzYWdlQnlLZXkoJ0xCTF9SRUNPUkRfRE9FU19OT1RfRVhJU1QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZWNvcmQuaWQgPSBpZDtcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkLm1vZHVsZSA9IG1vZHVsZTtcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkLnR5cGUgPSBkYXRhLmdldFJlY29yZC5hdHRyaWJ1dGVzICYmIGRhdGEuZ2V0UmVjb3JkLmF0dHJpYnV0ZXMub2JqZWN0X25hbWU7XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZC5hdHRyaWJ1dGVzID0gZGF0YS5nZXRSZWNvcmQuYXR0cmlidXRlcztcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkLmFjbHMgPSBkYXRhLmdldFJlY29yZC5hY2xzO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcihlcnIgPT4gdGhyb3dFcnJvcihlcnIpKSxcbiAgICAgICAgICAgICk7XG4gICAgfVxufVxuIl19