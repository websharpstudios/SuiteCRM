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
import { RecordActionHandler } from '../record.action';
import { MessageModalComponent } from '../../../../components/modal/components/message-modal/message-modal.component';
import { ModuleNavigation } from '../../../../services/navigation/module-navigation/module-navigation.service';
import * as i0 from "@angular/core";
import * as i1 from "@ng-bootstrap/ng-bootstrap";
import * as i2 from "../../../../services/navigation/module-navigation/module-navigation.service";
export class RecordCancelAction extends RecordActionHandler {
    constructor(modalService, navigation) {
        super();
        this.modalService = modalService;
        this.navigation = navigation;
        this.key = 'cancel';
        this.modes = ['edit', 'detail'];
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
        const params = data.store.params;
        const moduleName = data.store.getModuleName();
        const id = data.store.getRecordId();
        const record = data.store.getBaseRecord();
        this.navigateBack(this.navigation, params, id, moduleName, record);
        data.store.recordStore.resetStaging();
        data.store.setMode('detail');
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
                labelKey: 'LBL_PROCEED',
                klass: ['btn-main'],
                onClick: activeModal => {
                    this.cancel(data);
                    activeModal.close();
                }
            },
        ];
    }
}
RecordCancelAction.ɵprov = i0.ɵɵdefineInjectable({ factory: function RecordCancelAction_Factory() { return new RecordCancelAction(i0.ɵɵinject(i1.NgbModal), i0.ɵɵinject(i2.ModuleNavigation)); }, token: RecordCancelAction, providedIn: "root" });
RecordCancelAction.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
RecordCancelAction.ctorParameters = () => [
    { type: NgbModal },
    { type: ModuleNavigation }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLWNhbmNlbC5hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvdmlld3MvcmVjb3JkL2FjdGlvbnMvY2FuY2VsL3JlY29yZC1jYW5jZWwuYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUNwRCxPQUFPLEVBQW1CLG1CQUFtQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDdkUsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sK0VBQStFLENBQUM7QUFDcEgsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sNkVBQTZFLENBQUM7Ozs7QUFLN0csTUFBTSxPQUFPLGtCQUFtQixTQUFRLG1CQUFtQjtJQUt2RCxZQUFvQixZQUFzQixFQUFZLFVBQTRCO1FBQzlFLEtBQUssRUFBRSxDQUFDO1FBRFEsaUJBQVksR0FBWixZQUFZLENBQVU7UUFBWSxlQUFVLEdBQVYsVUFBVSxDQUFrQjtRQUhsRixRQUFHLEdBQUcsUUFBUSxDQUFDO1FBQ2YsVUFBSyxHQUFHLENBQUMsTUFBa0IsRUFBRSxRQUFvQixDQUFDLENBQUM7SUFJbkQsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUFzQjtRQUV0QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqQyxPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxhQUFhO1FBQ1QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVTLE1BQU0sQ0FBQyxJQUFzQjtRQUVuQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNqQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzlDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDcEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUUxQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFbkUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBb0IsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFUyxxQkFBcUIsQ0FBQyxJQUFzQjtRQUNsRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBRTVELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsc0JBQXNCLENBQUM7UUFDekQsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sR0FBRztZQUM5QjtnQkFDSSxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsS0FBSyxFQUFFLENBQUMsZUFBZSxDQUFDO2dCQUN4QixPQUFPLEVBQUUsV0FBVyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO2FBQ3hCO1lBQ3pCO2dCQUNJLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQ25CLE9BQU8sRUFBRSxXQUFXLENBQUMsRUFBRTtvQkFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDbEIsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUN4QixDQUFDO2FBQ29CO1NBQzVCLENBQUM7SUFDTixDQUFDOzs7O1lBMURKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7O1lBUE8sUUFBUTtZQUdSLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TW9kYWxCdXR0b25JbnRlcmZhY2UsIFZpZXdNb2RlfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtOZ2JNb2RhbH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHtSZWNvcmRBY3Rpb25EYXRhLCBSZWNvcmRBY3Rpb25IYW5kbGVyfSBmcm9tICcuLi9yZWNvcmQuYWN0aW9uJztcbmltcG9ydCB7TWVzc2FnZU1vZGFsQ29tcG9uZW50fSBmcm9tICcuLi8uLi8uLi8uLi9jb21wb25lbnRzL21vZGFsL2NvbXBvbmVudHMvbWVzc2FnZS1tb2RhbC9tZXNzYWdlLW1vZGFsLmNvbXBvbmVudCc7XG5pbXBvcnQge01vZHVsZU5hdmlnYXRpb259IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24vbW9kdWxlLW5hdmlnYXRpb24vbW9kdWxlLW5hdmlnYXRpb24uc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUmVjb3JkQ2FuY2VsQWN0aW9uIGV4dGVuZHMgUmVjb3JkQWN0aW9uSGFuZGxlciB7XG5cbiAgICBrZXkgPSAnY2FuY2VsJztcbiAgICBtb2RlcyA9IFsnZWRpdCcgYXMgVmlld01vZGUsICdkZXRhaWwnIGFzIFZpZXdNb2RlXTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbW9kYWxTZXJ2aWNlOiBOZ2JNb2RhbCwgcHJvdGVjdGVkIG5hdmlnYXRpb246IE1vZHVsZU5hdmlnYXRpb24pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBydW4oZGF0YTogUmVjb3JkQWN0aW9uRGF0YSk6IHZvaWQge1xuXG4gICAgICAgIGlmIChkYXRhLnN0b3JlLnJlY29yZFN0b3JlLmlzRGlydHkoKSkge1xuICAgICAgICAgICAgdGhpcy5zaG93Q29uZmlybWF0aW9uTW9kYWwoZGF0YSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbmNlbChkYXRhKTtcbiAgICB9XG5cbiAgICBzaG91bGREaXNwbGF5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY2FuY2VsKGRhdGE6IFJlY29yZEFjdGlvbkRhdGEpOiB2b2lkIHtcblxuICAgICAgICBjb25zdCBwYXJhbXMgPSBkYXRhLnN0b3JlLnBhcmFtcztcbiAgICAgICAgY29uc3QgbW9kdWxlTmFtZSA9IGRhdGEuc3RvcmUuZ2V0TW9kdWxlTmFtZSgpO1xuICAgICAgICBjb25zdCBpZCA9IGRhdGEuc3RvcmUuZ2V0UmVjb3JkSWQoKTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gZGF0YS5zdG9yZS5nZXRCYXNlUmVjb3JkKCk7XG5cbiAgICAgICAgdGhpcy5uYXZpZ2F0ZUJhY2sodGhpcy5uYXZpZ2F0aW9uLCBwYXJhbXMsIGlkLCBtb2R1bGVOYW1lLCByZWNvcmQpO1xuXG4gICAgICAgIGRhdGEuc3RvcmUucmVjb3JkU3RvcmUucmVzZXRTdGFnaW5nKCk7XG4gICAgICAgIGRhdGEuc3RvcmUuc2V0TW9kZSgnZGV0YWlsJyBhcyBWaWV3TW9kZSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNob3dDb25maXJtYXRpb25Nb2RhbChkYXRhOiBSZWNvcmRBY3Rpb25EYXRhKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG1vZGFsID0gdGhpcy5tb2RhbFNlcnZpY2Uub3BlbihNZXNzYWdlTW9kYWxDb21wb25lbnQpO1xuXG4gICAgICAgIG1vZGFsLmNvbXBvbmVudEluc3RhbmNlLnRleHRLZXkgPSAnV0FSTl9VTlNBVkVEX0NIQU5HRVMnO1xuICAgICAgICBtb2RhbC5jb21wb25lbnRJbnN0YW5jZS5idXR0b25zID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsS2V5OiAnTEJMX0NBTkNFTCcsXG4gICAgICAgICAgICAgICAga2xhc3M6IFsnYnRuLXNlY29uZGFyeSddLFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IGFjdGl2ZU1vZGFsID0+IGFjdGl2ZU1vZGFsLmRpc21pc3MoKVxuICAgICAgICAgICAgfSBhcyBNb2RhbEJ1dHRvbkludGVyZmFjZSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbEtleTogJ0xCTF9QUk9DRUVEJyxcbiAgICAgICAgICAgICAgICBrbGFzczogWydidG4tbWFpbiddLFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IGFjdGl2ZU1vZGFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW5jZWwoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZU1vZGFsLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBhcyBNb2RhbEJ1dHRvbkludGVyZmFjZSxcbiAgICAgICAgXTtcbiAgICB9XG59XG4iXX0=