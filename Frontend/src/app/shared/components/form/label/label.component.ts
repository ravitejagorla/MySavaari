import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-label',
  imports: [CommonModule, TooltipModule],
  template: `
    <label
      [attr.for]="for"
      [ngClass]="
        'mb-1.5  text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1 ' +
        className
      "
    >
      <ng-content></ng-content>

      @if (isRequired) {
        <span class="text-error-500">*</span>
      }

      @if (isDefault) {
        <span class="text-blue-800">*</span>
      }
      @if (helperTip) {
        &nbsp;
        <span
        pTooltip="{{ helperTip }}"
        tooltipPosition="top"
        >
          <i
            class="pi pi-info-circle text-gray-500 text-xs cursor-pointer"
          ></i>
        </span>
      }
    </label>
  `,
  styles: [
    `
      :host ::ng-deep .p-tooltip-text {
        font-size: 0.85rem;
        line-height: 1.2;
      }
    `,
  ],
})
export class LabelComponent {
  @Input() for?: string;
  @Input() className = '';
  @Input() isRequired?: string | boolean = false;
  @Input() isDefault?: boolean = false;
  @Input() helperTip?: string;
}
