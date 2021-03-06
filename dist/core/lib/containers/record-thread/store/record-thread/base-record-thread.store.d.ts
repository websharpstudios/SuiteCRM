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
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { RecordList, RecordListStore } from '../../../../store/record-list/record-list.store';
import { RecordListStoreFactory } from '../../../../store/record-list/record-list.store.factory';
import { Record } from 'common';
import { BaseRecordContainerStore } from '../../../../store/record-container/base-record-container.store';
import { BaseRecordItemStoreFactoryInterface } from './base-record-thread-thread.model';
import * as ɵngcc0 from '@angular/core';
export interface RecordStoreMap<T extends BaseRecordContainerStore<M>, M> {
    [key: string]: T;
}
export declare abstract class RecordStoreList<T extends BaseRecordContainerStore<M>, M> implements StateStore {
    protected listStoreFactory: RecordListStoreFactory;
    protected recordStoreFactory: BaseRecordItemStoreFactoryInterface<T, M>;
    storesMap$: Observable<RecordStoreMap<T, M>>;
    stores$: Observable<T[]>;
    protected subs: Subscription[];
    protected recordList: RecordListStore;
    protected stores: T[];
    protected storeSubject: BehaviorSubject<T[]>;
    protected state$: Observable<T[]>;
    protected constructor(listStoreFactory: RecordListStoreFactory, recordStoreFactory: BaseRecordItemStoreFactoryInterface<T, M>);
    clear(): void;
    clearAuthBased(): void;
    getMetadata(): M;
    /**
     * Initial list records load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @param {boolean} load
     */
    init(module: string, load?: boolean): void;
    /**
     * Load / reload records using current pagination and criteria
     *
     * @param {boolean} useCache if to use cache
     * @returns {object} Observable<RecordList>
     */
    load(useCache?: boolean): Observable<RecordList>;
    /**
     * Init record stores using records
     * @param records
     */
    protected initStores(records: Record[]): void;
    protected updateState(stores: T[]): void;
    protected getStoreMap(stores: T[]): RecordStoreMap<T, M>;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<RecordStoreList<any, any>, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<RecordStoreList<any, any>>;
}

//# sourceMappingURL=base-record-thread.store.d.ts.map