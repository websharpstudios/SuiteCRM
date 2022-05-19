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
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
export class ModalRecordListTableAdapter {
    /**
     * Get table config
     *
     * @param {object} store to use
     * @returns {object} TableConfig
     */
    getTable(store) {
        return {
            showHeader: true,
            showFooter: true,
            klass: 'light-table',
            module: store.recordList.getModule(),
            columns: store.columns$.pipe(map(columns => this.mapColumns(store, columns))),
            sort$: store.recordList.sort$,
            maxColumns$: of(5),
            loading$: store.recordList.loading$,
            dataSource: store.recordList,
            pagination: store.recordList,
            toggleRecordSelection: (id) => {
                store.recordList.toggleSelection(id);
            },
            updateSorting: (orderBy, sortOrder) => {
                store.recordList.updateSorting(orderBy, sortOrder);
            },
        };
    }
    /**
     * Parse and override column definitions
     *
     * @param {object} store to use
     * @param {[]} columns to map
     * @returns {[]} ColumnDefinition[]
     */
    mapColumns(store, columns) {
        const mappedColumns = [];
        columns.forEach(column => {
            const mapped = Object.assign({}, column);
            const metadata = column.metadata || {};
            mapped.metadata = Object.assign({}, metadata);
            this.disableRelateFieldsLink(mapped);
            this.addLinkSelectHandler(store, mapped);
            mappedColumns.push(mapped);
        });
        return mappedColumns;
    }
    /**
     * Disable link for relate fields
     *
     * @param {object} definition to update
     */
    disableRelateFieldsLink(definition) {
        if (definition.type !== 'relate') {
            return;
        }
        definition.link = false;
        definition.metadata.link = false;
    }
    /**
     * Add onClick handler for link fields
     *
     * @param {object} store to use
     * @param {object} definition to update
     */
    addLinkSelectHandler(store, definition) {
        if (!definition.link) {
            return;
        }
        definition.metadata.onClick = (field, record) => {
            store.recordList.toggleSelection(record.id);
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9jb250YWluZXJzL3JlY29yZC1saXN0LW1vZGFsL2FkYXB0ZXJzL3RhYmxlLmFkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQUVILE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFeEIsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBS25DLE1BQU0sT0FBTywyQkFBMkI7SUFFcEM7Ozs7O09BS0c7SUFDSCxRQUFRLENBQUMsS0FBMkI7UUFDaEMsT0FBTztZQUNILFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLEtBQUssRUFBRSxhQUFhO1lBQ3BCLE1BQU0sRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRTtZQUVwQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM3RSxLQUFLLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLO1lBQzdCLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLFFBQVEsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVE7WUFFbkMsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQzVCLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUU1QixxQkFBcUIsRUFBRSxDQUFDLEVBQVUsRUFBUSxFQUFFO2dCQUN4QyxLQUFLLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN6QyxDQUFDO1lBRUQsYUFBYSxFQUFFLENBQUMsT0FBZSxFQUFFLFNBQXdCLEVBQVEsRUFBRTtnQkFDL0QsS0FBSyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7U0FDVyxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDTyxVQUFVLENBQUMsS0FBMkIsRUFBRSxPQUEyQjtRQUN6RSxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFFekIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNyQixNQUFNLE1BQU0scUJBQU8sTUFBTSxDQUFDLENBQUM7WUFDM0IsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7WUFDdkMsTUFBTSxDQUFDLFFBQVEscUJBQU8sUUFBUSxDQUFDLENBQUM7WUFFaEMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFekMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sdUJBQXVCLENBQUMsVUFBNEI7UUFDMUQsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM5QixPQUFPO1NBQ1Y7UUFDRCxVQUFVLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUN4QixVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDckMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sb0JBQW9CLENBQUMsS0FBMkIsRUFBRSxVQUE0QjtRQUNwRixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRTtZQUNsQixPQUFPO1NBQ1Y7UUFFRCxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLEtBQVksRUFBRSxNQUFjLEVBQVEsRUFBRTtZQUNqRSxLQUFLLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDO0lBQ04sQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge29mfSBmcm9tICdyeGpzJztcbmltcG9ydCB7Q29sdW1uRGVmaW5pdGlvbiwgRmllbGQsIFJlY29yZCwgU29ydERpcmVjdGlvbn0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1JlY29yZExpc3RNb2RhbFRhYmxlQWRhcHRlckludGVyZmFjZX0gZnJvbSAnLi9hZGFwdGVyLm1vZGVsJztcbmltcG9ydCB7UmVjb3JkTGlzdE1vZGFsU3RvcmV9IGZyb20gJy4uL3N0b3JlL3JlY29yZC1saXN0LW1vZGFsL3JlY29yZC1saXN0LW1vZGFsLnN0b3JlJztcbmltcG9ydCB7VGFibGVDb25maWd9IGZyb20gJy4uLy4uLy4uL2NvbXBvbmVudHMvdGFibGUvdGFibGUubW9kZWwnO1xuXG5leHBvcnQgY2xhc3MgTW9kYWxSZWNvcmRMaXN0VGFibGVBZGFwdGVyIGltcGxlbWVudHMgUmVjb3JkTGlzdE1vZGFsVGFibGVBZGFwdGVySW50ZXJmYWNlIHtcblxuICAgIC8qKlxuICAgICAqIEdldCB0YWJsZSBjb25maWdcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdG9yZSB0byB1c2VcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBUYWJsZUNvbmZpZ1xuICAgICAqL1xuICAgIGdldFRhYmxlKHN0b3JlOiBSZWNvcmRMaXN0TW9kYWxTdG9yZSk6IFRhYmxlQ29uZmlnIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNob3dIZWFkZXI6IHRydWUsXG4gICAgICAgICAgICBzaG93Rm9vdGVyOiB0cnVlLFxuICAgICAgICAgICAga2xhc3M6ICdsaWdodC10YWJsZScsXG4gICAgICAgICAgICBtb2R1bGU6IHN0b3JlLnJlY29yZExpc3QuZ2V0TW9kdWxlKCksXG5cbiAgICAgICAgICAgIGNvbHVtbnM6IHN0b3JlLmNvbHVtbnMkLnBpcGUobWFwKGNvbHVtbnMgPT4gdGhpcy5tYXBDb2x1bW5zKHN0b3JlLCBjb2x1bW5zKSkpLFxuICAgICAgICAgICAgc29ydCQ6IHN0b3JlLnJlY29yZExpc3Quc29ydCQsXG4gICAgICAgICAgICBtYXhDb2x1bW5zJDogb2YoNSksXG4gICAgICAgICAgICBsb2FkaW5nJDogc3RvcmUucmVjb3JkTGlzdC5sb2FkaW5nJCxcblxuICAgICAgICAgICAgZGF0YVNvdXJjZTogc3RvcmUucmVjb3JkTGlzdCxcbiAgICAgICAgICAgIHBhZ2luYXRpb246IHN0b3JlLnJlY29yZExpc3QsXG5cbiAgICAgICAgICAgIHRvZ2dsZVJlY29yZFNlbGVjdGlvbjogKGlkOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICBzdG9yZS5yZWNvcmRMaXN0LnRvZ2dsZVNlbGVjdGlvbihpZCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB1cGRhdGVTb3J0aW5nOiAob3JkZXJCeTogc3RyaW5nLCBzb3J0T3JkZXI6IFNvcnREaXJlY3Rpb24pOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICBzdG9yZS5yZWNvcmRMaXN0LnVwZGF0ZVNvcnRpbmcob3JkZXJCeSwgc29ydE9yZGVyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0gYXMgVGFibGVDb25maWc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgYW5kIG92ZXJyaWRlIGNvbHVtbiBkZWZpbml0aW9uc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHN0b3JlIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7W119IGNvbHVtbnMgdG8gbWFwXG4gICAgICogQHJldHVybnMge1tdfSBDb2x1bW5EZWZpbml0aW9uW11cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgbWFwQ29sdW1ucyhzdG9yZTogUmVjb3JkTGlzdE1vZGFsU3RvcmUsIGNvbHVtbnM6IENvbHVtbkRlZmluaXRpb25bXSk6IENvbHVtbkRlZmluaXRpb25bXSB7XG4gICAgICAgIGNvbnN0IG1hcHBlZENvbHVtbnMgPSBbXTtcblxuICAgICAgICBjb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1hcHBlZCA9IHsuLi5jb2x1bW59O1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBjb2x1bW4ubWV0YWRhdGEgfHwge307XG4gICAgICAgICAgICBtYXBwZWQubWV0YWRhdGEgPSB7Li4ubWV0YWRhdGF9O1xuXG4gICAgICAgICAgICB0aGlzLmRpc2FibGVSZWxhdGVGaWVsZHNMaW5rKG1hcHBlZCk7XG4gICAgICAgICAgICB0aGlzLmFkZExpbmtTZWxlY3RIYW5kbGVyKHN0b3JlLCBtYXBwZWQpO1xuXG4gICAgICAgICAgICBtYXBwZWRDb2x1bW5zLnB1c2gobWFwcGVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG1hcHBlZENvbHVtbnM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGlzYWJsZSBsaW5rIGZvciByZWxhdGUgZmllbGRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGVmaW5pdGlvbiB0byB1cGRhdGVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZGlzYWJsZVJlbGF0ZUZpZWxkc0xpbmsoZGVmaW5pdGlvbjogQ29sdW1uRGVmaW5pdGlvbik6IHZvaWQge1xuICAgICAgICBpZiAoZGVmaW5pdGlvbi50eXBlICE9PSAncmVsYXRlJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRlZmluaXRpb24ubGluayA9IGZhbHNlO1xuICAgICAgICBkZWZpbml0aW9uLm1ldGFkYXRhLmxpbmsgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgb25DbGljayBoYW5kbGVyIGZvciBsaW5rIGZpZWxkc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHN0b3JlIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkZWZpbml0aW9uIHRvIHVwZGF0ZVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhZGRMaW5rU2VsZWN0SGFuZGxlcihzdG9yZTogUmVjb3JkTGlzdE1vZGFsU3RvcmUsIGRlZmluaXRpb246IENvbHVtbkRlZmluaXRpb24pOiB2b2lkIHtcbiAgICAgICAgaWYgKCFkZWZpbml0aW9uLmxpbmspIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlZmluaXRpb24ubWV0YWRhdGEub25DbGljayA9IChmaWVsZDogRmllbGQsIHJlY29yZDogUmVjb3JkKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBzdG9yZS5yZWNvcmRMaXN0LnRvZ2dsZVNlbGVjdGlvbihyZWNvcmQuaWQpO1xuICAgICAgICB9O1xuICAgIH1cbn1cbiJdfQ==