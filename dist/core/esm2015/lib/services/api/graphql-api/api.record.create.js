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
import * as i0 from "@angular/core";
import * as i1 from "apollo-angular";
export class EntityMutationGQL {
    constructor(apollo) {
        this.apollo = apollo;
    }
    /**
     * Create record on the backend
     *
     * @param {string} graphqlEntityName to use
     * @param {string} entityName to use
     * @param {object} input values
     * @param {object} metadata with the fields to ask for
     *
     * @returns {object} Observable<any>
     */
    create(graphqlEntityName, entityName, input, metadata) {
        const fields = metadata.fields;
        const mutationOptions = {
            mutation: gql `
                mutation create${entityName}($input: create${entityName}Input!) {
                  create${entityName}(input: $input) {
                    ${graphqlEntityName} {
                      ${fields.join('\n')}
                    }
                    clientMutationId
                  }
                }
            `,
            variables: {
                input
            },
        };
        return this.apollo.mutate(mutationOptions);
    }
}
EntityMutationGQL.ɵprov = i0.ɵɵdefineInjectable({ factory: function EntityMutationGQL_Factory() { return new EntityMutationGQL(i0.ɵɵinject(i1.Apollo)); }, token: EntityMutationGQL, providedIn: "root" });
EntityMutationGQL.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
EntityMutationGQL.ctorParameters = () => [
    { type: Apollo }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnJlY29yZC5jcmVhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc2VydmljZXMvYXBpL2dyYXBocWwtYXBpL2FwaS5yZWNvcmQuY3JlYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0QyxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUM7OztBQU85QixNQUFNLE9BQU8saUJBQWlCO0lBRTFCLFlBQW9CLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQ2xDLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSSxNQUFNLENBQUMsaUJBQXlCLEVBQ3pCLFVBQWtCLEVBQ2xCLEtBQTZCLEVBQzdCLFFBQThCO1FBRXhDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDL0IsTUFBTSxlQUFlLEdBQUc7WUFDcEIsUUFBUSxFQUFFLEdBQUcsQ0FBQTtpQ0FDUSxVQUFVLGtCQUFrQixVQUFVOzBCQUM3QyxVQUFVO3NCQUNkLGlCQUFpQjt3QkFDZixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzs7Ozs7YUFLNUI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1AsS0FBSzthQUNSO1NBQ0osQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7OztZQXpDSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQVBPLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Fwb2xsb30gZnJvbSAnYXBvbGxvLWFuZ3VsYXInO1xuaW1wb3J0IGdxbCBmcm9tICdncmFwaHFsLXRhZyc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtGZXRjaFJlc3VsdH0gZnJvbSAnQGFwb2xsby9jbGllbnQvY29yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgRW50aXR5TXV0YXRpb25HUUwge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhcG9sbG86IEFwb2xsbykge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSByZWNvcmQgb24gdGhlIGJhY2tlbmRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBncmFwaHFsRW50aXR5TmFtZSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZW50aXR5TmFtZSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gaW5wdXQgdmFsdWVzXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG1ldGFkYXRhIHdpdGggdGhlIGZpZWxkcyB0byBhc2sgZm9yXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBPYnNlcnZhYmxlPGFueT5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3JlYXRlKGdyYXBocWxFbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICBlbnRpdHlOYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICBpbnB1dDogeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcbiAgICAgICAgICAgICAgICAgIG1ldGFkYXRhOiB7IGZpZWxkczogc3RyaW5nW10gfSk6IE9ic2VydmFibGU8RmV0Y2hSZXN1bHQ8YW55Pj4ge1xuXG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IG1ldGFkYXRhLmZpZWxkcztcbiAgICAgICAgY29uc3QgbXV0YXRpb25PcHRpb25zID0ge1xuICAgICAgICAgICAgbXV0YXRpb246IGdxbGBcbiAgICAgICAgICAgICAgICBtdXRhdGlvbiBjcmVhdGUke2VudGl0eU5hbWV9KCRpbnB1dDogY3JlYXRlJHtlbnRpdHlOYW1lfUlucHV0ISkge1xuICAgICAgICAgICAgICAgICAgY3JlYXRlJHtlbnRpdHlOYW1lfShpbnB1dDogJGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICR7Z3JhcGhxbEVudGl0eU5hbWV9IHtcbiAgICAgICAgICAgICAgICAgICAgICAke2ZpZWxkcy5qb2luKCdcXG4nKX1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjbGllbnRNdXRhdGlvbklkXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYCxcbiAgICAgICAgICAgIHZhcmlhYmxlczoge1xuICAgICAgICAgICAgICAgIGlucHV0XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFwb2xsby5tdXRhdGUobXV0YXRpb25PcHRpb25zKTtcbiAgICB9XG59XG4iXX0=