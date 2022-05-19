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
import { isTrue } from 'common';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
export class RecordFlexboxComponent {
    constructor() {
        this.mode = 'detail';
        this.maxColumns = 4;
        this.sizeMap = {
            handset: 1,
            tablet: 2,
            web: 3,
            wide: 4
        };
    }
    ngOnInit() {
        if (!this.config) {
            return;
        }
        const config = this.config;
        this.vm$ = combineLatest([
            config.record$,
            config.mode$,
            config.layout$,
        ]).pipe(map(([record, mode, layout]) => {
            this.mode = mode;
            return { record, mode, layout };
        }));
    }
    getRowClass() {
        return this.config.rowClass;
    }
    getColClass() {
        return this.config.colClass;
    }
    getSizeClass(size) {
        const sizeMap = {
            regular: 'text-regular',
            medium: 'text-medium',
            large: 'text-large',
            'x-large': 'text-x-large',
            'xx-large': 'text-xx-large',
            huge: 'text-huge'
        };
        return sizeMap[size] || 'text-regular';
    }
    getFontWeight(bold) {
        let fontWeight = 'font-weight-normal';
        if (bold && isTrue(bold)) {
            fontWeight = 'font-weight-bolder';
        }
        return fontWeight;
    }
    getColor(color) {
        const sizeMap = {
            yellow: 'text-yellow',
            blue: 'text-blue',
            green: 'text-green',
            red: 'text-red',
            purple: 'text-purple',
            dark: 'text-dark',
            grey: 'text-grey'
        };
        return sizeMap[color] || '';
    }
    getJustify(justify) {
        const justifyMap = {
            start: 'justify-content-start',
            end: 'justify-content-end',
            center: 'justify-content-center',
            between: 'justify-content-between',
            around: 'justify-content-around'
        };
        return justifyMap[justify] || '';
    }
    getAlign(align) {
        const alignMap = {
            start: 'align-items-start',
            end: 'align-items-end',
            center: 'align-items-center',
            baseline: 'align-items-baseline',
            stretch: 'align-items-stretch'
        };
        return alignMap[align] || '';
    }
    getLayoutRowClass(row) {
        return (row && row.class) || '';
    }
    getClass(layoutCol) {
        if (!layoutCol) {
            return '';
        }
        const klasses = [];
        klasses.push(layoutCol.class || '');
        layoutCol.size && klasses.push(this.getSizeClass(layoutCol.size) || '');
        layoutCol.bold && klasses.push(this.getFontWeight(layoutCol.bold) || '');
        layoutCol.color && klasses.push(this.getColor(layoutCol.color) || '');
        return klasses.join(' ');
    }
    getLabelDisplay(col) {
        return col.labelDisplay || (this.config && this.config.labelDisplay) || 'inline';
    }
    getField(record, field) {
        if (!field || !field.name || !record || !record.fields) {
            return null;
        }
        return record.fields[field.name] || null;
    }
    getFieldClass(col) {
        let klasses = this.config.inputClass || {};
        if (col.inputClass) {
            klasses[col.inputClass] = true;
        }
        return klasses;
    }
    getLabelClass(col) {
        let klasses = this.config.labelClass || {};
        if (col.labelClass) {
            klasses[col.labelClass] = true;
        }
        return klasses;
    }
    shouldDisplay(col, field) {
        if (!col.hideIfEmpty) {
            return true;
        }
        let hasValue = false;
        hasValue = hasValue || !!field.value;
        hasValue = hasValue || !!(field.valueList && field.valueList.length);
        hasValue = hasValue || !!(field.valueObject && Object.keys(field.valueObject).length);
        return hasValue;
    }
    getDisplay(col) {
        return col.display || '';
    }
}
RecordFlexboxComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-record-flexbox',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n\n<div *ngIf=\"(vm$| async) as vm\" class=\"d-flex flex-column {{(config && config.klass) || ''}}\">\n\n    <ng-container *ngFor=\"let item of vm.layout.rows\">\n\n        <div [ngClass]=\"getRowClass()\"\n             class=\"d-flex record-flexbox-row {{getJustify(item.justify)}} {{getAlign(item.align)}} {{getLayoutRowClass(item)}}\">\n\n            <div *ngFor=\"let col of item.cols\"\n                 [ngClass]=\"getColClass()\"\n                 class=\"record-flexbox-col {{getClass(col)}}\">\n\n                <ng-container *ngIf=\"col.display !== 'hidden'\">\n\n                    <div [class.align-items-center]=\"getLabelDisplay(col) === 'inline'\"\n                         [class.flex-column]=\"getLabelDisplay(col) === 'top'\"\n                         [class.flex-row]=\"getLabelDisplay(col) === 'inline'\"\n                         [class.justify-content-end]=\"!col.field\"\n                         class=\"d-flex\"\n                    >\n                        <ng-container *ngIf=\"getField(vm.record, col.field) as field\">\n\n                            <ng-container *ngIf=\"shouldDisplay(col, field)\">\n                                <ng-container *ngIf=\"getLabelDisplay(col) !== 'none'\">\n\n                                    <div [class.pr-3]=\"getLabelDisplay(col) === 'inline' && getDisplay(col) !== 'none'\">\n\n                                        <label *ngIf=\"field.label\" [ngClass]=\"getLabelClass(col)\">\n                                            {{field.label}}\n                                        </label>\n\n                                        <scrm-label *ngIf=\"!field.label && field.labelKey\"\n                                                    [labelKey]=\"field.labelKey\"\n                                                    [ngClass]=\"getLabelClass(col)\">\n                                        </scrm-label>\n                                    </div>\n\n                                </ng-container>\n\n                                <ng-container *ngIf=\"getDisplay(col) !== 'none'\">\n\n                                    <div [class.flex-grow-1]=\"getLabelDisplay(col) === 'inline'\">\n\n                                        <scrm-field [field]=\"field\"\n                                                    [klass]=\"getFieldClass(col)\"\n                                                    [mode]=\"vm.mode\"\n                                                    [type]=\"field.type\">\n                                        </scrm-field>\n\n                                    </div>\n\n                                </ng-container>\n\n\n                            </ng-container>\n\n                        </ng-container>\n\n\n                        <ng-container *ngIf=\"col.actionSlot && this.config.actions\">\n                            <scrm-action-group-menu [buttonClass]=\"config.buttonClass\"\n                                                    [config]=\"config.actions\">\n                            </scrm-action-group-menu>\n                        </ng-container>\n\n                    </div>\n                </ng-container>\n\n            </div>\n\n        </div>\n    </ng-container>\n</div>\n"
            },] }
];
RecordFlexboxComponent.ctorParameters = () => [];
RecordFlexboxComponent.propDecorators = {
    config: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLWZsZXhib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2NvbXBvbmVudHMvcmVjb3JkLWZsZXhib3gvcmVjb3JkLWZsZXhib3guY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMvQyxPQUFPLEVBSUgsTUFBTSxFQVFULE1BQU0sUUFBUSxDQUFDO0FBQ2hCLE9BQU8sRUFBQyxhQUFhLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBU25DLE1BQU0sT0FBTyxzQkFBc0I7SUFlL0I7UUFYQSxTQUFJLEdBQWEsUUFBUSxDQUFDO1FBQzFCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsWUFBTyxHQUFrQjtZQUNyQixPQUFPLEVBQUUsQ0FBQztZQUNWLE1BQU0sRUFBRSxDQUFDO1lBQ1QsR0FBRyxFQUFFLENBQUM7WUFDTixJQUFJLEVBQUUsQ0FBQztTQUNWLENBQUM7SUFLRixDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2QsT0FBTztTQUNWO1FBQ0QsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUUzQixJQUFJLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FDcEI7WUFDSSxNQUFNLENBQUMsT0FBTztZQUNkLE1BQU0sQ0FBQyxLQUFLO1lBQ1osTUFBTSxDQUFDLE9BQU87U0FDakIsQ0FDSixDQUFDLElBQUksQ0FDRixHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRTtZQUMzQixJQUFJLENB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QU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFRCxhQUFhLENBQUMsR0FBb0IsRUFBRSxLQUFZO1FBQzVDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFO1lBQ2xCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFFRCxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDckIsUUFBUSxHQUFHLFFBQVEsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUNyQyxRQUFRLEdBQUcsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyRSxRQUFRLEdBQUcsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEYsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFvQjtRQUMzQixPQUFPLEdBQUcsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0lBQzdCLENBQUM7OztZQW5MSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsMi9JQUE4QzthQUVqRDs7OztxQkFHSSxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgICBDb250ZW50QWxpZ24sXG4gICAgQ29udGVudEp1c3RpZnksXG4gICAgRmllbGQsXG4gICAgaXNUcnVlLFxuICAgIFJlY29yZCxcbiAgICBTY3JlZW5TaXplTWFwLFxuICAgIFN0YXRpc3RpY1dpZGdldExheW91dFJvdyxcbiAgICBUZXh0Q29sb3IsXG4gICAgVGV4dFNpemVzLFxuICAgIFZpZXdGaWVsZERlZmluaXRpb24sXG4gICAgVmlld01vZGVcbn0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7Y29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtGaWVsZEZsZXhib3hDb2wsIFJlY29yZEZsZXhib3hDb25maWcsIFJlY29yZEZsZXhib3hWaWV3TW9kZWx9IGZyb20gJy4vcmVjb3JkLWZsZXhib3gubW9kZWwnO1xuaW1wb3J0IHtMYWJlbERpc3BsYXl9IGZyb20gJy4uL2ZpZWxkLWdyaWQvZmllbGQtZ3JpZC5tb2RlbCc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1yZWNvcmQtZmxleGJveCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3JlY29yZC1mbGV4Ym94LmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFJlY29yZEZsZXhib3hDb21wb25lbnQge1xuXG4gICAgQElucHV0KCkgY29uZmlnOiBSZWNvcmRGbGV4Ym94Q29uZmlnO1xuXG4gICAgbW9kZTogVmlld01vZGUgPSAnZGV0YWlsJztcbiAgICBtYXhDb2x1bW5zOiBudW1iZXIgPSA0O1xuICAgIHNpemVNYXA6IFNjcmVlblNpemVNYXAgPSB7XG4gICAgICAgIGhhbmRzZXQ6IDEsXG4gICAgICAgIHRhYmxldDogMixcbiAgICAgICAgd2ViOiAzLFxuICAgICAgICB3aWRlOiA0XG4gICAgfTtcblxuICAgIHZtJDogT2JzZXJ2YWJsZTxSZWNvcmRGbGV4Ym94Vmlld01vZGVsPjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5jb25maWc7XG5cbiAgICAgICAgdGhpcy52bSQgPSBjb21iaW5lTGF0ZXN0KFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIGNvbmZpZy5yZWNvcmQkLFxuICAgICAgICAgICAgICAgIGNvbmZpZy5tb2RlJCxcbiAgICAgICAgICAgICAgICBjb25maWcubGF5b3V0JCxcbiAgICAgICAgICAgIF1cbiAgICAgICAgKS5waXBlKFxuICAgICAgICAgICAgbWFwKChbcmVjb3JkLCBtb2RlLCBsYXlvdXRdKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlID0gbW9kZTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge3JlY29yZCwgbW9kZSwgbGF5b3V0fTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG5cbiAgICBwdWJsaWMgZ2V0Um93Q2xhc3MoKTogeyBba2xhc3M6IHN0cmluZ106IGFueSB9IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnJvd0NsYXNzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDb2xDbGFzcygpOiB7IFtrbGFzczogc3RyaW5nXTogYW55IH0ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuY29sQ2xhc3M7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFNpemVDbGFzcyhzaXplOiBUZXh0U2l6ZXMpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBzaXplTWFwID0ge1xuICAgICAgICAgICAgcmVndWxhcjogJ3RleHQtcmVndWxhcicsXG4gICAgICAgICAgICBtZWRpdW06ICd0ZXh0LW1lZGl1bScsXG4gICAgICAgICAgICBsYXJnZTogJ3RleHQtbGFyZ2UnLFxuICAgICAgICAgICAgJ3gtbGFyZ2UnOiAndGV4dC14LWxhcmdlJyxcbiAgICAgICAgICAgICd4eC1sYXJnZSc6ICd0ZXh0LXh4LWxhcmdlJyxcbiAgICAgICAgICAgIGh1Z2U6ICd0ZXh0LWh1Z2UnXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNpemVNYXBbc2l6ZV0gfHwgJ3RleHQtcmVndWxhcic7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEZvbnRXZWlnaHQoYm9sZDogc3RyaW5nIHwgYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICAgIGxldCBmb250V2VpZ2h0ID0gJ2ZvbnQtd2VpZ2h0LW5vcm1hbCc7XG5cbiAgICAgICAgaWYgKGJvbGQgJiYgaXNUcnVlKGJvbGQpKSB7XG4gICAgICAgICAgICBmb250V2VpZ2h0ID0gJ2ZvbnQtd2VpZ2h0LWJvbGRlcic7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9udFdlaWdodDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q29sb3IoY29sb3I6IFRleHRDb2xvcik6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHNpemVNYXAgPSB7XG4gICAgICAgICAgICB5ZWxsb3c6ICd0ZXh0LXllbGxvdycsXG4gICAgICAgICAgICBibHVlOiAndGV4dC1ibHVlJyxcbiAgICAgICAgICAgIGdyZWVuOiAndGV4dC1ncmVlbicsXG4gICAgICAgICAgICByZWQ6ICd0ZXh0LXJlZCcsXG4gICAgICAgICAgICBwdXJwbGU6ICd0ZXh0LXB1cnBsZScsXG4gICAgICAgICAgICBkYXJrOiAndGV4dC1kYXJrJyxcbiAgICAgICAgICAgIGdyZXk6ICd0ZXh0LWdyZXknXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNpemVNYXBbY29sb3JdIHx8ICcnO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRKdXN0aWZ5KGp1c3RpZnk6IENvbnRlbnRKdXN0aWZ5KTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QganVzdGlmeU1hcCA9IHtcbiAgICAgICAgICAgIHN0YXJ0OiAnanVzdGlmeS1jb250ZW50LXN0YXJ0JyxcbiAgICAgICAgICAgIGVuZDogJ2p1c3RpZnktY29udGVudC1lbmQnLFxuICAgICAgICAgICAgY2VudGVyOiAnanVzdGlmeS1jb250ZW50LWNlbnRlcicsXG4gICAgICAgICAgICBiZXR3ZWVuOiAnanVzdGlmeS1jb250ZW50LWJldHdlZW4nLFxuICAgICAgICAgICAgYXJvdW5kOiAnanVzdGlmeS1jb250ZW50LWFyb3VuZCdcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ganVzdGlmeU1hcFtqdXN0aWZ5XSB8fCAnJztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0QWxpZ24oYWxpZ246IENvbnRlbnRBbGlnbik6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGFsaWduTWFwID0ge1xuICAgICAgICAgICAgc3RhcnQ6ICdhbGlnbi1pdGVtcy1zdGFydCcsXG4gICAgICAgICAgICBlbmQ6ICdhbGlnbi1pdGVtcy1lbmQnLFxuICAgICAgICAgICAgY2VudGVyOiAnYWxpZ24taXRlbXMtY2VudGVyJyxcbiAgICAgICAgICAgIGJhc2VsaW5lOiAnYWxpZ24taXRlbXMtYmFzZWxpbmUnLFxuICAgICAgICAgICAgc3RyZXRjaDogJ2FsaWduLWl0ZW1zLXN0cmV0Y2gnXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGFsaWduTWFwW2FsaWduXSB8fCAnJztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0TGF5b3V0Um93Q2xhc3Mocm93OiBTdGF0aXN0aWNXaWRnZXRMYXlvdXRSb3cpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gKHJvdyAmJiByb3cuY2xhc3MpIHx8ICcnO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDbGFzcyhsYXlvdXRDb2w6IEZpZWxkRmxleGJveENvbCk6IHN0cmluZyB7XG5cbiAgICAgICAgaWYgKCFsYXlvdXRDb2wpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGtsYXNzZXMgPSBbXTtcbiAgICAgICAga2xhc3Nlcy5wdXNoKGxheW91dENvbC5jbGFzcyB8fCAnJyk7XG4gICAgICAgIGxheW91dENvbC5zaXplICYmIGtsYXNzZXMucHVzaCh0aGlzLmdldFNpemVDbGFzcyhsYXlvdXRDb2wuc2l6ZSkgfHwgJycpO1xuICAgICAgICBsYXlvdXRDb2wuYm9sZCAmJiBrbGFzc2VzLnB1c2godGhpcy5nZXRGb250V2VpZ2h0KGxheW91dENvbC5ib2xkKSB8fCAnJyk7XG4gICAgICAgIGxheW91dENvbC5jb2xvciAmJiBrbGFzc2VzLnB1c2godGhpcy5nZXRDb2xvcihsYXlvdXRDb2wuY29sb3IpIHx8ICcnKTtcblxuICAgICAgICByZXR1cm4ga2xhc3Nlcy5qb2luKCcgJyk7XG4gICAgfVxuXG4gICAgZ2V0TGFiZWxEaXNwbGF5KGNvbDogRmllbGRGbGV4Ym94Q29sKTogTGFiZWxEaXNwbGF5IHtcbiAgICAgICAgcmV0dXJuIGNvbC5sYWJlbERpc3BsYXkgfHwgKHRoaXMuY29uZmlnICYmIHRoaXMuY29uZmlnLmxhYmVsRGlzcGxheSkgfHwgJ2lubGluZSc7XG4gICAgfVxuXG4gICAgZ2V0RmllbGQocmVjb3JkOiBSZWNvcmQsIGZpZWxkOiBWaWV3RmllbGREZWZpbml0aW9uKTogRmllbGQge1xuICAgICAgICBpZiAoIWZpZWxkIHx8ICFmaWVsZC5uYW1lIHx8ICFyZWNvcmQgfHwgIXJlY29yZC5maWVsZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlY29yZC5maWVsZHNbZmllbGQubmFtZV0gfHwgbnVsbDtcbiAgICB9XG5cbiAgICBnZXRGaWVsZENsYXNzKGNvbDogRmllbGRGbGV4Ym94Q29sKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgICAgIGxldCBrbGFzc2VzID0gdGhpcy5jb25maWcuaW5wdXRDbGFzcyB8fCB7fSBhcyB7IFtrZXk6IHN0cmluZ106IGFueSB9O1xuXG4gICAgICAgIGlmIChjb2wuaW5wdXRDbGFzcykge1xuICAgICAgICAgICAga2xhc3Nlc1tjb2wuaW5wdXRDbGFzc10gPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtsYXNzZXM7XG4gICAgfVxuXG4gICAgZ2V0TGFiZWxDbGFzcyhjb2w6IEZpZWxkRmxleGJveENvbCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0ge1xuICAgICAgICBsZXQga2xhc3NlcyA9IHRoaXMuY29uZmlnLmxhYmVsQ2xhc3MgfHwge30gYXMgeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcblxuICAgICAgICBpZiAoY29sLmxhYmVsQ2xhc3MpIHtcbiAgICAgICAgICAgIGtsYXNzZXNbY29sLmxhYmVsQ2xhc3NdID0gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtsYXNzZXM7XG4gICAgfVxuXG4gICAgc2hvdWxkRGlzcGxheShjb2w6IEZpZWxkRmxleGJveENvbCwgZmllbGQ6IEZpZWxkKSB7XG4gICAgICAgIGlmICghY29sLmhpZGVJZkVtcHR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBoYXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgICBoYXNWYWx1ZSA9IGhhc1ZhbHVlIHx8ICEhZmllbGQudmFsdWU7XG4gICAgICAgIGhhc1ZhbHVlID0gaGFzVmFsdWUgfHwgISEoZmllbGQudmFsdWVMaXN0ICYmIGZpZWxkLnZhbHVlTGlzdC5sZW5ndGgpO1xuICAgICAgICBoYXNWYWx1ZSA9IGhhc1ZhbHVlIHx8ICEhKGZpZWxkLnZhbHVlT2JqZWN0ICYmIE9iamVjdC5rZXlzKGZpZWxkLnZhbHVlT2JqZWN0KS5sZW5ndGgpO1xuXG4gICAgICAgIHJldHVybiBoYXNWYWx1ZTtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5KGNvbDogRmllbGRGbGV4Ym94Q29sKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGNvbC5kaXNwbGF5IHx8ICcnO1xuICAgIH1cbn1cbiJdfQ==