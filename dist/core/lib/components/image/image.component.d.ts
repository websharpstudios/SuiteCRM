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
import { Observable } from 'rxjs';
import { ThemeImage, ThemeImageMap, ThemeImagesStore } from '../../store/theme-images/theme-images.store';
import * as ɵngcc0 from '@angular/core';
export declare class ImageComponent {
    protected themeImagesStore: ThemeImagesStore;
    image: string;
    klass: string;
    title: string;
    images$: Observable<ThemeImageMap>;
    vm$: Observable<{
        images: ThemeImageMap;
    }>;
    constructor(themeImagesStore: ThemeImagesStore);
    /**
     * Get image from current view model and log if not existent
     *
     * @param vm
     * @param image name
     * @returns ThemeImage
     */
    getImage(vm: {
        images: ThemeImageMap;
    }, image: string): ThemeImage;
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<ImageComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<ImageComponent, "scrm-image", never, { "klass": "klass"; "title": "title"; "image": "image"; }, {}, never, never>;
}

//# sourceMappingURL=image.component.d.ts.map