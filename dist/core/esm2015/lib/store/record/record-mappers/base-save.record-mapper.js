import { deepClone } from 'common';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class BaseSaveRecordMapper {
    getKey() {
        return 'base';
    }
    map(record) {
        if (!record.fields || !Object.keys(record.fields).length) {
            return;
        }
        Object.keys(record.fields).forEach(fieldName => {
            const field = record.fields[fieldName];
            const type = field.type || '';
            const source = field.definition.source || '';
            const rname = field.definition.rname || 'name';
            const idName = field.definition.id_name || '';
            if (type === 'relate' && source === 'non-db' && idName === fieldName) {
                record.attributes[fieldName] = field.value;
                return;
            }
            if (type === 'relate' && source === 'non-db' && rname !== '' && field.valueObject) {
                const attribute = record.attributes[fieldName] || {};
                attribute[rname] = field.valueObject[rname];
                attribute.id = field.valueObject.id;
                record.attributes[fieldName] = attribute;
                record.attributes[idName] = field.valueObject.id;
                return;
            }
            if (field.valueObject) {
                record.attributes[fieldName] = field.valueObject;
                return;
            }
            if (field.items) {
                record.attributes[fieldName] = [];
                field.items.forEach(item => {
                    record.attributes[fieldName].push({
                        id: item.id,
                        module: item.module,
                        attributes: deepClone(item.attributes)
                    });
                });
                return;
            }
            if (field.valueObjectArray) {
                record.attributes[fieldName] = field.valueObjectArray;
                return;
            }
            if (field.valueList) {
                record.attributes[fieldName] = field.valueList;
                return;
            }
            record.attributes[fieldName] = field.value;
        });
    }
}
BaseSaveRecordMapper.ɵprov = i0.ɵɵdefineInjectable({ factory: function BaseSaveRecordMapper_Factory() { return new BaseSaveRecordMapper(); }, token: BaseSaveRecordMapper, providedIn: "root" });
BaseSaveRecordMapper.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1zYXZlLnJlY29yZC1tYXBwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc3RvcmUvcmVjb3JkL3JlY29yZC1tYXBwZXJzL2Jhc2Utc2F2ZS5yZWNvcmQtbWFwcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQXVCLE1BQU0sUUFBUSxDQUFDO0FBQ3ZELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBS3pDLE1BQU0sT0FBTyxvQkFBb0I7SUFFN0IsTUFBTTtRQUNGLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxHQUFHLENBQUMsTUFBYztRQUVkLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ3RELE9BQU87U0FDVjtRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMzQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRXZDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQzlCLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztZQUM3QyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUM7WUFDL0MsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1lBRTlDLElBQUksSUFBSSxLQUFLLFFBQVEsSUFBSSxNQUFNLEtBQUssUUFBUSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQ2xFLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDM0MsT0FBTzthQUNWO1lBRUQsSUFBSSxJQUFJLEtBQUssUUFBUSxJQUFJLE1BQU0sS0FBSyxRQUFRLElBQUksS0FBSyxLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFO2dCQUMvRSxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQVMsQ0FBQztnQkFFNUQsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7Z0JBRXBDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDO2dCQUN6QyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO2dCQUVqRCxPQUFPO2FBQ1Y7WUFFRCxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUU7Z0JBQ25CLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztnQkFDakQsT0FBTzthQUNWO1lBRUQsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO2dCQUNiLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNsQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDdkIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQzlCLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTt3QkFDWCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07d0JBQ25CLFVBQVUsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztxQkFDL0IsQ0FBQyxDQUFBO2dCQUNoQixDQUFDLENBQUMsQ0FBQztnQkFDSCxPQUFPO2FBQ1Y7WUFFRCxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDeEIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ3RELE9BQU87YUFDVjtZQUVELElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTtnQkFDakIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO2dCQUMvQyxPQUFPO2FBQ1Y7WUFFRCxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOzs7O1lBckVKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZGVlcENsb25lLCBSZWNvcmQsIFJlY29yZE1hcHBlcn0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQmFzZVNhdmVSZWNvcmRNYXBwZXIgaW1wbGVtZW50cyBSZWNvcmRNYXBwZXIge1xuXG4gICAgZ2V0S2V5KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnYmFzZSc7XG4gICAgfVxuXG4gICAgbWFwKHJlY29yZDogUmVjb3JkKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKCFyZWNvcmQuZmllbGRzIHx8ICFPYmplY3Qua2V5cyhyZWNvcmQuZmllbGRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5rZXlzKHJlY29yZC5maWVsZHMpLmZvckVhY2goZmllbGROYW1lID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gcmVjb3JkLmZpZWxkc1tmaWVsZE5hbWVdO1xuXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gZmllbGQudHlwZSB8fCAnJztcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IGZpZWxkLmRlZmluaXRpb24uc291cmNlIHx8ICcnO1xuICAgICAgICAgICAgY29uc3Qgcm5hbWUgPSBmaWVsZC5kZWZpbml0aW9uLnJuYW1lIHx8ICduYW1lJztcbiAgICAgICAgICAgIGNvbnN0IGlkTmFtZSA9IGZpZWxkLmRlZmluaXRpb24uaWRfbmFtZSB8fCAnJztcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdyZWxhdGUnICYmIHNvdXJjZSA9PT0gJ25vbi1kYicgJiYgaWROYW1lID09PSBmaWVsZE5hbWUpIHtcbiAgICAgICAgICAgICAgICByZWNvcmQuYXR0cmlidXRlc1tmaWVsZE5hbWVdID0gZmllbGQudmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ3JlbGF0ZScgJiYgc291cmNlID09PSAnbm9uLWRiJyAmJiBybmFtZSAhPT0gJycgJiYgZmllbGQudmFsdWVPYmplY3QpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSByZWNvcmQuYXR0cmlidXRlc1tmaWVsZE5hbWVdIHx8IHt9IGFzIGFueTtcblxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZVtybmFtZV0gPSBmaWVsZC52YWx1ZU9iamVjdFtybmFtZV07XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlLmlkID0gZmllbGQudmFsdWVPYmplY3QuaWQ7XG5cbiAgICAgICAgICAgICAgICByZWNvcmQuYXR0cmlidXRlc1tmaWVsZE5hbWVdID0gYXR0cmlidXRlO1xuICAgICAgICAgICAgICAgIHJlY29yZC5hdHRyaWJ1dGVzW2lkTmFtZV0gPSBmaWVsZC52YWx1ZU9iamVjdC5pZDtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZpZWxkLnZhbHVlT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgcmVjb3JkLmF0dHJpYnV0ZXNbZmllbGROYW1lXSA9IGZpZWxkLnZhbHVlT2JqZWN0O1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZpZWxkLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgcmVjb3JkLmF0dHJpYnV0ZXNbZmllbGROYW1lXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZpZWxkLml0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZC5hdHRyaWJ1dGVzW2ZpZWxkTmFtZV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogaXRlbS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZTogaXRlbS5tb2R1bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBkZWVwQ2xvbmUoaXRlbS5hdHRyaWJ1dGVzKVxuICAgICAgICAgICAgICAgICAgICB9IGFzIFJlY29yZClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmaWVsZC52YWx1ZU9iamVjdEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmVjb3JkLmF0dHJpYnV0ZXNbZmllbGROYW1lXSA9IGZpZWxkLnZhbHVlT2JqZWN0QXJyYXk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZmllbGQudmFsdWVMaXN0KSB7XG4gICAgICAgICAgICAgICAgcmVjb3JkLmF0dHJpYnV0ZXNbZmllbGROYW1lXSA9IGZpZWxkLnZhbHVlTGlzdDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlY29yZC5hdHRyaWJ1dGVzW2ZpZWxkTmFtZV0gPSBmaWVsZC52YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19