import { Component } from '@angular/core';
import { AppConfigService } from '../../../core/services/app-config.service';

@Component({
  selector: 'ras-sidebar-widget',
  standalone: true,
  template: `
    <div
      class="mx-auto mt-auto mb-4 w-full max-w-60
             rounded-2xl border border-gray-200
             bg-gray-50 px-4 py-5
             dark:border-gray-800
             dark:bg-white/[0.03]"
    >

      <!-- Application Icon -->
      <div
        class="mx-auto mb-3 flex h-10 w-10 items-center justify-center
               rounded-xl bg-brand-500 text-white"
      >
        <i class="pi pi-building text-lg"></i>
      </div>

      <!-- Application Name -->
      <h3
        class="mb-1 text-center font-semibold
               text-gray-900 dark:text-white"
      >
        {{ appConfig.title() }}
      </h3>

      <!-- Version -->
      <p
        class="mb-3 text-center text-xs
               font-medium text-brand-500"
      >
        Version 1.0.0
      </p>

      <!-- Description -->
      <p
        class="mb-4 text-center text-xs leading-5
               text-gray-500 dark:text-gray-400"
      >
        Hyderabad Metro management and journey
        planning platform.
      </p>

      <!-- Environment -->
      <div
        class="flex items-center justify-center gap-2
               text-xs text-gray-500 dark:text-gray-400"
      >
        <span
          class="h-2 w-2 rounded-full bg-green-500"
        ></span>

        <span>System Online</span>
      </div>

    </div>
  `
})
export class SidebarWidget {

  constructor(
    protected readonly appConfig: AppConfigService
  ) {}

}
