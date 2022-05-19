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
import { ListViewStore } from '../../store/list-view/list-view.store';
import { FilterAdapter } from '../../adapters/filter.adapter';
import { ModuleNavigation } from '../../../../services/navigation/module-navigation/module-navigation.service';
import { RecordPanelAdapter } from '../../adapters/record-panel.adapter';
export class ListHeaderComponent {
    constructor(filterAdapter, listStore, moduleNavigation, recordPanelAdapter) {
        this.filterAdapter = filterAdapter;
        this.listStore = listStore;
        this.moduleNavigation = moduleNavigation;
        this.recordPanelAdapter = recordPanelAdapter;
        this.displayResponsiveTable = false;
        this.actionPanel = '';
        this.subs = [];
    }
    get moduleTitle() {
        const module = this.listStore.vm.appData.module;
        const appListStrings = this.listStore.vm.appData.language.appListStrings;
        return this.moduleNavigation.getModuleLabel(module, appListStrings);
    }
    ngOnInit() {
        this.listStore.actionPanel$.subscribe(actionPanel => {
            this.actionPanel = actionPanel;
            if (this.actionPanel === 'recordPanel') {
                this.recordPanelConfig = this.recordPanelAdapter.getConfig();
            }
            else {
                this.recordPanelConfig = null;
            }
        });
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
        this.recordPanelConfig = null;
    }
}
ListHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-list-header',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container>\n    <div class=\"list-view-header\">\n        <ng-container *ngIf=\"displayResponsiveTable\">\n            <div class=\"d-flex flex-nowrap\">\n                <div class=\"row\">\n                    <div class=\"col\">\n                        <div class=\"order-3\">\n                            <scrm-action-menu></scrm-action-menu>\n                        </div>\n                    </div>\n                    <div class=\"w-100\"></div>\n                    <div class=\"col\">\n                        <div class=\"order-2\">\n                            <scrm-module-title class=\"list-view-title\" [title]=\"moduleTitle\">\n                            </scrm-module-title>\n                        </div>\n                    </div>\n                    <div class=\"w-100\"></div>\n                    <div class=\"col\">\n                        <div class=\"order-1\">\n                            <scrm-settings-menu></scrm-settings-menu>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </ng-container>\n        <ng-template [ngIf]=\"!displayResponsiveTable\">\n            <div class=\"row mr-0 align-items-center\">\n                <div class=\"col-md-4\">\n                    <scrm-module-title class=\"list-view-title\" [title]=\"moduleTitle\"></scrm-module-title>\n                </div>\n                <div class=\"col-md-8\">\n                    <div class=\"row mr-0 ml-1\">\n                        <div class=\"w-100\">\n                            <scrm-action-menu></scrm-action-menu>\n                        </div>\n                        <div class=\"w-100\">\n                            <scrm-settings-menu></scrm-settings-menu>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"list-view-hr-container\">\n                <hr class=\"list-view-hr\">\n            </div>\n            <div *ngIf=\"actionPanel === 'filters'\" class=\"container-fluid pt-2 small-font\">\n                <div class=\"row\">\n                    <div class=\"col\">\n                        <scrm-list-filter [config]=\"filterAdapter.getConfig()\"></scrm-list-filter>\n                    </div>\n                </div>\n            </div>\n            <div *ngIf=\"actionPanel === 'recordPanel' && recordPanelConfig\" class=\"container-fluid pt-2 small-font\">\n                <div class=\"row\">\n                    <div class=\"col\">\n                        <scrm-record-panel [config]=\"recordPanelConfig\"></scrm-record-panel>\n                    </div>\n                </div>\n            </div>\n        </ng-template>\n    </div>\n</ng-container>\n",
                providers: [FilterAdapter, RecordPanelAdapter]
            },] }
];
ListHeaderComponent.ctorParameters = () => [
    { type: FilterAdapter },
    { type: ListViewStore },
    { type: ModuleNavigation },
    { type: RecordPanelAdapter }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1oZWFkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3ZpZXdzL2xpc3QvY29tcG9uZW50cy9saXN0LWhlYWRlci9saXN0LWhlYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBQzNELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUNwRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sNkVBQTZFLENBQUM7QUFHN0csT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFPdkUsTUFBTSxPQUFPLG1CQUFtQjtJQU81QixZQUNXLGFBQTRCLEVBQ3pCLFNBQXdCLEVBQ3hCLGdCQUFrQyxFQUNsQyxrQkFBc0M7UUFIekMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDekIsY0FBUyxHQUFULFNBQVMsQ0FBZTtRQUN4QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFUcEQsMkJBQXNCLEdBQUcsS0FBSyxDQUFDO1FBQy9CLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBRVAsU0FBSSxHQUFtQixFQUFFLENBQUM7SUFRcEMsQ0FBQztJQUVELElBQUksV0FBVztRQUNYLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDaEQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUM7UUFDekUsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUNoRCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUMvQixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssYUFBYSxFQUFFO2dCQUNwQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ2hFO2lCQUFNO2dCQUNILElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7YUFDakM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQ2xDLENBQUM7OztZQXhDSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsaWlJQUF5QztnQkFDekMsU0FBUyxFQUFFLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDO2FBQ2pEOzs7WUFWTyxhQUFhO1lBRGIsYUFBYTtZQUViLGdCQUFnQjtZQUdoQixrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBPbkRlc3Ryb3ksIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0xpc3RWaWV3U3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL2xpc3Qtdmlldy9saXN0LXZpZXcuc3RvcmUnO1xuaW1wb3J0IHtGaWx0ZXJBZGFwdGVyfSBmcm9tICcuLi8uLi9hZGFwdGVycy9maWx0ZXIuYWRhcHRlcic7XG5pbXBvcnQge01vZHVsZU5hdmlnYXRpb259IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24vbW9kdWxlLW5hdmlnYXRpb24vbW9kdWxlLW5hdmlnYXRpb24uc2VydmljZSc7XG5pbXBvcnQge1JlY29yZFBhbmVsQ29uZmlnfSBmcm9tICcuLi8uLi8uLi8uLi9jb250YWluZXJzL3JlY29yZC1wYW5lbC9jb21wb25lbnRzL3JlY29yZC1wYW5lbC9yZWNvcmQtcGFuZWwubW9kZWwnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtSZWNvcmRQYW5lbEFkYXB0ZXJ9IGZyb20gJy4uLy4uL2FkYXB0ZXJzL3JlY29yZC1wYW5lbC5hZGFwdGVyJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLWxpc3QtaGVhZGVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2xpc3QtaGVhZGVyLmNvbXBvbmVudC5odG1sJyxcbiAgICBwcm92aWRlcnM6IFtGaWx0ZXJBZGFwdGVyLCBSZWNvcmRQYW5lbEFkYXB0ZXJdLFxufSlcbmV4cG9ydCBjbGFzcyBMaXN0SGVhZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgZGlzcGxheVJlc3BvbnNpdmVUYWJsZSA9IGZhbHNlO1xuICAgIGFjdGlvblBhbmVsID0gJyc7XG4gICAgcmVjb3JkUGFuZWxDb25maWc6IFJlY29yZFBhbmVsQ29uZmlnO1xuICAgIHByb3RlY3RlZCBzdWJzOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBmaWx0ZXJBZGFwdGVyOiBGaWx0ZXJBZGFwdGVyLFxuICAgICAgICBwcm90ZWN0ZWQgbGlzdFN0b3JlOiBMaXN0Vmlld1N0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbW9kdWxlTmF2aWdhdGlvbjogTW9kdWxlTmF2aWdhdGlvbixcbiAgICAgICAgcHJvdGVjdGVkIHJlY29yZFBhbmVsQWRhcHRlcjogUmVjb3JkUGFuZWxBZGFwdGVyXG4gICAgKSB7XG4gICAgfVxuXG4gICAgZ2V0IG1vZHVsZVRpdGxlKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMubGlzdFN0b3JlLnZtLmFwcERhdGEubW9kdWxlO1xuICAgICAgICBjb25zdCBhcHBMaXN0U3RyaW5ncyA9IHRoaXMubGlzdFN0b3JlLnZtLmFwcERhdGEubGFuZ3VhZ2UuYXBwTGlzdFN0cmluZ3M7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZHVsZU5hdmlnYXRpb24uZ2V0TW9kdWxlTGFiZWwobW9kdWxlLCBhcHBMaXN0U3RyaW5ncyk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGlzdFN0b3JlLmFjdGlvblBhbmVsJC5zdWJzY3JpYmUoYWN0aW9uUGFuZWwgPT4ge1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25QYW5lbCA9IGFjdGlvblBhbmVsO1xuICAgICAgICAgICAgaWYgKHRoaXMuYWN0aW9uUGFuZWwgPT09ICdyZWNvcmRQYW5lbCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlY29yZFBhbmVsQ29uZmlnID0gdGhpcy5yZWNvcmRQYW5lbEFkYXB0ZXIuZ2V0Q29uZmlnKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVjb3JkUGFuZWxDb25maWcgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdWJzLmZvckVhY2goc3ViID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgICAgICAgdGhpcy5yZWNvcmRQYW5lbENvbmZpZyA9IG51bGw7XG4gICAgfVxufVxuIl19