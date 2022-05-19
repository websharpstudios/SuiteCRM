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
import { combineLatest } from 'rxjs';
import { RecordThreadStoreFactory } from '../../store/record-thread/record-thread.store.factory';
import { take } from 'rxjs/operators';
import { RecordThreadItemStoreFactory } from '../../store/record-thread/record-thread-item.store.factory';
import { RecordManager } from '../../../../services/record/record.manager';
import { MessageService } from '../../../../services/message/message.service';
export class RecordThreadComponent {
    constructor(storeFactory, itemFactory, recordManager, message) {
        this.storeFactory = storeFactory;
        this.itemFactory = itemFactory;
        this.recordManager = recordManager;
        this.message = message;
        this.loading = false;
        this.maxHeight = 400;
        this.direction = 'asc';
        this.shouldResetScroll = false;
        this.subs = [];
    }
    ngOnInit() {
        this.maxHeight = this.config.maxListHeight || this.maxHeight;
        if (!this.config.store) {
            this.store = this.storeFactory.create();
        }
        if (!this.config.module) {
            return;
        }
        this.direction = this.config.direction || this.direction;
        this.store.setMetadata(this.config.itemConfig.metadata);
        this.store.init(this.config.module, false);
        this.initCreate();
        this.initDataSubscription();
        if (this.config.filters$) {
            this.subs.push(this.config.filters$.subscribe(filters => {
                this.store.setFilters(filters).pipe(take(1)).subscribe();
            }));
        }
        else {
            this.store.load(false);
        }
        this.initLoading();
    }
    ngAfterViewInit() {
        this.shouldResetScroll = true;
        this.resetScroll();
    }
    ngOnDestroy() {
        this.store.clear();
        this.store = null;
        this.subs.forEach(sub => sub.unsubscribe());
    }
    buildItem(item, itemRef) {
        return Object.assign(Object.assign({}, this.config.itemConfig), { store: item, klass: 'record-thread-list-item', expanded: () => {
                this.scrollToItem(itemRef);
            }, collapsed: () => {
                this.scrollToItem(itemRef);
            } });
    }
    getLoadMoreButton() {
        return {
            klass: 'load-more-button btn btn-link btn-sm',
            labelKey: 'LBL_LOAD_MORE',
            onClick: () => {
                this.store.loadMore();
            }
        };
    }
    buildCreateItem() {
        return Object.assign(Object.assign({}, this.config.createConfig), { store: this.createStore, rowClass: { 'pt-1': true }, klass: 'record-thread-create-item' });
    }
    getCreateButton() {
        return {
            klass: 'create-thread-item-button btn btn-danger btn-sm',
            labelKey: 'LBL_SUBMIT_BUTTON_LABEL',
            onClick: () => {
                this.createStore.validate().pipe(take(1)).subscribe(valid => {
                    if (valid) {
                        this.createStore.save().pipe(take(1)).subscribe(() => {
                            this.store.reload();
                            this.initRecord();
                            this.shouldResetScroll = true;
                            this.message.addSuccessMessageByKey('LBL_ACTION_SUCCESS');
                        });
                        return;
                    }
                    this.message.addWarningMessageByKey('LBL_VALIDATION_ERRORS');
                });
            }
        };
    }
    allLoaded() {
        return !!(this.store && this.store.allLoaded());
    }
    initRecord() {
        const emptyRecord = this.recordManager.buildEmptyRecord(this.config.module);
        this.addPresetFields(emptyRecord);
        let mode = 'edit';
        if (this.config.createConfig && this.config.createConfig.initialMode) {
            mode = this.config.createConfig.initialMode;
        }
        this.createStore.initRecord(emptyRecord, mode, false);
    }
    scrollToEnd() {
        if (!this.listContainer || !this.listContainer.nativeElement) {
            return;
        }
        this.scrollTo(this.listContainer.nativeElement.scrollHeight);
    }
    scrollToTop() {
        this.scrollTo(0);
    }
    scrollTo(position) {
        try {
            this.listContainer.nativeElement.scrollTop = position;
        }
        catch (err) {
        }
    }
    scrollToItem(item) {
        if (!item || !this.listContainer || !this.listContainer.nativeElement) {
            return;
        }
        const elementTop = item.offsetTop;
        const parentTop = this.listContainer.nativeElement.offsetTop;
        const relativeTop = elementTop - parentTop;
        this.scrollTo(relativeTop);
    }
    resetScroll() {
        if (this.shouldResetScroll === false) {
            return;
        }
        if (this.direction === 'asc') {
            this.scrollToEnd();
        }
        else {
            this.scrollToTop();
        }
        this.shouldResetScroll = false;
    }
    scheduleScrollReset() {
        setTimeout(() => {
            this.resetScroll();
        }, 500);
    }
    initCreate() {
        if (!this.config.create) {
            return;
        }
        this.createStore = this.itemFactory.create();
        this.createStore.setMetadata(this.config.createConfig.metadata);
        this.initRecord();
        this.initPresetFieldsMapping();
    }
    initPresetFieldsMapping() {
        if (!this.config.presetFields$) {
            return;
        }
        this.subs.push(this.config.presetFields$.subscribe(presetFieldValues => {
            if (!presetFieldValues || !Object.keys(presetFieldValues).length) {
                return;
            }
            this.presetFieldValues = presetFieldValues;
            const record = this.createStore.recordStore.getBaseRecord();
            this.addPresetFields(record);
            this.createStore.recordStore.setRecord(record);
        }));
    }
    addPresetFields(record) {
        if (!this.presetFieldValues) {
            return;
        }
        record.attributes = Object.assign(Object.assign({}, this.presetFieldValues), (record.attributes || {}));
    }
    initDataSubscription() {
        this.subs.push(this.store.stores$.subscribe(records => {
            if (!this.records || !this.records.length) {
                this.shouldResetScroll = true;
            }
            if (this.direction === 'asc') {
                this.records = records.reverse();
                this.scheduleScrollReset();
                return;
            }
            this.records = records;
            this.scheduleScrollReset();
        }));
    }
    initLoading() {
        const loading = [
            this.store.$loading
        ];
        if (this.createStore && this.createStore.loading$) {
            loading.push(this.createStore.loading$);
        }
        const $loading = combineLatest(loading);
        this.subs.push($loading.subscribe((loadings) => {
            if (!loadings || !loadings.length) {
                this.loading = false;
                return;
            }
            let loading = false;
            loadings.forEach(value => {
                loading = loading || value;
            });
            this.loading = loading;
        }));
    }
}
RecordThreadComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-record-thread',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n\n<div class=\"record-thread {{(config && config.klass) || ''}}\">\n    <div *ngIf=\"!loading && !records && !records.length\"\n         class=\"d-flex record-thread-no-data justify-content-center h3\">\n        <scrm-label labelKey=\"LBL_NO_DATA\"></scrm-label>\n    </div>\n\n    <div *ngIf=\"loading\" class=\"d-flex record-thread-loading justify-content-center\">\n        <scrm-loading-spinner [overlay]=\"true\"></scrm-loading-spinner>\n    </div>\n\n\n    <div #list\n         *ngIf=\"records && records.length\"\n         [ngStyle]=\"{'max-height.px': maxHeight, 'overflow-y': 'auto'}\"\n         class=\"record-thread-list\">\n\n        <div *ngIf=\"direction === 'asc' && !allLoaded()\"\n             class=\"record-thread-load-more d-flex justify-content-center flex-grow-1\">\n            <scrm-button [config]=\"getLoadMoreButton()\"></scrm-button>\n        </div>\n\n\n        <div #item *ngFor=\"let record of records\">\n            <scrm-record-thread-item [config]=\"buildItem(record, item)\"></scrm-record-thread-item>\n        </div>\n\n\n        <div *ngIf=\"direction === 'desc' && !allLoaded()\"\n             class=\"record-thread-load-more d-flex justify-content-center flex-grow-1\">\n            <scrm-button [config]=\"getLoadMoreButton()\"></scrm-button>\n        </div>\n\n    </div>\n\n    <ng-container *ngIf=\"config.create && createStore\">\n\n        <div *ngIf=\"!loading\"\n             class=\"d-flex flex-column record-thread-create-container\">\n\n            <div class=\"flex-grow-1\">\n                <scrm-record-thread-item [config]=\"buildCreateItem()\"></scrm-record-thread-item>\n            </div>\n\n            <div class=\"flex-grow-1 d-flex justify-content-start pt-1 record-thread-create-buttons\">\n                <scrm-button [config]=\"getCreateButton()\"></scrm-button>\n            </div>\n\n        </div>\n\n    </ng-container>\n\n\n</div>\n"
            },] }
];
RecordThreadComponent.ctorParameters = () => [
    { type: RecordThreadStoreFactory },
    { type: RecordThreadItemStoreFactory },
    { type: RecordManager },
    { type: MessageService }
];
RecordThreadComponent.propDecorators = {
    config: [{ type: Input }],
    listContainer: [{ type: ViewChild, args: ['list',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLXRocmVhZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29udGFpbmVycy9yZWNvcmQtdGhyZWFkL2NvbXBvbmVudHMvcmVjb3JkLXRocmVhZC9yZWNvcmQtdGhyZWFkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFnQixTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBcUIsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hHLE9BQU8sRUFBQyxhQUFhLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFFakQsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sdURBQXVELENBQUM7QUFFL0YsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBSXBDLE9BQU8sRUFBQyw0QkFBNEIsRUFBQyxNQUFNLDREQUE0RCxDQUFDO0FBQ3hHLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSw0Q0FBNEMsQ0FBQztBQUN6RSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sOENBQThDLENBQUM7QUFRNUUsTUFBTSxPQUFPLHFCQUFxQjtJQWdCOUIsWUFDYyxZQUFzQyxFQUN0QyxXQUF5QyxFQUN6QyxhQUE0QixFQUM1QixPQUF1QjtRQUh2QixpQkFBWSxHQUFaLFlBQVksQ0FBMEI7UUFDdEMsZ0JBQVcsR0FBWCxXQUFXLENBQThCO1FBQ3pDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBWnJDLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsY0FBUyxHQUFHLEdBQUcsQ0FBQztRQUNoQixjQUFTLEdBQW1CLEtBQUssQ0FBQztRQUN4QixzQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFFMUIsU0FBSSxHQUFt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QUFDLG1CQUFtQixFQUFFLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7SUFHUyxXQUFXO1FBQ2pCLE1BQU0sT0FBTyxHQUFHO1lBQ1osSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO1NBQ3RCLENBQUM7UUFFRixJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7WUFDL0MsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQzFDO1FBRUQsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUUzQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7Z0JBQ3JCLE9BQU87YUFDVjtZQUVELElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztZQUVwQixRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNyQixPQUFPLEdBQUcsT0FBTyxJQUFJLEtBQUssQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDOzs7WUE5UkosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLDZ0R0FBNkM7YUFFaEQ7OztZQWZPLHdCQUF3QjtZQU14Qiw0QkFBNEI7WUFDNUIsYUFBYTtZQUNiLGNBQWM7OztxQkFVakIsS0FBSzs0QkFDTCxTQUFTLFNBQUMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgVmlld0NoaWxkfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Y29tYmluZUxhdGVzdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7UmVjb3JkVGhyZWFkU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL3JlY29yZC10aHJlYWQvcmVjb3JkLXRocmVhZC5zdG9yZSc7XG5pbXBvcnQge1JlY29yZFRocmVhZFN0b3JlRmFjdG9yeX0gZnJvbSAnLi4vLi4vc3RvcmUvcmVjb3JkLXRocmVhZC9yZWNvcmQtdGhyZWFkLnN0b3JlLmZhY3RvcnknO1xuaW1wb3J0IHtSZWNvcmRUaHJlYWRDb25maWd9IGZyb20gJy4vcmVjb3JkLXRocmVhZC5tb2RlbCc7XG5pbXBvcnQge3Rha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7UmVjb3JkVGhyZWFkSXRlbUNvbmZpZ30gZnJvbSAnLi4vcmVjb3JkLXRocmVhZC1pdGVtL3JlY29yZC10aHJlYWQtaXRlbS5tb2RlbCc7XG5pbXBvcnQge1JlY29yZFRocmVhZEl0ZW1TdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvcmVjb3JkLXRocmVhZC9yZWNvcmQtdGhyZWFkLWl0ZW0uc3RvcmUnO1xuaW1wb3J0IHtBdHRyaWJ1dGVNYXAsIEJ1dHRvbkludGVyZmFjZSwgUmVjb3JkLCBWaWV3TW9kZX0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7UmVjb3JkVGhyZWFkSXRlbVN0b3JlRmFjdG9yeX0gZnJvbSAnLi4vLi4vc3RvcmUvcmVjb3JkLXRocmVhZC9yZWNvcmQtdGhyZWFkLWl0ZW0uc3RvcmUuZmFjdG9yeSc7XG5pbXBvcnQge1JlY29yZE1hbmFnZXJ9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL3JlY29yZC9yZWNvcmQubWFuYWdlcic7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9tZXNzYWdlL21lc3NhZ2Uuc2VydmljZSc7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdzY3JtLXJlY29yZC10aHJlYWQnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9yZWNvcmQtdGhyZWFkLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFtdLFxufSlcbmV4cG9ydCBjbGFzcyBSZWNvcmRUaHJlYWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgICBASW5wdXQoKSBjb25maWc6IFJlY29yZFRocmVhZENvbmZpZztcbiAgICBAVmlld0NoaWxkKCdsaXN0JykgbGlzdENvbnRhaW5lcjogRWxlbWVudFJlZjtcblxuICAgIHN0b3JlOiBSZWNvcmRUaHJlYWRTdG9yZTtcbiAgICBjcmVhdGVTdG9yZTogUmVjb3JkVGhyZWFkSXRlbVN0b3JlO1xuICAgIHJlY29yZHM6IFJlY29yZFRocmVhZEl0ZW1TdG9yZVtdO1xuICAgIGxvYWRpbmcgPSBmYWxzZTtcbiAgICBtYXhIZWlnaHQgPSA0MDA7XG4gICAgZGlyZWN0aW9uOiAnYXNjJyB8ICdkZXNjJyA9ICdhc2MnO1xuICAgIHByb3RlY3RlZCBzaG91bGRSZXNldFNjcm9sbCA9IGZhbHNlO1xuXG4gICAgcHJvdGVjdGVkIHN1YnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gICAgcHJvdGVjdGVkIHByZXNldEZpZWxkVmFsdWVzOiBBdHRyaWJ1dGVNYXA7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHN0b3JlRmFjdG9yeTogUmVjb3JkVGhyZWFkU3RvcmVGYWN0b3J5LFxuICAgICAgICBwcm90ZWN0ZWQgaXRlbUZhY3Rvcnk6IFJlY29yZFRocmVhZEl0ZW1TdG9yZUZhY3RvcnksXG4gICAgICAgIHByb3RlY3RlZCByZWNvcmRNYW5hZ2VyOiBSZWNvcmRNYW5hZ2VyLFxuICAgICAgICBwcm90ZWN0ZWQgbWVzc2FnZTogTWVzc2FnZVNlcnZpY2VcbiAgICApIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLm1heEhlaWdodCA9IHRoaXMuY29uZmlnLm1heExpc3RIZWlnaHQgfHwgdGhpcy5tYXhIZWlnaHQ7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5zdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHRoaXMuc3RvcmVGYWN0b3J5LmNyZWF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5tb2R1bGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gdGhpcy5jb25maWcuZGlyZWN0aW9uIHx8IHRoaXMuZGlyZWN0aW9uO1xuXG4gICAgICAgIHRoaXMuc3RvcmUuc2V0TWV0YWRhdGEodGhpcy5jb25maWcuaXRlbUNvbmZpZy5tZXRhZGF0YSk7XG5cbiAgICAgICAgdGhpcy5zdG9yZS5pbml0KHRoaXMuY29uZmlnLm1vZHVsZSwgZmFsc2UpO1xuICAgICAgICB0aGlzLmluaXRDcmVhdGUoKTtcbiAgICAgICAgdGhpcy5pbml0RGF0YVN1YnNjcmlwdGlvbigpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5maWx0ZXJzJCkge1xuXG4gICAgICAgICAgICB0aGlzLnN1YnMucHVzaCh0aGlzLmNvbmZpZy5maWx0ZXJzJC5zdWJzY3JpYmUoZmlsdGVycyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZS5zZXRGaWx0ZXJzKGZpbHRlcnMpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUubG9hZChmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluaXRMb2FkaW5nKCk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICB0aGlzLnNob3VsZFJlc2V0U2Nyb2xsID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yZXNldFNjcm9sbCgpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0b3JlLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuc3RvcmUgPSBudWxsO1xuICAgICAgICB0aGlzLnN1YnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpXG4gICAgfVxuXG4gICAgYnVpbGRJdGVtKGl0ZW06IFJlY29yZFRocmVhZEl0ZW1TdG9yZSwgaXRlbVJlZjogYW55KTogUmVjb3JkVGhyZWFkSXRlbUNvbmZpZyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi50aGlzLmNvbmZpZy5pdGVtQ29uZmlnLFxuICAgICAgICAgICAgc3RvcmU6IGl0ZW0sXG4gICAgICAgICAgICBrbGFzczogJ3JlY29yZC10aHJlYWQtbGlzdC1pdGVtJyxcbiAgICAgICAgICAgIGV4cGFuZGVkOiAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0l0ZW0oaXRlbVJlZik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29sbGFwc2VkOiAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0l0ZW0oaXRlbVJlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gYXMgUmVjb3JkVGhyZWFkSXRlbUNvbmZpZztcbiAgICB9XG5cbiAgICBnZXRMb2FkTW9yZUJ1dHRvbigpOiBCdXR0b25JbnRlcmZhY2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2xhc3M6ICdsb2FkLW1vcmUtYnV0dG9uIGJ0biBidG4tbGluayBidG4tc20nLFxuICAgICAgICAgICAgbGFiZWxLZXk6ICdMQkxfTE9BRF9NT1JFJyxcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLmxvYWRNb3JlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gYXMgQnV0dG9uSW50ZXJmYWNlO1xuICAgIH1cblxuICAgIGJ1aWxkQ3JlYXRlSXRlbSgpOiBSZWNvcmRUaHJlYWRJdGVtQ29uZmlnIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnRoaXMuY29uZmlnLmNyZWF0ZUNvbmZpZyxcbiAgICAgICAgICAgIHN0b3JlOiB0aGlzLmNyZWF0ZVN0b3JlLFxuICAgICAgICAgICAgcm93Q2xhc3M6IHsncHQtMSc6IHRydWV9LFxuICAgICAgICAgICAga2xhc3M6ICdyZWNvcmQtdGhyZWFkLWNyZWF0ZS1pdGVtJyxcbiAgICAgICAgfSBhcyBSZWNvcmRUaHJlYWRJdGVtQ29uZmlnO1xuICAgIH1cblxuICAgIGdldENyZWF0ZUJ1dHRvbigpOiBCdXR0b25JbnRlcmZhY2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2xhc3M6ICdjcmVhdGUtdGhyZWFkLWl0ZW0tYnV0dG9uIGJ0biBidG4tZGFuZ2VyIGJ0bi1zbScsXG4gICAgICAgICAgICBsYWJlbEtleTogJ0xCTF9TVUJNSVRfQlVUVE9OX0xBQkVMJyxcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVN0b3JlLnZhbGlkYXRlKCkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUodmFsaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU3RvcmUuc2F2ZSgpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdFJlY29yZCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG91bGRSZXNldFNjcm9sbCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UuYWRkU3VjY2Vzc01lc3NhZ2VCeUtleSgnTEJMX0FDVElPTl9TVUNDRVNTJylcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlLmFkZFdhcm5pbmdNZXNzYWdlQnlLZXkoJ0xCTF9WQUxJREFUSU9OX0VSUk9SUycpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGFzIEJ1dHRvbkludGVyZmFjZTtcbiAgICB9XG5cbiAgICBhbGxMb2FkZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhISh0aGlzLnN0b3JlICYmIHRoaXMuc3RvcmUuYWxsTG9hZGVkKCkpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0UmVjb3JkKCkge1xuICAgICAgICBjb25zdCBlbXB0eVJlY29yZCA9IHRoaXMucmVjb3JkTWFuYWdlci5idWlsZEVtcHR5UmVjb3JkKHRoaXMuY29uZmlnLm1vZHVsZSk7XG4gICAgICAgIHRoaXMuYWRkUHJlc2V0RmllbGRzKGVtcHR5UmVjb3JkKTtcblxuICAgICAgICBsZXQgbW9kZSA9ICdlZGl0JyBhcyBWaWV3TW9kZTtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmNyZWF0ZUNvbmZpZyAmJiB0aGlzLmNvbmZpZy5jcmVhdGVDb25maWcuaW5pdGlhbE1vZGUpIHtcbiAgICAgICAgICAgIG1vZGUgPSB0aGlzLmNvbmZpZy5jcmVhdGVDb25maWcuaW5pdGlhbE1vZGU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNyZWF0ZVN0b3JlLmluaXRSZWNvcmQoZW1wdHlSZWNvcmQsIG1vZGUsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2Nyb2xsVG9FbmQoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5saXN0Q29udGFpbmVyIHx8ICF0aGlzLmxpc3RDb250YWluZXIubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zY3JvbGxUbyh0aGlzLmxpc3RDb250YWluZXIubmF0aXZlRWxlbWVudC5zY3JvbGxIZWlnaHQpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBzY3JvbGxUb1RvcCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zY3JvbGxUbygwKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2Nyb2xsVG8ocG9zaXRpb246IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5saXN0Q29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gcG9zaXRpb247XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNjcm9sbFRvSXRlbShpdGVtOiBhbnkpIHtcbiAgICAgICAgaWYgKCFpdGVtIHx8ICF0aGlzLmxpc3RDb250YWluZXIgfHwgIXRoaXMubGlzdENvbnRhaW5lci5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbGVtZW50VG9wID0gaXRlbS5vZmZzZXRUb3A7XG4gICAgICAgIGNvbnN0IHBhcmVudFRvcCA9IHRoaXMubGlzdENvbnRhaW5lci5uYXRpdmVFbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgY29uc3QgcmVsYXRpdmVUb3AgPSBlbGVtZW50VG9wIC0gcGFyZW50VG9wO1xuXG4gICAgICAgIHRoaXMuc2Nyb2xsVG8ocmVsYXRpdmVUb3ApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZXNldFNjcm9sbCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc2hvdWxkUmVzZXRTY3JvbGwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09ICdhc2MnKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRvRW5kKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRvVG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNob3VsZFJlc2V0U2Nyb2xsID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNjaGVkdWxlU2Nyb2xsUmVzZXQoKTogdm9pZCB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNldFNjcm9sbCgpO1xuICAgICAgICB9LCA1MDApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0Q3JlYXRlKCkge1xuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmNyZWF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jcmVhdGVTdG9yZSA9IHRoaXMuaXRlbUZhY3RvcnkuY3JlYXRlKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlU3RvcmUuc2V0TWV0YWRhdGEodGhpcy5jb25maWcuY3JlYXRlQ29uZmlnLm1ldGFkYXRhKTtcbiAgICAgICAgdGhpcy5pbml0UmVjb3JkKCk7XG4gICAgICAgIHRoaXMuaW5pdFByZXNldEZpZWxkc01hcHBpbmcoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdFByZXNldEZpZWxkc01hcHBpbmcoKSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5wcmVzZXRGaWVsZHMkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN1YnMucHVzaCh0aGlzLmNvbmZpZy5wcmVzZXRGaWVsZHMkLnN1YnNjcmliZShwcmVzZXRGaWVsZFZhbHVlcyA9PiB7XG5cbiAgICAgICAgICAgIGlmICghcHJlc2V0RmllbGRWYWx1ZXMgfHwgIU9iamVjdC5rZXlzKHByZXNldEZpZWxkVmFsdWVzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucHJlc2V0RmllbGRWYWx1ZXMgPSBwcmVzZXRGaWVsZFZhbHVlcztcblxuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5jcmVhdGVTdG9yZS5yZWNvcmRTdG9yZS5nZXRCYXNlUmVjb3JkKCk7XG4gICAgICAgICAgICB0aGlzLmFkZFByZXNldEZpZWxkcyhyZWNvcmQpO1xuXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVN0b3JlLnJlY29yZFN0b3JlLnNldFJlY29yZChyZWNvcmQpO1xuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFkZFByZXNldEZpZWxkcyhyZWNvcmQ6IFJlY29yZCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMucHJlc2V0RmllbGRWYWx1ZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlY29yZC5hdHRyaWJ1dGVzID0ge1xuICAgICAgICAgICAgLi4udGhpcy5wcmVzZXRGaWVsZFZhbHVlcyxcbiAgICAgICAgICAgIC4uLihyZWNvcmQuYXR0cmlidXRlcyB8fCB7fSlcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCBpbml0RGF0YVN1YnNjcmlwdGlvbigpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLnN1YnMucHVzaCh0aGlzLnN0b3JlLnN0b3JlcyQuc3Vic2NyaWJlKHJlY29yZHMgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMucmVjb3JkcyB8fCAhdGhpcy5yZWNvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvdWxkUmVzZXRTY3JvbGwgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09ICdhc2MnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWNvcmRzID0gcmVjb3Jkcy5yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZVNjcm9sbFJlc2V0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlY29yZHMgPSByZWNvcmRzO1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZVNjcm9sbFJlc2V0KCk7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCBpbml0TG9hZGluZygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbG9hZGluZyA9IFtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuJGxvYWRpbmdcbiAgICAgICAgXTtcblxuICAgICAgICBpZiAodGhpcy5jcmVhdGVTdG9yZSAmJiB0aGlzLmNyZWF0ZVN0b3JlLmxvYWRpbmckKSB7XG4gICAgICAgICAgICBsb2FkaW5nLnB1c2godGhpcy5jcmVhdGVTdG9yZS5sb2FkaW5nJClcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRsb2FkaW5nID0gY29tYmluZUxhdGVzdChsb2FkaW5nKTtcbiAgICAgICAgdGhpcy5zdWJzLnB1c2goJGxvYWRpbmcuc3Vic2NyaWJlKChsb2FkaW5ncykgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIWxvYWRpbmdzIHx8ICFsb2FkaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBsb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGxvYWRpbmdzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgIGxvYWRpbmcgPSBsb2FkaW5nIHx8IHZhbHVlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGxvYWRpbmc7XG4gICAgICAgIH0pKTtcbiAgICB9XG59XG4iXX0=