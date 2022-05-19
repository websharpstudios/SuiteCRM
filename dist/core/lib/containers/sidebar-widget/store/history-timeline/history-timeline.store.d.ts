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
import { StateStore } from '../../../../store/state';
import { RecordList } from '../../../../store/record-list/record-list.store';
import { Observable } from 'rxjs';
import { RecordListStoreFactory } from '../../../../store/record-list/record-list.store.factory';
import { ViewContext } from 'common';
import * as ɵngcc0 from '@angular/core';
export declare class HistoryTimelineStore implements StateStore {
    protected listStoreFactory: RecordListStoreFactory;
    private recordList;
    private viewContext;
    constructor(listStoreFactory: RecordListStoreFactory);
    clear(): void;
    clearAuthBased(): void;
    /**
     * Initial list records load if not cached and update state.
     *
     * @param {ViewContext} context of parent
     * @description initialize the Record List Store
     * returns {void}
     */
    init(context: any): void;
    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<RecordList>
     */
    load(useCache?: boolean): Observable<RecordList>;
    /**
     * Init search criteria
     *
     * @param {number} offset of the recordset
     * @param {number} limit of the recordset
     * @description initialize the search module/criteria(offset/limit) for the record set
     */
    initSearchCriteria(offset: number, limit: number): void;
    protected initViewContext(viewContext: ViewContext): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<HistoryTimelineStore, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<HistoryTimelineStore>;
}

//# sourceMappingURL=history-timeline.store.d.ts.map