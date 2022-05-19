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
export class BaseMobileMenuComponent {
    constructor() {
        this.navigationType = '';
        this.submenu = [];
        this.subNavigationType = 'mm';
        this.backLink = false;
        this.mobileSubNav = false;
        this.mainNavLink = true;
    }
    ngOnInit() {
        this.mainItems = this.items;
        if (this.navigationType !== 'gm' && this.current) {
            this.mainItems = [this.current, ...this.items];
        }
    }
    /**
     * Change subnavigation
     *
     * @param {object} event triggered
     * @param {object} items
     * @param navigationType
     */
    changeSubNav(event, items, navigationType) {
        this.mobileSubNav = !this.mobileSubNav;
        this.backLink = !this.backLink;
        this.mainNavLink = !this.mainNavLink;
        this.submenu = items;
        this.subNavigationType = navigationType;
    }
    /**
     * Set link flags
     */
    navBackLink() {
        this.mobileSubNav = !this.mobileSubNav;
        this.backLink = !this.backLink;
        this.mainNavLink = !this.mainNavLink;
    }
    getItems() {
    }
}
BaseMobileMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-base-mobile-menu',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n\n\n<ng-container *ngIf=\"backLink\">\n    <li (click)=\"navBackLink()\" class=\"d-flex align-items-center mobile-back-row\">\n        <scrm-image class=\"sicon-xs mobile-nav-arrow pl-3 pr-3\"\n                    image=\"arrow_left_filled\">\n        </scrm-image>\n        <a class=\"mobile-back-link pl-1 pr-3 pt-2 pb-2\">\n            <scrm-label labelKey=\"LBL_BACK\"></scrm-label>\n        </a>\n    </li>\n</ng-container>\n\n<ng-container *ngIf=\"mainItems && mainItems.length\">\n    <ng-container *ngIf=\"mainNavLink\">\n        <div class=\"mobile-menu-items\">\n\n            <li (click)=\"changeSubNav($event, item.submenu, navigationType)\" *ngFor=\"let item of mainItems\"\n                class=\" d-flex align-items-center\">\n                <a class=\"flex-grow-1 mobile-nav-link pl-3 pr-3 pt-2 pb-2\">{{ item.link.label }}</a>\n                <scrm-image class=\"sicon-xs mobile-nav-arrow pl-3 pr-3\" image=\"arrow_right_filled\"\n                ></scrm-image>\n            </li>\n\n            <ng-container>\n                <li (click)=\"changeSubNav($event, all, 'gm')\"\n                    class=\" d-flex align-items-center\">\n                    <a class=\"flex-grow-1 mobile-nav-link pl-3 pr-3 pt-2 pb-2\">\n                        <scrm-label labelKey=\"LBL_MORE\"></scrm-label>\n                    </a>\n                    <scrm-image class=\"sicon-xs mobile-nav-arrow pl-3 pr-3\" image=\"arrow_right_filled\"\n                    ></scrm-image>\n                </li>\n            </ng-container>\n        </div>\n    </ng-container>\n\n    <ng-container *ngIf=\"mobileSubNav\">\n\n        <ng-container *ngIf=\"subNavigationType !== 'gm'\">\n\n            <scrm-mobile-module-menu [items]=\"submenu\" [onClose]=\"onClose\"></scrm-mobile-module-menu>\n\n        </ng-container>\n\n        <ng-container *ngIf=\"subNavigationType === 'gm'\">\n\n            <scrm-mobile-grouped-menu [items]=\"submenu\" [onClose]=\"onClose\"></scrm-mobile-grouped-menu>\n\n        </ng-container>\n\n    </ng-container>\n\n</ng-container>\n\n<li>\n    <a (click)=\"onClose && onClose()\" class=\"mobile-nav-close clicable pl-3 pr-3 pt-2 pb-2 w-100\">\n        <scrm-image class=\"sicon mobile-nav-close\" image=\"cross_bold\"></scrm-image>\n        <span class=\"nav-close-text\">\n            <scrm-label labelKey=\"LBL_CLOSE_MENU\"></scrm-label>\n        </span>\n    </a>\n</li>\n\n"
            },] }
];
BaseMobileMenuComponent.ctorParameters = () => [];
BaseMobileMenuComponent.propDecorators = {
    current: [{ type: Input }],
    items: [{ type: Input }],
    all: [{ type: Input }],
    onClose: [{ type: Input }],
    navigationType: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1tb2JpbGUtbWVudS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29tcG9uZW50cy9uYXZiYXIvbW9iaWxlLW1lbnUvYmFzZS1tb2JpbGUtbWVudS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBUXZELE1BQU0sT0FBTyx1QkFBdUI7SUFlaEM7UUFWUyxtQkFBYyxHQUFXLEVBQUUsQ0FBQztRQUdyQyxZQUFPLEdBQWUsRUFBRSxDQUFDO1FBRXpCLHNCQUFpQixHQUFHLElBQUksQ0FBQztRQUN6QixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLGdCQUFXLEdBQUcsSUFBSSxDQUFDO0lBR25CLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRTVCLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUM5QyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNsRDtJQUNMLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxZQUFZLENBQUMsS0FBWSxFQUFFLEtBQWlCLEVBQUUsY0FBc0I7UUFDdkUsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGNBQWMsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxXQUFXO1FBQ2QsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDekMsQ0FBQztJQUdELFFBQVE7SUFFUixDQUFDOzs7WUExREosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSx1QkFBdUI7Z0JBQ2pDLGd0SEFBZ0Q7YUFFbkQ7Ozs7c0JBRUksS0FBSztvQkFDTCxLQUFLO2tCQUNMLEtBQUs7c0JBQ0wsS0FBSzs2QkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01lbnVJdGVtfSBmcm9tICdjb21tb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tYmFzZS1tb2JpbGUtbWVudScsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2Jhc2UtbW9iaWxlLW1lbnUuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogW11cbn0pXG5leHBvcnQgY2xhc3MgQmFzZU1vYmlsZU1lbnVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIEBJbnB1dCgpIGN1cnJlbnQ6IE1lbnVJdGVtO1xuICAgIEBJbnB1dCgpIGl0ZW1zOiBNZW51SXRlbVtdO1xuICAgIEBJbnB1dCgpIGFsbDogTWVudUl0ZW1bXTtcbiAgICBASW5wdXQoKSBvbkNsb3NlOiBGdW5jdGlvbjtcbiAgICBASW5wdXQoKSBuYXZpZ2F0aW9uVHlwZTogc3RyaW5nID0gJyc7XG5cbiAgICBtYWluSXRlbXM6IE1lbnVJdGVtW107XG4gICAgc3VibWVudTogTWVudUl0ZW1bXSA9IFtdO1xuXG4gICAgc3ViTmF2aWdhdGlvblR5cGUgPSAnbW0nO1xuICAgIGJhY2tMaW5rID0gZmFsc2U7XG4gICAgbW9iaWxlU3ViTmF2ID0gZmFsc2U7XG4gICAgbWFpbk5hdkxpbmsgPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubWFpbkl0ZW1zID0gdGhpcy5pdGVtcztcblxuICAgICAgICBpZiAodGhpcy5uYXZpZ2F0aW9uVHlwZSAhPT0gJ2dtJyAmJiB0aGlzLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMubWFpbkl0ZW1zID0gW3RoaXMuY3VycmVudCwgLi4udGhpcy5pdGVtc107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2Ugc3VibmF2aWdhdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IHRyaWdnZXJlZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtc1xuICAgICAqIEBwYXJhbSBuYXZpZ2F0aW9uVHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyBjaGFuZ2VTdWJOYXYoZXZlbnQ6IEV2ZW50LCBpdGVtczogTWVudUl0ZW1bXSwgbmF2aWdhdGlvblR5cGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLm1vYmlsZVN1Yk5hdiA9ICF0aGlzLm1vYmlsZVN1Yk5hdjtcbiAgICAgICAgdGhpcy5iYWNrTGluayA9ICF0aGlzLmJhY2tMaW5rO1xuICAgICAgICB0aGlzLm1haW5OYXZMaW5rID0gIXRoaXMubWFpbk5hdkxpbms7XG4gICAgICAgIHRoaXMuc3VibWVudSA9IGl0ZW1zO1xuICAgICAgICB0aGlzLnN1Yk5hdmlnYXRpb25UeXBlID0gbmF2aWdhdGlvblR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IGxpbmsgZmxhZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgbmF2QmFja0xpbmsoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubW9iaWxlU3ViTmF2ID0gIXRoaXMubW9iaWxlU3ViTmF2O1xuICAgICAgICB0aGlzLmJhY2tMaW5rID0gIXRoaXMuYmFja0xpbms7XG4gICAgICAgIHRoaXMubWFpbk5hdkxpbmsgPSAhdGhpcy5tYWluTmF2TGluaztcbiAgICB9XG5cblxuICAgIGdldEl0ZW1zKCkge1xuXG4gICAgfVxufVxuIl19