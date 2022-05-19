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
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
export class RecordGridComponent {
    constructor() {
        this.gridButtons = [];
        this.mode = 'detail';
        this.maxColumns = 4;
        this.sizeMap = {
            handset: 1,
            tablet: 2,
            web: 3,
            wide: 4
        };
        this.fields = [];
        this.special = [];
    }
    ngOnInit() {
        if (!this.config) {
            return;
        }
        const config = this.config;
        this.vm$ = combineLatest([
            config.record$,
            config.mode$,
            config.fields$,
            config.maxColumns$,
            config.sizeMap$
        ]).pipe(map(([record, mode, fields, maxColumns, sizeMap]) => {
            this.mode = mode;
            this.maxColumns = maxColumns;
            this.sizeMap = sizeMap;
            this.fields = this.getFields(record, fields);
            return { record, mode, fields, maxColumns };
        }));
    }
    getFields(record, fieldKeys) {
        if (!record || !fieldKeys || !record.fields) {
            return [];
        }
        const fields = [];
        fieldKeys.forEach(fieldKey => {
            if (!record.fields[fieldKey]) {
                return;
            }
            fields.push(record.fields[fieldKey]);
        });
        return fields;
    }
}
RecordGridComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-record-grid',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container *ngIf=\"config\">\n    <div *ngIf=\"(vm$ | async) as vm\" class=\"record-grid {{(config && config.klass) || ''}}\">\n        <scrm-field-grid [actions]=\"!!config.actions\"\n                         [appendActions]=\"(config && config.appendActions) || false\"\n                         [colClass]=\"config && config.colClass\"\n                         [fieldMode]=\"mode\"\n                         [fields]=\"fields\"\n                         [inputClass]=\"config && config.inputClass\"\n                         [labelClass]=\"config && config.labelClass\"\n                         [labelDisplay]=\"(config && config.labelDisplay) || 'top'\"\n                         [maxColumns]=\"maxColumns\"\n                         [rowClass]=\"config && config.rowClass\"\n                         [sizeMap]=\"sizeMap\"\n        >\n        <span *ngIf=\"config.actions\" class=\"float-right\" field-grid-actions>\n            <scrm-action-group-menu [buttonClass]=\"config.buttonClass\"\n                                    [config]=\"config.actions\"></scrm-action-group-menu>\n        </span>\n        </scrm-field-grid>\n    </div>\n</ng-container>\n"
            },] }
];
RecordGridComponent.ctorParameters = () => [];
RecordGridComponent.propDecorators = {
    config: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLWdyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2NvbXBvbmVudHMvcmVjb3JkLWdyaWQvcmVjb3JkLWdyaWQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBUyxNQUFNLGVBQWUsQ0FBQztBQUV2RCxPQUFPLEVBQUMsYUFBYSxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQVFuQyxNQUFNLE9BQU8sbUJBQW1CO0lBa0I1QjtRQWZBLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBRWpCLFNBQUksR0FBYSxRQUFRLENBQUM7UUFDMUIsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixZQUFPLEdBQWtCO1lBQ3JCLE9BQU8sRUFBRSxDQUFDO1lBQ1YsTUFBTSxFQUFFLENBQUM7WUFDVCxHQUFHLEVBQUUsQ0FBQztZQUNOLElBQUksRUFBRSxDQUFDO1NBQ1YsQ0FBQztRQUNGLFdBQU0sR0FBWSxFQUFFLENBQUM7UUFDckIsWUFBTyxHQUFZLEVBQUUsQ0FBQztJQUt0QixDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2QsT0FBTztTQUNWO1FBQ0QsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUUzQixJQUFJLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FDcEI7WUFDSSxNQUFNLENBQUMsT0FBTztZQUNkLE1BQU0sQ0FBQyxLQUFLO1lBQ1osTUFBTSxDQUFDLE9BQU87WUFDZCxNQUFNLENBQUMsV0FBVztZQUNsQixNQUFNLENBQUMsUUFBUTtTQUNsQixDQUNKLENBQUMsSUFBSSxDQUNGLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUU7WUFDaEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM3QyxPQUFPLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQ0wsQ0FBQztJQUNOLENBQUM7SUFFRCxTQUFTLENBQUMsTUFBYyxFQUFFLFNBQW1CO1FBQ3pDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ3pDLE9BQU8sRUFBRSxDQUFDO1NBQ2I7UUFFRCxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFbEIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDMUIsT0FBTzthQUNWO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDOzs7WUFsRUosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLDAvRUFBMkM7YUFFOUM7Ozs7cUJBR0ksS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGaWVsZCwgUmVjb3JkLCBTY3JlZW5TaXplTWFwLCBWaWV3TW9kZX0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7Y29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtSZWNvcmRHcmlkQ29uZmlnLCBSZWNvcmRHcmlkVmlld01vZGVsfSBmcm9tICcuL3JlY29yZC1ncmlkLm1vZGVsJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLXJlY29yZC1ncmlkJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vcmVjb3JkLWdyaWQuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogW11cbn0pXG5leHBvcnQgY2xhc3MgUmVjb3JkR3JpZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBASW5wdXQoKSBjb25maWc6IFJlY29yZEdyaWRDb25maWc7XG4gICAgZ3JpZEJ1dHRvbnMgPSBbXTtcblxuICAgIG1vZGU6IFZpZXdNb2RlID0gJ2RldGFpbCc7XG4gICAgbWF4Q29sdW1uczogbnVtYmVyID0gNDtcbiAgICBzaXplTWFwOiBTY3JlZW5TaXplTWFwID0ge1xuICAgICAgICBoYW5kc2V0OiAxLFxuICAgICAgICB0YWJsZXQ6IDIsXG4gICAgICAgIHdlYjogMyxcbiAgICAgICAgd2lkZTogNFxuICAgIH07XG4gICAgZmllbGRzOiBGaWVsZFtdID0gW107XG4gICAgc3BlY2lhbDogRmllbGRbXSA9IFtdO1xuXG4gICAgdm0kOiBPYnNlcnZhYmxlPFJlY29yZEdyaWRWaWV3TW9kZWw+O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5jb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLmNvbmZpZztcblxuICAgICAgICB0aGlzLnZtJCA9IGNvbWJpbmVMYXRlc3QoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgY29uZmlnLnJlY29yZCQsXG4gICAgICAgICAgICAgICAgY29uZmlnLm1vZGUkLFxuICAgICAgICAgICAgICAgIGNvbmZpZy5maWVsZHMkLFxuICAgICAgICAgICAgICAgIGNvbmZpZy5tYXhDb2x1bW5zJCxcbiAgICAgICAgICAgICAgICBjb25maWcuc2l6ZU1hcCRcbiAgICAgICAgICAgIF1cbiAgICAgICAgKS5waXBlKFxuICAgICAgICAgICAgbWFwKChbcmVjb3JkLCBtb2RlLCBmaWVsZHMsIG1heENvbHVtbnMsIHNpemVNYXBdKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlID0gbW9kZTtcbiAgICAgICAgICAgICAgICB0aGlzLm1heENvbHVtbnMgPSBtYXhDb2x1bW5zO1xuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZU1hcCA9IHNpemVNYXA7XG4gICAgICAgICAgICAgICAgdGhpcy5maWVsZHMgPSB0aGlzLmdldEZpZWxkcyhyZWNvcmQsIGZpZWxkcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtyZWNvcmQsIG1vZGUsIGZpZWxkcywgbWF4Q29sdW1uc307XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldEZpZWxkcyhyZWNvcmQ6IFJlY29yZCwgZmllbGRLZXlzOiBzdHJpbmdbXSk6IEZpZWxkW10ge1xuICAgICAgICBpZiAoIXJlY29yZCB8fCAhZmllbGRLZXlzIHx8ICFyZWNvcmQuZmllbGRzKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWVsZHMgPSBbXTtcblxuICAgICAgICBmaWVsZEtleXMuZm9yRWFjaChmaWVsZEtleSA9PiB7XG4gICAgICAgICAgICBpZiAoIXJlY29yZC5maWVsZHNbZmllbGRLZXldKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmllbGRzLnB1c2gocmVjb3JkLmZpZWxkc1tmaWVsZEtleV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgIH1cbn1cbiJdfQ==