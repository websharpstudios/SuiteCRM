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
import { ActionBarModel } from './action-bar-model';
import { LanguageStore, LanguageStrings } from '../../store/language/language.store';
import { GlobalSearch } from '../../services/navigation/global-search/global-search.service';
import * as ɵngcc0 from '@angular/core';
export declare class ActionBarUiComponent {
    protected languageStore: LanguageStore;
    protected globalSearch: GlobalSearch;
    searchTerm: string;
    actionBar: ActionBarModel;
    languages$: Observable<LanguageStrings>;
    vm$: Observable<{
        appStrings: import("../../store/language/language.store").LanguageStringMap;
        appListStrings: import("../../store/language/language.store").LanguageListStringMap;
    }>;
    constructor(languageStore: LanguageStore, globalSearch: GlobalSearch);
    search(): void;
    clearSearchTerm(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<ActionBarUiComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<ActionBarUiComponent, "scrm-action-bar-ui", never, {}, {}, never, never>;
}

//# sourceMappingURL=action-bar.component.d.ts.map