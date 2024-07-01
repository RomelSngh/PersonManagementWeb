import { TestBed } from '@angular/core/testing';
import { AccountService } from './account.service';
import { AccountStatusService } from './accountStatus.service';

describe('AccountService', () => {
  let service: AccountStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});