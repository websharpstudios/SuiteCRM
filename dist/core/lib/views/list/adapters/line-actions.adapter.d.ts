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
import { Action, ActionContext, Record, ViewMode } from 'common';
import { Observable } from 'rxjs';
import { AsyncActionService } from '../../../services/process/processes/async-action/async-action';
import { MessageService } from '../../../services/message/message.service';
import { Process } from '../../../services/process/process.service';
import { ListViewStore } from '../store/list-view/list-view.store';
import { LineActionActionManager } from '../../../components/table/line-actions/line-action-manager.service';
import { BaseLineActionsAdapter } from '../../../components/table/adapters/base-line-actions.adapter';
import { ConfirmationModalService } from '../../../services/modals/confirmation-modal.service';
import { LanguageStore } from '../../../store/language/language.store';
import { SelectModalService } from '../../../services/modals/select-modal.service';
import * as ??ngcc0 from '@angular/core';
export declare class LineActionsAdapter extends BaseLineActionsAdapter {
    protected store: ListViewStore;
    protected actionManager: LineActionActionManager;
    protected asyncActionService: AsyncActionService;
    protected message: MessageService;
    protected confirmation: ConfirmationModalService;
    protected language: LanguageStore;
    protected selectModalService: SelectModalService;
    constructor(store: ListViewStore, actionManager: LineActionActionManager, asyncActionService: AsyncActionService, message: MessageService, confirmation: ConfirmationModalService, language: LanguageStore, selectModalService: SelectModalService);
    getActions(context?: ActionContext): Observable<Action[]>;
    protected getModuleName(record?: Record): string;
    protected reload(action: Action, process: Process, record?: Record): void;
    protected getMode(): ViewMode;
    static ??fac: ??ngcc0.????FactoryDeclaration<LineActionsAdapter, never>;
    static ??prov: ??ngcc0.????InjectableDeclaration<LineActionsAdapter>;
}

//# sourceMappingURL=line-actions.adapter.d.ts.map