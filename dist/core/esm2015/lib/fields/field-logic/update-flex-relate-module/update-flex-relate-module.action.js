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
import { FieldLogicActionHandler } from '../field-logic.action';
import * as i0 from "@angular/core";
export class UpdateFlexRelateModuleAction extends FieldLogicActionHandler {
    constructor() {
        super();
        this.key = 'update-flex-relate-module';
        this.modes = ['edit', 'create', 'massupdate', 'filter'];
    }
    run(data, action) {
        var _a, _b, _c, _d, _e, _f, _g;
        const record = data.record;
        const field = data.field;
        if (!record || !field) {
            return;
        }
        const typeField = (_a = field.definition.type_name) !== null && _a !== void 0 ? _a : '';
        if (typeField === '') {
            return;
        }
        const type = (_c = (_b = record === null || record === void 0 ? void 0 : record.fields[typeField]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : '';
        const fieldModule = (_e = (_d = field === null || field === void 0 ? void 0 : field.definition) === null || _d === void 0 ? void 0 : _d.module) !== null && _e !== void 0 ? _e : '';
        if (type !== fieldModule) {
            field.definition.module = (_g = (_f = record === null || record === void 0 ? void 0 : record.fields[typeField]) === null || _f === void 0 ? void 0 : _f.value) !== null && _g !== void 0 ? _g : '';
            this.updateValue(field, {}, '', record);
        }
    }
    updateValue(field, valueObject, value, record) {
        field.value = value;
        field.valueObject = valueObject;
        field.formControl.setValue(value);
        // re-validate the parent form-control after value update
        record.formGroup.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    }
}
UpdateFlexRelateModuleAction.ɵprov = i0.ɵɵdefineInjectable({ factory: function UpdateFlexRelateModuleAction_Factory() { return new UpdateFlexRelateModuleAction(); }, token: UpdateFlexRelateModuleAction, providedIn: "root" });
UpdateFlexRelateModuleAction.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
UpdateFlexRelateModuleAction.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLWZsZXgtcmVsYXRlLW1vZHVsZS5hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvZmllbGRzL2ZpZWxkLWxvZ2ljL3VwZGF0ZS1mbGV4LXJlbGF0ZS1tb2R1bGUvdXBkYXRlLWZsZXgtcmVsYXRlLW1vZHVsZS5hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUF1Qix1QkFBdUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDOztBQUtwRixNQUFNLE9BQU8sNEJBQTZCLFNBQVEsdUJBQXVCO0lBS3JFO1FBQ0ksS0FBSyxFQUFFLENBQUM7UUFKWixRQUFHLEdBQUcsMkJBQTJCLENBQUM7UUFDbEMsVUFBSyxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFlLENBQUM7SUFJakUsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUEwQixFQUFFLE1BQWM7O1FBQzFDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUV6QixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ25CLE9BQU87U0FDVjtRQUVELE1BQU0sU0FBUyxHQUFHLE1BQUEsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLG1DQUFJLEVBQUUsQ0FBQztRQUVuRCxJQUFJLFNBQVMsS0FBSyxFQUFFLEVBQUU7WUFDbEIsT0FBTztTQUNWO1FBRUQsTUFBTSxJQUFJLEdBQUcsTUFBQSxNQUFBLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxNQUFNLENBQUMsU0FBUyxDQUFDLDBDQUFFLEtBQUssbUNBQUksRUFBRSxDQUFDO1FBQ3BELE1BQU0sV0FBVyxHQUFHLE1BQUEsTUFBQSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsVUFBVSwwQ0FBRSxNQUFNLG1DQUFJLEVBQUUsQ0FBQztRQUVwRCxJQUFJLElBQUksS0FBSyxXQUFXLEVBQUU7WUFDdEIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsTUFBQSxNQUFBLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxNQUFNLENBQUMsU0FBUyxDQUFDLDBDQUFFLEtBQUssbUNBQUksRUFBRSxDQUFDO1lBQ2pFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDM0M7SUFDTCxDQUFDO0lBRVMsV0FBVyxDQUFDLEtBQVksRUFBRSxXQUFnQixFQUFFLEtBQWEsRUFBRSxNQUFjO1FBQy9FLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLEtBQUssQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQ2hDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLHlEQUF5RDtRQUN6RCxNQUFNLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUMvRSxDQUFDOzs7O1lBekNKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QWN0aW9uLCBGaWVsZCwgUmVjb3JkLCBWaWV3TW9kZX0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7RmllbGRMb2dpY0FjdGlvbkRhdGEsIEZpZWxkTG9naWNBY3Rpb25IYW5kbGVyfSBmcm9tICcuLi9maWVsZC1sb2dpYy5hY3Rpb24nO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFVwZGF0ZUZsZXhSZWxhdGVNb2R1bGVBY3Rpb24gZXh0ZW5kcyBGaWVsZExvZ2ljQWN0aW9uSGFuZGxlciB7XG5cbiAgICBrZXkgPSAndXBkYXRlLWZsZXgtcmVsYXRlLW1vZHVsZSc7XG4gICAgbW9kZXMgPSBbJ2VkaXQnLCAnY3JlYXRlJywgJ21hc3N1cGRhdGUnLCAnZmlsdGVyJ10gYXMgVmlld01vZGVbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHJ1bihkYXRhOiBGaWVsZExvZ2ljQWN0aW9uRGF0YSwgYWN0aW9uOiBBY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gZGF0YS5yZWNvcmQ7XG4gICAgICAgIGNvbnN0IGZpZWxkID0gZGF0YS5maWVsZDtcblxuICAgICAgICBpZiAoIXJlY29yZCB8fCAhZmllbGQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHR5cGVGaWVsZCA9IGZpZWxkLmRlZmluaXRpb24udHlwZV9uYW1lID8/ICcnO1xuXG4gICAgICAgIGlmICh0eXBlRmllbGQgPT09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0eXBlID0gcmVjb3JkPy5maWVsZHNbdHlwZUZpZWxkXT8udmFsdWUgPz8gJyc7XG4gICAgICAgIGNvbnN0IGZpZWxkTW9kdWxlID0gZmllbGQ/LmRlZmluaXRpb24/Lm1vZHVsZSA/PyAnJztcblxuICAgICAgICBpZiAodHlwZSAhPT0gZmllbGRNb2R1bGUpIHtcbiAgICAgICAgICAgIGZpZWxkLmRlZmluaXRpb24ubW9kdWxlID0gcmVjb3JkPy5maWVsZHNbdHlwZUZpZWxkXT8udmFsdWUgPz8gJyc7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKGZpZWxkLCB7fSwgJycsIHJlY29yZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdXBkYXRlVmFsdWUoZmllbGQ6IEZpZWxkLCB2YWx1ZU9iamVjdDogYW55LCB2YWx1ZTogc3RyaW5nLCByZWNvcmQ6IFJlY29yZCk6IHZvaWQge1xuICAgICAgICBmaWVsZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBmaWVsZC52YWx1ZU9iamVjdCA9IHZhbHVlT2JqZWN0O1xuICAgICAgICBmaWVsZC5mb3JtQ29udHJvbC5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIC8vIHJlLXZhbGlkYXRlIHRoZSBwYXJlbnQgZm9ybS1jb250cm9sIGFmdGVyIHZhbHVlIHVwZGF0ZVxuICAgICAgICByZWNvcmQuZm9ybUdyb3VwLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IHRydWV9KTtcbiAgICB9XG59XG4iXX0=