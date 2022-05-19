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
import { ListGQL } from '../../record-list/graphql/api.list.get';
import * as i0 from "@angular/core";
import * as i1 from "apollo-angular";
export class FiltersListGQL extends ListGQL {
    constructor(apollo) {
        super(apollo);
        this.apollo = apollo;
    }
    /**
     * Fetch the list of filters from the backend
     *
     * @param {string} module to use
     * @param {object} criteria to use
     * @param {object} sort to use
     * @param {object} pagination to use
     * @returns {object} Observable<any>
     */
    get(module, criteria, sort, pagination) {
        return super.get(module, criteria, sort, pagination);
    }
    /**
     * Map record. Allow for extensions
     * @param record
     */
    mapRecord(record) {
        if (!record) {
            return record;
        }
        record.key = record.id || (record.attributes && record.attributes.id) || '';
        const contents = (record.attributes && record.attributes && record.attributes.contents) || null;
        if (contents) {
            const savedFilter = Object.assign({}, record);
            savedFilter.criteria = contents;
            return savedFilter;
        }
        return record;
    }
}
FiltersListGQL.ɵprov = i0.ɵɵdefineInjectable({ factory: function FiltersListGQL_Factory() { return new FiltersListGQL(i0.ɵɵinject(i1.Apollo)); }, token: FiltersListGQL, providedIn: "root" });
FiltersListGQL.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
FiltersListGQL.ctorParameters = () => [
    { type: Apollo }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmxpc3QuZ2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3N0b3JlL3NhdmVkLWZpbHRlcnMvZ3JhcGhxbC9hcGkubGlzdC5nZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBR3RDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQzs7O0FBTS9ELE1BQU0sT0FBTyxjQUFlLFNBQVEsT0FBTztJQUV2QyxZQUFzQixNQUFjO1FBQ2hDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQURJLFdBQU0sR0FBTixNQUFNLENBQVE7SUFFcEMsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ksR0FBRyxDQUFDLE1BQWMsRUFBRSxRQUF3QixFQUFFLElBQXNCLEVBQUUsVUFBc0I7UUFDL0YsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRDs7O09BR0c7SUFDTyxTQUFTLENBQUMsTUFBVztRQUMzQixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1QsT0FBTyxNQUFNLENBQUM7U0FDakI7UUFFRCxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRTVFLE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxNQUFNLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ2hHLElBQUksUUFBUSxFQUFFO1lBQ1YsTUFBTSxXQUFXLEdBQUcsa0JBQUksTUFBTSxDQUFnQixDQUFDO1lBQy9DLFdBQVcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQ2hDLE9BQU8sV0FBVyxDQUFDO1NBQ3RCO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7OztZQXpDSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQVJPLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Fwb2xsb30gZnJvbSAnYXBvbGxvLWFuZ3VsYXInO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7UGFnaW5hdGlvbiwgU2VhcmNoQ3JpdGVyaWEsIFNvcnRpbmdTZWxlY3Rpb259IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge0xpc3RHUUx9IGZyb20gJy4uLy4uL3JlY29yZC1saXN0L2dyYXBocWwvYXBpLmxpc3QuZ2V0JztcbmltcG9ydCB7U2F2ZWRGaWx0ZXIsIFNhdmVkRmlsdGVyTGlzdH0gZnJvbSAnLi4vc2F2ZWQtZmlsdGVyLm1vZGVsJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBGaWx0ZXJzTGlzdEdRTCBleHRlbmRzIExpc3RHUUwge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGFwb2xsbzogQXBvbGxvKSB7XG4gICAgICAgIHN1cGVyKGFwb2xsbyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2ggdGhlIGxpc3Qgb2YgZmlsdGVycyBmcm9tIHRoZSBiYWNrZW5kXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kdWxlIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjcml0ZXJpYSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc29ydCB0byB1c2VcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFnaW5hdGlvbiB0byB1c2VcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBPYnNlcnZhYmxlPGFueT5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0KG1vZHVsZTogc3RyaW5nLCBjcml0ZXJpYTogU2VhcmNoQ3JpdGVyaWEsIHNvcnQ6IFNvcnRpbmdTZWxlY3Rpb24sIHBhZ2luYXRpb246IFBhZ2luYXRpb24pOiBPYnNlcnZhYmxlPFNhdmVkRmlsdGVyTGlzdD4ge1xuICAgICAgICByZXR1cm4gc3VwZXIuZ2V0KG1vZHVsZSwgY3JpdGVyaWEsIHNvcnQsIHBhZ2luYXRpb24pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1hcCByZWNvcmQuIEFsbG93IGZvciBleHRlbnNpb25zXG4gICAgICogQHBhcmFtIHJlY29yZFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBtYXBSZWNvcmQocmVjb3JkOiBhbnkpOiBTYXZlZEZpbHRlciB7XG4gICAgICAgIGlmICghcmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVjb3JkLmtleSA9IHJlY29yZC5pZCB8fCAocmVjb3JkLmF0dHJpYnV0ZXMgJiYgcmVjb3JkLmF0dHJpYnV0ZXMuaWQpIHx8ICcnO1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnRzID0gKHJlY29yZC5hdHRyaWJ1dGVzICYmIHJlY29yZC5hdHRyaWJ1dGVzICYmIHJlY29yZC5hdHRyaWJ1dGVzLmNvbnRlbnRzKSB8fCBudWxsO1xuICAgICAgICBpZiAoY29udGVudHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHNhdmVkRmlsdGVyID0gey4uLnJlY29yZH0gYXMgU2F2ZWRGaWx0ZXI7XG4gICAgICAgICAgICBzYXZlZEZpbHRlci5jcml0ZXJpYSA9IGNvbnRlbnRzO1xuICAgICAgICAgICAgcmV0dXJuIHNhdmVkRmlsdGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlY29yZDtcbiAgICB9XG59XG4iXX0=