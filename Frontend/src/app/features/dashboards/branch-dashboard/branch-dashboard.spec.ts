import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BranchDashboard } from './branch-dashboard';

describe('BranchDashboard', () => {
  let component: BranchDashboard;
  let fixture: ComponentFixture<BranchDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(BranchDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
