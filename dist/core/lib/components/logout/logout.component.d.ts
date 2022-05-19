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
import { Observable } from 'rxjs';
import { LanguageStore, LanguageStrings } from '../../store/language/language.store';
import { AuthService } from '../../services/auth/auth.service';
import { LogoutModel } from './logout-model';
import * as ɵngcc0 from '@angular/core';
export declare class LogoutUiComponent {
    protected auth: AuthService;
    protected languageStore: LanguageStore;
    logout: LogoutModel;
    languages$: Observable<LanguageStrings>;
    vm$: Observable<{
        appStrings: import("../../store/language/language.store").LanguageStringMap;
        appListStrings: import("../../store/language/language.store").LanguageListStringMap;
    }>;
    constructor(auth: AuthService, languageStore: LanguageStore);
    /**
     * call logout
     */
    doLogout(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<LogoutUiComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<LogoutUiComponent, "scrm-logout-ui", never, {}, {}, never, never>;
}

//# sourceMappingURL=logout.component.d.ts.map