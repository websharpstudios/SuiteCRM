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
import { NavbarModel } from './navbar-model';
import { LogoAbstract } from '../logo/logo-abstract';
import { CurrentUserModel } from './current-user-model';
import { ActionLinkModel } from './action-link-model';
import { MenuItem } from 'common';
import { LanguageStringMap, LanguageStrings } from '../../store/language/language.store';
import { GroupedTab, NavbarModule, NavbarModuleMap, Navigation, UserActionMenu } from '../../store/navigation/navigation.store';
import { RouteConverter } from '../../services/navigation/route-converter/route-converter.service';
import { UserPreferenceMap } from '../../store/user-preference/user-preference.store';
import { ModuleNavigation } from '../../services/navigation/module-navigation/module-navigation.service';
import { AppState } from '../../store/app-state/app-state.store';
export declare class NavbarAbstract implements NavbarModel {
    private routeConverter;
    protected moduleNavigation: ModuleNavigation;
    authenticated: boolean;
    logo: LogoAbstract;
    useGroupTabs: boolean;
    globalActions: ActionLinkModel[];
    currentUser: CurrentUserModel;
    all: {
        modules: any[];
        extra: any[];
    };
    menu: MenuItem[];
    current?: MenuItem;
    /**
     * Public API
     */
    constructor(routeConverter: RouteConverter, moduleNavigation: ModuleNavigation);
    /**
     * Reset menus
     */
    resetMenu(): void;
    /**
     * Build user action menu
     *
     * @param {object} appStrings map
     * @param {[]} userActionMenu info
     * @param {object} currentUser info
     */
    buildUserActionMenu(appStrings: LanguageStringMap, userActionMenu: UserActionMenu[], currentUser: CurrentUserModel): void;
    /**
     * Build navbar
     *
     * @param {object} navigation info
     * @param {object} language map
     * @param {object} userPreferences info
     * @param {object} currentUser info
     * @param {object} appState info
     * @param {number} maxTabs to display
     */
    build(navigation: Navigation, language: LanguageStrings, userPreferences: UserPreferenceMap, currentUser: CurrentUserModel, appState: AppState, maxTabs: number): void;
    /**
     * Build Group tab menu
     *
     * @param {[]} items list
     * @param {object} modules info
     * @param {object} languages map
     * @param {number} threshold limit
     * @param {object} groupedTabs info
     * @param {boolean} sort flag
     */
    buildGroupTabMenu(items: string[], modules: NavbarModuleMap, languages: LanguageStrings, threshold: number, groupedTabs: GroupedTab[], sort: boolean): void;
    /**
     *
     * Internal API
     *
     */
    /**
     * Build module navigation
     *
     * @param {object} navigation info
     * @param {object} languages map
     * @param {object} appState info
     * @param {number} maxTabs to use
     * @param {boolean} sort flag
     */
    protected buildModuleNavigation(navigation: Navigation, languages: LanguageStrings, appState: AppState, maxTabs: number, sort: boolean): void;
    /**
     * Build grouped navigation
     *
     * @param {object} navigation info
     * @param {object} languages map
     * @param {object} appState info
     * @param {number} maxTabs to use
     * @param {boolean} sort flag
     */
    protected buildGroupedNavigation(navigation: Navigation, languages: LanguageStrings, appState: AppState, maxTabs: number, sort: boolean): void;
    /**
     * Build selected module
     *
     * @param {object} navigation info
     * @param {object} languages map
     * @param {object} appState info
     */
    protected buildSelectedModule(navigation: Navigation, languages: LanguageStrings, appState: AppState): void;
    /**
     * Build tab / module menu
     *
     * @param {[]} items list
     * @param {object} modules info
     * @param {object} languages map
     * @param {number} threshold limit
     * @param {object} appState info
     * @param {boolean} sort flag
     */
    protected buildTabMenu(items: string[], modules: NavbarModuleMap, languages: LanguageStrings, threshold: number, appState: AppState, sort: boolean): void;
    /**
     * Build Grouped Tab menu item
     *
     * @param {string} moduleLabel to display
     * @param {object} groupedModules list
     * @param {object} modules list
     * @param {object} languages map
     * @param {boolean} sort flag
     *
     * @returns {object} group tab menu item
     */
    protected buildTabGroupedMenuItem(moduleLabel: string, groupedModules: any[], modules: NavbarModuleMap, languages: LanguageStrings, sort: boolean): any;
    /**
     * Build Grouped menu
     *
     * @param {object} groupedModules info
     * @param {object} modules map
     * @param {object} languages maps
     * @param {boolean} sort flag
     *
     * @returns {[]} menu item array
     */
    protected buildGroupedMenu(groupedModules: any[], modules: NavbarModuleMap, languages: LanguageStrings, sort: boolean): MenuItem[];
    /**
     * Build module menu items
     *
     * @param {string} module name
     * @param {object} moduleInfo info
     * @param {object} languages object
     *
     * @returns {object} menuItem
     */
    protected buildTabMenuItem(module: string, moduleInfo: NavbarModule, languages: LanguageStrings): MenuItem;
    /**
     * Sort menu items by label
     *
     * @param {object} navItems to sort
     */
    protected sortMenuItems(navItems: any[]): void;
}
