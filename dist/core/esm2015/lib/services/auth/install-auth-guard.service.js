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
import { RouteConverter } from '../navigation/route-converter/route-converter.service';
import { AsyncActionService } from '../process/processes/async-action/async-action';
import { MessageService } from '../message/message.service';
import { of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { SystemConfigStore } from '../../store/system-config/system-config.store';
import { AuthService } from './auth.service';
import * as i0 from "@angular/core";
import * as i1 from "../../store/system-config/system-config.store";
import * as i2 from "./auth.service";
import * as i3 from "@angular/router";
import * as i4 from "../navigation/route-converter/route-converter.service";
import * as i5 from "../process/processes/async-action/async-action";
import * as i6 from "../message/message.service";
export class InstallAuthGuard {
    constructor(systemConfigStore, authService, router, routeConverter, asyncActionService, message) {
        this.systemConfigStore = systemConfigStore;
        this.authService = authService;
        this.router = router;
        this.routeConverter = routeConverter;
        this.asyncActionService = asyncActionService;
        this.message = message;
    }
    canActivate(route) {
        return this.canActivateWebInstallation(route);
    }
    /**
 * Allow web installation
 * @returns {object} Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
 * @param activatedRoute
 */
    canActivateWebInstallation(activatedRoute) {
        const homePage = this.systemConfigStore.getHomePage();
        const homePageUrlTree = this.router.parseUrl(homePage);
        // this.message.removeMessages();
        return this.authService.fetchSessionStatus()
            .pipe(take(1), map((user) => {
            if (user && user.appStatus.locked === true && user.appStatus.installed === true) {
                this.message.addDangerMessageByKey('LBL_DISABLED_TITLE_2');
                if (user && user.active === false) {
                    return homePageUrlTree;
                }
                return false;
            }
            if (user && user.active === true) {
                this.authService.logout('', false);
                this.authService.isUserLoggedIn.next(false);
            }
            return true;
        }), catchError(() => of(true)));
    }
}
InstallAuthGuard.ɵprov = i0.ɵɵdefineInjectable({ factory: function InstallAuthGuard_Factory() { return new InstallAuthGuard(i0.ɵɵinject(i1.SystemConfigStore), i0.ɵɵinject(i2.AuthService), i0.ɵɵinject(i3.Router), i0.ɵɵinject(i4.RouteConverter), i0.ɵɵinject(i5.AsyncActionService), i0.ɵɵinject(i6.MessageService)); }, token: InstallAuthGuard, providedIn: "root" });
InstallAuthGuard.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
InstallAuthGuard.ctorParameters = () => [
    { type: SystemConfigStore },
    { type: AuthService },
    { type: Router },
    { type: RouteConverter },
    { type: AsyncActionService },
    { type: MessageService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC1hdXRoLWd1YXJkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc2VydmljZXMvYXV0aC9pbnN0YWxsLWF1dGgtZ3VhcmQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQXNDLE1BQU0sRUFBVSxNQUFNLGlCQUFpQixDQUFDO0FBQ3JGLE9BQU8sRUFBQyxjQUFjLEVBQVksTUFBTSx1REFBdUQsQ0FBQztBQUNoRyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQztBQUNsRixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDMUQsT0FBTyxFQUFhLEVBQUUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwrQ0FBK0MsQ0FBQztBQUNoRixPQUFPLEVBQUMsV0FBVyxFQUFnQixNQUFNLGdCQUFnQixDQUFDOzs7Ozs7OztBQU0xRCxNQUFNLE9BQU8sZ0JBQWdCO0lBQ3pCLFlBQ2MsaUJBQW9DLEVBQ3RDLFdBQXdCLEVBQ3RCLE1BQWMsRUFDZCxjQUE4QixFQUM5QixrQkFBc0MsRUFDdEMsT0FBdUI7UUFMdkIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUN0QyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN0QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7SUFFckMsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFLO1FBRWIsT0FBTyxJQUFJLENBQUMsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVEOzs7O0dBSUQ7SUFDVywwQkFBMEIsQ0FBQyxjQUFzQztRQUd2RSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEQsTUFBTSxlQUFlLEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFaEUsaUNBQWlDO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRTthQUN2QyxJQUFJLENBQ0QsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUNQLEdBQUcsQ0FBQyxDQUFDLElBQW1CLEVBQUUsRUFBRTtZQUV4QixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEtBQUssSUFBSSxFQUFFO2dCQUM3RSxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixDQUFDLENBQUM7Z0JBRTNELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSyxFQUFFO29CQUMvQixPQUFPLGVBQWUsQ0FBQztpQkFDMUI7Z0JBRUQsT0FBTyxLQUFLLENBQUM7YUFDaEI7WUFFRCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTtnQkFDOUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDL0M7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUMsRUFDRixVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQzdCLENBQUM7SUFDVixDQUFDOzs7O1lBdkRKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7O1lBTk8saUJBQWlCO1lBQ2pCLFdBQVc7WUFQMEIsTUFBTTtZQUMzQyxjQUFjO1lBQ2Qsa0JBQWtCO1lBQ2xCLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FjdGl2YXRlZFJvdXRlU25hcHNob3QsIENhbkFjdGl2YXRlLCBSb3V0ZXIsIFVybFRyZWV9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge1JvdXRlQ29udmVydGVyLCBSb3V0ZUluZm99IGZyb20gJy4uL25hdmlnYXRpb24vcm91dGUtY29udmVydGVyL3JvdXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7QXN5bmNBY3Rpb25TZXJ2aWNlfSBmcm9tICcuLi9wcm9jZXNzL3Byb2Nlc3Nlcy9hc3luYy1hY3Rpb24vYXN5bmMtYWN0aW9uJztcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gJy4uL21lc3NhZ2UvbWVzc2FnZS5zZXJ2aWNlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgb2Z9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtjYXRjaEVycm9yLCBtYXAsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7U3lzdGVtQ29uZmlnU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL3N5c3RlbS1jb25maWcvc3lzdGVtLWNvbmZpZy5zdG9yZSc7XG5pbXBvcnQge0F1dGhTZXJ2aWNlLCBTZXNzaW9uU3RhdHVzfSBmcm9tICcuL2F1dGguc2VydmljZSc7XG5cblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBJbnN0YWxsQXV0aEd1YXJkIGltcGxlbWVudHMgQ2FuQWN0aXZhdGUge1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgc3lzdGVtQ29uZmlnU3RvcmU6IFN5c3RlbUNvbmZpZ1N0b3JlLFxuICAgICAgICBwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyLFxuICAgICAgICBwcm90ZWN0ZWQgcm91dGVDb252ZXJ0ZXI6IFJvdXRlQ29udmVydGVyLFxuICAgICAgICBwcm90ZWN0ZWQgYXN5bmNBY3Rpb25TZXJ2aWNlOiBBc3luY0FjdGlvblNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBtZXNzYWdlOiBNZXNzYWdlU2VydmljZVxuICAgICkge1xuICAgIH1cblxuICAgIGNhbkFjdGl2YXRlKHJvdXRlKTogT2JzZXJ2YWJsZTxib29sZWFuIHwgVXJsVHJlZT4gfCBQcm9taXNlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IGJvb2xlYW4gfCBVcmxUcmVlIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5jYW5BY3RpdmF0ZVdlYkluc3RhbGxhdGlvbihyb3V0ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gKiBBbGxvdyB3ZWIgaW5zdGFsbGF0aW9uXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBPYnNlcnZhYmxlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IFByb21pc2U8Ym9vbGVhbiB8IFVybFRyZWU+IHwgYm9vbGVhbiB8IFVybFRyZWVcbiAqIEBwYXJhbSBhY3RpdmF0ZWRSb3V0ZVxuICovXG4gICAgcHJvdGVjdGVkIGNhbkFjdGl2YXRlV2ViSW5zdGFsbGF0aW9uKGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTpcbiAgICBPYnNlcnZhYmxlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IFByb21pc2U8Ym9vbGVhbiB8IFVybFRyZWU+IHwgYm9vbGVhbiB8IFVybFRyZWUge1xuXG4gICAgICAgIGNvbnN0IGhvbWVQYWdlID0gdGhpcy5zeXN0ZW1Db25maWdTdG9yZS5nZXRIb21lUGFnZSgpO1xuICAgICAgICBjb25zdCBob21lUGFnZVVybFRyZWU6IFVybFRyZWUgPSB0aGlzLnJvdXRlci5wYXJzZVVybChob21lUGFnZSk7XG5cbiAgICAgICAgLy8gdGhpcy5tZXNzYWdlLnJlbW92ZU1lc3NhZ2VzKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhTZXJ2aWNlLmZldGNoU2Vzc2lvblN0YXR1cygpXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICAgICAgICAgIG1hcCgodXNlcjogU2Vzc2lvblN0YXR1cykgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VyICYmIHVzZXIuYXBwU3RhdHVzLmxvY2tlZCA9PT0gdHJ1ZSAmJiB1c2VyLmFwcFN0YXR1cy5pbnN0YWxsZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZS5hZGREYW5nZXJNZXNzYWdlQnlLZXkoJ0xCTF9ESVNBQkxFRF9USVRMRV8yJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1c2VyICYmIHVzZXIuYWN0aXZlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBob21lUGFnZVVybFRyZWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VyICYmIHVzZXIuYWN0aXZlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF1dGhTZXJ2aWNlLmxvZ291dCgnJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5pc1VzZXJMb2dnZWRJbi5uZXh0KGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoKCkgPT4gb2YodHJ1ZSkpXG4gICAgICAgICAgICApO1xuICAgIH1cblxufVxuIl19