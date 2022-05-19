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
export class VerticalBarChartComponent extends BaseChartComponent {
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
            this.results = value.singleSeries;
        }));
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    get scheme() {
        return this.dataSource.options.scheme || 'picnic';
    }
    get gradient() {
        return this.dataSource.options.gradient || false;
    }
    get xAxis() {
        return this.dataSource.options.xAxis || false;
    }
    get yAxis() {
        return !isFalse(this.dataSource.options.yAxis);
    }
    get legend() {
        return !isFalse(this.dataSource.options.legend);
    }
    get showXAxisLabel() {
        return this.dataSource.options.showXAxisLabel || false;
    }
    get showYAxisLabel() {
        return this.dataSource.options.showYAxisLabel || false;
    }
    get xAxisLabel() {
        return this.dataSource.options.xAxisLabel || '';
    }
    get yAxisLabel() {
        return this.dataSource.options.yAxisLabel || '';
    }
    get yAxisTickFormatting() {
        if (this.dataSource.options.yAxisTickFormatting) {
            return this.dataSource.tickFormatting;
        }
        return null;
    }
    formatTooltipValue(value) {
        if (!this.dataSource || !this.dataSource.tooltipFormatting) {
            return value;
        }
        return this.dataSource.tooltipFormatting(value);
    }
}
VerticalBarChartComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-vertical-bar-chart',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<scrm-chart-message-area *ngIf=\"!results || !results.length || results.length < 1\"\n                         labelKey=\"LBL_NO_DATA\"></scrm-chart-message-area>\n<ngx-charts-bar-vertical *ngIf=\"results && results.length > 0\"\n                         class=\"vertical-bar-chart\"\n                         (window:resize)=\"onResize()\"\n                         [animations]=\"false\"\n                         [results]=\"results\"\n                         [view]=\"view\"\n                         [scheme]=\"scheme\"\n                         [gradient]=\"gradient\"\n                         [xAxis]=\"xAxis\"\n                         [yAxis]=\"yAxis\"\n                         [legend]=\"legend\"\n                         [legendPosition]=\"'below'\"\n                         [showXAxisLabel]=\"showXAxisLabel\"\n                         [showYAxisLabel]=\"showYAxisLabel\"\n                         [xAxisLabel]=\"xAxisLabel\"\n                         [yAxisLabel]=\"yAxisLabel\"\n                         [yAxisTickFormatting]=\"yAxisTickFormatting\">\n    <ng-template #tooltipTemplate let-model=\"model\">\n        <div>{{model.name}}</div>\n        <div>{{ formatTooltipValue(model.value) }}</div>\n    </ng-template>\n</ngx-charts-bar-vertical>\n"
            },] }
];
VerticalBarChartComponent.ctorParameters = () => [
    { type: ElementRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVydGljYWwtYmFyLWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb21wb25lbnRzL2NoYXJ0L2NvbXBvbmVudHMvdmVydGljYWwtYmFyLWNoYXJ0L3ZlcnRpY2FsLWJhci1jaGFydC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFvQixNQUFNLGVBQWUsQ0FBQztBQUN2RSxPQUFPLEVBQUMsT0FBTyxFQUFlLE1BQU0sUUFBUSxDQUFDO0FBRTdDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBT3RFLE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxrQkFBa0I7SUFLN0QsWUFBc0IsVUFBcUI7UUFDdkMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBREEsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUZqQyxTQUFJLEdBQW1CLEVBQUUsQ0FBQztJQUlwQyxDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1NBQ2hEO1FBRUQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXJCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzFELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxJQUFJLE1BQU07UUFDTixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUM7SUFDdEQsQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQztJQUNyRCxDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ0wsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDO0lBQ2xELENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxJQUFJLE1BQU07UUFDTixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxJQUFJLGNBQWM7UUFDZCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGNBQWMsSUFBSSxLQUFLLENBQUM7SUFDM0QsQ0FBQztJQUVELElBQUksY0FBYztRQUNkLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsY0FBYyxJQUFJLEtBQUssQ0FBQztJQUMzRCxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1YsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDO0lBQ3BELENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDVixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7SUFDcEQsQ0FBQztJQUVELElBQUksbUJBQW1CO1FBQ25CLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUU7WUFDN0MsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztTQUN6QztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxLQUFVO1FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRTtZQUN4RCxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwRCxDQUFDOzs7WUE5RUosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSx5QkFBeUI7Z0JBQ25DLGltRkFBa0Q7YUFFckQ7OztZQVRrQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgT25EZXN0cm95LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtpc0ZhbHNlLCBTaW5nbGVTZXJpZXN9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0Jhc2VDaGFydENvbXBvbmVudH0gZnJvbSAnLi4vYmFzZS1jaGFydC9iYXNlLWNoYXJ0LmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS12ZXJ0aWNhbC1iYXItY2hhcnQnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi92ZXJ0aWNhbC1iYXItY2hhcnQuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogW11cbn0pXG5leHBvcnQgY2xhc3MgVmVydGljYWxCYXJDaGFydENvbXBvbmVudCBleHRlbmRzIEJhc2VDaGFydENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIHJlc3VsdHM6IFNpbmdsZVNlcmllcztcbiAgICBwcm90ZWN0ZWQgc3ViczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50UmVmOkVsZW1lbnRSZWYpIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudFJlZik7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFTb3VyY2Uub3B0aW9ucy5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5kYXRhU291cmNlLm9wdGlvbnMuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVWaWV3KCk7XG5cbiAgICAgICAgdGhpcy5zdWJzLnB1c2godGhpcy5kYXRhU291cmNlLmdldFJlc3VsdHMoKS5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXN1bHRzID0gdmFsdWUuc2luZ2xlU2VyaWVzO1xuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3Vicy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgfVxuXG4gICAgZ2V0IHNjaGVtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhU291cmNlLm9wdGlvbnMuc2NoZW1lIHx8ICdwaWNuaWMnO1xuICAgIH1cblxuICAgIGdldCBncmFkaWVudCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVNvdXJjZS5vcHRpb25zLmdyYWRpZW50IHx8IGZhbHNlO1xuICAgIH1cblxuICAgIGdldCB4QXhpcygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVNvdXJjZS5vcHRpb25zLnhBeGlzIHx8IGZhbHNlO1xuICAgIH1cblxuICAgIGdldCB5QXhpcygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICFpc0ZhbHNlKHRoaXMuZGF0YVNvdXJjZS5vcHRpb25zLnlBeGlzKTtcbiAgICB9XG5cbiAgICBnZXQgbGVnZW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIWlzRmFsc2UodGhpcy5kYXRhU291cmNlLm9wdGlvbnMubGVnZW5kKTtcbiAgICB9XG5cbiAgICBnZXQgc2hvd1hBeGlzTGFiZWwoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2Uub3B0aW9ucy5zaG93WEF4aXNMYWJlbCB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXQgc2hvd1lBeGlzTGFiZWwoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2Uub3B0aW9ucy5zaG93WUF4aXNMYWJlbCB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXQgeEF4aXNMYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhU291cmNlLm9wdGlvbnMueEF4aXNMYWJlbCB8fCAnJztcbiAgICB9XG5cbiAgICBnZXQgeUF4aXNMYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhU291cmNlLm9wdGlvbnMueUF4aXNMYWJlbCB8fCAnJztcbiAgICB9XG5cbiAgICBnZXQgeUF4aXNUaWNrRm9ybWF0dGluZygpOiBGdW5jdGlvbiB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFTb3VyY2Uub3B0aW9ucy55QXhpc1RpY2tGb3JtYXR0aW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhU291cmNlLnRpY2tGb3JtYXR0aW5nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZvcm1hdFRvb2x0aXBWYWx1ZSh2YWx1ZTogYW55KTogYW55IHtcbiAgICAgICAgaWYgKCF0aGlzLmRhdGFTb3VyY2UgfHwgIXRoaXMuZGF0YVNvdXJjZS50b29sdGlwRm9ybWF0dGluZykge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2UudG9vbHRpcEZvcm1hdHRpbmcodmFsdWUpO1xuICAgIH1cbn1cbiJdfQ==