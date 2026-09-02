import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private isExpandedSubject = new BehaviorSubject<boolean>(true);
  private isMobileOpenSubject = new BehaviorSubject<boolean>(false);
  private isHoveredSubject = new BehaviorSubject<boolean>(false);

  isExpanded$ = this.isExpandedSubject.asObservable();
  isMobileOpen$ = this.isMobileOpenSubject.asObservable();
  isHovered$ = this.isHoveredSubject.asObservable();

  setExpanded(val: boolean): void {
    this.isExpandedSubject.next(val);
  }

  toggleExpanded(): void {
    this.isExpandedSubject.next(
      !this.isExpandedSubject.value
    );
  }

  setMobileOpen(val: boolean): void {
    this.isMobileOpenSubject.next(val);
  }

  toggleMobileOpen(): void {
    this.isMobileOpenSubject.next(
      !this.isMobileOpenSubject.value
    );
  }

  setHovered(val: boolean): void {
    this.isHoveredSubject.next(val);
  }
}