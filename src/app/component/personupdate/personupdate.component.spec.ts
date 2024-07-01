import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonupdateComponent } from './personupdate.component';

describe('PersonupdateComponent', () => {
  let component: PersonupdateComponent;
  let fixture: ComponentFixture<PersonupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonupdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
