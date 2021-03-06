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
import { FilterListStore } from './filter-list.store';
import { AuthService } from '../../services/auth/auth.service';
import { ModuleNameMapper } from '../../services/navigation/module-name-mapper/module-name-mapper.service';
import { FiltersListGQL } from './graphql/api.list.get';
import { SystemConfigStore } from '../system-config/system-config.store';
import { UserPreferenceStore } from '../user-preference/user-preference.store';
import { AppStateStore } from '../app-state/app-state.store';
import { LanguageStore } from '../language/language.store';
import { MessageService } from '../../services/message/message.service';
import * as i0 from "@angular/core";
import * as i1 from "./graphql/api.list.get";
import * as i2 from "../system-config/system-config.store";
import * as i3 from "../user-preference/user-preference.store";
import * as i4 from "../app-state/app-state.store";
import * as i5 from "../language/language.store";
import * as i6 from "../../services/message/message.service";
import * as i7 from "../../services/auth/auth.service";
import * as i8 from "../../services/navigation/module-name-mapper/module-name-mapper.service";
export class FilterListStoreFactory {
    /**
     * Constructor
     * @param listGQL
     * @param configs
     * @param preferences
     * @param appState
     * @param language
     * @param message
     * @param auth
     * @param moduleNameMapper
     */
    constructor(listGQL, configs, preferences, appState, language, message, auth, moduleNameMapper) {
        this.listGQL = listGQL;
        this.configs = configs;
        this.preferences = preferences;
        this.appState = appState;
        this.language = language;
        this.message = message;
        this.auth = auth;
        this.moduleNameMapper = moduleNameMapper;
    }
    /**
     * Create a new FilterListStore instance
     * @returns {object} FilterListStore
     */
    create() {
        return new FilterListStore(this.listGQL, this.configs, this.preferences, this.appState, this.language, this.message, this.auth, this.moduleNameMapper);
    }
}
FilterListStoreFactory.??prov = i0.????defineInjectable({ factory: function FilterListStoreFactory_Factory() { return new FilterListStoreFactory(i0.????inject(i1.FiltersListGQL), i0.????inject(i2.SystemConfigStore), i0.????inject(i3.UserPreferenceStore), i0.????inject(i4.AppStateStore), i0.????inject(i5.LanguageStore), i0.????inject(i6.MessageService), i0.????inject(i7.AuthService), i0.????inject(i8.ModuleNameMapper)); }, token: FilterListStoreFactory, providedIn: "root" });
FilterListStoreFactory.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
FilterListStoreFactory.ctorParameters = () => [
    { type: FiltersListGQL },
    { type: SystemConfigStore },
    { type: UserPreferenceStore },
    { type: AppStateStore },
    { type: LanguageStore },
    { type: MessageService },
    { type: AuthService },
    { type: ModuleNameMapper }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLWxpc3Quc3RvcmUuZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zdG9yZS9zYXZlZC1maWx0ZXJzL2ZpbHRlci1saXN0LnN0b3JlLmZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUM3RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx5RUFBeUUsQ0FBQztBQUN6RyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdEQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDdkUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFDN0UsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQzNELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUN6RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sd0NBQXdDLENBQUM7Ozs7Ozs7Ozs7QUFLdEUsTUFBTSxPQUFPLHNCQUFzQjtJQUUvQjs7Ozs7Ozs7OztPQVVHO0lBQ0gsWUFDYyxPQUF1QixFQUN2QixPQUEwQixFQUMxQixXQUFnQyxFQUNoQyxRQUF1QixFQUN2QixRQUF1QixFQUN2QixPQUF1QixFQUN2QixJQUFpQixFQUNqQixnQkFBa0M7UUFQbEMsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFDdkIsWUFBTyxHQUFQLE9BQU8sQ0FBbUI7UUFDMUIsZ0JBQVcsR0FBWCxXQUFXLENBQXFCO1FBQ2hDLGFBQVEsR0FBUixRQUFRLENBQWU7UUFDdkIsYUFBUSxHQUFSLFFBQVEsQ0FBZTtRQUN2QixZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUN2QixTQUFJLEdBQUosSUFBSSxDQUFhO1FBQ2pCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7SUFFaEQsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU07UUFDRixPQUFPLElBQUksZUFBZSxDQUN0QixJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLFdBQVcsRUFDaEIsSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsZ0JBQWdCLENBQ3hCLENBQUM7SUFDTixDQUFDOzs7O1lBM0NKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7O1lBVE8sY0FBYztZQUNkLGlCQUFpQjtZQUNqQixtQkFBbUI7WUFDbkIsYUFBYTtZQUNiLGFBQWE7WUFDYixjQUFjO1lBUGQsV0FBVztZQUNYLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RmlsdGVyTGlzdFN0b3JlfSBmcm9tICcuL2ZpbHRlci1saXN0LnN0b3JlJztcbmltcG9ydCB7QXV0aFNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2F1dGgvYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7TW9kdWxlTmFtZU1hcHBlcn0gZnJvbSAnLi4vLi4vc2VydmljZXMvbmF2aWdhdGlvbi9tb2R1bGUtbmFtZS1tYXBwZXIvbW9kdWxlLW5hbWUtbWFwcGVyLnNlcnZpY2UnO1xuaW1wb3J0IHtGaWx0ZXJzTGlzdEdRTH0gZnJvbSAnLi9ncmFwaHFsL2FwaS5saXN0LmdldCc7XG5pbXBvcnQge1N5c3RlbUNvbmZpZ1N0b3JlfSBmcm9tICcuLi9zeXN0ZW0tY29uZmlnL3N5c3RlbS1jb25maWcuc3RvcmUnO1xuaW1wb3J0IHtVc2VyUHJlZmVyZW5jZVN0b3JlfSBmcm9tICcuLi91c2VyLXByZWZlcmVuY2UvdXNlci1wcmVmZXJlbmNlLnN0b3JlJztcbmltcG9ydCB7QXBwU3RhdGVTdG9yZX0gZnJvbSAnLi4vYXBwLXN0YXRlL2FwcC1zdGF0ZS5zdG9yZSc7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmV9IGZyb20gJy4uL2xhbmd1YWdlL2xhbmd1YWdlLnN0b3JlJztcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21lc3NhZ2UvbWVzc2FnZS5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgRmlsdGVyTGlzdFN0b3JlRmFjdG9yeSB7XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSBsaXN0R1FMXG4gICAgICogQHBhcmFtIGNvbmZpZ3NcbiAgICAgKiBAcGFyYW0gcHJlZmVyZW5jZXNcbiAgICAgKiBAcGFyYW0gYXBwU3RhdGVcbiAgICAgKiBAcGFyYW0gbGFuZ3VhZ2VcbiAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAqIEBwYXJhbSBhdXRoXG4gICAgICogQHBhcmFtIG1vZHVsZU5hbWVNYXBwZXJcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGxpc3RHUUw6IEZpbHRlcnNMaXN0R1FMLFxuICAgICAgICBwcm90ZWN0ZWQgY29uZmlnczogU3lzdGVtQ29uZmlnU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBwcmVmZXJlbmNlczogVXNlclByZWZlcmVuY2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIGFwcFN0YXRlOiBBcHBTdGF0ZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbGFuZ3VhZ2U6IExhbmd1YWdlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBtZXNzYWdlOiBNZXNzYWdlU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIGF1dGg6IEF1dGhTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgbW9kdWxlTmFtZU1hcHBlcjogTW9kdWxlTmFtZU1hcHBlclxuICAgICkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBGaWx0ZXJMaXN0U3RvcmUgaW5zdGFuY2VcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBGaWx0ZXJMaXN0U3RvcmVcbiAgICAgKi9cbiAgICBjcmVhdGUoKTogRmlsdGVyTGlzdFN0b3JlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGaWx0ZXJMaXN0U3RvcmUoXG4gICAgICAgICAgICB0aGlzLmxpc3RHUUwsXG4gICAgICAgICAgICB0aGlzLmNvbmZpZ3MsXG4gICAgICAgICAgICB0aGlzLnByZWZlcmVuY2VzLFxuICAgICAgICAgICAgdGhpcy5hcHBTdGF0ZSxcbiAgICAgICAgICAgIHRoaXMubGFuZ3VhZ2UsXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UsXG4gICAgICAgICAgICB0aGlzLmF1dGgsXG4gICAgICAgICAgICB0aGlzLm1vZHVsZU5hbWVNYXBwZXJcbiAgICAgICAgKTtcbiAgICB9XG59XG4iXX0=