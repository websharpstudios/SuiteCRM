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
export class ButtonGroupComponent {
    constructor() {
        this.buttons = {
            expanded: [],
            collapsed: [],
        };
    }
    ngOnInit() {
        this.sub = this.config$.subscribe(config => {
            this.internalConfig = Object.assign({}, config);
            this.splitButtons();
        });
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    isDropdown(item) {
        if (!item) {
            return false;
        }
        return 'items' in item;
    }
    buildDropdownConfig() {
        let buttonClasses = ['button-group-button'];
        if (this.internalConfig.buttonKlass && this.internalConfig.buttonKlass.length > 0) {
            buttonClasses = buttonClasses.concat(this.internalConfig.buttonKlass);
        }
        let wrapperClasses = ['button-group-dropdown'];
        const dropdownOptions = this.internalConfig.dropdownOptions;
        const optionsWrapperKlass = dropdownOptions && dropdownOptions.wrapperKlass;
        if (optionsWrapperKlass && optionsWrapperKlass.length > 0) {
            wrapperClasses = wrapperClasses.concat(optionsWrapperKlass);
        }
        this.dropdownConfig = {
            label: this.internalConfig.dropdownLabel,
            klass: [...buttonClasses],
            wrapperKlass: wrapperClasses,
            items: this.buttons.collapsed,
        };
        if (this.internalConfig.dropdownOptions && this.internalConfig.dropdownOptions.placement) {
            this.dropdownConfig.placement = this.internalConfig.dropdownOptions.placement;
        }
    }
    getBreakpoint() {
        if (!this.internalConfig.breakpoint) {
            return 4;
        }
        return this.internalConfig.breakpoint;
    }
    splitButtons() {
        this.buttons.expanded = [];
        this.buttons.collapsed = [];
        if (!this.internalConfig.buttons || this.internalConfig.buttons.length < 1) {
            return;
        }
        let count = 0;
        this.internalConfig.buttons.forEach(button => {
            if (!button) {
                return;
            }
            if (count < this.getBreakpoint()) {
                let classes = ['button-group-button'];
                if (this.internalConfig.buttonKlass && this.internalConfig.buttonKlass.length > 0) {
                    classes = classes.concat(this.internalConfig.buttonKlass);
                }
                const newButton = Object.assign({}, button);
                Button.appendClasses(newButton, [...classes]);
                this.buttons.expanded.push(newButton);
            }
            else {
                this.buttons.collapsed.push(Object.assign({}, button));
            }
            count++;
        });
        this.buildDropdownConfig();
    }
}
ButtonGroupComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-button-group',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<div *ngIf=\"config$\">\n    <ng-container *ngFor=\"let item of buttons.expanded\">\n        <scrm-button *ngIf=\"item && !isDropdown(item)\"\n                     [config]=\"item\">\n        </scrm-button>\n        <scrm-dropdown-button *ngIf=\"item && isDropdown(item)\"\n                              [config]=\"item\">\n        </scrm-dropdown-button>\n    </ng-container>\n\n    <scrm-dropdown-button autoClose=\"outside\"\n                          *ngIf=\"buttons.collapsed.length\"\n                          [config]=\"dropdownConfig\"></scrm-dropdown-button>\n</div>\n"
            },] }
];
ButtonGroupComponent.ctorParameters = () => [];
ButtonGroupComponent.propDecorators = {
    config$: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWdyb3VwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb21wb25lbnRzL2J1dHRvbi1ncm91cC9idXR0b24tZ3JvdXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBb0IsTUFBTSxlQUFlLENBQUM7QUFDbEUsT0FBTyxFQUFDLE1BQU0sRUFBa0IsTUFBTSxRQUFRLENBQUM7QUFHL0MsT0FBTyxFQUFDLFVBQVUsRUFBZSxNQUFNLE1BQU0sQ0FBQztBQVk5QyxNQUFNLE9BQU8sb0JBQW9CO0lBYzdCO1FBVkEsWUFBTyxHQUFpQjtZQUNwQixRQUFRLEVBQUUsRUFBRTtZQUNaLFNBQVMsRUFBRSxFQUFFO1NBQ2hCLENBQUM7SUFRRixDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDdkMsSUFBSSxDQUFDLGNBQWMscUJBQU8sTUFBTSxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxVQUFVLENBQUMsSUFBcUI7UUFDNUIsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsT0FBTyxPQUFPLElBQUksSUFBSSxDQUFDO0lBQzNCLENBQUM7SUFFRCxtQkFBbUI7UUFFZixJQUFJLGFBQWEsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFFNUMsSUFBSSxJQUFJLENBQUMs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LEVBQUUsQ0FBQztJQUMvQixDQUFDOzs7WUFoSEosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLCs2REFBNEM7YUFFL0M7Ozs7c0JBR0ksS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0J1dHRvbiwgQnV0dG9uSW50ZXJmYWNlfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtEcm9wZG93bkJ1dHRvbkludGVyZmFjZX0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7QnV0dG9uR3JvdXBJbnRlcmZhY2V9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5cbmludGVyZmFjZSBTcGxpdEJ1dHRvbnMge1xuICAgIGV4cGFuZGVkOiBCdXR0b25JbnRlcmZhY2VbXTtcbiAgICBjb2xsYXBzZWQ6IEJ1dHRvbkludGVyZmFjZVtdO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tYnV0dG9uLWdyb3VwJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vYnV0dG9uLWdyb3VwLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZXM6IFtdLFxufSlcbmV4cG9ydCBjbGFzcyBCdXR0b25Hcm91cENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAgIEBJbnB1dCgpIGNvbmZpZyQ6IE9ic2VydmFibGU8QnV0dG9uR3JvdXBJbnRlcmZhY2U+O1xuXG4gICAgYnV0dG9uczogU3BsaXRCdXR0b25zID0ge1xuICAgICAgICBleHBhbmRlZDogW10sXG4gICAgICAgIGNvbGxhcHNlZDogW10sXG4gICAgfTtcblxuICAgIGRyb3Bkb3duQ29uZmlnOiBEcm9wZG93bkJ1dHRvbkludGVyZmFjZTtcblxuICAgIHByb3RlY3RlZCBpbnRlcm5hbENvbmZpZzogQnV0dG9uR3JvdXBJbnRlcmZhY2U7XG4gICAgcHJpdmF0ZSBzdWI6IFN1YnNjcmlwdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN1YiA9IHRoaXMuY29uZmlnJC5zdWJzY3JpYmUoY29uZmlnID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuYWxDb25maWcgPSB7Li4uY29uZmlnfTtcbiAgICAgICAgICAgIHRoaXMuc3BsaXRCdXR0b25zKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN1Yi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIGlzRHJvcGRvd24oaXRlbTogQnV0dG9uSW50ZXJmYWNlKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnaXRlbXMnIGluIGl0ZW07XG4gICAgfVxuXG4gICAgYnVpbGREcm9wZG93bkNvbmZpZygpOiB2b2lkIHtcblxuICAgICAgICBsZXQgYnV0dG9uQ2xhc3NlcyA9IFsnYnV0dG9uLWdyb3VwLWJ1dHRvbiddO1xuXG4gICAgICAgIGlmICh0aGlzLmludGVybmFsQ29uZmlnLmJ1dHRvbktsYXNzICYmIHRoaXMuaW50ZXJuYWxDb25maWcuYnV0dG9uS2xhc3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYnV0dG9uQ2xhc3NlcyA9IGJ1dHRvbkNsYXNzZXMuY29uY2F0KHRoaXMuaW50ZXJuYWxDb25maWcuYnV0dG9uS2xhc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHdyYXBwZXJDbGFzc2VzID0gWydidXR0b24tZ3JvdXAtZHJvcGRvd24nXTtcblxuICAgICAgICBjb25zdCBkcm9wZG93bk9wdGlvbnMgPSB0aGlzLmludGVybmFsQ29uZmlnLmRyb3Bkb3duT3B0aW9ucztcbiAgICAgICAgY29uc3Qgb3B0aW9uc1dyYXBwZXJLbGFzcyA9IGRyb3Bkb3duT3B0aW9ucyAmJiBkcm9wZG93bk9wdGlvbnMud3JhcHBlcktsYXNzO1xuXG4gICAgICAgIGlmIChvcHRpb25zV3JhcHBlcktsYXNzICYmIG9wdGlvbnNXcmFwcGVyS2xhc3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgd3JhcHBlckNsYXNzZXMgPSB3cmFwcGVyQ2xhc3Nlcy5jb25jYXQob3B0aW9uc1dyYXBwZXJLbGFzcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyb3Bkb3duQ29uZmlnID0ge1xuICAgICAgICAgICAgbGFiZWw6IHRoaXMuaW50ZXJuYWxDb25maWcuZHJvcGRvd25MYWJlbCxcbiAgICAgICAgICAgIGtsYXNzOiBbLi4uYnV0dG9uQ2xhc3Nlc10sXG4gICAgICAgICAgICB3cmFwcGVyS2xhc3M6IHdyYXBwZXJDbGFzc2VzLFxuICAgICAgICAgICAgaXRlbXM6IHRoaXMuYnV0dG9ucy5jb2xsYXBzZWQsXG4gICAgICAgIH0gYXMgRHJvcGRvd25CdXR0b25JbnRlcmZhY2U7XG5cbiAgICAgICAgaWYgKHRoaXMuaW50ZXJuYWxDb25maWcuZHJvcGRvd25PcHRpb25zICYmIHRoaXMuaW50ZXJuYWxDb25maWcuZHJvcGRvd25PcHRpb25zLnBsYWNlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5kcm9wZG93bkNvbmZpZy5wbGFjZW1lbnQgPSB0aGlzLmludGVybmFsQ29uZmlnLmRyb3Bkb3duT3B0aW9ucy5wbGFjZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0QnJlYWtwb2ludCgpOiBudW1iZXIge1xuXG4gICAgICAgIGlmICghdGhpcy5pbnRlcm5hbENvbmZpZy5icmVha3BvaW50KSB7XG4gICAgICAgICAgICByZXR1cm4gNDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsQ29uZmlnLmJyZWFrcG9pbnQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNwbGl0QnV0dG9ucygpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLmJ1dHRvbnMuZXhwYW5kZWQgPSBbXTtcbiAgICAgICAgdGhpcy5idXR0b25zLmNvbGxhcHNlZCA9IFtdO1xuXG4gICAgICAgIGlmICghdGhpcy5pbnRlcm5hbENvbmZpZy5idXR0b25zIHx8IHRoaXMuaW50ZXJuYWxDb25maWcuYnV0dG9ucy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY291bnQgPSAwO1xuXG4gICAgICAgIHRoaXMuaW50ZXJuYWxDb25maWcuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG5cbiAgICAgICAgICAgIGlmICghYnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY291bnQgPCB0aGlzLmdldEJyZWFrcG9pbnQoKSkge1xuICAgICAgICAgICAgICAgIGxldCBjbGFzc2VzID0gWydidXR0b24tZ3JvdXAtYnV0dG9uJ107XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW50ZXJuYWxDb25maWcuYnV0dG9uS2xhc3MgJiYgdGhpcy5pbnRlcm5hbENvbmZpZy5idXR0b25LbGFzcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzLmNvbmNhdCh0aGlzLmludGVybmFsQ29uZmlnLmJ1dHRvbktsYXNzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3QnV0dG9uID0gey4uLmJ1dHRvbn07XG4gICAgICAgICAgICAgICAgQnV0dG9uLmFwcGVuZENsYXNzZXMobmV3QnV0dG9uLCBbLi4uY2xhc3Nlc10pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5idXR0b25zLmV4cGFuZGVkLnB1c2gobmV3QnV0dG9uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5idXR0b25zLmNvbGxhcHNlZC5wdXNoKHsuLi5idXR0b259KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5idWlsZERyb3Bkb3duQ29uZmlnKCk7XG4gICAgfVxuXG59XG4iXX0=