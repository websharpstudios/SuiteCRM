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
import { Action, ActionContext, ActionManager } from 'common';
import { AsyncActionInput, AsyncActionService } from '../process/processes/async-action/async-action';
import { MessageService } from '../message/message.service';
import { ConfirmationModalService } from '../modals/confirmation-modal.service';
import { BaseActionsAdapter } from './base-action.adapter';
import { LanguageStore } from '../../store/language/language.store';
import { SelectModalService } from '../modals/select-modal.service';
import * as ɵngcc0 from '@angular/core';
export declare abstract class BaseRecordActionsAdapter<D> extends BaseActionsAdapter<D> {
    protected actionManager: ActionManager<D>;
    protected asyncActionService: AsyncActionService;
    protected message: MessageService;
    protected confirmation: ConfirmationModalService;
    protected language: LanguageStore;
    protected selectModalService: SelectModalService;
    protected constructor(actionManager: ActionManager<D>, asyncActionService: AsyncActionService, message: MessageService, confirmation: ConfirmationModalService, language: LanguageStore, selectModalService: SelectModalService);
    /**
     * Get action name
     * @param action
     */
    protected getActionName(action: Action): string;
    /**
     * Build backend process input
     *
     * @param action
     * @param actionName
     * @param moduleName
     * @param context
     */
    protected buildActionInput(action: Action, actionName: string, moduleName: string, context?: ActionContext): AsyncActionInput;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<BaseRecordActionsAdapter<any>, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<BaseRecordActionsAdapter<any>>;
}

//# sourceMappingURL=base-record-action.adapter.d.ts.map