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
import { Component, HostBinding, Input } from '@angular/core';
import { viewFieldsMap } from './field.manifest';
import { FieldRegistry } from './field.registry';
export class FieldComponent {
    constructor(registry) {
        this.registry = registry;
        this.record = null;
        this.klass = null;
        this.class = 'field';
        this.map = viewFieldsMap;
    }
    ngOnInit() {
        this.setHostClass();
    }
    get componentMode() {
        let mode = this.mode;
        if (mode === 'create') {
            mode = 'edit';
        }
        if (mode === 'edit' && this.field.display && this.field.display === 'readonly') {
            mode = 'detail';
        }
        return mode;
    }
    get componentType() {
        let module = (this.record && this.record.module) || 'default';
        const displayType = (this.field.definition && this.field.definition.displayType) || '';
        return this.registry.getDisplayType(module, this.type, displayType, this.componentMode);
    }
    setHostClass() {
        const classes = [];
        classes.push('field');
        if (this.mode) {
            classes.push('field-mode-' + this.mode);
        }
        if (this.type) {
            classes.push('field-type-' + this.type);
        }
        if (this.field && this.field.name) {
            classes.push('field-name-' + this.field.name);
        }
        this.class = classes.join(' ');
    }
}
FieldComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-field',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container *ngIf=\"field && field.display !== 'none'\">\n    <scrm-dynamic-field *ngIf=\"type !== 'line-items'\"\n                        [componentType]=\"componentType\"\n                        [field]=\"field\"\n                        [klass]=\"klass\"\n                        [mode]=\"componentMode\"\n                        [record]=\"record\"\n                        [parent]=\"record\"\n                        [type]=\"type\">\n    </scrm-dynamic-field>\n    <scrm-line-items-field *ngIf=\"type === 'line-items'\"\n                           [field]=\"field\"\n                           [klass]=\"klass\"\n                           [mode]=\"componentMode\"\n                           [record]=\"record\"\n                           [parent]=\"record\">\n    </scrm-line-items-field>\n</ng-container>\n\n"
            },] }
];
FieldComponent.ctorParameters = () => [
    { type: FieldRegistry }
];
FieldComponent.propDecorators = {
    mode: [{ type: Input, args: ['mode',] }],
    type: [{ type: Input, args: ['type',] }],
    field: [{ type: Input, args: ['field',] }],
    record: [{ type: Input, args: ['record',] }],
    klass: [{ type: Input, args: ['klass',] }],
    class: [{ type: HostBinding, args: ['class',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2ZpZWxkcy9maWVsZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBUyxNQUFNLGVBQWUsQ0FBQztBQUNwRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFFL0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBTy9DLE1BQU0sT0FBTyxjQUFjO0lBVXZCLFlBQXNCLFFBQXVCO1FBQXZCLGFBQVEsR0FBUixRQUFRLENBQWU7UUFONUIsV0FBTSxHQUFXLElBQUksQ0FBQztRQUN2QixVQUFLLEdBQTJCLElBQUksQ0FBQztRQUMvQixVQUFLLEdBQUcsT0FBTyxDQUFDO1FBRXRDLFFBQUcsR0FBRyxhQUFhLENBQUM7SUFJcEIsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELElBQUksYUFBYTtRQUNiLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFckIsSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO1lBQ25CLElBQUksR0FBRyxNQUFNLENBQUM7U0FDakI7UUFFRCxJQUFJLElBQUksS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssVUFBVSxFQUFFO1lBQzVFLElBQUksR0FBRyxRQUFRLENBQUM7U0FDbkI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBSSxhQUFhO1FBQ2IsSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDO1FBRTlELE1BQU0sV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXZGLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM1RixDQUFDO0lBRU0sWUFBWTtRQUNmLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXRCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUMxQztRQUVELElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUMxQztRQUVELElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtZQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ2hEO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLENBQUM7OztZQTlESixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLFlBQVk7Z0JBQ3RCLG1xRUFBcUM7YUFFeEM7OztZQU5PLGFBQWE7OzttQkFRaEIsS0FBSyxTQUFDLE1BQU07bUJBQ1osS0FBSyxTQUFDLE1BQU07b0JBQ1osS0FBSyxTQUFDLE9BQU87cUJBQ2IsS0FBSyxTQUFDLFFBQVE7b0JBQ2QsS0FBSyxTQUFDLE9BQU87b0JBQ2IsV0FBVyxTQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBIb3N0QmluZGluZywgSW5wdXQsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge3ZpZXdGaWVsZHNNYXB9IGZyb20gJy4vZmllbGQubWFuaWZlc3QnO1xuaW1wb3J0IHtGaWVsZCwgUmVjb3JkfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtGaWVsZFJlZ2lzdHJ5fSBmcm9tICcuL2ZpZWxkLnJlZ2lzdHJ5JztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLWZpZWxkJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vZmllbGQuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogW11cbn0pXG5leHBvcnQgY2xhc3MgRmllbGRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIEBJbnB1dCgnbW9kZScpIG1vZGU6IHN0cmluZztcbiAgICBASW5wdXQoJ3R5cGUnKSB0eXBlOiBzdHJpbmc7XG4gICAgQElucHV0KCdmaWVsZCcpIGZpZWxkOiBGaWVsZDtcbiAgICBASW5wdXQoJ3JlY29yZCcpIHJlY29yZDogUmVjb3JkID0gbnVsbDtcbiAgICBASW5wdXQoJ2tsYXNzJykga2xhc3M6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSBudWxsO1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MnKSBjbGFzcyA9ICdmaWVsZCc7XG5cbiAgICBtYXAgPSB2aWV3RmllbGRzTWFwO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlZ2lzdHJ5OiBGaWVsZFJlZ2lzdHJ5KSB7XG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRIb3N0Q2xhc3MoKTtcbiAgICB9XG5cbiAgICBnZXQgY29tcG9uZW50TW9kZSgpOiBzdHJpbmcge1xuICAgICAgICBsZXQgbW9kZSA9IHRoaXMubW9kZTtcblxuICAgICAgICBpZiAobW9kZSA9PT0gJ2NyZWF0ZScpIHtcbiAgICAgICAgICAgIG1vZGUgPSAnZWRpdCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9kZSA9PT0gJ2VkaXQnICYmIHRoaXMuZmllbGQuZGlzcGxheSAmJiB0aGlzLmZpZWxkLmRpc3BsYXkgPT09ICdyZWFkb25seScpIHtcbiAgICAgICAgICAgIG1vZGUgPSAnZGV0YWlsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtb2RlO1xuICAgIH1cblxuICAgIGdldCBjb21wb25lbnRUeXBlKCk6IGFueSB7XG4gICAgICAgIGxldCBtb2R1bGUgPSAodGhpcy5yZWNvcmQgJiYgdGhpcy5yZWNvcmQubW9kdWxlKSB8fCAnZGVmYXVsdCc7XG5cbiAgICAgICAgY29uc3QgZGlzcGxheVR5cGUgPSAodGhpcy5maWVsZC5kZWZpbml0aW9uICYmIHRoaXMuZmllbGQuZGVmaW5pdGlvbi5kaXNwbGF5VHlwZSkgfHwgJyc7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVnaXN0cnkuZ2V0RGlzcGxheVR5cGUobW9kdWxlLCB0aGlzLnR5cGUsIGRpc3BsYXlUeXBlLCB0aGlzLmNvbXBvbmVudE1vZGUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRIb3N0Q2xhc3MoKSB7XG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSBbXTtcbiAgICAgICAgY2xhc3Nlcy5wdXNoKCdmaWVsZCcpO1xuXG4gICAgICAgIGlmICh0aGlzLm1vZGUpIHtcbiAgICAgICAgICAgIGNsYXNzZXMucHVzaCgnZmllbGQtbW9kZS0nICsgdGhpcy5tb2RlKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKCdmaWVsZC10eXBlLScgKyB0aGlzLnR5cGUpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5maWVsZCAmJiB0aGlzLmZpZWxkLm5hbWUpIHtcbiAgICAgICAgICAgIGNsYXNzZXMucHVzaCgnZmllbGQtbmFtZS0nICsgdGhpcy5maWVsZC5uYW1lKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jbGFzcyA9IGNsYXNzZXMuam9pbignICcpO1xuICAgIH1cbn1cbiJdfQ==