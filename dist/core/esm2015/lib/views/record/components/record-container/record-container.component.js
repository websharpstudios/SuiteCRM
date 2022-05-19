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
import { MetadataStore } from '../../../../store/metadata/metadata.store.service';
import { LanguageStore } from '../../../../store/language/language.store';
import { SidebarWidgetAdapter } from '../../adapters/sidebar-widget.adapter';
import { RecordViewStore } from '../../store/record-view/record-view.store';
import { RecordContentAdapter } from '../../adapters/record-content.adapter';
import { TopWidgetAdapter } from '../../adapters/top-widget.adapter';
export class RecordContainerComponent {
    constructor(recordViewStore, language, metadata, contentAdapter, topWidgetAdapter, sidebarWidgetAdapter) {
        this.recordViewStore = recordViewStore;
        this.language = language;
        this.metadata = metadata;
        this.contentAdapter = contentAdapter;
        this.topWidgetAdapter = topWidgetAdapter;
        this.sidebarWidgetAdapter = sidebarWidgetAdapter;
        this.language$ = this.language.vm$;
        this.vm$ = combineLatest([
            this.language$, this.sidebarWidgetAdapter.config$, this.topWidgetAdapter.config$, this.recordViewStore.showSubpanels$
        ]).pipe(map(([language, sidebarWidgetConfig, topWidgetConfig, showSubpanels]) => ({
            language,
            sidebarWidgetConfig,
            topWidgetConfig,
            showSubpanels
        })));
    }
    ngOnInit() {
    }
    getContentAdapter() {
        return this.contentAdapter;
    }
    getSubpanelsConfig() {
        return {
            subpanels$: this.recordViewStore.subpanels$,
            sidebarActive$: this.recordViewStore.widgets$
        };
    }
    getViewContext() {
        return this.recordViewStore.getViewContext();
    }
    getViewContext$() {
        return this.recordViewStore.viewContext$;
    }
    hasTopWidgetMetadata(meta) {
        return !!(meta && meta.type);
    }
}
RecordContainerComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-record-container',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<!-- Start Record View Container Section -->\n\n<div *ngIf=\"(vm$ | async) as vm\"\n     class=\"record-view-container view-container container-fluid pt-3 pb-3 small-font\">\n    <div class=\"row\">\n        <div class=\"col-lg-9\" [ngClass]=\"{ 'col-lg-12': !vm.sidebarWidgetConfig.show }\">\n\n            <div class=\"container-fluid pl-0 pr-0\">\n\n                <div class=\"row no-gutters\"\n                     *ngIf=\"vm.topWidgetConfig.show && hasTopWidgetMetadata(vm.topWidgetConfig.widget)\">\n                    <div class=\"col pb-3\">\n                        <scrm-top-widget [type]=\"vm.topWidgetConfig.widget.type\"\n                                         [context]=\"getViewContext()\"\n                                         [config]=\"vm.topWidgetConfig.widget\">\n                        </scrm-top-widget>\n                    </div>\n                </div>\n\n                <div class=\"row no-gutters\">\n                    <div class=\"col\">\n                        <scrm-record-content [dataSource]=\"getContentAdapter()\"></scrm-record-content>\n                    </div>\n                </div>\n\n                <div *ngIf=\"vm.showSubpanels\"\n                     class=\"row no-gutters pt-1 pb-4\">\n                    <div class=\"col\">\n                        <scrm-subpanel-container [config]=\"getSubpanelsConfig()\"></scrm-subpanel-container>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"col-lg-3 record-widget-container pl-0\"\n             *ngIf=\"vm.sidebarWidgetConfig.show && vm.sidebarWidgetConfig.widgets\">\n            <div class=\"mb-3\" *ngFor=\"let widget of vm.sidebarWidgetConfig.widgets\">\n                <scrm-sidebar-widget [type]=\"widget.type\"\n                                     [context]=\"getViewContext()\"\n                                     [context$]=\"getViewContext$()\"\n                                     [config]=\"widget\">\n                </scrm-sidebar-widget>\n            </div>\n        </div>\n\n    </div>\n</div>\n\n<!-- End Record View Container Section -->\n",
                providers: [RecordContentAdapter, TopWidgetAdapter, SidebarWidgetAdapter]
            },] }
];
RecordContainerComponent.ctorParameters = () => [
    { type: RecordViewStore },
    { type: LanguageStore },
    { type: MetadataStore },
    { type: RecordContentAdapter },
    { type: TopWidgetAdapter },
    { type: SidebarWidgetAdapter }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLWNvbnRhaW5lci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvdmlld3MvcmVjb3JkL2NvbXBvbmVudHMvcmVjb3JkLWNvbnRhaW5lci9yZWNvcmQtY29udGFpbmVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBUyxNQUFNLGVBQWUsQ0FBQztBQUNoRCxPQUFPLEVBQUMsYUFBYSxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuQyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbURBQW1ELENBQUM7QUFDaEYsT0FBTyxFQUFDLGFBQWEsRUFBa0IsTUFBTSwyQ0FBMkMsQ0FBQztBQUV6RixPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUMzRSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFDMUUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFFM0UsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFPbkUsTUFBTSxPQUFPLHdCQUF3QjtJQWdCakMsWUFDVyxlQUFnQyxFQUM3QixRQUF1QixFQUN2QixRQUF1QixFQUN2QixjQUFvQyxFQUNwQyxnQkFBa0MsRUFDbEMsb0JBQTBDO1FBTDdDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUM3QixhQUFRLEdBQVIsUUFBUSxDQUFlO1FBQ3ZCLGFBQVEsR0FBUixRQUFRLENBQWU7UUFDdkIsbUJBQWMsR0FBZCxjQUFjLENBQXNCO1FBQ3BDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQXJCeEQsY0FBUyxHQUFnQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztRQUUzRCxRQUFHLEdBQUcsYUFBYSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYztTQUN4SCxDQUFDLENBQUMsSUFBSSxDQUNILEdBQUcsQ0FBQyxDQUNBLENBQUMsUUFBUSxFQUFFLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxhQUFhLENBQUMsRUFDakUsRUFBRSxDQUFDLENBQUM7WUFDRixRQUFRO1lBQ1IsbUJBQW1CO1lBQ25CLGVBQWU7WUFDZixhQUFhO1NBQ2hCLENBQUMsQ0FBQyxDQUNOLENBQUM7SUFVRixDQUFDO0lBRUQsUUFBUTtJQUNSLENBQUM7SUFFRCxpQkFBaUI7UUFDYixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDL0IsQ0FBQztJQUVELGtCQUFrQjtRQUNkLE9BQU87WUFDSCxVQUFVLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVO1lBQzNDLGNBQWMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVE7U0FDckIsQ0FBQztJQUNqQyxDQUFDO0lBRUQsY0FBYztRQUNWLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQsZUFBZTtRQUNYLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUM7SUFDN0MsQ0FBQztJQUVELG9CQUFvQixDQUFDLElBQW9CO1FBQ3JDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDOzs7WUF2REosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSx1QkFBdUI7Z0JBQ2pDLGk4R0FBOEM7Z0JBQzlDLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLGdCQUFnQixFQUFFLG9CQUFvQixDQUFDO2FBQzVFOzs7WUFUTyxlQUFlO1lBSGYsYUFBYTtZQURiLGFBQWE7WUFLYixvQkFBb0I7WUFFcEIsZ0JBQWdCO1lBSmhCLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2NvbWJpbmVMYXRlc3QsIE9ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7Vmlld0NvbnRleHQsIFdpZGdldE1ldGFkYXRhfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtNZXRhZGF0YVN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9tZXRhZGF0YS9tZXRhZGF0YS5zdG9yZS5zZXJ2aWNlJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZSwgTGFuZ3VhZ2VTdHJpbmdzfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5pbXBvcnQge1N1YnBhbmVsQ29udGFpbmVyQ29uZmlnfSBmcm9tICcuLi8uLi8uLi8uLi9jb250YWluZXJzL3N1YnBhbmVsL2NvbXBvbmVudHMvc3VicGFuZWwtY29udGFpbmVyL3N1YnBhbmVsLWNvbnRhaW5lci5tb2RlbCc7XG5pbXBvcnQge1NpZGViYXJXaWRnZXRBZGFwdGVyfSBmcm9tICcuLi8uLi9hZGFwdGVycy9zaWRlYmFyLXdpZGdldC5hZGFwdGVyJztcbmltcG9ydCB7UmVjb3JkVmlld1N0b3JlfSBmcm9tICcuLi8uLi9zdG9yZS9yZWNvcmQtdmlldy9yZWNvcmQtdmlldy5zdG9yZSc7XG5pbXBvcnQge1JlY29yZENvbnRlbnRBZGFwdGVyfSBmcm9tICcuLi8uLi9hZGFwdGVycy9yZWNvcmQtY29udGVudC5hZGFwdGVyJztcbmltcG9ydCB7UmVjb3JkQ29udGVudERhdGFTb3VyY2V9IGZyb20gJy4uLy4uLy4uLy4uL2NvbXBvbmVudHMvcmVjb3JkLWNvbnRlbnQvcmVjb3JkLWNvbnRlbnQubW9kZWwnO1xuaW1wb3J0IHtUb3BXaWRnZXRBZGFwdGVyfSBmcm9tICcuLi8uLi9hZGFwdGVycy90b3Atd2lkZ2V0LmFkYXB0ZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tcmVjb3JkLWNvbnRhaW5lcicsXG4gICAgdGVtcGxhdGVVcmw6ICdyZWNvcmQtY29udGFpbmVyLmNvbXBvbmVudC5odG1sJyxcbiAgICBwcm92aWRlcnM6IFtSZWNvcmRDb250ZW50QWRhcHRlciwgVG9wV2lkZ2V0QWRhcHRlciwgU2lkZWJhcldpZGdldEFkYXB0ZXJdXG59KVxuZXhwb3J0IGNsYXNzIFJlY29yZENvbnRhaW5lckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgbGFuZ3VhZ2UkOiBPYnNlcnZhYmxlPExhbmd1YWdlU3RyaW5ncz4gPSB0aGlzLmxhbmd1YWdlLnZtJDtcblxuICAgIHZtJCA9IGNvbWJpbmVMYXRlc3QoW1xuICAgICAgICB0aGlzLmxhbmd1YWdlJCwgdGhpcy5zaWRlYmFyV2lkZ2V0QWRhcHRlci5jb25maWckLCB0aGlzLnRvcFdpZGdldEFkYXB0ZXIuY29uZmlnJCwgdGhpcy5yZWNvcmRWaWV3U3RvcmUuc2hvd1N1YnBhbmVscyRcbiAgICBdKS5waXBlKFxuICAgICAgICBtYXAoKFxuICAgICAgICAgICAgW2xhbmd1YWdlLCBzaWRlYmFyV2lkZ2V0Q29uZmlnLCB0b3BXaWRnZXRDb25maWcsIHNob3dTdWJwYW5lbHNdXG4gICAgICAgICkgPT4gKHtcbiAgICAgICAgICAgIGxhbmd1YWdlLFxuICAgICAgICAgICAgc2lkZWJhcldpZGdldENvbmZpZyxcbiAgICAgICAgICAgIHRvcFdpZGdldENvbmZpZyxcbiAgICAgICAgICAgIHNob3dTdWJwYW5lbHNcbiAgICAgICAgfSkpXG4gICAgKTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgcmVjb3JkVmlld1N0b3JlOiBSZWNvcmRWaWV3U3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBsYW5ndWFnZTogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIG1ldGFkYXRhOiBNZXRhZGF0YVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgY29udGVudEFkYXB0ZXI6IFJlY29yZENvbnRlbnRBZGFwdGVyLFxuICAgICAgICBwcm90ZWN0ZWQgdG9wV2lkZ2V0QWRhcHRlcjogVG9wV2lkZ2V0QWRhcHRlcixcbiAgICAgICAgcHJvdGVjdGVkIHNpZGViYXJXaWRnZXRBZGFwdGVyOiBTaWRlYmFyV2lkZ2V0QWRhcHRlclxuICAgICkge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIH1cblxuICAgIGdldENvbnRlbnRBZGFwdGVyKCk6IFJlY29yZENvbnRlbnREYXRhU291cmNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudEFkYXB0ZXI7XG4gICAgfVxuXG4gICAgZ2V0U3VicGFuZWxzQ29uZmlnKCk6IFN1YnBhbmVsQ29udGFpbmVyQ29uZmlnIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN1YnBhbmVscyQ6IHRoaXMucmVjb3JkVmlld1N0b3JlLnN1YnBhbmVscyQsXG4gICAgICAgICAgICBzaWRlYmFyQWN0aXZlJDogdGhpcy5yZWNvcmRWaWV3U3RvcmUud2lkZ2V0cyRcbiAgICAgICAgfSBhcyBTdWJwYW5lbENvbnRhaW5lckNvbmZpZztcbiAgICB9XG5cbiAgICBnZXRWaWV3Q29udGV4dCgpOiBWaWV3Q29udGV4dCB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlY29yZFZpZXdTdG9yZS5nZXRWaWV3Q29udGV4dCgpO1xuICAgIH1cblxuICAgIGdldFZpZXdDb250ZXh0JCgpOiBPYnNlcnZhYmxlPFZpZXdDb250ZXh0PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlY29yZFZpZXdTdG9yZS52aWV3Q29udGV4dCQ7XG4gICAgfVxuXG4gICAgaGFzVG9wV2lkZ2V0TWV0YWRhdGEobWV0YTogV2lkZ2V0TWV0YWRhdGEpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhKG1ldGEgJiYgbWV0YS50eXBlKTtcbiAgICB9XG59XG4iXX0=