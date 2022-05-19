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
import { BehaviorSubject, combineLatest, forkJoin } from 'rxjs';
import { distinctUntilChanged, first, map, shareReplay, tap } from 'rxjs/operators';
import { EntityGQL } from '../../services/api/graphql-api/api.entity.get';
import { AppStateStore } from '../app-state/app-state.store';
import { deepClone } from 'common';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/api/graphql-api/api.entity.get";
import * as i2 from "../app-state/app-state.store";
import * as i3 from "../../services/local-storage/local-storage.service";
const initialState = {
    appStrings: {},
    appListStrings: {},
    modStrings: {},
    languageKey: 'en_us',
    loaded: {},
    hasChanged: false
};
let internalState = deepClone(initialState);
const initialCache = {
    appStrings: {},
    appListStrings: {},
    modStrings: {},
};
let loadedLanguages = {};
let cache = deepClone(initialCache);
export class LanguageStore {
    constructor(recordGQL, appStateStore, localStorage) {
        this.recordGQL = recordGQL;
        this.appStateStore = appStateStore;
        this.localStorage = localStorage;
        this.store = new BehaviorSubject(internalState);
        this.state$ = this.store.asObservable();
        this.config = {
            appStrings: {
                fetch: 'fetchAppStrings',
                resourceName: 'appStrings',
                metadata: {
                    fields: [
                        'id',
                        '_id',
                        'items'
                    ]
                }
            },
            appListStrings: {
                fetch: 'fetchAppListStrings',
                resourceName: 'appListStrings',
                metadata: {
                    fields: [
                        'id',
                        '_id',
                        'items'
                    ]
                }
            },
            modStrings: {
                fetch: 'fetchModStrings',
                resourceName: 'modStrings',
                metadata: {
                    fields: [
                        'id',
                        '_id',
                        'items'
                    ]
                }
            },
        };
        this.appStrings$ = this.state$.pipe(map(state => state.appStrings), distinctUntilChanged());
        this.appListStrings$ = this.state$.pipe(map(state => state.appListStrings), distinctUntilChanged());
        this.modStrings$ = this.state$.pipe(map(state => state.modStrings), distinctUntilChanged());
        this.languageKey$ = this.state$.pipe(map(state => state.languageKey), distinctUntilChanged());
        this.vm$ = combineLatest([
            this.appStrings$,
            this.appListStrings$,
            this.modStrings$,
            this.languageKey$
        ])
            .pipe(map(([appStrings, appListStrings, modStrings, languageKey]) => ({ appStrings, appListStrings, modStrings, languageKey })));
    }
    /**
     * Public Api
     */
    /**
     * Clear state
     */
    clear() {
        loadedLanguages = {};
        cache = deepClone(initialCache);
        this.updateState(deepClone(initialState));
    }
    clearAuthBased() {
        const keysToClear = ['modStrings', 'appListStrings'];
        keysToClear.forEach(type => {
            if (loadedLanguages && loadedLanguages[type]) {
                delete loadedLanguages[type];
            }
        });
        cache.modStrings = {};
        cache.appListStrings = {};
    }
    /**
     * Update the language strings toe the given language
     *
     * @param {string} languageKey language key
     */
    changeLanguage(languageKey) {
        const types = [];
        Object.keys(loadedLanguages).forEach(type => loadedLanguages[type] && types.push(type));
        internalState.hasChanged = true;
        this.appStateStore.updateLoading('change-language', true);
        this.load(languageKey, types).pipe(tap(() => {
            this.localStorage.set('selected_language', languageKey);
            this.appStateStore.updateLoading('change-language', false);
        })).subscribe();
    }
    /**
     * Get All languageStrings label by key
     *
     * @returns {object} LanguageStrings
     */
    getLanguageStrings() {
        if (!internalState) {
            return null;
        }
        return {
            appStrings: internalState.appStrings,
            appListStrings: internalState.appListStrings,
            modStrings: internalState.modStrings,
            languageKey: internalState.languageKey
        };
    }
    /**
     * Get AppStrings label by key
     *
     * @param {string} labelKey to fetch
     * @returns {string} label
     */
    getAppString(labelKey) {
        if (!internalState.appStrings || !internalState.appStrings[labelKey]) {
            return null;
        }
        return internalState.appStrings[labelKey];
    }
    /**
     * Get AppListStrings label by key
     *
     * @param {string} labelKey to fetch
     * @returns {string|{}} app strings
     */
    getAppListString(labelKey) {
        if (!internalState.appListStrings || !internalState.appListStrings[labelKey]) {
            return null;
        }
        return internalState.appListStrings[labelKey];
    }
    /**
     * Get ModStrings label by key
     *
     * @param {string} labelKey to fetch
     * @returns {string|{}} mod strings
     */
    getModString(labelKey) {
        if (!internalState.modStrings || !internalState.modStrings[labelKey]) {
            return null;
        }
        return internalState.modStrings[labelKey];
    }
    /**
     * Get field label
     *
     * @param {string} labelKey to fetch
     * @param {string} module to use
     * @param {object} lang to use
     * @returns {string} label
     */
    getFieldLabel(labelKey, module = null, lang = null) {
        let languages = lang;
        if (!lang) {
            languages = this.getLanguageStrings();
        }
        if (!languages || !languages.modStrings || !labelKey) {
            return '';
        }
        let label = '';
        if (module) {
            label = languages.modStrings[module] && languages.modStrings[module][labelKey];
        }
        if (!label) {
            label = languages.appStrings && languages.appStrings[labelKey];
        }
        return label || '';
    }
    /**
     * Get list label
     *
     * @param {string} listKey to fetch
     * @param {string} labelKey to fetch
     * @returns {string} label
     */
    getListLabel(listKey, labelKey) {
        if (!listKey || !labelKey) {
            return '';
        }
        const listStrings = this.getAppListString(listKey);
        if (!listStrings) {
            return '';
        }
        return listStrings[labelKey] || '';
    }
    /**
     * Get all available string types
     *
     * @returns {string[]} string types
     */
    getAvailableStringsTypes() {
        return Object.keys(this.config);
    }
    /**
     * Returns whether the language has changed manually
     *
     * @returns {boolean} has changed
     */
    hasLanguageChanged() {
        return internalState.hasChanged;
    }
    /**
     * Returns the currently active language
     *
     * @returns {string} current language key
     */
    getCurrentLanguage() {
        const storedLanguage = this.localStorage.get('selected_language');
        if (storedLanguage) {
            return storedLanguage;
        }
        return internalState.languageKey;
    }
    /**
     * Initial Language Strings Load for given language and types if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} languageKey to load
     * @param {string[]} types to load
     * @returns {{}} Observable
     */
    load(languageKey, types) {
        const streams$ = {};
        types.forEach(type => streams$[type] = this.getStrings(languageKey, type));
        return forkJoin(streams$).pipe(first(), tap(result => {
            const stateUpdate = Object.assign(Object.assign({}, internalState), { languageKey });
            types.forEach(type => {
                stateUpdate[type] = result[type];
                loadedLanguages[type] = true;
            });
            this.updateState(stateUpdate);
        }));
    }
    /**
     * Internal API
     */
    /**
     * Update internal state cache and emit from store...
     *
     * @param {{}} state to set
     */
    updateState(state) {
        this.store.next(internalState = state);
    }
    /**
     * Get given $type of strings Observable from cache  or call the backend
     *
     * @param {string} language to load
     * @param {string} type load
     * @returns {{}} Observable<any>
     */
    getStrings(language, type) {
        const stringsCache = cache[type];
        const fetchMethod = this.config[type].fetch;
        if (stringsCache[language]) {
            return stringsCache[language];
        }
        stringsCache[language] = this[fetchMethod](language).pipe(shareReplay(1));
        return stringsCache[language];
    }
    /**
     * Fetch the App strings from the backend
     *
     * @param {string} language to fetch
     * @returns {{}} Observable<{}>
     */
    fetchAppStrings(language) {
        const resourceName = this.config.appStrings.resourceName;
        const fields = this.config.appStrings.metadata;
        return this.recordGQL.fetch(resourceName, `/api/app-strings/${language}`, fields)
            .pipe(map(({ data }) => {
            let items = {};
            if (data.appStrings) {
                items = data.appStrings.items;
            }
            return items;
        }));
    }
    /**
     * Fetch the App list strings from the backend
     *
     * @param {string} language to fetch
     * @returns {{}} Observable<{}>
     */
    fetchAppListStrings(language) {
        const resourceName = this.config.appListStrings.resourceName;
        const fields = this.config.appListStrings.metadata;
        return this.recordGQL.fetch(resourceName, `/api/app-list-strings/${language}`, fields)
            .pipe(map(({ data }) => {
            let items = {};
            if (data.appListStrings) {
                items = data.appListStrings.items;
            }
            return items;
        }));
    }
    /**
     * Fetch the Mod strings from the backend
     *
     * @param {string} language to fetch
     * @returns {{}} Observable<{}>
     */
    fetchModStrings(language) {
        const resourceName = this.config.modStrings.resourceName;
        const fields = this.config.modStrings.metadata;
        return this.recordGQL.fetch(resourceName, `/api/mod-strings/${language}`, fields)
            .pipe(map(({ data }) => {
            let items = {};
            if (data.modStrings) {
                items = data.modStrings.items;
            }
            return items;
        }));
    }
}
LanguageStore.ɵprov = i0.ɵɵdefineInjectable({ factory: function LanguageStore_Factory() { return new LanguageStore(i0.ɵɵinject(i1.EntityGQL), i0.ɵɵinject(i2.AppStateStore), i0.ɵɵinject(i3.LocalStorageService)); }, token: LanguageStore, providedIn: "root" });
LanguageStore.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
LanguageStore.ctorParameters = () => [
    { type: EntityGQL },
    { type: AppStateStore },
    { type: LocalStorageService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2Uuc3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBQzFFLE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sK0NBQStDLENBQUM7QUFDeEUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQzNELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFFakMsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sb0RBQW9ELENBQUM7Ozs7O0FBb0N2RixNQUFNLFlBQVksR0FBa0I7SUFDaEMsVUFBVSxFQUFFLEVBQUU7SUFDZCxjQUFjLEVBQUUsRUFBRTtJQUNsQixVQUFVLEVBQUUsRUFBRTtJQUNkLFdBQVcsRUFBRSxPQUFPO0lBQ3BCLE1BQU0sRUFBRSxFQUFFO0lBQ1YsVUFBVSxFQUFFLEtBQUs7Q0FDcEIsQ0FBQztBQUVGLElBQUksYUFBYSxHQUFrQixTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFM0QsTUFBTSxZQUFZLEdBQWtCO0lBQ2hDLFVBQVUsRUFBRSxFQUFFO0lBQ2QsY0FBYyxFQUFFLEVBQUU7SUFDbEIsVUFBVSxFQUFFLEVBQUU7Q0FDakIsQ0FBQztBQUVGLElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQztBQUN6QixJQUFJ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aGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBmb3JrSm9pbiwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2Rpc3RpbmN0VW50aWxDaGFuZ2VkLCBmaXJzdCwgbWFwLCBzaGFyZVJlcGxheSwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0VudGl0eUdRTH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYXBpL2dyYXBocWwtYXBpL2FwaS5lbnRpdHkuZ2V0JztcbmltcG9ydCB7QXBwU3RhdGVTdG9yZX0gZnJvbSAnLi4vYXBwLXN0YXRlL2FwcC1zdGF0ZS5zdG9yZSc7XG5pbXBvcnQge2RlZXBDbG9uZX0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7U3RhdGVTdG9yZX0gZnJvbSAnLi4vc3RhdGUnO1xuaW1wb3J0IHtMb2NhbFN0b3JhZ2VTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sb2NhbC1zdG9yYWdlL2xvY2FsLXN0b3JhZ2Uuc2VydmljZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGFuZ3VhZ2VTdHJpbmdNYXAge1xuICAgIFtrZXk6IHN0cmluZ106IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMYW5ndWFnZUxpc3RTdHJpbmdNYXAge1xuICAgIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IExhbmd1YWdlU3RyaW5nTWFwO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExvYWRlZExhbmd1YWdlU3RyaW5nTWFwIHtcbiAgICBba2V5OiBzdHJpbmddOiBMYW5ndWFnZVN0cmluZ01hcDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMYW5ndWFnZVN0YXRlIHtcbiAgICBhcHBTdHJpbmdzOiBMYW5ndWFnZVN0cmluZ01hcDtcbiAgICBhcHBMaXN0U3RyaW5nczogTGFuZ3VhZ2VMaXN0U3RyaW5nTWFwO1xuICAgIG1vZFN0cmluZ3M6IExhbmd1YWdlTGlzdFN0cmluZ01hcDtcbiAgICBsYW5ndWFnZUtleTogc3RyaW5nO1xuICAgIGxvYWRlZD86IExvYWRlZExhbmd1YWdlU3RyaW5nTWFwO1xuICAgIGhhc0NoYW5nZWQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGFuZ3VhZ2VTdHJpbmdzIHtcbiAgICBhcHBTdHJpbmdzOiBMYW5ndWFnZVN0cmluZ01hcDtcbiAgICBhcHBMaXN0U3RyaW5nczogTGFuZ3VhZ2VMaXN0U3RyaW5nTWFwO1xuICAgIG1vZFN0cmluZ3M6IExhbmd1YWdlTGlzdFN0cmluZ01hcDtcbiAgICBsYW5ndWFnZUtleTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExhbmd1YWdlQ2FjaGUge1xuICAgIFtrZXk6IHN0cmluZ106IHtcbiAgICAgICAgW2tleTogc3RyaW5nXTogT2JzZXJ2YWJsZTxhbnk+O1xuICAgIH07XG59XG5cbmNvbnN0IGluaXRpYWxTdGF0ZTogTGFuZ3VhZ2VTdGF0ZSA9IHtcbiAgICBhcHBTdHJpbmdzOiB7fSxcbiAgICBhcHBMaXN0U3RyaW5nczoge30sXG4gICAgbW9kU3RyaW5nczoge30sXG4gICAgbGFuZ3VhZ2VLZXk6ICdlbl91cycsXG4gICAgbG9hZGVkOiB7fSxcbiAgICBoYXNDaGFuZ2VkOiBmYWxzZVxufTtcblxubGV0IGludGVybmFsU3RhdGU6IExhbmd1YWdlU3RhdGUgPSBkZWVwQ2xvbmUoaW5pdGlhbFN0YXRlKTtcblxuY29uc3QgaW5pdGlhbENhY2hlOiBMYW5ndWFnZUNhY2hlID0ge1xuICAgIGFwcFN0cmluZ3M6IHt9LFxuICAgIGFwcExpc3RTdHJpbmdzOiB7fSxcbiAgICBtb2RTdHJpbmdzOiB7fSxcbn07XG5cbmxldCBsb2FkZWRMYW5ndWFnZXMgPSB7fTtcbmxldCBjYWNoZTogTGFuZ3VhZ2VDYWNoZSA9IGRlZXBDbG9uZShpbml0aWFsQ2FjaGUpO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBMYW5ndWFnZVN0b3JlIGltcGxlbWVudHMgU3RhdGVTdG9yZSB7XG5cbiAgICAvKipcbiAgICAgKiBQdWJsaWMgbG9uZy1saXZlZCBvYnNlcnZhYmxlIHN0cmVhbXNcbiAgICAgKi9cbiAgICBhcHBTdHJpbmdzJDogT2JzZXJ2YWJsZTxMYW5ndWFnZVN0cmluZ01hcD47XG4gICAgYXBwTGlzdFN0cmluZ3MkOiBPYnNlcnZhYmxlPExhbmd1YWdlTGlzdFN0cmluZ01hcD47XG4gICAgbW9kU3RyaW5ncyQ6IE9ic2VydmFibGU8TGFuZ3VhZ2VMaXN0U3RyaW5nTWFwPjtcbiAgICBsYW5ndWFnZUtleSQ6IE9ic2VydmFibGU8c3RyaW5nPjtcblxuICAgIC8qKlxuICAgICAqIFZpZXdNb2RlbCB0aGF0IHJlc29sdmVzIG9uY2UgYWxsIHRoZSBkYXRhIGlzIHJlYWR5IChvciB1cGRhdGVkKS4uLlxuICAgICAqL1xuICAgIHZtJDogT2JzZXJ2YWJsZTxMYW5ndWFnZVN0cmluZ3M+O1xuXG4gICAgcHJvdGVjdGVkIHN0b3JlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxMYW5ndWFnZVN0YXRlPihpbnRlcm5hbFN0YXRlKTtcbiAgICBwcm90ZWN0ZWQgc3RhdGUkID0gdGhpcy5zdG9yZS5hc09ic2VydmFibGUoKTtcblxuICAgIHByb3RlY3RlZCBjb25maWcgPSB7XG4gICAgICAgIGFwcFN0cmluZ3M6IHtcbiAgICAgICAgICAgIGZldGNoOiAnZmV0Y2hBcHBTdHJpbmdzJyxcbiAgICAgICAgICAgIHJlc291cmNlTmFtZTogJ2FwcFN0cmluZ3MnLFxuICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2lkJyxcbiAgICAgICAgICAgICAgICAgICAgJ19pZCcsXG4gICAgICAgICAgICAgICAgICAgICdpdGVtcydcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFwcExpc3RTdHJpbmdzOiB7XG4gICAgICAgICAgICBmZXRjaDogJ2ZldGNoQXBwTGlzdFN0cmluZ3MnLFxuICAgICAgICAgICAgcmVzb3VyY2VOYW1lOiAnYXBwTGlzdFN0cmluZ3MnLFxuICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2lkJyxcbiAgICAgICAgICAgICAgICAgICAgJ19pZCcsXG4gICAgICAgICAgICAgICAgICAgICdpdGVtcydcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1vZFN0cmluZ3M6IHtcbiAgICAgICAgICAgIGZldGNoOiAnZmV0Y2hNb2RTdHJpbmdzJyxcbiAgICAgICAgICAgIHJlc291cmNlTmFtZTogJ21vZFN0cmluZ3MnLFxuICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2lkJyxcbiAgICAgICAgICAgICAgICAgICAgJ19pZCcsXG4gICAgICAgICAgICAgICAgICAgICdpdGVtcydcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgcmVjb3JkR1FMOiBFbnRpdHlHUUwsXG4gICAgICAgIHByb3RlY3RlZCBhcHBTdGF0ZVN0b3JlOiBBcHBTdGF0ZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbG9jYWxTdG9yYWdlOiBMb2NhbFN0b3JhZ2VTZXJ2aWNlXG4gICAgKSB7XG5cbiAgICAgICAgdGhpcy5hcHBTdHJpbmdzJCA9IHRoaXMuc3RhdGUkLnBpcGUobWFwKHN0YXRlID0+IHN0YXRlLmFwcFN0cmluZ3MpLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcbiAgICAgICAgdGhpcy5hcHBMaXN0U3RyaW5ncyQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5hcHBMaXN0U3RyaW5ncyksIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpO1xuICAgICAgICB0aGlzLm1vZFN0cmluZ3MkID0gdGhpcy5zdGF0ZSQucGlwZShtYXAoc3RhdGUgPT4gc3RhdGUubW9kU3RyaW5ncyksIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpO1xuICAgICAgICB0aGlzLmxhbmd1YWdlS2V5JCA9IHRoaXMuc3RhdGUkLnBpcGUobWFwKHN0YXRlID0+IHN0YXRlLmxhbmd1YWdlS2V5KSwgZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG5cbiAgICAgICAgdGhpcy52bSQgPSBjb21iaW5lTGF0ZXN0KFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwU3RyaW5ncyQsXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBMaXN0U3RyaW5ncyQsXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RTdHJpbmdzJCxcbiAgICAgICAgICAgICAgICB0aGlzLmxhbmd1YWdlS2V5JFxuICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCgoXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcFN0cmluZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBMaXN0U3RyaW5ncyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZFN0cmluZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZUtleVxuICAgICAgICAgICAgICAgICAgICBdKSA9PiAoe2FwcFN0cmluZ3MsIGFwcExpc3RTdHJpbmdzLCBtb2RTdHJpbmdzLCBsYW5ndWFnZUtleX0pXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQdWJsaWMgQXBpXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBDbGVhciBzdGF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgbG9hZGVkTGFuZ3VhZ2VzID0ge307XG4gICAgICAgIGNhY2hlID0gZGVlcENsb25lKGluaXRpYWxDYWNoZSk7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoZGVlcENsb25lKGluaXRpYWxTdGF0ZSkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhckF1dGhCYXNlZCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qga2V5c1RvQ2xlYXIgPSBbJ21vZFN0cmluZ3MnLCAnYXBwTGlzdFN0cmluZ3MnXTtcblxuICAgICAgICBrZXlzVG9DbGVhci5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgaWYgKGxvYWRlZExhbmd1YWdlcyAmJiBsb2FkZWRMYW5ndWFnZXNbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgbG9hZGVkTGFuZ3VhZ2VzW3R5cGVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjYWNoZS5tb2RTdHJpbmdzID0ge307XG4gICAgICAgIGNhY2hlLmFwcExpc3RTdHJpbmdzID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBsYW5ndWFnZSBzdHJpbmdzIHRvZSB0aGUgZ2l2ZW4gbGFuZ3VhZ2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZUtleSBsYW5ndWFnZSBrZXlcbiAgICAgKi9cbiAgICBwdWJsaWMgY2hhbmdlTGFuZ3VhZ2UobGFuZ3VhZ2VLZXk6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCB0eXBlcyA9IFtdO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGxvYWRlZExhbmd1YWdlcykuZm9yRWFjaCh0eXBlID0+IGxvYWRlZExhbmd1YWdlc1t0eXBlXSAmJiB0eXBlcy5wdXNoKHR5cGUpKTtcblxuICAgICAgICBpbnRlcm5hbFN0YXRlLmhhc0NoYW5nZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuYXBwU3RhdGVTdG9yZS51cGRhdGVMb2FkaW5nKCdjaGFuZ2UtbGFuZ3VhZ2UnLCB0cnVlKTtcblxuICAgICAgICB0aGlzLmxvYWQobGFuZ3VhZ2VLZXksIHR5cGVzKS5waXBlKFxuICAgICAgICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zZXQoJ3NlbGVjdGVkX2xhbmd1YWdlJywgbGFuZ3VhZ2VLZXkpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwU3RhdGVTdG9yZS51cGRhdGVMb2FkaW5nKCdjaGFuZ2UtbGFuZ3VhZ2UnLCBmYWxzZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICApLnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBBbGwgbGFuZ3VhZ2VTdHJpbmdzIGxhYmVsIGJ5IGtleVxuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gTGFuZ3VhZ2VTdHJpbmdzXG4gICAgICovXG4gICAgcHVibGljIGdldExhbmd1YWdlU3RyaW5ncygpOiBMYW5ndWFnZVN0cmluZ3Mge1xuICAgICAgICBpZiAoIWludGVybmFsU3RhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFwcFN0cmluZ3M6IGludGVybmFsU3RhdGUuYXBwU3RyaW5ncyxcbiAgICAgICAgICAgIGFwcExpc3RTdHJpbmdzOiBpbnRlcm5hbFN0YXRlLmFwcExpc3RTdHJpbmdzLFxuICAgICAgICAgICAgbW9kU3RyaW5nczogaW50ZXJuYWxTdGF0ZS5tb2RTdHJpbmdzLFxuICAgICAgICAgICAgbGFuZ3VhZ2VLZXk6IGludGVybmFsU3RhdGUubGFuZ3VhZ2VLZXlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgQXBwU3RyaW5ncyBsYWJlbCBieSBrZXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYWJlbEtleSB0byBmZXRjaFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGxhYmVsXG4gICAgICovXG4gICAgcHVibGljIGdldEFwcFN0cmluZyhsYWJlbEtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCFpbnRlcm5hbFN0YXRlLmFwcFN0cmluZ3MgfHwgIWludGVybmFsU3RhdGUuYXBwU3RyaW5nc1tsYWJlbEtleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnRlcm5hbFN0YXRlLmFwcFN0cmluZ3NbbGFiZWxLZXldO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBBcHBMaXN0U3RyaW5ncyBsYWJlbCBieSBrZXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYWJlbEtleSB0byBmZXRjaFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd8e319IGFwcCBzdHJpbmdzXG4gICAgICovXG4gICAgcHVibGljIGdldEFwcExpc3RTdHJpbmcobGFiZWxLZXk6IHN0cmluZyk6IHN0cmluZyB8IExhbmd1YWdlU3RyaW5nTWFwIHtcblxuICAgICAgICBpZiAoIWludGVybmFsU3RhdGUuYXBwTGlzdFN0cmluZ3MgfHwgIWludGVybmFsU3RhdGUuYXBwTGlzdFN0cmluZ3NbbGFiZWxLZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbnRlcm5hbFN0YXRlLmFwcExpc3RTdHJpbmdzW2xhYmVsS2V5XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgTW9kU3RyaW5ncyBsYWJlbCBieSBrZXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYWJlbEtleSB0byBmZXRjaFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd8e319IG1vZCBzdHJpbmdzXG4gICAgICovXG4gICAgcHVibGljIGdldE1vZFN0cmluZyhsYWJlbEtleTogc3RyaW5nKTogc3RyaW5nIHwgTGFuZ3VhZ2VTdHJpbmdNYXAge1xuXG4gICAgICAgIGlmICghaW50ZXJuYWxTdGF0ZS5tb2RTdHJpbmdzIHx8ICFpbnRlcm5hbFN0YXRlLm1vZFN0cmluZ3NbbGFiZWxLZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbnRlcm5hbFN0YXRlLm1vZFN0cmluZ3NbbGFiZWxLZXldO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBmaWVsZCBsYWJlbFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxhYmVsS2V5IHRvIGZldGNoXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZHVsZSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbGFuZyB0byB1c2VcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBsYWJlbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRGaWVsZExhYmVsKGxhYmVsS2V5OiBzdHJpbmcsIG1vZHVsZTogc3RyaW5nID0gbnVsbCwgbGFuZzogTGFuZ3VhZ2VTdHJpbmdzID0gbnVsbCk6IHN0cmluZyB7XG4gICAgICAgIGxldCBsYW5ndWFnZXMgPSBsYW5nO1xuXG4gICAgICAgIGlmICghbGFuZykge1xuICAgICAgICAgICAgbGFuZ3VhZ2VzID0gdGhpcy5nZXRMYW5ndWFnZVN0cmluZ3MoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbGFuZ3VhZ2VzIHx8ICFsYW5ndWFnZXMubW9kU3RyaW5ncyB8fCAhbGFiZWxLZXkpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBsYWJlbCA9ICcnO1xuXG4gICAgICAgIGlmIChtb2R1bGUpIHtcbiAgICAgICAgICAgIGxhYmVsID0gbGFuZ3VhZ2VzLm1vZFN0cmluZ3NbbW9kdWxlXSAmJiBsYW5ndWFnZXMubW9kU3RyaW5nc1ttb2R1bGVdW2xhYmVsS2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbGFiZWwpIHtcbiAgICAgICAgICAgIGxhYmVsID0gbGFuZ3VhZ2VzLmFwcFN0cmluZ3MgJiYgbGFuZ3VhZ2VzLmFwcFN0cmluZ3NbbGFiZWxLZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxhYmVsIHx8ICcnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBsaXN0IGxhYmVsXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGlzdEtleSB0byBmZXRjaFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYWJlbEtleSB0byBmZXRjaFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGxhYmVsXG4gICAgICovXG4gICAgcHVibGljIGdldExpc3RMYWJlbChsaXN0S2V5OiBzdHJpbmcsIGxhYmVsS2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuXG4gICAgICAgIGlmICghbGlzdEtleSB8fCAhbGFiZWxLZXkpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxpc3RTdHJpbmdzID0gdGhpcy5nZXRBcHBMaXN0U3RyaW5nKGxpc3RLZXkpO1xuXG4gICAgICAgIGlmICghbGlzdFN0cmluZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaXN0U3RyaW5nc1tsYWJlbEtleV0gfHwgJyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGFsbCBhdmFpbGFibGUgc3RyaW5nIHR5cGVzXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nW119IHN0cmluZyB0eXBlc1xuICAgICAqL1xuICAgIHB1YmxpYyBnZXRBdmFpbGFibGVTdHJpbmdzVHlwZXMoKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5jb25maWcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgbGFuZ3VhZ2UgaGFzIGNoYW5nZWQgbWFudWFsbHlcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBoYXMgY2hhbmdlZFxuICAgICAqL1xuICAgIHB1YmxpYyBoYXNMYW5ndWFnZUNoYW5nZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBpbnRlcm5hbFN0YXRlLmhhc0NoYW5nZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgY3VycmVudGx5IGFjdGl2ZSBsYW5ndWFnZVxuICAgICAqXG4gICAgICogQHJldHVybnMge3N0cmluZ30gY3VycmVudCBsYW5ndWFnZSBrZXlcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Q3VycmVudExhbmd1YWdlKCk6IHN0cmluZyB7XG5cbiAgICAgICAgY29uc3Qgc3RvcmVkTGFuZ3VhZ2UgPSB0aGlzLmxvY2FsU3RvcmFnZS5nZXQoJ3NlbGVjdGVkX2xhbmd1YWdlJyk7XG5cbiAgICAgICAgaWYgKHN0b3JlZExhbmd1YWdlKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmVkTGFuZ3VhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW50ZXJuYWxTdGF0ZS5sYW5ndWFnZUtleTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWwgTGFuZ3VhZ2UgU3RyaW5ncyBMb2FkIGZvciBnaXZlbiBsYW5ndWFnZSBhbmQgdHlwZXMgaWYgbm90IGNhY2hlZCBhbmQgdXBkYXRlIHN0YXRlLlxuICAgICAqIFJldHVybnMgb2JzZXJ2YWJsZSB0byBiZSB1c2VkIGluIHJlc29sdmVyIGlmIG5lZWRlZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlS2V5IHRvIGxvYWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSB0eXBlcyB0byBsb2FkXG4gICAgICogQHJldHVybnMge3t9fSBPYnNlcnZhYmxlXG4gICAgICovXG4gICAgcHVibGljIGxvYWQobGFuZ3VhZ2VLZXk6IHN0cmluZywgdHlwZXM6IHN0cmluZ1tdKTogT2JzZXJ2YWJsZTxhbnk+IHtcblxuICAgICAgICBjb25zdCBzdHJlYW1zJCA9IHt9O1xuXG4gICAgICAgIHR5cGVzLmZvckVhY2godHlwZSA9PiBzdHJlYW1zJFt0eXBlXSA9IHRoaXMuZ2V0U3RyaW5ncyhsYW5ndWFnZUtleSwgdHlwZSkpO1xuXG4gICAgICAgIHJldHVybiBmb3JrSm9pbihzdHJlYW1zJCkucGlwZShcbiAgICAgICAgICAgIGZpcnN0KCksXG4gICAgICAgICAgICB0YXAocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZVVwZGF0ZSA9IHsuLi5pbnRlcm5hbFN0YXRlLCBsYW5ndWFnZUtleX07XG5cbiAgICAgICAgICAgICAgICB0eXBlcy5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZVVwZGF0ZVt0eXBlXSA9IHJlc3VsdFt0eXBlXTtcbiAgICAgICAgICAgICAgICAgICAgbG9hZGVkTGFuZ3VhZ2VzW3R5cGVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGUoc3RhdGVVcGRhdGUpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEludGVybmFsIEFQSVxuICAgICAqL1xuXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgaW50ZXJuYWwgc3RhdGUgY2FjaGUgYW5kIGVtaXQgZnJvbSBzdG9yZS4uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHt7fX0gc3RhdGUgdG8gc2V0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVN0YXRlKHN0YXRlOiBMYW5ndWFnZVN0YXRlKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RvcmUubmV4dChpbnRlcm5hbFN0YXRlID0gc3RhdGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBnaXZlbiAkdHlwZSBvZiBzdHJpbmdzIE9ic2VydmFibGUgZnJvbSBjYWNoZSAgb3IgY2FsbCB0aGUgYmFja2VuZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlIHRvIGxvYWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBsb2FkXG4gICAgICogQHJldHVybnMge3t9fSBPYnNlcnZhYmxlPGFueT5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0U3RyaW5ncyhsYW5ndWFnZTogc3RyaW5nLCB0eXBlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHt9PiB7XG5cbiAgICAgICAgY29uc3Qgc3RyaW5nc0NhY2hlID0gY2FjaGVbdHlwZV07XG4gICAgICAgIGNvbnN0IGZldGNoTWV0aG9kID0gdGhpcy5jb25maWdbdHlwZV0uZmV0Y2g7XG5cbiAgICAgICAgaWYgKHN0cmluZ3NDYWNoZVtsYW5ndWFnZV0pIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmdzQ2FjaGVbbGFuZ3VhZ2VdO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyaW5nc0NhY2hlW2xhbmd1YWdlXSA9IHRoaXNbZmV0Y2hNZXRob2RdKGxhbmd1YWdlKS5waXBlKFxuICAgICAgICAgICAgc2hhcmVSZXBsYXkoMSksXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHN0cmluZ3NDYWNoZVtsYW5ndWFnZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2ggdGhlIEFwcCBzdHJpbmdzIGZyb20gdGhlIGJhY2tlbmRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZSB0byBmZXRjaFxuICAgICAqIEByZXR1cm5zIHt7fX0gT2JzZXJ2YWJsZTx7fT5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZmV0Y2hBcHBTdHJpbmdzKGxhbmd1YWdlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHt9PiB7XG4gICAgICAgIGNvbnN0IHJlc291cmNlTmFtZSA9IHRoaXMuY29uZmlnLmFwcFN0cmluZ3MucmVzb3VyY2VOYW1lO1xuICAgICAgICBjb25zdCBmaWVsZHMgPSB0aGlzLmNvbmZpZy5hcHBTdHJpbmdzLm1ldGFkYXRhO1xuICAgICAgICByZXR1cm4gdGhpcy5yZWNvcmRHUUwuZmV0Y2gocmVzb3VyY2VOYW1lLCBgL2FwaS9hcHAtc3RyaW5ncy8ke2xhbmd1YWdlfWAsIGZpZWxkcylcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCgoe2RhdGF9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVtcyA9IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmFwcFN0cmluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gZGF0YS5hcHBTdHJpbmdzLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZldGNoIHRoZSBBcHAgbGlzdCBzdHJpbmdzIGZyb20gdGhlIGJhY2tlbmRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZSB0byBmZXRjaFxuICAgICAqIEByZXR1cm5zIHt7fX0gT2JzZXJ2YWJsZTx7fT5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZmV0Y2hBcHBMaXN0U3RyaW5ncyhsYW5ndWFnZTogc3RyaW5nKTogT2JzZXJ2YWJsZTx7fT4ge1xuICAgICAgICBjb25zdCByZXNvdXJjZU5hbWUgPSB0aGlzLmNvbmZpZy5hcHBMaXN0U3RyaW5ncy5yZXNvdXJjZU5hbWU7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IHRoaXMuY29uZmlnLmFwcExpc3RTdHJpbmdzLm1ldGFkYXRhO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJlY29yZEdRTC5mZXRjaChyZXNvdXJjZU5hbWUsIGAvYXBpL2FwcC1saXN0LXN0cmluZ3MvJHtsYW5ndWFnZX1gLCBmaWVsZHMpXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBtYXAoKHtkYXRhfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbXMgPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5hcHBMaXN0U3RyaW5ncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBkYXRhLmFwcExpc3RTdHJpbmdzLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZldGNoIHRoZSBNb2Qgc3RyaW5ncyBmcm9tIHRoZSBiYWNrZW5kXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2UgdG8gZmV0Y2hcbiAgICAgKiBAcmV0dXJucyB7e319IE9ic2VydmFibGU8e30+XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGZldGNoTW9kU3RyaW5ncyhsYW5ndWFnZTogc3RyaW5nKTogT2JzZXJ2YWJsZTx7fT4ge1xuICAgICAgICBjb25zdCByZXNvdXJjZU5hbWUgPSB0aGlzLmNvbmZpZy5tb2RTdHJpbmdzLnJlc291cmNlTmFtZTtcbiAgICAgICAgY29uc3QgZmllbGRzID0gdGhpcy5jb25maWcubW9kU3RyaW5ncy5tZXRhZGF0YTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVjb3JkR1FMLmZldGNoKHJlc291cmNlTmFtZSwgYC9hcGkvbW9kLXN0cmluZ3MvJHtsYW5ndWFnZX1gLCBmaWVsZHMpXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBtYXAoKHtkYXRhfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbXMgPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5tb2RTdHJpbmdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtcyA9IGRhdGEubW9kU3RyaW5ncy5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtcztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICB9XG59XG4iXX0=