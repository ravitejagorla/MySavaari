import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, HostListener } from '@angular/core';

@Component({
    selector: 'full-screen-button',
    template: `
  <button (click)="toggleFullscreen()"
  class="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
>
    @if(!isFullScreen){
  <i class="pi pi-window-maximize"></i>
    }@else{
  <i class="pi pi-window-minimize"></i>
    }
</button>
  `
})
export class MyComponent implements OnInit {
    elem: any;
    isFullScreen: boolean = false;

    constructor(@Inject(DOCUMENT) private document: any) { }

    ngOnInit(): void {
        this.elem = this.document.documentElement;
        this.checkScreenMode();
    }

    @HostListener('document:fullscreenchange', ['$event'])
    @HostListener('document:webkitfullscreenchange', ['$event'])
    @HostListener('document:mozfullscreenchange', ['$event'])
    @HostListener('document:MSFullscreenChange', ['$event'])
    fullscreenModes(event: any) {
        this.checkScreenMode();
    }

    toggleFullscreen() {
        if (this.isFullScreen) {
            this.closeFullscreen();
        } else {
            this.openFullscreen();
        }
    }

    openFullscreen() {
        if (this.elem.requestFullscreen) {
            this.elem.requestFullscreen();
        } else if (this.elem.mozRequestFullScreen) {
            this.elem.mozRequestFullScreen();
        } else if (this.elem.webkitRequestFullscreen) {
            this.elem.webkitRequestFullscreen();
        } else if (this.elem.msRequestFullscreen) {
            this.elem.msRequestFullscreen();
        }
    }

    closeFullscreen() {
        if (this.document.exitFullscreen) {
            this.document.exitFullscreen();
        } else if (this.document.mozCancelFullScreen) {
            this.document.mozCancelFullScreen();
        } else if (this.document.webkitExitFullscreen) {
            this.document.webkitExitFullscreen();
        } else if (this.document.msExitFullscreen) { 
            this.document.msExitFullscreen();
        }
    }

    checkScreenMode() {
        const fullScreenElement =
            this.document.fullscreenElement ||
            this.document.webkitFullscreenElement ||
            this.document.mozFullScreenElement ||
            this.document.msFullscreenElement;

        this.isFullScreen = !!fullScreenElement;
    }
}