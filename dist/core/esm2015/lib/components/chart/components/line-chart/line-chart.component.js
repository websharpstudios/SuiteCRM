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
import { Component, ElementRef } from '@angular/core';
import { isFalse } from 'common';
import { BaseChartComponent } from '../base-chart/base-chart.component';
export class LineChartComponent extends BaseChartComponent {
    constructor(elementRef) {
        super(elementRef);
        this.elementRef = elementRef;
        this.subs = [];
    }
    ngOnInit() {
        if (this.dataSource.options.height) {
            this.height = this.dataSource.options.height;
        }
        this.calculateView();
        this.subs.push(this.dataSource.getResults().subscribe(value => {
            this.results = value.multiSeries;
        }));
        this.scheme = this.getScheme();
        this.gradient = this.getGradient();
        this.xAxis = this.getXAxis();
        this.yAxis = this.getYAxis();
        this.legend = this.getLegend();
        this.xScaleMin = this.getXScaleMin();
        this.xScaleMax = this.getXScaleMax();
        this.xAxisTicks = this.getXAxisTicks();
        this.showXAxisLabel = this.getShowXAxisLabel();
        this.showYAxisLabel = this.getShowYAxisLabel();
        this.xAxisLabel = this.getXAxisLabel();
        this.yAxisLabel = this.getYAxisLabel();
        this.yAxisTickFormatting = this.getYAxisTickFormatting();
        this.xAxisTickFormatting = this.getXAxisTickFormatting();
        this.tooltipDisabled = this.getTooltipDisabled();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    getScheme() {
        return this.dataSource.options.scheme || 'picnic';
    }
    getGradient() {
        return this.dataSource.options.gradient || false;
    }
    getXAxis() {
        return !isFalse(this.dataSource.options.xAxis);
    }
    getYAxis() {
        return !isFalse(this.dataSource.options.yAxis);
    }
    getLegend() {
        return !isFalse(this.dataSource.options.legend);
    }
    getXScaleMin() {
        return this.dataSource.options.xScaleMin || null;
    }
    getXScaleMax() {
        return this.dataSource.options.xScaleMax || null;
    }
    getXAxisTicks() {
        return this.dataSource.options.xAxisTicks || null;
    }
    getShowXAxisLabel() {
        return !isFalse(this.dataSource.options.showXAxisLabel);
    }
    getShowYAxisLabel() {
        return this.dataSource.options.showYAxisLabel || false;
    }
    getXAxisLabel() {
        return this.dataSource.options.xAxisLabel || '';
    }
    getYAxisLabel() {
        return this.dataSource.options.yAxisLabel || '';
    }
    getYAxisTickFormatting() {
        if (!this.dataSource.options.yAxisTickFormatting) {
            return null;
        }
        return this.dataSource.tickFormatting || null;
    }
    getXAxisTickFormatting() {
        if (!this.dataSource.options.xAxisTickFormatting) {
            return null;
        }
        return this.dataSource.tickFormatting || null;
    }
    getTooltipDisabled() {
        return this.dataSource.options.tooltipDisabled || false;
    }
}
LineChartComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-line-chart',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<scrm-chart-message-area *ngIf=\"!results || !results.length || results.length < 1\"\n                         labelKey=\"LBL_NO_DATA\"></scrm-chart-message-area>\n<ngx-charts-line-chart *ngIf=\"results && results.length > 0\"\n                       class=\"line-chart\"\n                       (window:resize)=\"onResize()\"\n                       [animations]=\"false\"\n                       [results]=\"results\"\n                       [view]=\"view\"\n                       [scheme]=\"scheme\"\n                       [gradient]=\"gradient\"\n                       [xAxis]=\"xAxis\"\n                       [yAxis]=\"yAxis\"\n                       [legend]=\"legend\"\n                       [xScaleMin]=\"xScaleMin\"\n                       [xScaleMax]=\"xScaleMax\"\n                       [xAxisTicks]=\"xAxisTicks\"\n                       [showXAxisLabel]=\"showXAxisLabel\"\n                       [showYAxisLabel]=\"showYAxisLabel\"\n                       [xAxisLabel]=\"xAxisLabel\"\n                       [legendPosition]=\"'below'\"\n                       [autoScale]=\"true\"\n                       [yAxisTickFormatting]=\"yAxisTickFormatting\"\n                       [xAxisTickFormatting]=\"xAxisTickFormatting\"\n                       [tooltipDisabled]=\"tooltipDisabled\"\n                       [yAxisLabel]=\"yAxisLabel\">\n</ngx-charts-line-chart>\n"
            },] }
];
LineChartComponent.ctorParameters = () => [
    { type: ElementRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS1jaGFydC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29tcG9uZW50cy9jaGFydC9jb21wb25lbnRzL2xpbmUtY2hhcnQvbGluZS1jaGFydC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQXFCLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2RSxPQUFPLEVBQUMsT0FBTyxFQUFjLE1BQU0sUUFBUSxDQUFDO0FBRTVDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBT3RFLE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxrQkFBa0I7SUFxQnRELFlBQXNCLFVBQXFCO1FBQ3ZDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQURBLGVBQVUsR0FBVixVQUFVLENBQVc7UUFGakMsU0FBSSxHQUFtQixFQUFFLENBQUM7SUFJcEMsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztTQUNoRDtRQUVELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUVyQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMxRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVKLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFB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VCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7SUFDcEQsQ0FBQztJQUVELHNCQUFzQjtRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUU7WUFDOUMsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDO0lBQ2xELENBQUM7SUFFRCxzQkFBc0I7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFO1lBQzlDLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQztJQUNsRCxDQUFDO0lBRUQsa0JBQWtCO1FBQ2QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxlQUFlLElBQUksS0FBSyxDQUFDO0lBQzVELENBQUM7OztZQTlISixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IscXRGQUEwQzthQUU3Qzs7O1lBVHFDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBPbkRlc3Ryb3ksIE9uSW5pdCwgRWxlbWVudFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzRmFsc2UsIE11bHRpU2VyaWVzfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtCYXNlQ2hhcnRDb21wb25lbnR9IGZyb20gJy4uL2Jhc2UtY2hhcnQvYmFzZS1jaGFydC5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tbGluZS1jaGFydCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2xpbmUtY2hhcnQuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogW11cbn0pXG5leHBvcnQgY2xhc3MgTGluZUNoYXJ0Q29tcG9uZW50IGV4dGVuZHMgQmFzZUNoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgcmVzdWx0czogTXVsdGlTZXJpZXM7XG4gICAgc2NoZW1lOiBzdHJpbmc7XG4gICAgZ3JhZGllbnQ6IGJvb2xlYW47XG4gICAgeEF4aXM6IGJvb2xlYW47XG4gICAgeUF4aXM6IGJvb2xlYW47XG4gICAgbGVnZW5kOiBib29sZWFuO1xuICAgIHhTY2FsZU1pbjogbnVtYmVyIHwgc3RyaW5nO1xuICAgIHhTY2FsZU1heDogbnVtYmVyIHwgc3RyaW5nO1xuICAgIHhBeGlzVGlja3M6IGFueTtcbiAgICBzaG93WEF4aXNMYWJlbDogYm9vbGVhbjtcbiAgICBzaG93WUF4aXNMYWJlbDogYm9vbGVhbjtcbiAgICB4QXhpc0xhYmVsOiBzdHJpbmc7XG4gICAgeUF4aXNMYWJlbDogc3RyaW5nO1xuICAgIHlBeGlzVGlja0Zvcm1hdHRpbmc6IEZ1bmN0aW9uO1xuICAgIHhBeGlzVGlja0Zvcm1hdHRpbmc6IEZ1bmN0aW9uO1xuICAgIHRvb2x0aXBEaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIHByb3RlY3RlZCBzdWJzOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGVsZW1lbnRSZWY6RWxlbWVudFJlZikge1xuICAgICAgICBzdXBlcihlbGVtZW50UmVmKTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVNvdXJjZS5vcHRpb25zLmhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmRhdGFTb3VyY2Uub3B0aW9ucy5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVZpZXcoKTtcblxuICAgICAgICB0aGlzLnN1YnMucHVzaCh0aGlzLmRhdGFTb3VyY2UuZ2V0UmVzdWx0cygpLnN1YnNjcmliZSh2YWx1ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc3VsdHMgPSB2YWx1ZS5tdWx0aVNlcmllcztcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHRoaXMuc2NoZW1lID0gdGhpcy5nZXRTY2hlbWUoKTtcbiAgICAgICAgdGhpcy5ncmFkaWVudCA9IHRoaXMuZ2V0R3JhZGllbnQoKTtcbiAgICAgICAgdGhpcy54QXhpcyA9IHRoaXMuZ2V0WEF4aXMoKTtcbiAgICAgICAgdGhpcy55QXhpcyA9IHRoaXMuZ2V0WUF4aXMoKTtcbiAgICAgICAgdGhpcy5sZWdlbmQgPSB0aGlzLmdldExlZ2VuZCgpO1xuICAgICAgICB0aGlzLnhTY2FsZU1pbiA9IHRoaXMuZ2V0WFNjYWxlTWluKCk7XG4gICAgICAgIHRoaXMueFNjYWxlTWF4ID0gdGhpcy5nZXRYU2NhbGVNYXgoKTtcbiAgICAgICAgdGhpcy54QXhpc1RpY2tzID0gdGhpcy5nZXRYQXhpc1RpY2tzKCk7XG4gICAgICAgIHRoaXMuc2hvd1hBeGlzTGFiZWwgPSB0aGlzLmdldFNob3dYQXhpc0xhYmVsKCk7XG4gICAgICAgIHRoaXMuc2hvd1lBeGlzTGFiZWwgPSB0aGlzLmdldFNob3dZQXhpc0xhYmVsKCk7XG4gICAgICAgIHRoaXMueEF4aXNMYWJlbCA9IHRoaXMuZ2V0WEF4aXNMYWJlbCgpO1xuICAgICAgICB0aGlzLnlBeGlzTGFiZWwgPSB0aGlzLmdldFlBeGlzTGFiZWwoKTtcbiAgICAgICAgdGhpcy55QXhpc1RpY2tGb3JtYXR0aW5nID0gdGhpcy5nZXRZQXhpc1RpY2tGb3JtYXR0aW5nKCk7XG4gICAgICAgIHRoaXMueEF4aXNUaWNrRm9ybWF0dGluZyA9IHRoaXMuZ2V0WEF4aXNUaWNrRm9ybWF0dGluZygpO1xuICAgICAgICB0aGlzLnRvb2x0aXBEaXNhYmxlZCA9IHRoaXMuZ2V0VG9vbHRpcERpc2FibGVkKCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3Vicy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgfVxuXG4gICAgZ2V0U2NoZW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2Uub3B0aW9ucy5zY2hlbWUgfHwgJ3BpY25pYyc7XG4gICAgfVxuXG4gICAgZ2V0R3JhZGllbnQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2Uub3B0aW9ucy5ncmFkaWVudCB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRYQXhpcygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICFpc0ZhbHNlKHRoaXMuZGF0YVNvdXJjZS5vcHRpb25zLnhBeGlzKTtcbiAgICB9XG5cbiAgICBnZXRZQXhpcygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICFpc0ZhbHNlKHRoaXMuZGF0YVNvdXJjZS5vcHRpb25zLnlBeGlzKTtcbiAgICB9XG5cbiAgICBnZXRMZWdlbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhaXNGYWxzZSh0aGlzLmRhdGFTb3VyY2Uub3B0aW9ucy5sZWdlbmQpO1xuICAgIH1cblxuICAgIGdldFhTY2FsZU1pbigpOiBudW1iZXIgfCBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhU291cmNlLm9wdGlvbnMueFNjYWxlTWluIHx8IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0WFNjYWxlTWF4KCk6IG51bWJlciB8IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2Uub3B0aW9ucy54U2NhbGVNYXggfHwgbnVsbDtcbiAgICB9XG5cbiAgICBnZXRYQXhpc1RpY2tzKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2Uub3B0aW9ucy54QXhpc1RpY2tzIHx8IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0U2hvd1hBeGlzTGFiZWwoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhaXNGYWxzZSh0aGlzLmRhdGFTb3VyY2Uub3B0aW9ucy5zaG93WEF4aXNMYWJlbCk7XG4gICAgfVxuXG4gICAgZ2V0U2hvd1lBeGlzTGFiZWwoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2Uub3B0aW9ucy5zaG93WUF4aXNMYWJlbCB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRYQXhpc0xhYmVsKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2Uub3B0aW9ucy54QXhpc0xhYmVsIHx8ICcnO1xuICAgIH1cblxuICAgIGdldFlBeGlzTGFiZWwoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVNvdXJjZS5vcHRpb25zLnlBeGlzTGFiZWwgfHwgJyc7XG4gICAgfVxuXG4gICAgZ2V0WUF4aXNUaWNrRm9ybWF0dGluZygpOiBGdW5jdGlvbiB7XG4gICAgICAgIGlmICghdGhpcy5kYXRhU291cmNlLm9wdGlvbnMueUF4aXNUaWNrRm9ybWF0dGluZykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVNvdXJjZS50aWNrRm9ybWF0dGluZyB8fCBudWxsO1xuICAgIH1cblxuICAgIGdldFhBeGlzVGlja0Zvcm1hdHRpbmcoKTogRnVuY3Rpb24ge1xuICAgICAgICBpZiAoIXRoaXMuZGF0YVNvdXJjZS5vcHRpb25zLnhBeGlzVGlja0Zvcm1hdHRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2UudGlja0Zvcm1hdHRpbmcgfHwgbnVsbDtcbiAgICB9XG5cbiAgICBnZXRUb29sdGlwRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2Uub3B0aW9ucy50b29sdGlwRGlzYWJsZWQgfHwgZmFsc2U7XG4gICAgfVxufVxuIl19