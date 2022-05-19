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
import { map, take, tap } from 'rxjs/operators';
import { ChartDataStoreFactory } from '../../../../store/chart-data/chart-data.store.factory';
import { BaseWidgetComponent } from '../../../widgets/base-widget.model';
import { LanguageStore } from '../../../../store/language/language.store';
export class ChartSidebarWidgetComponent extends BaseWidgetComponent {
    constructor(language, factory) {
        super();
        this.language = language;
        this.factory = factory;
        this.charts = {};
        this.titleLabelKey = 'LBL_INSIGHTS';
        this.title = '';
        this.messageLabelKey = 'LBL_CHART_NOT_FOUND';
        this.selectedChart = '';
        this.chartType = '';
        this.loading = true;
        this.subs = [];
    }
    ngOnInit() {
        this.appStrings$ = this.language.appStrings$;
        if (this.validateConfig() === false) {
            return;
        }
        if (this.context$) {
            this.subs.push(this.context$.subscribe((context) => {
                this.context = context;
                Object.keys(this.charts).forEach(key => {
                    const chart = this.charts[key];
                    chart.store.context = context;
                });
            }));
        }
        const options = this.config.options;
        const charts = options.charts;
        if (options.defaultChart) {
            this.selectedChart = options.defaultChart || '';
        }
        this.setupCharts(charts);
        this.setHeaderTitle(options);
        this.reloadSelectedChart();
        this.setupLoading();
        this.setupVM();
        this.setupReload();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    get configuredCharts() {
        return this.chartOptions.charts || [];
    }
    get chartOptions() {
        return this.config.options || {};
    }
    isConfigured() {
        return !!(this.config.options.charts && this.config.options.charts.length);
    }
    getLabelKey(stat) {
        const labelKey = stat.statistic.metadata && stat.statistic.metadata.labelKey;
        if (labelKey) {
            return labelKey;
        }
        return this.charts[stat.query.key].labelKey;
    }
    getKey(chart) {
        return chart.chartKey || chart.statisticsType || '';
    }
    validateConfig() {
        if (!this.context || !this.context.module) {
            this.messageLabelKey = 'LBL_BAD_CONFIG_BAD_CONTEXT';
            return false;
        }
        if (!this.config) {
            this.messageLabelKey = 'LBL_BAD_CONFIG_NO_CONFIG';
            return false;
        }
        const options = this.config.options;
        if (!options || !options.charts || !options.charts.length) {
            this.messageLabelKey = 'LBL_BAD_CONFIG_NO_STATISTICS_KEY';
            return false;
        }
        return true;
    }
    setupCharts(charts) {
        this.selectedChart = '';
        charts.forEach((chart) => {
            const key = this.getKey(chart);
            if (!key) {
                return;
            }
            if (!this.selectedChart) {
                this.selectedChart = key || '';
                this.chartType = chart.chartType;
            }
            this.buildChartInfo(key, chart);
            this.initChartStore(key, chart);
        });
    }
    buildChartInfo(key, chart) {
        this.charts[key] = {
            key,
            labelKey: chart.labelKey || '',
            chartType: chart.chartType,
            statisticsType: chart.statisticsType,
            store: this.factory.create(),
            reload: true
        };
    }
    initChartStore(key, chart) {
        this.charts[key].store.init(this.context.module, {
            key: chart.statisticsType,
            context: Object.assign({}, this.context)
        }, false);
        this.charts[key].store.setDefaultOptions(chart.chartOptions);
    }
    setHeaderTitle(options) {
        if (this.config.labelKey) {
            this.titleLabelKey = this.config.labelKey;
        }
        if (options.headerTitle) {
            if (!this.charts || !this.charts[this.selectedChart] || !this.charts[this.selectedChart].labelKey) {
                return;
            }
            this.titleLabelKey = this.charts[this.selectedChart].labelKey;
        }
        this.title = this.language.getFieldLabel(this.titleLabelKey);
    }
    onChartSelect() {
        this.dataSource = null;
        this.chartType = this.charts[this.selectedChart].chartType;
        this.reloadSelectedChart(false);
    }
    setupVM() {
        const statistics$ = [];
        Object.keys(this.charts).forEach(key => statistics$.push(this.charts[key].store.state$));
        this.vm$ = combineLatest([combineLatest(statistics$), this.language.appStrings$]).pipe(map(([statistics, appStrings]) => {
            const statsMap = this.mapChartData(statistics);
            return {
                statistics: statsMap,
                appStrings
            };
        }));
    }
    mapChartData(statistics) {
        const statsMap = {};
        statistics.forEach((statistic) => {
            if (!statistic.query.key) {
                return;
            }
            statsMap[statistic.query.key] = statistic;
            this.charts[statistic.query.key].labelKey = this.getLabelKey(statistic);
        });
        return statsMap;
    }
    setupReload() {
        if (!this.config.reload$) {
            return;
        }
        this.subs.push(this.config.reload$.subscribe(() => {
            if (this.loading === true) {
                return;
            }
            this.loading = true;
            Object.keys(this.charts).forEach(chartKey => {
                this.charts[chartKey].reload = true;
            });
            this.reloadSelectedChart();
        }));
    }
    setupLoading() {
        const loadings$ = [];
        Object.keys(this.charts).forEach(key => loadings$.push(this.charts[key].store.loading$));
        this.loading$ = combineLatest(loadings$).pipe(map((loadings) => {
            if (!loadings || loadings.length < 1) {
                this.loading = false;
                return false;
            }
            let loading = false;
            loadings.forEach(value => {
                loading = loading || value;
            });
            this.loading = loading;
            return loading;
        }));
        this.subs.push(this.loading$.subscribe());
    }
    reloadSelectedChart(useCache = false) {
        if (!this.charts || !this.charts[this.selectedChart] || !this.charts[this.selectedChart].store) {
            return;
        }
        useCache = useCache && !this.charts[this.selectedChart].reload;
        this.charts[this.selectedChart].store.load(useCache).pipe(take(1), tap(() => {
            var _a, _b, _c;
            this.dataSource = (_c = (_b = (_a = this.charts[this.selectedChart]) === null || _a === void 0 ? void 0 : _a.store) === null || _b === void 0 ? void 0 : _b.getDataSource()) !== null && _c !== void 0 ? _c : null;
            this.charts[this.selectedChart].reload = false;
        })).subscribe();
    }
}
ChartSidebarWidgetComponent.decorators = [
    { type: Component, args: [{
                selector: 'chart-sidebar-widget',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<scrm-widget-panel [title]=\"this.title\" *ngIf=\"(vm$ | async) as vm\">\n    <div widget-body>\n        <div class=\"widget-background chart-sidebar-widget\">\n            <div class=\"mb-2 ml-1 mr-1\">\n                <div class=\"container-fluid\">\n                    <div class=\"row\" *ngIf=\"isConfigured && chartOptions.toggle\">\n                        <div class=\"col pr-2 pl-2\">\n                            <form class=\"login-form mb-0 mt-2 w-100\">\n\n                                <select (ngModelChange)=\"onChartSelect()\" [(ngModel)]=\"selectedChart\" class=\"m-0 w-100\"\n                                        name=\"chart\">\n                                    <option *ngFor=\"let chart of configuredCharts; index as i\"\n                                            [value]=\"getKey(chart)\">\n                                        {{language.getFieldLabel(chart.labelKey)}}\n                                    </option>\n                                </select>\n                            </form>\n                        </div>\n                    </div>\n\n                    <div class=\"row mt-3 chart-widget\">\n                        <div class=\"col pl-0 pr-0 pb-1 pt-1 d-flex justify-content-center\">\n                            <div class=\"flex-grow-1\">\n                                <ng-container *ngIf=\"selectedChart && !loading\">\n                                    <scrm-chart *ngIf=\"dataSource && chartType\"\n                                                [dataSource]=\"dataSource\"\n                                                [type]=\"chartType\">\n                                    </scrm-chart>\n                                </ng-container>\n                                <div *ngIf=\"loading\" [class.m-5]=\"!dataSource\" class=\"chart-loading\">\n                                    <scrm-loading-spinner [overlay]=\"true\"></scrm-loading-spinner>\n                                </div>\n                                <p *ngIf=\"!loading && (!isConfigured() || !dataSource)\"\n                                   class=\"lead text-center pt-3\">\n                                    {{language.getFieldLabel(this.messageLabelKey)}}\n                                </p>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</scrm-widget-panel>\n"
            },] }
];
ChartSidebarWidgetComponent.ctorParameters = () => [
    { type: LanguageStore },
    { type: ChartDataStoreFactory }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtc2lkZWJhci13aWRnZXQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2NvbnRhaW5lcnMvc2lkZWJhci13aWRnZXQvY29tcG9uZW50cy9jaGFydC1zaWRlYmFyLXdpZGdldC9jaGFydC1zaWRlYmFyLXdpZGdldC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQVMsTUFBTSxlQUFlLENBQUM7QUFFaEQsT0FBTyxFQUFDLGFBQWEsRUFBMkIsTUFBTSxNQUFNLENBQUM7QUFDN0QsT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdURBQXVELENBQUM7QUFDNUYsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDdkUsT0FBTyxFQUFDLGFBQWEsRUFBb0IsTUFBTSwyQ0FBMkMsQ0FBQztBQThCM0YsTUFBTSxPQUFPLDJCQUE0QixTQUFRLG1CQUFtQjtJQWVoRSxZQUFtQixRQUF1QixFQUFZLE9BQThCO1FBQ2hGLEtBQUssRUFBRSxDQUFDO1FBRE8sYUFBUSxHQUFSLFFBQVEsQ0FBZTtRQUFZLFlBQU8sR0FBUCxPQUFPLENBQXVCO1FBZHBGLFdBQU0sR0FBc0IsRUFBRSxDQUFDO1FBQy9CLGtCQUFhLEdBQUcsY0FBYyxDQUFDO1FBQy9CLFVBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxvQkFBZSxHQUFHLHFCQUFxQixDQUFDO1FBQ3hDLGtCQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ25CLGNBQVMsR0FBRyxFQUFFLENBQUM7UUFLZixZQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ0wsU0FBSSxHQUFtQixF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QyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUNyRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQ1AsR0FBRyxDQUFDLEdBQUcsRUFBRTs7WUFDTCxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQUEsTUFBQSxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQywwQ0FBRSxLQUFLLDBDQUFFLGFBQWEsRUFBRSxtQ0FBSSxJQUFJLENBQUM7WUFDbEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FDTCxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2xCLENBQUM7OztZQW5SSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMsOHZIQUFvRDthQUV2RDs7O1lBN0JPLGFBQWE7WUFGYixxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDaGFydERhdGFTb3VyY2UsIENoYXJ0TWV0YWRhdGEsIENoYXJ0c1dpZGdldE9wdGlvbnMsIFN0YXRpc3RpY3NRdWVyeSwgVmlld0NvbnRleHR9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge2NvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgdGFrZSwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0NoYXJ0RGF0YVN0b3JlRmFjdG9yeX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvY2hhcnQtZGF0YS9jaGFydC1kYXRhLnN0b3JlLmZhY3RvcnknO1xuaW1wb3J0IHtCYXNlV2lkZ2V0Q29tcG9uZW50fSBmcm9tICcuLi8uLi8uLi93aWRnZXRzL2Jhc2Utd2lkZ2V0Lm1vZGVsJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZSwgTGFuZ3VhZ2VTdHJpbmdNYXB9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL2xhbmd1YWdlL2xhbmd1YWdlLnN0b3JlJztcbmltcG9ydCB7Q2hhcnREYXRhU3RhdGUsIENoYXJ0RGF0YVN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9jaGFydC1kYXRhL2NoYXJ0LWRhdGEuc3RvcmUnO1xuXG5pbnRlcmZhY2UgQ2hhcnRTdGF0aXN0aWMge1xuICAgIGtleTogc3RyaW5nO1xuICAgIGNoYXJ0VHlwZTogc3RyaW5nO1xuICAgIHN0YXRpc3RpY3NUeXBlOiBzdHJpbmc7XG4gICAgbGFiZWxLZXk6IHN0cmluZztcbiAgICBzdG9yZTogQ2hhcnREYXRhU3RvcmU7XG4gICAgcmVsb2FkOiBib29sZWFuO1xufVxuXG5pbnRlcmZhY2UgQ2hhckRhdGFNYXAge1xuICAgIFtrZXk6IHN0cmluZ106IENoYXJ0RGF0YVN0YXRlO1xufVxuXG5pbnRlcmZhY2UgQ2hhcnRTdGF0aXN0aWNNYXAge1xuICAgIFtrZXk6IHN0cmluZ106IENoYXJ0U3RhdGlzdGljO1xufVxuXG5pbnRlcmZhY2UgQ2hhcnRTaWRlYmFyV2lkZ2V0U3RhdGUge1xuICAgIHN0YXRpc3RpY3M6IHsgW2tleTogc3RyaW5nXTogQ2hhcnREYXRhU3RhdGUgfTtcbiAgICBhcHBTdHJpbmdzOiBMYW5ndWFnZVN0cmluZ01hcDtcbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdjaGFydC1zaWRlYmFyLXdpZGdldCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2NoYXJ0LXNpZGViYXItd2lkZ2V0LmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIENoYXJ0U2lkZWJhcldpZGdldENvbXBvbmVudCBleHRlbmRzIEJhc2VXaWRnZXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIGNoYXJ0czogQ2hhcnRTdGF0aXN0aWNNYXAgPSB7fTtcbiAgICB0aXRsZUxhYmVsS2V5ID0gJ0xCTF9JTlNJR0hUUyc7XG4gICAgdGl0bGUgPSAnJztcbiAgICBtZXNzYWdlTGFiZWxLZXkgPSAnTEJMX0NIQVJUX05PVF9GT1VORCc7XG4gICAgc2VsZWN0ZWRDaGFydCA9ICcnO1xuICAgIGNoYXJ0VHlwZSA9ICcnO1xuICAgIGRhdGFTb3VyY2U6IENoYXJ0RGF0YVNvdXJjZTtcbiAgICB2bSQ6IE9ic2VydmFibGU8Q2hhcnRTaWRlYmFyV2lkZ2V0U3RhdGU+O1xuICAgIGxvYWRpbmckOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIGFwcFN0cmluZ3MkOiBPYnNlcnZhYmxlPExhbmd1YWdlU3RyaW5nTWFwPjtcbiAgICBsb2FkaW5nID0gdHJ1ZTtcbiAgICBwcm90ZWN0ZWQgc3ViczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuXG4gICAgY29uc3RydWN0b3IocHVibGljIGxhbmd1YWdlOiBMYW5ndWFnZVN0b3JlLCBwcm90ZWN0ZWQgZmFjdG9yeTogQ2hhcnREYXRhU3RvcmVGYWN0b3J5KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYXBwU3RyaW5ncyQgPSB0aGlzLmxhbmd1YWdlLmFwcFN0cmluZ3MkO1xuXG4gICAgICAgIGlmICh0aGlzLnZhbGlkYXRlQ29uZmlnKCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jb250ZXh0JCkge1xuICAgICAgICAgICAgdGhpcy5zdWJzLnB1c2godGhpcy5jb250ZXh0JC5zdWJzY3JpYmUoKGNvbnRleHQ6IFZpZXdDb250ZXh0KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcblxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuY2hhcnRzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoYXJ0ID0gdGhpcy5jaGFydHNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQuc3RvcmUuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvcHRpb25zOiBDaGFydHNXaWRnZXRPcHRpb25zID0gdGhpcy5jb25maWcub3B0aW9ucztcbiAgICAgICAgY29uc3QgY2hhcnRzOiBDaGFydE1ldGFkYXRhW10gPSBvcHRpb25zLmNoYXJ0cztcblxuICAgICAgICBpZiAob3B0aW9ucy5kZWZhdWx0Q2hhcnQpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRDaGFydCA9IG9wdGlvbnMuZGVmYXVsdENoYXJ0IHx8ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXR1cENoYXJ0cyhjaGFydHMpO1xuICAgICAgICB0aGlzLnNldEhlYWRlclRpdGxlKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnJlbG9hZFNlbGVjdGVkQ2hhcnQoKTtcbiAgICAgICAgdGhpcy5zZXR1cExvYWRpbmcoKTtcbiAgICAgICAgdGhpcy5zZXR1cFZNKCk7XG4gICAgICAgIHRoaXMuc2V0dXBSZWxvYWQoKTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdWJzLmZvckVhY2goc3ViID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgICB9XG5cbiAgICBnZXQgY29uZmlndXJlZENoYXJ0cygpOiBDaGFydE1ldGFkYXRhW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFydE9wdGlvbnMuY2hhcnRzIHx8IFtdO1xuICAgIH1cblxuICAgIGdldCBjaGFydE9wdGlvbnMoKTogQ2hhcnRzV2lkZ2V0T3B0aW9ucyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5vcHRpb25zIHx8IHt9O1xuICAgIH1cblxuICAgIGlzQ29uZmlndXJlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhKHRoaXMuY29uZmlnLm9wdGlvbnMuY2hhcnRzICYmIHRoaXMuY29uZmlnLm9wdGlvbnMuY2hhcnRzLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgZ2V0TGFiZWxLZXkoc3RhdDogQ2hhcnREYXRhU3RhdGUpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBsYWJlbEtleSA9IHN0YXQuc3RhdGlzdGljLm1ldGFkYXRhICYmIHN0YXQuc3RhdGlzdGljLm1ldGFkYXRhLmxhYmVsS2V5O1xuICAgICAgICBpZiAobGFiZWxLZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBsYWJlbEtleTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJ0c1tzdGF0LnF1ZXJ5LmtleV0ubGFiZWxLZXk7XG4gICAgfVxuXG4gICAgZ2V0S2V5KGNoYXJ0OiBDaGFydE1ldGFkYXRhKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGNoYXJ0LmNoYXJ0S2V5IHx8IGNoYXJ0LnN0YXRpc3RpY3NUeXBlIHx8ICcnO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB2YWxpZGF0ZUNvbmZpZygpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRleHQgfHwgIXRoaXMuY29udGV4dC5tb2R1bGUpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZUxhYmVsS2V5ID0gJ0xCTF9CQURfQ09ORklHX0JBRF9DT05URVhUJztcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5jb25maWcpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZUxhYmVsS2V5ID0gJ0xCTF9CQURfQ09ORklHX05PX0NPTkZJRyc7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvcHRpb25zOiBDaGFydHNXaWRnZXRPcHRpb25zID0gdGhpcy5jb25maWcub3B0aW9ucztcblxuICAgICAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuY2hhcnRzIHx8ICFvcHRpb25zLmNoYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZUxhYmVsS2V5ID0gJ0xCTF9CQURfQ09ORklHX05PX1NUQVRJU1RJQ1NfS0VZJztcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXR1cENoYXJ0cyhjaGFydHM6IENoYXJ0TWV0YWRhdGFbXSk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRDaGFydCA9ICcnO1xuXG4gICAgICAgIGNoYXJ0cy5mb3JFYWNoKChjaGFydDogQ2hhcnRNZXRhZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLmdldEtleShjaGFydCk7XG5cbiAgICAgICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRDaGFydCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRDaGFydCA9IGtleSB8fCAnJztcbiAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0VHlwZSA9IGNoYXJ0LmNoYXJ0VHlwZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5idWlsZENoYXJ0SW5mbyhrZXksIGNoYXJ0KTtcbiAgICAgICAgICAgIHRoaXMuaW5pdENoYXJ0U3RvcmUoa2V5LCBjaGFydCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBidWlsZENoYXJ0SW5mbyhrZXk6IHN0cmluZywgY2hhcnQ6IENoYXJ0TWV0YWRhdGEpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFydHNba2V5XSA9IHtcbiAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgIGxhYmVsS2V5OiBjaGFydC5sYWJlbEtleSB8fCAnJyxcbiAgICAgICAgICAgIGNoYXJ0VHlwZTogY2hhcnQuY2hhcnRUeXBlLFxuICAgICAgICAgICAgc3RhdGlzdGljc1R5cGU6IGNoYXJ0LnN0YXRpc3RpY3NUeXBlLFxuICAgICAgICAgICAgc3RvcmU6IHRoaXMuZmFjdG9yeS5jcmVhdGUoKSxcbiAgICAgICAgICAgIHJlbG9hZDogdHJ1ZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0Q2hhcnRTdG9yZShrZXk6IHN0cmluZywgY2hhcnQ6IENoYXJ0TWV0YWRhdGEpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFydHNba2V5XS5zdG9yZS5pbml0KFxuICAgICAgICAgICAgdGhpcy5jb250ZXh0Lm1vZHVsZSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6IGNoYXJ0LnN0YXRpc3RpY3NUeXBlLFxuICAgICAgICAgICAgICAgIGNvbnRleHQ6IHsuLi50aGlzLmNvbnRleHR9XG4gICAgICAgICAgICB9IGFzIFN0YXRpc3RpY3NRdWVyeSxcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuY2hhcnRzW2tleV0uc3RvcmUuc2V0RGVmYXVsdE9wdGlvbnMoY2hhcnQuY2hhcnRPcHRpb25zKTtcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCBzZXRIZWFkZXJUaXRsZShvcHRpb25zOiBDaGFydHNXaWRnZXRPcHRpb25zKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmxhYmVsS2V5KSB7XG4gICAgICAgICAgICB0aGlzLnRpdGxlTGFiZWxLZXkgPSB0aGlzLmNvbmZpZy5sYWJlbEtleTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLmhlYWRlclRpdGxlKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY2hhcnRzIHx8ICF0aGlzLmNoYXJ0c1t0aGlzLnNlbGVjdGVkQ2hhcnRdIHx8ICF0aGlzLmNoYXJ0c1t0aGlzLnNlbGVjdGVkQ2hhcnRdLmxhYmVsS2V5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnRpdGxlTGFiZWxLZXkgPSB0aGlzLmNoYXJ0c1t0aGlzLnNlbGVjdGVkQ2hhcnRdLmxhYmVsS2V5O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50aXRsZSA9IHRoaXMubGFuZ3VhZ2UuZ2V0RmllbGRMYWJlbCh0aGlzLnRpdGxlTGFiZWxLZXkpO1xuICAgIH1cblxuICAgIG9uQ2hhcnRTZWxlY3QoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZSA9IG51bGw7XG4gICAgICAgIHRoaXMuY2hhcnRUeXBlID0gdGhpcy5jaGFydHNbdGhpcy5zZWxlY3RlZENoYXJ0XS5jaGFydFR5cGU7XG4gICAgICAgIHRoaXMucmVsb2FkU2VsZWN0ZWRDaGFydChmYWxzZSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldHVwVk0oKTogdm9pZCB7XG5cbiAgICAgICAgY29uc3Qgc3RhdGlzdGljcyQ6IE9ic2VydmFibGU8Q2hhcnREYXRhU3RhdGU+W10gPSBbXTtcblxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmNoYXJ0cykuZm9yRWFjaChrZXkgPT4gc3RhdGlzdGljcyQucHVzaCh0aGlzLmNoYXJ0c1trZXldLnN0b3JlLnN0YXRlJCkpO1xuXG4gICAgICAgIHRoaXMudm0kID0gY29tYmluZUxhdGVzdChbY29tYmluZUxhdGVzdChzdGF0aXN0aWNzJCksIHRoaXMubGFuZ3VhZ2UuYXBwU3RyaW5ncyRdKS5waXBlKFxuICAgICAgICAgICAgbWFwKChbc3RhdGlzdGljcywgYXBwU3RyaW5nc10pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0c01hcCA9IHRoaXMubWFwQ2hhcnREYXRhKHN0YXRpc3RpY3MpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGlzdGljczogc3RhdHNNYXAsXG4gICAgICAgICAgICAgICAgICAgIGFwcFN0cmluZ3NcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbWFwQ2hhcnREYXRhKHN0YXRpc3RpY3M6IENoYXJ0RGF0YVN0YXRlW10pOiBDaGFyRGF0YU1hcCB7XG4gICAgICAgIGNvbnN0IHN0YXRzTWFwOiBDaGFyRGF0YU1hcCA9IHt9O1xuXG4gICAgICAgIHN0YXRpc3RpY3MuZm9yRWFjaCgoc3RhdGlzdGljOiBDaGFydERhdGFTdGF0ZSkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIXN0YXRpc3RpYy5xdWVyeS5rZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0YXRzTWFwW3N0YXRpc3RpYy5xdWVyeS5rZXldID0gc3RhdGlzdGljO1xuXG4gICAgICAgICAgICB0aGlzLmNoYXJ0c1tzdGF0aXN0aWMucXVlcnkua2V5XS5sYWJlbEtleSA9IHRoaXMuZ2V0TGFiZWxLZXkoc3RhdGlzdGljKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHN0YXRzTWFwO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXR1cFJlbG9hZCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5yZWxvYWQkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN1YnMucHVzaCh0aGlzLmNvbmZpZy5yZWxvYWQkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5sb2FkaW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmNoYXJ0cykuZm9yRWFjaChjaGFydEtleSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFydHNbY2hhcnRLZXldLnJlbG9hZCA9IHRydWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5yZWxvYWRTZWxlY3RlZENoYXJ0KCk7XG4gICAgICAgIH0pKTtcblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXR1cExvYWRpbmcoKTogdm9pZCB7XG5cbiAgICAgICAgY29uc3QgbG9hZGluZ3MkOiBPYnNlcnZhYmxlPGJvb2xlYW4+W10gPSBbXTtcblxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmNoYXJ0cykuZm9yRWFjaChrZXkgPT4gbG9hZGluZ3MkLnB1c2godGhpcy5jaGFydHNba2V5XS5zdG9yZS5sb2FkaW5nJCkpO1xuXG4gICAgICAgIHRoaXMubG9hZGluZyQgPSBjb21iaW5lTGF0ZXN0KGxvYWRpbmdzJCkucGlwZShtYXAoKGxvYWRpbmdzKSA9PiB7XG5cbiAgICAgICAgICAgIGlmICghbG9hZGluZ3MgfHwgbG9hZGluZ3MubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgbG9hZGluZ3MuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgbG9hZGluZyA9IGxvYWRpbmcgfHwgdmFsdWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gbG9hZGluZztcblxuICAgICAgICAgICAgcmV0dXJuIGxvYWRpbmc7XG4gICAgICAgIH0pKTtcblxuICAgICAgICB0aGlzLnN1YnMucHVzaCh0aGlzLmxvYWRpbmckLnN1YnNjcmliZSgpKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVsb2FkU2VsZWN0ZWRDaGFydCh1c2VDYWNoZSA9IGZhbHNlKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNoYXJ0cyB8fCAhdGhpcy5jaGFydHNbdGhpcy5zZWxlY3RlZENoYXJ0XSB8fCAhdGhpcy5jaGFydHNbdGhpcy5zZWxlY3RlZENoYXJ0XS5zdG9yZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdXNlQ2FjaGUgPSB1c2VDYWNoZSAmJiAhdGhpcy5jaGFydHNbdGhpcy5zZWxlY3RlZENoYXJ0XS5yZWxvYWQ7XG5cbiAgICAgICAgdGhpcy5jaGFydHNbdGhpcy5zZWxlY3RlZENoYXJ0XS5zdG9yZS5sb2FkKHVzZUNhY2hlKS5waXBlKFxuICAgICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhU291cmNlID0gdGhpcy5jaGFydHNbdGhpcy5zZWxlY3RlZENoYXJ0XT8uc3RvcmU/LmdldERhdGFTb3VyY2UoKSA/PyBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRzW3RoaXMuc2VsZWN0ZWRDaGFydF0ucmVsb2FkID0gZmFsc2U7XG4gICAgICAgICAgICB9KVxuICAgICAgICApLnN1YnNjcmliZSgpO1xuICAgIH1cbn1cbiJdfQ==