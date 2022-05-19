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
import { combineLatest, of } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { SingleValueStatisticsStoreFactory } from '../../store/single-value-statistics/single-value-statistics.store.factory';
import { LanguageStore } from '../../store/language/language.store';
import { isTrue, } from 'common';
export class GridWidgetComponent {
    constructor(language, factory) {
        this.language = language;
        this.factory = factory;
        this.loading = true;
        this.subs = [];
        this.statistics = {};
    }
    ngOnInit() {
        const isValid = this.validateConfig();
        if (!isValid) {
            return;
        }
        this.gridWidgetInput = this.config;
        this.buildStatistics();
        this.setupLoading$();
        this.setupVM();
        this.setupReload();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    validateConfig() {
        if (!this.config || !this.config.layout) {
            this.messageLabelKey = 'LBL_CONFIG_NO_CONFIG';
            return false;
        }
        if (!this.config.queryArgs.context || !this.config.queryArgs.module) {
            this.messageLabelKey = 'LBL_CONFIG_BAD_CONTEXT';
            return false;
        }
        if (!this.config.widgetConfig) {
            this.messageLabelKey = 'LBL_CONFIG_NO_CONFIG';
            return false;
        }
        if (!this.config.layout || !this.config.layout.rows) {
            this.messageLabelKey = 'LBL_CONFIG_NO_STATISTICS_KEY';
            return false;
        }
        return true;
    }
    getRowClass() {
        return this.gridWidgetInput.rowClass;
    }
    getColClass() {
        return this.gridWidgetInput.columnClass;
    }
    getContextModule() {
        return this.gridWidgetInput.queryArgs.context.module;
    }
    getMessageContext() {
        const module = this.getContextModule();
        if (!module) {
            return {};
        }
        return {
            module
        };
    }
    getMessageFields(statistics) {
        if (!statistics || !Object.keys(statistics).length) {
            return {};
        }
        const fields = {};
        Object.keys(statistics).forEach(key => {
            const statistic = statistics[key];
            fields[key] = statistic.field;
        });
        return fields;
    }
    getSizeClass(size) {
        const sizeMap = {
            regular: 'text-regular',
            medium: 'text-medium',
            large: 'text-large',
            'x-large': 'text-x-large',
            'xx-large': 'text-xx-large',
            huge: 'text-huge'
        };
        return sizeMap[size] || 'text-regular';
    }
    getFontWeight(bold) {
        let fontWeight = 'font-weight-normal';
        if (bold && isTrue(bold)) {
            fontWeight = 'font-weight-bolder';
        }
        return fontWeight;
    }
    getColor(color) {
        const sizeMap = {
            yellow: 'text-yellow',
            blue: 'text-blue',
            green: 'text-green',
            red: 'text-red',
            purple: 'text-purple',
            dark: 'text-dark',
            grey: 'text-grey'
        };
        return sizeMap[color] || '';
    }
    getJustify(justify) {
        const justifyMap = {
            start: 'justify-content-start',
            end: 'justify-content-end',
            center: 'justify-content-center',
            between: 'justify-content-between',
            around: 'justify-content-around'
        };
        return justifyMap[justify] || 'justify-content-center';
    }
    getAlign(align) {
        const alignMap = {
            start: 'align-items-start',
            end: 'align-items-end',
            center: 'align-items-center',
            baseline: 'align-items-baseline',
            stretch: 'align-items-stretch'
        };
        return alignMap[align] || 'align-items-center';
    }
    getLayoutRowClass(row) {
        let className = '';
        if (row && row.class) {
            className = row.class;
        }
        return className;
    }
    getClass(layoutCol) {
        let className = '';
        if (layoutCol) {
            className = layoutCol.class;
        }
        className = className + ' '
            + this.getSizeClass(layoutCol.size) + ' '
            + this.getFontWeight(layoutCol.bold) + ' '
            + this.getColor(layoutCol.color);
        return className;
    }
    isEmptyFieldValue(fieldValue) {
        // Handle the cases, when input value is an string, array, objects or any other type
        if (typeof fieldValue === 'string') {
            fieldValue = fieldValue.trim();
        }
        return fieldValue == null
            || typeof fieldValue === 'undefined'
            || fieldValue === ''
            || fieldValue.length === 0;
    }
    getLabel(statisticMetadata, attribute) {
        let label = '';
        if (statisticMetadata && statisticMetadata[attribute]) {
            label = this.language.getFieldLabel(statisticMetadata[attribute]);
        }
        return label;
    }
    getLayout() {
        return this.gridWidgetInput.layout.rows;
    }
    buildStatistics() {
        this.gridWidgetInput.layout.rows.forEach(row => {
            if (!row.cols || !row.cols.length) {
                return;
            }
            row.cols.forEach(col => {
                if (!col.statistic) {
                    return;
                }
                if (col.store) {
                    this.statistics[col.statistic] = {
                        type: col.statistic,
                        store: col.store
                    };
                    return;
                }
                this.statistics[col.statistic] = {
                    type: col.statistic,
                    store: this.factory.create()
                };
                this.statistics[col.statistic].store.init(this.gridWidgetInput.queryArgs.module, {
                    key: col.statistic,
                    context: Object.assign({}, this.gridWidgetInput.queryArgs.context),
                    params: Object.assign({}, this.gridWidgetInput.queryArgs.params)
                }).pipe(take(1)).subscribe();
            });
        });
    }
    setupLoading$() {
        const loadings$ = [];
        Object.keys(this.statistics).forEach(type => loadings$.push(this.statistics[type].store.loading$));
        this.loading$ = combineLatest(loadings$).pipe(map((loadings) => {
            if (!loadings || loadings.length < 1) {
                this.loading = false;
                return false;
            }
            let loading = true;
            loadings.forEach(value => {
                loading = loading && value;
            });
            this.loading = loading;
            return loading;
        }));
        this.subs.push(this.loading$.subscribe());
    }
    setupReload() {
        if (this.gridWidgetInput.widgetConfig.reload$) {
            this.subs.push(this.gridWidgetInput.widgetConfig.reload$.subscribe(() => {
                if (this.loading === false) {
                    this.loading = true;
                    Object.keys(this.statistics).forEach(statisticKey => {
                        const statistic = this.statistics[statisticKey];
                        if (!statistic.store) {
                            return;
                        }
                        statistic.store.load(false).pipe(take(1)).subscribe();
                    });
                }
            }));
        }
    }
    setupVM() {
        let allStatistics$ = of([]).pipe(shareReplay());
        const layout$ = of(this.getLayout()).pipe(shareReplay());
        if (this.statistics && Object.keys(this.statistics).length > 0) {
            const statistics$ = [];
            Object.keys(this.statistics).forEach(type => statistics$.push(this.statistics[type].store.state$));
            allStatistics$ = combineLatest(statistics$);
        }
        this.vm$ = combineLatest([allStatistics$, layout$]).pipe(map(([statistics, layout]) => {
            const statsMap = {};
            const tooltipTitles = [];
            const descriptions = [];
            statistics.forEach(value => {
                statsMap[value.query.key] = value;
                const tooltip = this.getLabel(value.statistic.metadata, 'tooltip_title_key');
                if (tooltip) {
                    tooltipTitles.push(tooltip);
                }
                const description = this.getLabel(value.statistic.metadata, 'descriptionKey');
                if (description) {
                    descriptions.push(description);
                }
            });
            return {
                layout,
                statistics: statsMap,
                tooltipTitleText: tooltipTitles.join(' | '),
                description: descriptions.join(' | '),
            };
        }));
    }
}
GridWidgetComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-grid-widget',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<div *ngIf=\"this.messageLabelKey\" class=\"p-3 widget-message\">\n    <scrm-label [labelKey]=\"this.messageLabelKey\"></scrm-label>\n</div>\n\n<div *ngIf=\"!this.messageLabelKey && (vm$| async) as vm\"\n     class=\"grid-widget d-flex flex-column\"\n     ngbTooltip=\"{{vm.tooltipTitleText}}\" placement=\"auto\" container=\"body\">\n\n    <ng-container *ngFor=\"let item of vm.layout\">\n\n        <div\n            class=\"d-flex {{getJustify(item.justify)}} {{getAlign(item.align)}} {{getRowClass()}} {{getLayoutRowClass(item)}}\">\n\n            <div class=\"{{getColClass()}} {{getClass(col)}}\" *ngFor=\"let col of item.cols\">\n\n                <ng-container *ngIf=\"col.display !== 'hidden'\">\n\n                    <!-- ICON -->\n                    <ng-container *ngIf=\"col.icon\">\n                        <div class=\"widget-entry-icon\">\n                            <scrm-image [image]=\"col.icon\" [klass]=\"col.iconClass\"></scrm-image>\n                        </div>\n                    </ng-container>\n\n                    <!-- VALUE -->\n                    <ng-container *ngIf=\"col.statistic && (vm.statistics[col.statistic]) as statistics\">\n\n                        <div *ngIf=\"statistics.field\" class=\"widget-entry-value\">\n\n                            <scrm-field [type]=\"statistics.field.type\"\n                                        [field]=\"statistics.field\"\n                                        mode=\"list\">\n                            </scrm-field>\n\n                        </div>\n                        <div *ngIf=\"statistics.loading && loading\" class=\"widget-entry-loading\">\n\n                            <scrm-inline-loading-spinner></scrm-inline-loading-spinner>\n\n                        </div>\n                    </ng-container>\n\n                    <!-- LABEL -->\n                    <ng-container *ngIf=\"col.labelKey\">\n\n                        <div class=\"widget-entry-label text-truncate\">\n\n                            <scrm-label [labelKey]=\"col.labelKey\" [module]=\"getContextModule()\"></scrm-label>\n\n                        </div>\n\n                    </ng-container>\n\n                    <!-- DESCRIPTION TEXT -->\n                    <ng-container *ngIf=\"col.descriptionKey\">\n\n                        <div class=\"text-truncate widget-entry-label\">\n\n                            <label>{{vm.description}}</label>\n\n                        </div>\n\n                    </ng-container>\n\n                    <!-- DYNAMIC LABEL -->\n                    <ng-container *ngIf=\"col.dynamicLabel\">\n\n                        <div *ngIf=\"!loading\" class=\"widget-entry-dynamic-label\">\n\n                            <scrm-dynamic-label [context]=\"getMessageContext()\"\n                                                [fields]=\"getMessageFields(vm.statistics)\"\n                                                [labelKey]=\"col.dynamicLabel\">\n                            </scrm-dynamic-label>\n\n                        </div>\n\n                        <div *ngIf=\"loading\" class=\"widget-entry-loading\">\n                            <scrm-inline-loading-spinner></scrm-inline-loading-spinner>\n                        </div>\n\n                    </ng-container>\n\n                    <!-- MISCONFIGURATION -->\n                    <ng-container\n                        *ngIf=\"col.statistic && !loading && (!vm.statistics[col.statistic].field || (vm.statistics[col.statistic].field && isEmptyFieldValue(vm.statistics[col.statistic].field.value)))\">\n                        <div class=\"widget-entry-value {{getSizeClass(col.size)}}\">\n                            -\n                        </div>\n                    </ng-container>\n\n                </ng-container>\n\n            </div>\n\n        </div>\n    </ng-container>\n</div>\n"
            },] }
];
GridWidgetComponent.ctorParameters = () => [
    { type: LanguageStore },
    { type: SingleValueStatisticsStoreFactory }
];
GridWidgetComponent.propDecorators = {
    config: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC13aWRnZXQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2NvbXBvbmVudHMvZ3JpZC13aWRnZXQvZ3JpZC13aWRnZXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBb0IsTUFBTSxlQUFlLENBQUM7QUFFbEUsT0FBTyxFQUFDLGFBQWEsRUFBYyxFQUFFLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFDakUsT0FBTyxFQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEQsT0FBTyxFQUFDLGlDQUFpQyxFQUFDLE1BQU0sMkVBQTJFLENBQUM7QUFDNUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQ2xFLE9BQU8sRUFJSCxNQUFNLEdBYVQsTUFBTSxRQUFRLENBQUM7QUEyQ2hCLE1BQU0sT0FBTyxtQkFBbUI7SUFVNUIsWUFDYyxRQUF1QixFQUN2QixPQUEwQztRQUQxQyxhQUFRLEdBQVIsUUFBUSxDQUFlO1FBQ3ZCLFlBQU8sR0FBUCxPQUFPLENBQW1DO1FBVHhELFlBQU8sR0FBRyxJQUFJLENBQUM7UUFFUCxTQUFJLEdBQW1CLEVBQUUsQ0FBQztRQUMxQixlQUFVLEdBQXVCLEVBQUUsQ0FBQztJQVE1QyxDQUFDO0lBRUQsUUFBUTtRQUVKLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1YsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ25DLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMs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QixFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUMzQyxXQUFXLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDckIsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1osQ0FBQzs7O1lBclZKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1Qixvb0tBQTJDO2FBRTlDOzs7WUEzRE8sYUFBYTtZQURiLGlDQUFpQzs7O3FCQStEcEMsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7Y29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgb2YsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgc2hhcmVSZXBsYXksIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7U2luZ2xlVmFsdWVTdGF0aXN0aWNzU3RvcmVGYWN0b3J5fSBmcm9tICcuLi8uLi9zdG9yZS9zaW5nbGUtdmFsdWUtc3RhdGlzdGljcy9zaW5nbGUtdmFsdWUtc3RhdGlzdGljcy5zdG9yZS5mYWN0b3J5JztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtcbiAgICBDb250ZW50QWxpZ24sXG4gICAgQ29udGVudEp1c3RpZnksXG4gICAgRmllbGRNYXAsXG4gICAgaXNUcnVlLFxuICAgIFNpbmdsZVZhbHVlU3RhdGlzdGljc1N0YXRlLFxuICAgIFNpbmdsZVZhbHVlU3RhdGlzdGljc1N0b3JlSW50ZXJmYWNlLFxuICAgIFN0YXRpc3RpY01ldGFkYXRhLFxuICAgIFN0YXRpc3RpY3NRdWVyeSxcbiAgICBTdGF0aXN0aWNXaWRnZXRMYXlvdXRDb2wsXG4gICAgU3RhdGlzdGljV2lkZ2V0TGF5b3V0Um93LFxuICAgIFN0YXRpc3RpY1dpZGdldE9wdGlvbnMsXG4gICAgU3RyaW5nTWFwLFxuICAgIFRleHRDb2xvcixcbiAgICBUZXh0U2l6ZXMsXG4gICAgVmlld0NvbnRleHQsXG4gICAgV2lkZ2V0TWV0YWRhdGEsXG59IGZyb20gJ2NvbW1vbic7XG5cbmludGVyZmFjZSBTdGF0aXN0aWNzRW50cnkge1xuICAgIGxhYmVsS2V5Pzogc3RyaW5nO1xuICAgIHR5cGU6IHN0cmluZztcbiAgICBzdG9yZTogU2luZ2xlVmFsdWVTdGF0aXN0aWNzU3RvcmVJbnRlcmZhY2U7XG59XG5cbmludGVyZmFjZSBTdGF0aXN0aWNzRW50cnlNYXAge1xuICAgIFtrZXk6IHN0cmluZ106IFN0YXRpc3RpY3NFbnRyeTtcbn1cblxuaW50ZXJmYWNlIFN0YXRpc3RpY3NNYXAge1xuICAgIFtrZXk6IHN0cmluZ106IFNpbmdsZVZhbHVlU3RhdGlzdGljc1N0YXRlO1xufVxuXG5pbnRlcmZhY2UgR3JpZFdpZGdldFN0YXRlIHtcbiAgICBsYXlvdXQ6IFN0YXRpc3RpY1dpZGdldExheW91dFJvd1tdO1xuICAgIHN0YXRpc3RpY3M6IFN0YXRpc3RpY3NNYXA7XG4gICAgdG9vbHRpcFRpdGxlVGV4dD86IHN0cmluZztcbiAgICBkZXNjcmlwdGlvbj86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHcmlkV2lkZ2V0Q29uZmlnIHtcbiAgICByb3dDbGFzcz86IHN0cmluZztcbiAgICBjb2x1bW5DbGFzcz86IHN0cmluZztcbiAgICBsYXlvdXQ6IFN0YXRpc3RpY1dpZGdldE9wdGlvbnM7XG4gICAgd2lkZ2V0Q29uZmlnPzogV2lkZ2V0TWV0YWRhdGE7XG4gICAgcXVlcnlBcmdzPzogU3RhdGlzdGljc1F1ZXJ5QXJncztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdGF0aXN0aWNzUXVlcnlBcmdzIHtcbiAgICBtb2R1bGU6IHN0cmluZztcbiAgICBjb250ZXh0OiBWaWV3Q29udGV4dDtcbiAgICBwYXJhbXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1ncmlkLXdpZGdldCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2dyaWQtd2lkZ2V0LmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZXM6IFtdXG59KVxuXG5leHBvcnQgY2xhc3MgR3JpZFdpZGdldENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBjb25maWc6IEdyaWRXaWRnZXRDb25maWc7XG4gICAgdm0kOiBPYnNlcnZhYmxlPEdyaWRXaWRnZXRTdGF0ZT47XG4gICAgbG9hZGluZyA9IHRydWU7XG4gICAgbWVzc2FnZUxhYmVsS2V5OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBzdWJzOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICAgIHByaXZhdGUgc3RhdGlzdGljczogU3RhdGlzdGljc0VudHJ5TWFwID0ge307XG4gICAgcHJpdmF0ZSBsb2FkaW5nJDogT2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICBwcml2YXRlIGdyaWRXaWRnZXRJbnB1dDogR3JpZFdpZGdldENvbmZpZztcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgbGFuZ3VhZ2U6IExhbmd1YWdlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBmYWN0b3J5OiBTaW5nbGVWYWx1ZVN0YXRpc3RpY3NTdG9yZUZhY3RvcnlcbiAgICApIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcblxuICAgICAgICBjb25zdCBpc1ZhbGlkID0gdGhpcy52YWxpZGF0ZUNvbmZpZygpO1xuICAgICAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyaWRXaWRnZXRJbnB1dCA9IHRoaXMuY29uZmlnO1xuICAgICAgICB0aGlzLmJ1aWxkU3RhdGlzdGljcygpO1xuICAgICAgICB0aGlzLnNldHVwTG9hZGluZyQoKTtcbiAgICAgICAgdGhpcy5zZXR1cFZNKCk7XG4gICAgICAgIHRoaXMuc2V0dXBSZWxvYWQoKTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdWJzLmZvckVhY2goc3ViID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdmFsaWRhdGVDb25maWcoKTogYm9vbGVhbiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZyB8fCAhdGhpcy5jb25maWcubGF5b3V0KSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VMYWJlbEtleSA9ICdMQkxfQ09ORklHX05PX0NPTkZJRyc7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLnF1ZXJ5QXJncy5jb250ZXh0IHx8ICF0aGlzLmNvbmZpZy5xdWVyeUFyZ3MubW9kdWxlKSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VMYWJlbEtleSA9ICdMQkxfQ09ORklHX0JBRF9DT05URVhUJztcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5jb25maWcud2lkZ2V0Q29uZmlnKSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VMYWJlbEtleSA9ICdMQkxfQ09ORklHX05PX0NPTkZJRyc7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmxheW91dCB8fCAhdGhpcy5jb25maWcubGF5b3V0LnJvd3MpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZUxhYmVsS2V5ID0gJ0xCTF9DT05GSUdfTk9fU1RBVElTVElDU19LRVknO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFJvd0NsYXNzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWRXaWRnZXRJbnB1dC5yb3dDbGFzcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q29sQ2xhc3MoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZFdpZGdldElucHV0LmNvbHVtbkNsYXNzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDb250ZXh0TW9kdWxlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWRXaWRnZXRJbnB1dC5xdWVyeUFyZ3MuY29udGV4dC5tb2R1bGU7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE1lc3NhZ2VDb250ZXh0KCk6IFN0cmluZ01hcCB7XG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMuZ2V0Q29udGV4dE1vZHVsZSgpO1xuXG4gICAgICAgIGlmICghbW9kdWxlKSB7XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbW9kdWxlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGdldE1lc3NhZ2VGaWVsZHMoc3RhdGlzdGljczogU3RhdGlzdGljc01hcCk6IEZpZWxkTWFwIHtcblxuICAgICAgICBpZiAoIXN0YXRpc3RpY3MgfHwgIU9iamVjdC5rZXlzKHN0YXRpc3RpY3MpLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmllbGRzID0ge307XG5cbiAgICAgICAgT2JqZWN0LmtleXMoc3RhdGlzdGljcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGlzdGljID0gc3RhdGlzdGljc1trZXldO1xuICAgICAgICAgICAgZmllbGRzW2tleV0gPSBzdGF0aXN0aWMuZmllbGQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgfVxuXG4gICAgZ2V0U2l6ZUNsYXNzKHNpemU6IFRleHRTaXplcyk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHNpemVNYXAgPSB7XG4gICAgICAgICAgICByZWd1bGFyOiAndGV4dC1yZWd1bGFyJyxcbiAgICAgICAgICAgIG1lZGl1bTogJ3RleHQtbWVkaXVtJyxcbiAgICAgICAgICAgIGxhcmdlOiAndGV4dC1sYXJnZScsXG4gICAgICAgICAgICAneC1sYXJnZSc6ICd0ZXh0LXgtbGFyZ2UnLFxuICAgICAgICAgICAgJ3h4LWxhcmdlJzogJ3RleHQteHgtbGFyZ2UnLFxuICAgICAgICAgICAgaHVnZTogJ3RleHQtaHVnZSdcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2l6ZU1hcFtzaXplXSB8fCAndGV4dC1yZWd1bGFyJztcbiAgICB9XG5cbiAgICBnZXRGb250V2VpZ2h0KGJvbGQ6IHN0cmluZyB8IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICBsZXQgZm9udFdlaWdodCA9ICdmb250LXdlaWdodC1ub3JtYWwnO1xuXG4gICAgICAgIGlmIChib2xkICYmIGlzVHJ1ZShib2xkKSkge1xuICAgICAgICAgICAgZm9udFdlaWdodCA9ICdmb250LXdlaWdodC1ib2xkZXInO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvbnRXZWlnaHQ7XG4gICAgfVxuXG4gICAgZ2V0Q29sb3IoY29sb3I6IFRleHRDb2xvcik6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHNpemVNYXAgPSB7XG4gICAgICAgICAgICB5ZWxsb3c6ICd0ZXh0LXllbGxvdycsXG4gICAgICAgICAgICBibHVlOiAndGV4dC1ibHVlJyxcbiAgICAgICAgICAgIGdyZWVuOiAndGV4dC1ncmVlbicsXG4gICAgICAgICAgICByZWQ6ICd0ZXh0LXJlZCcsXG4gICAgICAgICAgICBwdXJwbGU6ICd0ZXh0LXB1cnBsZScsXG4gICAgICAgICAgICBkYXJrOiAndGV4dC1kYXJrJyxcbiAgICAgICAgICAgIGdyZXk6ICd0ZXh0LWdyZXknXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNpemVNYXBbY29sb3JdIHx8ICcnO1xuICAgIH1cblxuICAgIGdldEp1c3RpZnkoanVzdGlmeTogQ29udGVudEp1c3RpZnkpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBqdXN0aWZ5TWFwID0ge1xuICAgICAgICAgICAgc3RhcnQ6ICdqdXN0aWZ5LWNvbnRlbnQtc3RhcnQnLFxuICAgICAgICAgICAgZW5kOiAnanVzdGlmeS1jb250ZW50LWVuZCcsXG4gICAgICAgICAgICBjZW50ZXI6ICdqdXN0aWZ5LWNvbnRlbnQtY2VudGVyJyxcbiAgICAgICAgICAgIGJldHdlZW46ICdqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbicsXG4gICAgICAgICAgICBhcm91bmQ6ICdqdXN0aWZ5LWNvbnRlbnQtYXJvdW5kJ1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBqdXN0aWZ5TWFwW2p1c3RpZnldIHx8ICdqdXN0aWZ5LWNvbnRlbnQtY2VudGVyJztcbiAgICB9XG5cbiAgICBnZXRBbGlnbihhbGlnbjogQ29udGVudEFsaWduKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgYWxpZ25NYXAgPSB7XG4gICAgICAgICAgICBzdGFydDogJ2FsaWduLWl0ZW1zLXN0YXJ0JyxcbiAgICAgICAgICAgIGVuZDogJ2FsaWduLWl0ZW1zLWVuZCcsXG4gICAgICAgICAgICBjZW50ZXI6ICdhbGlnbi1pdGVtcy1jZW50ZXInLFxuICAgICAgICAgICAgYmFzZWxpbmU6ICdhbGlnbi1pdGVtcy1iYXNlbGluZScsXG4gICAgICAgICAgICBzdHJldGNoOiAnYWxpZ24taXRlbXMtc3RyZXRjaCdcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gYWxpZ25NYXBbYWxpZ25dIHx8ICdhbGlnbi1pdGVtcy1jZW50ZXInO1xuICAgIH1cblxuICAgIGdldExheW91dFJvd0NsYXNzKHJvdzogU3RhdGlzdGljV2lkZ2V0TGF5b3V0Um93KTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGNsYXNzTmFtZSA9ICcnO1xuICAgICAgICBpZiAocm93ICYmIHJvdy5jbGFzcykge1xuICAgICAgICAgICAgY2xhc3NOYW1lID0gcm93LmNsYXNzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbGFzc05hbWU7XG4gICAgfVxuXG4gICAgZ2V0Q2xhc3MobGF5b3V0Q29sOiBTdGF0aXN0aWNXaWRnZXRMYXlvdXRDb2wpOiBzdHJpbmcge1xuICAgICAgICBsZXQgY2xhc3NOYW1lID0gJyc7XG4gICAgICAgIGlmIChsYXlvdXRDb2wpIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IGxheW91dENvbC5jbGFzcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZSArICcgJ1xuICAgICAgICAgICAgKyB0aGlzLmdldFNpemVDbGFzcyhsYXlvdXRDb2wuc2l6ZSkgKyAnICdcbiAgICAgICAgICAgICsgdGhpcy5nZXRGb250V2VpZ2h0KGxheW91dENvbC5ib2xkKSArICcgJ1xuICAgICAgICAgICAgKyB0aGlzLmdldENvbG9yKGxheW91dENvbC5jb2xvcik7XG5cbiAgICAgICAgcmV0dXJuIGNsYXNzTmFtZTtcbiAgICB9XG5cbiAgICBpc0VtcHR5RmllbGRWYWx1ZShmaWVsZFZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlcywgd2hlbiBpbnB1dCB2YWx1ZSBpcyBhbiBzdHJpbmcsIGFycmF5LCBvYmplY3RzIG9yIGFueSBvdGhlciB0eXBlXG4gICAgICAgIGlmICh0eXBlb2YgZmllbGRWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGZpZWxkVmFsdWUgPSBmaWVsZFZhbHVlLnRyaW0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWVsZFZhbHVlID09IG51bGxcbiAgICAgICAgICAgIHx8IHR5cGVvZiBmaWVsZFZhbHVlID09PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgfHwgZmllbGRWYWx1ZSA9PT0gJydcbiAgICAgICAgICAgIHx8IGZpZWxkVmFsdWUubGVuZ3RoID09PSAwO1xuICAgIH1cblxuICAgIGdldExhYmVsKHN0YXRpc3RpY01ldGFkYXRhOiBTdGF0aXN0aWNNZXRhZGF0YSwgYXR0cmlidXRlOiBzdHJpbmcpOiBzdHJpbmcge1xuXG4gICAgICAgIGxldCBsYWJlbCA9ICcnO1xuICAgICAgICBpZiAoc3RhdGlzdGljTWV0YWRhdGEgJiYgc3RhdGlzdGljTWV0YWRhdGFbYXR0cmlidXRlXSkge1xuICAgICAgICAgICAgbGFiZWwgPSB0aGlzLmxhbmd1YWdlLmdldEZpZWxkTGFiZWwoc3RhdGlzdGljTWV0YWRhdGFbYXR0cmlidXRlXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGFiZWw7XG4gICAgfVxuXG4gICAgZ2V0TGF5b3V0KCk6IFN0YXRpc3RpY1dpZGdldExheW91dFJvd1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZFdpZGdldElucHV0LmxheW91dC5yb3dzO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBidWlsZFN0YXRpc3RpY3MoKTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5ncmlkV2lkZ2V0SW5wdXQubGF5b3V0LnJvd3MuZm9yRWFjaChyb3cgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIXJvdy5jb2xzIHx8ICFyb3cuY29scy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJvdy5jb2xzLmZvckVhY2goY29sID0+IHtcblxuICAgICAgICAgICAgICAgIGlmICghY29sLnN0YXRpc3RpYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGNvbC5zdG9yZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRpc3RpY3NbY29sLnN0YXRpc3RpY10gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBjb2wuc3RhdGlzdGljLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmU6IGNvbC5zdG9yZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0aXN0aWNzW2NvbC5zdGF0aXN0aWNdID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBjb2wuc3RhdGlzdGljLFxuICAgICAgICAgICAgICAgICAgICBzdG9yZTogdGhpcy5mYWN0b3J5LmNyZWF0ZSgpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGlzdGljc1tjb2wuc3RhdGlzdGljXS5zdG9yZS5pbml0KFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWRXaWRnZXRJbnB1dC5xdWVyeUFyZ3MubW9kdWxlLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGNvbC5zdGF0aXN0aWMsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiB7Li4udGhpcy5ncmlkV2lkZ2V0SW5wdXQucXVlcnlBcmdzLmNvbnRleHR9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7Li4udGhpcy5ncmlkV2lkZ2V0SW5wdXQucXVlcnlBcmdzLnBhcmFtc31cbiAgICAgICAgICAgICAgICAgICAgfSBhcyBTdGF0aXN0aWNzUXVlcnksXG4gICAgICAgICAgICAgICAgKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldHVwTG9hZGluZyQoKTogdm9pZCB7XG5cbiAgICAgICAgY29uc3QgbG9hZGluZ3MkOiBPYnNlcnZhYmxlPGJvb2xlYW4+W10gPSBbXTtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5zdGF0aXN0aWNzKS5mb3JFYWNoKHR5cGUgPT4gbG9hZGluZ3MkLnB1c2godGhpcy5zdGF0aXN0aWNzW3R5cGVdLnN0b3JlLmxvYWRpbmckKSk7XG5cbiAgICAgICAgdGhpcy5sb2FkaW5nJCA9IGNvbWJpbmVMYXRlc3QobG9hZGluZ3MkKS5waXBlKG1hcCgobG9hZGluZ3MpID0+IHtcblxuICAgICAgICAgICAgaWYgKCFsb2FkaW5ncyB8fCBsb2FkaW5ncy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgbG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIGxvYWRpbmdzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgIGxvYWRpbmcgPSBsb2FkaW5nICYmIHZhbHVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGxvYWRpbmc7XG5cbiAgICAgICAgICAgIHJldHVybiBsb2FkaW5nO1xuICAgICAgICB9KSk7XG4gICAgICAgIHRoaXMuc3Vicy5wdXNoKHRoaXMubG9hZGluZyQuc3Vic2NyaWJlKCkpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXR1cFJlbG9hZCgpOiB2b2lkIHtcblxuICAgICAgICBpZiAodGhpcy5ncmlkV2lkZ2V0SW5wdXQud2lkZ2V0Q29uZmlnLnJlbG9hZCQpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vicy5wdXNoKHRoaXMuZ3JpZFdpZGdldElucHV0LndpZGdldENvbmZpZy5yZWxvYWQkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubG9hZGluZyA9PT0gZmFsc2UpIHtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnN0YXRpc3RpY3MpLmZvckVhY2goc3RhdGlzdGljS2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRpc3RpYyA9IHRoaXMuc3RhdGlzdGljc1tzdGF0aXN0aWNLZXldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXN0YXRpc3RpYy5zdG9yZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGlzdGljLnN0b3JlLmxvYWQoZmFsc2UpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXR1cFZNKCk6IHZvaWQge1xuXG4gICAgICAgIGxldCBhbGxTdGF0aXN0aWNzJDogT2JzZXJ2YWJsZTxTaW5nbGVWYWx1ZVN0YXRpc3RpY3NTdGF0ZVtdPiA9IG9mKFtdKS5waXBlKHNoYXJlUmVwbGF5KCkpO1xuICAgICAgICBjb25zdCBsYXlvdXQkID0gb2YodGhpcy5nZXRMYXlvdXQoKSkucGlwZShzaGFyZVJlcGxheSgpKTtcblxuICAgICAgICBpZiAodGhpcy5zdGF0aXN0aWNzICYmIE9iamVjdC5rZXlzKHRoaXMuc3RhdGlzdGljcykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGlzdGljcyQ6IE9ic2VydmFibGU8U2luZ2xlVmFsdWVTdGF0aXN0aWNzU3RhdGU+W10gPSBbXTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuc3RhdGlzdGljcykuZm9yRWFjaCh0eXBlID0+IHN0YXRpc3RpY3MkLnB1c2godGhpcy5zdGF0aXN0aWNzW3R5cGVdLnN0b3JlLnN0YXRlJCkpO1xuICAgICAgICAgICAgYWxsU3RhdGlzdGljcyQgPSBjb21iaW5lTGF0ZXN0KHN0YXRpc3RpY3MkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudm0kID0gY29tYmluZUxhdGVzdChbYWxsU3RhdGlzdGljcyQsIGxheW91dCRdKS5waXBlKFxuICAgICAgICAgICAgbWFwKChbc3RhdGlzdGljcywgbGF5b3V0XSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdHNNYXA6IHsgW2tleTogc3RyaW5nXTogU2luZ2xlVmFsdWVTdGF0aXN0aWNzU3RhdGUgfSA9IHt9O1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvb2x0aXBUaXRsZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbnMgPSBbXTtcblxuICAgICAgICAgICAgICAgIHN0YXRpc3RpY3MuZm9yRWFjaCh2YWx1ZSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgc3RhdHNNYXBbdmFsdWUucXVlcnkua2V5XSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvb2x0aXAgPSB0aGlzLmdldExhYmVsKHZhbHVlLnN0YXRpc3RpYy5tZXRhZGF0YSwgJ3Rvb2x0aXBfdGl0bGVfa2V5Jyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b29sdGlwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwVGl0bGVzLnB1c2godG9vbHRpcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRoaXMuZ2V0TGFiZWwodmFsdWUuc3RhdGlzdGljLm1ldGFkYXRhLCAnZGVzY3JpcHRpb25LZXknKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbnMucHVzaChkZXNjcmlwdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBsYXlvdXQsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRpc3RpY3M6IHN0YXRzTWFwLFxuICAgICAgICAgICAgICAgICAgICB0b29sdGlwVGl0bGVUZXh0OiB0b29sdGlwVGl0bGVzLmpvaW4oJyB8ICcpLFxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb25zLmpvaW4oJyB8ICcpLFxuICAgICAgICAgICAgICAgIH0gYXMgR3JpZFdpZGdldFN0YXRlO1xuICAgICAgICAgICAgfSkpO1xuICAgIH1cblxufVxuIl19