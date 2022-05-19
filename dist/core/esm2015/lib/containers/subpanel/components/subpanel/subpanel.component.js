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
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { SubpanelTableAdapter } from '../../adapters/table.adapter';
import { LanguageStore } from '../../../../store/language/language.store';
import { SubpanelStore } from '../../store/subpanel/subpanel.store';
import { SubpanelActionManager } from './action-manager.service';
import { SubpanelTableAdapterFactory } from '../../adapters/table.adapter.factory';
export class SubpanelComponent {
    constructor(actionManager, languages, tableAdapterFactory) {
        this.actionManager = actionManager;
        this.languages = languages;
        this.tableAdapterFactory = tableAdapterFactory;
    }
    ngOnInit() {
        this.adapter = this.tableAdapterFactory.create(this.store);
        this.tableConfig = this.adapter.getTable();
        if (this.maxColumns$) {
            this.tableConfig.maxColumns$ = this.maxColumns$;
        }
        this.config$ = of(this.getButtonGroupConfig(this.buildAction())).pipe(shareReplay(1));
        this.closeButton = {
            onClick: () => {
                this.store.show = false;
            }
        };
    }
    buildAction() {
        const actions = [];
        if (this.store.metadata) {
            if (this.store.metadata.top_buttons) {
                this.store.metadata.top_buttons.forEach(button => {
                    const label = this.languages.getFieldLabel(button.labelKey, button.module);
                    actions.push(Object.assign(Object.assign({}, button), { label, params: {
                            module: button.module
                        } }));
                });
            }
        }
        return actions;
    }
    getButtonGroupConfig(actions) {
        const buttons = [];
        actions.forEach((action) => {
            buttons.push(this.buildButton(action));
        });
        let breakpoint = 1;
        if (buttons && buttons.length > 1) {
            breakpoint = -1;
        }
        const dropdownLabel = this.languages.getAppString('LBL_ACTIONS');
        return {
            buttons,
            breakpoint,
            dropdownLabel,
            buttonKlass: ['btn', 'btn-sm', 'btn-outline-light']
        };
    }
    buildButton(action) {
        return {
            label: action.label || '',
            klass: 'btn btn-sm btn-outline-light',
            onClick: () => {
                this.actionManager.run(action.key, {
                    subpanelMeta: this.store.metadata,
                    module: action.params.module || this.store.metadata.module,
                    parentModule: this.store.parentModule,
                    parentId: this.store.parentId,
                    store: this.store,
                    action
                });
            }
        };
    }
}
SubpanelComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-subpanel',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container>\n    <scrm-panel [title]=\"store.getTitle()\" mode=\"closable\" [close]=\"closeButton\" bodyPadding=\"0\">\n        <span class=\"subpanel-icon pl-1\" panel-icon-area>\n            <scrm-image [image]=\"store.getIcon()\"></scrm-image>\n        </span>\n        <span panel-header-button>\n            <scrm-button-group *ngIf=\"config$\" [config$]=\"config$\"></scrm-button-group>\n        </span>\n        <div panel-body>\n            <scrm-table [config]=\"tableConfig\"></scrm-table>\n        </div>\n    </scrm-panel>\n</ng-container>\n",
                providers: [
                    SubpanelTableAdapter
                ]
            },] }
];
SubpanelComponent.ctorParameters = () => [
    { type: SubpanelActionManager },
    { type: LanguageStore },
    { type: SubpanelTableAdapterFactory }
];
SubpanelComponent.propDecorators = {
    store: [{ type: Input }],
    maxColumns$: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VicGFuZWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2NvbnRhaW5lcnMvc3VicGFuZWwvY29tcG9uZW50cy9zdWJwYW5lbC9zdWJwYW5lbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBRXZELE9BQU8sRUFBQyxVQUFVLEVBQUUsRUFBRSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzQyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUNsRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFDeEUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQy9ELE9BQU8sRUFBQywyQkFBMkIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBU2pGLE1BQU0sT0FBTyxpQkFBaUI7SUFTMUIsWUFDYyxhQUFvQyxFQUNwQyxTQUF3QixFQUN4QixtQkFBZ0Q7UUFGaEQsa0JBQWEsR0FBYixhQUFhLENBQXVCO1FBQ3BDLGNBQVMsR0FBVCxTQUFTLENBQWU7UUFDeEIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUE2QjtJQUU5RCxDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxD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LENBQUM7OztZQXJHSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLHk1REFBc0M7Z0JBQ3RDLFNBQVMsRUFBRTtvQkFDUCxvQkFBb0I7aUJBQ3ZCO2FBQ0o7OztZQVRPLHFCQUFxQjtZQUZyQixhQUFhO1lBR2IsMkJBQTJCOzs7b0JBVTlCLEtBQUs7MEJBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBY3Rpb24sIEFueUJ1dHRvbkludGVyZmFjZSwgQnV0dG9uR3JvdXBJbnRlcmZhY2UsIEJ1dHRvbkludGVyZmFjZX0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgb2Z9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzaGFyZVJlcGxheX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtUYWJsZUNvbmZpZ30gZnJvbSAnLi4vLi4vLi4vLi4vY29tcG9uZW50cy90YWJsZS90YWJsZS5tb2RlbCc7XG5pbXBvcnQge1N1YnBhbmVsVGFibGVBZGFwdGVyfSBmcm9tICcuLi8uLi9hZGFwdGVycy90YWJsZS5hZGFwdGVyJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtTdWJwYW5lbFN0b3JlfSBmcm9tICcuLi8uLi9zdG9yZS9zdWJwYW5lbC9zdWJwYW5lbC5zdG9yZSc7XG5pbXBvcnQge1N1YnBhbmVsQWN0aW9uTWFuYWdlcn0gZnJvbSAnLi9hY3Rpb24tbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7U3VicGFuZWxUYWJsZUFkYXB0ZXJGYWN0b3J5fSBmcm9tICcuLi8uLi9hZGFwdGVycy90YWJsZS5hZGFwdGVyLmZhY3RvcnknO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tc3VicGFuZWwnLFxuICAgIHRlbXBsYXRlVXJsOiAnc3VicGFuZWwuY29tcG9uZW50Lmh0bWwnLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICBTdWJwYW5lbFRhYmxlQWRhcHRlclxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgU3VicGFuZWxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIEBJbnB1dCgpIHN0b3JlOiBTdWJwYW5lbFN0b3JlO1xuICAgIEBJbnB1dCgpIG1heENvbHVtbnMkOiBPYnNlcnZhYmxlPG51bWJlcj47XG5cbiAgICBjbG9zZUJ1dHRvbjogQnV0dG9uSW50ZXJmYWNlO1xuICAgIGFkYXB0ZXI6IFN1YnBhbmVsVGFibGVBZGFwdGVyO1xuICAgIGNvbmZpZyQ6IE9ic2VydmFibGU8QnV0dG9uR3JvdXBJbnRlcmZhY2U+O1xuICAgIHRhYmxlQ29uZmlnOiBUYWJsZUNvbmZpZztcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgYWN0aW9uTWFuYWdlcjogU3VicGFuZWxBY3Rpb25NYW5hZ2VyLFxuICAgICAgICBwcm90ZWN0ZWQgbGFuZ3VhZ2VzOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgdGFibGVBZGFwdGVyRmFjdG9yeTogU3VicGFuZWxUYWJsZUFkYXB0ZXJGYWN0b3J5XG4gICAgKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWRhcHRlciA9IHRoaXMudGFibGVBZGFwdGVyRmFjdG9yeS5jcmVhdGUodGhpcy5zdG9yZSk7XG4gICAgICAgIHRoaXMudGFibGVDb25maWcgPSB0aGlzLmFkYXB0ZXIuZ2V0VGFibGUoKTtcbiAgICAgICAgaWYgKHRoaXMubWF4Q29sdW1ucyQpIHtcbiAgICAgICAgICAgIHRoaXMudGFibGVDb25maWcubWF4Q29sdW1ucyQgPSB0aGlzLm1heENvbHVtbnMkO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWckID0gb2YodGhpcy5nZXRCdXR0b25Hcm91cENvbmZpZyh0aGlzLmJ1aWxkQWN0aW9uKCkpKS5waXBlKHNoYXJlUmVwbGF5KDEpKTtcblxuICAgICAgICB0aGlzLmNsb3NlQnV0dG9uID0ge1xuICAgICAgICAgICAgb25DbGljazogKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmUuc2hvdyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGFzIEJ1dHRvbkludGVyZmFjZTtcbiAgICB9XG5cbiAgICBidWlsZEFjdGlvbigpOiBhbnkge1xuICAgICAgICBjb25zdCBhY3Rpb25zID0gW107XG5cbiAgICAgICAgaWYgKHRoaXMuc3RvcmUubWV0YWRhdGEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0b3JlLm1ldGFkYXRhLnRvcF9idXR0b25zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5tZXRhZGF0YS50b3BfYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcy5sYW5ndWFnZXMuZ2V0RmllbGRMYWJlbChcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5sYWJlbEtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5tb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uYnV0dG9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGU6IGJ1dHRvbi5tb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWN0aW9ucztcbiAgICB9XG5cbiAgICBnZXRCdXR0b25Hcm91cENvbmZpZyhhY3Rpb25zOiBBY3Rpb25bXSk6IEJ1dHRvbkdyb3VwSW50ZXJmYWNlIHtcbiAgICAgICAgY29uc3QgYnV0dG9ucyA9IFtdO1xuXG4gICAgICAgIGFjdGlvbnMuZm9yRWFjaCgoYWN0aW9uOiBBY3Rpb24pID0+IHtcbiAgICAgICAgICAgIGJ1dHRvbnMucHVzaCh0aGlzLmJ1aWxkQnV0dG9uKGFjdGlvbikpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgYnJlYWtwb2ludCA9IDE7XG4gICAgICAgIGlmIChidXR0b25zICYmIGJ1dHRvbnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgYnJlYWtwb2ludCA9IC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZHJvcGRvd25MYWJlbCA9IHRoaXMubGFuZ3VhZ2VzLmdldEFwcFN0cmluZygnTEJMX0FDVElPTlMnKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYnV0dG9ucyxcbiAgICAgICAgICAgIGJyZWFrcG9pbnQsXG4gICAgICAgICAgICBkcm9wZG93bkxhYmVsLFxuICAgICAgICAgICAgYnV0dG9uS2xhc3M6IFsnYnRuJywgJ2J0bi1zbScsICdidG4tb3V0bGluZS1saWdodCddXG4gICAgICAgIH0gYXMgQnV0dG9uR3JvdXBJbnRlcmZhY2U7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGJ1aWxkQnV0dG9uKGFjdGlvbjogQWN0aW9uKTogQW55QnV0dG9uSW50ZXJmYWNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxhYmVsOiBhY3Rpb24ubGFiZWwgfHwgJycsXG4gICAgICAgICAgICBrbGFzczogJ2J0biBidG4tc20gYnRuLW91dGxpbmUtbGlnaHQnLFxuICAgICAgICAgICAgb25DbGljazogKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uTWFuYWdlci5ydW4oYWN0aW9uLmtleSwge1xuICAgICAgICAgICAgICAgICAgICBzdWJwYW5lbE1ldGE6IHRoaXMuc3RvcmUubWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZTogYWN0aW9uLnBhcmFtcy5tb2R1bGUgfHwgdGhpcy5zdG9yZS5tZXRhZGF0YS5tb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE1vZHVsZTogdGhpcy5zdG9yZS5wYXJlbnRNb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudElkOiB0aGlzLnN0b3JlLnBhcmVudElkLFxuICAgICAgICAgICAgICAgICAgICBzdG9yZTogdGhpcy5zdG9yZSxcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gYXMgQW55QnV0dG9uSW50ZXJmYWNlO1xuICAgIH1cbn1cbiJdfQ==