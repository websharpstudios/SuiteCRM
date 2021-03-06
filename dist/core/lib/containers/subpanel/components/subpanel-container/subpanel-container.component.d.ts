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
import { Observable } from 'rxjs';
import { SubpanelContainerConfig } from './subpanel-container.model';
import { LanguageStore, LanguageStrings } from '../../../../store/language/language.store';
import { SubpanelStore, SubpanelStoreMap } from '../../store/subpanel/subpanel.store';
import { MaxColumnsCalculator } from '../../../../services/ui/max-columns-calculator/max-columns-calculator.service';
import { GridWidgetConfig } from '../../../../components/grid-widget/grid-widget.component';
import { LocalStorageService } from "../../../../services/local-storage/local-storage.service";
import * as ɵngcc0 from '@angular/core';
export declare class SubpanelContainerComponent implements OnInit {
    protected languageStore: LanguageStore;
    protected maxColumnCalculator: MaxColumnsCalculator;
    protected localStorage: LocalStorageService;
    config: SubpanelContainerConfig;
    isCollapsed: boolean;
    toggleIcon: string;
    maxColumns$: Observable<number>;
    languages$: Observable<LanguageStrings>;
    vm$: Observable<{
        subpanels: SubpanelStoreMap;
    }>;
    private localStorageKey;
    constructor(languageStore: LanguageStore, maxColumnCalculator: MaxColumnsCalculator, localStorage: LocalStorageService);
    ngOnInit(): void;
    getMaxColumns(): Observable<number>;
    toggleSubPanels(): void;
    /**
     * Store the data in local storage
     *
     * @param {string} module to store in
     * @param {string} storageKey to store in
     * @param {object} data object to be stored
     */
    protected storageSave(module: string, storageKey: string, data: any): void;
    showSubpanel(key: string, item: SubpanelStore): void;
    getGridConfig(vm: SubpanelStore): GridWidgetConfig;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<SubpanelContainerComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<SubpanelContainerComponent, "scrm-subpanel-container", never, { "config": "config"; }, {}, never, never>;
}

//# sourceMappingURL=subpanel-container.component.d.ts.map