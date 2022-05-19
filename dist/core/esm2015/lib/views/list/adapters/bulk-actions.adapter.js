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
import { __rest } from "tslib";
import { Injectable } from '@angular/core';
import { isFalse } from 'common';
import { map, take } from 'rxjs/operators';
import { AsyncActionService } from '../../../services/process/processes/async-action/async-action';
import { MessageService } from '../../../services/message/message.service';
import { ListViewStore } from '../store/list-view/list-view.store';
import { ConfirmationModalService } from '../../../services/modals/confirmation-modal.service';
import { SelectModalService } from '../../../services/modals/select-modal.service';
export class BulkActionsAdapter {
    constructor(store, message, confirmation, selectModalService, asyncAction) {
        this.store = store;
        this.message = message;
        this.confirmation = confirmation;
        this.selectModalService = selectModalService;
        this.asyncAction = asyncAction;
    }
    /**
     * Get bulk action
     * @returns {object} Observable<BulkActionsMap>
     */
    getBulkActions() {
        return this.store.metadata$.pipe(map((metadata) => metadata.listView.bulkActions));
    }
    /**
     * Execute bulk actions
     * @param {string} action
     */
    executeBulkAction(action) {
        const selection = this.store.recordList.selection;
        const definition = this.store.metadata.listView.bulkActions[action];
        const actionName = `bulk-${action}`;
        this.message.removeMessages();
        if (isFalse(definition.params.allowAll) && selection.all) {
            let message = this.store.appStrings.LBL_SELECT_ALL_NOT_ALLOWED;
            this.message.addDangerMessage(message);
            return;
        }
        if (definition.params.min && selection.count < definition.params.min) {
            let message = this.store.appStrings.LBL_TOO_FEW_SELECTED;
            message = message.replace('{min}', definition.params.min);
            this.message.addDangerMessage(message);
            return;
        }
        if (definition.params.max && selection.count > definition.params.max) {
            let message = this.store.appStrings.LBL_TOO_MANY_SELECTED;
            message = message.replace('{max}', definition.params.max);
            this.message.addDangerMessage(message);
            return;
        }
        const displayedFields = [];
        this.store.metadata.listView.fields.forEach(value => {
            displayedFields.push(value.name);
        });
        const data = {
            action: actionName,
            module: this.store.getModuleName(),
            criteria: null,
            sort: null,
            ids: null,
            fields: displayedFields
        };
        if (selection.all && selection.count > this.store.recordList.records.length) {
            data.criteria = this.store.recordList.criteria;
            data.sort = this.store.recordList.sort;
        }
        if (selection.all && selection.count <= this.store.recordList.records.length) {
            data.ids = [];
            this.store.recordList.records.forEach(record => {
                data.ids.push(record.id);
            });
        }
        if (!selection.all) {
            data.ids = Object.keys(selection.selected);
        }
        const params = (definition && definition.params) || {};
        const displayConfirmation = params.displayConfirmation || false;
        const confirmationLabel = params.confirmationLabel || '';
        const selectModal = definition.params && definition.params.selectModal;
        const selectModule = selectModal && selectModal.module;
        const recordPanel = definition.params && definition.params.recordPanel;
        if (recordPanel) {
            this.store.openRecordPanel(recordPanel);
            return;
        }
        if (displayConfirmation) {
            this.confirmation.showModal(confirmationLabel, () => {
                if (!selectModule) {
                    this.runBulkAction(actionName, data);
                    return;
                }
                this.showSelectModal(selectModal.module, actionName, data);
            });
            return;
        }
        if (!selectModule) {
            this.runBulkAction(actionName, data);
            return;
        }
        this.showSelectModal(selectModal.module, actionName, data);
    }
    /**
     * Run async buk action
     *
     * @returns void
     * @param {string} selectModule: module for which records are listed in Select Modal/Popup
     * @param {string} asyncAction: bulk action name
     * @param {AsyncActionInput} asyncData: data passed to the async process
     */
    showSelectModal(selectModule, asyncAction, asyncData) {
        this.selectModalService.showSelectModal(selectModule, (modalRecord) => {
            if (modalRecord) {
                const { fields, formGroup } = modalRecord, baseRecord = __rest(modalRecord, ["fields", "formGroup"]);
                asyncData.modalRecord = baseRecord;
            }
            this.runBulkAction(asyncAction, asyncData);
        });
    }
    /**
     * Run async buk action
     *
     * @returns void
     * @param {string} asyncAction: bulk action name
     * @param {AsyncActionInput} asyncData: data passed to the async process
     */
    runBulkAction(asyncAction, asyncData) {
        this.asyncAction.run(asyncAction, asyncData).subscribe((process) => {
            this.handleProcessResult(process);
        });
    }
    /**
     * Run this function once the process is executed
     *
     * @returns void
     * @param {Process} process: data returned by the process once the process is executed
     */
    handleProcessResult(process) {
        if (process.data && process.data.reload) {
            this.store.recordList.clearSelection();
            this.store.load(false).pipe(take(1)).subscribe();
        }
        if (process.data && process.data.dataUpdated) {
            this.store.triggerDataUpdate();
        }
    }
}
BulkActionsAdapter.decorators = [
    { type: Injectable }
];
BulkActionsAdapter.ctorParameters = () => [
    { type: ListViewStore },
    { type: MessageService },
    { type: ConfirmationModalService },
    { type: SelectModalService },
    { type: AsyncActionService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsay1hY3Rpb25zLmFkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvdmlld3MvbGlzdC9hZGFwdGVycy9idWxrLWFjdGlvbnMuYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHOztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFpQixPQUFPLEVBQVMsTUFBTSxRQUFRLENBQUM7QUFFdkQsT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQW1CLGtCQUFrQixFQUFDLE1BQU0sK0RBQStELENBQUM7QUFDbkgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBRXpFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUNqRSxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxxREFBcUQsQ0FBQztBQUc3RixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSwrQ0FBK0MsQ0FBQztBQUdqRixNQUFNLE9BQU8sa0JBQWtCO0lBRTNCLFlBQ2MsS0FBb0IsRUFDcEIsT0FBdUIsRUFDdkIsWUFBc0MsRUFDdEMsa0JBQXNDLEVBQ3RDLFdBQStCO1FBSi9CLFVBQUssR0FBTCxLQUFLLENBQWU7UUFDcEIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFDdkIsaUJBQVksR0FBWixZQUFZLENBQTBCO1FBQ3RDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMsZ0JBQVcsR0FBWCxXQUFXLENBQW9CO0lBRTdDLENBQUM7SUFFRDs7O09BR0c7SUFDSSxjQUFjO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUM1QixHQUFHLENB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QUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksbUJBQW1CLENBQUMsT0FBZ0I7UUFFdkMsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNwRDtRQUVELElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUM7U0FDbEM7SUFDTCxDQUFDOzs7WUF0S0osVUFBVTs7O1lBTkgsYUFBYTtZQUZiLGNBQWM7WUFHZCx3QkFBd0I7WUFHeEIsa0JBQWtCO1lBUEEsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCdWxrQWN0aW9uc01hcCwgaXNGYWxzZSwgUmVjb3JkfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0FzeW5jQWN0aW9uSW5wdXQsIEFzeW5jQWN0aW9uU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvcHJvY2Vzcy9wcm9jZXNzZXMvYXN5bmMtYWN0aW9uL2FzeW5jLWFjdGlvbic7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9tZXNzYWdlL21lc3NhZ2Uuc2VydmljZSc7XG5pbXBvcnQge1Byb2Nlc3N9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL3Byb2Nlc3MvcHJvY2Vzcy5zZXJ2aWNlJztcbmltcG9ydCB7TGlzdFZpZXdTdG9yZX0gZnJvbSAnLi4vc3RvcmUvbGlzdC12aWV3L2xpc3Qtdmlldy5zdG9yZSc7XG5pbXBvcnQge0NvbmZpcm1hdGlvbk1vZGFsU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbW9kYWxzL2NvbmZpcm1hdGlvbi1tb2RhbC5zZXJ2aWNlJztcbmltcG9ydCB7QnVsa0FjdGlvbkRhdGFTb3VyY2V9IGZyb20gJy4uLy4uLy4uL2NvbXBvbmVudHMvYnVsay1hY3Rpb24tbWVudS9idWxrLWFjdGlvbi1tZW51LmNvbXBvbmVudCc7XG5pbXBvcnQge01ldGFkYXRhfSBmcm9tICcuLi8uLi8uLi9zdG9yZS9tZXRhZGF0YS9tZXRhZGF0YS5zdG9yZS5zZXJ2aWNlJztcbmltcG9ydCB7U2VsZWN0TW9kYWxTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9tb2RhbHMvc2VsZWN0LW1vZGFsLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQnVsa0FjdGlvbnNBZGFwdGVyIGltcGxlbWVudHMgQnVsa0FjdGlvbkRhdGFTb3VyY2Uge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBzdG9yZTogTGlzdFZpZXdTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIG1lc3NhZ2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgY29uZmlybWF0aW9uOiBDb25maXJtYXRpb25Nb2RhbFNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBzZWxlY3RNb2RhbFNlcnZpY2U6IFNlbGVjdE1vZGFsU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIGFzeW5jQWN0aW9uOiBBc3luY0FjdGlvblNlcnZpY2UsXG4gICAgKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGJ1bGsgYWN0aW9uXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxCdWxrQWN0aW9uc01hcD5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0QnVsa0FjdGlvbnMoKTogT2JzZXJ2YWJsZTxCdWxrQWN0aW9uc01hcD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS5tZXRhZGF0YSQucGlwZShcbiAgICAgICAgICAgIG1hcCgobWV0YWRhdGE6IE1ldGFkYXRhKSA9PiBtZXRhZGF0YS5saXN0Vmlldy5idWxrQWN0aW9ucylcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGJ1bGsgYWN0aW9uc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgZXhlY3V0ZUJ1bGtBY3Rpb24oYWN0aW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5zdG9yZS5yZWNvcmRMaXN0LnNlbGVjdGlvbjtcbiAgICAgICAgY29uc3QgZGVmaW5pdGlvbiA9IHRoaXMuc3RvcmUubWV0YWRhdGEubGlzdFZpZXcuYnVsa0FjdGlvbnNbYWN0aW9uXTtcbiAgICAgICAgY29uc3QgYWN0aW9uTmFtZSA9IGBidWxrLSR7YWN0aW9ufWA7XG5cbiAgICAgICAgdGhpcy5tZXNzYWdlLnJlbW92ZU1lc3NhZ2VzKCk7XG5cbiAgICAgICAgaWYgKGlzRmFsc2UoZGVmaW5pdGlvbi5wYXJhbXMuYWxsb3dBbGwpICYmIHNlbGVjdGlvbi5hbGwpIHtcbiAgICAgICAgICAgIGxldCBtZXNzYWdlID0gdGhpcy5zdG9yZS5hcHBTdHJpbmdzLkxCTF9TRUxFQ1RfQUxMX05PVF9BTExPV0VEO1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlLmFkZERhbmdlck1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVmaW5pdGlvbi5wYXJhbXMubWluICYmIHNlbGVjdGlvbi5jb3VudCA8IGRlZmluaXRpb24ucGFyYW1zLm1pbikge1xuICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSB0aGlzLnN0b3JlLmFwcFN0cmluZ3MuTEJMX1RPT19GRVdfU0VMRUNURUQ7XG4gICAgICAgICAgICBtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKCd7bWlufScsIGRlZmluaXRpb24ucGFyYW1zLm1pbik7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UuYWRkRGFuZ2VyTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkZWZpbml0aW9uLnBhcmFtcy5tYXggJiYgc2VsZWN0aW9uLmNvdW50ID4gZGVmaW5pdGlvbi5wYXJhbXMubWF4KSB7XG4gICAgICAgICAgICBsZXQgbWVzc2FnZSA9IHRoaXMuc3RvcmUuYXBwU3RyaW5ncy5MQkxfVE9PX01BTllfU0VMRUNURUQ7XG4gICAgICAgICAgICBtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKCd7bWF4fScsIGRlZmluaXRpb24ucGFyYW1zLm1heCk7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UuYWRkRGFuZ2VyTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRpc3BsYXllZEZpZWxkcyA9IFtdO1xuXG4gICAgICAgIHRoaXMuc3RvcmUubWV0YWRhdGEubGlzdFZpZXcuZmllbGRzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgICAgZGlzcGxheWVkRmllbGRzLnB1c2godmFsdWUubmFtZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvbk5hbWUsXG4gICAgICAgICAgICBtb2R1bGU6IHRoaXMuc3RvcmUuZ2V0TW9kdWxlTmFtZSgpLFxuICAgICAgICAgICAgY3JpdGVyaWE6IG51bGwsXG4gICAgICAgICAgICBzb3J0OiBudWxsLFxuICAgICAgICAgICAgaWRzOiBudWxsLFxuICAgICAgICAgICAgZmllbGRzOiBkaXNwbGF5ZWRGaWVsZHNcbiAgICAgICAgfSBhcyBBc3luY0FjdGlvbklucHV0O1xuXG4gICAgICAgIGlmIChzZWxlY3Rpb24uYWxsICYmIHNlbGVjdGlvbi5jb3VudCA+IHRoaXMuc3RvcmUucmVjb3JkTGlzdC5yZWNvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgZGF0YS5jcml0ZXJpYSA9IHRoaXMuc3RvcmUucmVjb3JkTGlzdC5jcml0ZXJpYTtcbiAgICAgICAgICAgIGRhdGEuc29ydCA9IHRoaXMuc3RvcmUucmVjb3JkTGlzdC5zb3J0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlbGVjdGlvbi5hbGwgJiYgc2VsZWN0aW9uLmNvdW50IDw9IHRoaXMuc3RvcmUucmVjb3JkTGlzdC5yZWNvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgZGF0YS5pZHMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUucmVjb3JkTGlzdC5yZWNvcmRzLmZvckVhY2gocmVjb3JkID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhLmlkcy5wdXNoKHJlY29yZC5pZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2VsZWN0aW9uLmFsbCkge1xuICAgICAgICAgICAgZGF0YS5pZHMgPSBPYmplY3Qua2V5cyhzZWxlY3Rpb24uc2VsZWN0ZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFyYW1zID0gKGRlZmluaXRpb24gJiYgZGVmaW5pdGlvbi5wYXJhbXMpIHx8IHt9IGFzIHsgW2tleTogc3RyaW5nXTogYW55IH07XG4gICAgICAgIGNvbnN0IGRpc3BsYXlDb25maXJtYXRpb24gPSBwYXJhbXMuZGlzcGxheUNvbmZpcm1hdGlvbiB8fCBmYWxzZTtcbiAgICAgICAgY29uc3QgY29uZmlybWF0aW9uTGFiZWwgPSBwYXJhbXMuY29uZmlybWF0aW9uTGFiZWwgfHwgJyc7XG4gICAgICAgIGNvbnN0IHNlbGVjdE1vZGFsID0gZGVmaW5pdGlvbi5wYXJhbXMgJiYgZGVmaW5pdGlvbi5wYXJhbXMuc2VsZWN0TW9kYWw7XG4gICAgICAgIGNvbnN0IHNlbGVjdE1vZHVsZSA9IHNlbGVjdE1vZGFsICYmIHNlbGVjdE1vZGFsLm1vZHVsZTtcbiAgICAgICAgY29uc3QgcmVjb3JkUGFuZWwgPSBkZWZpbml0aW9uLnBhcmFtcyAmJiBkZWZpbml0aW9uLnBhcmFtcy5yZWNvcmRQYW5lbDtcblxuICAgICAgICBpZiAocmVjb3JkUGFuZWwpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUub3BlblJlY29yZFBhbmVsKHJlY29yZFBhbmVsKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKGRpc3BsYXlDb25maXJtYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlybWF0aW9uLnNob3dNb2RhbChjb25maXJtYXRpb25MYWJlbCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghc2VsZWN0TW9kdWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucnVuQnVsa0FjdGlvbihhY3Rpb25OYW1lLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNob3dTZWxlY3RNb2RhbChzZWxlY3RNb2RhbC5tb2R1bGUsIGFjdGlvbk5hbWUsIGRhdGEpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2VsZWN0TW9kdWxlKSB7XG4gICAgICAgICAgICB0aGlzLnJ1bkJ1bGtBY3Rpb24oYWN0aW9uTmFtZSwgZGF0YSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG93U2VsZWN0TW9kYWwoc2VsZWN0TW9kYWwubW9kdWxlLCBhY3Rpb25OYW1lLCBkYXRhKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1biBhc3luYyBidWsgYWN0aW9uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdE1vZHVsZTogbW9kdWxlIGZvciB3aGljaCByZWNvcmRzIGFyZSBsaXN0ZWQgaW4gU2VsZWN0IE1vZGFsL1BvcHVwXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGFzeW5jQWN0aW9uOiBidWxrIGFjdGlvbiBuYW1lXG4gICAgICogQHBhcmFtIHtBc3luY0FjdGlvbklucHV0fSBhc3luY0RhdGE6IGRhdGEgcGFzc2VkIHRvIHRoZSBhc3luYyBwcm9jZXNzXG4gICAgICovXG4gICAgcHVibGljIHNob3dTZWxlY3RNb2RhbChzZWxlY3RNb2R1bGU6IHN0cmluZywgYXN5bmNBY3Rpb246IHN0cmluZywgYXN5bmNEYXRhOiBBc3luY0FjdGlvbklucHV0KSB7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RNb2RhbFNlcnZpY2Uuc2hvd1NlbGVjdE1vZGFsKHNlbGVjdE1vZHVsZSwgKG1vZGFsUmVjb3JkOiBSZWNvcmQpID0+IHtcbiAgICAgICAgICAgIGlmIChtb2RhbFJlY29yZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHtmaWVsZHMsIGZvcm1Hcm91cCwgLi4uYmFzZVJlY29yZH0gPSBtb2RhbFJlY29yZDtcbiAgICAgICAgICAgICAgICBhc3luY0RhdGEubW9kYWxSZWNvcmQgPSBiYXNlUmVjb3JkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ydW5CdWxrQWN0aW9uKGFzeW5jQWN0aW9uLCBhc3luY0RhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW4gYXN5bmMgYnVrIGFjdGlvblxuICAgICAqXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhc3luY0FjdGlvbjogYnVsayBhY3Rpb24gbmFtZVxuICAgICAqIEBwYXJhbSB7QXN5bmNBY3Rpb25JbnB1dH0gYXN5bmNEYXRhOiBkYXRhIHBhc3NlZCB0byB0aGUgYXN5bmMgcHJvY2Vzc1xuICAgICAqL1xuICAgIHB1YmxpYyBydW5CdWxrQWN0aW9uKGFzeW5jQWN0aW9uOiBzdHJpbmcsIGFzeW5jRGF0YTogQXN5bmNBY3Rpb25JbnB1dCk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMuYXN5bmNBY3Rpb24ucnVuKGFzeW5jQWN0aW9uLCBhc3luY0RhdGEpLnN1YnNjcmliZSgocHJvY2VzczogUHJvY2VzcykgPT4ge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVQcm9jZXNzUmVzdWx0KHByb2Nlc3MpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW4gdGhpcyBmdW5jdGlvbiBvbmNlIHRoZSBwcm9jZXNzIGlzIGV4ZWN1dGVkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICogQHBhcmFtIHtQcm9jZXNzfSBwcm9jZXNzOiBkYXRhIHJldHVybmVkIGJ5IHRoZSBwcm9jZXNzIG9uY2UgdGhlIHByb2Nlc3MgaXMgZXhlY3V0ZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFuZGxlUHJvY2Vzc1Jlc3VsdChwcm9jZXNzOiBQcm9jZXNzKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKHByb2Nlc3MuZGF0YSAmJiBwcm9jZXNzLmRhdGEucmVsb2FkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLnJlY29yZExpc3QuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUubG9hZChmYWxzZSkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9jZXNzLmRhdGEgJiYgcHJvY2Vzcy5kYXRhLmRhdGFVcGRhdGVkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLnRyaWdnZXJEYXRhVXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=