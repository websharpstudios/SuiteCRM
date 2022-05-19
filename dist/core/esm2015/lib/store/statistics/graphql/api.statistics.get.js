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
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "apollo-angular";
export class StatisticsFetchGQL {
    constructor(apollo) {
        this.apollo = apollo;
    }
    /**
     * Fetch statistics data from backend
     *
     * @param {string} module name
     * @param {object} queries to use
     * @returns {object} Observable<ApolloQueryResult<any>>
     */
    fetch(module, queries) {
        const queryOptions = {
            query: gql `
            query getBatchedStatistics($module: String!, $queries: Iterable!){
              getBatchedStatistics(module: $module, queries: $queries) {
                  _id
                  id
                  items
              }
            }
        `,
            variables: {
                module,
                queries,
            },
        };
        return this.apollo.query(queryOptions).pipe(map((result) => {
            const statistics = {};
            const response = (result.data && result.data.getBatchedStatistics) || {};
            const items = response.items || {};
            const itemKeys = Object.keys(items);
            if (itemKeys && itemKeys.length) {
                itemKeys.forEach((itemKey) => {
                    const item = items[itemKey];
                    // eslint-disable-next-line no-underscore-dangle
                    const key = itemKey || item._id;
                    statistics[key] = {
                        // eslint-disable-next-line no-underscore-dangle
                        id: item._id,
                        data: item.data,
                        metadata: item.metadata
                    };
                });
            }
            return statistics;
        }));
    }
}
StatisticsFetchGQL.ɵprov = i0.ɵɵdefineInjectable({ factory: function StatisticsFetchGQL_Factory() { return new StatisticsFetchGQL(i0.ɵɵinject(i1.Apollo)); }, token: StatisticsFetchGQL, providedIn: "root" });
StatisticsFetchGQL.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
StatisticsFetchGQL.ctorParameters = () => [
    { type: Apollo }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnN0YXRpc3RpY3MuZ2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3N0b3JlL3N0YXRpc3RpY3MvZ3JhcGhxbC9hcGkuc3RhdGlzdGljcy5nZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3RDLE9BQU8sR0FBRyxNQUFNLGFBQWEsQ0FBQztBQUc5QixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7OztBQU1uQyxNQUFNLE9BQU8sa0JBQWtCO0lBRTNCLFlBQW9CLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQ2xDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxLQUFLLENBQ1IsTUFBYyxFQUNkLE9BQTJCO1FBRzNCLE1BQU0sWUFBWSxHQUFHO1lBQ2pCLEtBQUssRUFBRSxHQUFHLENBQUE7Ozs7Ozs7O1NBUWI7WUFDRyxTQUFTLEVBQUU7Z0JBQ1AsTUFBTTtnQkFDTixPQUFPO2FBQ1Y7U0FDSixDQUFDO1FBRUYsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBOEIsRUFBRSxFQUFFO1lBRS9FLE1BQU0sVUFBVSxHQUFrQixFQUFFLENBQUM7WUFDckMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFTLENBQUM7WUFDaEYsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFTLENBQUM7WUFDMUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVwQyxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO2dCQUM3QixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBZSxFQUFFLEVBQUU7b0JBQ2pDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDNUIsZ0RBQWdEO29CQUNoRCxNQUFNLEdBQUcsR0FBRyxPQUFPLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQztvQkFDaEMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHO3dCQUNkLGdEQUFnRDt3QkFDaEQsRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHO3dCQUNaLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTt3QkFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7cUJBQ2IsQ0FBQztnQkFDbkIsQ0FBQyxDQUFDLENBQUM7YUFDTjtZQUNELE9BQU8sVUFBVSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDOzs7O1lBMURKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7O1lBVE8sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QXBvbGxvfSBmcm9tICdhcG9sbG8tYW5ndWxhcic7XG5pbXBvcnQgZ3FsIGZyb20gJ2dyYXBocWwtdGFnJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1N0YXRpc3RpYywgU3RhdGlzdGljc01hcCwgU3RhdGlzdGljc1F1ZXJ5TWFwfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7QXBvbGxvUXVlcnlSZXN1bHR9IGZyb20gJ0BhcG9sbG8vY2xpZW50L2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFN0YXRpc3RpY3NGZXRjaEdRTCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwb2xsbzogQXBvbGxvKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2ggc3RhdGlzdGljcyBkYXRhIGZyb20gYmFja2VuZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZHVsZSBuYW1lXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHF1ZXJpZXMgdG8gdXNlXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxBcG9sbG9RdWVyeVJlc3VsdDxhbnk+PlxuICAgICAqL1xuICAgIHB1YmxpYyBmZXRjaChcbiAgICAgICAgbW9kdWxlOiBzdHJpbmcsXG4gICAgICAgIHF1ZXJpZXM6IFN0YXRpc3RpY3NRdWVyeU1hcCxcbiAgICApOiBPYnNlcnZhYmxlPFN0YXRpc3RpY3NNYXA+IHtcblxuICAgICAgICBjb25zdCBxdWVyeU9wdGlvbnMgPSB7XG4gICAgICAgICAgICBxdWVyeTogZ3FsYFxuICAgICAgICAgICAgcXVlcnkgZ2V0QmF0Y2hlZFN0YXRpc3RpY3MoJG1vZHVsZTogU3RyaW5nISwgJHF1ZXJpZXM6IEl0ZXJhYmxlISl7XG4gICAgICAgICAgICAgIGdldEJhdGNoZWRTdGF0aXN0aWNzKG1vZHVsZTogJG1vZHVsZSwgcXVlcmllczogJHF1ZXJpZXMpIHtcbiAgICAgICAgICAgICAgICAgIF9pZFxuICAgICAgICAgICAgICAgICAgaWRcbiAgICAgICAgICAgICAgICAgIGl0ZW1zXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgYCxcbiAgICAgICAgICAgIHZhcmlhYmxlczoge1xuICAgICAgICAgICAgICAgIG1vZHVsZSxcbiAgICAgICAgICAgICAgICBxdWVyaWVzLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdGhpcy5hcG9sbG8ucXVlcnkocXVlcnlPcHRpb25zKS5waXBlKG1hcCgocmVzdWx0OiBBcG9sbG9RdWVyeVJlc3VsdDxhbnk+KSA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXRpc3RpY3M6IFN0YXRpc3RpY3NNYXAgPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gKHJlc3VsdC5kYXRhICYmIHJlc3VsdC5kYXRhLmdldEJhdGNoZWRTdGF0aXN0aWNzKSB8fCB7fSBhcyBhbnk7XG4gICAgICAgICAgICBjb25zdCBpdGVtcyA9IHJlc3BvbnNlLml0ZW1zIHx8IHt9IGFzIGFueTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1LZXlzID0gT2JqZWN0LmtleXMoaXRlbXMpO1xuXG4gICAgICAgICAgICBpZiAoaXRlbUtleXMgJiYgaXRlbUtleXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaXRlbUtleXMuZm9yRWFjaCgoaXRlbUtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtc1tpdGVtS2V5XTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVyc2NvcmUtZGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGl0ZW1LZXkgfHwgaXRlbS5faWQ7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRpc3RpY3Nba2V5XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlcnNjb3JlLWRhbmdsZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGl0ZW0uX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogaXRlbS5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGE6IGl0ZW0ubWV0YWRhdGFcbiAgICAgICAgICAgICAgICAgICAgfSBhcyBTdGF0aXN0aWM7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RhdGlzdGljcztcbiAgICAgICAgfSkpO1xuICAgIH1cbn1cbiJdfQ==