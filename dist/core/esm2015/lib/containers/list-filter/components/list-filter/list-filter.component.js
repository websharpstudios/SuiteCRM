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
import { of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ListFilterStoreFactory } from '../../store/list-filter/list-filter.store.factory';
import { SavedFilterActionAdapterFactory } from '../../adapters/actions.adapter.factory';
export class ListFilterComponent {
    constructor(storeFactory, actionAdapterFactory) {
        this.storeFactory = storeFactory;
        this.actionAdapterFactory = actionAdapterFactory;
        this.store = storeFactory.create();
        this.filterActionsAdapter = actionAdapterFactory.create(this.store.filterStore, this.store);
    }
    ngOnInit() {
        this.store.init(this.config);
        this.vm$ = this.store.vm$.pipe(map(([savedFilter]) => {
            const record = Object.assign({}, savedFilter);
            record.fields = savedFilter.criteriaFields;
            return record;
        }));
    }
    ngOnDestroy() {
        this.store.clear();
        this.store = null;
    }
    getGridConfig() {
        return {
            record$: this.store.filterStore.stagingRecord$,
            mode$: this.store.filterStore.mode$,
            fields$: this.store.filterStore.getViewFieldsKeys$(),
            actions: this.filterActionsAdapter,
            appendActions: true,
            klass: 'mt-2 p-2 saved-search-container rounded',
            buttonClass: 'btn btn-outline-danger btn-sm',
            labelDisplay: 'inline',
            maxColumns$: of(4).pipe(shareReplay(1)),
            sizeMap$: of({
                handset: 1,
                tablet: 2,
                web: 3,
                wide: 4
            }).pipe(shareReplay(1)),
        };
    }
}
ListFilterComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-list-filter',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<scrm-panel [titleKey]=\"'LBL_BASIC_FILTER'\"\n            [close]=\"store.closeButton\"\n            [isCollapsed$]=\"store.isCollapsed$\"\n            [mode]=\"store.panelMode\"\n            klass=\"filter-panel {{ (config && config.klass) || ''}}\"\n            *ngIf=\"(vm$ | async) as vm\">\n\n    <div *ngIf=\"store.myFilterButton\" panel-header-button>\n        <scrm-dropdown-button [config]=\"store.myFilterButton\"></scrm-dropdown-button>\n    </div>\n\n    <div class=\"p-3 filter-body\" panel-body>\n\n        <scrm-field-grid *ngIf=\"store.displayFields && store.displayFields.length\"\n                         [actions]=\"true\"\n                         [appendActions]=\"false\"\n                         [fieldMode]=\"store.mode\"\n                         [fields]=\"store.displayFields\"\n                         [record]=\"vm\"\n                         [special]=\"store.special.length > 0\"\n        >\n\n            <div *ngIf=\"store.special.length > 0\" class=\"float-right mt-4\" field-grid-special>\n\n                <div *ngFor=\"let item of store.special \" class=\"d-inline-block form-check mb-2 mr-sm-2\">\n\n                    <input class=\"form-check-input\" type=\"checkbox\" [value]=\"item.value\">\n\n                    <label class=\"form-check-label\">\n                        <scrm-label [labelKey]=\"item.labelKey\"></scrm-label>\n                    </label>\n\n                </div>\n            </div>\n\n            <div *ngIf=\"store.gridButtons\" class=\"mt-4 align-self-end\" field-grid-actions>\n                <scrm-button *ngFor=\"let button of store.gridButtons\" [config]=\"button\"></scrm-button>\n            </div>\n        </scrm-field-grid>\n\n        <ng-container *ngIf=\"config && config.savedFilterEdit\">\n            <scrm-record-grid [config]=\"getGridConfig()\"></scrm-record-grid>\n        </ng-container>\n\n    </div>\n\n</scrm-panel>\n"
            },] }
];
ListFilterComponent.ctorParameters = () => [
    { type: ListFilterStoreFactory },
    { type: SavedFilterActionAdapterFactory }
];
ListFilterComponent.propDecorators = {
    config: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1maWx0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2NvbnRhaW5lcnMvbGlzdC1maWx0ZXIvY29tcG9uZW50cy9saXN0LWZpbHRlci9saXN0LWZpbHRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFvQixNQUFNLGVBQWUsQ0FBQztBQUVsRSxPQUFPLEVBQWEsRUFBRSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxHQUFHLEVBQUUsV0FBVyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFHaEQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sbURBQW1ELENBQUM7QUFHekYsT0FBTyxFQUFDLCtCQUErQixFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFPdkYsTUFBTSxPQUFPLG1CQUFtQjtJQVE1QixZQUNjLFlBQW9DLEVBQ3BDLG9CQUFxRDtRQURyRCxpQkFBWSxHQUFaLFlBQVksQ0FBd0I7UUFDcEMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFpQztRQUUvRCxJQUFJLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUU7WUFDakQsTUFBTSxNQUFNLHFCQUFPLFdBQVcsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQztZQUMzQyxPQUFPLE1BQU0sQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxhQUFhO1FBRVQsT0FBTztZQUNILE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxjQUFjO1lBQzlDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLO1lBQ25DLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRTtZQUNwRCxPQUFPLEVBQUUsSUFBSSxDQUFDLG9CQUFvQjtZQUNsQyxhQUFhLEVBQUUsSUFBSTtZQUNuQixLQUFLLEVBQUUseUNBQXlDO1lBQ2hELFdBQVcsRUFBRSwrQkFBK0I7WUFDNUMsWUFBWSxFQUFFLFFBQVE7WUFDdEIsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLFFBQVEsRUFBRSxFQUFFLENBQUM7Z0JBQ1QsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsR0FBRyxFQUFFLENBQUM7Z0JBQ04sSUFBSSxFQUFFLENBQUM7YUFDTyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2QixDQUFDO0lBQzFCLENBQUM7OztZQXRESixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsc3VHQUEyQzthQUU5Qzs7O1lBVE8sc0JBQXNCO1lBR3RCLCtCQUErQjs7O3FCQVNsQyxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UmVjb3JkLCBTY3JlZW5TaXplTWFwfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBvZn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgc2hhcmVSZXBsYXl9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7RmlsdGVyQ29uZmlnfSBmcm9tICcuL2xpc3QtZmlsdGVyLm1vZGVsJztcbmltcG9ydCB7UmVjb3JkR3JpZENvbmZpZ30gZnJvbSAnLi4vLi4vLi4vLi4vY29tcG9uZW50cy9yZWNvcmQtZ3JpZC9yZWNvcmQtZ3JpZC5tb2RlbCc7XG5pbXBvcnQge0xpc3RGaWx0ZXJTdG9yZUZhY3Rvcnl9IGZyb20gJy4uLy4uL3N0b3JlL2xpc3QtZmlsdGVyL2xpc3QtZmlsdGVyLnN0b3JlLmZhY3RvcnknO1xuaW1wb3J0IHtMaXN0RmlsdGVyU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL2xpc3QtZmlsdGVyL2xpc3QtZmlsdGVyLnN0b3JlJztcbmltcG9ydCB7U2F2ZWRGaWx0ZXJBY3Rpb25zQWRhcHRlcn0gZnJvbSAnLi4vLi4vYWRhcHRlcnMvYWN0aW9ucy5hZGFwdGVyJztcbmltcG9ydCB7U2F2ZWRGaWx0ZXJBY3Rpb25BZGFwdGVyRmFjdG9yeX0gZnJvbSAnLi4vLi4vYWRhcHRlcnMvYWN0aW9ucy5hZGFwdGVyLmZhY3RvcnknO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tbGlzdC1maWx0ZXInLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9saXN0LWZpbHRlci5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbXSxcbn0pXG5leHBvcnQgY2xhc3MgTGlzdEZpbHRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIEBJbnB1dCgpIGNvbmZpZzogRmlsdGVyQ29uZmlnO1xuXG4gICAgdm0kOiBPYnNlcnZhYmxlPFJlY29yZD47XG4gICAgc3RvcmU6IExpc3RGaWx0ZXJTdG9yZTtcbiAgICBmaWx0ZXJBY3Rpb25zQWRhcHRlcjogU2F2ZWRGaWx0ZXJBY3Rpb25zQWRhcHRlcjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgc3RvcmVGYWN0b3J5OiBMaXN0RmlsdGVyU3RvcmVGYWN0b3J5LFxuICAgICAgICBwcm90ZWN0ZWQgYWN0aW9uQWRhcHRlckZhY3Rvcnk6IFNhdmVkRmlsdGVyQWN0aW9uQWRhcHRlckZhY3RvcnlcbiAgICApIHtcbiAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlRmFjdG9yeS5jcmVhdGUoKTtcbiAgICAgICAgdGhpcy5maWx0ZXJBY3Rpb25zQWRhcHRlciA9IGFjdGlvbkFkYXB0ZXJGYWN0b3J5LmNyZWF0ZSh0aGlzLnN0b3JlLmZpbHRlclN0b3JlLCB0aGlzLnN0b3JlKTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdG9yZS5pbml0KHRoaXMuY29uZmlnKTtcbiAgICAgICAgdGhpcy52bSQgPSB0aGlzLnN0b3JlLnZtJC5waXBlKG1hcCgoW3NhdmVkRmlsdGVyXSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gey4uLnNhdmVkRmlsdGVyfTtcbiAgICAgICAgICAgIHJlY29yZC5maWVsZHMgPSBzYXZlZEZpbHRlci5jcml0ZXJpYUZpZWxkcztcbiAgICAgICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdG9yZS5jbGVhcigpO1xuICAgICAgICB0aGlzLnN0b3JlID0gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRHcmlkQ29uZmlnKCk6IFJlY29yZEdyaWRDb25maWcge1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZWNvcmQkOiB0aGlzLnN0b3JlLmZpbHRlclN0b3JlLnN0YWdpbmdSZWNvcmQkLFxuICAgICAgICAgICAgbW9kZSQ6IHRoaXMuc3RvcmUuZmlsdGVyU3RvcmUubW9kZSQsXG4gICAgICAgICAgICBmaWVsZHMkOiB0aGlzLnN0b3JlLmZpbHRlclN0b3JlLmdldFZpZXdGaWVsZHNLZXlzJCgpLFxuICAgICAgICAgICAgYWN0aW9uczogdGhpcy5maWx0ZXJBY3Rpb25zQWRhcHRlcixcbiAgICAgICAgICAgIGFwcGVuZEFjdGlvbnM6IHRydWUsXG4gICAgICAgICAgICBrbGFzczogJ210LTIgcC0yIHNhdmVkLXNlYXJjaC1jb250YWluZXIgcm91bmRlZCcsXG4gICAgICAgICAgICBidXR0b25DbGFzczogJ2J0biBidG4tb3V0bGluZS1kYW5nZXIgYnRuLXNtJyxcbiAgICAgICAgICAgIGxhYmVsRGlzcGxheTogJ2lubGluZScsXG4gICAgICAgICAgICBtYXhDb2x1bW5zJDogb2YoNCkucGlwZShzaGFyZVJlcGxheSgxKSksXG4gICAgICAgICAgICBzaXplTWFwJDogb2Yoe1xuICAgICAgICAgICAgICAgIGhhbmRzZXQ6IDEsXG4gICAgICAgICAgICAgICAgdGFibGV0OiAyLFxuICAgICAgICAgICAgICAgIHdlYjogMyxcbiAgICAgICAgICAgICAgICB3aWRlOiA0XG4gICAgICAgICAgICB9IGFzIFNjcmVlblNpemVNYXApLnBpcGUoc2hhcmVSZXBsYXkoMSkpLFxuICAgICAgICB9IGFzIFJlY29yZEdyaWRDb25maWc7XG4gICAgfVxuXG59XG4iXX0=