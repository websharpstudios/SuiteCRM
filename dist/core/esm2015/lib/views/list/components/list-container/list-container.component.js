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
import { MaxColumnsCalculator } from '../../../../services/ui/max-columns-calculator/max-columns-calculator.service';
import { LanguageStore } from '../../../../store/language/language.store';
import { ScreenSize } from '../../../../services/ui/screen-size-observer/screen-size-observer.service';
import { ListViewStore } from '../../store/list-view/list-view.store';
import { TableAdapter } from '../../adapters/table.adapter';
import { ListViewSidebarWidgetAdapter } from '../../adapters/sidebar-widget.adapter';
export class ListContainerComponent {
    constructor(store, adapter, maxColumnCalculator, languageStore, sidebarWidgetAdapter) {
        this.store = store;
        this.adapter = adapter;
        this.maxColumnCalculator = maxColumnCalculator;
        this.languageStore = languageStore;
        this.sidebarWidgetAdapter = sidebarWidgetAdapter;
        this.screen = ScreenSize.Medium;
        this.maxColumns = 5;
        this.vm$ = combineLatest([this.sidebarWidgetAdapter.config$]).pipe(map(([sidebarWidgetConfig]) => ({
            sidebarWidgetConfig,
        })));
    }
    ngOnInit() {
        this.tableConfig = this.adapter.getTable();
        this.tableConfig.maxColumns$ = this.getMaxColumns();
    }
    getMaxColumns() {
        return this.maxColumnCalculator.getMaxColumns(this.store.widgets$);
    }
    getDisplayWidgets() {
        return this.store.widgets && this.store.showSidebarWidgets;
    }
    getDisplay(display) {
        let displayType = 'none';
        if (display) {
            displayType = 'block';
        }
        return displayType;
    }
    getViewContext() {
        return this.store.getViewContext();
    }
}
ListContainerComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-list-container',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<!-- Start List View Container Section -->\n\n<div *ngIf=\"(vm$ | async) as vm\" class=\"list-view-container container-fluid pt-2\">\n    <div class=\"row\">\n        <div [ngClass]=\"{ 'col-lg-12': !getDisplayWidgets() }\" class=\"col-lg-9\">\n            <scrm-table [config]=\"tableConfig\"></scrm-table>\n        </div>\n\n        <ng-container *ngIf=\"vm.sidebarWidgetConfig.widgetsEnabled\">\n            <div [style.display]=\"getDisplay(!!(vm.sidebarWidgetConfig.show && vm.sidebarWidgetConfig.widgets))\"\n                 class=\"col-lg-3 list-widget-container pl-0\">\n                <div *ngFor=\"let widget of vm.sidebarWidgetConfig.widgets\" class=\"mb-3\">\n                    <scrm-sidebar-widget [config]=\"widget\"\n                                         [context]=\"getViewContext()\"\n                                         [context$]=\"store.context$\"\n                                         [type]=\"widget.type\">\n                    </scrm-sidebar-widget>\n                </div>\n            </div>\n        </ng-container>\n    </div>\n</div>\n\n<!-- End List View Container Section -->\n",
                providers: [TableAdapter, MaxColumnsCalculator, ListViewSidebarWidgetAdapter]
            },] }
];
ListContainerComponent.ctorParameters = () => [
    { type: ListViewStore },
    { type: TableAdapter },
    { type: MaxColumnsCalculator },
    { type: LanguageStore },
    { type: ListViewSidebarWidgetAdapter }
];
ListContainerComponent.propDecorators = {
    module: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1jb250YWluZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3ZpZXdzL2xpc3QvY29tcG9uZW50cy9saXN0LWNvbnRhaW5lci9saXN0LWNvbnRhaW5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBQ3ZELE9BQU8sRUFBQyxhQUFhLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFFL0MsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ25DLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLCtFQUErRSxDQUFDO0FBQ25ILE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSwyQ0FBMkMsQ0FBQztBQUN4RSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sMkVBQTJFLENBQUM7QUFDckcsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHVDQUF1QyxDQUFDO0FBRXBFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMxRCxPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQWlCbkYsTUFBTSxPQUFPLHNCQUFzQjtJQWMvQixZQUNXLEtBQW9CLEVBQ2pCLE9BQXFCLEVBQ3JCLG1CQUF5QyxFQUM1QyxhQUE0QixFQUN6QixvQkFBa0Q7UUFKckQsVUFBSyxHQUFMLEtBQUssQ0FBZTtRQUNqQixZQUFPLEdBQVAsT0FBTyxDQUFjO1FBQ3JCLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBc0I7UUFDNUMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDekIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUE4QjtRQWpCaEUsV0FBTSxHQUFlLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDdkMsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUdmLFFBQUcsR0FBbUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUN6RixHQUFHLENBQUMsQ0FDQSxDQUFDLG1CQUFtQixDQUFDLEVBQ3ZCLEVBQUUsQ0FBQyxDQUFDO1lBQ0YsbUJBQW1CO1NBQ3RCLENBQUMsQ0FBQyxDQUNOLENBQUM7SUFTRixDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDeEQsQ0FBQztJQUVELGFBQWE7UUFDVCxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQsaUJBQWlCO1FBQ2IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDO0lBQy9ELENBQUM7SUFFRCxVQUFVLENBQUMsT0FBZ0I7UUFDdkIsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDO1FBRXpCLElBQUksT0FBTyxFQUFFO1lBQ1QsV0FBVyxHQUFHLE9BQU8sQ0FBQztTQUN6QjtRQUVELE9BQU8sV0FBVyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxjQUFjO1FBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7OztZQXRESixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsaTlFQUE0QztnQkFDNUMsU0FBUyxFQUFFLENBQUMsWUFBWSxFQUFFLG9CQUFvQixFQUFFLDRCQUE0QixDQUFDO2FBQ2hGOzs7WUFsQk8sYUFBYTtZQUViLFlBQVk7WUFMWixvQkFBb0I7WUFDcEIsYUFBYTtZQUtiLDRCQUE0Qjs7O3FCQWtCL0IsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7Vmlld0NvbnRleHR9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXhDb2x1bW5zQ2FsY3VsYXRvcn0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZXMvdWkvbWF4LWNvbHVtbnMtY2FsY3VsYXRvci9tYXgtY29sdW1ucy1jYWxjdWxhdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHtMYW5ndWFnZVN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5pbXBvcnQge1NjcmVlblNpemV9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL3VpL3NjcmVlbi1zaXplLW9ic2VydmVyL3NjcmVlbi1zaXplLW9ic2VydmVyLnNlcnZpY2UnO1xuaW1wb3J0IHtMaXN0Vmlld1N0b3JlfSBmcm9tICcuLi8uLi9zdG9yZS9saXN0LXZpZXcvbGlzdC12aWV3LnN0b3JlJztcbmltcG9ydCB7VGFibGVDb25maWd9IGZyb20gJy4uLy4uLy4uLy4uL2NvbXBvbmVudHMvdGFibGUvdGFibGUubW9kZWwnO1xuaW1wb3J0IHtUYWJsZUFkYXB0ZXJ9IGZyb20gJy4uLy4uL2FkYXB0ZXJzL3RhYmxlLmFkYXB0ZXInO1xuaW1wb3J0IHtMaXN0Vmlld1NpZGViYXJXaWRnZXRBZGFwdGVyfSBmcm9tICcuLi8uLi9hZGFwdGVycy9zaWRlYmFyLXdpZGdldC5hZGFwdGVyJztcbmltcG9ydCB7V2lkZ2V0TWV0YWRhdGF9IGZyb20gJ2NvbW1vbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlzdENvbnRhaW5lclN0YXRlIHtcbiAgICBzaWRlYmFyV2lkZ2V0Q29uZmlnOiB7XG4gICAgICAgIHdpZGdldHM6IFdpZGdldE1ldGFkYXRhW107XG4gICAgICAgIHNob3c6IGJvb2xlYW47XG4gICAgICAgIHdpZGdldHNFbmFibGVkOiBib29sZWFuO1xuICAgIH1cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLWxpc3QtY29udGFpbmVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2xpc3QtY29udGFpbmVyLmNvbXBvbmVudC5odG1sJyxcbiAgICBwcm92aWRlcnM6IFtUYWJsZUFkYXB0ZXIsIE1heENvbHVtbnNDYWxjdWxhdG9yLCBMaXN0Vmlld1NpZGViYXJXaWRnZXRBZGFwdGVyXSxcbn0pXG5cbmV4cG9ydCBjbGFzcyBMaXN0Q29udGFpbmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBASW5wdXQoKSBtb2R1bGU7XG4gICAgc2NyZWVuOiBTY3JlZW5TaXplID0gU2NyZWVuU2l6ZS5NZWRpdW07XG4gICAgbWF4Q29sdW1ucyA9IDU7XG4gICAgdGFibGVDb25maWc6IFRhYmxlQ29uZmlnO1xuXG4gICAgdm0kOiBPYnNlcnZhYmxlPExpc3RDb250YWluZXJTdGF0ZT4gPSBjb21iaW5lTGF0ZXN0KFt0aGlzLnNpZGViYXJXaWRnZXRBZGFwdGVyLmNvbmZpZyRdKS5waXBlKFxuICAgICAgICBtYXAoKFxuICAgICAgICAgICAgW3NpZGViYXJXaWRnZXRDb25maWddXG4gICAgICAgICkgPT4gKHtcbiAgICAgICAgICAgIHNpZGViYXJXaWRnZXRDb25maWcsXG4gICAgICAgIH0pKVxuICAgICk7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIHN0b3JlOiBMaXN0Vmlld1N0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgYWRhcHRlcjogVGFibGVBZGFwdGVyLFxuICAgICAgICBwcm90ZWN0ZWQgbWF4Q29sdW1uQ2FsY3VsYXRvcjogTWF4Q29sdW1uc0NhbGN1bGF0b3IsXG4gICAgICAgIHB1YmxpYyBsYW5ndWFnZVN0b3JlOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgc2lkZWJhcldpZGdldEFkYXB0ZXI6IExpc3RWaWV3U2lkZWJhcldpZGdldEFkYXB0ZXJcbiAgICApIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50YWJsZUNvbmZpZyA9IHRoaXMuYWRhcHRlci5nZXRUYWJsZSgpO1xuICAgICAgICB0aGlzLnRhYmxlQ29uZmlnLm1heENvbHVtbnMkID0gdGhpcy5nZXRNYXhDb2x1bW5zKCk7XG4gICAgfVxuXG4gICAgZ2V0TWF4Q29sdW1ucygpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXhDb2x1bW5DYWxjdWxhdG9yLmdldE1heENvbHVtbnModGhpcy5zdG9yZS53aWRnZXRzJCk7XG4gICAgfVxuXG4gICAgZ2V0RGlzcGxheVdpZGdldHMoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlLndpZGdldHMgJiYgdGhpcy5zdG9yZS5zaG93U2lkZWJhcldpZGdldHM7XG4gICAgfVxuXG4gICAgZ2V0RGlzcGxheShkaXNwbGF5OiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGRpc3BsYXlUeXBlID0gJ25vbmUnO1xuXG4gICAgICAgIGlmIChkaXNwbGF5KSB7XG4gICAgICAgICAgICBkaXNwbGF5VHlwZSA9ICdibG9jayc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGlzcGxheVR5cGU7XG4gICAgfVxuXG4gICAgZ2V0Vmlld0NvbnRleHQoKTogVmlld0NvbnRleHQge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS5nZXRWaWV3Q29udGV4dCgpO1xuICAgIH1cbn1cbiJdfQ==