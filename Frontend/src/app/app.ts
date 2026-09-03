import { Component, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AppConfigService } from './core/services/app-config.service';

import { ToastModule } from 'primeng/toast';
import { ProgressBar } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';
import { GlobalToastService } from './core/services/global-toast.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    ToastModule,
    ProgressBar
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  loading = false;
  constructor(
    private titleService: Title,
    protected readonly appConfig: AppConfigService,
    private toast: GlobalToastService,
  ) {
    effect(() => {
      this.titleService.setTitle(this.appConfig.title());
    });

    this.toast.show(
      'success',
      'Success',
      'Test success toast'
    );
  }
}