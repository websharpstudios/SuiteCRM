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
import { deepClone } from 'common';
import { of } from 'rxjs';
import { LanguageStore } from '../../../../store/language/language.store';
import { BaseWidgetComponent } from '../../../widgets/base-widget.model';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
export class RecordThreadSidebarWidgetComponent extends BaseWidgetComponent {
    constructor(language) {
        super();
        this.language = language;
        this.subs = [];
    }
    ngOnInit() {
        const options = this.config.options || {};
        this.options = options.recordThread || null;
        if (!this.options) {
            return;
        }
        this.initFilters$();
        this.initPresetFields$();
        if (this.context$ && this.context$.subscribe()) {
            this.subs.push(this.context$.subscribe((context) => {
                this.context = context;
            }));
        }
        this.recordThreadConfig = this.getConfig();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    getHeaderLabel() {
        return this.getLabel(this.config.labelKey) || '';
    }
    getLabel(key) {
        const context = this.context || {};
        const module = context.module || '';
        return this.language.getFieldLabel(key, module);
    }
    getConfig() {
        const config = {
            filters$: this.filters$,
            presetFields$: this.presetFields$,
            module: this.options.module,
            klass: this.options.class || '',
            maxListHeight: this.options.maxListHeight || 350,
            direction: this.options.direction || 'asc',
            create: !!this.options.create,
            itemConfig: {
                collapsible: this.options.item.collapsible || false,
                collapseLimit: this.options.item.collapseLimit || null,
                klass: this.options.item.itemClass || '',
                dynamicClass: this.options.item.dynamicClass || [],
                metadata: {}
            },
            createConfig: {
                collapsible: false,
                metadata: {}
            },
        };
        this.setupItemMetadata(config.itemConfig.metadata, this.options.item.layout);
        this.setupItemMetadata(config.createConfig.metadata, this.options.create.layout);
        return config;
    }
    setupItemMetadata(metadata, config) {
        if (config && config.header) {
            metadata.headerLayout = deepClone(config.header);
        }
        if (config && config.body) {
            metadata.bodyLayout = deepClone(config.body);
        }
    }
    initFilters$() {
        if (!this.options || !this.options.filters || !this.context$) {
            return;
        }
        const parentFilters = this.options.filters.parentFilters || {};
        let context$ = of({}).pipe(shareReplay());
        if (Object.keys(parentFilters).length > 0) {
            context$ = this.context$.pipe(filter(context => {
                const record = (context && context.record) || {};
                return !!(record.attributes && Object.keys(record.attributes).length);
            }));
        }
        this.filters$ = context$.pipe(map(context => {
            const filters = { filters: {} };
            this.initParentFilters(context, filters);
            const staticFilters = this.options.filters.static || {};
            filters.filters = Object.assign(Object.assign({}, filters.filters), staticFilters);
            if (this.options.filters.orderBy) {
                filters.orderBy = this.options.filters.orderBy;
            }
            if (this.options.filters.sortOrder) {
                filters.sortOrder = this.options.filters.sortOrder;
            }
            return filters;
        }), distinctUntilChanged());
    }
    initPresetFields$() {
        if (!this.options || !this.options.create || !this.options.create.presetFields || !this.context$) {
            return;
        }
        this.presetFields$ = this.context$.pipe(map(context => {
            const parentValues = this.initParentValues(context);
            const staticValues = this.options.create.presetFields.static || {};
            return Object.assign(Object.assign({}, parentValues), staticValues);
        }), distinctUntilChanged());
    }
    initParentFilters(context, filters) {
        const parentFilters = this.options.filters.parentFilters || {};
        if (!context || !context.record || !parentFilters) {
            return;
        }
        Object.keys(parentFilters).forEach(parentField => {
            const field = parentFilters[parentField];
            const value = context.record.attributes[parentField] || '';
            if (!value) {
                return;
            }
            filters.filters[field] = {
                field: parentFilters,
                operator: '=',
                values: [value],
            };
        });
    }
    initParentValues(context) {
        const parentValues = this.options.create.presetFields.parentValues || {};
        if (!context || !context.record || !parentValues) {
            return;
        }
        const attributes = {};
        Object.keys(parentValues).forEach(parentField => {
            const field = parentValues[parentField];
            const value = context.record.attributes[parentField] || '';
            if (!value) {
                return;
            }
            attributes[field] = value;
        });
        return attributes;
    }
}
RecordThreadSidebarWidgetComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-record-thread-sidebar-widget',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<scrm-widget-panel [title]=\"getHeaderLabel()\">\n    <div class=\"record-thread-sidebar-widget\" widget-body>\n\n        <ng-container *ngIf=\"!options\">\n            <div class=\"p-3 widget-message\">\n                <scrm-label labelKey=\"LBL_BAD_CONFIG\"></scrm-label>\n            </div>\n        </ng-container>\n\n        <ng-container *ngIf=\"options\">\n            <scrm-record-thread [config]=\"recordThreadConfig\"></scrm-record-thread>\n        </ng-container>\n\n    </div>\n</scrm-widget-panel>\n"
            },] }
];
RecordThreadSidebarWidgetComponent.ctorParameters = () => [
    { type: LanguageStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLXRocmVhZC1zaWRlYmFyLXdpZGdldC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29udGFpbmVycy9zaWRlYmFyLXdpZGdldC9jb21wb25lbnRzL3JlY29yZC10aHJlYWQtc2lkZWJhci13aWRnZXQvcmVjb3JkLXRocmVhZC1zaWRlYmFyLXdpZGdldC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBQzNELE9BQU8sRUFBZSxTQUFTLEVBQXVFLE1BQU0sUUFBUSxDQUFDO0FBQ3JILE9BQU8sRUFBYSxFQUFFLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFDbEQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBQ3hFLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBZTlFLE1BQU0sT0FBTyxrQ0FBbUMsU0FBUSxtQkFBbUI7SUFtQ3ZFLFlBQXNCLFFBQXVCO1FBRXpDLEtBQUssRUFBRSxDQUFDO1FBRlUsYUFBUSxHQUFSLFFBQVEsQ0FBZTtRQUZuQyxTQUFJLEdBQW1CLEVBQUUsQ0FBQztJQUtwQyxDQUFDO0lBRUQsUUFBUTtRQUVKLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDO1FBRTVDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2YsT0FB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LENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQzVDLE1BQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN4QyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFM0QsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDUixPQUFPO2FBQ1Y7WUFFRCxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxVQUFVLENBQUM7SUFDdEIsQ0FBQzs7O1lBdE9KLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsbUNBQW1DO2dCQUM3Qyw4MkRBQTREO2FBRS9EOzs7WUFoQk8sYUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIE9uRGVzdHJveSwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QXR0cmlidXRlTWFwLCBkZWVwQ2xvbmUsIFJlY29yZCwgU2VhcmNoQ3JpdGVyaWEsIFNlYXJjaENyaXRlcmlhRmlsdGVyLCBTdHJpbmdNYXAsIFZpZXdDb250ZXh0fSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBvZiwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtCYXNlV2lkZ2V0Q29tcG9uZW50fSBmcm9tICcuLi8uLi8uLi93aWRnZXRzL2Jhc2Utd2lkZ2V0Lm1vZGVsJztcbmltcG9ydCB7ZGlzdGluY3RVbnRpbENoYW5nZWQsIGZpbHRlciwgbWFwLCBzaGFyZVJlcGxheX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtSZWNvcmRUaHJlYWRDb25maWd9IGZyb20gJy4uLy4uLy4uL3JlY29yZC10aHJlYWQvY29tcG9uZW50cy9yZWNvcmQtdGhyZWFkL3JlY29yZC10aHJlYWQubW9kZWwnO1xuaW1wb3J0IHtGaWVsZEZsZXhib3h9IGZyb20gJy4uLy4uLy4uLy4uL2NvbXBvbmVudHMvcmVjb3JkLWZsZXhib3gvcmVjb3JkLWZsZXhib3gubW9kZWwnO1xuaW1wb3J0IHtSZWNvcmRUaHJlYWRJdGVtTWV0YWRhdGF9IGZyb20gJy4uLy4uLy4uL3JlY29yZC10aHJlYWQvc3RvcmUvcmVjb3JkLXRocmVhZC9yZWNvcmQtdGhyZWFkLWl0ZW0uc3RvcmUubW9kZWwnO1xuXG5pbnRlcmZhY2UgVGhyZWFkSXRlbU1ldGFkYXRhQ29uZmlnIHtcbiAgICBoZWFkZXI/OiBGaWVsZEZsZXhib3g7XG4gICAgYm9keT86IEZpZWxkRmxleGJveDtcbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLXJlY29yZC10aHJlYWQtc2lkZWJhci13aWRnZXQnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9yZWNvcmQtdGhyZWFkLXNpZGViYXItd2lkZ2V0LmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFJlY29yZFRocmVhZFNpZGViYXJXaWRnZXRDb21wb25lbnQgZXh0ZW5kcyBCYXNlV2lkZ2V0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG5cbiAgICBvcHRpb25zOiB7XG4gICAgICAgIG1vZHVsZTogc3RyaW5nO1xuICAgICAgICBjbGFzcz86IHN0cmluZztcbiAgICAgICAgbWF4TGlzdEhlaWdodD86IG51bWJlcjtcbiAgICAgICAgZGlyZWN0aW9uPzogJ2FzYycgfCAnZGVzYyc7XG4gICAgICAgIGl0ZW06IHtcbiAgICAgICAgICAgIGR5bmFtaWNDbGFzcz86IHN0cmluZ1tdO1xuICAgICAgICAgICAgaXRlbUNsYXNzPzogc3RyaW5nO1xuICAgICAgICAgICAgY29sbGFwc2libGU/OiBib29sZWFuO1xuICAgICAgICAgICAgY29sbGFwc2VMaW1pdD86IG51bWJlcjtcbiAgICAgICAgICAgIGxheW91dD86IFRocmVhZEl0ZW1NZXRhZGF0YUNvbmZpZztcbiAgICAgICAgfSxcbiAgICAgICAgY3JlYXRlOiB7XG4gICAgICAgICAgICBwcmVzZXRGaWVsZHM/OiB7XG4gICAgICAgICAgICAgICAgcGFyZW50VmFsdWVzPzogU3RyaW5nTWFwO1xuICAgICAgICAgICAgICAgIHN0YXRpYz86IEF0dHJpYnV0ZU1hcDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsYXlvdXQ/OiBUaHJlYWRJdGVtTWV0YWRhdGFDb25maWc7XG4gICAgICAgIH0sXG4gICAgICAgIGZpbHRlcnM/OiB7XG4gICAgICAgICAgICBwYXJlbnRGaWx0ZXJzPzogU3RyaW5nTWFwO1xuICAgICAgICAgICAgc3RhdGljPzogU2VhcmNoQ3JpdGVyaWFGaWx0ZXI7XG4gICAgICAgICAgICBvcmRlckJ5Pzogc3RyaW5nO1xuICAgICAgICAgICAgc29ydE9yZGVyPzogc3RyaW5nO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgcmVjb3JkVGhyZWFkQ29uZmlnOiBSZWNvcmRUaHJlYWRDb25maWc7XG5cbiAgICBmaWx0ZXJzJDogT2JzZXJ2YWJsZTxTZWFyY2hDcml0ZXJpYT47XG4gICAgcHJlc2V0RmllbGRzJDogT2JzZXJ2YWJsZTxBdHRyaWJ1dGVNYXA+O1xuICAgIHByb3RlY3RlZCBzdWJzOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGxhbmd1YWdlOiBMYW5ndWFnZVN0b3JlXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuY29uZmlnLm9wdGlvbnMgfHwge307XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMucmVjb3JkVGhyZWFkIHx8IG51bGw7XG5cbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5pdEZpbHRlcnMkKCk7XG4gICAgICAgIHRoaXMuaW5pdFByZXNldEZpZWxkcyQoKTtcblxuICAgICAgICBpZiAodGhpcy5jb250ZXh0JCAmJiB0aGlzLmNvbnRleHQkLnN1YnNjcmliZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnMucHVzaCh0aGlzLmNvbnRleHQkLnN1YnNjcmliZSgoY29udGV4dDogVmlld0NvbnRleHQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWNvcmRUaHJlYWRDb25maWcgPSB0aGlzLmdldENvbmZpZygpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN1YnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICAgIH1cblxuICAgIGdldEhlYWRlckxhYmVsKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldExhYmVsKHRoaXMuY29uZmlnLmxhYmVsS2V5KSB8fCAnJztcbiAgICB9XG5cbiAgICBnZXRMYWJlbChrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmNvbnRleHQgfHwge30gYXMgVmlld0NvbnRleHQ7XG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IGNvbnRleHQubW9kdWxlIHx8ICcnO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmxhbmd1YWdlLmdldEZpZWxkTGFiZWwoa2V5LCBtb2R1bGUpO1xuICAgIH1cblxuICAgIGdldENvbmZpZygpOiBSZWNvcmRUaHJlYWRDb25maWcge1xuXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgICAgIGZpbHRlcnMkOiB0aGlzLmZpbHRlcnMkLFxuICAgICAgICAgICAgcHJlc2V0RmllbGRzJDogdGhpcy5wcmVzZXRGaWVsZHMkLFxuICAgICAgICAgICAgbW9kdWxlOiB0aGlzLm9wdGlvbnMubW9kdWxlLFxuICAgICAgICAgICAga2xhc3M6IHRoaXMub3B0aW9ucy5jbGFzcyB8fCAnJyxcbiAgICAgICAgICAgIG1heExpc3RIZWlnaHQ6IHRoaXMub3B0aW9ucy5tYXhMaXN0SGVpZ2h0IHx8IDM1MCxcbiAgICAgICAgICAgIGRpcmVjdGlvbjogdGhpcy5vcHRpb25zLmRpcmVjdGlvbiB8fCAnYXNjJyxcbiAgICAgICAgICAgIGNyZWF0ZTogISF0aGlzLm9wdGlvbnMuY3JlYXRlLFxuICAgICAgICAgICAgaXRlbUNvbmZpZzoge1xuICAgICAgICAgICAgICAgIGNvbGxhcHNpYmxlOiB0aGlzLm9wdGlvbnMuaXRlbS5jb2xsYXBzaWJsZSB8fCBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb2xsYXBzZUxpbWl0OiB0aGlzLm9wdGlvbnMuaXRlbS5jb2xsYXBzZUxpbWl0IHx8IG51bGwsXG4gICAgICAgICAgICAgICAga2xhc3M6IHRoaXMub3B0aW9ucy5pdGVtLml0ZW1DbGFzcyB8fCAnJyxcbiAgICAgICAgICAgICAgICBkeW5hbWljQ2xhc3M6IHRoaXMub3B0aW9ucy5pdGVtLmR5bmFtaWNDbGFzcyB8fCBbXSxcbiAgICAgICAgICAgICAgICBtZXRhZGF0YToge30gYXMgUmVjb3JkVGhyZWFkSXRlbU1ldGFkYXRhXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3JlYXRlQ29uZmlnOiB7XG4gICAgICAgICAgICAgICAgY29sbGFwc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG1ldGFkYXRhOiB7fSBhcyBSZWNvcmRUaHJlYWRJdGVtTWV0YWRhdGFcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0gYXMgUmVjb3JkVGhyZWFkQ29uZmlnO1xuXG4gICAgICAgIHRoaXMuc2V0dXBJdGVtTWV0YWRhdGEoY29uZmlnLml0ZW1Db25maWcubWV0YWRhdGEsIHRoaXMub3B0aW9ucy5pdGVtLmxheW91dCk7XG4gICAgICAgIHRoaXMuc2V0dXBJdGVtTWV0YWRhdGEoY29uZmlnLmNyZWF0ZUNvbmZpZy5tZXRhZGF0YSwgdGhpcy5vcHRpb25zLmNyZWF0ZS5sYXlvdXQpO1xuXG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldHVwSXRlbU1ldGFkYXRhKG1ldGFkYXRhOiBSZWNvcmRUaHJlYWRJdGVtTWV0YWRhdGEsIGNvbmZpZzogVGhyZWFkSXRlbU1ldGFkYXRhQ29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcgJiYgY29uZmlnLmhlYWRlcikge1xuICAgICAgICAgICAgbWV0YWRhdGEuaGVhZGVyTGF5b3V0ID0gZGVlcENsb25lKGNvbmZpZy5oZWFkZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZyAmJiBjb25maWcuYm9keSkge1xuICAgICAgICAgICAgbWV0YWRhdGEuYm9keUxheW91dCA9IGRlZXBDbG9uZShjb25maWcuYm9keSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdEZpbHRlcnMkKCkge1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucyB8fCAhdGhpcy5vcHRpb25zLmZpbHRlcnMgfHwgIXRoaXMuY29udGV4dCQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhcmVudEZpbHRlcnMgPSB0aGlzLm9wdGlvbnMuZmlsdGVycy5wYXJlbnRGaWx0ZXJzIHx8IHt9IGFzIFN0cmluZ01hcDtcblxuICAgICAgICBsZXQgY29udGV4dCQgPSBvZih7fSkucGlwZShzaGFyZVJlcGxheSgpKTtcblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMocGFyZW50RmlsdGVycykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29udGV4dCQgPSB0aGlzLmNvbnRleHQkLnBpcGUoXG4gICAgICAgICAgICAgICAgZmlsdGVyKGNvbnRleHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWNvcmQgPSAoY29udGV4dCAmJiBjb250ZXh0LnJlY29yZCkgfHwge30gYXMgUmVjb3JkO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gISEocmVjb3JkLmF0dHJpYnV0ZXMgJiYgT2JqZWN0LmtleXMocmVjb3JkLmF0dHJpYnV0ZXMpLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZpbHRlcnMkID0gY29udGV4dCQucGlwZShcbiAgICAgICAgICAgIG1hcChjb250ZXh0ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJzID0ge2ZpbHRlcnM6IHt9IGFzIFNlYXJjaENyaXRlcmlhRmlsdGVyfSBhcyBTZWFyY2hDcml0ZXJpYTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFBhcmVudEZpbHRlcnMoY29udGV4dCwgZmlsdGVycyk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzdGF0aWNGaWx0ZXJzID0gdGhpcy5vcHRpb25zLmZpbHRlcnMuc3RhdGljIHx8IHt9IGFzIFNlYXJjaENyaXRlcmlhRmlsdGVyO1xuXG4gICAgICAgICAgICAgICAgZmlsdGVycy5maWx0ZXJzID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi5maWx0ZXJzLmZpbHRlcnMsXG4gICAgICAgICAgICAgICAgICAgIC4uLnN0YXRpY0ZpbHRlcnNcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5maWx0ZXJzLm9yZGVyQnkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVycy5vcmRlckJ5ID0gdGhpcy5vcHRpb25zLmZpbHRlcnMub3JkZXJCeTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZpbHRlcnMuc29ydE9yZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcnMuc29ydE9yZGVyID0gdGhpcy5vcHRpb25zLmZpbHRlcnMuc29ydE9yZGVyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJzO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGluaXRQcmVzZXRGaWVsZHMkKCkge1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucyB8fCAhdGhpcy5vcHRpb25zLmNyZWF0ZSB8fCAhdGhpcy5vcHRpb25zLmNyZWF0ZS5wcmVzZXRGaWVsZHMgfHwgIXRoaXMuY29udGV4dCQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdGhpcy5wcmVzZXRGaWVsZHMkID0gdGhpcy5jb250ZXh0JC5waXBlKFxuICAgICAgICAgICAgbWFwKGNvbnRleHQgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcGFyZW50VmFsdWVzID0gdGhpcy5pbml0UGFyZW50VmFsdWVzKGNvbnRleHQpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdGljVmFsdWVzID0gdGhpcy5vcHRpb25zLmNyZWF0ZS5wcmVzZXRGaWVsZHMuc3RhdGljIHx8IHt9IGFzIEF0dHJpYnV0ZU1hcDtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAuLi5wYXJlbnRWYWx1ZXMsXG4gICAgICAgICAgICAgICAgICAgIC4uLnN0YXRpY1ZhbHVlc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdFBhcmVudEZpbHRlcnMoY29udGV4dCwgZmlsdGVycykge1xuXG4gICAgICAgIGNvbnN0IHBhcmVudEZpbHRlcnMgPSB0aGlzLm9wdGlvbnMuZmlsdGVycy5wYXJlbnRGaWx0ZXJzIHx8IHt9IGFzIFN0cmluZ01hcDtcbiAgICAgICAgaWYgKCFjb250ZXh0IHx8ICFjb250ZXh0LnJlY29yZCB8fCAhcGFyZW50RmlsdGVycykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmtleXMocGFyZW50RmlsdGVycykuZm9yRWFjaChwYXJlbnRGaWVsZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9IHBhcmVudEZpbHRlcnNbcGFyZW50RmllbGRdO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb250ZXh0LnJlY29yZC5hdHRyaWJ1dGVzW3BhcmVudEZpZWxkXSB8fCAnJztcblxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmlsdGVycy5maWx0ZXJzW2ZpZWxkXSA9IHtcbiAgICAgICAgICAgICAgICBmaWVsZDogcGFyZW50RmlsdGVycyxcbiAgICAgICAgICAgICAgICBvcGVyYXRvcjogJz0nLFxuICAgICAgICAgICAgICAgIHZhbHVlczogW3ZhbHVlXSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGluaXRQYXJlbnRWYWx1ZXMoY29udGV4dDogVmlld0NvbnRleHQpOiBBdHRyaWJ1dGVNYXAge1xuXG4gICAgICAgIGNvbnN0IHBhcmVudFZhbHVlcyA9IHRoaXMub3B0aW9ucy5jcmVhdGUucHJlc2V0RmllbGRzLnBhcmVudFZhbHVlcyB8fCB7fSBhcyBTdHJpbmdNYXA7XG4gICAgICAgIGlmICghY29udGV4dCB8fCAhY29udGV4dC5yZWNvcmQgfHwgIXBhcmVudFZhbHVlcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXR0cmlidXRlcyA9IHt9IGFzIEF0dHJpYnV0ZU1hcDtcblxuICAgICAgICBPYmplY3Qua2V5cyhwYXJlbnRWYWx1ZXMpLmZvckVhY2gocGFyZW50RmllbGQgPT4ge1xuICAgICAgICAgICAgY29uc3QgZmllbGQgPSBwYXJlbnRWYWx1ZXNbcGFyZW50RmllbGRdO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb250ZXh0LnJlY29yZC5hdHRyaWJ1dGVzW3BhcmVudEZpZWxkXSB8fCAnJztcblxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXR0cmlidXRlc1tmaWVsZF0gPSB2YWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXM7XG4gICAgfVxuXG59XG4iXX0=