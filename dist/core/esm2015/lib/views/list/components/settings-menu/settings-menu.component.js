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
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListViewStore } from '../../store/list-view/list-view.store';
import { SystemConfigStore } from '../../../../store/system-config/system-config.store';
import { ScreenSize, ScreenSizeObserverService } from '../../../../services/ui/screen-size-observer/screen-size-observer.service';
export class SettingsMenuComponent {
    constructor(listStore, modalService, screenSize, systemConfigStore) {
        this.listStore = listStore;
        this.modalService = modalService;
        this.screenSize = screenSize;
        this.systemConfigStore = systemConfigStore;
        this.configState = new BehaviorSubject({ buttons: [] });
        this.config$ = this.configState.asObservable();
        this.vm$ = combineLatest([
            this.listStore.widgets$,
            this.listStore.displayFilters$,
            this.listStore.criteria$,
            this.screenSize.screenSize$,
            this.listStore.showSidebarWidgets$,
            this.listStore.filterList.records$
        ]).pipe(map(([widgets, displayFilters, criteria, screenSize, showSidebarWidgets, savedFilters]) => {
            if (screenSize) {
                this.screen = screenSize;
            }
            this.configState.next(this.getButtonGroupConfig());
            return { widgets, displayFilters, criteria, screenSize, showSidebarWidgets, savedFilters };
        }));
        this.screen = ScreenSize.Medium;
        this.defaultBreakpoint = 5;
    }
    ngOnInit() {
        this.configState.next(this.getButtonGroupConfig());
    }
    getButtonGroupConfig() {
        const availableButtons = [
            // Commented temporarily as it is not implemented
            /*
            {button: this.getDisplayAsButton()},
             */
            {
                show: () => this.listStore.filterList.getFilters() && this.listStore.filterList.getFilters().length >= 1,
                button: this.getMyFiltersButton(),
            },
            { button: this.getFilterButton() },
            {
                show: () => !Object.keys(this.getFilters()).every(key => this.getFilters()[key].operator === ''),
                button: this.getClearButton(),
            },
            { button: this.getColumnChooserButton() },
            {
                show: () => this.listStore.widgets,
                button: this.getChartsButton(),
            },
        ];
        const config = {
            buttonKlass: ['settings-button'],
            dropdownLabel: this.listStore.appStrings.LBL_OPTIONS || '',
            breakpoint: this.getBreakpoint(),
            dropdownOptions: {
                placement: ['bottom-right'],
                wrapperKlass: ['dropdown-button-secondary']
            },
            buttons: []
        };
        availableButtons.forEach(availableButton => {
            if (!availableButton.show) {
                config.buttons.push(availableButton.button);
                return;
            }
            if (availableButton.show()) {
                config.buttons.push(availableButton.button);
            }
        });
        return config;
    }
    getFilters() {
        return this.listStore.recordList.criteria.filters;
    }
    getBreakpoint() {
        const breakpointMap = this.systemConfigStore.getConfigValue('listview_settings_limits');
        if (this.screen && breakpointMap && breakpointMap[this.screen]) {
            this.breakpoint = breakpointMap[this.screen];
            return this.breakpoint;
        }
        if (this.breakpoint) {
            return this.breakpoint;
        }
        return this.defaultBreakpoint;
    }
    getFilterButton() {
        return {
            label: this.listStore.appStrings.LBL_FILTER || '',
            klass: {
                'filter-settings-button': true,
                active: this.listStore.showFilters
            },
            icon: 'filter',
            onClick: () => {
                this.listStore.showFilters = !this.listStore.showFilters;
            }
        };
    }
    getMyFiltersButton() {
        const filters = this.listStore.filterList.getFilters();
        const dropdownConfig = {
            label: this.listStore.appStrings.LBL_SAVED_FILTER_SHORTCUT || '',
            klass: ['dropdown-toggle'],
            wrapperKlass: ['filter-action-group'],
            items: []
        };
        const activeFilters = this.listStore.activeFilters;
        filters.forEach((filter) => {
            const isActive = Object.keys(activeFilters).some(key => key === filter.key);
            const button = {
                label: filter.attributes.name,
                onClick: () => {
                    this.listStore.showFilters = false;
                    if (isActive) {
                        this.listStore.resetFilters();
                    }
                    else {
                        this.listStore.setOpenFilter(filter);
                        const selectedFilters = {};
                        selectedFilters[filter.key] = filter;
                        this.listStore.setFilters(selectedFilters);
                    }
                }
            };
            if (isActive) {
                button.icon = 'filter';
                button.iconKlass = 'small';
                button.klass = ['active'];
            }
            dropdownConfig.items.push(button);
        });
        return dropdownConfig;
    }
    getClearButton() {
        return {
            label: this.listStore.appStrings.LBL_CLEAR_BUTTON_LABEL || '',
            icon: 'filter',
            onClick: () => {
                this.listStore.showFilters = false;
                this.listStore.resetFilters();
            }
        };
    }
    getChartsButton() {
        return {
            label: this.listStore.appStrings.LBL_INSIGHTS || '',
            klass: {
                active: this.listStore.showSidebarWidgets
            },
            icon: 'pie',
            onClick: () => {
                this.listStore.showSidebarWidgets = !this.listStore.showSidebarWidgets;
            }
        };
    }
    getDisplayAsButton() {
        return {
            label: 'Display As',
            klass: {},
            items: []
        };
    }
    getColumnChooserButton() {
        return {
            label: this.listStore.appStrings.LBL_COLUMNS || '',
            klass: {
                'column-chooser-button': true,
            },
            icon: 'column_chooser',
            onClick: () => {
                this.listStore.openColumnChooserDialog();
            }
        };
    }
}
SettingsMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'scrm-settings-menu',
                template: "<! --\n/**\n* SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.\n* Copyright (C) 2021 SalesAgility Ltd.\n*\n* This program is free software; you can redistribute it and/or modify it under\n* the terms of the GNU Affero General Public License version 3 as published by the\n* Free Software Foundation with the addition of the following permission added\n* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\n* IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE\n* WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\n*\n* This program is distributed in the hope that it will be useful, but WITHOUT\n* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\n* FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more\n* details.\n*\n* You should have received a copy of the GNU Affero General Public License\n* along with this program.  If not, see http://www.gnu.org/licenses.\n*\n* In accordance with Section 7(b) of the GNU Affero General Public License\n* version 3, these Appropriate Legal Notices must retain the display of the\n* \"Supercharged by SuiteCRM\" logo. If the display of the logos is not reasonably\n* feasible for technical reasons, the Appropriate Legal Notices must display\n* the words \"Supercharged by SuiteCRM\".\n*/\n-->\n<div class=\"list-view-settings float-right\" *ngIf=\"(vm$ | async) as vm\">\n    <scrm-button-group *ngIf=\"config$\" [config$]=\"config$\"></scrm-button-group>\n</div>\n"
            },] }
];
SettingsMenuComponent.ctorParameters = () => [
    { type: ListViewStore },
    { type: NgbModal },
    { type: ScreenSizeObserverService },
    { type: SystemConfigStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MtbWVudS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvdmlld3MvbGlzdC9jb21wb25lbnRzL3NldHRpbmdzLW1lbnUvc2V0dGluZ3MtbWVudS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQVMsTUFBTSxlQUFlLENBQUM7QUFFaEQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQ3BELE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3BELE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuQyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDcEUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0scURBQXFELENBQUM7QUFDdEYsT0FBTyxFQUNILFVBQVUsRUFDVix5QkFBeUIsRUFDNUIsTUFBTSwyRUFBMkUsQ0FBQztBQVFuRixNQUFNLE9BQU8scUJBQXFCO0lBbUM5QixZQUNjLFNBQXdCLEVBQ3hCLFlBQXNCLEVBQ3RCLFVBQXFDLEVBQ3JDLGlCQUFvQztRQUhwQyxjQUFTLEdBQVQsU0FBUyxDQUFlO1FBQ3hCLGlCQUFZLEdBQVosWUFBWSxDQUFVO1FBQ3RCLGVBQVUsR0FBVixVQUFVLENBQTJCO1FBQ3JDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFyQ2xELGdCQUFXLEdBQUcsSUFBSSxlQUFlLENBQXVCLEVBQUMsT0FBTyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFDdkUsWUFBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFMUMsUUFBRyxHQUFHLGFBQWEsQ0FB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VCxLQUFLLEVBQUUsRUFBRTtTQUNaLENBQUM7SUFDTixDQUFDO0lBRUQsc0JBQXNCO1FBRWxCLE9BQU87WUFDSCxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsV0FBVyxJQUFJLEVBQUU7WUFDbEQsS0FBSyxFQUFFO2dCQUNILHVCQUF1QixFQUFFLElBQUk7YUFDaEM7WUFDRCxJQUFJLEVBQUUsZ0JBQWdCO1lBQ3RCLE9BQU8sRUFBRSxHQUFTLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUM3QyxDQUFDO1NBQ0osQ0FBQztJQUNOLENBQUM7OztZQXJPSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsd2hEQUEyQzthQUU5Qzs7O1lBWk8sYUFBYTtZQUhiLFFBQVE7WUFPWix5QkFBeUI7WUFIckIsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QnV0dG9uR3JvdXBJbnRlcmZhY2UsIEJ1dHRvbkludGVyZmFjZSwgRHJvcGRvd25CdXR0b25JbnRlcmZhY2UsIFNlYXJjaENyaXRlcmlhRmlsdGVyfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtOZ2JNb2RhbH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TGlzdFZpZXdTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvbGlzdC12aWV3L2xpc3Qtdmlldy5zdG9yZSc7XG5pbXBvcnQge1N5c3RlbUNvbmZpZ1N0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi9zdG9yZS9zeXN0ZW0tY29uZmlnL3N5c3RlbS1jb25maWcuc3RvcmUnO1xuaW1wb3J0IHtcbiAgICBTY3JlZW5TaXplLFxuICAgIFNjcmVlblNpemVPYnNlcnZlclNlcnZpY2Vcbn0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZXMvdWkvc2NyZWVuLXNpemUtb2JzZXJ2ZXIvc2NyZWVuLXNpemUtb2JzZXJ2ZXIuc2VydmljZSc7XG5pbXBvcnQge1NhdmVkRmlsdGVyLCBTYXZlZEZpbHRlck1hcH0gZnJvbSAnLi4vLi4vLi4vLi4vc3RvcmUvc2F2ZWQtZmlsdGVycy9zYXZlZC1maWx0ZXIubW9kZWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Njcm0tc2V0dGluZ3MtbWVudScsXG4gICAgdGVtcGxhdGVVcmw6ICdzZXR0aW5ncy1tZW51LmNvbXBvbmVudC5odG1sJyxcblxufSlcbmV4cG9ydCBjbGFzcyBTZXR0aW5nc01lbnVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgY29uZmlnU3RhdGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEJ1dHRvbkdyb3VwSW50ZXJmYWNlPih7YnV0dG9uczogW119KTtcbiAgICBjb25maWckID0gdGhpcy5jb25maWdTdGF0ZS5hc09ic2VydmFibGUoKTtcblxuICAgIHZtJCA9IGNvbWJpbmVMYXRlc3QoW1xuICAgICAgICB0aGlzLmxpc3RTdG9yZS53aWRnZXRzJCxcbiAgICAgICAgdGhpcy5saXN0U3RvcmUuZGlzcGxheUZpbHRlcnMkLFxuICAgICAgICB0aGlzLmxpc3RTdG9yZS5jcml0ZXJpYSQsXG4gICAgICAgIHRoaXMuc2NyZWVuU2l6ZS5zY3JlZW5TaXplJCxcbiAgICAgICAgdGhpcy5saXN0U3RvcmUuc2hvd1NpZGViYXJXaWRnZXRzJCxcbiAgICAgICAgdGhpcy5saXN0U3RvcmUuZmlsdGVyTGlzdC5yZWNvcmRzJFxuICAgIF0pLnBpcGUoXG4gICAgICAgIG1hcCgoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgd2lkZ2V0cyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5RmlsdGVycyxcbiAgICAgICAgICAgICAgICBjcml0ZXJpYSxcbiAgICAgICAgICAgICAgICBzY3JlZW5TaXplLFxuICAgICAgICAgICAgICAgIHNob3dTaWRlYmFyV2lkZ2V0cyxcbiAgICAgICAgICAgICAgICBzYXZlZEZpbHRlcnNcbiAgICAgICAgICAgIF1cbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICBpZiAoc2NyZWVuU2l6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NyZWVuID0gc2NyZWVuU2l6ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29uZmlnU3RhdGUubmV4dCh0aGlzLmdldEJ1dHRvbkdyb3VwQ29uZmlnKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHt3aWRnZXRzLCBkaXNwbGF5RmlsdGVycywgY3JpdGVyaWEsIHNjcmVlblNpemUsIHNob3dTaWRlYmFyV2lkZ2V0cywgc2F2ZWRGaWx0ZXJzfTtcbiAgICAgICAgfSlcbiAgICApO1xuXG4gICAgcHJvdGVjdGVkIHNjcmVlbjogU2NyZWVuU2l6ZSA9IFNjcmVlblNpemUuTWVkaXVtO1xuICAgIHByb3RlY3RlZCBkZWZhdWx0QnJlYWtwb2ludCA9IDU7XG4gICAgcHJvdGVjdGVkIGJyZWFrcG9pbnQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgbGlzdFN0b3JlOiBMaXN0Vmlld1N0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgbW9kYWxTZXJ2aWNlOiBOZ2JNb2RhbCxcbiAgICAgICAgcHJvdGVjdGVkIHNjcmVlblNpemU6IFNjcmVlblNpemVPYnNlcnZlclNlcnZpY2UsXG4gICAgICAgIHByb3RlY3RlZCBzeXN0ZW1Db25maWdTdG9yZTogU3lzdGVtQ29uZmlnU3RvcmVcbiAgICApIHtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb25maWdTdGF0ZS5uZXh0KHRoaXMuZ2V0QnV0dG9uR3JvdXBDb25maWcoKSk7XG4gICAgfVxuXG4gICAgZ2V0QnV0dG9uR3JvdXBDb25maWcoKTogQnV0dG9uR3JvdXBJbnRlcmZhY2Uge1xuXG4gICAgICAgIGNvbnN0IGF2YWlsYWJsZUJ1dHRvbnMgPSBbXG4gICAgICAgICAgICAvLyBDb21tZW50ZWQgdGVtcG9yYXJpbHkgYXMgaXQgaXMgbm90IGltcGxlbWVudGVkXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAge2J1dHRvbjogdGhpcy5nZXREaXNwbGF5QXNCdXR0b24oKX0sXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzaG93OiAoKTogYm9vbGVhbiA9PiB0aGlzLmxpc3RTdG9yZS5maWx0ZXJMaXN0LmdldEZpbHRlcnMoKSAmJiB0aGlzLmxpc3RTdG9yZS5maWx0ZXJMaXN0LmdldEZpbHRlcnMoKS5sZW5ndGggPj0gMSxcbiAgICAgICAgICAgICAgICBidXR0b246IHRoaXMuZ2V0TXlGaWx0ZXJzQnV0dG9uKCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge2J1dHRvbjogdGhpcy5nZXRGaWx0ZXJCdXR0b24oKX0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2hvdzogKCk6IGJvb2xlYW4gPT4gIU9iamVjdC5rZXlzKHRoaXMuZ2V0RmlsdGVycygpKS5ldmVyeShrZXkgPT4gdGhpcy5nZXRGaWx0ZXJzKClba2V5XS5vcGVyYXRvciA9PT0gJycpLFxuICAgICAgICAgICAgICAgIGJ1dHRvbjogdGhpcy5nZXRDbGVhckJ1dHRvbigpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtidXR0b246IHRoaXMuZ2V0Q29sdW1uQ2hvb3NlckJ1dHRvbigpfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzaG93OiAoKTogYm9vbGVhbiA9PiB0aGlzLmxpc3RTdG9yZS53aWRnZXRzLFxuICAgICAgICAgICAgICAgIGJ1dHRvbjogdGhpcy5nZXRDaGFydHNCdXR0b24oKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF07XG5cbiAgICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICAgICAgYnV0dG9uS2xhc3M6IFsnc2V0dGluZ3MtYnV0dG9uJ10sXG4gICAgICAgICAgICBkcm9wZG93bkxhYmVsOiB0aGlzLmxpc3RTdG9yZS5hcHBTdHJpbmdzLkxCTF9PUFRJT05TIHx8ICcnLFxuICAgICAgICAgICAgYnJlYWtwb2ludDogdGhpcy5nZXRCcmVha3BvaW50KCksXG4gICAgICAgICAgICBkcm9wZG93bk9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6IFsnYm90dG9tLXJpZ2h0J10sXG4gICAgICAgICAgICAgICAgd3JhcHBlcktsYXNzOiBbJ2Ryb3Bkb3duLWJ1dHRvbi1zZWNvbmRhcnknXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJ1dHRvbnM6IFtdXG4gICAgICAgIH0gYXMgQnV0dG9uR3JvdXBJbnRlcmZhY2U7XG5cbiAgICAgICAgYXZhaWxhYmxlQnV0dG9ucy5mb3JFYWNoKGF2YWlsYWJsZUJ1dHRvbiA9PiB7XG4gICAgICAgICAgICBpZiAoIWF2YWlsYWJsZUJ1dHRvbi5zaG93KSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLmJ1dHRvbnMucHVzaChhdmFpbGFibGVCdXR0b24uYnV0dG9uKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhdmFpbGFibGVCdXR0b24uc2hvdygpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLmJ1dHRvbnMucHVzaChhdmFpbGFibGVCdXR0b24uYnV0dG9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9XG5cbiAgICBnZXRGaWx0ZXJzKCk6IFNlYXJjaENyaXRlcmlhRmlsdGVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdFN0b3JlLnJlY29yZExpc3QuY3JpdGVyaWEuZmlsdGVycztcbiAgICB9XG5cbiAgICBnZXRCcmVha3BvaW50KCk6IG51bWJlciB7XG5cbiAgICAgICAgY29uc3QgYnJlYWtwb2ludE1hcCA9IHRoaXMuc3lzdGVtQ29uZmlnU3RvcmUuZ2V0Q29uZmlnVmFsdWUoJ2xpc3R2aWV3X3NldHRpbmdzX2xpbWl0cycpO1xuXG4gICAgICAgIGlmICh0aGlzLnNjcmVlbiAmJiBicmVha3BvaW50TWFwICYmIGJyZWFrcG9pbnRNYXBbdGhpcy5zY3JlZW5dKSB7XG4gICAgICAgICAgICB0aGlzLmJyZWFrcG9pbnQgPSBicmVha3BvaW50TWFwW3RoaXMuc2NyZWVuXTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJyZWFrcG9pbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5icmVha3BvaW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5icmVha3BvaW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZGVmYXVsdEJyZWFrcG9pbnQ7XG4gICAgfVxuXG5cbiAgICBnZXRGaWx0ZXJCdXR0b24oKTogRHJvcGRvd25CdXR0b25JbnRlcmZhY2Uge1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsYWJlbDogdGhpcy5saXN0U3RvcmUuYXBwU3RyaW5ncy5MQkxfRklMVEVSIHx8ICcnLFxuICAgICAgICAgICAga2xhc3M6IHtcbiAgICAgICAgICAgICAgICAnZmlsdGVyLXNldHRpbmdzLWJ1dHRvbic6IHRydWUsXG4gICAgICAgICAgICAgICAgYWN0aXZlOiB0aGlzLmxpc3RTdG9yZS5zaG93RmlsdGVyc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGljb246ICdmaWx0ZXInLFxuICAgICAgICAgICAgb25DbGljazogKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFN0b3JlLnNob3dGaWx0ZXJzID0gIXRoaXMubGlzdFN0b3JlLnNob3dGaWx0ZXJzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGFzIEJ1dHRvbkludGVyZmFjZTtcbiAgICB9XG5cbiAgICBnZXRNeUZpbHRlcnNCdXR0b24oKTogRHJvcGRvd25CdXR0b25JbnRlcmZhY2Uge1xuICAgICAgICBjb25zdCBmaWx0ZXJzID0gdGhpcy5saXN0U3RvcmUuZmlsdGVyTGlzdC5nZXRGaWx0ZXJzKCk7XG5cbiAgICAgICAgY29uc3QgZHJvcGRvd25Db25maWcgPSB7XG4gICAgICAgICAgICBsYWJlbDogdGhpcy5saXN0U3RvcmUuYXBwU3RyaW5ncy5MQkxfU0FWRURfRklMVEVSX1NIT1JUQ1VUIHx8ICcnLFxuICAgICAgICAgICAga2xhc3M6IFsnZHJvcGRvd24tdG9nZ2xlJ10sXG4gICAgICAgICAgICB3cmFwcGVyS2xhc3M6IFsnZmlsdGVyLWFjdGlvbi1ncm91cCddLFxuICAgICAgICAgICAgaXRlbXM6IFtdXG4gICAgICAgIH0gYXMgRHJvcGRvd25CdXR0b25JbnRlcmZhY2U7XG5cbiAgICAgICAgY29uc3QgYWN0aXZlRmlsdGVycyA9IHRoaXMubGlzdFN0b3JlLmFjdGl2ZUZpbHRlcnM7XG5cbiAgICAgICAgZmlsdGVycy5mb3JFYWNoKChmaWx0ZXI6IFNhdmVkRmlsdGVyKSA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IGlzQWN0aXZlID0gT2JqZWN0LmtleXMoYWN0aXZlRmlsdGVycykuc29tZShrZXkgPT4ga2V5ID09PSBmaWx0ZXIua2V5KTtcblxuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0ge1xuICAgICAgICAgICAgICAgIGxhYmVsOiBmaWx0ZXIuYXR0cmlidXRlcy5uYW1lLFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0U3RvcmUuc2hvd0ZpbHRlcnMgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdFN0b3JlLnJlc2V0RmlsdGVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RTdG9yZS5zZXRPcGVuRmlsdGVyKGZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZEZpbHRlcnMgPSB7fSBhcyBTYXZlZEZpbHRlck1hcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRmlsdGVyc1tmaWx0ZXIua2V5XSA9IGZpbHRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdFN0b3JlLnNldEZpbHRlcnMoc2VsZWN0ZWRGaWx0ZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBhcyBCdXR0b25JbnRlcmZhY2U7XG5cblxuICAgICAgICAgICAgaWYgKGlzQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmljb24gPSAnZmlsdGVyJztcbiAgICAgICAgICAgICAgICBidXR0b24uaWNvbktsYXNzID0gJ3NtYWxsJztcbiAgICAgICAgICAgICAgICBidXR0b24ua2xhc3MgPSBbJ2FjdGl2ZSddO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkcm9wZG93bkNvbmZpZy5pdGVtcy5wdXNoKGJ1dHRvbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkcm9wZG93bkNvbmZpZztcbiAgICB9XG5cbiAgICBnZXRDbGVhckJ1dHRvbigpOiBCdXR0b25JbnRlcmZhY2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGFiZWw6IHRoaXMubGlzdFN0b3JlLmFwcFN0cmluZ3MuTEJMX0NMRUFSX0JVVFRPTl9MQUJFTCB8fCAnJyxcbiAgICAgICAgICAgIGljb246ICdmaWx0ZXInLFxuICAgICAgICAgICAgb25DbGljazogKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFN0b3JlLnNob3dGaWx0ZXJzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0U3RvcmUucmVzZXRGaWx0ZXJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0Q2hhcnRzQnV0dG9uKCk6IEJ1dHRvbkludGVyZmFjZSB7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxhYmVsOiB0aGlzLmxpc3RTdG9yZS5hcHBTdHJpbmdzLkxCTF9JTlNJR0hUUyB8fCAnJyxcbiAgICAgICAgICAgIGtsYXNzOiB7XG4gICAgICAgICAgICAgICAgYWN0aXZlOiB0aGlzLmxpc3RTdG9yZS5zaG93U2lkZWJhcldpZGdldHNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpY29uOiAncGllJyxcbiAgICAgICAgICAgIG9uQ2xpY2s6ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RTdG9yZS5zaG93U2lkZWJhcldpZGdldHMgPSAhdGhpcy5saXN0U3RvcmUuc2hvd1NpZGViYXJXaWRnZXRzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldERpc3BsYXlBc0J1dHRvbigpOiBEcm9wZG93bkJ1dHRvbkludGVyZmFjZSB7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxhYmVsOiAnRGlzcGxheSBBcycsXG4gICAgICAgICAgICBrbGFzczoge30sXG4gICAgICAgICAgICBpdGVtczogW11cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRDb2x1bW5DaG9vc2VyQnV0dG9uKCk6IEJ1dHRvbkludGVyZmFjZSB7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxhYmVsOiB0aGlzLmxpc3RTdG9yZS5hcHBTdHJpbmdzLkxCTF9DT0xVTU5TIHx8ICcnLFxuICAgICAgICAgICAga2xhc3M6IHtcbiAgICAgICAgICAgICAgICAnY29sdW1uLWNob29zZXItYnV0dG9uJzogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpY29uOiAnY29sdW1uX2Nob29zZXInLFxuICAgICAgICAgICAgb25DbGljazogKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFN0b3JlLm9wZW5Db2x1bW5DaG9vc2VyRGlhbG9nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIl19