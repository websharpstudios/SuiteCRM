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
import { ModuleNameMapper, } from '../../../../services/navigation/module-name-mapper/module-name-mapper.service';
import { isVoid } from 'common';
import get from 'lodash-es/get';
import { SubpanelActionHandler } from '../subpanel.action';
import * as i0 from "@angular/core";
import * as i1 from "../../../../services/navigation/module-name-mapper/module-name-mapper.service";
import * as i2 from "@angular/router";
export class SubpanelCreateAction extends SubpanelActionHandler {
    constructor(moduleNameMapper, router) {
        super();
        this.moduleNameMapper = moduleNameMapper;
        this.router = router;
        this.key = 'create';
        this.modes = ['list'];
    }
    run(data) {
        var _a, _b;
        const moduleName = data.module;
        const moduleAction = (_b = (_a = data === null || data === void 0 ? void 0 : data.action) === null || _a === void 0 ? void 0 : _a.moduleAction) !== null && _b !== void 0 ? _b : 'edit';
        const route = `/${moduleName}/${moduleAction}`;
        const queryParams = {
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            return_module: this.moduleNameMapper.toLegacy(data.parentModule),
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            return_action: 'DetailView',
            // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
            return_id: data.parentId || ''
        };
        this.addAdditionalFields(data, queryParams);
        this.addParams(data, queryParams);
        this.router.navigate([route], {
            queryParams
        }).then();
    }
    shouldDisplay() {
        return true;
    }
    /**
     * Add additional record fields
     *
     * @param {object} data SubpanelActionData
     * @param {object} queryParams Params map
     */
    addAdditionalFields(data, queryParams) {
        var _a;
        const parentAttributes = (data.store.parentRecord && data.store.parentRecord.attributes) || {};
        if (!parentAttributes && !Object.keys(parentAttributes).length) {
            return;
        }
        const additionalFields = (_a = data.action.additionalFields) !== null && _a !== void 0 ? _a : {};
        const additionalFieldKeys = Object.keys(additionalFields) || [];
        additionalFieldKeys.forEach(additionalFieldKey => {
            if (!additionalFieldKey || !additionalFields[additionalFieldKey]) {
                return;
            }
            const parentAttribute = additionalFields[additionalFieldKey];
            const attribute = get(parentAttributes, parentAttribute, null);
            if (isVoid(attribute)) {
                return;
            }
            queryParams[additionalFieldKey] = attribute;
        });
    }
    /**
     * Add configuration defined params
     *
     * @param {object} data SubpanelActionData
     * @param {object} queryParams Params map
     */
    addParams(data, queryParams) {
        var _a;
        const params = (_a = data.action.extraParams) !== null && _a !== void 0 ? _a : {};
        const paramKeys = Object.keys(params) || [];
        paramKeys.forEach(paramKey => {
            if (!paramKey || !params[paramKey]) {
                return;
            }
            queryParams[paramKey] = params[paramKey];
        });
    }
}
SubpanelCreateAction.ɵprov = i0.ɵɵdefineInjectable({ factory: function SubpanelCreateAction_Factory() { return new SubpanelCreateAction(i0.ɵɵinject(i1.ModuleNameMapper), i0.ɵɵinject(i2.Router)); }, token: SubpanelCreateAction, providedIn: "root" });
SubpanelCreateAction.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
SubpanelCreateAction.ctorParameters = () => [
    { type: ModuleNameMapper },
    { type: Router }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb250YWluZXJzL3N1YnBhbmVsL2FjdGlvbnMvY3JlYXRlL2NyZWF0ZS5hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFTLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBQyxnQkFBZ0IsR0FBRSxNQUFNLCtFQUErRSxDQUFDO0FBQ2hILE9BQU8sRUFBZSxNQUFNLEVBQVcsTUFBTSxRQUFRLENBQUM7QUFDdEQsT0FBTyxHQUFHLE1BQU0sZUFBZSxDQUFDO0FBQ2hDLE9BQU8sRUFBcUIscUJBQXFCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQzs7OztBQU03RSxNQUFNLE9BQU8sb0JBQXFCLFNBQVEscUJBQXFCO0lBSTNELFlBQ2MsZ0JBQWtDLEVBQ2xDLE1BQWM7UUFFeEIsS0FBSyxFQUFFLENBQUM7UUFIRSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFMNUIsUUFBRyxHQUFHLFFBQVEsQ0FBQztRQUNmLFVBQUssR0FBRyxDQUFDLE1BQWtCLENBQUMsQ0FBQztJQU83QixDQUFDO0lBRUQsR0FBRyxDQUFDLElBQXdCOztRQUV4QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQy9CLE1BQU0sWUFBWSxHQUFHLE1BQUEsTUFBQSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsTUFBTSwwQ0FBRSxZQUFZLG1DQUFJLE1BQU0sQ0FBQztRQUUxRCxNQUFNLEtBQUssR0FBRyxJQUFJLFVBQVUsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUUvQyxNQUFNLFdBQVcsR0FBRztZQUNoQixrRUFBa0U7WUFDbEUsYUFBYSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNoRSxrRUFBa0U7WUFDbEUsYUFBYSxFQUFFLFlBQVk7WUFDM0Isa0VBQWtFO1lBQ2xFLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUU7U0FDdkIsQ0FBQztRQUNaLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMxQixXQUFXO1NBQ2QsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELGFBQWE7UUFDVCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDTyxtQkFBbUIsQ0FBQyxJQUF3QixFQUFFLFdBQW1COztRQUN2RSxNQUFNLGdCQUFnQixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksRUFBa0IsQ0FBQztRQUUvRyxJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsTUFBTSxFQUFFO1lBQzVELE9BQU87U0FDVjtRQUVELE1BQU0sZ0JBQWdCLEdBQUcsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixtQ0FBSSxFQUErQixDQUFDO1FBQ3pGLE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVoRSxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsRUFBRTtZQUM3QyxJQUFJLENBQUMsa0JBQWtCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO2dCQUM5RCxPQUFPO2FBQ1Y7WUFFRCxNQUFNLGVBQWUsR0FBRyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzdELE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFL0QsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ25CLE9BQU87YUFDVjtZQUVELFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLFNBQVMsQ0FBQyxJQUF3QixFQUFFLFdBQW1COztRQUU3RCxNQUFNLE1BQU0sR0FBRyxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxtQ0FBSSxFQUErQixDQUFDO1FBQzFFLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRTVDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDekIsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDaEMsT0FBTzthQUNWO1lBRUQsV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Ozs7WUEzRkosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFSTyxnQkFBZ0I7WUFEUixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQYXJhbXMsIFJvdXRlcn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7TW9kdWxlTmFtZU1hcHBlcix9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24vbW9kdWxlLW5hbWUtbWFwcGVyL21vZHVsZS1uYW1lLW1hcHBlci5zZXJ2aWNlJztcbmltcG9ydCB7QXR0cmlidXRlTWFwLCBpc1ZvaWQsIFZpZXdNb2RlfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IGdldCBmcm9tICdsb2Rhc2gtZXMvZ2V0JztcbmltcG9ydCB7U3VicGFuZWxBY3Rpb25EYXRhLCBTdWJwYW5lbEFjdGlvbkhhbmRsZXJ9IGZyb20gJy4uL3N1YnBhbmVsLmFjdGlvbic7XG5cblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBTdWJwYW5lbENyZWF0ZUFjdGlvbiBleHRlbmRzIFN1YnBhbmVsQWN0aW9uSGFuZGxlciB7XG4gICAga2V5ID0gJ2NyZWF0ZSc7XG4gICAgbW9kZXMgPSBbJ2xpc3QnIGFzIFZpZXdNb2RlXTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgbW9kdWxlTmFtZU1hcHBlcjogTW9kdWxlTmFtZU1hcHBlcixcbiAgICAgICAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcnVuKGRhdGE6IFN1YnBhbmVsQWN0aW9uRGF0YSk6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IG1vZHVsZU5hbWUgPSBkYXRhLm1vZHVsZTtcbiAgICAgICAgY29uc3QgbW9kdWxlQWN0aW9uID0gZGF0YT8uYWN0aW9uPy5tb2R1bGVBY3Rpb24gPz8gJ2VkaXQnO1xuXG4gICAgICAgIGNvbnN0IHJvdXRlID0gYC8ke21vZHVsZU5hbWV9LyR7bW9kdWxlQWN0aW9ufWA7XG5cbiAgICAgICAgY29uc3QgcXVlcnlQYXJhbXMgPSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlLEB0eXBlc2NyaXB0LWVzbGludC9jYW1lbGNhc2VcbiAgICAgICAgICAgIHJldHVybl9tb2R1bGU6IHRoaXMubW9kdWxlTmFtZU1hcHBlci50b0xlZ2FjeShkYXRhLnBhcmVudE1vZHVsZSksXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlLEB0eXBlc2NyaXB0LWVzbGludC9jYW1lbGNhc2VcbiAgICAgICAgICAgIHJldHVybl9hY3Rpb246ICdEZXRhaWxWaWV3JyxcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2UsQHR5cGVzY3JpcHQtZXNsaW50L2NhbWVsY2FzZVxuICAgICAgICAgICAgcmV0dXJuX2lkOiBkYXRhLnBhcmVudElkIHx8ICcnXG4gICAgICAgIH0gYXMgUGFyYW1zO1xuICAgICAgICB0aGlzLmFkZEFkZGl0aW9uYWxGaWVsZHMoZGF0YSwgcXVlcnlQYXJhbXMpO1xuICAgICAgICB0aGlzLmFkZFBhcmFtcyhkYXRhLCBxdWVyeVBhcmFtcyk7XG5cbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3JvdXRlXSwge1xuICAgICAgICAgICAgcXVlcnlQYXJhbXNcbiAgICAgICAgfSkudGhlbigpO1xuICAgIH1cblxuICAgIHNob3VsZERpc3BsYXkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhZGRpdGlvbmFsIHJlY29yZCBmaWVsZHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIFN1YnBhbmVsQWN0aW9uRGF0YVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBxdWVyeVBhcmFtcyBQYXJhbXMgbWFwXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFkZEFkZGl0aW9uYWxGaWVsZHMoZGF0YTogU3VicGFuZWxBY3Rpb25EYXRhLCBxdWVyeVBhcmFtczogUGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHBhcmVudEF0dHJpYnV0ZXMgPSAoZGF0YS5zdG9yZS5wYXJlbnRSZWNvcmQgJiYgZGF0YS5zdG9yZS5wYXJlbnRSZWNvcmQuYXR0cmlidXRlcykgfHwge30gYXMgQXR0cmlidXRlTWFwO1xuXG4gICAgICAgIGlmICghcGFyZW50QXR0cmlidXRlcyAmJiAhT2JqZWN0LmtleXMocGFyZW50QXR0cmlidXRlcykubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhZGRpdGlvbmFsRmllbGRzID0gZGF0YS5hY3Rpb24uYWRkaXRpb25hbEZpZWxkcyA/PyB7fSBhcyB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuICAgICAgICBjb25zdCBhZGRpdGlvbmFsRmllbGRLZXlzID0gT2JqZWN0LmtleXMoYWRkaXRpb25hbEZpZWxkcykgfHwgW107XG5cbiAgICAgICAgYWRkaXRpb25hbEZpZWxkS2V5cy5mb3JFYWNoKGFkZGl0aW9uYWxGaWVsZEtleSA9PiB7XG4gICAgICAgICAgICBpZiAoIWFkZGl0aW9uYWxGaWVsZEtleSB8fCAhYWRkaXRpb25hbEZpZWxkc1thZGRpdGlvbmFsRmllbGRLZXldKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRBdHRyaWJ1dGUgPSBhZGRpdGlvbmFsRmllbGRzW2FkZGl0aW9uYWxGaWVsZEtleV07XG4gICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSBnZXQocGFyZW50QXR0cmlidXRlcywgcGFyZW50QXR0cmlidXRlLCBudWxsKTtcblxuICAgICAgICAgICAgaWYgKGlzVm9pZChhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBxdWVyeVBhcmFtc1thZGRpdGlvbmFsRmllbGRLZXldID0gYXR0cmlidXRlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgY29uZmlndXJhdGlvbiBkZWZpbmVkIHBhcmFtc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgU3VicGFuZWxBY3Rpb25EYXRhXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHF1ZXJ5UGFyYW1zIFBhcmFtcyBtYXBcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYWRkUGFyYW1zKGRhdGE6IFN1YnBhbmVsQWN0aW9uRGF0YSwgcXVlcnlQYXJhbXM6IFBhcmFtcyk6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IGRhdGEuYWN0aW9uLmV4dHJhUGFyYW1zID8/IHt9IGFzIHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG4gICAgICAgIGNvbnN0IHBhcmFtS2V5cyA9IE9iamVjdC5rZXlzKHBhcmFtcykgfHwgW107XG5cbiAgICAgICAgcGFyYW1LZXlzLmZvckVhY2gocGFyYW1LZXkgPT4ge1xuICAgICAgICAgICAgaWYgKCFwYXJhbUtleSB8fCAhcGFyYW1zW3BhcmFtS2V5XSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcXVlcnlQYXJhbXNbcGFyYW1LZXldID0gcGFyYW1zW3BhcmFtS2V5XTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19