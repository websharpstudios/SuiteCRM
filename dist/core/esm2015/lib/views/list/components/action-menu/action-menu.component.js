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
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListViewStore } from '../../store/list-view/list-view.store';
import { SystemConfigStore } from '../../../../store/system-config/system-config.store';
import { ScreenSize, ScreenSizeObserverService } from '../../../../services/ui/screen-size-observer/screen-size-observer.service';
import { ModuleNavigation } from '../../../../services/navigation/module-navigation/module-navigation.service';
export class ActionMenuComponent {
    constructor(listStore, actionHandler, screenSize, systemConfigs) {
        this.listStore = listStore;
        this.actionHandler = actionHandler;
        this.screenSize = screenSize;
        this.systemConfigs = systemConfigs;
        this.configState = new BehaviorSubject({ buttons: [] });
        this.config$ = this.configState.asObservable();
        this.vm$ = combineLatest([
            this.screenSize.screenSize$
        ]).pipe(map(([screenSize]) => {
            if (screenSize) {
                this.screen = screenSize;
            }
            this.configState.next(this.getButtonGroupConfig());
            return { screenSize };
        }));
        this.screen = ScreenSize.Medium;
        this.defaultBreakpoint = 3;
    }
    ngOnInit() {
        this.configState.next(this.getButtonGroupConfig());
    }
    getButtonGroupConfig() {
        const actions = this.actions;
        const config = {
            buttonKlass: ['action-button'],
            dropdownLabel: this.listStore.appStrings.LBL_MORE || '',
            buttons: [],
            dropdownOptions: {
                placement: ['bottom-right']
            },
            breakpoint: this.getBreakpoint()
        };
        actions.forEach(action => {
            const buttonConfig = this.getButtonConfig(action);
            if (buttonConfig && buttonConfig.klass) {
                config.buttons.push(buttonConfig);
            }
        });
        return config;
    }
    getBreakpoint() {
        const breakpointMap = this.systemConfigs && this.systemConfigs.getConfigValue('listview_actions_limits');
        if (this.screen && breakpointMap && breakpointMap[this.screen]) {
            this.breakpoint = breakpointMap[this.screen];
            return this.breakpoint;
        }
        if (this.breakpoint) {
            return this.breakpoint;
        }
        return this.defaultBreakpoint;
    }
    get actions() {
        if (!this.listStore.vm.appData.module || !this.listStore.vm.appData.module.menu) {
            return [];
        }
        return this.listStore.vm.appData.module.menu.filter(action => !(action.name === 'List' || action.name === 'View'));
    }
    getButtonConfig(action) {
        if (!this.listStore.vm.appData.appState.module) {
            return {};
        }
        if (!this.listStore.vm.appData.language) {
            return {};
        }
        const module = this.listStore.vm.appData.appState.module;
        const language = this.listStore.vm.appData.language;
        let labelKey = '';
        if (action.actionLabelKey) {
            labelKey = action.actionLabelKey;
        }
        return {
            klass: 'action-button',
            label: this.actionHandler.getActionLabel(module, action, language, labelKey),
            onClick: () => {
                this.actionHandler.navigate(action).then();
            }
        };
    }
}
ActionMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-action-menu',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<div class=\"list-view-actions float-right\" *ngIf=\"(vm$ | async) as vm\">\n    <scrm-button-group [config$]=\"config$\"></scrm-button-group>\n</div>\n"
            },] }
];
ActionMenuComponent.ctorParameters = () => [
    { type: ListViewStore },
    { type: ModuleNavigation },
    { type: ScreenSizeObserverService },
    { type: SystemConfigStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLW1lbnUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3ZpZXdzL2xpc3QvY29tcG9uZW50cy9hY3Rpb24tbWVudS9hY3Rpb24tbWVudS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQVMsTUFBTSxlQUFlLENBQUM7QUFFaEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDcEQsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ25DLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUNwRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxxREFBcUQsQ0FBQztBQUV0RixPQUFPLEVBQ0gsVUFBVSxFQUNWLHlCQUF5QixFQUM1QixNQUFNLDJFQUEyRSxDQUFDO0FBQ25GLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDZFQUE2RSxDQUFDO0FBTTdHLE1BQU0sT0FBTyxtQkFBbUI7SUFzQjVCLFlBQ2MsU0FBd0IsRUFDeEIsYUFBK0IsRUFDL0IsVUFBcUMsRUFDckMsYUFBZ0M7UUFIaEMsY0FBUyxHQUFULFNBQVMsQ0FBZTtRQUN4QixrQkFBYSxHQUFiLGFBQWEsQ0FBa0I7UUFDL0IsZUFBVSxHQUFWLFVBQVUsQ0FBMkI7UUFDckMsa0JBQWEsR0FBYixhQUFhLENBQW1CO1FBeEI5QyxnQkFBVyxHQUFHLElBQUksZUFBZSxDQUF1QixFQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO1FBQ3ZFLFlBQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRTFDLFFBQUcsR0FBRyxhQUFhLENBQUM7WUFDaEIs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TUFBTSxFQUFFO1lBQzVDLE9BQU8sRUFBRSxDQUFDO1NBQ2I7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNyQyxPQUFPLEVBQUUsQ0FBQztTQUNiO1FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDekQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUNwRCxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBSSxNQUFNLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLFFBQVEsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO1NBQ3BDO1FBRUQsT0FBTztZQUNILEtBQUssRUFBRSxlQUFlO1lBQ3RCLEtBQUssRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUM7WUFDNUUsT0FBTyxFQUFFLEdBQVMsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDL0MsQ0FBQztTQUNKLENBQUM7SUFDTixDQUFDOzs7WUE1R0osU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLHFnREFBeUM7YUFDNUM7OztZQVpPLGFBQWE7WUFPYixnQkFBZ0I7WUFGcEIseUJBQXlCO1lBSnJCLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0J1dHRvbkdyb3VwSW50ZXJmYWNlLCBCdXR0b25JbnRlcmZhY2V9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtMaXN0Vmlld1N0b3JlfSBmcm9tICcuLi8uLi9zdG9yZS9saXN0LXZpZXcvbGlzdC12aWV3LnN0b3JlJztcbmltcG9ydCB7U3lzdGVtQ29uZmlnU3RvcmV9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3N5c3RlbS1jb25maWcvc3lzdGVtLWNvbmZpZy5zdG9yZSc7XG5pbXBvcnQge01vZHVsZUFjdGlvbn0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLnN0b3JlJztcbmltcG9ydCB7XG4gICAgU2NyZWVuU2l6ZSxcbiAgICBTY3JlZW5TaXplT2JzZXJ2ZXJTZXJ2aWNlXG59IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL3VpL3NjcmVlbi1zaXplLW9ic2VydmVyL3NjcmVlbi1zaXplLW9ic2VydmVyLnNlcnZpY2UnO1xuaW1wb3J0IHtNb2R1bGVOYXZpZ2F0aW9ufSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uL21vZHVsZS1uYXZpZ2F0aW9uL21vZHVsZS1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tYWN0aW9uLW1lbnUnLFxuICAgIHRlbXBsYXRlVXJsOiAnYWN0aW9uLW1lbnUuY29tcG9uZW50Lmh0bWwnLFxufSlcbmV4cG9ydCBjbGFzcyBBY3Rpb25NZW51Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIGNvbmZpZ1N0YXRlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxCdXR0b25Hcm91cEludGVyZmFjZT4oe2J1dHRvbnM6IFtdfSk7XG4gICAgY29uZmlnJCA9IHRoaXMuY29uZmlnU3RhdGUuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICB2bSQgPSBjb21iaW5lTGF0ZXN0KFtcbiAgICAgICAgdGhpcy5zY3JlZW5TaXplLnNjcmVlblNpemUkXG4gICAgXSkucGlwZShcbiAgICAgICAgbWFwKChbc2NyZWVuU2l6ZV0pID0+IHtcbiAgICAgICAgICAgIGlmIChzY3JlZW5TaXplKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JlZW4gPSBzY3JlZW5TaXplO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb25maWdTdGF0ZS5uZXh0KHRoaXMuZ2V0QnV0dG9uR3JvdXBDb25maWcoKSk7XG4gICAgICAgICAgICByZXR1cm4ge3NjcmVlblNpemV9O1xuICAgICAgICB9KVxuICAgICk7XG5cbiAgICBwcm90ZWN0ZWQgc2NyZWVuOiBTY3JlZW5TaXplID0gU2NyZWVuU2l6ZS5NZWRpdW07XG4gICAgcHJvdGVjdGVkIGRlZmF1bHRCcmVha3BvaW50ID0gMztcbiAgICBwcm90ZWN0ZWQgYnJlYWtwb2ludDogbnVtYmVyO1xuXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGxpc3RTdG9yZTogTGlzdFZpZXdTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIGFjdGlvbkhhbmRsZXI6IE1vZHVsZU5hdmlnYXRpb24sXG4gICAgICAgIHByb3RlY3RlZCBzY3JlZW5TaXplOiBTY3JlZW5TaXplT2JzZXJ2ZXJTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgc3lzdGVtQ29uZmlnczogU3lzdGVtQ29uZmlnU3RvcmVcbiAgICApIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb25maWdTdGF0ZS5uZXh0KHRoaXMuZ2V0QnV0dG9uR3JvdXBDb25maWcoKSk7XG4gICAgfVxuXG4gICAgZ2V0QnV0dG9uR3JvdXBDb25maWcoKTogQnV0dG9uR3JvdXBJbnRlcmZhY2Uge1xuICAgICAgICBjb25zdCBhY3Rpb25zID0gdGhpcy5hY3Rpb25zO1xuICAgICAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgICAgICBidXR0b25LbGFzczogWydhY3Rpb24tYnV0dG9uJ10sXG4gICAgICAgICAgICBkcm9wZG93bkxhYmVsOiB0aGlzLmxpc3RTdG9yZS5hcHBTdHJpbmdzLkxCTF9NT1JFIHx8ICcnLFxuICAgICAgICAgICAgYnV0dG9uczogW10sXG4gICAgICAgICAgICBkcm9wZG93bk9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6IFsnYm90dG9tLXJpZ2h0J11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBicmVha3BvaW50OiB0aGlzLmdldEJyZWFrcG9pbnQoKVxuICAgICAgICB9IGFzIEJ1dHRvbkdyb3VwSW50ZXJmYWNlO1xuXG4gICAgICAgIGFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4ge1xuICAgICAgICAgICAgY29uc3QgYnV0dG9uQ29uZmlnID0gdGhpcy5nZXRCdXR0b25Db25maWcoYWN0aW9uKTtcbiAgICAgICAgICAgIGlmIChidXR0b25Db25maWcgJiYgYnV0dG9uQ29uZmlnLmtsYXNzKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLmJ1dHRvbnMucHVzaChidXR0b25Db25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgIH1cblxuICAgIGdldEJyZWFrcG9pbnQoKTogbnVtYmVyIHtcblxuICAgICAgICBjb25zdCBicmVha3BvaW50TWFwID0gdGhpcy5zeXN0ZW1Db25maWdzICYmIHRoaXMuc3lzdGVtQ29uZmlncy5nZXRDb25maWdWYWx1ZSgnbGlzdHZpZXdfYWN0aW9uc19saW1pdHMnKTtcblxuICAgICAgICBpZiAodGhpcy5zY3JlZW4gJiYgYnJlYWtwb2ludE1hcCAmJiBicmVha3BvaW50TWFwW3RoaXMuc2NyZWVuXSkge1xuICAgICAgICAgICAgdGhpcy5icmVha3BvaW50ID0gYnJlYWtwb2ludE1hcFt0aGlzLnNjcmVlbl07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5icmVha3BvaW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYnJlYWtwb2ludCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnJlYWtwb2ludDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRCcmVha3BvaW50O1xuICAgIH1cblxuICAgIGdldCBhY3Rpb25zKCk6IE1vZHVsZUFjdGlvbltdIHtcbiAgICAgICAgaWYgKCF0aGlzLmxpc3RTdG9yZS52bS5hcHBEYXRhLm1vZHVsZSB8fCAhdGhpcy5saXN0U3RvcmUudm0uYXBwRGF0YS5tb2R1bGUubWVudSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdFN0b3JlLnZtLmFwcERhdGEubW9kdWxlLm1lbnUuZmlsdGVyKGFjdGlvbiA9PiAhKGFjdGlvbi5uYW1lID09PSAnTGlzdCcgfHwgYWN0aW9uLm5hbWUgPT09ICdWaWV3JykpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRCdXR0b25Db25maWcoYWN0aW9uOiBNb2R1bGVBY3Rpb24pOiBCdXR0b25JbnRlcmZhY2Uge1xuXG4gICAgICAgIGlmICghdGhpcy5saXN0U3RvcmUudm0uYXBwRGF0YS5hcHBTdGF0ZS5tb2R1bGUpIHtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5saXN0U3RvcmUudm0uYXBwRGF0YS5sYW5ndWFnZSkge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbW9kdWxlID0gdGhpcy5saXN0U3RvcmUudm0uYXBwRGF0YS5hcHBTdGF0ZS5tb2R1bGU7XG4gICAgICAgIGNvbnN0IGxhbmd1YWdlID0gdGhpcy5saXN0U3RvcmUudm0uYXBwRGF0YS5sYW5ndWFnZTtcbiAgICAgICAgbGV0IGxhYmVsS2V5ID0gJyc7XG4gICAgICAgIGlmIChhY3Rpb24uYWN0aW9uTGFiZWxLZXkpIHtcbiAgICAgICAgICAgIGxhYmVsS2V5ID0gYWN0aW9uLmFjdGlvbkxhYmVsS2V5O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtsYXNzOiAnYWN0aW9uLWJ1dHRvbicsXG4gICAgICAgICAgICBsYWJlbDogdGhpcy5hY3Rpb25IYW5kbGVyLmdldEFjdGlvbkxhYmVsKG1vZHVsZSwgYWN0aW9uLCBsYW5ndWFnZSwgbGFiZWxLZXkpLFxuICAgICAgICAgICAgb25DbGljazogKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uSGFuZGxlci5uYXZpZ2F0ZShhY3Rpb24pLnRoZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iXX0=