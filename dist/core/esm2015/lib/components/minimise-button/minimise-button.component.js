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
import { Button } from 'common';
export class MinimiseButtonComponent {
    constructor() {
        this.status = 'maximised';
        this.buttonClasses = ['minimise-button'];
    }
    ngOnInit() {
        this.buildButton();
    }
    ngOnChanges(changes) {
        if (changes.config) {
            this.buildButton();
        }
    }
    buildButton() {
        const btn = Button.fromButton(this.config);
        btn.addClasses(this.buttonClasses);
        btn.icon = this.getIcon();
        btn.onClick = () => {
            this.config.onClick();
            this.toggleStatus();
        };
        this.internalConfig = btn;
    }
    toggleStatus() {
        let newStatus = 'minimised';
        if (this.status === 'minimised') {
            newStatus = 'maximised';
        }
        this.status = newStatus;
        this.buildButton();
    }
    getIcon() {
        if (this.status === 'minimised') {
            return 'plus_thin';
        }
        return 'minimise';
    }
}
MinimiseButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-minimise-button',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container *ngIf=\"internalConfig\">\n    <scrm-button [config]=\"internalConfig\"></scrm-button>\n</ng-container>\n"
            },] }
];
MinimiseButtonComponent.ctorParameters = () => [];
MinimiseButtonComponent.propDecorators = {
    config: [{ type: Input }],
    status: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluaW1pc2UtYnV0dG9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb21wb25lbnRzL21pbmltaXNlLWJ1dHRvbi9taW5pbWlzZS1idXR0b24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBbUMsTUFBTSxlQUFlLENBQUM7QUFDakYsT0FBTyxFQUFDLE1BQU0sRUFBa0IsTUFBTSxRQUFRLENBQUM7QUFTL0MsTUFBTSxPQUFPLHVCQUF1QjtJQU9oQztRQUxTLFdBQU0sR0FBeUIsV0FBVyxDQUFDO1FBR3BELGtCQUFhLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBR3BDLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDOUIsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUN0QjtJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1AsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDMUIsR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFTLEVBQUU7WUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7SUFDOUIsQ0FBQztJQUVELFlBQVk7UUFDUixJQUFJLFNBQVMsR0FBeUIsV0FBVyxDQUFDO1FBQ2xELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxXQUFXLEVBQUU7WUFDN0IsU0FBUyxHQUFHLFdBQVcsQ0FBQztTQUMzQjtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsT0FBTztRQUNILElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxXQUFXLEVBQUU7WUFDN0IsT0FBTyxXQUFXLENBQUM7U0FDdEI7UUFDRCxPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDOzs7WUFsREosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLG8rQ0FBK0M7YUFFbEQ7Ozs7cUJBRUksS0FBSztxQkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0LCBTaW1wbGVDaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QnV0dG9uLCBCdXR0b25JbnRlcmZhY2V9IGZyb20gJ2NvbW1vbic7XG5cbmV4cG9ydCB0eXBlIE1pbmltaXNlQnV0dG9uU3RhdHVzID0gJ21pbmltaXNlZCcgfCAnbWF4aW1pc2VkJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLW1pbmltaXNlLWJ1dHRvbicsXG4gICAgdGVtcGxhdGVVcmw6ICcuL21pbmltaXNlLWJ1dHRvbi5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBNaW5pbWlzZUJ1dHRvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgICBASW5wdXQoKSBjb25maWc6IEJ1dHRvbkludGVyZmFjZTtcbiAgICBASW5wdXQoKSBzdGF0dXM6IE1pbmltaXNlQnV0dG9uU3RhdHVzID0gJ21heGltaXNlZCc7XG4gICAgaW50ZXJuYWxDb25maWc6IEJ1dHRvbkludGVyZmFjZTtcblxuICAgIGJ1dHRvbkNsYXNzZXMgPSBbJ21pbmltaXNlLWJ1dHRvbiddO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnVpbGRCdXR0b24oKTtcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICAgIGlmIChjaGFuZ2VzLmNvbmZpZykge1xuICAgICAgICAgICAgdGhpcy5idWlsZEJ1dHRvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYnVpbGRCdXR0b24oKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGJ0biA9IEJ1dHRvbi5mcm9tQnV0dG9uKHRoaXMuY29uZmlnKTtcbiAgICAgICAgYnRuLmFkZENsYXNzZXModGhpcy5idXR0b25DbGFzc2VzKTtcbiAgICAgICAgYnRuLmljb24gPSB0aGlzLmdldEljb24oKTtcbiAgICAgICAgYnRuLm9uQ2xpY2sgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5vbkNsaWNrKCk7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVN0YXR1cygpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmludGVybmFsQ29uZmlnID0gYnRuO1xuICAgIH1cblxuICAgIHRvZ2dsZVN0YXR1cygpOiB2b2lkIHtcbiAgICAgICAgbGV0IG5ld1N0YXR1czogTWluaW1pc2VCdXR0b25TdGF0dXMgPSAnbWluaW1pc2VkJztcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAnbWluaW1pc2VkJykge1xuICAgICAgICAgICAgbmV3U3RhdHVzID0gJ21heGltaXNlZCc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0dXMgPSBuZXdTdGF0dXM7XG4gICAgICAgIHRoaXMuYnVpbGRCdXR0b24oKTtcbiAgICB9XG5cbiAgICBnZXRJY29uKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gJ21pbmltaXNlZCcpIHtcbiAgICAgICAgICAgIHJldHVybiAncGx1c190aGluJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ21pbmltaXNlJztcbiAgICB9XG59XG4iXX0=