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
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, tap } from 'rxjs/operators';
import { EntityGQL } from '../../services/api/graphql-api/api.entity.get';
import { AppStateStore } from '../app-state/app-state.store';
import { deepClone, emptyObject } from 'common';
import { SvgIconRegistryService } from 'angular-svg-icon';
import * as i0 from "@angular/core";
import * as i1 from "../../services/api/graphql-api/api.entity.get";
import * as i2 from "../app-state/app-state.store";
import * as i3 from "angular-svg-icon";
const initialState = {
    theme: null,
    images: {}
};
let internalState = deepClone(initialState);
let cachedTheme = null;
let cache$ = null;
export class ThemeImagesStore {
    constructor(recordGQL, appStateStore, iconRegistry) {
        this.recordGQL = recordGQL;
        this.appStateStore = appStateStore;
        this.iconRegistry = iconRegistry;
        this.store = new BehaviorSubject(internalState);
        this.state$ = this.store.asObservable();
        this.resourceName = 'themeImages';
        this.frontendName = 'theme-images';
        this.fieldsMetadata = {
            fields: [
                'id',
                '_id',
                'items'
            ]
        };
        this.images$ = this.state$.pipe(map(state => state.images), distinctUntilChanged());
    }
    /**
     * Public Api
     */
    /**
     * Clear state
     */
    clear() {
        cachedTheme = null;
        cache$ = null;
        this.updateState(deepClone(initialState));
    }
    clearAuthBased() {
    }
    /**
     * Change the current theme
     *
     * @param {string} theme to set
     */
    changeTheme(theme) {
        this.appStateStore.updateLoading('change-theme', true);
        this.load(theme).pipe(tap(() => this.appStateStore.updateLoading('change-theme', false))).subscribe();
    }
    /**
     * Returns the currently active image theme
     *
     * @returns {string} the theme
     */
    getTheme() {
        return internalState.theme;
    }
    /**
     * Initial ThemeImages load if not cached and update state.
     * Returns observable to be used in resolver if needed
     *
     * @param {string} theme to load
     * @returns {object} Observable<any>
     */
    load(theme) {
        return this.getThemeImages(theme).pipe(tap(images => {
            this.updateState(Object.assign(Object.assign({}, internalState), { images, theme }));
        }));
    }
    /**
     * Internal API
     */
    /**
     * Update the state
     *
     * @param {object} state to set
     */
    updateState(state) {
        this.store.next(internalState = state);
    }
    /**
     * Get theme images cached Observable or call the backend
     *
     * @param {string} theme to retrieve
     * @returns {object} Observable<any>
     */
    getThemeImages(theme) {
        if (cachedTheme !== theme || cache$ === null) {
            cachedTheme = theme;
            cache$ = this.fetch(theme).pipe(shareReplay(1));
        }
        return cache$;
    }
    /**
     * Fetch the theme images from the backend
     *
     * @param {string} theme to load
     * @returns {object} Observable<any>
     */
    fetch(theme) {
        return this.recordGQL
            .fetch(this.resourceName, `/api/${this.frontendName}/${theme}`, this.fieldsMetadata)
            .pipe(map(({ data }) => {
            let images = {};
            if (data && data.themeImages) {
                images = data.themeImages.items;
            }
            if (!emptyObject(images)) {
                Object.keys(images).forEach(key => {
                    var _a, _b;
                    const image = images[key];
                    const content = (_a = image['content']) !== null && _a !== void 0 ? _a : '';
                    const name = (_b = image['name']) !== null && _b !== void 0 ? _b : '';
                    if (content === '' || name === '') {
                        return;
                    }
                    this.iconRegistry.addSvg(name, content);
                });
            }
            return images;
        }));
    }
}
ThemeImagesStore.ɵprov = i0.ɵɵdefineInjectable({ factory: function ThemeImagesStore_Factory() { return new ThemeImagesStore(i0.ɵɵinject(i1.EntityGQL), i0.ɵɵinject(i2.AppStateStore), i0.ɵɵinject(i3.SvgIconRegistryService)); }, token: ThemeImagesStore, providedIn: "root" });
ThemeImagesStore.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
ThemeImagesStore.ctorParameters = () => [
    { type: EntityGQL },
    { type: AppStateStore },
    { type: SvgIconRegistryService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUtaW1hZ2VzLnN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3N0b3JlL3RoZW1lLWltYWdlcy90aGVtZS1pbWFnZXMuc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUNqRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzRSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sK0NBQStDLENBQUM7QUFDeEUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBRTNELE9BQU8sRUFBQyxTQUFTLEVBQUUsV0FBVyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzlDLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDOzs7OztBQWlCeEQsTUFBTSxZQUFZLEdBQWdCO0lBQzlCLEtBQUssRUFBRSxJQUFJO0lBQ1gsTUFBTSxFQUFFLEVBQUU7Q0FDYixDQUFDO0FBRUYsSUFBSSxhQUFhLEdBQWdCLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUV6RCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDdkIsSUFBSSxNQUFNLEdBQW9CLElBQUksQ0FBQztBQUtuQyxNQUFNLE9BQU8sZ0JBQWdCO0lBbUJ6QixZQUNjLFNBQW9CLEVBQ3BCLGFBQTRCLEVBQzVCLFlBQW9DO1FBRnBDLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFDcEIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsaUJBQVksR0FBWixZQUFZLENBQXdCO1FBZnhDLFVBQUssR0FBRyxJ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RTtnQkFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7O29CQUM5QixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzFCLE1BQU0sT0FBTyxHQUFHLE1BQUEsS0FBSyxDQUFDLFNBQVMsQ0FBQyxtQ0FBSSxFQUFFLENBQUM7b0JBQ3ZDLE1BQU0sSUFBSSxHQUFHLE1BQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxtQ0FBSSxFQUFFLENBQUM7b0JBRWpDLElBQUksT0FBTyxLQUFLLEVBQUUsSUFBSSxJQUFJLEtBQUssRUFBRSxFQUFFO3dCQUMvQixPQUFPO3FCQUNWO29CQUVELElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDNUMsQ0FBQyxDQUFDLENBQUM7YUFDTjtZQUVELE9BQU8sTUFBTSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUNMLENBQUM7SUFDVixDQUFDOzs7O1lBMUpKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7O1lBakNPLFNBQVM7WUFDVCxhQUFhO1lBR2Isc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkaXN0aW5jdFVudGlsQ2hhbmdlZCwgbWFwLCBzaGFyZVJlcGxheSwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7RW50aXR5R1FMfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hcGkvZ3JhcGhxbC1hcGkvYXBpLmVudGl0eS5nZXQnO1xuaW1wb3J0IHtBcHBTdGF0ZVN0b3JlfSBmcm9tICcuLi9hcHAtc3RhdGUvYXBwLXN0YXRlLnN0b3JlJztcbmltcG9ydCB7U3RhdGVTdG9yZX0gZnJvbSAnLi4vc3RhdGUnO1xuaW1wb3J0IHtkZWVwQ2xvbmUsIGVtcHR5T2JqZWN0fSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtTdmdJY29uUmVnaXN0cnlTZXJ2aWNlfSBmcm9tICdhbmd1bGFyLXN2Zy1pY29uJztcblxuZXhwb3J0IGludGVyZmFjZSBUaGVtZUltYWdlIHtcbiAgICBwYXRoOiBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHR5cGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUaGVtZUltYWdlcyB7XG4gICAgdGhlbWU6IHN0cmluZztcbiAgICBpbWFnZXM6IFRoZW1lSW1hZ2VNYXA7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGhlbWVJbWFnZU1hcCB7XG4gICAgW2tleTogc3RyaW5nXTogVGhlbWVJbWFnZTtcbn1cblxuY29uc3QgaW5pdGlhbFN0YXRlOiBUaGVtZUltYWdlcyA9IHtcbiAgICB0aGVtZTogbnVsbCxcbiAgICBpbWFnZXM6IHt9XG59O1xuXG5sZXQgaW50ZXJuYWxTdGF0ZTogVGhlbWVJbWFnZXMgPSBkZWVwQ2xvbmUoaW5pdGlhbFN0YXRlKTtcblxubGV0IGNhY2hlZFRoZW1lID0gbnVsbDtcbmxldCBjYWNoZSQ6IE9ic2VydmFibGU8YW55PiA9IG51bGw7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIFRoZW1lSW1hZ2VzU3RvcmUgaW1wbGVtZW50cyBTdGF0ZVN0b3JlIHtcblxuICAgIC8qKlxuICAgICAqIFB1YmxpYyBsb25nLWxpdmVkIG9ic2VydmFibGUgc3RyZWFtc1xuICAgICAqL1xuICAgIGltYWdlcyQ6IE9ic2VydmFibGU8VGhlbWVJbWFnZU1hcD47XG5cbiAgICBwcm90ZWN0ZWQgc3RvcmUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFRoZW1lSW1hZ2VzPihpbnRlcm5hbFN0YXRlKTtcbiAgICBwcm90ZWN0ZWQgc3RhdGUkID0gdGhpcy5zdG9yZS5hc09ic2VydmFibGUoKTtcbiAgICBwcm90ZWN0ZWQgcmVzb3VyY2VOYW1lID0gJ3RoZW1lSW1hZ2VzJztcbiAgICBwcm90ZWN0ZWQgZnJvbnRlbmROYW1lID0gJ3RoZW1lLWltYWdlcyc7XG4gICAgcHJvdGVjdGVkIGZpZWxkc01ldGFkYXRhID0ge1xuICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgICdpZCcsXG4gICAgICAgICAgICAnX2lkJyxcbiAgICAgICAgICAgICdpdGVtcydcbiAgICAgICAgXVxuICAgIH07XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlY29yZEdRTDogRW50aXR5R1FMLFxuICAgICAgICBwcm90ZWN0ZWQgYXBwU3RhdGVTdG9yZTogQXBwU3RhdGVTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIGljb25SZWdpc3RyeTogU3ZnSWNvblJlZ2lzdHJ5U2VydmljZVxuICAgICkge1xuICAgICAgICB0aGlzLmltYWdlcyQgPSB0aGlzLnN0YXRlJC5waXBlKG1hcChzdGF0ZSA9PiBzdGF0ZS5pbWFnZXMpLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFB1YmxpYyBBcGlcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIENsZWFyIHN0YXRlXG4gICAgICovXG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgICAgICBjYWNoZWRUaGVtZSA9IG51bGw7XG4gICAgICAgIGNhY2hlJCA9IG51bGw7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoZGVlcENsb25lKGluaXRpYWxTdGF0ZSkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbGVhckF1dGhCYXNlZCgpOiB2b2lkIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgdGhlIGN1cnJlbnQgdGhlbWVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0aGVtZSB0byBzZXRcbiAgICAgKi9cbiAgICBwdWJsaWMgY2hhbmdlVGhlbWUodGhlbWU6IHN0cmluZyk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMuYXBwU3RhdGVTdG9yZS51cGRhdGVMb2FkaW5nKCdjaGFuZ2UtdGhlbWUnLCB0cnVlKTtcblxuICAgICAgICB0aGlzLmxvYWQodGhlbWUpLnBpcGUoXG4gICAgICAgICAgICB0YXAoKCkgPT4gdGhpcy5hcHBTdGF0ZVN0b3JlLnVwZGF0ZUxvYWRpbmcoJ2NoYW5nZS10aGVtZScsIGZhbHNlKSlcbiAgICAgICAgKS5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50bHkgYWN0aXZlIGltYWdlIHRoZW1lXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgdGhlbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0VGhlbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGludGVybmFsU3RhdGUudGhlbWU7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsIFRoZW1lSW1hZ2VzIGxvYWQgaWYgbm90IGNhY2hlZCBhbmQgdXBkYXRlIHN0YXRlLlxuICAgICAqIFJldHVybnMgb2JzZXJ2YWJsZSB0byBiZSB1c2VkIGluIHJlc29sdmVyIGlmIG5lZWRlZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lIHRvIGxvYWRcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBPYnNlcnZhYmxlPGFueT5cbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZCh0aGVtZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcblxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUaGVtZUltYWdlcyh0aGVtZSkucGlwZShcbiAgICAgICAgICAgIHRhcChpbWFnZXMgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGUoey4uLmludGVybmFsU3RhdGUsIGltYWdlcywgdGhlbWV9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBBUElcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aGUgc3RhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZSB0byBzZXRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgdXBkYXRlU3RhdGUoc3RhdGU6IFRoZW1lSW1hZ2VzKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RvcmUubmV4dChpbnRlcm5hbFN0YXRlID0gc3RhdGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGVtZSBpbWFnZXMgY2FjaGVkIE9ic2VydmFibGUgb3IgY2FsbCB0aGUgYmFja2VuZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lIHRvIHJldHJpZXZlXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxhbnk+XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldFRoZW1lSW1hZ2VzKHRoZW1lOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuXG4gICAgICAgIGlmIChjYWNoZWRUaGVtZSAhPT0gdGhlbWUgfHwgY2FjaGUkID09PSBudWxsKSB7XG4gICAgICAgICAgICBjYWNoZWRUaGVtZSA9IHRoZW1lO1xuICAgICAgICAgICAgY2FjaGUkID0gdGhpcy5mZXRjaCh0aGVtZSkucGlwZShcbiAgICAgICAgICAgICAgICBzaGFyZVJlcGxheSgxKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYWNoZSQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2ggdGhlIHRoZW1lIGltYWdlcyBmcm9tIHRoZSBiYWNrZW5kXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGhlbWUgdG8gbG9hZFxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IE9ic2VydmFibGU8YW55PlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBmZXRjaCh0aGVtZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcblxuICAgICAgICByZXR1cm4gdGhpcy5yZWNvcmRHUUxcbiAgICAgICAgICAgIC5mZXRjaCh0aGlzLnJlc291cmNlTmFtZSwgYC9hcGkvJHt0aGlzLmZyb250ZW5kTmFtZX0vJHt0aGVtZX1gLCB0aGlzLmZpZWxkc01ldGFkYXRhKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKCh7ZGF0YX0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGltYWdlcyA9IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEudGhlbWVJbWFnZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlcyA9IGRhdGEudGhlbWVJbWFnZXMuaXRlbXM7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWVtcHR5T2JqZWN0KGltYWdlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGltYWdlcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlID0gaW1hZ2VzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGltYWdlWydjb250ZW50J10gPz8gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGltYWdlWyduYW1lJ10gPz8gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudCA9PT0gJycgfHwgbmFtZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWNvblJlZ2lzdHJ5LmFkZFN2ZyhuYW1lLCBjb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGltYWdlcztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICB9XG59XG4iXX0=