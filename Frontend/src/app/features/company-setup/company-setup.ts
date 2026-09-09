import { Component } from '@angular/core';
import { BasicCard } from '../../shared/components/ui/cards/basic-card/basic-card';

@Component({
  standalone: true,
  imports: [BasicCard],
  selector: 'ras-company-setup',
  styleUrl: './company-setup.css',
  templateUrl: './company-setup.html',
})
export class CompanySetup {
  isPageLoading = true;

}
