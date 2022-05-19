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
import { distinctUntilChanged, map, shareReplay, tap } from 'rxjs/operators';
import { CollectionGQL } from '../../services/api/graphql-api/api.collection.get';
import { deepClone } from 'common';
import * as i0 from "@angular/core";
import * as i1 from "../../services/api/graphql-api/api.collection.get";
const initialState = {
    userPreferences: {},
    loading: false
};
let internalState = deepClone(initialState);
let cache$ = null;
export class UserPreferenceStore {
    constructor(collectionGQL) {
        this.collectionGQL = collectionGQL;
        this.store = new BehaviorSubject(internalState);
        this.state$ = this.store.asObservable();
        this.resourceName = 'userPreferences';
        this.fieldsMetadata = {
            fields: [
                'id',
                '_id',
                'value',
                'items'
            ]
        };
        /**
         * Public long-lived observable streams
         */
        this.userPreferences$ = this.state$.pipe(map(state => state.userPreferences), distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading));
    }
    /**
     * Public Api
     */
    /**
     * Clear state
     */
    clear() {
        cache$ = null;
        this.updateState(deepClone(initialState));
    }
    clearAuthBased() {
        this.clear();
    }
    /**
     * Get user preferences value by key
     *
     * @param {string} key to retrieve
     * @returns any users preference
     */
    getUserPreference(key) {
        if (!internalState.userPreferences || !internalState.userPreferences[key]) {
            return null;
        }
        return internalState.userPreferences[key];
    }
    /**
     * Initial UserPreferences load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @returns {object} Observable<any>
     */
    load() {
        this.updateState(Object.assign(Object.assign({}, internalState), { loading: true }));
        return this.getUserPreferences().pipe(tap(userPreferences => {
            this.updateState(Object.assign(Object.assign({}, internalState), { userPreferences, loading: false }));
        }));
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
        this.store.next(internalState = state);
    }
    /**
     * Get UserPreferences cached Observable or call the backend
     *
     * @returns {object} Observable<any>
     */
    getUserPreferences() {
        if (cache$ == null) {
            cache$ = this.fetch().pipe(shareReplay(1));
        }
        return cache$;
    }
    /**
     * Fetch the User Preferences from the backend
     *
     * @returns {object} Observable<any>
     */
    fetch() {
        return this.collectionGQL
            .fetchAll(this.resourceName, this.fieldsMetadata).pipe(map(({ data }) => {
            const userPreferences = {};
            if (data.userPreferences && data.userPreferences.edges) {
                data.userPreferences.edges.forEach((edge) => {
                    if (!edge.node.items) {
                        return;
                    }
                    Object.keys(edge.node.items).forEach(key => {
                        userPreferences[key] = edge.node.items[key];
                    });
                });
            }
            return userPreferences;
        }));
    }
}
UserPreferenceStore.ɵprov = i0.ɵɵdefineInjectable({ factory: function UserPreferenceStore_Factory() { return new UserPreferenceStore(i0.ɵɵinject(i1.CollectionGQL)); }, token: UserPreferenceStore, providedIn: "root" });
UserPreferenceStore.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
UserPreferenceStore.ctorParameters = () => [
    { type: CollectionGQL }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wcmVmZXJlbmNlLnN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3N0b3JlL3VzZXItcHJlZmVyZW5jZS91c2VyLXByZWZlcmVuY2Uuc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUNqRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbURBQW1ELENBQUM7QUFDaEYsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFFBQVEsQ0FBQzs7O0FBWWpDLE1BQU0sWUFBWSxHQUFvQjtJQUNsQyxlQUFlLEVBQUUsRUFBRTtJQUNuQixPQUFPLEVBQUUsS0FBSztDQUNqQixDQUFDO0FBRUYsSUFBSSxhQUFhLEdBQW9CLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUU3RCxJQUFJLE1BQU0sR0FBb0IsSUFBSSxDQUFDO0FBS25DLE1BQU0sT0FBTyxtQkFBbUI7SUFtQjVCLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBbEJ0QyxVQUFLLEdBQUcsSUFBSSxlQUFlLENBQWtCLGFBQWEsQ0FBQyxDQUFDO1FBQzVELFdBQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ25DLGlCQUFZLEdBQUcsaUJBQWlCLENBQUM7UUFDakMsbUJBQWMsR0FBRztZQUN2QixNQUFNLEVBQUU7Z0JBQ0osSUFBSTtnQkFDSixLQUFLO2dCQUNMLE9BQU87Z0JBQ1AsT0FBTzthQUNWO1NBQ0os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UUFDM0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNaLENBQUM7Ozs7WUFqSUosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUF4Qk8sYUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZGlzdGluY3RVbnRpbENoYW5nZWQsIG1hcCwgc2hhcmVSZXBsYXksIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0NvbGxlY3Rpb25HUUx9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FwaS9ncmFwaHFsLWFwaS9hcGkuY29sbGVjdGlvbi5nZXQnO1xuaW1wb3J0IHtkZWVwQ2xvbmV9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge1N0YXRlU3RvcmV9IGZyb20gJy4uL3N0YXRlJztcblxuZXhwb3J0IGludGVyZmFjZSBVc2VyUHJlZmVyZW5jZU1hcCB7XG4gICAgW2tleTogc3RyaW5nXTogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJQcmVmZXJlbmNlcyB7XG4gICAgdXNlclByZWZlcmVuY2VzOiBVc2VyUHJlZmVyZW5jZU1hcDtcbiAgICBsb2FkaW5nOiBib29sZWFuO1xufVxuXG5jb25zdCBpbml0aWFsU3RhdGU6IFVzZXJQcmVmZXJlbmNlcyA9IHtcbiAgICB1c2VyUHJlZmVyZW5jZXM6IHt9LFxuICAgIGxvYWRpbmc6IGZhbHNlXG59O1xuXG5sZXQgaW50ZXJuYWxTdGF0ZTogVXNlclByZWZlcmVuY2VzID0gZGVlcENsb25lKGluaXRpYWxTdGF0ZSk7XG5cbmxldCBjYWNoZSQ6IE9ic2VydmFibGU8YW55PiA9IG51bGw7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIFVzZXJQcmVmZXJlbmNlU3RvcmUgaW1wbGVtZW50cyBTdGF0ZVN0b3JlIHtcbiAgICBwcm90ZWN0ZWQgc3RvcmUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFVzZXJQcmVmZXJlbmNlcz4oaW50ZXJuYWxTdGF0ZSk7XG4gICAgcHJvdGVjdGVkIHN0YXRlJCA9IHRoaXMuc3RvcmUuYXNPYnNlcnZhYmxlKCk7XG4gICAgcHJvdGVjdGVkIHJlc291cmNlTmFtZSA9ICd1c2VyUHJlZmVyZW5jZXMnO1xuICAgIHByb3RlY3RlZCBmaWVsZHNNZXRhZGF0YSA9IHtcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICAnaWQnLFxuICAgICAgICAgICAgJ19pZCcsXG4gICAgICAgICAgICAndmFsdWUnLFxuICAgICAgICAgICAgJ2l0ZW1zJ1xuICAgICAgICBdXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFB1YmxpYyBsb25nLWxpdmVkIG9ic2VydmFibGUgc3RyZWFtc1xuICAgICAqL1xuICAgIHVzZXJQcmVmZXJlbmNlcyQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS51c2VyUHJlZmVyZW5jZXMpLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcbiAgICBsb2FkaW5nJCA9IHRoaXMuc3RhdGUkLnBpcGUobWFwKHN0YXRlID0+IHN0YXRlLmxvYWRpbmcpKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29sbGVjdGlvbkdRTDogQ29sbGVjdGlvbkdRTCkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFB1YmxpYyBBcGlcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIENsZWFyIHN0YXRlXG4gICAgICovXG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgICAgICBjYWNoZSQgPSBudWxsO1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKGRlZXBDbG9uZShpbml0aWFsU3RhdGUpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYXJBdXRoQmFzZWQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdXNlciBwcmVmZXJlbmNlcyB2YWx1ZSBieSBrZXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgdG8gcmV0cmlldmVcbiAgICAgKiBAcmV0dXJucyBhbnkgdXNlcnMgcHJlZmVyZW5jZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRVc2VyUHJlZmVyZW5jZShrZXk6IHN0cmluZyk6IGFueSB7XG5cbiAgICAgICAgaWYgKCFpbnRlcm5hbFN0YXRlLnVzZXJQcmVmZXJlbmNlcyB8fCAhaW50ZXJuYWxTdGF0ZS51c2VyUHJlZmVyZW5jZXNba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW50ZXJuYWxTdGF0ZS51c2VyUHJlZmVyZW5jZXNba2V5XTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWwgVXNlclByZWZlcmVuY2VzIGxvYWQgaWYgbm90IGNhY2hlZCBhbmQgdXBkYXRlIHN0YXRlLlxuICAgICAqIFJldHVybnMgb2JzZXJ2YWJsZSB0byBiZSB1c2VkIGluIHJlc29sdmVyIGlmIG5lZWRlZFxuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxhbnk+XG4gICAgICovXG4gICAgcHVibGljIGxvYWQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSh7Li4uaW50ZXJuYWxTdGF0ZSwgbG9hZGluZzogdHJ1ZX0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmdldFVzZXJQcmVmZXJlbmNlcygpLnBpcGUoXG4gICAgICAgICAgICB0YXAodXNlclByZWZlcmVuY2VzID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHsuLi5pbnRlcm5hbFN0YXRlLCB1c2VyUHJlZmVyZW5jZXMsIGxvYWRpbmc6IGZhbHNlfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgQVBJXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIHN0YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc3RhdGUgdG8gc2V0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVN0YXRlKHN0YXRlOiBVc2VyUHJlZmVyZW5jZXMpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdG9yZS5uZXh0KGludGVybmFsU3RhdGUgPSBzdGF0ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IFVzZXJQcmVmZXJlbmNlcyBjYWNoZWQgT2JzZXJ2YWJsZSBvciBjYWxsIHRoZSBiYWNrZW5kXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBPYnNlcnZhYmxlPGFueT5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0VXNlclByZWZlcmVuY2VzKCk6IE9ic2VydmFibGU8YW55PiB7XG5cbiAgICAgICAgaWYgKGNhY2hlJCA9PSBudWxsKSB7XG4gICAgICAgICAgICBjYWNoZSQgPSB0aGlzLmZldGNoKCkucGlwZShcbiAgICAgICAgICAgICAgICBzaGFyZVJlcGxheSgxKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYWNoZSQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2ggdGhlIFVzZXIgUHJlZmVyZW5jZXMgZnJvbSB0aGUgYmFja2VuZFxuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxhbnk+XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGZldGNoKCk6IE9ic2VydmFibGU8YW55PiB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbkdRTFxuICAgICAgICAgICAgLmZldGNoQWxsKHRoaXMucmVzb3VyY2VOYW1lLCB0aGlzLmZpZWxkc01ldGFkYXRhKS5waXBlKG1hcCgoe2RhdGF9KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdXNlclByZWZlcmVuY2VzOiBVc2VyUHJlZmVyZW5jZU1hcCA9IHt9O1xuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEudXNlclByZWZlcmVuY2VzICYmIGRhdGEudXNlclByZWZlcmVuY2VzLmVkZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEudXNlclByZWZlcmVuY2VzLmVkZ2VzLmZvckVhY2goKGVkZ2UpID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlZGdlLm5vZGUuaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGVkZ2Uubm9kZS5pdGVtcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJQcmVmZXJlbmNlc1trZXldID0gZWRnZS5ub2RlLml0ZW1zW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVzZXJQcmVmZXJlbmNlcztcbiAgICAgICAgICAgIH0pKTtcbiAgICB9XG59XG4iXX0=