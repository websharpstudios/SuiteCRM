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
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { deepClone } from 'common';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "apollo-angular";
export class RecordSaveGQL {
    constructor(apollo) {
        this.apollo = apollo;
    }
    /**
     * Save record on the backend
     *
     * @param {object} record to save
     *
     * @returns {object} Observable<Record>
     */
    save(record) {
        const input = {
            module: record.module,
            attributes: deepClone(record.attributes),
        };
        if (record.id) {
            // eslint-disable-next-line no-underscore-dangle
            input._id = record.id;
        }
        const mutationOptions = {
            mutation: gql `
                mutation saveRecord($input: saveRecordInput!) {
                    saveRecord(input: $input) {
                        record {
                            attributes
                            id
                            _id
                            module
                            acls
                        }
                    }
                }
            `,
            variables: {
                input
            },
        };
        return this.apollo.mutate(mutationOptions).pipe(map((result) => this.mapToRecord(result)));
    }
    mapToRecord(response) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        if (!response.data || !response.data.saveRecord || !response.data.saveRecord.record) {
            return null;
        }
        return {
            // eslint-disable-next-line no-underscore-dangle
            id: response.data.saveRecord.record._id,
            type: (_d = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.saveRecord) === null || _b === void 0 ? void 0 : _b.record) === null || _c === void 0 ? void 0 : _c.type) !== null && _d !== void 0 ? _d : '',
            module: (_h = (_g = (_f = (_e = response === null || response === void 0 ? void 0 : response.data) === null || _e === void 0 ? void 0 : _e.saveRecord) === null || _f === void 0 ? void 0 : _f.record) === null || _g === void 0 ? void 0 : _g.module) !== null && _h !== void 0 ? _h : '',
            attributes: (_m = (_l = (_k = (_j = response === null || response === void 0 ? void 0 : response.data) === null || _j === void 0 ? void 0 : _j.saveRecord) === null || _k === void 0 ? void 0 : _k.record) === null || _l === void 0 ? void 0 : _l.attributes) !== null && _m !== void 0 ? _m : [],
            acls: (_r = (_q = (_p = (_o = response === null || response === void 0 ? void 0 : response.data) === null || _o === void 0 ? void 0 : _o.saveRecord) === null || _p === void 0 ? void 0 : _p.record) === null || _q === void 0 ? void 0 : _q.acls) !== null && _r !== void 0 ? _r : [],
        };
    }
}
RecordSaveGQL.ɵprov = i0.ɵɵdefineInjectable({ factory: function RecordSaveGQL_Factory() { return new RecordSaveGQL(i0.ɵɵinject(i1.Apollo)); }, token: RecordSaveGQL, providedIn: "root" });
RecordSaveGQL.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
RecordSaveGQL.ctorParameters = () => [
    { type: Apollo }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnJlY29yZC5zYXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3N0b3JlL3JlY29yZC9ncmFwaHFsL2FwaS5yZWNvcmQuc2F2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEMsT0FBTyxHQUFHLE1BQU0sYUFBYSxDQUFDO0FBRTlCLE9BQU8sRUFBQyxTQUFTLEVBQVMsTUFBTSxRQUFRLENBQUM7QUFDekMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7QUFZbkMsTUFBTSxPQUFPLGFBQWE7SUFFdEIsWUFBc0IsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7SUFDcEMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLElBQUksQ0FBQyxNQUFjO1FBRXRCLE1BQU0sS0FBSyxHQUFjO1lBQ3JCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtZQUNyQixVQUFVLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7U0FDM0MsQ0FBQztRQUVGLElBQUksTUFBTSxDQUFDLEVBQUUsRUFBRTtZQUNYLGdEQUFnRDtZQUNoRCxLQUFLLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUM7U0FDekI7UUFFRCxNQUFNLGVBQWUsR0FBRztZQUNwQixRQUFRLEVBQUUsR0FBRyxDQUFBOzs7Ozs7Ozs7Ozs7YUFZWjtZQUNELFNBQVMsRUFBRTtnQkFDUCxLQUFLO2FBQ1I7U0FDSixDQUFDO1FBRUYsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBOEIsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkgsQ0FBQztJQUVTLFdBQVcsQ0FBQyxRQUFnQzs7UUFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUNqRixPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQsT0FBTztZQUNILGdEQUFnRDtZQUNoRCxFQUFFLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUc7WUFDdkMsSUFBSSxFQUFFLE1BQUEsTUFBQSxNQUFBLE1BQUEsUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLElBQUksMENBQUUsVUFBVSwwQ0FBRSxNQUFNLDBDQUFFLElBQUksbUNBQUksRUFBRTtZQUNwRCxNQUFNLEVBQUUsTUFBQSxNQUFBLE1BQUEsTUFBQSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsSUFBSSwwQ0FBRSxVQUFVLDBDQUFFLE1BQU0sMENBQUUsTUFBTSxtQ0FBSSxFQUFFO1lBQ3hELFVBQVUsRUFBRSxNQUFBLE1BQUEsTUFBQSxNQUFBLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxJQUFJLDBDQUFFLFVBQVUsMENBQUUsTUFBTSwwQ0FBRSxVQUFVLG1DQUFJLEVBQUU7WUFDaEUsSUFBSSxFQUFFLE1BQUEsTUFBQSxNQUFBLE1BQUEsUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLElBQUksMENBQUUsVUFBVSwwQ0FBRSxNQUFNLDBDQUFFLElBQUksbUNBQUksRUFBRTtTQUM3QyxDQUFDO0lBQ2hCLENBQUM7Ozs7WUE5REosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFmTyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBcG9sbG99IGZyb20gJ2Fwb2xsby1hbmd1bGFyJztcbmltcG9ydCBncWwgZnJvbSAnZ3JhcGhxbC10YWcnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZGVlcENsb25lLCBSZWNvcmR9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtBcG9sbG9RdWVyeVJlc3VsdH0gZnJvbSAnQGFwb2xsby9jbGllbnQvY29yZSc7XG5cbmludGVyZmFjZSBTYXZlSW5wdXQge1xuICAgIG1vZHVsZTogc3RyaW5nO1xuICAgIGF0dHJpYnV0ZXM6IHsgW2tleTogc3RyaW5nXTogYW55IH07XG4gICAgX2lkPzogc3RyaW5nO1xufVxuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFJlY29yZFNhdmVHUUwge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGFwb2xsbzogQXBvbGxvKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2F2ZSByZWNvcmQgb24gdGhlIGJhY2tlbmRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWNvcmQgdG8gc2F2ZVxuICAgICAqXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxSZWNvcmQ+XG4gICAgICovXG4gICAgcHVibGljIHNhdmUocmVjb3JkOiBSZWNvcmQpOiBPYnNlcnZhYmxlPFJlY29yZD4ge1xuXG4gICAgICAgIGNvbnN0IGlucHV0OiBTYXZlSW5wdXQgPSB7XG4gICAgICAgICAgICBtb2R1bGU6IHJlY29yZC5tb2R1bGUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBkZWVwQ2xvbmUocmVjb3JkLmF0dHJpYnV0ZXMpLFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChyZWNvcmQuaWQpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlcnNjb3JlLWRhbmdsZVxuICAgICAgICAgICAgaW5wdXQuX2lkID0gcmVjb3JkLmlkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbXV0YXRpb25PcHRpb25zID0ge1xuICAgICAgICAgICAgbXV0YXRpb246IGdxbGBcbiAgICAgICAgICAgICAgICBtdXRhdGlvbiBzYXZlUmVjb3JkKCRpbnB1dDogc2F2ZVJlY29yZElucHV0ISkge1xuICAgICAgICAgICAgICAgICAgICBzYXZlUmVjb3JkKGlucHV0OiAkaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY29yZCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNsc1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYCxcbiAgICAgICAgICAgIHZhcmlhYmxlczoge1xuICAgICAgICAgICAgICAgIGlucHV0XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFwb2xsby5tdXRhdGUobXV0YXRpb25PcHRpb25zKS5waXBlKG1hcCgocmVzdWx0OiBBcG9sbG9RdWVyeVJlc3VsdDxhbnk+KSA9PiB0aGlzLm1hcFRvUmVjb3JkKHJlc3VsdCkpKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbWFwVG9SZWNvcmQocmVzcG9uc2U6IEFwb2xsb1F1ZXJ5UmVzdWx0PGFueT4pOiBSZWNvcmQge1xuICAgICAgICBpZiAoIXJlc3BvbnNlLmRhdGEgfHwgIXJlc3BvbnNlLmRhdGEuc2F2ZVJlY29yZCB8fCAhcmVzcG9uc2UuZGF0YS5zYXZlUmVjb3JkLnJlY29yZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVyc2NvcmUtZGFuZ2xlXG4gICAgICAgICAgICBpZDogcmVzcG9uc2UuZGF0YS5zYXZlUmVjb3JkLnJlY29yZC5faWQsXG4gICAgICAgICAgICB0eXBlOiByZXNwb25zZT8uZGF0YT8uc2F2ZVJlY29yZD8ucmVjb3JkPy50eXBlID8/ICcnLFxuICAgICAgICAgICAgbW9kdWxlOiByZXNwb25zZT8uZGF0YT8uc2F2ZVJlY29yZD8ucmVjb3JkPy5tb2R1bGUgPz8gJycsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiByZXNwb25zZT8uZGF0YT8uc2F2ZVJlY29yZD8ucmVjb3JkPy5hdHRyaWJ1dGVzID8/IFtdLFxuICAgICAgICAgICAgYWNsczogcmVzcG9uc2U/LmRhdGE/LnNhdmVSZWNvcmQ/LnJlY29yZD8uYWNscyA/PyBbXSxcbiAgICAgICAgfSBhcyBSZWNvcmQ7XG4gICAgfVxufVxuIl19