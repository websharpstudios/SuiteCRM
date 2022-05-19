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
import { isVoid } from 'common';
import { BehaviorSubject, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
export class RecordPanelComponent {
    constructor() {
        this.panelMode = 'closable';
    }
    ngOnInit() {
        this.vm$ = this.config.store.vm$;
        this.initCloseButton();
        if (this.config.panelMode) {
            this.panelMode = this.config.panelMode;
        }
        this.collapse = new BehaviorSubject(false);
        this.isCollapsed$ = this.collapse.asObservable();
        if (!isVoid(this.config.isCollapsed)) {
            this.collapse.next(this.config.isCollapsed);
        }
    }
    ngOnDestroy() {
    }
    getGridConfig() {
        return {
            record$: this.config.store.stagingRecord$,
            mode$: this.config.store.mode$,
            fields$: this.config.store.getViewFieldsKeys$(),
            actions: this.config.actions,
            klass: 'mt-2 rounded shadow-sm',
            buttonClass: 'btn btn-outline-danger btn-sm',
            maxColumns$: of(4).pipe(shareReplay(1)),
            sizeMap$: of({
                handset: 1,
                tablet: 2,
                web: 3,
                wide: 4
            }).pipe(shareReplay(1)),
        };
    }
    /**
     * Init close button
     */
    initCloseButton() {
        this.closeButton = {
            onClick: () => {
                this.config.onClose();
            }
        };
    }
}
RecordPanelComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-record-panel',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<scrm-panel *ngIf=\"(vm$ | async) as vm\"\n            [close]=\"closeButton\"\n            [isCollapsed$]=\"isCollapsed$\"\n            [mode]=\"panelMode\"\n            [titleKey]=\"config.title || ''\"\n            klass=\"record-panel {{ (config && config.klass) || ''}}\">\n\n    <div class=\"pl-2 pr-2\" panel-body>\n\n        <ng-container *ngIf=\"config\">\n            <scrm-record-grid [config]=\"getGridConfig()\"></scrm-record-grid>\n        </ng-container>\n\n    </div>\n\n</scrm-panel>\n"
            },] }
];
RecordPanelComponent.ctorParameters = () => [];
RecordPanelComponent.propDecorators = {
    config: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLXBhbmVsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb250YWluZXJzL3JlY29yZC1wYW5lbC9jb21wb25lbnRzL3JlY29yZC1wYW5lbC9yZWNvcmQtcGFuZWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBb0IsTUFBTSxlQUFlLENBQUM7QUFDbEUsT0FBTyxFQUFrQixNQUFNLEVBQWdCLE1BQU0sUUFBUSxDQUFDO0FBQzlELE9BQU8sRUFBQyxlQUFlLEVBQWMsRUFBRSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3JELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQVMzQyxNQUFNLE9BQU8sb0JBQW9CO0lBVzdCO1FBUEEsY0FBUyxHQUF3QyxVQUFVLENBQUM7SUFRNUQsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUVqQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1NBQzFDO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGVBQWUsQ0FBVSxLQUFLLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDL0M7SUFFTCxDQUFDO0lBRUQsV0FBVztJQUNYLENBQUM7SUFFRCxhQUFhO1FBRVQsT0FBTztZQUNILE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjO1lBQ3pDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLO1lBQzlCLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRTtZQUMvQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO1lBQzVCLEtBQUssRUFBRSx3QkFBd0I7WUFDL0IsV0FBVyxFQUFFLCtCQUErQjtZQUM1QyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsUUFBUSxFQUFFLEVBQUUsQ0FBQztnQkFDVCxPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsQ0FBQztnQkFDVCxHQUFHLEVBQUUsQ0FBQztnQkFDTixJQUFJLEVBQUUsQ0FBQzthQUNPLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZCLENBQUM7SUFDMUIsQ0FBQztJQUVEOztPQUVHO0lBQ08sZUFBZTtRQUVyQixJQUFJLENBQUMsV0FBVyxHQUFHO1lBQ2YsT0FBTyxFQUFFLEdBQVMsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMxQixDQUFDO1NBQ2UsQ0FBQztJQUN6QixDQUFDOzs7WUFwRUosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLG0yREFBNEM7YUFFL0M7Ozs7cUJBR0ksS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0J1dHRvbkludGVyZmFjZSwgaXNWb2lkLCBTY3JlZW5TaXplTWFwfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIG9mfSBmcm9tICdyeGpzJztcbmltcG9ydCB7c2hhcmVSZXBsYXl9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7UmVjb3JkR3JpZENvbmZpZ30gZnJvbSAnLi4vLi4vLi4vLi4vY29tcG9uZW50cy9yZWNvcmQtZ3JpZC9yZWNvcmQtZ3JpZC5tb2RlbCc7XG5pbXBvcnQge1JlY29yZFBhbmVsQ29uZmlnfSBmcm9tICcuL3JlY29yZC1wYW5lbC5tb2RlbCc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1yZWNvcmQtcGFuZWwnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9yZWNvcmQtcGFuZWwuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogW10sXG59KVxuZXhwb3J0IGNsYXNzIFJlY29yZFBhbmVsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KCkgY29uZmlnOiBSZWNvcmRQYW5lbENvbmZpZztcbiAgICBjbG9zZUJ1dHRvbjogQnV0dG9uSW50ZXJmYWNlO1xuICAgIHBhbmVsTW9kZTogJ2NvbGxhcHNpYmxlJyB8ICdjbG9zYWJsZScgfCAnbm9uZScgPSAnY2xvc2FibGUnO1xuICAgIGlzQ29sbGFwc2VkJDogT2JzZXJ2YWJsZTxib29sZWFuPjtcblxuICAgIHZtJDogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gICAgcHJvdGVjdGVkIGNvbGxhcHNlOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy52bSQgPSB0aGlzLmNvbmZpZy5zdG9yZS52bSQ7XG5cbiAgICAgICAgdGhpcy5pbml0Q2xvc2VCdXR0b24oKTtcblxuICAgICAgICBpZiAodGhpcy5jb25maWcucGFuZWxNb2RlKSB7XG4gICAgICAgICAgICB0aGlzLnBhbmVsTW9kZSA9IHRoaXMuY29uZmlnLnBhbmVsTW9kZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29sbGFwc2UgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgICAgICAgdGhpcy5pc0NvbGxhcHNlZCQgPSB0aGlzLmNvbGxhcHNlLmFzT2JzZXJ2YWJsZSgpO1xuICAgICAgICBpZiAoIWlzVm9pZCh0aGlzLmNvbmZpZy5pc0NvbGxhcHNlZCkpIHtcbiAgICAgICAgICAgIHRoaXMuY29sbGFwc2UubmV4dCh0aGlzLmNvbmZpZy5pc0NvbGxhcHNlZCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIH1cblxuICAgIGdldEdyaWRDb25maWcoKTogUmVjb3JkR3JpZENvbmZpZyB7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlY29yZCQ6IHRoaXMuY29uZmlnLnN0b3JlLnN0YWdpbmdSZWNvcmQkLFxuICAgICAgICAgICAgbW9kZSQ6IHRoaXMuY29uZmlnLnN0b3JlLm1vZGUkLFxuICAgICAgICAgICAgZmllbGRzJDogdGhpcy5jb25maWcuc3RvcmUuZ2V0Vmlld0ZpZWxkc0tleXMkKCksXG4gICAgICAgICAgICBhY3Rpb25zOiB0aGlzLmNvbmZpZy5hY3Rpb25zLFxuICAgICAgICAgICAga2xhc3M6ICdtdC0yIHJvdW5kZWQgc2hhZG93LXNtJyxcbiAgICAgICAgICAgIGJ1dHRvbkNsYXNzOiAnYnRuIGJ0bi1vdXRsaW5lLWRhbmdlciBidG4tc20nLFxuICAgICAgICAgICAgbWF4Q29sdW1ucyQ6IG9mKDQpLnBpcGUoc2hhcmVSZXBsYXkoMSkpLFxuICAgICAgICAgICAgc2l6ZU1hcCQ6IG9mKHtcbiAgICAgICAgICAgICAgICBoYW5kc2V0OiAxLFxuICAgICAgICAgICAgICAgIHRhYmxldDogMixcbiAgICAgICAgICAgICAgICB3ZWI6IDMsXG4gICAgICAgICAgICAgICAgd2lkZTogNFxuICAgICAgICAgICAgfSBhcyBTY3JlZW5TaXplTWFwKS5waXBlKHNoYXJlUmVwbGF5KDEpKSxcbiAgICAgICAgfSBhcyBSZWNvcmRHcmlkQ29uZmlnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXQgY2xvc2UgYnV0dG9uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGluaXRDbG9zZUJ1dHRvbigpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLmNsb3NlQnV0dG9uID0ge1xuICAgICAgICAgICAgb25DbGljazogKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLm9uQ2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBhcyBCdXR0b25JbnRlcmZhY2U7XG4gICAgfVxuXG59XG4iXX0=