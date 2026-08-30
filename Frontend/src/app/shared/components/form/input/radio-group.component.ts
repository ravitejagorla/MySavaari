// radio-group.component.ts
import { Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-radio-group',
    standalone: true,
    template: `<ng-content></ng-content>`, // Projects the radio buttons here
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RadioGroupComponent),
            multi: true
        }
    ]
})
export class RadioGroupComponent implements ControlValueAccessor {
    // We use a signal or simple property to hold the value
    currentValue: any = null;

    // Standard ControlValueAccessor functions
    onChange = (v: any) => { };
    onTouched = () => { };

    // 1. Angular calls this when the form loads data (e.g. from API)
    writeValue(val: any): void {
        this.currentValue = val;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // 2. Child calls this when user clicks a radio button
    select(val: any) {
        this.currentValue = val;
        this.onChange(val);
        this.onTouched();
    }
}