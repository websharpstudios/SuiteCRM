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
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Button } from 'common';
import { SystemConfigStore } from '../../store/system-config/system-config.store';
import { ScreenSize, ScreenSizeObserverService } from '../../services/ui/screen-size-observer/screen-size-observer.service';
import { LanguageStore } from '../../store/language/language.store';
export class ActionGroupMenuComponent {
    constructor(languages, screenSize, systemConfigStore) {
        this.languages = languages;
        this.screenSize = screenSize;
        this.systemConfigStore = systemConfigStore;
        this.klass = '';
        this.buttonClass = 'btn btn-sm';
        this.configState = new BehaviorSubject({ buttons: [] });
        this.config$ = this.configState.asObservable();
        this.buttonGroupClass = 'dropdown-button-secondary';
        this.screen = ScreenSize.Medium;
        this.defaultBreakpoint = 3;
    }
    ngOnInit() {
        this.vm$ = combineLatest([
            this.config.getActions(),
            this.screenSize.screenSize$,
            this.languages.vm$
        ]).pipe(map(([actions, screenSize, languages]) => {
            if (screenSize) {
                this.screen = screenSize;
            }
            this.configState.next(this.getButtonGroupConfig(actions));
            return { actions, screenSize, languages };
        }));
    }
    isXSmallScreen() {
        return this.screen === ScreenSize.XSmall;
    }
    getButtonGroupConfig(actions) {
        const expanded = [];
        const collapsed = [];
        actions.forEach((action) => {
            const button = this.buildButton(action);
            if (action.params && action.params.expanded) {
                expanded.push(button);
                return;
            }
            collapsed.push(button);
        });
        let breakpoint = this.getBreakpoint();
        if (expanded.length < breakpoint) {
            breakpoint = expanded.length;
        }
        const buttons = expanded.concat(collapsed);
        return {
            buttonKlass: [this.buttonClass],
            dropdownLabel: this.languages.getAppString('LBL_ACTIONS') || '',
            breakpoint,
            dropdownOptions: {
                placement: ['bottom-right'],
                wrapperKlass: [(this.buttonGroupClass)]
            },
            buttons
        };
    }
    getBreakpoint() {
        const breakpointMap = this.systemConfigStore.getConfigValue('recordview_actions_limits');
        if (this.screen && breakpointMap && breakpointMap[this.screen]) {
            this.breakpoint = breakpointMap[this.screen];
            return this.breakpoint;
        }
        if (this.breakpoint) {
            return this.breakpoint;
        }
        return this.defaultBreakpoint;
    }
    buildButton(action) {
        const button = {
            label: action.label || '',
            klass: this.buttonClass,
            onClick: () => {
                this.config.runAction(action, this.actionContext);
            }
        };
        if (action.icon) {
            button.icon = action.icon;
        }
        if (action.status) {
            Button.appendClasses(button, [action.status]);
        }
        if (action.klass) {
            Button.appendClasses(button, action.klass);
        }
        return button;
    }
}
ActionGroupMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-action-group-menu',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container *ngIf=\"(vm$ | async) as vm\">\n    <div class=\"{{klass}} float-right\">\n        <scrm-button-group *ngIf=\"config$\" [config$]=\"config$\"></scrm-button-group>\n    </div>\n</ng-container>\n"
            },] }
];
ActionGroupMenuComponent.ctorParameters = () => [
    { type: LanguageStore },
    { type: ScreenSizeObserverService },
    { type: SystemConfigStore }
];
ActionGroupMenuComponent.propDecorators = {
    klass: [{ type: Input }],
    buttonClass: [{ type: Input }],
    actionContext: [{ type: Input }],
    config: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLWdyb3VwLW1lbnUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2NvbXBvbmVudHMvYWN0aW9uLWdyb3VwLW1lbnUvYWN0aW9uLWdyb3VwLW1lbnUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBUyxNQUFNLGVBQWUsQ0FBQztBQUN2RCxPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBMkIsTUFBTSxNQUFNLENBQUM7QUFDOUUsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ25DLE9BQU8sRUFBMEMsTUFBTSxFQUF3QyxNQUFNLFFBQVEsQ0FBQztBQUM5RyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwrQ0FBK0MsQ0FBQztBQUNoRixPQUFPLEVBQ0gsVUFBVSxFQUNWLHlCQUF5QixFQUM1QixNQUFNLHFFQUFxRSxDQUFDO0FBQzdFLE9BQU8sRUFBQyxhQUFhLEVBQWtCLE1BQU0scUNBQXFDLENBQUM7QUFZbkYsTUFBTSxPQUFPLHdCQUF3QjtJQWtCakMsWUFDYyxTQUF3QixFQUN4QixVQUFxQyxFQUNyQyxpQkFBb0M7UUFGcEMsY0FBUyxHQUFULFNBQVMsQ0FBZTtRQUN4QixlQUFVLEdBQVYsVUFBVSxDQUEyQjtRQUNyQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBbkJ6QyxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsZ0JBQVcsR0FBRyxZQUFZLENBQUM7UUFHcEMsZ0JBQVcsR0FBRyxJQUFJLGVBQWUsQ0FBdUIsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQztRQUN2RSxZQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUlo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QyxDQUFDO0lBRVMsV0FBVyxDQUFDLE1BQWM7UUFDaEMsTUFBTSxNQUFNLEdBQUc7WUFDWCxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVztZQUN2QixPQUFPLEVBQUUsR0FBUyxFQUFFO2dCQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3RELENBQUM7U0FDZSxDQUFDO1FBRXJCLElBQUksTUFBTSxDQUFDLElBQUksRUFBRTtZQUNiLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztTQUM3QjtRQUVELElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUNmLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDakQ7UUFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDZCxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUM7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDOzs7WUEzSEosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLDRqREFBaUQ7YUFDcEQ7OztZQVhPLGFBQWE7WUFGakIseUJBQXlCO1lBSHJCLGlCQUFpQjs7O29CQW1CcEIsS0FBSzswQkFDTCxLQUFLOzRCQUNMLEtBQUs7cUJBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtBY3Rpb24sIEFjdGlvbkNvbnRleHQsIEFjdGlvbkRhdGFTb3VyY2UsIEJ1dHRvbiwgQnV0dG9uR3JvdXBJbnRlcmZhY2UsIEJ1dHRvbkludGVyZmFjZX0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7U3lzdGVtQ29uZmlnU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL3N5c3RlbS1jb25maWcvc3lzdGVtLWNvbmZpZy5zdG9yZSc7XG5pbXBvcnQge1xuICAgIFNjcmVlblNpemUsXG4gICAgU2NyZWVuU2l6ZU9ic2VydmVyU2VydmljZVxufSBmcm9tICcuLi8uLi9zZXJ2aWNlcy91aS9zY3JlZW4tc2l6ZS1vYnNlcnZlci9zY3JlZW4tc2l6ZS1vYnNlcnZlci5zZXJ2aWNlJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZSwgTGFuZ3VhZ2VTdHJpbmdzfSBmcm9tICcuLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWN0aW9uR3JvdXBNZW51Vmlld01vZGVsIHtcbiAgICBhY3Rpb25zOiBBY3Rpb25bXTtcbiAgICBzY3JlZW5TaXplOiBTY3JlZW5TaXplO1xuICAgIGxhbmd1YWdlczogTGFuZ3VhZ2VTdHJpbmdzO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tYWN0aW9uLWdyb3VwLW1lbnUnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9hY3Rpb24tZ3JvdXAtbWVudS5jb21wb25lbnQuaHRtbCcsXG59KVxuZXhwb3J0IGNsYXNzIEFjdGlvbkdyb3VwTWVudUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBASW5wdXQoKSBrbGFzcyA9ICcnO1xuICAgIEBJbnB1dCgpIGJ1dHRvbkNsYXNzID0gJ2J0biBidG4tc20nO1xuICAgIEBJbnB1dCgpIGFjdGlvbkNvbnRleHQ6IEFjdGlvbkNvbnRleHQ7XG4gICAgQElucHV0KCkgY29uZmlnOiBBY3Rpb25EYXRhU291cmNlO1xuICAgIGNvbmZpZ1N0YXRlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxCdXR0b25Hcm91cEludGVyZmFjZT4oe2J1dHRvbnM6IFtdfSk7XG4gICAgY29uZmlnJCA9IHRoaXMuY29uZmlnU3RhdGUuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICB2bSQ6IE9ic2VydmFibGU8QWN0aW9uR3JvdXBNZW51Vmlld01vZGVsPjtcblxuICAgIHByb3RlY3RlZCBidXR0b25Hcm91cENsYXNzID0gJ2Ryb3Bkb3duLWJ1dHRvbi1zZWNvbmRhcnknO1xuXG4gICAgcHJvdGVjdGVkIHN1YnM6IFN1YnNjcmlwdGlvbltdO1xuICAgIHByb3RlY3RlZCBzY3JlZW46IFNjcmVlblNpemUgPSBTY3JlZW5TaXplLk1lZGl1bTtcbiAgICBwcm90ZWN0ZWQgZGVmYXVsdEJyZWFrcG9pbnQgPSAzO1xuICAgIHByb3RlY3RlZCBicmVha3BvaW50OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlczogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIHNjcmVlblNpemU6IFNjcmVlblNpemVPYnNlcnZlclNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBzeXN0ZW1Db25maWdTdG9yZTogU3lzdGVtQ29uZmlnU3RvcmUsXG4gICAgKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudm0kID0gY29tYmluZUxhdGVzdChbXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5nZXRBY3Rpb25zKCksXG4gICAgICAgICAgICB0aGlzLnNjcmVlblNpemUuc2NyZWVuU2l6ZSQsXG4gICAgICAgICAgICB0aGlzLmxhbmd1YWdlcy52bSRcbiAgICAgICAgXSkucGlwZShcbiAgICAgICAgICAgIG1hcCgoW2FjdGlvbnMsIHNjcmVlblNpemUsIGxhbmd1YWdlc10pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc2NyZWVuU2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcmVlbiA9IHNjcmVlblNpemU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnU3RhdGUubmV4dCh0aGlzLmdldEJ1dHRvbkdyb3VwQ29uZmlnKGFjdGlvbnMpKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7YWN0aW9ucywgc2NyZWVuU2l6ZSwgbGFuZ3VhZ2VzfTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaXNYU21hbGxTY3JlZW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjcmVlbiA9PT0gU2NyZWVuU2l6ZS5YU21hbGw7XG4gICAgfVxuXG4gICAgZ2V0QnV0dG9uR3JvdXBDb25maWcoYWN0aW9uczogQWN0aW9uW10pOiBCdXR0b25Hcm91cEludGVyZmFjZSB7XG5cbiAgICAgICAgY29uc3QgZXhwYW5kZWQgPSBbXTtcbiAgICAgICAgY29uc3QgY29sbGFwc2VkID0gW107XG5cbiAgICAgICAgYWN0aW9ucy5mb3JFYWNoKChhY3Rpb246IEFjdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gdGhpcy5idWlsZEJ1dHRvbihhY3Rpb24pO1xuXG4gICAgICAgICAgICBpZiAoYWN0aW9uLnBhcmFtcyAmJiBhY3Rpb24ucGFyYW1zLmV4cGFuZGVkKSB7XG4gICAgICAgICAgICAgICAgZXhwYW5kZWQucHVzaChidXR0b24pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sbGFwc2VkLnB1c2goYnV0dG9uKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGJyZWFrcG9pbnQgPSB0aGlzLmdldEJyZWFrcG9pbnQoKTtcbiAgICAgICAgaWYgKGV4cGFuZGVkLmxlbmd0aCA8IGJyZWFrcG9pbnQpIHtcbiAgICAgICAgICAgIGJyZWFrcG9pbnQgPSBleHBhbmRlZC5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBidXR0b25zID0gZXhwYW5kZWQuY29uY2F0KGNvbGxhcHNlZCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJ1dHRvbktsYXNzOiBbdGhpcy5idXR0b25DbGFzc10sXG4gICAgICAgICAgICBkcm9wZG93bkxhYmVsOiB0aGlzLmxhbmd1YWdlcy5nZXRBcHBTdHJpbmcoJ0xCTF9BQ1RJT05TJykgfHwgJycsXG4gICAgICAgICAgICBicmVha3BvaW50LFxuICAgICAgICAgICAgZHJvcGRvd25PcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgcGxhY2VtZW50OiBbJ2JvdHRvbS1yaWdodCddLFxuICAgICAgICAgICAgICAgIHdyYXBwZXJLbGFzczogWyh0aGlzLmJ1dHRvbkdyb3VwQ2xhc3MpXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJ1dHRvbnNcbiAgICAgICAgfSBhcyBCdXR0b25Hcm91cEludGVyZmFjZTtcbiAgICB9XG5cbiAgICBnZXRCcmVha3BvaW50KCk6IG51bWJlciB7XG5cbiAgICAgICAgY29uc3QgYnJlYWtwb2ludE1hcCA9IHRoaXMuc3lzdGVtQ29uZmlnU3RvcmUuZ2V0Q29uZmlnVmFsdWUoJ3JlY29yZHZpZXdfYWN0aW9uc19saW1pdHMnKTtcblxuICAgICAgICBpZiAodGhpcy5zY3JlZW4gJiYgYnJlYWtwb2ludE1hcCAmJiBicmVha3BvaW50TWFwW3RoaXMuc2NyZWVuXSkge1xuICAgICAgICAgICAgdGhpcy5icmVha3BvaW50ID0gYnJlYWtwb2ludE1hcFt0aGlzLnNjcmVlbl07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5icmVha3BvaW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYnJlYWtwb2ludCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnJlYWtwb2ludDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRCcmVha3BvaW50O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBidWlsZEJ1dHRvbihhY3Rpb246IEFjdGlvbik6IEJ1dHRvbkludGVyZmFjZSB7XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IHtcbiAgICAgICAgICAgIGxhYmVsOiBhY3Rpb24ubGFiZWwgfHwgJycsXG4gICAgICAgICAgICBrbGFzczogdGhpcy5idXR0b25DbGFzcyxcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5ydW5BY3Rpb24oYWN0aW9uLCB0aGlzLmFjdGlvbkNvbnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGFzIEJ1dHRvbkludGVyZmFjZTtcblxuICAgICAgICBpZiAoYWN0aW9uLmljb24pIHtcbiAgICAgICAgICAgIGJ1dHRvbi5pY29uID0gYWN0aW9uLmljb247XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWN0aW9uLnN0YXR1cykge1xuICAgICAgICAgICAgQnV0dG9uLmFwcGVuZENsYXNzZXMoYnV0dG9uLCBbYWN0aW9uLnN0YXR1c10pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFjdGlvbi5rbGFzcykge1xuICAgICAgICAgICAgQnV0dG9uLmFwcGVuZENsYXNzZXMoYnV0dG9uLCBhY3Rpb24ua2xhc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICB9XG59XG4iXX0=