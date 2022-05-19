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
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { deepClone, isVoid } from 'common';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { RecordSaveGQL } from '../../../../store/record/graphql/api.record.save';
import { MessageService } from '../../../../services/message/message.service';
import { RecordManager } from '../../../../services/record/record.manager';
import { RecordFetchGQL } from '../../../../store/record/graphql/api.record.get';
import { RecordStoreFactory } from '../../../../store/record/record.store.factory';
import { LanguageStore } from '../../../../store/language/language.store';
const initialState = {
    loading: false,
    mode: 'detail',
    params: {
        returnModule: '',
        returnId: '',
        returnAction: ''
    }
};
export class InstallViewStore {
    constructor(recordFetchGQL, recordSaveGQL, message, recordManager, recordStoreFactory, language) {
        this.recordFetchGQL = recordFetchGQL;
        this.recordSaveGQL = recordSaveGQL;
        this.message = message;
        this.recordManager = recordManager;
        this.recordStoreFactory = recordStoreFactory;
        this.language = language;
        /** Internal Properties */
        this.cache$ = null;
        this.internalState = deepClone(initialState);
        this.store = new BehaviorSubject(this.internalState);
        this.state$ = this.store.asObservable();
        this.subs = [];
        this.recordStore = recordStoreFactory.create(this.getViewFieldsObservable());
        this.record$ = this.recordStore.state$.pipe(distinctUntilChanged());
        this.stagingRecord$ = this.recordStore.staging$.pipe(distinctUntilChanged());
        this.loading$ = this.state$.pipe(map(state => state.loading));
        this.mode$ = this.state$.pipe(map(state => state.mode));
        this.vm$ = combineLatest([this.record$, this.loading$]).pipe(map(([record, loading]) => {
            this.vm = { record, loading };
            return this.vm;
        }));
        this.viewContext$ = this.record$.pipe(map(() => {
            return this.getViewContext();
        }));
    }
    get params() {
        return this.internalState.params || {};
    }
    set params(params) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { params }));
    }
    getViewContext() {
        return {
            record: this.getBaseRecord()
        };
    }
    getActions() {
        return of([]);
    }
    /**
     * Initial install view
     *
     * @param {string} mode to use
     * @param {object} params to set
     */
    init(mode = 'edit', params = {}) {
        this.setMode(mode);
        this.recordStore.init({
            id: '',
            module: 'install',
            attributes: {}
        });
    }
    /**
     * Clear observable cache
     */
    clear() {
        this.cache$ = null;
        this.updateState(deepClone(initialState));
    }
    /**
     * Clear
     */
    clearAuthBased() {
        this.clear();
    }
    /**
     * Get staging record
     *
     * @returns {string} ViewMode
     */
    getBaseRecord() {
        if (!this.internalState) {
            return null;
        }
        return this.recordStore.getBaseRecord();
    }
    /**
     * Get current view mode
     *
     * @returns {string} ViewMode
     */
    getMode() {
        if (!this.internalState) {
            return null;
        }
        return this.internalState.mode;
    }
    /**
     * Set new mode
     *
     * @param {string} mode ViewMode
     */
    setMode(mode) {
        this.updateState(Object.assign(Object.assign({}, this.internalState), { mode }));
    }
    getLicenseText() {
        return this.language.getFieldLabel('SUITE8_LICENSE_CONTENT');
    }
    getMetadata() {
        return {
            actions: [],
            templateMeta: {
                maxColumns: 2,
                useTabs: true,
                tabDefs: {
                    LBL_LICENSE: {
                        newTab: true,
                        panelDefault: 'expanded'
                    },
                    LBL_CONFIG: {
                        newTab: true,
                        panelDefault: 'expanded'
                    }
                }
            },
            panels: [
                {
                    key: 'LBL_LICENSE',
                    rows: [
                        {
                            cols: [
                                {
                                    name: 'site_license',
                                    label: 'LBL_LICENSE_TITLE_2',
                                    type: 'html',
                                    display: 'readonly',
                                    fieldDefinition: {
                                        name: "site_license",
                                        vname: "LBL_LICENSE_TITLE_2",
                                        type: "html",
                                        default: this.getLicenseText(),
                                    },
                                },
                                {
                                    name: 'license_check',
                                    label: 'LBL_LICENSE_I_ACCEPT',
                                    type: 'boolean',
                                    required: true,
                                    fieldDefinition: {
                                        name: "license_check",
                                        vname: "LBL_LICENSE_I_ACCEPT",
                                        type: "boolean",
                                        required: true,
                                        value: 'false',
                                        default: 'false'
                                    },
                                }
                            ]
                        },
                        {
                            cols: []
                        }
                    ]
                },
                {
                    key: 'LBL_CONFIG',
                    rows: [
                        {
                            cols: [
                                {
                                    name: 'site_host',
                                    label: 'LBL_SITECFG_URL',
                                    type: 'varchar',
                                    fieldDefinition: {
                                        "name": "site_host",
                                        "vname": "LBL_SITECFG_URL",
                                        "type": "varchar",
                                        "required": true,
                                    },
                                },
                                {
                                    name: 'demoData',
                                    label: 'LBL_DBCONF_DEMO_DATA',
                                    type: 'enum',
                                    fieldDefinition: {
                                        name: "demoData",
                                        vname: "LBL_DBCONF_DEMO_DATA",
                                        type: "enum",
                                        options: "__no_options__",
                                        required: true,
                                        metadata: {
                                            extraOptions: [
                                                {
                                                    value: "yes",
                                                    labelKey: "LBL_YES",
                                                },
                                                {
                                                    value: "no",
                                                    labelKey: "LBL_NO",
                                                },
                                            ]
                                        }
                                    },
                                },
                            ]
                        },
                        {
                            cols: [
                                {
                                    name: 'db_config',
                                    label: 'LBL_DBCONF_TITLE',
                                    type: 'grouped-field',
                                    fieldDefinition: {
                                        name: "db_config",
                                        vname: "LBL_DBCONF_TITLE",
                                        type: "grouped-field",
                                        layout: [
                                            "db_username",
                                            "db_password",
                                            "db_host",
                                            "db_name",
                                            "db_port"
                                        ],
                                        display: "vertical",
                                        groupFields: {
                                            "db_username": {
                                                "name": "db_username",
                                                "type": "varchar",
                                                "vname": "LBL_DBCONF_SUITE_DB_USER",
                                                "labelKey": "LBL_DBCONF_SUITE_DB_USER",
                                                "label": "LBL_DBCONF_SUITE_DB_USER",
                                                "showLabel": ["*"],
                                                "required": true,
                                            },
                                            "db_password": {
                                                "name": "db_password",
                                                "type": "password",
                                                "vname": "LBL_DBCONF_DB_PASSWORD",
                                                "labelKey": "LBL_DBCONF_DB_PASSWORD",
                                                "showLabel": ["*"],
                                                "required": true,
                                            },
                                            "db_host": {
                                                "name": "db_host",
                                                "type": "varchar",
                                                "vname": "LBL_DBCONF_HOST_NAME",
                                                "labelKey": "LBL_DBCONF_HOST_NAME",
                                                "showLabel": ["*"],
                                                "required": true,
                                            },
                                            "db_name": {
                                                "name": "db_name",
                                                "type": "varchar",
                                                "vname": "LBL_DBCONF_DB_NAME",
                                                "labelKey": "LBL_DBCONF_DB_NAME",
                                                "showLabel": ["*"],
                                                "required": true,
                                            },
                                            "db_port": {
                                                "name": "db_port",
                                                "type": "varchar",
                                                "vname": "LBL_DBCONF_DB_PORT",
                                                "labelKey": "LBL_DBCONF_DB_PORT",
                                                "showLabel": ["*"],
                                                "required": false
                                            }
                                        },
                                        showLabel: {
                                            edit: ['*']
                                        }
                                    },
                                },
                                {
                                    name: 'admin_config',
                                    label: 'LBL_SITECFG_TITLE',
                                    type: 'grouped-field',
                                    fieldDefinition: {
                                        name: "admin_config",
                                        vname: "LBL_SITECFG_TITLE",
                                        type: "grouped-field",
                                        layout: [
                                            "site_username",
                                            "site_password",
                                        ],
                                        display: "vertical",
                                        groupFields: {
                                            "site_username": {
                                                "name": "site_username",
                                                "type": "varchar",
                                                "vname": "LBL_SITECFG_ADMIN_Name",
                                                "labelKey": "LBL_SITECFG_ADMIN_Name",
                                                "showLabel": ["edit"],
                                                "required": true,
                                            },
                                            "site_password": {
                                                "name": "site_password",
                                                "type": "password",
                                                "vname": "LBL_SITECFG_ADMIN_PASS",
                                                "labelKey": "LBL_SITECFG_ADMIN_PASS",
                                                "showLabel": ["edit"],
                                                "required": true,
                                            },
                                        },
                                        showLabel: {
                                            edit: ['*']
                                        }
                                    },
                                }
                            ]
                        }
                    ]
                }
            ],
        };
    }
    getMetadata$() {
        return of(this.getMetadata());
    }
    getModuleName() {
        return 'install';
    }
    /**
     * Parse query params
     *
     * @param {object} params to set
     */
    parseParams(params = {}) {
        if (!params) {
            return;
        }
        const currentParams = Object.assign({}, this.internalState.params);
        Object.keys(params).forEach(paramKey => {
            if (!isVoid(currentParams[paramKey])) {
                currentParams[paramKey] = params[paramKey];
                return;
            }
        });
        this.params = params;
    }
    /**
     * Update the state
     *
     * @param {object} state to set
     */
    updateState(state) {
        this.store.next(this.internalState = state);
    }
    getIgnoreSystemChecksField() {
        return this.recordStore.getStaging().fields['sys_check_option'];
    }
    /**
     * Get view fields observable
     *
     * @returns {object} Observable<ViewFieldDefinition[]>
     */
    getViewFieldsObservable() {
        return this.getMetadata$().pipe(map((meta) => {
            const fields = [];
            meta.panels.forEach(panel => {
                panel.rows.forEach(row => {
                    row.cols.forEach(col => {
                        fields.push(col);
                    });
                });
            });
            fields.push({
                "name": "sys_check_option",
                "type": "boolean",
                fieldDefinition: {
                    "name": "sys_check_option",
                    "type": "boolean",
                    "vname": "LBL_SYS_CHECK_WARNING",
                    "labelKey": "LBL_SYS_CHECK_WARNING",
                    "showLabel": ["edit"],
                    "required": false,
                    "value": 'false',
                    "default": 'false'
                }
            });
            return fields;
        }));
    }
}
InstallViewStore.decorators = [
    { type: Injectable }
];
InstallViewStore.ctorParameters = () => [
    { type: RecordFetchGQL },
    { type: RecordSaveGQL },
    { type: MessageService },
    { type: RecordManager },
    { type: RecordStoreFactory },
    { type: LanguageStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC12aWV3LnN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3ZpZXdzL2luc3RhbGwvc3RvcmUvaW5zdGFsbC12aWV3L2luc3RhbGwtdmlldy5zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBYyxFQUFFLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFDbEYsT0FBTyxFQUVILFNBQVMsRUFJVCxNQUFNLEVBU1QsTUFBTSxRQUFRLENBQUM7QUFDaEIsT0FBTyxFQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBR3pELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxrREFBa0QsQ0FBQztBQUUvRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sOENBQThDLENBQUM7QUFDNUUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDRDQUE0QyxDQUFDO0FBRXpFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxpREFBaUQsQ0FBQztBQUUvRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSwrQ0FBK0MsQ0FBQztBQUNqRixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFFeEUsTUFBTSxZQUFZLEdBQXFCO0lBQ25DLE9BQU8sRUFBRSxLQUFLO0lBQ2QsSUFBSSxFQUFFLFFBQVE7SUFDZCxNQUFNLEVBQUU7UUFDSixZQUFZLEVBQUUsRUFBRTtRQUNoQixRQUFRLEVBQUUsRUFBRTtRQUNaLFlBQVksRUFBRSxFQUFFO0tBQ25CO0NBQ0osQ0FBQztBQUdGLE1BQU0sT0FBTyxnQkFBZ0I7SUF5QnpCLFlBQ2MsY0FBOEIsRUFDOUIs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LE9BQU8sRUFBRSx1QkFBdUI7b0JBQ2hDLFVBQVUsRUFBRSx1QkFBdUI7b0JBQ25DLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQztvQkFDckIsVUFBVSxFQUFFLEtBQUs7b0JBQ2pCLE9BQU8sRUFBRSxPQUFPO29CQUNoQixTQUFTLEVBQUUsT0FBTztpQkFDckI7YUFDbUIsQ0FDM0IsQ0FBQztZQUVGLE9BQU8sTUFBTSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDOzs7WUExYUosVUFBVTs7O1lBZkgsY0FBYztZQUxkLGFBQWE7WUFFYixjQUFjO1lBQ2QsYUFBYTtZQUliLGtCQUFrQjtZQUNsQixhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIG9mLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgICBBY3Rpb24sXG4gICAgZGVlcENsb25lLFxuICAgIEZpZWxkLFxuICAgIEZpZWxkRGVmaW5pdGlvbixcbiAgICBGaWVsZE1ldGFkYXRhLFxuICAgIGlzVm9pZCxcbiAgICBPcHRpb24sXG4gICAgUGFuZWwsXG4gICAgUGFuZWxDZWxsLFxuICAgIFBhbmVsUm93LFxuICAgIFJlY29yZCxcbiAgICBWaWV3Q29udGV4dCxcbiAgICBWaWV3RmllbGREZWZpbml0aW9uLFxuICAgIFZpZXdNb2RlXG59IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge2Rpc3RpbmN0VW50aWxDaGFuZ2VkLCBtYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7SW5zdGFsbFZpZXdNZXRhZGF0YSwgSW5zdGFsbFZpZXdNb2RlbCwgSW5zdGFsbFZpZXdTdGF0ZX0gZnJvbSAnLi9pbnN0YWxsLXZpZXcuc3RvcmUubW9kZWwnO1xuaW1wb3J0IHtTdGF0ZVN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9zdGF0ZSc7XG5pbXBvcnQge1JlY29yZFNhdmVHUUx9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3JlY29yZC9ncmFwaHFsL2FwaS5yZWNvcmQuc2F2ZSc7XG5pbXBvcnQge1JlY29yZFRlbXBsYXRlTWV0YWRhdGEsIFRhYkRlZmluaXRpb24sIFRhYkRlZmluaXRpb25zfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9tZXRhZGF0YS9tZXRhZGF0YS5zdG9yZS5zZXJ2aWNlJztcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL21lc3NhZ2UvbWVzc2FnZS5zZXJ2aWNlJztcbmltcG9ydCB7UmVjb3JkTWFuYWdlcn0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZXMvcmVjb3JkL3JlY29yZC5tYW5hZ2VyJztcbmltcG9ydCB7UmVjb3JkU3RvcmV9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3JlY29yZC9yZWNvcmQuc3RvcmUnO1xuaW1wb3J0IHtSZWNvcmRGZXRjaEdRTH0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvcmVjb3JkL2dyYXBocWwvYXBpLnJlY29yZC5nZXQnO1xuaW1wb3J0IHtQYXJhbXN9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge1JlY29yZFN0b3JlRmFjdG9yeX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvcmVjb3JkL3JlY29yZC5zdG9yZS5mYWN0b3J5JztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuXG5jb25zdCBpbml0aWFsU3RhdGU6IEluc3RhbGxWaWV3U3RhdGUgPSB7XG4gICAgbG9hZGluZzogZmFsc2UsXG4gICAgbW9kZTogJ2RldGFpbCcsXG4gICAgcGFyYW1zOiB7XG4gICAgICAgIHJldHVybk1vZHVsZTogJycsXG4gICAgICAgIHJldHVybklkOiAnJyxcbiAgICAgICAgcmV0dXJuQWN0aW9uOiAnJ1xuICAgIH1cbn07XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBJbnN0YWxsVmlld1N0b3JlIGltcGxlbWVudHMgU3RhdGVTdG9yZSB7XG5cbiAgICAvKipcbiAgICAgKiBQdWJsaWMgbG9uZy1saXZlZCBvYnNlcnZhYmxlIHN0cmVhbXNcbiAgICAgKi9cbiAgICByZWNvcmQkOiBPYnNlcnZhYmxlPFJlY29yZD47XG4gICAgc3RhZ2luZ1JlY29yZCQ6IE9ic2VydmFibGU8UmVjb3JkPjtcbiAgICBsb2FkaW5nJDogT2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICBtb2RlJDogT2JzZXJ2YWJsZTxWaWV3TW9kZT47XG4gICAgdmlld0NvbnRleHQkOiBPYnNlcnZhYmxlPFZpZXdDb250ZXh0PjtcblxuICAgIC8qKlxuICAgICAqIFZpZXctbW9kZWwgdGhhdCByZXNvbHZlcyBvbmNlIGFsbCB0aGUgZGF0YSBpcyByZWFkeSAob3IgdXBkYXRlZCkuXG4gICAgICovXG4gICAgdm0kOiBPYnNlcnZhYmxlPEluc3RhbGxWaWV3TW9kZWw+O1xuICAgIHZtOiBJbnN0YWxsVmlld01vZGVsO1xuICAgIHJlY29yZFN0b3JlOiBSZWNvcmRTdG9yZTtcblxuICAgIC8qKiBJbnRlcm5hbCBQcm9wZXJ0aWVzICovXG4gICAgcHJvdGVjdGVkIGNhY2hlJDogT2JzZXJ2YWJsZTxhbnk+ID0gbnVsbDtcbiAgICBwcm90ZWN0ZWQgaW50ZXJuYWxTdGF0ZTogSW5zdGFsbFZpZXdTdGF0ZSA9IGRlZXBDbG9uZShpbml0aWFsU3RhdGUpO1xuICAgIHByb3RlY3RlZCBzdG9yZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8SW5zdGFsbFZpZXdTdGF0ZT4odGhpcy5pbnRlcm5hbFN0YXRlKTtcbiAgICBwcm90ZWN0ZWQgc3RhdGUkID0gdGhpcy5zdG9yZS5hc09ic2VydmFibGUoKTtcbiAgICBwcm90ZWN0ZWQgc3ViczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgcmVjb3JkRmV0Y2hHUUw6IFJlY29yZEZldGNoR1FMLFxuICAgICAgICBwcm90ZWN0ZWQgcmVjb3JkU2F2ZUdRTDogUmVjb3JkU2F2ZUdRTCxcbiAgICAgICAgcHJvdGVjdGVkIG1lc3NhZ2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgcmVjb3JkTWFuYWdlcjogUmVjb3JkTWFuYWdlcixcbiAgICAgICAgcHJvdGVjdGVkIHJlY29yZFN0b3JlRmFjdG9yeTogUmVjb3JkU3RvcmVGYWN0b3J5LFxuICAgICAgICBwcm90ZWN0ZWQgbGFuZ3VhZ2U6IExhbmd1YWdlU3RvcmVcbiAgICApIHtcblxuICAgICAgICB0aGlzLnJlY29yZFN0b3JlID0gcmVjb3JkU3RvcmVGYWN0b3J5LmNyZWF0ZSh0aGlzLmdldFZpZXdGaWVsZHNPYnNlcnZhYmxlKCkpO1xuXG4gICAgICAgIHRoaXMucmVjb3JkJCA9IHRoaXMucmVjb3JkU3RvcmUuc3RhdGUkLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG4gICAgICAgIHRoaXMuc3RhZ2luZ1JlY29yZCQgPSB0aGlzLnJlY29yZFN0b3JlLnN0YWdpbmckLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG4gICAgICAgIHRoaXMubG9hZGluZyQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5sb2FkaW5nKSk7XG4gICAgICAgIHRoaXMubW9kZSQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5tb2RlKSk7XG5cbiAgICAgICAgdGhpcy52bSQgPSBjb21iaW5lTGF0ZXN0KFt0aGlzLnJlY29yZCQsIHRoaXMubG9hZGluZyRdKS5waXBlKFxuICAgICAgICAgICAgbWFwKChbcmVjb3JkLCBsb2FkaW5nXSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudm0gPSB7cmVjb3JkLCBsb2FkaW5nfSBhcyBJbnN0YWxsVmlld01vZGVsO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZtO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgIHRoaXMudmlld0NvbnRleHQkID0gdGhpcy5yZWNvcmQkLnBpcGUobWFwKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFZpZXdDb250ZXh0KCk7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBnZXQgcGFyYW1zKCk6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN0YXRlLnBhcmFtcyB8fCB7fTtcbiAgICB9XG5cbiAgICBzZXQgcGFyYW1zKHBhcmFtczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHtcbiAgICAgICAgICAgIC4uLnRoaXMuaW50ZXJuYWxTdGF0ZSxcbiAgICAgICAgICAgIHBhcmFtc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRWaWV3Q29udGV4dCgpOiBWaWV3Q29udGV4dCB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZWNvcmQ6IHRoaXMuZ2V0QmFzZVJlY29yZCgpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0QWN0aW9ucygpOiBPYnNlcnZhYmxlPEFjdGlvbltdPiB7XG4gICAgICAgIHJldHVybiBvZihbXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbCBpbnN0YWxsIHZpZXdcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RlIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgdG8gc2V0XG4gICAgICovXG4gICAgcHVibGljIGluaXQobW9kZSA9ICdlZGl0JyBhcyBWaWV3TW9kZSwgcGFyYW1zOiBQYXJhbXMgPSB7fSk6IHZvaWQge1xuICAgICAgICB0aGlzLnNldE1vZGUobW9kZSk7XG4gICAgICAgIHRoaXMucmVjb3JkU3RvcmUuaW5pdCh7XG4gICAgICAgICAgICBpZDogJycsXG4gICAgICAgICAgICBtb2R1bGU6ICdpbnN0YWxsJyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHt9XG4gICAgICAgIH0gYXMgUmVjb3JkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhciBvYnNlcnZhYmxlIGNhY2hlXG4gICAgICovXG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNhY2hlJCA9IG51bGw7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoZGVlcENsb25lKGluaXRpYWxTdGF0ZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFyXG4gICAgICovXG4gICAgY2xlYXJBdXRoQmFzZWQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgc3RhZ2luZyByZWNvcmRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFZpZXdNb2RlXG4gICAgICovXG4gICAgZ2V0QmFzZVJlY29yZCgpOiBSZWNvcmQge1xuICAgICAgICBpZiAoIXRoaXMuaW50ZXJuYWxTdGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucmVjb3JkU3RvcmUuZ2V0QmFzZVJlY29yZCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBjdXJyZW50IHZpZXcgbW9kZVxuICAgICAqXG4gICAgICogQHJldHVybnMge3N0cmluZ30gVmlld01vZGVcbiAgICAgKi9cbiAgICBnZXRNb2RlKCk6IFZpZXdNb2RlIHtcbiAgICAgICAgaWYgKCF0aGlzLmludGVybmFsU3RhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsU3RhdGUubW9kZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgbmV3IG1vZGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RlIFZpZXdNb2RlXG4gICAgICovXG4gICAgc2V0TW9kZShtb2RlOiBWaWV3TW9kZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKHsuLi50aGlzLmludGVybmFsU3RhdGUsIG1vZGV9KTtcbiAgICB9XG5cbiAgICBnZXRMaWNlbnNlVGV4dCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5sYW5ndWFnZS5nZXRGaWVsZExhYmVsKCdTVUlURThfTElDRU5TRV9DT05URU5UJyk7XG4gICAgfVxuXG4gICAgZ2V0TWV0YWRhdGEoKTogSW5zdGFsbFZpZXdNZXRhZGF0YSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhY3Rpb25zOiBbXSxcbiAgICAgICAgICAgIHRlbXBsYXRlTWV0YToge1xuICAgICAgICAgICAgICAgIG1heENvbHVtbnM6IDIsXG4gICAgICAgICAgICAgICAgdXNlVGFiczogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0YWJEZWZzOiB7XG4gICAgICAgICAgICAgICAgICAgIExCTF9MSUNFTlNFOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdUYWI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYW5lbERlZmF1bHQ6ICdleHBhbmRlZCdcbiAgICAgICAgICAgICAgICAgICAgfSBhcyBUYWJEZWZpbml0aW9uLFxuICAgICAgICAgICAgICAgICAgICBMQkxfQ09ORklHOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdUYWI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYW5lbERlZmF1bHQ6ICdleHBhbmRlZCdcbiAgICAgICAgICAgICAgICAgICAgfSBhcyBUYWJEZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgfSBhcyBUYWJEZWZpbml0aW9uc1xuICAgICAgICAgICAgfSBhcyBSZWNvcmRUZW1wbGF0ZU1ldGFkYXRhLFxuICAgICAgICAgICAgcGFuZWxzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdMQkxfTElDRU5TRScsXG4gICAgICAgICAgICAgICAgICAgIHJvd3M6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdzaXRlX2xpY2Vuc2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdMQkxfTElDRU5TRV9USVRMRV8yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdodG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdyZWFkb25seScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZERlZmluaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNpdGVfbGljZW5zZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZuYW1lOiBcIkxCTF9MSUNFTlNFX1RJVExFXzJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aGlzLmdldExpY2Vuc2VUZXh0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIEZpZWxkRGVmaW5pdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBQYW5lbENlbGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdsaWNlbnNlX2NoZWNrJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnTEJMX0xJQ0VOU0VfSV9BQ0NFUFQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZERlZmluaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImxpY2Vuc2VfY2hlY2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bmFtZTogXCJMQkxfTElDRU5TRV9JX0FDQ0VQVFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnZmFsc2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6ICdmYWxzZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgRmllbGREZWZpbml0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFBhbmVsQ2VsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0gYXMgUGFuZWxDZWxsW11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgUGFuZWxSb3csXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sczogW10gYXMgUGFuZWxDZWxsW11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgUGFuZWxSb3dcbiAgICAgICAgICAgICAgICAgICAgXSBhcyBQYW5lbFJvd1tdXG4gICAgICAgICAgICAgICAgfSBhcyBQYW5lbCxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ0xCTF9DT05GSUcnLFxuICAgICAgICAgICAgICAgICAgICByb3dzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnc2l0ZV9ob3N0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnTEJMX1NJVEVDRkdfVVJMJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd2YXJjaGFyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkRGVmaW5pdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInNpdGVfaG9zdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidm5hbWVcIjogXCJMQkxfU0lURUNGR19VUkxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ2YXJjaGFyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBGaWVsZERlZmluaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgUGFuZWxDZWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnZGVtb0RhdGEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdMQkxfREJDT05GX0RFTU9fREFUQScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZW51bScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZERlZmluaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImRlbW9EYXRhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5hbWU6IFwiTEJMX0RCQ09ORl9ERU1PX0RBVEFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImVudW1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBcIl9fbm9fb3B0aW9uc19fXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFPcHRpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwieWVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxLZXk6IFwiTEJMX1lFU1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBPcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwibm9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbEtleTogXCJMQkxfTk9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgT3B0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdIGFzIE9wdGlvbltdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBGaWVsZE1ldGFkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIEZpZWxkRGVmaW5pdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBQYW5lbENlbGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdkYl9jb25maWcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdMQkxfREJDT05GX1RJVExFJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdncm91cGVkLWZpZWxkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkRGVmaW5pdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiZGJfY29uZmlnXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm5hbWU6IFwiTEJMX0RCQ09ORl9USVRMRVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZ3JvdXBlZC1maWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRiX3VzZXJuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGJfcGFzc3dvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYl9ob3N0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGJfbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRiX3BvcnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJ2ZXJ0aWNhbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwRmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGJfdXNlcm5hbWVcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZGJfdXNlcm5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInZhcmNoYXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidm5hbWVcIjogXCJMQkxfREJDT05GX1NVSVRFX0RCX1VTRVJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGFiZWxLZXlcIjogXCJMQkxfREJDT05GX1NVSVRFX0RCX1VTRVJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJMQkxfREJDT05GX1NVSVRFX0RCX1VTRVJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2hvd0xhYmVsXCI6IFtcIipcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGJfcGFzc3dvcmRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZGJfcGFzc3dvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInBhc3N3b3JkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZuYW1lXCI6IFwiTEJMX0RCQ09ORl9EQl9QQVNTV09SRFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJsYWJlbEtleVwiOiBcIkxCTF9EQkNPTkZfREJfUEFTU1dPUkRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2hvd0xhYmVsXCI6IFtcIipcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGJfaG9zdFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJkYl9ob3N0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ2YXJjaGFyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZuYW1lXCI6IFwiTEJMX0RCQ09ORl9IT1NUX05BTUVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGFiZWxLZXlcIjogXCJMQkxfREJDT05GX0hPU1RfTkFNRVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaG93TGFiZWxcIjogW1wiKlwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYl9uYW1lXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImRiX25hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInZhcmNoYXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidm5hbWVcIjogXCJMQkxfREJDT05GX0RCX05BTUVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGFiZWxLZXlcIjogXCJMQkxfREJDT05GX0RCX05BTUVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2hvd0xhYmVsXCI6IFtcIipcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGJfcG9ydFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJkYl9wb3J0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ2YXJjaGFyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZuYW1lXCI6IFwiTEJMX0RCQ09ORl9EQl9QT1JUXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsS2V5XCI6IFwiTEJMX0RCQ09ORl9EQl9QT1JUXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNob3dMYWJlbFwiOiBbXCIqXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93TGFiZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdDogWycqJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIEZpZWxkRGVmaW5pdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBhcyBQYW5lbENlbGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdhZG1pbl9jb25maWcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdMQkxfU0lURUNGR19USVRMRScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ3JvdXBlZC1maWVsZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZERlZmluaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImFkbWluX2NvbmZpZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZuYW1lOiBcIkxCTF9TSVRFQ0ZHX1RJVExFXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJncm91cGVkLWZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0OiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2l0ZV91c2VybmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNpdGVfcGFzc3dvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwidmVydGljYWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cEZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNpdGVfdXNlcm5hbWVcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic2l0ZV91c2VybmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidmFyY2hhclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2bmFtZVwiOiBcIkxCTF9TSVRFQ0ZHX0FETUlOX05hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGFiZWxLZXlcIjogXCJMQkxfU0lURUNGR19BRE1JTl9OYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNob3dMYWJlbFwiOiBbXCJlZGl0XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNpdGVfcGFzc3dvcmRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic2l0ZV9wYXNzd29yZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicGFzc3dvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidm5hbWVcIjogXCJMQkxfU0lURUNGR19BRE1JTl9QQVNTXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsS2V5XCI6IFwiTEJMX1NJVEVDRkdfQURNSU5fUEFTU1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzaG93TGFiZWxcIjogW1wiZWRpdFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dMYWJlbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0OiBbJyonXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgRmllbGREZWZpbml0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGFzIFBhbmVsQ2VsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0gYXMgUGFuZWxDZWxsW11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgUGFuZWxSb3dcbiAgICAgICAgICAgICAgICAgICAgXSBhcyBQYW5lbFJvd1tdXG4gICAgICAgICAgICAgICAgfSBhcyBQYW5lbFxuICAgICAgICAgICAgXSBhcyBQYW5lbFtdLFxuICAgICAgICB9IGFzIEluc3RhbGxWaWV3TWV0YWRhdGE7XG4gICAgfVxuXG4gICAgZ2V0TWV0YWRhdGEkKCk6IE9ic2VydmFibGU8SW5zdGFsbFZpZXdNZXRhZGF0YT4ge1xuICAgICAgICByZXR1cm4gb2YodGhpcy5nZXRNZXRhZGF0YSgpKTtcbiAgICB9XG5cbiAgICBnZXRNb2R1bGVOYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnaW5zdGFsbCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgcXVlcnkgcGFyYW1zXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIHRvIHNldFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBwYXJzZVBhcmFtcyhwYXJhbXM6IFBhcmFtcyA9IHt9KTogdm9pZCB7XG4gICAgICAgIGlmICghcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJyZW50UGFyYW1zID0gey4uLnRoaXMuaW50ZXJuYWxTdGF0ZS5wYXJhbXN9O1xuICAgICAgICBPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2gocGFyYW1LZXkgPT4ge1xuICAgICAgICAgICAgaWYgKCFpc1ZvaWQoY3VycmVudFBhcmFtc1twYXJhbUtleV0pKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFBhcmFtc1twYXJhbUtleV0gPSBwYXJhbXNbcGFyYW1LZXldO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBzdGF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHN0YXRlIHRvIHNldFxuICAgICAqL1xuICAgIHByb3RlY3RlZCB1cGRhdGVTdGF0ZShzdGF0ZTogSW5zdGFsbFZpZXdTdGF0ZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0b3JlLm5leHQodGhpcy5pbnRlcm5hbFN0YXRlID0gc3RhdGUpO1xuICAgIH1cblxuICAgIGdldElnbm9yZVN5c3RlbUNoZWNrc0ZpZWxkKCk6IEZpZWxkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVjb3JkU3RvcmUuZ2V0U3RhZ2luZygpLmZpZWxkc1snc3lzX2NoZWNrX29wdGlvbiddO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB2aWV3IGZpZWxkcyBvYnNlcnZhYmxlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBPYnNlcnZhYmxlPFZpZXdGaWVsZERlZmluaXRpb25bXT5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0Vmlld0ZpZWxkc09ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxWaWV3RmllbGREZWZpbml0aW9uW10+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TWV0YWRhdGEkKCkucGlwZShtYXAoKG1ldGE6IEluc3RhbGxWaWV3TWV0YWRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkczogVmlld0ZpZWxkRGVmaW5pdGlvbltdID0gW107XG4gICAgICAgICAgICBtZXRhLnBhbmVscy5mb3JFYWNoKHBhbmVsID0+IHtcbiAgICAgICAgICAgICAgICBwYW5lbC5yb3dzLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcm93LmNvbHMuZm9yRWFjaChjb2wgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzLnB1c2goY29sKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZmllbGRzLnB1c2goXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzeXNfY2hlY2tfb3B0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIixcbiAgICAgICAgICAgICAgICAgICAgZmllbGREZWZpbml0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzeXNfY2hlY2tfb3B0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInZuYW1lXCI6IFwiTEJMX1NZU19DSEVDS19XQVJOSU5HXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhYmVsS2V5XCI6IFwiTEJMX1NZU19DSEVDS19XQVJOSU5HXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNob3dMYWJlbFwiOiBbXCJlZGl0XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogJ2ZhbHNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVmYXVsdFwiOiAnZmFsc2UnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGFzIFZpZXdGaWVsZERlZmluaXRpb25cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgICAgIH0pKTtcbiAgICB9XG59XG4iXX0=