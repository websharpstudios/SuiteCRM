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
import { FormControlUtils } from '../../field/form-control.utils';
import * as i0 from "@angular/core";
import * as i1 from "../../field/form-control.utils";
export const requiredValidator = (utils) => ((control) => {
    if (utils.isEmptyTrimmedInputValue(control.value)) {
        return {
            required: {
                required: true,
                message: {
                    labelKey: 'LBL_VALIDATION_ERROR_REQUIRED',
                    context: {
                        value: control.value
                    }
                }
            }
        };
    }
    return null;
});
export const booleanRequiredValidator = (utils) => ((control) => {
    if (utils.isEmptyBooleanInputValue(control.value)) {
        return {
            required: {
                required: true,
                message: {
                    labelKey: 'LBL_VALIDATION_ERROR_REQUIRED',
                    context: {
                        value: control.value
                    }
                }
            }
        };
    }
    return null;
});
export class RequiredValidator {
    constructor(utils) {
        this.utils = utils;
    }
    applies(record, viewField) {
        if (!viewField || !viewField.fieldDefinition) {
            return false;
        }
        return !!viewField.fieldDefinition.required;
    }
    getValidator(viewField) {
        if (viewField.type === 'boolean') {
            return [booleanRequiredValidator(this.utils)];
        }
        return [requiredValidator(this.utils)];
    }
}
RequiredValidator.ɵprov = i0.ɵɵdefineInjectable({ factory: function RequiredValidator_Factory() { return new RequiredValidator(i0.ɵɵinject(i1.FormControlUtils)); }, token: RequiredValidator, providedIn: "root" });
RequiredValidator.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
RequiredValidator.ctorParameters = () => [
    { type: FormControlUtils }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZWQudmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3NlcnZpY2VzL3JlY29yZC92YWxpZGF0aW9uL3ZhbGlkYXRvcnMvcmVxdWlyZWQudmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBTXpDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGdDQUFnQyxDQUFDOzs7QUFFaEUsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxLQUF1QixFQUF1QixFQUFFLENBQUMsQ0FDL0UsQ0FBQyxPQUF3QixFQUFtQyxFQUFFO0lBRTFELElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUMvQyxPQUFPO1lBQ0gsUUFBUSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE9BQU8sRUFBRTtvQkFDTCxRQUFRLEVBQUUsK0JBQStCO29CQUN6QyxPQUFPLEVBQUU7d0JBQ0wsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO3FCQUN2QjtpQkFDSjthQUNKO1NBQ0osQ0FBQztLQUNMO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyxDQUNKLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSx3QkFBd0IsR0FBRyxDQUFDLEtBQXVCLEVBQXVCLEVBQUUsQ0FBQyxDQUN0RixDQUFDLE9BQXdCLEVBQW1DLEVBQUU7SUFFMUQsSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQy9DLE9BQU87WUFDSCxRQUFRLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLElBQUk7Z0JBQ2QsT0FBTyxFQUFFO29CQUNMLFFBQVEsRUFBRSwrQkFBK0I7b0JBQ3pDLE9BQU8sRUFBRTt3QkFDTCxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7cUJBQ3ZCO2lCQUNKO2FBQ0o7U0FDSixDQUFDO0tBQ0w7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDLENBQ0osQ0FBQztBQUtGLE1BQU0sT0FBTyxpQkFBaUI7SUFFMUIsWUFBc0IsS0FBdUI7UUFBdkIsVUFBSyxHQUFMLEtBQUssQ0FBa0I7SUFDN0MsQ0FBQztJQUVELE9BQU8sQ0FBQyxNQUFjLEVBQUUsU0FBOEI7UUFDbEQsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUU7WUFDMUMsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQztJQUNoRCxDQUFDO0lBRUQsWUFBWSxDQUFDLFNBQThCO1FBRXZDLElBQUcsU0FBUyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUM7WUFDNUIsT0FBTyxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ2pEO1FBRUQsT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7Ozs7WUF2QkosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUE5Q08sZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtWYWxpZGF0b3JJbnRlcmZhY2V9IGZyb20gJy4uL3ZhbGlkYXRvci5JbnRlcmZhY2UnO1xuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7UmVjb3JkfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtWaWV3RmllbGREZWZpbml0aW9ufSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtTdGFuZGFyZFZhbGlkYXRpb25FcnJvcnMsIFN0YW5kYXJkVmFsaWRhdG9yRm59IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge0Zvcm1Db250cm9sVXRpbHN9IGZyb20gJy4uLy4uL2ZpZWxkL2Zvcm0tY29udHJvbC51dGlscyc7XG5cbmV4cG9ydCBjb25zdCByZXF1aXJlZFZhbGlkYXRvciA9ICh1dGlsczogRm9ybUNvbnRyb2xVdGlscyk6IFN0YW5kYXJkVmFsaWRhdG9yRm4gPT4gKFxuICAgIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBTdGFuZGFyZFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcblxuICAgICAgICBpZiAodXRpbHMuaXNFbXB0eVRyaW1tZWRJbnB1dFZhbHVlKGNvbnRyb2wudmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbEtleTogJ0xCTF9WQUxJREFUSU9OX0VSUk9SX1JFUVVJUkVEJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29udHJvbC52YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbik7XG5cbmV4cG9ydCBjb25zdCBib29sZWFuUmVxdWlyZWRWYWxpZGF0b3IgPSAodXRpbHM6IEZvcm1Db250cm9sVXRpbHMpOiBTdGFuZGFyZFZhbGlkYXRvckZuID0+IChcbiAgICAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogU3RhbmRhcmRWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzRW1wdHlCb29sZWFuSW5wdXRWYWx1ZShjb250cm9sLnZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICByZXF1aXJlZDoge1xuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxLZXk6ICdMQkxfVkFMSURBVElPTl9FUlJPUl9SRVFVSVJFRCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNvbnRyb2wudmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4pO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFJlcXVpcmVkVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9ySW50ZXJmYWNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCB1dGlsczogRm9ybUNvbnRyb2xVdGlscykge1xuICAgIH1cblxuICAgIGFwcGxpZXMocmVjb3JkOiBSZWNvcmQsIHZpZXdGaWVsZDogVmlld0ZpZWxkRGVmaW5pdGlvbik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXZpZXdGaWVsZCB8fCAhdmlld0ZpZWxkLmZpZWxkRGVmaW5pdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhdmlld0ZpZWxkLmZpZWxkRGVmaW5pdGlvbi5yZXF1aXJlZDtcbiAgICB9XG5cbiAgICBnZXRWYWxpZGF0b3Iodmlld0ZpZWxkOiBWaWV3RmllbGREZWZpbml0aW9uKTogU3RhbmRhcmRWYWxpZGF0b3JGbltdIHtcblxuICAgICAgICBpZih2aWV3RmllbGQudHlwZSA9PT0gJ2Jvb2xlYW4nKXtcbiAgICAgICAgICAgIHJldHVybiBbYm9vbGVhblJlcXVpcmVkVmFsaWRhdG9yKHRoaXMudXRpbHMpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbcmVxdWlyZWRWYWxpZGF0b3IodGhpcy51dGlscyldO1xuICAgIH1cblxufVxuIl19