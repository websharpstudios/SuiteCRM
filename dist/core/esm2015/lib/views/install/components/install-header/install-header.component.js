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
import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { InstallActionsAdapter } from '../../adapters/actions.adapter';
import { InstallViewStore } from '../../store/install-view/install-view.store';
export class InstallHeaderComponent {
    constructor(actionsAdapter, store) {
        this.actionsAdapter = actionsAdapter;
        this.store = store;
        this.vm$ = combineLatest([
            this.store.record$
        ]).pipe(map(([record]) => ({ record })));
    }
    /**
     * Build action context
     * @param record
     */
    getActionContext(record) {
        if (!record) {
            return {};
        }
        return {
            module: record.module || '',
            record
        };
    }
    getTitle() {
    }
}
InstallHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-install-header',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container *ngIf=\"(vm$ | async) as vm\">\n\n    <div class=\"install-view-header\">\n\n        <div class=\"row mr-0\">\n\n            <div class=\"col-md-4 install-header-title-col\">\n\n                <div class=\"install-view-title record-view-name\">\n                    <scrm-label labelKey=\"LBL_WELCOME\" module=\"install\"></scrm-label>\n                </div>\n                <div class=\"install-view-subtitle record-view-title\">\n                    <scrm-label labelKey=\"LBL_INSTALL\" module=\"install\"></scrm-label>\n                </div>\n\n            </div>\n\n            <div class=\"col-md-8 install-header-buttons-col\">\n\n                <div class=\"row mr-1 ml-1\">\n\n                    <div class=\"w-100 d-flex justify-content-end align-items-center\">\n\n                        <div class=\"w-100 install-header-options d-flex justify-content-end align-items-center pr-5\">\n                            <div class=\"label-container pr-2\">\n                                <label class=\"m-0 small\">\n                                    <scrm-label\n                                        [labelKey]=\"store.getIgnoreSystemChecksField().definition.vname\"></scrm-label>\n                                </label>:\n                            </div>\n                            <div class=\"d-flex\">\n                                <div class=\"flex-grow-1 text-break\">\n                                    <scrm-field [field]=\"store.getIgnoreSystemChecksField()\"\n                                                [mode]=\"'edit'\"\n                                                [record]=\"vm.record\"\n                                                [type]=\"store.getIgnoreSystemChecksField().type\">\n                                    </scrm-field>\n                                </div>\n                            </div>\n                        </div>\n\n                        <div>\n                            <scrm-action-group-menu\n                                [actionContext]=\"getActionContext(vm.record)\"\n                                [config]=\"actionsAdapter\"\n                                buttonClass=\"settings-button\"\n                                klass=\"install-view-actions float-right\"\n                            >\n                            </scrm-action-group-menu>\n                        </div>\n\n                    </div>\n\n                </div>\n\n            </div>\n\n        </div>\n\n    </div>\n</ng-container>\n",
                providers: [InstallActionsAdapter]
            },] }
];
InstallHeaderComponent.ctorParameters = () => [
    { type: InstallActionsAdapter },
    { type: InstallViewStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC1oZWFkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3ZpZXdzL2luc3RhbGwvY29tcG9uZW50cy9pbnN0YWxsLWhlYWRlci9pbnN0YWxsLWhlYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNuQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFFckUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sNkNBQTZDLENBQUM7QUFPN0UsTUFBTSxPQUFPLHNCQUFzQjtJQVMvQixZQUNXLGNBQXFDLEVBQ3JDLEtBQXVCO1FBRHZCLG1CQUFjLEdBQWQsY0FBYyxDQUF1QjtRQUNyQyxVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQVJsQyxRQUFHLEdBQUcsYUFBYSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTztTQUNyQixDQUFDLENBQUMsSUFBSSxDQUNILEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQ2hDLENBQUM7SUFNRixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsZ0JBQWdCLENBQUMsTUFBYztRQUMzQixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1QsT0FBTyxFQUFtQixDQUFBO1NBQzdCO1FBRUQsT0FBTztZQUNILE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxJQUFJLEVBQUU7WUFDM0IsTUFBTTtTQUNRLENBQUE7SUFDdEIsQ0FBQztJQUVELFFBQVE7SUFFUixDQUFDOzs7WUFyQ0osU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLDIwSEFBNEM7Z0JBQzVDLFNBQVMsRUFBRSxDQUFDLHFCQUFxQixDQUFDO2FBQ3JDOzs7WUFSTyxxQkFBcUI7WUFFckIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2NvbWJpbmVMYXRlc3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7SW5zdGFsbEFjdGlvbnNBZGFwdGVyfSBmcm9tICcuLi8uLi9hZGFwdGVycy9hY3Rpb25zLmFkYXB0ZXInO1xuaW1wb3J0IHtBY3Rpb25Db250ZXh0LCBSZWNvcmR9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge0luc3RhbGxWaWV3U3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL2luc3RhbGwtdmlldy9pbnN0YWxsLXZpZXcuc3RvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0taW5zdGFsbC1oZWFkZXInLFxuICAgIHRlbXBsYXRlVXJsOiAnaW5zdGFsbC1oZWFkZXIuY29tcG9uZW50Lmh0bWwnLFxuICAgIHByb3ZpZGVyczogW0luc3RhbGxBY3Rpb25zQWRhcHRlcl1cbn0pXG5leHBvcnQgY2xhc3MgSW5zdGFsbEhlYWRlckNvbXBvbmVudCB7XG5cblxuICAgIHZtJCA9IGNvbWJpbmVMYXRlc3QoW1xuICAgICAgICB0aGlzLnN0b3JlLnJlY29yZCRcbiAgICBdKS5waXBlKFxuICAgICAgICBtYXAoKFtyZWNvcmRdKSA9PiAoe3JlY29yZH0pKVxuICAgICk7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIGFjdGlvbnNBZGFwdGVyOiBJbnN0YWxsQWN0aW9uc0FkYXB0ZXIsXG4gICAgICAgIHB1YmxpYyBzdG9yZTogSW5zdGFsbFZpZXdTdG9yZSxcbiAgICApIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhY3Rpb24gY29udGV4dFxuICAgICAqIEBwYXJhbSByZWNvcmRcbiAgICAgKi9cbiAgICBnZXRBY3Rpb25Db250ZXh0KHJlY29yZDogUmVjb3JkKTogQWN0aW9uQ29udGV4dCB7XG4gICAgICAgIGlmICghcmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4ge30gYXMgQWN0aW9uQ29udGV4dFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG1vZHVsZTogcmVjb3JkLm1vZHVsZSB8fCAnJyxcbiAgICAgICAgICAgIHJlY29yZFxuICAgICAgICB9IGFzIEFjdGlvbkNvbnRleHRcbiAgICB9XG5cbiAgICBnZXRUaXRsZSgpIHtcblxuICAgIH1cbn1cbiJdfQ==