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
import { Component } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth/auth.service';
export class FooterUiComponent {
    constructor(modalService, authService) {
        this.modalService = modalService;
        this.authService = authService;
    }
    openSugarCopyright(sugarcopyright) {
        this.modalService.open(sugarcopyright, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            size: 'lg'
        }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    openSuiteCopyright(suitecopyright) {
        this.modalService.open(suitecopyright, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true,
            size: 'lg'
        }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    getDismissReason(reason) {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        }
        else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        }
        else {
            return `with: ${reason}`;
        }
    }
    backToTop() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
    ngOnInit() {
        this.authSub = this.authService.isUserLoggedIn.subscribe(value => {
            this.isUserLoggedIn = value;
        });
    }
    ngOnDestroy() {
        this.authSub.unsubscribe();
    }
}
FooterUiComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-footer-ui',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<!-- Start of footer section -->\n<div class=\"footer\">\n  <div class=\"copyright-links\">\n    <a (click)=\"openSuiteCopyright(suitecopyright)\" class=\"footer-link\" data-toggle=\"modal\"\n       data-target=\".copyright-suitecrm\">\n      &copy; Supercharged by SuiteCRM\n    </a>\n    <a (click)=\"openSugarCopyright(sugarcopyright)\" class=\"footer-link\" data-toggle=\"modal\"\n       data-target=\".copyright-sugarcrm\">\n      &copy; Powered By SugarCRM\n    </a>\n  </div>\n  <ng-container *ngIf=\"this.isUserLoggedIn\">\n    <div class=\"back-to-top\">\n      <a (click)=\"backToTop()\" class=\"footer-link\">\n        <span>\n          Back To Top\n          <scrm-image class=\"sicon back-top-icon\" image=\"arrow_up_filled\"></scrm-image>\n        </span>\n      </a>\n    </div>\n  </ng-container>\n</div>\n<!-- End of footer section -->\n\n<!-- Start of copyright modal section -->\n\n<div class=\"copyright\">\n\n    <!-- Start of SugarCRM Copyright notice modal -->\n\n    <ng-template #sugarcopyright let-modal>\n\n        <div class=\"copyright-sugarcrm\" role=\"dialog\" aria-hidden=\"true\">\n            <div class=\"modal-header\">\n                <h5 class=\"modal-title\">&copy; Powered By SugarCRM</h5>\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"\n                        (click)=\"modal.dismiss('Cross click')\">\n                    <scrm-image class=\"sicon\" image=\"icon_modal_close\"></scrm-image>\n                </button>\n            </div>\n            <div class=\"modal-body\">\n                <p>\n                    &copy; 2004-2013 SugarCRM Inc. The Program is provided AS IS, without\n                    warranty. Licensed under AGPLv3.\n                </p>\n                <p>\n                    This program is free software; you can redistribute it and/or modify\n                    it under the terms of the GNU Affero General Public License version\n                    3 as published by the Free Software Foundation, including the\n                    additional permission set forth in the source code header.\n                </p>\n                <p>\n                    SugarCRM is a trademark of SugarCRM, Inc. All other company and\n                    product names may be trademarks of the respective companies with\n                    which they are associated.\n                </p>\n            </div>\n        </div>\n\n    </ng-template>\n\n    <!-- End of SugarCRM Copyright notice modal -->\n\n    <!-- Start of SuiteCRM Copyright notice modal -->\n\n    <ng-template #suitecopyright let-modal>\n\n        <div class=\"copyright-suitecrm\" role=\"dialog\" aria-hidden=\"true\">\n            <div class=\"modal-header\">\n                <h5 class=\"modal-title\">&copy; Supercharged by SuiteCRM</h5>\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"\n                        (click)=\"modal.dismiss('Cross click')\">\n                    <scrm-image class=\"sicon\" image=\"icon_modal_close\"></scrm-image>\n                </button>\n            </div>\n            <div class=\"modal-body\">\n                <p>\n                    SuiteCRM has been written and assembled by SalesAgility. The Program\n                    is provided AS IS, without warranty. Licensed under AGPLv3.\n                </p>\n                <p>\n                    This program is free software; you can redistribute it and/or modify\n                    it under the terms of the GNU Affero General Public License version\n                    3 as published by the Free Software Foundation, including the\n                    additional permission set forth in the source code header.\n                </p>\n                <p>\n                    SuiteCRM is a trademark of SalesAgility Ltd. All other company and\n                    product names may be trademarks of the respective companies with\n                    which they are associated.\n                </p>\n            </div>\n        </div>\n\n    </ng-template>\n\n    <!-- End of SuiteCRM Copyright notice modal -->\n</div>\n\n<!-- End of copyright modal section -->\n"
            },] }
];
FooterUiComponent.ctorParameters = () => [
    { type: NgbModal },
    { type: AuthService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vdGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb21wb25lbnRzL2Zvb3Rlci9mb290ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBRWhELE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxRQUFRLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUV6RSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFPN0QsTUFBTSxPQUFPLGlCQUFpQjtJQU8xQixZQUNZLFlBQXNCLEVBQ3RCLFdBQXdCO1FBRHhCLGlCQUFZLEdBQVosWUFBWSxDQUFVO1FBQ3RCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBRXBDLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxjQUFjO1FBQzdCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNuQyxjQUFjLEVBQUUsbUJBQW1CO1lBQ25DLFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLElBQUk7U0FDYixDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsZ0JBQWdCLE1BQU0sRUFBRSxDQUFDO1FBQ2hELENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ1YsSUFBSSxDQUFDLFdBQVcsR0FBRyxhQUFhLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ3BFLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGtCQUFrQixDQUFDLGNBQWM7UUFDN0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ25DLGNBQWMsRUFBRSxtQkFBbUI7WUFDbkMsUUFBUSxFQUFFLElBQUk7WUFDZCxJQUFJLEVBQUUsSUFBSTtTQUNiLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxnQkFBZ0IsTUFBTSxFQUFFLENBQUM7UUFDaEQsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDVixJQUFJLENBQUMsV0FBVyxHQUFHLGFBQWEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDcEUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sZ0JBQWdCLENBQUMsTUFBVztRQUNoQyxJQUFJLE1BQU0sS0FBSyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUU7WUFDcEMsT0FBTyxpQkFBaUIsQ0FBQztTQUM1QjthQUFNLElBQUksTUFBTSxLQUFLLG1CQUFtQixDQUFDLGNBQWMsRUFBRTtZQUN0RCxPQUFPLDJCQUEyQixDQUFDO1NBQ3RDO2FBQU07WUFDSCxPQUFPLFNBQVMsTUFBTSxFQUFFLENBQUM7U0FDNUI7SUFDTCxDQUFDO0lBRUQsU0FBUztRQUNMLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWE7UUFDMUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0NBQW9DO0lBQ2hGLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDN0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDL0IsQ0FBQzs7O1lBakVKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQiw0OUtBQXNDO2FBRXpDOzs7WUFSNEIsUUFBUTtZQUU3QixXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtNb2RhbERpc21pc3NSZWFzb25zLCBOZ2JNb2RhbH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtBdXRoU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvYXV0aC9hdXRoLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tZm9vdGVyLXVpJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vZm9vdGVyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIEZvb3RlclVpQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIHByaXZhdGUgYXV0aFN1YjogU3Vic2NyaXB0aW9uO1xuXG4gICAgY2xvc2VSZXN1bHQ6IHN0cmluZztcbiAgICBpc1VzZXJMb2dnZWRJbjogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIG1vZGFsU2VydmljZTogTmdiTW9kYWwsXG4gICAgICAgIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhTZXJ2aWNlXG4gICAgKSB7XG4gICAgfVxuXG4gICAgb3BlblN1Z2FyQ29weXJpZ2h0KHN1Z2FyY29weXJpZ2h0KSB7XG4gICAgICAgIHRoaXMubW9kYWxTZXJ2aWNlLm9wZW4oc3VnYXJjb3B5cmlnaHQsIHtcbiAgICAgICAgICAgIGFyaWFMYWJlbGxlZEJ5OiAnbW9kYWwtYmFzaWMtdGl0bGUnLFxuICAgICAgICAgICAgY2VudGVyZWQ6IHRydWUsXG4gICAgICAgICAgICBzaXplOiAnbGcnXG4gICAgICAgIH0pLnJlc3VsdC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VSZXN1bHQgPSBgQ2xvc2VkIHdpdGg6ICR7cmVzdWx0fWA7XG4gICAgICAgIH0sIChyZWFzb24pID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VSZXN1bHQgPSBgRGlzbWlzc2VkICR7dGhpcy5nZXREaXNtaXNzUmVhc29uKHJlYXNvbil9YDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb3BlblN1aXRlQ29weXJpZ2h0KHN1aXRlY29weXJpZ2h0KSB7XG4gICAgICAgIHRoaXMubW9kYWxTZXJ2aWNlLm9wZW4oc3VpdGVjb3B5cmlnaHQsIHtcbiAgICAgICAgICAgIGFyaWFMYWJlbGxlZEJ5OiAnbW9kYWwtYmFzaWMtdGl0bGUnLFxuICAgICAgICAgICAgY2VudGVyZWQ6IHRydWUsXG4gICAgICAgICAgICBzaXplOiAnbGcnXG4gICAgICAgIH0pLnJlc3VsdC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VSZXN1bHQgPSBgQ2xvc2VkIHdpdGg6ICR7cmVzdWx0fWA7XG4gICAgICAgIH0sIChyZWFzb24pID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VSZXN1bHQgPSBgRGlzbWlzc2VkICR7dGhpcy5nZXREaXNtaXNzUmVhc29uKHJlYXNvbil9YDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXREaXNtaXNzUmVhc29uKHJlYXNvbjogYW55KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHJlYXNvbiA9PT0gTW9kYWxEaXNtaXNzUmVhc29ucy5FU0MpIHtcbiAgICAgICAgICAgIHJldHVybiAnYnkgcHJlc3NpbmcgRVNDJztcbiAgICAgICAgfSBlbHNlIGlmIChyZWFzb24gPT09IE1vZGFsRGlzbWlzc1JlYXNvbnMuQkFDS0RST1BfQ0xJQ0spIHtcbiAgICAgICAgICAgIHJldHVybiAnYnkgY2xpY2tpbmcgb24gYSBiYWNrZHJvcCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYHdpdGg6ICR7cmVhc29ufWA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiYWNrVG9Ub3AoKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gMDsgLy8gRm9yIFNhZmFyaVxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wID0gMDsgLy8gRm9yIENocm9tZSwgRmlyZWZveCwgSUUgYW5kIE9wZXJhXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuYXV0aFN1YiA9IHRoaXMuYXV0aFNlcnZpY2UuaXNVc2VyTG9nZ2VkSW4uc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXNVc2VyTG9nZ2VkSW4gPSB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuYXV0aFN1Yi51bnN1YnNjcmliZSgpO1xuICAgIH1cbn1cbiJdfQ==