import { Component } from '@angular/core';
import { PageLoader } from "../../shared/components/ui/loaders/page-loaders/page-loader";

@Component({
  imports: [PageLoader],
  selector: 'ras-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
