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
export class HistoryTimelineStore {
    constructor(listStoreFactory) {
        this.listStoreFactory = listStoreFactory;
        this.recordList = listStoreFactory.create();
    }
    clear() {
        this.recordList.clear();
        this.recordList = null;
    }
    clearAuthBased() {
        this.recordList.clearAuthBased();
    }
    /**
     * Initial list records load if not cached and update state.
     *
     * @param {ViewContext} context of parent
     * @description initialize the Record List Store
     * returns {void}
     */
    init(context) {
        this.recordList.init('history', false, 'list_max_entries_per_subpanel');
        this.initViewContext(context);
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
     * Init search criteria
     *
     * @param {number} offset of the recordset
     * @param {number} limit of the recordset
     * @description initialize the search module/criteria(offset/limit) for the record set
     */
    initSearchCriteria(offset, limit) {
        this.recordList.criteria = {
            preset: {
                type: 'history-timeline',
                params: {
                    parentModule: this.viewContext.module,
                    parentId: this.viewContext.id,
                    offset,
                    limit
                }
            }
        };
    }
    initViewContext(viewContext) {
        this.viewContext = viewContext;
    }
}
HistoryTimelineStore.decorators = [
    { type: Injectable }
];
HistoryTimelineStore.ctorParameters = () => [
    { type: RecordListStoreFactory }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlzdG9yeS10aW1lbGluZS5zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb250YWluZXJzL3NpZGViYXItd2lkZ2V0L3N0b3JlL2hpc3RvcnktdGltZWxpbmUvaGlzdG9yeS10aW1lbGluZS5zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUl6QyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx5REFBeUQsQ0FBQztBQUkvRixNQUFNLE9BQU8sb0JBQW9CO0lBSTdCLFlBQ2MsZ0JBQXdDO1FBQXhDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBd0I7UUFFbEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBRUQsS0FBSztRQUNELElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDM0IsQ0FBQztJQUVELGNBQWM7UUFDVixJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxJQUFJLENBQUMsT0FBTztRQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsK0JBQStCLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSTtRQUV2QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxrQkFBa0IsQ0FBQyxNQUFjLEVBQUUsS0FBYTtRQUNuRCxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRztZQUN2QixNQUFNLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLGtCQUFrQjtnQkFDeEIsTUFBTSxFQUFFO29CQUNKLFlBQVksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU07b0JBQ3JDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7b0JBQzdCLE1BQU07b0JBQ04sS0FBSztpQkFDUjthQUNKO1NBQ0osQ0FBQztJQUNOLENBQUM7SUFFUyxlQUFlLENBQUMsV0FBd0I7UUFDOUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7SUFDbkMsQ0FBQzs7O1lBbEVKLFVBQVU7OztZQUhILHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3RhdGVTdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvc3RhdGUnO1xuaW1wb3J0IHtSZWNvcmRMaXN0LCBSZWNvcmRMaXN0U3RvcmV9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3JlY29yZC1saXN0L3JlY29yZC1saXN0LnN0b3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1JlY29yZExpc3RTdG9yZUZhY3Rvcnl9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3JlY29yZC1saXN0L3JlY29yZC1saXN0LnN0b3JlLmZhY3RvcnknO1xuaW1wb3J0IHtWaWV3Q29udGV4dH0gZnJvbSAnY29tbW9uJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEhpc3RvcnlUaW1lbGluZVN0b3JlIGltcGxlbWVudHMgU3RhdGVTdG9yZSB7XG4gICAgcHJpdmF0ZSByZWNvcmRMaXN0OiBSZWNvcmRMaXN0U3RvcmU7XG4gICAgcHJpdmF0ZSB2aWV3Q29udGV4dDogVmlld0NvbnRleHQ7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGxpc3RTdG9yZUZhY3Rvcnk6IFJlY29yZExpc3RTdG9yZUZhY3RvcnlcbiAgICApIHtcbiAgICAgICAgdGhpcy5yZWNvcmRMaXN0ID0gbGlzdFN0b3JlRmFjdG9yeS5jcmVhdGUoKTtcbiAgICB9XG5cbiAgICBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZWNvcmRMaXN0LmNsZWFyKCk7XG4gICAgICAgIHRoaXMucmVjb3JkTGlzdCA9IG51bGw7XG4gICAgfVxuXG4gICAgY2xlYXJBdXRoQmFzZWQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVjb3JkTGlzdC5jbGVhckF1dGhCYXNlZCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWwgbGlzdCByZWNvcmRzIGxvYWQgaWYgbm90IGNhY2hlZCBhbmQgdXBkYXRlIHN0YXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtWaWV3Q29udGV4dH0gY29udGV4dCBvZiBwYXJlbnRcbiAgICAgKiBAZGVzY3JpcHRpb24gaW5pdGlhbGl6ZSB0aGUgUmVjb3JkIExpc3QgU3RvcmVcbiAgICAgKiByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIHB1YmxpYyBpbml0KGNvbnRleHQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZWNvcmRMaXN0LmluaXQoJ2hpc3RvcnknLCBmYWxzZSwgJ2xpc3RfbWF4X2VudHJpZXNfcGVyX3N1YnBhbmVsJyk7XG4gICAgICAgIHRoaXMuaW5pdFZpZXdDb250ZXh0KGNvbnRleHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvYWQgLyByZWxvYWQgcmVjb3JkcyB1c2luZyBjdXJyZW50IHBhZ2luYXRpb24gYW5kIGNyaXRlcmlhXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVzZUNhY2hlIGlmIHRvIHVzZSBjYWNoZVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IE9ic2VydmFibGU8UmVjb3JkTGlzdD5cbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZCh1c2VDYWNoZSA9IHRydWUpOiBPYnNlcnZhYmxlPFJlY29yZExpc3Q+IHtcblxuICAgICAgICByZXR1cm4gdGhpcy5yZWNvcmRMaXN0LmxvYWQodXNlQ2FjaGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXQgc2VhcmNoIGNyaXRlcmlhXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0IG9mIHRoZSByZWNvcmRzZXRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGltaXQgb2YgdGhlIHJlY29yZHNldFxuICAgICAqIEBkZXNjcmlwdGlvbiBpbml0aWFsaXplIHRoZSBzZWFyY2ggbW9kdWxlL2NyaXRlcmlhKG9mZnNldC9saW1pdCkgZm9yIHRoZSByZWNvcmQgc2V0XG4gICAgICovXG4gICAgcHVibGljIGluaXRTZWFyY2hDcml0ZXJpYShvZmZzZXQ6IG51bWJlciwgbGltaXQ6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnJlY29yZExpc3QuY3JpdGVyaWEgPSB7XG4gICAgICAgICAgICBwcmVzZXQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaGlzdG9yeS10aW1lbGluZScsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE1vZHVsZTogdGhpcy52aWV3Q29udGV4dC5tb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudElkOiB0aGlzLnZpZXdDb250ZXh0LmlkLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIGxpbWl0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0Vmlld0NvbnRleHQodmlld0NvbnRleHQ6IFZpZXdDb250ZXh0KTogdm9pZCB7XG4gICAgICAgIHRoaXMudmlld0NvbnRleHQgPSB2aWV3Q29udGV4dDtcbiAgICB9XG59XG4iXX0=