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
import { Component, HostListener } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavbarAbstract } from '../navbar.abstract';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { ActionNameMapper } from '../../../services/navigation/action-name-mapper/action-name-mapper.service';
import { SystemConfigStore } from '../../../store/system-config/system-config.store';
import { NavigationStore } from '../../../store/navigation/navigation.store';
import { UserPreferenceStore } from '../../../store/user-preference/user-preference.store';
import { ScreenSize, ScreenSizeObserverService } from '../../../services/ui/screen-size-observer/screen-size-observer.service';
import { RouteConverter } from '../../../services/navigation/route-converter/route-converter.service';
import { LanguageStore } from '../../../store/language/language.store';
import { ModuleNavigation } from '../../../services/navigation/module-navigation/module-navigation.service';
import { ModuleNameMapper } from '../../../services/navigation/module-name-mapper/module-name-mapper.service';
import { AppStateStore } from '../../../store/app-state/app-state.store';
import { AuthService } from '../../../services/auth/auth.service';
export class BaseNavbarComponent {
    constructor(navigationStore, languageStore, userPreferenceStore, systemConfigStore, appState, authService, moduleNavigation, screenSize) {
        this.navigationStore = navigationStore;
        this.languageStore = languageStore;
        this.userPreferenceStore = userPreferenceStore;
        this.systemConfigStore = systemConfigStore;
        this.appState = appState;
        this.authService = authService;
        this.moduleNavigation = moduleNavigation;
        this.screenSize = screenSize;
        this.loaded = true;
        this.mainNavCollapse = true;
        this.subNavCollapse = true;
        this.mobileNavbar = false;
        this.mobileSubNav = false;
        this.backLink = false;
        this.mainNavLink = true;
        this.submenu = [];
        this.moduleNameMapper = new ModuleNameMapper(this.systemConfigStore);
        this.actionNameMapper = new ActionNameMapper(this.systemConfigStore);
        this.routeConverter = new RouteConverter(this.moduleNameMapper, this.actionNameMapper, this.systemConfigStore);
        this.navbar = new NavbarAbstract(this.routeConverter, this.moduleNavigation);
        this.maxTabs = 8;
        this.screen = ScreenSize.Medium;
        this.languages$ = this.languageStore.vm$;
        this.userPreferences$ = this.userPreferenceStore.userPreferences$;
        this.currentUser$ = this.authService.currentUser$;
        this.appState$ = this.appState.vm$;
        this.navigation$ = this.navigationStore.vm$;
        this.vm$ = combineLatest([
            this.navigation$,
            this.languages$,
            this.userPreferences$,
            this.currentUser$,
            this.appState$,
            this.screenSize.screenSize$
        ]).pipe(map(([navigation, languages, userPreferences, currentUser, appState, screenSize]) => {
            if (screenSize) {
                this.screen = screenSize;
            }
            this.calculateMaxTabs(navigation);
            this.navbar.build(navigation, languages, userPreferences, currentUser, appState, this.maxTabs);
            return {
                navigation, languages, userPreferences, appState
            };
        }));
        const navbar = new NavbarAbstract(this.routeConverter, this.moduleNavigation);
        this.setNavbar(navbar);
        BaseNavbarComponent.instances.push(this);
    }
    /**
     * Public API
     */
    /**
     * Reset component instance
     */
    static reset() {
        BaseNavbarComponent.instances.forEach((navbarComponent) => {
            navbarComponent.loaded = false;
            navbarComponent.navbar = new NavbarAbstract(navbarComponent.routeConverter, navbarComponent.moduleNavigation);
        });
    }
    onResize(event) {
        const innerWidth = event.target.innerWidth;
        this.mobileNavbar = innerWidth <= 768;
    }
    ngOnInit() {
        const navbar = new NavbarAbstract(this.routeConverter, this.moduleNavigation);
        this.setNavbar(navbar);
        this.authService.isUserLoggedIn.subscribe(value => {
            this.isUserLoggedIn = value;
        });
        window.dispatchEvent(new Event('resize'));
    }
    ngOnDestroy() {
        this.authService.isUserLoggedIn.unsubscribe();
    }
    /**
     * Change subnavigation
     *
     * @param {object} event triggered
     * @param {object} items
     */
    changeSubNav(event, items) {
        this.mobileSubNav = !this.mobileSubNav;
        this.backLink = !this.backLink;
        this.mainNavLink = !this.mainNavLink;
        this.submenu = items;
    }
    /**
     * Set link flags
     */
    navBackLink() {
        this.mobileSubNav = !this.mobileSubNav;
        this.backLink = !this.backLink;
        this.mainNavLink = !this.mainNavLink;
    }
    /**
     * Get home page
     *
     * @returns {string} homepage
     */
    getHomePage() {
        return this.systemConfigStore.getHomePage();
    }
    /**
     * Internal API
     */
    /**
     * Set navbar model
     *
     * @param {{}} navbar model
     */
    setNavbar(navbar) {
        this.navbar = navbar;
        this.loaded = true;
    }
    /**
     * Check if is loaded
     *
     * @returns {{boolean}} is loaded
     */
    isLoaded() {
        return this.loaded;
    }
    calculateMaxTabs(navigation) {
        const sizeMap = this.systemConfigStore.getConfigValue('navigation_tab_limits');
        if (this.screen && sizeMap) {
            let maxTabs = sizeMap[this.screen];
            if (!maxTabs || navigation.maxTabs && navigation.maxTabs < maxTabs) {
                maxTabs = navigation.maxTabs;
            }
            this.maxTabs = maxTabs;
        }
    }
    getCloseCallBack(myDrop) {
        return () => myDrop.close();
    }
}
BaseNavbarComponent.instances = [];
BaseNavbarComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-base-navbar',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<!-- Start of main navbar section -->\n\n<div *ngIf=\"(vm$ | async) as vm\" class=\"top-panel fixed-top\">\n\n    <!-- Start of empty navbar section until data is loaded -->\n\n    <ng-template [ngIf]=\"!loaded\">\n        <nav class=\"navbar navbar-expand-lg\">\n            <div class=\"navbar-collapse collapse order-4 order-md-0 collapsenav\">\n                <ul class=\"navbar-nav\">\n                    <li class=\"top-nav nav-item\">&nbsp;\n                    </li>\n                </ul>\n            </div>\n        </nav>\n    </ng-template>\n\n    <!-- End of empty  section until data is loaded -->\n\n    <!-- Start of empty navbar with logo -->\n\n    <ng-container *ngIf=\"loaded\">\n        <ng-container *ngIf=\"!this.isUserLoggedIn\">\n            <nav class=\"navbar ml-0 pl-0\">\n                <div class=\"navbar-collapse\">\n                    <ul class=\"navbar-nav\">\n                        <li class=\"pl-0\">\n                            <scrm-logo-ui></scrm-logo-ui>\n                        </li>\n                    </ul>\n                </div>\n            </nav>\n        </ng-container>\n\n        <!-- End of empty navbar section with logo -->\n\n        <!-- Start of mobile navigation section -->\n\n        <ng-container *ngIf=\"this.isUserLoggedIn && mobileNavbar\">\n            <ul class=\"navbar mobile-nav-block mobilenavbar\">\n                <div #myDrop=\"ngbDropdown\" [autoClose]=\"false\" class=\"position-static\" ngbDropdown>\n                    <button aria-controls=\"navbar\" aria-expanded=\"false\" aria-label=\"Toggle navigation\"\n                            class=\"navbar-toggler\"\n                            ngbDropdownToggle type=\"button\">\n                        <scrm-image class=\" responsive-menu-toggler\" image=\"hamburger\"></scrm-image>\n                    </button>\n                    <div [@mobileNavFade] class=\"mobile-nav-dropdown w-100\" ngbDropdownMenu>\n                        <ng-container *ngIf=\"navbar && navbar.menu && navbar.menu.length\">\n                            <scrm-mobile-menu [all]=\"navbar.all.modules\"\n                                              [current]=\"navbar.current\"\n                                              [items]=\"navbar.menu\"\n                                              [navigationType]=\"vm.userPreferences['navigation_paradigm'] || ''\"\n                                              [onClose]=\"getCloseCallBack(myDrop)\"\n                            >\n                            </scrm-mobile-menu>\n                        </ng-container>\n\n                    </div>\n                </div>\n                <div class=\"global-links\" ngbDropdown>\n                    <li (click)=\"myDrop.close()\" class=\"global-link-item\">\n                        <a #mobileGlobalLinkTitle class=\"nav-link primary-global-link dropdown-toggle\" ngbDropdownToggle>\n                            <scrm-image class=\"global-action-icon sicon-2x\" image=\"user\"></scrm-image>\n                            {{ navbar.currentUser.firstName }} {{navbar.currentUser.lastName}}\n                        </a>\n                        <div [style.min-width.px]=\"mobileGlobalLinkTitle.offsetWidth\" aria-labelledby=\"navbarDropdownMenuLink\"\n                             class=\"dropdown-menu global-links-dropdown\" ngbDropdownMenu>\n                            <ng-template [ngIf]=\"navbar.globalActions\">\n                                <a *ngFor=\"let globalAction of navbar.globalActions\"\n                                   class=\"dropdown-item global-links-sublink\"\n                                   href=\"{{ globalAction.link.url }}\"\n                                   ngbDropdownItem\n                                   target=\"{{ globalAction.link.target }}\">{{ globalAction.link.label }}\n                                </a>\n                            </ng-template>\n                            <scrm-logout-ui></scrm-logout-ui>\n                        </div>\n                    </li>\n                </div>\n            </ul>\n            <scrm-action-bar-ui></scrm-action-bar-ui>\n\n        </ng-container>\n\n        <!-- End of mobile navigation section-->\n\n        <!-- Start of navbar section with data once authenticated -->\n\n        <ng-container *ngIf=\"this.isUserLoggedIn && !mobileNavbar\">\n            <nav class=\"navbar navbar-expand-md navbar-1\">\n                <div [ngbCollapse]=\"mainNavCollapse\" class=\"navbar-collapse collapse collapsenav\">\n                    <scrm-home-menu-item\n                        [active]=\"vm.appState.module && vm.appState.module === 'home'\"\n                        [route]=\"getHomePage()\"\n                    ></scrm-home-menu-item>\n\n                    <!-- Navbar with grouped tabs -->\n\n                    <ng-container *ngIf=\"vm.userPreferences['navigation_paradigm'] == 'gm'\">\n\n                        <ul class=\"navbar-nav grouped\">\n\n                            <li *ngIf=\"navbar.current\" class=\"top-nav nav-item dropdown non-grouped active\">\n                                <scrm-menu-item [item]=\"navbar.current\" [languages]=\"vm.languages\"></scrm-menu-item>\n                            </li>\n\n                            <li *ngFor=\"let item of navbar.menu\" class=\"top-nav nav-item dropdown main-grouped\">\n                                <scrm-grouped-menu-item\n                                    [item]=\"item\"\n                                    [languages]=\"vm.languages\"\n                                    [subNavCollapse]=\"subNavCollapse\"\n                                >\n                                </scrm-grouped-menu-item>\n\n                            </li>\n                        </ul>\n\n                        <scrm-menu-items-list [items]=\"navbar.all.modules\"\n                                              [label]=\"vm.languages.appStrings['LBL_TABGROUP_ALL'] || ''\">\n                        </scrm-menu-items-list>\n\n                    </ng-container>\n\n\n                    <!-- END Navbar with grouped tabs -->\n\n                    <!-- Navbar with non-grouped tabs -->\n\n                    <ng-container *ngIf=\"vm.userPreferences['navigation_paradigm'] != 'gm'\">\n\n                        <ul class=\"navbar-nav\">\n                            <li *ngIf=\"navbar.current\" class=\"top-nav nav-item dropdown non-grouped active\">\n                                <scrm-menu-item [item]=\"navbar.current\" [languages]=\"vm.languages\"></scrm-menu-item>\n                            </li>\n                            <li *ngFor=\"let item of navbar.menu\" class=\"top-nav nav-item dropdown non-grouped\">\n                                <scrm-menu-item [item]=\"item\" [languages]=\"vm.languages\"></scrm-menu-item>\n                            </li>\n                        </ul>\n\n                        <scrm-menu-items-list [items]=\"navbar.all.modules\"\n                                              [label]=\"vm.languages.appStrings['LBL_MORE'] || ''\">\n                        </scrm-menu-items-list>\n\n                    </ng-container>\n\n                    <!-- END Navbar with non-grouped tabs -->\n\n                </div>\n\n\n                <!-- Global Links -->\n\n                <div class=\"global-links\" ngbDropdown>\n                    <ul class=\"navbar-nav\">\n                        <li class=\"global-link-item\">\n                            <a #globalLinkTitle class=\"nav-link primary-global-link dropdown-toggle\" ngbDropdownToggle>\n                                <scrm-image class=\"global-action-icon sicon-2x\" image=\"user\"></scrm-image>\n                                <span class=\"global-user-name\"> {{ navbar.currentUser.firstName }} {{navbar.currentUser.lastName}} </span>\n                            </a>\n                            <div [style.min-width.px]=\"globalLinkTitle.offsetWidth\" aria-labelledby=\"navbarDropdownMenuLink\"\n                                 class=\"dropdown-menu global-links-dropdown dropdown-menu-right\" ngbDropdownMenu>\n                                <ng-container *ngIf=\"navbar.globalActions\">\n                                    <a *ngFor=\"let globalAction of navbar.globalActions\"\n                                       class=\"dropdown-item global-links-sublink\"\n                                       href=\"{{ globalAction.link.url }}\"\n                                       ngbDropdownItem\n                                       target=\"{{ globalAction.link.target }}\">{{ globalAction.link.label }}\n                                    </a>\n                                </ng-container>\n                                <scrm-logout-ui></scrm-logout-ui>\n                            </div>\n                        </li>\n                    </ul>\n                </div>\n\n                <!-- END Global Links -->\n\n            </nav>\n\n            <!-- End of navbar section with data once authenticated -->\n\n            <scrm-action-bar-ui></scrm-action-bar-ui>\n        </ng-container>\n    </ng-container>\n</div>\n\n<!-- End of main navbar section -->\n",
                animations: [
                    trigger('mobileNavFade', [
                        transition(':enter', useAnimation(fadeIn, {
                            params: { timing: 0.5, delay: 0 }
                        })),
                    ])
                ]
            },] }
];
BaseNavbarComponent.ctorParameters = () => [
    { type: NavigationStore },
    { type: LanguageStore },
    { type: UserPreferenceStore },
    { type: SystemConfigStore },
    { type: AppStateStore },
    { type: AuthService },
    { type: ModuleNavigation },
    { type: ScreenSizeObserverService }
];
BaseNavbarComponent.propDecorators = {
    onResize: [{ type: HostListener, args: ['window:resize', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1uYXZiYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2NvbXBvbmVudHMvbmF2YmFyL2Jhc2UtbmF2YmFyL2Jhc2UtbmF2YmFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxhQUFhLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRW5DLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDRFQUE0RSxDQUFDO0FBQzVHLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGtEQUFrRCxDQUFDO0FBQ25GLE9BQU8sRUFBYSxlQUFlLEVBQUMsTUFBTSw0Q0FBNEMsQ0FBQztBQUN2RixPQUFPLEVBQW9CLG1CQUFtQixFQUFDLE1BQU0sc0RBQXNELENBQUM7QUFDNUcsT0FBTyxFQUNILFVBQVUsRUFDVix5QkFBeUIsRUFDNUIsTUFBTSx3RUFBd0UsQ0FBQztBQUNoRixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sc0VBQXNFLENBQUM7QUFDcEcsT0FBTyxFQUFDLGFBQWEsRUFBa0IsTUFBTSx3Q0FBd0MsQ0FBQztBQUN0RixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSwwRUFBMEUsQ0FBQztBQUMxRyxPQUFPLEVBQUMsZ0JB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LENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDL0UsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLE9BQU8sRUFBRTtZQUV4QixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxPQUFPLElBQUksVUFBVSxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUMsT0FBTyxHQUFHLE9BQU8sRUFBRTtnQkFDaEUsT0FBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUM7YUFDaEM7WUFFRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUMxQjtJQUNMLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxNQUFNO1FBQ25CLE9BQU8sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2hDLENBQUM7O0FBOUtnQiw2QkFBUyxHQUEwQixFQUFFLENBQUM7O1lBZDFELFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QiwyMVVBQTJDO2dCQUUzQyxVQUFVLEVBQUU7b0JBQ1IsT0FBTyxDQUFDLGVBQWUsRUFBRTt3QkFDckIsVUFBVSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsTUFBTSxFQUFFOzRCQUN0QyxNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUM7eUJBQ2xDLENBQUMsQ0FBQztxQkFDTixDQUFDO2lCQUNMO2FBQ0o7OztZQXpCbUIsZUFBZTtZQU8zQixhQUFhO1lBTk0sbUJBQW1CO1lBRnRDLGlCQUFpQjtZQVdQLGFBQWE7WUFDdkIsV0FBVztZQUhYLGdCQUFnQjtZQUpwQix5QkFBeUI7Ozt1QkE2R3hCLFlBQVksU0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBIb3N0TGlzdGVuZXIsIE9uRGVzdHJveSwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Y29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtOYXZiYXJNb2RlbH0gZnJvbSAnLi4vbmF2YmFyLW1vZGVsJztcbmltcG9ydCB7TmF2YmFyQWJzdHJhY3R9IGZyb20gJy4uL25hdmJhci5hYnN0cmFjdCc7XG5pbXBvcnQge3RyYW5zaXRpb24sIHRyaWdnZXIsIHVzZUFuaW1hdGlvbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge2ZhZGVJbn0gZnJvbSAnbmctYW5pbWF0ZSc7XG5pbXBvcnQge0FjdGlvbk5hbWVNYXBwZXJ9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24vYWN0aW9uLW5hbWUtbWFwcGVyL2FjdGlvbi1uYW1lLW1hcHBlci5zZXJ2aWNlJztcbmltcG9ydCB7U3lzdGVtQ29uZmlnU3RvcmV9IGZyb20gJy4uLy4uLy4uL3N0b3JlL3N5c3RlbS1jb25maWcvc3lzdGVtLWNvbmZpZy5zdG9yZSc7XG5pbXBvcnQge05hdmlnYXRpb24sIE5hdmlnYXRpb25TdG9yZX0gZnJvbSAnLi4vLi4vLi4vc3RvcmUvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLnN0b3JlJztcbmltcG9ydCB7VXNlclByZWZlcmVuY2VNYXAsIFVzZXJQcmVmZXJlbmNlU3RvcmV9IGZyb20gJy4uLy4uLy4uL3N0b3JlL3VzZXItcHJlZmVyZW5jZS91c2VyLXByZWZlcmVuY2Uuc3RvcmUnO1xuaW1wb3J0IHtcbiAgICBTY3JlZW5TaXplLFxuICAgIFNjcmVlblNpemVPYnNlcnZlclNlcnZpY2Vcbn0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvdWkvc2NyZWVuLXNpemUtb2JzZXJ2ZXIvc2NyZWVuLXNpemUtb2JzZXJ2ZXIuc2VydmljZSc7XG5pbXBvcnQge1JvdXRlQ29udmVydGVyfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uL3JvdXRlLWNvbnZlcnRlci9yb3V0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmUsIExhbmd1YWdlU3RyaW5nc30gZnJvbSAnLi4vLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtNb2R1bGVOYXZpZ2F0aW9ufSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uL21vZHVsZS1uYXZpZ2F0aW9uL21vZHVsZS1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHtNb2R1bGVOYW1lTWFwcGVyfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uL21vZHVsZS1uYW1lLW1hcHBlci9tb2R1bGUtbmFtZS1tYXBwZXIuc2VydmljZSc7XG5pbXBvcnQge0FwcFN0YXRlLCBBcHBTdGF0ZVN0b3JlfSBmcm9tICcuLi8uLi8uLi9zdG9yZS9hcHAtc3RhdGUvYXBwLXN0YXRlLnN0b3JlJztcbmltcG9ydCB7QXV0aFNlcnZpY2V9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2F1dGgvYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7TWVudUl0ZW19IGZyb20gJ2NvbW1vbic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1iYXNlLW5hdmJhcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2Jhc2UtbmF2YmFyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFtdLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcignbW9iaWxlTmF2RmFkZScsIFtcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJzplbnRlcicsIHVzZUFuaW1hdGlvbihmYWRlSW4sIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHt0aW1pbmc6IDAuNSwgZGVsYXk6IDB9XG4gICAgICAgICAgICB9KSksXG4gICAgICAgIF0pXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBCYXNlTmF2YmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBpbnN0YW5jZXM6IEJhc2VOYXZiYXJDb21wb25lbnRbXSA9IFtdO1xuXG4gICAgbG9hZGVkID0gdHJ1ZTtcbiAgICBpc1VzZXJMb2dnZWRJbjogYm9vbGVhbjtcblxuICAgIG1haW5OYXZDb2xsYXBzZSA9IHRydWU7XG4gICAgc3ViTmF2Q29sbGFwc2UgPSB0cnVlO1xuICAgIG1vYmlsZU5hdmJhciA9IGZhbHNlO1xuICAgIG1vYmlsZVN1Yk5hdiA9IGZhbHNlO1xuICAgIGJhY2tMaW5rID0gZmFsc2U7XG4gICAgbWFpbk5hdkxpbmsgPSB0cnVlO1xuICAgIHN1Ym1lbnU6IGFueSA9IFtdO1xuICAgIG1vZHVsZU5hbWVNYXBwZXIgPSBuZXcgTW9kdWxlTmFtZU1hcHBlcih0aGlzLnN5c3RlbUNvbmZpZ1N0b3JlKTtcbiAgICBhY3Rpb25OYW1lTWFwcGVyID0gbmV3IEFjdGlvbk5hbWVNYXBwZXIodGhpcy5zeXN0ZW1Db25maWdTdG9yZSk7XG4gICAgcm91dGVDb252ZXJ0ZXIgPSBuZXcgUm91dGVDb252ZXJ0ZXIodGhpcy5tb2R1bGVOYW1lTWFwcGVyLCB0aGlzLmFjdGlvbk5hbWVNYXBwZXIsIHRoaXMuc3lzdGVtQ29uZmlnU3RvcmUpO1xuICAgIG5hdmJhcjogTmF2YmFyTW9kZWwgPSBuZXcgTmF2YmFyQWJzdHJhY3QodGhpcy5yb3V0ZUNvbnZlcnRlciwgdGhpcy5tb2R1bGVOYXZpZ2F0aW9uKTtcbiAgICBtYXhUYWJzID0gODtcbiAgICBzY3JlZW46IFNjcmVlblNpemUgPSBTY3JlZW5TaXplLk1lZGl1bTtcblxuICAgIGxhbmd1YWdlcyQ6IE9ic2VydmFibGU8TGFuZ3VhZ2VTdHJpbmdzPiA9IHRoaXMubGFuZ3VhZ2VTdG9yZS52bSQ7XG4gICAgdXNlclByZWZlcmVuY2VzJDogT2JzZXJ2YWJsZTxVc2VyUHJlZmVyZW5jZU1hcD4gPSB0aGlzLnVzZXJQcmVmZXJlbmNlU3RvcmUudXNlclByZWZlcmVuY2VzJDtcbiAgICBjdXJyZW50VXNlciQ6IE9ic2VydmFibGU8YW55PiA9IHRoaXMuYXV0aFNlcnZpY2UuY3VycmVudFVzZXIkO1xuICAgIGFwcFN0YXRlJDogT2JzZXJ2YWJsZTxBcHBTdGF0ZT4gPSB0aGlzLmFwcFN0YXRlLnZtJDtcbiAgICBuYXZpZ2F0aW9uJDogT2JzZXJ2YWJsZTxOYXZpZ2F0aW9uPiA9IHRoaXMubmF2aWdhdGlvblN0b3JlLnZtJDtcblxuICAgIHZtJCA9IGNvbWJpbmVMYXRlc3QoW1xuICAgICAgICB0aGlzLm5hdmlnYXRpb24kLFxuICAgICAgICB0aGlzLmxhbmd1YWdlcyQsXG4gICAgICAgIHRoaXMudXNlclByZWZlcmVuY2VzJCxcbiAgICAgICAgdGhpcy5jdXJyZW50VXNlciQsXG4gICAgICAgIHRoaXMuYXBwU3RhdGUkLFxuICAgICAgICB0aGlzLnNjcmVlblNpemUuc2NyZWVuU2l6ZSRcbiAgICBdKS5waXBlKFxuICAgICAgICBtYXAoKFtuYXZpZ2F0aW9uLCBsYW5ndWFnZXMsIHVzZXJQcmVmZXJlbmNlcywgY3VycmVudFVzZXIsIGFwcFN0YXRlLCBzY3JlZW5TaXplXSkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoc2NyZWVuU2l6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NyZWVuID0gc2NyZWVuU2l6ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVNYXhUYWJzKG5hdmlnYXRpb24pO1xuXG4gICAgICAgICAgICB0aGlzLm5hdmJhci5idWlsZChcbiAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uLFxuICAgICAgICAgICAgICAgIGxhbmd1YWdlcyxcbiAgICAgICAgICAgICAgICB1c2VyUHJlZmVyZW5jZXMsXG4gICAgICAgICAgICAgICAgY3VycmVudFVzZXIsXG4gICAgICAgICAgICAgICAgYXBwU3RhdGUsXG4gICAgICAgICAgICAgICAgdGhpcy5tYXhUYWJzXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5hdmlnYXRpb24sIGxhbmd1YWdlcywgdXNlclByZWZlcmVuY2VzLCBhcHBTdGF0ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICApO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIG5hdmlnYXRpb25TdG9yZTogTmF2aWdhdGlvblN0b3JlLFxuICAgICAgICAgICAgICAgIHByb3RlY3RlZCBsYW5ndWFnZVN0b3JlOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICAgICAgICAgIHByb3RlY3RlZCB1c2VyUHJlZmVyZW5jZVN0b3JlOiBVc2VyUHJlZmVyZW5jZVN0b3JlLFxuICAgICAgICAgICAgICAgIHByb3RlY3RlZCBzeXN0ZW1Db25maWdTdG9yZTogU3lzdGVtQ29uZmlnU3RvcmUsXG4gICAgICAgICAgICAgICAgcHJvdGVjdGVkIGFwcFN0YXRlOiBBcHBTdGF0ZVN0b3JlLFxuICAgICAgICAgICAgICAgIHByb3RlY3RlZCBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJvdGVjdGVkIG1vZHVsZU5hdmlnYXRpb246IE1vZHVsZU5hdmlnYXRpb24sXG4gICAgICAgICAgICAgICAgcHJvdGVjdGVkIHNjcmVlblNpemU6IFNjcmVlblNpemVPYnNlcnZlclNlcnZpY2VcbiAgICApIHtcbiAgICAgICAgY29uc3QgbmF2YmFyID0gbmV3IE5hdmJhckFic3RyYWN0KHRoaXMucm91dGVDb252ZXJ0ZXIsIHRoaXMubW9kdWxlTmF2aWdhdGlvbik7XG4gICAgICAgIHRoaXMuc2V0TmF2YmFyKG5hdmJhcik7XG5cbiAgICAgICAgQmFzZU5hdmJhckNvbXBvbmVudC5pbnN0YW5jZXMucHVzaCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQdWJsaWMgQVBJXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBSZXNldCBjb21wb25lbnQgaW5zdGFuY2VcbiAgICAgKi9cbiAgICBzdGF0aWMgcmVzZXQoKTogdm9pZCB7XG4gICAgICAgIEJhc2VOYXZiYXJDb21wb25lbnQuaW5zdGFuY2VzLmZvckVhY2goKG5hdmJhckNvbXBvbmVudDogQmFzZU5hdmJhckNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgbmF2YmFyQ29tcG9uZW50LmxvYWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgbmF2YmFyQ29tcG9uZW50Lm5hdmJhciA9IG5ldyBOYXZiYXJBYnN0cmFjdChuYXZiYXJDb21wb25lbnQucm91dGVDb252ZXJ0ZXIsIG5hdmJhckNvbXBvbmVudC5tb2R1bGVOYXZpZ2F0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScsIFsnJGV2ZW50J10pXG4gICAgb25SZXNpemUoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgICAgICBjb25zdCBpbm5lcldpZHRoID0gZXZlbnQudGFyZ2V0LmlubmVyV2lkdGg7XG4gICAgICAgIHRoaXMubW9iaWxlTmF2YmFyID0gaW5uZXJXaWR0aCA8PSA3Njg7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5hdmJhciA9IG5ldyBOYXZiYXJBYnN0cmFjdCh0aGlzLnJvdXRlQ29udmVydGVyLCB0aGlzLm1vZHVsZU5hdmlnYXRpb24pO1xuICAgICAgICB0aGlzLnNldE5hdmJhcihuYXZiYXIpO1xuICAgICAgICB0aGlzLmF1dGhTZXJ2aWNlLmlzVXNlckxvZ2dlZEluLnN1YnNjcmliZSh2YWx1ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzVXNlckxvZ2dlZEluID0gdmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgncmVzaXplJykpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmF1dGhTZXJ2aWNlLmlzVXNlckxvZ2dlZEluLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHN1Ym5hdmlnYXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCB0cmlnZ2VyZWRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gaXRlbXNcbiAgICAgKi9cbiAgICBwdWJsaWMgY2hhbmdlU3ViTmF2KGV2ZW50OiBFdmVudCwgaXRlbXM6IE1lbnVJdGVtW10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tb2JpbGVTdWJOYXYgPSAhdGhpcy5tb2JpbGVTdWJOYXY7XG4gICAgICAgIHRoaXMuYmFja0xpbmsgPSAhdGhpcy5iYWNrTGluaztcbiAgICAgICAgdGhpcy5tYWluTmF2TGluayA9ICF0aGlzLm1haW5OYXZMaW5rO1xuICAgICAgICB0aGlzLnN1Ym1lbnUgPSBpdGVtcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgbGluayBmbGFnc1xuICAgICAqL1xuICAgIHB1YmxpYyBuYXZCYWNrTGluaygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tb2JpbGVTdWJOYXYgPSAhdGhpcy5tb2JpbGVTdWJOYXY7XG4gICAgICAgIHRoaXMuYmFja0xpbmsgPSAhdGhpcy5iYWNrTGluaztcbiAgICAgICAgdGhpcy5tYWluTmF2TGluayA9ICF0aGlzLm1haW5OYXZMaW5rO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBob21lIHBhZ2VcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGhvbWVwYWdlXG4gICAgICovXG4gICAgcHVibGljIGdldEhvbWVQYWdlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5c3RlbUNvbmZpZ1N0b3JlLmdldEhvbWVQYWdlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgQVBJXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBTZXQgbmF2YmFyIG1vZGVsXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3t9fSBuYXZiYXIgbW9kZWxcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2V0TmF2YmFyKG5hdmJhcjogTmF2YmFyTW9kZWwpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5uYXZiYXIgPSBuYXZiYXI7XG4gICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBpcyBsb2FkZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHt7Ym9vbGVhbn19IGlzIGxvYWRlZFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpc0xvYWRlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZGVkO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBjYWxjdWxhdGVNYXhUYWJzKG5hdmlnYXRpb246IE5hdmlnYXRpb24pOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc2l6ZU1hcCA9IHRoaXMuc3lzdGVtQ29uZmlnU3RvcmUuZ2V0Q29uZmlnVmFsdWUoJ25hdmlnYXRpb25fdGFiX2xpbWl0cycpO1xuICAgICAgICBpZiAodGhpcy5zY3JlZW4gJiYgc2l6ZU1hcCkge1xuXG4gICAgICAgICAgICBsZXQgbWF4VGFicyA9IHNpemVNYXBbdGhpcy5zY3JlZW5dO1xuICAgICAgICAgICAgaWYgKCFtYXhUYWJzIHx8IG5hdmlnYXRpb24ubWF4VGFicyAmJiBuYXZpZ2F0aW9uLm1heFRhYnMgPCBtYXhUYWJzKSB7XG4gICAgICAgICAgICAgICAgbWF4VGFicyA9IG5hdmlnYXRpb24ubWF4VGFicztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYXhUYWJzID0gbWF4VGFicztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldENsb3NlQ2FsbEJhY2sobXlEcm9wKTogRnVuY3Rpb24ge1xuICAgICAgICByZXR1cm4gKCkgPT4gbXlEcm9wLmNsb3NlKCk7XG4gICAgfVxufVxuIl19