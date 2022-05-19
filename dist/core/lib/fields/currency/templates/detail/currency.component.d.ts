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
import { BaseNumberComponent } from '../../../base/base-number.component';
import { SystemConfigStore } from '../../../../store/system-config/system-config.store';
import { DataTypeFormatter } from '../../../../services/formatters/data-type.formatter.service';
import { UserPreferenceStore } from '../../../../store/user-preference/user-preference.store';
import { FormatOptions } from '../../../../services/formatters/formatter.model';
import { FieldLogicManager } from '../../../field-logic/field-logic.manager';
import { CurrencyService } from '../../../../services/currency/currency.service';
import * as ɵngcc0 from '@angular/core';
export declare class CurrencyDetailFieldComponent extends BaseNumberComponent {
    protected userPreferences: UserPreferenceStore;
    protected systemConfig: SystemConfigStore;
    protected typeFormatter: DataTypeFormatter;
    protected logic: FieldLogicManager;
    protected currencyService: CurrencyService;
    constructor(userPreferences: UserPreferenceStore, systemConfig: SystemConfigStore, typeFormatter: DataTypeFormatter, logic: FieldLogicManager, currencyService: CurrencyService);
    getOptions(): FormatOptions;
    getCurrencyValue(): string;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<CurrencyDetailFieldComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<CurrencyDetailFieldComponent, "scrm-currency-detail", never, {}, {}, never, never>;
}

//# sourceMappingURL=currency.component.d.ts.map