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
import { deepClone } from 'common';
import { StatisticsFetchGQL } from '../statistics/graphql/api.statistics.get';
import { StatisticsStore } from '../statistics/statistics.store';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { FieldManager } from '../../services/record/field/field.manager';
const ɵ0 = {};
const initialState = {
    module: '',
    query: {},
    statistic: {
        id: '',
        data: ɵ0
    },
    loading: false
};
export class SingleValueStatisticsStore extends StatisticsStore {
    constructor(fetchGQL, fieldManager) {
        super(fetchGQL);
        this.fetchGQL = fetchGQL;
        this.fieldManager = fieldManager;
        this.cache$ = null;
        this.internalState = deepClone(initialState);
        this.store = new BehaviorSubject(this.internalState);
        this.state$ = this.store.asObservable();
        this.statistic$ = this.state$.pipe(map(state => state.statistic), distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading), distinctUntilChanged());
    }
    addNewState(statistic) {
        if (!statistic.metadata || !statistic.metadata.dataType) {
            return;
        }
        const field = this.fieldManager.buildShallowField(statistic.metadata.dataType, statistic.data.value);
        field.metadata = {
            digits: 0
        };
        this.updateState(Object.assign(Object.assign({}, this.internalState), { statistic,
            field, loading: false }));
    }
    /**
     * Update the state
     *
     * @param {object} state to set
     */
    updateState(state) {
        super.updateState(state);
    }
}
SingleValueStatisticsStore.decorators = [
    { type: Injectable }
];
SingleValueStatisticsStore.ctorParameters = () => [
    { type: StatisticsFetchGQL },
    { type: FieldManager }
];
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlLXZhbHVlLXN0YXRpc3RpY3Muc3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc3RvcmUvc2luZ2xlLXZhbHVlLXN0YXRpc3RpY3Mvc2luZ2xlLXZhbHVlLXN0YXRpc3RpY3Muc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUNqRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBT2pDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLDBDQUEwQyxDQUFDO0FBQzVFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMvRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLDJDQUEyQyxDQUFDO1dBV3pELEVBQStCO0FBTDdDLE1BQU0sWUFBWSxHQUFHO0lBQ2pCLE1BQU0sRUFBRSxFQUFFO0lBQ1YsS0FBSyxFQUFFLEVBQXFCO0lBQzVCLFNBQVMsRUFBRTtRQUNQLEVBQUUsRUFBRSxFQUFFO1FBQ04sSUFBSSxJQUFpQztLQUNoQjtJQUN6QixPQUFPLEVBQUUsS0FBSztDQUNhLENBQUM7QUFJaEMsTUFBTSxPQUFPLDBCQUEyQixTQUFRLGVBQWU7SUFRM0QsWUFDYyxRQUE0QixFQUM1QixZQUEwQjtRQUVwQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFITixhQUFRLEdBQVIsUUFBUSxDQUFvQjtRQUM1QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQU45QixXQUFNLEdBQW9CLElBQUksQ0FBQztRQUMvQixrQkFBYSxHQUErQixTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDcEUsVUFBSyxHQUFHLElBQUksZUFBZSxDQUE2QixJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFPbEYsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQztRQUMxRixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxvQkFBb0IsRUFBRSxDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUVTLFdBQVcsQ0FBQyxTQUFvQjtRQUV0QyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFO1lBQ3JELE9BQU87U0FDVjtRQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVyRyxLQUFLLENBQUMsUUFBUSxHQUFHO1lBQ2IsTUFBTSxFQUFFLENBQUM7U0FDWixDQUFDO1FBRUYsSUFBSSxDQUFDLFdBQVcsaUNBQ1QsSUFBSSxDQUFDLGFBQWEsS0FDckIsU0FBUztZQUNULEtBQUssRUFDTCxPQUFPLEVBQUUsS0FBSyxJQUNoQixDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyxXQUFXLENBQUMsS0FBaUM7UUFDbkQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDOzs7WUE5Q0osVUFBVTs7O1lBcEJILGtCQUFrQjtZQUdsQixZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWVwQ2xvbmV9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge1xuICAgIFNpbmdsZVZhbHVlU3RhdGlzdGljLFxuICAgIFNpbmdsZVZhbHVlU3RhdGlzdGljc0RhdGEsXG4gICAgU3RhdGlzdGljLFxuICAgIFN0YXRpc3RpY3NRdWVyeVxufSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtTdGF0aXN0aWNzRmV0Y2hHUUx9IGZyb20gJy4uL3N0YXRpc3RpY3MvZ3JhcGhxbC9hcGkuc3RhdGlzdGljcy5nZXQnO1xuaW1wb3J0IHtTdGF0aXN0aWNzU3RvcmV9IGZyb20gJy4uL3N0YXRpc3RpY3Mvc3RhdGlzdGljcy5zdG9yZSc7XG5pbXBvcnQge2Rpc3RpbmN0VW50aWxDaGFuZ2VkLCBtYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7RmllbGRNYW5hZ2VyfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZWNvcmQvZmllbGQvZmllbGQubWFuYWdlcic7XG5pbXBvcnQge1xuICAgIFNpbmdsZVZhbHVlU3RhdGlzdGljc1N0YXRlLFxuICAgIFNpbmdsZVZhbHVlU3RhdGlzdGljc1N0b3JlSW50ZXJmYWNlXG59IGZyb20gJ2NvbW1vbic7XG5cbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcbiAgICBtb2R1bGU6ICcnLFxuICAgIHF1ZXJ5OiB7fSBhcyBTdGF0aXN0aWNzUXVlcnksXG4gICAgc3RhdGlzdGljOiB7XG4gICAgICAgIGlkOiAnJyxcbiAgICAgICAgZGF0YToge30gYXMgU2luZ2xlVmFsdWVTdGF0aXN0aWNzRGF0YVxuICAgIH0gYXMgU2luZ2xlVmFsdWVTdGF0aXN0aWMsXG4gICAgbG9hZGluZzogZmFsc2Vcbn0gYXMgU2luZ2xlVmFsdWVTdGF0aXN0aWNzU3RhdGU7XG5cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNpbmdsZVZhbHVlU3RhdGlzdGljc1N0b3JlIGV4dGVuZHMgU3RhdGlzdGljc1N0b3JlIGltcGxlbWVudHMgU2luZ2xlVmFsdWVTdGF0aXN0aWNzU3RvcmVJbnRlcmZhY2Uge1xuICAgIHN0YXRlJDogT2JzZXJ2YWJsZTxTaW5nbGVWYWx1ZVN0YXRpc3RpY3NTdGF0ZT47XG4gICAgc3RhdGlzdGljJDogT2JzZXJ2YWJsZTxTdGF0aXN0aWM+O1xuICAgIGxvYWRpbmckOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIHByb3RlY3RlZCBjYWNoZSQ6IE9ic2VydmFibGU8YW55PiA9IG51bGw7XG4gICAgcHJvdGVjdGVkIGludGVybmFsU3RhdGU6IFNpbmdsZVZhbHVlU3RhdGlzdGljc1N0YXRlID0gZGVlcENsb25lKGluaXRpYWxTdGF0ZSk7XG4gICAgcHJvdGVjdGVkIHN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxTaW5nbGVWYWx1ZVN0YXRpc3RpY3NTdGF0ZT4odGhpcy5pbnRlcm5hbFN0YXRlKTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgZmV0Y2hHUUw6IFN0YXRpc3RpY3NGZXRjaEdRTCxcbiAgICAgICAgcHJvdGVjdGVkIGZpZWxkTWFuYWdlcjogRmllbGRNYW5hZ2VyXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGZldGNoR1FMKTtcbiAgICAgICAgdGhpcy5zdGF0ZSQgPSB0aGlzLnN0b3JlLmFzT2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLnN0YXRpc3RpYyQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5zdGF0aXN0aWMpLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcbiAgICAgICAgdGhpcy5sb2FkaW5nJCA9IHRoaXMuc3RhdGUkLnBpcGUobWFwKHN0YXRlID0+IHN0YXRlLmxvYWRpbmcpLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWRkTmV3U3RhdGUoc3RhdGlzdGljOiBTdGF0aXN0aWMpOiB2b2lkIHtcblxuICAgICAgICBpZiAoIXN0YXRpc3RpYy5tZXRhZGF0YSB8fCAhc3RhdGlzdGljLm1ldGFkYXRhLmRhdGFUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmllbGRNYW5hZ2VyLmJ1aWxkU2hhbGxvd0ZpZWxkKHN0YXRpc3RpYy5tZXRhZGF0YS5kYXRhVHlwZSwgc3RhdGlzdGljLmRhdGEudmFsdWUpO1xuXG4gICAgICAgIGZpZWxkLm1ldGFkYXRhID0ge1xuICAgICAgICAgICAgZGlnaXRzOiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSh7XG4gICAgICAgICAgICAuLi50aGlzLmludGVybmFsU3RhdGUsXG4gICAgICAgICAgICBzdGF0aXN0aWMsXG4gICAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aGUgc3RhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZSB0byBzZXRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgdXBkYXRlU3RhdGUoc3RhdGU6IFNpbmdsZVZhbHVlU3RhdGlzdGljc1N0YXRlKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnVwZGF0ZVN0YXRlKHN0YXRlKTtcbiAgICB9XG59XG4iXX0=