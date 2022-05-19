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
export class DropdownButtonComponent {
    constructor() {
        this.disabled = false;
        this.autoClose = true;
    }
    isDropdown(item) {
        if (!item) {
            return false;
        }
        return 'items' in item;
    }
    click(onClick, dropdown) {
        onClick();
        dropdown.close();
    }
    close(dropdown) {
        dropdown.close();
    }
    ngOnInit() {
        if (this.config && !this.config.placement) {
            this.config.placement = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
        }
    }
    getPlacement() {
        if (this.config && !this.config.placement) {
            return ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
        }
        return this.config.placement;
    }
}
DropdownButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-dropdown-button',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<div ngbDropdown\n     [autoClose]=\"autoClose\"\n     [placement]=\"getPlacement()\"\n     #dropDown=\"ngbDropdown\"\n     class=\"d-inline-block dropdown-button\"\n     [ngClass]=\"config.wrapperKlass\">\n    <button [disabled]=\"disabled\" [ngClass]=\"config.klass\" ngbDropdownToggle>\n\n        <ng-container *ngIf=\"config.label\">\n            {{ config.label }}\n        </ng-container>\n\n        <ng-container *ngIf=\"!config.label && config.labelKey\">\n            <scrm-label [labelKey]=\"config.labelKey\"></scrm-label>\n        </ng-container>\n\n        <ng-content></ng-content>\n    </button>\n    <div ngbDropdownMenu>\n\n        <ng-container *ngFor=\"let item of config.items\">\n\n            <ng-container *ngIf=\"item && !isDropdown(item)\">\n                <a ngbDropdownItem\n                   [ngClass]=\"item && item.klass\"\n                   (click)=\"item && click(item.onClick, dropDown)\">\n\n                    <div class=\"d-flex align-items-center\">\n                        <div *ngIf=\"item.icon\">\n                            <scrm-image [image]=\"item.icon\" [klass]=\"item.iconKlass || ''\"></scrm-image>\n                        </div>\n                        <div class=\"flex-grow-1\">\n                            {{item && item.label}}\n                        </div>\n                    </div>\n                </a>\n            </ng-container>\n\n            <ng-container *ngIf=\"item && isDropdown(item)\">\n                <scrm-dropdown-submenu (item-clicked)=\"close(dropDown)\" [item]=\"item\"></scrm-dropdown-submenu>\n            </ng-container>\n\n        </ng-container>\n    </div>\n</div>\n"
            },] }
];
DropdownButtonComponent.ctorParameters = () => [];
DropdownButtonComponent.propDecorators = {
    config: [{ type: Input }],
    disabled: [{ type: Input }],
    autoClose: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24tYnV0dG9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb21wb25lbnRzL2Ryb3Bkb3duLWJ1dHRvbi9kcm9wZG93bi1idXR0b24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBUyxNQUFNLGVBQWUsQ0FBQztBQVd2RCxNQUFNLE9BQU8sdUJBQXVCO0lBS2hDO1FBSFMsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixjQUFTLEdBQW1DLElBQUksQ0FBQztJQUcxRCxDQUFDO0lBRUQsVUFBVSxDQUFDLElBQXFCO1FBQzVCLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDUCxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELE9BQU8sT0FBTyxJQUFJLElBQUksQ0FBQztJQUMzQixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQWlCLEVBQUUsUUFBcUI7UUFDMUMsT0FBTyxFQUFFLENBQUM7UUFDVixRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFxQjtRQUN2QixRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxDQUFDLGFBQWEsRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ3BGO0lBQ0wsQ0FBQztJQUVELFlBQVk7UUFDUixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUN2QyxPQUFPLENBQUMsYUFBYSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDbkU7UUFDRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ2pDLENBQUM7OztZQXhDSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMsdStGQUErQzthQUVsRDs7OztxQkFFSSxLQUFLO3VCQUNMLEtBQUs7d0JBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEcm9wZG93bkJ1dHRvbkludGVyZmFjZX0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7QnV0dG9uSW50ZXJmYWNlfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtOZ2JEcm9wZG93bn0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHtQbGFjZW1lbnRBcnJheX0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdXRpbC9wb3NpdGlvbmluZyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1kcm9wZG93bi1idXR0b24nLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9kcm9wZG93bi1idXR0b24uY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlczogW10sXG59KVxuZXhwb3J0IGNsYXNzIERyb3Bkb3duQnV0dG9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBASW5wdXQoKSBjb25maWc6IERyb3Bkb3duQnV0dG9uSW50ZXJmYWNlO1xuICAgIEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2U7XG4gICAgQElucHV0KCkgYXV0b0Nsb3NlOiBib29sZWFuIHwgJ291dHNpZGUnIHwgJ2luc2lkZScgPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgaXNEcm9wZG93bihpdGVtOiBCdXR0b25JbnRlcmZhY2UpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdpdGVtcycgaW4gaXRlbTtcbiAgICB9XG5cbiAgICBjbGljayhvbkNsaWNrOiBGdW5jdGlvbiwgZHJvcGRvd246IE5nYkRyb3Bkb3duKTogdm9pZCB7XG4gICAgICAgIG9uQ2xpY2soKTtcbiAgICAgICAgZHJvcGRvd24uY2xvc2UoKTtcbiAgICB9XG5cbiAgICBjbG9zZShkcm9wZG93bjogTmdiRHJvcGRvd24pOiB2b2lkIHtcbiAgICAgICAgZHJvcGRvd24uY2xvc2UoKTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnICYmICF0aGlzLmNvbmZpZy5wbGFjZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnBsYWNlbWVudCA9IFsnYm90dG9tLWxlZnQnLCAnYm90dG9tLXJpZ2h0JywgJ3RvcC1sZWZ0JywgJ3RvcC1yaWdodCddO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0UGxhY2VtZW50KCk6IFBsYWNlbWVudEFycmF5IHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnICYmICF0aGlzLmNvbmZpZy5wbGFjZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBbJ2JvdHRvbS1sZWZ0JywgJ2JvdHRvbS1yaWdodCcsICd0b3AtbGVmdCcsICd0b3AtcmlnaHQnXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcucGxhY2VtZW50O1xuICAgIH1cblxufVxuIl19