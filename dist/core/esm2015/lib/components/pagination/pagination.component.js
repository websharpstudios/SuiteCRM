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
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageSelection } from 'common';
import { LanguageStore } from '../../store/language/language.store';
export class PaginationComponent {
    constructor(languageStore) {
        this.languageStore = languageStore;
        this.appStrings$ = this.languageStore.appStrings$;
        this.vm$ = null;
    }
    ngOnInit() {
        const pageCount$ = this.state.getPaginationCount();
        this.vm$ = combineLatest([this.appStrings$, pageCount$]).pipe(map(([appStrings, pageCount]) => ({ appStrings, pageCount })));
    }
    first() {
        this.state.changePage(PageSelection.FIRST);
    }
    previous() {
        this.state.changePage(PageSelection.PREVIOUS);
    }
    next() {
        this.state.changePage(PageSelection.NEXT);
    }
    last() {
        this.state.changePage(PageSelection.LAST);
    }
}
PaginationComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-pagination',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<div class=\"bulk-action float-right\" *ngIf=\"(vm$ | async) as vm\">\n    <button class=\"pagination-button pagination-first\"\n            aria-label=\"Navigate to first page\"\n            (click)=\"first()\">\n        <scrm-image class=\"sicon-2x pagination-icons\" image=\"paginate_first\">\n        </scrm-image>\n    </button>\n    <button class=\"pagination-button pagination-previous\"\n            aria-label=\"Previous page\"\n            (click)=\"previous()\">\n        <scrm-image class=\"sicon-2x pagination-icons\" image=\"paginate_previous\">\n        </scrm-image>\n    </button>\n    <span class=\"pagination-count\"\n          [ngClass]=\"{\n            'hide-pagination-count': displayResponsiveTable\n          }\"\n    >\n      ({{vm.pageCount.pageFirst}}\n        - {{vm.pageCount.pageLast}} {{vm.appStrings['LBL_LIST_OF'] || ''}} {{vm.pageCount.total}})\n    </span>\n    <button class=\"pagination-button pagination-next\"\n            aria-label=\"Navigate to last page\"\n            (click)=\"next()\">\n        <scrm-image class=\"sicon-2x pagination-icons\" image=\"paginate_next\">\n        </scrm-image>\n    </button>\n    <button class=\"pagination-button pagination-last\"\n            aria-label=\"Next page\"\n            (click)=\"last()\">\n        <scrm-image class=\"sicon-2x pagination-icons\" image=\"paginate_last\">\n        </scrm-image>\n    </button>\n</div>\n"
            },] }
];
PaginationComponent.ctorParameters = () => [
    { type: LanguageStore }
];
PaginationComponent.propDecorators = {
    state: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29tcG9uZW50cy9wYWdpbmF0aW9uL3BhZ2luYXRpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBUyxNQUFNLGVBQWUsQ0FBQztBQUN2RCxPQUFPLEVBQUMsYUFBYSxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuQyxPQUFPLEVBQUMsYUFBYSxFQUF3QyxNQUFNLFFBQVEsQ0FBQztBQUM1RSxPQUFPLEVBQUMsYUFBYSxFQUFvQixNQUFNLHFDQUFxQyxDQUFDO0FBV3JGLE1BQU0sT0FBTyxtQkFBbUI7SUFRNUIsWUFBc0IsYUFBNEI7UUFBNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFIbEQsZ0JBQVcsR0FBa0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7UUFDNUUsUUFBRyxHQUFvQyxJQUFJLENBQUM7SUFHNUMsQ0FBQztJQUVELFFBQVE7UUFDSixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFFbkQsSUFBSSxDQUFDLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUN6RCxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDLENBQzlELENBQUM7SUFDTixDQUFDO0lBRUQsS0FBSztRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QyxDQUFDOzs7WUFyQ0osU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLDh1RkFBd0M7YUFDM0M7OztZQVZPLGFBQWE7OztvQkFhaEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1BhZ2VTZWxlY3Rpb24sIFBhZ2luYXRpb25Db3VudCwgUGFnaW5hdGlvbkRhdGFTb3VyY2V9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmUsIExhbmd1YWdlU3RyaW5nTWFwfSBmcm9tICcuLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFnaW5hdGlvblZpZXdNb2RlbCB7XG4gICAgYXBwU3RyaW5nczogTGFuZ3VhZ2VTdHJpbmdNYXA7XG4gICAgcGFnZUNvdW50OiBQYWdpbmF0aW9uQ291bnQ7XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1wYWdpbmF0aW9uJyxcbiAgICB0ZW1wbGF0ZVVybDogJ3BhZ2luYXRpb24uY29tcG9uZW50Lmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIFBhZ2luYXRpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgQElucHV0KCkgc3RhdGU6IFBhZ2luYXRpb25EYXRhU291cmNlO1xuICAgIGRpc3BsYXlSZXNwb25zaXZlVGFibGU6IGFueTtcblxuICAgIGFwcFN0cmluZ3MkOiBPYnNlcnZhYmxlPExhbmd1YWdlU3RyaW5nTWFwPiA9IHRoaXMubGFuZ3VhZ2VTdG9yZS5hcHBTdHJpbmdzJDtcbiAgICB2bSQ6IE9ic2VydmFibGU8UGFnaW5hdGlvblZpZXdNb2RlbD4gPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGxhbmd1YWdlU3RvcmU6IExhbmd1YWdlU3RvcmUpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcGFnZUNvdW50JCA9IHRoaXMuc3RhdGUuZ2V0UGFnaW5hdGlvbkNvdW50KCk7XG5cbiAgICAgICAgdGhpcy52bSQgPSBjb21iaW5lTGF0ZXN0KFt0aGlzLmFwcFN0cmluZ3MkLCBwYWdlQ291bnQkXSkucGlwZShcbiAgICAgICAgICAgIG1hcCgoW2FwcFN0cmluZ3MsIHBhZ2VDb3VudF0pID0+ICh7YXBwU3RyaW5ncywgcGFnZUNvdW50fSkpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZmlyc3QoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RhdGUuY2hhbmdlUGFnZShQYWdlU2VsZWN0aW9uLkZJUlNUKTtcbiAgICB9XG5cbiAgICBwcmV2aW91cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5jaGFuZ2VQYWdlKFBhZ2VTZWxlY3Rpb24uUFJFVklPVVMpO1xuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RhdGUuY2hhbmdlUGFnZShQYWdlU2VsZWN0aW9uLk5FWFQpO1xuICAgIH1cblxuICAgIGxhc3QoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RhdGUuY2hhbmdlUGFnZShQYWdlU2VsZWN0aW9uLkxBU1QpO1xuICAgIH1cbn1cbiJdfQ==