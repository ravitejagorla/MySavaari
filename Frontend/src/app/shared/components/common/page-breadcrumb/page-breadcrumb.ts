import { Component, Input, OnInit } from '@angular/core';
import { Params, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 

export interface BreadcrumbItem {
  label: string;
  link:string | any[] | null;
  active?: boolean;
  isDeactivated?:boolean;
   queryParams?: Params;
}

@Component({
  selector: 'page-breadcrumb',
  standalone: true, 
  imports: [
    RouterModule, 
    RouterLink, 
    CommonModule 
  ],
  templateUrl: './page-breadcrumb.html',
  styles: `

`
})
export class PageBreadcrumb implements OnInit {
  
  @Input() pageTitle: string = '';
  
  @Input() items: BreadcrumbItem[] = []; 

  ngOnInit(): void {
  }
}