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
import { RecordMapperRegistry } from 'common';
import { RecordStore } from './record.store';
import { RecordFetchGQL } from './graphql/api.record.get';
import { RecordSaveGQL } from './graphql/api.record.save';
import { MessageService } from '../../services/message/message.service';
import { RecordManager } from '../../services/record/record.manager';
import { BaseSaveRecordMapper } from './record-mappers/base-save.record-mapper';
import * as i0 from "@angular/core";
import * as i1 from "./graphql/api.record.get";
import * as i2 from "./graphql/api.record.save";
import * as i3 from "../../services/message/message.service";
import * as i4 from "../../services/record/record.manager";
import * as i5 from "common";
import * as i6 from "./record-mappers/base-save.record-mapper";
export class RecordStoreFactory {
    constructor(recordFetchGQL, recordSaveGQL, message, recordManager, recordMappers, baseMapper) {
        this.recordFetchGQL = recordFetchGQL;
        this.recordSaveGQL = recordSaveGQL;
        this.message = message;
        this.recordManager = recordManager;
        this.recordMappers = recordMappers;
        this.baseMapper = baseMapper;
        recordMappers.register('default', baseMapper.getKey(), baseMapper);
    }
    create(definitions$) {
        return new RecordStore(definitions$, this.recordSaveGQL, this.recordFetchGQL, this.message, this.recordManager, this.recordMappers);
    }
}
RecordStoreFactory.ɵprov = i0.ɵɵdefineInjectable({ factory: function RecordStoreFactory_Factory() { return new RecordStoreFactory(i0.ɵɵinject(i1.RecordFetchGQL), i0.ɵɵinject(i2.RecordSaveGQL), i0.ɵɵinject(i3.MessageService), i0.ɵɵinject(i4.RecordManager), i0.ɵɵinject(i5.RecordMapperRegistry), i0.ɵɵinject(i6.BaseSaveRecordMapper)); }, token: RecordStoreFactory, providedIn: "root" });
RecordStoreFactory.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
RecordStoreFactory.ctorParameters = () => [
    { type: RecordFetchGQL },
    { type: RecordSaveGQL },
    { type: MessageService },
    { type: RecordManager },
    { type: RecordMapperRegistry },
    { type: BaseSaveRecordMapper }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLnN0b3JlLmZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc3RvcmUvcmVjb3JkL3JlY29yZC5zdG9yZS5mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxvQkFBb0IsRUFBc0IsTUFBTSxRQUFRLENBQUM7QUFDakUsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDeEQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBQ3RFLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUNuRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQ0FBMEMsQ0FBQzs7Ozs7Ozs7QUFLOUUsTUFBTSxPQUFPLGtCQUFrQjtJQUUzQixZQUNjLGNBQThCLEVBQzlCLGFBQTRCLEVBQzVCLE9BQXVCLEVBQ3ZCLGFBQTRCLEVBQzVCLGFBQW1DLEVBQ25DLFVBQWdDO1FBTGhDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUN2QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixrQkFBYSxHQUFiLGFBQWEsQ0FBc0I7UUFDbkMsZUFBVSxHQUFWLFVBQVUsQ0FBc0I7UUFFMUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxNQUFNLENBQUMsWUFBK0M7UUFDbEQsT0FBTyxJQUFJLFdBQVcsQ0FDbEIsWUFBWSxFQUNaLElBQUksQ0FBQyxhQUFhLEVBQ2xCLElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLGFBQWEsRUFDbEIsSUFBSSxDQUFDLGFBQWEsQ0FDckIsQ0FBQztJQUNOLENBQUM7Ozs7WUF6QkosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFSTyxjQUFjO1lBQ2QsYUFBYTtZQUNiLGNBQWM7WUFDZCxhQUFhO1lBTmIsb0JBQW9CO1lBT3BCLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UmVjb3JkTWFwcGVyUmVnaXN0cnksIFZpZXdGaWVsZERlZmluaXRpb259IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge1JlY29yZFN0b3JlfSBmcm9tICcuL3JlY29yZC5zdG9yZSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtSZWNvcmRGZXRjaEdRTH0gZnJvbSAnLi9ncmFwaHFsL2FwaS5yZWNvcmQuZ2V0JztcbmltcG9ydCB7UmVjb3JkU2F2ZUdRTH0gZnJvbSAnLi9ncmFwaHFsL2FwaS5yZWNvcmQuc2F2ZSc7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tZXNzYWdlL21lc3NhZ2Uuc2VydmljZSc7XG5pbXBvcnQge1JlY29yZE1hbmFnZXJ9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3JlY29yZC9yZWNvcmQubWFuYWdlcic7XG5pbXBvcnQge0Jhc2VTYXZlUmVjb3JkTWFwcGVyfSBmcm9tICcuL3JlY29yZC1tYXBwZXJzL2Jhc2Utc2F2ZS5yZWNvcmQtbWFwcGVyJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgUmVjb3JkU3RvcmVGYWN0b3J5IHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgcmVjb3JkRmV0Y2hHUUw6IFJlY29yZEZldGNoR1FMLFxuICAgICAgICBwcm90ZWN0ZWQgcmVjb3JkU2F2ZUdRTDogUmVjb3JkU2F2ZUdRTCxcbiAgICAgICAgcHJvdGVjdGVkIG1lc3NhZ2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgcmVjb3JkTWFuYWdlcjogUmVjb3JkTWFuYWdlcixcbiAgICAgICAgcHJvdGVjdGVkIHJlY29yZE1hcHBlcnM6IFJlY29yZE1hcHBlclJlZ2lzdHJ5LFxuICAgICAgICBwcm90ZWN0ZWQgYmFzZU1hcHBlcjogQmFzZVNhdmVSZWNvcmRNYXBwZXIsXG4gICAgKSB7XG4gICAgICAgIHJlY29yZE1hcHBlcnMucmVnaXN0ZXIoJ2RlZmF1bHQnLCBiYXNlTWFwcGVyLmdldEtleSgpLCBiYXNlTWFwcGVyKTtcbiAgICB9XG5cbiAgICBjcmVhdGUoZGVmaW5pdGlvbnMkOiBPYnNlcnZhYmxlPFZpZXdGaWVsZERlZmluaXRpb25bXT4pOiBSZWNvcmRTdG9yZSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVjb3JkU3RvcmUoXG4gICAgICAgICAgICBkZWZpbml0aW9ucyQsXG4gICAgICAgICAgICB0aGlzLnJlY29yZFNhdmVHUUwsXG4gICAgICAgICAgICB0aGlzLnJlY29yZEZldGNoR1FMLFxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlLFxuICAgICAgICAgICAgdGhpcy5yZWNvcmRNYW5hZ2VyLFxuICAgICAgICAgICAgdGhpcy5yZWNvcmRNYXBwZXJzXG4gICAgICAgICk7XG4gICAgfVxufVxuIl19