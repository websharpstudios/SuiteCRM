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
import { CollectionGQL } from '../../services/api/graphql-api/api.collection.get';
import { StateStore } from '../state';
import * as ɵngcc0 from '@angular/core';
export interface SystemConfig {
    id: string;
    _id: string;
    value: string;
    items: {
        [key: string]: any;
    };
}
export interface SystemConfigMap {
    [key: string]: SystemConfig;
}
export interface SystemConfigs {
    configs: SystemConfigMap;
    loading: boolean;
}
export declare class SystemConfigStore implements StateStore {
    private collectionGQL;
    configs$: Observable<SystemConfigMap>;
    loading$: Observable<boolean>;
    protected store: BehaviorSubject<SystemConfigs>;
    protected state$: Observable<SystemConfigs>;
    protected resourceName: string;
    protected fieldsMetadata: {
        fields: string[];
    };
    constructor(collectionGQL: CollectionGQL);
    /**
     * Public Api
     */
    /**
     * Get system config value by key
     *
     * @param {string} configKey of the config
     * @returns {{}|string} config value
     */
    getConfigValue(configKey: string): any;
    getHomePage(): string;
    /**
     * Clear state
     */
    clear(): void;
    clearAuthBased(): void;
    /**
     * Initial SystemConfigs load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @returns {Observable<{}>} observable
     */
    load(): Observable<any>;
    /**
     * Internal API
     */
    /**
     * Update the state
     *
     * @param {{}} state new state
     */
    protected updateState(state: SystemConfigs): void;
    /**
     * Get SystemConfigs cached Observable or call the backend
     *
     * @returns {Observable<{}>} observable
     */
    protected getSystemConfigs(): Observable<any>;
    /**
     * Fetch the App strings from the backend
     *
     * @returns {Observable<{}>} observable
     */
    protected fetch(): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<SystemConfigStore, never>;
}

//# sourceMappingURL=system-config.store.d.ts.map