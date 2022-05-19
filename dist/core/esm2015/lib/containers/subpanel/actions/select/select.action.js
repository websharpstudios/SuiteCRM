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
import { SubpanelActionHandler } from '../subpanel.action';
import { RecordListModalComponent } from "../../../record-list-modal/components/record-list-modal/record-list-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { take } from 'rxjs/operators';
import { AsyncActionService } from '../../../../services/process/processes/async-action/async-action';
import { MessageService } from '../../../../services/message/message.service';
import * as i0 from "@angular/core";
import * as i1 from "@ng-bootstrap/ng-bootstrap";
import * as i2 from "../../../../services/message/message.service";
import * as i3 from "../../../../services/process/processes/async-action/async-action";
export class SubpanelSelectAction extends SubpanelActionHandler {
    constructor(modalService, message, asyncActionService) {
        super();
        this.modalService = modalService;
        this.message = message;
        this.asyncActionService = asyncActionService;
        this.key = 'select';
        this.modes = ['list'];
    }
    shouldDisplay(data) {
        return true;
    }
    run(data) {
        this.showSelectModal(data);
    }
    /**
     * Show record selection modal
     */
    showSelectModal(data) {
        const modal = this.modalService.open(RecordListModalComponent, { size: 'xl', scrollable: true });
        modal.componentInstance.module = data.module;
        modal.result.then((result) => {
            if (!result || !result.selection || !result.selection.selected) {
                return;
            }
            const record = this.getSelectedRecord(result);
            let linkField = data.subpanelMeta.get_subpanel_data;
            const module = record.module || '';
            const collectionList = data.subpanelMeta.collection_list || null;
            if (collectionList && collectionList[module] && collectionList[module].get_subpanel_data) {
                linkField = collectionList[module].get_subpanel_data;
            }
            const input = {
                action: 'record-select',
                module: data.store.parentModule,
                id: data.store.parentId || '',
                payload: {
                    baseModule: data.parentModule,
                    baseRecordId: data.parentId,
                    linkField,
                    relateModule: record.module,
                    relateRecordId: record.id
                }
            };
            this.runAsyncAction(input, data);
        });
    }
    /**
     * Get Selected Record
     *
     * @param {object} data RecordListModalResult
     * @returns {object} Record
     */
    getSelectedRecord(data) {
        let id = '';
        Object.keys(data.selection.selected).some(selected => {
            id = selected;
            return true;
        });
        let record = null;
        data.records.some(rec => {
            if (rec && rec.id === id) {
                record = rec;
                return true;
            }
        });
        return record;
    }
    runAsyncAction(asyncData, data) {
        const actionName = 'record-select';
        this.message.removeMessages();
        this.asyncActionService.run(actionName, asyncData).pipe(take(1)).subscribe(() => {
            data.store.load(false).pipe(take(1)).subscribe();
            data.store.loadAllStatistics(false).pipe(take(1)).subscribe();
        });
    }
}
SubpanelSelectAction.ɵprov = i0.ɵɵdefineInjectable({ factory: function SubpanelSelectAction_Factory() { return new SubpanelSelectAction(i0.ɵɵinject(i1.NgbModal), i0.ɵɵinject(i2.MessageService), i0.ɵɵinject(i3.AsyncActionService)); }, token: SubpanelSelectAction, providedIn: "root" });
SubpanelSelectAction.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
SubpanelSelectAction.ctorParameters = () => [
    { type: NgbModal },
    { type: MessageService },
    { type: AsyncActionService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb250YWluZXJzL3N1YnBhbmVsL2FjdGlvbnMvc2VsZWN0L3NlbGVjdC5hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFxQixxQkFBcUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzdFLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLHFGQUFxRixDQUFDO0FBRTdILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEMsT0FBTyxFQUFtQixrQkFBa0IsRUFBQyxNQUFNLGtFQUFrRSxDQUFDO0FBQ3RILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQzs7Ozs7QUFNNUUsTUFBTSxPQUFPLG9CQUFxQixTQUFRLHFCQUFxQjtJQUszRCxZQUNjLFlBQXNCLEVBQ3RCLE9BQXVCLEVBQ3ZCLGtCQUFzQztRQUVoRCxLQUFLLEVBQUUsQ0FBQztRQUpFLGlCQUFZLEdBQVosWUFBWSxDQUFVO1FBQ3RCLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBQ3ZCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFQcEQsUUFBRyxHQUFHLFFBQVEsQ0FBQztRQUVmLFVBQUssR0FBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBUTdCLENBQUM7SUFHRCxhQUFhLENBQUMsSUFBd0I7UUFDbEMsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUF3QjtRQUV4QixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxD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LFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDNUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pELElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2xFLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7OztZQXZHSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQVJPLFFBQVE7WUFHUixjQUFjO1lBREksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtSZWNvcmQsIFZpZXdNb2RlfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtTdWJwYW5lbEFjdGlvbkRhdGEsIFN1YnBhbmVsQWN0aW9uSGFuZGxlcn0gZnJvbSAnLi4vc3VicGFuZWwuYWN0aW9uJztcbmltcG9ydCB7UmVjb3JkTGlzdE1vZGFsQ29tcG9uZW50fSBmcm9tIFwiLi4vLi4vLi4vcmVjb3JkLWxpc3QtbW9kYWwvY29tcG9uZW50cy9yZWNvcmQtbGlzdC1tb2RhbC9yZWNvcmQtbGlzdC1tb2RhbC5jb21wb25lbnRcIjtcbmltcG9ydCB7UmVjb3JkTGlzdE1vZGFsUmVzdWx0fSBmcm9tIFwiLi4vLi4vLi4vcmVjb3JkLWxpc3QtbW9kYWwvY29tcG9uZW50cy9yZWNvcmQtbGlzdC1tb2RhbC9yZWNvcmQtbGlzdC1tb2RhbC5tb2RlbFwiO1xuaW1wb3J0IHtOZ2JNb2RhbH0gZnJvbSBcIkBuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwXCI7XG5pbXBvcnQge3Rha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7QXN5bmNBY3Rpb25JbnB1dCwgQXN5bmNBY3Rpb25TZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9wcm9jZXNzL3Byb2Nlc3Nlcy9hc3luYy1hY3Rpb24vYXN5bmMtYWN0aW9uJztcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL21lc3NhZ2UvbWVzc2FnZS5zZXJ2aWNlJztcblxuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFN1YnBhbmVsU2VsZWN0QWN0aW9uIGV4dGVuZHMgU3VicGFuZWxBY3Rpb25IYW5kbGVyIHtcbiAgICBrZXkgPSAnc2VsZWN0JztcblxuICAgIG1vZGVzOiBWaWV3TW9kZVtdID0gWydsaXN0J107XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIG1vZGFsU2VydmljZTogTmdiTW9kYWwsXG4gICAgICAgIHByb3RlY3RlZCBtZXNzYWdlOiBNZXNzYWdlU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIGFzeW5jQWN0aW9uU2VydmljZTogQXN5bmNBY3Rpb25TZXJ2aWNlXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG5cbiAgICBzaG91bGREaXNwbGF5KGRhdGE6IFN1YnBhbmVsQWN0aW9uRGF0YSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBydW4oZGF0YTogU3VicGFuZWxBY3Rpb25EYXRhKTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5zaG93U2VsZWN0TW9kYWwoZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdyByZWNvcmQgc2VsZWN0aW9uIG1vZGFsXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNob3dTZWxlY3RNb2RhbChkYXRhOiBTdWJwYW5lbEFjdGlvbkRhdGEpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbW9kYWwgPSB0aGlzLm1vZGFsU2VydmljZS5vcGVuKFJlY29yZExpc3RNb2RhbENvbXBvbmVudCwge3NpemU6ICd4bCcsIHNjcm9sbGFibGU6IHRydWV9KTtcblxuICAgICAgICBtb2RhbC5jb21wb25lbnRJbnN0YW5jZS5tb2R1bGUgPSBkYXRhLm1vZHVsZTtcblxuICAgICAgICBtb2RhbC5yZXN1bHQudGhlbigocmVzdWx0OiBSZWNvcmRMaXN0TW9kYWxSZXN1bHQpID0+IHtcblxuICAgICAgICAgICAgaWYgKCFyZXN1bHQgfHwgIXJlc3VsdC5zZWxlY3Rpb24gfHwgIXJlc3VsdC5zZWxlY3Rpb24uc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuZ2V0U2VsZWN0ZWRSZWNvcmQocmVzdWx0KTtcblxuICAgICAgICAgICAgbGV0IGxpbmtGaWVsZDogc3RyaW5nID0gZGF0YS5zdWJwYW5lbE1ldGEuZ2V0X3N1YnBhbmVsX2RhdGE7XG5cbiAgICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IHJlY29yZC5tb2R1bGUgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9uTGlzdCA9IGRhdGEuc3VicGFuZWxNZXRhLmNvbGxlY3Rpb25fbGlzdCB8fCBudWxsO1xuXG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbkxpc3QgJiYgY29sbGVjdGlvbkxpc3RbbW9kdWxlXSAmJiBjb2xsZWN0aW9uTGlzdFttb2R1bGVdLmdldF9zdWJwYW5lbF9kYXRhKSB7XG4gICAgICAgICAgICAgICAgbGlua0ZpZWxkID0gY29sbGVjdGlvbkxpc3RbbW9kdWxlXS5nZXRfc3VicGFuZWxfZGF0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uOiAncmVjb3JkLXNlbGVjdCcsXG4gICAgICAgICAgICAgICAgbW9kdWxlOiBkYXRhLnN0b3JlLnBhcmVudE1vZHVsZSxcbiAgICAgICAgICAgICAgICBpZDogZGF0YS5zdG9yZS5wYXJlbnRJZCB8fCAnJyxcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgICAgICAgIGJhc2VNb2R1bGU6IGRhdGEucGFyZW50TW9kdWxlLFxuICAgICAgICAgICAgICAgICAgICBiYXNlUmVjb3JkSWQ6IGRhdGEucGFyZW50SWQsXG4gICAgICAgICAgICAgICAgICAgIGxpbmtGaWVsZCxcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRlTW9kdWxlOiByZWNvcmQubW9kdWxlLFxuICAgICAgICAgICAgICAgICAgICByZWxhdGVSZWNvcmRJZDogcmVjb3JkLmlkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBhcyBBc3luY0FjdGlvbklucHV0O1xuXG4gICAgICAgICAgICB0aGlzLnJ1bkFzeW5jQWN0aW9uKGlucHV0LCBkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBHZXQgU2VsZWN0ZWQgUmVjb3JkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSBSZWNvcmRMaXN0TW9kYWxSZXN1bHRcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBSZWNvcmRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0U2VsZWN0ZWRSZWNvcmQoZGF0YTogUmVjb3JkTGlzdE1vZGFsUmVzdWx0KTogUmVjb3JkIHtcbiAgICAgICAgbGV0IGlkID0gJyc7XG4gICAgICAgIE9iamVjdC5rZXlzKGRhdGEuc2VsZWN0aW9uLnNlbGVjdGVkKS5zb21lKHNlbGVjdGVkID0+IHtcbiAgICAgICAgICAgIGlkID0gc2VsZWN0ZWQ7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IHJlY29yZDogUmVjb3JkID0gbnVsbDtcblxuICAgICAgICBkYXRhLnJlY29yZHMuc29tZShyZWMgPT4ge1xuICAgICAgICAgICAgaWYgKHJlYyAmJiByZWMuaWQgPT09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmVjb3JkID0gcmVjO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBydW5Bc3luY0FjdGlvbihhc3luY0RhdGE6IEFzeW5jQWN0aW9uSW5wdXQsIGRhdGE6IFN1YnBhbmVsQWN0aW9uRGF0YSk6IHZvaWQge1xuICAgICAgICBjb25zdCBhY3Rpb25OYW1lID0gJ3JlY29yZC1zZWxlY3QnO1xuXG4gICAgICAgIHRoaXMubWVzc2FnZS5yZW1vdmVNZXNzYWdlcygpO1xuXG4gICAgICAgIHRoaXMuYXN5bmNBY3Rpb25TZXJ2aWNlLnJ1bihhY3Rpb25OYW1lLCBhc3luY0RhdGEpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGRhdGEuc3RvcmUubG9hZChmYWxzZSkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIGRhdGEuc3RvcmUubG9hZEFsbFN0YXRpc3RpY3MoZmFsc2UpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuIl19