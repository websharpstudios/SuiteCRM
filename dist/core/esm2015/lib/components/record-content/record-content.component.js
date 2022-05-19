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
import { of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LanguageStore } from '../../store/language/language.store';
export class RecordContentComponent {
    constructor(language) {
        this.language = language;
        this.config = {};
        this.active = 1;
        this.subs = [];
    }
    ngOnInit() {
        this.subs.push(this.dataSource.getDisplayConfig().subscribe(config => {
            this.config = Object.assign({}, config);
        }));
        this.subs.push(this.dataSource.getPanels().subscribe(panels => {
            this.panels = [...panels];
        }));
        this.subs.push(this.dataSource.getRecord().subscribe(record => {
            this.record = Object.assign({}, record);
            this.fields = record.fields;
        }));
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    getLayoutDataSource(panel) {
        return {
            inlineEdit: true,
            getConfig: () => this.dataSource.getDisplayConfig().pipe(map(config => ({
                mode: config.mode,
                maxColumns: config.maxColumns,
            }))),
            getLayout: () => of(panel).pipe(shareReplay(1)),
            getFields: () => this.dataSource.getRecord().pipe(map(record => (record.fields))),
            getRecord: () => this.dataSource.getRecord(),
            getEditAction: () => this.dataSource.getEditAction()
        };
    }
}
RecordContentComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-record-content',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<ng-container *ngIf=\"dataSource\">\n    <div *ngIf=\"config && config.layout === 'panels'\" class=\"record-content panel-layout container-fluid pl-0 pr-0\">\n        <div class=\"row no-gutters mb-3\" *ngFor=\"let panel of panels\">\n            <div class=\"col\">\n                <scrm-panel [title]=\"panel.label\" mode=\"collapsible\">\n                    <div panel-body class=\"panel-{{panel.key}}\">\n                        <scrm-field-layout [dataSource]=\"getLayoutDataSource(panel)\"></scrm-field-layout>\n                    </div>\n                </scrm-panel>\n            </div>\n        </div>\n\n    </div>\n\n    <div *ngIf=\"config && config.layout === 'tabs'\" class=\"record-content tabs-layout container-fluid pl-0 pr-0\">\n\n        <ul ngbNav #nav=\"ngbNav\" class=\"nav-tabs\" [(activeId)]=\"active\">\n            <li class=\"tab\" *ngFor=\"let panel of panels; index as i;\" [ngbNavItem]=\"i+1\">\n                <a class=\"tab-link\" ngbNavLink>{{panel.label}}</a>\n                <ng-template ngbNavContent>\n                    <div class=\"tab-{{panel.key}}\">\n                        <scrm-field-layout [dataSource]=\"getLayoutDataSource(panel)\"></scrm-field-layout>\n                    </div>\n                </ng-template>\n            </li>\n        </ul>\n        <div [ngbNavOutlet]=\"nav\" class=\"p-2 pt-3 rounded-right rounded-bottom\"></div>\n\n    </div>\n\n</ng-container>\n"
            },] }
];
RecordContentComponent.ctorParameters = () => [
    { type: LanguageStore }
];
RecordContentComponent.propDecorators = {
    dataSource: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLWNvbnRlbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2NvbXBvbmVudHMvcmVjb3JkLWNvbnRlbnQvcmVjb3JkLWNvbnRlbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBb0IsTUFBTSxlQUFlLENBQUM7QUFDbEUsT0FBTyxFQUFhLEVBQUUsRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUVsRCxPQUFPLEVBQUMsR0FBRyxFQUFFLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBR2hELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQU9sRSxNQUFNLE9BQU8sc0JBQXNCO0lBVy9CLFlBQXNCLFFBQXVCO1FBQXZCLGFBQVEsR0FBUixRQUFRLENBQWU7UUFQN0MsV0FBTSxHQUF3QixFQUF5QixDQUFDO1FBRXhELFdBQU0sR0FBRyxDQUFDLENBQUM7UUFHSCxTQUFJLEdBQW1CLEVBQUUsQ0FBQztJQUdsQyxDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDakUsSUFBSSxDQUFDLE1BQU0scUJBQU8sTUFBTSxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzFELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMxRCxJQUFJLENBQUMsTUFBTSxxQkFBTyxNQUFNLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsbUJBQW1CLENBQUMsS0FBWTtRQUM1QixPQUFPO1lBQ0gsVUFBVSxFQUFFLElBQUk7WUFDaEIsU0FBUyxFQUFFLEdBQWtDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ25HLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtnQkFDakIsVUFBVSxFQUFFLE1BQU0sQ0FBQyxVQUFVO2FBQ2hDLENBQUMsQ0FBQyxDQUFDO1lBQ0osU0FBUyxFQUFFLEdBQXNCLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRSxTQUFTLEVBQUUsR0FBeUIsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDdkcsU0FBUyxFQUFFLEdBQXVCLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRTtZQUNoRSxhQUFhLEVBQUUsR0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUU7U0FDcEMsQ0FBQztJQUMvQixDQUFDOzs7WUFoREosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLGd3RkFBOEM7YUFFakQ7OztZQU5PLGFBQWE7Ozt5QkFTaEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIG9mLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtGaWVsZE1hcCwgUGFuZWwsIFJlY29yZH0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7bWFwLCBzaGFyZVJlcGxheX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtSZWNvcmRDb250ZW50Q29uZmlnLCBSZWNvcmRDb250ZW50RGF0YVNvdXJjZX0gZnJvbSAnLi9yZWNvcmQtY29udGVudC5tb2RlbCc7XG5pbXBvcnQge0ZpZWxkTGF5b3V0Q29uZmlnLCBGaWVsZExheW91dERhdGFTb3VyY2V9IGZyb20gJy4uL2ZpZWxkLWxheW91dC9maWVsZC1sYXlvdXQubW9kZWwnO1xuaW1wb3J0IHtMYW5ndWFnZVN0b3JlfSBmcm9tICcuLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1yZWNvcmQtY29udGVudCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3JlY29yZC1jb250ZW50LmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZXM6IFtdLFxufSlcbmV4cG9ydCBjbGFzcyBSZWNvcmRDb250ZW50Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KCkgZGF0YVNvdXJjZTogUmVjb3JkQ29udGVudERhdGFTb3VyY2U7XG5cbiAgICBjb25maWc6IFJlY29yZENvbnRlbnRDb25maWcgPSB7fSBhcyBSZWNvcmRDb250ZW50Q29uZmlnO1xuICAgIHBhbmVsczogUGFuZWxbXTtcbiAgICBhY3RpdmUgPSAxO1xuICAgIHByb3RlY3RlZCByZWNvcmQ6IFJlY29yZDtcbiAgICBwcm90ZWN0ZWQgZmllbGRzOiBGaWVsZE1hcDtcbiAgICBwcml2YXRlIHN1YnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgbGFuZ3VhZ2U6IExhbmd1YWdlU3RvcmUpIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdWJzLnB1c2godGhpcy5kYXRhU291cmNlLmdldERpc3BsYXlDb25maWcoKS5zdWJzY3JpYmUoY29uZmlnID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gey4uLmNvbmZpZ307XG4gICAgICAgIH0pKTtcbiAgICAgICAgdGhpcy5zdWJzLnB1c2godGhpcy5kYXRhU291cmNlLmdldFBhbmVscygpLnN1YnNjcmliZShwYW5lbHMgPT4ge1xuICAgICAgICAgICAgdGhpcy5wYW5lbHMgPSBbLi4ucGFuZWxzXTtcbiAgICAgICAgfSkpO1xuICAgICAgICB0aGlzLnN1YnMucHVzaCh0aGlzLmRhdGFTb3VyY2UuZ2V0UmVjb3JkKCkuc3Vic2NyaWJlKHJlY29yZCA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZCA9IHsuLi5yZWNvcmR9O1xuICAgICAgICAgICAgdGhpcy5maWVsZHMgPSByZWNvcmQuZmllbGRzO1xuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3Vicy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgfVxuXG4gICAgZ2V0TGF5b3V0RGF0YVNvdXJjZShwYW5lbDogUGFuZWwpOiBGaWVsZExheW91dERhdGFTb3VyY2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5saW5lRWRpdDogdHJ1ZSxcbiAgICAgICAgICAgIGdldENvbmZpZzogKCk6IE9ic2VydmFibGU8RmllbGRMYXlvdXRDb25maWc+ID0+IHRoaXMuZGF0YVNvdXJjZS5nZXREaXNwbGF5Q29uZmlnKCkucGlwZShtYXAoY29uZmlnID0+ICh7XG4gICAgICAgICAgICAgICAgbW9kZTogY29uZmlnLm1vZGUsXG4gICAgICAgICAgICAgICAgbWF4Q29sdW1uczogY29uZmlnLm1heENvbHVtbnMsXG4gICAgICAgICAgICB9KSkpLFxuICAgICAgICAgICAgZ2V0TGF5b3V0OiAoKTogT2JzZXJ2YWJsZTxQYW5lbD4gPT4gb2YocGFuZWwpLnBpcGUoc2hhcmVSZXBsYXkoMSkpLFxuICAgICAgICAgICAgZ2V0RmllbGRzOiAoKTogT2JzZXJ2YWJsZTxGaWVsZE1hcD4gPT4gdGhpcy5kYXRhU291cmNlLmdldFJlY29yZCgpLnBpcGUobWFwKHJlY29yZCA9PiAocmVjb3JkLmZpZWxkcykpKSxcbiAgICAgICAgICAgIGdldFJlY29yZDogKCk6IE9ic2VydmFibGU8UmVjb3JkPiA9PiB0aGlzLmRhdGFTb3VyY2UuZ2V0UmVjb3JkKCksXG4gICAgICAgICAgICBnZXRFZGl0QWN0aW9uOiAoKTogdm9pZCA9PiB0aGlzLmRhdGFTb3VyY2UuZ2V0RWRpdEFjdGlvbigpXG4gICAgICAgIH0gYXMgRmllbGRMYXlvdXREYXRhU291cmNlO1xuICAgIH1cbn1cbiJdfQ==