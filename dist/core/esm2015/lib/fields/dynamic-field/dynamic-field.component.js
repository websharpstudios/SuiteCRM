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
import { Component, HostBinding, Input, Type } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleNameMapper } from '../../services/navigation/module-name-mapper/module-name-mapper.service';
import { ModuleNavigation } from '../../services/navigation/module-navigation/module-navigation.service';
export class DynamicFieldComponent {
    constructor(navigation, moduleNameMapper, router) {
        this.navigation = navigation;
        this.moduleNameMapper = moduleNameMapper;
        this.router = router;
        this.record = null;
        this.parent = null;
        this.klass = null;
        this.class = 'dynamic-field';
    }
    get getRelateLink() {
        if (this.field.definition.id_name && this.field.definition.module) {
            const moduleName = this.moduleNameMapper.toFrontend(this.field.definition.module);
            return this.navigation.getRecordRouterLink(moduleName, this.record.attributes[this.field.definition.id_name]);
        }
        return '';
    }
    ngOnInit() {
        this.setHostClass();
    }
    isLink() {
        if (this.mode !== 'detail' && this.mode !== 'list') {
            return false;
        }
        if (!this.field || !this.record) {
            return false;
        }
        if (this.type === 'relate' && this.field.metadata && this.field.metadata.link !== false) {
            return true;
        }
        return !!(this.field.metadata && this.field.metadata.link);
    }
    hasOnClick() {
        return !!(this.field && this.field.metadata && this.field.metadata.onClick);
    }
    isEdit() {
        return this.mode === 'edit' || this.mode === 'filter';
    }
    getLink() {
        if (this.type === 'relate') {
            return this.getRelateLink;
        }
        return this.navigation.getRecordRouterLink(this.record.module, this.record.id);
    }
    getMessageContext(item, record) {
        const context = item && item.message && item.message.context || {};
        context.module = (record && record.module) || '';
        return context;
    }
    getMessageLabelKey(item) {
        return (item && item.message && item.message.labelKey) || '';
    }
    onClick() {
        if (this.field.metadata.onClick) {
            this.field.metadata.onClick(this.field, this.record);
            return;
        }
        this.router.navigateByUrl(this.getLink()).then();
        return false;
    }
    setHostClass() {
        const classes = [];
        classes.push('dynamic-field');
        if (this.mode) {
            classes.push('dynamic-field-mode-' + this.mode);
        }
        if (this.type) {
            classes.push('dynamic-field-type-' + this.type);
        }
        if (this.field && this.field.name) {
            classes.push('dynamic-field-name-' + this.field.name);
        }
        this.class = classes.join(' ');
    }
}
DynamicFieldComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-dynamic-field',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container *ngIf=\"hasOnClick()\">\n    <a (click)=\"onClick()\" class=\"clickable field-link\">\n        <ndc-dynamic\n            [ndcDynamicComponent]=\"componentType\"\n            [ndcDynamicInputs]=\"{\n                'mode': mode,\n                'field': field,\n                'klass': klass,\n                'record': record,\n                'parent': parent\n            }\"\n        ></ndc-dynamic>\n    </a>\n</ng-container>\n<ng-container *ngIf=\"isLink() && !hasOnClick()\">\n    <a [routerLink]=\"getLink()\" class=\"field-link\">\n        <ndc-dynamic\n            [ndcDynamicComponent]=\"componentType\"\n            [ndcDynamicInputs]=\"{\n                'mode': mode,\n                'field': field,\n                'klass': klass,\n                'record': record,\n                'parent': parent\n            }\"\n        ></ndc-dynamic>\n    </a>\n</ng-container>\n<ng-container *ngIf=\"!isLink() && !hasOnClick()\">\n    <ndc-dynamic\n        [ndcDynamicComponent]=\"componentType\"\n        [ndcDynamicInputs]=\"{\n            'mode': mode,\n            'field': field,\n            'klass': klass,\n            'record': record,\n            'parent': parent\n        }\"\n    ></ndc-dynamic>\n</ng-container>\n<ng-container *ngIf=\"isEdit() && field.formControl && field.formControl.errors\">\n    <ng-container *ngIf=\"field.formControl.invalid && field.formControl.touched\">\n        <div *ngFor=\"let item of field.formControl.errors | keyvalue\" class=\"invalid-feedback d-block\">\n            <scrm-dynamic-label [context]=\"getMessageContext(item.value, record)\"\n                                [fields]=\"{field: field}\"\n                                [labelKey]=\"getMessageLabelKey(item.value)\">\n            </scrm-dynamic-label>\n        </div>\n    </ng-container>\n</ng-container>\n"
            },] }
];
DynamicFieldComponent.ctorParameters = () => [
    { type: ModuleNavigation },
    { type: ModuleNameMapper },
    { type: Router }
];
DynamicFieldComponent.propDecorators = {
    mode: [{ type: Input, args: ['mode',] }],
    type: [{ type: Input, args: ['type',] }],
    field: [{ type: Input, args: ['field',] }],
    record: [{ type: Input, args: ['record',] }],
    parent: [{ type: Input, args: ['parent',] }],
    klass: [{ type: Input, args: ['klass',] }],
    componentType: [{ type: Input, args: ['componentType',] }],
    class: [{ type: HostBinding, args: ['class',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1maWVsZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvZmllbGRzL2R5bmFtaWMtZmllbGQvZHluYW1pYy1maWVsZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBVSxJQUFJLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFMUUsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHlFQUF5RSxDQUFDO0FBQ3pHLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHVFQUF1RSxDQUFDO0FBT3ZHLE1BQU0sT0FBTyxxQkFBcUI7SUFZOUIsWUFDYyxVQUE0QixFQUM1QixnQkFBa0MsRUFDbEMsTUFBYztRQUZkLGVBQVUsR0FBVixVQUFVLENBQWtCO1FBQzVCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQVZYLFdBQU0sR0FBVyxJQUFJLENBQUM7UUFDdEIsV0FBTSxHQUFXLElBQUksQ0FBQztRQUN2QixVQUFLLEdBQTJCLElBQUksQ0FBQztRQUcvQixVQUFLLEdBQUcsZUFBZSxDQUFDO0lBTzlDLENBQUM7SUFFRCxJQUFJLGFBQWE7UUFDYixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDL0QsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVsRixP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QyxlQUFlLENBQUMsQ0FBQztRQUU5QixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUNsRDtRQUVELElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ2xEO1FBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUN4RDtRQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQyxDQUFDOzs7WUEvR0osU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLGlxR0FBNkM7YUFFaEQ7OztZQU5PLGdCQUFnQjtZQURoQixnQkFBZ0I7WUFEaEIsTUFBTTs7O21CQVdULEtBQUssU0FBQyxNQUFNO21CQUNaLEtBQUssU0FBQyxNQUFNO29CQUNaLEtBQUssU0FBQyxPQUFPO3FCQUNiLEtBQUssU0FBQyxRQUFRO3FCQUNkLEtBQUssU0FBQyxRQUFRO29CQUNkLEtBQUssU0FBQyxPQUFPOzRCQUNiLEtBQUssU0FBQyxlQUFlO29CQUVyQixXQUFXLFNBQUMsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIEhvc3RCaW5kaW5nLCBJbnB1dCwgT25Jbml0LCBUeXBlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RmllbGQsIFJlY29yZCwgU3RyaW5nTWFwfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge01vZHVsZU5hbWVNYXBwZXJ9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24vbW9kdWxlLW5hbWUtbWFwcGVyL21vZHVsZS1uYW1lLW1hcHBlci5zZXJ2aWNlJztcbmltcG9ydCB7TW9kdWxlTmF2aWdhdGlvbn0gZnJvbSAnLi4vLi4vc2VydmljZXMvbmF2aWdhdGlvbi9tb2R1bGUtbmF2aWdhdGlvbi9tb2R1bGUtbmF2aWdhdGlvbi5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLWR5bmFtaWMtZmllbGQnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9keW5hbWljLWZpZWxkLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIER5bmFtaWNGaWVsZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBASW5wdXQoJ21vZGUnKSBtb2RlOiBzdHJpbmc7XG4gICAgQElucHV0KCd0eXBlJykgdHlwZTogc3RyaW5nO1xuICAgIEBJbnB1dCgnZmllbGQnKSBmaWVsZDogRmllbGQ7XG4gICAgQElucHV0KCdyZWNvcmQnKSByZWNvcmQ6IFJlY29yZCA9IG51bGw7XG4gICAgQElucHV0KCdwYXJlbnQnKSBwYXJlbnQ6IFJlY29yZCA9IG51bGw7XG4gICAgQElucHV0KCdrbGFzcycpIGtsYXNzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0gbnVsbDtcbiAgICBASW5wdXQoJ2NvbXBvbmVudFR5cGUnKSBjb21wb25lbnRUeXBlOiBUeXBlPGFueT47XG5cbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzJykgY2xhc3MgPSAnZHluYW1pYy1maWVsZCc7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIG5hdmlnYXRpb246IE1vZHVsZU5hdmlnYXRpb24sXG4gICAgICAgIHByb3RlY3RlZCBtb2R1bGVOYW1lTWFwcGVyOiBNb2R1bGVOYW1lTWFwcGVyLFxuICAgICAgICBwcm90ZWN0ZWQgcm91dGVyOiBSb3V0ZXJcbiAgICApIHtcbiAgICB9XG5cbiAgICBnZXQgZ2V0UmVsYXRlTGluaygpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5maWVsZC5kZWZpbml0aW9uLmlkX25hbWUgJiYgdGhpcy5maWVsZC5kZWZpbml0aW9uLm1vZHVsZSkge1xuICAgICAgICAgICAgY29uc3QgbW9kdWxlTmFtZSA9IHRoaXMubW9kdWxlTmFtZU1hcHBlci50b0Zyb250ZW5kKHRoaXMuZmllbGQuZGVmaW5pdGlvbi5tb2R1bGUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uYXZpZ2F0aW9uLmdldFJlY29yZFJvdXRlckxpbmsoXG4gICAgICAgICAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgICAgICAgICB0aGlzLnJlY29yZC5hdHRyaWJ1dGVzW3RoaXMuZmllbGQuZGVmaW5pdGlvbi5pZF9uYW1lXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRIb3N0Q2xhc3MoKTtcbiAgICB9XG5cbiAgICBpc0xpbmsoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLm1vZGUgIT09ICdkZXRhaWwnICYmIHRoaXMubW9kZSAhPT0gJ2xpc3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuZmllbGQgfHwgIXRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50eXBlID09PSAncmVsYXRlJyAmJiB0aGlzLmZpZWxkLm1ldGFkYXRhICYmIHRoaXMuZmllbGQubWV0YWRhdGEubGluayAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhKHRoaXMuZmllbGQubWV0YWRhdGEgJiYgdGhpcy5maWVsZC5tZXRhZGF0YS5saW5rKTtcbiAgICB9XG5cbiAgICBoYXNPbkNsaWNrKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISEodGhpcy5maWVsZCAmJiB0aGlzLmZpZWxkLm1ldGFkYXRhICYmIHRoaXMuZmllbGQubWV0YWRhdGEub25DbGljayk7XG4gICAgfVxuXG4gICAgaXNFZGl0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlID09PSAnZWRpdCcgfHwgdGhpcy5tb2RlID09PSAnZmlsdGVyJztcbiAgICB9XG5cbiAgICBnZXRMaW5rKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdyZWxhdGUnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRSZWxhdGVMaW5rO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubmF2aWdhdGlvbi5nZXRSZWNvcmRSb3V0ZXJMaW5rKHRoaXMucmVjb3JkLm1vZHVsZSwgdGhpcy5yZWNvcmQuaWQpO1xuICAgIH1cblxuICAgIGdldE1lc3NhZ2VDb250ZXh0KGl0ZW06IGFueSwgcmVjb3JkOiBSZWNvcmQpOiBTdHJpbmdNYXAge1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gaXRlbSAmJiBpdGVtLm1lc3NhZ2UgJiYgaXRlbS5tZXNzYWdlLmNvbnRleHQgfHwge307XG4gICAgICAgIGNvbnRleHQubW9kdWxlID0gKHJlY29yZCAmJiByZWNvcmQubW9kdWxlKSB8fCAnJztcblxuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG5cbiAgICBnZXRNZXNzYWdlTGFiZWxLZXkoaXRlbTogYW55KTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChpdGVtICYmIGl0ZW0ubWVzc2FnZSAmJiBpdGVtLm1lc3NhZ2UubGFiZWxLZXkpIHx8ICcnO1xuICAgIH1cblxuICAgIG9uQ2xpY2soKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmZpZWxkLm1ldGFkYXRhLm9uQ2xpY2spIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGQubWV0YWRhdGEub25DbGljayh0aGlzLmZpZWxkLCB0aGlzLnJlY29yZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKHRoaXMuZ2V0TGluaygpKS50aGVuKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0SG9zdENsYXNzKCkge1xuICAgICAgICBjb25zdCBjbGFzc2VzID0gW107XG4gICAgICAgIGNsYXNzZXMucHVzaCgnZHluYW1pYy1maWVsZCcpO1xuXG4gICAgICAgIGlmICh0aGlzLm1vZGUpIHtcbiAgICAgICAgICAgIGNsYXNzZXMucHVzaCgnZHluYW1pYy1maWVsZC1tb2RlLScgKyB0aGlzLm1vZGUpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50eXBlKSB7XG4gICAgICAgICAgICBjbGFzc2VzLnB1c2goJ2R5bmFtaWMtZmllbGQtdHlwZS0nICsgdGhpcy50eXBlKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZmllbGQgJiYgdGhpcy5maWVsZC5uYW1lKSB7XG4gICAgICAgICAgICBjbGFzc2VzLnB1c2goJ2R5bmFtaWMtZmllbGQtbmFtZS0nICsgdGhpcy5maWVsZC5uYW1lKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jbGFzcyA9IGNsYXNzZXMuam9pbignICcpO1xuICAgIH1cblxufVxuIl19