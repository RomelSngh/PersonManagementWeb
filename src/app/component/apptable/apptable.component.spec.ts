import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptableComponent } from './apptable.component';

describe('ApptableComponent', () => {
  let component: ApptableComponent;
  let fixture: ComponentFixture<ApptableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApptableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApptableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
