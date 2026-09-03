import { Component, Input } from '@angular/core';

@Component({
  selector: 'tr[searchTable]',
  template: `
    <td [attr.colspan]="colspanNumber" class="px-2 py-10 text-center">
      <div class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
        <img src="icons/search.png" alt="No Data" class="w-20 h-20 mb-3 opacity-70">
        <p class="text-sm">searching for data</p>
      </div>
    </td>
  `,
  host: { 'role': 'row' },
  standalone: true,
})
export class TableSearch {
  @Input() colspanNumber: number = 1;
}
