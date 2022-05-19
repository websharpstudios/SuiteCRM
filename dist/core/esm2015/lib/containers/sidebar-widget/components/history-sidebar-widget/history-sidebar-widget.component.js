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
import { Component, ViewChild } from '@angular/core';
import { HistoryTimelineAdapter } from './history-timeline.adapter.service';
import { BaseWidgetComponent } from '../../../widgets/base-widget.model';
import { LanguageStore } from '../../../../store/language/language.store';
import { HistoryTimelineAdapterFactory } from './history-timeline.adapter.factory';
import { combineLatest, Subscription, timer } from 'rxjs';
import { debounce, map } from 'rxjs/operators';
import { floor } from 'lodash-es';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
export class HistorySidebarWidgetComponent extends BaseWidgetComponent {
    constructor(historyTimelineAdapterFactory, languageStore) {
        super();
        this.historyTimelineAdapterFactory = historyTimelineAdapterFactory;
        this.languageStore = languageStore;
        this.subscription = new Subscription();
    }
    ngOnInit() {
        this.adapter = this.historyTimelineAdapterFactory.create();
        this.adapter.init(this.context);
    }
    ngAfterViewInit() {
        // watch out for the data list updates on the related subpanels activities and history
        // reload request will be ignored;
        // if they are notified multiple times within the dueTime/delay 500 ms
        const reloadMap = [];
        reloadMap.push(this.config.reload$);
        reloadMap.push(this.config.subpanelReload$);
        const subpanelsToWatch = ['history', 'activities'];
        const reload$ = combineLatest(reloadMap).pipe(map(([reload, subpanelReload]) => {
            if (reload) {
                return reload;
            }
            if (!subpanelReload) {
                return false;
            }
            return subpanelsToWatch.some(subpanelKey => !!subpanelReload[subpanelKey]);
        }));
        const debouncedReload = reload$.pipe(debounce(() => timer(1000)));
        this.subscription.add(debouncedReload.subscribe(reload => {
            if (reload) {
                this.adapter.fetchTimelineEntries(true);
            }
        }));
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    /**
     * @returns {string} Timeline Entry
     * @description {fetch language label for the timeline widget header}
     */
    getHeaderLabel() {
        return this.languageStore.getFieldLabel('LBL_QUICK_HISTORY');
    }
    /**
     * @returns {void} Timeline Entry
     * @description {checks if end of the scroll is reached to make a backend call for next set of timeline entries}
     */
    onScroll() {
        if (!this.adapter) {
            return;
        }
        const scrollOffset = this.virtualScroll.measureScrollOffset('bottom');
        if (floor(scrollOffset) === 0) {
            this.adapter.fetchTimelineEntries(false);
        }
    }
}
HistorySidebarWidgetComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-history-timeline-widget',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<scrm-widget-panel [title]=\"getHeaderLabel()\">\n    <div widget-body *ngIf=\"(adapter?.dataStream$| async) as vm\">\n\n        <div class=\"widget-background history-timeline p-2 pt-2\">\n\n            <div *ngIf=\"adapter?.loading\" class=\"d-flex record-thread-loading justify-content-center\">\n                <scrm-loading-spinner [overlay]=\"true\"></scrm-loading-spinner>\n            </div>\n\n            <cdk-virtual-scroll-viewport itemSize=\"100\"\n                                         class=\"history-timeline-viewport\"\n                                         [ngClass]=\"[vm.length <= 0 ? 'history-timeline-viewport-no-data' : 'history-timeline-viewport']\"\n                                         (scroll)=\"onScroll()\">\n\n                <scrm-chart-message-area *ngIf=\"!adapter?.loading && vm.length <= 0\"\n                                         labelKey=\"LBL_NO_DATA\"></scrm-chart-message-area>\n\n                <div *ngFor=\"let entry of vm;\">\n                    <div *ngIf=\"vm.length > 0\"\n                         class=\"d-flex flex-row m-2 history-timeline-entry entry-{{entry.color}}\">\n                        <div class=\"\">\n                            <div class=\"circle\">\n                                <div\n                                    class=\"d-flex justify-content-center align-items-center h-100 history-timeline-image\">\n                                    <scrm-image [image]=\"entry.icon\"></scrm-image>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"\">\n                            <div class=\"d-flex justify-content-center h-100\">\n                                <div class=\"connector mt-3\">\n                                </div>\n                            </div>\n\n                        </div>\n                        <div class=\"flex-grow-1\">\n\n                            <div class=\"card\">\n                                <div class=\"card-body p-1 pr-2 pl-2\">\n                                    <p class=\"card-title text-break history-timeline-entry-title\">\n                                        <scrm-field [type]=\"entry.title.type\"\n                                                    mode=\"list\"\n                                                    [field]=\"entry.title\"\n                                                    [record]=\"entry.record\">\n                                        </scrm-field>\n                                    </p>\n                                    <div *ngIf=\"entry.description\"\n                                         class=\"card-text history-timeline-entry-description\">\n                                        <small class=\"text-break\">\n                                            <scrm-field [type]=\"entry.description.type\"\n                                                        mode=\"detail\"\n                                                        [field]=\"entry.description\"\n                                                        [record]=\"entry.record\">\n                                            </scrm-field>\n                                        </small>\n                                    </div>\n                                    <div class=\"card-text history-timeline-entry-user text-uppercase\">\n                                        <small class=\"text-break\">\n                                            <scrm-field [type]=\"entry.user.type\"\n                                                        mode=\"list\"\n                                                        [field]=\"entry.user\"\n                                                        [record]=\"entry.record\">\n                                            </scrm-field>\n                                        </small>\n                                    </div>\n                                    <div class=\"card-text text-break history-timeline-entry-date\">\n                                        <small class=\"font-italic\">\n                                            <scrm-field [type]=\"entry.date.type\"\n                                                        mode=\"list\"\n                                                        [field]=\"entry.date\"\n                                                        [record]=\"entry.record\"></scrm-field>\n                                        </small>\n                                    </div>\n                                </div>\n                            </div>\n\n                        </div>\n                    </div>\n\n                </div>\n            </cdk-virtual-scroll-viewport>\n        </div>\n    </div>\n</scrm-widget-panel>\n",
                providers: [HistoryTimelineAdapter]
            },] }
];
HistorySidebarWidgetComponent.ctorParameters = () => [
    { type: HistoryTimelineAdapterFactory },
    { type: LanguageStore }
];
HistorySidebarWidgetComponent.propDecorators = {
    virtualScroll: [{ type: ViewChild, args: [CdkVirtualScrollViewport,] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlzdG9yeS1zaWRlYmFyLXdpZGdldC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29udGFpbmVycy9zaWRlYmFyLXdpZGdldC9jb21wb25lbnRzL2hpc3Rvcnktc2lkZWJhci13aWRnZXQvaGlzdG9yeS1zaWRlYmFyLXdpZGdldC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBZ0IsU0FBUyxFQUFxQixTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckYsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDMUUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDdkUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBQ3hFLE9BQU8sRUFBQyw2QkFBNkIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ2pGLE9BQU8sRUFBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN4RCxPQUFPLEVBQUMsUUFBUSxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDaEMsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFRaEUsTUFBTSxPQUFPLDZCQUE4QixTQUFRLG1CQUFtQjtJQU1sRSxZQUNjLDZCQUE0RCxFQUM1RCxhQUE0QjtRQUN0QyxLQUFLLEVBQUUsQ0FBQztRQUZFLGtDQUE2QixHQUE3Qiw2QkFBNkIsQ0FBK0I7UUFDNUQsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFKbEMsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBTTFDLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsNkJBQTZCLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDM0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxlQUFlO1FBRVgsc0ZBQXNGO1FBQ3RGLGtDQUFrQztRQUNsQyxzRUFBc0U7UUFFdEUsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFNUMsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUVuRCxNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUN6QyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsRUFBRSxFQUFFO1lBQzdCLElBQUksTUFBTSxFQUFFO2dCQUNSLE9BQU8sTUFBTSxDQUFDO2FBQ2pCO1lBRUQsSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDakIsT0FBTyxLQUFLLENBQUM7YUFDaEI7WUFFRCxPQUFPLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUMvRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVIsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVsRSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3JELElBQUksTUFBTSxFQUFFO2dCQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDM0M7UUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxjQUFjO1FBQ1YsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7O09BR0c7SUFDSCxRQUFRO1FBRUosSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZixPQUFPO1NBQ1Y7UUFFRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRFLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzVDO0lBQ0wsQ0FBQzs7O1lBcEZKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsOEJBQThCO2dCQUN4Qyw2aU1BQXNEO2dCQUV0RCxTQUFTLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQzthQUN0Qzs7O1lBWE8sNkJBQTZCO1lBRDdCLGFBQWE7Ozs0QkFjaEIsU0FBUyxTQUFDLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIE9uRGVzdHJveSwgT25Jbml0LCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIaXN0b3J5VGltZWxpbmVBZGFwdGVyfSBmcm9tICcuL2hpc3RvcnktdGltZWxpbmUuYWRhcHRlci5zZXJ2aWNlJztcbmltcG9ydCB7QmFzZVdpZGdldENvbXBvbmVudH0gZnJvbSAnLi4vLi4vLi4vd2lkZ2V0cy9iYXNlLXdpZGdldC5tb2RlbCc7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmV9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL2xhbmd1YWdlL2xhbmd1YWdlLnN0b3JlJztcbmltcG9ydCB7SGlzdG9yeVRpbWVsaW5lQWRhcHRlckZhY3Rvcnl9IGZyb20gJy4vaGlzdG9yeS10aW1lbGluZS5hZGFwdGVyLmZhY3RvcnknO1xuaW1wb3J0IHtjb21iaW5lTGF0ZXN0LCBTdWJzY3JpcHRpb24sIHRpbWVyfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZGVib3VuY2UsIG1hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtmbG9vcn0gZnJvbSAnbG9kYXNoLWVzJztcbmltcG9ydCB7Q2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0fSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLWhpc3RvcnktdGltZWxpbmUtd2lkZ2V0JyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vaGlzdG9yeS1zaWRlYmFyLXdpZGdldC5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbXSxcbiAgICBwcm92aWRlcnM6IFtIaXN0b3J5VGltZWxpbmVBZGFwdGVyXVxufSlcbmV4cG9ydCBjbGFzcyBIaXN0b3J5U2lkZWJhcldpZGdldENvbXBvbmVudCBleHRlbmRzIEJhc2VXaWRnZXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgQFZpZXdDaGlsZChDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQpIHZpcnR1YWxTY3JvbGw6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydDtcblxuICAgIHB1YmxpYyBhZGFwdGVyOiBIaXN0b3J5VGltZWxpbmVBZGFwdGVyO1xuICAgIHByaXZhdGUgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBoaXN0b3J5VGltZWxpbmVBZGFwdGVyRmFjdG9yeTogSGlzdG9yeVRpbWVsaW5lQWRhcHRlckZhY3RvcnksXG4gICAgICAgIHByb3RlY3RlZCBsYW5ndWFnZVN0b3JlOiBMYW5ndWFnZVN0b3JlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWRhcHRlciA9IHRoaXMuaGlzdG9yeVRpbWVsaW5lQWRhcHRlckZhY3RvcnkuY3JlYXRlKCk7XG4gICAgICAgIHRoaXMuYWRhcHRlci5pbml0KHRoaXMuY29udGV4dCk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuXG4gICAgICAgIC8vIHdhdGNoIG91dCBmb3IgdGhlIGRhdGEgbGlzdCB1cGRhdGVzIG9uIHRoZSByZWxhdGVkIHN1YnBhbmVscyBhY3Rpdml0aWVzIGFuZCBoaXN0b3J5XG4gICAgICAgIC8vIHJlbG9hZCByZXF1ZXN0IHdpbGwgYmUgaWdub3JlZDtcbiAgICAgICAgLy8gaWYgdGhleSBhcmUgbm90aWZpZWQgbXVsdGlwbGUgdGltZXMgd2l0aGluIHRoZSBkdWVUaW1lL2RlbGF5IDUwMCBtc1xuXG4gICAgICAgIGNvbnN0IHJlbG9hZE1hcCA9IFtdO1xuICAgICAgICByZWxvYWRNYXAucHVzaCh0aGlzLmNvbmZpZy5yZWxvYWQkKTtcbiAgICAgICAgcmVsb2FkTWFwLnB1c2godGhpcy5jb25maWcuc3VicGFuZWxSZWxvYWQkKTtcblxuICAgICAgICBjb25zdCBzdWJwYW5lbHNUb1dhdGNoID0gWydoaXN0b3J5JywgJ2FjdGl2aXRpZXMnXTtcblxuICAgICAgICBjb25zdCByZWxvYWQkID0gY29tYmluZUxhdGVzdChyZWxvYWRNYXApLnBpcGUoXG4gICAgICAgICAgICBtYXAoKFtyZWxvYWQsIHN1YnBhbmVsUmVsb2FkXSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZWxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlbG9hZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIXN1YnBhbmVsUmVsb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc3VicGFuZWxzVG9XYXRjaC5zb21lKHN1YnBhbmVsS2V5ID0+ICEhc3VicGFuZWxSZWxvYWRbc3VicGFuZWxLZXldKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICBjb25zdCBkZWJvdW5jZWRSZWxvYWQgPSByZWxvYWQkLnBpcGUoZGVib3VuY2UoKCkgPT4gdGltZXIoMTAwMCkpKTtcblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi5hZGQoZGVib3VuY2VkUmVsb2FkLnN1YnNjcmliZShyZWxvYWQgPT4ge1xuICAgICAgICAgICAgaWYgKHJlbG9hZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRhcHRlci5mZXRjaFRpbWVsaW5lRW50cmllcyh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRpbWVsaW5lIEVudHJ5XG4gICAgICogQGRlc2NyaXB0aW9uIHtmZXRjaCBsYW5ndWFnZSBsYWJlbCBmb3IgdGhlIHRpbWVsaW5lIHdpZGdldCBoZWFkZXJ9XG4gICAgICovXG4gICAgZ2V0SGVhZGVyTGFiZWwoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGFuZ3VhZ2VTdG9yZS5nZXRGaWVsZExhYmVsKCdMQkxfUVVJQ0tfSElTVE9SWScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHt2b2lkfSBUaW1lbGluZSBFbnRyeVxuICAgICAqIEBkZXNjcmlwdGlvbiB7Y2hlY2tzIGlmIGVuZCBvZiB0aGUgc2Nyb2xsIGlzIHJlYWNoZWQgdG8gbWFrZSBhIGJhY2tlbmQgY2FsbCBmb3IgbmV4dCBzZXQgb2YgdGltZWxpbmUgZW50cmllc31cbiAgICAgKi9cbiAgICBvblNjcm9sbCgpOiB2b2lkIHtcblxuICAgICAgICBpZiAoIXRoaXMuYWRhcHRlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2Nyb2xsT2Zmc2V0ID0gdGhpcy52aXJ0dWFsU2Nyb2xsLm1lYXN1cmVTY3JvbGxPZmZzZXQoJ2JvdHRvbScpO1xuXG4gICAgICAgIGlmIChmbG9vcihzY3JvbGxPZmZzZXQpID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmFkYXB0ZXIuZmV0Y2hUaW1lbGluZUVudHJpZXMoZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=