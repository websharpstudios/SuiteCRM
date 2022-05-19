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
import { RecordSaveGQL } from '../../../../../store/record/graphql/api.record.save';
import * as i0 from "@angular/core";
import * as i1 from "apollo-angular";
export class SavedFilterSaveGQL extends RecordSaveGQL {
    constructor(apollo) {
        super(apollo);
        this.apollo = apollo;
    }
    save(record) {
        return super.save(record);
    }
    mapToRecord(response) {
        if (!response.data || !response.data.saveRecord || !response.data.saveRecord.record) {
            return null;
        }
        const savedFilter = {
            // eslint-disable-next-line no-underscore-dangle
            id: response.data.saveRecord.record._id,
            type: response.data.saveRecord.record.type || '',
            module: response.data.saveRecord.record.module || '',
            attributes: response.data.saveRecord.record.attributes || null,
        };
        savedFilter.key = savedFilter.id || (savedFilter.attributes && savedFilter.attributes.id) || '';
        const contents = (savedFilter.attributes && savedFilter.attributes.contents) || null;
        if (contents) {
            savedFilter.criteria = contents;
        }
        return savedFilter;
    }
}
SavedFilterSaveGQL.ɵprov = i0.ɵɵdefineInjectable({ factory: function SavedFilterSaveGQL_Factory() { return new SavedFilterSaveGQL(i0.ɵɵinject(i1.Apollo)); }, token: SavedFilterSaveGQL, providedIn: "root" });
SavedFilterSaveGQL.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
SavedFilterSaveGQL.ctorParameters = () => [
    { type: Apollo }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnNhdmVkLWZpbHRlcnMuc2F2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb250YWluZXJzL2xpc3QtZmlsdGVyL3N0b3JlL3NhdmVkLWZpbHRlci9ncmFwaHFsL2FwaS5zYXZlZC1maWx0ZXJzLnNhdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBR3RDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxxREFBcUQsQ0FBQzs7O0FBT2xGLE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxhQUFhO0lBRWpELFlBQXNCLE1BQWM7UUFDaEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBREksV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUVwQyxDQUFDO0lBRU0sSUFBSSxDQUFDLE1BQWM7UUFDdEIsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFUyxXQUFXLENBQUMsUUFBZ0M7UUFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUNqRixPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQsTUFBTSxXQUFXLEdBQUc7WUFDaEIsZ0RBQWdEO1lBQ2hELEVBQUUsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRztZQUN2QyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFO1lBQ2hELE1BQU0sRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLEVBQUU7WUFDcEQsVUFBVSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksSUFBSTtTQUNsRCxDQUFDO1FBRWpCLFdBQVcsQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFaEcsTUFBTSxRQUFRLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVSxJQUFJLFdBQVcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ3JGLElBQUksUUFBUSxFQUFFO1lBQ1YsV0FBVyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7U0FDbkM7UUFFRCxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDOzs7O1lBbENKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7O1lBVE8sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QXBvbGxvfSBmcm9tICdhcG9sbG8tYW5ndWxhcic7XG5pbXBvcnQge1JlY29yZH0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7QXBvbGxvUXVlcnlSZXN1bHR9IGZyb20gJ0BhcG9sbG8vY2xpZW50L2NvcmUnO1xuaW1wb3J0IHtSZWNvcmRTYXZlR1FMfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zdG9yZS9yZWNvcmQvZ3JhcGhxbC9hcGkucmVjb3JkLnNhdmUnO1xuaW1wb3J0IHtTYXZlZEZpbHRlcn0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc3RvcmUvc2F2ZWQtZmlsdGVycy9zYXZlZC1maWx0ZXIubW9kZWwnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBTYXZlZEZpbHRlclNhdmVHUUwgZXh0ZW5kcyBSZWNvcmRTYXZlR1FMIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhcG9sbG86IEFwb2xsbykge1xuICAgICAgICBzdXBlcihhcG9sbG8pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzYXZlKHJlY29yZDogUmVjb3JkKTogT2JzZXJ2YWJsZTxTYXZlZEZpbHRlcj4ge1xuICAgICAgICByZXR1cm4gc3VwZXIuc2F2ZShyZWNvcmQpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBtYXBUb1JlY29yZChyZXNwb25zZTogQXBvbGxvUXVlcnlSZXN1bHQ8YW55Pik6IFNhdmVkRmlsdGVyIHtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5kYXRhIHx8ICFyZXNwb25zZS5kYXRhLnNhdmVSZWNvcmQgfHwgIXJlc3BvbnNlLmRhdGEuc2F2ZVJlY29yZC5yZWNvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2F2ZWRGaWx0ZXIgPSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZXJzY29yZS1kYW5nbGVcbiAgICAgICAgICAgIGlkOiByZXNwb25zZS5kYXRhLnNhdmVSZWNvcmQucmVjb3JkLl9pZCxcbiAgICAgICAgICAgIHR5cGU6IHJlc3BvbnNlLmRhdGEuc2F2ZVJlY29yZC5yZWNvcmQudHlwZSB8fCAnJyxcbiAgICAgICAgICAgIG1vZHVsZTogcmVzcG9uc2UuZGF0YS5zYXZlUmVjb3JkLnJlY29yZC5tb2R1bGUgfHwgJycsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiByZXNwb25zZS5kYXRhLnNhdmVSZWNvcmQucmVjb3JkLmF0dHJpYnV0ZXMgfHwgbnVsbCxcbiAgICAgICAgfSBhcyBTYXZlZEZpbHRlcjtcblxuICAgICAgICBzYXZlZEZpbHRlci5rZXkgPSBzYXZlZEZpbHRlci5pZCB8fCAoc2F2ZWRGaWx0ZXIuYXR0cmlidXRlcyAmJiBzYXZlZEZpbHRlci5hdHRyaWJ1dGVzLmlkKSB8fCAnJztcblxuICAgICAgICBjb25zdCBjb250ZW50cyA9IChzYXZlZEZpbHRlci5hdHRyaWJ1dGVzICYmIHNhdmVkRmlsdGVyLmF0dHJpYnV0ZXMuY29udGVudHMpIHx8IG51bGw7XG4gICAgICAgIGlmIChjb250ZW50cykge1xuICAgICAgICAgICAgc2F2ZWRGaWx0ZXIuY3JpdGVyaWEgPSBjb250ZW50cztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzYXZlZEZpbHRlcjtcbiAgICB9XG59XG4iXX0=