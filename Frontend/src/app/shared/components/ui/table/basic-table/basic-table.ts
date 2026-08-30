import { Component } from '@angular/core';

@Component({
  selector: 'pulse-basic-table',
  imports: [],
  template:`
     <div class="overflow-hidden">
      <div class="max-w-full px-5 overflow-x-auto sm:px-6">
        <table class="min-w-full">
          <thead class="border-y border-gray-100 bg-gray-50 dark:bg-gray-900 dark:border-white/[0.05] font-bold text-black dark:text-gray-200">

          <ng-content select="[table-header]"></ng-content>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-white/[0.05]">
          <ng-content select="[table-body]"></ng-content>
          </tbody>
        </table>
      </div>
      </div>

  `,
})
export class BasicTable {

}
