import { LanguageStore } from '../../../store/language/language.store';
import { Injectable } from '@angular/core';
import { FieldBuilder } from './field.builder';
import { GroupFieldBuilder } from './group-field.builder';
import { AttributeBuilder } from './attribute.builder';
import { FilterFieldBuilder } from './filter-field.builder';
import { FilterAttributeBuilder } from './filter-attribute.builder';
import { LineItemBuilder } from './line-item.builder';
import { FormGroup } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "./field.builder";
import * as i2 from "./group-field.builder";
import * as i3 from "./attribute.builder";
import * as i4 from "./filter-field.builder";
import * as i5 from "./filter-attribute.builder";
import * as i6 from "./line-item.builder";
import * as i7 from "../../../store/language/language.store";
export class FieldManager {
    constructor(fieldBuilder, groupFieldBuilder, attributeBuilder, filterFieldBuilder, filterAttributeBuilder, lineItemBuilder, languageStore) {
        this.fieldBuilder = fieldBuilder;
        this.groupFieldBuilder = groupFieldBuilder;
        this.attributeBuilder = attributeBuilder;
        this.filterFieldBuilder = filterFieldBuilder;
        this.filterAttributeBuilder = filterAttributeBuilder;
        this.lineItemBuilder = lineItemBuilder;
        this.languageStore = languageStore;
    }
    /**
     * Build minimally initialised field object
     *
     * @param {string} type field type
     * @param {string} value field value
     * @returns {object} Field
     */
    buildShallowField(type, value) {
        return {
            type,
            value,
            definition: {
                type
            }
        };
    }
    /**
     * Build and add field to record
     *
     * @param {object} record Record
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @returns {object}Field
     */
    addField(record, viewField, language = null) {
        const field = this.fieldBuilder.buildField(record, viewField, language);
        this.addToRecord(record, viewField.name, field);
        this.groupFieldBuilder.addGroupFields(record, viewField, language, this.isFieldInitialized.bind(this), this.fieldBuilder.buildField.bind(this.fieldBuilder), this.addToRecord.bind(this));
        this.attributeBuilder.addAttributes(record, record.fields, viewField, language, this.attributeBuilder.buildAttribute.bind(this.attributeBuilder), this.attributeBuilder.addAttributeToRecord.bind(this.attributeBuilder));
        this.lineItemBuilder.addLineItems(record, record.fields, viewField, language, this.addField.bind(this));
        return field;
    }
    /**
     * Build and add filter field to record
     *
     * @param {object} record Record
     * @param {object} viewField ViewFieldDefinition
     * @param {object} language LanguageStore
     * @returns {object}Field
     */
    addFilterField(record, viewField, language = null) {
        const field = this.filterFieldBuilder.buildFilterField(record, viewField, language);
        this.filterFieldBuilder.addToSavedFilter(record, viewField.name, field);
        this.groupFieldBuilder.addGroupFields(record, viewField, language, this.filterFieldBuilder.isCriteriaFieldInitialized.bind(this.filterFieldBuilder), this.filterFieldBuilder.buildFilterField.bind(this.filterFieldBuilder), this.filterFieldBuilder.addToSavedFilter.bind(this.filterFieldBuilder));
        this.attributeBuilder.addAttributes(record, record.criteriaFields, viewField, language, this.filterAttributeBuilder.buildFilterAttribute.bind(this.filterAttributeBuilder), this.filterAttributeBuilder.addAttributeToSavedFilter.bind(this.filterAttributeBuilder));
        return field;
    }
    /**
     * Build line item and add to record
     * @param {object} itemDefinition
     * @param {object }item
     * @param {object} parentRecord
     * @param {object} parentField
     */
    addLineItem(itemDefinition, parentRecord, parentField, item = null) {
        if (!item) {
            item = {
                id: '',
                module: parentField.definition.module || '',
                attributes: {},
                fields: {},
                formGroup: new FormGroup({}),
            };
        }
        this.lineItemBuilder.addLineItem(itemDefinition, item, this.addField.bind(this), this.languageStore, parentRecord, parentField);
        parentField.itemFormArray.updateValueAndValidity();
    }
    /**
     * Remove line item
     * @param {object} parentField
     * @param index
     */
    removeLineItem(parentField, index) {
        const item = parentField.items[index];
        if (!item) {
            return;
        }
        if (item.id) {
            item.attributes.deleted = 1;
        }
        else {
            parentField.items = (index > -1) ? [
                ...parentField.items.slice(0, index),
                ...parentField.items.slice(index + 1)
            ] : parentField.items;
        }
        parentField.itemFormArray.clear();
        parentField.items.forEach(item => {
            const deleted = item && item.attributes && item.attributes.deleted;
            if (!item || deleted) {
                return;
            }
            parentField.itemFormArray.push(item.formGroup);
        });
        parentField.itemFormArray.updateValueAndValidity();
    }
    /**
     * Add field to record
     *
     * @param {object} record Record
     * @param {string} name string
     * @param {object} field Field
     */
    addToRecord(record, name, field) {
        if (!record || !name || !field) {
            return;
        }
        if (!record.fields) {
            record.fields = {};
        }
        record.fields[name] = field;
        if (record.formGroup && field.itemFormArray) {
            record.formGroup.addControl(name + '-items', field.itemFormArray);
        }
        if (record.formGroup && field.formControl) {
            record.formGroup.addControl(name, field.formControl);
        }
    }
    /**
     * Is field initialized in record
     *
     * @param {object} record Record
     * @param {string} fieldName field
     * @returns {boolean} isInitialized
     */
    isFieldInitialized(record, fieldName) {
        return !!record.fields[fieldName];
    }
}
FieldManager.ɵprov = i0.ɵɵdefineInjectable({ factory: function FieldManager_Factory() { return new FieldManager(i0.ɵɵinject(i1.FieldBuilder), i0.ɵɵinject(i2.GroupFieldBuilder), i0.ɵɵinject(i3.AttributeBuilder), i0.ɵɵinject(i4.FilterFieldBuilder), i0.ɵɵinject(i5.FilterAttributeBuilder), i0.ɵɵinject(i6.LineItemBuilder), i0.ɵɵinject(i7.LanguageStore)); }, token: FieldManager, providedIn: "root" });
FieldManager.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
FieldManager.ctorParameters = () => [
    { type: FieldBuilder },
    { type: GroupFieldBuilder },
    { type: AttributeBuilder },
    { type: FilterFieldBuilder },
    { type: FilterAttributeBuilder },
    { type: LineItemBuilder },
    { type: LanguageStore }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQubWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zZXJ2aWNlcy9yZWNvcmQvZmllbGQvZmllbGQubWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUEyQkEsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBQ3JFLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3hELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFELE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQ2xFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7Ozs7Ozs7OztBQUt6QyxNQUFNLE9BQU8sWUFBWTtJQUVyQixZQUNjLFlBQTBCLEVBQzFCLGlCQUFvQyxFQUNwQyxnQkFBa0MsRUFDbEMsa0JBQXNDLEVBQ3RDLHNCQUE4QyxFQUM5QyxlQUFnQyxFQUNoQyxhQUE0QjtRQU41QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQ3BDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXdCO1FBQzlDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJ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QUFLLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDeEQ7SUFDTCxDQUFDO0lBR0Q7Ozs7OztPQU1HO0lBQ08sa0JBQWtCLENBQUMsTUFBYyxFQUFFLFNBQWlCO1FBQzFELE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdEMsQ0FBQzs7OztZQTNOSixVQUFVLFNBQUM7Z0JBQ1IsVUFBVSxFQUFFLE1BQU07YUFDckI7OztZQVZPLFlBQVk7WUFDWixpQkFBaUI7WUFDakIsZ0JBQWdCO1lBQ2hCLGtCQUFrQjtZQUNsQixzQkFBc0I7WUFDdEIsZUFBZTtZQVJmLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN1aXRlQ1JNIGlzIGEgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgcHJvZ3JhbSBkZXZlbG9wZWQgYnkgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqIENvcHlyaWdodCAoQykgMjAyMSBTYWxlc0FnaWxpdHkgTHRkLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0IHVuZGVyXG4gKiB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDMgYXMgcHVibGlzaGVkIGJ5IHRoZVxuICogRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uIHdpdGggdGhlIGFkZGl0aW9uIG9mIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbiBhZGRlZFxuICogdG8gU2VjdGlvbiAxNSBhcyBwZXJtaXR0ZWQgaW4gU2VjdGlvbiA3KGEpOiBGT1IgQU5ZIFBBUlQgT0YgVEhFIENPVkVSRUQgV09SS1xuICogSU4gV0hJQ0ggVEhFIENPUFlSSUdIVCBJUyBPV05FRCBCWSBTQUxFU0FHSUxJVFksIFNBTEVTQUdJTElUWSBESVNDTEFJTVMgVEhFXG4gKiBXQVJSQU5UWSBPRiBOT04gSU5GUklOR0VNRU5UIE9GIFRISVJEIFBBUlRZIFJJR0hUUy5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCwgYnV0IFdJVEhPVVRcbiAqIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTXG4gKiBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlXG4gKiBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICogSW4gYWNjb3JkYW5jZSB3aXRoIFNlY3Rpb24gNyhiKSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiB2ZXJzaW9uIDMsIHRoZXNlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCByZXRhaW4gdGhlIGRpc3BsYXkgb2YgdGhlXG4gKiBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiIGxvZ28uIElmIHRoZSBkaXNwbGF5IG9mIHRoZSBsb2dvcyBpcyBub3QgcmVhc29uYWJseVxuICogZmVhc2libGUgZm9yIHRlY2huaWNhbCByZWFzb25zLCB0aGUgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IGRpc3BsYXlcbiAqIHRoZSB3b3JkcyBcIlN1cGVyY2hhcmdlZCBieSBTdWl0ZUNSTVwiLlxuICovXG5cbmltcG9ydCB7RmllbGQsIEZpZWxkRGVmaW5pdGlvbiwgUmVjb3JkLCBWaWV3RmllbGREZWZpbml0aW9ufSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtMYW5ndWFnZVN0b3JlfSBmcm9tICcuLi8uLi8uLi9zdG9yZS9sYW5ndWFnZS9sYW5ndWFnZS5zdG9yZSc7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTYXZlZEZpbHRlcn0gZnJvbSAnLi4vLi4vLi4vc3RvcmUvc2F2ZWQtZmlsdGVycy9zYXZlZC1maWx0ZXIubW9kZWwnO1xuaW1wb3J0IHtGaWVsZEJ1aWxkZXJ9IGZyb20gJy4vZmllbGQuYnVpbGRlcic7XG5pbXBvcnQge0dyb3VwRmllbGRCdWlsZGVyfSBmcm9tICcuL2dyb3VwLWZpZWxkLmJ1aWxkZXInO1xuaW1wb3J0IHtBdHRyaWJ1dGVCdWlsZGVyfSBmcm9tICcuL2F0dHJpYnV0ZS5idWlsZGVyJztcbmltcG9ydCB7RmlsdGVyRmllbGRCdWlsZGVyfSBmcm9tICcuL2ZpbHRlci1maWVsZC5idWlsZGVyJztcbmltcG9ydCB7RmlsdGVyQXR0cmlidXRlQnVpbGRlcn0gZnJvbSAnLi9maWx0ZXItYXR0cmlidXRlLmJ1aWxkZXInO1xuaW1wb3J0IHtMaW5lSXRlbUJ1aWxkZXJ9IGZyb20gJy4vbGluZS1pdGVtLmJ1aWxkZXInO1xuaW1wb3J0IHtGb3JtR3JvdXB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBGaWVsZE1hbmFnZXIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBmaWVsZEJ1aWxkZXI6IEZpZWxkQnVpbGRlcixcbiAgICAgICAgcHJvdGVjdGVkIGdyb3VwRmllbGRCdWlsZGVyOiBHcm91cEZpZWxkQnVpbGRlcixcbiAgICAgICAgcHJvdGVjdGVkIGF0dHJpYnV0ZUJ1aWxkZXI6IEF0dHJpYnV0ZUJ1aWxkZXIsXG4gICAgICAgIHByb3RlY3RlZCBmaWx0ZXJGaWVsZEJ1aWxkZXI6IEZpbHRlckZpZWxkQnVpbGRlcixcbiAgICAgICAgcHJvdGVjdGVkIGZpbHRlckF0dHJpYnV0ZUJ1aWxkZXI6IEZpbHRlckF0dHJpYnV0ZUJ1aWxkZXIsXG4gICAgICAgIHByb3RlY3RlZCBsaW5lSXRlbUJ1aWxkZXI6IExpbmVJdGVtQnVpbGRlcixcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlU3RvcmU6IExhbmd1YWdlU3RvcmVcbiAgICApIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBtaW5pbWFsbHkgaW5pdGlhbGlzZWQgZmllbGQgb2JqZWN0XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBmaWVsZCB0eXBlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIGZpZWxkIHZhbHVlXG4gICAgICogQHJldHVybnMge29iamVjdH0gRmllbGRcbiAgICAgKi9cbiAgICBwdWJsaWMgYnVpbGRTaGFsbG93RmllbGQodHlwZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogRmllbGQge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xuICAgICAgICAgICAgICAgIHR5cGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBhcyBGaWVsZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhbmQgYWRkIGZpZWxkIHRvIHJlY29yZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlY29yZCBSZWNvcmRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmlld0ZpZWxkIFZpZXdGaWVsZERlZmluaXRpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbGFuZ3VhZ2UgTGFuZ3VhZ2VTdG9yZVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9RmllbGRcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkRmllbGQocmVjb3JkOiBSZWNvcmQsIHZpZXdGaWVsZDogVmlld0ZpZWxkRGVmaW5pdGlvbiwgbGFuZ3VhZ2U6IExhbmd1YWdlU3RvcmUgPSBudWxsKTogRmllbGQge1xuXG4gICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5maWVsZEJ1aWxkZXIuYnVpbGRGaWVsZChyZWNvcmQsIHZpZXdGaWVsZCwgbGFuZ3VhZ2UpO1xuXG4gICAgICAgIHRoaXMuYWRkVG9SZWNvcmQocmVjb3JkLCB2aWV3RmllbGQubmFtZSwgZmllbGQpO1xuICAgICAgICB0aGlzLmdyb3VwRmllbGRCdWlsZGVyLmFkZEdyb3VwRmllbGRzKFxuICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgdmlld0ZpZWxkLFxuICAgICAgICAgICAgbGFuZ3VhZ2UsXG4gICAgICAgICAgICB0aGlzLmlzRmllbGRJbml0aWFsaXplZC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdGhpcy5maWVsZEJ1aWxkZXIuYnVpbGRGaWVsZC5iaW5kKHRoaXMuZmllbGRCdWlsZGVyKSxcbiAgICAgICAgICAgIHRoaXMuYWRkVG9SZWNvcmQuYmluZCh0aGlzKVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuYXR0cmlidXRlQnVpbGRlci5hZGRBdHRyaWJ1dGVzKFxuICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgcmVjb3JkLmZpZWxkcyxcbiAgICAgICAgICAgIHZpZXdGaWVsZCxcbiAgICAgICAgICAgIGxhbmd1YWdlLFxuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVCdWlsZGVyLmJ1aWxkQXR0cmlidXRlLmJpbmQodGhpcy5hdHRyaWJ1dGVCdWlsZGVyKSxcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlQnVpbGRlci5hZGRBdHRyaWJ1dGVUb1JlY29yZC5iaW5kKHRoaXMuYXR0cmlidXRlQnVpbGRlcilcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmxpbmVJdGVtQnVpbGRlci5hZGRMaW5lSXRlbXMoXG4gICAgICAgICAgICByZWNvcmQsXG4gICAgICAgICAgICByZWNvcmQuZmllbGRzLFxuICAgICAgICAgICAgdmlld0ZpZWxkLFxuICAgICAgICAgICAgbGFuZ3VhZ2UsXG4gICAgICAgICAgICB0aGlzLmFkZEZpZWxkLmJpbmQodGhpcyksXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGZpZWxkO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgYW5kIGFkZCBmaWx0ZXIgZmllbGQgdG8gcmVjb3JkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkIFJlY29yZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB2aWV3RmllbGQgVmlld0ZpZWxkRGVmaW5pdGlvblxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsYW5ndWFnZSBMYW5ndWFnZVN0b3JlXG4gICAgICogQHJldHVybnMge29iamVjdH1GaWVsZFxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRGaWx0ZXJGaWVsZChyZWNvcmQ6IFNhdmVkRmlsdGVyLCB2aWV3RmllbGQ6IFZpZXdGaWVsZERlZmluaXRpb24sIGxhbmd1YWdlOiBMYW5ndWFnZVN0b3JlID0gbnVsbCk6IEZpZWxkIHtcblxuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmlsdGVyRmllbGRCdWlsZGVyLmJ1aWxkRmlsdGVyRmllbGQocmVjb3JkLCB2aWV3RmllbGQsIGxhbmd1YWdlKTtcblxuICAgICAgICB0aGlzLmZpbHRlckZpZWxkQnVpbGRlci5hZGRUb1NhdmVkRmlsdGVyKHJlY29yZCwgdmlld0ZpZWxkLm5hbWUsIGZpZWxkKTtcbiAgICAgICAgdGhpcy5ncm91cEZpZWxkQnVpbGRlci5hZGRHcm91cEZpZWxkcyhcbiAgICAgICAgICAgIHJlY29yZCxcbiAgICAgICAgICAgIHZpZXdGaWVsZCxcbiAgICAgICAgICAgIGxhbmd1YWdlLFxuICAgICAgICAgICAgdGhpcy5maWx0ZXJGaWVsZEJ1aWxkZXIuaXNDcml0ZXJpYUZpZWxkSW5pdGlhbGl6ZWQuYmluZCh0aGlzLmZpbHRlckZpZWxkQnVpbGRlciksXG4gICAgICAgICAgICB0aGlzLmZpbHRlckZpZWxkQnVpbGRlci5idWlsZEZpbHRlckZpZWxkLmJpbmQodGhpcy5maWx0ZXJGaWVsZEJ1aWxkZXIpLFxuICAgICAgICAgICAgdGhpcy5maWx0ZXJGaWVsZEJ1aWxkZXIuYWRkVG9TYXZlZEZpbHRlci5iaW5kKHRoaXMuZmlsdGVyRmllbGRCdWlsZGVyKVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuYXR0cmlidXRlQnVpbGRlci5hZGRBdHRyaWJ1dGVzKFxuICAgICAgICAgICAgcmVjb3JkLFxuICAgICAgICAgICAgcmVjb3JkLmNyaXRlcmlhRmllbGRzLFxuICAgICAgICAgICAgdmlld0ZpZWxkLFxuICAgICAgICAgICAgbGFuZ3VhZ2UsXG4gICAgICAgICAgICB0aGlzLmZpbHRlckF0dHJpYnV0ZUJ1aWxkZXIuYnVpbGRGaWx0ZXJBdHRyaWJ1dGUuYmluZCh0aGlzLmZpbHRlckF0dHJpYnV0ZUJ1aWxkZXIpLFxuICAgICAgICAgICAgdGhpcy5maWx0ZXJBdHRyaWJ1dGVCdWlsZGVyLmFkZEF0dHJpYnV0ZVRvU2F2ZWRGaWx0ZXIuYmluZCh0aGlzLmZpbHRlckF0dHJpYnV0ZUJ1aWxkZXIpXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGZpZWxkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGxpbmUgaXRlbSBhbmQgYWRkIHRvIHJlY29yZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtRGVmaW5pdGlvblxuICAgICAqIEBwYXJhbSB7b2JqZWN0IH1pdGVtXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmVudFJlY29yZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJlbnRGaWVsZFxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRMaW5lSXRlbShcbiAgICAgICAgaXRlbURlZmluaXRpb246IEZpZWxkRGVmaW5pdGlvbixcbiAgICAgICAgcGFyZW50UmVjb3JkOiBSZWNvcmQsXG4gICAgICAgIHBhcmVudEZpZWxkOiBGaWVsZCxcbiAgICAgICAgaXRlbTogUmVjb3JkID0gbnVsbFxuICAgICkge1xuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgIGl0ZW0gPSB7XG4gICAgICAgICAgICAgICAgaWQ6ICcnLFxuICAgICAgICAgICAgICAgIG1vZHVsZTogcGFyZW50RmllbGQuZGVmaW5pdGlvbi5tb2R1bGUgfHwgJycsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczoge30sXG4gICAgICAgICAgICAgICAgZmllbGRzOiB7fSxcbiAgICAgICAgICAgICAgICBmb3JtR3JvdXA6IG5ldyBGb3JtR3JvdXAoe30pLFxuICAgICAgICAgICAgfSBhcyBSZWNvcmQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxpbmVJdGVtQnVpbGRlci5hZGRMaW5lSXRlbShcbiAgICAgICAgICAgIGl0ZW1EZWZpbml0aW9uLFxuICAgICAgICAgICAgaXRlbSxcbiAgICAgICAgICAgIHRoaXMuYWRkRmllbGQuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIHRoaXMubGFuZ3VhZ2VTdG9yZSxcbiAgICAgICAgICAgIHBhcmVudFJlY29yZCxcbiAgICAgICAgICAgIHBhcmVudEZpZWxkXG4gICAgICAgICk7XG5cbiAgICAgICAgcGFyZW50RmllbGQuaXRlbUZvcm1BcnJheS51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGxpbmUgaXRlbVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJlbnRGaWVsZFxuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmVMaW5lSXRlbShwYXJlbnRGaWVsZDogRmllbGQsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHBhcmVudEZpZWxkLml0ZW1zW2luZGV4XTtcblxuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtLmlkKSB7XG4gICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMuZGVsZXRlZCA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnRGaWVsZC5pdGVtcyA9IChpbmRleCA+IC0xKSA/IFtcbiAgICAgICAgICAgICAgICAuLi5wYXJlbnRGaWVsZC5pdGVtcy5zbGljZSgwLCBpbmRleCksXG4gICAgICAgICAgICAgICAgLi4ucGFyZW50RmllbGQuaXRlbXMuc2xpY2UoaW5kZXggKyAxKVxuICAgICAgICAgICAgXSA6IHBhcmVudEZpZWxkLml0ZW1zO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFyZW50RmllbGQuaXRlbUZvcm1BcnJheS5jbGVhcigpO1xuXG4gICAgICAgIHBhcmVudEZpZWxkLml0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkZWxldGVkID0gaXRlbSAmJiBpdGVtLmF0dHJpYnV0ZXMgJiYgaXRlbS5hdHRyaWJ1dGVzLmRlbGV0ZWQ7XG4gICAgICAgICAgICBpZiAoIWl0ZW0gfHwgZGVsZXRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyZW50RmllbGQuaXRlbUZvcm1BcnJheS5wdXNoKGl0ZW0uZm9ybUdyb3VwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGFyZW50RmllbGQuaXRlbUZvcm1BcnJheS51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBBZGQgZmllbGQgdG8gcmVjb3JkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVjb3JkIFJlY29yZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHN0cmluZ1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBmaWVsZCBGaWVsZFxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRUb1JlY29yZChyZWNvcmQ6IFJlY29yZCwgbmFtZTogc3RyaW5nLCBmaWVsZDogRmllbGQpOiB2b2lkIHtcblxuICAgICAgICBpZiAoIXJlY29yZCB8fCAhbmFtZSB8fCAhZmllbGQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmVjb3JkLmZpZWxkcykge1xuICAgICAgICAgICAgcmVjb3JkLmZpZWxkcyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmVjb3JkLmZpZWxkc1tuYW1lXSA9IGZpZWxkO1xuXG4gICAgICAgIGlmIChyZWNvcmQuZm9ybUdyb3VwICYmIGZpZWxkLml0ZW1Gb3JtQXJyYXkpIHtcbiAgICAgICAgICAgIHJlY29yZC5mb3JtR3JvdXAuYWRkQ29udHJvbChuYW1lICsgJy1pdGVtcycsIGZpZWxkLml0ZW1Gb3JtQXJyYXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlY29yZC5mb3JtR3JvdXAgJiYgZmllbGQuZm9ybUNvbnRyb2wpIHtcbiAgICAgICAgICAgIHJlY29yZC5mb3JtR3JvdXAuYWRkQ29udHJvbChuYW1lLCBmaWVsZC5mb3JtQ29udHJvbCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIElzIGZpZWxkIGluaXRpYWxpemVkIGluIHJlY29yZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHJlY29yZCBSZWNvcmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmllbGROYW1lIGZpZWxkXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IGlzSW5pdGlhbGl6ZWRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaXNGaWVsZEluaXRpYWxpemVkKHJlY29yZDogUmVjb3JkLCBmaWVsZE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISFyZWNvcmQuZmllbGRzW2ZpZWxkTmFtZV07XG4gICAgfVxuXG59XG4iXX0=