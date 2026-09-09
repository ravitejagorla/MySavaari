import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GlobalToastService } from '../../core/services/global-toast.service';
import { BasicCard } from '../../shared/components/ui/cards/basic-card/basic-card';
import { PageLoader } from '../../shared/components/ui/loaders/page-loaders/page-loader';

@Component({
  standalone: true,
  imports: [BasicCard, PageLoader],
  selector: 'ras-company-setup',
  styleUrl: './company-setup.css',
  templateUrl: './company-setup.html',
})
export class CompanySetup implements OnInit {
  isPageLoading = true;
  companySetupForm!: FormGroup;
  
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toast = inject(GlobalToastService);

  ngOnInit(): void {
    this.initForm();
    this.isPageLoading = false;
  }

  private initForm(): void{
    this.companySetupForm = this.fb.group({
      
    })
  }
}
