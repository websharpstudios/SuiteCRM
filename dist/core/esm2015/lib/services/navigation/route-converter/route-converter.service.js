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
import { DefaultUrlSerializer, PRIMARY_OUTLET } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { ModuleNameMapper } from '../module-name-mapper/module-name-mapper.service';
import { ActionNameMapper } from '../action-name-mapper/action-name-mapper.service';
import { SystemConfigStore } from '../../../store/system-config/system-config.store';
import * as i0 from "@angular/core";
import * as i1 from "../module-name-mapper/module-name-mapper.service";
import * as i2 from "../action-name-mapper/action-name-mapper.service";
import * as i3 from "../../../store/system-config/system-config.store";
const ROUTE_PREFIX = './#';
export class RouteConverter {
    constructor(moduleNameMapper, actionNameMapper, systemConfigStore) {
        this.moduleNameMapper = moduleNameMapper;
        this.actionNameMapper = actionNameMapper;
        this.systemConfigStore = systemConfigStore;
    }
    /**
     * Public Api
     */
    /**
     * Converts legacyLink to front end link. Includes the /#/.
     *
     * @param {string} legacyLink legacy url
     * @returns {string} frontend path
     */
    toFrontEndLink(legacyLink) {
        return ROUTE_PREFIX + this.toFrontEndRoute(legacyLink);
    }
    /**
     * Converts legacyLink to front end route
     *
     * @param {string} legacyLink legacy url
     * @returns {string} frontend path
     */
    toFrontEndRoute(legacyLink) {
        if (legacyLink && legacyLink.includes('/#/')) {
            const anchorParts = legacyLink.split('/#/');
            if (anchorParts.length < 2) {
                return '/';
            }
            return anchorParts[1];
        }
        const info = this.parse(legacyLink);
        if (!info) {
            return '/';
        }
        let route = this.buildRoute(info.module, info.action, info.record);
        route += this.buildQueryString(info.params, ['module', 'action', 'record']);
        return route;
    }
    /**
     * Build legacy link from router information
     *
     * @param {object} params route params
     * @param {object} queryParams route query params
     * @returns {string} legacy url
     */
    toLegacy(params, queryParams) {
        let path = './legacy/index.php';
        const queryObject = Object.assign({}, queryParams);
        if (params.module) {
            queryObject.module = this.moduleNameMapper.toLegacy(params.module);
        }
        if (params.action) {
            queryObject.action = this.actionNameMapper.toLegacy(params.action);
        }
        if (params.record) {
            queryObject.record = params.record;
        }
        path += this.buildQueryString(queryObject);
        return path;
    }
    /**
     * Parse legacy link
     *
     * @param {string} legacyLink to parse
     * @returns {object} route info
     */
    parse(legacyLink) {
        const parser = new DefaultUrlSerializer();
        const replacedString = legacyLink.replace('/legacy', '');
        const parts = replacedString.split('?');
        if (parts.length < 2) {
            return null;
        }
        const tree = parser.parse('/?' + parts[1]);
        const params = tree.queryParamMap;
        const module = params.get('module') || '';
        const action = params.get('action') || '';
        const record = params.get('record') || '';
        return {
            module,
            action,
            record,
            params: tree.queryParams
        };
    }
    /**
     * Map route url to RouteInfo
     *
     * @returns {object} RouteInfo of the current URL
     * @description Parses route information from ActivatedRouteSnapshot to RouteInfo object
     * @param {UrlSegment[]} urlSegment from the Router object
     */
    parseRouteURL(urlSegment) {
        var _a, _b, _c, _d, _e, _f;
        return {
            module: (_b = (_a = urlSegment[0]) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : '',
            action: (_d = (_c = urlSegment[1]) === null || _c === void 0 ? void 0 : _c.path) !== null && _d !== void 0 ? _d : 'index',
            record: (_f = (_e = urlSegment[2]) === null || _e === void 0 ? void 0 : _e.path) !== null && _f !== void 0 ? _f : ''
        };
    }
    /**
     * check if the current route is a classic view route
     *
     * @returns {object} RouteInfo
     * @description if the current url is a classic view url; so redirect back to the same view
     * @param {UrlTree} urlTree of current route
     */
    parseRouteInfoFromUrlTree(urlTree) {
        const urlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
        const urlSegment = urlSegmentGroup.segments;
        return this.parseRouteURL(urlSegment);
    }
    /**
     * check if the current route is a classic view route
     *
     * @returns {boolean} true/false
     * @param {UrlTree} urlTree of the route
     * @description if the current url is a classic view url; so redirect back to the same view
     */
    isClassicViewRoute(urlTree) {
        const configRoutes = this.systemConfigStore.getConfigValue('module_routing');
        const currentRouteInfo = this.parseRouteInfoFromUrlTree(urlTree);
        const module = currentRouteInfo.module;
        const action = currentRouteInfo.action;
        return !configRoutes[module] || !configRoutes[module][action];
    }
    /**
     * Check if given routeInfo matches the provided activated route
     *
     * @param {object} route to check
     * @param {object} routeInfo to check
     * @returns {boolean} is match
     */
    matchesActiveRoute(route, routeInfo) {
        const toCheck = [
            {
                name: 'module',
                map: (value) => {
                    if (!value) {
                        return value;
                    }
                    return this.mapModuleToFrontend(value);
                }
            },
            {
                name: 'action',
                map: (value) => {
                    if (!value) {
                        return value;
                    }
                    return this.mapActionToFrontEnd(value);
                }
            },
            {
                name: 'record',
                map: (value) => value
            }
        ];
        let match = true;
        toCheck.forEach((param) => {
            if (!route.snapshot.params[param.name] && !routeInfo[param.name]) {
                return;
            }
            match = match && (route.snapshot.params[param.name] === param.map(routeInfo[param.name]));
        });
        return match;
    }
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
    buildRoute(module, action, record) {
        const moduleName = this.mapModuleToFrontend(module);
        let route = `${moduleName}`;
        if (action) {
            const actionName = this.mapActionToFrontEnd(action);
            route += `/${actionName}`;
        }
        if (record) {
            route += `/${record}`;
        }
        return route;
    }
    /**
     * Build query string
     *
     * @param {object} queryParams query parameters
     * @param {string[]} exclude parameters to exclude
     * @returns {string} query string
     */
    buildQueryString(queryParams, exclude = []) {
        let params = new HttpParams();
        Object.keys(queryParams).forEach((param) => {
            if (exclude.includes(param)) {
                return;
            }
            const value = queryParams[param];
            params = params.set(param, value);
        });
        if (params.keys().length > 0) {
            return '?' + params.toString();
        }
        return '';
    }
    /**
     * Map legacy module name to frontend
     *
     * @param {string} module legacy name
     * @returns {string} frontend name
     */
    mapModuleToFrontend(module) {
        return this.moduleNameMapper.toFrontend(module);
    }
    /**
     * Map legacy action name to frontend
     *
     * @param {string} action legacy name
     * @returns {string} frontend name
     */
    mapActionToFrontEnd(action) {
        return this.actionNameMapper.toFrontend(action);
    }
}
RouteConverter.ɵprov = i0.ɵɵdefineInjectable({ factory: function RouteConverter_Factory() { return new RouteConverter(i0.ɵɵinject(i1.ModuleNameMapper), i0.ɵɵinject(i2.ActionNameMapper), i0.ɵɵinject(i3.SystemConfigStore)); }, token: RouteConverter, providedIn: "root" });
RouteConverter.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
RouteConverter.ctorParameters = () => [
    { type: ModuleNameMapper },
    { type: ActionNameMapper },
    { type: SystemConfigStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUtY29udmVydGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc2VydmljZXMvbmF2aWdhdGlvbi9yb3V0ZS1jb252ZXJ0ZXIvcm91dGUtY29udmVydGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUVILG9CQUFvQixFQUNaLGNBQWMsRUFHekIsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDaEQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sa0RBQWtELENBQUM7QUFDbEYsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sa0RBQWtELENBQUM7QUFDbEYsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sa0RBQWtELENBQUM7Ozs7O0FBRW5GLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQztBQVUzQixNQUFNLE9BQU8sY0FBYztJQUV2QixZQUNZLGdCQUFrQyxFQUNsQyxnQkFBa0MsRUFDbEMsaUJBQW9DO1FBRnBDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO0lBRWhELENBQUM7SUFFRDs7T0FFRztJQUVIOzs7OztPQUtHO0lBQ0ksY0FBYyxDQUFDLFVBQWtCO1FBQ3BDLE9BQU8sWUFBWSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksZUFBZSxDQUFDLFVBQWtCO1FBRXJDLElBQUksVUFBVSxJQUFJLFVBQVUsQ0FB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YztRQUN4QyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEQsQ0FBQzs7OztZQWxTSixVQUFVLFNBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzs7WUFieEIsZ0JBQWdCO1lBQ2hCLGdCQUFnQjtZQUNoQixpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIEFjdGl2YXRlZFJvdXRlLFxuICAgIERlZmF1bHRVcmxTZXJpYWxpemVyLFxuICAgIFBhcmFtcywgUFJJTUFSWV9PVVRMRVQsXG4gICAgVXJsU2VnbWVudCwgVXJsU2VnbWVudEdyb3VwLFxuICAgIFVybFRyZWVcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7SHR0cFBhcmFtc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHtNb2R1bGVOYW1lTWFwcGVyfSBmcm9tICcuLi9tb2R1bGUtbmFtZS1tYXBwZXIvbW9kdWxlLW5hbWUtbWFwcGVyLnNlcnZpY2UnO1xuaW1wb3J0IHtBY3Rpb25OYW1lTWFwcGVyfSBmcm9tICcuLi9hY3Rpb24tbmFtZS1tYXBwZXIvYWN0aW9uLW5hbWUtbWFwcGVyLnNlcnZpY2UnO1xuaW1wb3J0IHtTeXN0ZW1Db25maWdTdG9yZX0gZnJvbSAnLi4vLi4vLi4vc3RvcmUvc3lzdGVtLWNvbmZpZy9zeXN0ZW0tY29uZmlnLnN0b3JlJztcblxuY29uc3QgUk9VVEVfUFJFRklYID0gJy4vIyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUm91dGVJbmZvIHtcbiAgICBtb2R1bGU/OiBzdHJpbmc7XG4gICAgYWN0aW9uPzogc3RyaW5nO1xuICAgIHJlY29yZD86IHN0cmluZztcbiAgICBwYXJhbXM/OiBQYXJhbXM7XG59XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIFJvdXRlQ29udmVydGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIG1vZHVsZU5hbWVNYXBwZXI6IE1vZHVsZU5hbWVNYXBwZXIsXG4gICAgICAgIHByaXZhdGUgYWN0aW9uTmFtZU1hcHBlcjogQWN0aW9uTmFtZU1hcHBlcixcbiAgICAgICAgcHJpdmF0ZSBzeXN0ZW1Db25maWdTdG9yZTogU3lzdGVtQ29uZmlnU3RvcmVcbiAgICApIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQdWJsaWMgQXBpXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBsZWdhY3lMaW5rIHRvIGZyb250IGVuZCBsaW5rLiBJbmNsdWRlcyB0aGUgLyMvLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxlZ2FjeUxpbmsgbGVnYWN5IHVybFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGZyb250ZW5kIHBhdGhcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9Gcm9udEVuZExpbmsobGVnYWN5TGluazogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFJPVVRFX1BSRUZJWCArIHRoaXMudG9Gcm9udEVuZFJvdXRlKGxlZ2FjeUxpbmspO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGxlZ2FjeUxpbmsgdG8gZnJvbnQgZW5kIHJvdXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGVnYWN5TGluayBsZWdhY3kgdXJsXG4gICAgICogQHJldHVybnMge3N0cmluZ30gZnJvbnRlbmQgcGF0aFxuICAgICAqL1xuICAgIHB1YmxpYyB0b0Zyb250RW5kUm91dGUobGVnYWN5TGluazogc3RyaW5nKTogc3RyaW5nIHtcblxuICAgICAgICBpZiAobGVnYWN5TGluayAmJiBsZWdhY3lMaW5rLmluY2x1ZGVzKCcvIy8nKSkge1xuICAgICAgICAgICAgY29uc3QgYW5jaG9yUGFydHMgPSBsZWdhY3lMaW5rLnNwbGl0KCcvIy8nKTtcblxuICAgICAgICAgICAgaWYgKGFuY2hvclBhcnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJy8nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYW5jaG9yUGFydHNbMV07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbmZvID0gdGhpcy5wYXJzZShsZWdhY3lMaW5rKTtcbiAgICAgICAgaWYgKCFpbmZvKSB7XG4gICAgICAgICAgICByZXR1cm4gJy8nO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJvdXRlID0gdGhpcy5idWlsZFJvdXRlKGluZm8ubW9kdWxlLCBpbmZvLmFjdGlvbiwgaW5mby5yZWNvcmQpO1xuXG4gICAgICAgIHJvdXRlICs9IHRoaXMuYnVpbGRRdWVyeVN0cmluZyhpbmZvLnBhcmFtcywgWydtb2R1bGUnLCAnYWN0aW9uJywgJ3JlY29yZCddKTtcblxuICAgICAgICByZXR1cm4gcm91dGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgbGVnYWN5IGxpbmsgZnJvbSByb3V0ZXIgaW5mb3JtYXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgcm91dGUgcGFyYW1zXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHF1ZXJ5UGFyYW1zIHJvdXRlIHF1ZXJ5IHBhcmFtc1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGxlZ2FjeSB1cmxcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9MZWdhY3kocGFyYW1zOiBQYXJhbXMsIHF1ZXJ5UGFyYW1zOiBQYXJhbXMpOiBzdHJpbmcge1xuICAgICAgICBsZXQgcGF0aCA9ICcuL2xlZ2FjeS9pbmRleC5waHAnO1xuXG4gICAgICAgIGNvbnN0IHF1ZXJ5T2JqZWN0ID0ge1xuICAgICAgICAgICAgLi4ucXVlcnlQYXJhbXMsXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHBhcmFtcy5tb2R1bGUpIHtcbiAgICAgICAgICAgIHF1ZXJ5T2JqZWN0Lm1vZHVsZSA9IHRoaXMubW9kdWxlTmFtZU1hcHBlci50b0xlZ2FjeShwYXJhbXMubW9kdWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1zLmFjdGlvbikge1xuICAgICAgICAgICAgcXVlcnlPYmplY3QuYWN0aW9uID0gdGhpcy5hY3Rpb25OYW1lTWFwcGVyLnRvTGVnYWN5KHBhcmFtcy5hY3Rpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy5yZWNvcmQpIHtcbiAgICAgICAgICAgIHF1ZXJ5T2JqZWN0LnJlY29yZCA9IHBhcmFtcy5yZWNvcmQ7XG4gICAgICAgIH1cblxuICAgICAgICBwYXRoICs9IHRoaXMuYnVpbGRRdWVyeVN0cmluZyhxdWVyeU9iamVjdCk7XG5cbiAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgbGVnYWN5IGxpbmtcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsZWdhY3lMaW5rIHRvIHBhcnNlXG4gICAgICogQHJldHVybnMge29iamVjdH0gcm91dGUgaW5mb1xuICAgICAqL1xuICAgIHB1YmxpYyBwYXJzZShsZWdhY3lMaW5rOiBzdHJpbmcpOiBSb3V0ZUluZm8ge1xuXG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBEZWZhdWx0VXJsU2VyaWFsaXplcigpO1xuXG4gICAgICAgIGNvbnN0IHJlcGxhY2VkU3RyaW5nID0gbGVnYWN5TGluay5yZXBsYWNlKCcvbGVnYWN5JywgJycpO1xuICAgICAgICBjb25zdCBwYXJ0cyA9IHJlcGxhY2VkU3RyaW5nLnNwbGl0KCc/Jyk7XG5cbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHJlZTogVXJsVHJlZSA9IHBhcnNlci5wYXJzZSgnLz8nICsgcGFydHNbMV0pO1xuXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHRyZWUucXVlcnlQYXJhbU1hcDtcblxuICAgICAgICBjb25zdCBtb2R1bGUgPSBwYXJhbXMuZ2V0KCdtb2R1bGUnKSB8fCAnJztcbiAgICAgICAgY29uc3QgYWN0aW9uID0gcGFyYW1zLmdldCgnYWN0aW9uJykgfHwgJyc7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IHBhcmFtcy5nZXQoJ3JlY29yZCcpIHx8ICcnO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBtb2R1bGUsXG4gICAgICAgICAgICBhY3Rpb24sXG4gICAgICAgICAgICByZWNvcmQsXG4gICAgICAgICAgICBwYXJhbXM6IHRyZWUucXVlcnlQYXJhbXNcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNYXAgcm91dGUgdXJsIHRvIFJvdXRlSW5mb1xuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gUm91dGVJbmZvIG9mIHRoZSBjdXJyZW50IFVSTFxuICAgICAqIEBkZXNjcmlwdGlvbiBQYXJzZXMgcm91dGUgaW5mb3JtYXRpb24gZnJvbSBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90IHRvIFJvdXRlSW5mbyBvYmplY3RcbiAgICAgKiBAcGFyYW0ge1VybFNlZ21lbnRbXX0gdXJsU2VnbWVudCBmcm9tIHRoZSBSb3V0ZXIgb2JqZWN0XG4gICAgICovXG4gICAgcHVibGljIHBhcnNlUm91dGVVUkwodXJsU2VnbWVudDogVXJsU2VnbWVudFtdKTogUm91dGVJbmZvIHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbW9kdWxlOiB1cmxTZWdtZW50WzBdPy5wYXRoID8/ICcnLFxuICAgICAgICAgICAgYWN0aW9uOiB1cmxTZWdtZW50WzFdPy5wYXRoID8/ICdpbmRleCcsXG4gICAgICAgICAgICByZWNvcmQ6IHVybFNlZ21lbnRbMl0/LnBhdGggPz8gJydcbiAgICAgICAgfSBhcyBSb3V0ZUluZm87XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2hlY2sgaWYgdGhlIGN1cnJlbnQgcm91dGUgaXMgYSBjbGFzc2ljIHZpZXcgcm91dGVcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IFJvdXRlSW5mb1xuICAgICAqIEBkZXNjcmlwdGlvbiBpZiB0aGUgY3VycmVudCB1cmwgaXMgYSBjbGFzc2ljIHZpZXcgdXJsOyBzbyByZWRpcmVjdCBiYWNrIHRvIHRoZSBzYW1lIHZpZXdcbiAgICAgKiBAcGFyYW0ge1VybFRyZWV9IHVybFRyZWUgb2YgY3VycmVudCByb3V0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBwYXJzZVJvdXRlSW5mb0Zyb21VcmxUcmVlKHVybFRyZWU6IFVybFRyZWUpOiBSb3V0ZUluZm8ge1xuICAgICAgICBjb25zdCB1cmxTZWdtZW50R3JvdXA6IFVybFNlZ21lbnRHcm91cCA9IHVybFRyZWUucm9vdC5jaGlsZHJlbltQUklNQVJZX09VVExFVF07XG4gICAgICAgIGNvbnN0IHVybFNlZ21lbnQ6IFVybFNlZ21lbnRbXSA9IHVybFNlZ21lbnRHcm91cC5zZWdtZW50cztcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VSb3V0ZVVSTCh1cmxTZWdtZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjaGVjayBpZiB0aGUgY3VycmVudCByb3V0ZSBpcyBhIGNsYXNzaWMgdmlldyByb3V0ZVxuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUvZmFsc2VcbiAgICAgKiBAcGFyYW0ge1VybFRyZWV9IHVybFRyZWUgb2YgdGhlIHJvdXRlXG4gICAgICogQGRlc2NyaXB0aW9uIGlmIHRoZSBjdXJyZW50IHVybCBpcyBhIGNsYXNzaWMgdmlldyB1cmw7IHNvIHJlZGlyZWN0IGJhY2sgdG8gdGhlIHNhbWUgdmlld1xuICAgICAqL1xuICAgIHB1YmxpYyBpc0NsYXNzaWNWaWV3Um91dGUodXJsVHJlZTogVXJsVHJlZSk6IGJvb2xlYW4ge1xuXG4gICAgICAgIGNvbnN0IGNvbmZpZ1JvdXRlcyA9IHRoaXMuc3lzdGVtQ29uZmlnU3RvcmUuZ2V0Q29uZmlnVmFsdWUoJ21vZHVsZV9yb3V0aW5nJyk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudFJvdXRlSW5mbyA9IHRoaXMucGFyc2VSb3V0ZUluZm9Gcm9tVXJsVHJlZSh1cmxUcmVlKTtcblxuICAgICAgICBjb25zdCBtb2R1bGUgPSBjdXJyZW50Um91dGVJbmZvLm1vZHVsZTtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gY3VycmVudFJvdXRlSW5mby5hY3Rpb247XG5cbiAgICAgICAgcmV0dXJuICFjb25maWdSb3V0ZXNbbW9kdWxlXSB8fCAhY29uZmlnUm91dGVzW21vZHVsZV1bYWN0aW9uXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBnaXZlbiByb3V0ZUluZm8gbWF0Y2hlcyB0aGUgcHJvdmlkZWQgYWN0aXZhdGVkIHJvdXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcm91dGUgdG8gY2hlY2tcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcm91dGVJbmZvIHRvIGNoZWNrXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IGlzIG1hdGNoXG4gICAgICovXG4gICAgcHVibGljIG1hdGNoZXNBY3RpdmVSb3V0ZShyb3V0ZTogQWN0aXZhdGVkUm91dGUsIHJvdXRlSW5mbzogUm91dGVJbmZvKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHRvQ2hlY2sgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ21vZHVsZScsXG4gICAgICAgICAgICAgICAgbWFwOiAodmFsdWUpOiBhbnkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcE1vZHVsZVRvRnJvbnRlbmQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2FjdGlvbicsXG4gICAgICAgICAgICAgICAgbWFwOiAodmFsdWUpOiBhbnkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcEFjdGlvblRvRnJvbnRFbmQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3JlY29yZCcsXG4gICAgICAgICAgICAgICAgbWFwOiAodmFsdWUpOiBhbnkgPT4gdmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICBsZXQgbWF0Y2ggPSB0cnVlO1xuXG4gICAgICAgIHRvQ2hlY2suZm9yRWFjaCgocGFyYW0pID0+IHtcbiAgICAgICAgICAgIGlmICghcm91dGUuc25hcHNob3QucGFyYW1zW3BhcmFtLm5hbWVdICYmICFyb3V0ZUluZm9bcGFyYW0ubmFtZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdGNoID0gbWF0Y2ggJiYgKHJvdXRlLnNuYXBzaG90LnBhcmFtc1twYXJhbS5uYW1lXSA9PT0gcGFyYW0ubWFwKHJvdXRlSW5mb1twYXJhbS5uYW1lXSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgQVBJXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBmcm9udCBlbmQgcm91dGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2R1bGUgbmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb24gbmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWNvcmQgaWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSByb3V0ZVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBidWlsZFJvdXRlKG1vZHVsZTogc3RyaW5nLCBhY3Rpb246IHN0cmluZywgcmVjb3JkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBtb2R1bGVOYW1lID0gdGhpcy5tYXBNb2R1bGVUb0Zyb250ZW5kKG1vZHVsZSk7XG4gICAgICAgIGxldCByb3V0ZSA9IGAke21vZHVsZU5hbWV9YDtcblxuICAgICAgICBpZiAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBhY3Rpb25OYW1lID0gdGhpcy5tYXBBY3Rpb25Ub0Zyb250RW5kKGFjdGlvbik7XG4gICAgICAgICAgICByb3V0ZSArPSBgLyR7YWN0aW9uTmFtZX1gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgICAgcm91dGUgKz0gYC8ke3JlY29yZH1gO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJvdXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHF1ZXJ5IHN0cmluZ1xuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHF1ZXJ5UGFyYW1zIHF1ZXJ5IHBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBleGNsdWRlIHBhcmFtZXRlcnMgdG8gZXhjbHVkZVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IHF1ZXJ5IHN0cmluZ1xuICAgICAqL1xuICAgIHByb3RlY3RlZCBidWlsZFF1ZXJ5U3RyaW5nKHF1ZXJ5UGFyYW1zOiBQYXJhbXMsIGV4Y2x1ZGU6IHN0cmluZ1tdID0gW10pOiBzdHJpbmcge1xuXG4gICAgICAgIGxldCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcygpO1xuXG5cbiAgICAgICAgT2JqZWN0LmtleXMocXVlcnlQYXJhbXMpLmZvckVhY2goKHBhcmFtKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChleGNsdWRlLmluY2x1ZGVzKHBhcmFtKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBxdWVyeVBhcmFtc1twYXJhbV07XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuc2V0KHBhcmFtLCB2YWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChwYXJhbXMua2V5cygpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiAnPycgKyBwYXJhbXMudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNYXAgbGVnYWN5IG1vZHVsZSBuYW1lIHRvIGZyb250ZW5kXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kdWxlIGxlZ2FjeSBuYW1lXG4gICAgICogQHJldHVybnMge3N0cmluZ30gZnJvbnRlbmQgbmFtZVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBtYXBNb2R1bGVUb0Zyb250ZW5kKG1vZHVsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kdWxlTmFtZU1hcHBlci50b0Zyb250ZW5kKG1vZHVsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFwIGxlZ2FjeSBhY3Rpb24gbmFtZSB0byBmcm9udGVuZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvbiBsZWdhY3kgbmFtZVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGZyb250ZW5kIG5hbWVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgbWFwQWN0aW9uVG9Gcm9udEVuZChhY3Rpb246IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmFjdGlvbk5hbWVNYXBwZXIudG9Gcm9udGVuZChhY3Rpb24pO1xuICAgIH1cblxufVxuIl19