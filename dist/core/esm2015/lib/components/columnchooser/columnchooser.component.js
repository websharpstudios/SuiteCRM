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
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppStateStore } from "../../store/app-state/app-state.store";
import { LanguageStore } from "../../store/language/language.store";
export class ColumnChooserComponent {
    constructor(appState, languageStore, modal) {
        this.appState = appState;
        this.languageStore = languageStore;
        this.modal = modal;
        this.titleKey = 'LBL_COLUMN_SELECTOR_MODAL_TITLE';
    }
    drop(event) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        }
        else {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
    }
    getHeaderLabel() {
        return this.languageStore.getFieldLabel('LBL_COLUMN_SELECTOR_MODAL_TITLE');
    }
    getColumnLabel(label) {
        return this.languageStore.getFieldLabel(label, this.appState.getModule());
    }
    ngOnInit() {
        this.closeButtonIcon = {
            klass: ['btn', 'btn-outline-light', 'btn-sm'],
            onClick: () => {
                this.modal.close({
                    type: 'close-button'
                });
            }
        };
        this.closeButton = {
            klass: ['btn', 'modal-button-cancel'],
            labelKey: 'LBL_COLUMN_SELECTOR_CLOSE_BUTTON',
            onClick: () => {
                this.modal.close({
                    type: 'close-button'
                });
            }
        };
        this.saveButton = {
            klass: ['btn', 'modal-button-save'],
            labelKey: 'LBL_COLUMN_SELECTOR_SAVE_BUTTON',
            onClick: () => {
                this.modal.close({
                    type: 'close-button',
                    displayed: this.displayed,
                    hidden: this.hidden
                });
            }
        };
    }
}
ColumnChooserComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-columnchooser',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n\n<scrm-modal\n    [closable]=\"true\"\n    [close]=\"closeButtonIcon\"\n    [title]=\"getHeaderLabel()\"\n    [titleKey]=\"titleKey\"\n    klass=\"column-chooser-modal\">\n\n    <div modal-body>\n\n        <div class=\"d-flex bd-highlight\">\n            <div class=\"p-2 flex-fill bd-highlight column-chooser-container\">\n                <h2 class=\"column-chooser-title\">\n                    <scrm-label labelKey=\"LBL_COLUMN_SELECTOR_DISPLAYED_COLS\"></scrm-label>\n                </h2>\n\n                <div\n                    cdkDropList\n                    #displayedList=\"cdkDropList\"\n                    [cdkDropListData]=\"displayed\"\n                    [cdkDropListConnectedTo]=\"[hiddenList]\"\n                    class=\"column-chooser-list\"\n                    (cdkDropListDropped)=\"drop($event)\">\n                    <div class=\"column-chooser-item column-displayed\" *ngFor=\"let item of displayed\"\n                         cdkDrag>\n                        {{getColumnLabel(item.label)}}\n                    </div>\n                </div>\n            </div>\n            <div class=\"p-2 flex-fill bd-highlight column-chooser-container\">\n                <h2 class=\"column-chooser-title\">\n                    <scrm-label labelKey=\"LBL_COLUMN_SELECTOR_HIDDEN_COLS\"></scrm-label>\n                </h2>\n\n                <div\n                    cdkDropList\n                    #hiddenList=\"cdkDropList\"\n                    [cdkDropListData]=\"hidden\"\n                    [cdkDropListConnectedTo]=\"[displayedList]\"\n                    class=\"column-chooser-list\"\n                    (cdkDropListDropped)=\"drop($event)\">\n                    <div class=\"column-chooser-item column-hidden\" *ngFor=\"let item of hidden\" cdkDrag>\n                        {{getColumnLabel(item.label)}}\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div modal-footer>\n        <div class=\"modal-buttons\">\n            <scrm-button data-dismiss=\"modal\" [config]=\"closeButton\"></scrm-button>\n            <scrm-button [config]=\"saveButton\"></scrm-button>\n        </div>\n    </div>\n\n</scrm-modal>\n"
            },] }
];
ColumnChooserComponent.ctorParameters = () => [
    { type: AppStateStore },
    { type: LanguageStore },
    { type: NgbActiveModal }
];
ColumnChooserComponent.propDecorators = {
    displayed: [{ type: Input }],
    hidden: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uY2hvb3Nlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29tcG9uZW50cy9jb2x1bW5jaG9vc2VyL2NvbHVtbmNob29zZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBUyxNQUFNLGVBQWUsQ0FBQztBQUN2RCxPQUFPLEVBQWMsZUFBZSxFQUFFLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkYsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBRTFELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUNwRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFPbEUsTUFBTSxPQUFPLHNCQUFzQjtJQVMvQixZQUNjLFFBQXVCLEVBQ3ZCLGFBQTRCLEVBQy9CLEtBQXFCO1FBRmxCLGFBQVEsR0FBUixRQUFRLENBQWU7UUFDdkIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDL0IsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFSaEMsYUFBUSxHQUFHLGlDQUFpQyxDQUFDO0lBUzdDLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBNkI7UUFDOUIsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEtBQUssS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUM3QyxlQUFlLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDbEY7YUFBTTtZQUNILGlCQUFpQixDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQzFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUNwQixLQUFLLENBQUMsYUFBYSxFQUNuQixLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDM0I7SUFDTCxDQUFDO0lBRUQsY0FBYztRQUNWLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRUQsY0FBYyxDQUFDLEtBQWE7UUFDeEIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCxRQUFRO1FBRUosSUFBSSxDQUFDLGVBQWUsR0FBRztZQUNuQixLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxDQUFDO1lBQzdDLE9BQU8sRUFBRSxHQUFTLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO29CQUNiLElBQUksRUFBRSxjQUFjO2lCQUNELENBQUMsQ0FBQztZQUM3QixDQUFDO1NBQ2UsQ0FBQztRQUVyQixJQUFJLENBQUMsV0FBVyxHQUFHO1lBQ2YsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLHFCQUFxQixDQUFDO1lBQ3JDLFFBQVEsRUFBRSxrQ0FBa0M7WUFDNUMsT0FBTyxFQUFFLEdBQVMsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7b0JBQ2IsSUFBSSxFQUFFLGNBQWM7aUJBQ0QsQ0FBQyxDQUFDO1lBQzdCLENBQUM7U0FDZSxDQUFDO1FBRXJCLElBQUksQ0FBQyxVQUFVLEdBQUc7WUFDZCxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLENBQUM7WUFDbkMsUUFBUSxFQUFFLGlDQUFpQztZQUMzQyxPQUFPLEVBQUUsR0FBUyxFQUFFO2dCQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztvQkFDYixJQUFJLEVBQUUsY0FBYztvQkFDcEIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO29CQUN6QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07aUJBQ0EsQ0FBQyxDQUFDO1lBQzdCLENBQUM7U0FDZSxDQUFDO0lBRXpCLENBQUM7OztZQXhFSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsaWhIQUE2QzthQUNoRDs7O1lBTk8sYUFBYTtZQUNiLGFBQWE7WUFIYixjQUFjOzs7d0JBV2pCLEtBQUs7cUJBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDZGtEcmFnRHJvcCwgbW92ZUl0ZW1JbkFycmF5LCB0cmFuc2ZlckFycmF5SXRlbX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2RyYWctZHJvcCc7XG5pbXBvcnQge05nYkFjdGl2ZU1vZGFsfSBmcm9tICdAbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcCc7XG5pbXBvcnQge0J1dHRvbkludGVyZmFjZSwgQ29sdW1uRGVmaW5pdGlvbiwgTW9kYWxDbG9zZUZlZWRCYWNrfSBmcm9tIFwiY29tbW9uXCI7XG5pbXBvcnQge0FwcFN0YXRlU3RvcmV9IGZyb20gXCIuLi8uLi9zdG9yZS9hcHAtc3RhdGUvYXBwLXN0YXRlLnN0b3JlXCI7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmV9IGZyb20gXCIuLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZVwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tY29sdW1uY2hvb3NlcicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2NvbHVtbmNob29zZXIuY29tcG9uZW50Lmh0bWwnLFxufSlcblxuZXhwb3J0IGNsYXNzIENvbHVtbkNob29zZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIEBJbnB1dCgpIGRpc3BsYXllZDogQ29sdW1uRGVmaW5pdGlvbltdO1xuICAgIEBJbnB1dCgpIGhpZGRlbjogQ29sdW1uRGVmaW5pdGlvbltdO1xuXG4gICAgdGl0bGVLZXkgPSAnTEJMX0NPTFVNTl9TRUxFQ1RPUl9NT0RBTF9USVRMRSc7XG4gICAgY2xvc2VCdXR0b25JY29uOiBCdXR0b25JbnRlcmZhY2U7XG4gICAgY2xvc2VCdXR0b246IEJ1dHRvbkludGVyZmFjZTtcbiAgICBzYXZlQnV0dG9uOiBCdXR0b25JbnRlcmZhY2U7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGFwcFN0YXRlOiBBcHBTdGF0ZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbGFuZ3VhZ2VTdG9yZTogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHVibGljIG1vZGFsOiBOZ2JBY3RpdmVNb2RhbCkge1xuICAgIH1cblxuICAgIGRyb3AoZXZlbnQ6IENka0RyYWdEcm9wPHt9W10sIGFueT4pOiB2b2lkIHtcbiAgICAgICAgaWYgKGV2ZW50LnByZXZpb3VzQ29udGFpbmVyID09PSBldmVudC5jb250YWluZXIpIHtcbiAgICAgICAgICAgIG1vdmVJdGVtSW5BcnJheShldmVudC5jb250YWluZXIuZGF0YSwgZXZlbnQucHJldmlvdXNJbmRleCwgZXZlbnQuY3VycmVudEluZGV4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyYW5zZmVyQXJyYXlJdGVtKGV2ZW50LnByZXZpb3VzQ29udGFpbmVyLmRhdGEsXG4gICAgICAgICAgICAgICAgZXZlbnQuY29udGFpbmVyLmRhdGEsXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmlvdXNJbmRleCxcbiAgICAgICAgICAgICAgICBldmVudC5jdXJyZW50SW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SGVhZGVyTGFiZWwoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGFuZ3VhZ2VTdG9yZS5nZXRGaWVsZExhYmVsKCdMQkxfQ09MVU1OX1NFTEVDVE9SX01PREFMX1RJVExFJyk7XG4gICAgfVxuXG4gICAgZ2V0Q29sdW1uTGFiZWwobGFiZWw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhbmd1YWdlU3RvcmUuZ2V0RmllbGRMYWJlbChsYWJlbCwgdGhpcy5hcHBTdGF0ZS5nZXRNb2R1bGUoKSk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5jbG9zZUJ1dHRvbkljb24gPSB7XG4gICAgICAgICAgICBrbGFzczogWydidG4nLCAnYnRuLW91dGxpbmUtbGlnaHQnLCAnYnRuLXNtJ10sXG4gICAgICAgICAgICBvbkNsaWNrOiAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbC5jbG9zZSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjbG9zZS1idXR0b24nXG4gICAgICAgICAgICAgICAgfSBhcyBNb2RhbENsb3NlRmVlZEJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGFzIEJ1dHRvbkludGVyZmFjZTtcblxuICAgICAgICB0aGlzLmNsb3NlQnV0dG9uID0ge1xuICAgICAgICAgICAga2xhc3M6IFsnYnRuJywgJ21vZGFsLWJ1dHRvbi1jYW5jZWwnXSxcbiAgICAgICAgICAgIGxhYmVsS2V5OiAnTEJMX0NPTFVNTl9TRUxFQ1RPUl9DTE9TRV9CVVRUT04nLFxuICAgICAgICAgICAgb25DbGljazogKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kYWwuY2xvc2Uoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2xvc2UtYnV0dG9uJ1xuICAgICAgICAgICAgICAgIH0gYXMgTW9kYWxDbG9zZUZlZWRCYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBhcyBCdXR0b25JbnRlcmZhY2U7XG5cbiAgICAgICAgdGhpcy5zYXZlQnV0dG9uID0ge1xuICAgICAgICAgICAga2xhc3M6IFsnYnRuJywgJ21vZGFsLWJ1dHRvbi1zYXZlJ10sXG4gICAgICAgICAgICBsYWJlbEtleTogJ0xCTF9DT0xVTU5fU0VMRUNUT1JfU0FWRV9CVVRUT04nLFxuICAgICAgICAgICAgb25DbGljazogKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kYWwuY2xvc2Uoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2xvc2UtYnV0dG9uJyxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheWVkOiB0aGlzLmRpc3BsYXllZCxcbiAgICAgICAgICAgICAgICAgICAgaGlkZGVuOiB0aGlzLmhpZGRlblxuICAgICAgICAgICAgICAgIH0gYXMgTW9kYWxDbG9zZUZlZWRCYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBhcyBCdXR0b25JbnRlcmZhY2U7XG5cbiAgICB9XG5cbn1cbiJdfQ==