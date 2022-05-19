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
import { combineLatest, of } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { AsyncActionService } from '../../../services/process/processes/async-action/async-action';
import { MessageService } from '../../../services/message/message.service';
import { ConfirmationModalService } from '../../../services/modals/confirmation-modal.service';
import { LanguageStore } from '../../../store/language/language.store';
import { BaseRecordActionsAdapter } from '../../../services/actions/base-record-action.adapter';
import { SubpanelStore } from '../store/subpanel/subpanel.store';
import { SubpanelLineActionManager } from '../line-actions/line-action-manager.service';
import { SelectModalService } from "../../../services/modals/select-modal.service";
import * as i0 from "@angular/core";
import * as i1 from "../store/subpanel/subpanel.store";
import * as i2 from "../line-actions/line-action-manager.service";
import * as i3 from "../../../services/process/processes/async-action/async-action";
import * as i4 from "../../../services/message/message.service";
import * as i5 from "../../../services/modals/confirmation-modal.service";
import * as i6 from "../../../store/language/language.store";
import * as i7 from "../../../services/modals/select-modal.service";
export class SubpanelLineActionsAdapter extends BaseRecordActionsAdapter {
    constructor(store, actionManager, asyncActionService, message, confirmation, language, selectModalService) {
        super(actionManager, asyncActionService, message, confirmation, language, selectModalService);
        this.store = store;
        this.actionManager = actionManager;
        this.asyncActionService = asyncActionService;
        this.message = message;
        this.confirmation = confirmation;
        this.language = language;
        this.selectModalService = selectModalService;
    }
    getActions(context = null) {
        return combineLatest([
            this.store.metadata$.pipe(map(metadata => metadata.lineActions)),
            of('list').pipe(shareReplay()),
        ]).pipe(map(([actions, mode]) => {
            return this.parseModeActions(actions, mode, context);
        }));
    }
    buildActionData(action, context) {
        return {
            record: (context && context.record) || null,
            store: this.store,
            action: action
        };
    }
    getMode() {
        return 'list';
    }
    getModuleName(context) {
        return this.store.metadata.module;
    }
    reload(action, process, context) {
        this.store.load(false).pipe(take(1)).subscribe();
        this.store.loadAllStatistics(false).pipe(take(1)).subscribe();
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
        const metadata = this.store.metadata;
        const collectionList = metadata.collection_list || null;
        const module = (context && context.module) || moduleName;
        let linkField = metadata.get_subpanel_data;
        if (collectionList && collectionList[module] && collectionList[module].get_subpanel_data) {
            linkField = collectionList[module].get_subpanel_data;
        }
        if (linkField && action && action.params && action.params.linkFieldMapping) {
            Object.keys(action.params.linkFieldMapping).some(key => {
                if (linkField.includes(key)) {
                    linkField = action.params.linkFieldMapping[key];
                    return true;
                }
            });
        }
        return {
            action: actionName,
            module: moduleName,
            id: (context && context.record && context.record.id) || '',
            payload: {
                baseModule: this.store.parentModule,
                baseRecordId: this.store.parentId,
                linkField,
                recordModule: module,
                relateModule: this.store.metadata.module,
                relateRecordId: (context && context.record && context.record.id) || '',
            }
        };
    }
}
SubpanelLineActionsAdapter.ɵprov = i0.ɵɵdefineInjectable({ factory: function SubpanelLineActionsAdapter_Factory() { return new SubpanelLineActionsAdapter(i0.ɵɵinject(i1.SubpanelStore), i0.ɵɵinject(i2.SubpanelLineActionManager), i0.ɵɵinject(i3.AsyncActionService), i0.ɵɵinject(i4.MessageService), i0.ɵɵinject(i5.ConfirmationModalService), i0.ɵɵinject(i6.LanguageStore), i0.ɵɵinject(i7.SelectModalService)); }, token: SubpanelLineActionsAdapter, providedIn: "root" });
SubpanelLineActionsAdapter.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
SubpanelLineActionsAdapter.ctorParameters = () => [
    { type: SubpanelStore },
    { type: SubpanelLineActionManager },
    { type: AsyncActionService },
    { type: MessageService },
    { type: ConfirmationModalService },
    { type: LanguageStore },
    { type: SelectModalService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS1hY3Rpb25zLmFkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29udGFpbmVycy9zdWJwYW5lbC9hZGFwdGVycy9saW5lLWFjdGlvbnMuYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsYUFBYSxFQUFjLEVBQUUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNuRCxPQUFPLEVBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0RCxPQUFPLEVBQW1CLGtCQUFrQixFQUFDLE1BQU0sK0RBQStELENBQUM7QUFDbkgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBRXpFLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLHFEQUFxRCxDQUFDO0FBQzdGLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUNyRSxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxzREFBc0QsQ0FBQztBQUU5RixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDL0QsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sNkNBQTZDLENBQUM7QUFDdEYsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sK0NBQStDLENBQUM7Ozs7Ozs7OztBQUtqRixNQUFNLE9BQU8sMEJBQTJCLFNBQVEsd0JBQWdEO0lBRTVGLFlBQ2MsS0FBb0IsRUFDcEIsYUFBd0MsRUFDeEMsa0JBQXNDLEVBQ3RDLE9BQXVCLEVBQ3ZCLFlBQXNDLEVBQ3RDLFFBQXVCLEVBQ3ZCLGtCQUFzQztRQUVoRCxLQUFLLENBQUMsYUFBYSxFQUFFLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixDQUFDLENBQUE7UUFSbkYsVUFBSyxHQUFMLEtBQUssQ0FBZTtRQUNwQixrQkFBYSxHQUFiLGFBQWEsQ0FBMkI7UUFDeEMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUN2QixpQkFBWSxHQUFaLFlBQVksQ0FBMEI7UUFDdEMsYUFBUSxHQUFSLFFBQVEsQ0FBZTtRQUN2Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO0lBR3BELENBQUM7SUFFRCxVQUFVLENBQUMsVUFBeUIsSUFBSTtRQUVwQyxPQUFPLGFBQWEsQ0FDaEI7WUFDSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2hFLEVBQUUsQ0FBQyxNQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQzdDLENBQ0osQ0FBQyxJQUFJLENBQ0YsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTtZQUVwQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUNMLENBQUM7SUFDTixDQUFDO0lBRVMsZUFBZSxDQUFDLE1BQWMsRUFBRSxPQUF1QjtRQUM3RCxPQUFPO1lBQ0gsTUFBTSxFQUFFLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJO1lBQzNDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixNQUFNLEVBQUUsTUFBTTtTQUNTLENBQUM7SUFDaEMsQ0FBQztJQUVTLE9BQU87UUFDYixPQUFPLE1BQWtCLENBQUM7SUFDOUIsQ0FBQztJQUVTLGFBQWEsQ0FBQyxPQUF1QjtRQUMzQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztJQUN0QyxDQUFDO0lBRVMsTUFBTSxDQUFDLE1BQWMsRUFBRSxPQUFnQixFQUFFLE9BQXVCO1FBQ3RFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNsRSxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNPLGdCQUFnQixDQUFDLE1BQWMsRUFBRSxVQUFrQixFQUFFLFVBQWtCLEVBQUUsVUFBeUIsSUFBSTtRQUU1RyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUNyQyxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQztRQUV4RCxNQUFNLE1BQU0sR0FBRyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksVUFBVSxDQUFDO1FBRXpELElBQUksU0FBUyxHQUFXLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQztRQUVuRCxJQUFHLGNBQWMsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGlCQUFpQixFQUFDO1lBQ3BGLFNBQVMsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsaUJBQWlCLENBQUM7U0FDeEQ7UUFFRCxJQUFHLFNBQVMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFDO1lBQ3RFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDbkQsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFDO29CQUN4QixTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDaEQsT0FBTyxJQUFJLENBQUM7aUJBQ2Y7WUFDTCxDQUFDLENBQUMsQ0FBQTtTQUNMO1FBRUQsT0FBTztZQUNILE1BQU0sRUFBRSxVQUFVO1lBQ2xCLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLEVBQUUsRUFBRSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRTtZQUMxRCxPQUFPLEVBQUU7Z0JBQ0wsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWTtnQkFDbkMsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtnQkFDakMsU0FBUztnQkFDVCxZQUFZLEVBQUUsTUFBTTtnQkFDcEIsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU07Z0JBQ3hDLGNBQWMsRUFBRSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRTthQUN6RTtTQUNnQixDQUFDO0lBQzFCLENBQUM7Ozs7WUFoR0osVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFOTyxhQUFhO1lBQ2IseUJBQXlCO1lBUlAsa0JBQWtCO1lBQ3BDLGNBQWM7WUFFZCx3QkFBd0I7WUFDeEIsYUFBYTtZQUtiLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QWN0aW9uLCBBY3Rpb25Db250ZXh0LCBWaWV3TW9kZX0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7Y29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgb2Z9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIHNoYXJlUmVwbGF5LCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0FzeW5jQWN0aW9uSW5wdXQsIEFzeW5jQWN0aW9uU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvcHJvY2Vzcy9wcm9jZXNzZXMvYXN5bmMtYWN0aW9uL2FzeW5jLWFjdGlvbic7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9tZXNzYWdlL21lc3NhZ2Uuc2VydmljZSc7XG5pbXBvcnQge1Byb2Nlc3N9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL3Byb2Nlc3MvcHJvY2Vzcy5zZXJ2aWNlJztcbmltcG9ydCB7Q29uZmlybWF0aW9uTW9kYWxTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9tb2RhbHMvY29uZmlybWF0aW9uLW1vZGFsLnNlcnZpY2UnO1xuaW1wb3J0IHtMYW5ndWFnZVN0b3JlfSBmcm9tICcuLi8uLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5pbXBvcnQge0Jhc2VSZWNvcmRBY3Rpb25zQWRhcHRlcn0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvYWN0aW9ucy9iYXNlLXJlY29yZC1hY3Rpb24uYWRhcHRlcic7XG5pbXBvcnQge1N1YnBhbmVsTGluZUFjdGlvbkRhdGF9IGZyb20gJy4uL2xpbmUtYWN0aW9ucy9saW5lLmFjdGlvbic7XG5pbXBvcnQge1N1YnBhbmVsU3RvcmV9IGZyb20gJy4uL3N0b3JlL3N1YnBhbmVsL3N1YnBhbmVsLnN0b3JlJztcbmltcG9ydCB7U3VicGFuZWxMaW5lQWN0aW9uTWFuYWdlcn0gZnJvbSAnLi4vbGluZS1hY3Rpb25zL2xpbmUtYWN0aW9uLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQge1NlbGVjdE1vZGFsU2VydmljZX0gZnJvbSBcIi4uLy4uLy4uL3NlcnZpY2VzL21vZGFscy9zZWxlY3QtbW9kYWwuc2VydmljZVwiO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBTdWJwYW5lbExpbmVBY3Rpb25zQWRhcHRlciBleHRlbmRzIEJhc2VSZWNvcmRBY3Rpb25zQWRhcHRlcjxTdWJwYW5lbExpbmVBY3Rpb25EYXRhPiB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHN0b3JlOiBTdWJwYW5lbFN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgYWN0aW9uTWFuYWdlcjogU3VicGFuZWxMaW5lQWN0aW9uTWFuYWdlcixcbiAgICAgICAgcHJvdGVjdGVkIGFzeW5jQWN0aW9uU2VydmljZTogQXN5bmNBY3Rpb25TZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgbWVzc2FnZTogTWVzc2FnZVNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBjb25maXJtYXRpb246IENvbmZpcm1hdGlvbk1vZGFsU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgc2VsZWN0TW9kYWxTZXJ2aWNlOiBTZWxlY3RNb2RhbFNlcnZpY2VcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYWN0aW9uTWFuYWdlciwgYXN5bmNBY3Rpb25TZXJ2aWNlLCBtZXNzYWdlLCBjb25maXJtYXRpb24sIGxhbmd1YWdlLCBzZWxlY3RNb2RhbFNlcnZpY2UpXG4gICAgfVxuXG4gICAgZ2V0QWN0aW9ucyhjb250ZXh0OiBBY3Rpb25Db250ZXh0ID0gbnVsbCk6IE9ic2VydmFibGU8QWN0aW9uW10+IHtcblxuICAgICAgICByZXR1cm4gY29tYmluZUxhdGVzdChcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLm1ldGFkYXRhJC5waXBlKG1hcChtZXRhZGF0YSA9PiBtZXRhZGF0YS5saW5lQWN0aW9ucykpLFxuICAgICAgICAgICAgICAgIG9mKCdsaXN0JyBhcyBWaWV3TW9kZSkucGlwZShzaGFyZVJlcGxheSgpKSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgKS5waXBlKFxuICAgICAgICAgICAgbWFwKChbYWN0aW9ucywgbW9kZV0pID0+IHtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTW9kZUFjdGlvbnMoYWN0aW9ucywgbW9kZSwgY29udGV4dCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBidWlsZEFjdGlvbkRhdGEoYWN0aW9uOiBBY3Rpb24sIGNvbnRleHQ/OiBBY3Rpb25Db250ZXh0KTogU3VicGFuZWxMaW5lQWN0aW9uRGF0YSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZWNvcmQ6IChjb250ZXh0ICYmIGNvbnRleHQucmVjb3JkKSB8fCBudWxsLFxuICAgICAgICAgICAgc3RvcmU6IHRoaXMuc3RvcmUsXG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvblxuICAgICAgICB9IGFzIFN1YnBhbmVsTGluZUFjdGlvbkRhdGE7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldE1vZGUoKTogVmlld01vZGUge1xuICAgICAgICByZXR1cm4gJ2xpc3QnIGFzIFZpZXdNb2RlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRNb2R1bGVOYW1lKGNvbnRleHQ/OiBBY3Rpb25Db250ZXh0KTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmUubWV0YWRhdGEubW9kdWxlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZWxvYWQoYWN0aW9uOiBBY3Rpb24sIHByb2Nlc3M6IFByb2Nlc3MsIGNvbnRleHQ/OiBBY3Rpb25Db250ZXh0KTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RvcmUubG9hZChmYWxzZSkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy5zdG9yZS5sb2FkQWxsU3RhdGlzdGljcyhmYWxzZSkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBiYWNrZW5kIHByb2Nlc3MgaW5wdXRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhY3Rpb25cbiAgICAgKiBAcGFyYW0gYWN0aW9uTmFtZVxuICAgICAqIEBwYXJhbSBtb2R1bGVOYW1lXG4gICAgICogQHBhcmFtIGNvbnRleHRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYnVpbGRBY3Rpb25JbnB1dChhY3Rpb246IEFjdGlvbiwgYWN0aW9uTmFtZTogc3RyaW5nLCBtb2R1bGVOYW1lOiBzdHJpbmcsIGNvbnRleHQ6IEFjdGlvbkNvbnRleHQgPSBudWxsKTogQXN5bmNBY3Rpb25JbnB1dCB7XG5cbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSB0aGlzLnN0b3JlLm1ldGFkYXRhO1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uTGlzdCA9IG1ldGFkYXRhLmNvbGxlY3Rpb25fbGlzdCB8fCBudWxsO1xuXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IChjb250ZXh0ICYmIGNvbnRleHQubW9kdWxlKSB8fCBtb2R1bGVOYW1lO1xuXG4gICAgICAgIGxldCBsaW5rRmllbGQ6IHN0cmluZyA9IG1ldGFkYXRhLmdldF9zdWJwYW5lbF9kYXRhO1xuXG4gICAgICAgIGlmKGNvbGxlY3Rpb25MaXN0ICYmIGNvbGxlY3Rpb25MaXN0W21vZHVsZV0gJiYgY29sbGVjdGlvbkxpc3RbbW9kdWxlXS5nZXRfc3VicGFuZWxfZGF0YSl7XG4gICAgICAgICAgICBsaW5rRmllbGQgPSBjb2xsZWN0aW9uTGlzdFttb2R1bGVdLmdldF9zdWJwYW5lbF9kYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYobGlua0ZpZWxkICYmIGFjdGlvbiAmJiBhY3Rpb24ucGFyYW1zICYmIGFjdGlvbi5wYXJhbXMubGlua0ZpZWxkTWFwcGluZyl7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhY3Rpb24ucGFyYW1zLmxpbmtGaWVsZE1hcHBpbmcpLnNvbWUoa2V5ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobGlua0ZpZWxkLmluY2x1ZGVzKGtleSkpe1xuICAgICAgICAgICAgICAgICAgICBsaW5rRmllbGQgPSBhY3Rpb24ucGFyYW1zLmxpbmtGaWVsZE1hcHBpbmdba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvbk5hbWUsXG4gICAgICAgICAgICBtb2R1bGU6IG1vZHVsZU5hbWUsXG4gICAgICAgICAgICBpZDogKGNvbnRleHQgJiYgY29udGV4dC5yZWNvcmQgJiYgY29udGV4dC5yZWNvcmQuaWQpIHx8ICcnLFxuICAgICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgICAgIGJhc2VNb2R1bGU6IHRoaXMuc3RvcmUucGFyZW50TW9kdWxlLFxuICAgICAgICAgICAgICAgIGJhc2VSZWNvcmRJZDogdGhpcy5zdG9yZS5wYXJlbnRJZCxcbiAgICAgICAgICAgICAgICBsaW5rRmllbGQsXG4gICAgICAgICAgICAgICAgcmVjb3JkTW9kdWxlOiBtb2R1bGUsXG4gICAgICAgICAgICAgICAgcmVsYXRlTW9kdWxlOiB0aGlzLnN0b3JlLm1ldGFkYXRhLm1vZHVsZSxcbiAgICAgICAgICAgICAgICByZWxhdGVSZWNvcmRJZDogKGNvbnRleHQgJiYgY29udGV4dC5yZWNvcmQgJiYgY29udGV4dC5yZWNvcmQuaWQpIHx8ICcnLFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGFzIEFzeW5jQWN0aW9uSW5wdXQ7XG4gICAgfVxufVxuIl19