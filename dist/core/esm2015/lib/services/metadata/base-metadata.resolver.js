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
import { concatAll, map, tap, toArray } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { SystemConfigStore } from '../../store/system-config/system-config.store';
import { LanguageStore } from '../../store/language/language.store';
import { NavigationStore } from '../../store/navigation/navigation.store';
import { UserPreferenceStore } from '../../store/user-preference/user-preference.store';
import { ThemeImagesStore } from '../../store/theme-images/theme-images.store';
import { AppStateStore } from '../../store/app-state/app-state.store';
import { MessageService } from '../message/message.service';
import { ModuleNameMapper } from '../navigation/module-name-mapper/module-name-mapper.service';
import * as i0 from "@angular/core";
import * as i1 from "../../store/system-config/system-config.store";
import * as i2 from "../../store/language/language.store";
import * as i3 from "../../store/navigation/navigation.store";
import * as i4 from "../../store/user-preference/user-preference.store";
import * as i5 from "../../store/theme-images/theme-images.store";
import * as i6 from "../../store/app-state/app-state.store";
import * as i7 from "../navigation/module-name-mapper/module-name-mapper.service";
import * as i8 from "../message/message.service";
export class BaseMetadataResolver {
    constructor(systemConfigStore, languageStore, navigationStore, userPreferenceStore, themeImagesStore, appState, moduleNameMapper, messageService) {
        this.systemConfigStore = systemConfigStore;
        this.languageStore = languageStore;
        this.navigationStore = navigationStore;
        this.userPreferenceStore = userPreferenceStore;
        this.themeImagesStore = themeImagesStore;
        this.appState = appState;
        this.moduleNameMapper = moduleNameMapper;
        this.messageService = messageService;
    }
    resolve(route) {
        const streams$ = {};
        if (this.isToLoadNavigation(route)) {
            streams$.navigation = this.navigationStore.load();
        }
        if (this.isToLoadConfigs(route)) {
            let configs$ = this.systemConfigStore.load();
            if (this.isToLoadLanguageStrings(route)) {
                const langStrings = this.getLanguagesToLoad(route);
                configs$ = configs$.pipe(map((configs) => {
                    let language = configs.default_language.value;
                    const storedLanguage = this.languageStore.getCurrentLanguage();
                    if (storedLanguage) {
                        language = storedLanguage;
                    }
                    return this.languageStore.load(language, langStrings);
                }), concatAll(), toArray());
            }
            streams$.configs = configs$;
        }
        if (this.isToLoadUserPreferences(route)) {
            streams$.preferences = this.userPreferenceStore.load();
        }
        const parallelStream$ = forkJoin(streams$);
        return parallelStream$.pipe(map((data) => {
            let theme = null;
            if (this.systemConfigStore.getConfigValue('default_theme')) {
                theme = this.systemConfigStore.getConfigValue('default_theme');
            }
            if (this.userPreferenceStore.getUserPreference('user_theme')) {
                theme = this.userPreferenceStore.getUserPreference('user_theme');
            }
            if (this.themeImagesStore.getTheme()) {
                theme = this.themeImagesStore.getTheme();
            }
            if (theme !== null) {
                return this.themeImagesStore.load(theme);
            }
            return data;
        }), concatAll(), toArray(), tap(() => this.appState.setLoaded(true)));
    }
    /**
     * Get Languages to Load
     *
     * @param {{}} route activated
     * @returns {string[]} languages
     */
    getLanguagesToLoad(route) {
        let langStrings = this.languageStore.getAvailableStringsTypes();
        if (this.isToLoadNavigation(route)) {
            return langStrings;
        }
        if (!route.data || !route.data.load) {
            return [];
        }
        if (Array.isArray(route.data.load.languageStrings)) {
            langStrings = route.data.load.languageStrings;
        }
        return langStrings;
    }
    /**
     * Should load language strings. True if navigation is to load
     *
     * @param {{}} route activated
     * @returns {boolean} is to load
     */
    isToLoadLanguageStrings(route) {
        if (this.isToLoadNavigation(route)) {
            return true;
        }
        if (!route.data || !route.data.load) {
            return false;
        }
        return Array.isArray(route.data.load.languageStrings) || route.data.load.languageStrings === true;
    }
    /**
     * Should load navigation. If not set defaults to true
     *
     * @param {{}} route activated
     * @returns {boolean} is to load
     */
    isToLoadConfigs(route) {
        if (!route.data || !route.data.load) {
            return true;
        }
        return route.data.load.configs !== false;
    }
    /**
     * Should load navigation, If not set defaults to true
     *
     * @param {{}} route activated
     * @returns {boolean} is to load
     */
    isToLoadNavigation(route) {
        if (!route.data || !route.data.load) {
            return true;
        }
        return route.data.load.navigation !== false;
    }
    /**
     * Should load user preferences. If not set defaults to true
     *
     * @param {{}} route activated
     * @returns {boolean} is to load
     */
    isToLoadUserPreferences(route) {
        if (!route.data || !route.data.load) {
            return true;
        }
        return route.data.load.preferences !== false;
    }
    addMetadataLoadErrorMessage() {
        let message = this.languageStore.getAppString('LBL_ERROR_FETCHING_METADATA');
        if (!message) {
            message = 'Error occurred while fetching metadata';
        }
        this.messageService.addDangerMessage(message);
    }
    /**
     * Calculate the active module
     *
     * @param {{}} route active
     * @returns {string} active module
     */
    calculateActiveModule(route) {
        let module = route.params.module;
        if (!module) {
            module = route.data.module;
        }
        const parentModuleParam = this.getParentModuleMap()[module] || '';
        const parentModule = route.queryParams[parentModuleParam] || '';
        if (parentModule) {
            module = this.moduleNameMapper.toFrontend(parentModule);
        }
        return module;
    }
    /**
     * Get Parent Module Map
     *
     * @returns {{}} parent module map
     */
    getParentModuleMap() {
        return {
            'merge-records': 'return_module',
            import: 'import_module'
        };
    }
}
BaseMetadataResolver.ɵprov = i0.ɵɵdefineInjectable({ factory: function BaseMetadataResolver_Factory() { return new BaseMetadataResolver(i0.ɵɵinject(i1.SystemConfigStore), i0.ɵɵinject(i2.LanguageStore), i0.ɵɵinject(i3.NavigationStore), i0.ɵɵinject(i4.UserPreferenceStore), i0.ɵɵinject(i5.ThemeImagesStore), i0.ɵɵinject(i6.AppStateStore), i0.ɵɵinject(i7.ModuleNameMapper), i0.ɵɵinject(i8.MessageService)); }, token: BaseMetadataResolver, providedIn: "root" });
BaseMetadataResolver.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
BaseMetadataResolver.ctorParameters = () => [
    { type: SystemConfigStore },
    { type: LanguageStore },
    { type: NavigationStore },
    { type: UserPreferenceStore },
    { type: ThemeImagesStore },
    { type: AppStateStore },
    { type: ModuleNameMapper },
    { type: MessageService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1tZXRhZGF0YS5yZXNvbHZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zZXJ2aWNlcy9tZXRhZGF0YS9iYXNlLW1ldGFkYXRhLnJlc29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1RCxPQUFPLEVBQUMsUUFBUSxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBRTFDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLCtDQUErQyxDQUFDO0FBQ2hGLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUNsRSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0seUNBQXlDLENBQUM7QUFDeEUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sbURBQW1ELENBQUM7QUFDdEYsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sNkNBQTZDLENBQUM7QUFDN0UsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHVDQUF1QyxDQUFDO0FBQ3BFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUMxRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSw2REFBNkQsQ0FBQzs7Ozs7Ozs7OztBQUk3RixNQUFNLE9BQU8sb0JBQW9CO0lBRTdCLFlBQ2MsaUJBQW9DLEVBQ3BDLGFBQTRCLEVBQzVCLGVBQWdDLEVBQ2hDLG1CQUF3QyxFQUN4QyxnQkFBa0MsRUFDbEMsUUFBdUIsRUFDdkIsZ0JBQWtDLEVBQ2xDLGNBQThCO1FBUDlCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDcEMs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LElBQUksQ0FBQyxNQUFNLENBQUM7U0FDOUI7UUFFRCxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNsRSxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDO1FBRWhFLElBQUksWUFBWSxFQUFFO1lBQ2QsTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDM0Q7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNPLGtCQUFrQjtRQUN4QixPQUFPO1lBQ0gsZUFBZSxFQUFFLGVBQWU7WUFDaEMsTUFBTSxFQUFFLGVBQWU7U0FDMUIsQ0FBQztJQUNOLENBQUM7Ozs7WUF4TkosVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7O1lBVnhCLGlCQUFpQjtZQUNqQixhQUFhO1lBQ2IsZUFBZTtZQUNmLG1CQUFtQjtZQUNuQixnQkFBZ0I7WUFDaEIsYUFBYTtZQUViLGdCQUFnQjtZQURoQixjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBSZXNvbHZlfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtjb25jYXRBbGwsIG1hcCwgdGFwLCB0b0FycmF5fSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge2ZvcmtKb2luLCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtTeXN0ZW1Db25maWdTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvc3lzdGVtLWNvbmZpZy9zeXN0ZW0tY29uZmlnLnN0b3JlJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtOYXZpZ2F0aW9uU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL25hdmlnYXRpb24vbmF2aWdhdGlvbi5zdG9yZSc7XG5pbXBvcnQge1VzZXJQcmVmZXJlbmNlU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL3VzZXItcHJlZmVyZW5jZS91c2VyLXByZWZlcmVuY2Uuc3RvcmUnO1xuaW1wb3J0IHtUaGVtZUltYWdlc1N0b3JlfSBmcm9tICcuLi8uLi9zdG9yZS90aGVtZS1pbWFnZXMvdGhlbWUtaW1hZ2VzLnN0b3JlJztcbmltcG9ydCB7QXBwU3RhdGVTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvYXBwLXN0YXRlL2FwcC1zdGF0ZS5zdG9yZSc7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tICcuLi9tZXNzYWdlL21lc3NhZ2Uuc2VydmljZSc7XG5pbXBvcnQge01vZHVsZU5hbWVNYXBwZXJ9IGZyb20gJy4uL25hdmlnYXRpb24vbW9kdWxlLW5hbWUtbWFwcGVyL21vZHVsZS1uYW1lLW1hcHBlci5zZXJ2aWNlJztcblxuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBCYXNlTWV0YWRhdGFSZXNvbHZlciBpbXBsZW1lbnRzIFJlc29sdmU8YW55PiB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHN5c3RlbUNvbmZpZ1N0b3JlOiBTeXN0ZW1Db25maWdTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlU3RvcmU6IExhbmd1YWdlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBuYXZpZ2F0aW9uU3RvcmU6IE5hdmlnYXRpb25TdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIHVzZXJQcmVmZXJlbmNlU3RvcmU6IFVzZXJQcmVmZXJlbmNlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCB0aGVtZUltYWdlc1N0b3JlOiBUaGVtZUltYWdlc1N0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgYXBwU3RhdGU6IEFwcFN0YXRlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBtb2R1bGVOYW1lTWFwcGVyOiBNb2R1bGVOYW1lTWFwcGVyLFxuICAgICAgICBwcm90ZWN0ZWQgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgICkge1xuICAgIH1cblxuICAgIHJlc29sdmUocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICBjb25zdCBzdHJlYW1zJDogeyBba2V5OiBzdHJpbmddOiBPYnNlcnZhYmxlPGFueT4gfSA9IHt9O1xuXG4gICAgICAgIGlmICh0aGlzLmlzVG9Mb2FkTmF2aWdhdGlvbihyb3V0ZSkpIHtcbiAgICAgICAgICAgIHN0cmVhbXMkLm5hdmlnYXRpb24gPSB0aGlzLm5hdmlnYXRpb25TdG9yZS5sb2FkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1RvTG9hZENvbmZpZ3Mocm91dGUpKSB7XG5cbiAgICAgICAgICAgIGxldCBjb25maWdzJCA9IHRoaXMuc3lzdGVtQ29uZmlnU3RvcmUubG9hZCgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc1RvTG9hZExhbmd1YWdlU3RyaW5ncyhyb3V0ZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYW5nU3RyaW5ncyA9IHRoaXMuZ2V0TGFuZ3VhZ2VzVG9Mb2FkKHJvdXRlKTtcblxuICAgICAgICAgICAgICAgIGNvbmZpZ3MkID0gY29uZmlncyQucGlwZShcbiAgICAgICAgICAgICAgICAgICAgbWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmZpZ3M6IGFueSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhbmd1YWdlID0gY29uZmlncy5kZWZhdWx0X2xhbmd1YWdlLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0b3JlZExhbmd1YWdlID0gdGhpcy5sYW5ndWFnZVN0b3JlLmdldEN1cnJlbnRMYW5ndWFnZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0b3JlZExhbmd1YWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlID0gc3RvcmVkTGFuZ3VhZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZ3VhZ2VTdG9yZS5sb2FkKGxhbmd1YWdlLCBsYW5nU3RyaW5ncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICBjb25jYXRBbGwoKSxcbiAgICAgICAgICAgICAgICAgICAgdG9BcnJheSgpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3RyZWFtcyQuY29uZmlncyA9IGNvbmZpZ3MkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNUb0xvYWRVc2VyUHJlZmVyZW5jZXMocm91dGUpKSB7XG5cbiAgICAgICAgICAgIHN0cmVhbXMkLnByZWZlcmVuY2VzID0gdGhpcy51c2VyUHJlZmVyZW5jZVN0b3JlLmxvYWQoKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29uc3QgcGFyYWxsZWxTdHJlYW0kID0gZm9ya0pvaW4oc3RyZWFtcyQpO1xuXG4gICAgICAgIHJldHVybiBwYXJhbGxlbFN0cmVhbSQucGlwZShcbiAgICAgICAgICAgIG1hcCgoZGF0YTogYW55KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgdGhlbWUgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3lzdGVtQ29uZmlnU3RvcmUuZ2V0Q29uZmlnVmFsdWUoJ2RlZmF1bHRfdGhlbWUnKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGVtZSA9IHRoaXMuc3lzdGVtQ29uZmlnU3RvcmUuZ2V0Q29uZmlnVmFsdWUoJ2RlZmF1bHRfdGhlbWUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy51c2VyUHJlZmVyZW5jZVN0b3JlLmdldFVzZXJQcmVmZXJlbmNlKCd1c2VyX3RoZW1lJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhlbWUgPSB0aGlzLnVzZXJQcmVmZXJlbmNlU3RvcmUuZ2V0VXNlclByZWZlcmVuY2UoJ3VzZXJfdGhlbWUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy50aGVtZUltYWdlc1N0b3JlLmdldFRoZW1lKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhlbWUgPSB0aGlzLnRoZW1lSW1hZ2VzU3RvcmUuZ2V0VGhlbWUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhlbWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGhlbWVJbWFnZXNTdG9yZS5sb2FkKHRoZW1lKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgY29uY2F0QWxsKCksXG4gICAgICAgICAgICB0b0FycmF5KCksXG4gICAgICAgICAgICB0YXAoKCkgPT4gdGhpcy5hcHBTdGF0ZS5zZXRMb2FkZWQodHJ1ZSkpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IExhbmd1YWdlcyB0byBMb2FkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3t9fSByb3V0ZSBhY3RpdmF0ZWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nW119IGxhbmd1YWdlc1xuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXRMYW5ndWFnZXNUb0xvYWQocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmdbXSB7XG4gICAgICAgIGxldCBsYW5nU3RyaW5nczogc3RyaW5nW10gPSB0aGlzLmxhbmd1YWdlU3RvcmUuZ2V0QXZhaWxhYmxlU3RyaW5nc1R5cGVzKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNUb0xvYWROYXZpZ2F0aW9uKHJvdXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGxhbmdTdHJpbmdzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyb3V0ZS5kYXRhIHx8ICFyb3V0ZS5kYXRhLmxvYWQpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJvdXRlLmRhdGEubG9hZC5sYW5ndWFnZVN0cmluZ3MpKSB7XG4gICAgICAgICAgICBsYW5nU3RyaW5ncyA9IHJvdXRlLmRhdGEubG9hZC5sYW5ndWFnZVN0cmluZ3M7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGFuZ1N0cmluZ3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdWxkIGxvYWQgbGFuZ3VhZ2Ugc3RyaW5ncy4gVHJ1ZSBpZiBuYXZpZ2F0aW9uIGlzIHRvIGxvYWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7e319IHJvdXRlIGFjdGl2YXRlZFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBpcyB0byBsb2FkXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGlzVG9Mb2FkTGFuZ3VhZ2VTdHJpbmdzKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogYm9vbGVhbiB7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNUb0xvYWROYXZpZ2F0aW9uKHJvdXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJvdXRlLmRhdGEgfHwgIXJvdXRlLmRhdGEubG9hZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkocm91dGUuZGF0YS5sb2FkLmxhbmd1YWdlU3RyaW5ncykgfHwgcm91dGUuZGF0YS5sb2FkLmxhbmd1YWdlU3RyaW5ncyA9PT0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG91bGQgbG9hZCBuYXZpZ2F0aW9uLiBJZiBub3Qgc2V0IGRlZmF1bHRzIHRvIHRydWVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7e319IHJvdXRlIGFjdGl2YXRlZFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBpcyB0byBsb2FkXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGlzVG9Mb2FkQ29uZmlncyhyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXJvdXRlLmRhdGEgfHwgIXJvdXRlLmRhdGEubG9hZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm91dGUuZGF0YS5sb2FkLmNvbmZpZ3MgIT09IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3VsZCBsb2FkIG5hdmlnYXRpb24sIElmIG5vdCBzZXQgZGVmYXVsdHMgdG8gdHJ1ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHt7fX0gcm91dGUgYWN0aXZhdGVkXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IGlzIHRvIGxvYWRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaXNUb0xvYWROYXZpZ2F0aW9uKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghcm91dGUuZGF0YSB8fCAhcm91dGUuZGF0YS5sb2FkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByb3V0ZS5kYXRhLmxvYWQubmF2aWdhdGlvbiAhPT0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdWxkIGxvYWQgdXNlciBwcmVmZXJlbmNlcy4gSWYgbm90IHNldCBkZWZhdWx0cyB0byB0cnVlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3t9fSByb3V0ZSBhY3RpdmF0ZWRcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gaXMgdG8gbG9hZFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpc1RvTG9hZFVzZXJQcmVmZXJlbmNlcyhyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXJvdXRlLmRhdGEgfHwgIXJvdXRlLmRhdGEubG9hZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm91dGUuZGF0YS5sb2FkLnByZWZlcmVuY2VzICE9PSBmYWxzZTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWRkTWV0YWRhdGFMb2FkRXJyb3JNZXNzYWdlKCk6IHZvaWQge1xuICAgICAgICBsZXQgbWVzc2FnZSA9IHRoaXMubGFuZ3VhZ2VTdG9yZS5nZXRBcHBTdHJpbmcoJ0xCTF9FUlJPUl9GRVRDSElOR19NRVRBREFUQScpO1xuXG4gICAgICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgICAgICAgbWVzc2FnZSA9ICdFcnJvciBvY2N1cnJlZCB3aGlsZSBmZXRjaGluZyBtZXRhZGF0YSc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLmFkZERhbmdlck1lc3NhZ2UobWVzc2FnZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlIHRoZSBhY3RpdmUgbW9kdWxlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3t9fSByb3V0ZSBhY3RpdmVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBhY3RpdmUgbW9kdWxlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNhbGN1bGF0ZUFjdGl2ZU1vZHVsZShyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IHN0cmluZyB7XG5cbiAgICAgICAgbGV0IG1vZHVsZSA9IHJvdXRlLnBhcmFtcy5tb2R1bGU7XG5cbiAgICAgICAgaWYgKCFtb2R1bGUpIHtcbiAgICAgICAgICAgIG1vZHVsZSA9IHJvdXRlLmRhdGEubW9kdWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFyZW50TW9kdWxlUGFyYW0gPSB0aGlzLmdldFBhcmVudE1vZHVsZU1hcCgpW21vZHVsZV0gfHwgJyc7XG4gICAgICAgIGNvbnN0IHBhcmVudE1vZHVsZSA9IHJvdXRlLnF1ZXJ5UGFyYW1zW3BhcmVudE1vZHVsZVBhcmFtXSB8fCAnJztcblxuICAgICAgICBpZiAocGFyZW50TW9kdWxlKSB7XG4gICAgICAgICAgICBtb2R1bGUgPSB0aGlzLm1vZHVsZU5hbWVNYXBwZXIudG9Gcm9udGVuZChwYXJlbnRNb2R1bGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IFBhcmVudCBNb2R1bGUgTWFwXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7e319IHBhcmVudCBtb2R1bGUgbWFwXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldFBhcmVudE1vZHVsZU1hcCgpOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdtZXJnZS1yZWNvcmRzJzogJ3JldHVybl9tb2R1bGUnLFxuICAgICAgICAgICAgaW1wb3J0OiAnaW1wb3J0X21vZHVsZSdcbiAgICAgICAgfTtcbiAgICB9XG59XG4iXX0=