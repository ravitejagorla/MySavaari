import { Component, Input } from '@angular/core';

@Component({
  selector: 'tr[rasTableNoData]',
  template: `
    <td [attr.colspan]="colspanNumber" class="px-2 py-10 text-center">
      <div class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
        <img src="icons/no-data.png" alt="No Data" class="w-20 h-20 mb-3 opacity-70">
        <p class="text-base font-medium">{{ title }}</p>
        <p class="text-sm">{{ message }}</p>
      </div>
    </td>
  `,
  host: { 'role': 'row' }, 
  standalone: true,
})
export class TableNoDataComponent {
  @Input() colspanNumber: number = 1;
  @Input() title: string = 'No Data Found';
  @Input() message: string = 'Please add a new entry.';
}