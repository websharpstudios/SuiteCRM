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
import { Action, ActionContext, ModeActions, ViewMode } from 'common';
import { Observable } from 'rxjs';
import { MetadataStore } from '../../../store/metadata/metadata.store.service';
import { AsyncActionInput, AsyncActionService } from '../../../services/process/processes/async-action/async-action';
import { LanguageStore } from '../../../store/language/language.store';
import { MessageService } from '../../../services/message/message.service';
import { Process } from '../../../services/process/process.service';
import { ConfirmationModalService } from '../../../services/modals/confirmation-modal.service';
import { BaseRecordActionsAdapter } from '../../../services/actions/base-record-action.adapter';
import { InstallViewActionData } from '../actions/install-view.action';
import { InstallViewStore } from '../store/install-view/install-view.store';
import { InstallActionManager } from '../actions/install-action-manager.service';
import { SelectModalService } from '../../../services/modals/select-modal.service';
import * as ɵngcc0 from '@angular/core';
export declare class InstallActionsAdapter extends BaseRecordActionsAdapter<InstallViewActionData> {
    protected store: InstallViewStore;
    protected metadata: MetadataStore;
    protected language: LanguageStore;
    protected actionManager: InstallActionManager;
    protected asyncActionService: AsyncActionService;
    protected message: MessageService;
    protected confirmation: ConfirmationModalService;
    protected selectModalService: SelectModalService;
    defaultActions: ModeActions;
    constructor(store: InstallViewStore, metadata: MetadataStore, language: LanguageStore, actionManager: InstallActionManager, asyncActionService: AsyncActionService, message: MessageService, confirmation: ConfirmationModalService, selectModalService: SelectModalService);
    getActions(context?: ActionContext): Observable<Action[]>;
    protected buildActionData(action: Action, context?: ActionContext): InstallViewActionData;
    /**
     * Build backend process input
     *
     * @param action
     * @param actionName
     * @param moduleName
     * @param context
     */
    protected buildActionInput(action: Action, actionName: string, moduleName: string, context?: ActionContext): AsyncActionInput;
    protected getMode(): ViewMode;
    protected getModuleName(context?: ActionContext): string;
    protected reload(action: Action, process: Process, context?: ActionContext): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<InstallActionsAdapter, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<InstallActionsAdapter>;
}

//# sourceMappingURL=actions.adapter.d.ts.map