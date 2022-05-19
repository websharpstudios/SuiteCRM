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
import { deepClone } from 'common';
import { BehaviorSubject, of } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { RecordStore } from '../../../../store/record/record.store';
import { FormGroup } from '@angular/forms';
const initialState = {
    id: '',
    type: '',
    module: '',
    attributes: {}
};
export class SavedFilterRecordStore extends RecordStore {
    constructor(definitions$, recordSaveGQL, recordFetchGQL, message, recordManager, recordMappers, fieldManager, language) {
        super(definitions$, recordSaveGQL, recordFetchGQL, message, recordManager, recordMappers);
        this.definitions$ = definitions$;
        this.recordSaveGQL = recordSaveGQL;
        this.recordFetchGQL = recordFetchGQL;
        this.message = message;
        this.recordManager = recordManager;
        this.recordMappers = recordMappers;
        this.fieldManager = fieldManager;
        this.language = language;
        this.internalState = deepClone(initialState);
        this.stagingState = deepClone(initialState);
        this.store = new BehaviorSubject(this.internalState);
        this.staging = new BehaviorSubject(this.stagingState);
        this.searchFields = {};
        this.listColumns = [];
        this.state$ = this.store.asObservable().pipe(tap(record => {
            this.updateStaging(record);
        }));
        this.staging$ = this.staging.asObservable();
    }
    /**
     * Get search fields metadata
     * @returns SearchMetaFieldMap
     */
    getSearchFields() {
        return this.searchFields;
    }
    /**
     * Set search fields metadata
     * @param {object} searchFields SearchMetaFieldMap
     */
    setSearchFields(searchFields) {
        this.searchFields = searchFields;
    }
    /**
     * Get list fields metadata
     * @returns SearchMetaFieldMap
     */
    getListColumns() {
        return this.listColumns;
    }
    /**
     * Set list fields metadata
     * @param {object} listColumns SearchMetaFieldMap
     */
    setListColumns(listColumns) {
        this.listColumns = listColumns;
    }
    /**
     * Get record
     *
     * @returns {object} Record
     */
    getBaseRecord() {
        if (!this.stagingState) {
            return null;
        }
        this.mapStagingFields();
        return deepClone({
            id: this.stagingState.id,
            type: this.stagingState.type,
            module: this.stagingState.module,
            key: this.stagingState.key,
            searchModule: this.stagingState.searchModule,
            criteria: this.stagingState.criteria,
            attributes: this.stagingState.attributes,
        });
    }
    /**
     * Extract base record
     *
     * @returns {object} Record
     */
    extractBaseRecord(record) {
        if (!record) {
            return null;
        }
        return deepClone({
            id: record.id,
            type: record.type,
            module: record.module,
            key: record.key,
            searchModule: record.searchModule,
            criteria: record.criteria,
            attributes: record.attributes,
        });
    }
    /**
     * Init record fields
     *
     * @param {object} record Record
     */
    initRecord(record) {
        record.attributes = record.attributes || {};
        record.attributes.search_module = record.searchModule;
        record.attributes.contents = record.attributes.contents || { filters: {} };
        record.criteria = this.getCriteria(record);
        this.initCriteriaFields(record, this.getSearchFields());
        if (record.module && this.definitions && this.definitions.length > 0) {
            record.fields = this.recordManager.initFields(record, this.definitions);
        }
        this.initOrderByOptions(record);
    }
    /**
     * Init Order by options using list view columns set as default
     * @param record
     */
    initOrderByOptions(record) {
        if (!record.fields || !record.fields.orderBy) {
            return;
        }
        record.fields.orderBy.metadata = record.fields.orderBy.metadata || {};
        const options = [];
        this.getListColumns().forEach(column => {
            if (!column.default || column.default !== true) {
                return;
            }
            const labelKey = column.label || column.fieldDefinition.vname || '';
            const label = this.language.getFieldLabel(labelKey, record.searchModule);
            options.push({
                value: column.fieldDefinition.name || column.name,
                label
            });
        });
        record.fields.orderBy.metadata.options$ = of(options).pipe(shareReplay());
    }
    /**
     * Get criteria from filter
     * @param filter
     */
    getCriteria(filter) {
        if (!filter || !filter.criteria) {
            return { filters: {} };
        }
        if (!filter.criteria.filters) {
            return Object.assign(Object.assign({}, filter.criteria), { filters: {} });
        }
        return deepClone(filter.criteria);
    }
    /**
     * Initialize criteria fields
     *
     * @param {object} record to use
     * @param {object} searchFields to use
     */
    initCriteriaFields(record, searchFields) {
        record.criteriaFields = record.criteriaFields || {};
        if (!record.criteriaFormGroup) {
            record.criteriaFormGroup = new FormGroup({});
        }
        if (!searchFields) {
            return;
        }
        Object.keys(searchFields).forEach(key => {
            this.buildField(record, searchFields[key]);
        });
    }
    /**
     * Build filter field according to Field interface
     *
     * @param {object} record SavedFilter
     * @param {object} fieldMeta to use
     */
    buildField(record, fieldMeta) {
        const fieldName = fieldMeta.name;
        const type = fieldMeta.type;
        const definition = {
            name: fieldMeta.name,
            label: fieldMeta.label,
            type,
            fieldDefinition: {}
        };
        if (fieldMeta.fieldDefinition) {
            definition.fieldDefinition = fieldMeta.fieldDefinition;
        }
        if (type === 'bool' || type === 'boolean') {
            definition.fieldDefinition.options = 'dom_int_bool';
        }
        this.fieldManager.addFilterField(record, definition, this.language);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZWQtZmlsdGVyLXJlY29yZC5zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb250YWluZXJzL2xpc3QtZmlsdGVyL3N0b3JlL3NhdmVkLWZpbHRlci9zYXZlZC1maWx0ZXItcmVjb3JkLnN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBRUgsU0FBUyxFQVVaLE1BQU0sUUFBUSxDQUFDO0FBQ2hCLE9BQU8sRUFBQyxlQUFlLEVBQWMsRUFBRSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3JELE9BQU8sRUFBQyxXQUFXLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHVDQUF1QyxDQUFDO0FBRWxFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQVF6QyxNQUFNLFlBQVksR0FBRztJQUNqQixFQUFFLEVBQUUsRUFBRTtJQUNOLElBQUksRUFBRSxFQUFFO0lBQ1IsTUFBTSxFQUFFLEVBQUU7SUFDVixVQUFVLEVBQUUsRUFBRTtDQUNQLENBQUM7QUFFWixNQUFNLE9BQU8sc0JBQXVCLFNBQVEsV0FBVztJQVduRCxZQUNjLFlBQStDLEVBQy9DLGFBQTRCLEVBQzVCLGNBQThCLEVBQzlCLE9BQXVCLEVBQ3ZCLGFBQTRCLEVBQzVCLGFBQW1DLEVBQ25DLFlBQTBCLEVBQzFCLFFBQXVCO1FBRWpDLEtBQUssQ0FDRCxZQUFZLEVBQ1osYUFBYSxFQUNiLGNBQWMsRUFDZCxPQUFPLEVBQ1AsYUFBYSxFQUNiLGFBQWEsQ0FDaEIsQ0FBQztRQWhCUSxpQkFBWSxHQUFaLFlBQVksQ0FBbUM7UUFDL0Msa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlC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QUMsRUFBRSxDQUFDLENBQUM7U0FDaEQ7UUFFRCxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2YsT0FBTztTQUNWO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDTyxVQUFVLENBQUMsTUFBbUIsRUFBRSxTQUEwQjtRQUNoRSxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ2pDLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFFNUIsTUFBTSxVQUFVLEdBQUc7WUFDZixJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUk7WUFDcEIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLO1lBQ3RCLElBQUk7WUFDSixlQUFlLEVBQUUsRUFBRTtTQUNDLENBQUM7UUFFekIsSUFBSSxTQUFTLENBQUMsZUFBZSxFQUFFO1lBQzNCLFVBQVUsQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQztTQUMxRDtRQUVELElBQUksSUFBSSxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQ3ZDLFVBQVUsQ0FBQyxlQUFlLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQztTQUN2RDtRQUVELElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRXhFLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtcbiAgICBDb2x1bW5EZWZpbml0aW9uLFxuICAgIGRlZXBDbG9uZSxcbiAgICBGaWVsZE1hcCxcbiAgICBGaWVsZE1ldGFkYXRhLFxuICAgIE9wdGlvbixcbiAgICBSZWNvcmQsXG4gICAgUmVjb3JkTWFwcGVyUmVnaXN0cnksXG4gICAgU2VhcmNoQ3JpdGVyaWEsXG4gICAgU2VhcmNoTWV0YUZpZWxkLFxuICAgIFNlYXJjaE1ldGFGaWVsZE1hcCxcbiAgICBWaWV3RmllbGREZWZpbml0aW9uXG59IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgb2Z9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzaGFyZVJlcGxheSwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1JlY29yZFN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9yZWNvcmQvcmVjb3JkLnN0b3JlJztcbmltcG9ydCB7U2F2ZWRGaWx0ZXIsIFNhdmVkRmlsdGVyQXR0cmlidXRlTWFwfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9zYXZlZC1maWx0ZXJzL3NhdmVkLWZpbHRlci5tb2RlbCc7XG5pbXBvcnQge0Zvcm1Hcm91cH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtSZWNvcmRTYXZlR1FMfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9yZWNvcmQvZ3JhcGhxbC9hcGkucmVjb3JkLnNhdmUnO1xuaW1wb3J0IHtNZXNzYWdlU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZXMvbWVzc2FnZS9tZXNzYWdlLnNlcnZpY2UnO1xuaW1wb3J0IHtSZWNvcmRGZXRjaEdRTH0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvcmVjb3JkL2dyYXBocWwvYXBpLnJlY29yZC5nZXQnO1xuaW1wb3J0IHtSZWNvcmRNYW5hZ2VyfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9yZWNvcmQvcmVjb3JkLm1hbmFnZXInO1xuaW1wb3J0IHtGaWVsZE1hbmFnZXJ9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL3JlY29yZC9maWVsZC9maWVsZC5tYW5hZ2VyJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuXG5jb25zdCBpbml0aWFsU3RhdGUgPSB7XG4gICAgaWQ6ICcnLFxuICAgIHR5cGU6ICcnLFxuICAgIG1vZHVsZTogJycsXG4gICAgYXR0cmlidXRlczoge31cbn0gYXMgUmVjb3JkO1xuXG5leHBvcnQgY2xhc3MgU2F2ZWRGaWx0ZXJSZWNvcmRTdG9yZSBleHRlbmRzIFJlY29yZFN0b3JlIHtcblxuICAgIHN0YXRlJDogT2JzZXJ2YWJsZTxTYXZlZEZpbHRlcj47XG4gICAgc3RhZ2luZyQ6IE9ic2VydmFibGU8U2F2ZWRGaWx0ZXI+O1xuICAgIHByb3RlY3RlZCBpbnRlcm5hbFN0YXRlOiBTYXZlZEZpbHRlciA9IGRlZXBDbG9uZShpbml0aWFsU3RhdGUpO1xuICAgIHByb3RlY3RlZCBzdGFnaW5nU3RhdGU6IFNhdmVkRmlsdGVyID0gZGVlcENsb25lKGluaXRpYWxTdGF0ZSk7XG4gICAgcHJvdGVjdGVkIHN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxTYXZlZEZpbHRlcj4odGhpcy5pbnRlcm5hbFN0YXRlKTtcbiAgICBwcm90ZWN0ZWQgc3RhZ2luZyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8U2F2ZWRGaWx0ZXI+KHRoaXMuc3RhZ2luZ1N0YXRlKTtcbiAgICBwcm90ZWN0ZWQgc2VhcmNoRmllbGRzOiBTZWFyY2hNZXRhRmllbGRNYXAgPSB7fTtcbiAgICBwcm90ZWN0ZWQgbGlzdENvbHVtbnM6IENvbHVtbkRlZmluaXRpb25bXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBkZWZpbml0aW9ucyQ6IE9ic2VydmFibGU8Vmlld0ZpZWxkRGVmaW5pdGlvbltdPixcbiAgICAgICAgcHJvdGVjdGVkIHJlY29yZFNhdmVHUUw6IFJlY29yZFNhdmVHUUwsXG4gICAgICAgIHByb3RlY3RlZCByZWNvcmRGZXRjaEdRTDogUmVjb3JkRmV0Y2hHUUwsXG4gICAgICAgIHByb3RlY3RlZCBtZXNzYWdlOiBNZXNzYWdlU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIHJlY29yZE1hbmFnZXI6IFJlY29yZE1hbmFnZXIsXG4gICAgICAgIHByb3RlY3RlZCByZWNvcmRNYXBwZXJzOiBSZWNvcmRNYXBwZXJSZWdpc3RyeSxcbiAgICAgICAgcHJvdGVjdGVkIGZpZWxkTWFuYWdlcjogRmllbGRNYW5hZ2VyLFxuICAgICAgICBwcm90ZWN0ZWQgbGFuZ3VhZ2U6IExhbmd1YWdlU3RvcmVcbiAgICApIHtcbiAgICAgICAgc3VwZXIoXG4gICAgICAgICAgICBkZWZpbml0aW9ucyQsXG4gICAgICAgICAgICByZWNvcmRTYXZlR1FMLFxuICAgICAgICAgICAgcmVjb3JkRmV0Y2hHUUwsXG4gICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgcmVjb3JkTWFuYWdlcixcbiAgICAgICAgICAgIHJlY29yZE1hcHBlcnNcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnN0YXRlJCA9IHRoaXMuc3RvcmUuYXNPYnNlcnZhYmxlKCkucGlwZShcbiAgICAgICAgICAgIHRhcChyZWNvcmQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhZ2luZyhyZWNvcmQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdGFnaW5nJCA9IHRoaXMuc3RhZ2luZy5hc09ic2VydmFibGUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgc2VhcmNoIGZpZWxkcyBtZXRhZGF0YVxuICAgICAqIEByZXR1cm5zIFNlYXJjaE1ldGFGaWVsZE1hcFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRTZWFyY2hGaWVsZHMoKTogU2VhcmNoTWV0YUZpZWxkTWFwIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoRmllbGRzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBzZWFyY2ggZmllbGRzIG1ldGFkYXRhXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHNlYXJjaEZpZWxkcyBTZWFyY2hNZXRhRmllbGRNYXBcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0U2VhcmNoRmllbGRzKHNlYXJjaEZpZWxkczogU2VhcmNoTWV0YUZpZWxkTWFwKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VhcmNoRmllbGRzID0gc2VhcmNoRmllbGRzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBsaXN0IGZpZWxkcyBtZXRhZGF0YVxuICAgICAqIEByZXR1cm5zIFNlYXJjaE1ldGFGaWVsZE1hcFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRMaXN0Q29sdW1ucygpOiBDb2x1bW5EZWZpbml0aW9uW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5saXN0Q29sdW1ucztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgbGlzdCBmaWVsZHMgbWV0YWRhdGFcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbGlzdENvbHVtbnMgU2VhcmNoTWV0YUZpZWxkTWFwXG4gICAgICovXG4gICAgcHVibGljIHNldExpc3RDb2x1bW5zKGxpc3RDb2x1bW5zOiBDb2x1bW5EZWZpbml0aW9uW10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5saXN0Q29sdW1ucyA9IGxpc3RDb2x1bW5zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCByZWNvcmRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IFJlY29yZFxuICAgICAqL1xuICAgIGdldEJhc2VSZWNvcmQoKTogU2F2ZWRGaWx0ZXIge1xuICAgICAgICBpZiAoIXRoaXMuc3RhZ2luZ1N0YXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWFwU3RhZ2luZ0ZpZWxkcygpO1xuXG4gICAgICAgIHJldHVybiBkZWVwQ2xvbmUoe1xuICAgICAgICAgICAgaWQ6IHRoaXMuc3RhZ2luZ1N0YXRlLmlkLFxuICAgICAgICAgICAgdHlwZTogdGhpcy5zdGFnaW5nU3RhdGUudHlwZSxcbiAgICAgICAgICAgIG1vZHVsZTogdGhpcy5zdGFnaW5nU3RhdGUubW9kdWxlLFxuICAgICAgICAgICAga2V5OiB0aGlzLnN0YWdpbmdTdGF0ZS5rZXksXG4gICAgICAgICAgICBzZWFyY2hNb2R1bGU6IHRoaXMuc3RhZ2luZ1N0YXRlLnNlYXJjaE1vZHVsZSxcbiAgICAgICAgICAgIGNyaXRlcmlhOiB0aGlzLnN0YWdpbmdTdGF0ZS5jcml0ZXJpYSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRoaXMuc3RhZ2luZ1N0YXRlLmF0dHJpYnV0ZXMsXG4gICAgICAgIH0gYXMgU2F2ZWRGaWx0ZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3QgYmFzZSByZWNvcmRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IFJlY29yZFxuICAgICAqL1xuICAgIGV4dHJhY3RCYXNlUmVjb3JkKHJlY29yZDogU2F2ZWRGaWx0ZXIpOiBSZWNvcmQge1xuICAgICAgICBpZiAoIXJlY29yZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVlcENsb25lKHtcbiAgICAgICAgICAgIGlkOiByZWNvcmQuaWQsXG4gICAgICAgICAgICB0eXBlOiByZWNvcmQudHlwZSxcbiAgICAgICAgICAgIG1vZHVsZTogcmVjb3JkLm1vZHVsZSxcbiAgICAgICAgICAgIGtleTogcmVjb3JkLmtleSxcbiAgICAgICAgICAgIHNlYXJjaE1vZHVsZTogcmVjb3JkLnNlYXJjaE1vZHVsZSxcbiAgICAgICAgICAgIGNyaXRlcmlhOiByZWNvcmQuY3JpdGVyaWEsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiByZWNvcmQuYXR0cmlidXRlcyxcbiAgICAgICAgfSBhcyBTYXZlZEZpbHRlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdCByZWNvcmQgZmllbGRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkIFJlY29yZFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbml0UmVjb3JkKHJlY29yZDogU2F2ZWRGaWx0ZXIpOiB2b2lkIHtcblxuICAgICAgICByZWNvcmQuYXR0cmlidXRlcyA9IHJlY29yZC5hdHRyaWJ1dGVzIHx8IHt9IGFzIFNhdmVkRmlsdGVyQXR0cmlidXRlTWFwO1xuICAgICAgICByZWNvcmQuYXR0cmlidXRlcy5zZWFyY2hfbW9kdWxlID0gcmVjb3JkLnNlYXJjaE1vZHVsZTtcbiAgICAgICAgcmVjb3JkLmF0dHJpYnV0ZXMuY29udGVudHMgPSByZWNvcmQuYXR0cmlidXRlcy5jb250ZW50cyB8fCB7ZmlsdGVyczoge319IGFzIFNlYXJjaENyaXRlcmlhO1xuXG4gICAgICAgIHJlY29yZC5jcml0ZXJpYSA9IHRoaXMuZ2V0Q3JpdGVyaWEocmVjb3JkKTtcblxuICAgICAgICB0aGlzLmluaXRDcml0ZXJpYUZpZWxkcyhyZWNvcmQsIHRoaXMuZ2V0U2VhcmNoRmllbGRzKCkpO1xuXG4gICAgICAgIGlmIChyZWNvcmQubW9kdWxlICYmIHRoaXMuZGVmaW5pdGlvbnMgJiYgdGhpcy5kZWZpbml0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZWNvcmQuZmllbGRzID0gdGhpcy5yZWNvcmRNYW5hZ2VyLmluaXRGaWVsZHMocmVjb3JkLCB0aGlzLmRlZmluaXRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5pdE9yZGVyQnlPcHRpb25zKHJlY29yZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdCBPcmRlciBieSBvcHRpb25zIHVzaW5nIGxpc3QgdmlldyBjb2x1bW5zIHNldCBhcyBkZWZhdWx0XG4gICAgICogQHBhcmFtIHJlY29yZFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbml0T3JkZXJCeU9wdGlvbnMocmVjb3JkOiBTYXZlZEZpbHRlcik6IHZvaWQge1xuICAgICAgICBpZiAoIXJlY29yZC5maWVsZHMgfHwgIXJlY29yZC5maWVsZHMub3JkZXJCeSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICByZWNvcmQuZmllbGRzLm9yZGVyQnkubWV0YWRhdGEgPSByZWNvcmQuZmllbGRzLm9yZGVyQnkubWV0YWRhdGEgfHwge30gYXMgRmllbGRNZXRhZGF0YTtcblxuICAgICAgICBjb25zdCBvcHRpb25zID0gW10gYXMgT3B0aW9uW107XG4gICAgICAgIHRoaXMuZ2V0TGlzdENvbHVtbnMoKS5mb3JFYWNoKGNvbHVtbiA9PiB7XG5cbiAgICAgICAgICAgIGlmICghY29sdW1uLmRlZmF1bHQgfHwgY29sdW1uLmRlZmF1bHQgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGxhYmVsS2V5ID0gY29sdW1uLmxhYmVsIHx8IGNvbHVtbi5maWVsZERlZmluaXRpb24udm5hbWUgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXMubGFuZ3VhZ2UuZ2V0RmllbGRMYWJlbChsYWJlbEtleSwgcmVjb3JkLnNlYXJjaE1vZHVsZSk7XG5cbiAgICAgICAgICAgIG9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgdmFsdWU6IGNvbHVtbi5maWVsZERlZmluaXRpb24ubmFtZSB8fCBjb2x1bW4ubmFtZSxcbiAgICAgICAgICAgICAgICBsYWJlbFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVjb3JkLmZpZWxkcy5vcmRlckJ5Lm1ldGFkYXRhLm9wdGlvbnMkID0gb2Yob3B0aW9ucykucGlwZShzaGFyZVJlcGxheSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgY3JpdGVyaWEgZnJvbSBmaWx0ZXJcbiAgICAgKiBAcGFyYW0gZmlsdGVyXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldENyaXRlcmlhKGZpbHRlcjogU2F2ZWRGaWx0ZXIpOiBTZWFyY2hDcml0ZXJpYSB7XG5cbiAgICAgICAgaWYgKCFmaWx0ZXIgfHwgIWZpbHRlci5jcml0ZXJpYSkge1xuICAgICAgICAgICAgcmV0dXJuIHtmaWx0ZXJzOiB7fX07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWZpbHRlci5jcml0ZXJpYS5maWx0ZXJzKSB7XG4gICAgICAgICAgICByZXR1cm4gey4uLmZpbHRlci5jcml0ZXJpYSwgZmlsdGVyczoge319O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlZXBDbG9uZShmaWx0ZXIuY3JpdGVyaWEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgY3JpdGVyaWEgZmllbGRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZWFyY2hGaWVsZHMgdG8gdXNlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGluaXRDcml0ZXJpYUZpZWxkcyhyZWNvcmQ6IFNhdmVkRmlsdGVyLCBzZWFyY2hGaWVsZHM6IFNlYXJjaE1ldGFGaWVsZE1hcCk6IHZvaWQge1xuXG4gICAgICAgIHJlY29yZC5jcml0ZXJpYUZpZWxkcyA9IHJlY29yZC5jcml0ZXJpYUZpZWxkcyB8fCB7fSBhcyBGaWVsZE1hcDtcbiAgICAgICAgaWYgKCFyZWNvcmQuY3JpdGVyaWFGb3JtR3JvdXApIHtcbiAgICAgICAgICAgIHJlY29yZC5jcml0ZXJpYUZvcm1Hcm91cCA9IG5ldyBGb3JtR3JvdXAoe30pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWFyY2hGaWVsZHMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5rZXlzKHNlYXJjaEZpZWxkcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgdGhpcy5idWlsZEZpZWxkKHJlY29yZCwgc2VhcmNoRmllbGRzW2tleV0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBmaWx0ZXIgZmllbGQgYWNjb3JkaW5nIHRvIEZpZWxkIGludGVyZmFjZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlY29yZCBTYXZlZEZpbHRlclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmaWVsZE1ldGEgdG8gdXNlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGJ1aWxkRmllbGQocmVjb3JkOiBTYXZlZEZpbHRlciwgZmllbGRNZXRhOiBTZWFyY2hNZXRhRmllbGQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZmllbGROYW1lID0gZmllbGRNZXRhLm5hbWU7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBmaWVsZE1ldGEudHlwZTtcblxuICAgICAgICBjb25zdCBkZWZpbml0aW9uID0ge1xuICAgICAgICAgICAgbmFtZTogZmllbGRNZXRhLm5hbWUsXG4gICAgICAgICAgICBsYWJlbDogZmllbGRNZXRhLmxhYmVsLFxuICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgIGZpZWxkRGVmaW5pdGlvbjoge31cbiAgICAgICAgfSBhcyBWaWV3RmllbGREZWZpbml0aW9uO1xuXG4gICAgICAgIGlmIChmaWVsZE1ldGEuZmllbGREZWZpbml0aW9uKSB7XG4gICAgICAgICAgICBkZWZpbml0aW9uLmZpZWxkRGVmaW5pdGlvbiA9IGZpZWxkTWV0YS5maWVsZERlZmluaXRpb247XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZSA9PT0gJ2Jvb2wnIHx8IHR5cGUgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgZGVmaW5pdGlvbi5maWVsZERlZmluaXRpb24ub3B0aW9ucyA9ICdkb21faW50X2Jvb2wnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5maWVsZE1hbmFnZXIuYWRkRmlsdGVyRmllbGQocmVjb3JkLCBkZWZpbml0aW9uLCB0aGlzLmxhbmd1YWdlKTtcblxuICAgIH1cbn1cbiJdfQ==