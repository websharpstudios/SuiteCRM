import { Observable } from 'rxjs';
import { Record, ViewFieldDefinition, ViewMode } from 'common';
import { BaseRecordContainerStore } from '../../../../store/record-container/base-record-container.store';
import { RecordPanelMetadata } from './record-panel.store.model';
import * as ɵngcc0 from '@angular/core';
export declare class RecordPanelStore extends BaseRecordContainerStore<RecordPanelMetadata> {
    /**
     * Get view fields observable
     *
     * @returns {object} Observable<ViewFieldDefinition[]>
     */
    getViewFields$(): Observable<ViewFieldDefinition[]>;
    /**
     * Get view fields keys observable
     *
     * @returns {object} Observable<string[]>
     */
    getViewFieldsKeys$(): Observable<string[]>;
    /**
     * Init record
     *
     * @param {object} record to use
     * @param {string} mode to use
     * @param {boolean} loadMetadata to use
     * @returns {object} Observable<any>
     */
    initRecord(record: Record, mode?: ViewMode, loadMetadata?: boolean): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<RecordPanelStore, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<RecordPanelStore>;
}

//# sourceMappingURL=record-panel.store.d.ts.map