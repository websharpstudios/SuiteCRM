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
import { MenuItem } from 'common';
import * as ɵngcc0 from '@angular/core';
export declare class BaseMobileMenuComponent implements OnInit {
    current: MenuItem;
    items: MenuItem[];
    all: MenuItem[];
    onClose: Function;
    navigationType: string;
    mainItems: MenuItem[];
    submenu: MenuItem[];
    subNavigationType: string;
    backLink: boolean;
    mobileSubNav: boolean;
    mainNavLink: boolean;
    constructor();
    ngOnInit(): void;
    /**
     * Change subnavigation
     *
     * @param {object} event triggered
     * @param {object} items
     * @param navigationType
     */
    changeSubNav(event: Event, items: MenuItem[], navigationType: string): void;
    /**
     * Set link flags
     */
    navBackLink(): void;
    getItems(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<BaseMobileMenuComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<BaseMobileMenuComponent, "scrm-base-mobile-menu", never, { "navigationType": "navigationType"; "current": "current"; "items": "items"; "all": "all"; "onClose": "onClose"; }, {}, never, never>;
}

//# sourceMappingURL=base-mobile-menu.component.d.ts.map