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
import { RecordListStoreFactory } from '../../../store/record-list/record-list.store.factory';
import { RecordListStore } from '../../../store/record-list/record-list.store';
import { Record } from 'common';
import { Observable } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export declare class RelateService {
    recordList: RecordListStore;
    constructor(recordListStoreFactory: RecordListStoreFactory);
    init(module: string): void;
    search(term: string, field: string): Observable<Record[]>;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<RelateService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<RelateService>;
}

//# sourceMappingURL=relate.service.d.ts.map