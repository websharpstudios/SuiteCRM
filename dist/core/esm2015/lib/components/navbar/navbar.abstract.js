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
import { LogoAbstract } from '../logo/logo-abstract';
import { ready } from 'common';
import { LinkTarget } from './link-target';
export class NavbarAbstract {
    /**
     * Public API
     */
    constructor(routeConverter, moduleNavigation) {
        this.routeConverter = routeConverter;
        this.moduleNavigation = moduleNavigation;
        this.authenticated = true;
        this.logo = new LogoAbstract();
        this.useGroupTabs = false;
        this.globalActions = [];
        this.currentUser = {
            id: '',
            firstName: '',
            lastName: '',
        };
        this.all = {
            modules: [],
            extra: [],
        };
        this.menu = [];
    }
    /**
     * Reset menus
     */
    resetMenu() {
        this.menu = [];
        this.globalActions = [];
        this.all.modules = [];
        this.all.extra = [];
        this.current = null;
        this.currentUser = {};
    }
    /**
     * Build user action menu
     *
     * @param {object} appStrings map
     * @param {[]} userActionMenu info
     * @param {object} currentUser info
     */
    buildUserActionMenu(appStrings, userActionMenu, currentUser) {
        this.currentUser.id = currentUser.id;
        this.currentUser.firstName = currentUser.firstName;
        this.currentUser.lastName = currentUser.lastName;
        if (userActionMenu) {
            userActionMenu.forEach((subMenu) => {
                const name = subMenu.name;
                let url = subMenu.url;
                if (name === 'logout') {
                    return;
                }
                let target = LinkTarget.none;
                if (name === 'training') {
                    target = LinkTarget.blank;
                }
                else {
                    url = this.routeConverter.toFrontEndLink(url);
                }
                const label = appStrings[subMenu.labelKey];
                this.globalActions.push({
                    link: {
                        url,
                        label,
                        target
                    },
                });
            });
        }
        return;
    }
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
    build(navigation, language, userPreferences, currentUser, appState, maxTabs) {
        this.resetMenu();
        if (!ready([language.appStrings, language.modStrings, language.appListStrings, userPreferences, currentUser])) {
            return;
        }
        this.buildUserActionMenu(language.appStrings, navigation.userActionMenu, currentUser);
        const navigationParadigm = userPreferences.navigation_paradigm.toString();
        const sort = userPreferences.sort_modules_by_name.toString() === 'on';
        if (navigationParadigm === 'm') {
            this.buildModuleNavigation(navigation, language, appState, maxTabs, sort);
            return;
        }
        if (navigationParadigm === 'gm') {
            this.buildGroupedNavigation(navigation, language, appState, maxTabs, sort);
            return;
        }
    }
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
    buildGroupTabMenu(items, modules, languages, threshold, groupedTabs, sort) {
        const navItems = [];
        const moreItems = [];
        if (items && items.length > 0) {
            items.forEach((module) => {
                moreItems.push(this.buildTabMenuItem(module, modules[module], languages));
            });
            if (sort) {
                this.sortMenuItems(moreItems);
            }
        }
        let count = 0;
        groupedTabs.forEach((groupedTab) => {
            if (count <= threshold) {
                navItems.push(this.buildTabGroupedMenuItem(groupedTab.labelKey, groupedTab.modules, modules, languages, sort));
            }
            count++;
        });
        this.menu = navItems;
        this.all.modules = moreItems;
    }
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
    buildModuleNavigation(navigation, languages, appState, maxTabs, sort) {
        if (!ready([navigation.tabs, navigation.modules])) {
            return;
        }
        this.buildTabMenu(navigation.tabs, navigation.modules, languages, maxTabs, appState, sort);
        this.buildSelectedModule(navigation, languages, appState);
    }
    /**
     * Build grouped navigation
     *
     * @param {object} navigation info
     * @param {object} languages map
     * @param {object} appState info
     * @param {number} maxTabs to use
     * @param {boolean} sort flag
     */
    buildGroupedNavigation(navigation, languages, appState, maxTabs, sort) {
        if (!ready([navigation.tabs, navigation.modules, navigation.groupedTabs])) {
            return;
        }
        this.buildGroupTabMenu(navigation.tabs, navigation.modules, languages, maxTabs, navigation.groupedTabs, sort);
        this.buildSelectedModule(navigation, languages, appState);
    }
    /**
     * Build selected module
     *
     * @param {object} navigation info
     * @param {object} languages map
     * @param {object} appState info
     */
    buildSelectedModule(navigation, languages, appState) {
        if (!appState || !appState.module || appState.module === 'home') {
            return;
        }
        const module = appState.module;
        if (!navigation.modules[module]) {
            return;
        }
        this.current = this.buildTabMenuItem(module, navigation.modules[module], languages);
    }
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
    buildTabMenu(items, modules, languages, threshold, appState, sort) {
        const navItems = [];
        const moreItems = [];
        if (!items || items.length === 0) {
            this.menu = navItems;
            this.all.modules = moreItems;
            return;
        }
        let count = 0;
        items.forEach((module) => {
            const item = this.buildTabMenuItem(module, modules[module], languages);
            if (module === 'home' || appState.module === module || count >= threshold) {
                moreItems.push(item);
            }
            else {
                navItems.push(item);
            }
            count++;
        });
        if (sort) {
            this.sortMenuItems(navItems);
            this.sortMenuItems(moreItems);
        }
        this.menu = navItems;
        this.all.modules = moreItems;
    }
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
    buildTabGroupedMenuItem(moduleLabel, groupedModules, modules, languages, sort) {
        return {
            link: {
                label: (languages.appStrings && languages.appStrings[moduleLabel]) || moduleLabel,
                url: '',
                route: null,
                params: null
            },
            icon: '',
            submenu: this.buildGroupedMenu(groupedModules, modules, languages, sort)
        };
    }
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
    buildGroupedMenu(groupedModules, modules, languages, sort) {
        const groupedItems = [];
        let homeMenuItem = null;
        groupedModules.forEach((groupedModule) => {
            const module = modules[groupedModule];
            if (!module) {
                return;
            }
            const moduleMenuItem = this.buildTabMenuItem(groupedModule, module, languages);
            if (groupedModule === 'home') {
                homeMenuItem = moduleMenuItem;
                return;
            }
            groupedItems.push(moduleMenuItem);
        });
        if (sort) {
            this.sortMenuItems(groupedItems);
        }
        if (homeMenuItem) {
            groupedItems.unshift(homeMenuItem);
        }
        return groupedItems;
    }
    /**
     * Build module menu items
     *
     * @param {string} module name
     * @param {object} moduleInfo info
     * @param {object} languages object
     *
     * @returns {object} menuItem
     */
    buildTabMenuItem(module, moduleInfo, languages) {
        const moduleRoute = this.moduleNavigation.getModuleRoute(moduleInfo);
        const menuItem = {
            link: {
                label: this.moduleNavigation.getModuleLabel(moduleInfo, languages.appListStrings),
                url: moduleRoute.url,
                route: moduleRoute.route,
                params: null
            },
            icon: (module === 'home') ? 'home' : '',
            submenu: []
        };
        if (moduleInfo) {
            moduleInfo.menu.forEach((subMenu) => {
                const moduleActionRoute = this.moduleNavigation.getActionRoute(subMenu);
                menuItem.submenu.push({
                    link: {
                        label: this.moduleNavigation.getActionLabel(module, subMenu, languages),
                        url: moduleActionRoute.url,
                        route: moduleActionRoute.route,
                        params: moduleActionRoute.params
                    },
                    icon: subMenu.icon,
                    submenu: []
                });
            });
        }
        return menuItem;
    }
    /**
     * Sort menu items by label
     *
     * @param {object} navItems to sort
     */
    sortMenuItems(navItems) {
        navItems.sort((a, b) => {
            const nameA = a.link.label.toUpperCase(); // ignore upper and lowercase
            const nameB = b.link.label.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2YmFyLmFic3RyYWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2NvbXBvbmVudHMvbmF2YmFyL25hdmJhci5hYnN0cmFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBR0gsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBR25ELE9BQU8sRUFBVyxLQUFLLEVBQU8sTUFBTSxRQUFRLENBQUM7QUFTN0MsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQU16QyxNQUFNLE9BQU8sY0FBYztJQWlCdkI7O09BRUc7SUFFSCxZQUNZLGNBQThCLEVBQzVCLGdCQUFrQztRQURwQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDNUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQXRCaEQsa0JBQWEsR0FBRyxJQUFJLENBQUM7UUFDckIsU0FBSSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDMUIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDckIsa0JBQWEsR0FBc0IsRUFBRSxDQUFDO1FBQ3RDLGdCQUFXLEdBQXFCO1lBQzVCLEVBQUUsRUFBRSxFQUFFO1lBQ04sU0FBUyxFQUFFLEVBQUU7WUFDYixRQUFRLEVBQUUsRUFBRTtTQUNmLENBQUM7UUFDRixRQUFHLEdBQUc7WUFDRixPQUFPLEVBQUUsRUFBRTtZQUNYLEtBQUssRUFBRSxFQUFFO1NBQ1osQ0FBQztRQUNGLFNBQUksR0FBZSxFQUFFLENBQUM7SUFXdEIsQ0FBQztJQUVEOztPQUVHO0lBQ0ksU0FBUztRQUNaLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FB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LENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDO3dCQUN2RSxHQUFHLEVBQUUsaUJBQWlCLENBQUMsR0FBRzt3QkFDMUIsS0FBSyxFQUFFLGlCQUFpQixDQUFDLEtBQUs7d0JBQzlCLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxNQUFNO3FCQUNuQztvQkFDRCxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7b0JBQ2xCLE9BQU8sRUFBRSxFQUFFO2lCQUNkLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1NBQ047UUFFRCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNPLGFBQWEsQ0FBQyxRQUFlO1FBQ25DLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFXLEVBQUUsQ0FBVyxFQUFFLEVBQUU7WUFFdkMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyw2QkFBNkI7WUFDdkUsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyw2QkFBNkI7WUFFdkUsSUFBSSxLQUFLLEdBQUcsS0FBSyxFQUFFO2dCQUNmLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDYjtZQUNELElBQUksS0FBSyxHQUFHLEtBQUssRUFBRTtnQkFDZixPQUFPLENBQUMsQ0FBQzthQUNaO1lBRUQsc0JBQXNCO1lBQ3RCLE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7TmF2YmFyTW9kZWx9IGZyb20gJy4vbmF2YmFyLW1vZGVsJztcbmltcG9ydCB7TG9nb0Fic3RyYWN0fSBmcm9tICcuLi9sb2dvL2xvZ28tYWJzdHJhY3QnO1xuaW1wb3J0IHtDdXJyZW50VXNlck1vZGVsfSBmcm9tICcuL2N1cnJlbnQtdXNlci1tb2RlbCc7XG5pbXBvcnQge0FjdGlvbkxpbmtNb2RlbH0gZnJvbSAnLi9hY3Rpb24tbGluay1tb2RlbCc7XG5pbXBvcnQge01lbnVJdGVtLCByZWFkeSwgVXNlcn0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7TGFuZ3VhZ2VTdHJpbmdNYXAsIExhbmd1YWdlU3RyaW5nc30gZnJvbSAnLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtcbiAgICBHcm91cGVkVGFiLFxuICAgIE5hdmJhck1vZHVsZSxcbiAgICBOYXZiYXJNb2R1bGVNYXAsXG4gICAgTmF2aWdhdGlvbixcbiAgICBVc2VyQWN0aW9uTWVudVxufSBmcm9tICcuLi8uLi9zdG9yZS9uYXZpZ2F0aW9uL25hdmlnYXRpb24uc3RvcmUnO1xuaW1wb3J0IHtMaW5rVGFyZ2V0fSBmcm9tICcuL2xpbmstdGFyZ2V0JztcbmltcG9ydCB7Um91dGVDb252ZXJ0ZXJ9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24vcm91dGUtY29udmVydGVyL3JvdXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7VXNlclByZWZlcmVuY2VNYXB9IGZyb20gJy4uLy4uL3N0b3JlL3VzZXItcHJlZmVyZW5jZS91c2VyLXByZWZlcmVuY2Uuc3RvcmUnO1xuaW1wb3J0IHtNb2R1bGVOYXZpZ2F0aW9ufSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uL21vZHVsZS1uYXZpZ2F0aW9uL21vZHVsZS1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHtBcHBTdGF0ZX0gZnJvbSAnLi4vLi4vc3RvcmUvYXBwLXN0YXRlL2FwcC1zdGF0ZS5zdG9yZSc7XG5cbmV4cG9ydCBjbGFzcyBOYXZiYXJBYnN0cmFjdCBpbXBsZW1lbnRzIE5hdmJhck1vZGVsIHtcbiAgICBhdXRoZW50aWNhdGVkID0gdHJ1ZTtcbiAgICBsb2dvID0gbmV3IExvZ29BYnN0cmFjdCgpO1xuICAgIHVzZUdyb3VwVGFicyA9IGZhbHNlO1xuICAgIGdsb2JhbEFjdGlvbnM6IEFjdGlvbkxpbmtNb2RlbFtdID0gW107XG4gICAgY3VycmVudFVzZXI6IEN1cnJlbnRVc2VyTW9kZWwgPSB7XG4gICAgICAgIGlkOiAnJyxcbiAgICAgICAgZmlyc3ROYW1lOiAnJyxcbiAgICAgICAgbGFzdE5hbWU6ICcnLFxuICAgIH07XG4gICAgYWxsID0ge1xuICAgICAgICBtb2R1bGVzOiBbXSxcbiAgICAgICAgZXh0cmE6IFtdLFxuICAgIH07XG4gICAgbWVudTogTWVudUl0ZW1bXSA9IFtdO1xuICAgIGN1cnJlbnQ/OiBNZW51SXRlbTtcblxuICAgIC8qKlxuICAgICAqIFB1YmxpYyBBUElcbiAgICAgKi9cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJvdXRlQ29udmVydGVyOiBSb3V0ZUNvbnZlcnRlcixcbiAgICAgICAgcHJvdGVjdGVkIG1vZHVsZU5hdmlnYXRpb246IE1vZHVsZU5hdmlnYXRpb25cbiAgICApIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldCBtZW51c1xuICAgICAqL1xuICAgIHB1YmxpYyByZXNldE1lbnUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubWVudSA9IFtdO1xuICAgICAgICB0aGlzLmdsb2JhbEFjdGlvbnMgPSBbXTtcbiAgICAgICAgdGhpcy5hbGwubW9kdWxlcyA9IFtdO1xuICAgICAgICB0aGlzLmFsbC5leHRyYSA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0ge30gYXMgVXNlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCB1c2VyIGFjdGlvbiBtZW51XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gYXBwU3RyaW5ncyBtYXBcbiAgICAgKiBAcGFyYW0ge1tdfSB1c2VyQWN0aW9uTWVudSBpbmZvXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGN1cnJlbnRVc2VyIGluZm9cbiAgICAgKi9cbiAgICBwdWJsaWMgYnVpbGRVc2VyQWN0aW9uTWVudShcbiAgICAgICAgYXBwU3RyaW5nczogTGFuZ3VhZ2VTdHJpbmdNYXAsXG4gICAgICAgIHVzZXJBY3Rpb25NZW51OiBVc2VyQWN0aW9uTWVudVtdLFxuICAgICAgICBjdXJyZW50VXNlcjogQ3VycmVudFVzZXJNb2RlbFxuICAgICk6IHZvaWQge1xuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyLmlkID0gY3VycmVudFVzZXIuaWQ7XG4gICAgICAgIHRoaXMuY3VycmVudFVzZXIuZmlyc3ROYW1lID0gY3VycmVudFVzZXIuZmlyc3ROYW1lO1xuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyLmxhc3ROYW1lID0gY3VycmVudFVzZXIubGFzdE5hbWU7XG5cbiAgICAgICAgaWYgKHVzZXJBY3Rpb25NZW51KSB7XG4gICAgICAgICAgICB1c2VyQWN0aW9uTWVudS5mb3JFYWNoKChzdWJNZW51KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IHN1Yk1lbnUubmFtZTtcbiAgICAgICAgICAgICAgICBsZXQgdXJsID0gc3ViTWVudS51cmw7XG5cbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2xvZ291dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXQgPSBMaW5rVGFyZ2V0Lm5vbmU7XG5cbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ3RyYWluaW5nJykge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSBMaW5rVGFyZ2V0LmJsYW5rO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IHRoaXMucm91dGVDb252ZXJ0ZXIudG9Gcm9udEVuZExpbmsodXJsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBsYWJlbCA9IGFwcFN0cmluZ3Nbc3ViTWVudS5sYWJlbEtleV07XG5cbiAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbEFjdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGxpbms6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgbmF2YmFyXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbmF2aWdhdGlvbiBpbmZvXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGxhbmd1YWdlIG1hcFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB1c2VyUHJlZmVyZW5jZXMgaW5mb1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjdXJyZW50VXNlciBpbmZvXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGFwcFN0YXRlIGluZm9cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4VGFicyB0byBkaXNwbGF5XG4gICAgICovXG4gICAgcHVibGljIGJ1aWxkKFxuICAgICAgICBuYXZpZ2F0aW9uOiBOYXZpZ2F0aW9uLFxuICAgICAgICBsYW5ndWFnZTogTGFuZ3VhZ2VTdHJpbmdzLFxuICAgICAgICB1c2VyUHJlZmVyZW5jZXM6IFVzZXJQcmVmZXJlbmNlTWFwLFxuICAgICAgICBjdXJyZW50VXNlcjogQ3VycmVudFVzZXJNb2RlbCxcbiAgICAgICAgYXBwU3RhdGU6IEFwcFN0YXRlLFxuICAgICAgICBtYXhUYWJzOiBudW1iZXJcbiAgICApOiB2b2lkIHtcblxuICAgICAgICB0aGlzLnJlc2V0TWVudSgpO1xuXG4gICAgICAgIGlmICghcmVhZHkoW2xhbmd1YWdlLmFwcFN0cmluZ3MsIGxhbmd1YWdlLm1vZFN0cmluZ3MsIGxhbmd1YWdlLmFwcExpc3RTdHJpbmdzLCB1c2VyUHJlZmVyZW5jZXMsIGN1cnJlbnRVc2VyXSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYnVpbGRVc2VyQWN0aW9uTWVudShsYW5ndWFnZS5hcHBTdHJpbmdzLCBuYXZpZ2F0aW9uLnVzZXJBY3Rpb25NZW51LCBjdXJyZW50VXNlcik7XG5cbiAgICAgICAgY29uc3QgbmF2aWdhdGlvblBhcmFkaWdtID0gdXNlclByZWZlcmVuY2VzLm5hdmlnYXRpb25fcGFyYWRpZ20udG9TdHJpbmcoKTtcbiAgICAgICAgY29uc3Qgc29ydCA9IHVzZXJQcmVmZXJlbmNlcy5zb3J0X21vZHVsZXNfYnlfbmFtZS50b1N0cmluZygpID09PSAnb24nO1xuXG4gICAgICAgIGlmIChuYXZpZ2F0aW9uUGFyYWRpZ20gPT09ICdtJykge1xuICAgICAgICAgICAgdGhpcy5idWlsZE1vZHVsZU5hdmlnYXRpb24obmF2aWdhdGlvbiwgbGFuZ3VhZ2UsIGFwcFN0YXRlLCBtYXhUYWJzLCBzb3J0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuYXZpZ2F0aW9uUGFyYWRpZ20gPT09ICdnbScpIHtcbiAgICAgICAgICAgIHRoaXMuYnVpbGRHcm91cGVkTmF2aWdhdGlvbihuYXZpZ2F0aW9uLCBsYW5ndWFnZSwgYXBwU3RhdGUsIG1heFRhYnMsIHNvcnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgR3JvdXAgdGFiIG1lbnVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7W119IGl0ZW1zIGxpc3RcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbW9kdWxlcyBpbmZvXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGxhbmd1YWdlcyBtYXBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGhyZXNob2xkIGxpbWl0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGdyb3VwZWRUYWJzIGluZm9cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNvcnQgZmxhZ1xuICAgICAqL1xuICAgIHB1YmxpYyBidWlsZEdyb3VwVGFiTWVudShcbiAgICAgICAgaXRlbXM6IHN0cmluZ1tdLFxuICAgICAgICBtb2R1bGVzOiBOYXZiYXJNb2R1bGVNYXAsXG4gICAgICAgIGxhbmd1YWdlczogTGFuZ3VhZ2VTdHJpbmdzLFxuICAgICAgICB0aHJlc2hvbGQ6IG51bWJlcixcbiAgICAgICAgZ3JvdXBlZFRhYnM6IEdyb3VwZWRUYWJbXSxcbiAgICAgICAgc29ydDogYm9vbGVhblxuICAgICk6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IG5hdkl0ZW1zID0gW107XG4gICAgICAgIGNvbnN0IG1vcmVJdGVtcyA9IFtdO1xuXG4gICAgICAgIGlmIChpdGVtcyAmJiBpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKChtb2R1bGUpID0+IHtcbiAgICAgICAgICAgICAgICBtb3JlSXRlbXMucHVzaCh0aGlzLmJ1aWxkVGFiTWVudUl0ZW0obW9kdWxlLCBtb2R1bGVzW21vZHVsZV0sIGxhbmd1YWdlcykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChzb3J0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb3J0TWVudUl0ZW1zKG1vcmVJdGVtcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBncm91cGVkVGFicy5mb3JFYWNoKChncm91cGVkVGFiOiBhbnkpID0+IHtcblxuICAgICAgICAgICAgaWYgKGNvdW50IDw9IHRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgIG5hdkl0ZW1zLnB1c2godGhpcy5idWlsZFRhYkdyb3VwZWRNZW51SXRlbShcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBlZFRhYi5sYWJlbEtleSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBlZFRhYi5tb2R1bGVzLFxuICAgICAgICAgICAgICAgICAgICBtb2R1bGVzLFxuICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZXMsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRcbiAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5tZW51ID0gbmF2SXRlbXM7XG4gICAgICAgIHRoaXMuYWxsLm1vZHVsZXMgPSBtb3JlSXRlbXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBJbnRlcm5hbCBBUElcbiAgICAgKlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQnVpbGQgbW9kdWxlIG5hdmlnYXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBuYXZpZ2F0aW9uIGluZm9cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbGFuZ3VhZ2VzIG1hcFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhcHBTdGF0ZSBpbmZvXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heFRhYnMgdG8gdXNlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBzb3J0IGZsYWdcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYnVpbGRNb2R1bGVOYXZpZ2F0aW9uKFxuICAgICAgICBuYXZpZ2F0aW9uOiBOYXZpZ2F0aW9uLFxuICAgICAgICBsYW5ndWFnZXM6IExhbmd1YWdlU3RyaW5ncyxcbiAgICAgICAgYXBwU3RhdGU6IEFwcFN0YXRlLFxuICAgICAgICBtYXhUYWJzOiBudW1iZXIsXG4gICAgICAgIHNvcnQ6IGJvb2xlYW5cbiAgICApOiB2b2lkIHtcblxuICAgICAgICBpZiAoIXJlYWR5KFtuYXZpZ2F0aW9uLnRhYnMsIG5hdmlnYXRpb24ubW9kdWxlc10pKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJ1aWxkVGFiTWVudShuYXZpZ2F0aW9uLnRhYnMsIG5hdmlnYXRpb24ubW9kdWxlcywgbGFuZ3VhZ2VzLCBtYXhUYWJzLCBhcHBTdGF0ZSwgc29ydCk7XG4gICAgICAgIHRoaXMuYnVpbGRTZWxlY3RlZE1vZHVsZShuYXZpZ2F0aW9uLCBsYW5ndWFnZXMsIGFwcFN0YXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBncm91cGVkIG5hdmlnYXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBuYXZpZ2F0aW9uIGluZm9cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbGFuZ3VhZ2VzIG1hcFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhcHBTdGF0ZSBpbmZvXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heFRhYnMgdG8gdXNlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBzb3J0IGZsYWdcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYnVpbGRHcm91cGVkTmF2aWdhdGlvbihcbiAgICAgICAgbmF2aWdhdGlvbjogTmF2aWdhdGlvbixcbiAgICAgICAgbGFuZ3VhZ2VzOiBMYW5ndWFnZVN0cmluZ3MsXG4gICAgICAgIGFwcFN0YXRlOiBBcHBTdGF0ZSxcbiAgICAgICAgbWF4VGFiczogbnVtYmVyLFxuICAgICAgICBzb3J0OiBib29sZWFuXG4gICAgKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKCFyZWFkeShbbmF2aWdhdGlvbi50YWJzLCBuYXZpZ2F0aW9uLm1vZHVsZXMsIG5hdmlnYXRpb24uZ3JvdXBlZFRhYnNdKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5idWlsZEdyb3VwVGFiTWVudShuYXZpZ2F0aW9uLnRhYnMsIG5hdmlnYXRpb24ubW9kdWxlcywgbGFuZ3VhZ2VzLCBtYXhUYWJzLCBuYXZpZ2F0aW9uLmdyb3VwZWRUYWJzLCBzb3J0KTtcbiAgICAgICAgdGhpcy5idWlsZFNlbGVjdGVkTW9kdWxlKG5hdmlnYXRpb24sIGxhbmd1YWdlcywgYXBwU3RhdGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHNlbGVjdGVkIG1vZHVsZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG5hdmlnYXRpb24gaW5mb1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsYW5ndWFnZXMgbWFwXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGFwcFN0YXRlIGluZm9cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYnVpbGRTZWxlY3RlZE1vZHVsZShuYXZpZ2F0aW9uOiBOYXZpZ2F0aW9uLCBsYW5ndWFnZXM6IExhbmd1YWdlU3RyaW5ncywgYXBwU3RhdGU6IEFwcFN0YXRlKTogdm9pZCB7XG4gICAgICAgIGlmICghYXBwU3RhdGUgfHwgIWFwcFN0YXRlLm1vZHVsZSB8fCBhcHBTdGF0ZS5tb2R1bGUgPT09ICdob21lJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbW9kdWxlID0gYXBwU3RhdGUubW9kdWxlO1xuXG4gICAgICAgIGlmICghbmF2aWdhdGlvbi5tb2R1bGVzW21vZHVsZV0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMuYnVpbGRUYWJNZW51SXRlbShtb2R1bGUsIG5hdmlnYXRpb24ubW9kdWxlc1ttb2R1bGVdLCBsYW5ndWFnZXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRhYiAvIG1vZHVsZSBtZW51XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1tdfSBpdGVtcyBsaXN0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IG1vZHVsZXMgaW5mb1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsYW5ndWFnZXMgbWFwXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRocmVzaG9sZCBsaW1pdFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhcHBTdGF0ZSBpbmZvXG4gICAgICogQHBhcmFtIHtib29sZWFufSBzb3J0IGZsYWdcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYnVpbGRUYWJNZW51KFxuICAgICAgICBpdGVtczogc3RyaW5nW10sXG4gICAgICAgIG1vZHVsZXM6IE5hdmJhck1vZHVsZU1hcCxcbiAgICAgICAgbGFuZ3VhZ2VzOiBMYW5ndWFnZVN0cmluZ3MsXG4gICAgICAgIHRocmVzaG9sZDogbnVtYmVyLFxuICAgICAgICBhcHBTdGF0ZTogQXBwU3RhdGUsXG4gICAgICAgIHNvcnQ6IGJvb2xlYW5cbiAgICApOiB2b2lkIHtcblxuICAgICAgICBjb25zdCBuYXZJdGVtcyA9IFtdO1xuICAgICAgICBjb25zdCBtb3JlSXRlbXMgPSBbXTtcblxuICAgICAgICBpZiAoIWl0ZW1zIHx8IGl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5tZW51ID0gbmF2SXRlbXM7XG4gICAgICAgICAgICB0aGlzLmFsbC5tb2R1bGVzID0gbW9yZUl0ZW1zO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgobW9kdWxlOiBzdHJpbmcpID0+IHtcblxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuYnVpbGRUYWJNZW51SXRlbShtb2R1bGUsIG1vZHVsZXNbbW9kdWxlXSwgbGFuZ3VhZ2VzKTtcblxuICAgICAgICAgICAgaWYgKG1vZHVsZSA9PT0gJ2hvbWUnIHx8IGFwcFN0YXRlLm1vZHVsZSA9PT0gbW9kdWxlIHx8IGNvdW50ID49IHRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgIG1vcmVJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuYXZJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoc29ydCkge1xuICAgICAgICAgICAgdGhpcy5zb3J0TWVudUl0ZW1zKG5hdkl0ZW1zKTtcbiAgICAgICAgICAgIHRoaXMuc29ydE1lbnVJdGVtcyhtb3JlSXRlbXMpO1xuICAgICAgICB9XG5cblxuICAgICAgICB0aGlzLm1lbnUgPSBuYXZJdGVtcztcbiAgICAgICAgdGhpcy5hbGwubW9kdWxlcyA9IG1vcmVJdGVtcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBHcm91cGVkIFRhYiBtZW51IGl0ZW1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2R1bGVMYWJlbCB0byBkaXNwbGF5XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGdyb3VwZWRNb2R1bGVzIGxpc3RcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbW9kdWxlcyBsaXN0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGxhbmd1YWdlcyBtYXBcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNvcnQgZmxhZ1xuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gZ3JvdXAgdGFiIG1lbnUgaXRlbVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBidWlsZFRhYkdyb3VwZWRNZW51SXRlbShcbiAgICAgICAgbW9kdWxlTGFiZWw6IHN0cmluZyxcbiAgICAgICAgZ3JvdXBlZE1vZHVsZXM6IGFueVtdLFxuICAgICAgICBtb2R1bGVzOiBOYXZiYXJNb2R1bGVNYXAsXG4gICAgICAgIGxhbmd1YWdlczogTGFuZ3VhZ2VTdHJpbmdzLFxuICAgICAgICBzb3J0OiBib29sZWFuXG4gICAgKTogYW55IHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGluazoge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAobGFuZ3VhZ2VzLmFwcFN0cmluZ3MgJiYgbGFuZ3VhZ2VzLmFwcFN0cmluZ3NbbW9kdWxlTGFiZWxdKSB8fCBtb2R1bGVMYWJlbCxcbiAgICAgICAgICAgICAgICB1cmw6ICcnLFxuICAgICAgICAgICAgICAgIHJvdXRlOiBudWxsLFxuICAgICAgICAgICAgICAgIHBhcmFtczogbnVsbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGljb246ICcnLFxuICAgICAgICAgICAgc3VibWVudTogdGhpcy5idWlsZEdyb3VwZWRNZW51KGdyb3VwZWRNb2R1bGVzLCBtb2R1bGVzLCBsYW5ndWFnZXMsIHNvcnQpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgR3JvdXBlZCBtZW51XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZ3JvdXBlZE1vZHVsZXMgaW5mb1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBtb2R1bGVzIG1hcFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsYW5ndWFnZXMgbWFwc1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gc29ydCBmbGFnXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7W119IG1lbnUgaXRlbSBhcnJheVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBidWlsZEdyb3VwZWRNZW51KFxuICAgICAgICBncm91cGVkTW9kdWxlczogYW55W10sXG4gICAgICAgIG1vZHVsZXM6IE5hdmJhck1vZHVsZU1hcCxcbiAgICAgICAgbGFuZ3VhZ2VzOiBMYW5ndWFnZVN0cmluZ3MsXG4gICAgICAgIHNvcnQ6IGJvb2xlYW5cbiAgICApOiBNZW51SXRlbVtdIHtcblxuICAgICAgICBjb25zdCBncm91cGVkSXRlbXMgPSBbXTtcbiAgICAgICAgbGV0IGhvbWVNZW51SXRlbSA9IG51bGw7XG5cbiAgICAgICAgZ3JvdXBlZE1vZHVsZXMuZm9yRWFjaCgoZ3JvdXBlZE1vZHVsZSkgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCBtb2R1bGUgPSBtb2R1bGVzW2dyb3VwZWRNb2R1bGVdO1xuXG4gICAgICAgICAgICBpZiAoIW1vZHVsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbW9kdWxlTWVudUl0ZW0gPSB0aGlzLmJ1aWxkVGFiTWVudUl0ZW0oZ3JvdXBlZE1vZHVsZSwgbW9kdWxlLCBsYW5ndWFnZXMpO1xuXG4gICAgICAgICAgICBpZiAoZ3JvdXBlZE1vZHVsZSA9PT0gJ2hvbWUnKSB7XG4gICAgICAgICAgICAgICAgaG9tZU1lbnVJdGVtID0gbW9kdWxlTWVudUl0ZW07XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBncm91cGVkSXRlbXMucHVzaChtb2R1bGVNZW51SXRlbSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzb3J0KSB7XG4gICAgICAgICAgICB0aGlzLnNvcnRNZW51SXRlbXMoZ3JvdXBlZEl0ZW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChob21lTWVudUl0ZW0pIHtcbiAgICAgICAgICAgIGdyb3VwZWRJdGVtcy51bnNoaWZ0KGhvbWVNZW51SXRlbSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ3JvdXBlZEl0ZW1zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIG1vZHVsZSBtZW51IGl0ZW1zXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kdWxlIG5hbWVcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbW9kdWxlSW5mbyBpbmZvXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGxhbmd1YWdlcyBvYmplY3RcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IG1lbnVJdGVtXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGJ1aWxkVGFiTWVudUl0ZW0oXG4gICAgICAgIG1vZHVsZTogc3RyaW5nLFxuICAgICAgICBtb2R1bGVJbmZvOiBOYXZiYXJNb2R1bGUsXG4gICAgICAgIGxhbmd1YWdlczogTGFuZ3VhZ2VTdHJpbmdzLFxuICAgICk6IE1lbnVJdGVtIHtcblxuICAgICAgICBjb25zdCBtb2R1bGVSb3V0ZSA9IHRoaXMubW9kdWxlTmF2aWdhdGlvbi5nZXRNb2R1bGVSb3V0ZShtb2R1bGVJbmZvKTtcblxuICAgICAgICBjb25zdCBtZW51SXRlbSA9IHtcbiAgICAgICAgICAgIGxpbms6IHtcbiAgICAgICAgICAgICAgICBsYWJlbDogdGhpcy5tb2R1bGVOYXZpZ2F0aW9uLmdldE1vZHVsZUxhYmVsKG1vZHVsZUluZm8sIGxhbmd1YWdlcy5hcHBMaXN0U3RyaW5ncyksXG4gICAgICAgICAgICAgICAgdXJsOiBtb2R1bGVSb3V0ZS51cmwsXG4gICAgICAgICAgICAgICAgcm91dGU6IG1vZHVsZVJvdXRlLnJvdXRlLFxuICAgICAgICAgICAgICAgIHBhcmFtczogbnVsbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGljb246IChtb2R1bGUgPT09ICdob21lJykgPyAnaG9tZScgOiAnJyxcbiAgICAgICAgICAgIHN1Ym1lbnU6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKG1vZHVsZUluZm8pIHtcbiAgICAgICAgICAgIG1vZHVsZUluZm8ubWVudS5mb3JFYWNoKChzdWJNZW51KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGVBY3Rpb25Sb3V0ZSA9IHRoaXMubW9kdWxlTmF2aWdhdGlvbi5nZXRBY3Rpb25Sb3V0ZShzdWJNZW51KTtcblxuICAgICAgICAgICAgICAgIG1lbnVJdGVtLnN1Ym1lbnUucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGxpbms6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiB0aGlzLm1vZHVsZU5hdmlnYXRpb24uZ2V0QWN0aW9uTGFiZWwobW9kdWxlLCBzdWJNZW51LCBsYW5ndWFnZXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBtb2R1bGVBY3Rpb25Sb3V0ZS51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3V0ZTogbW9kdWxlQWN0aW9uUm91dGUucm91dGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IG1vZHVsZUFjdGlvblJvdXRlLnBhcmFtc1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBpY29uOiBzdWJNZW51Lmljb24sXG4gICAgICAgICAgICAgICAgICAgIHN1Ym1lbnU6IFtdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtZW51SXRlbTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTb3J0IG1lbnUgaXRlbXMgYnkgbGFiZWxcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBuYXZJdGVtcyB0byBzb3J0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNvcnRNZW51SXRlbXMobmF2SXRlbXM6IGFueVtdKTogdm9pZCB7XG4gICAgICAgIG5hdkl0ZW1zLnNvcnQoKGE6IE1lbnVJdGVtLCBiOiBNZW51SXRlbSkgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCBuYW1lQSA9IGEubGluay5sYWJlbC50b1VwcGVyQ2FzZSgpOyAvLyBpZ25vcmUgdXBwZXIgYW5kIGxvd2VyY2FzZVxuICAgICAgICAgICAgY29uc3QgbmFtZUIgPSBiLmxpbmsubGFiZWwudG9VcHBlckNhc2UoKTsgLy8gaWdub3JlIHVwcGVyIGFuZCBsb3dlcmNhc2VcblxuICAgICAgICAgICAgaWYgKG5hbWVBIDwgbmFtZUIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmFtZUEgPiBuYW1lQikge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBuYW1lcyBtdXN0IGJlIGVxdWFsXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19