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
import { SystemConfigStore } from '../../../store/system-config/system-config.store';
import * as i0 from "@angular/core";
import * as i1 from "../../../store/system-config/system-config.store";
export class ModuleNameMapper {
    constructor(systemConfig) {
        this.systemConfig = systemConfig;
    }
    /**
     * Public Api
     */
    /**
     * Map the legacy name to frontend
     *
     * @param {string} module the module name
     * @returns {string} frontend name
     */
    toFrontend(module) {
        const map = this.getLegacyToFrontendMap();
        if (!map[module]) {
            return module;
        }
        return map[module];
    }
    /**
     * Map the frontend name to legacy
     *
     * @param {string} module the module name
     * @returns {string} frontend name
     */
    toLegacy(module) {
        const map = this.getFrontendToLegacyMap();
        if (!map[module]) {
            return module;
        }
        return map[module];
    }
    /**
     * Check if module is valid
     *
     * @param {string} module the module name
     * @returns {boolean} is valid
     */
    isValid(module) {
        const map = this.getFrontendToLegacyMap();
        let valid = false;
        if (map[module]) {
            valid = true;
        }
        return valid;
    }
    /**
     * Internal API
     */
    /**
     * Get the legacy to frontend map
     *
     * @returns {{}} map
     */
    getLegacyToFrontendMap() {
        return this.systemConfig.getConfigValue('module_name_map');
    }
    /**
     * Get the frontend to legacy map
     *
     * @returns {{}} map
     */
    getFrontendToLegacyMap() {
        const map = this.systemConfig.getConfigValue('module_name_map');
        const invertedMap = {};
        Object.keys(map).forEach((legacyName) => {
            const frontendName = map[legacyName];
            invertedMap[frontendName] = legacyName;
        });
        return invertedMap;
    }
}
ModuleNameMapper.ɵprov = i0.ɵɵdefineInjectable({ factory: function ModuleNameMapper_Factory() { return new ModuleNameMapper(i0.ɵɵinject(i1.SystemConfigStore)); }, token: ModuleNameMapper, providedIn: "root" });
ModuleNameMapper.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
ModuleNameMapper.ctorParameters = () => [
    { type: SystemConfigStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLW5hbWUtbWFwcGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc2VydmljZXMvbmF2aWdhdGlvbi9tb2R1bGUtbmFtZS1tYXBwZXIvbW9kdWxlLW5hbWUtbWFwcGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sa0RBQWtELENBQUM7OztBQUluRixNQUFNLE9BQU8sZ0JBQWdCO0lBRXpCLFlBQW9CLFlBQStCO1FBQS9CLGlCQUFZLEdBQVosWUFBWSxDQUFtQjtJQUNuRCxDQUFDO0lBRUQ7O09BRUc7SUFFSDs7Ozs7T0FLRztJQUNJLFVBQVUsQ0FBQyxNQUFjO1FBQzVCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDZCxPQUFPLE1BQU0sQ0FBQztTQUNqQjtRQUVELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLFFBQVEsQ0FBQyxNQUFjO1FBQzFCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDZCxPQUFPLE1BQU0sQ0FBQztTQUNqQjtRQUVELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLE9BQU8sQ0FBQyxNQUFjO1FBQ3pCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzFDLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVsQixJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNiLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDaEI7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBR0Q7O09BRUc7SUFFSDs7OztPQUlHO0lBQ08sc0JBQXNCO1FBQzVCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNPLHNCQUFzQjtRQUM1QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUV2QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQ3BDLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNyQyxXQUFXLENBQUMsWUFBWSxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQzs7OztZQXRGSixVQUFVLFNBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzs7WUFIeEIsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTeXN0ZW1Db25maWdTdG9yZX0gZnJvbSAnLi4vLi4vLi4vc3RvcmUvc3lzdGVtLWNvbmZpZy9zeXN0ZW0tY29uZmlnLnN0b3JlJztcbmltcG9ydCB7U3RyaW5nTWFwfSBmcm9tICdjb21tb24nO1xuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNb2R1bGVOYW1lTWFwcGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc3lzdGVtQ29uZmlnOiBTeXN0ZW1Db25maWdTdG9yZSkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFB1YmxpYyBBcGlcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIE1hcCB0aGUgbGVnYWN5IG5hbWUgdG8gZnJvbnRlbmRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2R1bGUgdGhlIG1vZHVsZSBuYW1lXG4gICAgICogQHJldHVybnMge3N0cmluZ30gZnJvbnRlbmQgbmFtZVxuICAgICAqL1xuICAgIHB1YmxpYyB0b0Zyb250ZW5kKG1vZHVsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgbWFwID0gdGhpcy5nZXRMZWdhY3lUb0Zyb250ZW5kTWFwKCk7XG4gICAgICAgIGlmICghbWFwW21vZHVsZV0pIHtcbiAgICAgICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWFwW21vZHVsZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFwIHRoZSBmcm9udGVuZCBuYW1lIHRvIGxlZ2FjeVxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZHVsZSB0aGUgbW9kdWxlIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBmcm9udGVuZCBuYW1lXG4gICAgICovXG4gICAgcHVibGljIHRvTGVnYWN5KG1vZHVsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgbWFwID0gdGhpcy5nZXRGcm9udGVuZFRvTGVnYWN5TWFwKCk7XG4gICAgICAgIGlmICghbWFwW21vZHVsZV0pIHtcbiAgICAgICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWFwW21vZHVsZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgbW9kdWxlIGlzIHZhbGlkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kdWxlIHRoZSBtb2R1bGUgbmFtZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBpcyB2YWxpZFxuICAgICAqL1xuICAgIHB1YmxpYyBpc1ZhbGlkKG1vZHVsZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IG1hcCA9IHRoaXMuZ2V0RnJvbnRlbmRUb0xlZ2FjeU1hcCgpO1xuICAgICAgICBsZXQgdmFsaWQgPSBmYWxzZTtcblxuICAgICAgICBpZiAobWFwW21vZHVsZV0pIHtcbiAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWxpZDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEludGVybmFsIEFQSVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBsZWdhY3kgdG8gZnJvbnRlbmQgbWFwXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7e319IG1hcFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXRMZWdhY3lUb0Zyb250ZW5kTWFwKCk6IFN0cmluZ01hcCB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5c3RlbUNvbmZpZy5nZXRDb25maWdWYWx1ZSgnbW9kdWxlX25hbWVfbWFwJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBmcm9udGVuZCB0byBsZWdhY3kgbWFwXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7e319IG1hcFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXRGcm9udGVuZFRvTGVnYWN5TWFwKCk6IFN0cmluZ01hcCB7XG4gICAgICAgIGNvbnN0IG1hcCA9IHRoaXMuc3lzdGVtQ29uZmlnLmdldENvbmZpZ1ZhbHVlKCdtb2R1bGVfbmFtZV9tYXAnKTtcbiAgICAgICAgY29uc3QgaW52ZXJ0ZWRNYXAgPSB7fTtcblxuICAgICAgICBPYmplY3Qua2V5cyhtYXApLmZvckVhY2goKGxlZ2FjeU5hbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZyb250ZW5kTmFtZSA9IG1hcFtsZWdhY3lOYW1lXTtcbiAgICAgICAgICAgIGludmVydGVkTWFwW2Zyb250ZW5kTmFtZV0gPSBsZWdhY3lOYW1lO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gaW52ZXJ0ZWRNYXA7XG4gICAgfVxufVxuIl19