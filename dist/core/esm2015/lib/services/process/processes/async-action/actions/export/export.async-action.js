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
import { MessageService } from '../../../../../message/message.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../../../message/message.service";
export class ExportAsyncAction extends AsyncActionHandler {
    constructor(message) {
        super();
        this.message = message;
        this.key = 'export';
    }
    run(data) {
        if (!data || !data.url || !data.formData) {
            this.message.addDangerMessageByKey('LBL_MISSING_HANDLER_DATA_ROUTE');
            return;
        }
        const options = {
            responseType: 'blob',
            observe: 'response',
        };
        if (data.queryParams) {
            options.params = data.queryParams;
        }
        this.download(data.url, data.formData);
    }
    /**
     * Download file
     *
     * NOTE: using a hidden form instead of js for better memory management see:
     * https://github.com/eligrey/FileSaver.js/wiki/Saving-a-remote-file#using-a-form-element-other-than-get-methods
     *
     * @param {string} url for download
     * @param {object} formData to submit
     */
    download(url, formData) {
        const form = document.createElement('form');
        form.setAttribute('id', 'export-download');
        form.setAttribute('method', 'post');
        form.setAttribute('action', url);
        form.setAttribute('target', '_self');
        form.setAttribute('style', 'display: none;');
        Object.keys(formData).forEach(key => {
            const hiddenField = document.createElement('input');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', formData[key]);
            form.appendChild(hiddenField);
        });
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
}
ExportAsyncAction.ɵprov = i0.ɵɵdefineInjectable({ factory: function ExportAsyncAction_Factory() { return new ExportAsyncAction(i0.ɵɵinject(i1.MessageService)); }, token: ExportAsyncAction, providedIn: "root" });
ExportAsyncAction.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
ExportAsyncAction.ctorParameters = () => [
    { type: MessageService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LmFzeW5jLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zZXJ2aWNlcy9wcm9jZXNzL3Byb2Nlc3Nlcy9hc3luYy1hY3Rpb24vYWN0aW9ucy9leHBvcnQvZXhwb3J0LmFzeW5jLWFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFrQixrQkFBa0IsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQzdFLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHdDQUF3QyxDQUFDOzs7QUFLdEUsTUFBTSxPQUFPLGlCQUFrQixTQUFRLGtCQUFrQjtJQUdyRCxZQUNjLE9BQXVCO1FBRWpDLEtBQUssRUFBRSxDQUFDO1FBRkUsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFIckMsUUFBRyxHQUFHLFFBQVEsQ0FBQztJQU1mLENBQUM7SUFFRCxHQUFHLENBQUMsSUFBcUI7UUFFckIsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztZQUNyRSxPQUFPO1NBQ1Y7UUFFRCxNQUFNLE9BQU8sR0FBRztZQUNaLFlBQVksRUFBRSxNQUFNO1lBQ3BCLE9BQU8sRUFBRSxVQUFVO1NBQ0ksQ0FBQztRQUU1QixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbEIsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDTyxRQUFRLENBQUMsR0FBVyxFQUFFLFFBQW1DO1FBRS9ELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2hDLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDcEQsV0FBVyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdEMsV0FBVyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Ozs7WUE1REosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFKTyxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0FzeW5jQWN0aW9uRGF0YSwgQXN5bmNBY3Rpb25IYW5kbGVyfSBmcm9tICcuLi8uLi9hc3luYy1hY3Rpb24ubW9kZWwnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gJy4uLy4uLy4uLy4uLy4uL21lc3NhZ2UvbWVzc2FnZS5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBFeHBvcnRBc3luY0FjdGlvbiBleHRlbmRzIEFzeW5jQWN0aW9uSGFuZGxlciB7XG4gICAga2V5ID0gJ2V4cG9ydCc7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIG1lc3NhZ2U6IE1lc3NhZ2VTZXJ2aWNlXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcnVuKGRhdGE6IEFzeW5jQWN0aW9uRGF0YSk6IHZvaWQge1xuXG4gICAgICAgIGlmICghZGF0YSB8fCAhZGF0YS51cmwgfHwgIWRhdGEuZm9ybURhdGEpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZS5hZGREYW5nZXJNZXNzYWdlQnlLZXkoJ0xCTF9NSVNTSU5HX0hBTkRMRVJfREFUQV9ST1VURScpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogJ2Jsb2InLFxuICAgICAgICAgICAgb2JzZXJ2ZTogJ3Jlc3BvbnNlJyxcbiAgICAgICAgfSBhcyB7IFtrZXk6IHN0cmluZ106IGFueSB9O1xuXG4gICAgICAgIGlmIChkYXRhLnF1ZXJ5UGFyYW1zKSB7XG4gICAgICAgICAgICBvcHRpb25zLnBhcmFtcyA9IGRhdGEucXVlcnlQYXJhbXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRvd25sb2FkKGRhdGEudXJsLCBkYXRhLmZvcm1EYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb3dubG9hZCBmaWxlXG4gICAgICpcbiAgICAgKiBOT1RFOiB1c2luZyBhIGhpZGRlbiBmb3JtIGluc3RlYWQgb2YganMgZm9yIGJldHRlciBtZW1vcnkgbWFuYWdlbWVudCBzZWU6XG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvRmlsZVNhdmVyLmpzL3dpa2kvU2F2aW5nLWEtcmVtb3RlLWZpbGUjdXNpbmctYS1mb3JtLWVsZW1lbnQtb3RoZXItdGhhbi1nZXQtbWV0aG9kc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBmb3IgZG93bmxvYWRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZm9ybURhdGEgdG8gc3VibWl0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGRvd25sb2FkKHVybDogc3RyaW5nLCBmb3JtRGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSk6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgICAgIGZvcm0uc2V0QXR0cmlidXRlKCdpZCcsICdleHBvcnQtZG93bmxvYWQnKTtcbiAgICAgICAgZm9ybS5zZXRBdHRyaWJ1dGUoJ21ldGhvZCcsICdwb3N0Jyk7XG4gICAgICAgIGZvcm0uc2V0QXR0cmlidXRlKCdhY3Rpb24nLCB1cmwpO1xuICAgICAgICBmb3JtLnNldEF0dHJpYnV0ZSgndGFyZ2V0JywgJ19zZWxmJyk7XG4gICAgICAgIGZvcm0uc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBub25lOycpO1xuXG5cbiAgICAgICAgT2JqZWN0LmtleXMoZm9ybURhdGEpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhpZGRlbkZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgIGhpZGRlbkZpZWxkLnNldEF0dHJpYnV0ZSgnbmFtZScsIGtleSk7XG4gICAgICAgICAgICBoaWRkZW5GaWVsZC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgZm9ybURhdGFba2V5XSk7XG4gICAgICAgICAgICBmb3JtLmFwcGVuZENoaWxkKGhpZGRlbkZpZWxkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmb3JtKTtcbiAgICAgICAgZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChmb3JtKTtcbiAgICB9XG59XG4iXX0=