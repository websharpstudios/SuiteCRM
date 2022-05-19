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
import { AppStateStore } from './app-state/app-state.store';
import { LanguageStore } from './language/language.store';
import { NavigationStore } from './navigation/navigation.store';
import { SystemConfigStore } from './system-config/system-config.store';
import { ThemeImagesStore } from './theme-images/theme-images.store';
import { UserPreferenceStore } from './user-preference/user-preference.store';
import { MetadataStore } from './metadata/metadata.store.service';
import * as i0 from "@angular/core";
import * as i1 from "./app-state/app-state.store";
import * as i2 from "./language/language.store";
import * as i3 from "./metadata/metadata.store.service";
import * as i4 from "./navigation/navigation.store";
import * as i5 from "./system-config/system-config.store";
import * as i6 from "./theme-images/theme-images.store";
import * as i7 from "./user-preference/user-preference.store";
export class StateManager {
    constructor(appStore, languageStore, metadataStore, navigationStore, systemConfigStore, themeImagesStore, userPreferenceStore) {
        this.appStore = appStore;
        this.languageStore = languageStore;
        this.metadataStore = metadataStore;
        this.navigationStore = navigationStore;
        this.systemConfigStore = systemConfigStore;
        this.themeImagesStore = themeImagesStore;
        this.userPreferenceStore = userPreferenceStore;
        this.stateStores = {};
        this.stateStores.appStore = this.buildMapEntry(appStore, false);
        this.stateStores.navigationStore = this.buildMapEntry(navigationStore, true);
        this.stateStores.languageStore = this.buildMapEntry(languageStore, true);
        this.stateStores.metadataStore = this.buildMapEntry(metadataStore, false);
        this.stateStores.systemConfigStore = this.buildMapEntry(systemConfigStore, false);
        this.stateStores.themeImagesStore = this.buildMapEntry(themeImagesStore, false);
        this.stateStores.userPreferenceStore = this.buildMapEntry(userPreferenceStore, true);
    }
    /**
     * Public Api
     */
    /**
     * Clear all state
     */
    clear() {
        Object.keys(this.stateStores).forEach((key) => {
            this.stateStores[key].store.clear();
        });
    }
    /**
     * Clear all state
     */
    clearAuthBased() {
        Object.keys(this.stateStores).forEach((key) => {
            if (this.stateStores[key].authBased) {
                this.stateStores[key].store.clearAuthBased();
            }
        });
    }
    /**
     * Internal api
     */
    /**
     * Build Map entry
     *
     * @param {{}} store to use
     * @param {boolean} authBased flag
     * @returns {{}} StateStoreMapEntry
     */
    buildMapEntry(store, authBased) {
        return {
            store,
            authBased
        };
    }
}
StateManager.ɵprov = i0.ɵɵdefineInjectable({ factory: function StateManager_Factory() { return new StateManager(i0.ɵɵinject(i1.AppStateStore), i0.ɵɵinject(i2.LanguageStore), i0.ɵɵinject(i3.MetadataStore), i0.ɵɵinject(i4.NavigationStore), i0.ɵɵinject(i5.SystemConfigStore), i0.ɵɵinject(i6.ThemeImagesStore), i0.ɵɵinject(i7.UserPreferenceStore)); }, token: StateManager, providedIn: "root" });
StateManager.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
StateManager.ctorParameters = () => [
    { type: AppStateStore },
    { type: LanguageStore },
    { type: MetadataStore },
    { type: NavigationStore },
    { type: SystemConfigStore },
    { type: ThemeImagesStore },
    { type: UserPreferenceStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zdG9yZS9zdGF0ZS1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUMxRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDeEQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQ3RFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ25FLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHlDQUF5QyxDQUFDO0FBRTVFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQzs7Ozs7Ozs7O0FBS2hFLE1BQU0sT0FBTyxZQUFZO0lBR3JCLFlBQ2MsUUFBdUIsRUFDdkIsYUFBNEIsRUFDNUIsYUFBNEIsRUFDNUIsZUFBZ0MsRUFDaEMsaUJBQW9DLEVBQ3BDLGdCQUFrQyxFQUNsQyxtQkFBd0M7UUFOeEMsYUFBUSxHQUFSLFFBQVEsQ0FBZTtRQUN2QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNwQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFUNUMsZ0JBQVcsR0FBa0IsRUFBRSxDQUFDO1FBV3RDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFFLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRixJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFFRDs7T0FFRztJQUVIOztPQUVHO0lBQ0ksS0FBSztRQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOztPQUVHO0lBQ0ksY0FBYztRQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUMxQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFO2dCQUNqQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUNoRDtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOztPQUVHO0lBRUg7Ozs7OztPQU1HO0lBQ08sYUFBYSxDQUFDLEtBQWlCLEVBQUUsU0FBa0I7UUFDekQsT0FBTztZQUNILEtBQUs7WUFDTCxTQUFTO1NBQ1osQ0FBQztJQUNOLENBQUM7Ozs7WUFoRUosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFYTyxhQUFhO1lBQ2IsYUFBYTtZQU1iLGFBQWE7WUFMYixlQUFlO1lBQ2YsaUJBQWlCO1lBQ2pCLGdCQUFnQjtZQUNoQixtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FwcFN0YXRlU3RvcmV9IGZyb20gJy4vYXBwLXN0YXRlL2FwcC1zdGF0ZS5zdG9yZSc7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmV9IGZyb20gJy4vbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtOYXZpZ2F0aW9uU3RvcmV9IGZyb20gJy4vbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLnN0b3JlJztcbmltcG9ydCB7U3lzdGVtQ29uZmlnU3RvcmV9IGZyb20gJy4vc3lzdGVtLWNvbmZpZy9zeXN0ZW0tY29uZmlnLnN0b3JlJztcbmltcG9ydCB7VGhlbWVJbWFnZXNTdG9yZX0gZnJvbSAnLi90aGVtZS1pbWFnZXMvdGhlbWUtaW1hZ2VzLnN0b3JlJztcbmltcG9ydCB7VXNlclByZWZlcmVuY2VTdG9yZX0gZnJvbSAnLi91c2VyLXByZWZlcmVuY2UvdXNlci1wcmVmZXJlbmNlLnN0b3JlJztcbmltcG9ydCB7U3RhdGVTdG9yZSwgU3RhdGVTdG9yZU1hcCwgU3RhdGVTdG9yZU1hcEVudHJ5fSBmcm9tICcuL3N0YXRlJztcbmltcG9ydCB7TWV0YWRhdGFTdG9yZX0gZnJvbSAnLi9tZXRhZGF0YS9tZXRhZGF0YS5zdG9yZS5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgU3RhdGVNYW5hZ2VyIHtcbiAgICBwcm90ZWN0ZWQgc3RhdGVTdG9yZXM6IFN0YXRlU3RvcmVNYXAgPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgYXBwU3RvcmU6IEFwcFN0YXRlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBsYW5ndWFnZVN0b3JlOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbWV0YWRhdGFTdG9yZTogTWV0YWRhdGFTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIG5hdmlnYXRpb25TdG9yZTogTmF2aWdhdGlvblN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgc3lzdGVtQ29uZmlnU3RvcmU6IFN5c3RlbUNvbmZpZ1N0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgdGhlbWVJbWFnZXNTdG9yZTogVGhlbWVJbWFnZXNTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIHVzZXJQcmVmZXJlbmNlU3RvcmU6IFVzZXJQcmVmZXJlbmNlU3RvcmUsXG4gICAgKSB7XG4gICAgICAgIHRoaXMuc3RhdGVTdG9yZXMuYXBwU3RvcmUgPSB0aGlzLmJ1aWxkTWFwRW50cnkoYXBwU3RvcmUsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5zdGF0ZVN0b3Jlcy5uYXZpZ2F0aW9uU3RvcmUgPSB0aGlzLmJ1aWxkTWFwRW50cnkobmF2aWdhdGlvblN0b3JlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5zdGF0ZVN0b3Jlcy5sYW5ndWFnZVN0b3JlID0gdGhpcy5idWlsZE1hcEVudHJ5KGxhbmd1YWdlU3RvcmUsIHRydWUpO1xuICAgICAgICB0aGlzLnN0YXRlU3RvcmVzLm1ldGFkYXRhU3RvcmUgPSB0aGlzLmJ1aWxkTWFwRW50cnkobWV0YWRhdGFTdG9yZSwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlU3RvcmVzLnN5c3RlbUNvbmZpZ1N0b3JlID0gdGhpcy5idWlsZE1hcEVudHJ5KHN5c3RlbUNvbmZpZ1N0b3JlLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuc3RhdGVTdG9yZXMudGhlbWVJbWFnZXNTdG9yZSA9IHRoaXMuYnVpbGRNYXBFbnRyeSh0aGVtZUltYWdlc1N0b3JlLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuc3RhdGVTdG9yZXMudXNlclByZWZlcmVuY2VTdG9yZSA9IHRoaXMuYnVpbGRNYXBFbnRyeSh1c2VyUHJlZmVyZW5jZVN0b3JlLCB0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQdWJsaWMgQXBpXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBDbGVhciBhbGwgc3RhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuc3RhdGVTdG9yZXMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZVN0b3Jlc1trZXldLnN0b3JlLmNsZWFyKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFyIGFsbCBzdGF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBjbGVhckF1dGhCYXNlZCgpOiB2b2lkIHtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5zdGF0ZVN0b3JlcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZVN0b3Jlc1trZXldLmF1dGhCYXNlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVTdG9yZXNba2V5XS5zdG9yZS5jbGVhckF1dGhCYXNlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBhcGlcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIE1hcCBlbnRyeVxuICAgICAqXG4gICAgICogQHBhcmFtIHt7fX0gc3RvcmUgdG8gdXNlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBhdXRoQmFzZWQgZmxhZ1xuICAgICAqIEByZXR1cm5zIHt7fX0gU3RhdGVTdG9yZU1hcEVudHJ5XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGJ1aWxkTWFwRW50cnkoc3RvcmU6IFN0YXRlU3RvcmUsIGF1dGhCYXNlZDogYm9vbGVhbik6IFN0YXRlU3RvcmVNYXBFbnRyeSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdG9yZSxcbiAgICAgICAgICAgIGF1dGhCYXNlZFxuICAgICAgICB9O1xuICAgIH1cbn1cbiJdfQ==