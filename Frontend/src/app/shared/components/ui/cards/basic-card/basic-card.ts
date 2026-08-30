import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from "primeng/button";

export interface CardButton {
  label?: string;
  icon?: string;
  severity?: any;
  command?: () => void;
}

@Component({
  selector: 'pulse-basic-card',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="pulse-card {{ className }} bg-white dark:bg-gray-900 shadow-xl rounded-lg mb-4">

      <ng-content select="[pulseCardHeader]"></ng-content>

      @if (!headerNotRequired && title) {
        <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">

          <div>
            <h3 class="text-base font-medium text-gray-800 dark:text-white/90">
              @if(iconName){
                <i class="pi {{ iconName }} mr-2 text-blue-500"></i>
              }
              {{ title }}
            </h3>

            @if (desc) {
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ desc }}
              </p>
            }
          </div>

          <div class="flex gap-2">
            @if (buttons && buttons.length > 0) {
              @for (btn of buttons; track $index) {
                <p-button 
                  [icon]="btn.icon ? 'pi ' + btn.icon : ''"
                  [label]="btn.label || ''"
                  (click)="btn.command?.()"
                  [severity]="btn.severity || 'primary'"
                  styleClass="mb-2 me-2 bg-brand-500"
                  size="small">
                </p-button>
              }
            } 
            @else if (addButton) {
              <p-button 
                [icon]="buttonIcon ? 'pi ' + buttonIcon : ''"
                [label]="buttonLabel || ''"
                (click)="callAFunction?.()"
                styleClass="mb-2 me-2 bg-brand-500"
                size="small">
              </p-button>
            }
          </div>

        </div>
      }

      <div class="p-4 sm:p-6"> 
        <div class="space-y-6">
          <ng-content></ng-content>
        </div>
      </div>

    </div>
  `,
})
export class BasicCard {
  @Input() title: string = '';
  @Input() desc: string = '';
  @Input() className: string = '';
  @Input() iconName: string = '';
  @Input() headerNotRequired: boolean = false;

  // Existing Single Button Inputs
  @Input() addButton: boolean = false;
  @Input() buttonIcon: string = '';
  @Input() buttonLabel: string = '';
  @Input() callAFunction: (() => void) | undefined;

  // New Multi-Button Input
  @Input() buttons: CardButton[] = [];
}