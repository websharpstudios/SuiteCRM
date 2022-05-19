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
import { BehaviorSubject } from 'rxjs';
import { emptyObject } from 'common';
import { take } from 'rxjs/operators';
import { HistoryTimelineStoreFactory } from './history-timeline.store.factory';
export class HistoryTimelineAdapter {
    constructor(historyTimelineStoreFactory) {
        this.historyTimelineStoreFactory = historyTimelineStoreFactory;
        this.loading = false;
        this.cache = [];
        this.dataStream = new BehaviorSubject(this.cache);
        this.dataStream$ = this.dataStream.asObservable();
        this.defaultPageSize = 10;
    }
    /**
     * @returns {void}
     * @param {ViewContext} context - parent module context
     * @description adapter init function to initialize timeline store
     */
    init(context) {
        this.store = this.historyTimelineStoreFactory.create();
        this.store.init(context);
    }
    /**
     * @returns {Observable<HistoryTimelineEntry[]>} return observable array of timeline entries
     * @description retrieve next set of records starting from the current offset
     * represented by the field this.cache.length
     * @param {boolean} reload timeline
     */
    fetchTimelineEntries(reload) {
        if (this.loading === true) {
            return;
        }
        if (reload === true) {
            this.cache.length = 0;
        }
        this.store.initSearchCriteria(this.cache.length, this.defaultPageSize);
        this.loading = true;
        this.store.load(false).pipe(take(1)).subscribe(value => {
            this.loading = false;
            const records = value.records;
            if (!emptyObject(records)) {
                Object.keys(records).forEach(key => {
                    this.cache.push(this.buildTimelineEntry(records[key]));
                });
            }
            this.dataStream.next([...this.cache]);
        });
        return this.dataStream$;
    }
    /**
     * @returns {string} color code
     * @param {string} activity the valid activity types
     * @description {returns the mapped background color code defined for an activity}
     */
    getActivityGridColor(activity) {
        const colorMap = {
            calls: 'yellow',
            tasks: 'green',
            meetings: 'blue',
            notes: 'orange',
            audit: 'purple',
            history: 'purple'
        };
        return colorMap[activity] || 'yellow';
    }
    /**
     * @returns {HistoryTimelineEntry} Timeline Entry
     * @param {Record} record object
     * @description {returns the mapped record to timeline entry}
     */
    buildTimelineEntry(record) {
        const timelineModule = record.module;
        let moduleIcon = record.attributes.module_name;
        if (timelineModule === 'audit') {
            moduleIcon = 'History';
        }
        const gridColor = this.getActivityGridColor(record.module);
        const timelineEntry = {
            module: timelineModule,
            icon: moduleIcon,
            color: gridColor,
            title: {
                type: 'varchar',
                value: record.attributes.name
            },
            user: {
                type: 'varchar',
                value: record.attributes.assigned_user_name.user_name,
            },
            date: {
                type: 'datetime',
                value: record.attributes.date_end,
            },
            record
        };
        if (timelineModule === 'audit') {
            timelineEntry.description = {
                type: 'html',
                value: record.attributes.description
            };
        }
        return timelineEntry;
    }
}
HistoryTimelineAdapter.decorators = [
    { type: Injectable }
];
HistoryTimelineAdapter.ctorParameters = () => [
    { type: HistoryTimelineStoreFactory }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlzdG9yeS10aW1lbGluZS5hZGFwdGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29udGFpbmVycy9zaWRlYmFyLXdpZGdldC9jb21wb25lbnRzL2hpc3Rvcnktc2lkZWJhci13aWRnZXQvaGlzdG9yeS10aW1lbGluZS5hZGFwdGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLGVBQWUsRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUVqRCxPQUFPLEVBQUMsV0FBVyxFQUFzQixNQUFNLFFBQVEsQ0FBQztBQUN4RCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEMsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFLN0UsTUFBTSxPQUFPLHNCQUFzQjtJQVUvQixZQUFzQiwyQkFBd0Q7UUFBeEQsZ0NBQTJCLEdBQTNCLDJCQUEyQixDQUE2QjtRQVQ5RSxZQUFPLEdBQUcsS0FBSyxDQUFDO1FBRWhCLFVBQUssR0FBMkIsRUFBRSxDQUFDO1FBQ25DLGVBQVUsR0FBRyxJQUFJLGVBQWUsQ0FBeUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JFLGdCQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVyQyxvQkFBZSxHQUFHLEVBQUUsQ0FBQztJQUs3QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILElBQUksQ0FBQyxPQUFvQjtRQUVyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN2RCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUks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QUFhLENBQUMsV0FBVyxHQUFHO2dCQUN4QixJQUFJLEVBQUUsTUFBTTtnQkFDWixLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXO2FBQ3ZDLENBQUM7U0FDTDtRQUNELE9BQU8sYUFBYSxDQUFDO0lBQ3pCLENBQUM7OztZQXhISixVQUFVOzs7WUFKSCwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0hpc3RvcnlUaW1lbGluZUVudHJ5fSBmcm9tICcuL2hpc3Rvcnktc2lkZWJhci13aWRnZXQubW9kZWwnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtIaXN0b3J5VGltZWxpbmVTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvaGlzdG9yeS10aW1lbGluZS9oaXN0b3J5LXRpbWVsaW5lLnN0b3JlJztcbmltcG9ydCB7ZW1wdHlPYmplY3QsIFJlY29yZCwgVmlld0NvbnRleHR9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge3Rha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7SGlzdG9yeVRpbWVsaW5lU3RvcmVGYWN0b3J5fSBmcm9tICcuL2hpc3RvcnktdGltZWxpbmUuc3RvcmUuZmFjdG9yeSc7XG5cbmV4cG9ydCB0eXBlIEFjdGl2aXR5VHlwZXMgPSAnY2FsbHMnIHwgJ3Rhc2tzJyB8ICdtZWV0aW5ncycgfCAnaGlzdG9yeScgfCAnYXVkaXQnIHwgJ25vdGVzJyB8IHN0cmluZztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEhpc3RvcnlUaW1lbGluZUFkYXB0ZXIge1xuICAgIGxvYWRpbmcgPSBmYWxzZTtcblxuICAgIGNhY2hlOiBIaXN0b3J5VGltZWxpbmVFbnRyeVtdID0gW107XG4gICAgZGF0YVN0cmVhbSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8SGlzdG9yeVRpbWVsaW5lRW50cnlbXT4odGhpcy5jYWNoZSk7XG4gICAgZGF0YVN0cmVhbSQgPSB0aGlzLmRhdGFTdHJlYW0uYXNPYnNlcnZhYmxlKCk7XG5cbiAgICBwcml2YXRlIGRlZmF1bHRQYWdlU2l6ZSA9IDEwO1xuICAgIHByaXZhdGUgc3RvcmU6IEhpc3RvcnlUaW1lbGluZVN0b3JlO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGhpc3RvcnlUaW1lbGluZVN0b3JlRmFjdG9yeTogSGlzdG9yeVRpbWVsaW5lU3RvcmVGYWN0b3J5XG4gICAgKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICogQHBhcmFtIHtWaWV3Q29udGV4dH0gY29udGV4dCAtIHBhcmVudCBtb2R1bGUgY29udGV4dFxuICAgICAqIEBkZXNjcmlwdGlvbiBhZGFwdGVyIGluaXQgZnVuY3Rpb24gdG8gaW5pdGlhbGl6ZSB0aW1lbGluZSBzdG9yZVxuICAgICAqL1xuICAgIGluaXQoY29udGV4dDogVmlld0NvbnRleHQpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLnN0b3JlID0gdGhpcy5oaXN0b3J5VGltZWxpbmVTdG9yZUZhY3RvcnkuY3JlYXRlKCk7XG4gICAgICAgIHRoaXMuc3RvcmUuaW5pdChjb250ZXh0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZTxIaXN0b3J5VGltZWxpbmVFbnRyeVtdPn0gcmV0dXJuIG9ic2VydmFibGUgYXJyYXkgb2YgdGltZWxpbmUgZW50cmllc1xuICAgICAqIEBkZXNjcmlwdGlvbiByZXRyaWV2ZSBuZXh0IHNldCBvZiByZWNvcmRzIHN0YXJ0aW5nIGZyb20gdGhlIGN1cnJlbnQgb2Zmc2V0XG4gICAgICogcmVwcmVzZW50ZWQgYnkgdGhlIGZpZWxkIHRoaXMuY2FjaGUubGVuZ3RoXG4gICAgICogQHBhcmFtIHtib29sZWFufSByZWxvYWQgdGltZWxpbmVcbiAgICAgKi9cbiAgICBmZXRjaFRpbWVsaW5lRW50cmllcyhyZWxvYWQ6IGJvb2xlYW4pOiBPYnNlcnZhYmxlPEhpc3RvcnlUaW1lbGluZUVudHJ5W10+IHtcblxuICAgICAgICBpZiAodGhpcy5sb2FkaW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVsb2FkID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlLmxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdG9yZS5pbml0U2VhcmNoQ3JpdGVyaWEodGhpcy5jYWNoZS5sZW5ndGgsIHRoaXMuZGVmYXVsdFBhZ2VTaXplKTtcblxuICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnN0b3JlLmxvYWQoZmFsc2UpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkczogUmVjb3JkIFtdID0gdmFsdWUucmVjb3JkcztcblxuICAgICAgICAgICAgaWYgKCFlbXB0eU9iamVjdChyZWNvcmRzKSkge1xuXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocmVjb3JkcykuZm9yRWFjaChrZXkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucHVzaCh0aGlzLmJ1aWxkVGltZWxpbmVFbnRyeShyZWNvcmRzW2tleV0pKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGF0YVN0cmVhbS5uZXh0KFsuLi50aGlzLmNhY2hlXSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhU3RyZWFtJDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBjb2xvciBjb2RlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGFjdGl2aXR5IHRoZSB2YWxpZCBhY3Rpdml0eSB0eXBlc1xuICAgICAqIEBkZXNjcmlwdGlvbiB7cmV0dXJucyB0aGUgbWFwcGVkIGJhY2tncm91bmQgY29sb3IgY29kZSBkZWZpbmVkIGZvciBhbiBhY3Rpdml0eX1cbiAgICAgKi9cbiAgICBnZXRBY3Rpdml0eUdyaWRDb2xvcihhY3Rpdml0eTogQWN0aXZpdHlUeXBlcyk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGNvbG9yTWFwID0ge1xuICAgICAgICAgICAgY2FsbHM6ICd5ZWxsb3cnLFxuICAgICAgICAgICAgdGFza3M6ICdncmVlbicsXG4gICAgICAgICAgICBtZWV0aW5nczogJ2JsdWUnLFxuICAgICAgICAgICAgbm90ZXM6ICdvcmFuZ2UnLFxuICAgICAgICAgICAgYXVkaXQ6ICdwdXJwbGUnLFxuICAgICAgICAgICAgaGlzdG9yeTogJ3B1cnBsZSdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGNvbG9yTWFwW2FjdGl2aXR5XSB8fCAneWVsbG93JztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7SGlzdG9yeVRpbWVsaW5lRW50cnl9IFRpbWVsaW5lIEVudHJ5XG4gICAgICogQHBhcmFtIHtSZWNvcmR9IHJlY29yZCBvYmplY3RcbiAgICAgKiBAZGVzY3JpcHRpb24ge3JldHVybnMgdGhlIG1hcHBlZCByZWNvcmQgdG8gdGltZWxpbmUgZW50cnl9XG4gICAgICovXG4gICAgYnVpbGRUaW1lbGluZUVudHJ5KHJlY29yZDogUmVjb3JkKTogSGlzdG9yeVRpbWVsaW5lRW50cnkge1xuXG4gICAgICAgIGNvbnN0IHRpbWVsaW5lTW9kdWxlID0gcmVjb3JkLm1vZHVsZTtcblxuICAgICAgICBsZXQgbW9kdWxlSWNvbiA9IHJlY29yZC5hdHRyaWJ1dGVzLm1vZHVsZV9uYW1lO1xuICAgICAgICBpZiAodGltZWxpbmVNb2R1bGUgPT09ICdhdWRpdCcpIHtcbiAgICAgICAgICAgIG1vZHVsZUljb24gPSAnSGlzdG9yeSc7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBncmlkQ29sb3IgPSB0aGlzLmdldEFjdGl2aXR5R3JpZENvbG9yKHJlY29yZC5tb2R1bGUpO1xuXG4gICAgICAgIGNvbnN0IHRpbWVsaW5lRW50cnkgPSB7XG4gICAgICAgICAgICBtb2R1bGU6IHRpbWVsaW5lTW9kdWxlLFxuICAgICAgICAgICAgaWNvbjogbW9kdWxlSWNvbixcbiAgICAgICAgICAgIGNvbG9yOiBncmlkQ29sb3IsXG4gICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgIHR5cGU6ICd2YXJjaGFyJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmF0dHJpYnV0ZXMubmFtZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVzZXI6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAndmFyY2hhcicsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hdHRyaWJ1dGVzLmFzc2lnbmVkX3VzZXJfbmFtZS51c2VyX25hbWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0ZToge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdkYXRldGltZScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hdHRyaWJ1dGVzLmRhdGVfZW5kLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlY29yZFxuICAgICAgICB9IGFzIEhpc3RvcnlUaW1lbGluZUVudHJ5O1xuXG4gICAgICAgIGlmICh0aW1lbGluZU1vZHVsZSA9PT0gJ2F1ZGl0Jykge1xuXG4gICAgICAgICAgICB0aW1lbGluZUVudHJ5LmRlc2NyaXB0aW9uID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdodG1sJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmF0dHJpYnV0ZXMuZGVzY3JpcHRpb25cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRpbWVsaW5lRW50cnk7XG4gICAgfVxufVxuIl19