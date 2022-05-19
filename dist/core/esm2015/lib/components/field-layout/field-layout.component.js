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
import { BreakpointObserver } from '@angular/cdk/layout';
import { BaseFieldGridComponent } from '../field-grid/base-field-grid.component';
export class FieldLayoutComponent extends BaseFieldGridComponent {
    constructor(breakpointObserver) {
        super(breakpointObserver);
        this.breakpointObserver = breakpointObserver;
        this.baseColClass = {
            col: true,
            'form-group': true,
            'm-1': false,
            'm-0': true,
            'pl-3': true,
            'pb-2': true,
            'pr-3': true
        };
    }
    ngOnInit() {
        this.subscriptions.push(this.dataSource.getConfig().subscribe(config => {
            this.config = Object.assign({}, config);
        }));
        this.subscriptions.push(this.dataSource.getLayout().subscribe(layout => {
            this.layout = Object.assign({}, layout);
        }));
        this.subscriptions.push(this.dataSource.getFields().subscribe(fields => {
            this.fields = Object.assign({}, fields);
        }));
        this.subscriptions.push(this.dataSource.getRecord().subscribe(record => {
            this.record = Object.assign({}, record);
        }));
        super.ngOnInit();
    }
    buildGrid() {
        const grid = [];
        if (!this.fields || Object.keys(this.fields).length === 0) {
            this.fieldGrid = [];
            return;
        }
        this.layout.rows.forEach(layoutRow => {
            let row = {
                cols: []
            };
            layoutRow.cols.forEach((layoutCol, colIndex) => {
                const fieldName = layoutCol.name;
                const field = this.fields[fieldName] || null;
                if (!field) {
                    row.cols.push({});
                    return;
                }
                row.cols.push({
                    field
                });
                if (this.colNumber === 1 && colIndex < layoutRow.cols.length - 1) {
                    grid.push(row);
                    row = {
                        cols: []
                    };
                }
            });
            if (row.cols.length < this.colNumber) {
                this.fillRow(row);
            }
            grid.push(row);
        });
        this.addSpecialSlots(grid);
        this.fieldGrid = grid;
    }
    get colNumber() {
        const size = this.sizeMap[this.currentSize];
        if (size === 1) {
            return 1;
        }
        return this.config.maxColumns;
    }
}
FieldLayoutComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-field-layout',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<form class=\"field-layout {{config.mode}}\">\n    <div [ngClass]=\"rowClass\" *ngFor=\"let row of fieldGrid; index as i\">\n\n        <div *ngFor=\"let col of row.cols; index as colNumber\"\n             [class.field-column-bordered]=\"row.cols.length > 1 && colNumber < row.cols.length - 1\"\n             [ngClass]=\"colClass\">\n\n            <ng-container *ngIf=\"col.field && col.field.display !== 'none'\">\n                <div class=\"label-container\">\n                    <strong>\n                        <label [ngClass]=\"labelClass\">{{col.field.label | uppercase}}</label>:\n                        <ng-container\n                            *ngIf=\"col.field.definition.required && (['edit', 'create'].includes(config.mode))\">\n                            <span class=\"required\">*</span>\n                        </ng-container>\n                    </strong>\n                </div>\n                <div class=\"d-flex\">\n                    <div class=\"flex-grow-1 text-break\">\n                        <scrm-field [type]=\"col.field.type\"\n                                    [mode]=\"config.mode\"\n                                    [klass]=\"inputClass\"\n                                    [field]=\"col.field\"\n                                    [record]=\"record\">\n                        </scrm-field>\n                    </div>\n                    <div>\n                        <button type=\"button\" class=\"record-action-button\"\n                                (click)=\"this.dataSource.getEditAction()\"\n                                *ngIf=\"col.field.definition.inline_edit !== false && !col.field.definition.readonly && this.dataSource.inlineEdit && config.mode === 'detail'\">\n                            <scrm-image class=\"sicon\" image=\"pencil\"></scrm-image>\n                        </button>\n                    </div>\n                </div>\n            </ng-container>\n\n            <ng-container *ngIf=\"col.actionSlot\">\n                <ng-content select=\"[field-grid-actions]\"></ng-content>\n            </ng-container>\n\n            <ng-container *ngIf=\"col.specialSlot\">\n                <ng-content select=\"[field-grid-special]\"></ng-content>\n            </ng-container>\n\n            <div class=\"field-separation mt-2\" *ngIf=\"col.field && i < fieldGrid.length - 1\"></div>\n        </div>\n    </div>\n</form>\n"
            },] }
];
FieldLayoutComponent.ctorParameters = () => [
    { type: BreakpointObserver }
];
FieldLayoutComponent.propDecorators = {
    dataSource: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtbGF5b3V0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb21wb25lbnRzL2ZpZWxkLWxheW91dC9maWVsZC1sYXlvdXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUUvQyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUV2RCxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx5Q0FBeUMsQ0FBQztBQVEvRSxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsc0JBQXNCO0lBa0I1RCxZQUFzQixrQkFBc0M7UUFDeEQsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFEUix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBVjVELGlCQUFZLEdBQUc7WUFDWCxHQUFHLEVBQUUsSUFBSTtZQUNULFlBQVksRUFBRSxJQUFJO1lBQ2xCLEtBQUssRUFBRSxLQUFLO1lBQ1osS0FBSyxFQUFFLElBQUk7WUFDWCxNQUFNLEVBQUUsSUFBSTtZQUNaLE1BQU0sRUFBRSxJQUFJO1lBQ1osTUFBTSxFQUFFLElBQUk7U0FDZixDQUFDO0lBSUYsQ0FBQztJQUVELFFBQVE7UUFFSixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNuRSxJQUFJLENBQUMsTUFBTSxxQkFBTyxNQUFNLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUs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QkFDN0IsZ3RIQUE0QzthQUUvQzs7O1lBVE8sa0JBQWtCOzs7eUJBWXJCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0ZpZWxkTWFwLCBQYW5lbCwgUmVjb3JkfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtCcmVha3BvaW50T2JzZXJ2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9sYXlvdXQnO1xuaW1wb3J0IHtGaWVsZEdyaWRDb2x1bW4sIEZpZWxkR3JpZFJvd30gZnJvbSAnLi4vZmllbGQtZ3JpZC9maWVsZC1ncmlkLm1vZGVsJztcbmltcG9ydCB7QmFzZUZpZWxkR3JpZENvbXBvbmVudH0gZnJvbSAnLi4vZmllbGQtZ3JpZC9iYXNlLWZpZWxkLWdyaWQuY29tcG9uZW50JztcbmltcG9ydCB7RmllbGRMYXlvdXRDb25maWcsIEZpZWxkTGF5b3V0RGF0YVNvdXJjZX0gZnJvbSAnLi9maWVsZC1sYXlvdXQubW9kZWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tZmllbGQtbGF5b3V0JyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vZmllbGQtbGF5b3V0LmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIEZpZWxkTGF5b3V0Q29tcG9uZW50IGV4dGVuZHMgQmFzZUZpZWxkR3JpZENvbXBvbmVudCB7XG5cbiAgICBASW5wdXQoKSBkYXRhU291cmNlOiBGaWVsZExheW91dERhdGFTb3VyY2U7XG4gICAgY29uZmlnOiBGaWVsZExheW91dENvbmZpZztcbiAgICBsYXlvdXQ6IFBhbmVsO1xuICAgIGZpZWxkczogRmllbGRNYXA7XG4gICAgcmVjb3JkOiBSZWNvcmQ7XG5cbiAgICBiYXNlQ29sQ2xhc3MgPSB7XG4gICAgICAgIGNvbDogdHJ1ZSxcbiAgICAgICAgJ2Zvcm0tZ3JvdXAnOiB0cnVlLFxuICAgICAgICAnbS0xJzogZmFsc2UsXG4gICAgICAgICdtLTAnOiB0cnVlLFxuICAgICAgICAncGwtMyc6IHRydWUsXG4gICAgICAgICdwYi0yJzogdHJ1ZSxcbiAgICAgICAgJ3ByLTMnOiB0cnVlXG4gICAgfTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBicmVha3BvaW50T2JzZXJ2ZXI6IEJyZWFrcG9pbnRPYnNlcnZlcikge1xuICAgICAgICBzdXBlcihicmVha3BvaW50T2JzZXJ2ZXIpO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMuZGF0YVNvdXJjZS5nZXRDb25maWcoKS5zdWJzY3JpYmUoY29uZmlnID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gey4uLmNvbmZpZ307XG4gICAgICAgIH0pKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2godGhpcy5kYXRhU291cmNlLmdldExheW91dCgpLnN1YnNjcmliZShsYXlvdXQgPT4ge1xuICAgICAgICAgICAgdGhpcy5sYXlvdXQgPSB7Li4ubGF5b3V0fTtcbiAgICAgICAgfSkpO1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaCh0aGlzLmRhdGFTb3VyY2UuZ2V0RmllbGRzKCkuc3Vic2NyaWJlKGZpZWxkcyA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpZWxkcyA9IHsuLi5maWVsZHN9O1xuICAgICAgICB9KSk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMuZGF0YVNvdXJjZS5nZXRSZWNvcmQoKS5zdWJzY3JpYmUocmVjb3JkID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVjb3JkID0gey4uLnJlY29yZH07XG4gICAgICAgIH0pKTtcblxuICAgICAgICBzdXBlci5uZ09uSW5pdCgpO1xuICAgIH1cblxuICAgIGJ1aWxkR3JpZCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZ3JpZDogRmllbGRHcmlkUm93W10gPSBbXTtcblxuICAgICAgICBpZiAoIXRoaXMuZmllbGRzIHx8IE9iamVjdC5rZXlzKHRoaXMuZmllbGRzKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGRHcmlkID0gW107XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxheW91dC5yb3dzLmZvckVhY2gobGF5b3V0Um93ID0+IHtcbiAgICAgICAgICAgIGxldCByb3cgPSB7XG4gICAgICAgICAgICAgICAgY29sczogW11cbiAgICAgICAgICAgIH0gYXMgRmllbGRHcmlkUm93O1xuXG4gICAgICAgICAgICBsYXlvdXRSb3cuY29scy5mb3JFYWNoKChsYXlvdXRDb2wsIGNvbEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmllbGROYW1lID0gbGF5b3V0Q29sLm5hbWU7XG4gICAgICAgICAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLmZpZWxkc1tmaWVsZE5hbWVdIHx8IG51bGw7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvdy5jb2xzLnB1c2goe30gYXMgRmllbGRHcmlkQ29sdW1uKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJvdy5jb2xzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBmaWVsZFxuICAgICAgICAgICAgICAgIH0gYXMgRmllbGRHcmlkQ29sdW1uKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbE51bWJlciA9PT0gMSAmJiBjb2xJbmRleCA8IGxheW91dFJvdy5jb2xzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JpZC5wdXNoKHJvdyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcm93ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sczogW11cbiAgICAgICAgICAgICAgICAgICAgfSBhcyBGaWVsZEdyaWRSb3c7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChyb3cuY29scy5sZW5ndGggPCB0aGlzLmNvbE51bWJlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsbFJvdyhyb3cpO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGdyaWQucHVzaChyb3cpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmFkZFNwZWNpYWxTbG90cyhncmlkKTtcblxuICAgICAgICB0aGlzLmZpZWxkR3JpZCA9IGdyaWQ7XG4gICAgfVxuXG4gICAgZ2V0IGNvbE51bWJlcigpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5zaXplTWFwW3RoaXMuY3VycmVudFNpemVdO1xuICAgICAgICBpZiAoc2l6ZSA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLm1heENvbHVtbnM7XG4gICAgfVxufVxuIl19