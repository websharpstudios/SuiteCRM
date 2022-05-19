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
import { BaseWidgetComponent } from '../../../widgets/base-widget.model';
import { SingleValueStatisticsStoreFactory } from '../../../../store/single-value-statistics/single-value-statistics.store.factory';
import { map, take } from 'rxjs/operators';
import { LanguageStore } from '../../../../store/language/language.store';
import { combineLatest } from 'rxjs';
export class StatisticsTopWidgetComponent extends BaseWidgetComponent {
    constructor(language, factory) {
        super();
        this.language = language;
        this.factory = factory;
        this.statistics = {};
        this.loading = true;
        this.subs = [];
    }
    ngOnInit() {
        if (!this.context || !this.context.module) {
            this.messageLabelKey = 'LBL_CONFIG_BAD_CONTEXT';
            return;
        }
        if (!this.config) {
            this.messageLabelKey = 'LBL_CONFIG_NO_CONFIG';
            return;
        }
        if (!this.config.options || !this.config.options.statistics || !this.config.options.statistics.length) {
            this.messageLabelKey = 'LBL_CONFIG_NO_STATISTICS_KEY';
            return;
        }
        if (this.context$) {
            this.subs.push(this.context$.subscribe((context) => {
                this.context = context;
            }));
        }
        const statistics$ = [];
        const loadings$ = [];
        this.config.options.statistics.forEach(statistic => {
            if (!statistic.type) {
                return;
            }
            this.statistics[statistic.type] = {
                labelKey: statistic.labelKey || '',
                endLabelKey: statistic.endLabelKey || '',
                type: statistic.type,
                store: this.factory.create()
            };
            this.statistics[statistic.type].store.init(this.context.module, {
                key: statistic.type,
                context: Object.assign({}, this.context)
            }).pipe(take(1)).subscribe();
            statistics$.push(this.statistics[statistic.type].store.state$);
            loadings$.push(this.statistics[statistic.type].store.loading$);
        });
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
        this.vm$ = combineLatest([combineLatest(statistics$), this.language.appStrings$]).pipe(map(([statistics, appStrings]) => {
            const statsMap = {};
            statistics.forEach(value => {
                statsMap[value.query.key] = value;
                this.statistics[value.query.key].labelKey = this.getMetadataEntry(value, 'labelKey');
                this.statistics[value.query.key].endLabelKey = this.getMetadataEntry(value, 'endLabelKey');
            });
            return {
                statistics: statsMap,
                appStrings
            };
        }));
        if (this.config.reload$) {
            this.subs.push(this.config.reload$.subscribe(() => {
                if (this.loading === false) {
                    this.loading = true;
                    this.config.options.statistics.forEach(statistic => {
                        if (!statistic.type) {
                            return;
                        }
                        if (!this.statistics[statistic.type] || !this.statistics[statistic.type].store) {
                            return;
                        }
                        this.statistics[statistic.type].store.load(false).pipe(take(1)).subscribe();
                    });
                }
            }));
        }
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    getMetadataEntry(stat, name) {
        const value = stat.statistic.metadata && stat.statistic.metadata[name];
        if (value !== null && typeof value !== 'undefined') {
            return value;
        }
        return this.statistics[stat.query.key][name];
    }
    getLabel(key) {
        const context = this.context || {};
        const module = context.module || '';
        return this.language.getFieldLabel(key, module);
    }
}
StatisticsTopWidgetComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-statistics-top-widget',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<div *ngIf=\"(vm$ | async) as vm\"\n     class=\"d-flex justify-content-center widget-bar rounded\">\n    <div class=\"p-2 widget-bar-entry-message\" *ngIf=\"this.messageLabelKey\">\n        {{vm.appStrings[this.messageLabelKey] || '' | uppercase}}\n    </div>\n    <ng-container *ngFor=\"let item of statistics | keyvalue\">\n\n        <div class=\"d-flex justify-content-center align-items-baseline widget-bar-entry p-2\">\n\n            <div class=\"pr-1 widget-bar-entry-label\" *ngIf=\"item.value.labelKey && getLabel(item.value.labelKey)\">\n                {{getLabel(item.value.labelKey) | uppercase}}:\n            </div>\n\n            <ng-container *ngIf=\"item.key && vm.statistics[item.key]\">\n\n                <div class=\"pl-1 pr-1 widget-bar-entry-value\"\n                     *ngIf=\"!vm.statistics[item.key].loading && vm.statistics[item.key].field\">\n                    <scrm-field [type]=\"vm.statistics[item.key].field.type\" [field]=\"vm.statistics[item.key].field\"\n                                mode=\"list\"></scrm-field>\n                </div>\n\n            </ng-container>\n\n\n            <div class=\"pl-1 pr-1 widget-bar-entry-loading\" *ngIf=\"(item.value.store.loading$ | async) as loading\">\n                <scrm-inline-loading-spinner></scrm-inline-loading-spinner>\n\n                <ng-container *ngIf=\"!loading && (!item.key || !vm.statistics[item.key])\">\n                    -\n                </ng-container>\n            </div>\n\n            <div class=\"pl-1 widget-bar-entry-end-label\"\n                 *ngIf=\"item.value.endLabelKey && getLabel(item.value.endLabelKey)\">\n                {{getLabel(item.value.endLabelKey) | uppercase}}\n            </div>\n\n        </div>\n\n    </ng-container>\n</div>\n"
            },] }
];
StatisticsTopWidgetComponent.ctorParameters = () => [
    { type: LanguageStore },
    { type: SingleValueStatisticsStoreFactory }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGlzdGljcy10b3Atd2lkZ2V0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb250YWluZXJzL3RvcC13aWRnZXQvY29tcG9uZW50cy9zdGF0aXN0aWNzLXRvcC13aWRnZXQvc3RhdGlzdGljcy10b3Atd2lkZ2V0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBb0IsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFFdkUsT0FBTyxFQUFDLGlDQUFpQyxFQUFDLE1BQU0saUZBQWlGLENBQUM7QUFDbEksT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUMsYUFBYSxFQUFvQixNQUFNLDJDQUEyQyxDQUFDO0FBQzNGLE9BQU8sRUFBQyxhQUFhLEVBQTJCLE1BQU0sTUFBTSxDQUFDO0FBMEI3RCxNQUFNLE9BQU8sNEJBQTZCLFNBQVEsbUJBQW1CO0lBUWpFLFlBQ2MsUUFBdUIsRUFDdkIsT0FBMEM7UUFFcEQsS0FBSyxFQUFFLENBQUM7UUFIRSxhQUFRLEdBQVIsUUFBUSxDQUFlO1FBQ3ZCLFlBQU8sR0FBUCxPQUFPLENBQW1DO1FBVHhELGVBQVUsR0FBdUIsRUFBRSxDQUFDO1FBSTFCLFlBQU8sR0FBRyxJQUFJLENBQUM7UUFDZixTQUFJLEdBQW1CLEVBQUUsQ0FBQztJQU9wQyxDQUFDO0lBR0QsUUFBUTtRQUVKLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDdkMsSUFBSSxDQUFDLGVBQWUsR0FBRyx3QkFBd0IsQ0FBQztZQUNo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TUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFpQixDQUFDO1FBQ2xELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1FBRXBDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3BELENBQUM7OztZQXZKSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLDRCQUE0QjtnQkFDdEMsdWxHQUFxRDthQUV4RDs7O1lBMUJPLGFBQWE7WUFGYixpQ0FBaUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBPbkRlc3Ryb3ksIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Jhc2VXaWRnZXRDb21wb25lbnR9IGZyb20gJy4uLy4uLy4uL3dpZGdldHMvYmFzZS13aWRnZXQubW9kZWwnO1xuaW1wb3J0IHtTaW5nbGVWYWx1ZVN0YXRpc3RpY3NTdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvc2luZ2xlLXZhbHVlLXN0YXRpc3RpY3Mvc2luZ2xlLXZhbHVlLXN0YXRpc3RpY3Muc3RvcmUnO1xuaW1wb3J0IHtTaW5nbGVWYWx1ZVN0YXRpc3RpY3NTdG9yZUZhY3Rvcnl9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3NpbmdsZS12YWx1ZS1zdGF0aXN0aWNzL3NpbmdsZS12YWx1ZS1zdGF0aXN0aWNzLnN0b3JlLmZhY3RvcnknO1xuaW1wb3J0IHttYXAsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZSwgTGFuZ3VhZ2VTdHJpbmdNYXB9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL2xhbmd1YWdlL2xhbmd1YWdlLnN0b3JlJztcbmltcG9ydCB7Y29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7U3RhdGlzdGljc1F1ZXJ5fSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtWaWV3Q29udGV4dH0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7U2luZ2xlVmFsdWVTdGF0aXN0aWNzU3RhdGV9IGZyb20gJ2NvbW1vbic7XG5cbmludGVyZmFjZSBTdGF0aXN0aWNzVG9wV2lkZ2V0U3RhdGUge1xuICAgIHN0YXRpc3RpY3M6IHsgW2tleTogc3RyaW5nXTogU2luZ2xlVmFsdWVTdGF0aXN0aWNzU3RhdGUgfTtcbiAgICBhcHBTdHJpbmdzOiBMYW5ndWFnZVN0cmluZ01hcDtcbn1cblxuaW50ZXJmYWNlIFN0YXRpc3RpY3NFbnRyeSB7XG4gICAgbGFiZWxLZXk6IHN0cmluZztcbiAgICBlbmRMYWJlbEtleT86IHN0cmluZztcbiAgICB0eXBlOiBzdHJpbmc7XG4gICAgc3RvcmU6IFNpbmdsZVZhbHVlU3RhdGlzdGljc1N0b3JlO1xufVxuXG5pbnRlcmZhY2UgU3RhdGlzdGljc0VudHJ5TWFwIHtcbiAgICBba2V5OiBzdHJpbmddOiBTdGF0aXN0aWNzRW50cnk7XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1zdGF0aXN0aWNzLXRvcC13aWRnZXQnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9zdGF0aXN0aWNzLXRvcC13aWRnZXQuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlczogW11cbn0pXG5leHBvcnQgY2xhc3MgU3RhdGlzdGljc1RvcFdpZGdldENvbXBvbmVudCBleHRlbmRzIEJhc2VXaWRnZXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgc3RhdGlzdGljczogU3RhdGlzdGljc0VudHJ5TWFwID0ge307XG4gICAgdm0kOiBPYnNlcnZhYmxlPFN0YXRpc3RpY3NUb3BXaWRnZXRTdGF0ZT47XG4gICAgbWVzc2FnZUxhYmVsS2V5OiBzdHJpbmc7XG4gICAgbG9hZGluZyQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgcHJvdGVjdGVkIGxvYWRpbmcgPSB0cnVlO1xuICAgIHByb3RlY3RlZCBzdWJzOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBsYW5ndWFnZTogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIGZhY3Rvcnk6IFNpbmdsZVZhbHVlU3RhdGlzdGljc1N0b3JlRmFjdG9yeVxuICAgICkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNvbnRleHQgfHwgIXRoaXMuY29udGV4dC5tb2R1bGUpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZUxhYmVsS2V5ID0gJ0xCTF9DT05GSUdfQkFEX0NPTlRFWFQnO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZykge1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlTGFiZWxLZXkgPSAnTEJMX0NPTkZJR19OT19DT05GSUcnO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5vcHRpb25zIHx8ICF0aGlzLmNvbmZpZy5vcHRpb25zLnN0YXRpc3RpY3MgfHwgIXRoaXMuY29uZmlnLm9wdGlvbnMuc3RhdGlzdGljcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZUxhYmVsS2V5ID0gJ0xCTF9DT05GSUdfTk9fU1RBVElTVElDU19LRVknO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29udGV4dCQpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vicy5wdXNoKHRoaXMuY29udGV4dCQuc3Vic2NyaWJlKChjb250ZXh0OiBWaWV3Q29udGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGF0aXN0aWNzJDogT2JzZXJ2YWJsZTxTaW5nbGVWYWx1ZVN0YXRpc3RpY3NTdGF0ZT5bXSA9IFtdO1xuICAgICAgICBjb25zdCBsb2FkaW5ncyQ6IE9ic2VydmFibGU8Ym9vbGVhbj5bXSA9IFtdO1xuICAgICAgICB0aGlzLmNvbmZpZy5vcHRpb25zLnN0YXRpc3RpY3MuZm9yRWFjaChzdGF0aXN0aWMgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIXN0YXRpc3RpYy50eXBlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnN0YXRpc3RpY3Nbc3RhdGlzdGljLnR5cGVdID0ge1xuICAgICAgICAgICAgICAgIGxhYmVsS2V5OiBzdGF0aXN0aWMubGFiZWxLZXkgfHwgJycsXG4gICAgICAgICAgICAgICAgZW5kTGFiZWxLZXk6IHN0YXRpc3RpYy5lbmRMYWJlbEtleSB8fCAnJyxcbiAgICAgICAgICAgICAgICB0eXBlOiBzdGF0aXN0aWMudHlwZSxcbiAgICAgICAgICAgICAgICBzdG9yZTogdGhpcy5mYWN0b3J5LmNyZWF0ZSgpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnN0YXRpc3RpY3Nbc3RhdGlzdGljLnR5cGVdLnN0b3JlLmluaXQoXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Lm1vZHVsZSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogc3RhdGlzdGljLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHsuLi50aGlzLmNvbnRleHR9XG4gICAgICAgICAgICAgICAgfSBhcyBTdGF0aXN0aWNzUXVlcnksXG4gICAgICAgICAgICApLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCk7XG5cbiAgICAgICAgICAgIHN0YXRpc3RpY3MkLnB1c2godGhpcy5zdGF0aXN0aWNzW3N0YXRpc3RpYy50eXBlXS5zdG9yZS5zdGF0ZSQpO1xuICAgICAgICAgICAgbG9hZGluZ3MkLnB1c2godGhpcy5zdGF0aXN0aWNzW3N0YXRpc3RpYy50eXBlXS5zdG9yZS5sb2FkaW5nJCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubG9hZGluZyQgPSBjb21iaW5lTGF0ZXN0KGxvYWRpbmdzJCkucGlwZShtYXAoKGxvYWRpbmdzKSA9PiB7XG5cbiAgICAgICAgICAgIGlmICghbG9hZGluZ3MgfHwgbG9hZGluZ3MubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBsb2FkaW5ncy5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICBsb2FkaW5nID0gbG9hZGluZyAmJiB2YWx1ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmxvYWRpbmcgPSBsb2FkaW5nO1xuXG4gICAgICAgICAgICByZXR1cm4gbG9hZGluZztcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHRoaXMuc3Vicy5wdXNoKHRoaXMubG9hZGluZyQuc3Vic2NyaWJlKCkpO1xuXG4gICAgICAgIHRoaXMudm0kID0gY29tYmluZUxhdGVzdChbY29tYmluZUxhdGVzdChzdGF0aXN0aWNzJCksIHRoaXMubGFuZ3VhZ2UuYXBwU3RyaW5ncyRdKS5waXBlKFxuICAgICAgICAgICAgbWFwKChbc3RhdGlzdGljcywgYXBwU3RyaW5nc10pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0c01hcDogeyBba2V5OiBzdHJpbmddOiBTaW5nbGVWYWx1ZVN0YXRpc3RpY3NTdGF0ZSB9ID0ge307XG4gICAgICAgICAgICAgICAgc3RhdGlzdGljcy5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHNNYXBbdmFsdWUucXVlcnkua2V5XSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGlzdGljc1t2YWx1ZS5xdWVyeS5rZXldLmxhYmVsS2V5ID0gdGhpcy5nZXRNZXRhZGF0YUVudHJ5KHZhbHVlLCAnbGFiZWxLZXknKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0aXN0aWNzW3ZhbHVlLnF1ZXJ5LmtleV0uZW5kTGFiZWxLZXkgPSB0aGlzLmdldE1ldGFkYXRhRW50cnkodmFsdWUsICdlbmRMYWJlbEtleScpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGlzdGljczogc3RhdHNNYXAsXG4gICAgICAgICAgICAgICAgICAgIGFwcFN0cmluZ3NcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAodGhpcy5jb25maWcucmVsb2FkJCkge1xuICAgICAgICAgICAgdGhpcy5zdWJzLnB1c2godGhpcy5jb25maWcucmVsb2FkJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvYWRpbmcgPT09IGZhbHNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWcub3B0aW9ucy5zdGF0aXN0aWNzLmZvckVhY2goc3RhdGlzdGljID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdGF0aXN0aWMudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRpc3RpY3Nbc3RhdGlzdGljLnR5cGVdIHx8ICF0aGlzLnN0YXRpc3RpY3Nbc3RhdGlzdGljLnR5cGVdLnN0b3JlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRpc3RpY3Nbc3RhdGlzdGljLnR5cGVdLnN0b3JlLmxvYWQoZmFsc2UpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN1YnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICAgIH1cblxuICAgIGdldE1ldGFkYXRhRW50cnkoc3RhdDogU2luZ2xlVmFsdWVTdGF0aXN0aWNzU3RhdGUsIG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gc3RhdC5zdGF0aXN0aWMubWV0YWRhdGEgJiYgc3RhdC5zdGF0aXN0aWMubWV0YWRhdGFbbmFtZV07XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aXN0aWNzW3N0YXQucXVlcnkua2V5XVtuYW1lXTtcbiAgICB9XG5cbiAgICBnZXRMYWJlbChrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmNvbnRleHQgfHwge30gYXMgVmlld0NvbnRleHQ7XG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IGNvbnRleHQubW9kdWxlIHx8ICcnO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmxhbmd1YWdlLmdldEZpZWxkTGFiZWwoa2V5LCBtb2R1bGUpO1xuICAgIH1cblxuXG59XG4iXX0=