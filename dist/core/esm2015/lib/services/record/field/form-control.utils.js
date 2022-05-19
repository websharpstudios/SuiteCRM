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
import * as i0 from "@angular/core";
export class FormControlUtils {
    getTrimmedInputValue(inputValue) {
        // Handle the cases, when input values are not string e.g. multienums: String[]
        // Process the input, only when it's a string else return as it is
        if (typeof inputValue !== 'string') {
            return inputValue;
        }
        return inputValue.trim();
    }
    isEmptyInputValue(inputValue) {
        // Handle the cases, when input value is an string, array, objects or any other type
        return inputValue == null
            || typeof inputValue === 'undefined'
            || inputValue === ''
            || inputValue.length === 0;
    }
    isEmptyTrimmedInputValue(inputValue) {
        return this.isEmptyInputValue(this.getTrimmedInputValue(inputValue));
    }
    isEmptyBooleanInputValue(inputValue) {
        return this.isEmptyInputValue(inputValue) || inputValue === 'false' || inputValue === false || inputValue === '';
    }
}
FormControlUtils.ɵprov = i0.ɵɵdefineInjectable({ factory: function FormControlUtils_Factory() { return new FormControlUtils(); }, token: FormControlUtils, providedIn: "root" });
FormControlUtils.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1jb250cm9sLnV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL3NlcnZpY2VzL3JlY29yZC9maWVsZC9mb3JtLWNvbnRyb2wudXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBTXpDLE1BQU0sT0FBTyxnQkFBZ0I7SUFFekIsb0JBQW9CLENBQUMsVUFBZTtRQUNoQywrRUFBK0U7UUFDL0Usa0VBQWtFO1FBQ2xFLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1lBQ2hDLE9BQU8sVUFBVSxDQUFDO1NBQ3JCO1FBQ0QsT0FBTyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELGlCQUFpQixDQUFDLFVBQWU7UUFDN0Isb0ZBQW9GO1FBQ3BGLE9BQU8sVUFBVSxJQUFJLElBQUk7ZUFDbEIsT0FBTyxVQUFVLEtBQUssV0FBVztlQUNqQyxVQUFVLEtBQUssRUFBRTtlQUNqQixVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsd0JBQXdCLENBQUMsVUFBZTtRQUNwQyxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsd0JBQXdCLENBQUMsVUFBZTtRQUNwQyxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxVQUFVLEtBQUssT0FBTyxJQUFJLFVBQVUsS0FBSyxLQUFLLElBQUksVUFBVSxLQUFLLEVBQUUsQ0FBQztJQUNySCxDQUFDOzs7O1lBN0JKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcblxuZXhwb3J0IGNsYXNzIEZvcm1Db250cm9sVXRpbHMge1xuXG4gICAgZ2V0VHJpbW1lZElucHV0VmFsdWUoaW5wdXRWYWx1ZTogYW55KTogYW55IHtcbiAgICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlcywgd2hlbiBpbnB1dCB2YWx1ZXMgYXJlIG5vdCBzdHJpbmcgZS5nLiBtdWx0aWVudW1zOiBTdHJpbmdbXVxuICAgICAgICAvLyBQcm9jZXNzIHRoZSBpbnB1dCwgb25seSB3aGVuIGl0J3MgYSBzdHJpbmcgZWxzZSByZXR1cm4gYXMgaXQgaXNcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dFZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlucHV0VmFsdWUudHJpbSgpO1xuICAgIH1cblxuICAgIGlzRW1wdHlJbnB1dFZhbHVlKGlucHV0VmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICAvLyBIYW5kbGUgdGhlIGNhc2VzLCB3aGVuIGlucHV0IHZhbHVlIGlzIGFuIHN0cmluZywgYXJyYXksIG9iamVjdHMgb3IgYW55IG90aGVyIHR5cGVcbiAgICAgICAgcmV0dXJuIGlucHV0VmFsdWUgPT0gbnVsbFxuICAgICAgICAgICAgfHwgdHlwZW9mIGlucHV0VmFsdWUgPT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICB8fCBpbnB1dFZhbHVlID09PSAnJ1xuICAgICAgICAgICAgfHwgaW5wdXRWYWx1ZS5sZW5ndGggPT09IDA7XG4gICAgfVxuXG4gICAgaXNFbXB0eVRyaW1tZWRJbnB1dFZhbHVlKGlucHV0VmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0VtcHR5SW5wdXRWYWx1ZSh0aGlzLmdldFRyaW1tZWRJbnB1dFZhbHVlKGlucHV0VmFsdWUpKTtcbiAgICB9XG5cbiAgICBpc0VtcHR5Qm9vbGVhbklucHV0VmFsdWUoaW5wdXRWYWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzRW1wdHlJbnB1dFZhbHVlKGlucHV0VmFsdWUpIHx8IGlucHV0VmFsdWUgPT09ICdmYWxzZScgfHwgaW5wdXRWYWx1ZSA9PT0gZmFsc2UgfHwgaW5wdXRWYWx1ZSA9PT0gJyc7XG4gICAgfVxufVxuIl19