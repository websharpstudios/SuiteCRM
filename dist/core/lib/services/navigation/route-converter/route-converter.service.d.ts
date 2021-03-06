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
import { ActivatedRoute, Params, UrlSegment, UrlTree } from '@angular/router';
import { ModuleNameMapper } from '../module-name-mapper/module-name-mapper.service';
import { ActionNameMapper } from '../action-name-mapper/action-name-mapper.service';
import { SystemConfigStore } from '../../../store/system-config/system-config.store';
import * as ɵngcc0 from '@angular/core';
export interface RouteInfo {
    module?: string;
    action?: string;
    record?: string;
    params?: Params;
}
export declare class RouteConverter {
    private moduleNameMapper;
    private actionNameMapper;
    private systemConfigStore;
    constructor(moduleNameMapper: ModuleNameMapper, actionNameMapper: ActionNameMapper, systemConfigStore: SystemConfigStore);
    /**
     * Public Api
     */
    /**
     * Converts legacyLink to front end link. Includes the /#/.
     *
     * @param {string} legacyLink legacy url
     * @returns {string} frontend path
     */
    toFrontEndLink(legacyLink: string): string;
    /**
     * Converts legacyLink to front end route
     *
     * @param {string} legacyLink legacy url
     * @returns {string} frontend path
     */
    toFrontEndRoute(legacyLink: string): string;
    /**
     * Build legacy link from router information
     *
     * @param {object} params route params
     * @param {object} queryParams route query params
     * @returns {string} legacy url
     */
    toLegacy(params: Params, queryParams: Params): string;
    /**
     * Parse legacy link
     *
     * @param {string} legacyLink to parse
     * @returns {object} route info
     */
    parse(legacyLink: string): RouteInfo;
    /**
     * Map route url to RouteInfo
     *
     * @returns {object} RouteInfo of the current URL
     * @description Parses route information from ActivatedRouteSnapshot to RouteInfo object
     * @param {UrlSegment[]} urlSegment from the Router object
     */
    parseRouteURL(urlSegment: UrlSegment[]): RouteInfo;
    /**
     * check if the current route is a classic view route
     *
     * @returns {object} RouteInfo
     * @description if the current url is a classic view url; so redirect back to the same view
     * @param {UrlTree} urlTree of current route
     */
    parseRouteInfoFromUrlTree(urlTree: UrlTree): RouteInfo;
    /**
     * check if the current route is a classic view route
     *
     * @returns {boolean} true/false
     * @param {UrlTree} urlTree of the route
     * @description if the current url is a classic view url; so redirect back to the same view
     */
    isClassicViewRoute(urlTree: UrlTree): boolean;
    /**
     * Check if given routeInfo matches the provided activated route
     *
     * @param {object} route to check
     * @param {object} routeInfo to check
     * @returns {boolean} is match
     */
    matchesActiveRoute(route: ActivatedRoute, routeInfo: RouteInfo): boolean;
    /**
     * Internal API
     */
    /**
     * Build front end route
     *
     * @param {string} module name
     * @param {string} action name
     * @param {string} record id
     * @returns {string} route
     */
    protected buildRoute(module: string, action: string, record: string): string;
    /**
     * Build query string
     *
     * @param {object} queryParams query parameters
     * @param {string[]} exclude parameters to exclude
     * @returns {string} query string
     */
    protected buildQueryString(queryParams: Params, exclude?: string[]): string;
    /**
     * Map legacy module name to frontend
     *
     * @param {string} module legacy name
     * @returns {string} frontend name
     */
    protected mapModuleToFrontend(module: string): string;
    /**
     * Map legacy action name to frontend
     *
     * @param {string} action legacy name
     * @returns {string} frontend name
     */
    protected mapActionToFrontEnd(action: string): string;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<RouteConverter, never>;
}

//# sourceMappingURL=route-converter.service.d.ts.map