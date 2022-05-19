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
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IframeResizeHandlerHandler } from "../../../../views/classic/services/iframe-resize-handler.service";
import { IframePageChangeObserver } from "../../../../views/classic/services/iframe-page-change-observer.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { animate, transition, trigger } from "@angular/animations";
import { LanguageStore } from "../../../../store/language/language.store";
export class ClassicModalComponent {
    constructor(languageStore, activeModal) {
        this.languageStore = languageStore;
        this.activeModal = activeModal;
        this.url = '';
        this.titleKey = '';
        this.asyncActionCallback = null;
        this.iframe = null;
    }
    ngOnInit() {
        this.closeButton = {
            klass: ['btn', 'btn-outline-light', 'btn-sm'],
            onClick: () => {
                this.activeModal.close({
                    type: 'close-button'
                });
            }
        };
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
    onIFrameLoad() {
        // Do not show scroll at any time, to avoid flickering
        this.iframe.contentWindow.document.body.style.overflow = 'hidden';
        // callback function to execute custom task
        // as required by the caller
        if (this.asyncActionCallback !== null) {
            this.asyncActionCallback(this.iframe);
        }
        // Init resize handler
        this.iframeResizeHandler.init(this.iframe);
    }
    onIFrameUnload() {
        // hide iframe, while being re-directed
        this.iframe.style.display = 'none';
        this.iframeResizeHandler.destroy();
    }
    buildIframePageChangeObserver() {
        return new IframePageChangeObserver(this.iframe, null, this.onIFrameLoad.bind(this), this.onIFrameUnload.bind(this));
    }
    buildIframeResizeHandlerHandler() {
        return new IframeResizeHandlerHandler();
    }
}
ClassicModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-classic-modal',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n\n<scrm-modal [closable]=\"true\"\n            [close]=\"closeButton\"\n            [titleKey]=\"titleKey\"\n            bodyKlass=\"m-0 small-font\"\n            footerKlass=\"border-0\"\n            klass=\"classic-view-modal\">\n\n    <div modal-body>\n\n        <div class=\"classic-view-container\" #dataContainer>\n            <iframe></iframe>\n        </div>\n\n    </div>\n\n</scrm-modal>\n",
                animations: [
                    trigger('modalFade', [
                        transition('void <=> *', [
                            animate('800ms')
                        ]),
                    ]),
                ]
            },] }
];
ClassicModalComponent.ctorParameters = () => [
    { type: LanguageStore },
    { type: NgbActiveModal }
];
ClassicModalComponent.propDecorators = {
    url: [{ type: Input }],
    titleKey: [{ type: Input }],
    asyncActionCallback: [{ type: Input }],
    dataContainer: [{ type: ViewChild, args: ['dataContainer', { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3NpYy1tb2RhbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29tcG9uZW50cy9tb2RhbC9jb21wb25lbnRzL2NsYXNzaWMtbW9kYWwvY2xhc3NpYy1tb2RhbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBZ0IsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQXFCLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN4RyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxrRUFBa0UsQ0FBQztBQUM1RyxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSx3RUFBd0UsQ0FBQztBQUNoSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFFMUQsT0FBTyxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDakUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBZXhFLE1BQU0sT0FBTyxxQkFBcUI7SUFZOUIsWUFDVyxhQUE0QixFQUN6QixXQUEyQjtRQUQ5QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUN6QixnQkFBVyxHQUFYLFdBQVcsQ0FBZ0I7UUFiaEMsUUFBRyxHQUFXLEVBQUUsQ0FBQztRQUNqQixhQUFRLEdBQVcsRUFBRSxDQUFDO1FBQ3RCLHdCQUFtQixHQUFhLElBQUksQ0FBQztRQUtwQyxXQUFNLEdBQUcsSUFBSSxDQUFDO0lBUXhCLENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLFdBQVcsR0FBRztZQUNmLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxtQkFBbUIsRUFBRSxRQUFRLENBQUM7WUFDN0MsT0FBTyxFQUFFLEdBQVMsRUFBRTtn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QyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVTLDZCQUE2QjtRQUNuQyxPQUFPLElBQUksd0JBQXdCLENBQy9CLElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxFQUNKLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUM1QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDakMsQ0FBQztJQUNOLENBQUM7SUFFUywrQkFBK0I7UUFDckMsT0FBTyxJQUFJLDBCQUEwQixFQUFFLENBQUM7SUFDNUMsQ0FBQzs7O1lBL0hKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5Qiw0dkRBQTZDO2dCQUU3QyxVQUFVLEVBQUU7b0JBQ1IsT0FBTyxDQUFDLFdBQVcsRUFBRTt3QkFDakIsVUFBVSxDQUFDLFlBQVksRUFBRTs0QkFDckIsT0FBTyxDQUFDLE9BQU8sQ0FBQzt5QkFDbkIsQ0FBQztxQkFDTCxDQUFDO2lCQUNMO2FBQ0o7OztZQWRPLGFBQWE7WUFIYixjQUFjOzs7a0JBbUJqQixLQUFLO3VCQUNMLEtBQUs7a0NBQ0wsS0FBSzs0QkFDTCxTQUFTLFNBQUMsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgVmlld0NoaWxkfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SWZyYW1lUmVzaXplSGFuZGxlckhhbmRsZXJ9IGZyb20gXCIuLi8uLi8uLi8uLi92aWV3cy9jbGFzc2ljL3NlcnZpY2VzL2lmcmFtZS1yZXNpemUtaGFuZGxlci5zZXJ2aWNlXCI7XG5pbXBvcnQge0lmcmFtZVBhZ2VDaGFuZ2VPYnNlcnZlcn0gZnJvbSBcIi4uLy4uLy4uLy4uL3ZpZXdzL2NsYXNzaWMvc2VydmljZXMvaWZyYW1lLXBhZ2UtY2hhbmdlLW9ic2VydmVyLnNlcnZpY2VcIjtcbmltcG9ydCB7TmdiQWN0aXZlTW9kYWx9IGZyb20gXCJAbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcFwiO1xuaW1wb3J0IHtCdXR0b25JbnRlcmZhY2UsIE1vZGFsQ2xvc2VGZWVkQmFja30gZnJvbSBcImNvbW1vblwiO1xuaW1wb3J0IHthbmltYXRlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyfSBmcm9tIFwiQGFuZ3VsYXIvYW5pbWF0aW9uc1wiO1xuaW1wb3J0IHtMYW5ndWFnZVN0b3JlfSBmcm9tIFwiLi4vLi4vLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmVcIjtcblxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tY2xhc3NpYy1tb2RhbCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2NsYXNzaWMtbW9kYWwuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogW10sXG4gICAgYW5pbWF0aW9uczogW1xuICAgICAgICB0cmlnZ2VyKCdtb2RhbEZhZGUnLCBbXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCd2b2lkIDw9PiAqJywgW1xuICAgICAgICAgICAgICAgIGFuaW1hdGUoJzgwMG1zJylcbiAgICAgICAgICAgIF0pLFxuICAgICAgICBdKSxcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIENsYXNzaWNNb2RhbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgICBASW5wdXQoKSB1cmw6IHN0cmluZyA9ICcnO1xuICAgIEBJbnB1dCgpIHRpdGxlS2V5OiBzdHJpbmcgPSAnJztcbiAgICBASW5wdXQoKSBhc3luY0FjdGlvbkNhbGxiYWNrOiBGdW5jdGlvbiA9IG51bGw7XG4gICAgQFZpZXdDaGlsZCgnZGF0YUNvbnRhaW5lcicsIHtzdGF0aWM6IHRydWV9KSBkYXRhQ29udGFpbmVyOiBFbGVtZW50UmVmO1xuICAgIGNsb3NlQnV0dG9uOiBCdXR0b25JbnRlcmZhY2U7XG5cbiAgICBwdWJsaWMgd3JhcHBlcjogYW55O1xuICAgIHByb3RlY3RlZCBpZnJhbWUgPSBudWxsO1xuICAgIHByaXZhdGUgaWZyYW1lUGFnZUNoYW5nZUhhbmRsZXI6IElmcmFtZVBhZ2VDaGFuZ2VPYnNlcnZlcjtcbiAgICBwcml2YXRlIGlmcmFtZVJlc2l6ZUhhbmRsZXI6IElmcmFtZVJlc2l6ZUhhbmRsZXJIYW5kbGVyO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBsYW5ndWFnZVN0b3JlOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgYWN0aXZlTW9kYWw6IE5nYkFjdGl2ZU1vZGFsLFxuICAgICkge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsb3NlQnV0dG9uID0ge1xuICAgICAgICAgICAga2xhc3M6IFsnYnRuJywgJ2J0bi1vdXRsaW5lLWxpZ2h0JywgJ2J0bi1zbSddLFxuICAgICAgICAgICAgb25DbGljazogKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlTW9kYWwuY2xvc2Uoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2xvc2UtYnV0dG9uJ1xuICAgICAgICAgICAgICAgIH0gYXMgTW9kYWxDbG9zZUZlZWRCYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBhcyBCdXR0b25JbnRlcmZhY2U7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmluaXRJZnJhbWUoKTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbGVhbk9ic2VydmVycygpO1xuXG4gICAgICAgIHRoaXMuaWZyYW1lID0gbnVsbDtcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLndyYXBwZXI7XG4gICAgICAgIGlmICh0aGlzLndyYXBwZXIuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgcGxhY2Vob2xkZXIucmVtb3ZlQ2hpbGQocGxhY2Vob2xkZXIuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgcGxhY2Vob2xkZXIuaW5uZXJIVE1MID0gJzxpZnJhbWU+PC9pZnJhbWU+JztcbiAgICAgICAgdGhpcy53cmFwcGVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBjbGVhbk9ic2VydmVycygpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaWZyYW1lUmVzaXplSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5pZnJhbWVSZXNpemVIYW5kbGVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuaWZyYW1lUmVzaXplSGFuZGxlciA9IG51bGw7XG5cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pZnJhbWVQYWdlQ2hhbmdlSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5pZnJhbWVQYWdlQ2hhbmdlSGFuZGxlci5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmlmcmFtZVBhZ2VDaGFuZ2VIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXRJZnJhbWUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMud3JhcHBlciA9IHRoaXMuZGF0YUNvbnRhaW5lci5uYXRpdmVFbGVtZW50O1xuXG4gICAgICAgIGlmICh0aGlzLndyYXBwZXIuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgdGhpcy53cmFwcGVyLnJlbW92ZUNoaWxkKHRoaXMud3JhcHBlci5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICAgICAgaWZyYW1lLnNyYyA9IHRoaXMudXJsO1xuXG4gICAgICAgIHRoaXMud3JhcHBlci5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXG4gICAgICAgIHRoaXMuaWZyYW1lID0gaWZyYW1lO1xuXG4gICAgICAgIHRoaXMuaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXG4gICAgICAgIHRoaXMuaW5pdE9ic2VydmVycygpO1xuICAgIH1cblxuICAgIGluaXRPYnNlcnZlcnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaWZyYW1lUGFnZUNoYW5nZUhhbmRsZXIgPSB0aGlzLmJ1aWxkSWZyYW1lUGFnZUNoYW5nZU9ic2VydmVyKCk7XG4gICAgICAgIHRoaXMuaWZyYW1lUmVzaXplSGFuZGxlciA9IHRoaXMuYnVpbGRJZnJhbWVSZXNpemVIYW5kbGVySGFuZGxlcigpO1xuXG4gICAgICAgIGlmICh0aGlzLmlmcmFtZVBhZ2VDaGFuZ2VIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLmlmcmFtZVBhZ2VDaGFuZ2VIYW5kbGVyLmluaXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBvbklGcmFtZUxvYWQoKTogdm9pZCB7XG4gICAgICAgIC8vIERvIG5vdCBzaG93IHNjcm9sbCBhdCBhbnkgdGltZSwgdG8gYXZvaWQgZmxpY2tlcmluZ1xuICAgICAgICB0aGlzLmlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcblxuICAgICAgICAvLyBjYWxsYmFjayBmdW5jdGlvbiB0byBleGVjdXRlIGN1c3RvbSB0YXNrXG4gICAgICAgIC8vIGFzIHJlcXVpcmVkIGJ5IHRoZSBjYWxsZXJcbiAgICAgICAgaWYgKHRoaXMuYXN5bmNBY3Rpb25DYWxsYmFjayAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5hc3luY0FjdGlvbkNhbGxiYWNrKHRoaXMuaWZyYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEluaXQgcmVzaXplIGhhbmRsZXJcbiAgICAgICAgdGhpcy5pZnJhbWVSZXNpemVIYW5kbGVyLmluaXQodGhpcy5pZnJhbWUpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvbklGcmFtZVVubG9hZCgpOiB2b2lkIHtcbiAgICAgICAgLy8gaGlkZSBpZnJhbWUsIHdoaWxlIGJlaW5nIHJlLWRpcmVjdGVkXG4gICAgICAgIHRoaXMuaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIHRoaXMuaWZyYW1lUmVzaXplSGFuZGxlci5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGJ1aWxkSWZyYW1lUGFnZUNoYW5nZU9ic2VydmVyKCk6IElmcmFtZVBhZ2VDaGFuZ2VPYnNlcnZlciB7XG4gICAgICAgIHJldHVybiBuZXcgSWZyYW1lUGFnZUNoYW5nZU9ic2VydmVyKFxuICAgICAgICAgICAgdGhpcy5pZnJhbWUsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgdGhpcy5vbklGcmFtZUxvYWQuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHRoaXMub25JRnJhbWVVbmxvYWQuYmluZCh0aGlzKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYnVpbGRJZnJhbWVSZXNpemVIYW5kbGVySGFuZGxlcigpOiBJZnJhbWVSZXNpemVIYW5kbGVySGFuZGxlciB7XG4gICAgICAgIHJldHVybiBuZXcgSWZyYW1lUmVzaXplSGFuZGxlckhhbmRsZXIoKTtcbiAgICB9XG5cbn1cbiJdfQ==