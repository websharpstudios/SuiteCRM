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
import { LanguageStore } from '../../store/language/language.store';
import { SubpanelActionManager } from "../../containers/subpanel/components/subpanel/action-manager.service";
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ScreenSize, ScreenSizeObserverService } from '../../services/ui/screen-size-observer/screen-size-observer.service';
import { SystemConfigStore } from '../../store/system-config/system-config.store';
import { map } from 'rxjs/operators';
export class LineActionMenuComponent {
    constructor(languageStore, actionManager, languages, screenSize, systemConfigStore) {
        this.languageStore = languageStore;
        this.actionManager = actionManager;
        this.languages = languages;
        this.screenSize = screenSize;
        this.systemConfigStore = systemConfigStore;
        this.klass = '';
        this.limitConfigKey = 'listview_line_actions_limits';
        this.configState = new BehaviorSubject({ buttons: [] });
        this.config$ = this.configState.asObservable();
        this.buttonClass = 'line-action-item line-action';
        this.buttonGroupClass = 'float-right';
        this.subs = [];
        this.screen = ScreenSize.Medium;
        this.defaultBreakpoint = 3;
    }
    ngOnInit() {
        this.subs.push(combineLatest([
            this.config.getActions({ record: this.record }),
            this.screenSize.screenSize$,
            this.languages.vm$
        ]).pipe(map(([actions, screenSize, languages]) => {
            if (screenSize) {
                this.screen = screenSize;
            }
            this.configState.next(this.getButtonGroupConfig(actions));
            this.actions = actions;
        })).subscribe());
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
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
        const breakpointMap = this.systemConfigStore.getConfigValue(this.limitConfigKey);
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
            titleKey: action.labelKey || '',
            klass: this.buttonClass,
            icon: action.icon || '',
            onClick: () => {
                this.config.runAction(action, {
                    module: (this.record && this.record.module) || '',
                    record: this.record
                });
            }
        };
        if (action.icon) {
            button.icon = action.icon;
        }
        if (action.status) {
            Button.appendClasses(button, [action.status]);
        }
        return button;
    }
}
LineActionMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-line-action-menu',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container *ngIf=\"actions\">\n    <div id=\"line-action-div\" class=\"line-action float-right\">\n        <div class=\"{{klass}}\">\n            <scrm-button-group *ngIf=\"config$\" [config$]=\"config$\"></scrm-button-group>\n        </div>\n    </div>\n</ng-container>\n\n"
            },] }
];
LineActionMenuComponent.ctorParameters = () => [
    { type: LanguageStore },
    { type: SubpanelActionManager },
    { type: LanguageStore },
    { type: ScreenSizeObserverService },
    { type: SystemConfigStore }
];
LineActionMenuComponent.propDecorators = {
    klass: [{ type: Input }],
    record: [{ type: Input }],
    config: [{ type: Input }],
    limitConfigKey: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS1hY3Rpb24tbWVudS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29tcG9uZW50cy9saW5lLWFjdGlvbi1tZW51L2xpbmUtYWN0aW9uLW1lbnUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBb0IsTUFBTSxlQUFlLENBQUM7QUFDbEUsT0FBTyxFQUEwQyxNQUFNLEVBQWdELE1BQU0sUUFBUSxDQUFDO0FBQ3RILE9BQU8sRUFBQyxhQUFhLEVBQWtCLE1BQU0scUNBQXFDLENBQUM7QUFDbkYsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0VBQXNFLENBQUM7QUFDM0csT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQTJCLE1BQU0sTUFBTSxDQUFDO0FBQzlFLE9BQU8sRUFDSCxVQUFVLEVBQ1YseUJBQXlCLEVBQzVCLE1BQU0scUVBQXFFLENBQUM7QUFDN0UsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sK0NBQStDLENBQUM7QUFDaEYsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBWW5DLE1BQU0sT0FBTyx1QkFBdUI7SUFvQmhDLFlBQ2MsYUFBNEIsRUFDNUIsYUFBb0MsRUFDcEMsU0FBd0IsRUFDeEIsVUFBcUMsRUFDckMsaUJBQW9DO1FBSnBDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGtCQUFhLEdBQWIsYUFBYSxDQUF1QjtRQUNwQyxjQUFTLEdBQVQsU0FBUyxDQUFlO1FBQ3hCLGVBQVUsR0FBVixVQUFVLENBQTJCO1FBQ3JDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUF2QnpDLFVBQUssR0FBRyxFQUFFLENBQUM7UUFHWCxtQkFBYyxHQUFHLDhCQUE4QixDQUFD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QUNQLFFBQVEsRUFBRSx1QkFBdUI7Z0JBQ2pDLGtvREFBOEM7YUFDakQ7OztZQW5CTyxhQUFhO1lBQ2IscUJBQXFCO1lBRHJCLGFBQWE7WUFLakIseUJBQXlCO1lBRXJCLGlCQUFpQjs7O29CQWVwQixLQUFLO3FCQUNMLEtBQUs7cUJBQ0wsS0FBSzs2QkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QWN0aW9uLCBBY3Rpb25Db250ZXh0LCBBY3Rpb25EYXRhU291cmNlLCBCdXR0b24sIEJ1dHRvbkdyb3VwSW50ZXJmYWNlLCBCdXR0b25JbnRlcmZhY2UsIFJlY29yZH0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZSwgTGFuZ3VhZ2VTdHJpbmdzfSBmcm9tICcuLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5pbXBvcnQge1N1YnBhbmVsQWN0aW9uTWFuYWdlcn0gZnJvbSBcIi4uLy4uL2NvbnRhaW5lcnMvc3VicGFuZWwvY29tcG9uZW50cy9zdWJwYW5lbC9hY3Rpb24tbWFuYWdlci5zZXJ2aWNlXCI7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gICAgU2NyZWVuU2l6ZSxcbiAgICBTY3JlZW5TaXplT2JzZXJ2ZXJTZXJ2aWNlXG59IGZyb20gJy4uLy4uL3NlcnZpY2VzL3VpL3NjcmVlbi1zaXplLW9ic2VydmVyL3NjcmVlbi1zaXplLW9ic2VydmVyLnNlcnZpY2UnO1xuaW1wb3J0IHtTeXN0ZW1Db25maWdTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvc3lzdGVtLWNvbmZpZy9zeXN0ZW0tY29uZmlnLnN0b3JlJztcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZUFjdGlvbk1lbnVWaWV3TW9kZWwge1xuICAgIGFjdGlvbnM6IEFjdGlvbltdO1xuICAgIHNjcmVlblNpemU6IFNjcmVlblNpemU7XG4gICAgbGFuZ3VhZ2VzOiBMYW5ndWFnZVN0cmluZ3M7XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1saW5lLWFjdGlvbi1tZW51JyxcbiAgICB0ZW1wbGF0ZVVybDogJ2xpbmUtYWN0aW9uLW1lbnUuY29tcG9uZW50Lmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIExpbmVBY3Rpb25NZW51Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KCkga2xhc3MgPSAnJztcbiAgICBASW5wdXQoKSByZWNvcmQ6IFJlY29yZDtcbiAgICBASW5wdXQoKSBjb25maWc6IEFjdGlvbkRhdGFTb3VyY2U7XG4gICAgQElucHV0KCkgbGltaXRDb25maWdLZXkgPSAnbGlzdHZpZXdfbGluZV9hY3Rpb25zX2xpbWl0cyc7XG4gICAgY29uZmlnU3RhdGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEJ1dHRvbkdyb3VwSW50ZXJmYWNlPih7YnV0dG9uczogW119KTtcbiAgICBjb25maWckID0gdGhpcy5jb25maWdTdGF0ZS5hc09ic2VydmFibGUoKTtcbiAgICBhY3Rpb25zOiBBY3Rpb25bXTtcblxuICAgIHZtJDogT2JzZXJ2YWJsZTxMaW5lQWN0aW9uTWVudVZpZXdNb2RlbD47XG5cbiAgICBwcm90ZWN0ZWQgYnV0dG9uQ2xhc3MgPSAnbGluZS1hY3Rpb24taXRlbSBsaW5lLWFjdGlvbic7XG4gICAgcHJvdGVjdGVkIGJ1dHRvbkdyb3VwQ2xhc3MgPSAnZmxvYXQtcmlnaHQnO1xuXG4gICAgcHJvdGVjdGVkIHN1YnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gICAgcHJvdGVjdGVkIHNjcmVlbjogU2NyZWVuU2l6ZSA9IFNjcmVlblNpemUuTWVkaXVtO1xuICAgIHByb3RlY3RlZCBkZWZhdWx0QnJlYWtwb2ludCA9IDM7XG4gICAgcHJvdGVjdGVkIGJyZWFrcG9pbnQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgbGFuZ3VhZ2VTdG9yZTogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIGFjdGlvbk1hbmFnZXI6IFN1YnBhbmVsQWN0aW9uTWFuYWdlcixcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlczogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIHNjcmVlblNpemU6IFNjcmVlblNpemVPYnNlcnZlclNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBzeXN0ZW1Db25maWdTdG9yZTogU3lzdGVtQ29uZmlnU3RvcmUsXG4gICAgKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3Vicy5wdXNoKGNvbWJpbmVMYXRlc3QoW1xuICAgICAgICAgICAgdGhpcy5jb25maWcuZ2V0QWN0aW9ucyh7cmVjb3JkOiB0aGlzLnJlY29yZH0pLFxuICAgICAgICAgICAgdGhpcy5zY3JlZW5TaXplLnNjcmVlblNpemUkLFxuICAgICAgICAgICAgdGhpcy5sYW5ndWFnZXMudm0kXG4gICAgICAgIF0pLnBpcGUoXG4gICAgICAgICAgICBtYXAoKFthY3Rpb25zLCBzY3JlZW5TaXplLCBsYW5ndWFnZXNdKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNjcmVlblNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JlZW4gPSBzY3JlZW5TaXplO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZ1N0YXRlLm5leHQodGhpcy5nZXRCdXR0b25Hcm91cENvbmZpZyhhY3Rpb25zKSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFjdGlvbnMgPSBhY3Rpb25zO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKS5zdWJzY3JpYmUoKSlcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdWJzLmZvckVhY2goc3ViID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcbiAgICB9XG5cbiAgICBnZXRCdXR0b25Hcm91cENvbmZpZyhhY3Rpb25zOiBBY3Rpb25bXSk6IEJ1dHRvbkdyb3VwSW50ZXJmYWNlIHtcblxuICAgICAgICBjb25zdCBleHBhbmRlZCA9IFtdO1xuICAgICAgICBjb25zdCBjb2xsYXBzZWQgPSBbXTtcblxuICAgICAgICBhY3Rpb25zLmZvckVhY2goKGFjdGlvbjogQWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSB0aGlzLmJ1aWxkQnV0dG9uKGFjdGlvbik7XG5cbiAgICAgICAgICAgIGlmIChhY3Rpb24ucGFyYW1zICYmIGFjdGlvbi5wYXJhbXMuZXhwYW5kZWQpIHtcbiAgICAgICAgICAgICAgICBleHBhbmRlZC5wdXNoKGJ1dHRvbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb2xsYXBzZWQucHVzaChidXR0b24pO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgYnJlYWtwb2ludCA9IHRoaXMuZ2V0QnJlYWtwb2ludCgpO1xuICAgICAgICBpZiAoZXhwYW5kZWQubGVuZ3RoIDwgYnJlYWtwb2ludCkge1xuICAgICAgICAgICAgYnJlYWtwb2ludCA9IGV4cGFuZGVkLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJ1dHRvbnMgPSBleHBhbmRlZC5jb25jYXQoY29sbGFwc2VkKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYnV0dG9uS2xhc3M6IFt0aGlzLmJ1dHRvbkNsYXNzXSxcbiAgICAgICAgICAgIGRyb3Bkb3duTGFiZWw6IHRoaXMubGFuZ3VhZ2VzLmdldEFwcFN0cmluZygnTEJMX0FDVElPTlMnKSB8fCAnJyxcbiAgICAgICAgICAgIGJyZWFrcG9pbnQsXG4gICAgICAgICAgICBkcm9wZG93bk9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6IFsnYm90dG9tLXJpZ2h0J10sXG4gICAgICAgICAgICAgICAgd3JhcHBlcktsYXNzOiBbKHRoaXMuYnV0dG9uR3JvdXBDbGFzcyldXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYnV0dG9uc1xuICAgICAgICB9IGFzIEJ1dHRvbkdyb3VwSW50ZXJmYWNlO1xuICAgIH1cblxuICAgIGdldEJyZWFrcG9pbnQoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgYnJlYWtwb2ludE1hcCA9IHRoaXMuc3lzdGVtQ29uZmlnU3RvcmUuZ2V0Q29uZmlnVmFsdWUodGhpcy5saW1pdENvbmZpZ0tleSk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2NyZWVuICYmIGJyZWFrcG9pbnRNYXAgJiYgYnJlYWtwb2ludE1hcFt0aGlzLnNjcmVlbl0pIHtcbiAgICAgICAgICAgIHRoaXMuYnJlYWtwb2ludCA9IGJyZWFrcG9pbnRNYXBbdGhpcy5zY3JlZW5dO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnJlYWtwb2ludDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmJyZWFrcG9pbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJyZWFrcG9pbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5kZWZhdWx0QnJlYWtwb2ludDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYnVpbGRCdXR0b24oYWN0aW9uOiBBY3Rpb24pOiBCdXR0b25JbnRlcmZhY2Uge1xuICAgICAgICBjb25zdCBidXR0b24gPSB7XG4gICAgICAgICAgICB0aXRsZUtleTogYWN0aW9uLmxhYmVsS2V5IHx8ICcnLFxuICAgICAgICAgICAga2xhc3M6IHRoaXMuYnV0dG9uQ2xhc3MsXG4gICAgICAgICAgICBpY29uOiBhY3Rpb24uaWNvbiB8fCAnJyxcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5ydW5BY3Rpb24oYWN0aW9uLCB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZTogKHRoaXMucmVjb3JkICYmIHRoaXMucmVjb3JkLm1vZHVsZSkgfHwgJycsXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZDogdGhpcy5yZWNvcmRcbiAgICAgICAgICAgICAgICB9IGFzIEFjdGlvbkNvbnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGFzIEJ1dHRvbkludGVyZmFjZTtcblxuICAgICAgICBpZiAoYWN0aW9uLmljb24pIHtcbiAgICAgICAgICAgIGJ1dHRvbi5pY29uID0gYWN0aW9uLmljb247XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWN0aW9uLnN0YXR1cykge1xuICAgICAgICAgICAgQnV0dG9uLmFwcGVuZENsYXNzZXMoYnV0dG9uLCBbYWN0aW9uLnN0YXR1c10pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICB9XG59XG4iXX0=