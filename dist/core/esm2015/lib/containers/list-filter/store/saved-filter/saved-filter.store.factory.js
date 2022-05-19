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
import { RecordFetchGQL } from '../../../../store/record/graphql/api.record.get';
import { AppStateStore } from '../../../../store/app-state/app-state.store';
import { LanguageStore } from '../../../../store/language/language.store';
import { MessageService } from '../../../../services/message/message.service';
import { RecordManager } from '../../../../services/record/record.manager';
import { SavedFilterStore } from './saved-filter.store';
import { MetadataStore } from '../../../../store/metadata/metadata.store.service';
import { SavedFilterSaveGQL } from './graphql/api.saved-filters.save';
import { RecordMapperRegistry } from 'common';
import { BaseSaveRecordMapper } from '../../../../store/record/record-mappers/base-save.record-mapper';
import { SavedSearchRecordMapper } from './record-mappers/saved-search.record-mapper';
import { FieldManager } from '../../../../services/record/field/field.manager';
import { SavedFilterRecordStoreFactory } from './saved-filter-record.store.factory';
import * as i0 from "@angular/core";
import * as i1 from "../../../../store/record/graphql/api.record.get";
import * as i2 from "./graphql/api.saved-filters.save";
import * as i3 from "../../../../store/app-state/app-state.store";
import * as i4 from "../../../../store/language/language.store";
import * as i5 from "../../../../store/metadata/metadata.store.service";
import * as i6 from "../../../../services/message/message.service";
import * as i7 from "../../../../services/record/record.manager";
import * as i8 from "../../../../services/record/field/field.manager";
import * as i9 from "common";
import * as i10 from "../../../../store/record/record-mappers/base-save.record-mapper";
import * as i11 from "./record-mappers/saved-search.record-mapper";
export class SaveFilterStoreFactory {
    constructor(recordFetchGQL, recordSaveGQL, appStateStore, languageStore, metadataStore, message, recordManager, fieldManager, recordMappers, baseMapper, savedSearchMapper) {
        this.recordFetchGQL = recordFetchGQL;
        this.recordSaveGQL = recordSaveGQL;
        this.appStateStore = appStateStore;
        this.languageStore = languageStore;
        this.metadataStore = metadataStore;
        this.message = message;
        this.recordManager = recordManager;
        this.fieldManager = fieldManager;
        this.recordMappers = recordMappers;
        this.baseMapper = baseMapper;
        this.savedSearchMapper = savedSearchMapper;
        this.savedFilterStoreFactory = new SavedFilterRecordStoreFactory(recordFetchGQL, recordSaveGQL, message, recordManager, recordMappers, baseMapper, fieldManager, languageStore);
        this.recordMappers.register('saved-search', this.savedSearchMapper.getKey(), this.savedSearchMapper);
    }
    create() {
        return new SavedFilterStore(this.appStateStore, this.metadataStore, this.message, this.fieldManager, this.languageStore, this.savedFilterStoreFactory);
    }
}
SaveFilterStoreFactory.ɵprov = i0.ɵɵdefineInjectable({ factory: function SaveFilterStoreFactory_Factory() { return new SaveFilterStoreFactory(i0.ɵɵinject(i1.RecordFetchGQL), i0.ɵɵinject(i2.SavedFilterSaveGQL), i0.ɵɵinject(i3.AppStateStore), i0.ɵɵinject(i4.LanguageStore), i0.ɵɵinject(i5.MetadataStore), i0.ɵɵinject(i6.MessageService), i0.ɵɵinject(i7.RecordManager), i0.ɵɵinject(i8.FieldManager), i0.ɵɵinject(i9.RecordMapperRegistry), i0.ɵɵinject(i10.BaseSaveRecordMapper), i0.ɵɵinject(i11.SavedSearchRecordMapper)); }, token: SaveFilterStoreFactory, providedIn: "root" });
SaveFilterStoreFactory.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
SaveFilterStoreFactory.ctorParameters = () => [
    { type: RecordFetchGQL },
    { type: SavedFilterSaveGQL },
    { type: AppStateStore },
    { type: LanguageStore },
    { type: MetadataStore },
    { type: MessageService },
    { type: RecordManager },
    { type: FieldManager },
    { type: RecordMapperRegistry },
    { type: BaseSaveRecordMapper },
    { type: SavedSearchRecordMapper }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZWQtZmlsdGVyLnN0b3JlLmZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29udGFpbmVycy9saXN0LWZpbHRlci9zdG9yZS9zYXZlZC1maWx0ZXIvc2F2ZWQtZmlsdGVyLnN0b3JlLmZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGlEQUFpRCxDQUFDO0FBQy9FLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSw2Q0FBNkMsQ0FBQztBQUMxRSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFDeEUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDhDQUE4QyxDQUFDO0FBQzVFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSw0Q0FBNEMsQ0FBQztBQUN6RSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbURBQW1ELENBQUM7QUFDaEYsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDcEUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLGlFQUFpRSxDQUFDO0FBQ3JHLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLDZDQUE2QyxDQUFDO0FBQ3BGLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpREFBaUQsQ0FBQztBQUM3RSxPQUFPLEVBQUMsNkJBQTZCLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQUtsRixNQUFNLE9BQU8sc0JBQXNCO0lBSS9CLFlBQ2MsY0FBOEIsRUFDOUIsYUFBaUMsRUFDakMsYUFBNEIsRUFDNUIsYUFBNEIsRUFDNUIsYUFBNEIsRUFDNUIsT0FBdUIsRUFDdkIsYUFBNEIsRUFDNUIsWUFBMEIsRUFDMUIsYUFBbUMsRUFDbkMsVUFBZ0MsRUFDaEMsaUJBQTBDO1FBVjFDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixrQkFBYSxHQUFiLGFBQWEsQ0FBb0I7UUFDakMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFDdkIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsa0JBQWEsR0FBYixhQUFhLENBQXNCO1FBQ25DLGVBQVUsR0FBVixVQUFVLENBQXNCO1FBQ2hDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBeUI7UUFFcEQsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksNkJBQTZCLENBQzVELGNBQWMsRUFDZCxhQUFhLEVBQ2IsT0FBTyxFQUNQLGFBQWEsRUFDYixhQUFhLEVBQ2IsVUFBVSxFQUNWLFlBQVksRUFDWixhQUFhLENBQ2hCLENBQUM7UUFDRixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3pHLENBQUM7SUFFRCxNQUFNO1FBQ0YsT0FBTyxJQUFJLGdCQUFnQixDQUN2QixJQUFJLENBQUMsYUFBYSxFQUNsQixJQUFJLENBQUMsYUFBYSxFQUNsQixJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxZQUFZLEVBQ2pCLElBQUksQ0FBQyxhQUFhLEVBQ2xCLElBQUksQ0FBQyx1QkFBdUIsQ0FDL0IsQ0FBQztJQUNOLENBQUM7Ozs7WUExQ0osVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFoQk8sY0FBYztZQU9kLGtCQUFrQjtZQU5sQixhQUFhO1lBQ2IsYUFBYTtZQUliLGFBQWE7WUFIYixjQUFjO1lBQ2QsYUFBYTtZQU9iLFlBQVk7WUFIWixvQkFBb0I7WUFDcEIsb0JBQW9CO1lBQ3BCLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UmVjb3JkRmV0Y2hHUUx9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3JlY29yZC9ncmFwaHFsL2FwaS5yZWNvcmQuZ2V0JztcbmltcG9ydCB7QXBwU3RhdGVTdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvYXBwLXN0YXRlL2FwcC1zdGF0ZS5zdG9yZSc7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmV9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL2xhbmd1YWdlL2xhbmd1YWdlLnN0b3JlJztcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL21lc3NhZ2UvbWVzc2FnZS5zZXJ2aWNlJztcbmltcG9ydCB7UmVjb3JkTWFuYWdlcn0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZXMvcmVjb3JkL3JlY29yZC5tYW5hZ2VyJztcbmltcG9ydCB7U2F2ZWRGaWx0ZXJTdG9yZX0gZnJvbSAnLi9zYXZlZC1maWx0ZXIuc3RvcmUnO1xuaW1wb3J0IHtNZXRhZGF0YVN0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9tZXRhZGF0YS9tZXRhZGF0YS5zdG9yZS5zZXJ2aWNlJztcbmltcG9ydCB7U2F2ZWRGaWx0ZXJTYXZlR1FMfSBmcm9tICcuL2dyYXBocWwvYXBpLnNhdmVkLWZpbHRlcnMuc2F2ZSc7XG5pbXBvcnQge1JlY29yZE1hcHBlclJlZ2lzdHJ5fSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtCYXNlU2F2ZVJlY29yZE1hcHBlcn0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvcmVjb3JkL3JlY29yZC1tYXBwZXJzL2Jhc2Utc2F2ZS5yZWNvcmQtbWFwcGVyJztcbmltcG9ydCB7U2F2ZWRTZWFyY2hSZWNvcmRNYXBwZXJ9IGZyb20gJy4vcmVjb3JkLW1hcHBlcnMvc2F2ZWQtc2VhcmNoLnJlY29yZC1tYXBwZXInO1xuaW1wb3J0IHtGaWVsZE1hbmFnZXJ9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL3JlY29yZC9maWVsZC9maWVsZC5tYW5hZ2VyJztcbmltcG9ydCB7U2F2ZWRGaWx0ZXJSZWNvcmRTdG9yZUZhY3Rvcnl9IGZyb20gJy4vc2F2ZWQtZmlsdGVyLXJlY29yZC5zdG9yZS5mYWN0b3J5JztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgU2F2ZUZpbHRlclN0b3JlRmFjdG9yeSB7XG5cbiAgICBwcm90ZWN0ZWQgc2F2ZWRGaWx0ZXJTdG9yZUZhY3Rvcnk6IFNhdmVkRmlsdGVyUmVjb3JkU3RvcmVGYWN0b3J5O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCByZWNvcmRGZXRjaEdRTDogUmVjb3JkRmV0Y2hHUUwsXG4gICAgICAgIHByb3RlY3RlZCByZWNvcmRTYXZlR1FMOiBTYXZlZEZpbHRlclNhdmVHUUwsXG4gICAgICAgIHByb3RlY3RlZCBhcHBTdGF0ZVN0b3JlOiBBcHBTdGF0ZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbGFuZ3VhZ2VTdG9yZTogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIG1ldGFkYXRhU3RvcmU6IE1ldGFkYXRhU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBtZXNzYWdlOiBNZXNzYWdlU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIHJlY29yZE1hbmFnZXI6IFJlY29yZE1hbmFnZXIsXG4gICAgICAgIHByb3RlY3RlZCBmaWVsZE1hbmFnZXI6IEZpZWxkTWFuYWdlcixcbiAgICAgICAgcHJvdGVjdGVkIHJlY29yZE1hcHBlcnM6IFJlY29yZE1hcHBlclJlZ2lzdHJ5LFxuICAgICAgICBwcm90ZWN0ZWQgYmFzZU1hcHBlcjogQmFzZVNhdmVSZWNvcmRNYXBwZXIsXG4gICAgICAgIHByb3RlY3RlZCBzYXZlZFNlYXJjaE1hcHBlcjogU2F2ZWRTZWFyY2hSZWNvcmRNYXBwZXJcbiAgICApIHtcbiAgICAgICAgdGhpcy5zYXZlZEZpbHRlclN0b3JlRmFjdG9yeSA9IG5ldyBTYXZlZEZpbHRlclJlY29yZFN0b3JlRmFjdG9yeShcbiAgICAgICAgICAgIHJlY29yZEZldGNoR1FMLFxuICAgICAgICAgICAgcmVjb3JkU2F2ZUdRTCxcbiAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICByZWNvcmRNYW5hZ2VyLFxuICAgICAgICAgICAgcmVjb3JkTWFwcGVycyxcbiAgICAgICAgICAgIGJhc2VNYXBwZXIsXG4gICAgICAgICAgICBmaWVsZE1hbmFnZXIsXG4gICAgICAgICAgICBsYW5ndWFnZVN0b3JlXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVjb3JkTWFwcGVycy5yZWdpc3Rlcignc2F2ZWQtc2VhcmNoJywgdGhpcy5zYXZlZFNlYXJjaE1hcHBlci5nZXRLZXkoKSwgdGhpcy5zYXZlZFNlYXJjaE1hcHBlcik7XG4gICAgfVxuXG4gICAgY3JlYXRlKCk6IFNhdmVkRmlsdGVyU3RvcmUge1xuICAgICAgICByZXR1cm4gbmV3IFNhdmVkRmlsdGVyU3RvcmUoXG4gICAgICAgICAgICB0aGlzLmFwcFN0YXRlU3RvcmUsXG4gICAgICAgICAgICB0aGlzLm1ldGFkYXRhU3RvcmUsXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UsXG4gICAgICAgICAgICB0aGlzLmZpZWxkTWFuYWdlcixcbiAgICAgICAgICAgIHRoaXMubGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgICAgIHRoaXMuc2F2ZWRGaWx0ZXJTdG9yZUZhY3RvcnlcbiAgICAgICAgKTtcbiAgICB9XG59XG4iXX0=