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
import { LanguageStore } from '../../store/language/language.store';
import { GlobalSearch } from '../../services/navigation/global-search/global-search.service';
export class ActionBarUiComponent {
    constructor(languageStore, globalSearch) {
        this.languageStore = languageStore;
        this.globalSearch = globalSearch;
        this.searchTerm = '';
        this.actionBar = {
            createLinks: [
                {
                    label: 'Accounts',
                    route: '/accounts/edit'
                },
                {
                    label: 'Contacts',
                    route: '/contacts/edit'
                },
                {
                    label: 'Leads',
                    route: '/leads/edit'
                },
                {
                    label: 'Opportunities',
                    route: '/opportunities/edit'
                },
                {
                    label: 'AOS_Quotes',
                    route: '/quotes/edit'
                },
                {
                    label: 'AOS_Contracts',
                    route: '/contracts/edit'
                },
            ],
            favoriteRecords: [],
        };
        this.languages$ = this.languageStore.vm$;
        this.vm$ = combineLatest([
            this.languages$,
        ]).pipe(map(([languages]) => ({
            appStrings: languages.appStrings || {},
            appListStrings: languages.appListStrings || {}
        })));
    }
    search() {
        this.globalSearch.navigateToSearch(this.searchTerm).finally(() => {
            this.clearSearchTerm();
        });
    }
    clearSearchTerm() {
        this.searchTerm = '';
    }
}
ActionBarUiComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-action-bar-ui',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<!-- Start of action bar section -->\n\n<div class=\"global-action-bar row pb-2 pt-2 mr-0\" *ngIf=\"(vm$ | async) as vm\">\n    <div class=\"col-6\">\n        <form name=\"global-search\" class=\"global-search\">\n            <div class=\"input-group\">\n                <input [(ngModel)]=\"searchTerm\"\n                       type=\"text\"\n                       name=\"global-search-term\"\n                       class=\"form-control global-search-term\"\n                       placeholder=\"{{vm.appStrings['LBL_SEARCH'] || ''}}...\"\n                       aria-label=\"Search\"\n                       required>\n                <div class=\"input-group-append\">\n                    <button class=\"btn btn-default search-button\"\n                            aria-label=\"Search\"\n                            scrm-button-loading\n                            (click)=\"search()\">\n                        <scrm-image class=\"search-icon sicon\" image=\"search\"></scrm-image>\n                    </button>\n                </div>\n            </div>\n        </form>\n    </div>\n    <div class=\"col justify-content-right\">\n        <div class=\"action-group\">\n            <div class=\"action-new dropdown\">\n                <button class=\"quickcreate-button dropdown-toggle\" type=\"button\" aria-label=\"Quick Create\">\n                    {{vm.appStrings['LBL_NEW'] || ''}}\n                </button>\n                <ul class=\"dropdown-menu dropdown-menu-right\">\n                    <li class=\"new-list-item\" *ngFor=\"let createLink of actionBar.createLinks\">\n                        <a [routerLink]=\"createLink.route\">\n                            <scrm-image class=\"action-btn-icon\" image=\"plus\"></scrm-image>\n                            {{vm.appListStrings.moduleList && vm.appListStrings.moduleList[createLink.label]}}\n                        </a>\n                    </li>\n                </ul>\n            </div>\n        </div>\n    </div>\n</div>\n\n<!-- End of action bar section -->\n"
            },] }
];
ActionBarUiComponent.ctorParameters = () => [
    { type: LanguageStore },
    { type: GlobalSearch }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29tcG9uZW50cy9hY3Rpb24tYmFyL2FjdGlvbi1iYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxhQUFhLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRW5DLE9BQU8sRUFBQyxhQUFhLEVBQWtCLE1BQU0scUNBQXFDLENBQUM7QUFDbkYsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLCtEQUErRCxDQUFDO0FBTzNGLE1BQU0sT0FBTyxvQkFBb0I7SUE4QzdCLFlBQXNCLGFBQTRCLEVBQVksWUFBMEI7UUFBbEUsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFBWSxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQTVDeEYsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNoQixjQUFTLEdBQW1CO1lBQ3hCLFdBQVcsRUFBRTtnQkFDVDtvQkFDSSxLQUFLLEVBQUUsVUFBVTtvQkFDakIsS0FBSyxFQUFFLGdCQUFnQjtpQkFDMUI7Z0JBQ0Q7b0JBQ0ksS0FBSyxFQUFFLFVBQVU7b0JBQ2pCLEtBQUssRUFBRSxnQkFBZ0I7aUJBQzFCO2dCQUNEO29CQUNJLEtBQUssRUFBRSxPQUFPO29CQUNkLEtBQUssRUFBRSxhQUFhO2lCQUN2QjtnQkFDRDtvQkFDSSxLQUFLLEVBQUUsZUFBZTtvQkFDdEIsS0FBSyxFQUFFLHFCQUFxQjtpQkFDL0I7Z0JBQ0Q7b0JBQ0ksS0FBSyxFQUFFLFlBQVk7b0JBQ25CLEtBQUssRUFBRSxjQUFjO2lCQUN4QjtnQkFDRDtvQkFDSSxLQUFLLEVBQUUsZUFBZTtvQkFDdEIsS0FBSyxFQUFFLGlCQUFpQjtpQkFDM0I7YUFDSjtZQUNELGVBQWUsRUFBRSxFQUFFO1NBQ3RCLENBQUM7UUFFRixlQUFVLEdBQWdDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO1FBRWpFLFFBQUcsR0FBRyxhQUFhLENBQUM7WUFDaEIsSUFBSSxDQUFDLFVBQVU7U0FDbEIsQ0FBQyxDQUFDLElBQUksQ0FDSCxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUNqQjtZQUNJLFVBQVUsRUFBRSxTQUFTLENBQUMsVUFBVSxJQUFJLEVBQUU7WUFDdEMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxjQUFjLElBQUksRUFBRTtTQUNqRCxDQUFDLENBQ0wsQ0FDSixDQUFDO0lBR0YsQ0FBQztJQUVELE1BQU07UUFDRixJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO1lBQzdELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxlQUFlO1FBQ1gsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDekIsQ0FBQzs7O1lBOURKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixvMkdBQTBDO2FBRTdDOzs7WUFQTyxhQUFhO1lBQ2IsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0FjdGlvbkJhck1vZGVsfSBmcm9tICcuL2FjdGlvbi1iYXItbW9kZWwnO1xuaW1wb3J0IHtMYW5ndWFnZVN0b3JlLCBMYW5ndWFnZVN0cmluZ3N9IGZyb20gJy4uLy4uL3N0b3JlL2xhbmd1YWdlL2xhbmd1YWdlLnN0b3JlJztcbmltcG9ydCB7R2xvYmFsU2VhcmNofSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uL2dsb2JhbC1zZWFyY2gvZ2xvYmFsLXNlYXJjaC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLWFjdGlvbi1iYXItdWknLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9hY3Rpb24tYmFyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIEFjdGlvbkJhclVpQ29tcG9uZW50IHtcblxuICAgIHNlYXJjaFRlcm0gPSAnJztcbiAgICBhY3Rpb25CYXI6IEFjdGlvbkJhck1vZGVsID0ge1xuICAgICAgICBjcmVhdGVMaW5rczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnQWNjb3VudHMnLFxuICAgICAgICAgICAgICAgIHJvdXRlOiAnL2FjY291bnRzL2VkaXQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnQ29udGFjdHMnLFxuICAgICAgICAgICAgICAgIHJvdXRlOiAnL2NvbnRhY3RzL2VkaXQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnTGVhZHMnLFxuICAgICAgICAgICAgICAgIHJvdXRlOiAnL2xlYWRzL2VkaXQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAnT3Bwb3J0dW5pdGllcycsXG4gICAgICAgICAgICAgICAgcm91dGU6ICcvb3Bwb3J0dW5pdGllcy9lZGl0J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0FPU19RdW90ZXMnLFxuICAgICAgICAgICAgICAgIHJvdXRlOiAnL3F1b3Rlcy9lZGl0J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ0FPU19Db250cmFjdHMnLFxuICAgICAgICAgICAgICAgIHJvdXRlOiAnL2NvbnRyYWN0cy9lZGl0J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgZmF2b3JpdGVSZWNvcmRzOiBbXSxcbiAgICB9O1xuXG4gICAgbGFuZ3VhZ2VzJDogT2JzZXJ2YWJsZTxMYW5ndWFnZVN0cmluZ3M+ID0gdGhpcy5sYW5ndWFnZVN0b3JlLnZtJDtcblxuICAgIHZtJCA9IGNvbWJpbmVMYXRlc3QoW1xuICAgICAgICB0aGlzLmxhbmd1YWdlcyQsXG4gICAgXSkucGlwZShcbiAgICAgICAgbWFwKChbbGFuZ3VhZ2VzXSkgPT4gKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFwcFN0cmluZ3M6IGxhbmd1YWdlcy5hcHBTdHJpbmdzIHx8IHt9LFxuICAgICAgICAgICAgICAgIGFwcExpc3RTdHJpbmdzOiBsYW5ndWFnZXMuYXBwTGlzdFN0cmluZ3MgfHwge31cbiAgICAgICAgICAgIH0pXG4gICAgICAgIClcbiAgICApO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGxhbmd1YWdlU3RvcmU6IExhbmd1YWdlU3RvcmUsIHByb3RlY3RlZCBnbG9iYWxTZWFyY2g6IEdsb2JhbFNlYXJjaCkge1xuICAgIH1cblxuICAgIHNlYXJjaCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5nbG9iYWxTZWFyY2gubmF2aWdhdGVUb1NlYXJjaCh0aGlzLnNlYXJjaFRlcm0pLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbGVhclNlYXJjaFRlcm0oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2xlYXJTZWFyY2hUZXJtKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlYXJjaFRlcm0gPSAnJztcbiAgICB9XG59XG4iXX0=