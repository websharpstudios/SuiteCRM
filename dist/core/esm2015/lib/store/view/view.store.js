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
import { AppStateStore } from '../app-state/app-state.store';
import { map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { LanguageStore } from '../language/language.store';
import { NavigationStore } from '../navigation/navigation.store';
import { ModuleNavigation } from '../../services/navigation/module-navigation/module-navigation.service';
import { MetadataStore } from '../metadata/metadata.store.service';
export class ViewStore {
    constructor(appStateStore, languageStore, navigationStore, moduleNavigation, metadataStore) {
        this.appStateStore = appStateStore;
        this.languageStore = languageStore;
        this.navigationStore = navigationStore;
        this.moduleNavigation = moduleNavigation;
        this.metadataStore = metadataStore;
        this.appState$ = this.appStateStore.vm$;
        this.language$ = this.languageStore.vm$;
        this.navigation$ = this.navigationStore.vm$;
        this.module$ = combineLatest([this.appState$, this.navigationStore.vm$]).pipe(map(([appStateInfo, navigationInfo]) => this.moduleNavigation.getModuleInfo(appStateInfo.module, navigationInfo)));
        this.appData$ = combineLatest([this.appState$, this.module$, this.language$, this.navigation$]).pipe(map(([appState, module, language, navigation]) => {
            this.appData = { appState, module, language, navigation };
            return this.appData;
        }));
        this.metadata$ = metadataStore.metadata$.pipe(tap(metadata => {
            this.metadata = metadata;
        }));
    }
    clear() {
    }
    clearAuthBased() {
        this.clear();
    }
    get appState() {
        if (!this.appData.appState) {
            return {};
        }
        return this.appData.appState;
    }
    get module() {
        return this.appData.module;
    }
    get language() {
        if (!this.appData.language) {
            return {
                appStrings: {},
                appListStrings: {},
                modStrings: {},
                languageKey: ''
            };
        }
        return this.appData.language;
    }
    get appStrings() {
        return this.language.appStrings;
    }
    get appListStrings() {
        return this.language.appListStrings;
    }
    get modStrings() {
        return this.language.modStrings;
    }
    get navigation() {
        return this.appData.navigation;
    }
    get searchMeta() {
        if (!this.metadata.search) {
            return {
                layout: {
                    basic: {},
                    advanced: {}
                }
            };
        }
        return this.metadata.search;
    }
}
ViewStore.decorators = [
    { type: Injectable }
];
ViewStore.ctorParameters = () => [
    { type: AppStateStore },
    { type: LanguageStore },
    { type: NavigationStore },
    { type: ModuleNavigation },
    { type: MetadataStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zdG9yZS92aWV3L3ZpZXcuc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFXLGFBQWEsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQ3JFLE9BQU8sRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEMsT0FBTyxFQUFDLGFBQWEsRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUMvQyxPQUFPLEVBQXdCLGFBQWEsRUFBcUMsTUFBTSw0QkFBNEIsQ0FBQztBQUNwSCxPQUFPLEVBQTJCLGVBQWUsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBQ3pGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHVFQUF1RSxDQUFDO0FBQ3ZHLE9BQU8sRUFBVyxhQUFhLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQVkzRSxNQUFNLE9BQU8sU0FBUztJQVlsQixZQUNjLGFBQTRCLEVBQzVCLGFBQTRCLEVBQzVCLGVBQWdDLEVBQ2hDLGdCQUFrQyxFQUNsQyxhQUE0QjtRQUo1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUV0QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUM7UUFDeEMsSUFBSSxDQUFDLFdB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QjtZQUNOLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N0YXRlU3RvcmV9IGZyb20gJy4uL3N0YXRlJztcbmltcG9ydCB7QXBwU3RhdGUsIEFwcFN0YXRlU3RvcmV9IGZyb20gJy4uL2FwcC1zdGF0ZS9hcHAtc3RhdGUuc3RvcmUnO1xuaW1wb3J0IHttYXAsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7TGFuZ3VhZ2VMaXN0U3RyaW5nTWFwLCBMYW5ndWFnZVN0b3JlLCBMYW5ndWFnZVN0cmluZ01hcCwgTGFuZ3VhZ2VTdHJpbmdzfSBmcm9tICcuLi9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5pbXBvcnQge05hdmJhck1vZHVsZSwgTmF2aWdhdGlvbiwgTmF2aWdhdGlvblN0b3JlfSBmcm9tICcuLi9uYXZpZ2F0aW9uL25hdmlnYXRpb24uc3RvcmUnO1xuaW1wb3J0IHtNb2R1bGVOYXZpZ2F0aW9ufSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uL21vZHVsZS1uYXZpZ2F0aW9uL21vZHVsZS1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHtNZXRhZGF0YSwgTWV0YWRhdGFTdG9yZX0gZnJvbSAnLi4vbWV0YWRhdGEvbWV0YWRhdGEuc3RvcmUuc2VydmljZSc7XG5pbXBvcnQge1NlYXJjaE1ldGF9IGZyb20gJ2NvbW1vbic7XG5cblxuZXhwb3J0IGludGVyZmFjZSBBcHBEYXRhIHtcbiAgICBhcHBTdGF0ZTogQXBwU3RhdGU7XG4gICAgbW9kdWxlOiBOYXZiYXJNb2R1bGU7XG4gICAgbGFuZ3VhZ2U6IExhbmd1YWdlU3RyaW5ncztcbiAgICBuYXZpZ2F0aW9uOiBOYXZpZ2F0aW9uO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVmlld1N0b3JlIGltcGxlbWVudHMgU3RhdGVTdG9yZSB7XG5cbiAgICBhcHBTdGF0ZSQ6IE9ic2VydmFibGU8QXBwU3RhdGU+O1xuICAgIG1vZHVsZSQ6IE9ic2VydmFibGU8TmF2YmFyTW9kdWxlPjtcbiAgICBsYW5ndWFnZSQ6IE9ic2VydmFibGU8TGFuZ3VhZ2VTdHJpbmdzPjtcbiAgICBuYXZpZ2F0aW9uJDogT2JzZXJ2YWJsZTxOYXZpZ2F0aW9uPjtcbiAgICBhcHBEYXRhJDogT2JzZXJ2YWJsZTxBcHBEYXRhPjtcbiAgICBtZXRhZGF0YSQ6IE9ic2VydmFibGU8TWV0YWRhdGE+O1xuXG4gICAgYXBwRGF0YTogQXBwRGF0YTtcbiAgICBtZXRhZGF0YTogTWV0YWRhdGE7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGFwcFN0YXRlU3RvcmU6IEFwcFN0YXRlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBsYW5ndWFnZVN0b3JlOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbmF2aWdhdGlvblN0b3JlOiBOYXZpZ2F0aW9uU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBtb2R1bGVOYXZpZ2F0aW9uOiBNb2R1bGVOYXZpZ2F0aW9uLFxuICAgICAgICBwcm90ZWN0ZWQgbWV0YWRhdGFTdG9yZTogTWV0YWRhdGFTdG9yZVxuICAgICkge1xuICAgICAgICB0aGlzLmFwcFN0YXRlJCA9IHRoaXMuYXBwU3RhdGVTdG9yZS52bSQ7XG4gICAgICAgIHRoaXMubGFuZ3VhZ2UkID0gdGhpcy5sYW5ndWFnZVN0b3JlLnZtJDtcbiAgICAgICAgdGhpcy5uYXZpZ2F0aW9uJCA9IHRoaXMubmF2aWdhdGlvblN0b3JlLnZtJDtcbiAgICAgICAgdGhpcy5tb2R1bGUkID0gY29tYmluZUxhdGVzdChbdGhpcy5hcHBTdGF0ZSQsIHRoaXMubmF2aWdhdGlvblN0b3JlLnZtJF0pLnBpcGUoXG4gICAgICAgICAgICBtYXAoKFthcHBTdGF0ZUluZm8sIG5hdmlnYXRpb25JbmZvXSkgPT5cbiAgICAgICAgICAgICAgICB0aGlzLm1vZHVsZU5hdmlnYXRpb24uZ2V0TW9kdWxlSW5mbyhhcHBTdGF0ZUluZm8ubW9kdWxlLCBuYXZpZ2F0aW9uSW5mbykpXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5hcHBEYXRhJCA9IGNvbWJpbmVMYXRlc3QoW3RoaXMuYXBwU3RhdGUkLCB0aGlzLm1vZHVsZSQsIHRoaXMubGFuZ3VhZ2UkLCB0aGlzLm5hdmlnYXRpb24kXSkucGlwZShcbiAgICAgICAgICAgIG1hcCgoW2FwcFN0YXRlLCBtb2R1bGUsIGxhbmd1YWdlLCBuYXZpZ2F0aW9uXSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwRGF0YSA9IHthcHBTdGF0ZSwgbW9kdWxlLCBsYW5ndWFnZSwgbmF2aWdhdGlvbn0gYXMgQXBwRGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hcHBEYXRhO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLm1ldGFkYXRhJCA9IG1ldGFkYXRhU3RvcmUubWV0YWRhdGEkLnBpcGUodGFwKG1ldGFkYXRhID0+IHtcbiAgICAgICAgICAgIHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIGNsZWFyKCk6IHZvaWQge1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhckF1dGhCYXNlZCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgIH1cblxuICAgIGdldCBhcHBTdGF0ZSgpOiBBcHBTdGF0ZSB7XG4gICAgICAgIGlmICghdGhpcy5hcHBEYXRhLmFwcFN0YXRlKSB7XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwRGF0YS5hcHBTdGF0ZTtcbiAgICB9XG5cbiAgICBnZXQgbW9kdWxlKCk6IE5hdmJhck1vZHVsZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwcERhdGEubW9kdWxlO1xuICAgIH1cblxuICAgIGdldCBsYW5ndWFnZSgpOiBMYW5ndWFnZVN0cmluZ3Mge1xuICAgICAgICBpZiAoIXRoaXMuYXBwRGF0YS5sYW5ndWFnZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBhcHBTdHJpbmdzOiB7fSxcbiAgICAgICAgICAgICAgICBhcHBMaXN0U3RyaW5nczoge30sXG4gICAgICAgICAgICAgICAgbW9kU3RyaW5nczoge30sXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2VLZXk6ICcnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmFwcERhdGEubGFuZ3VhZ2U7XG4gICAgfVxuXG4gICAgZ2V0IGFwcFN0cmluZ3MoKTogTGFuZ3VhZ2VTdHJpbmdNYXAge1xuICAgICAgICByZXR1cm4gdGhpcy5sYW5ndWFnZS5hcHBTdHJpbmdzO1xuICAgIH1cblxuICAgIGdldCBhcHBMaXN0U3RyaW5ncygpOiBMYW5ndWFnZUxpc3RTdHJpbmdNYXAge1xuICAgICAgICByZXR1cm4gdGhpcy5sYW5ndWFnZS5hcHBMaXN0U3RyaW5ncztcbiAgICB9XG5cbiAgICBnZXQgbW9kU3RyaW5ncygpOiBMYW5ndWFnZUxpc3RTdHJpbmdNYXAge1xuICAgICAgICByZXR1cm4gdGhpcy5sYW5ndWFnZS5tb2RTdHJpbmdzO1xuICAgIH1cblxuICAgIGdldCBuYXZpZ2F0aW9uKCk6IE5hdmlnYXRpb24ge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBEYXRhLm5hdmlnYXRpb247XG4gICAgfVxuXG4gICAgZ2V0IHNlYXJjaE1ldGEoKTogU2VhcmNoTWV0YSB7XG4gICAgICAgIGlmICghdGhpcy5tZXRhZGF0YS5zZWFyY2gpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbGF5b3V0OiB7XG4gICAgICAgICAgICAgICAgICAgIGJhc2ljOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgYWR2YW5jZWQ6IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLm1ldGFkYXRhLnNlYXJjaDtcbiAgICB9XG59XG4iXX0=