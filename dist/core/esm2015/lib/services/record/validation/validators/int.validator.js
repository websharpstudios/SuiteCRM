import { Injectable } from '@angular/core';
import { NumberFormatter } from '../../../formatters/number/number-formatter.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../formatters/number/number-formatter.service";
export const intValidator = (formatter) => ((control) => {
    const invalid = formatter.validateIntUserFormat(control.value);
    return invalid ? {
        intValidator: {
            valid: false,
            format: formatter.getIntUserFormatPattern(),
            message: {
                labelKey: 'LBL_VALIDATION_ERROR_INT_FORMAT',
                context: {
                    value: control.value,
                    expected: formatter.toUserFormat('1000')
                }
            }
        },
    } : null;
});
export class IntValidator {
    constructor(formatter) {
        this.formatter = formatter;
    }
    applies(record, viewField) {
        if (!viewField || !viewField.fieldDefinition) {
            return false;
        }
        return viewField.type === 'int';
    }
    getValidator(viewField) {
        if (!viewField || !viewField.fieldDefinition) {
            return [];
        }
        return [intValidator(this.formatter)];
    }
}
IntValidator.ɵprov = i0.ɵɵdefineInjectable({ factory: function IntValidator_Factory() { return new IntValidator(i0.ɵɵinject(i1.NumberFormatter)); }, token: IntValidator, providedIn: "root" });
IntValidator.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
IntValidator.ctorParameters = () => [
    { type: NumberFormatter }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50LnZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2NvcmUvYXBwL2NvcmUvc3JjL2xpYi9zZXJ2aWNlcy9yZWNvcmQvdmFsaWRhdGlvbi92YWxpZGF0b3JzL2ludC52YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBOEJBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHFEQUFxRCxDQUFDOzs7QUFHcEYsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLENBQUMsU0FBMEIsRUFBdUIsRUFBRSxDQUFDLENBQzdFLENBQUMsT0FBd0IsRUFBbUMsRUFBRTtJQUUxRCxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9ELE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNiLFlBQVksRUFBRTtZQUNWLEtBQUssRUFBRSxLQUFLO1lBQ1osTUFBTSxFQUFFLFNBQVMsQ0FBQyx1QkFBdUIsRUFBRTtZQUMzQyxPQUFPLEVBQUU7Z0JBQ0wsUUFBUSxFQUFFLGlDQUFpQztnQkFDM0MsT0FBTyxFQUFFO29CQUNMLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztvQkFDcEIsUUFBUSxFQUFFLFNBQVMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO2lCQUMzQzthQUNKO1NBQ0o7S0FDSixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDYixDQUFDLENBQ0osQ0FBQztBQUtGLE1BQU0sT0FBTyxZQUFZO0lBRXJCLFlBQXNCLFNBQTBCO1FBQTFCLGNBQVMsR0FBVCxTQUFTLENBQWlCO0lBQ2hELENBQUM7SUFFRCxPQUFPLENBQUMsTUFBYyxFQUFFLFNBQThCO1FBQ2xELElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFO1lBQzFDLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsT0FBTyxTQUFTLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQztJQUNwQyxDQUFDO0lBRUQsWUFBWSxDQUFDLFNBQThCO1FBRXZDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFO1lBQzFDLE9BQU8sRUFBRSxDQUFDO1NBQ2I7UUFFRCxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7Ozs7WUF2QkosVUFBVSxTQUFDO2dCQUNSLFVBQVUsRUFBRSxNQUFNO2FBQ3JCOzs7WUF6Qk8sZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3VpdGVDUk0gaXMgYSBjdXN0b21lciByZWxhdGlvbnNoaXAgbWFuYWdlbWVudCBwcm9ncmFtIGRldmVsb3BlZCBieSBTYWxlc0FnaWxpdHkgTHRkLlxuICogQ29weXJpZ2h0IChDKSAyMDIxIFNhbGVzQWdpbGl0eSBMdGQuXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQgdW5kZXJcbiAqIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMyBhcyBwdWJsaXNoZWQgYnkgdGhlXG4gKiBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24gd2l0aCB0aGUgYWRkaXRpb24gb2YgdGhlIGZvbGxvd2luZyBwZXJtaXNzaW9uIGFkZGVkXG4gKiB0byBTZWN0aW9uIDE1IGFzIHBlcm1pdHRlZCBpbiBTZWN0aW9uIDcoYSk6IEZPUiBBTlkgUEFSVCBPRiBUSEUgQ09WRVJFRCBXT1JLXG4gKiBJTiBXSElDSCBUSEUgQ09QWVJJR0hUIElTIE9XTkVEIEJZIFNBTEVTQUdJTElUWSwgU0FMRVNBR0lMSVRZIERJU0NMQUlNUyBUSEVcbiAqIFdBUlJBTlRZIE9GIE5PTiBJTkZSSU5HRU1FTlQgT0YgVEhJUkQgUEFSVFkgUklHSFRTLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLCBidXQgV0lUSE9VVFxuICogQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2YgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1NcbiAqIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmVcbiAqIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiBJbiBhY2NvcmRhbmNlIHdpdGggU2VjdGlvbiA3KGIpIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIHZlcnNpb24gMywgdGhlc2UgQXBwcm9wcmlhdGUgTGVnYWwgTm90aWNlcyBtdXN0IHJldGFpbiB0aGUgZGlzcGxheSBvZiB0aGVcbiAqIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIgbG9nby4gSWYgdGhlIGRpc3BsYXkgb2YgdGhlIGxvZ29zIGlzIG5vdCByZWFzb25hYmx5XG4gKiBmZWFzaWJsZSBmb3IgdGVjaG5pY2FsIHJlYXNvbnMsIHRoZSBBcHByb3ByaWF0ZSBMZWdhbCBOb3RpY2VzIG11c3QgZGlzcGxheVxuICogdGhlIHdvcmRzIFwiU3VwZXJjaGFyZ2VkIGJ5IFN1aXRlQ1JNXCIuXG4gKi9cblxuaW1wb3J0IHtWYWxpZGF0b3JJbnRlcmZhY2V9IGZyb20gJy4uL3ZhbGlkYXRvci5JbnRlcmZhY2UnO1xuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7UmVjb3JkfSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtWaWV3RmllbGREZWZpbml0aW9ufSBmcm9tICdjb21tb24nO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TnVtYmVyRm9ybWF0dGVyfSBmcm9tICcuLi8uLi8uLi9mb3JtYXR0ZXJzL251bWJlci9udW1iZXItZm9ybWF0dGVyLnNlcnZpY2UnO1xuaW1wb3J0IHtTdGFuZGFyZFZhbGlkYXRpb25FcnJvcnMsIFN0YW5kYXJkVmFsaWRhdG9yRm59IGZyb20gJ2NvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBpbnRWYWxpZGF0b3IgPSAoZm9ybWF0dGVyOiBOdW1iZXJGb3JtYXR0ZXIpOiBTdGFuZGFyZFZhbGlkYXRvckZuID0+IChcbiAgICAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogU3RhbmRhcmRWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG5cbiAgICAgICAgY29uc3QgaW52YWxpZCA9IGZvcm1hdHRlci52YWxpZGF0ZUludFVzZXJGb3JtYXQoY29udHJvbC52YWx1ZSk7XG4gICAgICAgIHJldHVybiBpbnZhbGlkID8ge1xuICAgICAgICAgICAgaW50VmFsaWRhdG9yOiB7XG4gICAgICAgICAgICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZvcm1hdDogZm9ybWF0dGVyLmdldEludFVzZXJGb3JtYXRQYXR0ZXJuKCksXG4gICAgICAgICAgICAgICAgbWVzc2FnZToge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbEtleTogJ0xCTF9WQUxJREFUSU9OX0VSUk9SX0lOVF9GT1JNQVQnLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY29udHJvbC52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBmb3JtYXR0ZXIudG9Vc2VyRm9ybWF0KCcxMDAwJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0gOiBudWxsO1xuICAgIH1cbik7XG5cbkBJbmplY3RhYmxlKHtcbiAgICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgSW50VmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9ySW50ZXJmYWNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBmb3JtYXR0ZXI6IE51bWJlckZvcm1hdHRlcikge1xuICAgIH1cblxuICAgIGFwcGxpZXMocmVjb3JkOiBSZWNvcmQsIHZpZXdGaWVsZDogVmlld0ZpZWxkRGVmaW5pdGlvbik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXZpZXdGaWVsZCB8fCAhdmlld0ZpZWxkLmZpZWxkRGVmaW5pdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZpZXdGaWVsZC50eXBlID09PSAnaW50JztcbiAgICB9XG5cbiAgICBnZXRWYWxpZGF0b3Iodmlld0ZpZWxkOiBWaWV3RmllbGREZWZpbml0aW9uKTogU3RhbmRhcmRWYWxpZGF0b3JGbltdIHtcblxuICAgICAgICBpZiAoIXZpZXdGaWVsZCB8fCAhdmlld0ZpZWxkLmZpZWxkRGVmaW5pdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtpbnRWYWxpZGF0b3IodGhpcy5mb3JtYXR0ZXIpXTtcbiAgICB9XG59XG4iXX0=