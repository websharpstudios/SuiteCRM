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
import { MessageTypes } from 'common';
import { BehaviorSubject } from 'rxjs';
import { SystemConfigStore } from '../../store/system-config/system-config.store';
import * as i0 from "@angular/core";
import * as i1 from "../../store/system-config/system-config.store";
export class MessageService {
    constructor(config) {
        this.config = config;
        this.messages = [];
        this.timeout = 3;
        this.messagesStage = new BehaviorSubject([]);
        this.messages$ = this.messagesStage.asObservable();
        this.initTimeOut();
    }
    updateState(messages) {
        this.messagesStage.next(this.messages = messages);
    }
    removeMessages() {
        this.updateState([]);
    }
    contains(message, remove = false) {
        let found = false;
        for (let i = 0; i < this.messages.length; i++) {
            if (message.text === this.messages[i].text) {
                found = true;
                if (remove) {
                    const messages = [...this.messages];
                    messages.splice(i, 1);
                    this.updateState(messages);
                }
                break;
            }
        }
        return found;
    }
    addMessage(message) {
        // push message only if it does not contains already...
        let ret = -1;
        if (!this.contains(message)) {
            const newMessages = [...this.messages];
            ret = newMessages.push(message);
            if (message.type === MessageTypes.success || message.type === MessageTypes.warning) {
                setTimeout(() => {
                    this.contains(message, true);
                }, this.timeout * 1000);
            }
            this.updateState(newMessages);
        }
        return ret;
    }
    addPrimaryMessage(text) {
        return this.addMessage({
            type: MessageTypes.primary,
            text
        });
    }
    addSecondaryMessage(text) {
        return this.addMessage({
            type: MessageTypes.secondary,
            text
        });
    }
    addSuccessMessage(text) {
        return this.addMessage({
            type: MessageTypes.success,
            text
        });
    }
    addSuccessMessageByKey(labelKey) {
        return this.addMessage({
            type: MessageTypes.success,
            labelKey
        });
    }
    addDangerMessage(text) {
        return this.addMessage({
            type: MessageTypes.danger,
            text
        });
    }
    addDangerMessageByKey(labelKey) {
        return this.addMessage({
            type: MessageTypes.danger,
            labelKey
        });
    }
    addWarningMessage(text) {
        return this.addMessage({
            type: MessageTypes.warning,
            text
        });
    }
    addWarningMessageByKey(labelKey) {
        return this.addMessage({
            type: MessageTypes.warning,
            labelKey
        });
    }
    addInfoMessage(text) {
        return this.addMessage({
            type: MessageTypes.info,
            text
        });
    }
    addDarkMessage(text) {
        return this.addMessage({
            type: MessageTypes.dark,
            text
        });
    }
    // --- LOG ---
    log(...args) {
        console.log.apply(console, args);
    }
    error(...args) {
        console.error.apply(console, args);
    }
    initTimeOut() {
        const ui = this.config.getConfigValue('ui');
        if (ui && ui.alert_timeout) {
            const parsed = parseInt(ui.alert_timeout, 10);
            if (!isNaN(parsed)) {
                this.timeout = parsed;
            }
        }
    }
}
MessageService.ɵprov = i0.ɵɵdefineInjectable({ factory: function MessageService_Factory() { return new MessageService(i0.ɵɵinject(i1.SystemConfigStore)); }, token: MessageService, providedIn: "root" });
MessageService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
MessageService.ctorParameters = () => [
    { type: SystemConfigStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3NlcnZpY2VzL21lc3NhZ2UvbWVzc2FnZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBVSxZQUFZLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDN0MsT0FBTyxFQUFDLGVBQWUsRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUNqRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwrQ0FBK0MsQ0FBQzs7O0FBS2hGLE1BQU0sT0FBTyxjQUFjO0lBTXZCLFlBQW1CLE1BQXlCO1FBQXpCLFdBQU0sR0FBTixNQUFNLENBQW1CO1FBSmxDLGFBQVEsR0FBYyxFQUFFLENBQUM7UUFFekIsWUFBTyxHQUFHLENBQUMsQ0FBQztRQUdsQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksZUFBZSxDQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUFtQjtRQUMzQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxjQUFjO1FBQ1YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQsUUFBUSxDQUFDLE9BQWdCLEVBQUUsTUFBTSxHQUFHLEtBQUs7UUFDckMsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLEtBQUssSUFB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IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWVzc2FnZSwgTWVzc2FnZVR5cGVzfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtTeXN0ZW1Db25maWdTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvc3lzdGVtLWNvbmZpZy9zeXN0ZW0tY29uZmlnLnN0b3JlJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBNZXNzYWdlU2VydmljZSB7XG4gICAgbWVzc2FnZXMkOiBPYnNlcnZhYmxlPE1lc3NhZ2VbXT47XG4gICAgcHJvdGVjdGVkIG1lc3NhZ2VzOiBNZXNzYWdlW10gPSBbXTtcbiAgICBwcm90ZWN0ZWQgbWVzc2FnZXNTdGFnZTogQmVoYXZpb3JTdWJqZWN0PE1lc3NhZ2VbXT47XG4gICAgcHJvdGVjdGVkIHRpbWVvdXQgPSAzO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGNvbmZpZzogU3lzdGVtQ29uZmlnU3RvcmUpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlc1N0YWdlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxNZXNzYWdlW10+KFtdKTtcbiAgICAgICAgdGhpcy5tZXNzYWdlcyQgPSB0aGlzLm1lc3NhZ2VzU3RhZ2UuYXNPYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMuaW5pdFRpbWVPdXQoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVTdGF0ZShtZXNzYWdlczogTWVzc2FnZVtdKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZXNTdGFnZS5uZXh0KHRoaXMubWVzc2FnZXMgPSBtZXNzYWdlcyk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTWVzc2FnZXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoW10pO1xuICAgIH1cblxuICAgIGNvbnRhaW5zKG1lc3NhZ2U6IE1lc3NhZ2UsIHJlbW92ZSA9IGZhbHNlKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlLnRleHQgPT09IHRoaXMubWVzc2FnZXNbaV0udGV4dCkge1xuICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAocmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gWy4uLnRoaXMubWVzc2FnZXNdO1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGUobWVzc2FnZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm91bmQ7XG4gICAgfVxuXG4gICAgYWRkTWVzc2FnZShtZXNzYWdlOiBNZXNzYWdlKTogbnVtYmVyIHtcbiAgICAgICAgLy8gcHVzaCBtZXNzYWdlIG9ubHkgaWYgaXQgZG9lcyBub3QgY29udGFpbnMgYWxyZWFkeS4uLlxuICAgICAgICBsZXQgcmV0ID0gLTE7XG4gICAgICAgIGlmICghdGhpcy5jb250YWlucyhtZXNzYWdlKSkge1xuICAgICAgICAgICAgY29uc3QgbmV3TWVzc2FnZXMgPSBbLi4udGhpcy5tZXNzYWdlc107XG4gICAgICAgICAgICByZXQgPSBuZXdNZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICBpZiAobWVzc2FnZS50eXBlID09PSBNZXNzYWdlVHlwZXMuc3VjY2VzcyB8fCBtZXNzYWdlLnR5cGUgPT09IE1lc3NhZ2VUeXBlcy53YXJuaW5nKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbnMobWVzc2FnZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSwgdGhpcy50aW1lb3V0ICogMTAwMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGUobmV3TWVzc2FnZXMpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGFkZFByaW1hcnlNZXNzYWdlKHRleHQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogTWVzc2FnZVR5cGVzLnByaW1hcnksXG4gICAgICAgICAgICB0ZXh0XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZFNlY29uZGFyeU1lc3NhZ2UodGV4dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkTWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiBNZXNzYWdlVHlwZXMuc2Vjb25kYXJ5LFxuICAgICAgICAgICAgdGV4dFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRTdWNjZXNzTWVzc2FnZSh0ZXh0OiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6IE1lc3NhZ2VUeXBlcy5zdWNjZXNzLFxuICAgICAgICAgICAgdGV4dFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRTdWNjZXNzTWVzc2FnZUJ5S2V5KGxhYmVsS2V5OiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6IE1lc3NhZ2VUeXBlcy5zdWNjZXNzLFxuICAgICAgICAgICAgbGFiZWxLZXlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkRGFuZ2VyTWVzc2FnZSh0ZXh0OiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6IE1lc3NhZ2VUeXBlcy5kYW5nZXIsXG4gICAgICAgICAgICB0ZXh0XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZERhbmdlck1lc3NhZ2VCeUtleShsYWJlbEtleTogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkTWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiBNZXNzYWdlVHlwZXMuZGFuZ2VyLFxuICAgICAgICAgICAgbGFiZWxLZXlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkV2FybmluZ01lc3NhZ2UodGV4dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkTWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiBNZXNzYWdlVHlwZXMud2FybmluZyxcbiAgICAgICAgICAgIHRleHRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkV2FybmluZ01lc3NhZ2VCeUtleShsYWJlbEtleTogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkTWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiBNZXNzYWdlVHlwZXMud2FybmluZyxcbiAgICAgICAgICAgIGxhYmVsS2V5XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZEluZm9NZXNzYWdlKHRleHQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogTWVzc2FnZVR5cGVzLmluZm8sXG4gICAgICAgICAgICB0ZXh0XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZERhcmtNZXNzYWdlKHRleHQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogTWVzc2FnZVR5cGVzLmRhcmssXG4gICAgICAgICAgICB0ZXh0XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIC0tLSBMT0cgLS0tXG5cbiAgICBsb2coLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJncyk7XG4gICAgfVxuXG4gICAgZXJyb3IoLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5lcnJvci5hcHBseShjb25zb2xlLCBhcmdzKTtcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCBpbml0VGltZU91dCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdWkgPSB0aGlzLmNvbmZpZy5nZXRDb25maWdWYWx1ZSgndWknKTtcbiAgICAgICAgaWYgKHVpICYmIHVpLmFsZXJ0X3RpbWVvdXQpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHVpLmFsZXJ0X3RpbWVvdXQsIDEwKTtcbiAgICAgICAgICAgIGlmICghaXNOYU4ocGFyc2VkKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudGltZW91dCA9IHBhcnNlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==