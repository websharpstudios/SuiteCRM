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
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SystemConfigStore } from '../../store/system-config/system-config.store';
import { LanguageStore } from '../../store/language/language.store';
import { NavigationStore } from '../../store/navigation/navigation.store';
import { UserPreferenceStore } from '../../store/user-preference/user-preference.store';
import { ThemeImagesStore } from '../../store/theme-images/theme-images.store';
import { AppStateStore } from '../../store/app-state/app-state.store';
import { MessageService } from '../message/message.service';
import { ModuleNameMapper } from '../navigation/module-name-mapper/module-name-mapper.service';
import * as ??ngcc0 from '@angular/core';
export declare class BaseMetadataResolver implements Resolve<any> {
    protected systemConfigStore: SystemConfigStore;
    protected languageStore: LanguageStore;
    protected navigationStore: NavigationStore;
    protected userPreferenceStore: UserPreferenceStore;
    protected themeImagesStore: ThemeImagesStore;
    protected appState: AppStateStore;
    protected moduleNameMapper: ModuleNameMapper;
    protected messageService: MessageService;
    constructor(systemConfigStore: SystemConfigStore, languageStore: LanguageStore, navigationStore: NavigationStore, userPreferenceStore: UserPreferenceStore, themeImagesStore: ThemeImagesStore, appState: AppStateStore, moduleNameMapper: ModuleNameMapper, messageService: MessageService);
    resolve(route: ActivatedRouteSnapshot): Observable<any>;
    /**
     * Get Languages to Load
     *
     * @param {{}} route activated
     * @returns {string[]} languages
     */
    protected getLanguagesToLoad(route: ActivatedRouteSnapshot): string[];
    /**
     * Should load language strings. True if navigation is to load
     *
     * @param {{}} route activated
     * @returns {boolean} is to load
     */
    protected isToLoadLanguageStrings(route: ActivatedRouteSnapshot): boolean;
    /**
     * Should load navigation. If not set defaults to true
     *
     * @param {{}} route activated
     * @returns {boolean} is to load
     */
    protected isToLoadConfigs(route: ActivatedRouteSnapshot): boolean;
    /**
     * Should load navigation, If not set defaults to true
     *
     * @param {{}} route activated
     * @returns {boolean} is to load
     */
    protected isToLoadNavigation(route: ActivatedRouteSnapshot): boolean;
    /**
     * Should load user preferences. If not set defaults to true
     *
     * @param {{}} route activated
     * @returns {boolean} is to load
     */
    protected isToLoadUserPreferences(route: ActivatedRouteSnapshot): boolean;
    protected addMetadataLoadErrorMessage(): void;
    /**
     * Calculate the active module
     *
     * @param {{}} route active
     * @returns {string} active module
     */
    protected calculateActiveModule(route: ActivatedRouteSnapshot): string;
    /**
     * Get Parent Module Map
     *
     * @returns {{}} parent module map
     */
    protected getParentModuleMap(): {
        [key: string]: string;
    };
    static ??fac: ??ngcc0.????FactoryDeclaration<BaseMetadataResolver, never>;
}

//# sourceMappingURL=base-metadata.resolver.d.ts.map