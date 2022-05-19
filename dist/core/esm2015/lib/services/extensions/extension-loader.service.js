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
import { Compiler, Injectable, NgModuleFactory } from '@angular/core';
import { forkJoin, from, isObservable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { SystemConfigStore } from '../../store/system-config/system-config.store';
import { isFalse } from 'common';
import * as i0 from "@angular/core";
import * as i1 from "../../store/system-config/system-config.store";
export class ExtensionLoader {
    constructor(systemConfigStore, compiler) {
        this.systemConfigStore = systemConfigStore;
        this.compiler = compiler;
    }
    /**
     * Load all extensions
     *
     * @param {object} injector Injector
     */
    load(injector) {
        const extensions = this.systemConfigStore.getConfigValue('extensions');
        const extensionModules$ = {};
        Object.keys(extensions).forEach(extensionName => {
            if (!extensions[extensionName]) {
                return;
            }
            const config = extensions[extensionName];
            if (!config.remoteEntry || !config.remoteName) {
                return;
            }
            if (!config.enabled || isFalse(config.enabled)) {
                return;
            }
            extensionModules$[extensionName] = this.loadExtension(config, injector);
        });
        if (Object.keys(extensionModules$).length < 1) {
            return of({});
        }
        return forkJoin(extensionModules$);
    }
    /**
     * Load single extension
     *
     * @param {object} config ExtensionConfig
     * @param {object} injector Injector
     */
    loadExtension(config, injector) {
        const promise = () => loadRemoteModule({
            remoteEntry: config.remoteEntry,
            remoteName: config.remoteName,
            exposedModule: './Module'
        }).then(m => m.ExtensionModule);
        return this.loadModuleFactory(promise).pipe(map((factory) => {
            return factory.create(injector);
        }));
    }
    /**
     * Check if object is a promise
     * @param {} obj promise
     * @returns {boolean} isPromise
     */
    isPromise(obj) {
        return !!obj && typeof obj.then === 'function';
    }
    /**
     * Wrap into observable
     *
     * @param {object} value to wrap
     * @returns {object} observable
     */
    wrapIntoObservable(value) {
        if (isObservable(value)) {
            // @ts-ignore
            return value;
        }
        if (this.isPromise(value)) {
            // @ts-ignore
            return from(Promise.resolve(value));
        }
        // @ts-ignore
        return of(value);
    }
    /**
     * Load module factory and return observable
     * @param {function} loadChildren
     */
    loadModuleFactory(loadChildren) {
        return this.wrapIntoObservable(loadChildren()).pipe(mergeMap((t) => {
            if (t instanceof NgModuleFactory) {
                return of(t);
            }
            else {
                return from(this.compiler.compileModuleAsync(t));
            }
        }));
    }
}
ExtensionLoader.ɵprov = i0.ɵɵdefineInjectable({ factory: function ExtensionLoader_Factory() { return new ExtensionLoader(i0.ɵɵinject(i1.SystemConfigStore), i0.ɵɵinject(i0.Compiler)); }, token: ExtensionLoader, providedIn: "root" });
ExtensionLoader.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
ExtensionLoader.ctorParameters = () => [
    { type: SystemConfigStore },
    { type: Compiler }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLWxvYWRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3NlcnZpY2VzL2V4dGVuc2lvbnMvZXh0ZW5zaW9uLWxvYWRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFFLFVBQVUsRUFBWSxlQUFlLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFDM0YsT0FBTyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFjLEVBQUUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUVsRSxPQUFPLEVBQUMsR0FBRyxFQUFFLFFBQVEsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHVDQUF1QyxDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLCtDQUErQyxDQUFDO0FBQ2hGLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxRQUFRLENBQUM7OztBQWUvQixNQUFNLE9BQU8sZUFBZTtJQUV4QixZQUNjLGlCQUFvQyxFQUNwQyxRQUFrQjtRQURsQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQ3BDLGFBQVEsR0FBUixRQUFRLENBQVU7SUFFaEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxJQUFJLENBQUMsUUFBa0I7UUFFMUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV2RSxNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztRQUU3QixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUM1QyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUM1QixPQUFPO2FBQ1Y7WUFFRCxNQUFNLE1BQU0sR0FBb0IsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRzFELElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtnQkFDM0MsT0FBTzthQUNWO1lBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDNUMsT0FBTzthQUNWO1lBRUQsaUJBQWlCLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDNUUsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzNDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2pCO1FBRUQsT0FBTyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxhQUFhLENBQUMsTUFBdUIsRUFBRSxRQUFrQjtRQUM1RCxNQUFNLE9BQU8sR0FBRyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztZQUNuQyxXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVc7WUFDL0IsVUFBVSxFQUFFLE1BQU0sQ0FBQyxVQUFVO1lBQzdCLGFBQWEsRUFBRSxVQUFVO1NBQzVCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFaEMsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUN2QyxHQUFHLENBQUMsQ0FBQyxPQUE2QixFQUFFLEVBQUU7WUFDbEMsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUNMLENBQUM7SUFDTixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNPLFNBQVMsQ0FBVSxHQUFRO1FBQ2pDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDO0lBQ25ELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLGtCQUFrQixDQUFJLEtBQXFDO1FBQ2pFLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3JCLGFBQWE7WUFDYixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN2QixhQUFhO1lBQ2IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDO1FBRUQsYUFBYTtRQUNiLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7O09BR0c7SUFDTyxpQkFBaUIsQ0FBQyxZQUFrQztRQUMxRCxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRTtZQUNwRSxJQUFJLENBQUMsWUFBWSxlQUFlLEVBQUU7Z0JBQzlCLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2hCO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwRDtRQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDOzs7O1lBOUdKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7O1lBZk8saUJBQWlCO1lBTGpCLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcGlsZXIsIEluamVjdGFibGUsIEluamVjdG9yLCBOZ01vZHVsZUZhY3RvcnksIE5nTW9kdWxlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Zm9ya0pvaW4sIGZyb20sIGlzT2JzZXJ2YWJsZSwgT2JzZXJ2YWJsZSwgb2Z9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtMb2FkQ2hpbGRyZW5DYWxsYmFja30gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7bWFwLCBtZXJnZU1hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtsb2FkUmVtb3RlTW9kdWxlfSBmcm9tICdAYW5ndWxhci1hcmNoaXRlY3RzL21vZHVsZS1mZWRlcmF0aW9uJztcbmltcG9ydCB7U3lzdGVtQ29uZmlnU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL3N5c3RlbS1jb25maWcvc3lzdGVtLWNvbmZpZy5zdG9yZSc7XG5pbXBvcnQge2lzRmFsc2V9IGZyb20gJ2NvbW1vbic7XG5cbmludGVyZmFjZSBFeHRlbnNpb25Db25maWcge1xuICAgIHJlbW90ZUVudHJ5Pzogc3RyaW5nLFxuICAgIHJlbW90ZU5hbWU/OiBzdHJpbmcsXG4gICAgZW5hYmxlZD86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBNb2R1bGVSZWZNYXAge1xuICAgIFtrZXk6IHN0cmluZ106IE5nTW9kdWxlUmVmPGFueT5cbn1cblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBFeHRlbnNpb25Mb2FkZXIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBzeXN0ZW1Db25maWdTdG9yZTogU3lzdGVtQ29uZmlnU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBjb21waWxlcjogQ29tcGlsZXIsXG4gICAgKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9hZCBhbGwgZXh0ZW5zaW9uc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGluamVjdG9yIEluamVjdG9yXG4gICAgICovXG4gICAgcHVibGljIGxvYWQoaW5qZWN0b3I6IEluamVjdG9yKTogT2JzZXJ2YWJsZTxNb2R1bGVSZWZNYXA+IHtcblxuICAgICAgICBjb25zdCBleHRlbnNpb25zID0gdGhpcy5zeXN0ZW1Db25maWdTdG9yZS5nZXRDb25maWdWYWx1ZSgnZXh0ZW5zaW9ucycpO1xuXG4gICAgICAgIGNvbnN0IGV4dGVuc2lvbk1vZHVsZXMkID0ge307XG5cbiAgICAgICAgT2JqZWN0LmtleXMoZXh0ZW5zaW9ucykuZm9yRWFjaChleHRlbnNpb25OYW1lID0+IHtcbiAgICAgICAgICAgIGlmICghZXh0ZW5zaW9uc1tleHRlbnNpb25OYW1lXSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgY29uZmlnOiBFeHRlbnNpb25Db25maWcgPSBleHRlbnNpb25zW2V4dGVuc2lvbk5hbWVdO1xuXG5cbiAgICAgICAgICAgIGlmICghY29uZmlnLnJlbW90ZUVudHJ5IHx8ICFjb25maWcucmVtb3RlTmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFjb25maWcuZW5hYmxlZCB8fCBpc0ZhbHNlKGNvbmZpZy5lbmFibGVkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXh0ZW5zaW9uTW9kdWxlcyRbZXh0ZW5zaW9uTmFtZV0gPSB0aGlzLmxvYWRFeHRlbnNpb24oY29uZmlnLCBpbmplY3Rvcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhleHRlbnNpb25Nb2R1bGVzJCkubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIG9mKHt9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3JrSm9pbihleHRlbnNpb25Nb2R1bGVzJCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9hZCBzaW5nbGUgZXh0ZW5zaW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIEV4dGVuc2lvbkNvbmZpZ1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBpbmplY3RvciBJbmplY3RvclxuICAgICAqL1xuICAgIHB1YmxpYyBsb2FkRXh0ZW5zaW9uKGNvbmZpZzogRXh0ZW5zaW9uQ29uZmlnLCBpbmplY3RvcjogSW5qZWN0b3IpOiBPYnNlcnZhYmxlPE5nTW9kdWxlUmVmPGFueT4+IHtcbiAgICAgICAgY29uc3QgcHJvbWlzZSA9ICgpID0+IGxvYWRSZW1vdGVNb2R1bGUoe1xuICAgICAgICAgICAgcmVtb3RlRW50cnk6IGNvbmZpZy5yZW1vdGVFbnRyeSxcbiAgICAgICAgICAgIHJlbW90ZU5hbWU6IGNvbmZpZy5yZW1vdGVOYW1lLFxuICAgICAgICAgICAgZXhwb3NlZE1vZHVsZTogJy4vTW9kdWxlJ1xuICAgICAgICB9KS50aGVuKG0gPT4gbS5FeHRlbnNpb25Nb2R1bGUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmxvYWRNb2R1bGVGYWN0b3J5KHByb21pc2UpLnBpcGUoXG4gICAgICAgICAgICBtYXAoKGZhY3Rvcnk6IE5nTW9kdWxlRmFjdG9yeTxhbnk+KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnkuY3JlYXRlKGluamVjdG9yKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgb2JqZWN0IGlzIGEgcHJvbWlzZVxuICAgICAqIEBwYXJhbSB7fSBvYmogcHJvbWlzZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBpc1Byb21pc2VcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaXNQcm9taXNlPFQgPSBhbnk+KG9iajogYW55KTogb2JqIGlzIFByb21pc2U8VD4ge1xuICAgICAgICByZXR1cm4gISFvYmogJiYgdHlwZW9mIG9iai50aGVuID09PSAnZnVuY3Rpb24nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdyYXAgaW50byBvYnNlcnZhYmxlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmFsdWUgdG8gd3JhcFxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IG9ic2VydmFibGVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgd3JhcEludG9PYnNlcnZhYmxlPFQ+KHZhbHVlOiBUIHwgUHJvbWlzZTxUPiB8IE9ic2VydmFibGU8VD4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICAgICAgaWYgKGlzT2JzZXJ2YWJsZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzUHJvbWlzZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHJldHVybiBmcm9tKFByb21pc2UucmVzb2x2ZSh2YWx1ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICByZXR1cm4gb2YodmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvYWQgbW9kdWxlIGZhY3RvcnkgYW5kIHJldHVybiBvYnNlcnZhYmxlXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbG9hZENoaWxkcmVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGxvYWRNb2R1bGVGYWN0b3J5KGxvYWRDaGlsZHJlbjogTG9hZENoaWxkcmVuQ2FsbGJhY2spOiBPYnNlcnZhYmxlPE5nTW9kdWxlRmFjdG9yeTxhbnk+PiB7XG4gICAgICAgIHJldHVybiB0aGlzLndyYXBJbnRvT2JzZXJ2YWJsZShsb2FkQ2hpbGRyZW4oKSkucGlwZShtZXJnZU1hcCgodDogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAodCBpbnN0YW5jZW9mIE5nTW9kdWxlRmFjdG9yeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvZih0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZyb20odGhpcy5jb21waWxlci5jb21waWxlTW9kdWxlQXN5bmModCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfVxufVxuIl19