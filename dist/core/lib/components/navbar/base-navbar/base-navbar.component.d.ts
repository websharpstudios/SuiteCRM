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
import { OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NavbarModel } from '../navbar-model';
import { ActionNameMapper } from '../../../services/navigation/action-name-mapper/action-name-mapper.service';
import { SystemConfigStore } from '../../../store/system-config/system-config.store';
import { Navigation, NavigationStore } from '../../../store/navigation/navigation.store';
import { UserPreferenceMap, UserPreferenceStore } from '../../../store/user-preference/user-preference.store';
import { ScreenSize, ScreenSizeObserverService } from '../../../services/ui/screen-size-observer/screen-size-observer.service';
import { RouteConverter } from '../../../services/navigation/route-converter/route-converter.service';
import { LanguageStore, LanguageStrings } from '../../../store/language/language.store';
import { ModuleNavigation } from '../../../services/navigation/module-navigation/module-navigation.service';
import { ModuleNameMapper } from '../../../services/navigation/module-name-mapper/module-name-mapper.service';
import { AppState, AppStateStore } from '../../../store/app-state/app-state.store';
import { AuthService } from '../../../services/auth/auth.service';
import { MenuItem } from 'common';
import * as ɵngcc0 from '@angular/core';
export declare class BaseNavbarComponent implements OnInit, OnDestroy {
    protected navigationStore: NavigationStore;
    protected languageStore: LanguageStore;
    protected userPreferenceStore: UserPreferenceStore;
    protected systemConfigStore: SystemConfigStore;
    protected appState: AppStateStore;
    protected authService: AuthService;
    protected moduleNavigation: ModuleNavigation;
    protected screenSize: ScreenSizeObserverService;
    protected static instances: BaseNavbarComponent[];
    loaded: boolean;
    isUserLoggedIn: boolean;
    mainNavCollapse: boolean;
    subNavCollapse: boolean;
    mobileNavbar: boolean;
    mobileSubNav: boolean;
    backLink: boolean;
    mainNavLink: boolean;
    submenu: any;
    moduleNameMapper: ModuleNameMapper;
    actionNameMapper: ActionNameMapper;
    routeConverter: RouteConverter;
    navbar: NavbarModel;
    maxTabs: number;
    screen: ScreenSize;
    languages$: Observable<LanguageStrings>;
    userPreferences$: Observable<UserPreferenceMap>;
    currentUser$: Observable<any>;
    appState$: Observable<AppState>;
    navigation$: Observable<Navigation>;
    vm$: Observable<{
        navigation: Navigation;
        languages: LanguageStrings;
        userPreferences: UserPreferenceMap;
        appState: AppState;
    }>;
    constructor(navigationStore: NavigationStore, languageStore: LanguageStore, userPreferenceStore: UserPreferenceStore, systemConfigStore: SystemConfigStore, appState: AppStateStore, authService: AuthService, moduleNavigation: ModuleNavigation, screenSize: ScreenSizeObserverService);
    /**
     * Public API
     */
    /**
     * Reset component instance
     */
    static reset(): void;
    onResize(event: any): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * Change subnavigation
     *
     * @param {object} event triggered
     * @param {object} items
     */
    changeSubNav(event: Event, items: MenuItem[]): void;
    /**
     * Set link flags
     */
    navBackLink(): void;
    /**
     * Get home page
     *
     * @returns {string} homepage
     */
    getHomePage(): string;
    /**
     * Internal API
     */
    /**
     * Set navbar model
     *
     * @param {{}} navbar model
     */
    protected setNavbar(navbar: NavbarModel): void;
    /**
     * Check if is loaded
     *
     * @returns {{boolean}} is loaded
     */
    protected isLoaded(): boolean;
    protected calculateMaxTabs(navigation: Navigation): void;
    getCloseCallBack(myDrop: any): Function;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<BaseNavbarComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<BaseNavbarComponent, "scrm-base-navbar", never, {}, {}, never, never>;
}

//# sourceMappingURL=base-navbar.component.d.ts.map