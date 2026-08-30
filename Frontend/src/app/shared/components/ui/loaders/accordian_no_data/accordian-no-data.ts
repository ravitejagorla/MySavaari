import { Component, Input } from '@angular/core';

@Component({
    selector: 'accordion-no-data',
    template: `
    <div class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 mb-4">
        <img src="icons/no-data.png" alt="No Data" class="w-20 h-20 mb-3 opacity-70">
        <p class="text-base font-medium">{{ title }}</p>
        <p class="text-sm">{{ message }}</p>
    </div>
    `
})
export class AccordianNoDataComponent {
    @Input() title: string = 'No Data Found';
    @Input() message: string = 'Please add a new entry.';
    constructor() { }
}
