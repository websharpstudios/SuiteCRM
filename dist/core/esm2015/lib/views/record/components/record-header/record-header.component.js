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
import { RecordViewStore } from '../../store/record-view/record-view.store';
import { ModuleNavigation } from '../../../../services/navigation/module-navigation/module-navigation.service';
import { RecordActionsAdapter } from '../../adapters/actions.adapter';
export class RecordHeaderComponent {
    constructor(actionsAdapter, recordViewStore, moduleNavigation) {
        this.actionsAdapter = actionsAdapter;
        this.recordViewStore = recordViewStore;
        this.moduleNavigation = moduleNavigation;
        this.displayResponsiveTable = false;
        this.subs = [];
    }
    ngOnInit() {
        this.subs.push(this.recordViewStore.record$.subscribe(record => {
            this.record = record;
        }));
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    get moduleTitle() {
        const module = this.recordViewStore.vm.appData.module;
        const appListStrings = this.recordViewStore.vm.appData.language.appListStrings;
        return this.moduleNavigation.getModuleLabel(module, appListStrings);
    }
    /**
     * Get Summary template
     *
     * @returns {string} template label
     */
    getSummaryTemplate() {
        return this.recordViewStore.getSummaryTemplate();
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
}
RecordHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-record-header',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container>\n    <div class=\"record-view-header\">\n        <ng-container *ngIf=\"displayResponsiveTable\">\n            <div class=\"d-flex flex-nowrap\">\n                <div class=\"row\">\n                    <div class=\"col\">\n                        <div class=\"order-3\">\n                        </div>\n                    </div>\n                    <div class=\"w-100\"></div>\n                    <div class=\"col\">\n                        <div class=\"order-2\">\n                            <scrm-module-title class=\"record-view-title\" [title]=\"moduleTitle\"></scrm-module-title>\n                            <div class=\"record-view-name\">\n                                <scrm-dynamic-label *ngIf=\"record && record.fields\"\n                                                    [fields]=\"record.fields\"\n                                                    [labelKey]=\"getSummaryTemplate()\">\n                                </scrm-dynamic-label>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"w-100\"></div>\n                    <div class=\"col\">\n                        <div *ngIf=\"record\" class=\"order-1\">\n                            <scrm-action-group-menu\n                                [config]=\"actionsAdapter\"\n                                klass=\"record-view-actions float-right\">\n                            </scrm-action-group-menu>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </ng-container>\n        <ng-template [ngIf]=\"!displayResponsiveTable\">\n            <div class=\"row mr-0\">\n                <div class=\"col-md-4\">\n                    <scrm-module-title class=\"record-view-title\" [title]=\"moduleTitle\"></scrm-module-title>\n                    <div class=\"record-view-name\">\n                        <scrm-dynamic-label *ngIf=\"record && record.fields\"\n                                            [fields]=\"record.fields\"\n                                            [labelKey]=\"getSummaryTemplate()\">\n                        </scrm-dynamic-label>\n                    </div>\n                </div>\n                <div class=\"col-md-8\">\n                    <div class=\"row mr-1 ml-1\">\n                        <div class=\"w-100\">\n                        </div>\n                        <div *ngIf=\"record\" class=\"w-100\">\n                            <scrm-action-group-menu\n                                [config]=\"actionsAdapter\"\n                                [actionContext]=\"getActionContext(record)\"\n                                klass=\"record-view-actions float-right\"\n                                buttonClass=\"settings-button\"\n                            >\n                            </scrm-action-group-menu>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </ng-template>\n    </div>\n</ng-container>\n",
                providers: [RecordActionsAdapter]
            },] }
];
RecordHeaderComponent.ctorParameters = () => [
    { type: RecordActionsAdapter },
    { type: RecordViewStore },
    { type: ModuleNavigation }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLWhlYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvdmlld3MvcmVjb3JkL2NvbXBvbmVudHMvcmVjb3JkLWhlYWRlci9yZWNvcmQtaGVhZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBR0gsT0FBTyxFQUFDLFNBQVMsRUFBb0IsTUFBTSxlQUFlLENBQUM7QUFFM0QsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBQzFFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDZFQUE2RSxDQUFDO0FBQzdHLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBUXBFLE1BQU0sT0FBTyxxQkFBcUI7SUFPOUIsWUFDVyxjQUFvQyxFQUNqQyxlQUFnQyxFQUNoQyxnQkFBa0M7UUFGckMsbUJBQWMsR0FBZCxjQUFjLENBQXNCO1FBQ2pDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBUGhELDJCQUFzQixHQUFHLEtBQUssQ0FBQztRQUVyQixTQUFJLEdBQW1CLEVBQUUsQ0FBQztJQU9wQyxDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMzRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDWCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ3RELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO1FBQy9FLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxrQkFBa0I7UUFDZCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUNyRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsZ0JBQWdCLENBQUMsTUFBYztRQUMzQixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1QsT0FBTyxFQUFtQixDQUFBO1NBQzdCO1FBRUQsT0FBTztZQUNILE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxJQUFJLEVBQUU7WUFDM0IsTUFBTTtTQUNRLENBQUE7SUFDdEIsQ0FBQzs7O1lBekRKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5Qiw2MUlBQTJDO2dCQUMzQyxTQUFTLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQzthQUNwQzs7O1lBUE8sb0JBQW9CO1lBRnBCLGVBQWU7WUFDZixnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cblxuaW1wb3J0IHtDb21wb25lbnQsIE9uRGVzdHJveSwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7UmVjb3JkVmlld1N0b3JlfSBmcm9tICcuLi8uLi9zdG9yZS9yZWNvcmQtdmlldy9yZWNvcmQtdmlldy5zdG9yZSc7XG5pbXBvcnQge01vZHVsZU5hdmlnYXRpb259IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24vbW9kdWxlLW5hdmlnYXRpb24vbW9kdWxlLW5hdmlnYXRpb24uc2VydmljZSc7XG5pbXBvcnQge1JlY29yZEFjdGlvbnNBZGFwdGVyfSBmcm9tICcuLi8uLi9hZGFwdGVycy9hY3Rpb25zLmFkYXB0ZXInO1xuaW1wb3J0IHtBY3Rpb25Db250ZXh0LCBSZWNvcmR9IGZyb20gJ2NvbW1vbic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1yZWNvcmQtaGVhZGVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJ3JlY29yZC1oZWFkZXIuY29tcG9uZW50Lmh0bWwnLFxuICAgIHByb3ZpZGVyczogW1JlY29yZEFjdGlvbnNBZGFwdGVyXVxufSlcbmV4cG9ydCBjbGFzcyBSZWNvcmRIZWFkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgICByZWNvcmQ6IFJlY29yZDtcbiAgICBkaXNwbGF5UmVzcG9uc2l2ZVRhYmxlID0gZmFsc2U7XG5cbiAgICBwcm90ZWN0ZWQgc3ViczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgYWN0aW9uc0FkYXB0ZXI6IFJlY29yZEFjdGlvbnNBZGFwdGVyLFxuICAgICAgICBwcm90ZWN0ZWQgcmVjb3JkVmlld1N0b3JlOiBSZWNvcmRWaWV3U3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBtb2R1bGVOYXZpZ2F0aW9uOiBNb2R1bGVOYXZpZ2F0aW9uXG4gICAgKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3Vicy5wdXNoKHRoaXMucmVjb3JkVmlld1N0b3JlLnJlY29yZCQuc3Vic2NyaWJlKHJlY29yZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZCA9IHJlY29yZDtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN1YnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICAgIH1cblxuICAgIGdldCBtb2R1bGVUaXRsZSgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB0aGlzLnJlY29yZFZpZXdTdG9yZS52bS5hcHBEYXRhLm1vZHVsZTtcbiAgICAgICAgY29uc3QgYXBwTGlzdFN0cmluZ3MgPSB0aGlzLnJlY29yZFZpZXdTdG9yZS52bS5hcHBEYXRhLmxhbmd1YWdlLmFwcExpc3RTdHJpbmdzO1xuICAgICAgICByZXR1cm4gdGhpcy5tb2R1bGVOYXZpZ2F0aW9uLmdldE1vZHVsZUxhYmVsKG1vZHVsZSwgYXBwTGlzdFN0cmluZ3MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBTdW1tYXJ5IHRlbXBsYXRlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0ZW1wbGF0ZSBsYWJlbFxuICAgICAqL1xuICAgIGdldFN1bW1hcnlUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWNvcmRWaWV3U3RvcmUuZ2V0U3VtbWFyeVRlbXBsYXRlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgYWN0aW9uIGNvbnRleHRcbiAgICAgKiBAcGFyYW0gcmVjb3JkXG4gICAgICovXG4gICAgZ2V0QWN0aW9uQ29udGV4dChyZWNvcmQ6IFJlY29yZCk6IEFjdGlvbkNvbnRleHQge1xuICAgICAgICBpZiAoIXJlY29yZCkge1xuICAgICAgICAgICAgcmV0dXJuIHt9IGFzIEFjdGlvbkNvbnRleHRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBtb2R1bGU6IHJlY29yZC5tb2R1bGUgfHwgJycsXG4gICAgICAgICAgICByZWNvcmRcbiAgICAgICAgfSBhcyBBY3Rpb25Db250ZXh0XG4gICAgfVxufVxuIl19