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
import { Router } from '@angular/router';
import { ModuleAction, NavbarModule, Navigation } from '../../../store/navigation/navigation.store';
import { LanguageListStringMap, LanguageStrings } from '../../../store/language/language.store';
import { Record } from 'common';
import { ModuleNameMapper } from '../module-name-mapper/module-name-mapper.service';
import { ActionNameMapper } from '../action-name-mapper/action-name-mapper.service';
import * as ɵngcc0 from '@angular/core';
export interface NavigationRoute {
    route: string;
    url: string;
    params: {
        [key: string]: string;
    };
}
export declare class ModuleNavigation {
    protected router: Router;
    protected moduleNameMapper: ModuleNameMapper;
    protected actionNameMapper: ActionNameMapper;
    constructor(router: Router, moduleNameMapper: ModuleNameMapper, actionNameMapper: ActionNameMapper);
    /**
     * Public Api
     */
    /**
     * Get module info
     *
     * @param {string} module name
     * @param {object} navigation info
     * @returns {object} module info
     */
    getModuleInfo(module: string, navigation: Navigation): NavbarModule;
    /**
     * Get module label
     *
     * @param {object} module info
     * @param {object} appListStrings map
     * @returns {string} the module label
     */
    getModuleLabel(module: NavbarModule, appListStrings: LanguageListStringMap): string;
    /**
     * Get module route
     *
     * @param {object} module NavbarModule
     * @returns {object} NavigationRoute
     */
    getModuleRoute(module: NavbarModule): NavigationRoute;
    /**
     * Navigate using action information
     *
     * @param {object} item ModuleAction
     * @returns {object} Promise<boolean>
     */
    navigate(item: ModuleAction): Promise<boolean>;
    /**
     * Get action route info
     *
     * @param {object} action ModuleAction
     * @returns {object} NavigationRoute
     */
    getActionRoute(action: ModuleAction): NavigationRoute;
    /**
     * Get label for module action item
     *
     * @param {string} module name
     * @param {object} item action
     * @param {object} languages map
     * @param {string} labelKey to use
     * @returns {string} label
     */
    getActionLabel(module: string, item: ModuleAction, languages: LanguageStrings, labelKey?: string): string;
    /**
     * Get record router link route info
     *
     * @param {string} module name
     * @param {string} id fo the record
     * @returns {string} router link
     */
    getRecordRouterLink(module: string, id: string): string;
    /**
     * Navigate back using return params
     * @param record
     * @param moduleName
     * @param params
     */
    navigateBack(record: Record, moduleName: string, params: {
        [key: string]: string;
    }): void;
    /**
     * Extract return id
     * @param params
     */
    getReturnId(params: {
        [p: string]: string;
    }): string;
    /**
     * Extract and map return action
     * @param params
     */
    getReturnAction(params: {
        [p: string]: string;
    }): string;
    /**
     * Extract and map return action
     * @param params
     */
    getReturnModule(params: {
        [p: string]: string;
    }): string;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<ModuleNavigation, never>;
}

//# sourceMappingURL=module-navigation.service.d.ts.map