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
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from 'common';
import { MessageService } from '../message/message.service';
import { StateManager } from '../../store/state-manager';
import { LanguageStore } from '../../store/language/language.store';
import { BnNgIdleService } from 'bn-ng-idle';
import { AppStateStore } from '../../store/app-state/app-state.store';
import { LocalStorageService } from '../local-storage/local-storage.service';
import * as ɵngcc0 from '@angular/core';
export interface SessionStatus {
    appStatus?: AppStatus;
    active?: boolean;
    id?: string;
    firstName?: string;
    lastName?: string;
}
export interface AppStatus {
    installed?: boolean;
    locked?: boolean;
}
export declare class AuthService {
    protected http: HttpClient;
    protected router: Router;
    protected message: MessageService;
    protected stateManager: StateManager;
    protected languageStore: LanguageStore;
    protected bnIdle: BnNgIdleService;
    protected appStateStore: AppStateStore;
    protected localStorage: LocalStorageService;
    currentUser$: Observable<User>;
    isUserLoggedIn: BehaviorSubject<boolean>;
    defaultTimeout: string;
    protected timerSet: boolean;
    protected currentUserSubject: BehaviorSubject<User>;
    constructor(http: HttpClient, router: Router, message: MessageService, stateManager: StateManager, languageStore: LanguageStore, bnIdle: BnNgIdleService, appStateStore: AppStateStore, localStorage: LocalStorageService);
    getCurrentUser(): User;
    setCurrentUser(data: any): void;
    doLogin(username: string, password: string, onSuccess: (response: string) => void, onError: (error: HttpErrorResponse) => void): Subscription;
    /**
     * Logout user
     *
     * @param {string} messageKey of message to display
     * @param {boolean} redirect to home
     */
    logout(messageKey?: string, redirect?: boolean): void;
    /**
     * On logout state reset
     */
    resetState(): void;
    /**
     * Fetch session status from backend
     *
     * @returns {{}} Observable<SessionStatus>
     */
    fetchSessionStatus(): Observable<SessionStatus>;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<AuthService, never>;
}

//# sourceMappingURL=auth.service.d.ts.map