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
import { BehaviorSubject, Observable } from 'rxjs';
import { EntityGQL } from '../../services/api/graphql-api/api.entity.get';
import { Action, ColumnDefinition, FieldDefinitionMap, ListViewMeta, MassUpdateMeta, Panel, SearchMeta, SubPanelMeta, WidgetMetadata } from 'common';
import { StateStore } from '../state';
import { AppStateStore } from '../app-state/app-state.store';
import * as ɵngcc0 from '@angular/core';
export interface SummaryTemplates {
    [key: string]: string;
}
export interface RecordViewMetadata {
    topWidget?: WidgetMetadata;
    sidebarWidgets?: WidgetMetadata[];
    actions?: Action[];
    templateMeta?: RecordTemplateMetadata;
    panels?: Panel[];
    summaryTemplates?: SummaryTemplates;
    vardefs?: FieldDefinitionMap;
}
export interface RecordTemplateMetadata {
    maxColumns: number;
    useTabs: boolean;
    tabDefs: TabDefinitions;
}
export interface TabDefinitions {
    [key: string]: TabDefinition;
}
export interface TabDefinition {
    newTab: boolean;
    panelDefault: 'expanded' | 'collapsed';
}
export interface Metadata {
    detailView?: any;
    editView?: any;
    listView?: ListViewMeta;
    search?: SearchMeta;
    recordView?: RecordViewMetadata;
    subPanel?: SubPanelMeta;
    massUpdate?: MassUpdateMeta;
}
export interface MetadataCache {
    [key: string]: BehaviorSubject<Metadata>;
}
export declare class MetadataStore implements StateStore {
    protected recordGQL: EntityGQL;
    protected appState: AppStateStore;
    /**
     * Public long-lived observable streams
     */
    listViewColumns$: Observable<ColumnDefinition[]>;
    listViewLineActions$: Observable<Action[]>;
    listMetadata$: Observable<ListViewMeta>;
    searchMetadata$: Observable<SearchMeta>;
    recordViewMetadata$: Observable<RecordViewMetadata>;
    metadata$: Observable<Metadata>;
    subPanelMetadata$: Observable<SubPanelMeta>;
    protected store: BehaviorSubject<Metadata>;
    protected state$: Observable<Metadata>;
    protected resourceName: string;
    protected fieldsMetadata: {
        fields: string[];
    };
    protected types: string[];
    constructor(recordGQL: EntityGQL, appState: AppStateStore);
    /**
     * Clear state
     */
    clear(): void;
    clearAuthBased(): void;
    /**
     * Get all metadata types
     *
     * @returns {string[]} metadata types
     */
    getMetadataTypes(): string[];
    get(): Metadata;
    /**
     * Initial ListViewMeta load if not cached and update state.
     *
     * @param {string} moduleID to fetch
     * @param {string[]} types to fetch
     * @returns any data
     */
    load(moduleID: string, types: string[]): any;
    /**
     * Get ListViewMeta cached Observable or call the backend
     *
     * @param {string} module to fetch
     * @param {string[]} types to retrieve
     * @returns {object} Observable<any>
     */
    getMetadata(module: string, types?: string[]): Observable<Metadata>;
    /**
     * Internal API
     */
    /**
     * Update the state
     *
     * @param {object} state to set
     */
    protected updateState(state: Metadata): void;
    /**
     * Fetch the Metadata from the backend
     *
     * @param {string} module to fetch
     * @param {string[]} types to retrieve
     * @returns {object} Observable<{}>
     */
    protected fetchMetadata(module: string, types: string[]): Observable<Metadata>;
    protected parseListViewMetadata(data: any, metadata: Metadata): void;
    protected parseSearchMetadata(data: any, metadata: Metadata): void;
    protected parseSubPanelMetadata(data: any, metadata: Metadata): void;
    protected parseMassUpdateMetadata(data: any, metadata: Metadata): void;
    protected parseRecordViewMetadata(data: any, metadata: Metadata): void;
    protected addDefinedMeta(metadata: {
        [key: string]: any;
    }, received: {
        [key: string]: any;
    }, keyMap: {
        [key: string]: string;
    }): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<MetadataStore, never>;
}

//# sourceMappingURL=metadata.store.service.d.ts.map