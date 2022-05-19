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
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { RecoverPasswordService } from '../../../../services/process/processes/recover-password/recover-password';
import { SystemConfigStore } from '../../../../store/system-config/system-config.store';
import { AuthService } from '../../../../services/auth/auth.service';
import { LanguageStore } from '../../../../store/language/language.store';
import { MessageService } from '../../../../services/message/message.service';
export class LoginUiComponent {
    constructor(router, auth, message, systemConfigStore, languageStore, recoverPasswordService) {
        this.router = router;
        this.auth = auth;
        this.message = message;
        this.systemConfigStore = systemConfigStore;
        this.languageStore = languageStore;
        this.recoverPasswordService = recoverPasswordService;
        this.hidden = true;
        this.loading = false;
        this.error = '';
        this.uname = '';
        this.passw = '';
        this.email = '';
        this.cardState = 'front';
        this.systemConfigs$ = this.systemConfigStore.configs$;
        this.appStrings$ = this.languageStore.appStrings$;
        this.vm$ = combineLatest([this.systemConfigs$, this.appStrings$]).pipe(map(([systemConfigs, appStrings]) => {
            let showLanguages = false;
            let showForgotPassword = false;
            if (systemConfigs.languages && systemConfigs.languages.items) {
                showLanguages = Object.keys(systemConfigs.languages.items).length > 1;
            }
            if (systemConfigs.passwordsetting && systemConfigs.passwordsetting.items) {
                const forgotPasswordProperty = systemConfigs.passwordsetting.items.forgotpasswordON;
                showForgotPassword = [true, '1', 'true'].includes(forgotPasswordProperty);
            }
            return {
                systemConfigs,
                appStrings,
                showLanguages,
                showForgotPassword
            };
        }));
        this.loading = false;
        this.hidden = false;
    }
    doLanguageChange(language) {
        this.languageStore.changeLanguage(language);
    }
    doGetCurrentLanguage() {
        return this.languageStore.getCurrentLanguage();
    }
    flipCard() {
        if (this.cardState === 'front') {
            this.cardState = 'back';
        }
        else {
            this.cardState = 'front';
        }
    }
    doLogin() {
        this.loading = true;
        this.auth.doLogin(this.uname, this.passw, this.onLoginSuccess.bind(this), this.onLoginError.bind(this));
    }
    recoverPassword() {
        this.recoverPasswordService
            .run(this.uname, this.email)
            .subscribe((process) => {
            this.message.log('Recover Password Status: ' + process.status);
            let handler = 'addSuccessMessageByKey';
            if (process.status === 'error') {
                handler = 'addDangerMessageByKey';
            }
            if (process.messages) {
                process.messages.forEach(message => {
                    this.message[handler](message);
                });
            }
        }, () => {
            this.message.log('Recover Password failed');
            this.message.addDangerMessageByKey('ERR_AJAX_LOAD_FAILURE');
        });
    }
    onLoginSuccess(result) {
        this.loading = false;
        this.message.log('Login success');
        this.message.removeMessages();
        if (result && result.redirect) {
            this.router.navigate([result.redirect]).then();
        }
        else {
            const defaultModule = this.systemConfigStore.getHomePage();
            this.router.navigate(['/' + defaultModule]).then();
        }
        return;
    }
    onLoginError() {
        this.loading = false;
        this.message.log('Login failed');
        this.message.addDangerMessage('Login credentials incorrect, please try again.');
    }
}
LoginUiComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-login-ui',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<div *ngIf=\"(vm$ | async) as vm\" class=\"login-view d-flex align-items-center\">\n\n    <!-- Start of login form section -->\n\n    <form name=\"login\" class=\"login-form\" #loginForm=\"ngForm\">\n        <div class=\"form-row form-group\">\n            <div class=\"col\">\n                <scrm-logo-ui></scrm-logo-ui>\n            </div>\n        </div>\n        <div class=\"form-row\" *ngIf=\"vm.showLanguages\">\n            <div class=\"col\">\n                <label class=\"\" for=\"languages\">{{vm.appStrings['LBL_LANGUAGE']}}</label>\n            </div>\n            <div class=\"w-100\"></div>\n            <div class=\"col\">\n                <div class=\"inner-addon left-addon\">\n                    <select #languageSelect id=\"languages\"\n                            (change)=\"doLanguageChange(languageSelect.value)\">\n                        <option [value]=\"item.key\"\n                                *ngFor=\"let item of vm.systemConfigs['languages'].items | keyvalue\"\n                                [selected]=\"doGetCurrentLanguage() === item.key\">{{item.value}}</option>\n                    </select>\n                </div>\n            </div>\n        </div>\n\n\n        <div class=\"form-row fade-card\">\n\n            <!-- Card front -->\n            <div class=\"fade-card-front col\"\n                 *ngIf=\"cardState==='front'\"\n                 [@fade]>\n\n                <div class=\"inner-addon left-addon\">\n                    <scrm-image image=\"login_user\"></scrm-image>\n                    <input [(ngModel)]=\"uname\"\n                           type=\"text\"\n                           name=\"username\"\n                           [class.is-invalid]=\"username.invalid && username.touched\"\n                           #username=\"ngModel\"\n                           placeholder=\"{{vm.appStrings['LBL_USER_NAME']}}\"\n                           aria-label=\"Username\"\n                           required>\n                    <div *ngIf=\"username.invalid && username.touched\" class=\"invalid-feedback\">\n                        {{vm.appStrings['ERR_MISSING_REQUIRED_FIELDS']}}\n                    </div>\n                </div>\n\n                <div class=\"inner-addon left-addon\">\n                    <scrm-image image=\"login_password\"></scrm-image>\n                    <input [(ngModel)]=\"passw\"\n                           type=\"password\"\n                           name=\"password\"\n                           [class.is-invalid]=\"password.invalid && password.touched\"\n                           #password=\"ngModel\"\n                           placeholder=\"{{vm.appStrings['LBL_PASSWORD']}}\"\n                           aria-label=\"Password\"\n                           required>\n                    <div *ngIf=\"password.invalid && password.touched\" class=\"invalid-feedback\">\n                        {{vm.appStrings['ERR_MISSING_REQUIRED_FIELDS']}}\n                    </div>\n                </div>\n\n\n                <button id=\"login-button\" class=\"login-button\"\n                        [scrm-button-loading]=\"loading\"\n                        (click)=\"loginForm.control.markAllAsTouched(); loginForm.valid && doLogin()\">\n                    {{vm.appStrings['LBL_LOGIN_BUTTON_LABEL']}}\n                </button>\n                <div class=\"forgotten-password\" *ngIf=\"vm.showForgotPassword\">\n                    <a class=\"forgotten-password-link\" (click)=\"flipCard()\">\n                        {{vm.appStrings['LBL_LOGIN_FORGOT_PASSWORD']}}\n                    </a>\n                </div>\n\n            </div>\n\n            <!-- Card back-->\n            <div class=\"fade-card-back col\"\n                 *ngIf=\"cardState==='back'\"\n                 [@fade]>\n                <div class=\"inner-addon left-addon\">\n                    <scrm-image image=\"login_user\"></scrm-image>\n                    <input [(ngModel)]=\"uname\"\n                           type=\"text\"\n                           name=\"username\"\n                           [class.is-invalid]=\"username.invalid && username.touched\"\n                           #username=\"ngModel\"\n                           placeholder=\"{{vm.appStrings['LBL_USER_NAME']}}\"\n                           aria-label=\"Username\"\n                           required>\n                    <div *ngIf=\"username.invalid && username.touched\" class=\"invalid-feedback\">\n                        {{vm.appStrings['ERR_MISSING_REQUIRED_FIELDS']}}\n                    </div>\n                </div>\n\n                <div class=\"inner-addon left-addon\">\n                    <scrm-image image=\"email\"></scrm-image>\n                    <input [(ngModel)]=\"email\"\n                           type=\"email\"\n                           name=\"email\"\n                           [class.is-invalid]=\"mail.invalid && mail.touched\"\n                           #mail=\"ngModel\"\n                           placeholder=\"{{vm.appStrings['LBL_EMAIL']}}\"\n                           aria-label=\"Email\"\n                           required>\n                    <div *ngIf=\"mail.invalid && mail.touched\" class=\"invalid-feedback\">\n                        {{vm.appStrings['ERR_MISSING_REQUIRED_FIELDS']}}\n                    </div>\n                </div>\n\n                <button class=\"submit-button login-button\"\n                        scrm-button-loading\n                        (click)=\"loginForm.control.markAllAsTouched(); loginForm.valid && recoverPassword()\">\n                    {{vm.appStrings['LBL_GENERATE_PASSWORD_BUTTON_TITLE']}}\n                </button>\n                <div>\n                    <a class=\"back-link forgotten-password-link\" (click)=\"flipCard()\">\n                        {{vm.appStrings['LBL_BACK']}}\n                    </a>\n                </div>\n            </div>\n        </div>\n    </form>\n\n    <!-- End of login form section -->\n\n</div>\n\n<!-- End of login component section -->\n",
                animations: [
                    trigger('fade', [
                        transition(':enter', useAnimation(fadeIn, {
                            params: { timing: 0.5, delay: 0 }
                        })),
                    ])
                ]
            },] }
];
LoginUiComponent.ctorParameters = () => [
    { type: Router },
    { type: AuthService },
    { type: MessageService },
    { type: SystemConfigStore },
    { type: LanguageStore },
    { type: RecoverPasswordService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3ZpZXdzL2xvZ2luL2NvbXBvbmVudHMvbG9naW4vbG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN2QyxPQUFPLEVBQUMsYUFBYSxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuQyxPQUFPLEVBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLDBFQUEwRSxDQUFDO0FBQ2hILE9BQU8sRUFBa0IsaUJBQWlCLEVBQUMsTUFBTSxxREFBcUQsQ0FBQztBQUN2RyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFDbkUsT0FBTyxFQUFDLGFBQWEsRUFBb0IsTUFBTSwyQ0FBMkMsQ0FBQztBQUMzRixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sOENBQThDLENBQUM7QUFnQjVFLE1BQU0sT0FBTyxnQkFBZ0I7SUFxQ3pCLFlBQ2MsTUFBYyxFQUNkLElBQWlCLEVBQ2pCLE9BQXVCLEVBQ3ZCLGlCQUFvQyxFQUNwQyxhQUE0QixFQUM1QixzQkFBOEM7UUFMOUMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLFNBQUksR0FBSixJQUFJLENBQWE7UUFDakIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFDdkIs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QUFJLEVBQUUsQ0FBQztTQUN0RDtRQUVELE9BQU87SUFDWCxDQUFDO0lBRUQsWUFBWTtRQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsZ0RBQWdELENBQUMsQ0FBQztJQUNwRixDQUFDOzs7WUE5SEosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxlQUFlO2dCQUN6QixneE9BQXFDO2dCQUVyQyxVQUFVLEVBQUU7b0JBQ1IsT0FBTyxDQUFDLE1BQU0sRUFBRTt3QkFDWixVQUFVLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxNQUFNLEVBQUU7NEJBQ3RDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQzt5QkFDbEMsQ0FBQyxDQUFDO3FCQUNOLENBQUM7aUJBQ0w7YUFDSjs7O1lBeEJPLE1BQU07WUFPTixXQUFXO1lBRVgsY0FBYztZQUhHLGlCQUFpQjtZQUVsQyxhQUFhO1lBSGIsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1JvdXRlcn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7Y29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHt0cmFuc2l0aW9uLCB0cmlnZ2VyLCB1c2VBbmltYXRpb259IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtmYWRlSW59IGZyb20gJ25nLWFuaW1hdGUnO1xuaW1wb3J0IHtSZWNvdmVyUGFzc3dvcmRTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9wcm9jZXNzL3Byb2Nlc3Nlcy9yZWNvdmVyLXBhc3N3b3JkL3JlY292ZXItcGFzc3dvcmQnO1xuaW1wb3J0IHtTeXN0ZW1Db25maWdNYXAsIFN5c3RlbUNvbmZpZ1N0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9zeXN0ZW0tY29uZmlnL3N5c3RlbS1jb25maWcuc3RvcmUnO1xuaW1wb3J0IHtBdXRoU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZXMvYXV0aC9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHtMYW5ndWFnZVN0b3JlLCBMYW5ndWFnZVN0cmluZ01hcH0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtNZXNzYWdlU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZXMvbWVzc2FnZS9tZXNzYWdlLnNlcnZpY2UnO1xuaW1wb3J0IHtQcm9jZXNzfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9wcm9jZXNzL3Byb2Nlc3Muc2VydmljZSc7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLWxvZ2luLXVpJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vbG9naW4uY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogW10sXG4gICAgYW5pbWF0aW9uczogW1xuICAgICAgICB0cmlnZ2VyKCdmYWRlJywgW1xuICAgICAgICAgICAgdHJhbnNpdGlvbignOmVudGVyJywgdXNlQW5pbWF0aW9uKGZhZGVJbiwge1xuICAgICAgICAgICAgICAgIHBhcmFtczoge3RpbWluZzogMC41LCBkZWxheTogMH1cbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgXSlcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIExvZ2luVWlDb21wb25lbnQge1xuICAgIGhpZGRlbiA9IHRydWU7XG4gICAgbG9hZGluZyA9IGZhbHNlO1xuICAgIGVycm9yID0gJyc7XG4gICAgdW5hbWUgPSAnJztcbiAgICBwYXNzdyA9ICcnO1xuICAgIGVtYWlsID0gJyc7XG5cbiAgICBjYXJkU3RhdGUgPSAnZnJvbnQnO1xuXG4gICAgc3lzdGVtQ29uZmlncyQ6IE9ic2VydmFibGU8U3lzdGVtQ29uZmlnTWFwPiA9IHRoaXMuc3lzdGVtQ29uZmlnU3RvcmUuY29uZmlncyQ7XG4gICAgYXBwU3RyaW5ncyQ6IE9ic2VydmFibGU8TGFuZ3VhZ2VTdHJpbmdNYXA+ID0gdGhpcy5sYW5ndWFnZVN0b3JlLmFwcFN0cmluZ3MkO1xuXG4gICAgdm0kID0gY29tYmluZUxhdGVzdChbdGhpcy5zeXN0ZW1Db25maWdzJCwgdGhpcy5hcHBTdHJpbmdzJF0pLnBpcGUoXG4gICAgICAgIG1hcCgoW3N5c3RlbUNvbmZpZ3MsIGFwcFN0cmluZ3NdKSA9PiB7XG4gICAgICAgICAgICBsZXQgc2hvd0xhbmd1YWdlcyA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IHNob3dGb3Jnb3RQYXNzd29yZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAoc3lzdGVtQ29uZmlncy5sYW5ndWFnZXMgJiYgc3lzdGVtQ29uZmlncy5sYW5ndWFnZXMuaXRlbXMpIHtcbiAgICAgICAgICAgICAgICBzaG93TGFuZ3VhZ2VzID0gT2JqZWN0LmtleXMoc3lzdGVtQ29uZmlncy5sYW5ndWFnZXMuaXRlbXMpLmxlbmd0aCA+IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzeXN0ZW1Db25maWdzLnBhc3N3b3Jkc2V0dGluZyAmJiBzeXN0ZW1Db25maWdzLnBhc3N3b3Jkc2V0dGluZy5pdGVtcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZvcmdvdFBhc3N3b3JkUHJvcGVydHkgPSBzeXN0ZW1Db25maWdzLnBhc3N3b3Jkc2V0dGluZy5pdGVtcy5mb3Jnb3RwYXNzd29yZE9OO1xuICAgICAgICAgICAgICAgIHNob3dGb3Jnb3RQYXNzd29yZCA9IFt0cnVlLCAnMScsICd0cnVlJ10uaW5jbHVkZXMoZm9yZ290UGFzc3dvcmRQcm9wZXJ0eSk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzeXN0ZW1Db25maWdzLFxuICAgICAgICAgICAgICAgIGFwcFN0cmluZ3MsXG4gICAgICAgICAgICAgICAgc2hvd0xhbmd1YWdlcyxcbiAgICAgICAgICAgICAgICBzaG93Rm9yZ290UGFzc3dvcmRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pXG4gICAgKTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByb3RlY3RlZCBhdXRoOiBBdXRoU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIG1lc3NhZ2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgc3lzdGVtQ29uZmlnU3RvcmU6IFN5c3RlbUNvbmZpZ1N0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbGFuZ3VhZ2VTdG9yZTogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIHJlY292ZXJQYXNzd29yZFNlcnZpY2U6IFJlY292ZXJQYXNzd29yZFNlcnZpY2VcbiAgICApIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaGlkZGVuID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZG9MYW5ndWFnZUNoYW5nZShsYW5ndWFnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGFuZ3VhZ2VTdG9yZS5jaGFuZ2VMYW5ndWFnZShsYW5ndWFnZSk7XG4gICAgfVxuXG4gICAgZG9HZXRDdXJyZW50TGFuZ3VhZ2UoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGFuZ3VhZ2VTdG9yZS5nZXRDdXJyZW50TGFuZ3VhZ2UoKTtcbiAgICB9XG5cbiAgICBmbGlwQ2FyZCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY2FyZFN0YXRlID09PSAnZnJvbnQnKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmRTdGF0ZSA9ICdiYWNrJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZFN0YXRlID0gJ2Zyb250JztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRvTG9naW4oKTogdm9pZCB7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuYXV0aC5kb0xvZ2luKHRoaXMudW5hbWUsIHRoaXMucGFzc3csIHRoaXMub25Mb2dpblN1Y2Nlc3MuYmluZCh0aGlzKSwgdGhpcy5vbkxvZ2luRXJyb3IuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcmVjb3ZlclBhc3N3b3JkKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlY292ZXJQYXNzd29yZFNlcnZpY2VcbiAgICAgICAgICAgIC5ydW4odGhpcy51bmFtZSwgdGhpcy5lbWFpbClcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgKHByb2Nlc3M6IFByb2Nlc3MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlLmxvZygnUmVjb3ZlciBQYXNzd29yZCBTdGF0dXM6ICcgKyBwcm9jZXNzLnN0YXR1cyk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGhhbmRsZXIgPSAnYWRkU3VjY2Vzc01lc3NhZ2VCeUtleSc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzLnN0YXR1cyA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlciA9ICdhZGREYW5nZXJNZXNzYWdlQnlLZXknO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2Nlc3MubWVzc2FnZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MubWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2VbaGFuZGxlcl0obWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UubG9nKCdSZWNvdmVyIFBhc3N3b3JkIGZhaWxlZCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UuYWRkRGFuZ2VyTWVzc2FnZUJ5S2V5KCdFUlJfQUpBWF9MT0FEX0ZBSUxVUkUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIG9uTG9naW5TdWNjZXNzKHJlc3VsdDogYW55KTogdm9pZCB7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1lc3NhZ2UubG9nKCdMb2dpbiBzdWNjZXNzJyk7XG4gICAgICAgIHRoaXMubWVzc2FnZS5yZW1vdmVNZXNzYWdlcygpO1xuXG4gICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnJlZGlyZWN0KSB7XG4gICAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbcmVzdWx0LnJlZGlyZWN0XSkudGhlbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdE1vZHVsZSA9IHRoaXMuc3lzdGVtQ29uZmlnU3RvcmUuZ2V0SG9tZVBhZ2UoKTtcbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnLycgKyBkZWZhdWx0TW9kdWxlXSkudGhlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9uTG9naW5FcnJvcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMubWVzc2FnZS5sb2coJ0xvZ2luIGZhaWxlZCcpO1xuICAgICAgICB0aGlzLm1lc3NhZ2UuYWRkRGFuZ2VyTWVzc2FnZSgnTG9naW4gY3JlZGVudGlhbHMgaW5jb3JyZWN0LCBwbGVhc2UgdHJ5IGFnYWluLicpO1xuICAgIH1cbn1cbiJdfQ==