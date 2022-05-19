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
import { Directive, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
export class BaseFieldGridComponent {
    constructor(breakpointObserver) {
        this.breakpointObserver = breakpointObserver;
        this.special = false;
        this.actions = false;
        this.appendActions = false;
        this.labelDisplay = 'top';
        this.labelClass = {};
        this.inputClass = {};
        this.rowClass = {};
        this.colClass = {};
        this.sizeMap = {
            handset: 1,
            tablet: 2,
            web: 3,
            wide: 4
        };
        this.baseColClass = {
            col: true,
            'form-group': true,
            'm-1': true
        };
        this.baseRowClass = {
            'form-row': true,
            'align-items-center': true
        };
        this.baseLabelClass = {
            'col-form-label-sm': true,
            'mb-0': true,
        };
        this.baseInputClass = {
            'form-control': true,
            'form-control-sm': true,
        };
        this.currentSize = 'web';
        this.subscriptions = [];
    }
    ngOnInit() {
        this.initScreenSizeObserver(this.breakpointObserver);
        this.buildGrid();
        this.colClass = Object.assign(Object.assign({}, this.colClass), this.baseColClass);
        this.rowClass = Object.assign(Object.assign({}, this.rowClass), this.baseRowClass);
        this.labelClass = Object.assign(Object.assign({}, this.labelClass), this.baseLabelClass);
        this.inputClass = Object.assign(Object.assign({}, this.inputClass), this.baseInputClass);
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    get colNumber() {
        const max = this.sizeMap[this.currentSize];
        if (this.maxColumns && max > this.maxColumns) {
            return this.maxColumns;
        }
        return max;
    }
    addSpecialSlots(grid) {
        if (!grid || grid.length === 0) {
            return;
        }
        const neededSlots = this.getNeededExtraSlots();
        if (neededSlots.length === 0) {
            return;
        }
        if (this.colNumber === 1) {
            neededSlots.reverse().forEach(type => {
                const newRow = {
                    cols: []
                };
                this.fillRow(newRow);
                grid.push(newRow);
                newRow.cols[0][type] = true;
            });
        }
        else if (this.appendActions === true) {
            const lastRow = grid[grid.length - 1];
            const place = this.colNumber - 1;
            neededSlots.forEach(type => {
                lastRow.cols[place][type] = true;
            });
        }
        else {
            const lastNeededCol = this.colNumber - neededSlots.length;
            let lastRow = grid[grid.length - 1];
            if (lastRow.cols[lastNeededCol].field) {
                lastRow = {
                    cols: []
                };
                this.fillRow(lastRow);
                grid.push(lastRow);
            }
            let place = this.colNumber - 1;
            neededSlots.forEach(type => {
                lastRow.cols[place][type] = true;
                place--;
            });
        }
    }
    getNeededExtraSlots() {
        const neededSlots = [];
        if (this.actions) {
            neededSlots.push('actionSlot');
        }
        if (this.special) {
            neededSlots.push('specialSlot');
        }
        return neededSlots;
    }
    fillRow(row) {
        const len = row.cols.length;
        for (let i = len; i < this.colNumber; i++) {
            row.cols.push({});
        }
    }
    initScreenSizeObserver(breakpointObserver) {
        this.subscriptions.push(breakpointObserver.observe([
            Breakpoints.HandsetPortrait,
        ]).subscribe((result) => {
            if (result.matches) {
                this.currentSize = 'handset';
                this.buildGrid();
            }
        }));
        this.subscriptions.push(breakpointObserver.observe([
            Breakpoints.TabletPortrait,
        ]).subscribe((result) => {
            if (result.matches) {
                this.currentSize = 'tablet';
                this.buildGrid();
            }
        }));
        this.subscriptions.push(breakpointObserver.observe([
            Breakpoints.TabletLandscape,
            Breakpoints.WebPortrait,
            Breakpoints.WebLandscape,
        ]).subscribe((result) => {
            if (result.matches) {
                this.currentSize = 'web';
                this.buildGrid();
            }
        }));
        this.subscriptions.push(breakpointObserver.observe([
            Breakpoints.XLarge,
        ]).subscribe((result) => {
            if (result.matches) {
                this.currentSize = 'wide';
                this.buildGrid();
            }
        }));
    }
}
BaseFieldGridComponent.decorators = [
    { type: Directive }
];
BaseFieldGridComponent.ctorParameters = () => [
    { type: BreakpointObserver }
];
BaseFieldGridComponent.propDecorators = {
    special: [{ type: Input }],
    actions: [{ type: Input }],
    appendActions: [{ type: Input }],
    labelDisplay: [{ type: Input }],
    labelClass: [{ type: Input }],
    inputClass: [{ type: Input }],
    rowClass: [{ type: Input }],
    colClass: [{ type: Input }],
    maxColumns: [{ type: Input }],
    sizeMap: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1maWVsZC1ncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb21wb25lbnRzL2ZpZWxkLWdyaWQvYmFzZS1maWVsZC1ncmlkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBRWxFLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxXQUFXLEVBQWtCLE1BQU0scUJBQXFCLENBQUM7QUFNckYsTUFBTSxPQUFnQixzQkFBc0I7SUE4Q3hDLFlBQWdDLGtCQUFzQztRQUF0Qyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBN0M3RCxZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFFdEIsaUJBQVksR0FBaUIsS0FBSyxDQUFDO1FBQ25DLGVBQVUsR0FBNkIsRUFBRSxDQUFDO1FBQzFDLGVBQVUsR0FBNkIsRUFBRSxDQUFDO1FBQzFDLGFBQVEsR0FBNkIsRUFBRSxDQUFDO1FBQ3hDLGFBQVEsR0FBNkIsRUFBRSxDQUFDO1FBR3hDLFlBQU8sR0FBa0I7WUFDOUIsT0FBTyxFQUFFLENBQUM7WUFDVixNQUFNLEVBQUUsQ0FBQztZQUNULEdBQUcsRUFBRSxDQUFDO1lBQ04sSUFBSSxFQUFFLENBQUM7U0FDVixDQUFDO1FBSUYsaUJBQVksR0FBRztZQUNYLEdBQUcsRUFBRSxJQUFJO1lBQ1QsWUFBWSxFQUFFLElBQUk7WUFDbEIsS0FBSyxFQUFFLElBQUk7U0FDZCxDQUFDO1FBRUYsaUJBQVksR0FBRztZQUNYLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLG9CQUFvQixFQUFFLElBQUk7U0FDN0IsQ0FBQztRQUVGLG1C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WUFDL0MsV0FBVyxDQUFDLE1BQU07U0FDckIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQXVCLEVBQUUsRUFBRTtZQUNyQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO2dCQUMxQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7YUFDcEI7UUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQzs7O1lBdk1KLFNBQVM7OztZQUxGLGtCQUFrQjs7O3NCQU9yQixLQUFLO3NCQUNMLEtBQUs7NEJBQ0wsS0FBSzsyQkFFTCxLQUFLO3lCQUNMLEtBQUs7eUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7eUJBRUwsS0FBSztzQkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7QnJlYWtwb2ludE9ic2VydmVyLCBCcmVha3BvaW50cywgQnJlYWtwb2ludFN0YXRlfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7RmllbGRHcmlkUm93LCBMYWJlbERpc3BsYXl9IGZyb20gJy4vZmllbGQtZ3JpZC5tb2RlbCc7XG5pbXBvcnQge1NjcmVlblNpemVNYXB9IGZyb20gJ2NvbW1vbic7XG5cblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZUZpZWxkR3JpZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBzcGVjaWFsID0gZmFsc2U7XG4gICAgQElucHV0KCkgYWN0aW9ucyA9IGZhbHNlO1xuICAgIEBJbnB1dCgpIGFwcGVuZEFjdGlvbnMgPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpIGxhYmVsRGlzcGxheTogTGFiZWxEaXNwbGF5ID0gJ3RvcCc7XG4gICAgQElucHV0KCkgbGFiZWxDbGFzczogeyBba2xhc3M6IHN0cmluZ106IGFueSB9ID0ge307XG4gICAgQElucHV0KCkgaW5wdXRDbGFzczogeyBba2xhc3M6IHN0cmluZ106IGFueSB9ID0ge307XG4gICAgQElucHV0KCkgcm93Q2xhc3M6IHsgW2tsYXNzOiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuICAgIEBJbnB1dCgpIGNvbENsYXNzOiB7IFtrbGFzczogc3RyaW5nXTogYW55IH0gPSB7fTtcblxuICAgIEBJbnB1dCgpIG1heENvbHVtbnM6IG51bWJlcjtcbiAgICBASW5wdXQoKSBzaXplTWFwOiBTY3JlZW5TaXplTWFwID0ge1xuICAgICAgICBoYW5kc2V0OiAxLFxuICAgICAgICB0YWJsZXQ6IDIsXG4gICAgICAgIHdlYjogMyxcbiAgICAgICAgd2lkZTogNFxuICAgIH07XG5cbiAgICBmaWVsZEdyaWQ6IEZpZWxkR3JpZFJvd1tdO1xuXG4gICAgYmFzZUNvbENsYXNzID0ge1xuICAgICAgICBjb2w6IHRydWUsXG4gICAgICAgICdmb3JtLWdyb3VwJzogdHJ1ZSxcbiAgICAgICAgJ20tMSc6IHRydWVcbiAgICB9O1xuXG4gICAgYmFzZVJvd0NsYXNzID0ge1xuICAgICAgICAnZm9ybS1yb3cnOiB0cnVlLFxuICAgICAgICAnYWxpZ24taXRlbXMtY2VudGVyJzogdHJ1ZVxuICAgIH07XG5cbiAgICBiYXNlTGFiZWxDbGFzcyA9IHtcbiAgICAgICAgJ2NvbC1mb3JtLWxhYmVsLXNtJzogdHJ1ZSxcbiAgICAgICAgJ21iLTAnOiB0cnVlLFxuICAgIH07XG5cbiAgICBiYXNlSW5wdXRDbGFzcyA9IHtcbiAgICAgICAgJ2Zvcm0tY29udHJvbCc6IHRydWUsXG4gICAgICAgICdmb3JtLWNvbnRyb2wtc20nOiB0cnVlLFxuICAgIH07XG5cbiAgICBwcm90ZWN0ZWQgY3VycmVudFNpemUgPSAnd2ViJztcblxuICAgIHByb3RlY3RlZCBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBicmVha3BvaW50T2JzZXJ2ZXI6IEJyZWFrcG9pbnRPYnNlcnZlcikge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmluaXRTY3JlZW5TaXplT2JzZXJ2ZXIodGhpcy5icmVha3BvaW50T2JzZXJ2ZXIpO1xuXG4gICAgICAgIHRoaXMuYnVpbGRHcmlkKCk7XG5cbiAgICAgICAgdGhpcy5jb2xDbGFzcyA9IHtcbiAgICAgICAgICAgIC4uLnRoaXMuY29sQ2xhc3MsXG4gICAgICAgICAgICAuLi50aGlzLmJhc2VDb2xDbGFzc1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucm93Q2xhc3MgPSB7XG4gICAgICAgICAgICAuLi50aGlzLnJvd0NsYXNzLFxuICAgICAgICAgICAgLi4udGhpcy5iYXNlUm93Q2xhc3NcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxhYmVsQ2xhc3MgPSB7XG4gICAgICAgICAgICAuLi50aGlzLmxhYmVsQ2xhc3MsXG4gICAgICAgICAgICAuLi50aGlzLmJhc2VMYWJlbENsYXNzXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pbnB1dENsYXNzID0ge1xuICAgICAgICAgICAgLi4udGhpcy5pbnB1dENsYXNzLFxuICAgICAgICAgICAgLi4udGhpcy5iYXNlSW5wdXRDbGFzc1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICAgIH1cblxuICAgIGdldCBjb2xOdW1iZXIoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgbWF4ID0gdGhpcy5zaXplTWFwW3RoaXMuY3VycmVudFNpemVdO1xuXG4gICAgICAgIGlmICh0aGlzLm1heENvbHVtbnMgJiYgbWF4ID4gdGhpcy5tYXhDb2x1bW5zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXhDb2x1bW5zO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1heDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWRkU3BlY2lhbFNsb3RzKGdyaWQ6IEZpZWxkR3JpZFJvd1tdKTogdm9pZCB7XG4gICAgICAgIGlmICghZ3JpZCB8fCBncmlkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5lZWRlZFNsb3RzID0gdGhpcy5nZXROZWVkZWRFeHRyYVNsb3RzKCk7XG5cbiAgICAgICAgaWYgKG5lZWRlZFNsb3RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29sTnVtYmVyID09PSAxKSB7XG5cbiAgICAgICAgICAgIG5lZWRlZFNsb3RzLnJldmVyc2UoKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1JvdyA9IHtcbiAgICAgICAgICAgICAgICAgICAgY29sczogW11cbiAgICAgICAgICAgICAgICB9IGFzIEZpZWxkR3JpZFJvdztcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxSb3cobmV3Um93KTtcbiAgICAgICAgICAgICAgICBncmlkLnB1c2gobmV3Um93KTtcblxuICAgICAgICAgICAgICAgIG5ld1Jvdy5jb2xzWzBdW3R5cGVdID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hcHBlbmRBY3Rpb25zID09PSB0cnVlKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGxhc3RSb3cgPSBncmlkW2dyaWQubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBjb25zdCBwbGFjZSA9IHRoaXMuY29sTnVtYmVyIC0gMTtcbiAgICAgICAgICAgIG5lZWRlZFNsb3RzLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgbGFzdFJvdy5jb2xzW3BsYWNlXVt0eXBlXSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbGFzdE5lZWRlZENvbCA9IHRoaXMuY29sTnVtYmVyIC0gbmVlZGVkU2xvdHMubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGxhc3RSb3cgPSBncmlkW2dyaWQubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAgIGlmIChsYXN0Um93LmNvbHNbbGFzdE5lZWRlZENvbF0uZmllbGQpIHtcbiAgICAgICAgICAgICAgICBsYXN0Um93ID0ge1xuICAgICAgICAgICAgICAgICAgICBjb2xzOiBbXVxuICAgICAgICAgICAgICAgIH0gYXMgRmllbGRHcmlkUm93O1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsbFJvdyhsYXN0Um93KTtcbiAgICAgICAgICAgICAgICBncmlkLnB1c2gobGFzdFJvdyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBwbGFjZSA9IHRoaXMuY29sTnVtYmVyIC0gMTtcbiAgICAgICAgICAgIG5lZWRlZFNsb3RzLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgbGFzdFJvdy5jb2xzW3BsYWNlXVt0eXBlXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcGxhY2UtLTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0TmVlZGVkRXh0cmFTbG90cygpOiBzdHJpbmdbXSB7XG4gICAgICAgIGNvbnN0IG5lZWRlZFNsb3RzID0gW107XG5cbiAgICAgICAgaWYgKHRoaXMuYWN0aW9ucykge1xuICAgICAgICAgICAgbmVlZGVkU2xvdHMucHVzaCgnYWN0aW9uU2xvdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc3BlY2lhbCkge1xuICAgICAgICAgICAgbmVlZGVkU2xvdHMucHVzaCgnc3BlY2lhbFNsb3QnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmVlZGVkU2xvdHM7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGZpbGxSb3cocm93OiBGaWVsZEdyaWRSb3cpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbGVuID0gcm93LmNvbHMubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gbGVuOyBpIDwgdGhpcy5jb2xOdW1iZXI7IGkrKykge1xuICAgICAgICAgICAgcm93LmNvbHMucHVzaCh7fSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdFNjcmVlblNpemVPYnNlcnZlcihicmVha3BvaW50T2JzZXJ2ZXI6IEJyZWFrcG9pbnRPYnNlcnZlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChicmVha3BvaW50T2JzZXJ2ZXIub2JzZXJ2ZShbXG4gICAgICAgICAgICBCcmVha3BvaW50cy5IYW5kc2V0UG9ydHJhaXQsXG4gICAgICAgIF0pLnN1YnNjcmliZSgocmVzdWx0OiBCcmVha3BvaW50U3RhdGUpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQubWF0Y2hlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNpemUgPSAnaGFuZHNldCc7XG4gICAgICAgICAgICAgICAgdGhpcy5idWlsZEdyaWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKGJyZWFrcG9pbnRPYnNlcnZlci5vYnNlcnZlKFtcbiAgICAgICAgICAgIEJyZWFrcG9pbnRzLlRhYmxldFBvcnRyYWl0LFxuICAgICAgICBdKS5zdWJzY3JpYmUoKHJlc3VsdDogQnJlYWtwb2ludFN0YXRlKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzdWx0Lm1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTaXplID0gJ3RhYmxldCc7XG4gICAgICAgICAgICAgICAgdGhpcy5idWlsZEdyaWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKGJyZWFrcG9pbnRPYnNlcnZlci5vYnNlcnZlKFtcbiAgICAgICAgICAgIEJyZWFrcG9pbnRzLlRhYmxldExhbmRzY2FwZSxcbiAgICAgICAgICAgIEJyZWFrcG9pbnRzLldlYlBvcnRyYWl0LFxuICAgICAgICAgICAgQnJlYWtwb2ludHMuV2ViTGFuZHNjYXBlLFxuICAgICAgICBdKS5zdWJzY3JpYmUoKHJlc3VsdDogQnJlYWtwb2ludFN0YXRlKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzdWx0Lm1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTaXplID0gJ3dlYic7XG4gICAgICAgICAgICAgICAgdGhpcy5idWlsZEdyaWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKGJyZWFrcG9pbnRPYnNlcnZlci5vYnNlcnZlKFtcbiAgICAgICAgICAgIEJyZWFrcG9pbnRzLlhMYXJnZSxcbiAgICAgICAgXSkuc3Vic2NyaWJlKChyZXN1bHQ6IEJyZWFrcG9pbnRTdGF0ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5tYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2l6ZSA9ICd3aWRlJztcbiAgICAgICAgICAgICAgICB0aGlzLmJ1aWxkR3JpZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgYWJzdHJhY3QgYnVpbGRHcmlkKCk6IHZvaWQ7XG5cbn1cbiJdfQ==