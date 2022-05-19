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
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, finalize, shareReplay } from 'rxjs/operators';
import { StatisticsBatch } from '../../../../store/statistics/statistics-batch.service';
import { RecordViewStore } from '../../../record/store/record-view/record-view.store';
import { RecordFetchGQL } from '../../../../store/record/graphql/api.record.get';
import { RecordSaveGQL } from '../../../../store/record/graphql/api.record.save';
import { AppStateStore } from '../../../../store/app-state/app-state.store';
import { LanguageStore } from '../../../../store/language/language.store';
import { NavigationStore } from '../../../../store/navigation/navigation.store';
import { ModuleNavigation } from '../../../../services/navigation/module-navigation/module-navigation.service';
import { MetadataStore } from '../../../../store/metadata/metadata.store.service';
import { RecordManager } from '../../../../services/record/record.manager';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { SubpanelStoreFactory } from '../../../../containers/subpanel/store/subpanel/subpanel.store.factory';
import { AuthService } from '../../../../services/auth/auth.service';
import { MessageService } from '../../../../services/message/message.service';
import { RecordStoreFactory } from '../../../../store/record/record.store.factory';
export class CreateViewStore extends RecordViewStore {
    constructor(recordFetchGQL, recordSaveGQL, appStateStore, languageStore, navigationStore, moduleNavigation, metadataStore, localStorage, message, subpanelFactory, recordManager, statisticsBatch, auth, recordStoreFactory) {
        super(recordFetchGQL, recordSaveGQL, appStateStore, languageStore, navigationStore, moduleNavigation, metadataStore, localStorage, message, subpanelFactory, recordManager, statisticsBatch, recordStoreFactory);
        this.recordFetchGQL = recordFetchGQL;
        this.recordSaveGQL = recordSaveGQL;
        this.appStateStore = appStateStore;
        this.languageStore = languageStore;
        this.navigationStore = navigationStore;
        this.moduleNavigation = moduleNavigation;
        this.metadataStore = metadataStore;
        this.localStorage = localStorage;
        this.message = message;
        this.subpanelFactory = subpanelFactory;
        this.recordManager = recordManager;
        this.statisticsBatch = statisticsBatch;
        this.auth = auth;
        this.recordStoreFactory = recordStoreFactory;
    }
    /**
     * Initial record load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} module to use
     * @param {string} recordID to use
     * @param {string} mode to use
     * @param {object} params to set
     * @returns {object} Observable<any>
     */
    init(module, recordID, mode = 'detail', params = {}) {
        this.internalState.module = module;
        this.internalState.recordID = recordID;
        this.setMode(mode);
        this.parseParams(params);
        this.calculateShowWidgets();
        this.showTopWidget = false;
        this.showSubpanels = false;
        this.initRecord(params);
        return this.load();
    }
    save() {
        this.appStateStore.updateLoading(`${this.internalState.module}-record-save-new`, true);
        return this.recordStore.save().pipe(catchError(() => {
            this.message.addDangerMessageByKey('LBL_ERROR_SAVING');
            return of({});
        }), finalize(() => {
            this.setMode('detail');
            this.appStateStore.updateLoading(`${this.internalState.module}-record-save-new`, false);
        }));
    }
    /**
     * Init record using params
     *
     * @param {object} params queryParams
     */
    initRecord(params = {}) {
        const user = this.auth.getCurrentUser();
        const blankRecord = {
            id: '',
            type: '',
            module: this.internalState.module,
            /* eslint-disable camelcase,@typescript-eslint/camelcase */
            attributes: {
                assigned_user_id: user.id,
                assigned_user_name: {
                    id: user.id,
                    user_name: user.userName
                }
            }
            /* eslint-enable camelcase,@typescript-eslint/camelcase */
        };
        this.recordManager.injectParamFields(params, blankRecord, this.getVardefs());
        this.recordStore.init(blankRecord);
    }
    /**
     * Load / reload record using current pagination and criteria
     *
     * @returns {object} Observable<RecordViewState>
     */
    load() {
        return of(this.recordStore.getBaseRecord()).pipe(shareReplay());
    }
    /**
     * Calculate if widgets are to display
     */
    calculateShowWidgets() {
        const show = false;
        this.showSidebarWidgets = show;
        this.widgets = show;
    }
}
CreateViewStore.decorators = [
    { type: Injectable }
];
CreateViewStore.ctorParameters = () => [
    { type: RecordFetchGQL },
    { type: RecordSaveGQL },
    { type: AppStateStore },
    { type: LanguageStore },
    { type: NavigationStore },
    { type: ModuleNavigation },
    { type: MetadataStore },
    { type: LocalStorageService },
    { type: MessageService },
    { type: SubpanelStoreFactory },
    { type: RecordManager },
    { type: StatisticsBatch },
    { type: AuthService },
    { type: RecordStoreFactory }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXZpZXcuc3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvdmlld3MvY3JlYXRlL3N0b3JlL2NyZWF0ZS12aWV3L2NyZWF0ZS12aWV3LnN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBYSxFQUFFLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFakUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHVEQUF1RCxDQUFDO0FBQ3RGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxxREFBcUQsQ0FBQztBQUNwRixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0saURBQWlELENBQUM7QUFDL0UsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGtEQUFrRCxDQUFDO0FBQy9FLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSw2Q0FBNkMsQ0FBQztBQUMxRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFDeEUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLCtDQUErQyxDQUFDO0FBQzlFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDZFQUE2RSxDQUFDO0FBQzdHLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtREFBbUQsQ0FBQztBQUNoRixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sNENBQTRDLENBQUM7QUFDekUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sMERBQTBELENBQUM7QUFDN0YsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUVBQXVFLENBQUM7QUFDM0cs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YixtQkFBbUI7WUFHbkIsY0FBYztZQUZkLG9CQUFvQjtZQUZwQixhQUFhO1lBVGIsZUFBZTtZQVlmLFdBQVc7WUFHWCxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIG9mfSBmcm9tICdyeGpzJztcbmltcG9ydCB7Y2F0Y2hFcnJvciwgZmluYWxpemUsIHNoYXJlUmVwbGF5fSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1BhcmFtc30gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7U3RhdGlzdGljc0JhdGNofSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9zdGF0aXN0aWNzL3N0YXRpc3RpY3MtYmF0Y2guc2VydmljZSc7XG5pbXBvcnQge1JlY29yZFZpZXdTdG9yZX0gZnJvbSAnLi4vLi4vLi4vcmVjb3JkL3N0b3JlL3JlY29yZC12aWV3L3JlY29yZC12aWV3LnN0b3JlJztcbmltcG9ydCB7UmVjb3JkRmV0Y2hHUUx9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3JlY29yZC9ncmFwaHFsL2FwaS5yZWNvcmQuZ2V0JztcbmltcG9ydCB7UmVjb3JkU2F2ZUdRTH0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvcmVjb3JkL2dyYXBocWwvYXBpLnJlY29yZC5zYXZlJztcbmltcG9ydCB7QXBwU3RhdGVTdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvYXBwLXN0YXRlL2FwcC1zdGF0ZS5zdG9yZSc7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmV9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL2xhbmd1YWdlL2xhbmd1YWdlLnN0b3JlJztcbmltcG9ydCB7TmF2aWdhdGlvblN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9uYXZpZ2F0aW9uL25hdmlnYXRpb24uc3RvcmUnO1xuaW1wb3J0IHtNb2R1bGVOYXZpZ2F0aW9ufSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uL21vZHVsZS1uYXZpZ2F0aW9uL21vZHVsZS1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHtNZXRhZGF0YVN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9tZXRhZGF0YS9tZXRhZGF0YS5zdG9yZS5zZXJ2aWNlJztcbmltcG9ydCB7UmVjb3JkTWFuYWdlcn0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZXMvcmVjb3JkL3JlY29yZC5tYW5hZ2VyJztcbmltcG9ydCB7TG9jYWxTdG9yYWdlU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZXMvbG9jYWwtc3RvcmFnZS9sb2NhbC1zdG9yYWdlLnNlcnZpY2UnO1xuaW1wb3J0IHtTdWJwYW5lbFN0b3JlRmFjdG9yeX0gZnJvbSAnLi4vLi4vLi4vLi4vY29udGFpbmVycy9zdWJwYW5lbC9zdG9yZS9zdWJwYW5lbC9zdWJwYW5lbC5zdG9yZS5mYWN0b3J5JztcbmltcG9ydCB7QXV0aFNlcnZpY2V9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL2F1dGgvYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL21lc3NhZ2UvbWVzc2FnZS5zZXJ2aWNlJztcbmltcG9ydCB7UmVjb3JkLCBWaWV3TW9kZX0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7UmVjb3JkU3RvcmVGYWN0b3J5fSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9yZWNvcmQvcmVjb3JkLnN0b3JlLmZhY3RvcnknO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ3JlYXRlVmlld1N0b3JlIGV4dGVuZHMgUmVjb3JkVmlld1N0b3JlIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgcmVjb3JkRmV0Y2hHUUw6IFJlY29yZEZldGNoR1FMLFxuICAgICAgICBwcm90ZWN0ZWQgcmVjb3JkU2F2ZUdRTDogUmVjb3JkU2F2ZUdRTCxcbiAgICAgICAgcHJvdGVjdGVkIGFwcFN0YXRlU3RvcmU6IEFwcFN0YXRlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBsYW5ndWFnZVN0b3JlOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbmF2aWdhdGlvblN0b3JlOiBOYXZpZ2F0aW9uU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBtb2R1bGVOYXZpZ2F0aW9uOiBNb2R1bGVOYXZpZ2F0aW9uLFxuICAgICAgICBwcm90ZWN0ZWQgbWV0YWRhdGFTdG9yZTogTWV0YWRhdGFTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIGxvY2FsU3RvcmFnZTogTG9jYWxTdG9yYWdlU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIG1lc3NhZ2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgc3VicGFuZWxGYWN0b3J5OiBTdWJwYW5lbFN0b3JlRmFjdG9yeSxcbiAgICAgICAgcHJvdGVjdGVkIHJlY29yZE1hbmFnZXI6IFJlY29yZE1hbmFnZXIsXG4gICAgICAgIHByb3RlY3RlZCBzdGF0aXN0aWNzQmF0Y2g6IFN0YXRpc3RpY3NCYXRjaCxcbiAgICAgICAgcHJvdGVjdGVkIGF1dGg6IEF1dGhTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgcmVjb3JkU3RvcmVGYWN0b3J5OiBSZWNvcmRTdG9yZUZhY3RvcnlcbiAgICApIHtcbiAgICAgICAgc3VwZXIoXG4gICAgICAgICAgICByZWNvcmRGZXRjaEdRTCxcbiAgICAgICAgICAgIHJlY29yZFNhdmVHUUwsXG4gICAgICAgICAgICBhcHBTdGF0ZVN0b3JlLFxuICAgICAgICAgICAgbGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgICAgIG5hdmlnYXRpb25TdG9yZSxcbiAgICAgICAgICAgIG1vZHVsZU5hdmlnYXRpb24sXG4gICAgICAgICAgICBtZXRhZGF0YVN0b3JlLFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLFxuICAgICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICAgIHN1YnBhbmVsRmFjdG9yeSxcbiAgICAgICAgICAgIHJlY29yZE1hbmFnZXIsXG4gICAgICAgICAgICBzdGF0aXN0aWNzQmF0Y2gsXG4gICAgICAgICAgICByZWNvcmRTdG9yZUZhY3RvcnlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsIHJlY29yZCBsb2FkIGlmIG5vdCBjYWNoZWQgYW5kIHVwZGF0ZSBzdGF0ZS5cbiAgICAgKiBSZXR1cm5zIG9ic2VydmFibGUgdG8gYmUgdXNlZCBpbiByZXNvbHZlciBpZiBuZWVkZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2R1bGUgdG8gdXNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlY29yZElEIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RlIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgdG8gc2V0XG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxhbnk+XG4gICAgICovXG4gICAgcHVibGljIGluaXQobW9kdWxlOiBzdHJpbmcsIHJlY29yZElEOiBzdHJpbmcsIG1vZGUgPSAnZGV0YWlsJyBhcyBWaWV3TW9kZSwgcGFyYW1zOiBQYXJhbXMgPSB7fSk6IE9ic2VydmFibGU8UmVjb3JkPiB7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxTdGF0ZS5tb2R1bGUgPSBtb2R1bGU7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxTdGF0ZS5yZWNvcmRJRCA9IHJlY29yZElEO1xuICAgICAgICB0aGlzLnNldE1vZGUobW9kZSk7XG4gICAgICAgIHRoaXMucGFyc2VQYXJhbXMocGFyYW1zKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVTaG93V2lkZ2V0cygpO1xuICAgICAgICB0aGlzLnNob3dUb3BXaWRnZXQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zaG93U3VicGFuZWxzID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5pbml0UmVjb3JkKHBhcmFtcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZCgpO1xuICAgIH1cblxuICAgIHNhdmUoKTogT2JzZXJ2YWJsZTxSZWNvcmQ+IHtcbiAgICAgICAgdGhpcy5hcHBTdGF0ZVN0b3JlLnVwZGF0ZUxvYWRpbmcoYCR7dGhpcy5pbnRlcm5hbFN0YXRlLm1vZHVsZX0tcmVjb3JkLXNhdmUtbmV3YCwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVjb3JkU3RvcmUuc2F2ZSgpLnBpcGUoXG4gICAgICAgICAgICBjYXRjaEVycm9yKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UuYWRkRGFuZ2VyTWVzc2FnZUJ5S2V5KCdMQkxfRVJST1JfU0FWSU5HJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mKHt9IGFzIFJlY29yZCk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGZpbmFsaXplKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldE1vZGUoJ2RldGFpbCcgYXMgVmlld01vZGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwU3RhdGVTdG9yZS51cGRhdGVMb2FkaW5nKGAke3RoaXMuaW50ZXJuYWxTdGF0ZS5tb2R1bGV9LXJlY29yZC1zYXZlLW5ld2AsIGZhbHNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdCByZWNvcmQgdXNpbmcgcGFyYW1zXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIHF1ZXJ5UGFyYW1zXG4gICAgICovXG4gICAgcHVibGljIGluaXRSZWNvcmQocGFyYW1zOiBQYXJhbXMgPSB7fSk6IHZvaWQge1xuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy5hdXRoLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgIGNvbnN0IGJsYW5rUmVjb3JkID0ge1xuICAgICAgICAgICAgaWQ6ICcnLFxuICAgICAgICAgICAgdHlwZTogJycsXG4gICAgICAgICAgICBtb2R1bGU6IHRoaXMuaW50ZXJuYWxTdGF0ZS5tb2R1bGUsXG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UsQHR5cGVzY3JpcHQtZXNsaW50L2NhbWVsY2FzZSAqL1xuICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgIGFzc2lnbmVkX3VzZXJfaWQ6IHVzZXIuaWQsXG4gICAgICAgICAgICAgICAgYXNzaWduZWRfdXNlcl9uYW1lOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgICAgICAgICAgICB1c2VyX25hbWU6IHVzZXIudXNlck5hbWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIGNhbWVsY2FzZSxAdHlwZXNjcmlwdC1lc2xpbnQvY2FtZWxjYXNlICovXG4gICAgICAgIH0gYXMgUmVjb3JkO1xuXG4gICAgICAgIHRoaXMucmVjb3JkTWFuYWdlci5pbmplY3RQYXJhbUZpZWxkcyhwYXJhbXMsIGJsYW5rUmVjb3JkLCB0aGlzLmdldFZhcmRlZnMoKSk7XG5cbiAgICAgICAgdGhpcy5yZWNvcmRTdG9yZS5pbml0KGJsYW5rUmVjb3JkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2FkIC8gcmVsb2FkIHJlY29yZCB1c2luZyBjdXJyZW50IHBhZ2luYXRpb24gYW5kIGNyaXRlcmlhXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBPYnNlcnZhYmxlPFJlY29yZFZpZXdTdGF0ZT5cbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZCgpOiBPYnNlcnZhYmxlPFJlY29yZD4ge1xuICAgICAgICByZXR1cm4gb2YodGhpcy5yZWNvcmRTdG9yZS5nZXRCYXNlUmVjb3JkKCkpLnBpcGUoc2hhcmVSZXBsYXkoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlIGlmIHdpZGdldHMgYXJlIHRvIGRpc3BsYXlcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgY2FsY3VsYXRlU2hvd1dpZGdldHMoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNob3cgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zaG93U2lkZWJhcldpZGdldHMgPSBzaG93O1xuICAgICAgICB0aGlzLndpZGdldHMgPSBzaG93O1xuICAgIH1cbn1cbiJdfQ==