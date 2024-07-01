import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { account } from '../_model/account.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl;

  getAll(pcode: number) {
    return this.http.get<account[]>(this.baseUrl + 'Account/GetAll?pcode='+ pcode);
  }

  filterData(searchTerm: string, pageSize: number) {
    // Implement filtering logic here
    // This is a placeholder function; you'll need to adjust it based on your data structure
    return this.getAll(0).pipe(
      map(data => data.filter(item => item.accountNumber.includes(searchTerm)))
    );
  }

  getByCode(code:number) {
    return this.http.get<account>(this.baseUrl + 'Account/GetByCode?code='+code);
  }

  createAccount(_data: account) {
    return this.http.post(this.baseUrl + 'Account/Create', _data);
  }

  updateAccount(_data: account) {
    return this.http.put(this.baseUrl + 'Account/Update?code=' + _data.code, _data);
  }

  deleteAccount(code: number) {
    return this.http.delete(this.baseUrl + 'Account/Remove?code=' + code);
  }
}
