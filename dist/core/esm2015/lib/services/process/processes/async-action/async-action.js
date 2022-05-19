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
import { catchError, take, tap } from 'rxjs/operators';
import { ProcessService } from '../../process.service';
import { AppStateStore } from '../../../../store/app-state/app-state.store';
import { MessageService } from '../../../message/message.service';
import { RedirectAsyncAction } from './actions/redirect/redirect.async-action';
import { ExportAsyncAction } from './actions/export/export.async-action';
import { NoopAsyncAction } from './actions/noop/noop.async-action';
import { ChangelogAsyncAction } from './actions/changelog/changelog.async-action';
import * as i0 from "@angular/core";
import * as i1 from "../../process.service";
import * as i2 from "../../../../store/app-state/app-state.store";
import * as i3 from "../../../message/message.service";
import * as i4 from "./actions/redirect/redirect.async-action";
import * as i5 from "./actions/export/export.async-action";
import * as i6 from "./actions/noop/noop.async-action";
import * as i7 from "./actions/changelog/changelog.async-action";
export class AsyncActionService {
    constructor(processService, appStateStore, message, redirectAction, exportAction, noopAction, changelogAction) {
        this.processService = processService;
        this.appStateStore = appStateStore;
        this.message = message;
        this.redirectAction = redirectAction;
        this.exportAction = exportAction;
        this.noopAction = noopAction;
        this.changelogAction = changelogAction;
        this.actions = {};
        this.registerHandler(redirectAction);
        this.registerHandler(exportAction);
        this.registerHandler(noopAction);
        this.registerHandler(changelogAction);
    }
    registerHandler(handler) {
        this.actions[handler.key] = handler;
    }
    /**
     * Send action request
     *
     * @param {string} actionName to submit
     * @param {string} data to send
     * @param {string} presetHandlerKey to use
     * @returns {object} Observable<Process>
     */
    run(actionName, data, presetHandlerKey = null) {
        const options = Object.assign({}, data);
        this.appStateStore.updateLoading(actionName, true);
        return this.processService
            .submit(actionName, options)
            .pipe(take(1), tap((process) => {
            this.appStateStore.updateLoading(actionName, false);
            let handler = 'addSuccessMessageByKey';
            if (process.status === 'error') {
                handler = 'addDangerMessageByKey';
            }
            if (process.messages) {
                process.messages.forEach(message => {
                    if (!!message) {
                        this.message[handler](message);
                    }
                });
            }
            if (process.status === 'error') {
                return;
            }
            const actionHandlerKey = presetHandlerKey || (process.data && process.data.handler) || null;
            if (!actionHandlerKey) {
                return;
            }
            const actionHandler = this.actions[actionHandlerKey];
            if (!actionHandler) {
                this.message.addDangerMessageByKey('LBL_MISSING_HANDLER');
                return;
            }
            actionHandler.run(process.data.params);
        }), catchError(err => {
            this.message.addDangerMessageByKey('LBL_ACTION_ERROR');
            this.appStateStore.updateLoading(actionName, false);
            throw err;
        }));
    }
}
AsyncActionService.ɵprov = i0.ɵɵdefineInjectable({ factory: function AsyncActionService_Factory() { return new AsyncActionService(i0.ɵɵinject(i1.ProcessService), i0.ɵɵinject(i2.AppStateStore), i0.ɵɵinject(i3.MessageService), i0.ɵɵinject(i4.RedirectAsyncAction), i0.ɵɵinject(i5.ExportAsyncAction), i0.ɵɵinject(i6.NoopAsyncAction), i0.ɵɵinject(i7.ChangelogAsyncAction)); }, token: AsyncActionService, providedIn: "root" });
AsyncActionService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
AsyncActionService.ctorParameters = () => [
    { type: ProcessService },
    { type: AppStateStore },
    { type: MessageService },
    { type: RedirectAsyncAction },
    { type: ExportAsyncAction },
    { type: NoopAsyncAction },
    { type: ChangelogAsyncAction }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMtYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3NlcnZpY2VzL3Byb2Nlc3MvcHJvY2Vzc2VzL2FzeW5jLWFjdGlvbi9hc3luYy1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDckQsT0FBTyxFQUFVLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzlELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSw2Q0FBNkMsQ0FBQztBQUMxRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFHaEUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFDN0UsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDdkUsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQ2pFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDRDQUE0QyxDQUFDOzs7Ozs7Ozs7QUFnQmhGLE1BQU0sT0FBTyxrQkFBa0I7SUFJM0IsWUFDWSxjQUE4QixFQUM5QixhQUE0QixFQUMxQixPQUF1QixFQUN2QixjQUFtQyxFQUNuQyxZQUErQixFQUMvQixVQUEyQixFQUMzQixlQUFxQztRQU52QyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDMUIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFDdkIsbUJBQWMsR0FBZCxjQUFjLENBQXFCO1FBQ25DLGlCQUFZLEdBQVosWUFBWSxDQUFtQjtRQUMv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IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2NhdGNoRXJyb3IsIHRha2UsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtQcm9jZXNzLCBQcm9jZXNzU2VydmljZX0gZnJvbSAnLi4vLi4vcHJvY2Vzcy5zZXJ2aWNlJztcbmltcG9ydCB7QXBwU3RhdGVTdG9yZX0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvYXBwLXN0YXRlL2FwcC1zdGF0ZS5zdG9yZSc7XG5pbXBvcnQge01lc3NhZ2VTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9tZXNzYWdlL21lc3NhZ2Uuc2VydmljZSc7XG5pbXBvcnQge0FzeW5jQWN0aW9uSGFuZGxlcn0gZnJvbSAnLi9hc3luYy1hY3Rpb24ubW9kZWwnO1xuaW1wb3J0IHtSZWNvcmQsIFNlYXJjaENyaXRlcmlhLCBTb3J0aW5nU2VsZWN0aW9ufSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtSZWRpcmVjdEFzeW5jQWN0aW9ufSBmcm9tICcuL2FjdGlvbnMvcmVkaXJlY3QvcmVkaXJlY3QuYXN5bmMtYWN0aW9uJztcbmltcG9ydCB7RXhwb3J0QXN5bmNBY3Rpb259IGZyb20gJy4vYWN0aW9ucy9leHBvcnQvZXhwb3J0LmFzeW5jLWFjdGlvbic7XG5pbXBvcnQge05vb3BBc3luY0FjdGlvbn0gZnJvbSAnLi9hY3Rpb25zL25vb3Avbm9vcC5hc3luYy1hY3Rpb24nO1xuaW1wb3J0IHtDaGFuZ2Vsb2dBc3luY0FjdGlvbn0gZnJvbSAnLi9hY3Rpb25zL2NoYW5nZWxvZy9jaGFuZ2Vsb2cuYXN5bmMtYWN0aW9uJztcblxuZXhwb3J0IGludGVyZmFjZSBBc3luY0FjdGlvbklucHV0IHtcbiAgICBhY3Rpb246IHN0cmluZztcbiAgICBtb2R1bGU6IHN0cmluZztcbiAgICBjcml0ZXJpYT86IFNlYXJjaENyaXRlcmlhO1xuICAgIHNvcnQ/OiBTb3J0aW5nU2VsZWN0aW9uO1xuICAgIGlkcz86IHN0cmluZ1tdO1xuICAgIGlkPzogc3RyaW5nO1xuICAgIHBheWxvYWQ/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9O1xuICAgIG1vZGFsUmVjb3JkPzogUmVjb3JkO1xufVxuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBBc3luY0FjdGlvblNlcnZpY2Uge1xuXG4gICAgYWN0aW9uczogeyBba2V5OiBzdHJpbmddOiBBc3luY0FjdGlvbkhhbmRsZXIgfSA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcHJvY2Vzc1NlcnZpY2U6IFByb2Nlc3NTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIGFwcFN0YXRlU3RvcmU6IEFwcFN0YXRlU3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBtZXNzYWdlOiBNZXNzYWdlU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIHJlZGlyZWN0QWN0aW9uOiBSZWRpcmVjdEFzeW5jQWN0aW9uLFxuICAgICAgICBwcm90ZWN0ZWQgZXhwb3J0QWN0aW9uOiBFeHBvcnRBc3luY0FjdGlvbixcbiAgICAgICAgcHJvdGVjdGVkIG5vb3BBY3Rpb246IE5vb3BBc3luY0FjdGlvbixcbiAgICAgICAgcHJvdGVjdGVkIGNoYW5nZWxvZ0FjdGlvbjogQ2hhbmdlbG9nQXN5bmNBY3Rpb25cbiAgICApIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlckhhbmRsZXIocmVkaXJlY3RBY3Rpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySGFuZGxlcihleHBvcnRBY3Rpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySGFuZGxlcihub29wQWN0aW9uKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckhhbmRsZXIoY2hhbmdlbG9nQWN0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJIYW5kbGVyKGhhbmRsZXI6IEFzeW5jQWN0aW9uSGFuZGxlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmFjdGlvbnNbaGFuZGxlci5rZXldID0gaGFuZGxlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZW5kIGFjdGlvbiByZXF1ZXN0XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uTmFtZSB0byBzdWJtaXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0YSB0byBzZW5kXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByZXNldEhhbmRsZXJLZXkgdG8gdXNlXG4gICAgICogQHJldHVybnMge29iamVjdH0gT2JzZXJ2YWJsZTxQcm9jZXNzPlxuICAgICAqL1xuICAgIHB1YmxpYyBydW4oYWN0aW9uTmFtZTogc3RyaW5nLCBkYXRhOiBBc3luY0FjdGlvbklucHV0LCBwcmVzZXRIYW5kbGVyS2V5OiBzdHJpbmcgPSBudWxsKTogT2JzZXJ2YWJsZTxQcm9jZXNzPiB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAuLi5kYXRhXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5hcHBTdGF0ZVN0b3JlLnVwZGF0ZUxvYWRpbmcoYWN0aW9uTmFtZSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1NlcnZpY2VcbiAgICAgICAgICAgIC5zdWJtaXQoYWN0aW9uTmFtZSwgb3B0aW9ucylcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIHRha2UoMSksXG4gICAgICAgICAgICAgICAgdGFwKChwcm9jZXNzOiBQcm9jZXNzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwU3RhdGVTdG9yZS51cGRhdGVMb2FkaW5nKGFjdGlvbk5hbWUsIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgaGFuZGxlciA9ICdhZGRTdWNjZXNzTWVzc2FnZUJ5S2V5JztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2Nlc3Muc3RhdHVzID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyID0gJ2FkZERhbmdlck1lc3NhZ2VCeUtleSc7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvY2Vzcy5tZXNzYWdlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5tZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCEhbWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2VbaGFuZGxlcl0obWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvY2Vzcy5zdGF0dXMgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGlvbkhhbmRsZXJLZXkgPSBwcmVzZXRIYW5kbGVyS2V5IHx8IChwcm9jZXNzLmRhdGEgJiYgcHJvY2Vzcy5kYXRhLmhhbmRsZXIpIHx8IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhY3Rpb25IYW5kbGVyS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb25IYW5kbGVyOiBBc3luY0FjdGlvbkhhbmRsZXIgPSB0aGlzLmFjdGlvbnNbYWN0aW9uSGFuZGxlcktleV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhY3Rpb25IYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UuYWRkRGFuZ2VyTWVzc2FnZUJ5S2V5KCdMQkxfTUlTU0lOR19IQU5ETEVSJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25IYW5kbGVyLnJ1bihwcm9jZXNzLmRhdGEucGFyYW1zKTtcblxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoZXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlLmFkZERhbmdlck1lc3NhZ2VCeUtleSgnTEJMX0FDVElPTl9FUlJPUicpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcFN0YXRlU3RvcmUudXBkYXRlTG9hZGluZyhhY3Rpb25OYW1lLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICk7XG4gICAgfVxufVxuIl19