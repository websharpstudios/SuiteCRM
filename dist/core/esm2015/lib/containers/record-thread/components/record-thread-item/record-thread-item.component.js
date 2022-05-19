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
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
export class RecordThreadItemComponent {
    constructor() {
        this.collapsed = false;
        this.collapsible = false;
        this.collapseLimit = 300;
        this.dynamicClass = '';
        this.subs = [];
    }
    ngOnInit() {
        this.initDynamicClass();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    ngAfterViewInit() {
        if (!this.config || !this.config.collapsible) {
            return;
        }
        const collapseLimit = this.config.collapseLimit || this.collapseLimit;
        let height = this.bodyEl.nativeElement.offsetHeight;
        if (height > collapseLimit) {
            this.collapsible = true;
            this.collapsed = true;
        }
    }
    /**
     *
     * Build layout data source according to received configuration
     * @param {object} layout: FieldFlexboxRow[]
     * @returns {object} RecordFlexboxConfig
     */
    buildConfig(layout) {
        return {
            record$: this.config.store.stagingRecord$,
            mode$: this.config.store.mode$,
            layout$: of(layout).pipe(shareReplay(1)),
            inputClass: Object.assign(Object.assign({}, (this.config.inputClass || {})), { 'form-control form-control-sm': true }),
            buttonClass: this.config.buttonClass || '',
            labelClass: this.config.labelClass || {},
            rowClass: this.config.rowClass || {},
            colClass: this.config.colClass || {},
        };
    }
    getCollapseButton() {
        return {
            klass: 'collapse-button btn btn-link btn-sm',
            labelKey: this.collapsed ? 'LBL_SHOW_MORE' : 'LBL_SHOW_LESS',
            onClick: () => {
                this.collapsed = !this.collapsed;
                if (this.collapsed) {
                    this.config && this.config.collapsed();
                }
                else {
                    this.config && this.config.expanded();
                }
            }
        };
    }
    initDynamicClass() {
        if (!this.config || !this.config.dynamicClass || !this.config.dynamicClass.length) {
            return;
        }
        this.subs.push(this.config.store.stagingRecord$.subscribe(record => {
            const klasses = [];
            if (!record || !record.fields || !Object.keys(record.fields).length) {
                return;
            }
            this.config.dynamicClass.forEach(fieldKey => {
                if (!fieldKey) {
                    return;
                }
                if (!record.fields[fieldKey] && !record.attributes[fieldKey]) {
                    return;
                }
                const prefix = fieldKey + '-';
                let values = [];
                if (!record.fields[fieldKey]) {
                    if (Array.isArray(record.attributes[fieldKey])) {
                        values = values.concat(record.attributes[fieldKey]);
                    }
                    else if (typeof record.attributes[fieldKey] !== 'object') {
                        values.push(record.attributes[fieldKey]);
                    }
                }
                else {
                    if (record.fields[fieldKey].value) {
                        values.push(record.fields[fieldKey].value);
                    }
                    if (record.fields[fieldKey].valueList && record.fields[fieldKey].valueList.length) {
                        values = values.concat(record.fields[fieldKey].valueList);
                    }
                }
                if (!values || !values.length) {
                    return;
                }
                const klass = prefix + values.join(' ' + prefix);
                klasses.push(klass);
            });
            this.dynamicClass = klasses.join(' ');
        }));
    }
}
RecordThreadItemComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-record-thread-item',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n\n<div *ngIf=\"config\"\n     class=\"d-flex flex-column record-thread-item {{(config && config.klass) || ''}} {{dynamicClass}}\">\n    <div class=\"record-thread-item-header flex-grow-1\">\n\n        <ng-container *ngIf=\"config.metadata && config.metadata.headerLayout\">\n\n            <scrm-record-flexbox [config]=\"buildConfig(config.metadata.headerLayout)\"></scrm-record-flexbox>\n        </ng-container>\n\n    </div>\n    <div #body\n         [class.collapsed]=\"collapsible && collapsed\"\n         [class.expanded]=\"collapsible && !collapsed\"\n         class=\"record-thread-item-body flex-grow-1\">\n\n        <ng-container *ngIf=\"config.metadata && config.metadata.bodyLayout\">\n            <scrm-record-flexbox [config]=\"buildConfig(config.metadata.bodyLayout)\"></scrm-record-flexbox>\n        </ng-container>\n\n        <div *ngIf=\"collapsible && collapsed\" class=\"fadeout\"></div>\n\n    </div>\n\n    <div *ngIf=\"collapsible\" class=\"record-thread-item-collapse d-flex justify-content-center flex-grow-1\">\n        <scrm-button [config]=\"getCollapseButton()\"></scrm-button>\n    </div>\n</div>\n"
            },] }
];
RecordThreadItemComponent.propDecorators = {
    config: [{ type: Input }],
    bodyEl: [{ type: ViewChild, args: ['body',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLXRocmVhZC1pdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb250YWluZXJzL3JlY29yZC10aHJlYWQvY29tcG9uZW50cy9yZWNvcmQtdGhyZWFkLWl0ZW0vcmVjb3JkLXRocmVhZC1pdGVtLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFnQixTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBcUIsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXhHLE9BQU8sRUFBQyxFQUFFLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFFdEMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBUTNDLE1BQU0sT0FBTyx5QkFBeUI7SUFMdEM7UUFTSSxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLGtCQUFhLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ1IsU0FBSSxHQUFtQixFQUFFLENBQUM7SUF3SHhDLENBQUM7SUF0SEcsUUFBUTtRQUNKLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsZUFBZTtRQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7WUFDMUMsT0FBTztTQUNWO1FBRUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxh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QUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDUCxDQUFDOzs7WUFwSUosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSx5QkFBeUI7Z0JBQ25DLG85RUFBa0Q7YUFFckQ7OztxQkFHSSxLQUFLO3FCQUNMLFNBQVMsU0FBQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtSZWNvcmRUaHJlYWRJdGVtQ29uZmlnfSBmcm9tICcuL3JlY29yZC10aHJlYWQtaXRlbS5tb2RlbCc7XG5pbXBvcnQge29mLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtGaWVsZEZsZXhib3gsIFJlY29yZEZsZXhib3hDb25maWd9IGZyb20gJy4uLy4uLy4uLy4uL2NvbXBvbmVudHMvcmVjb3JkLWZsZXhib3gvcmVjb3JkLWZsZXhib3gubW9kZWwnO1xuaW1wb3J0IHtzaGFyZVJlcGxheX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtCdXR0b25JbnRlcmZhY2V9IGZyb20gJ2NvbW1vbic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1yZWNvcmQtdGhyZWFkLWl0ZW0nLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9yZWNvcmQtdGhyZWFkLWl0ZW0uY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogW10sXG59KVxuZXhwb3J0IGNsYXNzIFJlY29yZFRocmVhZEl0ZW1Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgICBASW5wdXQoKSBjb25maWc6IFJlY29yZFRocmVhZEl0ZW1Db25maWc7XG4gICAgQFZpZXdDaGlsZCgnYm9keScpIGJvZHlFbDogRWxlbWVudFJlZjtcbiAgICBjb2xsYXBzZWQgPSBmYWxzZTtcbiAgICBjb2xsYXBzaWJsZSA9IGZhbHNlO1xuICAgIGNvbGxhcHNlTGltaXQgPSAzMDA7XG4gICAgZHluYW1pY0NsYXNzID0gJyc7XG4gICAgcHJvdGVjdGVkIHN1YnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbml0RHluYW1pY0NsYXNzKCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3Vicy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAoIXRoaXMuY29uZmlnIHx8ICF0aGlzLmNvbmZpZy5jb2xsYXBzaWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29sbGFwc2VMaW1pdCA9IHRoaXMuY29uZmlnLmNvbGxhcHNlTGltaXQgfHwgdGhpcy5jb2xsYXBzZUxpbWl0O1xuXG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLmJvZHlFbC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgICBpZiAoaGVpZ2h0ID4gY29sbGFwc2VMaW1pdCkge1xuICAgICAgICAgICAgdGhpcy5jb2xsYXBzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmNvbGxhcHNlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEJ1aWxkIGxheW91dCBkYXRhIHNvdXJjZSBhY2NvcmRpbmcgdG8gcmVjZWl2ZWQgY29uZmlndXJhdGlvblxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsYXlvdXQ6IEZpZWxkRmxleGJveFJvd1tdXG4gICAgICogQHJldHVybnMge29iamVjdH0gUmVjb3JkRmxleGJveENvbmZpZ1xuICAgICAqL1xuICAgIGJ1aWxkQ29uZmlnKGxheW91dDogRmllbGRGbGV4Ym94KTogUmVjb3JkRmxleGJveENvbmZpZyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZWNvcmQkOiB0aGlzLmNvbmZpZy5zdG9yZS5zdGFnaW5nUmVjb3JkJCxcbiAgICAgICAgICAgIG1vZGUkOiB0aGlzLmNvbmZpZy5zdG9yZS5tb2RlJCxcbiAgICAgICAgICAgIGxheW91dCQ6IG9mKGxheW91dCkucGlwZShzaGFyZVJlcGxheSgxKSksXG4gICAgICAgICAgICBpbnB1dENsYXNzOiB7XG4gICAgICAgICAgICAgICAgLi4uKHRoaXMuY29uZmlnLmlucHV0Q2xhc3MgfHwge30pLFxuICAgICAgICAgICAgICAgICdmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLXNtJzogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJ1dHRvbkNsYXNzOiB0aGlzLmNvbmZpZy5idXR0b25DbGFzcyB8fCAnJyxcbiAgICAgICAgICAgIGxhYmVsQ2xhc3M6IHRoaXMuY29uZmlnLmxhYmVsQ2xhc3MgfHwge30sXG4gICAgICAgICAgICByb3dDbGFzczogdGhpcy5jb25maWcucm93Q2xhc3MgfHwge30sXG4gICAgICAgICAgICBjb2xDbGFzczogdGhpcy5jb25maWcuY29sQ2xhc3MgfHwge30sXG4gICAgICAgIH0gYXMgUmVjb3JkRmxleGJveENvbmZpZztcbiAgICB9XG5cbiAgICBnZXRDb2xsYXBzZUJ1dHRvbigpOiBCdXR0b25JbnRlcmZhY2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2xhc3M6ICdjb2xsYXBzZS1idXR0b24gYnRuIGJ0bi1saW5rIGJ0bi1zbScsXG4gICAgICAgICAgICBsYWJlbEtleTogdGhpcy5jb2xsYXBzZWQgPyAnTEJMX1NIT1dfTU9SRScgOiAnTEJMX1NIT1dfTEVTUycsXG4gICAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsYXBzZWQgPSAhdGhpcy5jb2xsYXBzZWQ7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29sbGFwc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnICYmIHRoaXMuY29uZmlnLmNvbGxhcHNlZCgpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWcgJiYgdGhpcy5jb25maWcuZXhwYW5kZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gYXMgQnV0dG9uSW50ZXJmYWNlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0RHluYW1pY0NsYXNzKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuY29uZmlnIHx8ICF0aGlzLmNvbmZpZy5keW5hbWljQ2xhc3MgfHwgIXRoaXMuY29uZmlnLmR5bmFtaWNDbGFzcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vicy5wdXNoKHRoaXMuY29uZmlnLnN0b3JlLnN0YWdpbmdSZWNvcmQkLnN1YnNjcmliZShyZWNvcmQgPT4ge1xuICAgICAgICAgICAgY29uc3Qga2xhc3NlcyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAoIXJlY29yZCB8fCAhcmVjb3JkLmZpZWxkcyB8fCAhT2JqZWN0LmtleXMocmVjb3JkLmZpZWxkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5keW5hbWljQ2xhc3MuZm9yRWFjaChmaWVsZEtleSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFmaWVsZEtleSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFyZWNvcmQuZmllbGRzW2ZpZWxkS2V5XSAmJiAhcmVjb3JkLmF0dHJpYnV0ZXNbZmllbGRLZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBwcmVmaXggPSBmaWVsZEtleSArICctJztcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVzID0gW107XG5cbiAgICAgICAgICAgICAgICBpZiAoIXJlY29yZC5maWVsZHNbZmllbGRLZXldKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVjb3JkLmF0dHJpYnV0ZXNbZmllbGRLZXldKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuY29uY2F0KHJlY29yZC5hdHRyaWJ1dGVzW2ZpZWxkS2V5XSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVjb3JkLmF0dHJpYnV0ZXNbZmllbGRLZXldICE9PSAnb2JqZWN0Jykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChyZWNvcmQuYXR0cmlidXRlc1tmaWVsZEtleV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWNvcmQuZmllbGRzW2ZpZWxkS2V5XS52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2gocmVjb3JkLmZpZWxkc1tmaWVsZEtleV0udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlY29yZC5maWVsZHNbZmllbGRLZXldLnZhbHVlTGlzdCAmJiByZWNvcmQuZmllbGRzW2ZpZWxkS2V5XS52YWx1ZUxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuY29uY2F0KHJlY29yZC5maWVsZHNbZmllbGRLZXldLnZhbHVlTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlcyB8fCAhdmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3Qga2xhc3MgPSBwcmVmaXggKyB2YWx1ZXMuam9pbignICcgKyBwcmVmaXgpO1xuICAgICAgICAgICAgICAgIGtsYXNzZXMucHVzaChrbGFzcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5keW5hbWljQ2xhc3MgPSBrbGFzc2VzLmpvaW4oJyAnKTtcblxuICAgICAgICB9KSlcbiAgICB9XG59XG4iXX0=