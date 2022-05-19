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
import { map, shareReplay } from 'rxjs/operators';
import { SelectionStatus, SortDirection } from 'common';
import { FieldManager } from '../../../services/record/field/field.manager';
export class TableBodyComponent {
    constructor(fieldManager) {
        this.fieldManager = fieldManager;
        this.maxColumns = 4;
    }
    ngOnInit() {
        const selection$ = this.config.selection$ || of(null).pipe(shareReplay(1));
        const loading$ = this.config.loading$ || of(false).pipe(shareReplay(1));
        this.vm$ = combineLatest([
            this.config.columns,
            selection$,
            this.config.maxColumns$,
            this.config.dataSource.connect(null),
            loading$
        ]).pipe(map(([columns, selection, maxColumns, records, loading]) => {
            const displayedColumns = [];
            if (selection) {
                displayedColumns.push('checkbox');
            }
            this.maxColumns = maxColumns;
            const columnsDefs = this.buildDisplayColumns(columns);
            displayedColumns.push(...columnsDefs);
            displayedColumns.push('line-actions');
            const selected = selection && selection.selected || {};
            const selectionStatus = selection && selection.status || SelectionStatus.NONE;
            return {
                columns,
                selection,
                selected,
                selectionStatus,
                displayedColumns,
                records: records || [],
                loading
            };
        }));
    }
    toggleSelection(id) {
        this.config.toggleRecordSelection(id);
    }
    allSelected(status) {
        return status === SelectionStatus.ALL;
    }
    buildDisplayColumns(metaFields) {
        let i = 0;
        let hasLinkField = false;
        const returnArray = [];
        const fields = metaFields.filter(function (field) {
            return !field.hasOwnProperty('default')
                || (field.hasOwnProperty('default') && field.default === true);
        });
        while (i < this.maxColumns && i < fields.length) {
            returnArray.push(fields[i].name);
            hasLinkField = hasLinkField || fields[i].link;
            i++;
        }
        if (!hasLinkField && (this.maxColumns < fields.length)) {
            for (i = this.maxColumns; i < fields.length; i++) {
                if (fields[i].link) {
                    returnArray.splice(-1, 1);
                    returnArray.push(fields[i].name);
                    break;
                }
            }
        }
        return returnArray;
    }
    getFieldSort(field) {
        return {
            getSortDirection: () => this.config.sort$.pipe(map((sort) => {
                let direction = SortDirection.NONE;
                if (sort.orderBy === field.name) {
                    direction = sort.sortOrder;
                }
                return direction;
            })),
            changeSortDirection: (direction) => {
                this.config.updateSorting(field.name, direction);
            }
        };
    }
    getField(column, record) {
        if (!column || !record) {
            return null;
        }
        return this.fieldManager.addField(record, column);
    }
}
TableBodyComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-table-body',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container *ngIf=\"(vm$ | async) as vm\">\n    <div class=\"position-relative d-flex flex-column\">\n        <table cdk-table [dataSource]=\"config.dataSource\"\n               aria-describedby=\"table-body\"\n               class=\"list-view-table striped-table table\">\n\n            <ng-container cdkColumnDef=\"checkbox\" *ngIf=\"vm.selection\">\n\n                <th cdk-header-cell scope=\"col\" *cdkHeaderCellDef class=\"primary-table-header\"></th>\n\n                <td cdk-cell *cdkCellDef=\"let record\">\n                    <label class=\"checkbox-container\">\n                        <input type=\"checkbox\"\n                               [checked]=\"(record['id'] && vm.selected[record['id']]) || allSelected(vm.selectionStatus) \"\n                               (change)=\"toggleSelection(record['id'])\"\n                               [disabled]=\"allSelected(vm.selectionStatus)\"\n                               aria-hidden=\"true\">\n                        <span class=\"checkmark\"></span>\n                    </label>\n                </td>\n\n            </ng-container>\n\n            <ng-container *ngFor=\"let column of vm.columns\" [cdkColumnDef]=\"column.name\">\n\n                <th cdk-header-cell\n                    *cdkHeaderCellDef\n                    scope=\"col\"\n                    class=\"primary-table-header\">\n\n                    <scrm-label [labelKey]=\"column.label\" [module]=\"config.module || ''\"></scrm-label>\n                    <scrm-sort-button *ngIf=\"config.sort$ && column.sortable\"\n                                      [state]=\"getFieldSort(column)\">\n                    </scrm-sort-button>\n\n                </th>\n\n                <td cdk-cell *cdkCellDef=\"let record\">\n                    <scrm-field [mode]=\"'list'\"\n                                [type]=\"column.type\"\n                                [field]=\"getField(column, record)\"\n                                [record]=\"record\">\n                    </scrm-field>\n                </td>\n\n            </ng-container>\n\n            <ng-container cdkColumnDef=\"line-actions\">\n\n                <th cdk-header-cell scope=\"col\" *cdkHeaderCellDef class=\"primary-table-header\"></th>\n\n                <td cdk-cell *cdkCellDef=\"let record\">\n                    <scrm-line-action-menu *ngIf=\"record && config.lineActions\"\n                                           [config]=\"config.lineActions\"\n                                           [record]=\"record\">\n                    </scrm-line-action-menu>\n                </td>\n\n            </ng-container>\n\n            <tr cdk-header-row *cdkHeaderRowDef=\"vm.displayedColumns\"></tr>\n            <tr cdk-row *cdkRowDef=\"let row; columns: vm.displayedColumns;\"></tr>\n\n        </table>\n\n        <div *ngIf=\"!vm.loading && vm.records.length === 0\">\n            <p class=\"lead text-center pt-3\">\n                <scrm-label labelKey=\"MSG_LIST_VIEW_NO_RESULTS_BASIC\"></scrm-label>\n            </p>\n        </div>\n        <div *ngIf=\"vm.loading\" [class.m-5]=\"!vm.records || vm.records.length === 0\">\n            <scrm-loading-spinner [overlay]=\"true\"></scrm-loading-spinner>\n        </div>\n    </div>\n</ng-container>\n"
            },] }
];
TableBodyComponent.ctorParameters = () => [
    { type: FieldManager }
];
TableBodyComponent.propDecorators = {
    config: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtYm9keS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29tcG9uZW50cy90YWJsZS90YWJsZS1ib2R5L3RhYmxlLWJvZHkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBUyxNQUFNLGVBQWUsQ0FBQztBQUN2RCxPQUFPLEVBQUMsYUFBYSxFQUFjLEVBQUUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNuRCxPQUFPLEVBQUMsR0FBRyxFQUFFLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2hELE9BQU8sRUFLSCxlQUFlLEVBQ2YsYUFBYSxFQUVoQixNQUFNLFFBQVEsQ0FBQztBQUNoQixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sOENBQThDLENBQUM7QUFrQjFFLE1BQU0sT0FBTyxrQkFBa0I7SUFLM0IsWUFDYyxZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUp4QyxlQUFVLEdBQUcsQ0FBQyxDQUFDO0lBTWYsQ0FBQztJQUVELFFBQVE7UUFDSixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFeEUsSUFBSSxDQUFDLEdBQUcsR0FBRyxhQUFhLENBQUM7WUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO1lBQ25CLFVBQVU7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QUFDO29CQUNqQyxNQUFNO2lCQUNUO2FBQ0o7U0FDSjtRQUNELE9BQU8sV0FBVyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxZQUFZLENBQUMsS0FBdUI7UUFDaEMsT0FBTztZQUNILGdCQUFnQixFQUFFLEdBQThCLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQ3JFLEdBQUcsQ0FBQyxDQUFDLElBQXNCLEVBQUUsRUFBRTtnQkFDM0IsSUFBSSxTQUFTLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztnQkFFbkMsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUU7b0JBQzdCLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO2lCQUM5QjtnQkFFRCxPQUFPLFNBQVMsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FDTDtZQUNELG1CQUFtQixFQUFFLENBQUMsU0FBd0IsRUFBUSxFQUFFO2dCQUNwRCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3JELENBQUM7U0FDdUIsQ0FBQztJQUNqQyxDQUFDO0lBRUQsUUFBUSxDQUFDLE1BQXdCLEVBQUUsTUFBYztRQUU3QyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3BCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0RCxDQUFDOzs7WUE1SEosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLGtqSkFBd0M7YUFDM0M7OztZQWpCTyxZQUFZOzs7cUJBbUJmLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Y29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgb2Z9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIHNoYXJlUmVwbGF5fSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1xuICAgIENvbHVtbkRlZmluaXRpb24sXG4gICAgRmllbGQsXG4gICAgUmVjb3JkLFxuICAgIFJlY29yZFNlbGVjdGlvbixcbiAgICBTZWxlY3Rpb25TdGF0dXMsXG4gICAgU29ydERpcmVjdGlvbixcbiAgICBTb3J0aW5nU2VsZWN0aW9uXG59IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge0ZpZWxkTWFuYWdlcn0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvcmVjb3JkL2ZpZWxkL2ZpZWxkLm1hbmFnZXInO1xuaW1wb3J0IHtUYWJsZUNvbmZpZ30gZnJvbSAnLi4vdGFibGUubW9kZWwnO1xuaW1wb3J0IHtTb3J0RGlyZWN0aW9uRGF0YVNvdXJjZX0gZnJvbSAnLi4vLi4vc29ydC1idXR0b24vc29ydC1idXR0b24ubW9kZWwnO1xuXG5pbnRlcmZhY2UgVGFibGVWaWV3TW9kZWwge1xuICAgIGNvbHVtbnM6IENvbHVtbkRlZmluaXRpb25bXTtcbiAgICBzZWxlY3Rpb246IFJlY29yZFNlbGVjdGlvbjtcbiAgICBzZWxlY3RlZDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgICBzZWxlY3Rpb25TdGF0dXM6IFNlbGVjdGlvblN0YXR1cztcbiAgICBkaXNwbGF5ZWRDb2x1bW5zOiBzdHJpbmdbXTtcbiAgICByZWNvcmRzOiBSZWNvcmRbXSB8IHJlYWRvbmx5IFJlY29yZFtdO1xuICAgIGxvYWRpbmc6IGJvb2xlYW47XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS10YWJsZS1ib2R5JyxcbiAgICB0ZW1wbGF0ZVVybDogJ3RhYmxlLWJvZHkuY29tcG9uZW50Lmh0bWwnLFxufSlcbmV4cG9ydCBjbGFzcyBUYWJsZUJvZHlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIEBJbnB1dCgpIGNvbmZpZzogVGFibGVDb25maWc7XG4gICAgbWF4Q29sdW1ucyA9IDQ7XG4gICAgdm0kOiBPYnNlcnZhYmxlPFRhYmxlVmlld01vZGVsPjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgZmllbGRNYW5hZ2VyOiBGaWVsZE1hbmFnZXJcbiAgICApIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uJCA9IHRoaXMuY29uZmlnLnNlbGVjdGlvbiQgfHwgb2YobnVsbCkucGlwZShzaGFyZVJlcGxheSgxKSk7XG4gICAgICAgIGNvbnN0IGxvYWRpbmckID0gdGhpcy5jb25maWcubG9hZGluZyQgfHwgb2YoZmFsc2UpLnBpcGUoc2hhcmVSZXBsYXkoMSkpO1xuXG4gICAgICAgIHRoaXMudm0kID0gY29tYmluZUxhdGVzdChbXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5jb2x1bW5zLFxuICAgICAgICAgICAgc2VsZWN0aW9uJCxcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLm1heENvbHVtbnMkLFxuICAgICAgICAgICAgdGhpcy5jb25maWcuZGF0YVNvdXJjZS5jb25uZWN0KG51bGwpLFxuICAgICAgICAgICAgbG9hZGluZyRcbiAgICAgICAgXSkucGlwZShcbiAgICAgICAgICAgIG1hcCgoXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW5zLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIG1heENvbHVtbnMsXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZHMsXG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmdcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXNwbGF5ZWRDb2x1bW5zOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5ZWRDb2x1bW5zLnB1c2goJ2NoZWNrYm94Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5tYXhDb2x1bW5zID0gbWF4Q29sdW1ucztcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbnNEZWZzID0gdGhpcy5idWlsZERpc3BsYXlDb2x1bW5zKGNvbHVtbnMpO1xuICAgICAgICAgICAgICAgIGRpc3BsYXllZENvbHVtbnMucHVzaCguLi5jb2x1bW5zRGVmcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheWVkQ29sdW1ucy5wdXNoKCdsaW5lLWFjdGlvbnMnKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkID0gc2VsZWN0aW9uICYmIHNlbGVjdGlvbi5zZWxlY3RlZCB8fCB7fTtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3Rpb25TdGF0dXMgPSBzZWxlY3Rpb24gJiYgc2VsZWN0aW9uLnN0YXR1cyB8fCBTZWxlY3Rpb25TdGF0dXMuTk9ORTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbnMsXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQsXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheWVkQ29sdW1ucyxcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkczogcmVjb3JkcyB8fCBbXSxcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHRvZ2dsZVNlbGVjdGlvbihpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29uZmlnLnRvZ2dsZVJlY29yZFNlbGVjdGlvbihpZCk7XG4gICAgfVxuXG4gICAgYWxsU2VsZWN0ZWQoc3RhdHVzOiBTZWxlY3Rpb25TdGF0dXMpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHN0YXR1cyA9PT0gU2VsZWN0aW9uU3RhdHVzLkFMTDtcbiAgICB9XG5cbiAgICBidWlsZERpc3BsYXlDb2x1bW5zKG1ldGFGaWVsZHM6IENvbHVtbkRlZmluaXRpb25bXSk6IHN0cmluZ1tdIHtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBsZXQgaGFzTGlua0ZpZWxkID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHJldHVybkFycmF5ID0gW107XG5cbiAgICAgICAgY29uc3QgZmllbGRzID0gbWV0YUZpZWxkcy5maWx0ZXIoZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgICAgICAgICByZXR1cm4gIWZpZWxkLmhhc093blByb3BlcnR5KCdkZWZhdWx0JylcbiAgICAgICAgICAgICAgICB8fCAoZmllbGQuaGFzT3duUHJvcGVydHkoJ2RlZmF1bHQnKSAmJiBmaWVsZC5kZWZhdWx0ID09PSB0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2hpbGUgKGkgPCB0aGlzLm1heENvbHVtbnMgJiYgaSA8IGZpZWxkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybkFycmF5LnB1c2goZmllbGRzW2ldLm5hbWUpO1xuICAgICAgICAgICAgaGFzTGlua0ZpZWxkID0gaGFzTGlua0ZpZWxkIHx8IGZpZWxkc1tpXS5saW5rO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaGFzTGlua0ZpZWxkICYmICh0aGlzLm1heENvbHVtbnMgPCBmaWVsZHMubGVuZ3RoKSkge1xuICAgICAgICAgICAgZm9yIChpID0gdGhpcy5tYXhDb2x1bW5zOyBpIDwgZmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkc1tpXS5saW5rKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybkFycmF5LnNwbGljZSgtMSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybkFycmF5LnB1c2goZmllbGRzW2ldLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldHVybkFycmF5O1xuICAgIH1cblxuICAgIGdldEZpZWxkU29ydChmaWVsZDogQ29sdW1uRGVmaW5pdGlvbik6IFNvcnREaXJlY3Rpb25EYXRhU291cmNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldFNvcnREaXJlY3Rpb246ICgpOiBPYnNlcnZhYmxlPFNvcnREaXJlY3Rpb24+ID0+IHRoaXMuY29uZmlnLnNvcnQkLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKChzb3J0OiBTb3J0aW5nU2VsZWN0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXJlY3Rpb24gPSBTb3J0RGlyZWN0aW9uLk5PTkU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvcnQub3JkZXJCeSA9PT0gZmllbGQubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gc29ydC5zb3J0T3JkZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgY2hhbmdlU29ydERpcmVjdGlvbjogKGRpcmVjdGlvbjogU29ydERpcmVjdGlvbik6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLnVwZGF0ZVNvcnRpbmcoZmllbGQubmFtZSwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBhcyBTb3J0RGlyZWN0aW9uRGF0YVNvdXJjZTtcbiAgICB9XG5cbiAgICBnZXRGaWVsZChjb2x1bW46IENvbHVtbkRlZmluaXRpb24sIHJlY29yZDogUmVjb3JkKTogRmllbGQge1xuXG4gICAgICAgIGlmICghY29sdW1uIHx8ICFyZWNvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZmllbGRNYW5hZ2VyLmFkZEZpZWxkKHJlY29yZCwgY29sdW1uKTtcbiAgICB9XG59XG5cbiJdfQ==