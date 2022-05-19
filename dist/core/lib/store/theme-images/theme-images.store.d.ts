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
import { SvgIconRegistryService } from 'angular-svg-icon';
import * as ɵngcc0 from '@angular/core';
export interface ThemeImage {
    path: string;
    name: string;
    type: string;
}
export interface ThemeImages {
    theme: string;
    images: ThemeImageMap;
}
export interface ThemeImageMap {
    [key: string]: ThemeImage;
}
export declare class ThemeImagesStore implements StateStore {
    protected recordGQL: EntityGQL;
    protected appStateStore: AppStateStore;
    protected iconRegistry: SvgIconRegistryService;
    /**
     * Public long-lived observable streams
     */
    images$: Observable<ThemeImageMap>;
    protected store: BehaviorSubject<ThemeImages>;
    protected state$: Observable<ThemeImages>;
    protected resourceName: string;
    protected frontendName: string;
    protected fieldsMetadata: {
        fields: string[];
    };
    constructor(recordGQL: EntityGQL, appStateStore: AppStateStore, iconRegistry: SvgIconRegistryService);
    /**
     * Public Api
     */
    /**
     * Clear state
     */
    clear(): void;
    clearAuthBased(): void;
    /**
     * Change the current theme
     *
     * @param {string} theme to set
     */
    changeTheme(theme: string): void;
    /**
     * Returns the currently active image theme
     *
     * @returns {string} the theme
     */
    getTheme(): string;
    /**
     * Initial ThemeImages load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} theme to load
     * @returns {object} Observable<any>
     */
    load(theme: string): Observable<any>;
    /**
     * Internal API
     */
    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: ThemeImages): void;
    /**
     * Get theme images cached Observable or call the backend
     *
     * @param {string} theme to retrieve
     * @returns {object} Observable<any>
     */
    protected getThemeImages(theme: string): Observable<any>;
    /**
     * Fetch the theme images from the backend
     *
     * @param {string} theme to load
     * @returns {object} Observable<any>
     */
    protected fetch(theme: string): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<ThemeImagesStore, never>;
}

//# sourceMappingURL=theme-images.store.d.ts.map