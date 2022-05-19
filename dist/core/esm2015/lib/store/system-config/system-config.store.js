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
    configs: {},
    loading: false
};
let internalState = deepClone(initialState);
let cache$ = null;
export class SystemConfigStore {
    constructor(collectionGQL) {
        this.collectionGQL = collectionGQL;
        this.store = new BehaviorSubject(internalState);
        this.state$ = this.store.asObservable();
        this.resourceName = 'systemConfigs';
        this.fieldsMetadata = {
            fields: [
                'id',
                '_id',
                'value',
                'items'
            ]
        };
        this.configs$ = this.state$.pipe(map(state => state.configs), distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading));
    }
    /**
     * Public Api
     */
    /**
     * Get system config value by key
     *
     * @param {string} configKey of the config
     * @returns {{}|string} config value
     */
    getConfigValue(configKey) {
        if (!internalState.configs || !internalState.configs[configKey]) {
            return null;
        }
        if (internalState.configs[configKey].value !== null) {
            return internalState.configs[configKey].value;
        }
        return internalState.configs[configKey].items;
    }
    getHomePage() {
        let defaultModule = 'home';
        const defaultModuleConfig = this.getConfigValue('default_module');
        if (defaultModuleConfig) {
            defaultModule = defaultModuleConfig;
        }
        return defaultModule;
    }
    /**
     * Clear state
     */
    clear() {
        cache$ = null;
        this.updateState(deepClone(initialState));
    }
    clearAuthBased() {
    }
    /**
     * Initial SystemConfigs load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @returns {Observable<{}>} observable
     */
    load() {
        this.updateState(Object.assign(Object.assign({}, internalState), { loading: true }));
        return this.getSystemConfigs().pipe(tap(configs => {
            this.updateState(Object.assign(Object.assign({}, internalState), { configs, loading: false }));
        }));
    }
    /**
     * Internal API
     */
    /**
     * Update the state
     *
     * @param {{}} state new state
     */
    updateState(state) {
        this.store.next(internalState = state);
    }
    /**
     * Get SystemConfigs cached Observable or call the backend
     *
     * @returns {Observable<{}>} observable
     */
    getSystemConfigs() {
        if (cache$ == null) {
            cache$ = this.fetch().pipe(shareReplay(1));
        }
        return cache$;
    }
    /**
     * Fetch the App strings from the backend
     *
     * @returns {Observable<{}>} observable
     */
    fetch() {
        return this.collectionGQL
            .fetchAll(this.resourceName, this.fieldsMetadata).pipe(map(({ data }) => {
            const configs = {};
            if (data.systemConfigs && data.systemConfigs.edges) {
                data.systemConfigs.edges.forEach((edge) => {
                    // eslint-disable-next-line no-underscore-dangle
                    configs[edge.node._id] = edge.node;
                });
            }
            return configs;
        }));
    }
}
SystemConfigStore.ɵprov = i0.ɵɵdefineInjectable({ factory: function SystemConfigStore_Factory() { return new SystemConfigStore(i0.ɵɵinject(i1.CollectionGQL)); }, token: SystemConfigStore, providedIn: "root" });
SystemConfigStore.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
SystemConfigStore.ctorParameters = () => [
    { type: CollectionGQL }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzdGVtLWNvbmZpZy5zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zdG9yZS9zeXN0ZW0tY29uZmlnL3N5c3RlbS1jb25maWcuc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUNqRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbURBQW1ELENBQUM7QUFDaEYsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFFBQVEsQ0FBQzs7O0FBbUJqQyxNQUFNLFlBQVksR0FBa0I7SUFDaEMsT0FBTyxFQUFFLEVBQUU7SUFDWCxPQUFPLEVBQUUsS0FBSztDQUNqQixDQUFDO0FBRUYsSUFBSSxhQUFhLEdBQWtCLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUUzRCxJQUFJLE1BQU0sR0FBb0IsSUFBSSxDQUFDO0FBS25DLE1BQU0sT0FBTyxpQkFBaUI7SUFpQjFCLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBYnRDLFVBQUssR0FBRyxJQUFJLGVBQWUsQ0FBZ0IsYUFBYSxDQUFDLENBQUM7UUFDMUQsV0FBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbkMsaUJBQVksR0FBRyxlQUFlLENBQUM7UUFDL0IsbUJBQWMsR0FBRztZQUN2QixNQUFNLEVBQUU7Z0JBQ0osSUFBSTtnQkFDSixLQUFLO2dCQUNMLE9BQU87Z0JBQ1AsT0FBTzthQUNWO1NBQ0osQ0FBQztRQUlF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LGdEQUFnRDtvQkFDaEQsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDdkMsQ0FBQyxDQUFDLENBQUM7YUFDTjtZQUVELE9BQU8sT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDWixDQUFDOzs7O1lBeElKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7O1lBL0JPLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2Rpc3RpbmN0VW50aWxDaGFuZ2VkLCBtYXAsIHNoYXJlUmVwbGF5LCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtDb2xsZWN0aW9uR1FMfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hcGkvZ3JhcGhxbC1hcGkvYXBpLmNvbGxlY3Rpb24uZ2V0JztcbmltcG9ydCB7ZGVlcENsb25lfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtTdGF0ZVN0b3JlfSBmcm9tICcuLi9zdGF0ZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3lzdGVtQ29uZmlnIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIF9pZDogc3RyaW5nO1xuICAgIHZhbHVlOiBzdHJpbmc7XG4gICAgaXRlbXM6IHsgW2tleTogc3RyaW5nXTogYW55IH07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3lzdGVtQ29uZmlnTWFwIHtcbiAgICBba2V5OiBzdHJpbmddOiBTeXN0ZW1Db25maWc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3lzdGVtQ29uZmlncyB7XG4gICAgY29uZmlnczogU3lzdGVtQ29uZmlnTWFwO1xuICAgIGxvYWRpbmc6IGJvb2xlYW47XG59XG5cbmNvbnN0IGluaXRpYWxTdGF0ZTogU3lzdGVtQ29uZmlncyA9IHtcbiAgICBjb25maWdzOiB7fSxcbiAgICBsb2FkaW5nOiBmYWxzZVxufTtcblxubGV0IGludGVybmFsU3RhdGU6IFN5c3RlbUNvbmZpZ3MgPSBkZWVwQ2xvbmUoaW5pdGlhbFN0YXRlKTtcblxubGV0IGNhY2hlJDogT2JzZXJ2YWJsZTxhbnk+ID0gbnVsbDtcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgU3lzdGVtQ29uZmlnU3RvcmUgaW1wbGVtZW50cyBTdGF0ZVN0b3JlIHtcblxuICAgIGNvbmZpZ3MkOiBPYnNlcnZhYmxlPFN5c3RlbUNvbmZpZ01hcD47XG4gICAgbG9hZGluZyQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgcHJvdGVjdGVkIHN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxTeXN0ZW1Db25maWdzPihpbnRlcm5hbFN0YXRlKTtcbiAgICBwcm90ZWN0ZWQgc3RhdGUkID0gdGhpcy5zdG9yZS5hc09ic2VydmFibGUoKTtcbiAgICBwcm90ZWN0ZWQgcmVzb3VyY2VOYW1lID0gJ3N5c3RlbUNvbmZpZ3MnO1xuICAgIHByb3RlY3RlZCBmaWVsZHNNZXRhZGF0YSA9IHtcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICAnaWQnLFxuICAgICAgICAgICAgJ19pZCcsXG4gICAgICAgICAgICAndmFsdWUnLFxuICAgICAgICAgICAgJ2l0ZW1zJ1xuICAgICAgICBdXG4gICAgfTtcblxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb2xsZWN0aW9uR1FMOiBDb2xsZWN0aW9uR1FMKSB7XG4gICAgICAgIHRoaXMuY29uZmlncyQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5jb25maWdzKSwgZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG4gICAgICAgIHRoaXMubG9hZGluZyQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5sb2FkaW5nKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHVibGljIEFwaVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogR2V0IHN5c3RlbSBjb25maWcgdmFsdWUgYnkga2V5XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnS2V5IG9mIHRoZSBjb25maWdcbiAgICAgKiBAcmV0dXJucyB7e318c3RyaW5nfSBjb25maWcgdmFsdWVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Q29uZmlnVmFsdWUoY29uZmlnS2V5OiBzdHJpbmcpOiBhbnkge1xuICAgICAgICBpZiAoIWludGVybmFsU3RhdGUuY29uZmlncyB8fCAhaW50ZXJuYWxTdGF0ZS5jb25maWdzW2NvbmZpZ0tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGludGVybmFsU3RhdGUuY29uZmlnc1tjb25maWdLZXldLnZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gaW50ZXJuYWxTdGF0ZS5jb25maWdzW2NvbmZpZ0tleV0udmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW50ZXJuYWxTdGF0ZS5jb25maWdzW2NvbmZpZ0tleV0uaXRlbXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEhvbWVQYWdlKCk6IHN0cmluZyB7XG5cbiAgICAgICAgbGV0IGRlZmF1bHRNb2R1bGUgPSAnaG9tZSc7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRNb2R1bGVDb25maWcgPSB0aGlzLmdldENvbmZpZ1ZhbHVlKCdkZWZhdWx0X21vZHVsZScpO1xuXG4gICAgICAgIGlmIChkZWZhdWx0TW9kdWxlQ29uZmlnKSB7XG4gICAgICAgICAgICBkZWZhdWx0TW9kdWxlID0gZGVmYXVsdE1vZHVsZUNvbmZpZztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWZhdWx0TW9kdWxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFyIHN0YXRlXG4gICAgICovXG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgICAgICBjYWNoZSQgPSBudWxsO1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKGRlZXBDbG9uZShpbml0aWFsU3RhdGUpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYXJBdXRoQmFzZWQoKTogdm9pZCB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbCBTeXN0ZW1Db25maWdzIGxvYWQgaWYgbm90IGNhY2hlZCBhbmQgdXBkYXRlIHN0YXRlLlxuICAgICAqIFJldHVybnMgb2JzZXJ2YWJsZSB0byBiZSB1c2VkIGluIHJlc29sdmVyIGlmIG5lZWRlZFxuICAgICAqXG4gICAgICogQHJldHVybnMge09ic2VydmFibGU8e30+fSBvYnNlcnZhYmxlXG4gICAgICovXG4gICAgcHVibGljIGxvYWQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHsuLi5pbnRlcm5hbFN0YXRlLCBsb2FkaW5nOiB0cnVlfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3lzdGVtQ29uZmlncygpLnBpcGUoXG4gICAgICAgICAgICB0YXAoY29uZmlncyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0ZSh7Li4uaW50ZXJuYWxTdGF0ZSwgY29uZmlncywgbG9hZGluZzogZmFsc2V9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgQVBJXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIHN0YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3t9fSBzdGF0ZSBuZXcgc3RhdGVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgdXBkYXRlU3RhdGUoc3RhdGU6IFN5c3RlbUNvbmZpZ3MpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdG9yZS5uZXh0KGludGVybmFsU3RhdGUgPSBzdGF0ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IFN5c3RlbUNvbmZpZ3MgY2FjaGVkIE9ic2VydmFibGUgb3IgY2FsbCB0aGUgYmFja2VuZFxuICAgICAqXG4gICAgICogQHJldHVybnMge09ic2VydmFibGU8e30+fSBvYnNlcnZhYmxlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldFN5c3RlbUNvbmZpZ3MoKTogT2JzZXJ2YWJsZTxhbnk+IHtcblxuICAgICAgICBpZiAoY2FjaGUkID09IG51bGwpIHtcbiAgICAgICAgICAgIGNhY2hlJCA9IHRoaXMuZmV0Y2goKS5waXBlKFxuICAgICAgICAgICAgICAgIHNoYXJlUmVwbGF5KDEpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNhY2hlJDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaCB0aGUgQXBwIHN0cmluZ3MgZnJvbSB0aGUgYmFja2VuZFxuICAgICAqXG4gICAgICogQHJldHVybnMge09ic2VydmFibGU8e30+fSBvYnNlcnZhYmxlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGZldGNoKCk6IE9ic2VydmFibGU8YW55PiB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbkdRTFxuICAgICAgICAgICAgLmZldGNoQWxsKHRoaXMucmVzb3VyY2VOYW1lLCB0aGlzLmZpZWxkc01ldGFkYXRhKS5waXBlKG1hcCgoe2RhdGF9KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29uZmlnczogU3lzdGVtQ29uZmlnTWFwID0ge307XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zeXN0ZW1Db25maWdzICYmIGRhdGEuc3lzdGVtQ29uZmlncy5lZGdlcykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnN5c3RlbUNvbmZpZ3MuZWRnZXMuZm9yRWFjaCgoZWRnZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVyc2NvcmUtZGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWdzW2VkZ2Uubm9kZS5faWRdID0gZWRnZS5ub2RlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlncztcbiAgICAgICAgICAgIH0pKTtcbiAgICB9XG5cbn1cbiJdfQ==