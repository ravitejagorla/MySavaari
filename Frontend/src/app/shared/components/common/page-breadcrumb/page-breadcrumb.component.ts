import { Component, Input, OnInit } from '@angular/core';
import { Params, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Needed for @for and @if structural directives

// Define the data structure for a single breadcrumb item
export interface BreadcrumbItem {
  label: string;
  link:string | any[] | null; // Accepts a simple string path or an array of path segments/parameters
  active?: boolean; // Optional: True for the current (last) item
  isDeactivated?:boolean;
   queryParams?: Params;
}

@Component({
  selector: 'app-page-breadcrumb',
  standalone: true, // Assuming this is a modern Angular standalone component
  imports: [
    RouterModule, 
    RouterLink, 
    CommonModule // Import CommonModule for directives like @for and @if
  ],
  templateUrl: './page-breadcrumb.component.html',
  styles: `
    /* Optional: Add component-specific styles here if needed */
  `
})
export class PageBreadcrumbComponent implements OnInit {
  
  @Input() pageTitle: string = '';
  
  // CORRECTED: Input should be an array of BreadcrumbItem
  @Input() items: BreadcrumbItem[] = []; 

  ngOnInit(): void {
  }
}