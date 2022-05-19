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
import { Injectable } from '@angular/core';
import { isVoid } from 'common';
import { FormGroup } from '@angular/forms';
import { LanguageStore } from '../../store/language/language.store';
import { FieldManager } from './field/field.manager';
import * as i0 from "@angular/core";
import * as i1 from "./field/field.manager";
import * as i2 from "../../store/language/language.store";
export class RecordManager {
    constructor(fieldManager, language) {
        this.fieldManager = fieldManager;
        this.language = language;
    }
    /**
     * Get empty record
     *
     * @param {string} module string
     * @returns {object} Record
     */
    buildEmptyRecord(module) {
        return {
            id: '',
            module,
            attributes: {
                id: ''
            },
            fields: {},
            formGroup: new FormGroup({}),
        };
    }
    /**
     * Init Fields
     *
     * @param {object} record to use
     * @param {object} viewFieldDefinitions to use
     * @returns {object} fields
     */
    initFields(record, viewFieldDefinitions) {
        if (!record.fields) {
            record.fields = {};
        }
        if (!record.formGroup) {
            record.formGroup = new FormGroup({});
        }
        viewFieldDefinitions.forEach(viewField => {
            if (!viewField || !viewField.name) {
                return;
            }
            this.fieldManager.addField(record, viewField, this.language);
        });
        return record.fields;
    }
    /**
     * Inject param fields
     *
     * @param {object} params Params
     * @param {object} record Record
     * @param {object} vardefs FieldDefinitionMap
     */
    injectParamFields(params, record, vardefs) {
        Object.keys(params).forEach(paramKey => {
            var _a;
            const definition = vardefs[paramKey];
            if (!isVoid(definition)) {
                const type = definition.type || '';
                let idName = definition.id_name || '';
                const name = definition.name || '';
                let rname = definition.rname || '';
                if (type === 'relate' && idName === name) {
                    record.attributes[paramKey] = params[paramKey];
                    return;
                }
                if (type === 'parent') {
                    const relate = {};
                    let rname = 'name';
                    let idName = 'parent_id';
                    const groupFieldKey = paramKey + '-group';
                    const groupField = (_a = vardefs[groupFieldKey]) !== null && _a !== void 0 ? _a : {};
                    const parentName = groupField.groupFields[paramKey];
                    if (parentName && parentName.rname) {
                        rname = parentName.rname;
                    }
                    if (rname) {
                        relate[rname] = params[paramKey];
                    }
                    if (idName && params[idName]) {
                        relate.id = params[idName];
                    }
                    record.attributes[paramKey] = relate;
                    return;
                }
                if (type === 'relate') {
                    const relate = {};
                    if (rname) {
                        relate[rname] = params[paramKey];
                    }
                    if (idName && params[idName]) {
                        relate.id = params[idName];
                    }
                    record.attributes[paramKey] = relate;
                    return;
                }
                record.attributes[paramKey] = params[paramKey];
                return;
            }
            this.handleLinkTypeRelationship(paramKey, params, vardefs, record);
        });
    }
    handleLinkTypeRelationship(paramKey, params, vardefs, record) {
        if (paramKey === 'return_relationship') {
            const returnRelationship = params.return_relationship;
            if (!returnRelationship) {
                return;
            }
            // check, on vardefs, if there is a field of type = link
            // with relationship equal to the value of return_relationship param
            Object.keys(vardefs).forEach(key => {
                var _a, _b, _c, _d;
                const vardef = vardefs[key];
                const type = vardef.type || '';
                if (type !== 'link') {
                    return;
                }
                const relationship = vardef.relationship || '';
                if (!relationship) {
                    return;
                }
                if (relationship === returnRelationship) {
                    const linkFieldName = vardef.name;
                    const module = (_b = (_a = vardef.module) !== null && _a !== void 0 ? _a : params.return_module) !== null && _b !== void 0 ? _b : '';
                    if (!module) {
                        return;
                    }
                    const parentName = params.parent_name;
                    if (!parentName) {
                        return;
                    }
                    // name of the related parent field e.g. contact_id as injected
                    // in to field definition from its metadata definition
                    const relateId = (_c = vardef === null || vardef === void 0 ? void 0 : vardef.relationshipMetadata) === null || _c === void 0 ? void 0 : _c.related_id;
                    const parentId = (_d = params[relateId]) !== null && _d !== void 0 ? _d : '';
                    if (!parentId) {
                        return;
                    }
                    // add link type fields as line items to base record
                    record.attributes[linkFieldName] = [
                        {
                            id: parentId,
                            module,
                            attributes: {
                                id: parentId,
                                name: parentName
                            }
                        }
                    ];
                    return;
                }
            });
        }
    }
}
RecordManager.ɵprov = i0.ɵɵdefineInjectable({ factory: function RecordManager_Factory() { return new RecordManager(i0.ɵɵinject(i1.FieldManager), i0.ɵɵinject(i2.LanguageStore)); }, token: RecordManager, providedIn: "root" });
RecordManager.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
RecordManager.ctorParameters = () => [
    { type: FieldManager },
    { type: LanguageStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkLm1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc2VydmljZXMvcmVjb3JkL3JlY29yZC5tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBK0IsTUFBTSxFQUE4QixNQUFNLFFBQVEsQ0FBQztBQUN6RixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7OztBQU1uRCxNQUFNLE9BQU8sYUFBYTtJQUV0QixZQUNjLFlBQTBCLEVBQzFCLFFBQXVCO1FBRHZCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLGFBQVEsR0FBUixRQUFRLENBQWU7SUFFckMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsZ0JBQWdCLENBQUMsTUFBYztRQUMzQixPQUFPO1lBQ0gsRUFBRSxFQUFFLEVBQUU7WUFDTixNQUFNO1lBQ04sVUFBVSxFQUFFO2dCQUNSLEVBQUUsRUFBRSxFQUFFO2FBQ1Q7WUFDRCxNQUFNLEVBQUUsRUFBRTtZQUNWLFNBQVMsRUFBRSxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUM7U0FDckIsQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksVUFBVSxDQUFDLE1BQWMsRUFBRSxvQkFBMkM7UUFFekUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDaEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxFQUFjLENBQUM7U0FDbEM7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUNuQixNQUFN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O3dCQUNULE9BQU87cUJBQ1Y7b0JBRUQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztvQkFDdEMsSUFBSSxDQUFDLFVBQVUsRUFBRTt3QkFDYixPQUFPO3FCQUNWO29CQUVELCtEQUErRDtvQkFDL0Qsc0RBQXNEO29CQUN0RCxNQUFNLFFBQVEsR0FBRyxNQUFBLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxvQkFBb0IsMENBQUUsVUFBVSxDQUFDO29CQUMxRCxNQUFNLFFBQVEsR0FBRyxNQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUNBQUksRUFBRSxDQUFDO29CQUN4QyxJQUFJLENBQUMsUUFBUSxFQUFFO3dCQUNYLE9BQU87cUJBQ1Y7b0JBRUQsb0RBQW9EO29CQUNwRCxNQUFNLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHO3dCQUMvQjs0QkFDSSxFQUFFLEVBQUUsUUFBUTs0QkFDWixNQUFNOzRCQUNOLFVBQVUsRUFBRTtnQ0FDUixFQUFFLEVBQUUsUUFBUTtnQ0FDWixJQUFJLEVBQUUsVUFBVTs2QkFDbkI7eUJBQ007cUJBQ2QsQ0FBQztvQkFFRixPQUFPO2lCQUNWO1lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7Ozs7WUEvTEosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUFMTyxZQUFZO1lBRFosYUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RmllbGREZWZpbml0aW9uTWFwLCBGaWVsZE1hcCwgaXNWb2lkLCBSZWNvcmQsIFZpZXdGaWVsZERlZmluaXRpb259IGZyb20gJ2NvbW1vbic7XG5pbXBvcnQge0Zvcm1Hcm91cH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtMYW5ndWFnZVN0b3JlfSBmcm9tICcuLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5pbXBvcnQge0ZpZWxkTWFuYWdlcn0gZnJvbSAnLi9maWVsZC9maWVsZC5tYW5hZ2VyJztcbmltcG9ydCB7UGFyYW1zfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFJlY29yZE1hbmFnZXIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBmaWVsZE1hbmFnZXI6IEZpZWxkTWFuYWdlcixcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlOiBMYW5ndWFnZVN0b3JlXG4gICAgKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGVtcHR5IHJlY29yZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZHVsZSBzdHJpbmdcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBSZWNvcmRcbiAgICAgKi9cbiAgICBidWlsZEVtcHR5UmVjb3JkKG1vZHVsZTogc3RyaW5nKTogUmVjb3JkIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiAnJyxcbiAgICAgICAgICAgIG1vZHVsZSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICBpZDogJydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmaWVsZHM6IHt9LFxuICAgICAgICAgICAgZm9ybUdyb3VwOiBuZXcgRm9ybUdyb3VwKHt9KSxcbiAgICAgICAgfSBhcyBSZWNvcmQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdCBGaWVsZHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZWNvcmQgdG8gdXNlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHZpZXdGaWVsZERlZmluaXRpb25zIHRvIHVzZVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IGZpZWxkc1xuICAgICAqL1xuICAgIHB1YmxpYyBpbml0RmllbGRzKHJlY29yZDogUmVjb3JkLCB2aWV3RmllbGREZWZpbml0aW9uczogVmlld0ZpZWxkRGVmaW5pdGlvbltdKTogRmllbGRNYXAge1xuXG4gICAgICAgIGlmICghcmVjb3JkLmZpZWxkcykge1xuICAgICAgICAgICAgcmVjb3JkLmZpZWxkcyA9IHt9IGFzIEZpZWxkTWFwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyZWNvcmQuZm9ybUdyb3VwKSB7XG4gICAgICAgICAgICByZWNvcmQuZm9ybUdyb3VwID0gbmV3IEZvcm1Hcm91cCh7fSk7XG4gICAgICAgIH1cblxuICAgICAgICB2aWV3RmllbGREZWZpbml0aW9ucy5mb3JFYWNoKHZpZXdGaWVsZCA9PiB7XG4gICAgICAgICAgICBpZiAoIXZpZXdGaWVsZCB8fCAhdmlld0ZpZWxkLm5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZpZWxkTWFuYWdlci5hZGRGaWVsZChyZWNvcmQsIHZpZXdGaWVsZCwgdGhpcy5sYW5ndWFnZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZWNvcmQuZmllbGRzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluamVjdCBwYXJhbSBmaWVsZHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgUGFyYW1zXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlY29yZCBSZWNvcmRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmFyZGVmcyBGaWVsZERlZmluaXRpb25NYXBcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5qZWN0UGFyYW1GaWVsZHMocGFyYW1zOiBQYXJhbXMsIHJlY29yZDogUmVjb3JkLCB2YXJkZWZzOiBGaWVsZERlZmluaXRpb25NYXApOiB2b2lkIHtcblxuICAgICAgICBPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2gocGFyYW1LZXkgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCBkZWZpbml0aW9uID0gdmFyZGVmc1twYXJhbUtleV07XG5cbiAgICAgICAgICAgIGlmICghaXNWb2lkKGRlZmluaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IGRlZmluaXRpb24udHlwZSB8fCAnJztcbiAgICAgICAgICAgICAgICBsZXQgaWROYW1lID0gZGVmaW5pdGlvbi5pZF9uYW1lIHx8ICcnO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBkZWZpbml0aW9uLm5hbWUgfHwgJyc7XG4gICAgICAgICAgICAgICAgbGV0IHJuYW1lID0gZGVmaW5pdGlvbi5ybmFtZSB8fCAnJztcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAncmVsYXRlJyAmJiBpZE5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkLmF0dHJpYnV0ZXNbcGFyYW1LZXldID0gcGFyYW1zW3BhcmFtS2V5XTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAncGFyZW50Jykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWxhdGUgPSB7fSBhcyBhbnk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHJuYW1lID0gJ25hbWUnO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaWROYW1lID0gJ3BhcmVudF9pZCc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwRmllbGRLZXkgPSBwYXJhbUtleSArICctZ3JvdXAnO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBncm91cEZpZWxkID0gdmFyZGVmc1tncm91cEZpZWxkS2V5XSA/PyB7fTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyZW50TmFtZSA9IGdyb3VwRmllbGQuZ3JvdXBGaWVsZHNbcGFyYW1LZXldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHBhcmVudE5hbWUgICYmIHBhcmVudE5hbWUucm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJuYW1lID0gcGFyZW50TmFtZS5ybmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChybmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlW3JuYW1lXSA9IHBhcmFtc1twYXJhbUtleV07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaWROYW1lICYmIHBhcmFtc1tpZE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWxhdGUuaWQgPSBwYXJhbXNbaWROYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJlY29yZC5hdHRyaWJ1dGVzW3BhcmFtS2V5XSA9IHJlbGF0ZTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdyZWxhdGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0ZSA9IHt9IGFzIGFueTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZVtybmFtZV0gPSBwYXJhbXNbcGFyYW1LZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlkTmFtZSAmJiBwYXJhbXNbaWROYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlLmlkID0gcGFyYW1zW2lkTmFtZV07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZWNvcmQuYXR0cmlidXRlc1twYXJhbUtleV0gPSByZWxhdGU7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlY29yZC5hdHRyaWJ1dGVzW3BhcmFtS2V5XSA9IHBhcmFtc1twYXJhbUtleV07XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaGFuZGxlTGlua1R5cGVSZWxhdGlvbnNoaXAocGFyYW1LZXksIHBhcmFtcywgdmFyZGVmcywgcmVjb3JkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGhhbmRsZUxpbmtUeXBlUmVsYXRpb25zaGlwKHBhcmFtS2V5OiBzdHJpbmcsIHBhcmFtczogUGFyYW1zLCB2YXJkZWZzOiBGaWVsZERlZmluaXRpb25NYXAsIHJlY29yZDogUmVjb3JkKTogdm9pZCB7XG4gICAgICAgIGlmIChwYXJhbUtleSA9PT0gJ3JldHVybl9yZWxhdGlvbnNoaXAnKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHJldHVyblJlbGF0aW9uc2hpcCA9IHBhcmFtcy5yZXR1cm5fcmVsYXRpb25zaGlwO1xuICAgICAgICAgICAgaWYgKCFyZXR1cm5SZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNoZWNrLCBvbiB2YXJkZWZzLCBpZiB0aGVyZSBpcyBhIGZpZWxkIG9mIHR5cGUgPSBsaW5rXG4gICAgICAgICAgICAvLyB3aXRoIHJlbGF0aW9uc2hpcCBlcXVhbCB0byB0aGUgdmFsdWUgb2YgcmV0dXJuX3JlbGF0aW9uc2hpcCBwYXJhbVxuICAgICAgICAgICAgT2JqZWN0LmtleXModmFyZGVmcykuZm9yRWFjaChrZXkgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdmFyZGVmID0gdmFyZGVmc1trZXldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB2YXJkZWYudHlwZSB8fCAnJztcbiAgICAgICAgICAgICAgICBpZiAodHlwZSAhPT0gJ2xpbmsnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGlvbnNoaXAgPSB2YXJkZWYucmVsYXRpb25zaGlwIHx8ICcnO1xuICAgICAgICAgICAgICAgIGlmICghcmVsYXRpb25zaGlwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwID09PSByZXR1cm5SZWxhdGlvbnNoaXApIHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5rRmllbGROYW1lID0gdmFyZGVmLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IHZhcmRlZi5tb2R1bGUgPz8gcGFyYW1zLnJldHVybl9tb2R1bGUgPz8gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbW9kdWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnROYW1lID0gcGFyYW1zLnBhcmVudF9uYW1lO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIG5hbWUgb2YgdGhlIHJlbGF0ZWQgcGFyZW50IGZpZWxkIGUuZy4gY29udGFjdF9pZCBhcyBpbmplY3RlZFxuICAgICAgICAgICAgICAgICAgICAvLyBpbiB0byBmaWVsZCBkZWZpbml0aW9uIGZyb20gaXRzIG1ldGFkYXRhIGRlZmluaXRpb25cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVsYXRlSWQgPSB2YXJkZWY/LnJlbGF0aW9uc2hpcE1ldGFkYXRhPy5yZWxhdGVkX2lkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnRJZCA9IHBhcmFtc1tyZWxhdGVJZF0gPz8gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcGFyZW50SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZCBsaW5rIHR5cGUgZmllbGRzIGFzIGxpbmUgaXRlbXMgdG8gYmFzZSByZWNvcmRcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkLmF0dHJpYnV0ZXNbbGlua0ZpZWxkTmFtZV0gPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHBhcmVudElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwYXJlbnRJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogcGFyZW50TmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gYXMgUmVjb3JkXG4gICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19