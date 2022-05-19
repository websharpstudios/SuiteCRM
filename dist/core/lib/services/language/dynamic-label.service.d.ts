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
import { DataTypeFormatter } from '../formatters/data-type.formatter.service';
import { Field, FieldMap } from 'common';
import { LanguageStore } from '../../store/language/language.store';
import { StringMap } from 'common';
import * as ɵngcc0 from '@angular/core';
export declare type TemplateValueFilter = (value: string) => string;
export declare type TemplateFieldFilter = (value: Field) => string;
export interface TemplateValueFilterMap {
    [key: string]: TemplateValueFilter;
}
export interface TemplateFieldFilterMap {
    [key: string]: TemplateFieldFilter;
}
export interface DynamicLabelServiceInterface {
    addValuePipe(name: string, processor: TemplateValueFilter): void;
    addFieldPipe(name: string, processor: TemplateFieldFilter): void;
    parse(template: string, context: {
        [key: string]: string;
    }, fields: FieldMap): string;
}
export declare class DynamicLabelService implements DynamicLabelServiceInterface {
    protected typeFormatter: DataTypeFormatter;
    protected language: LanguageStore;
    protected valuePipes: TemplateValueFilterMap;
    protected fieldPipes: TemplateFieldFilterMap;
    constructor(typeFormatter: DataTypeFormatter, language: LanguageStore);
    addValuePipe(name: string, processor: TemplateValueFilter): void;
    addFieldPipe(name: string, processor: TemplateFieldFilter): void;
    parse(template: string, context: StringMap, fields: FieldMap): string;
    protected valueTypeFormat(type: string, value: string): string;
    protected fieldTypeFormat(type: string, field: Field): string;
    protected enumFormat(field: Field): string;
    protected multiEnumFormat(field: Field): string;
    protected getFieldLabel(labelKey: string, module?: string): string;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<DynamicLabelService, never>;
}

//# sourceMappingURL=dynamic-label.service.d.ts.map