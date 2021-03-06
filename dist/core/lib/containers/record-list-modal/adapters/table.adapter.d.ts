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
import { ColumnDefinition } from 'common';
import { RecordListModalTableAdapterInterface } from './adapter.model';
import { RecordListModalStore } from '../store/record-list-modal/record-list-modal.store';
import { TableConfig } from '../../../components/table/table.model';
export declare class ModalRecordListTableAdapter implements RecordListModalTableAdapterInterface {
    /**
     * Get table config
     *
     * @param {object} store to use
     * @returns {object} TableConfig
     */
    getTable(store: RecordListModalStore): TableConfig;
    /**
     * Parse and override column definitions
     *
     * @param {object} store to use
     * @param {[]} columns to map
     * @returns {[]} ColumnDefinition[]
     */
    protected mapColumns(store: RecordListModalStore, columns: ColumnDefinition[]): ColumnDefinition[];
    /**
     * Disable link for relate fields
     *
     * @param {object} definition to update
     */
    protected disableRelateFieldsLink(definition: ColumnDefinition): void;
    /**
     * Add onClick handler for link fields
     *
     * @param {object} store to use
     * @param {object} definition to update
     */
    protected addLinkSelectHandler(store: RecordListModalStore, definition: ColumnDefinition): void;
}
