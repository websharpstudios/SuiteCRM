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
import { map, take, tap } from 'rxjs/operators';
import { LanguageStore } from '../../../../store/language/language.store';
import { MaxColumnsCalculator } from '../../../../services/ui/max-columns-calculator/max-columns-calculator.service';
import { LocalStorageService } from "../../../../services/local-storage/local-storage.service";
export class SubpanelContainerComponent {
    constructor(languageStore, maxColumnCalculator, localStorage) {
        this.languageStore = languageStore;
        this.maxColumnCalculator = maxColumnCalculator;
        this.localStorage = localStorage;
        this.isCollapsed = false;
        this.toggleIcon = 'arrow_down_filled';
        this.languages$ = this.languageStore.vm$;
        this.localStorageKey = 'subpanel-state';
    }
    ngOnInit() {
        this.vm$ = this.config.subpanels$.pipe(map((subpanelsMap) => ({
            subpanels: subpanelsMap
        })), tap((subpanelsMap) => {
            if (!subpanelsMap || !Object.keys(subpanelsMap).length) {
                return;
            }
            Object.keys(subpanelsMap.subpanels).forEach(subpanelKey => {
                const subpanel = subpanelsMap.subpanels[subpanelKey];
                if (subpanel.show) {
                    return;
                }
                // check the subpanel state on local storage
                let storedSubpanelState = false;
                const storage = this.localStorage.get(this.localStorageKey);
                const storageModule = storage && storage[subpanel.parentModule];
                if (storageModule
                    && Object.keys(storageModule).length
                    && (subpanelKey in storageModule)) {
                    storedSubpanelState = storageModule[subpanelKey];
                }
                // if present on local storage
                if (storedSubpanelState) {
                    subpanel.show = true;
                    subpanel.load().pipe(take(1)).subscribe();
                }
            });
        }));
        this.maxColumns$ = this.getMaxColumns();
    }
    getMaxColumns() {
        return this.maxColumnCalculator.getMaxColumns(this.config.sidebarActive$);
    }
    toggleSubPanels() {
        this.isCollapsed = !this.isCollapsed;
        this.toggleIcon = (this.isCollapsed) ? 'arrow_up_filled' : 'arrow_down_filled';
    }
    /**
     * Store the data in local storage
     *
     * @param {string} module to store in
     * @param {string} storageKey to store in
     * @param {object} data object to be stored
     */
    storageSave(module, storageKey, data) {
        let storage = this.localStorage.get(storageKey);
        if (!storage) {
            storage = {};
        }
        storage[module] = Object.assign(Object.assign({}, storage[module]), data);
        this.localStorage.set(storageKey, storage);
    }
    showSubpanel(key, item) {
        item.show = !item.show;
        // store in local storage by module and subpanel key
        const subpanel = {};
        subpanel[key] = item.show;
        this.storageSave(item.parentModule, this.localStorageKey, subpanel);
        if (item.show) {
            item.load().pipe(take(1)).subscribe();
        }
    }
    getGridConfig(vm) {
        if (!vm.metadata || !vm.metadata.insightWidget) {
            return {
                layout: null,
            };
        }
        const layout = vm.getWidgetLayout();
        layout.rows.forEach(row => {
            if (!row.cols || !row.cols.length) {
                return;
            }
            row.cols.forEach(col => {
                if (!col.statistic) {
                    return;
                }
                const store = vm.getStatistic(col.statistic);
                if (store) {
                    col.store = store;
                }
            });
        });
        return {
            rowClass: 'statistics-sidebar-widget-row',
            columnClass: 'statistics-sidebar-widget-col',
            layout,
            widgetConfig: {},
            queryArgs: {
                module: vm.metadata.name,
                context: { module: vm.parentModule, id: vm.parentId },
                params: { subpanel: vm.metadata.name },
            },
        };
    }
}
SubpanelContainerComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-subpanel-container',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container *ngIf=\"(vm$ | async) as vm\">\n    <ngb-accordion class=\"sub-panel-banner\" #accordion=\"ngbAccordion\" activeIds=\"sub-panel-buttons\">\n        <ngb-panel id=\"sub-panel-buttons\">\n            <ng-template ngbPanelHeader>\n                <a (click)=\"toggleSubPanels()\" class=\"clickable\">\n                    <div class=\"d-flex align-items-center justify-content-between\">\n                        <scrm-label labelKey=\"LBL_SELECT_SUBPANEL_BANNER\"></scrm-label>\n                        <scrm-image\n                            [attr.aria-expanded]=\"!isCollapsed\"\n                            [image]=\"toggleIcon\"\n                            aria-controls=\"collapseShowSubPanels\"\n                            class=\"float-right\">\n                        </scrm-image>\n                    </div>\n                </a>\n            </ng-template>\n            <ng-template ngbPanelContent>\n                <div id=\"collapseShowSubPanels\" [ngbCollapse]=\"isCollapsed\">\n                    <div class=\"row insight-panel\">\n                        <div class=\"col-xs-6 col-sm-3 col-md-2 insight-panel-card border-insight\"\n                             *ngFor=\"let item of vm.subpanels | keyvalue\"\n                             [ngClass]=\"{'sub-panel-banner-button-active': item.value.show === true}\"\n                             (click)=\"showSubpanel(item.key, item.value)\">\n                            <scrm-grid-widget [config]=\"getGridConfig(item.value)\"></scrm-grid-widget>\n\n                        </div>\n                    </div>\n                </div>\n            </ng-template>\n        </ngb-panel>\n    </ngb-accordion>\n\n    <div id=\"sub-panels\">\n        <ng-container *ngFor=\"let item of vm.subpanels | keyvalue\">\n\n            <scrm-subpanel class=\"sub-panel\"\n                           [store]=\"item.value\"\n                           [maxColumns$]=\"maxColumns$\"\n                           *ngIf=\"item.value.show\">\n            </scrm-subpanel>\n\n        </ng-container>\n    </div>\n\n</ng-container>\n",
                providers: [MaxColumnsCalculator]
            },] }
];
SubpanelContainerComponent.ctorParameters = () => [
    { type: LanguageStore },
    { type: MaxColumnsCalculator },
    { type: LocalStorageService }
];
SubpanelContainerComponent.propDecorators = {
    config: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VicGFuZWwtY29udGFpbmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb250YWluZXJzL3N1YnBhbmVsL2NvbXBvbmVudHMvc3VicGFuZWwtY29udGFpbmVyL3N1YnBhbmVsLWNvbnRhaW5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBQ3ZELE9BQU8sRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRzlDLE9BQU8sRUFBQyxhQUFhLEVBQWtCLE1BQU0sMkNBQTJDLENBQUM7QUFFekYsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sK0VBQStFLENBQUM7QUFHbkgsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sMERBQTBELENBQUM7QUFPN0YsTUFBTSxPQUFPLDBCQUEwQjtJQWFuQyxZQUNjLGFBQTRCLEVBQzVCLG1CQUF5QyxFQUN6QyxZQUFpQztRQUZqQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1Qix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXNCO1FBQ3pDLGlCQUFZLEdBQVosWUFBWSxDQUFxQjtRQVovQyxnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUNwQixlQUFVLEdBQUcsbUJBQW1CLENBQUM7UUFHakMsZUFBVSxHQUFnQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQztRQUd6RCxvQkFBZSxHQUFXLGdCQUFnQixDQUFDO0lBT25ELENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQ2xDLEdBQUcsQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNuQixTQUFTLEVBQUUsWUFBWTtTQUMxQixDQUFDLENBQUMsRUFDSCxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFBRTtZQUNqQixJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3BELE9BQU87YUFDVjtZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFFdEQsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFFckQsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO29CQUNmLE9BQU87aUJBQ1Y7Z0JBRUQsNENBQTRDO2dCQUM1QyxJQUFJLG1CQUFtQixHQUFZLEtBQUssQ0FBQztnQkFDekMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLGFBQWEsR0FBRyxPQUFPLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFFaEUsSUFBSSxhQUFhO3VCQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTTt1QkFDakMsQ0FBQyxXQUFXLElBQUksYUFBYSxDQUFDLEVBQUU7b0JBQ25DLG1CQUFtQixHQUFHLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDcEQ7Z0JBRUQsOEJBQThCO2dCQUM5QixJQUFJLG1CQUFtQixFQUFFO29CQUNyQixRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDckIsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztpQkFDN0M7WUFDTCxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRUQsYUFBYTtRQUNULE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCxlQUFlO1FBQ1gsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDO0lBQ25GLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDTyxXQUFXLENBQUMsTUFBYyxFQUFFLFVBQWtCLEVBQUUsSUFBUztRQUMvRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVoRCxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1YsT0FBTyxHQUFHLEVBQUUsQ0FBQztTQUNoQjtRQUVELE9BQU8sQ0FBQyxNQUFNLENBQUMsbUNBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFLLElBQUksQ0FBQyxDQUFDO1FBRWhELElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsWUFBWSxDQUFDLEdBQVcsRUFBRSxJQUFtQjtRQUN6QyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUV2QixvREFBb0Q7UUFFcEQsTUFBTSxRQUFRLEdBQStCLEVBQUUsQ0FBQztRQUNoRCxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVwRSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDWCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3pDO0lBQ0wsQ0FBQztJQUVELGFBQWEsQ0FBQyxFQUFpQjtRQUUzQixJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFO1lBQzVDLE9BQU87Z0JBQ0gsTUFBTSxFQUFFLElBQUk7YUFDSyxDQUFDO1NBQ3pCO1FBR0QsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRXBDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBRXRCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQy9CLE9BQU87YUFDVjtZQUVELEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUVuQixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRTtvQkFDaEIsT0FBTztpQkFDVjtnQkFFRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxLQUFLLEVBQUU7b0JBQ1AsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7aUJBQ3JCO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFUCxDQUFDLENBQUMsQ0FBQztRQUdILE9BQU87WUFDSCxRQUFRLEVBQUUsK0JBQStCO1lBQ3pDLFdBQVcsRUFBRSwrQkFBK0I7WUFDNUMsTUFBTTtZQUNOLFlBQVksRUFBRSxFQUFvQjtZQUNsQyxTQUFTLEVBQUU7Z0JBQ1AsTUFBTSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSTtnQkFDeEIsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxRQUFRLEVBQWdCO2dCQUNsRSxNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUM7YUFDaEI7U0FDUCxDQUFDO0lBQzFCLENBQUM7OztZQXRKSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLHlCQUF5QjtnQkFDbkMsMjVHQUFnRDtnQkFDaEQsU0FBUyxFQUFFLENBQUMsb0JBQW9CLENBQUM7YUFDcEM7OztZQVhPLGFBQWE7WUFFYixvQkFBb0I7WUFHcEIsbUJBQW1COzs7cUJBU3RCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7bWFwLCB0YWtlLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1N1YnBhbmVsQ29udGFpbmVyQ29uZmlnfSBmcm9tICcuL3N1YnBhbmVsLWNvbnRhaW5lci5tb2RlbCc7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmUsIExhbmd1YWdlU3RyaW5nc30gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtTdWJwYW5lbFN0b3JlLCBTdWJwYW5lbFN0b3JlTWFwfSBmcm9tICcuLi8uLi9zdG9yZS9zdWJwYW5lbC9zdWJwYW5lbC5zdG9yZSc7XG5pbXBvcnQge01heENvbHVtbnNDYWxjdWxhdG9yfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy91aS9tYXgtY29sdW1ucy1jYWxjdWxhdG9yL21heC1jb2x1bW5zLWNhbGN1bGF0b3Iuc2VydmljZSc7XG5pbXBvcnQge1ZpZXdDb250ZXh0LCBXaWRnZXRNZXRhZGF0YX0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7R3JpZFdpZGdldENvbmZpZywgU3RhdGlzdGljc1F1ZXJ5QXJnc30gZnJvbSAnLi4vLi4vLi4vLi4vY29tcG9uZW50cy9ncmlkLXdpZGdldC9ncmlkLXdpZGdldC5jb21wb25lbnQnO1xuaW1wb3J0IHtMb2NhbFN0b3JhZ2VTZXJ2aWNlfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmljZXMvbG9jYWwtc3RvcmFnZS9sb2NhbC1zdG9yYWdlLnNlcnZpY2VcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLXN1YnBhbmVsLWNvbnRhaW5lcicsXG4gICAgdGVtcGxhdGVVcmw6ICdzdWJwYW5lbC1jb250YWluZXIuY29tcG9uZW50Lmh0bWwnLFxuICAgIHByb3ZpZGVyczogW01heENvbHVtbnNDYWxjdWxhdG9yXVxufSlcbmV4cG9ydCBjbGFzcyBTdWJwYW5lbENvbnRhaW5lckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBASW5wdXQoKSBjb25maWc6IFN1YnBhbmVsQ29udGFpbmVyQ29uZmlnO1xuXG4gICAgaXNDb2xsYXBzZWQgPSBmYWxzZTtcbiAgICB0b2dnbGVJY29uID0gJ2Fycm93X2Rvd25fZmlsbGVkJztcbiAgICBtYXhDb2x1bW5zJDogT2JzZXJ2YWJsZTxudW1iZXI+O1xuXG4gICAgbGFuZ3VhZ2VzJDogT2JzZXJ2YWJsZTxMYW5ndWFnZVN0cmluZ3M+ID0gdGhpcy5sYW5ndWFnZVN0b3JlLnZtJDtcblxuICAgIHZtJDogT2JzZXJ2YWJsZTx7IHN1YnBhbmVsczogU3VicGFuZWxTdG9yZU1hcCB9PjtcbiAgICBwcml2YXRlIGxvY2FsU3RvcmFnZUtleTogc3RyaW5nID0gJ3N1YnBhbmVsLXN0YXRlJztcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgbGFuZ3VhZ2VTdG9yZTogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIG1heENvbHVtbkNhbGN1bGF0b3I6IE1heENvbHVtbnNDYWxjdWxhdG9yLFxuICAgICAgICBwcm90ZWN0ZWQgbG9jYWxTdG9yYWdlOiBMb2NhbFN0b3JhZ2VTZXJ2aWNlXG4gICAgKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudm0kID0gdGhpcy5jb25maWcuc3VicGFuZWxzJC5waXBlKFxuICAgICAgICAgICAgbWFwKChzdWJwYW5lbHNNYXApID0+ICh7XG4gICAgICAgICAgICAgICAgc3VicGFuZWxzOiBzdWJwYW5lbHNNYXBcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIHRhcCgoc3VicGFuZWxzTWFwKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFzdWJwYW5lbHNNYXAgfHwgIU9iamVjdC5rZXlzKHN1YnBhbmVsc01hcCkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhzdWJwYW5lbHNNYXAuc3VicGFuZWxzKS5mb3JFYWNoKHN1YnBhbmVsS2V5ID0+IHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWJwYW5lbCA9IHN1YnBhbmVsc01hcC5zdWJwYW5lbHNbc3VicGFuZWxLZXldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWJwYW5lbC5zaG93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayB0aGUgc3VicGFuZWwgc3RhdGUgb24gbG9jYWwgc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICBsZXQgc3RvcmVkU3VicGFuZWxTdGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdG9yYWdlID0gdGhpcy5sb2NhbFN0b3JhZ2UuZ2V0KHRoaXMubG9jYWxTdG9yYWdlS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RvcmFnZU1vZHVsZSA9IHN0b3JhZ2UgJiYgc3RvcmFnZVtzdWJwYW5lbC5wYXJlbnRNb2R1bGVdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdG9yYWdlTW9kdWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBPYmplY3Qua2V5cyhzdG9yYWdlTW9kdWxlKS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIChzdWJwYW5lbEtleSBpbiBzdG9yYWdlTW9kdWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVkU3VicGFuZWxTdGF0ZSA9IHN0b3JhZ2VNb2R1bGVbc3VicGFuZWxLZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgcHJlc2VudCBvbiBsb2NhbCBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdG9yZWRTdWJwYW5lbFN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJwYW5lbC5zaG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnBhbmVsLmxvYWQoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICB0aGlzLm1heENvbHVtbnMkID0gdGhpcy5nZXRNYXhDb2x1bW5zKCk7XG4gICAgfVxuXG4gICAgZ2V0TWF4Q29sdW1ucygpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXhDb2x1bW5DYWxjdWxhdG9yLmdldE1heENvbHVtbnModGhpcy5jb25maWcuc2lkZWJhckFjdGl2ZSQpO1xuICAgIH1cblxuICAgIHRvZ2dsZVN1YlBhbmVscygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pc0NvbGxhcHNlZCA9ICF0aGlzLmlzQ29sbGFwc2VkO1xuICAgICAgICB0aGlzLnRvZ2dsZUljb24gPSAodGhpcy5pc0NvbGxhcHNlZCkgPyAnYXJyb3dfdXBfZmlsbGVkJyA6ICdhcnJvd19kb3duX2ZpbGxlZCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RvcmUgdGhlIGRhdGEgaW4gbG9jYWwgc3RvcmFnZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZHVsZSB0byBzdG9yZSBpblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdG9yYWdlS2V5IHRvIHN0b3JlIGluXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgb2JqZWN0IHRvIGJlIHN0b3JlZFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBzdG9yYWdlU2F2ZShtb2R1bGU6IHN0cmluZywgc3RvcmFnZUtleTogc3RyaW5nLCBkYXRhOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgbGV0IHN0b3JhZ2UgPSB0aGlzLmxvY2FsU3RvcmFnZS5nZXQoc3RvcmFnZUtleSk7XG5cbiAgICAgICAgaWYgKCFzdG9yYWdlKSB7XG4gICAgICAgICAgICBzdG9yYWdlID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBzdG9yYWdlW21vZHVsZV0gPSB7Li4uc3RvcmFnZVttb2R1bGVdLCAuLi5kYXRhfTtcblxuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZS5zZXQoc3RvcmFnZUtleSwgc3RvcmFnZSk7XG4gICAgfVxuXG4gICAgc2hvd1N1YnBhbmVsKGtleTogc3RyaW5nLCBpdGVtOiBTdWJwYW5lbFN0b3JlKTogdm9pZCB7XG4gICAgICAgIGl0ZW0uc2hvdyA9ICFpdGVtLnNob3c7XG5cbiAgICAgICAgLy8gc3RvcmUgaW4gbG9jYWwgc3RvcmFnZSBieSBtb2R1bGUgYW5kIHN1YnBhbmVsIGtleVxuXG4gICAgICAgIGNvbnN0IHN1YnBhbmVsOiB7IFtrZXk6IHN0cmluZ106IGJvb2xlYW4gfSA9IHt9O1xuICAgICAgICBzdWJwYW5lbFtrZXldID0gaXRlbS5zaG93O1xuICAgICAgICB0aGlzLnN0b3JhZ2VTYXZlKGl0ZW0ucGFyZW50TW9kdWxlLCB0aGlzLmxvY2FsU3RvcmFnZUtleSwgc3VicGFuZWwpO1xuXG4gICAgICAgIGlmIChpdGVtLnNob3cpIHtcbiAgICAgICAgICAgIGl0ZW0ubG9hZCgpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRHcmlkQ29uZmlnKHZtOiBTdWJwYW5lbFN0b3JlKTogR3JpZFdpZGdldENvbmZpZyB7XG5cbiAgICAgICAgaWYgKCF2bS5tZXRhZGF0YSB8fCAhdm0ubWV0YWRhdGEuaW5zaWdodFdpZGdldCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsYXlvdXQ6IG51bGwsXG4gICAgICAgICAgICB9IGFzIEdyaWRXaWRnZXRDb25maWc7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbnN0IGxheW91dCA9IHZtLmdldFdpZGdldExheW91dCgpO1xuXG4gICAgICAgIGxheW91dC5yb3dzLmZvckVhY2gocm93ID0+IHtcblxuICAgICAgICAgICAgaWYgKCFyb3cuY29scyB8fCAhcm93LmNvbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByb3cuY29scy5mb3JFYWNoKGNvbCA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWNvbC5zdGF0aXN0aWMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHN0b3JlID0gdm0uZ2V0U3RhdGlzdGljKGNvbC5zdGF0aXN0aWMpO1xuICAgICAgICAgICAgICAgIGlmIChzdG9yZSkge1xuICAgICAgICAgICAgICAgICAgICBjb2wuc3RvcmUgPSBzdG9yZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByb3dDbGFzczogJ3N0YXRpc3RpY3Mtc2lkZWJhci13aWRnZXQtcm93JyxcbiAgICAgICAgICAgIGNvbHVtbkNsYXNzOiAnc3RhdGlzdGljcy1zaWRlYmFyLXdpZGdldC1jb2wnLFxuICAgICAgICAgICAgbGF5b3V0LFxuICAgICAgICAgICAgd2lkZ2V0Q29uZmlnOiB7fSBhcyBXaWRnZXRNZXRhZGF0YSxcbiAgICAgICAgICAgIHF1ZXJ5QXJnczoge1xuICAgICAgICAgICAgICAgIG1vZHVsZTogdm0ubWV0YWRhdGEubmFtZSxcbiAgICAgICAgICAgICAgICBjb250ZXh0OiB7bW9kdWxlOiB2bS5wYXJlbnRNb2R1bGUsIGlkOiB2bS5wYXJlbnRJZH0gYXMgVmlld0NvbnRleHQsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7c3VicGFuZWw6IHZtLm1ldGFkYXRhLm5hbWV9LFxuICAgICAgICAgICAgfSBhcyBTdGF0aXN0aWNzUXVlcnlBcmdzLFxuICAgICAgICB9IGFzIEdyaWRXaWRnZXRDb25maWc7XG4gICAgfVxufVxuIl19