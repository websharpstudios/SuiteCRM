import { isTrue } from 'common';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export const primaryEmailValidator = (viewField, record) => ((control) => {
    const name = viewField.name || '';
    if (!name || !record || !record.fields) {
        return null;
    }
    const field = record.fields[name] || {};
    const items = field.items;
    if (!field || !items || !items.length) {
        return null;
    }
    let count = 0;
    const activeItems = items.filter(item => !(item && item.attributes && item.attributes.deleted));
    if (activeItems && activeItems.length < 1) {
        return null;
    }
    activeItems.some(item => {
        const emailField = (item.fields && item.fields['email-fields']) || {};
        const primary = (emailField.attributes && emailField.attributes['primary_address']) || null;
        if (!primary) {
            return false;
        }
        if (isTrue(primary.value)) {
            count++;
        }
        return count > 1;
    });
    if (count == 1) {
        return null;
    }
    if (count == 0) {
        return {
            primaryEmailValidation: {
                valid: false,
                message: {
                    labelKey: 'LBL_NO_PRIMARY_EMAIL_VALIDATION_ERROR',
                    context: {}
                }
            },
        };
    }
    return {
        primaryEmailValidation: {
            valid: false,
            message: {
                labelKey: 'LBL_MULTIPLE_PRIMARY_EMAIL_VALIDATION_ERROR',
                context: {}
            }
        },
    };
});
export class PrimaryEmailValidator {
    constructor() {
    }
    applies(record, viewField) {
        if (!viewField || !viewField.fieldDefinition) {
            return false;
        }
        const type = viewField.type || viewField.fieldDefinition.type || '';
        return type === 'line-items';
    }
    getValidator(viewField, record) {
        if (!viewField || !viewField.fieldDefinition || !record) {
            return [];
        }
        return [primaryEmailValidator(viewField, record)];
    }
}
PrimaryEmailValidator.??prov = i0.????defineInjectable({ factory: function PrimaryEmailValidator_Factory() { return new PrimaryEmailValidator(); }, token: PrimaryEmailValidator, providedIn: "root" });
PrimaryEmailValidator.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
PrimaryEmailValidator.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbWFyeS1lbWFpbC52YWxpZGF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9jb3JlL2FwcC9jb3JlL3NyYy9saWIvc2VydmljZXMvcmVjb3JkL3ZhbGlkYXRpb24vdmFsaWRhdG9ycy9wcmltYXJ5LWVtYWlsLnZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUE0QkEsT0FBTyxFQUFRLE1BQU0sRUFBNkUsTUFBTSxRQUFRLENBQUM7QUFDakgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFFekMsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxTQUE4QixFQUFFLE1BQWMsRUFBdUIsRUFBRSxDQUFDLENBQzFHLENBQUMsT0FBd0IsRUFBbUMsRUFBRTtJQUMxRCxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUVsQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtRQUNwQyxPQUFPLElBQUksQ0FBQztLQUNmO0lBRUQsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFXLENBQUM7SUFDakQsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztJQUUxQixJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtRQUNuQyxPQUFPLElBQUksQ0FBQztLQUNmO0lBRUQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBRWQsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFaEcsSUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDdkMsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUVELFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDcEIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxFQUFXLENBQUM7UUFDL0UsTUFBTSxPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUU1RixJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1YsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDdkIsS0FBSyxFQUFFLENBQUM7U0FDWDtRQUVELE9BQU8sS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtRQUNaLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFFRCxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7UUFDWixPQUFPO1lBQ0gsc0JBQXNCLEVBQUU7Z0JBQ3BCLEtBQUssRUFBRSxLQUFLO2dCQUNaLE9BQU8sRUFBRTtvQkFDTCxRQUFRLEVBQUUsdUNBQXVDO29CQUNqRCxPQUFPLEVBQUUsRUFBRTtpQkFDZDthQUNKO1NBQ0osQ0FBQztLQUNMO0lBRUQsT0FBTztRQUNILHNCQUFzQixFQUFFO1lBQ3BCLEtBQUssRUFBRSxLQUFLO1lBQ1osT0FBTyxFQUFFO2dCQUNMLFFBQVEsRUFBRSw2Q0FBNkM7Z0JBQ3ZELE9BQU8sRUFBRSxFQUFFO2FBQ2Q7U0FDSjtLQUNKLENBQUM7QUFDTixDQUFDLENBQ0osQ0FBQztBQU1GLE1BQU0sT0FBTyxxQkFBcUI7SUFFOUI7SUFDQSxDQUFDO0lBRUQsT0FBTyxDQUFDLE1BQWMsRUFBRSxTQUE4QjtRQUNsRCxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRTtZQUMxQyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1FBRXBFLE9BQU8sSUFBSSxLQUFLLFlBQVksQ0FBQztJQUNqQyxDQUFDO0lBRUQsWUFBWSxDQUFDLFNBQThCLEVBQUUsTUFBYztRQUV2RCxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNyRCxPQUFPLEVBQUUsQ0FBQztTQUNiO1FBRUQsT0FBTyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7Ozs7WUF6QkosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTdWl0ZUNSTSBpcyBhIGN1c3RvbWVyIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHByb2dyYW0gZGV2ZWxvcGVkIGJ5IFNhbGVzQWdpbGl0eSBMdGQuXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgU2FsZXNBZ2lsaXR5IEx0ZC5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdCB1bmRlclxuICogdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAzIGFzIHB1Ymxpc2hlZCBieSB0aGVcbiAqIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiB3aXRoIHRoZSBhZGRpdGlvbiBvZiB0aGUgZm9sbG93aW5nIHBlcm1pc3Npb24gYWRkZWRcbiAqIHRvIFNlY3Rpb24gMTUgYXMgcGVybWl0dGVkIGluIFNlY3Rpb24gNyhhKTogRk9SIEFOWSBQQVJUIE9GIFRIRSBDT1ZFUkVEIFdPUktcbiAqIElOIFdISUNIIFRIRSBDT1BZUklHSFQgSVMgT1dORUQgQlkgU0FMRVNBR0lMSVRZLCBTQUxFU0FHSUxJVFkgRElTQ0xBSU1TIFRIRVxuICogV0FSUkFOVFkgT0YgTk9OIElORlJJTkdFTUVOVCBPRiBUSElSRCBQQVJUWSBSSUdIVFMuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsIGJ1dCBXSVRIT1VUXG4gKiBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTU1xuICogRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZVxuICogZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqIEluIGFjY29yZGFuY2Ugd2l0aCBTZWN0aW9uIDcoYikgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogdmVyc2lvbiAzLCB0aGVzZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgcmV0YWluIHRoZSBkaXNwbGF5IG9mIHRoZVxuICogXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIiBsb2dvLiBJZiB0aGUgZGlzcGxheSBvZiB0aGUgbG9nb3MgaXMgbm90IHJlYXNvbmFibHlcbiAqIGZlYXNpYmxlIGZvciB0ZWNobmljYWwgcmVhc29ucywgdGhlIEFwcHJvcHJpYXRlIExlZ2FsIE5vdGljZXMgbXVzdCBkaXNwbGF5XG4gKiB0aGUgd29yZHMgXCJTdXBlcmNoYXJnZWQgYnkgU3VpdGVDUk1cIi5cbiAqL1xuXG5pbXBvcnQge1ZhbGlkYXRvckludGVyZmFjZX0gZnJvbSAnLi4vdmFsaWRhdG9yLkludGVyZmFjZSc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtGaWVsZCwgaXNUcnVlLCBSZWNvcmQsIFN0YW5kYXJkVmFsaWRhdGlvbkVycm9ycywgU3RhbmRhcmRWYWxpZGF0b3JGbiwgVmlld0ZpZWxkRGVmaW5pdGlvbn0gZnJvbSAnY29tbW9uJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBjb25zdCBwcmltYXJ5RW1haWxWYWxpZGF0b3IgPSAodmlld0ZpZWxkOiBWaWV3RmllbGREZWZpbml0aW9uLCByZWNvcmQ6IFJlY29yZCk6IFN0YW5kYXJkVmFsaWRhdG9yRm4gPT4gKFxuICAgIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBTdGFuZGFyZFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHZpZXdGaWVsZC5uYW1lIHx8ICcnO1xuXG4gICAgICAgIGlmICghbmFtZSB8fCAhcmVjb3JkIHx8ICFyZWNvcmQuZmllbGRzKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpZWxkID0gcmVjb3JkLmZpZWxkc1tuYW1lXSB8fCB7fSBhcyBGaWVsZDtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBmaWVsZC5pdGVtcztcblxuICAgICAgICBpZiAoIWZpZWxkIHx8ICFpdGVtcyB8fCAhaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjb3VudCA9IDA7XG5cbiAgICAgICAgY29uc3QgYWN0aXZlSXRlbXMgPSBpdGVtcy5maWx0ZXIoaXRlbSA9PiAhKGl0ZW0gJiYgaXRlbS5hdHRyaWJ1dGVzICYmIGl0ZW0uYXR0cmlidXRlcy5kZWxldGVkKSk7XG5cbiAgICAgICAgaWYgKGFjdGl2ZUl0ZW1zICYmIGFjdGl2ZUl0ZW1zLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgYWN0aXZlSXRlbXMuc29tZShpdGVtID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVtYWlsRmllbGQgPSAoaXRlbS5maWVsZHMgJiYgaXRlbS5maWVsZHNbJ2VtYWlsLWZpZWxkcyddKSB8fCB7fSBhcyBGaWVsZDtcbiAgICAgICAgICAgIGNvbnN0IHByaW1hcnkgPSAoZW1haWxGaWVsZC5hdHRyaWJ1dGVzICYmIGVtYWlsRmllbGQuYXR0cmlidXRlc1sncHJpbWFyeV9hZGRyZXNzJ10pIHx8IG51bGw7XG5cbiAgICAgICAgICAgIGlmICghcHJpbWFyeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzVHJ1ZShwcmltYXJ5LnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjb3VudCA+IDE7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjb3VudCA9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb3VudCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHByaW1hcnlFbWFpbFZhbGlkYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbEtleTogJ0xCTF9OT19QUklNQVJZX0VNQUlMX1ZBTElEQVRJT05fRVJST1InLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDoge31cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHByaW1hcnlFbWFpbFZhbGlkYXRpb246IHtcbiAgICAgICAgICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgbWVzc2FnZToge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbEtleTogJ0xCTF9NVUxUSVBMRV9QUklNQVJZX0VNQUlMX1ZBTElEQVRJT05fRVJST1InLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfVxuKTtcblxuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFByaW1hcnlFbWFpbFZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvckludGVyZmFjZSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBhcHBsaWVzKHJlY29yZDogUmVjb3JkLCB2aWV3RmllbGQ6IFZpZXdGaWVsZERlZmluaXRpb24pOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCF2aWV3RmllbGQgfHwgIXZpZXdGaWVsZC5maWVsZERlZmluaXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHR5cGUgPSB2aWV3RmllbGQudHlwZSB8fCB2aWV3RmllbGQuZmllbGREZWZpbml0aW9uLnR5cGUgfHwgJyc7XG5cbiAgICAgICAgcmV0dXJuIHR5cGUgPT09ICdsaW5lLWl0ZW1zJztcbiAgICB9XG5cbiAgICBnZXRWYWxpZGF0b3Iodmlld0ZpZWxkOiBWaWV3RmllbGREZWZpbml0aW9uLCByZWNvcmQ6IFJlY29yZCk6IFN0YW5kYXJkVmFsaWRhdG9yRm5bXSB7XG5cbiAgICAgICAgaWYgKCF2aWV3RmllbGQgfHwgIXZpZXdGaWVsZC5maWVsZERlZmluaXRpb24gfHwgIXJlY29yZCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtwcmltYXJ5RW1haWxWYWxpZGF0b3Iodmlld0ZpZWxkLCByZWNvcmQpXTtcbiAgICB9XG59XG4iXX0=