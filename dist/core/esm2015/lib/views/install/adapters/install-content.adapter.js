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
import { combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MetadataStore } from '../../../store/metadata/metadata.store.service';
import { LanguageStore } from '../../../store/language/language.store';
import { InstallViewStore } from '../store/install-view/install-view.store';
import { InstallActionManager } from '../actions/install-action-manager.service';
export class InstallContentAdapter {
    constructor(store, metadata, language, actions) {
        this.store = store;
        this.metadata = metadata;
        this.language = language;
        this.actions = actions;
    }
    getEditAction() {
    }
    getDisplayConfig() {
        return combineLatest([this.store.getMetadata$(), this.store.mode$]).pipe(map(([meta, mode]) => {
            const layout = this.getLayout(meta);
            const maxColumns = meta.templateMeta.maxColumns || 2;
            const tabDefs = meta.templateMeta.tabDefs;
            return {
                layout,
                mode,
                maxColumns,
                tabDefs
            };
        }));
    }
    getPanels() {
        return combineLatest([this.store.getMetadata$(), this.store.stagingRecord$, this.language.vm$]).pipe(map(([meta, record, languages]) => {
            const panels = [];
            const module = (record && record.module) || '';
            meta.panels.forEach(panelDefinition => {
                const label = this.language.getFieldLabel(panelDefinition.key.toUpperCase(), module, languages);
                const panel = { label, key: panelDefinition.key, rows: [] };
                panelDefinition.rows.forEach(rowDefinition => {
                    const row = { cols: [] };
                    rowDefinition.cols.forEach(cellDefinition => {
                        row.cols.push(Object.assign({}, cellDefinition));
                    });
                    panel.rows.push(row);
                });
                panels.push(panel);
            });
            return panels;
        }));
    }
    getRecord() {
        return this.store.stagingRecord$;
    }
    getLayout(meta) {
        let layout = 'panels';
        if (meta.templateMeta.useTabs) {
            layout = 'tabs';
        }
        return layout;
    }
}
InstallContentAdapter.decorators = [
    { type: Injectable }
];
InstallContentAdapter.ctorParameters = () => [
    { type: InstallViewStore },
    { type: MetadataStore },
    { type: LanguageStore },
    { type: InstallActionManager }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC1jb250ZW50LmFkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvdmlld3MvaW5zdGFsbC9hZGFwdGVycy9pbnN0YWxsLWNvbnRlbnQuYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUMvQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuQyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0RBQWdELENBQUM7QUFFN0UsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBQ3JFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDBDQUEwQyxDQUFDO0FBQzFFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBSS9FLE1BQU0sT0FBTyxxQkFBcUI7SUFHOUIsWUFDYyxLQUF1QixFQUN2QixRQUF1QixFQUN2QixRQUF1QixFQUN2QixPQUE2QjtRQUg3QixVQUFLLEdBQUwsS0FBSyxDQUFrQjtRQUN2QixhQUFRLEdBQVIsUUFBUSxDQUFlO1FBQ3ZCLGFBQVEsR0FBUixRQUFRLENBQWU7UUFDdkIsWUFBTyxHQUFQLE9BQU8sQ0FBc0I7SUFFM0MsQ0FBQztJQUVELGFBQWE7SUFDYixDQUFDO0lBRUQsZ0JBQWdCO1FBRVosT0FBTyxhQUFhLENBQ2hCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUNoRCxDQUFDLElBQUksQ0FDRixHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ2pCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO1lBQ3JELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDO1lBRTFDLE9BQU87Z0JBQ0gsTUFBTTtnQkFDTixJQUFJO2dCQUNKLFVBQVU7Z0JBQ1YsT0FBTzthQUNhLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQ0wsQ0FBQztJQUNOLENBQUM7SUFFRCxTQUFTO1FBQ0wsT0FBTyxhQUFhLENBQ2hCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUM1RSxDQUFDLElBQUksQ0FDRixHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLEVBQUUsRUFBRTtZQUU5QixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDbEIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUUvQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDbEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ2hHLE1BQU0sS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxlQUFlLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQVUsQ0FBQztnQkFFbkUsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7b0JBQ3pDLE1BQU0sR0FBRyxHQUFHLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBYSxDQUFDO29CQUNuQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRTt3QkFDeEMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLG1CQUFLLGNBQWMsRUFBRSxDQUFDO29CQUN2QyxDQUFDLENBQUMsQ0FBQztvQkFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDekIsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sTUFBTSxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUNMLENBQUM7SUFDTixDQUFDO0lBRUQsU0FBUztRQUNMLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUM7SUFDckMsQ0FBQztJQUVTLFNBQVMsQ0FBQyxJQUF5QjtRQUN6QyxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDdEIsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRTtZQUMzQixNQUFNLEdBQUcsTUFBTSxDQUFDO1NBQ25CO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7O1lBM0VKLFVBQVU7OztZQUpILGdCQUFnQjtZQUhoQixhQUFhO1lBRWIsYUFBYTtZQUViLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtQYW5lbCwgUGFuZWxSb3csIFJlY29yZH0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7TWV0YWRhdGFTdG9yZX0gZnJvbSAnLi4vLi4vLi4vc3RvcmUvbWV0YWRhdGEvbWV0YWRhdGEuc3RvcmUuc2VydmljZSc7XG5pbXBvcnQge1JlY29yZENvbnRlbnRDb25maWcsIFJlY29yZENvbnRlbnREYXRhU291cmNlfSBmcm9tICcuLi8uLi8uLi9jb21wb25lbnRzL3JlY29yZC1jb250ZW50L3JlY29yZC1jb250ZW50Lm1vZGVsJztcbmltcG9ydCB7TGFuZ3VhZ2VTdG9yZX0gZnJvbSAnLi4vLi4vLi4vc3RvcmUvbGFuZ3VhZ2UvbGFuZ3VhZ2Uuc3RvcmUnO1xuaW1wb3J0IHtJbnN0YWxsVmlld1N0b3JlfSBmcm9tICcuLi9zdG9yZS9pbnN0YWxsLXZpZXcvaW5zdGFsbC12aWV3LnN0b3JlJztcbmltcG9ydCB7SW5zdGFsbEFjdGlvbk1hbmFnZXJ9IGZyb20gJy4uL2FjdGlvbnMvaW5zdGFsbC1hY3Rpb24tbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7SW5zdGFsbFZpZXdNZXRhZGF0YX0gZnJvbSAnLi4vc3RvcmUvaW5zdGFsbC12aWV3L2luc3RhbGwtdmlldy5zdG9yZS5tb2RlbCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBJbnN0YWxsQ29udGVudEFkYXB0ZXIgaW1wbGVtZW50cyBSZWNvcmRDb250ZW50RGF0YVNvdXJjZSB7XG4gICAgaW5saW5lRWRpdDogdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgc3RvcmU6IEluc3RhbGxWaWV3U3RvcmUsXG4gICAgICAgIHByb3RlY3RlZCBtZXRhZGF0YTogTWV0YWRhdGFTdG9yZSxcbiAgICAgICAgcHJvdGVjdGVkIGxhbmd1YWdlOiBMYW5ndWFnZVN0b3JlLFxuICAgICAgICBwcm90ZWN0ZWQgYWN0aW9uczogSW5zdGFsbEFjdGlvbk1hbmFnZXJcbiAgICApIHtcbiAgICB9XG5cbiAgICBnZXRFZGl0QWN0aW9uKCk6IHZvaWQge1xuICAgIH1cblxuICAgIGdldERpc3BsYXlDb25maWcoKTogT2JzZXJ2YWJsZTxSZWNvcmRDb250ZW50Q29uZmlnPiB7XG5cbiAgICAgICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoXG4gICAgICAgICAgICBbdGhpcy5zdG9yZS5nZXRNZXRhZGF0YSQoKSwgdGhpcy5zdG9yZS5tb2RlJF1cbiAgICAgICAgKS5waXBlKFxuICAgICAgICAgICAgbWFwKChbbWV0YSwgbW9kZV0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXlvdXQgPSB0aGlzLmdldExheW91dChtZXRhKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXhDb2x1bW5zID0gbWV0YS50ZW1wbGF0ZU1ldGEubWF4Q29sdW1ucyB8fCAyO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhYkRlZnMgPSBtZXRhLnRlbXBsYXRlTWV0YS50YWJEZWZzO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgbGF5b3V0LFxuICAgICAgICAgICAgICAgICAgICBtb2RlLFxuICAgICAgICAgICAgICAgICAgICBtYXhDb2x1bW5zLFxuICAgICAgICAgICAgICAgICAgICB0YWJEZWZzXG4gICAgICAgICAgICAgICAgfSBhcyBSZWNvcmRDb250ZW50Q29uZmlnO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXRQYW5lbHMoKTogT2JzZXJ2YWJsZTxQYW5lbFtdPiB7XG4gICAgICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFxuICAgICAgICAgICAgW3RoaXMuc3RvcmUuZ2V0TWV0YWRhdGEkKCksIHRoaXMuc3RvcmUuc3RhZ2luZ1JlY29yZCQsIHRoaXMubGFuZ3VhZ2Uudm0kXVxuICAgICAgICApLnBpcGUoXG4gICAgICAgICAgICBtYXAoKFttZXRhLCByZWNvcmQsIGxhbmd1YWdlc10pID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHBhbmVscyA9IFtdO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IChyZWNvcmQgJiYgcmVjb3JkLm1vZHVsZSkgfHwgJyc7XG5cbiAgICAgICAgICAgICAgICBtZXRhLnBhbmVscy5mb3JFYWNoKHBhbmVsRGVmaW5pdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcy5sYW5ndWFnZS5nZXRGaWVsZExhYmVsKHBhbmVsRGVmaW5pdGlvbi5rZXkudG9VcHBlckNhc2UoKSwgbW9kdWxlLCBsYW5ndWFnZXMpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYW5lbCA9IHtsYWJlbCwga2V5OiBwYW5lbERlZmluaXRpb24ua2V5LCByb3dzOiBbXX0gYXMgUGFuZWw7XG5cbiAgICAgICAgICAgICAgICAgICAgcGFuZWxEZWZpbml0aW9uLnJvd3MuZm9yRWFjaChyb3dEZWZpbml0aW9uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdyA9IHtjb2xzOiBbXX0gYXMgUGFuZWxSb3c7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dEZWZpbml0aW9uLmNvbHMuZm9yRWFjaChjZWxsRGVmaW5pdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LmNvbHMucHVzaCh7Li4uY2VsbERlZmluaXRpb259KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFuZWwucm93cy5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHBhbmVscy5wdXNoKHBhbmVsKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBwYW5lbHM7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldFJlY29yZCgpOiBPYnNlcnZhYmxlPFJlY29yZD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS5zdGFnaW5nUmVjb3JkJDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0TGF5b3V0KG1ldGE6IEluc3RhbGxWaWV3TWV0YWRhdGEpOiBzdHJpbmcge1xuICAgICAgICBsZXQgbGF5b3V0ID0gJ3BhbmVscyc7XG4gICAgICAgIGlmIChtZXRhLnRlbXBsYXRlTWV0YS51c2VUYWJzKSB7XG4gICAgICAgICAgICBsYXlvdXQgPSAndGFicyc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGF5b3V0O1xuICAgIH1cbn1cbiJdfQ==