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
import { Router } from '@angular/router';
import { ModuleNameMapper } from '../../../../services/navigation/module-name-mapper/module-name-mapper.service';
import { LineActionActionHandler } from '../line.action';
import * as i0 from "@angular/core";
import * as i1 from "../../../../services/navigation/module-name-mapper/module-name-mapper.service";
import * as i2 from "@angular/router";
export class CreateRelatedLineAction extends LineActionActionHandler {
    constructor(moduleNameMapper, router) {
        super();
        this.moduleNameMapper = moduleNameMapper;
        this.router = router;
        this.key = 'create';
        this.modes = ['list'];
    }
    run(data, action = null) {
        const configs = action.params['create'] || {};
        const params = {};
        /* eslint-disable camelcase,@typescript-eslint/camelcase*/
        params.return_module = configs.legacyModuleName;
        params.return_action = configs.returnAction;
        params.return_id = data.record.id;
        /* eslint-enable camelcase,@typescript-eslint/camelcase */
        params[configs.mapping.moduleName] = configs.legacyModuleName;
        params[configs.mapping.name] = data.record.attributes.name;
        params[configs.mapping.id] = data.record.id;
        const route = '/' + configs.module + '/' + configs.action;
        this.router.navigate([route], {
            queryParams: params
        }).then();
    }
    shouldDisplay(data) {
        return true;
    }
}
CreateRelatedLineAction.ɵprov = i0.ɵɵdefineInjectable({ factory: function CreateRelatedLineAction_Factory() { return new CreateRelatedLineAction(i0.ɵɵinject(i1.ModuleNameMapper), i0.ɵɵinject(i2.Router)); }, token: CreateRelatedLineAction, providedIn: "root" });
CreateRelatedLineAction.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
CreateRelatedLineAction.ctorParameters = () => [
    { type: ModuleNameMapper },
    { type: Router }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXJlbGF0ZWQuYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2NvbXBvbmVudHMvdGFibGUvbGluZS1hY3Rpb25zL2NyZWF0ZS1yZWxhdGVkL2NyZWF0ZS1yZWxhdGVkLmFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFdkMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sK0VBQStFLENBQUM7QUFDL0csT0FBTyxFQUFDLHVCQUF1QixFQUFpQixNQUFNLGdCQUFnQixDQUFDOzs7O0FBS3ZFLE1BQU0sT0FBTyx1QkFBd0IsU0FBUSx1QkFBdUI7SUFJaEUsWUFBc0IsZ0JBQWtDLEVBQVksTUFBYztRQUM5RSxLQUFLLEVBQUUsQ0FBQztRQURVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBSGxGLFFBQUcsR0FBRyxRQUFRLENBQUM7UUFDZixVQUFLLEdBQUcsQ0FBQyxNQUFrQixDQUFDLENBQUM7SUFJN0IsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUFvQixFQUFFLFNBQWlCLElBQUk7UUFFM0MsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFTLENBQUM7UUFFckQsTUFBTSxNQUFNLEdBQTJCLEVBQUUsQ0FBQztRQUMxQywwREFBMEQ7UUFDMUQsTUFBTSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7UUFDaEQsTUFBTSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDbEMsMERBQTBEO1FBQzFELE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztRQUU5RCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFDM0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFFNUMsTUFBTSxLQUFLLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFFMUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMxQixXQUFXLEVBQUUsTUFBTTtTQUN0QixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsYUFBYSxDQUFDLElBQW9CO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Ozs7WUFuQ0osVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFMTyxnQkFBZ0I7WUFGaEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Um91dGVyfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtBY3Rpb24sIFZpZXdNb2RlfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtNb2R1bGVOYW1lTWFwcGVyfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uL21vZHVsZS1uYW1lLW1hcHBlci9tb2R1bGUtbmFtZS1tYXBwZXIuc2VydmljZSc7XG5pbXBvcnQge0xpbmVBY3Rpb25BY3Rpb25IYW5kbGVyLCBMaW5lQWN0aW9uRGF0YX0gZnJvbSAnLi4vbGluZS5hY3Rpb24nO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIENyZWF0ZVJlbGF0ZWRMaW5lQWN0aW9uIGV4dGVuZHMgTGluZUFjdGlvbkFjdGlvbkhhbmRsZXIge1xuICAgIGtleSA9ICdjcmVhdGUnO1xuICAgIG1vZGVzID0gWydsaXN0JyBhcyBWaWV3TW9kZV07XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgbW9kdWxlTmFtZU1hcHBlcjogTW9kdWxlTmFtZU1hcHBlciwgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcnVuKGRhdGE6IExpbmVBY3Rpb25EYXRhLCBhY3Rpb246IEFjdGlvbiA9IG51bGwpOiB2b2lkIHtcblxuICAgICAgICBjb25zdCBjb25maWdzID0gYWN0aW9uLnBhcmFtc1snY3JlYXRlJ10gfHwge30gYXMgYW55O1xuXG4gICAgICAgIGNvbnN0IHBhcmFtczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UsQHR5cGVzY3JpcHQtZXNsaW50L2NhbWVsY2FzZSovXG4gICAgICAgIHBhcmFtcy5yZXR1cm5fbW9kdWxlID0gY29uZmlncy5sZWdhY3lNb2R1bGVOYW1lO1xuICAgICAgICBwYXJhbXMucmV0dXJuX2FjdGlvbiA9IGNvbmZpZ3MucmV0dXJuQWN0aW9uO1xuICAgICAgICBwYXJhbXMucmV0dXJuX2lkID0gZGF0YS5yZWNvcmQuaWQ7XG4gICAgICAgIC8qIGVzbGludC1lbmFibGUgY2FtZWxjYXNlLEB0eXBlc2NyaXB0LWVzbGludC9jYW1lbGNhc2UgKi9cbiAgICAgICAgcGFyYW1zW2NvbmZpZ3MubWFwcGluZy5tb2R1bGVOYW1lXSA9IGNvbmZpZ3MubGVnYWN5TW9kdWxlTmFtZTtcblxuICAgICAgICBwYXJhbXNbY29uZmlncy5tYXBwaW5nLm5hbWVdID0gZGF0YS5yZWNvcmQuYXR0cmlidXRlcy5uYW1lO1xuICAgICAgICBwYXJhbXNbY29uZmlncy5tYXBwaW5nLmlkXSA9IGRhdGEucmVjb3JkLmlkO1xuXG4gICAgICAgIGNvbnN0IHJvdXRlID0gJy8nICsgY29uZmlncy5tb2R1bGUgKyAnLycgKyBjb25maWdzLmFjdGlvbjtcblxuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbcm91dGVdLCB7XG4gICAgICAgICAgICBxdWVyeVBhcmFtczogcGFyYW1zXG4gICAgICAgIH0pLnRoZW4oKTtcbiAgICB9XG5cbiAgICBzaG91bGREaXNwbGF5KGRhdGE6IExpbmVBY3Rpb25EYXRhKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cbiJdfQ==