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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { isEmptyString } from 'common';
import { AppStateStore } from '../../store/app-state/app-state.store';
import { LanguageStore } from '../../store/language/language.store';
export const alertTypes = {
    success: {
        alertClass: 'alert-success',
        alertIcon: 'info-circle'
    },
    error: {
        alertClass: 'alert-danger',
        alertIcon: 'exclamation-circle'
    },
    warning: {
        alertClass: 'alert-warning',
        alertIcon: 'exclamation-triangle'
    },
    info: {
        alertClass: 'alert-info',
        alertIcon: 'info-circle'
    },
    light: {
        alertClass: 'alert-light',
        alertIcon: 'exclamation-circle'
    }
};
export class InstallErrorModalComponent {
    constructor(appState, languageStore, modal) {
        this.appState = appState;
        this.languageStore = languageStore;
        this.modal = modal;
        this.titleKey = 'LBL_CHECKSYS_TITLE';
    }
    getHeaderLabel() {
        return this.languageStore.getFieldLabel('LBL_CHECKSYS_TITLE');
    }
    getColumnLabel(label) {
        const langLabel = this.languageStore.getFieldLabel(label, this.appState.getModule());
        return !isEmptyString(langLabel) ? langLabel : label;
    }
    ngOnInit() {
        console.log(this.errors);
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
    }
    getAlertType(alert) {
        if (alert.status === 'error') {
            return alertTypes[alert.type]['alertClass'];
        }
        return alertTypes[alert.status]['alertClass'];
    }
    getAlertIcon(alert) {
        if (alert.status === 'error') {
            return alertTypes[alert.type]['alertIcon'];
        }
        return alertTypes[alert.status]['alertIcon'];
    }
    returnZero() {
        return 0;
    }
}
InstallErrorModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-install-error-modal',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n\n<scrm-modal\n    [closable]=\"true\"\n    [close]=\"closeButtonIcon\"\n    [title]=\"getHeaderLabel()\"\n    [titleKey]=\"titleKey\"\n    [headerKlass]=\"'alert-header'\"\n    [bodyKlass]=\"'alert-body'\">\n\n    <div modal-body>\n        <ng-container>\n            <div *ngIf=\"errors['hasValidationError'] && errors['hasValidationError'] === true\"\n                 class=\"alert alert-danger\" role=\"alert\">\n\n                <div class=\"alert-heading\">\n                    <strong>{{getColumnLabel('LBL_CHECKSYS_TITLE')}}</strong>\n                </div>\n                <div class=\"alert-desc\">\n                    {{getColumnLabel('ERR_CHECKSYS')}}\n                </div>\n            </div>\n\n            <div>\n                <ul class=\"list-style-none\">\n\n                    <li *ngFor=\"let item of errors['data'] | keyvalue : returnZero\">\n\n                        <div class=\"alert {{getAlertType(item.value)}}\" role=\"alert\">\n\n                            <div>\n                                <span>\n                                    <scrm-image [image]=\"getAlertIcon(item.value)\"></scrm-image>\n                                    <strong style=\"margin-left: 2px;\">\n                                        {{getColumnLabel(item.value.label)}}\n                                    </strong>\n                                </span>\n\n                                <span *ngIf=\"item.value.info!==''\" style=\"float:right\">\n                                    <strong>\n                                        {{getColumnLabel(item.value.info)}}\n                                    </strong>\n                                </span>\n                            </div>\n\n                            <div *ngIf=\"item.value.error!==''\">\n                                {{getColumnLabel(item.value.error)}}\n                            </div>\n                        </div>\n\n                        <div *ngIf=\"item.value.data.length!==0\" class=\"alert alert-light\" role=\"alert\">\n                            <ul>\n                                <li *ngFor=\"let subItems of item.value.data\">\n                                    {{subItems}}\n                                </li>\n                            </ul>\n                        </div>\n\n                    </li>\n                </ul>\n            </div>\n        </ng-container>\n    </div>\n</scrm-modal>\n\n"
            },] }
];
InstallErrorModalComponent.ctorParameters = () => [
    { type: AppStateStore },
    { type: LanguageStore },
    { type: NgbActiveModal }
];
InstallErrorModalComponent.propDecorators = {
    errors: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC1lcnJvci1tb2RhbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29tcG9uZW50cy9pbnN0YWxsLWVycm9yLW1vZGFsL2luc3RhbGwtZXJyb3ItbW9kYWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBUyxNQUFNLGVBQWUsQ0FBQztBQUN2RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDMUQsT0FBTyxFQUFrQixhQUFhLEVBQXFCLE1BQU0sUUFBUSxDQUFDO0FBQzFFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUNwRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFFbEUsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHO0lBQ3RCLE9BQU8sRUFBRTtRQUNMLFVBQVUsRUFBRSxlQUFlO1FBQzNCLFNBQVMsRUFBRSxhQUFhO0tBQzNCO0lBQ0QsS0FBSyxFQUFFO1FBQ0gsVUFBVSxFQUFFLGNBQWM7UUFDMUIsU0FBUyxFQUFFLG9CQUFvQjtLQUNsQztJQUNELE9BQU8sRUFBRTtRQUNMLFVBQVUsRUFBRSxlQUFlO1FBQzNCLFNBQVMsRUFBRSxzQkFBc0I7S0FDcEM7SUFDRCxJQUFJLEVBQUU7UUFDRixVQUFVLEVBQUUsWUFBWTtRQUN4QixTQUFTLEVBQUUsYUFBYTtLQUMzQjtJQUNELEtBQUssRUFBRTtRQUNILFVBQVUsRUFBRSxhQUFhO1FBQ3pCLFNBQVMsRUFBRSxvQkFBb0I7S0FDbEM7Q0FDSixDQUFDO0FBT0YsTUFBTSxPQUFPLDBCQUEwQjtJQVFuQyxZQUNjLFFBQXVCLEVBQ3ZCLGFBQTRCLEVBQy9CLEtBQXFCO1FBRmxCLGFBQVEsR0FBUixRQUFRLENBQWU7UUFDdkIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDL0IsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFSaEMsYUFBUSxHQUFHLG9CQUFvQixDQUFDO0lBU2hDLENBQUM7SUFFRCxjQUFjO1FBQ1YsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxjQUFjLENBQUMsS0FBYTtRQUN4QixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ3JGLE9BQU8sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3pELENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLGVBQWUsR0FBRztZQUNuQixLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxDQUFDO1lBQzdDLE9BQU8sRUFBRSxHQUFTLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO29CQUNiLElBQUksRUFBRSxjQUFjO2lCQUNELENBQUMsQ0FBQztZQUM3QixDQUFDO1NBQ2UsQ0FBQztRQUVyQixJQUFJLENBQUMsV0FBVyxHQUFHO1lBQ2YsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLHFCQUFxQixDQUFDO1lBQ3JDLFFBQVEsRUFBRSxrQ0FBa0M7WUFDNUMsT0FBTyxFQUFFLEdBQVMsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7b0JBQ2IsSUFBSSxFQUFFLGNBQWM7aUJBQ0QsQ0FBQyxDQUFDO1lBQzdCLENBQUM7U0FDZSxDQUFDO0lBRXpCLENBQUM7SUFFRCxZQUFZLENBQUMsS0FBVTtRQUVuQixJQUFHLEtBQUssQ0FBQyxNQUFNLEtBQUssT0FBTyxFQUFDO1lBQ3hCLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQTtTQUM5QztRQUVELE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQVU7UUFFbkIsSUFBRyxLQUFLLENBQUMsTUFBTSxLQUFLLE9BQU8sRUFBQztZQUN4QixPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUE7U0FDN0M7UUFFRCxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELFVBQVU7UUFDTixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7OztZQXZFSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLDBCQUEwQjtnQkFDcEMsdXZIQUFtRDthQUN0RDs7O1lBN0JPLGFBQWE7WUFDYixhQUFhO1lBSGIsY0FBYzs7O3FCQWtDakIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ2JBY3RpdmVNb2RhbH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHtCdXR0b25JbnRlcmZhY2UsIGlzRW1wdHlTdHJpbmcsIE1vZGFsQ2xvc2VGZWVkQmFja30gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7QXBwU3RhdGVTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvYXBwLXN0YXRlL2FwcC1zdGF0ZS5zdG9yZSc7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL2xhbmd1YWdlL2xhbmd1YWdlLnN0b3JlJztcblxuZXhwb3J0IGNvbnN0IGFsZXJ0VHlwZXMgPSB7XG4gICAgc3VjY2Vzczoge1xuICAgICAgICBhbGVydENsYXNzOiAnYWxlcnQtc3VjY2VzcycsXG4gICAgICAgIGFsZXJ0SWNvbjogJ2luZm8tY2lyY2xlJ1xuICAgIH0sXG4gICAgZXJyb3I6IHtcbiAgICAgICAgYWxlcnRDbGFzczogJ2FsZXJ0LWRhbmdlcicsXG4gICAgICAgIGFsZXJ0SWNvbjogJ2V4Y2xhbWF0aW9uLWNpcmNsZSdcbiAgICB9LFxuICAgIHdhcm5pbmc6IHtcbiAgICAgICAgYWxlcnRDbGFzczogJ2FsZXJ0LXdhcm5pbmcnLFxuICAgICAgICBhbGVydEljb246ICdleGNsYW1hdGlvbi10cmlhbmdsZSdcbiAgICB9LFxuICAgIGluZm86IHtcbiAgICAgICAgYWxlcnRDbGFzczogJ2FsZXJ0LWluZm8nLFxuICAgICAgICBhbGVydEljb246ICdpbmZvLWNpcmNsZSdcbiAgICB9LFxuICAgIGxpZ2h0OiB7XG4gICAgICAgIGFsZXJ0Q2xhc3M6ICdhbGVydC1saWdodCcsXG4gICAgICAgIGFsZXJ0SWNvbjogJ2V4Y2xhbWF0aW9uLWNpcmNsZSdcbiAgICB9XG59O1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0taW5zdGFsbC1lcnJvci1tb2RhbCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2luc3RhbGwtZXJyb3ItbW9kYWwuY29tcG9uZW50Lmh0bWwnXG59KVxuXG5leHBvcnQgY2xhc3MgSW5zdGFsbEVycm9yTW9kYWxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIEBJbnB1dCgpIGVycm9yczogW107XG5cbiAgICB0aXRsZUtleSA9ICdMQkxfQ0hFQ0tTWVNfVElUTEUnO1xuICAgIGNsb3NlQnV0dG9uSWNvbjogQnV0dG9uSW50ZXJmYWNlO1xuICAgIGNsb3NlQnV0dG9uOiBCdXR0b25JbnRlcmZhY2U7XG4gICAgc2F2ZUJ1dHRvbjogQnV0dG9uSW50ZXJmYWNlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBhcHBTdGF0ZTogQXBwU3RhdGVTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlU3RvcmU6IExhbmd1YWdlU3RvcmUsXG4gICAgICAgIHB1YmxpYyBtb2RhbDogTmdiQWN0aXZlTW9kYWwpIHtcbiAgICB9XG5cbiAgICBnZXRIZWFkZXJMYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5sYW5ndWFnZVN0b3JlLmdldEZpZWxkTGFiZWwoJ0xCTF9DSEVDS1NZU19USVRMRScpO1xuICAgIH1cblxuICAgIGdldENvbHVtbkxhYmVsKGxhYmVsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBsYW5nTGFiZWwgPSB0aGlzLmxhbmd1YWdlU3RvcmUuZ2V0RmllbGRMYWJlbChsYWJlbCwgdGhpcy5hcHBTdGF0ZS5nZXRNb2R1bGUoKSk7XG4gICAgICAgIHJldHVybiAhaXNFbXB0eVN0cmluZyhsYW5nTGFiZWwpID8gbGFuZ0xhYmVsIDogbGFiZWw7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZXJyb3JzKTtcbiAgICAgICAgdGhpcy5jbG9zZUJ1dHRvbkljb24gPSB7XG4gICAgICAgICAgICBrbGFzczogWydidG4nLCAnYnRuLW91dGxpbmUtbGlnaHQnLCAnYnRuLXNtJ10sXG4gICAgICAgICAgICBvbkNsaWNrOiAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbC5jbG9zZSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjbG9zZS1idXR0b24nXG4gICAgICAgICAgICAgICAgfSBhcyBNb2RhbENsb3NlRmVlZEJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGFzIEJ1dHRvbkludGVyZmFjZTtcblxuICAgICAgICB0aGlzLmNsb3NlQnV0dG9uID0ge1xuICAgICAgICAgICAga2xhc3M6IFsnYnRuJywgJ21vZGFsLWJ1dHRvbi1jYW5jZWwnXSxcbiAgICAgICAgICAgIGxhYmVsS2V5OiAnTEJMX0NPTFVNTl9TRUxFQ1RPUl9DTE9TRV9CVVRUT04nLFxuICAgICAgICAgICAgb25DbGljazogKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kYWwuY2xvc2Uoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2xvc2UtYnV0dG9uJ1xuICAgICAgICAgICAgICAgIH0gYXMgTW9kYWxDbG9zZUZlZWRCYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBhcyBCdXR0b25JbnRlcmZhY2U7XG5cbiAgICB9XG5cbiAgICBnZXRBbGVydFR5cGUoYWxlcnQ6IGFueSk6IHN0cmluZ3tcblxuICAgICAgICBpZihhbGVydC5zdGF0dXMgPT09ICdlcnJvcicpe1xuICAgICAgICAgICAgcmV0dXJuIGFsZXJ0VHlwZXNbYWxlcnQudHlwZV1bJ2FsZXJ0Q2xhc3MnXVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFsZXJ0VHlwZXNbYWxlcnQuc3RhdHVzXVsnYWxlcnRDbGFzcyddO1xuICAgIH1cblxuICAgIGdldEFsZXJ0SWNvbihhbGVydDogYW55KTogc3RyaW5ne1xuXG4gICAgICAgIGlmKGFsZXJ0LnN0YXR1cyA9PT0gJ2Vycm9yJyl7XG4gICAgICAgICAgICByZXR1cm4gYWxlcnRUeXBlc1thbGVydC50eXBlXVsnYWxlcnRJY29uJ11cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhbGVydFR5cGVzW2FsZXJ0LnN0YXR1c11bJ2FsZXJ0SWNvbiddO1xuICAgIH1cblxuICAgIHJldHVyblplcm8oKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cbiJdfQ==