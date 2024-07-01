import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccounteditComponent } from './accountedit.component';

describe('AccounteditComponent', () => {
  let component: AccounteditComponent;
  let fixture: ComponentFixture<AccounteditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccounteditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccounteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
