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

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, UrlTree} from '@angular/router';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, map, take, tap} from 'rxjs/operators';
import {MessageService} from '../message/message.service';
import {AuthService, SessionStatus} from './auth.service';
import {UserPreferenceStore} from '../../store/user-preference/user-preference.store';
import {Process} from '../process/process.service';
import {AsyncActionInput, AsyncActionService} from '../process/processes/async-action/async-action';
import {AppStateStore} from '../../store/app-state/app-state.store';
import {RouteConverter, RouteInfo} from '../navigation/route-converter/route-converter.service';
import {isEmptyString} from 'common';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        protected message: MessageService,
        protected router: Router,
        protected authService: AuthService,
        protected preferences: UserPreferenceStore,
        protected asyncActionService: AsyncActionService,
        protected appState: AppStateStore,
        protected routeConverter: RouteConverter
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authorizeUser(route);
    }

    /**
     * Authorize user session and acl together in conjunction
     *
     * @returns {object} Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
     * @param {ActivatedRouteSnapshot} route information about the current route
     */
    protected authorizeUser(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // Note: this session and acl are not always booleans
        return forkJoin({
            session: this.authorizeUserSession(route),
            acl: this.authorizeUserACL(route)
        }).pipe(map(({session, acl}) => {

            if (session instanceof UrlTree) {
                return session;
            }
            if (acl instanceof UrlTree) {
                return acl;
            }
            return session && acl;
        }
        ));
    }

    /**
     * Authorize user acl
     *
     * @returns {object} Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
     * @param {ActivatedRouteSnapshot} activatedRoute information about the current route
     */
    protected authorizeUserACL(activatedRoute: ActivatedRouteSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const routeInfo: RouteInfo = this.routeConverter.parseRouteURL(activatedRoute.url);

        const routeURL: string = this.appState.getRouteUrl() ?? '';

        if (!routeInfo.module || routeInfo.module === 'home') {
            return of(true);
        }

        const homeUrl = '';
        const homeUrlTree: UrlTree = this.router.parseUrl(homeUrl);

        const actionName = 'user-acl';

        const asyncData = {
            action: actionName,
            module: routeInfo.module,
            payload: {
                routeAction: routeInfo.action,
                record: routeInfo.record,
                routeURL,
                queryParams: activatedRoute?.queryParams ?? []
            }
        } as AsyncActionInput;

        return this.asyncActionService.run(actionName, asyncData)
            .pipe(take(1),
                map((process: Process) => {

                    if (process.data && process.data.result === true) {
                        return true;
                    }

                    if (isEmptyString(routeURL)) {
                        // Re-direct to home
                        return homeUrlTree;
                    }

                    const currentUrlTree: UrlTree = this.router.parseUrl(this.router.url);

                    if(this.routeConverter.isClassicViewRoute(currentUrlTree)){
                        return currentUrlTree;
                    }

                    return false;
                }),
                catchError(() => of(homeUrlTree)),
                tap((result: boolean | UrlTree) => result)
            );
    }

    /**
     * Authorize user session
     *
     * @returns {object} Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
     * @param {ActivatedRouteSnapshot} route information about the current route
     */
    protected authorizeUserSession(route: ActivatedRouteSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.authService.isUserLoggedIn.value && route.data.checkSession !== true) {
            return of(true);
        }

        const loginUrl = 'Login';
        const loginUrlTree: UrlTree = this.router.parseUrl(loginUrl);

        return this.authService.fetchSessionStatus()
            .pipe(
                take(1),
                map((user: SessionStatus) => {

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
                }),
                catchError(() => {
                    this.authService.logout('LBL_SESSION_EXPIRED', false);
                    return of(loginUrlTree);
                }),
                tap((result: boolean | UrlTree) => {
                    if (result === true) {
                        this.authService.isUserLoggedIn.next(true);
                    }
                })
            );
    }
}


