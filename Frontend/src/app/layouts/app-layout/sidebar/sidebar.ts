import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppConfigService } from '../../../core/services/app-config.service';
import { SidebarWidget } from './sidebar-widget';
import { SidebarService } from '../../../shared/services/sidebar.service';
import { AsyncPipe } from '@angular/common';

type SubNavItem = {
  name: string;
  icon: string;
  path: string;
};

type NavItem = {
  name: string;
  icon: string;
  path?: string;
  subItems?: SubNavItem[];
};

type NavSection = {
  title: string;
  items: NavItem[];
};

@Component({
  selector: 'ras-sidebar',
  standalone: true,
  imports: [ RouterModule, SidebarWidget, AsyncPipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  protected readonly appConfig = inject(AppConfigService);
  protected readonly sidebarService = inject(SidebarService);
  readonly expandedMenu = signal<string | null>(null);

  toggleMenu(name: string): void {
    this.expandedMenu.update(current =>
      current === name ? null : name
    );
  }

  readonly sections: NavSection[] = [
    {
      title: 'Main',
      items: [
        {
          name: 'Dashboard',
          icon: 'pi pi-home',
          path: '/',
        },
      ],
    },

    {
      title: 'Master Data',
      items: [
        {
          name: 'Stations',
          icon: 'pi pi-map-marker',
          path: '/stations',
        },

        {
          name: 'Routes',
          icon: 'pi pi-share-alt',
          subItems: [
            {
              name: 'Route List',
              icon: 'pi pi-list',
              path: '/routes',
            },
            {
              name: 'Route Map',
              icon: 'pi pi-map',
              path: '/routes/map',
            },
          ],
        },

        {
          name: 'Fare Management',
          icon: 'pi pi-money-bill',
          subItems: [
            {
              name: 'Fare Rules',
              icon: 'pi pi-sliders-h',
              path: '/fares/rules',
            },
            {
              name: 'Fare Matrix',
              icon: 'pi pi-table',
              path: '/fares/matrix',
            },
          ],
        },
      ],
    },
  ];
}