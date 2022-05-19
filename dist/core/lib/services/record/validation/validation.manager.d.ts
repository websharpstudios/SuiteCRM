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
import { ValidatorInterface } from './validator.Interface';
import { MapEntry, OverridableMap, Record, StringMap, StringMatrix, ViewFieldDefinition } from 'common';
import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { AsyncValidatorInterface } from './aync-validator.Interface';
import { RequiredValidator } from './validators/required.validator';
import { CurrencyValidator } from './validators/currency.validator';
import { DateValidator } from './validators/date.validator';
import { DateTimeValidator } from './validators/datetime.validator';
import { FloatValidator } from './validators/float.validator';
import { IntValidator } from './validators/int.validator';
import { EmailValidator } from './validators/email.validator';
import { PhoneValidator } from './validators/phone.validator';
import { RangeValidator } from './validators/range.validator';
import { PrimaryEmailValidator } from './validators/primary-email.validator';
import { DuplicateEmailValidator } from './validators/duplicate-email.validator';
import * as ɵngcc0 from '@angular/core';
export interface ValidationManagerInterface {
    registerSaveValidator(module: string, key: string, validator: ValidatorInterface): void;
    registerFilterValidator(module: string, key: string, validator: ValidatorInterface): void;
    excludeSaveValidator(module: string, key: string): void;
    excludeFilterValidator(module: string, key: string): void;
    registerAsyncSaveValidator(module: string, key: string, validator: AsyncValidatorInterface): void;
    excludeAsyncSaveValidator(module: string, key: string): void;
    getSaveValidations(module: string, viewField: ViewFieldDefinition, record: Record): ValidatorFn[];
    getFilterValidations(module: string, viewField: ViewFieldDefinition, record: Record): ValidatorFn[];
    getAsyncSaveValidations(module: string, viewField: ViewFieldDefinition, record: Record): AsyncValidatorFn[];
}
export declare class ValidationManager implements ValidationManagerInterface {
    protected requiredValidator: RequiredValidator;
    protected rangeValidator: RangeValidator;
    protected currencyValidator: CurrencyValidator;
    protected dateValidator: DateValidator;
    protected datetimeValidator: DateTimeValidator;
    protected emailValidator: EmailValidator;
    protected floatValidator: FloatValidator;
    protected intValidator: IntValidator;
    protected phoneValidator: PhoneValidator;
    protected primaryEmailValidator: PrimaryEmailValidator;
    protected duplicateEmailValidator: DuplicateEmailValidator;
    protected saveValidators: OverridableMap<ValidatorInterface>;
    protected asyncSaveValidators: OverridableMap<AsyncValidatorInterface>;
    protected filterValidators: OverridableMap<ValidatorInterface>;
    protected filterFieldExclusion: StringMatrix;
    protected saveFieldExclusions: StringMatrix;
    constructor(requiredValidator: RequiredValidator, rangeValidator: RangeValidator, currencyValidator: CurrencyValidator, dateValidator: DateValidator, datetimeValidator: DateTimeValidator, emailValidator: EmailValidator, floatValidator: FloatValidator, intValidator: IntValidator, phoneValidator: PhoneValidator, primaryEmailValidator: PrimaryEmailValidator, duplicateEmailValidator: DuplicateEmailValidator);
    registerFieldSaveValidator(module: string, type: string, field: string, validator: ValidatorInterface): void;
    registerSaveValidator(module: string, type: string, validator: ValidatorInterface): void;
    registerFieldFilterValidator(module: string, type: string, field: string, validator: ValidatorInterface): void;
    registerFilterValidator(module: string, type: string, validator: ValidatorInterface): void;
    excludeFieldSaveValidator(module: string, type: string, field: string): void;
    excludeSaveValidator(module: string, type: string): void;
    excludeFieldFilterValidator(module: string, type: string, field: string): void;
    excludeFilterValidator(module: string, type: string): void;
    registerAsyncSaveValidator(module: string, type: string, validator: AsyncValidatorInterface): void;
    excludeAsyncSaveValidator(module: string, type: string): void;
    getSaveValidations(module: string, viewField: ViewFieldDefinition, record: Record): ValidatorFn[];
    getFilterValidations(module: string, viewField: ViewFieldDefinition, record: Record): ValidatorFn[];
    getAsyncSaveValidations(module: string, viewField: ViewFieldDefinition, record: Record): AsyncValidatorFn[];
    getKey(type: string, field: string): string;
    protected parseType(key: string): string;
    protected getExclusions(module: string, exclusionMap: StringMatrix): StringMap;
    protected filterValidations(entries: MapEntry<ValidatorInterface>, fieldExclusions: StringMap, record: Record, viewField: ViewFieldDefinition): ValidatorFn[];
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<ValidationManager, never>;
}

//# sourceMappingURL=validation.manager.d.ts.map