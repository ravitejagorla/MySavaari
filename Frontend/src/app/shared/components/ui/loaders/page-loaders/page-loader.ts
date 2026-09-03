import { Component } from '@angular/core';

@Component({
    selector: 'page-loader',
    template: `
    <div class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 w-full h-full">
        <img src="icons/loading-14.gif" alt="Loading Data" class="w-full h-200 mb-3 opacity-70">
    </div>
    `
})
export class PageLoader { }
