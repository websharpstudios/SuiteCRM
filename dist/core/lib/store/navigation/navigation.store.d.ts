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
import { StateStore } from '../state';
import * as ɵngcc0 from '@angular/core';
export interface Navigation {
    tabs: string[];
    groupedTabs: GroupedTab[];
    modules: NavbarModuleMap;
    userActionMenu: UserActionMenu[];
    maxTabs: number;
}
export interface NavbarModuleMap {
    [key: string]: NavbarModule;
}
export interface NavbarModule {
    name: string;
    path: string;
    defaultRoute: string;
    labelKey: string;
    menu: ModuleAction[];
}
export interface GroupedTab {
    name: string;
    labelKey: string;
    modules: string[];
}
export interface UserActionMenu {
    name: string;
    labelKey: string;
    url: string;
    icon: string;
}
export interface ModuleAction {
    name: string;
    labelKey: string;
    actionLabelKey?: string;
    label?: string;
    url: string;
    params?: string;
    icon: string;
    module?: string;
}
export declare class NavigationStore implements StateStore {
    private recordGQL;
    /**
     * Public long-lived observable streams
     */
    tabs$: Observable<string[]>;
    groupedTabs$: Observable<GroupedTab[]>;
    modules$: Observable<NavbarModuleMap>;
    userActionMenu$: Observable<UserActionMenu[]>;
    maxTabs$: Observable<number>;
    /**
     * ViewModel that resolves once all the data is ready (or updated)...
     */
    vm$: Observable<Navigation>;
    protected store: BehaviorSubject<Navigation>;
    protected state$: Observable<Navigation>;
    protected resourceName: string;
    protected fieldsMetadata: {
        fields: string[];
    };
    constructor(recordGQL: EntityGQL);
    /**
     * Public Api
     */
    /**
     * Clear state
     */
    clear(): void;
    clearAuthBased(): void;
    /**
     * Initial Navigation load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @returns {{}} Observable<any>
     */
    load(): Observable<any>;
    /**
     * Internal API
     */
    /**
     * Update the state
     *
     * @param {{}} state to set
     */
    protected updateState(state: Navigation): void;
    /**
     * Get Navigation cached Observable or call the backend
     *
     * @returns {{}} Observable<any>
     */
    protected getNavigation(): Observable<any>;
    /**
     * Fetch the Navigation from the backend
     *
     * @param {string} userId to use
     * @returns {{}} Observable<any>
     */
    protected fetch(userId: string): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<NavigationStore, never>;
}

//# sourceMappingURL=navigation.store.d.ts.map