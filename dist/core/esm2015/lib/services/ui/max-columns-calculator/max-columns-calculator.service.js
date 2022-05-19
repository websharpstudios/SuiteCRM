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
import { combineLatest } from 'rxjs';
import { ScreenSize, ScreenSizeObserverService } from '../screen-size-observer/screen-size-observer.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { SystemConfigStore } from '../../../store/system-config/system-config.store';
export class MaxColumnsCalculator {
    constructor(screenSize, systemConfigStore) {
        this.screenSize = screenSize;
        this.systemConfigStore = systemConfigStore;
        this.screen = ScreenSize.Medium;
        this.maxColumns = 5;
    }
    getMaxColumns(sidebarActive$) {
        return combineLatest([sidebarActive$, this.screenSize.screenSize$]).pipe(map(([sidebarActive, screenSize]) => {
            if (screenSize) {
                this.screen = screenSize;
            }
            return this.calculateMaxColumns(sidebarActive);
        }), distinctUntilChanged());
    }
    calculateMaxColumns(sideBar = true) {
        let sizeMap;
        sizeMap = this.systemConfigStore.getConfigValue('listview_column_limits');
        if (sideBar) {
            sizeMap = sizeMap.with_sidebar;
        }
        else {
            sizeMap = sizeMap.without_sidebar;
        }
        if (this.screen && sizeMap) {
            const maxCols = sizeMap[this.screen];
            if (maxCols) {
                this.maxColumns = maxCols;
            }
        }
        return this.maxColumns;
    }
}
MaxColumnsCalculator.decorators = [
    { type: Injectable }
];
MaxColumnsCalculator.ctorParameters = () => [
    { type: ScreenSizeObserverService },
    { type: SystemConfigStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4LWNvbHVtbnMtY2FsY3VsYXRvci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3NlcnZpY2VzL3VpL21heC1jb2x1bW5zLWNhbGN1bGF0b3IvbWF4LWNvbHVtbnMtY2FsY3VsYXRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxhQUFhLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFDLFVBQVUsRUFBRSx5QkFBeUIsRUFBQyxNQUFNLHNEQUFzRCxDQUFDO0FBQzNHLE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxrREFBa0QsQ0FBQztBQUduRixNQUFNLE9BQU8sb0JBQW9CO0lBSzdCLFlBQ2MsVUFBcUMsRUFDckMsaUJBQW9DO1FBRHBDLGVBQVUsR0FBVixVQUFVLENBQTJCO1FBQ3JDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFMbEQsV0FBTSxHQUFlLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDdkMsZUFBVSxHQUFHLENBQUMsQ0FBQztJQU1mLENBQUM7SUFFRCxhQUFhLENBQUMsY0FBbUM7UUFDN0MsT0FBTyxhQUFhLENBQUMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDcEUsR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLEVBQUUsRUFBRTtZQUVoQyxJQUFJLFVBQVUsRUFBRTtnQkFDWixJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQzthQUM1QjtZQUVELE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxFQUNGLG9CQUFvQixFQUFFLENBQ3pCLENBQUM7SUFDTixDQUFDO0lBRUQsbUJBQW1CLENBQUMsT0FBTyxHQUFHLElBQUk7UUFDOUIsSUFBSSxPQUFPLENBQUM7UUFDWixPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBRTFFLElBQUksT0FBTyxFQUFFO1lBQ1QsT0FBTyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7U0FDbEM7YUFBTTtZQUNILE9BQU8sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLE9BQU8sRUFBRTtZQUN4QixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JDLElBQUksT0FBTyxFQUFFO2dCQUNULElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO2FBQzdCO1NBQ0o7UUFFRCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQzs7O1lBNUNKLFVBQVU7OztZQUpTLHlCQUF5QjtZQUVyQyxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2NvbWJpbmVMYXRlc3QsIE9ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtTY3JlZW5TaXplLCBTY3JlZW5TaXplT2JzZXJ2ZXJTZXJ2aWNlfSBmcm9tICcuLi9zY3JlZW4tc2l6ZS1vYnNlcnZlci9zY3JlZW4tc2l6ZS1vYnNlcnZlci5zZXJ2aWNlJztcbmltcG9ydCB7ZGlzdGluY3RVbnRpbENoYW5nZWQsIG1hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtTeXN0ZW1Db25maWdTdG9yZX0gZnJvbSAnLi4vLi4vLi4vc3RvcmUvc3lzdGVtLWNvbmZpZy9zeXN0ZW0tY29uZmlnLnN0b3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1heENvbHVtbnNDYWxjdWxhdG9yIHtcblxuICAgIHNjcmVlbjogU2NyZWVuU2l6ZSA9IFNjcmVlblNpemUuTWVkaXVtO1xuICAgIG1heENvbHVtbnMgPSA1O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBzY3JlZW5TaXplOiBTY3JlZW5TaXplT2JzZXJ2ZXJTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgc3lzdGVtQ29uZmlnU3RvcmU6IFN5c3RlbUNvbmZpZ1N0b3JlXG4gICAgKSB7XG4gICAgfVxuXG4gICAgZ2V0TWF4Q29sdW1ucyhzaWRlYmFyQWN0aXZlJDogT2JzZXJ2YWJsZTxib29sZWFuPik6IE9ic2VydmFibGU8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFtzaWRlYmFyQWN0aXZlJCwgdGhpcy5zY3JlZW5TaXplLnNjcmVlblNpemUkXSkucGlwZShcbiAgICAgICAgICAgIG1hcCgoW3NpZGViYXJBY3RpdmUsIHNjcmVlblNpemVdKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2NyZWVuU2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcmVlbiA9IHNjcmVlblNpemU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlTWF4Q29sdW1ucyhzaWRlYmFyQWN0aXZlKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZU1heENvbHVtbnMoc2lkZUJhciA9IHRydWUpOiBudW1iZXIge1xuICAgICAgICBsZXQgc2l6ZU1hcDtcbiAgICAgICAgc2l6ZU1hcCA9IHRoaXMuc3lzdGVtQ29uZmlnU3RvcmUuZ2V0Q29uZmlnVmFsdWUoJ2xpc3R2aWV3X2NvbHVtbl9saW1pdHMnKTtcblxuICAgICAgICBpZiAoc2lkZUJhcikge1xuICAgICAgICAgICAgc2l6ZU1hcCA9IHNpemVNYXAud2l0aF9zaWRlYmFyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2l6ZU1hcCA9IHNpemVNYXAud2l0aG91dF9zaWRlYmFyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2NyZWVuICYmIHNpemVNYXApIHtcbiAgICAgICAgICAgIGNvbnN0IG1heENvbHMgPSBzaXplTWFwW3RoaXMuc2NyZWVuXTtcbiAgICAgICAgICAgIGlmIChtYXhDb2xzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXhDb2x1bW5zID0gbWF4Q29scztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLm1heENvbHVtbnM7XG4gICAgfVxufVxuIl19