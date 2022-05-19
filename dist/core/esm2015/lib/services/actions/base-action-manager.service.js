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
import * as i0 from "@angular/core";
export class BaseActionManager {
    constructor() {
        this.actions = {
            edit: {},
            create: {},
            list: {},
            detail: {},
            massupdate: {},
            filter: {}
        };
    }
    run(action, mode, data) {
        if (!this.actions || !this.actions[mode] || !this.actions[mode][action.key]) {
            return;
        }
        this.actions[mode][action.key].run(data, action);
    }
    getHandler(action, mode) {
        let handlerKey = action.key;
        if (action && action.asyncProcess) {
            handlerKey = 'async-process';
        }
        if (!this.actions || !this.actions[mode] || !this.actions[mode][handlerKey]) {
            return null;
        }
        return this.actions[mode][handlerKey];
    }
    addHandler(action, mode, handler) {
        if (!this.actions[mode]) {
            this.actions[mode] = {};
        }
        this.actions[mode][action.key] = handler;
    }
}
BaseActionManager.ɵprov = i0.ɵɵdefineInjectable({ factory: function BaseActionManager_Factory() { return new BaseActionManager(); }, token: BaseActionManager, providedIn: "root" });
BaseActionManager.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1hY3Rpb24tbWFuYWdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3NlcnZpY2VzL2FjdGlvbnMvYmFzZS1hY3Rpb24tbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDOztBQU16QyxNQUFNLE9BQU8saUJBQWlCO0lBSDlCO1FBS0ksWUFBTyxHQUEyQztZQUM5QyxJQUFJLEVBQUUsRUFBeUI7WUFDL0IsTUFBTSxFQUFFLEVBQXlCO1lBQ2pDLElBQUksRUFBRSxFQUF5QjtZQUMvQixNQUFNLEVBQUUsRUFBeUI7WUFDakMsVUFBVSxFQUFFLEVBQXlCO1lBQ3JDLE1BQU0sRUFBRSxFQUF5QjtTQUNwQyxDQUFDO0tBaUNMO0lBL0JHLEdBQUcsQ0FBQyxNQUFjLEVBQUUsSUFBYyxFQUFFLElBQU87UUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDekUsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsVUFBVSxDQUFDLE1BQWMsRUFBRSxJQUFjO1FBQ3JDLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFFNUIsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRTtZQUMvQixVQUFVLEdBQUcsZUFBZSxDQUFDO1NBQ2hDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUN6RSxPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxVQUFVLENBQUMsTUFBYyxFQUFFLElBQWMsRUFBRSxPQUF5QjtRQUVoRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQXlCLENBQUM7U0FFbEQ7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDN0MsQ0FBQzs7OztZQTVDSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FjdGlvbiwgQWN0aW9uRGF0YSwgQWN0aW9uSGFuZGxlciwgQWN0aW9uSGFuZGxlck1hcCwgQWN0aW9uTWFuYWdlciwgVmlld01vZGV9IGZyb20gJ2NvbW1vbic7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIEJhc2VBY3Rpb25NYW5hZ2VyPEQgZXh0ZW5kcyBBY3Rpb25EYXRhPiBpbXBsZW1lbnRzIEFjdGlvbk1hbmFnZXI8RD4ge1xuXG4gICAgYWN0aW9uczogeyBba2V5OiBzdHJpbmddOiBBY3Rpb25IYW5kbGVyTWFwPEQ+IH0gPSB7XG4gICAgICAgIGVkaXQ6IHt9IGFzIEFjdGlvbkhhbmRsZXJNYXA8RD4sXG4gICAgICAgIGNyZWF0ZToge30gYXMgQWN0aW9uSGFuZGxlck1hcDxEPixcbiAgICAgICAgbGlzdDoge30gYXMgQWN0aW9uSGFuZGxlck1hcDxEPixcbiAgICAgICAgZGV0YWlsOiB7fSBhcyBBY3Rpb25IYW5kbGVyTWFwPEQ+LFxuICAgICAgICBtYXNzdXBkYXRlOiB7fSBhcyBBY3Rpb25IYW5kbGVyTWFwPEQ+LFxuICAgICAgICBmaWx0ZXI6IHt9IGFzIEFjdGlvbkhhbmRsZXJNYXA8RD5cbiAgICB9O1xuXG4gICAgcnVuKGFjdGlvbjogQWN0aW9uLCBtb2RlOiBWaWV3TW9kZSwgZGF0YTogRCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuYWN0aW9ucyB8fCAhdGhpcy5hY3Rpb25zW21vZGVdIHx8ICF0aGlzLmFjdGlvbnNbbW9kZV1bYWN0aW9uLmtleV0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWN0aW9uc1ttb2RlXVthY3Rpb24ua2V5XS5ydW4oZGF0YSwgYWN0aW9uKTtcbiAgICB9XG5cbiAgICBnZXRIYW5kbGVyKGFjdGlvbjogQWN0aW9uLCBtb2RlOiBWaWV3TW9kZSk6IEFjdGlvbkhhbmRsZXI8RD4ge1xuICAgICAgICBsZXQgaGFuZGxlcktleSA9IGFjdGlvbi5rZXk7XG5cbiAgICAgICAgaWYgKGFjdGlvbiAmJiBhY3Rpb24uYXN5bmNQcm9jZXNzKSB7XG4gICAgICAgICAgICBoYW5kbGVyS2V5ID0gJ2FzeW5jLXByb2Nlc3MnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmFjdGlvbnMgfHwgIXRoaXMuYWN0aW9uc1ttb2RlXSB8fCAhdGhpcy5hY3Rpb25zW21vZGVdW2hhbmRsZXJLZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmFjdGlvbnNbbW9kZV1baGFuZGxlcktleV07XG4gICAgfVxuXG4gICAgYWRkSGFuZGxlcihhY3Rpb246IEFjdGlvbiwgbW9kZTogVmlld01vZGUsIGhhbmRsZXI6IEFjdGlvbkhhbmRsZXI8RD4pIHtcblxuICAgICAgICBpZiAoIXRoaXMuYWN0aW9uc1ttb2RlXSkge1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25zW21vZGVdID0ge30gYXMgQWN0aW9uSGFuZGxlck1hcDxEPjtcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hY3Rpb25zW21vZGVdW2FjdGlvbi5rZXldID0gaGFuZGxlcjtcbiAgICB9XG59XG4iXX0=