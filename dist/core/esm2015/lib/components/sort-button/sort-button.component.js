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
import { SortDirection } from 'common';
export class SortButtonComponent {
    constructor() {
        this.statusIcons = {
            NONE: 'sort',
            ASC: 'sort_ascend',
            DESC: 'sort_descend'
        };
        this.nextDirection = {
            NONE: SortDirection.DESC,
            ASC: SortDirection.NONE,
            DESC: SortDirection.ASC
        };
    }
    ngOnInit() {
        this.direction$ = this.state.getSortDirection();
    }
    getStatusIcon(direction) {
        return this.statusIcons[direction];
    }
    changeSorting(direction) {
        const newDirection = this.nextDirection[direction];
        this.state.changeSortDirection(newDirection);
    }
}
SortButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-sort-button',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container *ngIf=\"(direction$ | async) as direction\">\n    <a class=\"btn btn-sm p-0 sort-button\" (click)=\"changeSorting(direction)\">\n        <scrm-image class=\"sort-icon sicon\" [image]=\"getStatusIcon(direction)\"></scrm-image>\n    </a>\n</ng-container>\n\n"
            },] }
];
SortButtonComponent.ctorParameters = () => [];
SortButtonComponent.propDecorators = {
    state: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1idXR0b24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2NvbXBvbmVudHMvc29ydC1idXR0b24vc29ydC1idXR0b24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMvQyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBU3JDLE1BQU0sT0FBTyxtQkFBbUI7SUFnQjVCO1FBWlUsZ0JBQVcsR0FBRztZQUNwQixJQUFJLEVBQUUsTUFBTTtZQUNaLEdBQUcsRUFBRSxhQUFhO1lBQ2xCLElBQUksRUFBRSxjQUFjO1NBQ3ZCLENBQUM7UUFFUSxrQkFBYSxHQUFHO1lBQ3RCLElBQUksRUFBRSxhQUFhLENBQUMsSUFBSTtZQUN4QixHQUFHLEVBQUUsYUFBYSxDQUFDLElBQUk7WUFDdkIsSUFBSSxFQUFFLGFBQWEsQ0FBQyxHQUFHO1NBQzFCLENBQUM7SUFHRixDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3BELENBQUM7SUFFRCxhQUFhLENBQUMsU0FBd0I7UUFDbEMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxhQUFhLENBQUMsU0FBd0I7UUFDbEMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2pELENBQUM7OztZQW5DSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsMm5EQUEyQzthQUU5Qzs7OztvQkFFSSxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTb3J0RGlyZWN0aW9ufSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7U29ydERpcmVjdGlvbkRhdGFTb3VyY2V9IGZyb20gJy4vc29ydC1idXR0b24ubW9kZWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tc29ydC1idXR0b24nLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9zb3J0LWJ1dHRvbi5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBTb3J0QnV0dG9uQ29tcG9uZW50IHtcbiAgICBASW5wdXQoKSBzdGF0ZTogU29ydERpcmVjdGlvbkRhdGFTb3VyY2U7XG4gICAgZGlyZWN0aW9uJDogT2JzZXJ2YWJsZTxTb3J0RGlyZWN0aW9uPjtcblxuICAgIHByb3RlY3RlZCBzdGF0dXNJY29ucyA9IHtcbiAgICAgICAgTk9ORTogJ3NvcnQnLFxuICAgICAgICBBU0M6ICdzb3J0X2FzY2VuZCcsXG4gICAgICAgIERFU0M6ICdzb3J0X2Rlc2NlbmQnXG4gICAgfTtcblxuICAgIHByb3RlY3RlZCBuZXh0RGlyZWN0aW9uID0ge1xuICAgICAgICBOT05FOiBTb3J0RGlyZWN0aW9uLkRFU0MsXG4gICAgICAgIEFTQzogU29ydERpcmVjdGlvbi5OT05FLFxuICAgICAgICBERVNDOiBTb3J0RGlyZWN0aW9uLkFTQ1xuICAgIH07XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24kID0gdGhpcy5zdGF0ZS5nZXRTb3J0RGlyZWN0aW9uKCk7XG4gICAgfVxuXG4gICAgZ2V0U3RhdHVzSWNvbihkaXJlY3Rpb246IFNvcnREaXJlY3Rpb24pOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0dXNJY29uc1tkaXJlY3Rpb25dO1xuICAgIH1cblxuICAgIGNoYW5nZVNvcnRpbmcoZGlyZWN0aW9uOiBTb3J0RGlyZWN0aW9uKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5ld0RpcmVjdGlvbiA9IHRoaXMubmV4dERpcmVjdGlvbltkaXJlY3Rpb25dO1xuICAgICAgICB0aGlzLnN0YXRlLmNoYW5nZVNvcnREaXJlY3Rpb24obmV3RGlyZWN0aW9uKTtcbiAgICB9XG59XG4iXX0=