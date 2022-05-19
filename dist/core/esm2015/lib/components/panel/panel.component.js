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
import { Observable } from 'rxjs';
export class PanelComponent {
    constructor() {
        this.klass = '';
        this.bodyPadding = 2;
        this.mode = 'closable';
        this.close = {
            klass: ['btn', 'btn-outline-light', 'btn-sm']
        };
        this.isCollapsed = false;
        this.buttonClasses = ['btn', 'btn-outline-light', 'btn-sm'];
        this.subs = [];
    }
    ngOnInit() {
        if (this.isCollapsed$) {
            this.subs.push(this.isCollapsed$.subscribe(collapse => {
                this.isCollapsed = collapse;
                this.initMinimiseButton();
            }));
        }
        this.initMinimiseButton();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    getCloseButton() {
        if (!this.close) {
            return null;
        }
        const btn = Button.fromButton(this.close);
        btn.addClasses(this.buttonClasses);
        this.close = btn;
        return btn;
    }
    isClosable() {
        return this.mode === 'closable';
    }
    isCollapsible() {
        return this.mode === 'collapsible';
    }
    initMinimiseButton() {
        this.minimiseButton = {
            klass: ['btn', 'btn-outline-light', 'btn-sm'],
            onClick: () => {
                this.isCollapsed = !this.isCollapsed;
                this.initMinimiseStatus();
            },
        };
        this.initMinimiseStatus();
    }
    initMinimiseStatus() {
        if (this.isCollapsed) {
            this.minimiseStatus = 'minimised';
            return;
        }
        this.minimiseStatus = 'maximised';
    }
}
PanelComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-panel',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<div [class.collapsed]=\"isCollapsed\" class=\"card panel-card {{klass}}\">\n\n    <div class=\"card-header d-flex justify-content-between align-items-center\">\n\n        <div class=\"flex-grow-1 align-items-center d-flex\">\n\n            <div class=\"d-flex align-items-center\">\n                <scrm-close-button *ngIf=\"isClosable()\" [config]=\"getCloseButton()\"></scrm-close-button>\n                <scrm-minimise-button *ngIf=\"isCollapsible()\"\n                                      [config]=\"minimiseButton\"\n                                      [status]=\"minimiseStatus\">\n                </scrm-minimise-button>\n                <ng-content select=\"[panel-icon-area]\"></ng-content>\n            </div>\n\n            <div *ngIf=\"title\" class=\"pl-1 panel-title\">{{title}}</div>\n            <div *ngIf=\"titleKey\" class=\"pl-1 panel-title\">\n                <scrm-label [labelKey]=\"titleKey\"></scrm-label>\n            </div>\n        </div>\n\n\n        <div class=\"panel-buttons float-right\">\n            <ng-content select=\"[panel-header-button]\"></ng-content>\n        </div>\n    </div>\n\n    <div class=\"card-body p-{{bodyPadding}}\" [ngbCollapse]=\"isCollapsed\">\n        <ng-content select=\"[panel-body]\"></ng-content>\n    </div>\n</div>\n"
            },] }
];
PanelComponent.ctorParameters = () => [];
PanelComponent.propDecorators = {
    klass: [{ type: Input }],
    bodyPadding: [{ type: Input }],
    title: [{ type: Input }],
    titleKey: [{ type: Input }],
    mode: [{ type: Input }],
    isCollapsed$: [{ type: Input }],
    close: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFuZWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2NvbXBvbmVudHMvcGFuZWwvcGFuZWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBb0IsTUFBTSxlQUFlLENBQUM7QUFDbEUsT0FBTyxFQUFDLE1BQU0sRUFBa0IsTUFBTSxRQUFRLENBQUM7QUFDL0MsT0FBTyxFQUFDLFVBQVUsRUFBZSxNQUFNLE1BQU0sQ0FBQztBQVE5QyxNQUFNLE9BQU8sY0FBYztJQW1CdkI7UUFqQlMsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUNYLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBR2hCLFNBQUksR0FBd0MsVUFBVSxDQUFDO1FBRXZELFVBQUssR0FBb0I7WUFDOUIsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLG1CQUFtQixFQUFFLFFBQVEsQ0FBQztTQUM3QixDQUFDO1FBRXJCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBSVYsa0JBQWEsR0FBRyxDQUFDLEtBQUssRUFBRSxtQkFBbUIsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2RCxTQUFJLEdBQW1CLEVBQUUsQ0FBQztJQUdwQyxDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDbEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzlCLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDUDtRQUNELElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsY0FBYztRQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2IsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUVELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRW5DLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBRWpCLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVELFVBQVU7UUFDTixPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDO0lBQ3BDLENBQUM7SUFFRCxhQUFhO1FBQ1QsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLGNBQWMsR0FBRztZQUNsQixLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxDQUFDO1lBQzdDLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQ1YsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzlCLENBQUM7U0FDZSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxrQkFBa0I7UUFDZCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxXQUFXLENBQUM7WUFDbEMsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxXQUFXLENBQUM7SUFDdEMsQ0FBQzs7O1lBL0VKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsc25GQUFxQzthQUV4Qzs7OztvQkFHSSxLQUFLOzBCQUNMLEtBQUs7b0JBQ0wsS0FBSzt1QkFDTCxLQUFLO21CQUNMLEtBQUs7MkJBQ0wsS0FBSztvQkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QnV0dG9uLCBCdXR0b25JbnRlcmZhY2V9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01pbmltaXNlQnV0dG9uU3RhdHVzfSBmcm9tICcuLi9taW5pbWlzZS1idXR0b24vbWluaW1pc2UtYnV0dG9uLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1wYW5lbCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3BhbmVsLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFBhbmVsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KCkga2xhc3MgPSAnJztcbiAgICBASW5wdXQoKSBib2R5UGFkZGluZyA9IDI7XG4gICAgQElucHV0KCkgdGl0bGU6IHN0cmluZztcbiAgICBASW5wdXQoKSB0aXRsZUtleTogc3RyaW5nO1xuICAgIEBJbnB1dCgpIG1vZGU6ICdjb2xsYXBzaWJsZScgfCAnY2xvc2FibGUnIHwgJ25vbmUnID0gJ2Nsb3NhYmxlJztcbiAgICBASW5wdXQoKSBpc0NvbGxhcHNlZCQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgQElucHV0KCkgY2xvc2U6IEJ1dHRvbkludGVyZmFjZSA9IHtcbiAgICAgICAga2xhc3M6IFsnYnRuJywgJ2J0bi1vdXRsaW5lLWxpZ2h0JywgJ2J0bi1zbSddXG4gICAgfSBhcyBCdXR0b25JbnRlcmZhY2U7XG5cbiAgICBpc0NvbGxhcHNlZCA9IGZhbHNlO1xuICAgIG1pbmltaXNlQnV0dG9uOiBCdXR0b25JbnRlcmZhY2U7XG4gICAgbWluaW1pc2VTdGF0dXM6IE1pbmltaXNlQnV0dG9uU3RhdHVzO1xuXG4gICAgcHJvdGVjdGVkIGJ1dHRvbkNsYXNzZXMgPSBbJ2J0bicsICdidG4tb3V0bGluZS1saWdodCcsICdidG4tc20nXTtcbiAgICBwcm90ZWN0ZWQgc3ViczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0NvbGxhcHNlZCQpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vicy5wdXNoKHRoaXMuaXNDb2xsYXBzZWQkLnN1YnNjcmliZShjb2xsYXBzZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0NvbGxhcHNlZCA9IGNvbGxhcHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdE1pbmltaXNlQnV0dG9uKCk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0TWluaW1pc2VCdXR0b24oKTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdWJzLmZvckVhY2goc3ViID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgICB9XG5cbiAgICBnZXRDbG9zZUJ1dHRvbigpOiBCdXR0b25JbnRlcmZhY2Uge1xuICAgICAgICBpZiAoIXRoaXMuY2xvc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYnRuID0gQnV0dG9uLmZyb21CdXR0b24odGhpcy5jbG9zZSk7XG4gICAgICAgIGJ0bi5hZGRDbGFzc2VzKHRoaXMuYnV0dG9uQ2xhc3Nlcyk7XG5cbiAgICAgICAgdGhpcy5jbG9zZSA9IGJ0bjtcblxuICAgICAgICByZXR1cm4gYnRuO1xuICAgIH1cblxuICAgIGlzQ2xvc2FibGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGUgPT09ICdjbG9zYWJsZSc7XG4gICAgfVxuXG4gICAgaXNDb2xsYXBzaWJsZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gJ2NvbGxhcHNpYmxlJztcbiAgICB9XG5cbiAgICBpbml0TWluaW1pc2VCdXR0b24oKTogdm9pZCB7XG4gICAgICAgIHRoaXMubWluaW1pc2VCdXR0b24gPSB7XG4gICAgICAgICAgICBrbGFzczogWydidG4nLCAnYnRuLW91dGxpbmUtbGlnaHQnLCAnYnRuLXNtJ10sXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0NvbGxhcHNlZCA9ICF0aGlzLmlzQ29sbGFwc2VkO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdE1pbmltaXNlU3RhdHVzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9IGFzIEJ1dHRvbkludGVyZmFjZTtcbiAgICAgICAgdGhpcy5pbml0TWluaW1pc2VTdGF0dXMoKTtcbiAgICB9XG5cbiAgICBpbml0TWluaW1pc2VTdGF0dXMoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzQ29sbGFwc2VkKSB7XG4gICAgICAgICAgICB0aGlzLm1pbmltaXNlU3RhdHVzID0gJ21pbmltaXNlZCc7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5taW5pbWlzZVN0YXR1cyA9ICdtYXhpbWlzZWQnO1xuICAgIH1cbn1cbiJdfQ==