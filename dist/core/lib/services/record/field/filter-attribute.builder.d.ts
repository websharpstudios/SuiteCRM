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
import { ValidationManager } from '../validation/validation.manager';
import { DataTypeFormatter } from '../../formatters/data-type.formatter.service';
import { SavedFilter } from '../../../store/saved-filters/saved-filter.model';
import { Field, FieldAttribute, FieldDefinition, Record, ViewFieldDefinition } from 'common';
import { LanguageStore } from '../../../store/language/language.store';
import { FilterFieldBuilder } from './filter-field.builder';
import * as ɵngcc0 from '@angular/core';
export declare class FilterAttributeBuilder extends FilterFieldBuilder {
    protected validationManager: ValidationManager;
    protected typeFormatter: DataTypeFormatter;
    constructor(validationManager: ValidationManager, typeFormatter: DataTypeFormatter);
    /**
     * Build filter attribute
     *
     * @param {object} savedFilter SavedFilter
     * @param {object} parentField Field
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @returns {object} FieldAttribute
     */
    buildFilterAttribute(savedFilter: SavedFilter, parentField: Field, viewField: ViewFieldDefinition, language?: LanguageStore): FieldAttribute;
    /**
     * Add attribute to SavedFilter
     *
     * @param {object} savedFilter SavedFilter
     * @param {object} field Field
     * @param {string} name string
     * @param {object} attribute FieldAttribute
     */
    addAttributeToSavedFilter(savedFilter: SavedFilter, field: Field, name: string, attribute: FieldAttribute): void;
    /**
     * Parse filter attribute from field
     *
     * @param {object} viewField ViewFieldDefinition
     * @param {object} definition FieldDefinition
     * @param {object} record Record
     * @param {object} field Field
     * @returns {object} value object
     */
    protected parseFilterAttributeValue(viewField: ViewFieldDefinition, definition: FieldDefinition, record: Record, field: Field): {
        value: string;
        valueList: string[];
        valueObject?: any;
    };
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<FilterAttributeBuilder, never>;
}

//# sourceMappingURL=filter-attribute.builder.d.ts.map