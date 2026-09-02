import { Component } from '@angular/core';
import { Header } from "./header/header";
import { Sidebar } from "./sidebar/sidebar";
import { Footer } from "./footer/footer";
import { RouterOutlet } from "@angular/router";

@Component({
  imports: [Header, Sidebar, Footer, RouterOutlet],
  selector: 'ras-app-layout',
  styleUrl: './app-layout.css',
  templateUrl: './app-layout.html',
})
export class AppLayout { }
