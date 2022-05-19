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
import { HistoryTimelineEntry } from './history-sidebar-widget.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Record, ViewContext } from 'common';
import { HistoryTimelineStoreFactory } from './history-timeline.store.factory';
import * as ɵngcc0 from '@angular/core';
export declare type ActivityTypes = 'calls' | 'tasks' | 'meetings' | 'history' | 'audit' | 'notes' | string;
export declare class HistoryTimelineAdapter {
    protected historyTimelineStoreFactory: HistoryTimelineStoreFactory;
    loading: boolean;
    cache: HistoryTimelineEntry[];
    dataStream: BehaviorSubject<HistoryTimelineEntry[]>;
    dataStream$: Observable<HistoryTimelineEntry[]>;
    private defaultPageSize;
    private store;
    constructor(historyTimelineStoreFactory: HistoryTimelineStoreFactory);
    /**
     * @returns {void}
     * @param {ViewContext} context - parent module context
     * @description adapter init function to initialize timeline store
     */
    init(context: ViewContext): void;
    /**
     * @returns {Observable<HistoryTimelineEntry[]>} return observable array of timeline entries
     * @description retrieve next set of records starting from the current offset
     * represented by the field this.cache.length
     * @param {boolean} reload timeline
     */
    fetchTimelineEntries(reload: boolean): Observable<HistoryTimelineEntry[]>;
    /**
     * @returns {string} color code
     * @param {string} activity the valid activity types
     * @description {returns the mapped background color code defined for an activity}
     */
    getActivityGridColor(activity: ActivityTypes): string;
    /**
     * @returns {HistoryTimelineEntry} Timeline Entry
     * @param {Record} record object
     * @description {returns the mapped record to timeline entry}
     */
    buildTimelineEntry(record: Record): HistoryTimelineEntry;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<HistoryTimelineAdapter, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDeclaration<HistoryTimelineAdapter>;
}

//# sourceMappingURL=history-timeline.adapter.service.d.ts.map