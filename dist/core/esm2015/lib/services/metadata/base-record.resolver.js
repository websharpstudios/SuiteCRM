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
import { ModuleNameMapper } from '../navigation/module-name-mapper/module-name-mapper.service';
import { ActionNameMapper } from '../navigation/action-name-mapper/action-name-mapper.service';
import { SystemConfigStore } from '../../store/system-config/system-config.store';
import { LanguageStore } from '../../store/language/language.store';
import { NavigationStore } from '../../store/navigation/navigation.store';
import { UserPreferenceStore } from '../../store/user-preference/user-preference.store';
import { ThemeImagesStore } from '../../store/theme-images/theme-images.store';
import { AppStateStore } from '../../store/app-state/app-state.store';
import { MetadataStore } from '../../store/metadata/metadata.store.service';
import { BaseModuleResolver } from './base-module.resolver';
import { forkJoin } from 'rxjs';
import { MessageService } from '../message/message.service';
import { RouteConverter } from "../navigation/route-converter/route-converter.service";
import * as i0 from "@angular/core";
import * as i1 from "../../store/system-config/system-config.store";
import * as i2 from "../../store/language/language.store";
import * as i3 from "../../store/navigation/navigation.store";
import * as i4 from "../../store/metadata/metadata.store.service";
import * as i5 from "../../store/user-preference/user-preference.store";
import * as i6 from "../../store/theme-images/theme-images.store";
import * as i7 from "../navigation/module-name-mapper/module-name-mapper.service";
import * as i8 from "../navigation/action-name-mapper/action-name-mapper.service";
import * as i9 from "../../store/app-state/app-state.store";
import * as i10 from "../message/message.service";
import * as i11 from "../navigation/route-converter/route-converter.service";
import * as i12 from "@angular/router";
export class BaseRecordResolver extends BaseModuleResolver {
    constructor(systemConfigStore, languageStore, navigationStore, metadataStore, userPreferenceStore, themeImagesStore, moduleNameMapper, actionNameMapper, appStateStore, messageService, routeConverter, router) {
        super(systemConfigStore, languageStore, navigationStore, userPreferenceStore, themeImagesStore, moduleNameMapper, appStateStore, metadataStore, messageService, routeConverter);
        this.systemConfigStore = systemConfigStore;
        this.languageStore = languageStore;
        this.navigationStore = navigationStore;
        this.metadataStore = metadataStore;
        this.userPreferenceStore = userPreferenceStore;
        this.themeImagesStore = themeImagesStore;
        this.moduleNameMapper = moduleNameMapper;
        this.actionNameMapper = actionNameMapper;
        this.appStateStore = appStateStore;
        this.messageService = messageService;
        this.routeConverter = routeConverter;
        this.router = router;
    }
    resolve(route) {
        let routeModule = route.params.module;
        if (!routeModule) {
            routeModule = route.data.module;
        }
        return forkJoin({
            base: super.resolve(route),
            metadata: this.metadataStore.load(routeModule, this.metadataStore.getMetadataTypes()),
        });
    }
}
BaseRecordResolver.ɵprov = i0.ɵɵdefineInjectable({ factory: function BaseRecordResolver_Factory() { return new BaseRecordResolver(i0.ɵɵinject(i1.SystemConfigStore), i0.ɵɵinject(i2.LanguageStore), i0.ɵɵinject(i3.NavigationStore), i0.ɵɵinject(i4.MetadataStore), i0.ɵɵinject(i5.UserPreferenceStore), i0.ɵɵinject(i6.ThemeImagesStore), i0.ɵɵinject(i7.ModuleNameMapper), i0.ɵɵinject(i8.ActionNameMapper), i0.ɵɵinject(i9.AppStateStore), i0.ɵɵinject(i10.MessageService), i0.ɵɵinject(i11.RouteConverter), i0.ɵɵinject(i12.Router)); }, token: BaseRecordResolver, providedIn: "root" });
BaseRecordResolver.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
BaseRecordResolver.ctorParameters = () => [
    { type: SystemConfigStore },
    { type: LanguageStore },
    { type: NavigationStore },
    { type: MetadataStore },
    { type: UserPreferenceStore },
    { type: ThemeImagesStore },
    { type: ModuleNameMapper },
    { type: ActionNameMapper },
    { type: AppStateStore },
    { type: MessageService },
    { type: RouteConverter },
    { type: Router }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1yZWNvcmQucmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc2VydmljZXMvbWV0YWRhdGEvYmFzZS1yZWNvcmQucmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUF5QixNQUFNLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSw2REFBNkQsQ0FBQztBQUM3RixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSw2REFBNkQsQ0FBQztBQUM3RixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwrQ0FBK0MsQ0FBQztBQUNoRixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDbEUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHlDQUF5QyxDQUFDO0FBQ3hFLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLG1EQUFtRCxDQUFDO0FBQ3RGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDZDQUE2QyxDQUFDO0FBQzdFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUNwRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sNkNBQTZDLENBQUM7QUFDMUUsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDMUQsT0FBTyxFQUFDLFFBQVEsRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUMxQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDMUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHVEQUF1RCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQUdyRixNQUFNLE9BQU8sa0JBQW1CLFNBQVEsa0JBQWtCO0lBRXRELFlBQ2MsaUJBQW9DLEVBQ3BDLGFBQTRCLEVBQzVCLGVBQWdDLEVBQ2hDLGFBQTRCLEVBQzVCLG1CQUF3QyxFQUN4QyxnQkFBa0MsRUFDbEMsZ0JBQWtDLEVBQ2xDLGdCQUFrQyxFQUNsQyxhQUE0QixFQUM1QixjQUE4QixFQUM5QixjQUE4QixFQUM5QixNQUFjO1FBRXhCLEtBQUssQ0FDRCxpQkFBaUIsRUFDakIsYUFBYSxFQUNiLGVBQWUsRUFDZixtQkFBbUIsRUFDbkIsZ0JBQWdCLEVBQ2hCLGdCQUFnQixFQUNoQixhQUFhLEVBQ2IsYUFBYSxFQUNiLGNBQWMsRUFDZCxjQUFjLENBQ2pCLENBQUM7UUF4QlEsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNwQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLFdBQU0sR0FBTixNQUFNLENBQVE7SUFjNUIsQ0FBQztJQUVELE9BQU8sQ0FBQyxLQUE2QjtRQUNqQyxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUV0QyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2QsV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ25DO1FBRUQsT0FBTyxRQUFRLENBQUM7WUFDWixJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFDMUIsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDeEYsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7OztZQTFDSixVQUFVLFNBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzs7WUFaeEIsaUJBQWlCO1lBQ2pCLGFBQWE7WUFDYixlQUFlO1lBSWYsYUFBYTtZQUhiLG1CQUFtQjtZQUNuQixnQkFBZ0I7WUFOaEIsZ0JBQWdCO1lBQ2hCLGdCQUFnQjtZQU1oQixhQUFhO1lBSWIsY0FBYztZQUNkLGNBQWM7WUFiVSxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBSb3V0ZXJ9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge01vZHVsZU5hbWVNYXBwZXJ9IGZyb20gJy4uL25hdmlnYXRpb24vbW9kdWxlLW5hbWUtbWFwcGVyL21vZHVsZS1uYW1lLW1hcHBlci5zZXJ2aWNlJztcbmltcG9ydCB7QWN0aW9uTmFtZU1hcHBlcn0gZnJvbSAnLi4vbmF2aWdhdGlvbi9hY3Rpb24tbmFtZS1tYXBwZXIvYWN0aW9uLW5hbWUtbWFwcGVyLnNlcnZpY2UnO1xuaW1wb3J0IHtTeXN0ZW1Db25maWdTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvc3lzdGVtLWNvbmZpZy9zeXN0ZW0tY29uZmlnLnN0b3JlJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtOYXZpZ2F0aW9uU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL25hdmlnYXRpb24vbmF2aWdhdGlvbi5zdG9yZSc7XG5pbXBvcnQge1VzZXJQcmVmZXJlbmNlU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL3VzZXItcHJlZmVyZW5jZS91c2VyLXByZWZlcmVuY2Uuc3RvcmUnO1xuaW1wb3J0IHtUaGVtZUltYWdlc1N0b3JlfSBmcm9tICcuLi8uLi9zdG9yZS90aGVtZS1pbWFnZXMvdGhlbWUtaW1hZ2VzLnN0b3JlJztcbmltcG9ydCB7QXBwU3RhdGVTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvYXBwLXN0YXRlL2FwcC1zdGF0ZS5zdG9yZSc7XG5pbXBvcnQge01ldGFkYXRhU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL21ldGFkYXRhL21ldGFkYXRhLnN0b3JlLnNlcnZpY2UnO1xuaW1wb3J0IHtCYXNlTW9kdWxlUmVzb2x2ZXJ9IGZyb20gJy4vYmFzZS1tb2R1bGUucmVzb2x2ZXInO1xuaW1wb3J0IHtmb3JrSm9pbiwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tICcuLi9tZXNzYWdlL21lc3NhZ2Uuc2VydmljZSc7XG5pbXBvcnQge1JvdXRlQ29udmVydGVyfSBmcm9tIFwiLi4vbmF2aWdhdGlvbi9yb3V0ZS1jb252ZXJ0ZXIvcm91dGUtY29udmVydGVyLnNlcnZpY2VcIjtcblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgQmFzZVJlY29yZFJlc29sdmVyIGV4dGVuZHMgQmFzZU1vZHVsZVJlc29sdmVyIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgc3lzdGVtQ29uZmlnU3RvcmU6IFN5c3RlbUNvbmZpZ1N0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbGFuZ3VhZ2VTdG9yZTogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIG5hdmlnYXRpb25TdG9yZTogTmF2aWdhdGlvblN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbWV0YWRhdGFTdG9yZTogTWV0YWRhdGFTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIHVzZXJQcmVmZXJlbmNlU3RvcmU6IFVzZXJQcmVmZXJlbmNlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCB0aGVtZUltYWdlc1N0b3JlOiBUaGVtZUltYWdlc1N0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbW9kdWxlTmFtZU1hcHBlcjogTW9kdWxlTmFtZU1hcHBlcixcbiAgICAgICAgcHJvdGVjdGVkIGFjdGlvbk5hbWVNYXBwZXI6IEFjdGlvbk5hbWVNYXBwZXIsXG4gICAgICAgIHByb3RlY3RlZCBhcHBTdGF0ZVN0b3JlOiBBcHBTdGF0ZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgcm91dGVDb252ZXJ0ZXI6IFJvdXRlQ29udmVydGVyLFxuICAgICAgICBwcm90ZWN0ZWQgcm91dGVyOiBSb3V0ZXJcbiAgICApIHtcbiAgICAgICAgc3VwZXIoXG4gICAgICAgICAgICBzeXN0ZW1Db25maWdTdG9yZSxcbiAgICAgICAgICAgIGxhbmd1YWdlU3RvcmUsXG4gICAgICAgICAgICBuYXZpZ2F0aW9uU3RvcmUsXG4gICAgICAgICAgICB1c2VyUHJlZmVyZW5jZVN0b3JlLFxuICAgICAgICAgICAgdGhlbWVJbWFnZXNTdG9yZSxcbiAgICAgICAgICAgIG1vZHVsZU5hbWVNYXBwZXIsXG4gICAgICAgICAgICBhcHBTdGF0ZVN0b3JlLFxuICAgICAgICAgICAgbWV0YWRhdGFTdG9yZSxcbiAgICAgICAgICAgIG1lc3NhZ2VTZXJ2aWNlLFxuICAgICAgICAgICAgcm91dGVDb252ZXJ0ZXIsXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmVzb2x2ZShyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIGxldCByb3V0ZU1vZHVsZSA9IHJvdXRlLnBhcmFtcy5tb2R1bGU7XG5cbiAgICAgICAgaWYgKCFyb3V0ZU1vZHVsZSkge1xuICAgICAgICAgICAgcm91dGVNb2R1bGUgPSByb3V0ZS5kYXRhLm1vZHVsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3JrSm9pbih7XG4gICAgICAgICAgICBiYXNlOiBzdXBlci5yZXNvbHZlKHJvdXRlKSxcbiAgICAgICAgICAgIG1ldGFkYXRhOiB0aGlzLm1ldGFkYXRhU3RvcmUubG9hZChyb3V0ZU1vZHVsZSwgdGhpcy5tZXRhZGF0YVN0b3JlLmdldE1ldGFkYXRhVHlwZXMoKSksXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==