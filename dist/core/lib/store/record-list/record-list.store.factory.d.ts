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
import { ListGQL } from './graphql/api.list.get';
import { SystemConfigStore } from '../system-config/system-config.store';
import { UserPreferenceStore } from '../user-preference/user-preference.store';
import { AppStateStore } from '../app-state/app-state.store';
import { LanguageStore } from '../language/language.store';
import { MessageService } from '../../services/message/message.service';
import { RecordListStore } from './record-list.store';
import * as ɵngcc0 from '@angular/core';
export declare class RecordListStoreFactory {
    protected listGQL: ListGQL;
    protected configStore: SystemConfigStore;
    protected preferencesStore: UserPreferenceStore;
    protected appStateStore: AppStateStore;
    protected languageStore: LanguageStore;
    protected message: MessageService;
    constructor(listGQL: ListGQL, configStore: SystemConfigStore, preferencesStore: UserPreferenceStore, appStateStore: AppStateStore, languageStore: LanguageStore, message: MessageService);
    create(): RecordListStore;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<RecordListStoreFactory, never>;
}

//# sourceMappingURL=record-list.store.factory.d.ts.map