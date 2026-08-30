// radio.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, Host, Optional } from '@angular/core';
import { RadioGroupComponent } from './radio-group.component';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="radio"
        class="sr-only"
        [name]="name"
        [value]="value"
        [checked]="isChecked" 
        (change)="onSelect()" 
      />

      <span
        class="h-5 w-5 flex items-center justify-center rounded-full border transition"
        [ngClass]="{
          'border-brand-500 bg-brand-500': isChecked,
          'border-gray-400': !isChecked
        }"
      >
        <span 
            class="h-2 w-2 rounded-full bg-white" 
            *ngIf="isChecked">
        </span>
      </span>

      {{ label }}
    </label>
  `
})
export class RadioComponent {
  @Input() value!: any;
  @Input() label!: string;
  @Input() name: string = 'radio-group'; // Default name if not provided

  constructor(
    // Inject the parent Group component to read its value
    @Optional() @Host() private group: RadioGroupComponent
  ) { }

  // 1. THE MAGIC: This getter runs whenever Angular checks the view.
  // It asks the parent: "Is my value the currently selected one?"
  get isChecked(): boolean {
    return this.group ? this.group.currentValue === this.value : false;
  }

  // 2. When clicked, tell the parent to update
  onSelect() {
    if (this.group) {
      this.group.select(this.value);
    }
  }
}