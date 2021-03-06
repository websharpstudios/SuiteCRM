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
import { Process, ProcessService } from '../../process.service';
import { AppStateStore } from '../../../../store/app-state/app-state.store';
import { MessageService } from '../../../message/message.service';
import { AsyncActionHandler } from './async-action.model';
import { Record, SearchCriteria, SortingSelection } from 'common';
import { RedirectAsyncAction } from './actions/redirect/redirect.async-action';
import { ExportAsyncAction } from './actions/export/export.async-action';
import { NoopAsyncAction } from './actions/noop/noop.async-action';
import { ChangelogAsyncAction } from './actions/changelog/changelog.async-action';
import * as ??ngcc0 from '@angular/core';
export interface AsyncActionInput {
    action: string;
    module: string;
    criteria?: SearchCriteria;
    sort?: SortingSelection;
    ids?: string[];
    id?: string;
    payload?: {
        [key: string]: any;
    };
    modalRecord?: Record;
}
export declare class AsyncActionService {
    private processService;
    private appStateStore;
    protected message: MessageService;
    protected redirectAction: RedirectAsyncAction;
    protected exportAction: ExportAsyncAction;
    protected noopAction: NoopAsyncAction;
    protected changelogAction: ChangelogAsyncAction;
    actions: {
        [key: string]: AsyncActionHandler;
    };
    constructor(processService: ProcessService, appStateStore: AppStateStore, message: MessageService, redirectAction: RedirectAsyncAction, exportAction: ExportAsyncAction, noopAction: NoopAsyncAction, changelogAction: ChangelogAsyncAction);
    registerHandler(handler: AsyncActionHandler): void;
    /**
     * Send action request
     *
     * @param {string} actionName to submit
     * @param {string} data to send
     * @param {string} presetHandlerKey to use
     * @returns {object} Observable<Process>
     */
    run(actionName: string, data: AsyncActionInput, presetHandlerKey?: string): Observable<Process>;
    static ??fac: ??ngcc0.????FactoryDeclaration<AsyncActionService, never>;
}

//# sourceMappingURL=async-action.d.ts.map