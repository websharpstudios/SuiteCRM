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
import { OnInit } from '@angular/core';
import { FieldComponentInterface } from './field.interface';
import { AttributeDependency, Field, Record } from 'common';
import { Subscription } from 'rxjs';
import { DataTypeFormatter } from '../../services/formatters/data-type.formatter.service';
import { FieldLogicManager } from '../field-logic/field-logic.manager';
import * as ɵngcc0 from '@angular/core';
export declare class BaseFieldComponent implements FieldComponentInterface, OnInit {
    protected typeFormatter: DataTypeFormatter;
    protected logic: FieldLogicManager;
    mode: string;
    field: Field;
    record: Record;
    parent: Record;
    klass: {
        [klass: string]: any;
    };
    dependentFields: string[];
    dependentAttributes: AttributeDependency[];
    protected subs: Subscription[];
    constructor(typeFormatter: DataTypeFormatter, logic: FieldLogicManager);
    ngOnInit(): void;
    protected baseInit(): void;
    /**
     * Calculate and init dependency handlers
     */
    protected initDependencyHandlers(): void;
    /**
     * Calculate dependent fields
     * @param {array} fieldKeys
     */
    protected calculateDependentFields(fieldKeys: string[]): void;
    /**
     * Add field dependency
     * @param {string} fieldKey
     * @param {array} dependentFields
     * @param {object} dependentAttributes
     */
    protected addFieldDependency(fieldKey: string, dependentFields: string[], dependentAttributes: AttributeDependency[]): void;
    /**
     * Check if field is dependency
     * @param dependencies
     * @returns {boolean}
     */
    protected isDependencyField(dependencies: string[]): boolean;
    /**
     * Add attribute dependency
     * @param {string} fieldKey
     * @param {array} dependentFields
     * @param {object} dependentAttributes
     */
    protected addAttributeDependency(fieldKey: string, dependentFields: string[], dependentAttributes: AttributeDependency[]): void;
    /**
     * Check if attribute is dependency
     * @param {object} attributeDependencies
     * @returns {boolean}
     */
    protected isDependencyAttribute(attributeDependencies: AttributeDependency[]): boolean;
    protected subscribeValueChanges(): void;
    protected setFieldValue(newValue: any): void;
    protected unsubscribeAll(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<BaseFieldComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<BaseFieldComponent, "ng-component", never, { "klass": "klass"; "mode": "mode"; "field": "field"; "record": "record"; "parent": "parent"; }, {}, never, never>;
}

//# sourceMappingURL=base-field.component.d.ts.map