import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppConfigService } from './core/services/app-config.service';
import { ToastModule } from 'primeng/toast';
import { ProgressBar } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';
import { LockScreenService } from './core/services/lock-screen.service';
import { IdleService } from './core/services/idle.service';
import { LockScreen } from './shared/components/lock-screen/lock-screen';

@Component({
  selector: 'app-root',
  imports: [ CommonModule, RouterOutlet, ToastModule, ProgressBar, LockScreen],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  loading = false;
  private readonly appConfig = inject(AppConfigService);
  protected readonly lockScreenService = inject(LockScreenService);
  private readonly idleService = inject(IdleService)
  constructor(private titleService: Title,) {
    effect(() => {
      this.titleService.setTitle(this.appConfig.title());
    });
    this.startIdleTimer();
  }
  private lockApplication(): void {
    this.idleService.stop();
    this.lockScreenService.lock().subscribe({
      next: (response) => {
        console.log('Lock response:', response);
      },
      error: (error) => {
        console.error('Lock failed:', error);

        this.startIdleTimer();
      }
    });
  }

  private startIdleTimer(): void {
    this.idleService.start(() => {
      this.lockApplication();
    });
  }
}