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
import { ActionHandler } from 'common';
export class SubpanelLineActionHandler extends ActionHandler {
    checkRecordAccess(data, defaultAcls = []) {
        var _a, _b, _c;
        const record = (_a = data.record) !== null && _a !== void 0 ? _a : {};
        const acls = (_b = record.acls) !== null && _b !== void 0 ? _b : [];
        if (!acls || !acls.length) {
            return false;
        }
        const action = (_c = data.action) !== null && _c !== void 0 ? _c : null;
        return this.checkAccess(action, acls, defaultAcls);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS5hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29udGFpbmVycy9zdWJwYW5lbC9saW5lLWFjdGlvbnMvbGluZS5hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBUyxhQUFhLEVBQVMsTUFBTSxRQUFRLENBQUM7QUFTckQsTUFBTSxPQUFnQix5QkFBMEIsU0FBUSxhQUFxQztJQU16RixpQkFBaUIsQ0FBQyxJQUE0QixFQUFFLGNBQXdCLEVBQUU7O1FBRXRFLE1BQU0sTUFBTSxHQUFHLE1BQUEsSUFBSSxDQUFDLE1BQU0sbUNBQUksRUFBWSxDQUFDO1FBQzNDLE1BQU0sSUFBSSxHQUFHLE1BQUEsTUFBTSxDQUFDLElBQUksbUNBQUksRUFBRSxDQUFDO1FBRS9CLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3ZCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsTUFBTSxNQUFNLEdBQUcsTUFBQSxJQUFJLENBQUMsTUFBTSxtQ0FBSSxJQUFJLENBQUM7UUFFbkMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDdkQsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0FjdGlvbiwgQWN0aW9uSGFuZGxlciwgUmVjb3JkfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtTdWJwYW5lbFN0b3JlfSBmcm9tICcuLi9zdG9yZS9zdWJwYW5lbC9zdWJwYW5lbC5zdG9yZSc7XG5pbXBvcnQge0xpbmVBY3Rpb25EYXRhfSBmcm9tICcuLi8uLi8uLi9jb21wb25lbnRzL3RhYmxlL2xpbmUtYWN0aW9ucy9saW5lLmFjdGlvbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3VicGFuZWxMaW5lQWN0aW9uRGF0YSBleHRlbmRzIExpbmVBY3Rpb25EYXRhIHtcbiAgICByZWNvcmQ6IFJlY29yZDtcbiAgICBzdG9yZTogU3VicGFuZWxTdG9yZTtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN1YnBhbmVsTGluZUFjdGlvbkhhbmRsZXIgZXh0ZW5kcyBBY3Rpb25IYW5kbGVyPFN1YnBhbmVsTGluZUFjdGlvbkRhdGE+IHtcblxuICAgIGFic3RyYWN0IHJ1bihkYXRhOiBTdWJwYW5lbExpbmVBY3Rpb25EYXRhLCBhY3Rpb24/OiBBY3Rpb24pOiB2b2lkO1xuXG4gICAgYWJzdHJhY3Qgc2hvdWxkRGlzcGxheShkYXRhOiBTdWJwYW5lbExpbmVBY3Rpb25EYXRhKTogYm9vbGVhbjtcblxuICAgIGNoZWNrUmVjb3JkQWNjZXNzKGRhdGE6IFN1YnBhbmVsTGluZUFjdGlvbkRhdGEsIGRlZmF1bHRBY2xzOiBzdHJpbmdbXSA9IFtdKTogYm9vbGVhbiB7XG5cbiAgICAgICAgY29uc3QgcmVjb3JkID0gZGF0YS5yZWNvcmQgPz8ge30gYXMgUmVjb3JkO1xuICAgICAgICBjb25zdCBhY2xzID0gcmVjb3JkLmFjbHMgPz8gW107XG5cbiAgICAgICAgaWYgKCFhY2xzIHx8ICFhY2xzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWN0aW9uID0gZGF0YS5hY3Rpb24gPz8gbnVsbDtcblxuICAgICAgICByZXR1cm4gdGhpcy5jaGVja0FjY2VzcyhhY3Rpb24sIGFjbHMsIGRlZmF1bHRBY2xzKTtcbiAgICB9XG59XG4iXX0=