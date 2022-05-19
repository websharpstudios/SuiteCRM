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
import { SubpanelCreateAction } from '../../actions/create/create.action';
import { SubpanelSelectAction } from "../../actions/select/select.action";
import { AsyncProcessSubpanelAction } from '../../actions/async-process/async-process.action';
import * as i0 from "@angular/core";
import * as i1 from "../../actions/create/create.action";
import * as i2 from "../../actions/select/select.action";
import * as i3 from "../../actions/async-process/async-process.action";
export class SubpanelActionManager {
    constructor(create, select, async) {
        this.create = create;
        this.select = select;
        this.async = async;
        this.actions = {};
        this.actions[create.key] = create;
        this.actions[select.key] = select;
        this.actions[async.key] = async;
    }
    run(action, data) {
        this.actions[action].run(data);
    }
}
SubpanelActionManager.ɵprov = i0.ɵɵdefineInjectable({ factory: function SubpanelActionManager_Factory() { return new SubpanelActionManager(i0.ɵɵinject(i1.SubpanelCreateAction), i0.ɵɵinject(i2.SubpanelSelectAction), i0.ɵɵinject(i3.AsyncProcessSubpanelAction)); }, token: SubpanelActionManager, providedIn: "root" });
SubpanelActionManager.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
SubpanelActionManager.ctorParameters = () => [
    { type: SubpanelCreateAction },
    { type: SubpanelSelectAction },
    { type: AsyncProcessSubpanelAction }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLW1hbmFnZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb250YWluZXJzL3N1YnBhbmVsL2NvbXBvbmVudHMvc3VicGFuZWwvYWN0aW9uLW1hbmFnZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUV4RSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUN4RSxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxrREFBa0QsQ0FBQzs7Ozs7QUFLNUYsTUFBTSxPQUFPLHFCQUFxQjtJQUk5QixZQUNjLE1BQTRCLEVBQzVCLE1BQTRCLEVBQzVCLEtBQWlDO1FBRmpDLFdBQU0sR0FBTixNQUFNLENBQXNCO1FBQzVCLFdBQU0sR0FBTixNQUFNLENBQXNCO1FBQzVCLFVBQUssR0FBTCxLQUFLLENBQTRCO1FBTC9DLFlBQU8sR0FBNkIsRUFBRSxDQUFDO1FBT25DLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxHQUFHLENBQUMsTUFBYyxFQUFFLElBQXdCO1FBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7Ozs7WUFuQkosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFQTyxvQkFBb0I7WUFFcEIsb0JBQW9CO1lBQ3BCLDBCQUEwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3VicGFuZWxDcmVhdGVBY3Rpb259IGZyb20gJy4uLy4uL2FjdGlvbnMvY3JlYXRlL2NyZWF0ZS5hY3Rpb24nO1xuaW1wb3J0IHtTdWJwYW5lbEFjdGlvbkRhdGEsIFN1YnBhbmVsQWN0aW9uSGFuZGxlck1hcH0gZnJvbSAnLi4vLi4vYWN0aW9ucy9zdWJwYW5lbC5hY3Rpb24nO1xuaW1wb3J0IHtTdWJwYW5lbFNlbGVjdEFjdGlvbn0gZnJvbSBcIi4uLy4uL2FjdGlvbnMvc2VsZWN0L3NlbGVjdC5hY3Rpb25cIjtcbmltcG9ydCB7QXN5bmNQcm9jZXNzU3VicGFuZWxBY3Rpb259IGZyb20gJy4uLy4uL2FjdGlvbnMvYXN5bmMtcHJvY2Vzcy9hc3luYy1wcm9jZXNzLmFjdGlvbic7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIFN1YnBhbmVsQWN0aW9uTWFuYWdlciB7XG5cbiAgICBhY3Rpb25zOiBTdWJwYW5lbEFjdGlvbkhhbmRsZXJNYXAgPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlOiBTdWJwYW5lbENyZWF0ZUFjdGlvbixcbiAgICAgICAgcHJvdGVjdGVkIHNlbGVjdDogU3VicGFuZWxTZWxlY3RBY3Rpb24sXG4gICAgICAgIHByb3RlY3RlZCBhc3luYzogQXN5bmNQcm9jZXNzU3VicGFuZWxBY3Rpb25cbiAgICApIHtcbiAgICAgICAgdGhpcy5hY3Rpb25zW2NyZWF0ZS5rZXldID0gY3JlYXRlO1xuICAgICAgICB0aGlzLmFjdGlvbnNbc2VsZWN0LmtleV0gPSBzZWxlY3Q7XG4gICAgICAgIHRoaXMuYWN0aW9uc1thc3luYy5rZXldID0gYXN5bmM7XG4gICAgfVxuXG4gICAgcnVuKGFjdGlvbjogc3RyaW5nLCBkYXRhOiBTdWJwYW5lbEFjdGlvbkRhdGEpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hY3Rpb25zW2FjdGlvbl0ucnVuKGRhdGEpO1xuICAgIH1cbn1cbiJdfQ==