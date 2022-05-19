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
import { BaseFieldComponent } from '../../../base/base-field.component';
import { DataTypeFormatter } from '../../../../services/formatters/data-type.formatter.service';
import { FieldLogicManager } from '../../../field-logic/field-logic.manager';
import { UserPreferenceStore } from '../../../../store/user-preference/user-preference.store';
import { ModuleNavigation } from "../../../../services/navigation/module-navigation/module-navigation.service";
import { ModuleNameMapper } from "../../../../services/navigation/module-name-mapper/module-name-mapper.service";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AppStateStore } from "../../../../store/app-state/app-state.store";
import { ActionNameMapper } from "../../../../services/navigation/action-name-mapper/action-name-mapper.service";
export class EmailListFieldsComponent extends BaseFieldComponent {
    constructor(typeFormatter, logic, preferences, navigation, moduleNameMapper, actionNameMapper, appState, modalService, router) {
        super(typeFormatter, logic);
        this.typeFormatter = typeFormatter;
        this.logic = logic;
        this.preferences = preferences;
        this.navigation = navigation;
        this.moduleNameMapper = moduleNameMapper;
        this.actionNameMapper = actionNameMapper;
        this.appState = appState;
        this.modalService = modalService;
        this.router = router;
    }
    ngOnInit() {
        this.linkType = this.preferences.getUserPreference('email_link_type') || 'mailto';
    }
    openEmail() {
        const view = this.actionNameMapper.toLegacy(this.appState.getView());
        const module = this.moduleNameMapper.toLegacy(this.parent.module);
        const parent_id = this.parent.id;
        const parent_name = this.parent.attributes.name;
        const email = this.field.value;
        let return_id;
        if (view !== 'ListView' && view !== 'index') {
            return_id = parent_id;
        }
        this.router.navigate(['emails', 'compose'], {
            queryParams: {
                return_module: module,
                return_action: view,
                return_id,
                to_addrs_names: email,
                parent_type: module,
                parent_name,
                parent_id,
            }
        });
    }
}
EmailListFieldsComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-email-list',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<div class=\"mailto-field\">\n    <a *ngIf=\"linkType === 'mailto'\" href=\"mailto:{{ this.field.value }}\">{{ this.field.value }}</a>\n\n    <a *ngIf=\"linkType === 'sugar'\" class=\"clickable field-link\" (click)=\"openEmail()\">{{ this.field.value }}</a>\n</div>\n"
            },] }
];
EmailListFieldsComponent.ctorParameters = () => [
    { type: DataTypeFormatter },
    { type: FieldLogicManager },
    { type: UserPreferenceStore },
    { type: ModuleNavigation },
    { type: ModuleNameMapper },
    { type: ActionNameMapper },
    { type: AppStateStore },
    { type: NgbModal },
    { type: Router }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1haWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2ZpZWxkcy9lbWFpbC90ZW1wbGF0ZXMvbGlzdC9lbWFpbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQVMsTUFBTSxlQUFlLENBQUM7QUFDaEQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDdEUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sNkRBQTZELENBQUM7QUFDOUYsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFDM0UsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0seURBQXlELENBQUM7QUFDNUYsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sNkVBQTZFLENBQUM7QUFDN0csT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sK0VBQStFLENBQUM7QUFDL0csT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sNkNBQTZDLENBQUM7QUFDMUUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sK0VBQStFLENBQUM7QUFPL0csTUFBTSxPQUFPLHdCQUF5QixTQUFRLGtCQUFrQjtJQUc1RCxZQUNjLGFBQWdDLEVBQ2hDLEtBQXdCLEVBQ3hCLFdBQWdDLEVBQ2hDLFVBQTRCLEVBQzVCLGdCQUFrQyxFQUNsQyxnQkFBa0MsRUFDbEMsUUFBdUIsRUFDdkIsWUFBc0IsRUFDdEIsTUFBYztRQUV4QixLQUFLLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBVmxCLGtCQUFhLEdBQWIsYUFBYSxDQUFtQjtRQUNoQyxVQUFLLEdBQUwsS0FBSyxDQUFtQjtRQUN4QixnQkFBVyxHQUFYLFdBQVcsQ0FBcUI7UUFDaEMsZUFBVSxHQUFWLFVBQVUsQ0FBa0I7UUFDNUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGFBQVEsR0FBUixRQUFRLENBQWU7UUFDdkIsaUJBQVksR0FBWixZQUFZLENBQVU7UUFDdEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUc1QixDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLFFBQVEsQ0FBQztJQUN0RixDQUFDO0lBRUQsU0FBUztRQUVMLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNqQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFDaEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFFL0IsSUFBSSxTQUFTLENBQUM7UUFDZCxJQUFJLElBQUksS0FBSyxVQUFVLElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRTtZQUN6QyxTQUFTLEdBQUcsU0FBUyxDQUFDO1NBQ3pCO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQUU7WUFDeEMsV0FBVyxFQUFFO2dCQUNULGFBQWEsRUFBRSxNQUFNO2dCQUNyQixhQUFhLEVBQUUsSUFBSTtnQkFDbkIsU0FBUztnQkFDVCxjQUFjLEVBQUUsS0FBSztnQkFDckIsV0FBVyxFQUFFLE1BQU07Z0JBQ25CLFdBQVc7Z0JBQ1gsU0FBUzthQUNaO1NBQ0osQ0FBQyxDQUFBO0lBQ04sQ0FBQzs7O1lBbERKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQix3bkRBQXFDO2FBRXhDOzs7WUFkTyxpQkFBaUI7WUFDakIsaUJBQWlCO1lBQ2pCLG1CQUFtQjtZQUNuQixnQkFBZ0I7WUFDaEIsZ0JBQWdCO1lBSWhCLGdCQUFnQjtZQURoQixhQUFhO1lBRGIsUUFBUTtZQURSLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCYXNlRmllbGRDb21wb25lbnR9IGZyb20gJy4uLy4uLy4uL2Jhc2UvYmFzZS1maWVsZC5jb21wb25lbnQnO1xuaW1wb3J0IHtEYXRhVHlwZUZvcm1hdHRlcn0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZXMvZm9ybWF0dGVycy9kYXRhLXR5cGUuZm9ybWF0dGVyLnNlcnZpY2UnO1xuaW1wb3J0IHtGaWVsZExvZ2ljTWFuYWdlcn0gZnJvbSAnLi4vLi4vLi4vZmllbGQtbG9naWMvZmllbGQtbG9naWMubWFuYWdlcic7XG5pbXBvcnQge1VzZXJQcmVmZXJlbmNlU3RvcmV9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3VzZXItcHJlZmVyZW5jZS91c2VyLXByZWZlcmVuY2Uuc3RvcmUnO1xuaW1wb3J0IHtNb2R1bGVOYXZpZ2F0aW9ufSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmljZXMvbmF2aWdhdGlvbi9tb2R1bGUtbmF2aWdhdGlvbi9tb2R1bGUtbmF2aWdhdGlvbi5zZXJ2aWNlXCI7XG5pbXBvcnQge01vZHVsZU5hbWVNYXBwZXJ9IGZyb20gXCIuLi8uLi8uLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uL21vZHVsZS1uYW1lLW1hcHBlci9tb2R1bGUtbmFtZS1tYXBwZXIuc2VydmljZVwiO1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcbmltcG9ydCB7TmdiTW9kYWx9IGZyb20gXCJAbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcFwiO1xuaW1wb3J0IHtBcHBTdGF0ZVN0b3JlfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3RvcmUvYXBwLXN0YXRlL2FwcC1zdGF0ZS5zdG9yZVwiO1xuaW1wb3J0IHtBY3Rpb25OYW1lTWFwcGVyfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmljZXMvbmF2aWdhdGlvbi9hY3Rpb24tbmFtZS1tYXBwZXIvYWN0aW9uLW5hbWUtbWFwcGVyLnNlcnZpY2VcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLWVtYWlsLWxpc3QnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9lbWFpbC5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBFbWFpbExpc3RGaWVsZHNDb21wb25lbnQgZXh0ZW5kcyBCYXNlRmllbGRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIGxpbmtUeXBlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHR5cGVGb3JtYXR0ZXI6IERhdGFUeXBlRm9ybWF0dGVyLFxuICAgICAgICBwcm90ZWN0ZWQgbG9naWM6IEZpZWxkTG9naWNNYW5hZ2VyLFxuICAgICAgICBwcm90ZWN0ZWQgcHJlZmVyZW5jZXM6IFVzZXJQcmVmZXJlbmNlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBuYXZpZ2F0aW9uOiBNb2R1bGVOYXZpZ2F0aW9uLFxuICAgICAgICBwcm90ZWN0ZWQgbW9kdWxlTmFtZU1hcHBlcjogTW9kdWxlTmFtZU1hcHBlcixcbiAgICAgICAgcHJvdGVjdGVkIGFjdGlvbk5hbWVNYXBwZXI6IEFjdGlvbk5hbWVNYXBwZXIsXG4gICAgICAgIHByb3RlY3RlZCBhcHBTdGF0ZTogQXBwU3RhdGVTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIG1vZGFsU2VydmljZTogTmdiTW9kYWwsXG4gICAgICAgIHByb3RlY3RlZCByb3V0ZXI6IFJvdXRlclxuICAgICkge1xuICAgICAgICBzdXBlcih0eXBlRm9ybWF0dGVyLCBsb2dpYyk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGlua1R5cGUgPSB0aGlzLnByZWZlcmVuY2VzLmdldFVzZXJQcmVmZXJlbmNlKCdlbWFpbF9saW5rX3R5cGUnKSB8fCAnbWFpbHRvJztcbiAgICB9XG5cbiAgICBvcGVuRW1haWwoKSB7XG5cbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMuYWN0aW9uTmFtZU1hcHBlci50b0xlZ2FjeSh0aGlzLmFwcFN0YXRlLmdldFZpZXcoKSk7XG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMubW9kdWxlTmFtZU1hcHBlci50b0xlZ2FjeSh0aGlzLnBhcmVudC5tb2R1bGUpO1xuICAgICAgICBjb25zdCBwYXJlbnRfaWQgPSB0aGlzLnBhcmVudC5pZDtcbiAgICAgICAgY29uc3QgcGFyZW50X25hbWUgPSB0aGlzLnBhcmVudC5hdHRyaWJ1dGVzLm5hbWU7XG4gICAgICAgIGNvbnN0IGVtYWlsID0gdGhpcy5maWVsZC52YWx1ZTtcblxuICAgICAgICBsZXQgcmV0dXJuX2lkO1xuICAgICAgICBpZiAodmlldyAhPT0gJ0xpc3RWaWV3JyAmJiB2aWV3ICE9PSAnaW5kZXgnKSB7XG4gICAgICAgICAgICByZXR1cm5faWQgPSBwYXJlbnRfaWQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbJ2VtYWlscycsICdjb21wb3NlJ10sIHtcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuX21vZHVsZTogbW9kdWxlLFxuICAgICAgICAgICAgICAgIHJldHVybl9hY3Rpb246IHZpZXcsXG4gICAgICAgICAgICAgICAgcmV0dXJuX2lkLFxuICAgICAgICAgICAgICAgIHRvX2FkZHJzX25hbWVzOiBlbWFpbCxcbiAgICAgICAgICAgICAgICBwYXJlbnRfdHlwZTogbW9kdWxlLFxuICAgICAgICAgICAgICAgIHBhcmVudF9uYW1lLFxuICAgICAgICAgICAgICAgIHBhcmVudF9pZCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG4iXX0=