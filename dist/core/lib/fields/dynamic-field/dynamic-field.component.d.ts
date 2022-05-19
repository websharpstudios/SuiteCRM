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
import { OnInit, Type } from '@angular/core';
import { Field, Record, StringMap } from 'common';
import { Router } from '@angular/router';
import { ModuleNameMapper } from '../../services/navigation/module-name-mapper/module-name-mapper.service';
import { ModuleNavigation } from '../../services/navigation/module-navigation/module-navigation.service';
import * as ɵngcc0 from '@angular/core';
export declare class DynamicFieldComponent implements OnInit {
    protected navigation: ModuleNavigation;
    protected moduleNameMapper: ModuleNameMapper;
    protected router: Router;
    mode: string;
    type: string;
    field: Field;
    record: Record;
    parent: Record;
    klass: {
        [key: string]: any;
    };
    componentType: Type<any>;
    class: string;
    constructor(navigation: ModuleNavigation, moduleNameMapper: ModuleNameMapper, router: Router);
    get getRelateLink(): string;
    ngOnInit(): void;
    isLink(): boolean;
    hasOnClick(): boolean;
    isEdit(): boolean;
    getLink(): string;
    getMessageContext(item: any, record: Record): StringMap;
    getMessageLabelKey(item: any): string;
    onClick(): boolean;
    setHostClass(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<DynamicFieldComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<DynamicFieldComponent, "scrm-dynamic-field", never, { "record": "record"; "parent": "parent"; "klass": "klass"; "mode": "mode"; "type": "type"; "field": "field"; "componentType": "componentType"; }, {}, never, never>;
}

//# sourceMappingURL=dynamic-field.component.d.ts.map