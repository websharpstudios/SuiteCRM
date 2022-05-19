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
import { StringMap } from 'common';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { RecordListStore } from '../record-list/record-list.store';
import { SavedFilter, SavedFilterList } from './saved-filter.model';
import { ModuleNameMapper } from '../../services/navigation/module-name-mapper/module-name-mapper.service';
import { SystemConfigStore } from '../system-config/system-config.store';
import { UserPreferenceStore } from '../user-preference/user-preference.store';
import { AppStateStore } from '../app-state/app-state.store';
import { LanguageStore } from '../language/language.store';
import { MessageService } from '../../services/message/message.service';
import { FiltersListGQL } from './graphql/api.list.get';
import * as ɵngcc0 from '@angular/core';
export declare class FilterListStore extends RecordListStore {
    protected listGQL: FiltersListGQL;
    protected configs: SystemConfigStore;
    protected preferences: UserPreferenceStore;
    protected appState: AppStateStore;
    protected language: LanguageStore;
    protected message: MessageService;
    protected auth: AuthService;
    protected moduleNameMapper: ModuleNameMapper;
    records$: Observable<SavedFilter[]>;
    protected moduleName: string;
    protected filterFields: StringMap;
    /**
     * Constructor
     * @param listGQL
     * @param configs
     * @param preferences
     * @param appState
     * @param language
     * @param message
     * @param auth
     * @param moduleNameMapper
     */
    constructor(listGQL: FiltersListGQL, configs: SystemConfigStore, preferences: UserPreferenceStore, appState: AppStateStore, language: LanguageStore, message: MessageService, auth: AuthService, moduleNameMapper: ModuleNameMapper);
    /**
     * Initialize store
     * @param module
     */
    init(module: string): Observable<SavedFilterList>;
    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<RecordList>
     */
    load(useCache?: boolean): Observable<SavedFilterList>;
    /**
     * Get current list of saved filters
     */
    getFilters(): SavedFilter[];
    /**
     * Add new filter to list
     * @param filter
     */
    addFilter(filter: SavedFilter): void;
    /**
     * Remove existing filter
     * @param filter
     */
    removeFilter(filter: SavedFilter): void;
    /**
     * Initialize criteria
     * @param module
     */
    protected initCriteria(module: string): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<FilterListStore, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<FilterListStore>;
}

//# sourceMappingURL=filter-list.store.d.ts.map