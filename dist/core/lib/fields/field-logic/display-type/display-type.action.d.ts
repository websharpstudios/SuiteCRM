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
import { FieldLogicActionData, FieldLogicActionHandler } from '../field-logic.action';
import { Action, Field, Record, StringArrayMap, StringArrayMatrix, ViewMode } from 'common';
import * as ɵngcc0 from '@angular/core';
export declare class DisplayTypeAction extends FieldLogicActionHandler {
    key: string;
    modes: ViewMode[];
    constructor();
    run(data: FieldLogicActionData, action: Action): void;
    /**
     * Check if any of the configured values is currently set
     * @param {array} relatedFields
     * @param {object} record
     * @param {object} activeOnFields
     * @param {array} relatedAttributesFields
     * @param {object} activeOnAttributes
     */
    protected isActive(relatedFields: string[], record: Record, activeOnFields: StringArrayMap, relatedAttributesFields: string[], activeOnAttributes: StringArrayMatrix): boolean;
    /**
     * Are attributes active
     * @param {array} relatedAttributesFields
     * @param {object} record
     * @param {object} activeOnAttributes
     */
    protected areAttributesActive(relatedAttributesFields: string[], record: Record, activeOnAttributes: StringArrayMatrix): boolean;
    /**
     * Are fields active
     * @param {array} relatedFields
     * @param {object} record
     * @param {object} activeOnFields
     */
    protected areFieldsActive(relatedFields: string[], record: Record, activeOnFields: StringArrayMap): boolean;
    /**
     * Is value active
     * @param {object} field
     * @param {array} activeValues
     */
    protected isValueActive(field: Field, activeValues: string[]): boolean;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<DisplayTypeAction, never>;
}

//# sourceMappingURL=display-type.action.d.ts.map