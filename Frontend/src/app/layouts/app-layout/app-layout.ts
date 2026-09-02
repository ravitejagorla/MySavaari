import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollTopModule } from 'primeng/scrolltop';
import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';
import { Footer } from './footer/footer';
import { SidebarService } from '../../shared/services/sidebar.service';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [Header, Sidebar, Footer, RouterOutlet, ScrollTopModule, AsyncPipe],
  selector: 'ras-app-layout',
  styleUrl: './app-layout.css',
  templateUrl: './app-layout.html',
})
export class AppLayout { 
  protected readonly sidebarService = inject(SidebarService);
}