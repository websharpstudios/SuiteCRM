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
import { BehaviorSubject, Observable } from 'rxjs';
import { EntityGQL } from '../../services/api/graphql-api/api.entity.get';
import { AppStateStore } from '../app-state/app-state.store';
import { StateStore } from '../state';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import * as ɵngcc0 from '@angular/core';
export interface LanguageStringMap {
    [key: string]: string;
}
export interface LanguageListStringMap {
    [key: string]: string | LanguageStringMap;
}
export interface LoadedLanguageStringMap {
    [key: string]: LanguageStringMap;
}
export interface LanguageState {
    appStrings: LanguageStringMap;
    appListStrings: LanguageListStringMap;
    modStrings: LanguageListStringMap;
    languageKey: string;
    loaded?: LoadedLanguageStringMap;
    hasChanged: boolean;
}
export interface LanguageStrings {
    appStrings: LanguageStringMap;
    appListStrings: LanguageListStringMap;
    modStrings: LanguageListStringMap;
    languageKey: string;
}
export interface LanguageCache {
    [key: string]: {
        [key: string]: Observable<any>;
    };
}
export declare class LanguageStore implements StateStore {
    protected recordGQL: EntityGQL;
    protected appStateStore: AppStateStore;
    protected localStorage: LocalStorageService;
    /**
     * Public long-lived observable streams
     */
    appStrings$: Observable<LanguageStringMap>;
    appListStrings$: Observable<LanguageListStringMap>;
    modStrings$: Observable<LanguageListStringMap>;
    languageKey$: Observable<string>;
    /**
     * ViewModel that resolves once all the data is ready (or updated)...
     */
    vm$: Observable<LanguageStrings>;
    protected store: BehaviorSubject<LanguageState>;
    protected state$: Observable<LanguageState>;
    protected config: {
        appStrings: {
            fetch: string;
            resourceName: string;
            metadata: {
                fields: string[];
            };
        };
        appListStrings: {
            fetch: string;
            resourceName: string;
            metadata: {
                fields: string[];
            };
        };
        modStrings: {
            fetch: string;
            resourceName: string;
            metadata: {
                fields: string[];
            };
        };
    };
    constructor(recordGQL: EntityGQL, appStateStore: AppStateStore, localStorage: LocalStorageService);
    /**
     * Public Api
     */
    /**
     * Clear state
     */
    clear(): void;
    clearAuthBased(): void;
    /**
     * Update the language strings toe the given language
     *
     * @param {string} languageKey language key
     */
    changeLanguage(languageKey: string): void;
    /**
     * Get All languageStrings label by key
     *
     * @returns {object} LanguageStrings
     */
    getLanguageStrings(): LanguageStrings;
    /**
     * Get AppStrings label by key
     *
     * @param {string} labelKey to fetch
     * @returns {string} label
     */
    getAppString(labelKey: string): string;
    /**
     * Get AppListStrings label by key
     *
     * @param {string} labelKey to fetch
     * @returns {string|{}} app strings
     */
    getAppListString(labelKey: string): string | LanguageStringMap;
    /**
     * Get ModStrings label by key
     *
     * @param {string} labelKey to fetch
     * @returns {string|{}} mod strings
     */
    getModString(labelKey: string): string | LanguageStringMap;
    /**
     * Get field label
     *
     * @param {string} labelKey to fetch
     * @param {string} module to use
     * @param {object} lang to use
     * @returns {string} label
     */
    getFieldLabel(labelKey: string, module?: string, lang?: LanguageStrings): string;
    /**
     * Get list label
     *
     * @param {string} listKey to fetch
     * @param {string} labelKey to fetch
     * @returns {string} label
     */
    getListLabel(listKey: string, labelKey: string): string;
    /**
     * Get all available string types
     *
     * @returns {string[]} string types
     */
    getAvailableStringsTypes(): string[];
    /**
     * Returns whether the language has changed manually
     *
     * @returns {boolean} has changed
     */
    hasLanguageChanged(): boolean;
    /**
     * Returns the currently active language
     *
     * @returns {string} current language key
     */
    getCurrentLanguage(): string;
    /**
     * Initial Language Strings Load for given language and types if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} languageKey to load
     * @param {string[]} types to load
     * @returns {{}} Observable
     */
    load(languageKey: string, types: string[]): Observable<any>;
    /**
     * Internal API
     */
    /**
     * Update internal state cache and emit from store...
     *
     * @param {{}} state to set
     */
    protected updateState(state: LanguageState): void;
    /**
     * Get given $type of strings Observable from cache  or call the backend
     *
     * @param {string} language to load
     * @param {string} type load
     * @returns {{}} Observable<any>
     */
    protected getStrings(language: string, type: string): Observable<{}>;
    /**
     * Fetch the App strings from the backend
     *
     * @param {string} language to fetch
     * @returns {{}} Observable<{}>
     */
    protected fetchAppStrings(language: string): Observable<{}>;
    /**
     * Fetch the App list strings from the backend
     *
     * @param {string} language to fetch
     * @returns {{}} Observable<{}>
     */
    protected fetchAppListStrings(language: string): Observable<{}>;
    /**
     * Fetch the Mod strings from the backend
     *
     * @param {string} language to fetch
     * @returns {{}} Observable<{}>
     */
    protected fetchModStrings(language: string): Observable<{}>;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<LanguageStore, never>;
}

//# sourceMappingURL=language.store.d.ts.map