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
import { RecordListStoreFactory } from '../../../../store/record-list/record-list.store.factory';
import { RecordStoreList } from './base-record-thread.store';
import { SortDirection } from 'common';
import { map } from 'rxjs/operators';
import { RecordThreadItemStoreFactory } from './record-thread-item.store.factory';
export class RecordThreadStore extends RecordStoreList {
    constructor(listStoreFactory, recordStoreFactory) {
        super(listStoreFactory, recordStoreFactory);
        this.listStoreFactory = listStoreFactory;
        this.recordStoreFactory = recordStoreFactory;
        this.$loading = this.recordList.loading$;
    }
    init(module, load = true) {
        super.init(module, load);
    }
    setFilters(filters) {
        let criteria = this.recordList.criteria;
        criteria = Object.assign(Object.assign({}, criteria), filters);
        if (filters && filters.orderBy) {
            let sortOrder = SortDirection.DESC;
            if (filters.sortOrder && String(filters.sortOrder).toUpperCase() === 'ASC') {
                sortOrder = SortDirection.ASC;
            }
            this.recordList.updateSorting(filters.orderBy, sortOrder, false);
        }
        this.recordList.updateSearchCriteria(criteria, false);
        return this.load(false).pipe(map(value => value.records));
    }
    getMetadata() {
        return this.metadata;
    }
    setMetadata(meta) {
        return this.metadata = meta;
    }
    allLoaded() {
        const pagination = this.recordList.getPagination();
        if (!pagination) {
            return false;
        }
        return pagination.pageSize >= pagination.total;
    }
    loadMore(jump = 10) {
        const pagination = this.recordList.getPagination();
        const currentPageSize = pagination.pageSize || 0;
        let newPageSize = currentPageSize + jump;
        this.recordList.setPageSize(newPageSize);
        this.recordList.updatePagination(0);
    }
    reload() {
        this.recordList.updatePagination(0);
    }
}
RecordThreadStore.decorators = [
    { type: Injectable }
];
RecordThreadStore.ctorParameters = () => [
    { type: RecordListStoreFactory },
    { type: RecordThreadItemStoreFactory }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLXRocmVhZC5zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb250YWluZXJzL3JlY29yZC10aHJlYWQvc3RvcmUvcmVjb3JkLXRocmVhZC9yZWNvcmQtdGhyZWFkLnN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFHSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLHlEQUF5RCxDQUFDO0FBQy9GLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUUzRCxPQUFPLEVBQXlCLGFBQWEsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM3RCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkMsT0FBTyxFQUFDLDRCQUE0QixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFLaEYsTUFBTSxPQUFPLGlCQUFrQixTQUFRLGVBQWdFO0lBS25HLFlBQ2MsZ0JBQXdDLEVBQ3hDLGtCQUFnRDtRQUUxRCxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUhsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXdCO1FBQ3hDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBOEI7UUFHMUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztJQUM3QyxDQUFDO0lBRU0sSUFBSSxDQUFDLE1BQWMsRUFBRSxJQUFJLEdBQUcsSUFBSTtRQUNuQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsVUFBVSxDQUFDLE9BQXVCO1FBRTlCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQ3hDLFFBQVEsbUNBQ0QsUUFBUSxHQUNSLE9BQU8sQ0FDYixDQUFDO1FBRUYsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUM1QixJQUFJLFNBQVMsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO1lBQ25DLElBQUksT0FBTyxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLEtBQUssRUFBRTtnQkFDeEUsU0FBUyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUM7YUFDakM7WUFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNwRTtRQUVELElBQUksQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3RELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQ3hCLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FDOUIsQ0FBQztJQUNOLENBQUM7SUFFTSxXQUFXO1FBQ2QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFTSxXQUFXLENBQUMsSUFBOEI7UUFDN0MsT0FBTyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUNoQyxDQUFDO0lBRU0sU0FBUztRQUNaLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNiLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsT0FBTyxVQUFVLENBQUMsUUFBUSxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUM7SUFDbkQsQ0FBQztJQUVNLFFBQVEsQ0FBQyxPQUFlLEVBQUU7UUFDN0IsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNuRCxNQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQztRQUNqRCxJQUFJLFdBQVcsR0FBRyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBRXpDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLE1BQU07UUFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7OztZQXJFSixVQUFVOzs7WUFUSCxzQkFBc0I7WUFLdEIsNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1JlY29yZExpc3RTdG9yZUZhY3Rvcnl9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3JlY29yZC1saXN0L3JlY29yZC1saXN0LnN0b3JlLmZhY3RvcnknO1xuaW1wb3J0IHtSZWNvcmRTdG9yZUxpc3R9IGZyb20gJy4vYmFzZS1yZWNvcmQtdGhyZWFkLnN0b3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1JlY29yZCwgU2VhcmNoQ3JpdGVyaWEsIFNvcnREaXJlY3Rpb259IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtSZWNvcmRUaHJlYWRJdGVtU3RvcmVGYWN0b3J5fSBmcm9tICcuL3JlY29yZC10aHJlYWQtaXRlbS5zdG9yZS5mYWN0b3J5JztcbmltcG9ydCB7UmVjb3JkVGhyZWFkSXRlbU1ldGFkYXRhfSBmcm9tICcuL3JlY29yZC10aHJlYWQtaXRlbS5zdG9yZS5tb2RlbCc7XG5pbXBvcnQge1JlY29yZFRocmVhZEl0ZW1TdG9yZX0gZnJvbSAnLi9yZWNvcmQtdGhyZWFkLWl0ZW0uc3RvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmVjb3JkVGhyZWFkU3RvcmUgZXh0ZW5kcyBSZWNvcmRTdG9yZUxpc3Q8UmVjb3JkVGhyZWFkSXRlbVN0b3JlLCBSZWNvcmRUaHJlYWRJdGVtTWV0YWRhdGE+IHtcblxuICAgIG1ldGFkYXRhOiBSZWNvcmRUaHJlYWRJdGVtTWV0YWRhdGE7XG4gICAgJGxvYWRpbmc6IE9ic2VydmFibGU8Ym9vbGVhbj47XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGxpc3RTdG9yZUZhY3Rvcnk6IFJlY29yZExpc3RTdG9yZUZhY3RvcnksXG4gICAgICAgIHByb3RlY3RlZCByZWNvcmRTdG9yZUZhY3Rvcnk6IFJlY29yZFRocmVhZEl0ZW1TdG9yZUZhY3RvcnlcbiAgICApIHtcbiAgICAgICAgc3VwZXIobGlzdFN0b3JlRmFjdG9yeSwgcmVjb3JkU3RvcmVGYWN0b3J5KTtcbiAgICAgICAgdGhpcy4kbG9hZGluZyA9IHRoaXMucmVjb3JkTGlzdC5sb2FkaW5nJDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdChtb2R1bGU6IHN0cmluZywgbG9hZCA9IHRydWUpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIuaW5pdChtb2R1bGUsIGxvYWQpO1xuICAgIH1cblxuICAgIHNldEZpbHRlcnMoZmlsdGVyczogU2VhcmNoQ3JpdGVyaWEpOiBPYnNlcnZhYmxlPFJlY29yZFtdPiB7XG5cbiAgICAgICAgbGV0IGNyaXRlcmlhID0gdGhpcy5yZWNvcmRMaXN0LmNyaXRlcmlhO1xuICAgICAgICBjcml0ZXJpYSA9IHtcbiAgICAgICAgICAgIC4uLmNyaXRlcmlhLFxuICAgICAgICAgICAgLi4uZmlsdGVyc1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChmaWx0ZXJzICYmIGZpbHRlcnMub3JkZXJCeSkge1xuICAgICAgICAgICAgbGV0IHNvcnRPcmRlciA9IFNvcnREaXJlY3Rpb24uREVTQztcbiAgICAgICAgICAgIGlmIChmaWx0ZXJzLnNvcnRPcmRlciAmJiBTdHJpbmcoZmlsdGVycy5zb3J0T3JkZXIpLnRvVXBwZXJDYXNlKCkgPT09ICdBU0MnKSB7XG4gICAgICAgICAgICAgICAgc29ydE9yZGVyID0gU29ydERpcmVjdGlvbi5BU0M7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVjb3JkTGlzdC51cGRhdGVTb3J0aW5nKGZpbHRlcnMub3JkZXJCeSwgc29ydE9yZGVyLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlY29yZExpc3QudXBkYXRlU2VhcmNoQ3JpdGVyaWEoY3JpdGVyaWEsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZChmYWxzZSkucGlwZShcbiAgICAgICAgICAgIG1hcCh2YWx1ZSA9PiB2YWx1ZS5yZWNvcmRzKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0TWV0YWRhdGEoKTogUmVjb3JkVGhyZWFkSXRlbU1ldGFkYXRhIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWV0YWRhdGE7XG4gICAgfVxuXG4gICAgcHVibGljIHNldE1ldGFkYXRhKG1ldGE6IFJlY29yZFRocmVhZEl0ZW1NZXRhZGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZXRhZGF0YSA9IG1ldGE7XG4gICAgfVxuXG4gICAgcHVibGljIGFsbExvYWRlZCgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgcGFnaW5hdGlvbiA9IHRoaXMucmVjb3JkTGlzdC5nZXRQYWdpbmF0aW9uKCk7XG4gICAgICAgIGlmICghcGFnaW5hdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhZ2luYXRpb24ucGFnZVNpemUgPj0gcGFnaW5hdGlvbi50b3RhbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZE1vcmUoanVtcDogbnVtYmVyID0gMTApOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcGFnaW5hdGlvbiA9IHRoaXMucmVjb3JkTGlzdC5nZXRQYWdpbmF0aW9uKCk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRQYWdlU2l6ZSA9IHBhZ2luYXRpb24ucGFnZVNpemUgfHwgMDtcbiAgICAgICAgbGV0IG5ld1BhZ2VTaXplID0gY3VycmVudFBhZ2VTaXplICsganVtcDtcblxuICAgICAgICB0aGlzLnJlY29yZExpc3Quc2V0UGFnZVNpemUobmV3UGFnZVNpemUpO1xuICAgICAgICB0aGlzLnJlY29yZExpc3QudXBkYXRlUGFnaW5hdGlvbigwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVsb2FkKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlY29yZExpc3QudXBkYXRlUGFnaW5hdGlvbigwKTtcbiAgICB9XG59XG4iXX0=