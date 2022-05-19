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
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ModuleNameMapper } from '../../services/navigation/module-name-mapper/module-name-mapper.service';
import { BaseFieldComponent } from './base-field.component';
import { DataTypeFormatter } from '../../services/formatters/data-type.formatter.service';
import { LanguageStore } from '../../store/language/language.store';
import { RelateService } from '../../services/record/relate/relate.service';
import { FieldLogicManager } from '../field-logic/field-logic.manager';
export class BaseRelateComponent extends BaseFieldComponent {
    constructor(languages, typeFormatter, relateService, moduleNameMapper, logic) {
        super(typeFormatter, logic);
        this.languages = languages;
        this.typeFormatter = typeFormatter;
        this.relateService = relateService;
        this.moduleNameMapper = moduleNameMapper;
        this.logic = logic;
        this.selectedValues = [];
        this.status = '';
        this.initModule = '';
        this.search = (text) => {
            this.status = 'searching';
            return this.relateService.search(text, this.getRelateFieldName()).pipe(tap(() => this.status = 'found'), catchError(() => {
                this.status = 'error';
                return of([]);
            }), map(records => {
                if (!records || records.length < 1) {
                    this.status = 'not-found';
                    return [];
                }
                const flatRecords = [];
                records.forEach((record) => {
                    if (record && record.attributes) {
                        flatRecords.push(record.attributes);
                    }
                });
                this.status = '';
                return flatRecords;
            }));
        };
    }
    get module() {
        if (!this.record || !this.record.module) {
            return null;
        }
        return this.record.module;
    }
    ngOnInit() {
        super.ngOnInit();
        this.init();
        this.subs.push(this.field.valueChanges$.subscribe(() => {
            this.onModuleChange();
        }));
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    onModuleChange() {
        var _a, _b, _c;
        const currentModule = this.initModule;
        const newModule = (_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.field) === null || _a === void 0 ? void 0 : _a.definition) === null || _b === void 0 ? void 0 : _b.module) !== null && _c !== void 0 ? _c : '';
        if (currentModule === newModule) {
            return;
        }
        this.initModule = newModule;
        if (currentModule === '' && currentModule !== newModule) {
            this.init();
        }
        if (newModule === '') {
            this.status = 'no-module';
        }
        else {
            this.status = '';
        }
    }
    getRelateFieldName() {
        return (this.field && this.field.definition && this.field.definition.rname) || 'name';
    }
    getRelateIdField() {
        return (this.field && this.field.definition && this.field.definition.id_name) || '';
    }
    getRelatedModule() {
        const legacyName = (this.field && this.field.definition && this.field.definition.module) || '';
        if (!legacyName) {
            return '';
        }
        return this.moduleNameMapper.toFrontend(legacyName);
    }
    getMessage() {
        const messages = {
            searching: 'LBL_SEARCHING',
            'not-found': 'LBL_NOT_FOUND',
            error: 'LBL_SEARCH_ERROR',
            found: 'LBL_FOUND',
            'no-module': 'LBL_NO_MODULE_SELECTED'
        };
        if (messages[this.status]) {
            return messages[this.status];
        }
        return '';
    }
    getInvalidClass() {
        if (this.field.formControl && this.field.formControl.invalid && this.field.formControl.touched) {
            return 'is-invalid';
        }
        if (this.hasSearchError()) {
            return 'is-invalid';
        }
        return '';
    }
    hasSearchError() {
        return this.status === 'error' || this.status === 'not-found';
    }
    resetStatus() {
        this.status = '';
    }
    getPlaceholderLabel() {
        return this.languages.getAppString('LBL_TYPE_TO_SEARCH') || '';
    }
    init() {
        var _a, _b, _c;
        this.initModule = (_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.field) === null || _a === void 0 ? void 0 : _a.definition) === null || _b === void 0 ? void 0 : _b.module) !== null && _c !== void 0 ? _c : '';
        if (this.relateService) {
            this.relateService.init(this.getRelatedModule());
        }
    }
    buildRelate(id, relateValue) {
        const relate = { id };
        if (this.getRelateFieldName()) {
            relate[this.getRelateFieldName()] = relateValue;
        }
        return relate;
    }
}
BaseRelateComponent.decorators = [
    { type: Component, args: [{ template: '' },] }
];
BaseRelateComponent.ctorParameters = () => [
    { type: LanguageStore },
    { type: DataTypeFormatter },
    { type: RelateService },
    { type: ModuleNameMapper },
    { type: FieldLogicManager }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1yZWxhdGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vY29yZS9hcHAvY29yZS9zcmMvbGliL2ZpZWxkcy9iYXNlL2Jhc2UtcmVsYXRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBb0IsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFhLEVBQUUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx5RUFBeUUsQ0FBQztBQUN6RyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx1REFBdUQsQ0FBQztBQUN4RixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDbEUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDZDQUE2QyxDQUFDO0FBQzFFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBR3JFLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxrQkFBa0I7SUFNdkQsWUFDYyxTQUF3QixFQUN4QixhQUFnQyxFQUNoQyxhQUE0QixFQUM1QixnQkFBa0MsRUFDbEMsS0FBd0I7UUFFbEMsS0FBSyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQU5sQixjQUFTLEdBQVQsU0FBUyxDQUFlO1FBQ3hCLGtCQUFhLEdBQWIsYUFBYSxDQUFtQjtRQUNoQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLFVBQUssR0FBTCxLQUFLLENB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UyxTQUFDLEVBQUMsUUFBUSxFQUFFLEVBQUUsRUFBQzs7O1lBSmpCLGFBQWE7WUFEYixpQkFBaUI7WUFFakIsYUFBYTtZQUpiLGdCQUFnQjtZQUtoQixpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBPbkRlc3Ryb3ksIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIG9mfSBmcm9tICdyeGpzJztcbmltcG9ydCB7Y2F0Y2hFcnJvciwgbWFwLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7QXR0cmlidXRlTWFwLCBSZWNvcmR9IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge01vZHVsZU5hbWVNYXBwZXJ9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24vbW9kdWxlLW5hbWUtbWFwcGVyL21vZHVsZS1uYW1lLW1hcHBlci5zZXJ2aWNlJztcbmltcG9ydCB7QmFzZUZpZWxkQ29tcG9uZW50fSBmcm9tICcuL2Jhc2UtZmllbGQuY29tcG9uZW50JztcbmltcG9ydCB7RGF0YVR5cGVGb3JtYXR0ZXJ9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Zvcm1hdHRlcnMvZGF0YS10eXBlLmZvcm1hdHRlci5zZXJ2aWNlJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZX0gZnJvbSAnLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtSZWxhdGVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZWNvcmQvcmVsYXRlL3JlbGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7RmllbGRMb2dpY01hbmFnZXJ9IGZyb20gJy4uL2ZpZWxkLWxvZ2ljL2ZpZWxkLWxvZ2ljLm1hbmFnZXInO1xuXG5AQ29tcG9uZW50KHt0ZW1wbGF0ZTogJyd9KVxuZXhwb3J0IGNsYXNzIEJhc2VSZWxhdGVDb21wb25lbnQgZXh0ZW5kcyBCYXNlRmllbGRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgc2VsZWN0ZWRWYWx1ZXM6IEF0dHJpYnV0ZU1hcFtdID0gW107XG5cbiAgICBzdGF0dXM6ICcnIHwgJ3NlYXJjaGluZycgfCAnbm90LWZvdW5kJyB8ICdlcnJvcicgfCAnZm91bmQnIHwgJ25vLW1vZHVsZScgPSAnJztcbiAgICBpbml0TW9kdWxlID0gJyc7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlczogTGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIHR5cGVGb3JtYXR0ZXI6IERhdGFUeXBlRm9ybWF0dGVyLFxuICAgICAgICBwcm90ZWN0ZWQgcmVsYXRlU2VydmljZTogUmVsYXRlU2VydmljZSxcbiAgICAgICAgcHJvdGVjdGVkIG1vZHVsZU5hbWVNYXBwZXI6IE1vZHVsZU5hbWVNYXBwZXIsXG4gICAgICAgIHByb3RlY3RlZCBsb2dpYzogRmllbGRMb2dpY01hbmFnZXJcbiAgICApIHtcbiAgICAgICAgc3VwZXIodHlwZUZvcm1hdHRlciwgbG9naWMpO1xuICAgIH1cblxuICAgIGdldCBtb2R1bGUoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlY29yZCB8fCAhdGhpcy5yZWNvcmQubW9kdWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlY29yZC5tb2R1bGU7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG5cbiAgICAgICAgc3VwZXIubmdPbkluaXQoKTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgICAgICB0aGlzLnN1YnMucHVzaCh0aGlzLmZpZWxkLnZhbHVlQ2hhbmdlcyQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Nb2R1bGVDaGFuZ2UoKTtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3Vicy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgfVxuXG4gICAgb25Nb2R1bGVDaGFuZ2UoKTogdm9pZCB7XG5cbiAgICAgICAgY29uc3QgY3VycmVudE1vZHVsZSA9IHRoaXMuaW5pdE1vZHVsZTtcbiAgICAgICAgY29uc3QgbmV3TW9kdWxlID0gdGhpcz8uZmllbGQ/LmRlZmluaXRpb24/Lm1vZHVsZSA/PyAnJztcblxuICAgICAgICBpZiAoY3VycmVudE1vZHVsZSA9PT0gbmV3TW9kdWxlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluaXRNb2R1bGUgPSBuZXdNb2R1bGU7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRNb2R1bGUgPT09ICcnICYmIGN1cnJlbnRNb2R1bGUgIT09IG5ld01vZHVsZSkge1xuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3TW9kdWxlID09PSAnJykge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAnbm8tbW9kdWxlJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWFyY2ggPSAodGV4dDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+ID0+IHtcblxuICAgICAgICB0aGlzLnN0YXR1cyA9ICdzZWFyY2hpbmcnO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJlbGF0ZVNlcnZpY2Uuc2VhcmNoKHRleHQsIHRoaXMuZ2V0UmVsYXRlRmllbGROYW1lKCkpLnBpcGUoXG4gICAgICAgICAgICB0YXAoKCkgPT4gdGhpcy5zdGF0dXMgPSAnZm91bmQnKSxcbiAgICAgICAgICAgIGNhdGNoRXJyb3IoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ2Vycm9yJztcbiAgICAgICAgICAgICAgICByZXR1cm4gb2YoW10pO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBtYXAocmVjb3JkcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFyZWNvcmRzIHx8IHJlY29yZHMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdub3QtZm91bmQnO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgZmxhdFJlY29yZHM6IEF0dHJpYnV0ZU1hcFtdID0gW107XG5cbiAgICAgICAgICAgICAgICByZWNvcmRzLmZvckVhY2goKHJlY29yZDogUmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWNvcmQgJiYgcmVjb3JkLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYXRSZWNvcmRzLnB1c2gocmVjb3JkLmF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICcnO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZsYXRSZWNvcmRzO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIGdldFJlbGF0ZUZpZWxkTmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gKHRoaXMuZmllbGQgJiYgdGhpcy5maWVsZC5kZWZpbml0aW9uICYmIHRoaXMuZmllbGQuZGVmaW5pdGlvbi5ybmFtZSkgfHwgJ25hbWUnO1xuICAgIH1cblxuICAgIGdldFJlbGF0ZUlkRmllbGQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmZpZWxkICYmIHRoaXMuZmllbGQuZGVmaW5pdGlvbiAmJiB0aGlzLmZpZWxkLmRlZmluaXRpb24uaWRfbmFtZSkgfHwgJyc7XG4gICAgfVxuXG4gICAgZ2V0UmVsYXRlZE1vZHVsZSgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBsZWdhY3lOYW1lID0gKHRoaXMuZmllbGQgJiYgdGhpcy5maWVsZC5kZWZpbml0aW9uICYmIHRoaXMuZmllbGQuZGVmaW5pdGlvbi5tb2R1bGUpIHx8ICcnO1xuICAgICAgICBpZiAoIWxlZ2FjeU5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLm1vZHVsZU5hbWVNYXBwZXIudG9Gcm9udGVuZChsZWdhY3lOYW1lKTtcbiAgICB9XG5cbiAgICBnZXRNZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2VzID0ge1xuICAgICAgICAgICAgc2VhcmNoaW5nOiAnTEJMX1NFQVJDSElORycsXG4gICAgICAgICAgICAnbm90LWZvdW5kJzogJ0xCTF9OT1RfRk9VTkQnLFxuICAgICAgICAgICAgZXJyb3I6ICdMQkxfU0VBUkNIX0VSUk9SJyxcbiAgICAgICAgICAgIGZvdW5kOiAnTEJMX0ZPVU5EJyxcbiAgICAgICAgICAgICduby1tb2R1bGUnOiAnTEJMX05PX01PRFVMRV9TRUxFQ1RFRCdcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAobWVzc2FnZXNbdGhpcy5zdGF0dXNdKSB7XG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZXNbdGhpcy5zdGF0dXNdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGdldEludmFsaWRDbGFzcygpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5maWVsZC5mb3JtQ29udHJvbCAmJiB0aGlzLmZpZWxkLmZvcm1Db250cm9sLmludmFsaWQgJiYgdGhpcy5maWVsZC5mb3JtQ29udHJvbC50b3VjaGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2lzLWludmFsaWQnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaGFzU2VhcmNoRXJyb3IoKSkge1xuICAgICAgICAgICAgcmV0dXJuICdpcy1pbnZhbGlkJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBoYXNTZWFyY2hFcnJvcigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdHVzID09PSAnZXJyb3InIHx8IHRoaXMuc3RhdHVzID09PSAnbm90LWZvdW5kJztcbiAgICB9XG5cbiAgICByZXNldFN0YXR1cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSAnJztcbiAgICB9XG5cbiAgICBnZXRQbGFjZWhvbGRlckxhYmVsKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhbmd1YWdlcy5nZXRBcHBTdHJpbmcoJ0xCTF9UWVBFX1RPX1NFQVJDSCcpIHx8ICcnO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbml0KCk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMuaW5pdE1vZHVsZSA9IHRoaXM/LmZpZWxkPy5kZWZpbml0aW9uPy5tb2R1bGUgPz8gJyc7XG5cbiAgICAgICAgaWYgKHRoaXMucmVsYXRlU2VydmljZSkge1xuICAgICAgICAgICAgdGhpcy5yZWxhdGVTZXJ2aWNlLmluaXQodGhpcy5nZXRSZWxhdGVkTW9kdWxlKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGJ1aWxkUmVsYXRlKGlkOiBzdHJpbmcsIHJlbGF0ZVZhbHVlOiBzdHJpbmcpOiBhbnkge1xuICAgICAgICBjb25zdCByZWxhdGUgPSB7aWR9O1xuXG4gICAgICAgIGlmICh0aGlzLmdldFJlbGF0ZUZpZWxkTmFtZSgpKSB7XG4gICAgICAgICAgICByZWxhdGVbdGhpcy5nZXRSZWxhdGVGaWVsZE5hbWUoKV0gPSByZWxhdGVWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWxhdGU7XG4gICAgfVxuXG59XG4iXX0=