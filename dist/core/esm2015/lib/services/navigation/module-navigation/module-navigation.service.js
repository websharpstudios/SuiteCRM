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
import { Router } from '@angular/router';
import { ModuleNameMapper } from '../module-name-mapper/module-name-mapper.service';
import { ActionNameMapper } from '../action-name-mapper/action-name-mapper.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../module-name-mapper/module-name-mapper.service";
import * as i3 from "../action-name-mapper/action-name-mapper.service";
const ROUTE_PREFIX = './#';
export class ModuleNavigation {
    constructor(router, moduleNameMapper, actionNameMapper) {
        this.router = router;
        this.moduleNameMapper = moduleNameMapper;
        this.actionNameMapper = actionNameMapper;
    }
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
    getModuleInfo(module, navigation) {
        if (!navigation || !navigation.modules) {
            return null;
        }
        return navigation.modules[module];
    }
    /**
     * Get module label
     *
     * @param {object} module info
     * @param {object} appListStrings map
     * @returns {string} the module label
     */
    getModuleLabel(module, appListStrings) {
        if (!appListStrings || !appListStrings.moduleList || !module) {
            return '';
        }
        const labelKey = (module && module.labelKey) || '';
        return appListStrings.moduleList[labelKey] || labelKey;
    }
    /**
     * Get module route
     *
     * @param {object} module NavbarModule
     * @returns {object} NavigationRoute
     */
    getModuleRoute(module) {
        let url = (module && module.defaultRoute) || '';
        let route = null;
        const params = null;
        if (url.startsWith(ROUTE_PREFIX)) {
            route = url.replace(ROUTE_PREFIX, '');
            url = null;
        }
        return { route, url, params };
    }
    /**
     * Navigate using action information
     *
     * @param {object} item ModuleAction
     * @returns {object} Promise<boolean>
     */
    navigate(item) {
        const route = this.getActionRoute(item);
        return this.router.navigate([route.route], {
            queryParams: route.params
        });
    }
    /**
     * Get action route info
     *
     * @param {object} action ModuleAction
     * @returns {object} NavigationRoute
     */
    getActionRoute(action) {
        let url = action.url;
        let route = null;
        let params = null;
        if (url.startsWith(ROUTE_PREFIX)) {
            route = url.replace(ROUTE_PREFIX, '');
            url = null;
            if (action.params) {
                params = action.params;
            }
        }
        return { route, url, params };
    }
    /**
     * Get label for module action item
     *
     * @param {string} module name
     * @param {object} item action
     * @param {object} languages map
     * @param {string} labelKey to use
     * @returns {string} label
     */
    getActionLabel(module, item, languages, labelKey = '') {
        if (!languages || !languages.modStrings || !item || !module) {
            return '';
        }
        let key = labelKey;
        if (!key) {
            key = item.labelKey;
        }
        let label = languages.modStrings[module] && languages.modStrings[module][key];
        if (!label) {
            label = languages.appStrings && languages.appStrings[key];
        }
        if (!label && item.module) {
            label = languages.modStrings[item.module] && languages.modStrings[item.module][key];
        }
        if (!label) {
            label = languages.modStrings.administration && languages.modStrings.administration[key];
        }
        return label || '';
    }
    /**
     * Get record router link route info
     *
     * @param {string} module name
     * @param {string} id fo the record
     * @returns {string} router link
     */
    getRecordRouterLink(module, id) {
        return `/${module}/record/${id}`;
    }
    /**
     * Navigate back using return params
     * @param record
     * @param moduleName
     * @param params
     */
    navigateBack(record, moduleName, params) {
        let returnModule = this.getReturnModule(params);
        let returnAction = this.getReturnAction(params);
        const returnId = this.getReturnId(params);
        let route = '';
        if (returnModule) {
            route += '/' + returnModule;
        }
        if (returnAction) {
            route += '/' + returnAction;
        }
        if (returnId) {
            route += '/' + returnId;
        }
        if (returnModule === moduleName && returnAction === 'record') {
            const rid = !returnId ? record.id : returnId;
            route = '/' + moduleName + '/record/' + rid;
        }
        if (!route && record && record.id) {
            route = '/' + moduleName + '/record/' + record.id;
        }
        if (!route && record && record.id) {
            route = '/' + moduleName;
        }
        this.router.navigate([route]).then();
    }
    /**
     * Extract return id
     * @param params
     */
    getReturnId(params) {
        return params.return_id || '';
    }
    /**
     * Extract and map return action
     * @param params
     */
    getReturnAction(params) {
        let returnAction = '';
        if (params.return_action) {
            returnAction = this.actionNameMapper.toFrontend(params.return_action);
        }
        return returnAction;
    }
    /**
     * Extract and map return action
     * @param params
     */
    getReturnModule(params) {
        let returnModule = '';
        if (params.return_module) {
            returnModule = this.moduleNameMapper.toFrontend(params.return_module);
        }
        return returnModule;
    }
}
ModuleNavigation.ɵprov = i0.ɵɵdefineInjectable({ factory: function ModuleNavigation_Factory() { return new ModuleNavigation(i0.ɵɵinject(i1.Router), i0.ɵɵinject(i2.ModuleNameMapper), i0.ɵɵinject(i3.ActionNameMapper)); }, token: ModuleNavigation, providedIn: "root" });
ModuleNavigation.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
ModuleNavigation.ctorParameters = () => [
    { type: Router },
    { type: ModuleNameMapper },
    { type: ActionNameMapper }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLW5hdmlnYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zZXJ2aWNlcy9uYXZpZ2F0aW9uL21vZHVsZS1uYXZpZ2F0aW9uL21vZHVsZS1uYXZpZ2F0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBSXZDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtEQUFrRCxDQUFDO0FBQ2xGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtEQUFrRCxDQUFDOzs7OztBQVFsRixNQUFNLFlBQVksR0FBRyxLQUFLLENBQUM7QUFHM0IsTUFBTSxPQUFPLGdCQUFnQjtJQUV6QixZQUNjLE1BQWMsRUFDZCxnQkFBa0MsRUFDbEMsZ0JBQWtDO1FBRmxDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7SUFFaEQsQ0FBQztJQUVEOztPQUVHO0lBRUg7Ozs7OztPQU1HO0lBQ0ksYUFBYSxDQUFDLE1BQWMsRUFBRSxVQUFzQjtRQUN2RCxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRTtZQUNwQyxPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxjQUFjLENBQUMsTUFBb0IsRUFBRSxjQUFxQztRQUM3RSxJQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsY0FBYyxDQUFDLFVB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QU07WUFJTixnQkFBZ0I7WUFDaEIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge01vZHVsZUFjdGlvbiwgTmF2YmFyTW9kdWxlLCBOYXZpZ2F0aW9ufSBmcm9tICcuLi8uLi8uLi9zdG9yZS9uYXZpZ2F0aW9uL25hdmlnYXRpb24uc3RvcmUnO1xuaW1wb3J0IHtMYW5ndWFnZUxpc3RTdHJpbmdNYXAsIExhbmd1YWdlU3RyaW5nc30gZnJvbSAnLi4vLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtSZWNvcmR9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge01vZHVsZU5hbWVNYXBwZXJ9IGZyb20gJy4uL21vZHVsZS1uYW1lLW1hcHBlci9tb2R1bGUtbmFtZS1tYXBwZXIuc2VydmljZSc7XG5pbXBvcnQge0FjdGlvbk5hbWVNYXBwZXJ9IGZyb20gJy4uL2FjdGlvbi1uYW1lLW1hcHBlci9hY3Rpb24tbmFtZS1tYXBwZXIuc2VydmljZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmF2aWdhdGlvblJvdXRlIHtcbiAgICByb3V0ZTogc3RyaW5nO1xuICAgIHVybDogc3RyaW5nO1xuICAgIHBhcmFtczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcbn1cblxuY29uc3QgUk9VVEVfUFJFRklYID0gJy4vIyc7XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE1vZHVsZU5hdmlnYXRpb24ge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCByb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgcHJvdGVjdGVkIG1vZHVsZU5hbWVNYXBwZXI6IE1vZHVsZU5hbWVNYXBwZXIsXG4gICAgICAgIHByb3RlY3RlZCBhY3Rpb25OYW1lTWFwcGVyOiBBY3Rpb25OYW1lTWFwcGVyXG4gICAgKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHVibGljIEFwaVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogR2V0IG1vZHVsZSBpbmZvXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kdWxlIG5hbWVcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbmF2aWdhdGlvbiBpbmZvXG4gICAgICogQHJldHVybnMge29iamVjdH0gbW9kdWxlIGluZm9cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0TW9kdWxlSW5mbyhtb2R1bGU6IHN0cmluZywgbmF2aWdhdGlvbjogTmF2aWdhdGlvbik6IE5hdmJhck1vZHVsZSB7XG4gICAgICAgIGlmICghbmF2aWdhdGlvbiB8fCAhbmF2aWdhdGlvbi5tb2R1bGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuYXZpZ2F0aW9uLm1vZHVsZXNbbW9kdWxlXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgbW9kdWxlIGxhYmVsXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbW9kdWxlIGluZm9cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gYXBwTGlzdFN0cmluZ3MgbWFwXG4gICAgICogQHJldHVybnMge3N0cmluZ30gdGhlIG1vZHVsZSBsYWJlbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRNb2R1bGVMYWJlbChtb2R1bGU6IE5hdmJhck1vZHVsZSwgYXBwTGlzdFN0cmluZ3M6IExhbmd1YWdlTGlzdFN0cmluZ01hcCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghYXBwTGlzdFN0cmluZ3MgfHwgIWFwcExpc3RTdHJpbmdzLm1vZHVsZUxpc3QgfHwgIW1vZHVsZSkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxhYmVsS2V5ID0gKG1vZHVsZSAmJiBtb2R1bGUubGFiZWxLZXkpIHx8ICcnO1xuXG4gICAgICAgIHJldHVybiBhcHBMaXN0U3RyaW5ncy5tb2R1bGVMaXN0W2xhYmVsS2V5XSB8fCBsYWJlbEtleTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgbW9kdWxlIHJvdXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbW9kdWxlIE5hdmJhck1vZHVsZVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IE5hdmlnYXRpb25Sb3V0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRNb2R1bGVSb3V0ZShtb2R1bGU6IE5hdmJhck1vZHVsZSk6IE5hdmlnYXRpb25Sb3V0ZSB7XG4gICAgICAgIGxldCB1cmwgPSAobW9kdWxlICYmIG1vZHVsZS5kZWZhdWx0Um91dGUpIHx8ICcnO1xuICAgICAgICBsZXQgcm91dGUgPSBudWxsO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBudWxsO1xuXG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChST1VURV9QUkVGSVgpKSB7XG4gICAgICAgICAgICByb3V0ZSA9IHVybC5yZXBsYWNlKFJPVVRFX1BSRUZJWCwgJycpO1xuICAgICAgICAgICAgdXJsID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7cm91dGUsIHVybCwgcGFyYW1zfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBOYXZpZ2F0ZSB1c2luZyBhY3Rpb24gaW5mb3JtYXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtIE1vZHVsZUFjdGlvblxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IFByb21pc2U8Ym9vbGVhbj5cbiAgICAgKi9cbiAgICBwdWJsaWMgbmF2aWdhdGUoaXRlbTogTW9kdWxlQWN0aW9uKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIGNvbnN0IHJvdXRlID0gdGhpcy5nZXRBY3Rpb25Sb3V0ZShpdGVtKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3JvdXRlLnJvdXRlXSwge1xuICAgICAgICAgICAgcXVlcnlQYXJhbXM6IHJvdXRlLnBhcmFtc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYWN0aW9uIHJvdXRlIGluZm9cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhY3Rpb24gTW9kdWxlQWN0aW9uXG4gICAgICogQHJldHVybnMge29iamVjdH0gTmF2aWdhdGlvblJvdXRlXG4gICAgICovXG4gICAgcHVibGljIGdldEFjdGlvblJvdXRlKGFjdGlvbjogTW9kdWxlQWN0aW9uKTogTmF2aWdhdGlvblJvdXRlIHtcbiAgICAgICAgbGV0IHVybCA9IGFjdGlvbi51cmw7XG4gICAgICAgIGxldCByb3V0ZSA9IG51bGw7XG4gICAgICAgIGxldCBwYXJhbXMgPSBudWxsO1xuXG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChST1VURV9QUkVGSVgpKSB7XG4gICAgICAgICAgICByb3V0ZSA9IHVybC5yZXBsYWNlKFJPVVRFX1BSRUZJWCwgJycpO1xuICAgICAgICAgICAgdXJsID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKGFjdGlvbi5wYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBhY3Rpb24ucGFyYW1zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtyb3V0ZSwgdXJsLCBwYXJhbXN9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBsYWJlbCBmb3IgbW9kdWxlIGFjdGlvbiBpdGVtXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kdWxlIG5hbWVcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gaXRlbSBhY3Rpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbGFuZ3VhZ2VzIG1hcFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYWJlbEtleSB0byB1c2VcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBsYWJlbFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRBY3Rpb25MYWJlbChtb2R1bGU6IHN0cmluZywgaXRlbTogTW9kdWxlQWN0aW9uLCBsYW5ndWFnZXM6IExhbmd1YWdlU3RyaW5ncywgbGFiZWxLZXkgPSAnJyk6IHN0cmluZyB7XG4gICAgICAgIGlmICghbGFuZ3VhZ2VzIHx8ICFsYW5ndWFnZXMubW9kU3RyaW5ncyB8fCAhaXRlbSB8fCAhbW9kdWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQga2V5ID0gbGFiZWxLZXk7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICBrZXkgPSBpdGVtLmxhYmVsS2V5O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxhYmVsID0gbGFuZ3VhZ2VzLm1vZFN0cmluZ3NbbW9kdWxlXSAmJiBsYW5ndWFnZXMubW9kU3RyaW5nc1ttb2R1bGVdW2tleV07XG5cbiAgICAgICAgaWYgKCFsYWJlbCkge1xuICAgICAgICAgICAgbGFiZWwgPSBsYW5ndWFnZXMuYXBwU3RyaW5ncyAmJiBsYW5ndWFnZXMuYXBwU3RyaW5nc1trZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFsYWJlbCAmJiBpdGVtLm1vZHVsZSkge1xuICAgICAgICAgICAgbGFiZWwgPSBsYW5ndWFnZXMubW9kU3RyaW5nc1tpdGVtLm1vZHVsZV0gJiYgbGFuZ3VhZ2VzLm1vZFN0cmluZ3NbaXRlbS5tb2R1bGVdW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWxhYmVsKSB7XG4gICAgICAgICAgICBsYWJlbCA9IGxhbmd1YWdlcy5tb2RTdHJpbmdzLmFkbWluaXN0cmF0aW9uICYmIGxhbmd1YWdlcy5tb2RTdHJpbmdzLmFkbWluaXN0cmF0aW9uW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGFiZWwgfHwgJyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHJlY29yZCByb3V0ZXIgbGluayByb3V0ZSBpbmZvXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kdWxlIG5hbWVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgZm8gdGhlIHJlY29yZFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IHJvdXRlciBsaW5rXG4gICAgICovXG4gICAgcHVibGljIGdldFJlY29yZFJvdXRlckxpbmsobW9kdWxlOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcge1xuXG4gICAgICAgIHJldHVybiBgLyR7bW9kdWxlfS9yZWNvcmQvJHtpZH1gO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE5hdmlnYXRlIGJhY2sgdXNpbmcgcmV0dXJuIHBhcmFtc1xuICAgICAqIEBwYXJhbSByZWNvcmRcbiAgICAgKiBAcGFyYW0gbW9kdWxlTmFtZVxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBwdWJsaWMgbmF2aWdhdGVCYWNrKFxuICAgICAgICByZWNvcmQ6IFJlY29yZCxcbiAgICAgICAgbW9kdWxlTmFtZTogc3RyaW5nLFxuICAgICAgICBwYXJhbXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH1cbiAgICApIHtcblxuICAgICAgICBsZXQgcmV0dXJuTW9kdWxlID0gdGhpcy5nZXRSZXR1cm5Nb2R1bGUocGFyYW1zKTtcbiAgICAgICAgbGV0IHJldHVybkFjdGlvbiA9IHRoaXMuZ2V0UmV0dXJuQWN0aW9uKHBhcmFtcyk7XG4gICAgICAgIGNvbnN0IHJldHVybklkID0gdGhpcy5nZXRSZXR1cm5JZChwYXJhbXMpO1xuXG4gICAgICAgIGxldCByb3V0ZSA9ICcnO1xuICAgICAgICBpZiAocmV0dXJuTW9kdWxlKSB7XG4gICAgICAgICAgICByb3V0ZSArPSAnLycgKyByZXR1cm5Nb2R1bGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV0dXJuQWN0aW9uKSB7XG4gICAgICAgICAgICByb3V0ZSArPSAnLycgKyByZXR1cm5BY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV0dXJuSWQpIHtcbiAgICAgICAgICAgIHJvdXRlICs9ICcvJyArIHJldHVybklkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldHVybk1vZHVsZSA9PT0gbW9kdWxlTmFtZSAmJiByZXR1cm5BY3Rpb24gPT09ICdyZWNvcmQnKSB7XG4gICAgICAgICAgICBjb25zdCByaWQgPSAhcmV0dXJuSWQgPyByZWNvcmQuaWQgOiByZXR1cm5JZDtcbiAgICAgICAgICAgIHJvdXRlID0gJy8nICsgbW9kdWxlTmFtZSArICcvcmVjb3JkLycgKyByaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJvdXRlICYmIHJlY29yZCAmJiByZWNvcmQuaWQpIHtcbiAgICAgICAgICAgIHJvdXRlID0gJy8nICsgbW9kdWxlTmFtZSArICcvcmVjb3JkLycgKyByZWNvcmQuaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJvdXRlICYmIHJlY29yZCAmJiByZWNvcmQuaWQpIHtcbiAgICAgICAgICAgIHJvdXRlID0gJy8nICsgbW9kdWxlTmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtyb3V0ZV0pLnRoZW4oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0IHJldHVybiBpZFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0UmV0dXJuSWQocGFyYW1zOiB7IFtwOiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICByZXR1cm4gcGFyYW1zLnJldHVybl9pZCB8fCAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0IGFuZCBtYXAgcmV0dXJuIGFjdGlvblxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0UmV0dXJuQWN0aW9uKHBhcmFtczogeyBbcDogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgICAgICAgbGV0IHJldHVybkFjdGlvbiA9ICcnO1xuXG4gICAgICAgIGlmIChwYXJhbXMucmV0dXJuX2FjdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuQWN0aW9uID0gdGhpcy5hY3Rpb25OYW1lTWFwcGVyLnRvRnJvbnRlbmQocGFyYW1zLnJldHVybl9hY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXR1cm5BY3Rpb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdCBhbmQgbWFwIHJldHVybiBhY3Rpb25cbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgcHVibGljIGdldFJldHVybk1vZHVsZShwYXJhbXM6IHsgW3A6IHN0cmluZ106IHN0cmluZyB9KSB7XG4gICAgICAgIGxldCByZXR1cm5Nb2R1bGUgPSAnJztcblxuICAgICAgICBpZiAocGFyYW1zLnJldHVybl9tb2R1bGUpIHtcbiAgICAgICAgICAgIHJldHVybk1vZHVsZSA9IHRoaXMubW9kdWxlTmFtZU1hcHBlci50b0Zyb250ZW5kKHBhcmFtcy5yZXR1cm5fbW9kdWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXR1cm5Nb2R1bGU7XG4gICAgfVxufVxuIl19