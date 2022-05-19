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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/layout";
export var ScreenSize;
(function (ScreenSize) {
    ScreenSize["XSmall"] = "XSmall";
    ScreenSize["Small"] = "Small";
    ScreenSize["Medium"] = "Medium";
    ScreenSize["Large"] = "Large";
    ScreenSize["XLarge"] = "XLarge";
})(ScreenSize || (ScreenSize = {}));
export class ScreenSizeObserverService {
    constructor(breakpointObserver) {
        this.breakpointObserver = breakpointObserver;
        this.screenSize = new BehaviorSubject(ScreenSize.Medium);
        this.screenSize$ = this.screenSize.asObservable();
        this.initScreenSizeObservable();
    }
    initScreenSizeObservable() {
        merge(this.breakpointObserver.observe([
            Breakpoints.XSmall,
        ]).pipe(map((result) => {
            if (result.matches) {
                return ScreenSize.XSmall;
            }
        })), this.breakpointObserver.observe([
            Breakpoints.Small,
        ]).pipe(map((result) => {
            if (result.matches) {
                return ScreenSize.Small;
            }
        })), this.breakpointObserver.observe([
            Breakpoints.Medium,
        ]).pipe(map((result) => {
            if (result.matches) {
                return ScreenSize.Medium;
            }
        })), this.breakpointObserver.observe([
            Breakpoints.Large,
        ]).pipe(map((result) => {
            if (result.matches) {
                return ScreenSize.Large;
            }
        })), this.breakpointObserver.observe([
            Breakpoints.XLarge,
        ]).pipe(map((result) => {
            if (result.matches) {
                return ScreenSize.XLarge;
            }
        }))).subscribe((value) => {
            if (value) {
                this.screenSize.next(value);
            }
        });
    }
}
ScreenSizeObserverService.ɵprov = i0.ɵɵdefineInjectable({ factory: function ScreenSizeObserverService_Factory() { return new ScreenSizeObserverService(i0.ɵɵinject(i1.BreakpointObserver)); }, token: ScreenSizeObserverService, providedIn: "root" });
ScreenSizeObserverService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
ScreenSizeObserverService.ctorParameters = () => [
    { type: BreakpointObserver }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyZWVuLXNpemUtb2JzZXJ2ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zZXJ2aWNlcy91aS9zY3JlZW4tc2l6ZS1vYnNlcnZlci9zY3JlZW4tc2l6ZS1vYnNlcnZlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxXQUFXLEVBQWtCLE1BQU0scUJBQXFCLENBQUM7QUFDckYsT0FBTyxFQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7QUFFbkMsTUFBTSxDQUFOLElBQVksVUFNWDtBQU5ELFdBQVksVUFBVTtJQUNsQiwrQkFBaUIsQ0FBQTtJQUNqQiw2QkFBZSxDQUFBO0lBQ2YsK0JBQWlCLENBQUE7SUFDakIsNkJBQWUsQ0FBQTtJQUNmLCtCQUFpQixDQUFBO0FBQ3JCLENBQUMsRUFOVyxVQUFVLEtBQVYsVUFBVSxRQU1yQjtBQUtELE1BQU0sT0FBTyx5QkFBeUI7SUFLbEMsWUFBc0Isa0JBQXNDO1FBQXRDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFINUQsZUFBVSxHQUFHLElBQUksZUFBZSxDQUFhLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRSxnQkFBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUM7UUFHekMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVTLHdCQUF3QjtRQUM5QixLQUFLLENBQ0QsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztZQUM1QixXQUFXLENBQUMsTUFBTTtTQUNyQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQXVCLEVBQUUsRUFBRTtZQUNwQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQzthQUM1QjtRQUNMLENBQUMsQ0FBQyxDQUFDLEVBQ0gsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztZQUM1QixXQUFXLENBQUMsS0FBSztTQUNwQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQXVCLEVBQUUsRUFBRTtZQUNwQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQzthQUMzQjtRQUNMLENBQUMsQ0FBQyxDQUFDLEVBQ0gsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztZQUM1QixXQUFXLENBQUMsTUFBTTtTQUNyQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQXVCLEVBQUUsRUFBRTtZQUNwQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQzthQUM1QjtRQUNMLENBQUMsQ0FBQyxDQUFDLEVBQ0gsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztZQUM1QixXQUFXLENBQUMsS0FBSztTQUNwQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQXVCLEVBQUUsRUFBRTtZQUNwQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQzthQUMzQjtRQUNMLENBQUMsQ0FBQyxDQUFDLEVBQ0gsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztZQUM1QixXQUFXLENBQUMsTUFBTTtTQUNyQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQXVCLEVBQUUsRUFBRTtZQUNwQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQzthQUM1QjtRQUNMLENBQUMsQ0FBQyxDQUFDLENBQ04sQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNsQixJQUFJLEtBQUssRUFBRTtnQkFDUCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMvQjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7OztZQXRESixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQWRPLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QnJlYWtwb2ludE9ic2VydmVyLCBCcmVha3BvaW50cywgQnJlYWtwb2ludFN0YXRlfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBtZXJnZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5leHBvcnQgZW51bSBTY3JlZW5TaXplIHtcbiAgICBYU21hbGwgPSAnWFNtYWxsJyxcbiAgICBTbWFsbCA9ICdTbWFsbCcsXG4gICAgTWVkaXVtID0gJ01lZGl1bScsXG4gICAgTGFyZ2UgPSAnTGFyZ2UnLFxuICAgIFhMYXJnZSA9ICdYTGFyZ2UnXG59XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgU2NyZWVuU2l6ZU9ic2VydmVyU2VydmljZSB7XG5cbiAgICBzY3JlZW5TaXplID0gbmV3IEJlaGF2aW9yU3ViamVjdDxTY3JlZW5TaXplPihTY3JlZW5TaXplLk1lZGl1bSk7XG4gICAgc2NyZWVuU2l6ZSQgPSB0aGlzLnNjcmVlblNpemUuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgYnJlYWtwb2ludE9ic2VydmVyOiBCcmVha3BvaW50T2JzZXJ2ZXIpIHtcbiAgICAgICAgdGhpcy5pbml0U2NyZWVuU2l6ZU9ic2VydmFibGUoKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5pdFNjcmVlblNpemVPYnNlcnZhYmxlKCk6IHZvaWQge1xuICAgICAgICBtZXJnZShcbiAgICAgICAgICAgIHRoaXMuYnJlYWtwb2ludE9ic2VydmVyLm9ic2VydmUoW1xuICAgICAgICAgICAgICAgIEJyZWFrcG9pbnRzLlhTbWFsbCxcbiAgICAgICAgICAgIF0pLnBpcGUobWFwKChyZXN1bHQ6IEJyZWFrcG9pbnRTdGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQubWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2NyZWVuU2l6ZS5YU21hbGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgdGhpcy5icmVha3BvaW50T2JzZXJ2ZXIub2JzZXJ2ZShbXG4gICAgICAgICAgICAgICAgQnJlYWtwb2ludHMuU21hbGwsXG4gICAgICAgICAgICBdKS5waXBlKG1hcCgocmVzdWx0OiBCcmVha3BvaW50U3RhdGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lm1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNjcmVlblNpemUuU21hbGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgdGhpcy5icmVha3BvaW50T2JzZXJ2ZXIub2JzZXJ2ZShbXG4gICAgICAgICAgICAgICAgQnJlYWtwb2ludHMuTWVkaXVtLFxuICAgICAgICAgICAgXSkucGlwZShtYXAoKHJlc3VsdDogQnJlYWtwb2ludFN0YXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5tYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTY3JlZW5TaXplLk1lZGl1bTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgICB0aGlzLmJyZWFrcG9pbnRPYnNlcnZlci5vYnNlcnZlKFtcbiAgICAgICAgICAgICAgICBCcmVha3BvaW50cy5MYXJnZSxcbiAgICAgICAgICAgIF0pLnBpcGUobWFwKChyZXN1bHQ6IEJyZWFrcG9pbnRTdGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQubWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2NyZWVuU2l6ZS5MYXJnZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgICB0aGlzLmJyZWFrcG9pbnRPYnNlcnZlci5vYnNlcnZlKFtcbiAgICAgICAgICAgICAgICBCcmVha3BvaW50cy5YTGFyZ2UsXG4gICAgICAgICAgICBdKS5waXBlKG1hcCgocmVzdWx0OiBCcmVha3BvaW50U3RhdGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lm1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNjcmVlblNpemUuWExhcmdlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKVxuICAgICAgICApLnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NyZWVuU2l6ZS5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19