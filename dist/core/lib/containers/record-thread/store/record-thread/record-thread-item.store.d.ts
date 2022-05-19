import { Observable } from 'rxjs';
import { Record, ViewFieldDefinition, ViewMode } from 'common';
import { RecordThreadItemMetadata } from './record-thread-item.store.model';
import { BaseRecordContainerStore } from '../../../../store/record-container/base-record-container.store';
import * as ɵngcc0 from '@angular/core';
export declare class RecordThreadItemStore extends BaseRecordContainerStore<RecordThreadItemMetadata> {
    /**
     * Get view fields observable
     *
     * @returns {object} Observable<ViewFieldDefinition[]>
     */
    getViewFields$(): Observable<ViewFieldDefinition[]>;
    /**
     * Init record
     *
     * @param {object} record to use
     * @param {string} mode to use
     * @param {boolean} loadMetadata to use
     * @returns {object} Observable<any>
     */
    initRecord(record: Record, mode?: ViewMode, loadMetadata?: boolean): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<RecordThreadItemStore, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<RecordThreadItemStore>;
}

//# sourceMappingURL=record-thread-item.store.d.ts.map