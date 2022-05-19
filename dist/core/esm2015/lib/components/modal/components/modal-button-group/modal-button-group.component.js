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
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { deepClone } from 'common';
import { map } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import defaults from 'lodash-es/defaults';
import { ButtonUtils } from '../../../button/button.utils';
import { SystemConfigStore } from '../../../../store/system-config/system-config.store';
export class ModalButtonGroupComponent {
    constructor(buttonUtils, config) {
        this.buttonUtils = buttonUtils;
        this.config = config;
        this.activeModal = null;
        this.defaultButtonGroup = {
            breakpoint: 4,
            wrapperKlass: ['modal-buttons'],
            buttonKlass: ['modal-button', 'btn', 'btn-sm'],
            buttons: []
        };
        const ui = this.config.getConfigValue('ui');
        if (ui && ui.modal_button_group_breakpoint) {
            this.defaultButtonGroup.breakpoint = ui.modal_buttons_collapse_breakpoint;
        }
    }
    ngOnInit() {
        if (this.config$) {
            this.buttonGroup$ = this.config$.pipe(map((config) => this.mapButtonGroup(config)));
        }
    }
    mapButtonGroup(config) {
        const group = defaults(Object.assign({}, config), deepClone(this.defaultButtonGroup));
        this.mapButtons(group);
        return group;
    }
    mapButtons(group) {
        const buttons = group.buttons || [];
        group.buttons = [];
        if (buttons.length > 0) {
            buttons.forEach(modalButton => {
                const button = this.buttonUtils.addOnClickPartial(modalButton, this.activeModal);
                group.buttons.push(button);
            });
        }
    }
}
ModalButtonGroupComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-modal-button-group',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<scrm-button-group [config$]=\"buttonGroup$\"></scrm-button-group>\n"
            },] }
];
ModalButtonGroupComponent.ctorParameters = () => [
    { type: ButtonUtils },
    { type: SystemConfigStore }
];
ModalButtonGroupComponent.propDecorators = {
    config$: [{ type: Input }],
    activeModal: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtYnV0dG9uLWdyb3VwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb21wb25lbnRzL21vZGFsL2NvbXBvbmVudHMvbW9kYWwtYnV0dG9uLWdyb3VwL21vZGFsLWJ1dHRvbi1ncm91cC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBQ3ZELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDaEMsT0FBTyxFQUF1QixTQUFTLEVBQTRCLE1BQU0sUUFBUSxDQUFDO0FBQ2xGLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDMUQsT0FBTyxRQUFRLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHFEQUFxRCxDQUFDO0FBT3RGLE1BQU0sT0FBTyx5QkFBeUI7SUFhbEMsWUFDYyxXQUF3QixFQUN4QixNQUF5QjtRQUR6QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQVo5QixnQkFBVyxHQUFtQixJQUFJLENBQUM7UUFHbEMsdUJBQWtCLEdBQXlCO1lBQ2pELFVBQVUsRUFBRSxDQUFDO1lBQ2IsWUFBWSxFQUFFLENBQUMsZUFBZSxDQUFDO1lBQy9CLFdBQVcsRUFBRSxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDO1lBQzlDLE9BQU8sRUFBRSxFQUFFO1NBQ2QsQ0FBQztRQU1FLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRTtZQUN4QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQztTQUM3RTtJQUNMLENBQUM7SUFFRCxRQUFRO1FBRUosSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FDakMsR0FBRyxDQUFDLENBQUMsTUFBNEIsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUNyRSxDQUFDO1NBQ0w7SUFDTCxDQUFDO0lBRVMsY0FBYyxDQUFDLE1BQTRCO1FBQ2pELE1BQU0sS0FBSyxHQUFHLFFBQVEsbUJBQUssTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1FBRXhFLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdkIsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVTLFVBQVUsQ0FBQyxLQUEyQjtRQUM1QyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUNwQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUVuQixJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3BCLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQzFCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDakYsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7OztZQXZESixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLHlCQUF5QjtnQkFDbkMsaTdDQUFrRDthQUVyRDs7O1lBUE8sV0FBVztZQUNYLGlCQUFpQjs7O3NCQVNwQixLQUFLOzBCQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0J1dHRvbkdyb3VwSW50ZXJmYWNlLCBkZWVwQ2xvbmUsIE1vZGFsQnV0dG9uR3JvdXBJbnRlcmZhY2V9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtOZ2JBY3RpdmVNb2RhbH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJ2xvZGFzaC1lcy9kZWZhdWx0cyc7XG5pbXBvcnQge0J1dHRvblV0aWxzfSBmcm9tICcuLi8uLi8uLi9idXR0b24vYnV0dG9uLnV0aWxzJztcbmltcG9ydCB7U3lzdGVtQ29uZmlnU3RvcmV9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3N5c3RlbS1jb25maWcvc3lzdGVtLWNvbmZpZy5zdG9yZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1tb2RhbC1idXR0b24tZ3JvdXAnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9tb2RhbC1idXR0b24tZ3JvdXAuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogW11cbn0pXG5leHBvcnQgY2xhc3MgTW9kYWxCdXR0b25Hcm91cENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBASW5wdXQoKSBjb25maWckOiBPYnNlcnZhYmxlPE1vZGFsQnV0dG9uR3JvdXBJbnRlcmZhY2U+O1xuICAgIEBJbnB1dCgpIGFjdGl2ZU1vZGFsOiBOZ2JBY3RpdmVNb2RhbCA9IG51bGw7XG5cbiAgICBidXR0b25Hcm91cCQ6IE9ic2VydmFibGU8QnV0dG9uR3JvdXBJbnRlcmZhY2U+O1xuICAgIHByb3RlY3RlZCBkZWZhdWx0QnV0dG9uR3JvdXA6IEJ1dHRvbkdyb3VwSW50ZXJmYWNlID0ge1xuICAgICAgICBicmVha3BvaW50OiA0LFxuICAgICAgICB3cmFwcGVyS2xhc3M6IFsnbW9kYWwtYnV0dG9ucyddLFxuICAgICAgICBidXR0b25LbGFzczogWydtb2RhbC1idXR0b24nLCAnYnRuJywgJ2J0bi1zbSddLFxuICAgICAgICBidXR0b25zOiBbXVxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGJ1dHRvblV0aWxzOiBCdXR0b25VdGlscyxcbiAgICAgICAgcHJvdGVjdGVkIGNvbmZpZzogU3lzdGVtQ29uZmlnU3RvcmUsXG4gICAgKSB7XG4gICAgICAgIGNvbnN0IHVpID0gdGhpcy5jb25maWcuZ2V0Q29uZmlnVmFsdWUoJ3VpJyk7XG4gICAgICAgIGlmICh1aSAmJiB1aS5tb2RhbF9idXR0b25fZ3JvdXBfYnJlYWtwb2ludCkge1xuICAgICAgICAgICAgdGhpcy5kZWZhdWx0QnV0dG9uR3JvdXAuYnJlYWtwb2ludCA9IHVpLm1vZGFsX2J1dHRvbnNfY29sbGFwc2VfYnJlYWtwb2ludDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZyQpIHtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uR3JvdXAkID0gdGhpcy5jb25maWckLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKChjb25maWc6IEJ1dHRvbkdyb3VwSW50ZXJmYWNlKSA9PiB0aGlzLm1hcEJ1dHRvbkdyb3VwKGNvbmZpZykpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG1hcEJ1dHRvbkdyb3VwKGNvbmZpZzogQnV0dG9uR3JvdXBJbnRlcmZhY2UpOiBCdXR0b25Hcm91cEludGVyZmFjZSB7XG4gICAgICAgIGNvbnN0IGdyb3VwID0gZGVmYXVsdHMoey4uLmNvbmZpZ30sIGRlZXBDbG9uZSh0aGlzLmRlZmF1bHRCdXR0b25Hcm91cCkpO1xuXG4gICAgICAgIHRoaXMubWFwQnV0dG9ucyhncm91cCk7XG5cbiAgICAgICAgcmV0dXJuIGdyb3VwO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBtYXBCdXR0b25zKGdyb3VwOiBCdXR0b25Hcm91cEludGVyZmFjZSk6IHZvaWQge1xuICAgICAgICBjb25zdCBidXR0b25zID0gZ3JvdXAuYnV0dG9ucyB8fCBbXTtcbiAgICAgICAgZ3JvdXAuYnV0dG9ucyA9IFtdO1xuXG4gICAgICAgIGlmIChidXR0b25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGJ1dHRvbnMuZm9yRWFjaChtb2RhbEJ1dHRvbiA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gdGhpcy5idXR0b25VdGlscy5hZGRPbkNsaWNrUGFydGlhbChtb2RhbEJ1dHRvbiwgdGhpcy5hY3RpdmVNb2RhbCk7XG4gICAgICAgICAgICAgICAgZ3JvdXAuYnV0dG9ucy5wdXNoKGJ1dHRvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==