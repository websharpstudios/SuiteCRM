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
import { Field, FieldDefinition, Record, ViewFieldDefinition } from 'common';
import { LanguageStore } from '../../../store/language/language.store';
import { SavedFilter } from '../../../store/saved-filters/saved-filter.model';
import { FieldBuilder } from './field.builder';
import { GroupFieldBuilder } from './group-field.builder';
import { AttributeBuilder } from './attribute.builder';
import { FilterFieldBuilder } from './filter-field.builder';
import { FilterAttributeBuilder } from './filter-attribute.builder';
import { LineItemBuilder } from './line-item.builder';
import * as ɵngcc0 from '@angular/core';
export declare class FieldManager {
    protected fieldBuilder: FieldBuilder;
    protected groupFieldBuilder: GroupFieldBuilder;
    protected attributeBuilder: AttributeBuilder;
    protected filterFieldBuilder: FilterFieldBuilder;
    protected filterAttributeBuilder: FilterAttributeBuilder;
    protected lineItemBuilder: LineItemBuilder;
    protected languageStore: LanguageStore;
    constructor(fieldBuilder: FieldBuilder, groupFieldBuilder: GroupFieldBuilder, attributeBuilder: AttributeBuilder, filterFieldBuilder: FilterFieldBuilder, filterAttributeBuilder: FilterAttributeBuilder, lineItemBuilder: LineItemBuilder, languageStore: LanguageStore);
    /**
     * Build minimally initialised field object
     *
     * @param {string} type field type
     * @param {string} value field value
     * @returns {object} Field
     */
    buildShallowField(type: string, value: string): Field;
    /**
     * Build and add field to record
     *
     * @param {object} record Record
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @returns {object}Field
     */
    addField(record: Record, viewField: ViewFieldDefinition, language?: LanguageStore): Field;
    /**
     * Build and add filter field to record
     *
     * @param {object} record Record
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @returns {object}Field
     */
    addFilterField(record: SavedFilter, viewField: ViewFieldDefinition, language?: LanguageStore): Field;
    /**
     * Build line item and add to record
     * @param {object} itemDefinition
     * @param {object }item
     * @param {object} parentRecord
     * @param {object} parentField
     */
    addLineItem(itemDefinition: FieldDefinition, parentRecord: Record, parentField: Field, item?: Record): void;
    /**
     * Remove line item
     * @param {object} parentField
     * @param index
     */
    removeLineItem(parentField: Field, index: number): void;
    /**
     * Add field to record
     *
     * @param {object} record Record
     * @param {string} name string
     * @param {object} field Field
     */
    addToRecord(record: Record, name: string, field: Field): void;
    /**
     * Is field initialized in record
     *
     * @param {object} record Record
     * @param {string} fieldName field
     * @returns {boolean} isInitialized
     */
    protected isFieldInitialized(record: Record, fieldName: string): boolean;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<FieldManager, never>;
}

//# sourceMappingURL=field.manager.d.ts.map