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
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { IframeResizeHandlerHandler } from '../../services/iframe-resize-handler.service';
import { SystemConfigStore } from '../../../../store/system-config/system-config.store';
import { AuthService } from '../../../../services/auth/auth.service';
import { RouteConverter } from '../../../../services/navigation/route-converter/route-converter.service';
import { IframePageChangeObserver } from '../../services/iframe-page-change-observer.service';
export class ClassicViewUiComponent {
    constructor(route, router, sanitizer, routeConverter, auth, ngZone, systemConfigs) {
        this.route = route;
        this.router = router;
        this.sanitizer = sanitizer;
        this.routeConverter = routeConverter;
        this.auth = auth;
        this.ngZone = ngZone;
        this.systemConfigs = systemConfigs;
        this.iframe = null;
    }
    ngOnInit() {
        this.url = this.route.snapshot.data.legacyUrl;
    }
    ngAfterViewInit() {
        this.initIframe();
    }
    ngOnDestroy() {
        this.cleanObservers();
        this.iframe = null;
        const placeholder = this.wrapper;
        if (this.wrapper.firstChild) {
            placeholder.removeChild(placeholder.firstChild);
        }
        placeholder.innerHTML = '<iframe></iframe>';
        this.wrapper = null;
    }
    cleanObservers() {
        if (this.iframeResizeHandler) {
            this.iframeResizeHandler.destroy();
            this.iframeResizeHandler = null;
        }
        if (this.iframePageChangeHandler) {
            this.iframePageChangeHandler.destroy();
            this.iframePageChangeHandler = null;
        }
    }
    initIframe() {
        this.wrapper = this.dataContainer.nativeElement;
        if (this.wrapper.firstChild) {
            this.wrapper.removeChild(this.wrapper.firstChild);
        }
        const iframe = document.createElement('iframe');
        iframe.src = this.url;
        this.wrapper.appendChild(iframe);
        this.iframe = iframe;
        this.iframe.style.display = 'block';
        this.initObservers();
    }
    initObservers() {
        this.iframePageChangeHandler = this.buildIframePageChangeObserver();
        this.iframeResizeHandler = this.buildIframeResizeHandlerHandler();
        if (this.iframePageChangeHandler) {
            this.iframePageChangeHandler.init();
        }
    }
    onPageChange(newLocation) {
        if (this.shouldRedirect(newLocation) === false) {
            this.iframe.style.display = 'block';
            this.cleanObservers();
            this.initObservers();
            return;
        }
        const location = this.routeConverter.toFrontEndRoute(newLocation);
        if (location === '/users/login') {
            this.auth.logout('LBL_SESSION_EXPIRED');
            return;
        }
        this.ngZone.run(() => this.router.navigateByUrl(location).then()).then();
    }
    onIFrameLoad() {
        // Do not show scroll at any time, to avoid flickering
        this.iframe.contentWindow.document.body.style.overflow = 'hidden';
        // Init resize handler
        this.iframeResizeHandler.init(this.iframe);
    }
    onIFrameUnload() {
        // hide iframe, while being re-directed
        this.iframe.style.display = 'none';
        this.iframeResizeHandler.destroy();
    }
    buildIframePageChangeObserver() {
        return new IframePageChangeObserver(this.iframe, this.onPageChange.bind(this), this.onIFrameLoad.bind(this), this.onIFrameUnload.bind(this));
    }
    buildIframeResizeHandlerHandler() {
        return new IframeResizeHandlerHandler();
    }
    /**
     * Check if should re-direct to link or if it was excluded
     *
     * @param {string} legacyLink to check
     * @returns {boolean} should redirect
     */
    shouldRedirect(legacyLink) {
        if (legacyLink && legacyLink.includes('/#/')) {
            return true;
        }
        const routeInfo = this.routeConverter.parse(legacyLink);
        // if no route or no module, don't re-direct
        if (!routeInfo || !routeInfo.module) {
            return false;
        }
        const reuse = this.routeConverter.matchesActiveRoute(this.route, routeInfo);
        if (reuse === true) {
            return false;
        }
        if (!routeInfo.action) {
            return true;
        }
        return this.toExclude(routeInfo);
    }
    /**
     * Check if given route is to exclude from redirection
     *
     * @param {object} routeInfo to check
     * @returns {boolean} is to exclude
     */
    toExclude(routeInfo) {
        const exclusions = this.systemConfigs.getConfigValue('classicview_routing_exclusions');
        if (!exclusions || Object.keys(exclusions).length === 0) {
            return true;
        }
        // if action is excluded for any module, don't re-direct
        if (exclusions.any && exclusions.any.includes(routeInfo.action)) {
            return false;
        }
        if (!exclusions[routeInfo.module]) {
            return true;
        }
        // if module action is excluded, don't re-direct
        const moduleExclusions = exclusions[routeInfo.module];
        return !(moduleExclusions && moduleExclusions.includes(routeInfo.action));
    }
}
ClassicViewUiComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-classic-view-ui',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<div class=\"classic-view-container\" #dataContainer>\n    <iframe></iframe>\n</div>\n"
            },] }
];
ClassicViewUiComponent.ctorParameters = () => [
    { type: ActivatedRoute },
    { type: Router },
    { type: DomSanitizer },
    { type: RouteConverter },
    { type: AuthService },
    { type: NgZone },
    { type: SystemConfigStore }
];
ClassicViewUiComponent.propDecorators = {
    dataContainer: [{ type: ViewChild, args: ['dataContainer', { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3NpYy12aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi92aWV3cy9jbGFzc2ljL2NvbXBvbmVudHMvY2xhc3NpYy12aWV3L2NsYXNzaWMtdmlldy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBZ0IsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQXFCLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6RyxPQUFPLEVBQUMsY0FBYyxFQUFFLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUN4RixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxxREFBcUQsQ0FBQztBQUN0RixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFDbkUsT0FBTyxFQUFDLGNBQWMsRUFBWSxNQUFNLHlFQUF5RSxDQUFDO0FBQ2xILE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLG9EQUFvRCxDQUFDO0FBVzVGLE1BQU0sT0FBTyxzQkFBc0I7SUFTL0IsWUFDWSxLQUFxQixFQUNyQixNQUFjLEVBQ2QsU0FBdUIsRUFDdkIsY0FBOEIsRUFDOUIsSUFBaUIsRUFDakIsTUFBYyxFQUNkLGFBQWdDO1FBTmhDLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQ3JCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxjQUFTLEdBQVQsU0FBUyxDQUFjO1FBQ3ZCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixTQUFJLEdBQUosSUFBSSxDQUFhO1FBQ2pCLFdBQU0sR0FBTixNQUFNLENBQVE7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LGdCQUFnQixJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM5RSxDQUFDOzs7WUEzTEosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLG04Q0FBNEM7YUFFL0M7OztZQWhCTyxjQUFjO1lBQUUsTUFBTTtZQUN0QixZQUFZO1lBSVosY0FBYztZQURkLFdBQVc7WUFMMkIsTUFBTTtZQUk1QyxpQkFBaUI7Ozs0QkFnQnBCLFNBQVMsU0FBQyxlQUFlLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgTmdab25lLCBPbkRlc3Ryb3ksIE9uSW5pdCwgVmlld0NoaWxkfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QWN0aXZhdGVkUm91dGUsIFJvdXRlcn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7RG9tU2FuaXRpemVyfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7SWZyYW1lUmVzaXplSGFuZGxlckhhbmRsZXJ9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2lmcmFtZS1yZXNpemUtaGFuZGxlci5zZXJ2aWNlJztcbmltcG9ydCB7U3lzdGVtQ29uZmlnU3RvcmV9IGZyb20gJy4uLy4uLy4uLy4uL3N0b3JlL3N5c3RlbS1jb25maWcvc3lzdGVtLWNvbmZpZy5zdG9yZSc7XG5pbXBvcnQge0F1dGhTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9hdXRoL2F1dGguc2VydmljZSc7XG5pbXBvcnQge1JvdXRlQ29udmVydGVyLCBSb3V0ZUluZm99IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24vcm91dGUtY29udmVydGVyL3JvdXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7SWZyYW1lUGFnZUNoYW5nZU9ic2VydmVyfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9pZnJhbWUtcGFnZS1jaGFuZ2Utb2JzZXJ2ZXIuc2VydmljZSc7XG5cbmludGVyZmFjZSBSb3V0aW5nRXhjbHVzaW9ucyB7XG4gICAgW2tleTogc3RyaW5nXTogc3RyaW5nW107XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnc2NybS1jbGFzc2ljLXZpZXctdWknLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9jbGFzc2ljLXZpZXcuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogW11cbn0pXG5leHBvcnQgY2xhc3MgQ2xhc3NpY1ZpZXdVaUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcblxuICAgIEBWaWV3Q2hpbGQoJ2RhdGFDb250YWluZXInLCB7c3RhdGljOiB0cnVlfSkgZGF0YUNvbnRhaW5lcjogRWxlbWVudFJlZjtcbiAgICBwdWJsaWMgd3JhcHBlcjogYW55O1xuICAgIHB1YmxpYyB1cmw6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgaWZyYW1lID0gbnVsbDtcbiAgICBwcml2YXRlIGlmcmFtZVBhZ2VDaGFuZ2VIYW5kbGVyOiBJZnJhbWVQYWdlQ2hhbmdlT2JzZXJ2ZXI7XG4gICAgcHJpdmF0ZSBpZnJhbWVSZXNpemVIYW5kbGVyOiBJZnJhbWVSZXNpemVIYW5kbGVySGFuZGxlcjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgcHJpdmF0ZSBzYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICAgICAgcHJpdmF0ZSByb3V0ZUNvbnZlcnRlcjogUm91dGVDb252ZXJ0ZXIsXG4gICAgICAgIHByaXZhdGUgYXV0aDogQXV0aFNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICAgICAgIHByaXZhdGUgc3lzdGVtQ29uZmlnczogU3lzdGVtQ29uZmlnU3RvcmUsXG4gICAgKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudXJsID0gdGhpcy5yb3V0ZS5zbmFwc2hvdC5kYXRhLmxlZ2FjeVVybDtcbiAgICB9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5pdElmcmFtZSgpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsZWFuT2JzZXJ2ZXJzKCk7XG5cbiAgICAgICAgdGhpcy5pZnJhbWUgPSBudWxsO1xuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMud3JhcHBlcjtcbiAgICAgICAgaWYgKHRoaXMud3JhcHBlci5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICBwbGFjZWhvbGRlci5yZW1vdmVDaGlsZChwbGFjZWhvbGRlci5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICBwbGFjZWhvbGRlci5pbm5lckhUTUwgPSAnPGlmcmFtZT48L2lmcmFtZT4nO1xuICAgICAgICB0aGlzLndyYXBwZXIgPSBudWxsO1xuICAgIH1cblxuICAgIGNsZWFuT2JzZXJ2ZXJzKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pZnJhbWVSZXNpemVIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLmlmcmFtZVJlc2l6ZUhhbmRsZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5pZnJhbWVSZXNpemVIYW5kbGVyID0gbnVsbDtcblxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlmcmFtZVBhZ2VDaGFuZ2VIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLmlmcmFtZVBhZ2VDaGFuZ2VIYW5kbGVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuaWZyYW1lUGFnZUNoYW5nZUhhbmRsZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdElmcmFtZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy53cmFwcGVyID0gdGhpcy5kYXRhQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgICAgaWYgKHRoaXMud3JhcHBlci5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICB0aGlzLndyYXBwZXIucmVtb3ZlQ2hpbGQodGhpcy53cmFwcGVyLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgICAgICBpZnJhbWUuc3JjID0gdGhpcy51cmw7XG5cbiAgICAgICAgdGhpcy53cmFwcGVyLmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cbiAgICAgICAgdGhpcy5pZnJhbWUgPSBpZnJhbWU7XG5cbiAgICAgICAgdGhpcy5pZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cbiAgICAgICAgdGhpcy5pbml0T2JzZXJ2ZXJzKCk7XG4gICAgfVxuXG4gICAgaW5pdE9ic2VydmVycygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pZnJhbWVQYWdlQ2hhbmdlSGFuZGxlciA9IHRoaXMuYnVpbGRJZnJhbWVQYWdlQ2hhbmdlT2JzZXJ2ZXIoKTtcbiAgICAgICAgdGhpcy5pZnJhbWVSZXNpemVIYW5kbGVyID0gdGhpcy5idWlsZElmcmFtZVJlc2l6ZUhhbmRsZXJIYW5kbGVyKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaWZyYW1lUGFnZUNoYW5nZUhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuaWZyYW1lUGFnZUNoYW5nZUhhbmRsZXIuaW5pdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uUGFnZUNoYW5nZShuZXdMb2NhdGlvbik6IHZvaWQge1xuXG4gICAgICAgIGlmICh0aGlzLnNob3VsZFJlZGlyZWN0KG5ld0xvY2F0aW9uKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgdGhpcy5jbGVhbk9ic2VydmVycygpO1xuICAgICAgICAgICAgdGhpcy5pbml0T2JzZXJ2ZXJzKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IHRoaXMucm91dGVDb252ZXJ0ZXIudG9Gcm9udEVuZFJvdXRlKG5ld0xvY2F0aW9uKTtcblxuICAgICAgICBpZiAobG9jYXRpb24gPT09ICcvdXNlcnMvbG9naW4nKSB7XG4gICAgICAgICAgICB0aGlzLmF1dGgubG9nb3V0KCdMQkxfU0VTU0lPTl9FWFBJUkVEJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4gdGhpcy5yb3V0ZXIubmF2aWdhdGVCeVVybChsb2NhdGlvbikudGhlbigpKS50aGVuKCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG9uSUZyYW1lTG9hZCgpOiB2b2lkIHtcbiAgICAgICAgLy8gRG8gbm90IHNob3cgc2Nyb2xsIGF0IGFueSB0aW1lLCB0byBhdm9pZCBmbGlja2VyaW5nXG4gICAgICAgIHRoaXMuaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuXG4gICAgICAgIC8vIEluaXQgcmVzaXplIGhhbmRsZXJcbiAgICAgICAgdGhpcy5pZnJhbWVSZXNpemVIYW5kbGVyLmluaXQodGhpcy5pZnJhbWUpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvbklGcmFtZVVubG9hZCgpOiB2b2lkIHtcbiAgICAgICAgLy8gaGlkZSBpZnJhbWUsIHdoaWxlIGJlaW5nIHJlLWRpcmVjdGVkXG4gICAgICAgIHRoaXMuaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIHRoaXMuaWZyYW1lUmVzaXplSGFuZGxlci5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGJ1aWxkSWZyYW1lUGFnZUNoYW5nZU9ic2VydmVyKCk6IElmcmFtZVBhZ2VDaGFuZ2VPYnNlcnZlciB7XG4gICAgICAgIHJldHVybiBuZXcgSWZyYW1lUGFnZUNoYW5nZU9ic2VydmVyKFxuICAgICAgICAgICAgdGhpcy5pZnJhbWUsXG4gICAgICAgICAgICB0aGlzLm9uUGFnZUNoYW5nZS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdGhpcy5vbklGcmFtZUxvYWQuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHRoaXMub25JRnJhbWVVbmxvYWQuYmluZCh0aGlzKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYnVpbGRJZnJhbWVSZXNpemVIYW5kbGVySGFuZGxlcigpOiBJZnJhbWVSZXNpemVIYW5kbGVySGFuZGxlciB7XG4gICAgICAgIHJldHVybiBuZXcgSWZyYW1lUmVzaXplSGFuZGxlckhhbmRsZXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBzaG91bGQgcmUtZGlyZWN0IHRvIGxpbmsgb3IgaWYgaXQgd2FzIGV4Y2x1ZGVkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGVnYWN5TGluayB0byBjaGVja1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBzaG91bGQgcmVkaXJlY3RcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2hvdWxkUmVkaXJlY3QobGVnYWN5TGluazogc3RyaW5nKTogYm9vbGVhbiB7XG5cbiAgICAgICAgaWYgKGxlZ2FjeUxpbmsgJiYgbGVnYWN5TGluay5pbmNsdWRlcygnLyMvJykpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgcm91dGVJbmZvID0gdGhpcy5yb3V0ZUNvbnZlcnRlci5wYXJzZShsZWdhY3lMaW5rKTtcblxuICAgICAgICAvLyBpZiBubyByb3V0ZSBvciBubyBtb2R1bGUsIGRvbid0IHJlLWRpcmVjdFxuICAgICAgICBpZiAoIXJvdXRlSW5mbyB8fCAhcm91dGVJbmZvLm1vZHVsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmV1c2UgPSB0aGlzLnJvdXRlQ29udmVydGVyLm1hdGNoZXNBY3RpdmVSb3V0ZSh0aGlzLnJvdXRlLCByb3V0ZUluZm8pO1xuXG4gICAgICAgIGlmIChyZXVzZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyb3V0ZUluZm8uYWN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnRvRXhjbHVkZShyb3V0ZUluZm8pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGdpdmVuIHJvdXRlIGlzIHRvIGV4Y2x1ZGUgZnJvbSByZWRpcmVjdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJvdXRlSW5mbyB0byBjaGVja1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBpcyB0byBleGNsdWRlXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHRvRXhjbHVkZShyb3V0ZUluZm86IFJvdXRlSW5mbyk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBleGNsdXNpb25zOiBSb3V0aW5nRXhjbHVzaW9ucyA9IHRoaXMuc3lzdGVtQ29uZmlncy5nZXRDb25maWdWYWx1ZSgnY2xhc3NpY3ZpZXdfcm91dGluZ19leGNsdXNpb25zJyk7XG5cbiAgICAgICAgaWYgKCFleGNsdXNpb25zIHx8IE9iamVjdC5rZXlzKGV4Y2x1c2lvbnMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBhY3Rpb24gaXMgZXhjbHVkZWQgZm9yIGFueSBtb2R1bGUsIGRvbid0IHJlLWRpcmVjdFxuICAgICAgICBpZiAoZXhjbHVzaW9ucy5hbnkgJiYgZXhjbHVzaW9ucy5hbnkuaW5jbHVkZXMocm91dGVJbmZvLmFjdGlvbikpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZXhjbHVzaW9uc1tyb3V0ZUluZm8ubW9kdWxlXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBtb2R1bGUgYWN0aW9uIGlzIGV4Y2x1ZGVkLCBkb24ndCByZS1kaXJlY3RcbiAgICAgICAgY29uc3QgbW9kdWxlRXhjbHVzaW9ucyA9IGV4Y2x1c2lvbnNbcm91dGVJbmZvLm1vZHVsZV07XG4gICAgICAgIHJldHVybiAhKG1vZHVsZUV4Y2x1c2lvbnMgJiYgbW9kdWxlRXhjbHVzaW9ucy5pbmNsdWRlcyhyb3V0ZUluZm8uYWN0aW9uKSk7XG4gICAgfVxufVxuIl19