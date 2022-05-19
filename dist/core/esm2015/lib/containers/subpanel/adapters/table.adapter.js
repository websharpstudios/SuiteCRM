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
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { SubpanelStore } from '../store/subpanel/subpanel.store';
import { SubpanelLineActionsAdapterFactory } from './line-actions.adapter.factory';
export class SubpanelTableAdapter {
    constructor(store, lineActionsAdapterFactory) {
        this.store = store;
        this.lineActionsAdapterFactory = lineActionsAdapterFactory;
    }
    getTable() {
        return {
            showHeader: false,
            showFooter: true,
            module: this.store.metadata.headerModule,
            columns: this.getColumns(),
            lineActions: this.getLineActions(),
            sort$: this.store.recordList.sort$,
            maxColumns$: of(5),
            loading$: this.store.recordList.loading$,
            dataSource: this.store.recordList,
            pagination: this.store.recordList,
            toggleRecordSelection: (id) => {
                this.store.recordList.toggleSelection(id);
            },
            updateSorting: (orderBy, sortOrder) => {
                this.store.recordList.updateSorting(orderBy, sortOrder);
            },
        };
    }
    getColumns() {
        return this.store.metadata$.pipe(map(metadata => metadata.columns));
    }
    getLineActions() {
        return this.lineActionsAdapterFactory.create(this.store);
    }
}
SubpanelTableAdapter.decorators = [
    { type: Injectable }
];
SubpanelTableAdapter.ctorParameters = () => [
    { type: SubpanelStore },
    { type: SubpanelLineActionsAdapterFactory }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb250YWluZXJzL3N1YnBhbmVsL2FkYXB0ZXJzL3RhYmxlLmFkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBYSxFQUFFLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQy9ELE9BQU8sRUFBQyxpQ0FBaUMsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBR2pGLE1BQU0sT0FBTyxvQkFBb0I7SUFFN0IsWUFDYyxLQUFvQixFQUNwQix5QkFBNEQ7UUFENUQsVUFBSyxHQUFMLEtBQUssQ0FBZTtRQUNwQiw4QkFBeUIsR0FBekIseUJBQXlCLENBQW1DO0lBRTFFLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTztZQUNILFVBQVUsRUFBRSxLQUFLO1lBQ2pCLFVBQVUsRUFBRSxJQUFJO1lBRWhCLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZO1lBRXhDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQzFCLFdBQVcsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ2xDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLO1lBQ2xDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRO1lBRXhDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVU7WUFDakMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVTtZQUVqQyxxQkFBcUIsRUFBRSxDQUFDLEVBQVUsRUFBUSxFQUFFO2dCQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDOUMsQ0FBQztZQUVELGFBQWEsRUFBRSxDQUFDLE9BQWUsRUFBRSxTQUF3QixFQUFRLEVBQUU7Z0JBQy9ELElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDNUQsQ0FBQztTQUNXLENBQUM7SUFDckIsQ0FBQztJQUVTLFVBQVU7UUFDaEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVTLGNBQWM7UUFDcEIsT0FBTyxJQUFJLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3RCxDQUFDOzs7WUF6Q0osVUFBVTs7O1lBSEgsYUFBYTtZQUNiLGlDQUFpQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtPYnNlcnZhYmxlLCBvZn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBY3Rpb25EYXRhU291cmNlLCBDb2x1bW5EZWZpbml0aW9uLCBTb3J0RGlyZWN0aW9ufSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7VGFibGVDb25maWd9IGZyb20gJy4uLy4uLy4uL2NvbXBvbmVudHMvdGFibGUvdGFibGUubW9kZWwnO1xuaW1wb3J0IHtTdWJwYW5lbFN0b3JlfSBmcm9tICcuLi9zdG9yZS9zdWJwYW5lbC9zdWJwYW5lbC5zdG9yZSc7XG5pbXBvcnQge1N1YnBhbmVsTGluZUFjdGlvbnNBZGFwdGVyRmFjdG9yeX0gZnJvbSAnLi9saW5lLWFjdGlvbnMuYWRhcHRlci5mYWN0b3J5JztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN1YnBhbmVsVGFibGVBZGFwdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgc3RvcmU6IFN1YnBhbmVsU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBsaW5lQWN0aW9uc0FkYXB0ZXJGYWN0b3J5OiBTdWJwYW5lbExpbmVBY3Rpb25zQWRhcHRlckZhY3RvcnlcbiAgICApIHtcbiAgICB9XG5cbiAgICBnZXRUYWJsZSgpOiBUYWJsZUNvbmZpZyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzaG93SGVhZGVyOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dGb290ZXI6IHRydWUsXG5cbiAgICAgICAgICAgIG1vZHVsZTogdGhpcy5zdG9yZS5tZXRhZGF0YS5oZWFkZXJNb2R1bGUsXG5cbiAgICAgICAgICAgIGNvbHVtbnM6IHRoaXMuZ2V0Q29sdW1ucygpLFxuICAgICAgICAgICAgbGluZUFjdGlvbnM6IHRoaXMuZ2V0TGluZUFjdGlvbnMoKSxcbiAgICAgICAgICAgIHNvcnQkOiB0aGlzLnN0b3JlLnJlY29yZExpc3Quc29ydCQsXG4gICAgICAgICAgICBtYXhDb2x1bW5zJDogb2YoNSksXG4gICAgICAgICAgICBsb2FkaW5nJDogdGhpcy5zdG9yZS5yZWNvcmRMaXN0LmxvYWRpbmckLFxuXG4gICAgICAgICAgICBkYXRhU291cmNlOiB0aGlzLnN0b3JlLnJlY29yZExpc3QsXG4gICAgICAgICAgICBwYWdpbmF0aW9uOiB0aGlzLnN0b3JlLnJlY29yZExpc3QsXG5cbiAgICAgICAgICAgIHRvZ2dsZVJlY29yZFNlbGVjdGlvbjogKGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnJlY29yZExpc3QudG9nZ2xlU2VsZWN0aW9uKGlkKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHVwZGF0ZVNvcnRpbmc6IChvcmRlckJ5OiBzdHJpbmcsIHNvcnRPcmRlcjogU29ydERpcmVjdGlvbik6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUucmVjb3JkTGlzdC51cGRhdGVTb3J0aW5nKG9yZGVyQnksIHNvcnRPcmRlcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9IGFzIFRhYmxlQ29uZmlnO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRDb2x1bW5zKCk6IE9ic2VydmFibGU8Q29sdW1uRGVmaW5pdGlvbltdPiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlLm1ldGFkYXRhJC5waXBlKG1hcChtZXRhZGF0YSA9PiBtZXRhZGF0YS5jb2x1bW5zKSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldExpbmVBY3Rpb25zKCk6IEFjdGlvbkRhdGFTb3VyY2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5saW5lQWN0aW9uc0FkYXB0ZXJGYWN0b3J5LmNyZWF0ZSh0aGlzLnN0b3JlKTtcbiAgICB9XG59XG4iXX0=