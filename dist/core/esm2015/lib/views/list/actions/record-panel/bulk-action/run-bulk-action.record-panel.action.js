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
import { Injectable } from '@angular/core';
import { isFalse } from 'common';
import { take } from 'rxjs/operators';
import { ConfirmationModalService } from '../../../../../services/modals/confirmation-modal.service';
import { ListViewRecordPanelActionHandler } from '../record-panel.action';
import { MessageService } from '../../../../../services/message/message.service';
import { AsyncActionService } from '../../../../../services/process/processes/async-action/async-action';
import * as i0 from "@angular/core";
import * as i1 from "../../../../../services/message/message.service";
import * as i2 from "../../../../../services/process/processes/async-action/async-action";
import * as i3 from "../../../../../services/modals/confirmation-modal.service";
export class RunBulkActionRecordPanelAction extends ListViewRecordPanelActionHandler {
    constructor(message, asyncActionService, confirmation, asyncAction) {
        super();
        this.message = message;
        this.asyncActionService = asyncActionService;
        this.confirmation = confirmation;
        this.asyncAction = asyncAction;
        this.key = 'bulk-action';
        this.modes = [
            'detail',
            'edit',
            'list',
            'create',
            'massupdate'
        ];
    }
    run(data) {
        const definition = data.action;
        const selection = data.listStore.recordList.selection;
        const params = (definition && definition.params) || {};
        if (isFalse(params.allowAll) && selection.all) {
            let message = data.listStore.appStrings.LBL_SELECT_ALL_NOT_ALLOWED;
            this.message.addDangerMessage(message);
            return;
        }
        if (params.min && selection.count < params.min) {
            let message = data.listStore.appStrings.LBL_TOO_FEW_SELECTED;
            message = message.replace('{min}', params.min);
            this.message.addDangerMessage(message);
            return;
        }
        if (params.max && selection.count > params.max) {
            let message = data.listStore.appStrings.LBL_TOO_MANY_SELECTED;
            message = message.replace('{max}', params.max);
            this.message.addDangerMessage(message);
            return;
        }
        this.runBulkAction(data);
    }
    shouldDisplay() {
        return true;
    }
    /**
     * Run async buk action
     *
     * @returns void
     * @param {AsyncActionInput} data: data passed to the async process
     */
    runBulkAction(data) {
        const actionName = `bulk-${data.action.params.bulkAction}`;
        const asyncData = this.buildActionInput(actionName, data);
        this.asyncAction.run(actionName, asyncData).subscribe((process) => {
            this.handleProcessResult(process, data);
        });
    }
    /**
     * Build backend bulk action input
     * @param actionName
     * @param data
     */
    buildActionInput(actionName, data) {
        const displayedFields = [];
        data.listStore.metadata.listView.fields.forEach(value => {
            displayedFields.push(value.name);
        });
        const asyncData = {
            action: actionName,
            module: data.listStore.getModuleName(),
            criteria: null,
            sort: null,
            ids: null,
            fields: displayedFields,
            payload: {
                panelRecord: data.store.recordStore.getBaseStaging()
            }
        };
        const selection = data.listStore.recordList.selection;
        if (selection.all && selection.count > data.listStore.recordList.records.length) {
            asyncData.criteria = data.listStore.recordList.criteria;
            asyncData.sort = data.listStore.recordList.sort;
        }
        if (selection.all && selection.count <= data.listStore.recordList.records.length) {
            asyncData.ids = [];
            data.listStore.recordList.records.forEach(record => {
                data.ids.push(record.id);
            });
        }
        if (!selection.all) {
            asyncData.ids = Object.keys(selection.selected);
        }
        return asyncData;
    }
    /**
     * Run this function once the process is executed
     *
     * @returns void
     * @param {object} process Process data returned by the process once the process is executed
     * @param {object} data ListViewRecordPanelActionData
     */
    handleProcessResult(process, data) {
        if (process.data && process.data.reload) {
            data.listStore.recordList.clearSelection();
            data.listStore.load(false).pipe(take(1)).subscribe();
        }
        if (process.data && process.data.dataUpdated) {
            data.listStore.triggerDataUpdate();
        }
        data.listStore.closeRecordPanel();
    }
}
RunBulkActionRecordPanelAction.ɵprov = i0.ɵɵdefineInjectable({ factory: function RunBulkActionRecordPanelAction_Factory() { return new RunBulkActionRecordPanelAction(i0.ɵɵinject(i1.MessageService), i0.ɵɵinject(i2.AsyncActionService), i0.ɵɵinject(i3.ConfirmationModalService), i0.ɵɵinject(i2.AsyncActionService)); }, token: RunBulkActionRecordPanelAction, providedIn: "root" });
RunBulkActionRecordPanelAction.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
RunBulkActionRecordPanelAction.ctorParameters = () => [
    { type: MessageService },
    { type: AsyncActionService },
    { type: ConfirmationModalService },
    { type: AsyncActionService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLWJ1bGstYWN0aW9uLnJlY29yZC1wYW5lbC5hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvdmlld3MvbGlzdC9hY3Rpb25zL3JlY29yZC1wYW5lbC9idWxrLWFjdGlvbi9ydW4tYnVsay1hY3Rpb24ucmVjb3JkLXBhbmVsLmFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsT0FBTyxFQUFXLE1BQU0sUUFBUSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwQyxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSwyREFBMkQsQ0FBQztBQUNuRyxPQUFPLEVBQWdDLGdDQUFnQyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkcsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGlEQUFpRCxDQUFDO0FBQy9FLE9BQU8sRUFFSCxrQkFBa0IsRUFDckIsTUFBTSxxRUFBcUUsQ0FBQzs7Ozs7QUFLN0UsTUFBTSxPQUFPLDhCQUErQixTQUFRLGdDQUFnQztJQVdoRixZQUNjLE9BQXVCLEVBQ3ZCLGtCQUFzQyxFQUN0QyxZQUFzQyxFQUN0QyxXQUErQjtRQUV6QyxLQUFLLEVBQUUsQ0FBQztRQUxFLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBQ3ZCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMsaUJBQVksR0FBWixZQUFZLENBQTBCO1FBQ3RDLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQWI3QyxRQUFHLEdBQUcsYUFBYSxDQUFDO1FBQ3BCLFVBQUssR0FBRztZQUNKLFFBQW9CO1lBQ3BCLE1BQWtCO1lBQ2xCLE1BQWtCO1lBQ2xCLFFBQW9C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T0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUMzQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDeEQ7UUFFRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDMUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1NBQ3RDO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3RDLENBQUM7Ozs7WUEzSUosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFSTyxjQUFjO1lBR2xCLGtCQUFrQjtZQUxkLHdCQUF3QjtZQUs1QixrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzRmFsc2UsIFZpZXdNb2RlfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1Byb2Nlc3N9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NlcnZpY2VzL3Byb2Nlc3MvcHJvY2Vzcy5zZXJ2aWNlJztcbmltcG9ydCB7Q29uZmlybWF0aW9uTW9kYWxTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2aWNlcy9tb2RhbHMvY29uZmlybWF0aW9uLW1vZGFsLnNlcnZpY2UnO1xuaW1wb3J0IHtMaXN0Vmlld1JlY29yZFBhbmVsQWN0aW9uRGF0YSwgTGlzdFZpZXdSZWNvcmRQYW5lbEFjdGlvbkhhbmRsZXJ9IGZyb20gJy4uL3JlY29yZC1wYW5lbC5hY3Rpb24nO1xuaW1wb3J0IHtNZXNzYWdlU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvbWVzc2FnZS9tZXNzYWdlLnNlcnZpY2UnO1xuaW1wb3J0IHtcbiAgICBBc3luY0FjdGlvbklucHV0LFxuICAgIEFzeW5jQWN0aW9uU2VydmljZVxufSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2aWNlcy9wcm9jZXNzL3Byb2Nlc3Nlcy9hc3luYy1hY3Rpb24vYXN5bmMtYWN0aW9uJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBSdW5CdWxrQWN0aW9uUmVjb3JkUGFuZWxBY3Rpb24gZXh0ZW5kcyBMaXN0Vmlld1JlY29yZFBhbmVsQWN0aW9uSGFuZGxlciB7XG5cbiAgICBrZXkgPSAnYnVsay1hY3Rpb24nO1xuICAgIG1vZGVzID0gW1xuICAgICAgICAnZGV0YWlsJyBhcyBWaWV3TW9kZSxcbiAgICAgICAgJ2VkaXQnIGFzIFZpZXdNb2RlLFxuICAgICAgICAnbGlzdCcgYXMgVmlld01vZGUsXG4gICAgICAgICdjcmVhdGUnIGFzIFZpZXdNb2RlLFxuICAgICAgICAnbWFzc3VwZGF0ZScgYXMgVmlld01vZGVcbiAgICBdO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBtZXNzYWdlOiBNZXNzYWdlU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIGFzeW5jQWN0aW9uU2VydmljZTogQXN5bmNBY3Rpb25TZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgY29uZmlybWF0aW9uOiBDb25maXJtYXRpb25Nb2RhbFNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBhc3luY0FjdGlvbjogQXN5bmNBY3Rpb25TZXJ2aWNlXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcnVuKGRhdGE6IExpc3RWaWV3UmVjb3JkUGFuZWxBY3Rpb25EYXRhKTogdm9pZCB7XG5cbiAgICAgICAgY29uc3QgZGVmaW5pdGlvbiA9IGRhdGEuYWN0aW9uO1xuICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSBkYXRhLmxpc3RTdG9yZS5yZWNvcmRMaXN0LnNlbGVjdGlvbjtcblxuICAgICAgICBjb25zdCBwYXJhbXMgPSAoZGVmaW5pdGlvbiAmJiBkZWZpbml0aW9uLnBhcmFtcykgfHwge30gYXMgeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcblxuICAgICAgICBpZiAoaXNGYWxzZShwYXJhbXMuYWxsb3dBbGwpICYmIHNlbGVjdGlvbi5hbGwpIHtcbiAgICAgICAgICAgIGxldCBtZXNzYWdlID0gZGF0YS5saXN0U3RvcmUuYXBwU3RyaW5ncy5MQkxfU0VMRUNUX0FMTF9OT1RfQUxMT1dFRDtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZS5hZGREYW5nZXJNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy5taW4gJiYgc2VsZWN0aW9uLmNvdW50IDwgcGFyYW1zLm1pbikge1xuICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSBkYXRhLmxpc3RTdG9yZS5hcHBTdHJpbmdzLkxCTF9UT09fRkVXX1NFTEVDVEVEO1xuICAgICAgICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZSgne21pbn0nLCBwYXJhbXMubWluKTtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZS5hZGREYW5nZXJNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcmFtcy5tYXggJiYgc2VsZWN0aW9uLmNvdW50ID4gcGFyYW1zLm1heCkge1xuICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSBkYXRhLmxpc3RTdG9yZS5hcHBTdHJpbmdzLkxCTF9UT09fTUFOWV9TRUxFQ1RFRDtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2UoJ3ttYXh9JywgcGFyYW1zLm1heCk7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UuYWRkRGFuZ2VyTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucnVuQnVsa0FjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBzaG91bGREaXNwbGF5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW4gYXN5bmMgYnVrIGFjdGlvblxuICAgICAqXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqIEBwYXJhbSB7QXN5bmNBY3Rpb25JbnB1dH0gZGF0YTogZGF0YSBwYXNzZWQgdG8gdGhlIGFzeW5jIHByb2Nlc3NcbiAgICAgKi9cbiAgICBwdWJsaWMgcnVuQnVsa0FjdGlvbihkYXRhOiBMaXN0Vmlld1JlY29yZFBhbmVsQWN0aW9uRGF0YSk6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IGFjdGlvbk5hbWUgPSBgYnVsay0ke2RhdGEuYWN0aW9uLnBhcmFtcy5idWxrQWN0aW9ufWA7XG5cbiAgICAgICAgY29uc3QgYXN5bmNEYXRhID0gdGhpcy5idWlsZEFjdGlvbklucHV0KGFjdGlvbk5hbWUsIGRhdGEpO1xuXG4gICAgICAgIHRoaXMuYXN5bmNBY3Rpb24ucnVuKGFjdGlvbk5hbWUsIGFzeW5jRGF0YSkuc3Vic2NyaWJlKChwcm9jZXNzOiBQcm9jZXNzKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVByb2Nlc3NSZXN1bHQocHJvY2VzcywgZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGJhY2tlbmQgYnVsayBhY3Rpb24gaW5wdXRcbiAgICAgKiBAcGFyYW0gYWN0aW9uTmFtZVxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGJ1aWxkQWN0aW9uSW5wdXQoYWN0aW9uTmFtZTogc3RyaW5nLCBkYXRhOiBMaXN0Vmlld1JlY29yZFBhbmVsQWN0aW9uRGF0YSkge1xuXG4gICAgICAgIGNvbnN0IGRpc3BsYXllZEZpZWxkcyA9IFtdO1xuXG4gICAgICAgIGRhdGEubGlzdFN0b3JlLm1ldGFkYXRhLmxpc3RWaWV3LmZpZWxkcy5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgICAgIGRpc3BsYXllZEZpZWxkcy5wdXNoKHZhbHVlLm5hbWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBhc3luY0RhdGEgPSB7XG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvbk5hbWUsXG4gICAgICAgICAgICBtb2R1bGU6IGRhdGEubGlzdFN0b3JlLmdldE1vZHVsZU5hbWUoKSxcbiAgICAgICAgICAgIGNyaXRlcmlhOiBudWxsLFxuICAgICAgICAgICAgc29ydDogbnVsbCxcbiAgICAgICAgICAgIGlkczogbnVsbCxcbiAgICAgICAgICAgIGZpZWxkczogZGlzcGxheWVkRmllbGRzLFxuICAgICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgICAgIHBhbmVsUmVjb3JkOiBkYXRhLnN0b3JlLnJlY29yZFN0b3JlLmdldEJhc2VTdGFnaW5nKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBhcyBBc3luY0FjdGlvbklucHV0O1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IGRhdGEubGlzdFN0b3JlLnJlY29yZExpc3Quc2VsZWN0aW9uO1xuXG4gICAgICAgIGlmIChzZWxlY3Rpb24uYWxsICYmIHNlbGVjdGlvbi5jb3VudCA+IGRhdGEubGlzdFN0b3JlLnJlY29yZExpc3QucmVjb3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGFzeW5jRGF0YS5jcml0ZXJpYSA9IGRhdGEubGlzdFN0b3JlLnJlY29yZExpc3QuY3JpdGVyaWE7XG4gICAgICAgICAgICBhc3luY0RhdGEuc29ydCA9IGRhdGEubGlzdFN0b3JlLnJlY29yZExpc3Quc29ydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWxlY3Rpb24uYWxsICYmIHNlbGVjdGlvbi5jb3VudCA8PSBkYXRhLmxpc3RTdG9yZS5yZWNvcmRMaXN0LnJlY29yZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBhc3luY0RhdGEuaWRzID0gW107XG4gICAgICAgICAgICBkYXRhLmxpc3RTdG9yZS5yZWNvcmRMaXN0LnJlY29yZHMuZm9yRWFjaChyZWNvcmQgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGEuaWRzLnB1c2gocmVjb3JkLmlkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWxlY3Rpb24uYWxsKSB7XG4gICAgICAgICAgICBhc3luY0RhdGEuaWRzID0gT2JqZWN0LmtleXMoc2VsZWN0aW9uLnNlbGVjdGVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhc3luY0RhdGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVuIHRoaXMgZnVuY3Rpb24gb25jZSB0aGUgcHJvY2VzcyBpcyBleGVjdXRlZFxuICAgICAqXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9jZXNzIFByb2Nlc3MgZGF0YSByZXR1cm5lZCBieSB0aGUgcHJvY2VzcyBvbmNlIHRoZSBwcm9jZXNzIGlzIGV4ZWN1dGVkXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgTGlzdFZpZXdSZWNvcmRQYW5lbEFjdGlvbkRhdGFcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaGFuZGxlUHJvY2Vzc1Jlc3VsdChwcm9jZXNzOiBQcm9jZXNzLCBkYXRhOiBMaXN0Vmlld1JlY29yZFBhbmVsQWN0aW9uRGF0YSk6IHZvaWQge1xuXG4gICAgICAgIGlmIChwcm9jZXNzLmRhdGEgJiYgcHJvY2Vzcy5kYXRhLnJlbG9hZCkge1xuICAgICAgICAgICAgZGF0YS5saXN0U3RvcmUucmVjb3JkTGlzdC5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICAgICAgZGF0YS5saXN0U3RvcmUubG9hZChmYWxzZSkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9jZXNzLmRhdGEgJiYgcHJvY2Vzcy5kYXRhLmRhdGFVcGRhdGVkKSB7XG4gICAgICAgICAgICBkYXRhLmxpc3RTdG9yZS50cmlnZ2VyRGF0YVVwZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGF0YS5saXN0U3RvcmUuY2xvc2VSZWNvcmRQYW5lbCgpO1xuICAgIH1cbn1cbiJdfQ==