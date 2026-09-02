import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'ras-footer',
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
   readonly currentYear = new Date().getFullYear();
}
