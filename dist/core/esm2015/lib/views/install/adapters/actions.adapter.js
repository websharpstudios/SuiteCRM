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
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { MetadataStore } from '../../../store/metadata/metadata.store.service';
import { AsyncActionService } from '../../../services/process/processes/async-action/async-action';
import { LanguageStore } from '../../../store/language/language.store';
import { MessageService } from '../../../services/message/message.service';
import { ConfirmationModalService } from '../../../services/modals/confirmation-modal.service';
import { BaseRecordActionsAdapter } from '../../../services/actions/base-record-action.adapter';
import { InstallViewStore } from '../store/install-view/install-view.store';
import { InstallActionManager } from '../actions/install-action-manager.service';
import { SelectModalService } from '../../../services/modals/select-modal.service';
export class InstallActionsAdapter extends BaseRecordActionsAdapter {
    constructor(store, metadata, language, actionManager, asyncActionService, message, confirmation, selectModalService) {
        super(actionManager, asyncActionService, message, confirmation, language, selectModalService);
        this.store = store;
        this.metadata = metadata;
        this.language = language;
        this.actionManager = actionManager;
        this.asyncActionService = asyncActionService;
        this.message = message;
        this.confirmation = confirmation;
        this.selectModalService = selectModalService;
        this.defaultActions = {
            detail: [],
            edit: [
                {
                    key: 'install',
                    labelKey: 'LBL_PROCEED',
                    params: {
                        expanded: true
                    },
                    acl: []
                },
            ],
            create: [],
        };
    }
    getActions(context) {
        return combineLatest([
            this.store.getActions(),
            this.store.mode$,
            this.store.stagingRecord$,
        ]).pipe(map(([actions, mode]) => {
            if (!mode) {
                return [];
            }
            return this.parseModeActions(actions, mode, this.store.getViewContext());
        }));
    }
    buildActionData(action, context) {
        return {
            store: this.store
        };
    }
    /**
     * Build backend process input
     *
     * @param action
     * @param actionName
     * @param moduleName
     * @param context
     */
    buildActionInput(action, actionName, moduleName, context = null) {
        const baseRecord = this.store.getBaseRecord();
        this.message.removeMessages();
        return {
            action: actionName,
            module: baseRecord.module,
            id: baseRecord.id,
            record: baseRecord
        };
    }
    getMode() {
        return this.store.getMode();
    }
    getModuleName(context) {
        return this.store.getModuleName();
    }
    reload(action, process, context) {
    }
}
InstallActionsAdapter.decorators = [
    { type: Injectable }
];
InstallActionsAdapter.ctorParameters = () => [
    { type: InstallViewStore },
    { type: MetadataStore },
    { type: LanguageStore },
    { type: InstallActionManager },
    { type: AsyncActionService },
    { type: MessageService },
    { type: ConfirmationModalService },
    { type: SelectModalService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy5hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3ZpZXdzL2luc3RhbGwvYWRhcHRlcnMvYWN0aW9ucy5hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBQyxhQUFhLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ25DLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQztBQUM3RSxPQUFPLEVBQW1CLGtCQUFrQixFQUFDLE1BQU0sK0RBQStELENBQUM7QUFDbkgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBQ3JFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSwyQ0FBMkMsQ0FBQztBQUV6RSxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxxREFBcUQsQ0FBQztBQUM3RixPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxzREFBc0QsQ0FBQztBQUU5RixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSwwQ0FBMEMsQ0FBQztBQUMxRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwyQ0FBMkMsQ0FBQztBQUMvRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSwrQ0FBK0MsQ0FBQztBQUdqRixNQUFNLE9BQU8scUJBQXNCLFNBQVEsd0JBQStDO0lBaUJ0RixZQUNjLEtBQXVCLEVBQ3ZCLFFBQXVCLEVBQ3ZCLFFBQXVCLEVBQ3ZCLGFBQW1DLEVBQ25DLGtCQUFzQyxFQUN0QyxPQUF1QixFQUN2QixZQUFzQyxFQUN0QyxrQkFBc0M7UUFFaEQsS0FBSyxDQUNELGFBQWEsRUFDYixrQkFBa0IsRUFDbEIsT0FBTyxFQUNQLFlBQVksRUFDWixRQUFRLEVBQ1Isa0JBQWtCLENBQ3JCLENBQUE7UUFoQlMsVUFBSyxHQUFMLEtBQUssQ0FBa0I7UUFDdkIsYUFBUSxHQUFSLFFBQVEsQ0FBZTtRQUN2QixhQUFRLEdBQVIsUUFBUSxDQUFlO1FBQ3ZCLGtCQUFhLEdBQWIsYUFBYSxDQUFzQjtRQUNuQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBQ3ZCLGlCQUFZLEdBQVosWUFBWSxDQUEwQjtRQUN0Qyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBdkJwRCxtQkFBYyxHQUFnQjtZQUMxQixNQUFNLEVBQUUsRUFBRTtZQUNWLElBQUksRUFBRTtnQkFDRjtvQkFDSSxHQUFHLEVBQUUsU0FBUztvQkFDZCxRQUFRLEVBQUUsYUFBYTtvQkFDdkIsTUFBTSxFQUFFO3dCQUNKLFFBQVEsRUFBRSxJQUFJO3FCQUNqQjtvQkFDRCxHQUFHLEVBQUUsRUFBRTtpQkFDVjthQUNKO1lBQ0QsTUFBTSxFQUFFLEVBQUU7U0FDYixDQUFDO0lBb0JGLENBQUM7SUFFRCxVQUFVLENBQUMsT0FBdUI7UUFDOUIsT0FBTyxhQUFhLENBQ2hCO1lBQ0ksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO1lBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYztTQUM1QixDQUNKLENBQUMsSUFBSSxDQUNGLEdBQUcsQ0FBQyxDQUNBLENBQ0ksT0FBTyxFQUNQLElBQUksQ0FDUCxFQUNILEVBQUU7WUFDQSxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNQLE9BQU8sRUFBRSxDQUFDO2FBQ2I7WUFFRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUM3RSxDQUFDLENBQUMsQ0FDTCxDQUFDO0lBQ04sQ0FBQztJQUVTLGVBQWUsQ0FBQyxNQUFjLEVBQUUsT0FBdUI7UUFDN0QsT0FBTztZQUNILEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztTQUNLLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDTyxnQkFBZ0IsQ0FBQyxNQUFjLEVBQUUsVUFBa0IsRUFBRSxVQUFrQixFQUFFLFVBQXlCLElBQUk7UUFDNUcsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUU5QyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRTlCLE9BQU87WUFDSCxNQUFNLEVBQUUsVUFBVTtZQUNsQixNQUFNLEVBQUUsVUFBVSxDQUFDLE1BQU07WUFDekIsRUFBRSxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQ2pCLE1BQU0sRUFBRSxVQUFVO1NBQ0QsQ0FBQztJQUMxQixDQUFDO0lBRVMsT0FBTztRQUNiLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRVMsYUFBYSxDQUFDLE9BQXVCO1FBQzNDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRVMsTUFBTSxDQUFDLE1BQWMsRUFBRSxPQUFnQixFQUFFLE9BQXVCO0lBQzFFLENBQUM7OztZQWpHSixVQUFVOzs7WUFKSCxnQkFBZ0I7WUFSaEIsYUFBYTtZQUViLGFBQWE7WUFPYixvQkFBb0I7WUFSRixrQkFBa0I7WUFFcEMsY0FBYztZQUVkLHdCQUF3QjtZQUt4QixrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FjdGlvbiwgQWN0aW9uQ29udGV4dCwgTW9kZUFjdGlvbnMsIFZpZXdNb2RlfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01ldGFkYXRhU3RvcmV9IGZyb20gJy4uLy4uLy4uL3N0b3JlL21ldGFkYXRhL21ldGFkYXRhLnN0b3JlLnNlcnZpY2UnO1xuaW1wb3J0IHtBc3luY0FjdGlvbklucHV0LCBBc3luY0FjdGlvblNlcnZpY2V9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL3Byb2Nlc3MvcHJvY2Vzc2VzL2FzeW5jLWFjdGlvbi9hc3luYy1hY3Rpb24nO1xuaW1wb3J0IHtMYW5ndWFnZVN0b3JlfSBmcm9tICcuLi8uLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9tZXNzYWdlL21lc3NhZ2Uuc2VydmljZSc7XG5pbXBvcnQge1Byb2Nlc3N9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL3Byb2Nlc3MvcHJvY2Vzcy5zZXJ2aWNlJztcbmltcG9ydCB7Q29uZmlybWF0aW9uTW9kYWxTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9tb2RhbHMvY29uZmlybWF0aW9uLW1vZGFsLnNlcnZpY2UnO1xuaW1wb3J0IHtCYXNlUmVjb3JkQWN0aW9uc0FkYXB0ZXJ9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2FjdGlvbnMvYmFzZS1yZWNvcmQtYWN0aW9uLmFkYXB0ZXInO1xuaW1wb3J0IHtJbnN0YWxsVmlld0FjdGlvbkRhdGF9IGZyb20gJy4uL2FjdGlvbnMvaW5zdGFsbC12aWV3LmFjdGlvbic7XG5pbXBvcnQge0luc3RhbGxWaWV3U3RvcmV9IGZyb20gJy4uL3N0b3JlL2luc3RhbGwtdmlldy9pbnN0YWxsLXZpZXcuc3RvcmUnO1xuaW1wb3J0IHtJbnN0YWxsQWN0aW9uTWFuYWdlcn0gZnJvbSAnLi4vYWN0aW9ucy9pbnN0YWxsLWFjdGlvbi1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHtTZWxlY3RNb2RhbFNlcnZpY2V9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL21vZGFscy9zZWxlY3QtbW9kYWwuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBJbnN0YWxsQWN0aW9uc0FkYXB0ZXIgZXh0ZW5kcyBCYXNlUmVjb3JkQWN0aW9uc0FkYXB0ZXI8SW5zdGFsbFZpZXdBY3Rpb25EYXRhPiB7XG5cbiAgICBkZWZhdWx0QWN0aW9uczogTW9kZUFjdGlvbnMgPSB7XG4gICAgICAgIGRldGFpbDogW10sXG4gICAgICAgIGVkaXQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6ICdpbnN0YWxsJyxcbiAgICAgICAgICAgICAgICBsYWJlbEtleTogJ0xCTF9QUk9DRUVEJyxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgZXhwYW5kZWQ6IHRydWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFjbDogW11cbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNyZWF0ZTogW10sXG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgc3RvcmU6IEluc3RhbGxWaWV3U3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBtZXRhZGF0YTogTWV0YWRhdGFTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgYWN0aW9uTWFuYWdlcjogSW5zdGFsbEFjdGlvbk1hbmFnZXIsXG4gICAgICAgIHByb3RlY3RlZCBhc3luY0FjdGlvblNlcnZpY2U6IEFzeW5jQWN0aW9uU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIG1lc3NhZ2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgY29uZmlybWF0aW9uOiBDb25maXJtYXRpb25Nb2RhbFNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBzZWxlY3RNb2RhbFNlcnZpY2U6IFNlbGVjdE1vZGFsU2VydmljZVxuICAgICkge1xuICAgICAgICBzdXBlcihcbiAgICAgICAgICAgIGFjdGlvbk1hbmFnZXIsXG4gICAgICAgICAgICBhc3luY0FjdGlvblNlcnZpY2UsXG4gICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgY29uZmlybWF0aW9uLFxuICAgICAgICAgICAgbGFuZ3VhZ2UsXG4gICAgICAgICAgICBzZWxlY3RNb2RhbFNlcnZpY2VcbiAgICAgICAgKVxuICAgIH1cblxuICAgIGdldEFjdGlvbnMoY29udGV4dD86IEFjdGlvbkNvbnRleHQpOiBPYnNlcnZhYmxlPEFjdGlvbltdPiB7XG4gICAgICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuZ2V0QWN0aW9ucygpLFxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUubW9kZSQsXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5zdGFnaW5nUmVjb3JkJCxcbiAgICAgICAgICAgIF1cbiAgICAgICAgKS5waXBlKFxuICAgICAgICAgICAgbWFwKChcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgIG1vZGVcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIW1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTW9kZUFjdGlvbnMoYWN0aW9ucywgbW9kZSwgdGhpcy5zdG9yZS5nZXRWaWV3Q29udGV4dCgpKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGJ1aWxkQWN0aW9uRGF0YShhY3Rpb246IEFjdGlvbiwgY29udGV4dD86IEFjdGlvbkNvbnRleHQpOiBJbnN0YWxsVmlld0FjdGlvbkRhdGEge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RvcmU6IHRoaXMuc3RvcmVcbiAgICAgICAgfSBhcyBJbnN0YWxsVmlld0FjdGlvbkRhdGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgYmFja2VuZCBwcm9jZXNzIGlucHV0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gYWN0aW9uXG4gICAgICogQHBhcmFtIGFjdGlvbk5hbWVcbiAgICAgKiBAcGFyYW0gbW9kdWxlTmFtZVxuICAgICAqIEBwYXJhbSBjb250ZXh0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGJ1aWxkQWN0aW9uSW5wdXQoYWN0aW9uOiBBY3Rpb24sIGFjdGlvbk5hbWU6IHN0cmluZywgbW9kdWxlTmFtZTogc3RyaW5nLCBjb250ZXh0OiBBY3Rpb25Db250ZXh0ID0gbnVsbCk6IEFzeW5jQWN0aW9uSW5wdXQge1xuICAgICAgICBjb25zdCBiYXNlUmVjb3JkID0gdGhpcy5zdG9yZS5nZXRCYXNlUmVjb3JkKCk7XG5cbiAgICAgICAgdGhpcy5tZXNzYWdlLnJlbW92ZU1lc3NhZ2VzKCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uTmFtZSxcbiAgICAgICAgICAgIG1vZHVsZTogYmFzZVJlY29yZC5tb2R1bGUsXG4gICAgICAgICAgICBpZDogYmFzZVJlY29yZC5pZCxcbiAgICAgICAgICAgIHJlY29yZDogYmFzZVJlY29yZFxuICAgICAgICB9IGFzIEFzeW5jQWN0aW9uSW5wdXQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldE1vZGUoKTogVmlld01vZGUge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS5nZXRNb2RlKCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldE1vZHVsZU5hbWUoY29udGV4dD86IEFjdGlvbkNvbnRleHQpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS5nZXRNb2R1bGVOYW1lKCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbG9hZChhY3Rpb246IEFjdGlvbiwgcHJvY2VzczogUHJvY2VzcywgY29udGV4dD86IEFjdGlvbkNvbnRleHQpOiB2b2lkIHtcbiAgICB9XG59XG4iXX0=