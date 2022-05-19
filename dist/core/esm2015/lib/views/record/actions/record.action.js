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
export class RecordActionHandler extends ActionHandler {
    checkRecordAccess(data, defaultAcls = []) {
        var _a, _b;
        const record = data.store.recordStore.getBaseRecord();
        const acls = (_a = record.acls) !== null && _a !== void 0 ? _a : [];
        if (!acls || !acls.length) {
            return false;
        }
        const action = (_b = data.action) !== null && _b !== void 0 ? _b : null;
        return this.checkAccess(action, acls, defaultAcls);
    }
    /**
     * Navigate back
     * @param navigation
     * @param params
     * @param id
     * @param moduleName
     * @param record
     */
    navigateBack(navigation, params, id, moduleName, record) {
        let returnModule = navigation.getReturnModule(params);
        let returnAction = navigation.getReturnAction(params);
        let returnId = navigation.getReturnId(params);
        if (id === returnId) {
            return;
        }
        if (returnModule === moduleName &&
            returnAction === 'record' &&
            returnId !== id) {
            return;
        }
        if (!returnModule || !returnAction) {
            return;
        }
        navigation.navigateBack(record, moduleName, params);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLmFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi92aWV3cy9yZWNvcmQvYWN0aW9ucy9yZWNvcmQuYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQXFCLGFBQWEsRUFBUyxNQUFNLFFBQVEsQ0FBQztBQVNqRSxNQUFNLE9BQWdCLG1CQUFvQixTQUFRLGFBQStCO0lBTTdFLGlCQUFpQixDQUFDLElBQXNCLEVBQUUsY0FBd0IsRUFBRTs7UUFFaEUsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdEQsTUFBTSxJQUFJLEdBQUcsTUFBQSxNQUFNLENBQUMsSUFBSSxtQ0FBSSxFQUFFLENBQUM7UUFFL0IsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDdkIsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxNQUFNLE1BQU0sR0FBRyxNQUFBLElBQUksQ0FBQyxNQUFNLG1DQUFJLElBQUksQ0FBQztRQUVuQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNPLFlBQVksQ0FDbEIsVUFBNEIsRUFDNUIsTUFBK0IsRUFDL0IsRUFBVSxFQUNWLFVBQWtCLEVBQ2xCLE1BQWM7UUFFZCxJQUFJLFlBQVksR0FBRyxVQUFVLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RELElBQUksWUFBWSxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEQsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5QyxJQUFJLEVBQUUsS0FBSyxRQUFRLEVBQUU7WUFDakIsT0FBTztTQUNWO1FBRUQsSUFBSSxZQUFZLEtBQUssVUFBVTtZQUMzQixZQUFZLEtBQUssUUFBUTtZQUN6QixRQUFRLEtBQUssRUFBRSxFQUNqQjtZQUNFLE9BQU87U0FDVjtRQUVELElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDaEMsT0FBTztTQUNWO1FBRUQsVUFBVSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3hELENBQUM7Q0FFSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtBY3Rpb24sIEFjdGlvbkRhdGEsIEFjdGlvbkhhbmRsZXIsIFJlY29yZH0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7UmVjb3JkVmlld1N0b3JlfSBmcm9tICcuLi9zdG9yZS9yZWNvcmQtdmlldy9yZWNvcmQtdmlldy5zdG9yZSc7XG5pbXBvcnQge01vZHVsZU5hdmlnYXRpb259IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24vbW9kdWxlLW5hdmlnYXRpb24vbW9kdWxlLW5hdmlnYXRpb24uc2VydmljZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkQWN0aW9uRGF0YSBleHRlbmRzIEFjdGlvbkRhdGEge1xuICAgIHN0b3JlOiBSZWNvcmRWaWV3U3RvcmU7XG4gICAgYWN0aW9uPzogQWN0aW9uO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVjb3JkQWN0aW9uSGFuZGxlciBleHRlbmRzIEFjdGlvbkhhbmRsZXI8UmVjb3JkQWN0aW9uRGF0YT4ge1xuXG4gICAgYWJzdHJhY3QgcnVuKGRhdGE6IFJlY29yZEFjdGlvbkRhdGEpOiB2b2lkO1xuXG4gICAgYWJzdHJhY3Qgc2hvdWxkRGlzcGxheShkYXRhOiBSZWNvcmRBY3Rpb25EYXRhKTogYm9vbGVhbjtcblxuICAgIGNoZWNrUmVjb3JkQWNjZXNzKGRhdGE6IFJlY29yZEFjdGlvbkRhdGEsIGRlZmF1bHRBY2xzOiBzdHJpbmdbXSA9IFtdKTogYm9vbGVhbiB7XG5cbiAgICAgICAgY29uc3QgcmVjb3JkID0gZGF0YS5zdG9yZS5yZWNvcmRTdG9yZS5nZXRCYXNlUmVjb3JkKCk7XG4gICAgICAgIGNvbnN0IGFjbHMgPSByZWNvcmQuYWNscyA/PyBbXTtcblxuICAgICAgICBpZiAoIWFjbHMgfHwgIWFjbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhY3Rpb24gPSBkYXRhLmFjdGlvbiA/PyBudWxsO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNoZWNrQWNjZXNzKGFjdGlvbiwgYWNscywgZGVmYXVsdEFjbHMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE5hdmlnYXRlIGJhY2tcbiAgICAgKiBAcGFyYW0gbmF2aWdhdGlvblxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcGFyYW0gaWRcbiAgICAgKiBAcGFyYW0gbW9kdWxlTmFtZVxuICAgICAqIEBwYXJhbSByZWNvcmRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgbmF2aWdhdGVCYWNrKFxuICAgICAgICBuYXZpZ2F0aW9uOiBNb2R1bGVOYXZpZ2F0aW9uLFxuICAgICAgICBwYXJhbXM6IHsgW3A6IHN0cmluZ106IHN0cmluZyB9LFxuICAgICAgICBpZDogc3RyaW5nLFxuICAgICAgICBtb2R1bGVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHJlY29yZDogUmVjb3JkXG4gICAgKSB7XG4gICAgICAgIGxldCByZXR1cm5Nb2R1bGUgPSBuYXZpZ2F0aW9uLmdldFJldHVybk1vZHVsZShwYXJhbXMpO1xuICAgICAgICBsZXQgcmV0dXJuQWN0aW9uID0gbmF2aWdhdGlvbi5nZXRSZXR1cm5BY3Rpb24ocGFyYW1zKTtcbiAgICAgICAgbGV0IHJldHVybklkID0gbmF2aWdhdGlvbi5nZXRSZXR1cm5JZChwYXJhbXMpO1xuXG4gICAgICAgIGlmIChpZCA9PT0gcmV0dXJuSWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXR1cm5Nb2R1bGUgPT09IG1vZHVsZU5hbWUgJiZcbiAgICAgICAgICAgIHJldHVybkFjdGlvbiA9PT0gJ3JlY29yZCcgJiZcbiAgICAgICAgICAgIHJldHVybklkICE9PSBpZFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmV0dXJuTW9kdWxlIHx8ICFyZXR1cm5BY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG5hdmlnYXRpb24ubmF2aWdhdGVCYWNrKHJlY29yZCwgbW9kdWxlTmFtZSwgcGFyYW1zKTtcbiAgICB9XG5cbn1cbiJdfQ==