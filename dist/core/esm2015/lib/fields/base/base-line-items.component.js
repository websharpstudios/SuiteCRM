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
import { BaseFieldComponent } from './base-field.component';
import { DataTypeFormatter } from '../../services/formatters/data-type.formatter.service';
import { RecordManager } from '../../services/record/record.manager';
import { emptyObject, isEditable, isTrue, LineActionEvent } from 'common';
import set from 'lodash-es/set';
import { FieldLogicManager } from '../field-logic/field-logic.manager';
import { FieldManager } from '../../services/record/field/field.manager';
import { FieldRegistry } from '../field.registry';
export class BaseLineItemsComponent extends BaseFieldComponent {
    constructor(typeFormatter, registry, recordManager, logic, fieldManager) {
        super(typeFormatter, logic);
        this.typeFormatter = typeFormatter;
        this.registry = registry;
        this.recordManager = recordManager;
        this.logic = logic;
        this.fieldManager = fieldManager;
    }
    ngOnInit() {
        super.ngOnInit();
        this.initUpdateParentSubscription();
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    /**
     * Get component type
     * @param {string} type
     * @param {FieldDefinition} definition
     * @returns {}
     */
    getComponentType(type, definition) {
        const module = (this.record && this.record.module) || 'default';
        const displayType = (definition && definition.displayType) || '';
        return this.registry.getDisplayType(module, type, displayType, this.getMode());
    }
    /**
     * Get the list of items
     *
     * @returns {object} Record[]
     */
    getItems() {
        this.field.items = this.field.items || [];
        const definition = (this.field && this.field.definition && this.field.definition.lineItems) || {};
        const items = this.field.items || [];
        const activeItems = items && items.filter(item => !(item && item.attributes && item.attributes.deleted));
        activeItems.forEach((item, index) => {
            let show = true;
            if (definition.labelOnFirstLine && index > 0) {
                show = false;
            }
            this.setAttributeLabelDisplay(item, show);
        });
        return this.field.items;
    }
    /**
     * Get the fields for the item record
     *
     * @param {Record} item
     * @returns {object} Field[]
     */
    getItemFields(item) {
        const fields = item.fields || {};
        return Object.keys(fields).map(key => fields[key]);
    }
    /**
     * Remove item from array
     *
     * @param {number} index
     * @return {void}
     */
    removeItem(index) {
        this.fieldManager.removeLineItem(this.field, index);
        this.updateItems(this.field.items);
        this.triggerLineActionEvents(LineActionEvent.onLineItemRemove);
    }
    /**
     * Add item to array
     *
     * @return {void}
     */
    addEmptyItem() {
        const itemDefinition = (this.field.definition.lineItems && this.field.definition.lineItems.definition) || {};
        this.fieldManager.addLineItem(itemDefinition, this.record, this.field);
        this.triggerLineActionEvents(LineActionEvent.onLineItemAdd);
    }
    /**
     * Update items
     *
     * @param {Record[]} items
     * @return {void}
     */
    updateItems(items) {
        this.field.items = items;
    }
    /**
     * Get module
     *
     * @return {string}
     */
    getModule() {
        if (!this.record) {
            return null;
        }
        return this.record.module;
    }
    /**
     * Get Mode
     *
     * @return {string}
     */
    getMode() {
        if (this.mode === 'filter') {
            return 'edit';
        }
        return this.mode;
    }
    /**
     * Get flex direction to be used
     *
     * @returns {string} direction
     */
    getDirection() {
        let direction = 'flex-column';
        if (this.field.definition.display === 'inline') {
            direction = 'flex-row';
        }
        return direction;
    }
    /**
     * Check if is configured
     *
     * @returns {boolean} is configured
     */
    isConfigured() {
        return this.hasItemConfig();
    }
    /**
     * Check if its editable
     */
    isEditable() {
        return isEditable(this.mode);
    }
    /**
     * Show label
     *
     * @param {FieldAttribute} attribute
     * @returns {boolean}
     */
    showLabel(attribute) {
        const definition = attribute.definition || null;
        const showLabel = definition.showLabel || null;
        if (!definition || !showLabel) {
            return false;
        }
        return (showLabel.includes('*') || showLabel.includes(this.mode));
    }
    /**
     * Get message context
     *
     * @param {} item
     * @param {Record} record
     * @return {object} StringMap
     */
    getMessageContext(item, record) {
        const context = item && item.message && item.message.context || {};
        context.module = (record && record.module) || '';
        return context;
    }
    /**
     * Get message label key
     *
     * @param {} item
     * @return {string}
     */
    getMessageLabelKey(item) {
        return (item && item.message && item.message.labelKey) || '';
    }
    /**
     * Check if groupFields are configured
     *
     * @returns {boolean} has groupFields
     */
    hasItemConfig() {
        return !!(this.field.definition.lineItems && this.field.definition.lineItems.definition);
    }
    /**
     * Init Update parent subscription
     */
    initUpdateParentSubscription() {
        if (!this.field.attributes) {
            return;
        }
        Object.keys(this.field.attributes).forEach(attributeKey => {
            const attribute = this.field.attributes[attributeKey];
            if (!attribute.valueChanges$) {
                return;
            }
            this.subs.push(attribute.valueChanges$.subscribe(value => {
                const val = value.valueObject || value.valueList || value.value;
                this.setValueOnParent(attribute, val);
            }));
        });
    }
    /**
     * Set attribute value on parent
     *
     * @param {object} attribute
     * @param {} value
     * @returns {void}
     */
    setValueOnParent(attribute, value) {
        if (attribute.valuePath) {
            set(this.field, attribute.valuePath, value);
            return;
        }
        set(this.field.valueObject, attribute.name, value);
    }
    /**
     * Set attribute label display
     *
     * @param {object} itemRecord
     * @param {boolean} showLabel
     * @returns {void}
     */
    setAttributeLabelDisplay(itemRecord, showLabel) {
        const subfields = itemRecord.fields || {};
        Object.keys(subfields).forEach(subFieldKey => {
            const subField = subfields[subFieldKey];
            if (subField.type !== 'composite') {
                return;
            }
            const subFieldAttributes = subField.attributes || {};
            Object.keys(subFieldAttributes).forEach(subFieldAttributeKey => {
                const subFieldAttribute = subFieldAttributes[subFieldAttributeKey];
                const metadata = subFieldAttribute.metadata || {};
                metadata.labelDisplay = !showLabel ? 'hide' : 'default';
                subFieldAttribute.metadata = metadata;
            });
        });
    }
    /**
     * Check and if enabled, Run custom field logic on line action events
     * e.g. on line items row add/remove and so on as required
     *
     * @param {LineActionEvent} lineActionEvent
     * @returns {void}
     */
    triggerLineActionEvents(lineActionEvent) {
        var _a;
        const fieldLogics = ((_a = this.field) === null || _a === void 0 ? void 0 : _a.logic) || {};
        if (emptyObject(fieldLogics)) {
            return;
        }
        Object.keys(fieldLogics).forEach(logicKey => {
            var _a, _b;
            const fieldLogic = fieldLogics[logicKey] || null;
            const onEvent = (_b = (_a = fieldLogic === null || fieldLogic === void 0 ? void 0 : fieldLogic.params) === null || _a === void 0 ? void 0 : _a.triggerOnEvents) === null || _b === void 0 ? void 0 : _b[lineActionEvent];
            if (isTrue(onEvent)) {
                this.logic.runLogic(this.field, this.mode, this.record);
            }
        });
    }
}
BaseLineItemsComponent.decorators = [
    { type: Component, args: [{ template: '' },] }
];
BaseLineItemsComponent.ctorParameters = () => [
    { type: DataTypeFormatter },
    { type: FieldRegistry },
    { type: RecordManager },
    { type: FieldLogicManager },
    { type: FieldManager }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1saW5lLWl0ZW1zLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9maWVsZHMvYmFzZS9iYXNlLWxpbmUtaXRlbXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFvQixNQUFNLGVBQWUsQ0FBQztBQUMzRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx1REFBdUQsQ0FBQztBQUN4RixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDbkUsT0FBTyxFQUNILFdBQVcsRUFLWCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGVBQWUsRUFLbEIsTUFBTSxRQUFRLENBQUM7QUFDaEIsT0FBTyxHQUFHLE1BQU0sZUFBZSxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ3JFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSwyQ0FBMkMsQ0FBQztBQUN2RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFHaEQsTUFBTSxPQUFPLHNCQUF1QixTQUFRLGtCQUFrQjtJQUUxRCxZQUNjLGFBQWdDLEVBQ2hDLFFBQXVCLEVBQ3ZCLGFBQTRCLEVBQzVCLEtBQXdCLEVBQ3hCLFlBQTBCO1FBRXBDLEtBQUssQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFObEIsa0JBQWEsR0FBYixhQUFhLENBQW1CO1FBQ2hDLGFBQVEsR0FBUixRQUFRLENBQWU7UUFDdkIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUFDeEIsaUJBQVksR0FBWixZQUFZLENB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ZUFBZSxDQUFDLENBQUM7WUFFdkUsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQWdCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3ZFO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOzs7WUF4VEosU0FBUyxTQUFDLEVBQUMsUUFBUSxFQUFFLEVBQUUsRUFBQzs7O1lBckJqQixpQkFBaUI7WUFtQmpCLGFBQWE7WUFsQmIsYUFBYTtZQWdCYixpQkFBaUI7WUFDakIsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIE9uRGVzdHJveSwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmFzZUZpZWxkQ29tcG9uZW50fSBmcm9tICcuL2Jhc2UtZmllbGQuY29tcG9uZW50JztcbmltcG9ydCB7RGF0YVR5cGVGb3JtYXR0ZXJ9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Zvcm1hdHRlcnMvZGF0YS10eXBlLmZvcm1hdHRlci5zZXJ2aWNlJztcbmltcG9ydCB7UmVjb3JkTWFuYWdlcn0gZnJvbSAnLi4vLi4vc2VydmljZXMvcmVjb3JkL3JlY29yZC5tYW5hZ2VyJztcbmltcG9ydCB7XG4gICAgZW1wdHlPYmplY3QsXG4gICAgRmllbGQsXG4gICAgRmllbGRBdHRyaWJ1dGUsXG4gICAgRmllbGREZWZpbml0aW9uLFxuICAgIEZpZWxkTG9naWNNYXAsXG4gICAgaXNFZGl0YWJsZSxcbiAgICBpc1RydWUsXG4gICAgTGluZUFjdGlvbkV2ZW50LFxuICAgIExpbmVJdGVtc01ldGFkYXRhLFxuICAgIFJlY29yZCxcbiAgICBTdHJpbmdNYXAsXG4gICAgVmlld01vZGVcbn0gZnJvbSAnY29tbW9uJztcbmltcG9ydCBzZXQgZnJvbSAnbG9kYXNoLWVzL3NldCc7XG5pbXBvcnQge0ZpZWxkTG9naWNNYW5hZ2VyfSBmcm9tICcuLi9maWVsZC1sb2dpYy9maWVsZC1sb2dpYy5tYW5hZ2VyJztcbmltcG9ydCB7RmllbGRNYW5hZ2VyfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZWNvcmQvZmllbGQvZmllbGQubWFuYWdlcic7XG5pbXBvcnQge0ZpZWxkUmVnaXN0cnl9IGZyb20gJy4uL2ZpZWxkLnJlZ2lzdHJ5JztcblxuQENvbXBvbmVudCh7dGVtcGxhdGU6ICcnfSlcbmV4cG9ydCBjbGFzcyBCYXNlTGluZUl0ZW1zQ29tcG9uZW50IGV4dGVuZHMgQmFzZUZpZWxkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCB0eXBlRm9ybWF0dGVyOiBEYXRhVHlwZUZvcm1hdHRlcixcbiAgICAgICAgcHJvdGVjdGVkIHJlZ2lzdHJ5OiBGaWVsZFJlZ2lzdHJ5LFxuICAgICAgICBwcm90ZWN0ZWQgcmVjb3JkTWFuYWdlcjogUmVjb3JkTWFuYWdlcixcbiAgICAgICAgcHJvdGVjdGVkIGxvZ2ljOiBGaWVsZExvZ2ljTWFuYWdlcixcbiAgICAgICAgcHJvdGVjdGVkIGZpZWxkTWFuYWdlcjogRmllbGRNYW5hZ2VyXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKHR5cGVGb3JtYXR0ZXIsIGxvZ2ljKTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIubmdPbkluaXQoKTtcbiAgICAgICAgdGhpcy5pbml0VXBkYXRlUGFyZW50U3Vic2NyaXB0aW9uKCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3Vicy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGNvbXBvbmVudCB0eXBlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICAgKiBAcGFyYW0ge0ZpZWxkRGVmaW5pdGlvbn0gZGVmaW5pdGlvblxuICAgICAqIEByZXR1cm5zIHt9XG4gICAgICovXG4gICAgZ2V0Q29tcG9uZW50VHlwZSh0eXBlOiBzdHJpbmcsIGRlZmluaXRpb246IEZpZWxkRGVmaW5pdGlvbik6IGFueSB7XG4gICAgICAgIGNvbnN0IG1vZHVsZSA9ICh0aGlzLnJlY29yZCAmJiB0aGlzLnJlY29yZC5tb2R1bGUpIHx8ICdkZWZhdWx0JztcblxuICAgICAgICBjb25zdCBkaXNwbGF5VHlwZSA9IChkZWZpbml0aW9uICYmIGRlZmluaXRpb24uZGlzcGxheVR5cGUpIHx8ICcnO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJlZ2lzdHJ5LmdldERpc3BsYXlUeXBlKG1vZHVsZSwgdHlwZSwgZGlzcGxheVR5cGUsIHRoaXMuZ2V0TW9kZSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGxpc3Qgb2YgaXRlbXNcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IFJlY29yZFtdXG4gICAgICovXG4gICAgZ2V0SXRlbXMoKTogUmVjb3JkW10ge1xuICAgICAgICB0aGlzLmZpZWxkLml0ZW1zID0gdGhpcy5maWVsZC5pdGVtcyB8fCBbXTtcblxuICAgICAgICBjb25zdCBkZWZpbml0aW9uID0gKHRoaXMuZmllbGQgJiYgdGhpcy5maWVsZC5kZWZpbml0aW9uICYmIHRoaXMuZmllbGQuZGVmaW5pdGlvbi5saW5lSXRlbXMpIHx8IHt9IGFzIExpbmVJdGVtc01ldGFkYXRhO1xuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMuZmllbGQuaXRlbXMgfHwgW107XG4gICAgICAgIGNvbnN0IGFjdGl2ZUl0ZW1zID0gaXRlbXMgJiYgaXRlbXMuZmlsdGVyKGl0ZW0gPT4gIShpdGVtICYmIGl0ZW0uYXR0cmlidXRlcyAmJiBpdGVtLmF0dHJpYnV0ZXMuZGVsZXRlZCkpO1xuXG4gICAgICAgIGFjdGl2ZUl0ZW1zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBsZXQgc2hvdyA9IHRydWU7XG4gICAgICAgICAgICBpZiAoZGVmaW5pdGlvbi5sYWJlbE9uRmlyc3RMaW5lICYmIGluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgIHNob3cgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlTGFiZWxEaXNwbGF5KGl0ZW0sIHNob3cpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5maWVsZC5pdGVtcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGZpZWxkcyBmb3IgdGhlIGl0ZW0gcmVjb3JkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlY29yZH0gaXRlbVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IEZpZWxkW11cbiAgICAgKi9cbiAgICBnZXRJdGVtRmllbGRzKGl0ZW06IFJlY29yZCk6IEZpZWxkW10ge1xuICAgICAgICBjb25zdCBmaWVsZHMgPSBpdGVtLmZpZWxkcyB8fCB7fTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGZpZWxkcykubWFwKGtleSA9PiBmaWVsZHNba2V5XSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGl0ZW0gZnJvbSBhcnJheVxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICByZW1vdmVJdGVtKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLmZpZWxkTWFuYWdlci5yZW1vdmVMaW5lSXRlbShcbiAgICAgICAgICAgIHRoaXMuZmllbGQsXG4gICAgICAgICAgICBpbmRleFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMudXBkYXRlSXRlbXModGhpcy5maWVsZC5pdGVtcyk7XG5cbiAgICAgICAgdGhpcy50cmlnZ2VyTGluZUFjdGlvbkV2ZW50cyhMaW5lQWN0aW9uRXZlbnQub25MaW5lSXRlbVJlbW92ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGl0ZW0gdG8gYXJyYXlcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgYWRkRW1wdHlJdGVtKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBpdGVtRGVmaW5pdGlvbiA9ICh0aGlzLmZpZWxkLmRlZmluaXRpb24ubGluZUl0ZW1zICYmIHRoaXMuZmllbGQuZGVmaW5pdGlvbi5saW5lSXRlbXMuZGVmaW5pdGlvbikgfHwge307XG5cbiAgICAgICAgdGhpcy5maWVsZE1hbmFnZXIuYWRkTGluZUl0ZW0oXG4gICAgICAgICAgICBpdGVtRGVmaW5pdGlvbixcbiAgICAgICAgICAgIHRoaXMucmVjb3JkLFxuICAgICAgICAgICAgdGhpcy5maWVsZFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMudHJpZ2dlckxpbmVBY3Rpb25FdmVudHMoTGluZUFjdGlvbkV2ZW50Lm9uTGluZUl0ZW1BZGQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSBpdGVtc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtSZWNvcmRbXX0gaXRlbXNcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHVwZGF0ZUl0ZW1zKGl0ZW1zOiBSZWNvcmRbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmZpZWxkLml0ZW1zID0gaXRlbXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IG1vZHVsZVxuICAgICAqXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldE1vZHVsZSgpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMucmVjb3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlY29yZC5tb2R1bGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IE1vZGVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRNb2RlKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLm1vZGUgPT09ICdmaWx0ZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2VkaXQnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgZmxleCBkaXJlY3Rpb24gdG8gYmUgdXNlZFxuICAgICAqXG4gICAgICogQHJldHVybnMge3N0cmluZ30gZGlyZWN0aW9uXG4gICAgICovXG4gICAgZ2V0RGlyZWN0aW9uKCk6IHN0cmluZyB7XG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSAnZmxleC1jb2x1bW4nO1xuXG4gICAgICAgIGlmICh0aGlzLmZpZWxkLmRlZmluaXRpb24uZGlzcGxheSA9PT0gJ2lubGluZScpIHtcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9ICdmbGV4LXJvdyc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGlyZWN0aW9uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGlzIGNvbmZpZ3VyZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBpcyBjb25maWd1cmVkXG4gICAgICovXG4gICAgaXNDb25maWd1cmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNJdGVtQ29uZmlnKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgaXRzIGVkaXRhYmxlXG4gICAgICovXG4gICAgaXNFZGl0YWJsZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGlzRWRpdGFibGUodGhpcy5tb2RlIGFzIFZpZXdNb2RlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IGxhYmVsXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0ZpZWxkQXR0cmlidXRlfSBhdHRyaWJ1dGVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBzaG93TGFiZWwoYXR0cmlidXRlOiBGaWVsZEF0dHJpYnV0ZSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBkZWZpbml0aW9uID0gYXR0cmlidXRlLmRlZmluaXRpb24gfHwgbnVsbDtcbiAgICAgICAgY29uc3Qgc2hvd0xhYmVsID0gZGVmaW5pdGlvbi5zaG93TGFiZWwgfHwgbnVsbDtcblxuICAgICAgICBpZiAoIWRlZmluaXRpb24gfHwgIXNob3dMYWJlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChzaG93TGFiZWwuaW5jbHVkZXMoJyonKSB8fCBzaG93TGFiZWwuaW5jbHVkZXModGhpcy5tb2RlKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IG1lc3NhZ2UgY29udGV4dFxuICAgICAqXG4gICAgICogQHBhcmFtIHt9IGl0ZW1cbiAgICAgKiBAcGFyYW0ge1JlY29yZH0gcmVjb3JkXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBTdHJpbmdNYXBcbiAgICAgKi9cbiAgICBnZXRNZXNzYWdlQ29udGV4dChpdGVtOiBhbnksIHJlY29yZDogUmVjb3JkKTogU3RyaW5nTWFwIHtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IGl0ZW0gJiYgaXRlbS5tZXNzYWdlICYmIGl0ZW0ubWVzc2FnZS5jb250ZXh0IHx8IHt9O1xuICAgICAgICBjb250ZXh0Lm1vZHVsZSA9IChyZWNvcmQgJiYgcmVjb3JkLm1vZHVsZSkgfHwgJyc7XG5cbiAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IG1lc3NhZ2UgbGFiZWwga2V5XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge30gaXRlbVxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRNZXNzYWdlTGFiZWxLZXkoaXRlbTogYW55KTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChpdGVtICYmIGl0ZW0ubWVzc2FnZSAmJiBpdGVtLm1lc3NhZ2UubGFiZWxLZXkpIHx8ICcnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGdyb3VwRmllbGRzIGFyZSBjb25maWd1cmVkXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gaGFzIGdyb3VwRmllbGRzXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGhhc0l0ZW1Db25maWcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhISh0aGlzLmZpZWxkLmRlZmluaXRpb24ubGluZUl0ZW1zICYmIHRoaXMuZmllbGQuZGVmaW5pdGlvbi5saW5lSXRlbXMuZGVmaW5pdGlvbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdCBVcGRhdGUgcGFyZW50IHN1YnNjcmlwdGlvblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbml0VXBkYXRlUGFyZW50U3Vic2NyaXB0aW9uKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuZmllbGQuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5maWVsZC5hdHRyaWJ1dGVzKS5mb3JFYWNoKGF0dHJpYnV0ZUtleSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSB0aGlzLmZpZWxkLmF0dHJpYnV0ZXNbYXR0cmlidXRlS2V5XTtcblxuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGUudmFsdWVDaGFuZ2VzJCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zdWJzLnB1c2goYXR0cmlidXRlLnZhbHVlQ2hhbmdlcyQuc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWwgPSB2YWx1ZS52YWx1ZU9iamVjdCB8fCB2YWx1ZS52YWx1ZUxpc3QgfHwgdmFsdWUudmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZU9uUGFyZW50KGF0dHJpYnV0ZSwgdmFsKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IGF0dHJpYnV0ZSB2YWx1ZSBvbiBwYXJlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhdHRyaWJ1dGVcbiAgICAgKiBAcGFyYW0ge30gdmFsdWVcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2V0VmFsdWVPblBhcmVudChhdHRyaWJ1dGU6IEZpZWxkQXR0cmlidXRlLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgICAgIGlmIChhdHRyaWJ1dGUudmFsdWVQYXRoKSB7XG4gICAgICAgICAgICBzZXQodGhpcy5maWVsZCwgYXR0cmlidXRlLnZhbHVlUGF0aCwgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0KHRoaXMuZmllbGQudmFsdWVPYmplY3QsIGF0dHJpYnV0ZS5uYW1lLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IGF0dHJpYnV0ZSBsYWJlbCBkaXNwbGF5XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gaXRlbVJlY29yZFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2hvd0xhYmVsXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNldEF0dHJpYnV0ZUxhYmVsRGlzcGxheShpdGVtUmVjb3JkOiBSZWNvcmQsIHNob3dMYWJlbDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBjb25zdCBzdWJmaWVsZHMgPSBpdGVtUmVjb3JkLmZpZWxkcyB8fCB7fTtcblxuICAgICAgICBPYmplY3Qua2V5cyhzdWJmaWVsZHMpLmZvckVhY2goc3ViRmllbGRLZXkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3ViRmllbGQgPSBzdWJmaWVsZHNbc3ViRmllbGRLZXldO1xuXG4gICAgICAgICAgICBpZiAoc3ViRmllbGQudHlwZSAhPT0gJ2NvbXBvc2l0ZScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHN1YkZpZWxkQXR0cmlidXRlcyA9IHN1YkZpZWxkLmF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhzdWJGaWVsZEF0dHJpYnV0ZXMpLmZvckVhY2goc3ViRmllbGRBdHRyaWJ1dGVLZXkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1YkZpZWxkQXR0cmlidXRlID0gc3ViRmllbGRBdHRyaWJ1dGVzW3N1YkZpZWxkQXR0cmlidXRlS2V5XTtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHN1YkZpZWxkQXR0cmlidXRlLm1ldGFkYXRhIHx8IHt9O1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmxhYmVsRGlzcGxheSA9ICFzaG93TGFiZWwgPyAnaGlkZScgOiAnZGVmYXVsdCc7XG4gICAgICAgICAgICAgICAgc3ViRmllbGRBdHRyaWJ1dGUubWV0YWRhdGEgPSBtZXRhZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBhbmQgaWYgZW5hYmxlZCwgUnVuIGN1c3RvbSBmaWVsZCBsb2dpYyBvbiBsaW5lIGFjdGlvbiBldmVudHNcbiAgICAgKiBlLmcuIG9uIGxpbmUgaXRlbXMgcm93IGFkZC9yZW1vdmUgYW5kIHNvIG9uIGFzIHJlcXVpcmVkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0xpbmVBY3Rpb25FdmVudH0gbGluZUFjdGlvbkV2ZW50XG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgcHJvdGVjdGVkIHRyaWdnZXJMaW5lQWN0aW9uRXZlbnRzKGxpbmVBY3Rpb25FdmVudDogTGluZUFjdGlvbkV2ZW50KTogdm9pZCB7XG5cbiAgICAgICAgY29uc3QgZmllbGRMb2dpY3MgPSB0aGlzLmZpZWxkPy5sb2dpYyB8fCB7fSBhcyBGaWVsZExvZ2ljTWFwO1xuXG4gICAgICAgIGlmIChlbXB0eU9iamVjdChmaWVsZExvZ2ljcykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5rZXlzKGZpZWxkTG9naWNzKS5mb3JFYWNoKGxvZ2ljS2V5ID0+IHtcblxuICAgICAgICAgICAgY29uc3QgZmllbGRMb2dpYyA9IGZpZWxkTG9naWNzW2xvZ2ljS2V5XSB8fCBudWxsO1xuXG4gICAgICAgICAgICBjb25zdCBvbkV2ZW50ID0gZmllbGRMb2dpYz8ucGFyYW1zPy50cmlnZ2VyT25FdmVudHM/LltsaW5lQWN0aW9uRXZlbnRdO1xuXG4gICAgICAgICAgICBpZiAoaXNUcnVlKG9uRXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dpYy5ydW5Mb2dpYyh0aGlzLmZpZWxkLCB0aGlzLm1vZGUgYXMgVmlld01vZGUsIHRoaXMucmVjb3JkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19