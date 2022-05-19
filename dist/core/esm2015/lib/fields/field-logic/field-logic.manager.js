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
import { BaseActionManager } from '../../services/actions/base-action-manager.service';
import { DisplayTypeAction } from './display-type/display-type.action';
import { EmailPrimarySelectAction } from './email-primary-select/email-primary-select.action';
import { RequiredAction } from './required/required.action';
import { UpdateBaseCurrencyAction } from './currency-conversion/update-base-currency.action';
import { UpdateCurrencyAction } from './currency-conversion/update-currency.action';
import { UpdateFlexRelateModuleAction } from './update-flex-relate-module/update-flex-relate-module.action';
import * as i0 from "@angular/core";
import * as i1 from "./display-type/display-type.action";
import * as i2 from "./email-primary-select/email-primary-select.action";
import * as i3 from "./required/required.action";
import * as i4 from "./currency-conversion/update-base-currency.action";
import * as i5 from "./currency-conversion/update-currency.action";
import * as i6 from "./update-flex-relate-module/update-flex-relate-module.action";
export class FieldLogicManager extends BaseActionManager {
    constructor(displayType, emailPrimarySelectAction, required, updateBaseCurrency, updateCurrency, updateFlexRelateModule) {
        super();
        displayType.modes.forEach(mode => this.actions[mode][displayType.key] = displayType);
        emailPrimarySelectAction.modes.forEach(mode => this.actions[mode][emailPrimarySelectAction.key] = emailPrimarySelectAction);
        required.modes.forEach(mode => this.actions[mode][required.key] = required);
        updateBaseCurrency.modes.forEach(mode => this.actions[mode][updateBaseCurrency.key] = updateBaseCurrency);
        updateCurrency.modes.forEach(mode => this.actions[mode][updateCurrency.key] = updateCurrency);
        updateFlexRelateModule.modes.forEach(mode => this.actions[mode][updateFlexRelateModule.key] = updateFlexRelateModule);
    }
    /**
     * Run logic for the given field
     * @param {object} field
     * @param {object} mode
     * @param {object} record
     */
    runLogic(field, mode, record) {
        if (!field.logic) {
            return;
        }
        const actions = Object.keys(field.logic).map(key => field.logic[key]);
        const modeActions = this.parseModeActions(actions, mode);
        const context = {
            record,
            field,
            module: record.module
        };
        modeActions.forEach(action => {
            this.runAction(action, mode, context);
        });
    }
    /**
     * Run the action using given context
     * @param action
     * @param mode
     * @param context
     */
    runAction(action, mode, context = null) {
        this.runFrontEndAction(action, mode, context);
    }
    /**
     * Run front end action
     * @param {object} action
     * @param {object} mode
     * @param {object} context
     */
    runFrontEndAction(action, mode, context = null) {
        const data = this.buildActionData(action, context);
        this.run(action, mode, data);
    }
    /**
     * Get module name
     * @param {object} context
     */
    getModuleName(context) {
        return context.module;
    }
    buildActionData(action, context) {
        return {
            field: context.field,
            record: (context && context.record) || null,
        };
    }
    /**
     * Parse mode actions
     * @param declaredActions
     * @param mode
     */
    parseModeActions(declaredActions, mode) {
        if (!declaredActions) {
            return [];
        }
        const availableActions = {
            list: [],
            detail: [],
            edit: [],
            create: [],
            massupdate: [],
            filter: [],
        };
        if (declaredActions && declaredActions.length) {
            declaredActions.forEach(action => {
                if (!action.modes || !action.modes.length) {
                    return;
                }
                action.modes.forEach(actionMode => {
                    if (!availableActions[actionMode] && !action.asyncProcess) {
                        return;
                    }
                    availableActions[actionMode].push(action);
                });
            });
        }
        const actions = [];
        availableActions[mode].forEach(action => {
            actions.push(action);
        });
        return actions;
    }
}
FieldLogicManager.ɵprov = i0.ɵɵdefineInjectable({ factory: function FieldLogicManager_Factory() { return new FieldLogicManager(i0.ɵɵinject(i1.DisplayTypeAction), i0.ɵɵinject(i2.EmailPrimarySelectAction), i0.ɵɵinject(i3.RequiredAction), i0.ɵɵinject(i4.UpdateBaseCurrencyAction), i0.ɵɵinject(i5.UpdateCurrencyAction), i0.ɵɵinject(i6.UpdateFlexRelateModuleAction)); }, token: FieldLogicManager, providedIn: "root" });
FieldLogicManager.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
FieldLogicManager.ctorParameters = () => [
    { type: DisplayTypeAction },
    { type: EmailPrimarySelectAction },
    { type: RequiredAction },
    { type: UpdateBaseCurrencyAction },
    { type: UpdateCurrencyAction },
    { type: UpdateFlexRelateModuleAction }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtbG9naWMubWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9maWVsZHMvZmllbGQtbG9naWMvZmllbGQtbG9naWMubWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxvREFBb0QsQ0FBQztBQUdyRixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUNyRSxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxvREFBb0QsQ0FBQztBQUM1RixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDMUQsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sbURBQW1ELENBQUM7QUFDM0YsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sOENBQThDLENBQUM7QUFDbEYsT0FBTyxFQUFDLDRCQUE0QixFQUFDLE1BQU0sOERBQThELENBQUM7Ozs7Ozs7O0FBSzFHLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxpQkFBdUM7SUFFMUUsWUFDSSxXQUE4QixFQUM5Qix3QkFBa0QsRUFDbEQsUUFBd0IsRUFDeEIsa0JBQTRDLEVBQzVDLGNBQW9DLEVBQ3BDLHNCQUFvRDtRQUVwRCxLQUFLLEVBQUUsQ0FBQztRQUNSLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7UUFDckYsd0JBQXdCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElB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LyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCYXNlQWN0aW9uTWFuYWdlcn0gZnJvbSAnLi4vLi4vc2VydmljZXMvYWN0aW9ucy9iYXNlLWFjdGlvbi1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHtGaWVsZExvZ2ljQWN0aW9uRGF0YX0gZnJvbSAnLi9maWVsZC1sb2dpYy5hY3Rpb24nO1xuaW1wb3J0IHtBY3Rpb24sIEFjdGlvbkNvbnRleHQsIEZpZWxkLCBNb2RlQWN0aW9ucywgUmVjb3JkLCBWaWV3TW9kZX0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7RGlzcGxheVR5cGVBY3Rpb259IGZyb20gJy4vZGlzcGxheS10eXBlL2Rpc3BsYXktdHlwZS5hY3Rpb24nO1xuaW1wb3J0IHtFbWFpbFByaW1hcnlTZWxlY3RBY3Rpb259IGZyb20gJy4vZW1haWwtcHJpbWFyeS1zZWxlY3QvZW1haWwtcHJpbWFyeS1zZWxlY3QuYWN0aW9uJztcbmltcG9ydCB7UmVxdWlyZWRBY3Rpb259IGZyb20gJy4vcmVxdWlyZWQvcmVxdWlyZWQuYWN0aW9uJztcbmltcG9ydCB7VXBkYXRlQmFzZUN1cnJlbmN5QWN0aW9ufSBmcm9tICcuL2N1cnJlbmN5LWNvbnZlcnNpb24vdXBkYXRlLWJhc2UtY3VycmVuY3kuYWN0aW9uJztcbmltcG9ydCB7VXBkYXRlQ3VycmVuY3lBY3Rpb259IGZyb20gJy4vY3VycmVuY3ktY29udmVyc2lvbi91cGRhdGUtY3VycmVuY3kuYWN0aW9uJztcbmltcG9ydCB7VXBkYXRlRmxleFJlbGF0ZU1vZHVsZUFjdGlvbn0gZnJvbSAnLi91cGRhdGUtZmxleC1yZWxhdGUtbW9kdWxlL3VwZGF0ZS1mbGV4LXJlbGF0ZS1tb2R1bGUuYWN0aW9uJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBGaWVsZExvZ2ljTWFuYWdlciBleHRlbmRzIEJhc2VBY3Rpb25NYW5hZ2VyPEZpZWxkTG9naWNBY3Rpb25EYXRhPiB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgZGlzcGxheVR5cGU6IERpc3BsYXlUeXBlQWN0aW9uLFxuICAgICAgICBlbWFpbFByaW1hcnlTZWxlY3RBY3Rpb246IEVtYWlsUHJpbWFyeVNlbGVjdEFjdGlvbixcbiAgICAgICAgcmVxdWlyZWQ6IFJlcXVpcmVkQWN0aW9uLFxuICAgICAgICB1cGRhdGVCYXNlQ3VycmVuY3k6IFVwZGF0ZUJhc2VDdXJyZW5jeUFjdGlvbixcbiAgICAgICAgdXBkYXRlQ3VycmVuY3k6IFVwZGF0ZUN1cnJlbmN5QWN0aW9uLFxuICAgICAgICB1cGRhdGVGbGV4UmVsYXRlTW9kdWxlOiBVcGRhdGVGbGV4UmVsYXRlTW9kdWxlQWN0aW9uXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGRpc3BsYXlUeXBlLm1vZGVzLmZvckVhY2gobW9kZSA9PiB0aGlzLmFjdGlvbnNbbW9kZV1bZGlzcGxheVR5cGUua2V5XSA9IGRpc3BsYXlUeXBlKTtcbiAgICAgICAgZW1haWxQcmltYXJ5U2VsZWN0QWN0aW9uLm1vZGVzLmZvckVhY2gobW9kZSA9PiB0aGlzLmFjdGlvbnNbbW9kZV1bZW1haWxQcmltYXJ5U2VsZWN0QWN0aW9uLmtleV0gPSBlbWFpbFByaW1hcnlTZWxlY3RBY3Rpb24pO1xuICAgICAgICByZXF1aXJlZC5tb2Rlcy5mb3JFYWNoKG1vZGUgPT4gdGhpcy5hY3Rpb25zW21vZGVdW3JlcXVpcmVkLmtleV0gPSByZXF1aXJlZCk7XG4gICAgICAgIHVwZGF0ZUJhc2VDdXJyZW5jeS5tb2Rlcy5mb3JFYWNoKG1vZGUgPT4gdGhpcy5hY3Rpb25zW21vZGVdW3VwZGF0ZUJhc2VDdXJyZW5jeS5rZXldID0gdXBkYXRlQmFzZUN1cnJlbmN5KTtcbiAgICAgICAgdXBkYXRlQ3VycmVuY3kubW9kZXMuZm9yRWFjaChtb2RlID0+IHRoaXMuYWN0aW9uc1ttb2RlXVt1cGRhdGVDdXJyZW5jeS5rZXldID0gdXBkYXRlQ3VycmVuY3kpO1xuICAgICAgICB1cGRhdGVGbGV4UmVsYXRlTW9kdWxlLm1vZGVzLmZvckVhY2gobW9kZSA9PiB0aGlzLmFjdGlvbnNbbW9kZV1bdXBkYXRlRmxleFJlbGF0ZU1vZHVsZS5rZXldID0gdXBkYXRlRmxleFJlbGF0ZU1vZHVsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVuIGxvZ2ljIGZvciB0aGUgZ2l2ZW4gZmllbGRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZmllbGRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbW9kZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWNvcmRcbiAgICAgKi9cbiAgICBydW5Mb2dpYyhmaWVsZDogRmllbGQsIG1vZGU6IFZpZXdNb2RlLCByZWNvcmQ6IFJlY29yZCk6IHZvaWQge1xuICAgICAgICBpZiAoIWZpZWxkLmxvZ2ljKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhY3Rpb25zID0gT2JqZWN0LmtleXMoZmllbGQubG9naWMpLm1hcChrZXkgPT4gZmllbGQubG9naWNba2V5XSk7XG5cbiAgICAgICAgY29uc3QgbW9kZUFjdGlvbnMgPSB0aGlzLnBhcnNlTW9kZUFjdGlvbnMoYWN0aW9ucywgbW9kZSk7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB7XG4gICAgICAgICAgICByZWNvcmQsXG4gICAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICAgIG1vZHVsZTogcmVjb3JkLm1vZHVsZVxuICAgICAgICB9IGFzIEFjdGlvbkNvbnRleHQ7XG5cbiAgICAgICAgbW9kZUFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4ge1xuICAgICAgICAgICAgdGhpcy5ydW5BY3Rpb24oYWN0aW9uLCBtb2RlLCBjb250ZXh0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVuIHRoZSBhY3Rpb24gdXNpbmcgZ2l2ZW4gY29udGV4dFxuICAgICAqIEBwYXJhbSBhY3Rpb25cbiAgICAgKiBAcGFyYW0gbW9kZVxuICAgICAqIEBwYXJhbSBjb250ZXh0XG4gICAgICovXG4gICAgcnVuQWN0aW9uKGFjdGlvbjogQWN0aW9uLCBtb2RlOiBWaWV3TW9kZSwgY29udGV4dDogQWN0aW9uQ29udGV4dCA9IG51bGwpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ydW5Gcm9udEVuZEFjdGlvbihhY3Rpb24sIG1vZGUsIGNvbnRleHQpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUnVuIGZyb250IGVuZCBhY3Rpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gYWN0aW9uXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG1vZGVcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gY29udGV4dFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBydW5Gcm9udEVuZEFjdGlvbihhY3Rpb246IEFjdGlvbiwgbW9kZTogVmlld01vZGUsIGNvbnRleHQ6IEFjdGlvbkNvbnRleHQgPSBudWxsKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRhdGE6IEZpZWxkTG9naWNBY3Rpb25EYXRhID0gdGhpcy5idWlsZEFjdGlvbkRhdGEoYWN0aW9uLCBjb250ZXh0KTtcblxuICAgICAgICB0aGlzLnJ1bihhY3Rpb24sIG1vZGUsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBtb2R1bGUgbmFtZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjb250ZXh0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldE1vZHVsZU5hbWUoY29udGV4dD86IEFjdGlvbkNvbnRleHQpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gY29udGV4dC5tb2R1bGU7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGJ1aWxkQWN0aW9uRGF0YShhY3Rpb246IEFjdGlvbiwgY29udGV4dD86IEFjdGlvbkNvbnRleHQpOiBGaWVsZExvZ2ljQWN0aW9uRGF0YSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmaWVsZDogY29udGV4dC5maWVsZCxcbiAgICAgICAgICAgIHJlY29yZDogKGNvbnRleHQgJiYgY29udGV4dC5yZWNvcmQpIHx8IG51bGwsXG4gICAgICAgIH0gYXMgRmllbGRMb2dpY0FjdGlvbkRhdGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgbW9kZSBhY3Rpb25zXG4gICAgICogQHBhcmFtIGRlY2xhcmVkQWN0aW9uc1xuICAgICAqIEBwYXJhbSBtb2RlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHBhcnNlTW9kZUFjdGlvbnMoZGVjbGFyZWRBY3Rpb25zOiBBY3Rpb25bXSwgbW9kZTogVmlld01vZGUpIHtcbiAgICAgICAgaWYgKCFkZWNsYXJlZEFjdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGF2YWlsYWJsZUFjdGlvbnMgPSB7XG4gICAgICAgICAgICBsaXN0OiBbXSxcbiAgICAgICAgICAgIGRldGFpbDogW10sXG4gICAgICAgICAgICBlZGl0OiBbXSxcbiAgICAgICAgICAgIGNyZWF0ZTogW10sXG4gICAgICAgICAgICBtYXNzdXBkYXRlOiBbXSxcbiAgICAgICAgICAgIGZpbHRlcjogW10sXG4gICAgICAgIH0gYXMgTW9kZUFjdGlvbnM7XG5cbiAgICAgICAgaWYgKGRlY2xhcmVkQWN0aW9ucyAmJiBkZWNsYXJlZEFjdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBkZWNsYXJlZEFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4ge1xuICAgICAgICAgICAgICAgIGlmICghYWN0aW9uLm1vZGVzIHx8ICFhY3Rpb24ubW9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhY3Rpb24ubW9kZXMuZm9yRWFjaChhY3Rpb25Nb2RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhdmFpbGFibGVBY3Rpb25zW2FjdGlvbk1vZGVdICYmICFhY3Rpb24uYXN5bmNQcm9jZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlQWN0aW9uc1thY3Rpb25Nb2RlXS5wdXNoKGFjdGlvbik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjdGlvbnMgPSBbXTtcblxuICAgICAgICBhdmFpbGFibGVBY3Rpb25zW21vZGVdLmZvckVhY2goYWN0aW9uID0+IHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaChhY3Rpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gYWN0aW9ucztcbiAgICB9XG5cbn1cbiJdfQ==