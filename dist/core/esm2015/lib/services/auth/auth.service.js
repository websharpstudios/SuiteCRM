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
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, finalize, take } from 'rxjs/operators';
import { MessageService } from '../message/message.service';
import { StateManager } from '../../store/state-manager';
import { LanguageStore } from '../../store/language/language.store';
import { BnNgIdleService } from 'bn-ng-idle';
import { AppStateStore } from '../../store/app-state/app-state.store';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { isEmptyString } from 'common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "@angular/router";
import * as i3 from "../message/message.service";
import * as i4 from "../../store/state-manager";
import * as i5 from "../../store/language/language.store";
import * as i6 from "bn-ng-idle";
import * as i7 from "../../store/app-state/app-state.store";
import * as i8 from "../local-storage/local-storage.service";
export class AuthService {
    constructor(http, router, message, stateManager, languageStore, bnIdle, appStateStore, localStorage) {
        this.http = http;
        this.router = router;
        this.message = message;
        this.stateManager = stateManager;
        this.languageStore = languageStore;
        this.bnIdle = bnIdle;
        this.appStateStore = appStateStore;
        this.localStorage = localStorage;
        this.isUserLoggedIn = new BehaviorSubject(false);
        this.defaultTimeout = '3600';
        this.timerSet = false;
        this.currentUserSubject = new BehaviorSubject({});
        this.currentUser$ = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
    }
    getCurrentUser() {
        return this.currentUserSubject.value;
    }
    setCurrentUser(data) {
        this.currentUserSubject.next(data);
        this.isUserLoggedIn.next(true);
    }
    doLogin(username, password, onSuccess, onError) {
        const loginUrl = 'login';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post(loginUrl, {
            username,
            password
        }, { headers }).subscribe((response) => {
            onSuccess(response);
            this.isUserLoggedIn.next(true);
            this.setCurrentUser(response);
            const duration = response.duration;
            if (duration === 0 || duration === '0') {
                return;
            }
            if (duration) {
                this.defaultTimeout = duration;
            }
            this.bnIdle.startWatching(this.defaultTimeout).subscribe((res) => {
                if (res && this.isUserLoggedIn.value === true) {
                    this.message.removeMessages();
                    this.logout('LBL_SESSION_EXPIRED');
                }
            });
            this.timerSet = true;
        }, (error) => {
            onError(error);
        });
    }
    /**
     * Logout user
     *
     * @param {string} messageKey of message to display
     * @param {boolean} redirect to home
     */
    logout(messageKey = 'LBL_LOGOUT_SUCCESS', redirect = true) {
        this.appStateStore.updateLoading('logout', true);
        const logoutUrl = 'logout';
        const body = new HttpParams();
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        this.resetState();
        this.http.post(logoutUrl, body.toString(), { headers, responseType: 'text' })
            .pipe(take(1), catchError(err => {
            this.message.log('Logout failed');
            return throwError(err);
        }), finalize(() => {
            this.appStateStore.updateLoading('logout', false);
            if (redirect === true) {
                this.router.navigate(['/Login']).finally();
            }
        }))
            .subscribe(() => {
            if (this.timerSet) {
                this.bnIdle.resetTimer();
                this.bnIdle.stopTimer();
                this.timerSet = false;
            }
            this.message.log('Logout success');
            if (!isEmptyString(messageKey)) {
                this.message.addSuccessMessageByKey(messageKey);
            }
        }, () => {
            this.message.log('Error on logout');
            if (!isEmptyString(messageKey)) {
                this.message.addSuccessMessageByKey(messageKey);
            }
        });
    }
    /**
     * On logout state reset
     */
    resetState() {
        this.stateManager.clearAuthBased();
        this.localStorage.clear();
        this.isUserLoggedIn.next(false);
    }
    /**
     * Fetch session status from backend
     *
     * @returns {{}} Observable<SessionStatus>
     */
    fetchSessionStatus() {
        const Url = 'session-status';
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this.http.get(Url, { headers });
    }
}
AuthService.ɵprov = i0.ɵɵdefineInjectable({ factory: function AuthService_Factory() { return new AuthService(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.Router), i0.ɵɵinject(i3.MessageService), i0.ɵɵinject(i4.StateManager), i0.ɵɵinject(i5.LanguageStore), i0.ɵɵinject(i6.BnNgIdleService), i0.ɵɵinject(i7.AppStateStore), i0.ɵɵinject(i8.LocalStorageService)); }, token: AuthService, providedIn: "root" });
AuthService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
AuthService.ctorParameters = () => [
    { type: HttpClient },
    { type: Router },
    { type: MessageService },
    { type: StateManager },
    { type: LanguageStore },
    { type: BnNgIdleService },
    { type: AppStateStore },
    { type: LocalStorageService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3NlcnZpY2VzL2F1dGgvYXV0aC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN2QyxPQUFPLEVBQUMsVUFBVSxFQUFxQixXQUFXLEVBQUUsVUFBVSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDNUYsT0FBTyxFQUFDLGVBQWUsRUFBNEIsVUFBVSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzNFLE9BQU8sRUFBQyxVQUFVLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRWhGLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUMxRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDM0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHVDQUF1QyxDQUFDO0FBQ3BFLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxRQUFRLENBQUM7Ozs7Ozs7Ozs7QUFrQnJDLE1BQU0sT0FBTyxXQUFXO0lBUXBCLFlBQ2MsSUFBZ0IsRUFDaEIsTUFBYyxFQUNkLE9BQXVCLEVBQ3ZCLFlBQTBCLEVBQzFCLGFBQTRCLEVBQzVCLE1BQXVCLEVBQ3ZCLGFBQTRCLEVBQzVCLFlBQWlDO1FB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SUFBRyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNuRDtRQUNMLENBQUMsRUFDRCxHQUFHLEVBQUU7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3BDLElBQUcsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDbkQ7UUFDTCxDQUFDLENBQ0osQ0FBQztJQUNWLENBQUM7SUFFRDs7T0FFRztJQUNJLFVBQVU7UUFDYixJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxrQkFBa0I7UUFFckIsTUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUM7UUFDN0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLDJCQUEyQixDQUFDLENBQUM7UUFFbkYsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Ozs7WUF4SkosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUEzQk8sVUFBVTtZQURWLE1BQU07WUFLTixjQUFjO1lBQ2QsWUFBWTtZQUNaLGFBQWE7WUFDYixlQUFlO1lBQ2YsYUFBYTtZQUNiLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Um91dGVyfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwRXJyb3JSZXNwb25zZSwgSHR0cEhlYWRlcnMsIEh0dHBQYXJhbXN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24sIHRocm93RXJyb3J9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtjYXRjaEVycm9yLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgZmluYWxpemUsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7VXNlcn0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gJy4uL21lc3NhZ2UvbWVzc2FnZS5zZXJ2aWNlJztcbmltcG9ydCB7U3RhdGVNYW5hZ2VyfSBmcm9tICcuLi8uLi9zdG9yZS9zdGF0ZS1tYW5hZ2VyJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtCbk5nSWRsZVNlcnZpY2V9IGZyb20gJ2JuLW5nLWlkbGUnO1xuaW1wb3J0IHtBcHBTdGF0ZVN0b3JlfSBmcm9tICcuLi8uLi9zdG9yZS9hcHAtc3RhdGUvYXBwLXN0YXRlLnN0b3JlJztcbmltcG9ydCB7TG9jYWxTdG9yYWdlU2VydmljZX0gZnJvbSAnLi4vbG9jYWwtc3RvcmFnZS9sb2NhbC1zdG9yYWdlLnNlcnZpY2UnO1xuaW1wb3J0IHtpc0VtcHR5U3RyaW5nfSBmcm9tICdjb21tb24nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlc3Npb25TdGF0dXMge1xuICAgIGFwcFN0YXR1cz86IEFwcFN0YXR1cztcbiAgICBhY3RpdmU/OiBib29sZWFuO1xuICAgIGlkPzogc3RyaW5nO1xuICAgIGZpcnN0TmFtZT86IHN0cmluZztcbiAgICBsYXN0TmFtZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBcHBTdGF0dXMge1xuICAgIGluc3RhbGxlZD86IGJvb2xlYW47XG4gICAgbG9ja2VkPzogYm9vbGVhbjtcbn1cblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBBdXRoU2VydmljZSB7XG5cbiAgICBjdXJyZW50VXNlciQ6IE9ic2VydmFibGU8VXNlcj47XG4gICAgaXNVc2VyTG9nZ2VkSW46IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICAgIGRlZmF1bHRUaW1lb3V0ID0gJzM2MDAnO1xuICAgIHByb3RlY3RlZCB0aW1lclNldCA9IGZhbHNlO1xuICAgIHByb3RlY3RlZCBjdXJyZW50VXNlclN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFVzZXI+KHt9IGFzIFVzZXIpO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBodHRwOiBIdHRwQ2xpZW50LFxuICAgICAgICBwcm90ZWN0ZWQgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByb3RlY3RlZCBtZXNzYWdlOiBNZXNzYWdlU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIHN0YXRlTWFuYWdlcjogU3RhdGVNYW5hZ2VyLFxuICAgICAgICBwcm90ZWN0ZWQgbGFuZ3VhZ2VTdG9yZTogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIGJuSWRsZTogQm5OZ0lkbGVTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgYXBwU3RhdGVTdG9yZTogQXBwU3RhdGVTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIGxvY2FsU3RvcmFnZTogTG9jYWxTdG9yYWdlU2VydmljZVxuICAgICkge1xuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyJCA9IHRoaXMuY3VycmVudFVzZXJTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG4gICAgfVxuXG4gICAgZ2V0Q3VycmVudFVzZXIoKTogVXNlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRVc2VyU3ViamVjdC52YWx1ZTtcbiAgICB9XG5cbiAgICBzZXRDdXJyZW50VXNlcihkYXRhKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3VycmVudFVzZXJTdWJqZWN0Lm5leHQoZGF0YSk7XG4gICAgICAgIHRoaXMuaXNVc2VyTG9nZ2VkSW4ubmV4dCh0cnVlKTtcbiAgICB9XG5cbiAgICBkb0xvZ2luKFxuICAgICAgICB1c2VybmFtZTogc3RyaW5nLFxuICAgICAgICBwYXNzd29yZDogc3RyaW5nLFxuICAgICAgICBvblN1Y2Nlc3M6IChyZXNwb25zZTogc3RyaW5nKSA9PiB2b2lkLFxuICAgICAgICBvbkVycm9yOiAoZXJyb3I6IEh0dHBFcnJvclJlc3BvbnNlKSA9PiB2b2lkXG4gICAgKTogU3Vic2NyaXB0aW9uIHtcbiAgICAgICAgY29uc3QgbG9naW5VcmwgPSAnbG9naW4nO1xuXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxuICAgICAgICAgICAgbG9naW5VcmwsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7aGVhZGVyc31cbiAgICAgICAgKS5zdWJzY3JpYmUoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgICAgIG9uU3VjY2VzcyhyZXNwb25zZSk7XG4gICAgICAgICAgICB0aGlzLmlzVXNlckxvZ2dlZEluLm5leHQodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnNldEN1cnJlbnRVc2VyKHJlc3BvbnNlKTtcblxuICAgICAgICAgICAgY29uc3QgZHVyYXRpb24gPSByZXNwb25zZS5kdXJhdGlvbjtcblxuICAgICAgICAgICAgaWYgKGR1cmF0aW9uID09PSAwIHx8IGR1cmF0aW9uID09PSAnMCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkdXJhdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFRpbWVvdXQgPSBkdXJhdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5ibklkbGUuc3RhcnRXYXRjaGluZyh0aGlzLmRlZmF1bHRUaW1lb3V0KS5zdWJzY3JpYmUoKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXMgJiYgdGhpcy5pc1VzZXJMb2dnZWRJbi52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UucmVtb3ZlTWVzc2FnZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dvdXQoJ0xCTF9TRVNTSU9OX0VYUElSRUQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy50aW1lclNldCA9IHRydWU7XG4gICAgICAgIH0sIChlcnJvcjogSHR0cEVycm9yUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIG9uRXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2dvdXQgdXNlclxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VLZXkgb2YgbWVzc2FnZSB0byBkaXNwbGF5XG4gICAgICogQHBhcmFtIHtib29sZWFufSByZWRpcmVjdCB0byBob21lXG4gICAgICovXG4gICAgcHVibGljIGxvZ291dChtZXNzYWdlS2V5ID0gJ0xCTF9MT0dPVVRfU1VDQ0VTUycsIHJlZGlyZWN0ID0gdHJ1ZSk6IHZvaWQge1xuICAgICAgICB0aGlzLmFwcFN0YXRlU3RvcmUudXBkYXRlTG9hZGluZygnbG9nb3V0JywgdHJ1ZSk7XG5cbiAgICAgICAgY29uc3QgbG9nb3V0VXJsID0gJ2xvZ291dCc7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBuZXcgSHR0cFBhcmFtcygpO1xuXG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKS5zZXQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3BsYWluOyBjaGFyc2V0PXV0Zi04Jyk7XG5cbiAgICAgICAgdGhpcy5yZXNldFN0YXRlKCk7XG5cbiAgICAgICAgdGhpcy5odHRwLnBvc3QobG9nb3V0VXJsLCBib2R5LnRvU3RyaW5nKCksIHtoZWFkZXJzLCByZXNwb25zZVR5cGU6ICd0ZXh0J30pXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlLmxvZygnTG9nb3V0IGZhaWxlZCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGZpbmFsaXplKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBTdGF0ZVN0b3JlLnVwZGF0ZUxvYWRpbmcoJ2xvZ291dCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZGlyZWN0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJy9Mb2dpbiddKS5maW5hbGx5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRpbWVyU2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJuSWRsZS5yZXNldFRpbWVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJuSWRsZS5zdG9wVGltZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXJTZXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZS5sb2coJ0xvZ291dCBzdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFpc0VtcHR5U3RyaW5nKG1lc3NhZ2VLZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UuYWRkU3VjY2Vzc01lc3NhZ2VCeUtleShtZXNzYWdlS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UubG9nKCdFcnJvciBvbiBsb2dvdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWlzRW1wdHlTdHJpbmcobWVzc2FnZUtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZS5hZGRTdWNjZXNzTWVzc2FnZUJ5S2V5KG1lc3NhZ2VLZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBsb2dvdXQgc3RhdGUgcmVzZXRcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVzZXRTdGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGF0ZU1hbmFnZXIuY2xlYXJBdXRoQmFzZWQoKTtcbiAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5pc1VzZXJMb2dnZWRJbi5uZXh0KGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaCBzZXNzaW9uIHN0YXR1cyBmcm9tIGJhY2tlbmRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHt7fX0gT2JzZXJ2YWJsZTxTZXNzaW9uU3RhdHVzPlxuICAgICAqL1xuICAgIHB1YmxpYyBmZXRjaFNlc3Npb25TdGF0dXMoKTogT2JzZXJ2YWJsZTxTZXNzaW9uU3RhdHVzPiB7XG5cbiAgICAgICAgY29uc3QgVXJsID0gJ3Nlc3Npb24tc3RhdHVzJztcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpLnNldCgnQ29udGVudC1UeXBlJywgJ3RleHQvcGxhaW47IGNoYXJzZXQ9dXRmLTgnKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldChVcmwsIHtoZWFkZXJzfSk7XG4gICAgfVxufVxuIl19