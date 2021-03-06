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
import { BulkActionsMap } from 'common';
import { Observable } from 'rxjs';
import { AsyncActionInput, AsyncActionService } from '../../../services/process/processes/async-action/async-action';
import { MessageService } from '../../../services/message/message.service';
import { Process } from '../../../services/process/process.service';
import { ListViewStore } from '../store/list-view/list-view.store';
import { ConfirmationModalService } from '../../../services/modals/confirmation-modal.service';
import { BulkActionDataSource } from '../../../components/bulk-action-menu/bulk-action-menu.component';
import { SelectModalService } from '../../../services/modals/select-modal.service';
import * as ??ngcc0 from '@angular/core';
export declare class BulkActionsAdapter implements BulkActionDataSource {
    protected store: ListViewStore;
    protected message: MessageService;
    protected confirmation: ConfirmationModalService;
    protected selectModalService: SelectModalService;
    protected asyncAction: AsyncActionService;
    constructor(store: ListViewStore, message: MessageService, confirmation: ConfirmationModalService, selectModalService: SelectModalService, asyncAction: AsyncActionService);
    /**
     * Get bulk action
     * @returns {object} Observable<BulkActionsMap>
     */
    getBulkActions(): Observable<BulkActionsMap>;
    /**
     * Execute bulk actions
     * @param {string} action
     */
    executeBulkAction(action: string): void;
    /**
     * Run async buk action
     *
     * @returns void
     * @param {string} selectModule: module for which records are listed in Select Modal/Popup
     * @param {string} asyncAction: bulk action name
     * @param {AsyncActionInput} asyncData: data passed to the async process
     */
    showSelectModal(selectModule: string, asyncAction: string, asyncData: AsyncActionInput): void;
    /**
     * Run async buk action
     *
     * @returns void
     * @param {string} asyncAction: bulk action name
     * @param {AsyncActionInput} asyncData: data passed to the async process
     */
    runBulkAction(asyncAction: string, asyncData: AsyncActionInput): void;
    /**
     * Run this function once the process is executed
     *
     * @returns void
     * @param {Process} process: data returned by the process once the process is executed
     */
    handleProcessResult(process: Process): void;
    static ??fac: ??ngcc0.????FactoryDeclaration<BulkActionsAdapter, never>;
    static ??prov: ??ngcc0.????InjectableDeclaration<BulkActionsAdapter>;
}

//# sourceMappingURL=bulk-actions.adapter.d.ts.map