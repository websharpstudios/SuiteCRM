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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { animate, transition, trigger } from '@angular/animations';
import { of } from 'rxjs';
import { distinctUntilChanged, skip } from 'rxjs/operators';
import { ModalRecordFilterAdapter } from '../../adapters/filter.adapter';
import { ModalRecordListTableAdapter } from '../../adapters/table.adapter';
import { RecordListModalStoreFactory } from '../../store/record-list-modal/record-list-modal.store.factory';
import { MaxColumnsCalculator } from '../../../../services/ui/max-columns-calculator/max-columns-calculator.service';
import { LanguageStore } from '../../../../store/language/language.store';
export class RecordListModalComponent {
    constructor(activeModal, storeFactory, languages, maxColumnCalculator) {
        this.activeModal = activeModal;
        this.storeFactory = storeFactory;
        this.languages = languages;
        this.maxColumnCalculator = maxColumnCalculator;
        this.titleKey = '';
        this.adapter = null;
        this.filterAdapter = null;
        this.subs = [];
        this.store = this.storeFactory.create();
    }
    ngOnInit() {
        this.closeButton = {
            klass: ['btn', 'btn-outline-light', 'btn-sm'],
            onClick: () => {
                this.activeModal.close({
                    type: 'close-button'
                });
            }
        };
        this.init();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    init() {
        if (!this.module) {
            return;
        }
        this.initStore();
        this.initTableAdapter();
        this.initFilterAdapters();
    }
    getMaxColumns() {
        return this.maxColumnCalculator.getMaxColumns(of(true));
    }
    initTableAdapter() {
        if (this.adapter === null) {
            this.adapter = new ModalRecordListTableAdapter();
        }
        this.tableConfig = this.adapter.getTable(this.store);
        this.tableConfig.maxColumns$ = this.getMaxColumns();
    }
    initFilterAdapters() {
        if (this.filterAdapter === null) {
            this.filterAdapter = new ModalRecordFilterAdapter();
        }
        this.filterConfig = this.filterAdapter.getConfig(this.store);
    }
    initStore() {
        this.store.init(this.module);
        this.loading$ = this.store.metadataLoading$;
        this.subs.push(this.store.recordList.selection$.pipe(distinctUntilChanged(), skip(1)).subscribe(selection => {
            if (!selection || !selection.selected || Object.keys(selection.selected).length < 1) {
                return;
            }
            this.activeModal.close({
                selection,
                records: this.store.recordList.records
            });
        }));
    }
}
RecordListModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-record-list-modal',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<scrm-modal [closable]=\"true\"\n            [close]=\"closeButton\"\n            [title]=\"titleKey\"\n            bodyKlass=\"m-0 small-font\"\n            footerKlass=\"border-0\"\n            headerKlass=\"border-0\"\n            klass=\"record-list-modal\">\n\n    <div modal-body>\n\n        <ng-container *ngIf=\"!tableConfig\">\n            <scrm-label labelKey=\"LBL_CONFIG_NO_CONFIG\"></scrm-label>\n        </ng-container>\n\n        <ng-container *ngIf=\"tableConfig\">\n            <div>\n                <div class=\"container-fluid\">\n                    <div class=\"row pb-3\">\n                        <div class=\"col\">\n                            <scrm-list-filter *ngIf=\"filterConfig\" [config]=\"filterConfig\"></scrm-list-filter>\n                        </div>\n                    </div>\n                    <div class=\"row\">\n                        <div class=\"col\">\n                            <scrm-table [config]=\"tableConfig\"></scrm-table>\n                        </div>\n                    </div>\n                </div>\n\n                <ng-container *ngIf=\"(loading$ | async) as loading\">\n                    <scrm-loading-spinner *ngIf=\"loading\" [overlay]=\"true\"></scrm-loading-spinner>\n                </ng-container>\n            </div>\n\n        </ng-container>\n    </div>\n\n</scrm-modal>\n",
                providers: [MaxColumnsCalculator],
                animations: [
                    trigger('modalFade', [
                        transition('void <=> *', [
                            animate('800ms')
                        ]),
                    ]),
                ]
            },] }
];
RecordListModalComponent.ctorParameters = () => [
    { type: NgbActiveModal },
    { type: RecordListModalStoreFactory },
    { type: LanguageStore },
    { type: MaxColumnsCalculator }
];
RecordListModalComponent.propDecorators = {
    titleKey: [{ type: Input }],
    module: [{ type: Input }],
    adapter: [{ type: Input }],
    filterAdapter: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLWxpc3QtbW9kYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2NvbnRhaW5lcnMvcmVjb3JkLWxpc3QtbW9kYWwvY29tcG9uZW50cy9yZWNvcmQtbGlzdC1tb2RhbC9yZWNvcmQtbGlzdC1tb2RhbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFvQixNQUFNLGVBQWUsQ0FBQztBQUNsRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDMUQsT0FBTyxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFakUsT0FBTyxFQUFhLEVBQUUsRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUQsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDdkUsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFHekUsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sK0RBQStELENBQUM7QUFFMUcsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sK0VBQStFLENBQUM7QUFFbkgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBZ0J4RSxNQUFNLE9BQU8sd0JBQXdCO0lBZ0JqQyxZQUNXLFdBQTJCLEVBQ3hCLFlBQXlDLEVBQ3pDLFNBQXdCLEVBQ3hCLG1CQUF5QztRQUg1QyxnQkFBVyxHQUFYLFdBQVcsQ0FBZ0I7UUFDeEIsaUJBQVksR0FBWixZQUFZLENBQTZCO1FBQ3pDLGNBQVMsR0FB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VUFBVSxDQUFDLE9BQU87YUFDaEIsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDOzs7WUFyR0osU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLHdyRkFBaUQ7Z0JBRWpELFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDO2dCQUNqQyxVQUFVLEVBQUU7b0JBQ1IsT0FBTyxDQUFDLFdBQVcsRUFBRTt3QkFDakIsVUFBVSxDQUFDLFlBQVksRUFBRTs0QkFDckIsT0FBTyxDQUFDLE9BQU8sQ0FBQzt5QkFDbkIsQ0FBQztxQkFDTCxDQUFDO2lCQUNMO2FBQ0o7OztZQTVCTyxjQUFjO1lBU2QsMkJBQTJCO1lBSTNCLGFBQWE7WUFGYixvQkFBb0I7Ozt1QkFvQnZCLEtBQUs7cUJBQ0wsS0FBSztzQkFDTCxLQUFLOzRCQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ2JBY3RpdmVNb2RhbH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHthbmltYXRlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7QnV0dG9uSW50ZXJmYWNlLCBNb2RhbENsb3NlRmVlZEJhY2t9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge09ic2VydmFibGUsIG9mLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkaXN0aW5jdFVudGlsQ2hhbmdlZCwgc2tpcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNb2RhbFJlY29yZEZpbHRlckFkYXB0ZXJ9IGZyb20gJy4uLy4uL2FkYXB0ZXJzL2ZpbHRlci5hZGFwdGVyJztcbmltcG9ydCB7TW9kYWxSZWNvcmRMaXN0VGFibGVBZGFwdGVyfSBmcm9tICcuLi8uLi9hZGFwdGVycy90YWJsZS5hZGFwdGVyJztcbmltcG9ydCB7UmVjb3JkTGlzdE1vZGFsVGFibGVBZGFwdGVySW50ZXJmYWNlfSBmcm9tICcuLi8uLi9hZGFwdGVycy9hZGFwdGVyLm1vZGVsJztcbmltcG9ydCB7UmVjb3JkTGlzdE1vZGFsU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL3JlY29yZC1saXN0LW1vZGFsL3JlY29yZC1saXN0LW1vZGFsLnN0b3JlJztcbmltcG9ydCB7UmVjb3JkTGlzdE1vZGFsU3RvcmVGYWN0b3J5fSBmcm9tICcuLi8uLi9zdG9yZS9yZWNvcmQtbGlzdC1tb2RhbC9yZWNvcmQtbGlzdC1tb2RhbC5zdG9yZS5mYWN0b3J5JztcbmltcG9ydCB7VGFibGVDb25maWd9IGZyb20gJy4uLy4uLy4uLy4uL2NvbXBvbmVudHMvdGFibGUvdGFibGUubW9kZWwnO1xuaW1wb3J0IHtNYXhDb2x1bW5zQ2FsY3VsYXRvcn0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZXMvdWkvbWF4LWNvbHVtbnMtY2FsY3VsYXRvci9tYXgtY29sdW1ucy1jYWxjdWxhdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHtGaWx0ZXJDb25maWd9IGZyb20gJy4uLy4uLy4uL2xpc3QtZmlsdGVyL2NvbXBvbmVudHMvbGlzdC1maWx0ZXIvbGlzdC1maWx0ZXIubW9kZWwnO1xuaW1wb3J0IHtMYW5ndWFnZVN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5pbXBvcnQge1JlY29yZExpc3RNb2RhbFJlc3VsdH0gZnJvbSAnLi9yZWNvcmQtbGlzdC1tb2RhbC5tb2RlbCc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1yZWNvcmQtbGlzdC1tb2RhbCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3JlY29yZC1saXN0LW1vZGFsLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFtdLFxuICAgIHByb3ZpZGVyczogW01heENvbHVtbnNDYWxjdWxhdG9yXSxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ21vZGFsRmFkZScsIFtcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJ3ZvaWQgPD0+IConLCBbXG4gICAgICAgICAgICAgICAgYW5pbWF0ZSgnODAwbXMnKVxuICAgICAgICAgICAgXSksXG4gICAgICAgIF0pLFxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgUmVjb3JkTGlzdE1vZGFsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KCkgdGl0bGVLZXkgPSAnJztcbiAgICBASW5wdXQoKSBtb2R1bGU6IHN0cmluZztcbiAgICBASW5wdXQoKSBhZGFwdGVyOiBSZWNvcmRMaXN0TW9kYWxUYWJsZUFkYXB0ZXJJbnRlcmZhY2UgPSBudWxsO1xuICAgIEBJbnB1dCgpIGZpbHRlckFkYXB0ZXI6IE1vZGFsUmVjb3JkRmlsdGVyQWRhcHRlciA9IG51bGw7XG5cbiAgICBsb2FkaW5nJDogT2JzZXJ2YWJsZTxib29sZWFuPjtcblxuICAgIGNsb3NlQnV0dG9uOiBCdXR0b25JbnRlcmZhY2U7XG4gICAgdGFibGVDb25maWc6IFRhYmxlQ29uZmlnO1xuICAgIGZpbHRlckNvbmZpZzogRmlsdGVyQ29uZmlnO1xuICAgIHN0b3JlOiBSZWNvcmRMaXN0TW9kYWxTdG9yZTtcblxuICAgIHByb3RlY3RlZCBzdWJzOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBhY3RpdmVNb2RhbDogTmdiQWN0aXZlTW9kYWwsXG4gICAgICAgIHByb3RlY3RlZCBzdG9yZUZhY3Rvcnk6IFJlY29yZExpc3RNb2RhbFN0b3JlRmFjdG9yeSxcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlczogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIG1heENvbHVtbkNhbGN1bGF0b3I6IE1heENvbHVtbnNDYWxjdWxhdG9yXG4gICAgKSB7XG4gICAgICAgIHRoaXMuc3RvcmUgPSB0aGlzLnN0b3JlRmFjdG9yeS5jcmVhdGUoKTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLmNsb3NlQnV0dG9uID0ge1xuICAgICAgICAgICAga2xhc3M6IFsnYnRuJywgJ2J0bi1vdXRsaW5lLWxpZ2h0JywgJ2J0bi1zbSddLFxuICAgICAgICAgICAgb25DbGljazogKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlTW9kYWwuY2xvc2Uoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2xvc2UtYnV0dG9uJ1xuICAgICAgICAgICAgICAgIH0gYXMgTW9kYWxDbG9zZUZlZWRCYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBhcyBCdXR0b25JbnRlcmZhY2U7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3Vicy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgfVxuXG4gICAgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLm1vZHVsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5pdFN0b3JlKCk7XG4gICAgICAgIHRoaXMuaW5pdFRhYmxlQWRhcHRlcigpO1xuICAgICAgICB0aGlzLmluaXRGaWx0ZXJBZGFwdGVycygpO1xuICAgIH1cblxuICAgIGdldE1heENvbHVtbnMoKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF4Q29sdW1uQ2FsY3VsYXRvci5nZXRNYXhDb2x1bW5zKG9mKHRydWUpKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdFRhYmxlQWRhcHRlcigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYWRhcHRlciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5hZGFwdGVyID0gbmV3IE1vZGFsUmVjb3JkTGlzdFRhYmxlQWRhcHRlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50YWJsZUNvbmZpZyA9IHRoaXMuYWRhcHRlci5nZXRUYWJsZSh0aGlzLnN0b3JlKTtcbiAgICAgICAgdGhpcy50YWJsZUNvbmZpZy5tYXhDb2x1bW5zJCA9IHRoaXMuZ2V0TWF4Q29sdW1ucygpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0RmlsdGVyQWRhcHRlcnMoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmZpbHRlckFkYXB0ZXIgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyQWRhcHRlciA9IG5ldyBNb2RhbFJlY29yZEZpbHRlckFkYXB0ZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmlsdGVyQ29uZmlnID0gdGhpcy5maWx0ZXJBZGFwdGVyLmdldENvbmZpZyh0aGlzLnN0b3JlKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdFN0b3JlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0b3JlLmluaXQodGhpcy5tb2R1bGUpO1xuICAgICAgICB0aGlzLmxvYWRpbmckID0gdGhpcy5zdG9yZS5tZXRhZGF0YUxvYWRpbmckO1xuXG4gICAgICAgIHRoaXMuc3Vicy5wdXNoKHRoaXMuc3RvcmUucmVjb3JkTGlzdC5zZWxlY3Rpb24kLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKSwgc2tpcCgxKSkuc3Vic2NyaWJlKHNlbGVjdGlvbiA9PiB7XG5cbiAgICAgICAgICAgIGlmICghc2VsZWN0aW9uIHx8ICFzZWxlY3Rpb24uc2VsZWN0ZWQgfHwgT2JqZWN0LmtleXMoc2VsZWN0aW9uLnNlbGVjdGVkKS5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZU1vZGFsLmNsb3NlKHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24sXG4gICAgICAgICAgICAgICAgcmVjb3JkczogdGhpcy5zdG9yZS5yZWNvcmRMaXN0LnJlY29yZHNcbiAgICAgICAgICAgIH0gYXMgUmVjb3JkTGlzdE1vZGFsUmVzdWx0KTtcbiAgICAgICAgfSkpO1xuICAgIH1cbn1cbiJdfQ==