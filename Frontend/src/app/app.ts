import { Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppConfigService } from './core/services/app-config.service';
import { Title } from '@angular/platform-browser';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(
    private titleService: Title,
    protected readonly appConfig: AppConfigService
  ) {
    effect(() => {
      this.titleService.setTitle(this.appConfig.title());
    });
  }
}
