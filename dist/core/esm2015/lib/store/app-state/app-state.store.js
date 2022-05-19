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
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { deepClone } from 'common';
import * as i0 from "@angular/core";
const initialState = {
    loading: false,
    module: null,
    view: null,
    loaded: false,
    routeUrl: null
};
let internalState = deepClone(initialState);
export class AppStateStore {
    constructor() {
        this.store = new BehaviorSubject(internalState);
        this.state$ = this.store.asObservable();
        this.loadingQueue = {};
        this.loading$ = this.state$.pipe(map(state => state.loading), distinctUntilChanged());
        this.module$ = this.state$.pipe(map(state => state.module), distinctUntilChanged());
        this.view$ = this.state$.pipe(map(state => state.view), distinctUntilChanged());
        this.vm$ = combineLatest([this.loading$, this.module$, this.view$]).pipe(map(([loading, module, view]) => ({ loading, module, view, loaded: internalState.loaded })));
        this.updateState(Object.assign(Object.assign({}, internalState), { loading: false }));
    }
    /**
     * Public Api
     */
    /**
     * Clear state
     */
    clear() {
        this.loadingQueue = {};
        this.updateState(deepClone(initialState));
    }
    clearAuthBased() {
    }
    /**
     * Update loading status for given key
     *
     * @param {string} key to update
     * @param {string} loading status to set
     */
    updateLoading(key, loading) {
        if (loading === true) {
            this.addToLoadingQueue(key);
            this.updateState(Object.assign(Object.assign({}, internalState), { loading }));
            return;
        }
        this.removeFromLoadingQueue(key);
        if (this.hasActiveLoading()) {
            this.updateState(Object.assign(Object.assign({}, internalState), { loading }));
        }
    }
    /**
     * Has app been initially loaded
     *
     * @returns {boolean} is loaded
     */
    isLoaded() {
        return internalState.loaded;
    }
    /**
     * Set initial app load status
     *
     * @param {string} loaded flag
     */
    setLoaded(loaded) {
        this.updateState(Object.assign(Object.assign({}, internalState), { loaded }));
    }
    /**
     * Set current module
     *
     * @param {string} module to set as current module
     */
    setModule(module) {
        this.updateState(Object.assign(Object.assign({}, internalState), { module }));
    }
    /**
     * Get the current module
     *
     * @returns {string} current view
     */
    getModule() {
        return internalState.module;
    }
    /**
     * Set current View
     *
     * @param {string} view to set as current view
     */
    setView(view) {
        this.updateState(Object.assign(Object.assign({}, internalState), { view }));
    }
    /**
     * Get the current view
     *
     * @returns {string} current view
     */
    getView() {
        return internalState.view;
    }
    /**
     * Set route url
     *
     * @param {string} routeUrl to set
     */
    setRouteUrl(routeUrl) {
        this.updateState(Object.assign(Object.assign({}, internalState), { routeUrl }));
    }
    /**
     * Get the route ulr
     *
     * @returns {string} current route url
     */
    getRouteUrl() {
        return internalState.routeUrl;
    }
    /**
     * Internal API
     */
    /**
     *  Check if there are still active loadings
     *
     *  @returns {boolean} active loading
     */
    hasActiveLoading() {
        return Object.keys(this.loadingQueue).length < 1;
    }
    /**
     * Remove key from loading queue
     *
     * @param {string} key to remove
     */
    removeFromLoadingQueue(key) {
        if (this.loadingQueue[key]) {
            delete this.loadingQueue[key];
        }
    }
    /**
     * Add key to loading queue
     *
     * @param {string} key to add
     */
    addToLoadingQueue(key) {
        this.loadingQueue[key] = true;
    }
    /**
     * Update the state
     *
     * @param {{}} state app state
     */
    updateState(state) {
        this.store.next(internalState = state);
    }
}
AppStateStore.ɵprov = i0.ɵɵdefineInjectable({ factory: function AppStateStore_Factory() { return new AppStateStore(); }, token: AppStateStore, providedIn: "root" });
AppStateStore.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
AppStateStore.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN0YXRlLnN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3N0b3JlL2FwcC1zdGF0ZS9hcHAtc3RhdGUuc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDaEUsT0FBTyxFQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxRQUFRLENBQUM7O0FBV2pDLE1BQU0sWUFBWSxHQUFhO0lBQzNCLE9BQU8sRUFBRSxLQUFLO0lBQ2QsTUFBTSxFQUFFLElBQUk7SUFDWixJQUFJLEVBQUUsSUFBSTtJQUNWLE1BQU0sRUFBRSxLQUFLO0lBQ2IsUUFBUSxFQUFFLElBQUk7Q0FDakIsQ0FBQztBQUVGLElBQUksYUFBYSxHQUFhLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUt0RCxNQUFNLE9BQU8sYUFBYTtJQWtCdEI7UUFKVSxVQUFLLEdBQUcsSUFBSSxlQUFlLENBQVcsYUFBYSxDQUFDLENBQUM7UUFDckQsV0FBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbkMsaUJBQVksR0FBRyxFQUFFLENBQUM7UUFJeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1FBQ3RGLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJ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RyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyxzQkFBc0IsQ0FBQyxHQUFXO1FBQ3hDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN4QixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDakM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNPLGlCQUFpQixDQUFDLEdBQVc7UUFDbkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyxXQUFXLENBQUMsS0FBZTtRQUNqQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDM0MsQ0FBQzs7OztZQXRMSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2Rpc3RpbmN0VW50aWxDaGFuZ2VkLCBtYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7ZGVlcENsb25lfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtTdGF0ZVN0b3JlfSBmcm9tICcuLi9zdGF0ZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXBwU3RhdGUge1xuICAgIGxvYWRpbmc/OiBib29sZWFuO1xuICAgIG1vZHVsZT86IHN0cmluZztcbiAgICB2aWV3Pzogc3RyaW5nO1xuICAgIGxvYWRlZD86IGJvb2xlYW47XG4gICAgcm91dGVVcmw/OiBzdHJpbmc7XG59XG5cbmNvbnN0IGluaXRpYWxTdGF0ZTogQXBwU3RhdGUgPSB7XG4gICAgbG9hZGluZzogZmFsc2UsXG4gICAgbW9kdWxlOiBudWxsLFxuICAgIHZpZXc6IG51bGwsXG4gICAgbG9hZGVkOiBmYWxzZSxcbiAgICByb3V0ZVVybDogbnVsbFxufTtcblxubGV0IGludGVybmFsU3RhdGU6IEFwcFN0YXRlID0gZGVlcENsb25lKGluaXRpYWxTdGF0ZSk7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIEFwcFN0YXRlU3RvcmUgaW1wbGVtZW50cyBTdGF0ZVN0b3JlIHtcblxuICAgIC8qKlxuICAgICAqIFB1YmxpYyBsb25nLWxpdmVkIG9ic2VydmFibGUgc3RyZWFtc1xuICAgICAqL1xuICAgIGxvYWRpbmckOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIG1vZHVsZSQ6IE9ic2VydmFibGU8c3RyaW5nPjtcbiAgICB2aWV3JDogT2JzZXJ2YWJsZTxzdHJpbmc+O1xuXG4gICAgLyoqXG4gICAgICogVmlld01vZGVsIHRoYXQgcmVzb2x2ZXMgb25jZSBhbGwgdGhlIGRhdGEgaXMgcmVhZHkgKG9yIHVwZGF0ZWQpLi4uXG4gICAgICovXG4gICAgdm0kOiBPYnNlcnZhYmxlPEFwcFN0YXRlPjtcblxuICAgIHByb3RlY3RlZCBzdG9yZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8QXBwU3RhdGU+KGludGVybmFsU3RhdGUpO1xuICAgIHByb3RlY3RlZCBzdGF0ZSQgPSB0aGlzLnN0b3JlLmFzT2JzZXJ2YWJsZSgpO1xuICAgIHByb3RlY3RlZCBsb2FkaW5nUXVldWUgPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMubG9hZGluZyQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5sb2FkaW5nKSwgZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG4gICAgICAgIHRoaXMubW9kdWxlJCA9IHRoaXMuc3RhdGUkLnBpcGUobWFwKHN0YXRlID0+IHN0YXRlLm1vZHVsZSksIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpO1xuICAgICAgICB0aGlzLnZpZXckID0gdGhpcy5zdGF0ZSQucGlwZShtYXAoc3RhdGUgPT4gc3RhdGUudmlldyksIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpO1xuXG4gICAgICAgIHRoaXMudm0kID0gY29tYmluZUxhdGVzdChbdGhpcy5sb2FkaW5nJCwgdGhpcy5tb2R1bGUkLCB0aGlzLnZpZXckXSkucGlwZShcbiAgICAgICAgICAgIG1hcCgoW2xvYWRpbmcsIG1vZHVsZSwgdmlld10pID0+ICh7bG9hZGluZywgbW9kdWxlLCB2aWV3LCBsb2FkZWQ6IGludGVybmFsU3RhdGUubG9hZGVkfSkpXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSh7Li4uaW50ZXJuYWxTdGF0ZSwgbG9hZGluZzogZmFsc2V9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQdWJsaWMgQXBpXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBDbGVhciBzdGF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nUXVldWUgPSB7fTtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZShkZWVwQ2xvbmUoaW5pdGlhbFN0YXRlKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyQXV0aEJhc2VkKCk6IHZvaWQge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSBsb2FkaW5nIHN0YXR1cyBmb3IgZ2l2ZW4ga2V5XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IHRvIHVwZGF0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsb2FkaW5nIHN0YXR1cyB0byBzZXRcbiAgICAgKi9cbiAgICBwdWJsaWMgdXBkYXRlTG9hZGluZyhrZXk6IHN0cmluZywgbG9hZGluZzogYm9vbGVhbik6IHZvaWQge1xuXG4gICAgICAgIGlmIChsb2FkaW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFRvTG9hZGluZ1F1ZXVlKGtleSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHsuLi5pbnRlcm5hbFN0YXRlLCBsb2FkaW5nfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbW92ZUZyb21Mb2FkaW5nUXVldWUoa2V5KTtcblxuICAgICAgICBpZiAodGhpcy5oYXNBY3RpdmVMb2FkaW5nKCkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGUoey4uLmludGVybmFsU3RhdGUsIGxvYWRpbmd9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhcyBhcHAgYmVlbiBpbml0aWFsbHkgbG9hZGVkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gaXMgbG9hZGVkXG4gICAgICovXG4gICAgcHVibGljIGlzTG9hZGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gaW50ZXJuYWxTdGF0ZS5sb2FkZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IGluaXRpYWwgYXBwIGxvYWQgc3RhdHVzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbG9hZGVkIGZsYWdcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0TG9hZGVkKGxvYWRlZDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHsuLi5pbnRlcm5hbFN0YXRlLCBsb2FkZWR9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgY3VycmVudCBtb2R1bGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2R1bGUgdG8gc2V0IGFzIGN1cnJlbnQgbW9kdWxlXG4gICAgICovXG4gICAgcHVibGljIHNldE1vZHVsZShtb2R1bGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHsuLi5pbnRlcm5hbFN0YXRlLCBtb2R1bGV9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGN1cnJlbnQgbW9kdWxlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBjdXJyZW50IHZpZXdcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0TW9kdWxlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBpbnRlcm5hbFN0YXRlLm1vZHVsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgY3VycmVudCBWaWV3XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmlldyB0byBzZXQgYXMgY3VycmVudCB2aWV3XG4gICAgICovXG4gICAgcHVibGljIHNldFZpZXcodmlldzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoey4uLmludGVybmFsU3RhdGUsIHZpZXd9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGN1cnJlbnQgdmlld1xuICAgICAqXG4gICAgICogQHJldHVybnMge3N0cmluZ30gY3VycmVudCB2aWV3XG4gICAgICovXG4gICAgcHVibGljIGdldFZpZXcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGludGVybmFsU3RhdGUudmlldztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgcm91dGUgdXJsXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcm91dGVVcmwgdG8gc2V0XG4gICAgICovXG4gICAgcHVibGljIHNldFJvdXRlVXJsKHJvdXRlVXJsOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSh7Li4uaW50ZXJuYWxTdGF0ZSwgcm91dGVVcmx9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHJvdXRlIHVsclxuICAgICAqXG4gICAgICogQHJldHVybnMge3N0cmluZ30gY3VycmVudCByb3V0ZSB1cmxcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Um91dGVVcmwoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGludGVybmFsU3RhdGUucm91dGVVcmw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgQVBJXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiAgQ2hlY2sgaWYgdGhlcmUgYXJlIHN0aWxsIGFjdGl2ZSBsb2FkaW5nc1xuICAgICAqXG4gICAgICogIEByZXR1cm5zIHtib29sZWFufSBhY3RpdmUgbG9hZGluZ1xuICAgICAqL1xuICAgIHByb3RlY3RlZCBoYXNBY3RpdmVMb2FkaW5nKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5sb2FkaW5nUXVldWUpLmxlbmd0aCA8IDE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGtleSBmcm9tIGxvYWRpbmcgcXVldWVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgdG8gcmVtb3ZlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHJlbW92ZUZyb21Mb2FkaW5nUXVldWUoa2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMubG9hZGluZ1F1ZXVlW2tleV0pIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmxvYWRpbmdRdWV1ZVtrZXldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGtleSB0byBsb2FkaW5nIHF1ZXVlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IHRvIGFkZFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhZGRUb0xvYWRpbmdRdWV1ZShrZXk6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvYWRpbmdRdWV1ZVtrZXldID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIHN0YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3t9fSBzdGF0ZSBhcHAgc3RhdGVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgdXBkYXRlU3RhdGUoc3RhdGU6IEFwcFN0YXRlKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RvcmUubmV4dChpbnRlcm5hbFN0YXRlID0gc3RhdGUpO1xuICAgIH1cbn1cbiJdfQ==