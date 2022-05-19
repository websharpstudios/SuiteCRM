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
import { Field, FieldDefinition } from 'common';
import { BaseFieldComponent } from '../base/base-field.component';
import { FieldLogicManager } from '../field-logic/field-logic.manager';
import { DataTypeFormatter } from '../../services/formatters/data-type.formatter.service';
import { StandardFieldRegistry } from '../standard-field.registry';
import * as ɵngcc0 from '@angular/core';
export declare class GroupFieldComponent extends BaseFieldComponent {
    protected typeFormatter: DataTypeFormatter;
    protected registry: StandardFieldRegistry;
    protected logic: FieldLogicManager;
    constructor(typeFormatter: DataTypeFormatter, registry: StandardFieldRegistry, logic: FieldLogicManager);
    getComponentType(type: string, definition: FieldDefinition): any;
    /**
     * Get the group fields from the record
     *
     * @returns {object} Field[]
     */
    getFields(): Field[];
    getModule(): string;
    /**
     * Get flex direction to be used
     *
     * @returns {string} direction
     */
    getDirection(): string;
    /**
     * Check if is configured
     *
     * @returns {boolean} is configured
     */
    isConfigured(): boolean;
    showLabel(fieldName: string): boolean;
    isModeEnabled(mode: string, groupField: Field): boolean;
    /**
     * Check if groupFields are configured
     *
     * @returns {boolean} has groupFields
     */
    protected hasGroupFields(): boolean;
    /**
     * Check if layout is configured
     *
     * @returns {boolean} has layout
     */
    protected hasLayout(): boolean;
    /**
     * Check if display is configured
     *
     * @returns {boolean} has display
     */
    protected hasDisplay(): boolean;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<GroupFieldComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<GroupFieldComponent, "scrm-group-field", never, {}, {}, never, never>;
}

//# sourceMappingURL=group-field.component.d.ts.map