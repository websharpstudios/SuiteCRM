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
import { map } from 'rxjs/operators';
import { ListViewStore } from '../store/list-view/list-view.store';
export class FilterAdapter {
    constructor(store) {
        this.store = store;
    }
    getConfig() {
        return {
            savedFilterEdit: true,
            module: this.store.getModuleName(),
            filter$: this.store.openFilter$,
            savedFilters$: this.store.filterList.records$,
            searchFields$: this.store.metadata$.pipe(map((meta) => {
                if (!meta || !meta.search) {
                    return {};
                }
                const searchMeta = meta.search;
                let type = 'advanced';
                if (!searchMeta.layout.advanced) {
                    type = 'basic';
                }
                return searchMeta.layout[type];
            })),
            listFields: this.store.metadata.listView.fields,
            onClose: () => {
                this.store.showFilters = false;
            },
            onSearch: () => {
                this.store.showFilters = false;
            },
            updateFilter: (filter, reload = true) => {
                const filters = {};
                filters[filter.key] = filter;
                this.store.setFilters(filters, reload);
            },
            resetFilter: (reload) => {
                this.store.resetFilters(reload);
            },
            addSavedFilter: (filter) => {
                this.store.addSavedFilter(filter);
            },
            removeSavedFilter: (filter) => {
                this.store.removeSavedFilter(filter);
            },
            setOpenFilter: (filter) => {
                this.store.setOpenFilter(filter);
            },
        };
    }
}
FilterAdapter.decorators = [
    { type: Injectable }
];
FilterAdapter.ctorParameters = () => [
    { type: ListViewStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmFkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvdmlld3MvbGlzdC9hZGFwdGVycy9maWx0ZXIuYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBTWpFLE1BQU0sT0FBTyxhQUFhO0lBRXRCLFlBQXNCLEtBQW9CO1FBQXBCLFVBQUssR0FBTCxLQUFLLENBQWU7SUFDMUMsQ0FBQztJQUVELFNBQVM7UUFDTCxPQUFPO1lBQ0gsZUFBZSxFQUFFLElBQUk7WUFDckIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFO1lBQ2xDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVc7WUFDL0IsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVE7WUFDN0MsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FDcEMsR0FBRyxDQUFDLENBQUMsSUFBYyxFQUFFLEVBQUU7Z0JBRW5CLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUN2QixPQUFPLEVBQXdCLENBQUM7aUJBQ25DO2dCQUVELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBRS9CLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO29CQUM3QixJQUFJLEdBQUcsT0FBTyxDQUFDO2lCQUNsQjtnQkFFRCxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDLENBQ0w7WUFDRCxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU07WUFFL0MsT0FBTyxFQUFFLEdBQVMsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ25DLENBQUM7WUFFRCxRQUFRLEVBQUUsR0FBUyxFQUFFO2dCQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDbkMsQ0FBQztZQUVELFlBQVksRUFBRSxDQUFDLE1BQW1CLEVBQUUsTUFBTSxHQUFHLElBQUksRUFBUSxFQUFFO2dCQUV2RCxNQUFNLE9BQU8sR0FBRyxFQUFvQixDQUFDO2dCQUNyQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztnQkFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzNDLENBQUM7WUFFRCxXQUFXLEVBQUUsQ0FBQyxNQUFnQixFQUFRLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFFRCxjQUFjLEVBQUUsQ0FBQyxNQUFtQixFQUFRLEVBQUU7Z0JBQzFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RDLENBQUM7WUFFRCxpQkFBaUIsRUFBRSxDQUFDLE1BQW1CLEVBQVEsRUFBRTtnQkFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6QyxDQUFDO1lBRUQsYUFBYSxFQUFFLENBQUMsTUFBbUIsRUFBUSxFQUFFO2dCQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNyQyxDQUFDO1NBRVksQ0FBQztJQUN0QixDQUFDOzs7WUEvREosVUFBVTs7O1lBTEgsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U2VhcmNoTWV0YUZpZWxkTWFwfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TGlzdFZpZXdTdG9yZX0gZnJvbSAnLi4vc3RvcmUvbGlzdC12aWV3L2xpc3Qtdmlldy5zdG9yZSc7XG5pbXBvcnQge01ldGFkYXRhfSBmcm9tICcuLi8uLi8uLi9zdG9yZS9tZXRhZGF0YS9tZXRhZGF0YS5zdG9yZS5zZXJ2aWNlJztcbmltcG9ydCB7RmlsdGVyQ29uZmlnfSBmcm9tICcuLi8uLi8uLi9jb250YWluZXJzL2xpc3QtZmlsdGVyL2NvbXBvbmVudHMvbGlzdC1maWx0ZXIvbGlzdC1maWx0ZXIubW9kZWwnO1xuaW1wb3J0IHtTYXZlZEZpbHRlciwgU2F2ZWRGaWx0ZXJNYXB9IGZyb20gJy4uLy4uLy4uL3N0b3JlL3NhdmVkLWZpbHRlcnMvc2F2ZWQtZmlsdGVyLm1vZGVsJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZpbHRlckFkYXB0ZXIge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHN0b3JlOiBMaXN0Vmlld1N0b3JlKSB7XG4gICAgfVxuXG4gICAgZ2V0Q29uZmlnKCk6IEZpbHRlckNvbmZpZyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzYXZlZEZpbHRlckVkaXQ6IHRydWUsXG4gICAgICAgICAgICBtb2R1bGU6IHRoaXMuc3RvcmUuZ2V0TW9kdWxlTmFtZSgpLFxuICAgICAgICAgICAgZmlsdGVyJDogdGhpcy5zdG9yZS5vcGVuRmlsdGVyJCxcbiAgICAgICAgICAgIHNhdmVkRmlsdGVycyQ6IHRoaXMuc3RvcmUuZmlsdGVyTGlzdC5yZWNvcmRzJCxcbiAgICAgICAgICAgIHNlYXJjaEZpZWxkcyQ6IHRoaXMuc3RvcmUubWV0YWRhdGEkLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKChtZXRhOiBNZXRhZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghbWV0YSB8fCAhbWV0YS5zZWFyY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7fSBhcyBTZWFyY2hNZXRhRmllbGRNYXA7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWFyY2hNZXRhID0gbWV0YS5zZWFyY2g7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHR5cGUgPSAnYWR2YW5jZWQnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXNlYXJjaE1ldGEubGF5b3V0LmFkdmFuY2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ2Jhc2ljJztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWFyY2hNZXRhLmxheW91dFt0eXBlXTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGxpc3RGaWVsZHM6IHRoaXMuc3RvcmUubWV0YWRhdGEubGlzdFZpZXcuZmllbGRzLFxuXG4gICAgICAgICAgICBvbkNsb3NlOiAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5zaG93RmlsdGVycyA9IGZhbHNlO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgb25TZWFyY2g6ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnNob3dGaWx0ZXJzID0gZmFsc2U7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB1cGRhdGVGaWx0ZXI6IChmaWx0ZXI6IFNhdmVkRmlsdGVyLCByZWxvYWQgPSB0cnVlKTogdm9pZCA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJzID0ge30gYXMgU2F2ZWRGaWx0ZXJNYXA7XG4gICAgICAgICAgICAgICAgZmlsdGVyc1tmaWx0ZXIua2V5XSA9IGZpbHRlcjtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnNldEZpbHRlcnMoZmlsdGVycywgcmVsb2FkKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHJlc2V0RmlsdGVyOiAocmVsb2FkPzogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUucmVzZXRGaWx0ZXJzKHJlbG9hZCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBhZGRTYXZlZEZpbHRlcjogKGZpbHRlcjogU2F2ZWRGaWx0ZXIpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmFkZFNhdmVkRmlsdGVyKGZpbHRlcik7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICByZW1vdmVTYXZlZEZpbHRlcjogKGZpbHRlcjogU2F2ZWRGaWx0ZXIpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnJlbW92ZVNhdmVkRmlsdGVyKGZpbHRlcik7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXRPcGVuRmlsdGVyOiAoZmlsdGVyOiBTYXZlZEZpbHRlcik6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuc2V0T3BlbkZpbHRlcihmaWx0ZXIpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICB9IGFzIEZpbHRlckNvbmZpZztcbiAgICB9XG59XG4iXX0=