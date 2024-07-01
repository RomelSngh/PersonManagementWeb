import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { account } from '../_model/account.model';
import { map } from 'rxjs';
import { accountStatus } from '../_model/accountStatus.model';

@Injectable({
  providedIn: 'root'
})
export class AccountStatusService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl;

  getAll() {
    return this.http.get<accountStatus[]>(this.baseUrl + 'Account/GetAllAccountStatuses');
  }

}