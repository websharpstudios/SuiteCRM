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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ModuleNameMapper } from '../../../../services/navigation/module-name-mapper/module-name-mapper.service';
import { RecordActionHandler } from '../record.action';
import { ActionNameMapper } from '../../../../services/navigation/action-name-mapper/action-name-mapper.service';
import { MessageModalComponent } from '../../../../components/modal/components/message-modal/message-modal.component';
import * as i0 from "@angular/core";
import * as i1 from "@ng-bootstrap/ng-bootstrap";
import * as i2 from "@angular/router";
import * as i3 from "../../../../services/navigation/module-name-mapper/module-name-mapper.service";
import * as i4 from "../../../../services/navigation/action-name-mapper/action-name-mapper.service";
export class CancelCreateAction extends RecordActionHandler {
    constructor(modalService, router, moduleNameMapper, actionNameMapper) {
        super();
        this.modalService = modalService;
        this.router = router;
        this.moduleNameMapper = moduleNameMapper;
        this.actionNameMapper = actionNameMapper;
        this.key = 'cancelCreate';
        this.modes = ['create'];
    }
    run(data) {
        if (data.store.recordStore.isDirty()) {
            this.showConfirmationModal(data);
            return;
        }
        this.cancel(data);
    }
    shouldDisplay() {
        return true;
    }
    cancel(data) {
        const store = data.store;
        let returnModule = store.getModuleName();
        if (store.params.return_module) {
            returnModule = this.moduleNameMapper.toFrontend(store.params.return_module);
        }
        let returnAction = store.params.return_action || '';
        const returnId = store.params.return_id || '';
        let route = '/' + returnModule;
        if (returnAction) {
            returnAction = this.actionNameMapper.toFrontend(returnAction);
            if (returnAction !== 'record' || returnId) {
                route += '/' + returnAction;
            }
        }
        if (returnId) {
            route += '/' + returnId;
        }
        this.router.navigate([route]).then();
    }
    showConfirmationModal(data) {
        const modal = this.modalService.open(MessageModalComponent);
        modal.componentInstance.textKey = 'WARN_UNSAVED_CHANGES';
        modal.componentInstance.buttons = [
            {
                labelKey: 'LBL_CANCEL',
                klass: ['btn-secondary'],
                onClick: activeModal => activeModal.dismiss()
            },
            {
                labelKey: 'LBL_OK',
                klass: ['btn-main'],
                onClick: activeModal => {
                    this.cancel(data);
                    activeModal.close();
                }
            },
        ];
    }
}
CancelCreateAction.ɵprov = i0.ɵɵdefineInjectable({ factory: function CancelCreateAction_Factory() { return new CancelCreateAction(i0.ɵɵinject(i1.NgbModal), i0.ɵɵinject(i2.Router), i0.ɵɵinject(i3.ModuleNameMapper), i0.ɵɵinject(i4.ActionNameMapper)); }, token: CancelCreateAction, providedIn: "root" });
CancelCreateAction.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
CancelCreateAction.ctorParameters = () => [
    { type: NgbModal },
    { type: Router },
    { type: ModuleNameMapper },
    { type: ActionNameMapper }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuY2VsLWNyZWF0ZS5hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvdmlld3MvcmVjb3JkL2FjdGlvbnMvY2FuY2VsLWNyZWF0ZS9jYW5jZWwtY3JlYXRlLmFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDcEQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLCtFQUErRSxDQUFDO0FBQy9HLE9BQU8sRUFBbUIsbUJBQW1CLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUN2RSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSwrRUFBK0UsQ0FBQztBQUMvRyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSwrRUFBK0UsQ0FBQzs7Ozs7O0FBS3BILE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxtQkFBbUI7SUFLdkQsWUFDWSxZQUFzQixFQUNwQixNQUFjLEVBQ2QsZ0JBQWtDLEVBQ2xDLGdCQUFrQztRQUU1QyxLQUFLLEVBQUUsQ0FBQztRQUxBLGlCQUFZLEdBQVosWUFBWSxDQUFVO1FBQ3BCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFQaEQsUUFBRyxHQUFHLGNBQWMsQ0FBQztRQUNyQixVQUFLLEdBQUcsQ0FBQyxRQUFvQixDQUFDLENBQUM7SUFTL0IsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUFzQjtRQUV0QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqQyxPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxhQUFhO1FBQ1QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVTLE1BQU0sQ0FBQyxJQUFzQjtRQUNuQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRXpCLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUV6QyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO1lBQzVCLFlBQVksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDL0U7UUFFRCxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUM7UUFDcEQsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO1FBRTlDLElBQUksS0FBSyxHQUFHLEdBQUcsR0FBRyxZQUFZLENBQUM7UUFFL0IsSUFBSSxZQUFZLEVBQUU7WUFDZCxZQUFZLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUU5RCxJQUFJLFlBQVksS0FBSyxRQUFRLElBQUksUUFBUSxFQUFFO2dCQUN2QyxLQUFLLElBQUksR0FBRyxHQUFHLFlBQVksQ0FBQzthQUMvQjtTQUNKO1FBRUQsSUFBSSxRQUFRLEVBQUU7WUFDVixLQUFLLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQztTQUMzQjtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRVMscUJBQXFCLENBQUMsSUFBc0I7UUFDbEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUU1RCxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxHQUFHLHNCQUFzQixDQUFDO1FBQ3pELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUc7WUFDOUI7Z0JBQ0ksUUFBUSxFQUFFLFlBQVk7Z0JBQ3RCLEtBQUssRUFBRSxDQUFDLGVBQWUsQ0FBQztnQkFDeEIsT0FBTyxFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRTthQUN4QjtZQUN6QjtnQkFDSSxRQUFRLEVBQUUsUUFBUTtnQkFDbEIsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDO2dCQUNuQixPQUFPLEVBQUUsV0FBVyxDQUFDLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2xCLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDeEIsQ0FBQzthQUNvQjtTQUM1QixDQUFDO0lBQ04sQ0FBQzs7OztZQS9FSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQVRPLFFBQVE7WUFDUixNQUFNO1lBQ04sZ0JBQWdCO1lBRWhCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TW9kYWxCdXR0b25JbnRlcmZhY2UsIFZpZXdNb2RlfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtOZ2JNb2RhbH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge01vZHVsZU5hbWVNYXBwZXJ9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24vbW9kdWxlLW5hbWUtbWFwcGVyL21vZHVsZS1uYW1lLW1hcHBlci5zZXJ2aWNlJztcbmltcG9ydCB7UmVjb3JkQWN0aW9uRGF0YSwgUmVjb3JkQWN0aW9uSGFuZGxlcn0gZnJvbSAnLi4vcmVjb3JkLmFjdGlvbic7XG5pbXBvcnQge0FjdGlvbk5hbWVNYXBwZXJ9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24vYWN0aW9uLW5hbWUtbWFwcGVyL2FjdGlvbi1uYW1lLW1hcHBlci5zZXJ2aWNlJztcbmltcG9ydCB7TWVzc2FnZU1vZGFsQ29tcG9uZW50fSBmcm9tICcuLi8uLi8uLi8uLi9jb21wb25lbnRzL21vZGFsL2NvbXBvbmVudHMvbWVzc2FnZS1tb2RhbC9tZXNzYWdlLW1vZGFsLmNvbXBvbmVudCc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQ2FuY2VsQ3JlYXRlQWN0aW9uIGV4dGVuZHMgUmVjb3JkQWN0aW9uSGFuZGxlciB7XG5cbiAgICBrZXkgPSAnY2FuY2VsQ3JlYXRlJztcbiAgICBtb2RlcyA9IFsnY3JlYXRlJyBhcyBWaWV3TW9kZV07XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBtb2RhbFNlcnZpY2U6IE5nYk1vZGFsLFxuICAgICAgICBwcm90ZWN0ZWQgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgIHByb3RlY3RlZCBtb2R1bGVOYW1lTWFwcGVyOiBNb2R1bGVOYW1lTWFwcGVyLFxuICAgICAgICBwcm90ZWN0ZWQgYWN0aW9uTmFtZU1hcHBlcjogQWN0aW9uTmFtZU1hcHBlclxuICAgICkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHJ1bihkYXRhOiBSZWNvcmRBY3Rpb25EYXRhKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKGRhdGEuc3RvcmUucmVjb3JkU3RvcmUuaXNEaXJ0eSgpKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dDb25maXJtYXRpb25Nb2RhbChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FuY2VsKGRhdGEpO1xuICAgIH1cblxuICAgIHNob3VsZERpc3BsYXkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBjYW5jZWwoZGF0YTogUmVjb3JkQWN0aW9uRGF0YSk6IHZvaWQge1xuICAgICAgICBjb25zdCBzdG9yZSA9IGRhdGEuc3RvcmU7XG5cbiAgICAgICAgbGV0IHJldHVybk1vZHVsZSA9IHN0b3JlLmdldE1vZHVsZU5hbWUoKTtcblxuICAgICAgICBpZiAoc3RvcmUucGFyYW1zLnJldHVybl9tb2R1bGUpIHtcbiAgICAgICAgICAgIHJldHVybk1vZHVsZSA9IHRoaXMubW9kdWxlTmFtZU1hcHBlci50b0Zyb250ZW5kKHN0b3JlLnBhcmFtcy5yZXR1cm5fbW9kdWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZXR1cm5BY3Rpb24gPSBzdG9yZS5wYXJhbXMucmV0dXJuX2FjdGlvbiB8fCAnJztcbiAgICAgICAgY29uc3QgcmV0dXJuSWQgPSBzdG9yZS5wYXJhbXMucmV0dXJuX2lkIHx8ICcnO1xuXG4gICAgICAgIGxldCByb3V0ZSA9ICcvJyArIHJldHVybk1vZHVsZTtcblxuICAgICAgICBpZiAocmV0dXJuQWN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm5BY3Rpb24gPSB0aGlzLmFjdGlvbk5hbWVNYXBwZXIudG9Gcm9udGVuZChyZXR1cm5BY3Rpb24pO1xuXG4gICAgICAgICAgICBpZiAocmV0dXJuQWN0aW9uICE9PSAncmVjb3JkJyB8fCByZXR1cm5JZCkge1xuICAgICAgICAgICAgICAgIHJvdXRlICs9ICcvJyArIHJldHVybkFjdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXR1cm5JZCkge1xuICAgICAgICAgICAgcm91dGUgKz0gJy8nICsgcmV0dXJuSWQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbcm91dGVdKS50aGVuKCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNob3dDb25maXJtYXRpb25Nb2RhbChkYXRhOiBSZWNvcmRBY3Rpb25EYXRhKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG1vZGFsID0gdGhpcy5tb2RhbFNlcnZpY2Uub3BlbihNZXNzYWdlTW9kYWxDb21wb25lbnQpO1xuXG4gICAgICAgIG1vZGFsLmNvbXBvbmVudEluc3RhbmNlLnRleHRLZXkgPSAnV0FSTl9VTlNBVkVEX0NIQU5HRVMnO1xuICAgICAgICBtb2RhbC5jb21wb25lbnRJbnN0YW5jZS5idXR0b25zID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsS2V5OiAnTEJMX0NBTkNFTCcsXG4gICAgICAgICAgICAgICAga2xhc3M6IFsnYnRuLXNlY29uZGFyeSddLFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IGFjdGl2ZU1vZGFsID0+IGFjdGl2ZU1vZGFsLmRpc21pc3MoKVxuICAgICAgICAgICAgfSBhcyBNb2RhbEJ1dHRvbkludGVyZmFjZSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbEtleTogJ0xCTF9PSycsXG4gICAgICAgICAgICAgICAga2xhc3M6IFsnYnRuLW1haW4nXSxcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiBhY3RpdmVNb2RhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICBhY3RpdmVNb2RhbC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gYXMgTW9kYWxCdXR0b25JbnRlcmZhY2UsXG4gICAgICAgIF07XG4gICAgfVxufVxuIl19