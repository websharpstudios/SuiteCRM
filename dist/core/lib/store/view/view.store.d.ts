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
import { StateStore } from '../state';
import { AppState, AppStateStore } from '../app-state/app-state.store';
import { Observable } from 'rxjs';
import { LanguageListStringMap, LanguageStore, LanguageStringMap, LanguageStrings } from '../language/language.store';
import { NavbarModule, Navigation, NavigationStore } from '../navigation/navigation.store';
import { ModuleNavigation } from '../../services/navigation/module-navigation/module-navigation.service';
import { Metadata, MetadataStore } from '../metadata/metadata.store.service';
import { SearchMeta } from 'common';
import * as ɵngcc0 from '@angular/core';
export interface AppData {
    appState: AppState;
    module: NavbarModule;
    language: LanguageStrings;
    navigation: Navigation;
}
export declare class ViewStore implements StateStore {
    protected appStateStore: AppStateStore;
    protected languageStore: LanguageStore;
    protected navigationStore: NavigationStore;
    protected moduleNavigation: ModuleNavigation;
    protected metadataStore: MetadataStore;
    appState$: Observable<AppState>;
    module$: Observable<NavbarModule>;
    language$: Observable<LanguageStrings>;
    navigation$: Observable<Navigation>;
    appData$: Observable<AppData>;
    metadata$: Observable<Metadata>;
    appData: AppData;
    metadata: Metadata;
    constructor(appStateStore: AppStateStore, languageStore: LanguageStore, navigationStore: NavigationStore, moduleNavigation: ModuleNavigation, metadataStore: MetadataStore);
    clear(): void;
    clearAuthBased(): void;
    get appState(): AppState;
    get module(): NavbarModule;
    get language(): LanguageStrings;
    get appStrings(): LanguageStringMap;
    get appListStrings(): LanguageListStringMap;
    get modStrings(): LanguageListStringMap;
    get navigation(): Navigation;
    get searchMeta(): SearchMeta;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<ViewStore, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<ViewStore>;
}

//# sourceMappingURL=view.store.d.ts.map