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
import { of } from 'rxjs';
export class ModalRecordFilterAdapter {
    getConfig(store) {
        return {
            klass: 'light-filter',
            panelMode: 'collapsible',
            isCollapsed: true,
            collapseOnSearch: true,
            savedFilterEdit: false,
            module: store.recordList.getModule(),
            filter$: store.recordList.criteria$.pipe(map(criteria => {
                return {
                    key: 'default',
                    criteria
                };
            })),
            savedFilters$: of([]),
            searchFields$: store.searchMetadata$.pipe(map((searchMeta) => {
                if (!searchMeta) {
                    return {};
                }
                let type = 'advanced';
                if (!searchMeta.layout.advanced) {
                    type = 'basic';
                }
                return searchMeta.layout[type];
            })),
            listFields: [],
            onClose: () => {
            },
            onSearch: () => {
            },
            updateFilter: (filter, reload = true) => {
                store.recordList.updateSearchCriteria(filter.criteria, reload);
            },
            resetFilter: (reload) => {
                store.recordList.resetSearchCriteria(reload);
            },
            addSavedFilter: (filter) => {
            },
            removeSavedFilter: (filter) => {
            },
            setOpenFilter: (filter) => {
            },
        };
    }
}
ModalRecordFilterAdapter.decorators = [
    { type: Injectable }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmFkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29udGFpbmVycy9yZWNvcmQtbGlzdC1tb2RhbC9hZGFwdGVycy9maWx0ZXIuYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFLbkMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUd4QixNQUFNLE9BQU8sd0JBQXdCO0lBRWpDLFNBQVMsQ0FBQyxLQUEyQjtRQUNqQyxPQUFPO1lBQ0gsS0FBSyxFQUFFLGNBQWM7WUFDckIsU0FBUyxFQUFFLGFBQWE7WUFDeEIsV0FBVyxFQUFFLElBQUk7WUFDakIsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixlQUFlLEVBQUUsS0FBSztZQUN0QixNQUFNLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUU7WUFDcEMsT0FBTyxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FDcEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNYLE9BQU87b0JBQ0gsR0FBRyxFQUFFLFNBQVM7b0JBQ2QsUUFBUTtpQkFDSSxDQUFBO1lBQ3BCLENBQUMsQ0FBQyxDQUNMO1lBQ0QsYUFBYSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDckIsYUFBYSxFQUFFLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUNyQyxHQUFHLENBQUMsQ0FBQyxVQUFzQixFQUFFLEVBQUU7Z0JBRTNCLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQ2IsT0FBTyxFQUF3QixDQUFDO2lCQUNuQztnQkFFRCxJQUFJLElBQUksR0FBRyxVQUFVLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtvQkFDN0IsSUFBSSxHQUFHLE9BQU8sQ0FBQztpQkFDbEI7Z0JBRUQsT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUNMO1lBQ0QsVUFBVSxFQUFFLEVBQUU7WUFFZCxPQUFPLEVBQUUsR0FBUyxFQUFFO1lBQ3BCLENBQUM7WUFFRCxRQUFRLEVBQUUsR0FBUyxFQUFFO1lBQ3JCLENBQUM7WUFFRCxZQUFZLEVBQUUsQ0FBQyxNQUFtQixFQUFFLE1BQU0sR0FBRyxJQUFJLEVBQVEsRUFBRTtnQkFDdkQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25FLENBQUM7WUFFRCxXQUFXLEVBQUUsQ0FBQyxNQUFnQixFQUFRLEVBQUU7Z0JBQ3BDLEtBQUssQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDakQsQ0FBQztZQUVELGNBQWMsRUFBRSxDQUFDLE1BQW1CLEVBQVEsRUFBRTtZQUM5QyxDQUFDO1lBRUQsaUJBQWlCLEVBQUUsQ0FBQyxNQUFtQixFQUFRLEVBQUU7WUFDakQsQ0FBQztZQUVELGFBQWEsRUFBRSxDQUFDLE1BQW1CLEVBQVEsRUFBRTtZQUM3QyxDQUFDO1NBQ1ksQ0FBQztJQUN0QixDQUFDOzs7WUE1REosVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U2VhcmNoTWV0YSwgU2VhcmNoTWV0YUZpZWxkTWFwfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7UmVjb3JkTGlzdE1vZGFsU3RvcmV9IGZyb20gJy4uL3N0b3JlL3JlY29yZC1saXN0LW1vZGFsL3JlY29yZC1saXN0LW1vZGFsLnN0b3JlJztcbmltcG9ydCB7UmVjb3JkTGlzdE1vZGFsRmlsdGVyQWRhcHRlckludGVyZmFjZX0gZnJvbSAnLi9hZGFwdGVyLm1vZGVsJztcbmltcG9ydCB7RmlsdGVyQ29uZmlnfSBmcm9tICcuLi8uLi9saXN0LWZpbHRlci9jb21wb25lbnRzL2xpc3QtZmlsdGVyL2xpc3QtZmlsdGVyLm1vZGVsJztcbmltcG9ydCB7U2F2ZWRGaWx0ZXJ9IGZyb20gJy4uLy4uLy4uL3N0b3JlL3NhdmVkLWZpbHRlcnMvc2F2ZWQtZmlsdGVyLm1vZGVsJztcbmltcG9ydCB7b2Z9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTW9kYWxSZWNvcmRGaWx0ZXJBZGFwdGVyIGltcGxlbWVudHMgUmVjb3JkTGlzdE1vZGFsRmlsdGVyQWRhcHRlckludGVyZmFjZSB7XG5cbiAgICBnZXRDb25maWcoc3RvcmU6IFJlY29yZExpc3RNb2RhbFN0b3JlKTogRmlsdGVyQ29uZmlnIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtsYXNzOiAnbGlnaHQtZmlsdGVyJyxcbiAgICAgICAgICAgIHBhbmVsTW9kZTogJ2NvbGxhcHNpYmxlJyxcbiAgICAgICAgICAgIGlzQ29sbGFwc2VkOiB0cnVlLFxuICAgICAgICAgICAgY29sbGFwc2VPblNlYXJjaDogdHJ1ZSxcbiAgICAgICAgICAgIHNhdmVkRmlsdGVyRWRpdDogZmFsc2UsXG4gICAgICAgICAgICBtb2R1bGU6IHN0b3JlLnJlY29yZExpc3QuZ2V0TW9kdWxlKCksXG4gICAgICAgICAgICBmaWx0ZXIkOiBzdG9yZS5yZWNvcmRMaXN0LmNyaXRlcmlhJC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcChjcml0ZXJpYSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6ICdkZWZhdWx0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyaXRlcmlhXG4gICAgICAgICAgICAgICAgICAgIH0gYXMgU2F2ZWRGaWx0ZXJcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHNhdmVkRmlsdGVycyQ6IG9mKFtdKSxcbiAgICAgICAgICAgIHNlYXJjaEZpZWxkcyQ6IHN0b3JlLnNlYXJjaE1ldGFkYXRhJC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCgoc2VhcmNoTWV0YTogU2VhcmNoTWV0YSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2VhcmNoTWV0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHt9IGFzIFNlYXJjaE1ldGFGaWVsZE1hcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCB0eXBlID0gJ2FkdmFuY2VkJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWFyY2hNZXRhLmxheW91dC5hZHZhbmNlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICdiYXNpYyc7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VhcmNoTWV0YS5sYXlvdXRbdHlwZV07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBsaXN0RmllbGRzOiBbXSxcblxuICAgICAgICAgICAgb25DbG9zZTogKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgb25TZWFyY2g6ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHVwZGF0ZUZpbHRlcjogKGZpbHRlcjogU2F2ZWRGaWx0ZXIsIHJlbG9hZCA9IHRydWUpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICBzdG9yZS5yZWNvcmRMaXN0LnVwZGF0ZVNlYXJjaENyaXRlcmlhKGZpbHRlci5jcml0ZXJpYSwgcmVsb2FkKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHJlc2V0RmlsdGVyOiAocmVsb2FkPzogYm9vbGVhbik6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHN0b3JlLnJlY29yZExpc3QucmVzZXRTZWFyY2hDcml0ZXJpYShyZWxvYWQpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgYWRkU2F2ZWRGaWx0ZXI6IChmaWx0ZXI6IFNhdmVkRmlsdGVyKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICByZW1vdmVTYXZlZEZpbHRlcjogKGZpbHRlcjogU2F2ZWRGaWx0ZXIpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldE9wZW5GaWx0ZXI6IChmaWx0ZXI6IFNhdmVkRmlsdGVyKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9IGFzIEZpbHRlckNvbmZpZztcbiAgICB9XG59XG4iXX0=