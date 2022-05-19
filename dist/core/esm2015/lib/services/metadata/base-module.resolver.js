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
import { BaseMetadataResolver } from './base-metadata.resolver';
import { ModuleNameMapper } from '../navigation/module-name-mapper/module-name-mapper.service';
import { SystemConfigStore } from '../../store/system-config/system-config.store';
import { LanguageStore } from '../../store/language/language.store';
import { NavigationStore } from '../../store/navigation/navigation.store';
import { UserPreferenceStore } from '../../store/user-preference/user-preference.store';
import { ThemeImagesStore } from '../../store/theme-images/theme-images.store';
import { AppStateStore } from '../../store/app-state/app-state.store';
import { forkJoin } from 'rxjs';
import { MetadataStore } from '../../store/metadata/metadata.store.service';
import { MessageService } from '../message/message.service';
import { tap } from 'rxjs/operators';
import { RouteConverter } from "../navigation/route-converter/route-converter.service";
import * as i0 from "@angular/core";
import * as i1 from "../../store/system-config/system-config.store";
import * as i2 from "../../store/language/language.store";
import * as i3 from "../../store/navigation/navigation.store";
import * as i4 from "../../store/user-preference/user-preference.store";
import * as i5 from "../../store/theme-images/theme-images.store";
import * as i6 from "../navigation/module-name-mapper/module-name-mapper.service";
import * as i7 from "../../store/app-state/app-state.store";
import * as i8 from "../../store/metadata/metadata.store.service";
import * as i9 from "../message/message.service";
import * as i10 from "../navigation/route-converter/route-converter.service";
export class BaseModuleResolver extends BaseMetadataResolver {
    constructor(systemConfigStore, languageStore, navigationStore, userPreferenceStore, themeImagesStore, moduleNameMapper, appStateStore, metadataStore, messageService, routeConverter) {
        super(systemConfigStore, languageStore, navigationStore, userPreferenceStore, themeImagesStore, appStateStore, moduleNameMapper, messageService);
        this.systemConfigStore = systemConfigStore;
        this.languageStore = languageStore;
        this.navigationStore = navigationStore;
        this.userPreferenceStore = userPreferenceStore;
        this.themeImagesStore = themeImagesStore;
        this.moduleNameMapper = moduleNameMapper;
        this.appStateStore = appStateStore;
        this.metadataStore = metadataStore;
        this.messageService = messageService;
        this.routeConverter = routeConverter;
    }
    resolve(route) {
        let routeModule = route.params.module;
        if (!routeModule) {
            routeModule = route.data.module;
        }
        return forkJoin({
            base: super.resolve(route),
            metadata: this.metadataStore.load(routeModule, this.metadataStore.getMetadataTypes()),
            savedSearchMeta: this.metadataStore.getMetadata('saved-search', ['recordView'])
        }).pipe(tap(() => {
            var _a;
            if (routeModule) {
                const module = this.calculateActiveModule(route);
                this.appStateStore.setModule(module);
            }
            const info = this.routeConverter.parseRouteURL(route.url);
            const action = (_a = info.action) !== null && _a !== void 0 ? _a : 'index';
            this.appStateStore.setView(action);
        }, () => {
            this.addMetadataLoadErrorMessage();
        }));
    }
}
BaseModuleResolver.ɵprov = i0.ɵɵdefineInjectable({ factory: function BaseModuleResolver_Factory() { return new BaseModuleResolver(i0.ɵɵinject(i1.SystemConfigStore), i0.ɵɵinject(i2.LanguageStore), i0.ɵɵinject(i3.NavigationStore), i0.ɵɵinject(i4.UserPreferenceStore), i0.ɵɵinject(i5.ThemeImagesStore), i0.ɵɵinject(i6.ModuleNameMapper), i0.ɵɵinject(i7.AppStateStore), i0.ɵɵinject(i8.MetadataStore), i0.ɵɵinject(i9.MessageService), i0.ɵɵinject(i10.RouteConverter)); }, token: BaseModuleResolver, providedIn: "root" });
BaseModuleResolver.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
BaseModuleResolver.ctorParameters = () => [
    { type: SystemConfigStore },
    { type: LanguageStore },
    { type: NavigationStore },
    { type: UserPreferenceStore },
    { type: ThemeImagesStore },
    { type: ModuleNameMapper },
    { type: AppStateStore },
    { type: MetadataStore },
    { type: MessageService },
    { type: RouteConverter }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1tb2R1bGUucmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc2VydmljZXMvbWV0YWRhdGEvYmFzZS1tb2R1bGUucmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDOUQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sNkRBQTZELENBQUM7QUFDN0YsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sK0NBQStDLENBQUM7QUFDaEYsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx5Q0FBeUMsQ0FBQztBQUN4RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxtREFBbUQsQ0FBQztBQUN0RixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSw2Q0FBNkMsQ0FBQztBQUM3RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDcEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM5QixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sNkNBQTZDLENBQUM7QUFDMUUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQzFELE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sdURBQXVELENBQUM7Ozs7Ozs7Ozs7OztBQUdyRixNQUFNLE9BQU8sa0JBQW1CLFNBQVEsb0JBQW9CO0lBRXhELFlBQ2MsaUJBQW9DLEVBQ3BDLGFBQTRCLEVBQzVCLGVBQWdDLEVBQ2hDLG1CQUF3QyxFQUN4QyxnQkFBa0MsRUFDbEMsZ0JBQWtDLEVBQ2xDLGFBQTRCLEVBQzVCLGFBQTRCLEVBQzVCLGNBQThCLEVBQzlCLGNBQThCO1FBRXhDLEtBQUssQ0FDRCxpQkFBaUIsRUFDakIsYUFBYSxFQUNiLGVBQWUsRUFDZixtQkFBbUIsRUFDbkIsZ0JBQWdCLEVBQ2hCLGFBQWEsRUFDYixnQkFBZ0IsRUFDaEIsY0FBYyxDQUNqQixDQUFDO1FBcEJRLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDcEMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7SUFZNUMsQ0FBQztJQUVELE9BQU8sQ0FBQyxLQUE2QjtRQUNqQyxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUV0QyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2QsV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ25DO1FBRUQsT0FBTyxRQUFRLENBQUM7WUFDWixJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFDMUIsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDckYsZUFBZSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ2xGLENBQUMsQ0FBQyxJQUFJLENBQ0gsR0FBRyxDQUNDLEdBQUcsRUFBRTs7WUFDRCxJQUFJLFdBQVcsRUFBRTtnQkFDYixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRWpELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3hDO1lBQ0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFELE1BQU0sTUFBTSxHQUFHLE1BQUEsSUFBSSxDQUFDLE1BQU0sbUNBQUksT0FBTyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsRUFDRCxHQUFHLEVBQUU7WUFDRCxJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FDVCxDQUFDO0lBQ04sQ0FBQzs7OztZQXRESixVQUFVLFNBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzs7WUFaeEIsaUJBQWlCO1lBQ2pCLGFBQWE7WUFDYixlQUFlO1lBQ2YsbUJBQW1CO1lBQ25CLGdCQUFnQjtZQUxoQixnQkFBZ0I7WUFNaEIsYUFBYTtZQUViLGFBQWE7WUFDYixjQUFjO1lBRWQsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QWN0aXZhdGVkUm91dGVTbmFwc2hvdH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7QmFzZU1ldGFkYXRhUmVzb2x2ZXJ9IGZyb20gJy4vYmFzZS1tZXRhZGF0YS5yZXNvbHZlcic7XG5pbXBvcnQge01vZHVsZU5hbWVNYXBwZXJ9IGZyb20gJy4uL25hdmlnYXRpb24vbW9kdWxlLW5hbWUtbWFwcGVyL21vZHVsZS1uYW1lLW1hcHBlci5zZXJ2aWNlJztcbmltcG9ydCB7U3lzdGVtQ29uZmlnU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL3N5c3RlbS1jb25maWcvc3lzdGVtLWNvbmZpZy5zdG9yZSc7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL2xhbmd1YWdlL2xhbmd1YWdlLnN0b3JlJztcbmltcG9ydCB7TmF2aWdhdGlvblN0b3JlfSBmcm9tICcuLi8uLi9zdG9yZS9uYXZpZ2F0aW9uL25hdmlnYXRpb24uc3RvcmUnO1xuaW1wb3J0IHtVc2VyUHJlZmVyZW5jZVN0b3JlfSBmcm9tICcuLi8uLi9zdG9yZS91c2VyLXByZWZlcmVuY2UvdXNlci1wcmVmZXJlbmNlLnN0b3JlJztcbmltcG9ydCB7VGhlbWVJbWFnZXNTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvdGhlbWUtaW1hZ2VzL3RoZW1lLWltYWdlcy5zdG9yZSc7XG5pbXBvcnQge0FwcFN0YXRlU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL2FwcC1zdGF0ZS9hcHAtc3RhdGUuc3RvcmUnO1xuaW1wb3J0IHtmb3JrSm9pbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01ldGFkYXRhU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL21ldGFkYXRhL21ldGFkYXRhLnN0b3JlLnNlcnZpY2UnO1xuaW1wb3J0IHtNZXNzYWdlU2VydmljZX0gZnJvbSAnLi4vbWVzc2FnZS9tZXNzYWdlLnNlcnZpY2UnO1xuaW1wb3J0IHt0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7Um91dGVDb252ZXJ0ZXJ9IGZyb20gXCIuLi9uYXZpZ2F0aW9uL3JvdXRlLWNvbnZlcnRlci9yb3V0ZS1jb252ZXJ0ZXIuc2VydmljZVwiO1xuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBCYXNlTW9kdWxlUmVzb2x2ZXIgZXh0ZW5kcyBCYXNlTWV0YWRhdGFSZXNvbHZlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHN5c3RlbUNvbmZpZ1N0b3JlOiBTeXN0ZW1Db25maWdTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlU3RvcmU6IExhbmd1YWdlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBuYXZpZ2F0aW9uU3RvcmU6IE5hdmlnYXRpb25TdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIHVzZXJQcmVmZXJlbmNlU3RvcmU6IFVzZXJQcmVmZXJlbmNlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCB0aGVtZUltYWdlc1N0b3JlOiBUaGVtZUltYWdlc1N0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbW9kdWxlTmFtZU1hcHBlcjogTW9kdWxlTmFtZU1hcHBlcixcbiAgICAgICAgcHJvdGVjdGVkIGFwcFN0YXRlU3RvcmU6IEFwcFN0YXRlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBtZXRhZGF0YVN0b3JlOiBNZXRhZGF0YVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgcm91dGVDb252ZXJ0ZXI6IFJvdXRlQ29udmVydGVyLFxuICAgICkge1xuICAgICAgICBzdXBlcihcbiAgICAgICAgICAgIHN5c3RlbUNvbmZpZ1N0b3JlLFxuICAgICAgICAgICAgbGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgICAgIG5hdmlnYXRpb25TdG9yZSxcbiAgICAgICAgICAgIHVzZXJQcmVmZXJlbmNlU3RvcmUsXG4gICAgICAgICAgICB0aGVtZUltYWdlc1N0b3JlLFxuICAgICAgICAgICAgYXBwU3RhdGVTdG9yZSxcbiAgICAgICAgICAgIG1vZHVsZU5hbWVNYXBwZXIsXG4gICAgICAgICAgICBtZXNzYWdlU2VydmljZVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJlc29sdmUocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBhbnkge1xuICAgICAgICBsZXQgcm91dGVNb2R1bGUgPSByb3V0ZS5wYXJhbXMubW9kdWxlO1xuXG4gICAgICAgIGlmICghcm91dGVNb2R1bGUpIHtcbiAgICAgICAgICAgIHJvdXRlTW9kdWxlID0gcm91dGUuZGF0YS5tb2R1bGU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9ya0pvaW4oe1xuICAgICAgICAgICAgYmFzZTogc3VwZXIucmVzb2x2ZShyb3V0ZSksXG4gICAgICAgICAgICBtZXRhZGF0YTogdGhpcy5tZXRhZGF0YVN0b3JlLmxvYWQocm91dGVNb2R1bGUsIHRoaXMubWV0YWRhdGFTdG9yZS5nZXRNZXRhZGF0YVR5cGVzKCkpLFxuICAgICAgICAgICAgc2F2ZWRTZWFyY2hNZXRhOiB0aGlzLm1ldGFkYXRhU3RvcmUuZ2V0TWV0YWRhdGEoJ3NhdmVkLXNlYXJjaCcsIFsncmVjb3JkVmlldyddKVxuICAgICAgICB9KS5waXBlKFxuICAgICAgICAgICAgdGFwKFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdXRlTW9kdWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGUgPSB0aGlzLmNhbGN1bGF0ZUFjdGl2ZU1vZHVsZShyb3V0ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwU3RhdGVTdG9yZS5zZXRNb2R1bGUobW9kdWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmZvID0gdGhpcy5yb3V0ZUNvbnZlcnRlci5wYXJzZVJvdXRlVVJMKHJvdXRlLnVybCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGlvbiA9IGluZm8uYWN0aW9uID8/ICdpbmRleCc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwU3RhdGVTdG9yZS5zZXRWaWV3KGFjdGlvbik7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkTWV0YWRhdGFMb2FkRXJyb3JNZXNzYWdlKCk7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgfVxufVxuIl19