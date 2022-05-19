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
import { Router, UrlTree } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { MessageService } from '../message/message.service';
import { AuthService } from './auth.service';
import { UserPreferenceStore } from '../../store/user-preference/user-preference.store';
import { AsyncActionService } from '../process/processes/async-action/async-action';
import { AppStateStore } from '../../store/app-state/app-state.store';
import { RouteConverter } from '../navigation/route-converter/route-converter.service';
import { isEmptyString } from 'common';
import * as i0 from "@angular/core";
import * as i1 from "../message/message.service";
import * as i2 from "@angular/router";
import * as i3 from "./auth.service";
import * as i4 from "../../store/user-preference/user-preference.store";
import * as i5 from "../process/processes/async-action/async-action";
import * as i6 from "../../store/app-state/app-state.store";
import * as i7 from "../navigation/route-converter/route-converter.service";
export class AuthGuard {
    constructor(message, router, authService, preferences, asyncActionService, appState, routeConverter) {
        this.message = message;
        this.router = router;
        this.authService = authService;
        this.preferences = preferences;
        this.asyncActionService = asyncActionService;
        this.appState = appState;
        this.routeConverter = routeConverter;
    }
    canActivate(route) {
        return this.authorizeUser(route);
    }
    /**
     * Authorize user session and acl together in conjunction
     *
     * @returns {object} Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
     * @param {ActivatedRouteSnapshot} route information about the current route
     */
    authorizeUser(route) {
        // Note: this session and acl are not always booleans
        return forkJoin({
            session: this.authorizeUserSession(route),
            acl: this.authorizeUserACL(route)
        }).pipe(map(({ session, acl }) => {
            if (session instanceof UrlTree) {
                return session;
            }
            if (acl instanceof UrlTree) {
                return acl;
            }
            return session && acl;
        }));
    }
    /**
     * Authorize user acl
     *
     * @returns {object} Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
     * @param {ActivatedRouteSnapshot} activatedRoute information about the current route
     */
    authorizeUserACL(activatedRoute) {
        var _a, _b;
        const routeInfo = this.routeConverter.parseRouteURL(activatedRoute.url);
        const routeURL = (_a = this.appState.getRouteUrl()) !== null && _a !== void 0 ? _a : '';
        if (!routeInfo.module || routeInfo.module === 'home') {
            return of(true);
        }
        const homeUrl = '';
        const homeUrlTree = this.router.parseUrl(homeUrl);
        const actionName = 'user-acl';
        const asyncData = {
            action: actionName,
            module: routeInfo.module,
            payload: {
                routeAction: routeInfo.action,
                record: routeInfo.record,
                routeURL,
                queryParams: (_b = activatedRoute === null || activatedRoute === void 0 ? void 0 : activatedRoute.queryParams) !== null && _b !== void 0 ? _b : []
            }
        };
        return this.asyncActionService.run(actionName, asyncData)
            .pipe(take(1), map((process) => {
            if (process.data && process.data.result === true) {
                return true;
            }
            if (isEmptyString(routeURL)) {
                // Re-direct to home
                return homeUrlTree;
            }
            const currentUrlTree = this.router.parseUrl(this.router.url);
            if (this.routeConverter.isClassicViewRoute(currentUrlTree)) {
                return currentUrlTree;
            }
            return false;
        }), catchError(() => of(homeUrlTree)), tap((result) => result));
    }
    /**
     * Authorize user session
     *
     * @returns {object} Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
     * @param {ActivatedRouteSnapshot} route information about the current route
     */
    authorizeUserSession(route) {
        if (this.authService.isUserLoggedIn.value && route.data.checkSession !== true) {
            return of(true);
        }
        const loginUrl = 'Login';
        const loginUrlTree = this.router.parseUrl(loginUrl);
        return this.authService.fetchSessionStatus()
            .pipe(take(1), map((user) => {
            if (user && user.appStatus.installed === false) {
                return this.router.parseUrl('install');
            }
            if (user && user.active === true) {
                this.authService.setCurrentUser(user);
                return true;
            }
            this.authService.logout('LBL_SESSION_EXPIRED', false);
            this.authService.isUserLoggedIn.next(false);
            // Re-direct to login
            return loginUrlTree;
        }), catchError(() => {
            this.authService.logout('LBL_SESSION_EXPIRED', false);
            return of(loginUrlTree);
        }), tap((result) => {
            if (result === true) {
                this.authService.isUserLoggedIn.next(true);
            }
        }));
    }
}
AuthGuard.ɵprov = i0.ɵɵdefineInjectable({ factory: function AuthGuard_Factory() { return new AuthGuard(i0.ɵɵinject(i1.MessageService), i0.ɵɵinject(i2.Router), i0.ɵɵinject(i3.AuthService), i0.ɵɵinject(i4.UserPreferenceStore), i0.ɵɵinject(i5.AsyncActionService), i0.ɵɵinject(i6.AppStateStore), i0.ɵɵinject(i7.RouteConverter)); }, token: AuthGuard, providedIn: "root" });
AuthGuard.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
AuthGuard.ctorParameters = () => [
    { type: MessageService },
    { type: Router },
    { type: AuthService },
    { type: UserPreferenceStore },
    { type: AsyncActionService },
    { type: AppStateStore },
    { type: RouteConverter }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1ndWFyZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3NlcnZpY2VzL2F1dGgvYXV0aC1ndWFyZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBc0MsTUFBTSxFQUFFLE9BQU8sRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3JGLE9BQU8sRUFBQyxRQUFRLEVBQWMsRUFBRSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzlDLE9BQU8sRUFBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDMUQsT0FBTyxFQUFDLFdBQVcsRUFBZ0IsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxtREFBbUQsQ0FBQztBQUV0RixPQUFPLEVBQW1CLGtCQUFrQixFQUFDLE1BQU0sZ0RBQWdELENBQUM7QUFDcEcsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHVDQUF1QyxDQUFDO0FBQ3BFLE9BQU8sRUFBQyxjQUFjLEVBQVksTUFBTSx1REFBdUQsQ0FBQztBQUNoRyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sUUFBUSxDQUFDOzs7Ozs7Ozs7QUFLckMsTUFBTSxPQUFPLFNBQVM7SUFDbEIsWUFDYyxPQUF1QixFQUN2QixNQUFjLEVBQ2QsV0FBd0IsRUFDeEIsV0FBZ0MsRUFDaEMsa0JBQXNDLEVBQ3RDLFFBQXVCLEVBQ3ZCLGNBQThCO1FBTjlCLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBQ3ZCLFdBQU0sR0FBTixNQUFNLENBQVE7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SSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVDLHFCQUFxQjtZQUNyQixPQUFPLFlBQVksQ0FBQztRQUN4QixDQUFDLENBQUMsRUFDRixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEQsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLEVBQ0YsR0FBRyxDQUFDLENBQUMsTUFBeUIsRUFBRSxFQUFFO1lBQzlCLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTtnQkFDakIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzlDO1FBQ0wsQ0FBQyxDQUFDLENBQ0wsQ0FBQztJQUNWLENBQUM7Ozs7WUFuSkosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFYTyxjQUFjO1lBSHVCLE1BQU07WUFJM0MsV0FBVztZQUNYLG1CQUFtQjtZQUVELGtCQUFrQjtZQUNwQyxhQUFhO1lBQ2IsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgQ2FuQWN0aXZhdGUsIFJvdXRlciwgVXJsVHJlZX0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7Zm9ya0pvaW4sIE9ic2VydmFibGUsIG9mfSBmcm9tICdyeGpzJztcbmltcG9ydCB7Y2F0Y2hFcnJvciwgbWFwLCB0YWtlLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gJy4uL21lc3NhZ2UvbWVzc2FnZS5zZXJ2aWNlJztcbmltcG9ydCB7QXV0aFNlcnZpY2UsIFNlc3Npb25TdGF0dXN9IGZyb20gJy4vYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7VXNlclByZWZlcmVuY2VTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvdXNlci1wcmVmZXJlbmNlL3VzZXItcHJlZmVyZW5jZS5zdG9yZSc7XG5pbXBvcnQge1Byb2Nlc3N9IGZyb20gJy4uL3Byb2Nlc3MvcHJvY2Vzcy5zZXJ2aWNlJztcbmltcG9ydCB7QXN5bmNBY3Rpb25JbnB1dCwgQXN5bmNBY3Rpb25TZXJ2aWNlfSBmcm9tICcuLi9wcm9jZXNzL3Byb2Nlc3Nlcy9hc3luYy1hY3Rpb24vYXN5bmMtYWN0aW9uJztcbmltcG9ydCB7QXBwU3RhdGVTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvYXBwLXN0YXRlL2FwcC1zdGF0ZS5zdG9yZSc7XG5pbXBvcnQge1JvdXRlQ29udmVydGVyLCBSb3V0ZUluZm99IGZyb20gJy4uL25hdmlnYXRpb24vcm91dGUtY29udmVydGVyL3JvdXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7aXNFbXB0eVN0cmluZ30gZnJvbSAnY29tbW9uJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBBdXRoR3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBtZXNzYWdlOiBNZXNzYWdlU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyLFxuICAgICAgICBwcm90ZWN0ZWQgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgcHJlZmVyZW5jZXM6IFVzZXJQcmVmZXJlbmNlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBhc3luY0FjdGlvblNlcnZpY2U6IEFzeW5jQWN0aW9uU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIGFwcFN0YXRlOiBBcHBTdGF0ZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgcm91dGVDb252ZXJ0ZXI6IFJvdXRlQ29udmVydGVyXG4gICAgKSB7XG4gICAgfVxuXG4gICAgY2FuQWN0aXZhdGUocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOlxuICAgIE9ic2VydmFibGU8Ym9vbGVhbiB8IFVybFRyZWU+IHwgUHJvbWlzZTxib29sZWFuIHwgVXJsVHJlZT4gfCBib29sZWFuIHwgVXJsVHJlZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhvcml6ZVVzZXIocm91dGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF1dGhvcml6ZSB1c2VyIHNlc3Npb24gYW5kIGFjbCB0b2dldGhlciBpbiBjb25qdW5jdGlvblxuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxib29sZWFuIHwgVXJsVHJlZT4gfCBQcm9taXNlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IGJvb2xlYW4gfCBVcmxUcmVlXG4gICAgICogQHBhcmFtIHtBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90fSByb3V0ZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudCByb3V0ZVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhdXRob3JpemVVc2VyKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogT2JzZXJ2YWJsZTxib29sZWFuIHwgVXJsVHJlZT4gfCBQcm9taXNlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IGJvb2xlYW4gfCBVcmxUcmVlIHtcbiAgICAgICAgLy8gTm90ZTogdGhpcyBzZXNzaW9uIGFuZCBhY2wgYXJlIG5vdCBhbHdheXMgYm9vbGVhbnNcbiAgICAgICAgcmV0dXJuIGZvcmtKb2luKHtcbiAgICAgICAgICAgIHNlc3Npb246IHRoaXMuYXV0aG9yaXplVXNlclNlc3Npb24ocm91dGUpLFxuICAgICAgICAgICAgYWNsOiB0aGlzLmF1dGhvcml6ZVVzZXJBQ0wocm91dGUpXG4gICAgICAgIH0pLnBpcGUobWFwKCh7c2Vzc2lvbiwgYWNsfSkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoc2Vzc2lvbiBpbnN0YW5jZW9mIFVybFRyZWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhY2wgaW5zdGFuY2VvZiBVcmxUcmVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZXNzaW9uICYmIGFjbDtcbiAgICAgICAgfVxuICAgICAgICApKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdXRob3JpemUgdXNlciBhY2xcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IE9ic2VydmFibGU8Ym9vbGVhbiB8IFVybFRyZWU+IHwgUHJvbWlzZTxib29sZWFuIHwgVXJsVHJlZT4gfCBib29sZWFuIHwgVXJsVHJlZVxuICAgICAqIEBwYXJhbSB7QWN0aXZhdGVkUm91dGVTbmFwc2hvdH0gYWN0aXZhdGVkUm91dGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGN1cnJlbnQgcm91dGVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXV0aG9yaXplVXNlckFDTChhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6XG4gICAgT2JzZXJ2YWJsZTxib29sZWFuIHwgVXJsVHJlZT4gfCBQcm9taXNlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IGJvb2xlYW4gfCBVcmxUcmVlIHtcblxuICAgICAgICBjb25zdCByb3V0ZUluZm86IFJvdXRlSW5mbyA9IHRoaXMucm91dGVDb252ZXJ0ZXIucGFyc2VSb3V0ZVVSTChhY3RpdmF0ZWRSb3V0ZS51cmwpO1xuXG4gICAgICAgIGNvbnN0IHJvdXRlVVJMOiBzdHJpbmcgPSB0aGlzLmFwcFN0YXRlLmdldFJvdXRlVXJsKCkgPz8gJyc7XG5cbiAgICAgICAgaWYgKCFyb3V0ZUluZm8ubW9kdWxlIHx8IHJvdXRlSW5mby5tb2R1bGUgPT09ICdob21lJykge1xuICAgICAgICAgICAgcmV0dXJuIG9mKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaG9tZVVybCA9ICcnO1xuICAgICAgICBjb25zdCBob21lVXJsVHJlZTogVXJsVHJlZSA9IHRoaXMucm91dGVyLnBhcnNlVXJsKGhvbWVVcmwpO1xuXG4gICAgICAgIGNvbnN0IGFjdGlvbk5hbWUgPSAndXNlci1hY2wnO1xuXG4gICAgICAgIGNvbnN0IGFzeW5jRGF0YSA9IHtcbiAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uTmFtZSxcbiAgICAgICAgICAgIG1vZHVsZTogcm91dGVJbmZvLm1vZHVsZSxcbiAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgICByb3V0ZUFjdGlvbjogcm91dGVJbmZvLmFjdGlvbixcbiAgICAgICAgICAgICAgICByZWNvcmQ6IHJvdXRlSW5mby5yZWNvcmQsXG4gICAgICAgICAgICAgICAgcm91dGVVUkwsXG4gICAgICAgICAgICAgICAgcXVlcnlQYXJhbXM6IGFjdGl2YXRlZFJvdXRlPy5xdWVyeVBhcmFtcyA/PyBbXVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGFzIEFzeW5jQWN0aW9uSW5wdXQ7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXN5bmNBY3Rpb25TZXJ2aWNlLnJ1bihhY3Rpb25OYW1lLCBhc3luY0RhdGEpXG4gICAgICAgICAgICAucGlwZSh0YWtlKDEpLFxuICAgICAgICAgICAgICAgIG1hcCgocHJvY2VzczogUHJvY2VzcykgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzLmRhdGEgJiYgcHJvY2Vzcy5kYXRhLnJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eVN0cmluZyhyb3V0ZVVSTCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlLWRpcmVjdCB0byBob21lXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaG9tZVVybFRyZWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VXJsVHJlZTogVXJsVHJlZSA9IHRoaXMucm91dGVyLnBhcnNlVXJsKHRoaXMucm91dGVyLnVybCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5yb3V0ZUNvbnZlcnRlci5pc0NsYXNzaWNWaWV3Um91dGUoY3VycmVudFVybFRyZWUpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50VXJsVHJlZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKCgpID0+IG9mKGhvbWVVcmxUcmVlKSksXG4gICAgICAgICAgICAgICAgdGFwKChyZXN1bHQ6IGJvb2xlYW4gfCBVcmxUcmVlKSA9PiByZXN1bHQpXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF1dGhvcml6ZSB1c2VyIHNlc3Npb25cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IE9ic2VydmFibGU8Ym9vbGVhbiB8IFVybFRyZWU+IHwgUHJvbWlzZTxib29sZWFuIHwgVXJsVHJlZT4gfCBib29sZWFuIHwgVXJsVHJlZVxuICAgICAqIEBwYXJhbSB7QWN0aXZhdGVkUm91dGVTbmFwc2hvdH0gcm91dGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGN1cnJlbnQgcm91dGVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXV0aG9yaXplVXNlclNlc3Npb24ocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOlxuICAgIE9ic2VydmFibGU8Ym9vbGVhbiB8IFVybFRyZWU+IHwgUHJvbWlzZTxib29sZWFuIHwgVXJsVHJlZT4gfCBib29sZWFuIHwgVXJsVHJlZSB7XG5cbiAgICAgICAgaWYgKHRoaXMuYXV0aFNlcnZpY2UuaXNVc2VyTG9nZ2VkSW4udmFsdWUgJiYgcm91dGUuZGF0YS5jaGVja1Nlc3Npb24gIT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBvZih0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxvZ2luVXJsID0gJ0xvZ2luJztcbiAgICAgICAgY29uc3QgbG9naW5VcmxUcmVlOiBVcmxUcmVlID0gdGhpcy5yb3V0ZXIucGFyc2VVcmwobG9naW5VcmwpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhTZXJ2aWNlLmZldGNoU2Vzc2lvblN0YXR1cygpXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICAgICAgICAgIG1hcCgodXNlcjogU2Vzc2lvblN0YXR1cykgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VyICYmIHVzZXIuYXBwU3RhdHVzLmluc3RhbGxlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJvdXRlci5wYXJzZVVybCgnaW5zdGFsbCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXIgJiYgdXNlci5hY3RpdmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZpY2Uuc2V0Q3VycmVudFVzZXIodXNlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmF1dGhTZXJ2aWNlLmxvZ291dCgnTEJMX1NFU1NJT05fRVhQSVJFRCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5pc1VzZXJMb2dnZWRJbi5uZXh0KGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gUmUtZGlyZWN0IHRvIGxvZ2luXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsb2dpblVybFRyZWU7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXV0aFNlcnZpY2UubG9nb3V0KCdMQkxfU0VTU0lPTl9FWFBJUkVEJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2YobG9naW5VcmxUcmVlKTtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICB0YXAoKHJlc3VsdDogYm9vbGVhbiB8IFVybFRyZWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRoU2VydmljZS5pc1VzZXJMb2dnZWRJbi5uZXh0KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgfVxufVxuXG5cbiJdfQ==