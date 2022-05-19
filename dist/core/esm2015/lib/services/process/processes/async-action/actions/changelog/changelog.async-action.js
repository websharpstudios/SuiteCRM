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
import { AsyncActionHandler } from '../../async-action.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../../../../../message/message.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ClassicModalComponent } from "../../../../../../components/modal/components/classic-modal/classic-modal.component";
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@ng-bootstrap/ng-bootstrap";
import * as i3 from "../../../../../message/message.service";
export class ChangelogAsyncAction extends AsyncActionHandler {
    constructor(router, modalService, message) {
        super();
        this.router = router;
        this.modalService = modalService;
        this.message = message;
        this.key = 'audit';
    }
    run(data) {
        if (!data || !data.url) {
            this.message.addDangerMessageByKey('LBL_MISSING_HANDLER_DATA_ROUTE');
            return;
        }
        this.showClassicViewModal(data.url);
    }
    /**
     * Remove title text from iframe source document
     */
    changeLogLegacyContentFormatter(iframeElement) {
        if (!iframeElement) {
            return;
        }
        const node = iframeElement.contentDocument.getElementsByClassName('moduleTitle')[0];
        if (!node) {
            return;
        }
        node.innerText = '';
    }
    /**
     * Show record selection modal
     */
    showClassicViewModal(url) {
        const modal = this.modalService.open(ClassicModalComponent, {
            size: 'xl',
            centered: true,
            scrollable: true
        });
        modal.componentInstance.titleKey = 'LBL_CHANGE_LOG';
        modal.componentInstance.url = url;
        modal.componentInstance.asyncActionCallback = this.changeLogLegacyContentFormatter.bind(this);
    }
}
ChangelogAsyncAction.ɵprov = i0.ɵɵdefineInjectable({ factory: function ChangelogAsyncAction_Factory() { return new ChangelogAsyncAction(i0.ɵɵinject(i1.Router), i0.ɵɵinject(i2.NgbModal), i0.ɵɵinject(i3.MessageService)); }, token: ChangelogAsyncAction, providedIn: "root" });
ChangelogAsyncAction.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
ChangelogAsyncAction.ctorParameters = () => [
    { type: Router },
    { type: NgbModal },
    { type: MessageService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlbG9nLmFzeW5jLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zZXJ2aWNlcy9wcm9jZXNzL3Byb2Nlc3Nlcy9hc3luYy1hY3Rpb24vYWN0aW9ucy9jaGFuZ2Vsb2cvY2hhbmdlbG9nLmFzeW5jLWFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFrQixrQkFBa0IsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQzdFLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUN0RSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDcEQsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0scUZBQXFGLENBQUM7Ozs7O0FBSzFILE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxrQkFBa0I7SUFHeEQsWUFDYyxNQUFjLEVBQ2QsWUFBc0IsRUFDdEIsT0FBdUI7UUFFakMsS0FBSyxFQUFFLENBQUM7UUFKRSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsaUJBQVksR0FBWixZQUFZLENBQVU7UUFDdEIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFMckMsUUFBRyxHQUFHLE9BQU8sQ0FBQztJQVFkLENBQUM7SUFFRCxHQUFHLENBQUMsSUFBcUI7UUFFckIsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1lBQ3JFLE9BQU87U0FDVjtRQUVELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsK0JBQStCLENBQUMsYUFBZ0M7UUFDNUQsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNoQixPQUFPO1NBQ1Y7UUFDRCxNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsZUFBZSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBZ0IsQ0FBQztRQUNuRyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVEOztPQUVHO0lBQ08sb0JBQW9CLENBQUMsR0FBVztRQUN0QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFDdEQ7WUFDSSxJQUFJLEVBQUUsSUFBSTtZQUNWLFFBQVEsRUFBRSxJQUFJO1lBQ2QsVUFBVSxFQUFFLElBQUk7U0FDbkIsQ0FBQyxDQUFDO1FBQ1AsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQztRQUNwRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNsQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLCtCQUErQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsRyxDQUFDOzs7O1lBbkRKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7O1lBUE8sTUFBTTtZQUVOLFFBQVE7WUFEUixjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0FzeW5jQWN0aW9uRGF0YSwgQXN5bmNBY3Rpb25IYW5kbGVyfSBmcm9tICcuLi8uLi9hc3luYy1hY3Rpb24ubW9kZWwnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Um91dGVyfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtNZXNzYWdlU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vbWVzc2FnZS9tZXNzYWdlLnNlcnZpY2UnO1xuaW1wb3J0IHtOZ2JNb2RhbH0gZnJvbSBcIkBuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwXCI7XG5pbXBvcnQge0NsYXNzaWNNb2RhbENvbXBvbmVudH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uLy4uL2NvbXBvbmVudHMvbW9kYWwvY29tcG9uZW50cy9jbGFzc2ljLW1vZGFsL2NsYXNzaWMtbW9kYWwuY29tcG9uZW50XCI7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQ2hhbmdlbG9nQXN5bmNBY3Rpb24gZXh0ZW5kcyBBc3luY0FjdGlvbkhhbmRsZXIge1xuICAgIGtleSA9ICdhdWRpdCc7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyLFxuICAgICAgICBwcm90ZWN0ZWQgbW9kYWxTZXJ2aWNlOiBOZ2JNb2RhbCxcbiAgICAgICAgcHJvdGVjdGVkIG1lc3NhZ2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgICkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHJ1bihkYXRhOiBBc3luY0FjdGlvbkRhdGEpOiB2b2lkIHtcblxuICAgICAgICBpZiAoIWRhdGEgfHwgIWRhdGEudXJsKSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UuYWRkRGFuZ2VyTWVzc2FnZUJ5S2V5KCdMQkxfTUlTU0lOR19IQU5ETEVSX0RBVEFfUk9VVEUnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2hvd0NsYXNzaWNWaWV3TW9kYWwoZGF0YS51cmwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aXRsZSB0ZXh0IGZyb20gaWZyYW1lIHNvdXJjZSBkb2N1bWVudFxuICAgICAqL1xuICAgIGNoYW5nZUxvZ0xlZ2FjeUNvbnRlbnRGb3JtYXR0ZXIoaWZyYW1lRWxlbWVudDogSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgICAgaWYgKCFpZnJhbWVFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm9kZSA9IGlmcmFtZUVsZW1lbnQuY29udGVudERvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vZHVsZVRpdGxlJylbMF0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUuaW5uZXJUZXh0ID0gJyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdyByZWNvcmQgc2VsZWN0aW9uIG1vZGFsXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNob3dDbGFzc2ljVmlld01vZGFsKHVybDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG1vZGFsID0gdGhpcy5tb2RhbFNlcnZpY2Uub3BlbihDbGFzc2ljTW9kYWxDb21wb25lbnQsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2l6ZTogJ3hsJyxcbiAgICAgICAgICAgICAgICBjZW50ZXJlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY3JvbGxhYmxlOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgbW9kYWwuY29tcG9uZW50SW5zdGFuY2UudGl0bGVLZXkgPSAnTEJMX0NIQU5HRV9MT0cnO1xuICAgICAgICBtb2RhbC5jb21wb25lbnRJbnN0YW5jZS51cmwgPSB1cmw7XG4gICAgICAgIG1vZGFsLmNvbXBvbmVudEluc3RhbmNlLmFzeW5jQWN0aW9uQ2FsbGJhY2sgPSB0aGlzLmNoYW5nZUxvZ0xlZ2FjeUNvbnRlbnRGb3JtYXR0ZXIuYmluZCh0aGlzKTtcbiAgICB9XG5cbn1cbiJdfQ==