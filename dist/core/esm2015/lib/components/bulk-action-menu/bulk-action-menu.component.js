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
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectionStatus } from 'common';
import { LanguageStore } from '../../store/language/language.store';
export class BulkActionMenuComponent {
    constructor(languageStore) {
        this.languageStore = languageStore;
        this.appStrings$ = this.languageStore.appStrings$;
        this.vm$ = null;
    }
    ngOnInit() {
        const status$ = this.selectionSource.getSelectionStatus();
        const count$ = this.selectionSource.getSelectedCount();
        const actions$ = this.actionSource.getBulkActions();
        this.vm$ = combineLatest([this.appStrings$, status$, count$, actions$]).pipe(map(([appStrings, status, count, actions]) => ({ appStrings, status, count, actions })));
    }
    checked(status) {
        return status === SelectionStatus.ALL;
    }
    intermediate(status) {
        return status === SelectionStatus.SOME || status === SelectionStatus.PAGE;
    }
    selectPage() {
        this.selectionSource.updateSelection(SelectionStatus.PAGE);
    }
    selectAll() {
        this.selectionSource.updateSelection(SelectionStatus.ALL);
    }
    deselectAll() {
        this.selectionSource.updateSelection(SelectionStatus.NONE);
    }
    toggleSelection(status) {
        if (status === SelectionStatus.ALL) {
            this.selectionSource.updateSelection(SelectionStatus.NONE);
            return;
        }
        this.selectionSource.updateSelection(SelectionStatus.ALL);
    }
    getDropdownConfig(actions, appStrings) {
        const label = appStrings && appStrings.LBL_BULK_ACTION_BUTTON_LABEL || '';
        const dropdownConfig = {
            label,
            klass: ['bulk-action-button', 'btn', 'btn-sm'],
            wrapperKlass: ['bulk-action-group', 'float-left'],
            items: []
        };
        Object.keys(actions).forEach(actionKey => {
            const action = actions[actionKey];
            dropdownConfig.items.push({
                label: appStrings && appStrings[action.labelKey] || '',
                klass: [`${actionKey}-bulk-action`],
                onClick: () => {
                    this.actionSource.executeBulkAction(action.key);
                }
            });
        });
        return dropdownConfig;
    }
}
BulkActionMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-bulk-action-menu',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<div class=\"bulk-action float-left\" *ngIf=\"(vm$ | async) as vm\">\n    <div ngbDropdown class=\"dropdown select-action-group float-left\">\n        <button class=\"bulk-action-button dropdown-toggle btn btn-sm\"\n                type=\"button\"\n                ngbDropdownToggle\n                aria-haspopup=\"true\"\n                aria-expanded=\"false\"\n                aria-hidden=\"true\"\n                aria-label=\"Select Action Menu\">\n            <label class=\"checkbox-container\">\n                <input type=\"checkbox\"\n                       [checked]=\"checked(vm.status)\"\n                       [indeterminate]=\"intermediate(vm.status)\"\n                       (change)=\"toggleSelection(vm.status)\"\n                       aria-hidden=\"true\">\n                <span class=\"checkmark\"></span>\n            </label>\n            <span class=\"bulk-action-selected-number\">{{vm.count > 0 ? (vm.appStrings['LBL_LISTVIEW_SELECTED_OBJECTS'] || '') : ''}} {{vm.count > 0 ? vm.count : ''}}</span>\n        </button>\n        <div class=\"dropdown-menu\"\n             ngbDropdownMenu\n             aria-hidden=\"true\">\n            <a class=\"dropdown-item select-all\" (click)=\"selectAll()\">\n                {{vm.appStrings['LBL_LISTVIEW_OPTION_ENTIRE'] || ''}}\n            </a>\n            <a class=\"dropdown-item select-page\" (click)=\"selectPage()\">\n                {{vm.appStrings['LBL_LISTVIEW_OPTION_CURRENT'] || ''}}\n            </a>\n            <a class=\"dropdown-item deselect-all\" (click)=\"deselectAll()\">\n                {{vm.appStrings['LBL_LISTVIEW_NONE'] || ''}}\n            </a>\n        </div>\n    </div>\n    <scrm-dropdown-button [disabled]=\"vm.count < 1\"\n                          [config]=\"getDropdownConfig(vm.actions, vm.appStrings)\"></scrm-dropdown-button>\n</div>\n"
            },] }
];
BulkActionMenuComponent.ctorParameters = () => [
    { type: LanguageStore }
];
BulkActionMenuComponent.propDecorators = {
    selectionSource: [{ type: Input }],
    actionSource: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsay1hY3Rpb24tbWVudS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29tcG9uZW50cy9idWxrLWFjdGlvbi1tZW51L2J1bGstYWN0aW9uLW1lbnUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBUyxNQUFNLGVBQWUsQ0FBQztBQUN2RCxPQUFPLEVBQUMsYUFBYSxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuQyxPQUFPLEVBQStELGVBQWUsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUNyRyxPQUFPLEVBQUMsYUFBYSxFQUFvQixNQUFNLHFDQUFxQyxDQUFDO0FBbUJyRixNQUFNLE9BQU8sdUJBQXVCO0lBU2hDLFlBQXNCLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBSmxELGdCQUFXLEdBQWtDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO1FBRTVFLFFBQUcsR0FBb0MsSUFBSSxDQUFDO0lBRzVDLENBQUM7SUFFRCxRQUFRO1FBQ0osTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN2RCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3BELElBQUksQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUN4RSxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUN4RixDQUFDO0lBQ04sQ0FBQztJQUVELE9BQU8sQ0FBQyxNQUF1QjtRQUMzQixPQUFPLE1BQU0sS0FBSyxlQUFlLENBQUMsR0FBRyxDQUFDO0lBQzFDLENBQUM7SUFFRCxZQUFZLENBQUMsTUFBdUI7UUFDaEMsT0FBTyxNQUFNLEtBQUssZUFBZSxDQUFDLElBQUksSUFBSSxNQUFNLEtBQUssZUFBZSxDQUFDLElBQUksQ0FBQztJQUM5RSxDQUFDO0lBRUQsVUFBVTtRQUNOLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsU0FBUztRQUNMLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsZUFBZSxDQUFDLE1BQXVCO1FBQ25DLElBQUksTUFBTSxLQUFLLGVBQWUsQ0FBQyxHQUFHLEVBQUU7WUFDaEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNELE9BQU87U0FDVjtRQUVELElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsaUJBQWlCLENBQUMsT0FBdUIsRUFBRSxVQUE2QjtRQUNwRSxNQUFNLEtBQUssR0FBRyxVQUFVLElBQUksVUFBVSxDQUFDLDRCQUE0QixJQUFJLEVBQUUsQ0FBQztRQUMxRSxNQUFNLGNBQWMsR0FBRztZQUNuQixLQUFLO1lBQ0wsS0FBSyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQztZQUM5QyxZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxZQUFZLENBQUM7WUFDakQsS0FBSyxFQUFFLEVBQUU7U0FDZSxDQUFDO1FBRTdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3JDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNsQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDdEIsS0FBSyxFQUFFLFVBQVUsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3RELEtBQUssRUFBRSxDQUFDLEdBQUcsU0FBUyxjQUFjLENBQUM7Z0JBQ25DLE9BQU8sRUFBRSxHQUFTLEVBQUU7b0JBQ2hCLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwRCxDQUFDO2FBQ0osQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLGNBQWMsQ0FBQztJQUMxQixDQUFDOzs7WUEzRUosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSx1QkFBdUI7Z0JBQ2pDLG9xR0FBOEM7YUFDakQ7OztZQWxCTyxhQUFhOzs7OEJBcUJoQixLQUFLOzJCQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Y29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtCdWxrQWN0aW9uc01hcCwgRHJvcGRvd25CdXR0b25JbnRlcmZhY2UsIFNlbGVjdGlvbkRhdGFTb3VyY2UsIFNlbGVjdGlvblN0YXR1c30gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZSwgTGFuZ3VhZ2VTdHJpbmdNYXB9IGZyb20gJy4uLy4uL3N0b3JlL2xhbmd1YWdlL2xhbmd1YWdlLnN0b3JlJztcblxuZXhwb3J0IGludGVyZmFjZSBCdWxrQWN0aW9uRGF0YVNvdXJjZSB7XG4gICAgZ2V0QnVsa0FjdGlvbnMoKTogT2JzZXJ2YWJsZTxCdWxrQWN0aW9uc01hcD47XG5cbiAgICBleGVjdXRlQnVsa0FjdGlvbihhY3Rpb246IHN0cmluZyk6IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnVsa0FjdGlvblZpZXdNb2RlbCB7XG4gICAgYXBwU3RyaW5nczogTGFuZ3VhZ2VTdHJpbmdNYXA7XG4gICAgc3RhdHVzOiBTZWxlY3Rpb25TdGF0dXM7XG4gICAgY291bnQ6IG51bWJlcjtcbiAgICBhY3Rpb25zOiBCdWxrQWN0aW9uc01hcDtcbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLWJ1bGstYWN0aW9uLW1lbnUnLFxuICAgIHRlbXBsYXRlVXJsOiAnYnVsay1hY3Rpb24tbWVudS5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgQnVsa0FjdGlvbk1lbnVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgQElucHV0KCkgc2VsZWN0aW9uU291cmNlOiBTZWxlY3Rpb25EYXRhU291cmNlO1xuICAgIEBJbnB1dCgpIGFjdGlvblNvdXJjZTogQnVsa0FjdGlvbkRhdGFTb3VyY2U7XG5cbiAgICBhcHBTdHJpbmdzJDogT2JzZXJ2YWJsZTxMYW5ndWFnZVN0cmluZ01hcD4gPSB0aGlzLmxhbmd1YWdlU3RvcmUuYXBwU3RyaW5ncyQ7XG5cbiAgICB2bSQ6IE9ic2VydmFibGU8QnVsa0FjdGlvblZpZXdNb2RlbD4gPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGxhbmd1YWdlU3RvcmU6IExhbmd1YWdlU3RvcmUpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc3RhdHVzJCA9IHRoaXMuc2VsZWN0aW9uU291cmNlLmdldFNlbGVjdGlvblN0YXR1cygpO1xuICAgICAgICBjb25zdCBjb3VudCQgPSB0aGlzLnNlbGVjdGlvblNvdXJjZS5nZXRTZWxlY3RlZENvdW50KCk7XG4gICAgICAgIGNvbnN0IGFjdGlvbnMkID0gdGhpcy5hY3Rpb25Tb3VyY2UuZ2V0QnVsa0FjdGlvbnMoKTtcbiAgICAgICAgdGhpcy52bSQgPSBjb21iaW5lTGF0ZXN0KFt0aGlzLmFwcFN0cmluZ3MkLCBzdGF0dXMkLCBjb3VudCQsIGFjdGlvbnMkXSkucGlwZShcbiAgICAgICAgICAgIG1hcCgoW2FwcFN0cmluZ3MsIHN0YXR1cywgY291bnQsIGFjdGlvbnNdKSA9PiAoe2FwcFN0cmluZ3MsIHN0YXR1cywgY291bnQsIGFjdGlvbnN9KSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBjaGVja2VkKHN0YXR1czogU2VsZWN0aW9uU3RhdHVzKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBzdGF0dXMgPT09IFNlbGVjdGlvblN0YXR1cy5BTEw7XG4gICAgfVxuXG4gICAgaW50ZXJtZWRpYXRlKHN0YXR1czogU2VsZWN0aW9uU3RhdHVzKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBzdGF0dXMgPT09IFNlbGVjdGlvblN0YXR1cy5TT01FIHx8IHN0YXR1cyA9PT0gU2VsZWN0aW9uU3RhdHVzLlBBR0U7XG4gICAgfVxuXG4gICAgc2VsZWN0UGFnZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25Tb3VyY2UudXBkYXRlU2VsZWN0aW9uKFNlbGVjdGlvblN0YXR1cy5QQUdFKTtcbiAgICB9XG5cbiAgICBzZWxlY3RBbGwoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VsZWN0aW9uU291cmNlLnVwZGF0ZVNlbGVjdGlvbihTZWxlY3Rpb25TdGF0dXMuQUxMKTtcbiAgICB9XG5cbiAgICBkZXNlbGVjdEFsbCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25Tb3VyY2UudXBkYXRlU2VsZWN0aW9uKFNlbGVjdGlvblN0YXR1cy5OT05FKTtcbiAgICB9XG5cbiAgICB0b2dnbGVTZWxlY3Rpb24oc3RhdHVzOiBTZWxlY3Rpb25TdGF0dXMpOiB2b2lkIHtcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gU2VsZWN0aW9uU3RhdHVzLkFMTCkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25Tb3VyY2UudXBkYXRlU2VsZWN0aW9uKFNlbGVjdGlvblN0YXR1cy5OT05FKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uU291cmNlLnVwZGF0ZVNlbGVjdGlvbihTZWxlY3Rpb25TdGF0dXMuQUxMKTtcbiAgICB9XG5cbiAgICBnZXREcm9wZG93bkNvbmZpZyhhY3Rpb25zOiBCdWxrQWN0aW9uc01hcCwgYXBwU3RyaW5nczogTGFuZ3VhZ2VTdHJpbmdNYXApOiBEcm9wZG93bkJ1dHRvbkludGVyZmFjZSB7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gYXBwU3RyaW5ncyAmJiBhcHBTdHJpbmdzLkxCTF9CVUxLX0FDVElPTl9CVVRUT05fTEFCRUwgfHwgJyc7XG4gICAgICAgIGNvbnN0IGRyb3Bkb3duQ29uZmlnID0ge1xuICAgICAgICAgICAgbGFiZWwsXG4gICAgICAgICAgICBrbGFzczogWydidWxrLWFjdGlvbi1idXR0b24nLCAnYnRuJywgJ2J0bi1zbSddLFxuICAgICAgICAgICAgd3JhcHBlcktsYXNzOiBbJ2J1bGstYWN0aW9uLWdyb3VwJywgJ2Zsb2F0LWxlZnQnXSxcbiAgICAgICAgICAgIGl0ZW1zOiBbXVxuICAgICAgICB9IGFzIERyb3Bkb3duQnV0dG9uSW50ZXJmYWNlO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGFjdGlvbnMpLmZvckVhY2goYWN0aW9uS2V5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbiA9IGFjdGlvbnNbYWN0aW9uS2V5XTtcbiAgICAgICAgICAgIGRyb3Bkb3duQ29uZmlnLml0ZW1zLnB1c2goe1xuICAgICAgICAgICAgICAgIGxhYmVsOiBhcHBTdHJpbmdzICYmIGFwcFN0cmluZ3NbYWN0aW9uLmxhYmVsS2V5XSB8fCAnJyxcbiAgICAgICAgICAgICAgICBrbGFzczogW2Ake2FjdGlvbktleX0tYnVsay1hY3Rpb25gXSxcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uU291cmNlLmV4ZWN1dGVCdWxrQWN0aW9uKGFjdGlvbi5rZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZHJvcGRvd25Db25maWc7XG4gICAgfVxufVxuIl19