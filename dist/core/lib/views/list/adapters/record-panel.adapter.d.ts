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
import { ListViewStore } from '../store/list-view/list-view.store';
import { RecordPanelActionData, RecordPanelConfig } from '../../../containers/record-panel/components/record-panel/record-panel.model';
import { RecordPanelStore } from '../../../containers/record-panel/store/record-panel/record-panel.store';
import { BaseRecordActionsAdapter } from '../../../services/actions/base-record-action.adapter';
import { ListViewRecordPanelActionAdapterFactory } from './record-panel-actions.adapter.factory';
import { RecordPanelStoreFactory } from '../../../containers/record-panel/store/record-panel/record-panel.store.factory';
import { ViewMode } from 'common';
import { RecordManager } from '../../../services/record/record.manager';
import * as ɵngcc0 from '@angular/core';
export declare class RecordPanelAdapter {
    protected store: ListViewStore;
    protected recordPanelStoreFactory: RecordPanelStoreFactory;
    protected actionAdapterFactory: ListViewRecordPanelActionAdapterFactory;
    protected recordManager: RecordManager;
    constructor(store: ListViewStore, recordPanelStoreFactory: RecordPanelStoreFactory, actionAdapterFactory: ListViewRecordPanelActionAdapterFactory, recordManager: RecordManager);
    getConfig(): RecordPanelConfig;
    /**
     * Get configured module
     * @returns {string} module
     */
    protected getModule(): string;
    /**
     * Get configured view mode
     * @returns {string} ViewMode
     */
    protected getViewMode(): ViewMode;
    /**
     * Create and init store
     * @returns {object} RecordPanelStore
     */
    protected createStore(): RecordPanelStore;
    /**
     * Create action adapter
     * @returns {object} BaseRecordActionsAdapter
     */
    protected createActionAdapter(store: RecordPanelStore): BaseRecordActionsAdapter<RecordPanelActionData>;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<RecordPanelAdapter, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<RecordPanelAdapter>;
}

//# sourceMappingURL=record-panel.adapter.d.ts.map