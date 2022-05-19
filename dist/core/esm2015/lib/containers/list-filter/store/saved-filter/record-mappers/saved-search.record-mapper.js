import { deepClone } from 'common';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class SavedSearchRecordMapper {
    getKey() {
        return 'criteria';
    }
    map(record) {
        const savedFilter = record;
        if (savedFilter.criteria) {
            const contents = savedFilter.attributes.contents || {};
            contents.filters = deepClone(savedFilter.criteria.filters || {});
            if (record.fields.name) {
                contents.name = record.fields.name.value;
                savedFilter.criteria.name = contents.name;
            }
            if (record.fields.orderBy) {
                contents.orderBy = record.fields.orderBy.value;
                savedFilter.criteria.orderBy = contents.orderBy;
            }
            if (record.fields.sortOrder) {
                contents.sortOrder = record.fields.sortOrder.value;
                savedFilter.criteria.sortOrder = contents.sortOrder;
            }
            if (record.attributes.search_module) {
                contents.searchModule = record.attributes.search_module;
                savedFilter.criteria.searchModule = contents.searchModule;
            }
            savedFilter.attributes.contents = contents;
        }
        let key = savedFilter.key || '';
        if (key === 'default') {
            key = '';
        }
        savedFilter.id = key;
        savedFilter.attributes.id = key;
    }
}
SavedSearchRecordMapper.ɵprov = i0.ɵɵdefineInjectable({ factory: function SavedSearchRecordMapper_Factory() { return new SavedSearchRecordMapper(); }, token: SavedSearchRecordMapper, providedIn: "root" });
SavedSearchRecordMapper.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F2ZWQtc2VhcmNoLnJlY29yZC1tYXBwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvY29udGFpbmVycy9saXN0LWZpbHRlci9zdG9yZS9zYXZlZC1maWx0ZXIvcmVjb3JkLW1hcHBlcnMvc2F2ZWQtc2VhcmNoLnJlY29yZC1tYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBdUIsTUFBTSxRQUFRLENBQUM7QUFDdkQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFNekMsTUFBTSxPQUFPLHVCQUF1QjtJQUVoQyxNQUFNO1FBQ0YsT0FBTyxVQUFVLENBQUM7SUFDdEIsQ0FBQztJQUVELEdBQUcsQ0FBQyxNQUFjO1FBQ2QsTUFBTSxXQUFXLEdBQWdCLE1BQU0sQ0FBQztRQUN4QyxJQUFJLFdBQVcsQ0FBQyxRQUFRLEVBQUU7WUFDdEIsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO1lBQ3ZELFFBQVEsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBRWpFLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ3BCLFFBQVEsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUN6QyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO2FBQzdDO1lBRUQsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtnQkFDdkIsUUFBUSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQy9DLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7YUFDbkQ7WUFFRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUN6QixRQUFRLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztnQkFDbkQsV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQzthQUN2RDtZQUVELElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUU7Z0JBQ2pDLFFBQVEsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7Z0JBQ3hELFdBQVcsQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7YUFDN0Q7WUFFRCxXQUFXLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7U0FDOUM7UUFFRCxJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQztRQUNoQyxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDbkIsR0FBRyxHQUFHLEVBQUUsQ0FBQztTQUNaO1FBRUQsV0FBVyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7UUFDckIsV0FBVyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQ3BDLENBQUM7Ozs7WUE3Q0osVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtkZWVwQ2xvbmUsIFJlY29yZCwgUmVjb3JkTWFwcGVyfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U2F2ZWRGaWx0ZXJ9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3N0b3JlL3NhdmVkLWZpbHRlcnMvc2F2ZWQtZmlsdGVyLm1vZGVsJztcblxuQEluamVjdGFibGUoe1xuICAgIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBTYXZlZFNlYXJjaFJlY29yZE1hcHBlciBpbXBsZW1lbnRzIFJlY29yZE1hcHBlciB7XG5cbiAgICBnZXRLZXkoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdjcml0ZXJpYSc7XG4gICAgfVxuXG4gICAgbWFwKHJlY29yZDogUmVjb3JkKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNhdmVkRmlsdGVyOiBTYXZlZEZpbHRlciA9IHJlY29yZDtcbiAgICAgICAgaWYgKHNhdmVkRmlsdGVyLmNyaXRlcmlhKSB7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50cyA9IHNhdmVkRmlsdGVyLmF0dHJpYnV0ZXMuY29udGVudHMgfHwge307XG4gICAgICAgICAgICBjb250ZW50cy5maWx0ZXJzID0gZGVlcENsb25lKHNhdmVkRmlsdGVyLmNyaXRlcmlhLmZpbHRlcnMgfHwge30pO1xuXG4gICAgICAgICAgICBpZiAocmVjb3JkLmZpZWxkcy5uYW1lKSB7XG4gICAgICAgICAgICAgICAgY29udGVudHMubmFtZSA9IHJlY29yZC5maWVsZHMubmFtZS52YWx1ZTtcbiAgICAgICAgICAgICAgICBzYXZlZEZpbHRlci5jcml0ZXJpYS5uYW1lID0gY29udGVudHMubmFtZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlY29yZC5maWVsZHMub3JkZXJCeSkge1xuICAgICAgICAgICAgICAgIGNvbnRlbnRzLm9yZGVyQnkgPSByZWNvcmQuZmllbGRzLm9yZGVyQnkudmFsdWU7XG4gICAgICAgICAgICAgICAgc2F2ZWRGaWx0ZXIuY3JpdGVyaWEub3JkZXJCeSA9IGNvbnRlbnRzLm9yZGVyQnk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZWNvcmQuZmllbGRzLnNvcnRPcmRlcikge1xuICAgICAgICAgICAgICAgIGNvbnRlbnRzLnNvcnRPcmRlciA9IHJlY29yZC5maWVsZHMuc29ydE9yZGVyLnZhbHVlO1xuICAgICAgICAgICAgICAgIHNhdmVkRmlsdGVyLmNyaXRlcmlhLnNvcnRPcmRlciA9IGNvbnRlbnRzLnNvcnRPcmRlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlY29yZC5hdHRyaWJ1dGVzLnNlYXJjaF9tb2R1bGUpIHtcbiAgICAgICAgICAgICAgICBjb250ZW50cy5zZWFyY2hNb2R1bGUgPSByZWNvcmQuYXR0cmlidXRlcy5zZWFyY2hfbW9kdWxlO1xuICAgICAgICAgICAgICAgIHNhdmVkRmlsdGVyLmNyaXRlcmlhLnNlYXJjaE1vZHVsZSA9IGNvbnRlbnRzLnNlYXJjaE1vZHVsZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2F2ZWRGaWx0ZXIuYXR0cmlidXRlcy5jb250ZW50cyA9IGNvbnRlbnRzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGtleSA9IHNhdmVkRmlsdGVyLmtleSB8fCAnJztcbiAgICAgICAgaWYgKGtleSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgICAgICBrZXkgPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVkRmlsdGVyLmlkID0ga2V5O1xuICAgICAgICBzYXZlZEZpbHRlci5hdHRyaWJ1dGVzLmlkID0ga2V5O1xuICAgIH1cbn1cbiJdfQ==