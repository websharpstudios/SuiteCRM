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
import { __rest } from "tslib";
import { take } from 'rxjs/operators';
export class BaseActionsAdapter {
    constructor(actionManager, asyncActionService, message, confirmation, language, selectModalService) {
        this.actionManager = actionManager;
        this.asyncActionService = asyncActionService;
        this.message = message;
        this.confirmation = confirmation;
        this.language = language;
        this.selectModalService = selectModalService;
        this.defaultActions = {
            detail: [],
            list: [],
            edit: [],
            create: [],
            massupdate: []
        };
    }
    /**
     * Run the action using given context
     * @param action
     * @param context
     */
    runAction(action, context = null) {
        const params = (action && action.params) || {};
        const displayConfirmation = params.displayConfirmation || false;
        const confirmationLabel = params.confirmationLabel || '';
        const selectModal = action.params && action.params.selectModal;
        const selectModule = selectModal && selectModal.module;
        if (displayConfirmation) {
            this.confirmation.showModal(confirmationLabel, () => {
                if (!selectModule) {
                    this.callAction(action, context);
                    return;
                }
                this.showSelectModal(selectModal.module, action, context);
            });
            return;
        }
        if (!selectModule) {
            this.callAction(action, context);
            return;
        }
        this.showSelectModal(selectModal.module, action, context);
    }
    /**
     * Run async buk action
     *
     * @returns void
     * @param {string} selectModule: module for which records are listed in Select Modal/Popup
     * @param {string} asyncAction: bulk action name
     * @param {ActionContext} context
     */
    showSelectModal(selectModule, asyncAction, context = null) {
        this.selectModalService.showSelectModal(selectModule, (modalRecord) => {
            if (modalRecord) {
                const { fields, formGroup } = modalRecord, baseRecord = __rest(modalRecord, ["fields", "formGroup"]);
                asyncAction.params.modalRecord = baseRecord;
            }
            this.callAction(asyncAction, context);
        });
    }
    /**
     * Get action name
     * @param action
     */
    getActionName(action) {
        return `${action.key}`;
    }
    /**
     * Parse mode actions
     * @param declaredActions
     * @param mode
     * @param context
     */
    parseModeActions(declaredActions, mode, context = null) {
        if (!declaredActions) {
            return [];
        }
        const availableActions = {
            list: [],
            detail: [],
            edit: [],
            create: [],
            massupdate: [],
        };
        if (declaredActions && declaredActions.length) {
            declaredActions.forEach(action => {
                if (!action.modes || !action.modes.length) {
                    return;
                }
                action.modes.forEach(actionMode => {
                    if (!availableActions[actionMode] && !action.asyncProcess) {
                        return;
                    }
                    availableActions[actionMode].push(action);
                });
            });
        }
        availableActions.detail = availableActions.detail.concat(this.defaultActions.detail);
        availableActions.list = availableActions.list.concat(this.defaultActions.list);
        availableActions.edit = availableActions.edit.concat(this.defaultActions.edit);
        availableActions.create = availableActions.create.concat(this.defaultActions.create);
        availableActions.massupdate = availableActions.massupdate.concat(this.defaultActions.massupdate);
        const actions = [];
        availableActions[mode].forEach(action => {
            const actionHandler = this.actionManager.getHandler(action, mode);
            if (actionHandler) {
                const actionHandler = this.actionManager.getHandler(action, mode);
                const data = this.buildActionData(action, context);
                if (!this.shouldDisplay(actionHandler, data)) {
                    return;
                }
                action.status = actionHandler.getStatus(data) || '';
            }
            const module = (context && context.module) || '';
            const label = this.language.getFieldLabel(action.labelKey, module);
            actions.push(Object.assign(Object.assign({}, action), { label }));
        });
        return actions;
    }
    shouldDisplay(actionHandler, data) {
        return actionHandler && actionHandler.shouldDisplay(data);
    }
    /**
     * Call actions
     * @param action
     * @param context
     */
    callAction(action, context = null) {
        if (action.asyncProcess) {
            this.runAsyncAction(action, context);
            return;
        }
        this.runFrontEndAction(action, context);
    }
    /**
     * Run async actions
     * @param action
     * @param context
     */
    runAsyncAction(action, context = null) {
        const actionName = this.getActionName(action);
        const moduleName = this.getModuleName(context);
        this.message.removeMessages();
        const asyncData = this.buildActionInput(action, actionName, moduleName, context);
        this.asyncActionService.run(actionName, asyncData).pipe(take(1)).subscribe((process) => {
            if (this.shouldReload(process)) {
                this.reload(action, process, context);
            }
        });
    }
    /**
     * Should reload page
     * @param process
     */
    shouldReload(process) {
        return !!(process.data && process.data.reload);
    }
    /**
     * Run front end action
     * @param action
     * @param context
     */
    runFrontEndAction(action, context = null) {
        const data = this.buildActionData(action, context);
        this.actionManager.run(action, this.getMode(), data);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1hY3Rpb24uYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zZXJ2aWNlcy9hY3Rpb25zL2Jhc2UtYWN0aW9uLmFkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRzs7QUFjSCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFRcEMsTUFBTSxPQUFnQixrQkFBa0I7SUFVcEMsWUFDYyxhQUErQixFQUMvQixrQkFBc0MsRUFDdEMsT0FBdUIsRUFDdkIsWUFBc0MsRUFDdEMsUUFBdUIsRUFDdkIsa0JBQXNDO1FBTHRDLGtCQUFhLEdBQWIsYUFBYSxDQUFrQjtRQUMvQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBQ3ZCLGlCQUFZLEdBQVosWUFBWSxDQUEwQjtRQUN0QyxhQUFRLEdBQVIsUUFBUSxDQUFlO1FBQ3ZCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFkcEQsbUJBQWMsR0FBZ0I7WUFDMUIsTUFBTSxFQUFFLEVBQUU7WUFDVixJQUFJLEVBQUUsRUFBRTtZQUNSLElBQUksRUFBRSxFQUFFO1lBQ1IsTUFBTSxFQUFFLEVBQUU7WUFDVixVQUFVLEVBQUUsRUFBRTtTQUNqQixDQUFDO0lBVUYsQ0FBQztJQVlEOzs7O09BSUc7SUFDSCxTQUFTLENBQUMsTUFBYyxFQUFFLFVBQXlCLElBQUk7UUFDbkQsTUFBTSxNQUFNLEdBQUcsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQTRCLENBQUM7UUFDekUsTUFBTSxtQkFBbUIsR0FBRyxNQUFNLENBQUMsbUJBQW1CLElBQUksS0FBSyxDQUFDO1FBQ2hFLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixJQUFJLEVBQUUsQ0FBQztRQUV6RCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQy9ELE1BQU0sWUFBWSxHQUFHLFdBQVcsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDO1FBRXZELElBQUksbUJBQW1CLEVBQUU7WUFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO2dCQUNoRCxJQUFJLENBQUMsWUFBWSxFQUFFO29CQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUNqQyxPQUFPO2lCQUNWO2dCQUNELElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDOUQsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDakMsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLGVBQWUsQ0FBQyxZQUFvQixFQUFFLFdBQW1CLEVBQUUsVUFBeUIsSUFBSTtRQUUzRixJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDLFdBQW1CLEVBQUUsRUFBRTtZQUMxRSxJQUFJLFdBQVcsRUFBRTtnQkFDYixNQUFNLEVBQUMsTUFBTSxFQUFFLFNBQVMsS0FBbUIsV0FBVyxFQUF6QixVQUFVLFVBQUksV0FBVyxFQUFoRCx1QkFBa0MsQ0FBYyxDQUFDO2dCQUN2RCxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7YUFDL0M7WUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFhRDs7O09BR0c7SUFDTyxhQUFhLENBQUMsTUFBYztRQUNsQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLGdCQUFnQixDQUFDLGVBQXlCLEVBQUUsSUFBYyxFQUFFLFVBQXlCLElBQUk7UUFDL0YsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUNsQixPQUFPLEVBQUUsQ0FBQztTQUNiO1FBRUQsTUFBTSxnQkFBZ0IsR0FBRztZQUNyQixJQUFJLEVBQUUsRUFBRTtZQUNSLE1BQU0sRUFBRSxFQUFFO1lBQ1YsSUFBSSxFQUFFLEVBQUU7WUFDUixNQUFNLEVBQUUsRUFBRTtZQUNWLFVBQVUsRUFBRSxFQUFFO1NBQ0YsQ0FBQztRQUVqQixJQUFJLGVBQWUsSUFBSSxlQUFlLENBQUMsTUFBTSxFQUFFO1lBQzNDLGVBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7b0JBQ3ZDLE9BQU87aUJBQ1Y7Z0JBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQzlCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7d0JBQ3ZELE9BQU87cUJBQ1Y7b0JBQ0QsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM5QyxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1NBQ047UUFFRCxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JGLGdCQUFnQixDQUFDLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0UsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRSxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JGLGdCQUFnQixDQUFDLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFakcsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBRW5CLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUVwQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFbEUsSUFBSSxhQUFhLEVBQUU7Z0JBQ2YsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNsRSxNQUFNLElBQUksR0FBTSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFFdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxFQUFFO29CQUMxQyxPQUFPO2lCQUNWO2dCQUVELE1BQU0sQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDdkQ7WUFFRCxNQUFNLE1BQU0sR0FBRyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2pELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbkUsT0FBTyxDQUFDLElBQUksaUNBQ0wsTUFBTSxLQUNULEtBQUssSUFDUCxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRVMsYUFBYSxDQUFDLGFBQStCLEVBQUUsSUFBTztRQUU1RCxPQUFPLGFBQWEsSUFBSSxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRDs7OztPQUlHO0lBQ08sVUFBVSxDQUFDLE1BQWMsRUFBRSxVQUF5QixJQUFJO1FBQzlELElBQUksTUFBTSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNyQyxPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sY0FBYyxDQUFDLE1BQWMsRUFBRSxVQUF5QixJQUFJO1FBQ2xFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUvQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzlCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVqRixJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBZ0IsRUFBRSxFQUFFO1lBQzVGLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ3pDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7OztPQUdHO0lBQ08sWUFBWSxDQUFDLE9BQWdCO1FBQ25DLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRDs7OztPQUlHO0lBQ08saUJBQWlCLENBQUMsTUFBYyxFQUFFLFVBQXlCLElBQUk7UUFDckUsTUFBTSxJQUFJLEdBQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFdEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6RCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7XG4gICAgQWN0aW9uLFxuICAgIEFjdGlvbkNvbnRleHQsXG4gICAgQWN0aW9uRGF0YSxcbiAgICBBY3Rpb25EYXRhU291cmNlLFxuICAgIEFjdGlvbkhhbmRsZXIsXG4gICAgQWN0aW9uTWFuYWdlcixcbiAgICBNb2RlQWN0aW9ucyxcbiAgICBSZWNvcmQsXG4gICAgVmlld01vZGVcbn0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7QXN5bmNBY3Rpb25JbnB1dCwgQXN5bmNBY3Rpb25TZXJ2aWNlfSBmcm9tICcuLi9wcm9jZXNzL3Byb2Nlc3Nlcy9hc3luYy1hY3Rpb24vYXN5bmMtYWN0aW9uJztcbmltcG9ydCB7TWVzc2FnZVNlcnZpY2V9IGZyb20gJy4uL21lc3NhZ2UvbWVzc2FnZS5zZXJ2aWNlJztcbmltcG9ydCB7UHJvY2Vzc30gZnJvbSAnLi4vcHJvY2Vzcy9wcm9jZXNzLnNlcnZpY2UnO1xuaW1wb3J0IHtDb25maXJtYXRpb25Nb2RhbFNlcnZpY2V9IGZyb20gJy4uL21vZGFscy9jb25maXJtYXRpb24tbW9kYWwuc2VydmljZSc7XG5pbXBvcnQge0xhbmd1YWdlU3RvcmV9IGZyb20gJy4uLy4uL3N0b3JlL2xhbmd1YWdlL2xhbmd1YWdlLnN0b3JlJztcbmltcG9ydCB7U2VsZWN0TW9kYWxTZXJ2aWNlfSBmcm9tICcuLi9tb2RhbHMvc2VsZWN0LW1vZGFsLnNlcnZpY2UnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZUFjdGlvbnNBZGFwdGVyPEQgZXh0ZW5kcyBBY3Rpb25EYXRhPiBpbXBsZW1lbnRzIEFjdGlvbkRhdGFTb3VyY2Uge1xuXG4gICAgZGVmYXVsdEFjdGlvbnM6IE1vZGVBY3Rpb25zID0ge1xuICAgICAgICBkZXRhaWw6IFtdLFxuICAgICAgICBsaXN0OiBbXSxcbiAgICAgICAgZWRpdDogW10sXG4gICAgICAgIGNyZWF0ZTogW10sXG4gICAgICAgIG1hc3N1cGRhdGU6IFtdXG4gICAgfTtcblxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGFjdGlvbk1hbmFnZXI6IEFjdGlvbk1hbmFnZXI8RD4sXG4gICAgICAgIHByb3RlY3RlZCBhc3luY0FjdGlvblNlcnZpY2U6IEFzeW5jQWN0aW9uU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIG1lc3NhZ2U6IE1lc3NhZ2VTZXJ2aWNlLFxuICAgICAgICBwcm90ZWN0ZWQgY29uZmlybWF0aW9uOiBDb25maXJtYXRpb25Nb2RhbFNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBsYW5ndWFnZTogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIHNlbGVjdE1vZGFsU2VydmljZTogU2VsZWN0TW9kYWxTZXJ2aWNlXG4gICAgKSB7XG4gICAgfVxuXG4gICAgYWJzdHJhY3QgZ2V0QWN0aW9ucyhjb250ZXh0PzogQWN0aW9uQ29udGV4dCk6IE9ic2VydmFibGU8QWN0aW9uW10+O1xuXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IGdldE1vZHVsZU5hbWUoY29udGV4dD86IEFjdGlvbkNvbnRleHQpOiBzdHJpbmc7XG5cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVsb2FkKGFjdGlvbjogQWN0aW9uLCBwcm9jZXNzOiBQcm9jZXNzLCBjb250ZXh0PzogQWN0aW9uQ29udGV4dCk6IHZvaWQ7XG5cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0TW9kZSgpOiBWaWV3TW9kZTtcblxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBidWlsZEFjdGlvbkRhdGEoYWN0aW9uOiBBY3Rpb24sIGNvbnRleHQ/OiBBY3Rpb25Db250ZXh0KTogRDtcblxuICAgIC8qKlxuICAgICAqIFJ1biB0aGUgYWN0aW9uIHVzaW5nIGdpdmVuIGNvbnRleHRcbiAgICAgKiBAcGFyYW0gYWN0aW9uXG4gICAgICogQHBhcmFtIGNvbnRleHRcbiAgICAgKi9cbiAgICBydW5BY3Rpb24oYWN0aW9uOiBBY3Rpb24sIGNvbnRleHQ6IEFjdGlvbkNvbnRleHQgPSBudWxsKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IChhY3Rpb24gJiYgYWN0aW9uLnBhcmFtcykgfHwge30gYXMgeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcbiAgICAgICAgY29uc3QgZGlzcGxheUNvbmZpcm1hdGlvbiA9IHBhcmFtcy5kaXNwbGF5Q29uZmlybWF0aW9uIHx8IGZhbHNlO1xuICAgICAgICBjb25zdCBjb25maXJtYXRpb25MYWJlbCA9IHBhcmFtcy5jb25maXJtYXRpb25MYWJlbCB8fCAnJztcblxuICAgICAgICBjb25zdCBzZWxlY3RNb2RhbCA9IGFjdGlvbi5wYXJhbXMgJiYgYWN0aW9uLnBhcmFtcy5zZWxlY3RNb2RhbDtcbiAgICAgICAgY29uc3Qgc2VsZWN0TW9kdWxlID0gc2VsZWN0TW9kYWwgJiYgc2VsZWN0TW9kYWwubW9kdWxlO1xuXG4gICAgICAgIGlmIChkaXNwbGF5Q29uZmlybWF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpcm1hdGlvbi5zaG93TW9kYWwoY29uZmlybWF0aW9uTGFiZWwsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGVjdE1vZHVsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbGxBY3Rpb24oYWN0aW9uLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNob3dTZWxlY3RNb2RhbChzZWxlY3RNb2RhbC5tb2R1bGUsIGFjdGlvbiwgY29udGV4dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWxlY3RNb2R1bGUpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsbEFjdGlvbihhY3Rpb24sIGNvbnRleHQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93U2VsZWN0TW9kYWwoc2VsZWN0TW9kYWwubW9kdWxlLCBhY3Rpb24sIGNvbnRleHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1biBhc3luYyBidWsgYWN0aW9uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdE1vZHVsZTogbW9kdWxlIGZvciB3aGljaCByZWNvcmRzIGFyZSBsaXN0ZWQgaW4gU2VsZWN0IE1vZGFsL1BvcHVwXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGFzeW5jQWN0aW9uOiBidWxrIGFjdGlvbiBuYW1lXG4gICAgICogQHBhcmFtIHtBY3Rpb25Db250ZXh0fSBjb250ZXh0XG4gICAgICovXG4gICAgcHVibGljIHNob3dTZWxlY3RNb2RhbChzZWxlY3RNb2R1bGU6IHN0cmluZywgYXN5bmNBY3Rpb246IEFjdGlvbiwgY29udGV4dDogQWN0aW9uQ29udGV4dCA9IG51bGwpIHtcblxuICAgICAgICB0aGlzLnNlbGVjdE1vZGFsU2VydmljZS5zaG93U2VsZWN0TW9kYWwoc2VsZWN0TW9kdWxlLCAobW9kYWxSZWNvcmQ6IFJlY29yZCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1vZGFsUmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qge2ZpZWxkcywgZm9ybUdyb3VwLCAuLi5iYXNlUmVjb3JkfSA9IG1vZGFsUmVjb3JkO1xuICAgICAgICAgICAgICAgIGFzeW5jQWN0aW9uLnBhcmFtcy5tb2RhbFJlY29yZCA9IGJhc2VSZWNvcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNhbGxBY3Rpb24oYXN5bmNBY3Rpb24sIGNvbnRleHQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhc3luYyBwcm9jZXNzIGlucHV0XG4gICAgICogQHBhcmFtIGFjdGlvblxuICAgICAqIEBwYXJhbSBhY3Rpb25OYW1lXG4gICAgICogQHBhcmFtIG1vZHVsZU5hbWVcbiAgICAgKiBAcGFyYW0gY29udGV4dFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBidWlsZEFjdGlvbklucHV0KGFjdGlvbjogQWN0aW9uLCBhY3Rpb25OYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlTmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ/OiBBY3Rpb25Db250ZXh0KTogQXN5bmNBY3Rpb25JbnB1dDtcblxuICAgIC8qKlxuICAgICAqIEdldCBhY3Rpb24gbmFtZVxuICAgICAqIEBwYXJhbSBhY3Rpb25cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0QWN0aW9uTmFtZShhY3Rpb246IEFjdGlvbikge1xuICAgICAgICByZXR1cm4gYCR7YWN0aW9uLmtleX1gO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIG1vZGUgYWN0aW9uc1xuICAgICAqIEBwYXJhbSBkZWNsYXJlZEFjdGlvbnNcbiAgICAgKiBAcGFyYW0gbW9kZVxuICAgICAqIEBwYXJhbSBjb250ZXh0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHBhcnNlTW9kZUFjdGlvbnMoZGVjbGFyZWRBY3Rpb25zOiBBY3Rpb25bXSwgbW9kZTogVmlld01vZGUsIGNvbnRleHQ6IEFjdGlvbkNvbnRleHQgPSBudWxsKSB7XG4gICAgICAgIGlmICghZGVjbGFyZWRBY3Rpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhdmFpbGFibGVBY3Rpb25zID0ge1xuICAgICAgICAgICAgbGlzdDogW10sXG4gICAgICAgICAgICBkZXRhaWw6IFtdLFxuICAgICAgICAgICAgZWRpdDogW10sXG4gICAgICAgICAgICBjcmVhdGU6IFtdLFxuICAgICAgICAgICAgbWFzc3VwZGF0ZTogW10sXG4gICAgICAgIH0gYXMgTW9kZUFjdGlvbnM7XG5cbiAgICAgICAgaWYgKGRlY2xhcmVkQWN0aW9ucyAmJiBkZWNsYXJlZEFjdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBkZWNsYXJlZEFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4ge1xuICAgICAgICAgICAgICAgIGlmICghYWN0aW9uLm1vZGVzIHx8ICFhY3Rpb24ubW9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhY3Rpb24ubW9kZXMuZm9yRWFjaChhY3Rpb25Nb2RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhdmFpbGFibGVBY3Rpb25zW2FjdGlvbk1vZGVdICYmICFhY3Rpb24uYXN5bmNQcm9jZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmxlQWN0aW9uc1thY3Rpb25Nb2RlXS5wdXNoKGFjdGlvbik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF2YWlsYWJsZUFjdGlvbnMuZGV0YWlsID0gYXZhaWxhYmxlQWN0aW9ucy5kZXRhaWwuY29uY2F0KHRoaXMuZGVmYXVsdEFjdGlvbnMuZGV0YWlsKTtcbiAgICAgICAgYXZhaWxhYmxlQWN0aW9ucy5saXN0ID0gYXZhaWxhYmxlQWN0aW9ucy5saXN0LmNvbmNhdCh0aGlzLmRlZmF1bHRBY3Rpb25zLmxpc3QpO1xuICAgICAgICBhdmFpbGFibGVBY3Rpb25zLmVkaXQgPSBhdmFpbGFibGVBY3Rpb25zLmVkaXQuY29uY2F0KHRoaXMuZGVmYXVsdEFjdGlvbnMuZWRpdCk7XG4gICAgICAgIGF2YWlsYWJsZUFjdGlvbnMuY3JlYXRlID0gYXZhaWxhYmxlQWN0aW9ucy5jcmVhdGUuY29uY2F0KHRoaXMuZGVmYXVsdEFjdGlvbnMuY3JlYXRlKTtcbiAgICAgICAgYXZhaWxhYmxlQWN0aW9ucy5tYXNzdXBkYXRlID0gYXZhaWxhYmxlQWN0aW9ucy5tYXNzdXBkYXRlLmNvbmNhdCh0aGlzLmRlZmF1bHRBY3Rpb25zLm1hc3N1cGRhdGUpO1xuXG4gICAgICAgIGNvbnN0IGFjdGlvbnMgPSBbXTtcblxuICAgICAgICBhdmFpbGFibGVBY3Rpb25zW21vZGVdLmZvckVhY2goYWN0aW9uID0+IHtcblxuICAgICAgICAgICAgY29uc3QgYWN0aW9uSGFuZGxlciA9IHRoaXMuYWN0aW9uTWFuYWdlci5nZXRIYW5kbGVyKGFjdGlvbiwgbW9kZSk7XG5cbiAgICAgICAgICAgIGlmIChhY3Rpb25IYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aW9uSGFuZGxlciA9IHRoaXMuYWN0aW9uTWFuYWdlci5nZXRIYW5kbGVyKGFjdGlvbiwgbW9kZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YTogRCA9IHRoaXMuYnVpbGRBY3Rpb25EYXRhKGFjdGlvbiwgY29udGV4dCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc2hvdWxkRGlzcGxheShhY3Rpb25IYW5kbGVyLCBkYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYWN0aW9uLnN0YXR1cyA9IGFjdGlvbkhhbmRsZXIuZ2V0U3RhdHVzKGRhdGEpIHx8ICcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBtb2R1bGUgPSAoY29udGV4dCAmJiBjb250ZXh0Lm1vZHVsZSkgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXMubGFuZ3VhZ2UuZ2V0RmllbGRMYWJlbChhY3Rpb24ubGFiZWxLZXksIG1vZHVsZSk7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgIC4uLmFjdGlvbixcbiAgICAgICAgICAgICAgICBsYWJlbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhY3Rpb25zO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBzaG91bGREaXNwbGF5KGFjdGlvbkhhbmRsZXI6IEFjdGlvbkhhbmRsZXI8RD4sIGRhdGE6IEQpOiBib29sZWFuIHtcblxuICAgICAgICByZXR1cm4gYWN0aW9uSGFuZGxlciAmJiBhY3Rpb25IYW5kbGVyLnNob3VsZERpc3BsYXkoZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbCBhY3Rpb25zXG4gICAgICogQHBhcmFtIGFjdGlvblxuICAgICAqIEBwYXJhbSBjb250ZXh0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNhbGxBY3Rpb24oYWN0aW9uOiBBY3Rpb24sIGNvbnRleHQ6IEFjdGlvbkNvbnRleHQgPSBudWxsKSB7XG4gICAgICAgIGlmIChhY3Rpb24uYXN5bmNQcm9jZXNzKSB7XG4gICAgICAgICAgICB0aGlzLnJ1bkFzeW5jQWN0aW9uKGFjdGlvbiwgY29udGV4dCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ydW5Gcm9udEVuZEFjdGlvbihhY3Rpb24sIGNvbnRleHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1biBhc3luYyBhY3Rpb25zXG4gICAgICogQHBhcmFtIGFjdGlvblxuICAgICAqIEBwYXJhbSBjb250ZXh0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHJ1bkFzeW5jQWN0aW9uKGFjdGlvbjogQWN0aW9uLCBjb250ZXh0OiBBY3Rpb25Db250ZXh0ID0gbnVsbCk6IHZvaWQge1xuICAgICAgICBjb25zdCBhY3Rpb25OYW1lID0gdGhpcy5nZXRBY3Rpb25OYW1lKGFjdGlvbik7XG4gICAgICAgIGNvbnN0IG1vZHVsZU5hbWUgPSB0aGlzLmdldE1vZHVsZU5hbWUoY29udGV4dCk7XG5cbiAgICAgICAgdGhpcy5tZXNzYWdlLnJlbW92ZU1lc3NhZ2VzKCk7XG4gICAgICAgIGNvbnN0IGFzeW5jRGF0YSA9IHRoaXMuYnVpbGRBY3Rpb25JbnB1dChhY3Rpb24sIGFjdGlvbk5hbWUsIG1vZHVsZU5hbWUsIGNvbnRleHQpO1xuXG4gICAgICAgIHRoaXMuYXN5bmNBY3Rpb25TZXJ2aWNlLnJ1bihhY3Rpb25OYW1lLCBhc3luY0RhdGEpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKChwcm9jZXNzOiBQcm9jZXNzKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zaG91bGRSZWxvYWQocHJvY2VzcykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbG9hZChhY3Rpb24sIHByb2Nlc3MsIGNvbnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG91bGQgcmVsb2FkIHBhZ2VcbiAgICAgKiBAcGFyYW0gcHJvY2Vzc1xuICAgICAqL1xuICAgIHByb3RlY3RlZCBzaG91bGRSZWxvYWQocHJvY2VzczogUHJvY2Vzcyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISEocHJvY2Vzcy5kYXRhICYmIHByb2Nlc3MuZGF0YS5yZWxvYWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1biBmcm9udCBlbmQgYWN0aW9uXG4gICAgICogQHBhcmFtIGFjdGlvblxuICAgICAqIEBwYXJhbSBjb250ZXh0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHJ1bkZyb250RW5kQWN0aW9uKGFjdGlvbjogQWN0aW9uLCBjb250ZXh0OiBBY3Rpb25Db250ZXh0ID0gbnVsbCk6IHZvaWQge1xuICAgICAgICBjb25zdCBkYXRhOiBEID0gdGhpcy5idWlsZEFjdGlvbkRhdGEoYWN0aW9uLCBjb250ZXh0KTtcblxuICAgICAgICB0aGlzLmFjdGlvbk1hbmFnZXIucnVuKGFjdGlvbiwgdGhpcy5nZXRNb2RlKCksIGRhdGEpO1xuICAgIH1cbn1cbiJdfQ==