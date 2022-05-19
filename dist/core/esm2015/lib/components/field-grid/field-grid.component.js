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
import { BaseFieldGridComponent } from './base-field-grid.component';
export class FieldGridComponent extends BaseFieldGridComponent {
    constructor(breakpointObserver) {
        super(breakpointObserver);
        this.breakpointObserver = breakpointObserver;
        this.fieldMode = 'detail';
    }
    ngOnChanges() {
        this.buildGrid();
    }
    buildGrid() {
        const grid = [];
        if (!this.fields || this.fields.length === 0) {
            this.fieldGrid = [];
            return;
        }
        let col = 0;
        let row = {
            cols: []
        };
        grid.push(row);
        this.fields.forEach(field => {
            if (col >= this.colNumber) {
                col = 0;
                row = {
                    cols: []
                };
                grid.push(row);
            }
            row.cols.push({
                field
            });
            col++;
        });
        const lastRow = grid[grid.length - 1];
        if (col < this.colNumber) {
            this.fillRow(lastRow);
        }
        this.addSpecialSlots(grid);
        this.fieldGrid = grid;
    }
}
FieldGridComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-field-grid',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<form>\n    <div [ngClass]=\"rowClass\" *ngFor=\"let row of fieldGrid\">\n\n        <div [ngClass]=\"colClass\" *ngFor=\"let col of row.cols\">\n\n            <ng-container>\n                <div [class.align-items-center]=\"labelDisplay === 'inline'\"\n                     [class.flex-column]=\"labelDisplay === 'top'\"\n                     [class.flex-row]=\"labelDisplay === 'inline'\"\n                     [class.justify-content-end]=\"!col.field\"\n                     class=\"d-flex\"\n                >\n                    <div *ngIf=\"col.field && col.field.display !== 'none'\"\n                         [class.pr-3]=\"labelDisplay === 'inline'\">\n                        <label *ngIf=\"col.field.label\" [ngClass]=\"labelClass\">{{col.field.label}}</label>\n                        <scrm-label *ngIf=\"!col.field.label && col.field.labelKey\"\n                                    [labelKey]=\"col.field.labelKey\"\n                                    [ngClass]=\"labelClass\"></scrm-label>\n                    </div>\n                    <div *ngIf=\"col.field && col.field.display !== 'none'\"\n                         [class.flex-grow-1]=\"labelDisplay === 'inline'\">\n                        <scrm-field [field]=\"col.field\"\n                                    [klass]=\"inputClass\"\n                                    [mode]=\"fieldMode\"\n                                    [record]=\"record\"\n                                    [type]=\"col.field.type\">\n                        </scrm-field>\n                    </div>\n                    <ng-container *ngIf=\"col.actionSlot\">\n                        <ng-content select=\"[field-grid-actions]\"></ng-content>\n                    </ng-container>\n                    <ng-container *ngIf=\"col.specialSlot\">\n                        <ng-content select=\"[field-grid-actions]\"></ng-content>\n                    </ng-container>\n                </div>\n            </ng-container>\n        </div>\n    </div>\n</form>\n"
            },] }
];
FieldGridComponent.ctorParameters = () => [
    { type: BreakpointObserver }
];
FieldGridComponent.propDecorators = {
    fields: [{ type: Input }],
    record: [{ type: Input }],
    fieldMode: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtZ3JpZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29tcG9uZW50cy9maWVsZC1ncmlkL2ZpZWxkLWdyaWQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBWSxNQUFNLGVBQWUsQ0FBQztBQUMxRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUd2RCxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQU9uRSxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsc0JBQXNCO0lBTTFELFlBQXNCLGtCQUFzQztRQUN4RCxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQURSLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFGbkQsY0FBUyxHQUFHLFFBQVEsQ0FBQztJQUk5QixDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsU0FBUztRQUNMLE1BQU0sSUFBSSxHQUFtQixFQUFFLENBQUM7UUFFaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzFDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLE9BQU87U0FDVjtRQUVELElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNaLElBQUksR0FBRyxHQUFHO1lBQ04sSUFBSSxFQUFFLEVBQUU7U0FDSyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFZixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUV4QixJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUN2QixHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNSLEdBQUcsR0FBRztvQkFDRixJQUFJLEVBQUUsRUFBRTtpQkFDSyxDQUFDO2dCQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2xCO1lBRUQsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ1YsS0FBSzthQUNXLENBQUMsQ0FBQztZQUV0QixHQUFHLEVBQUUsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUzQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUMxQixDQUFDOzs7WUExREosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLHEwR0FBMEM7YUFFN0M7OztZQVRPLGtCQUFrQjs7O3FCQVlyQixLQUFLO3FCQUNMLEtBQUs7d0JBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCcmVha3BvaW50T2JzZXJ2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9sYXlvdXQnO1xuaW1wb3J0IHtGaWVsZCwgUmVjb3JkfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtGaWVsZEdyaWRDb2x1bW4sIEZpZWxkR3JpZFJvd30gZnJvbSAnLi9maWVsZC1ncmlkLm1vZGVsJztcbmltcG9ydCB7QmFzZUZpZWxkR3JpZENvbXBvbmVudH0gZnJvbSAnLi9iYXNlLWZpZWxkLWdyaWQuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLWZpZWxkLWdyaWQnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9maWVsZC1ncmlkLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIEZpZWxkR3JpZENvbXBvbmVudCBleHRlbmRzIEJhc2VGaWVsZEdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuXG4gICAgQElucHV0KCkgZmllbGRzOiBGaWVsZFtdO1xuICAgIEBJbnB1dCgpIHJlY29yZDogUmVjb3JkO1xuICAgIEBJbnB1dCgpIGZpZWxkTW9kZSA9ICdkZXRhaWwnO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGJyZWFrcG9pbnRPYnNlcnZlcjogQnJlYWtwb2ludE9ic2VydmVyKSB7XG4gICAgICAgIHN1cGVyKGJyZWFrcG9pbnRPYnNlcnZlcik7XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnVpbGRHcmlkKCk7XG4gICAgfVxuXG4gICAgYnVpbGRHcmlkKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBncmlkOiBGaWVsZEdyaWRSb3dbXSA9IFtdO1xuXG4gICAgICAgIGlmICghdGhpcy5maWVsZHMgfHwgdGhpcy5maWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmZpZWxkR3JpZCA9IFtdO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvbCA9IDA7XG4gICAgICAgIGxldCByb3cgPSB7XG4gICAgICAgICAgICBjb2xzOiBbXVxuICAgICAgICB9IGFzIEZpZWxkR3JpZFJvdztcbiAgICAgICAgZ3JpZC5wdXNoKHJvdyk7XG5cbiAgICAgICAgdGhpcy5maWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7XG5cbiAgICAgICAgICAgIGlmIChjb2wgPj0gdGhpcy5jb2xOdW1iZXIpIHtcbiAgICAgICAgICAgICAgICBjb2wgPSAwO1xuICAgICAgICAgICAgICAgIHJvdyA9IHtcbiAgICAgICAgICAgICAgICAgICAgY29sczogW11cbiAgICAgICAgICAgICAgICB9IGFzIEZpZWxkR3JpZFJvdztcbiAgICAgICAgICAgICAgICBncmlkLnB1c2gocm93KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcm93LmNvbHMucHVzaCh7XG4gICAgICAgICAgICAgICAgZmllbGRcbiAgICAgICAgICAgIH0gYXMgRmllbGRHcmlkQ29sdW1uKTtcblxuICAgICAgICAgICAgY29sKys7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGxhc3RSb3cgPSBncmlkW2dyaWQubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmIChjb2wgPCB0aGlzLmNvbE51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5maWxsUm93KGxhc3RSb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hZGRTcGVjaWFsU2xvdHMoZ3JpZCk7XG5cbiAgICAgICAgdGhpcy5maWVsZEdyaWQgPSBncmlkO1xuICAgIH1cbn1cbiJdfQ==