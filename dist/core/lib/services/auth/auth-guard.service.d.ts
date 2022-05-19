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
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageService } from '../message/message.service';
import { AuthService } from './auth.service';
import { UserPreferenceStore } from '../../store/user-preference/user-preference.store';
import { AsyncActionService } from '../process/processes/async-action/async-action';
import { AppStateStore } from '../../store/app-state/app-state.store';
import { RouteConverter } from '../navigation/route-converter/route-converter.service';
import * as ɵngcc0 from '@angular/core';
export declare class AuthGuard implements CanActivate {
    protected message: MessageService;
    protected router: Router;
    protected authService: AuthService;
    protected preferences: UserPreferenceStore;
    protected asyncActionService: AsyncActionService;
    protected appState: AppStateStore;
    protected routeConverter: RouteConverter;
    constructor(message: MessageService, router: Router, authService: AuthService, preferences: UserPreferenceStore, asyncActionService: AsyncActionService, appState: AppStateStore, routeConverter: RouteConverter);
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
    /**
     * Authorize user session and acl together in conjunction
     *
     * @returns {object} Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
     * @param {ActivatedRouteSnapshot} route information about the current route
     */
    protected authorizeUser(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
    /**
     * Authorize user acl
     *
     * @returns {object} Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
     * @param {ActivatedRouteSnapshot} activatedRoute information about the current route
     */
    protected authorizeUserACL(activatedRoute: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
    /**
     * Authorize user session
     *
     * @returns {object} Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
     * @param {ActivatedRouteSnapshot} route information about the current route
     */
    protected authorizeUserSession(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<AuthGuard, never>;
}

//# sourceMappingURL=auth-guard.service.d.ts.map