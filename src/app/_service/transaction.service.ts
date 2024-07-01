import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { account } from '../_model/account.model';
import { map } from 'rxjs';
import { transaction } from '../_model/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl;

  getAll(code:number) {
    return this.http.get<transaction[]>(this.baseUrl + 'Transaction/GetAll?code='+code);
  }

  filterData(searchTerm: number, pageSize: number) {
    // Implement filtering logic here
    // This is a placeholder function; you'll need to adjust it based on your data structure
    return this.getAll(0).pipe(
      map(data => data.filter(item => item.code===searchTerm))
    );
  }

  getByCode(code:number) {
    return this.http.get<transaction>(this.baseUrl + 'Transaction/GetByCode?code='+code);
  }

  createTransaction(_data: transaction) {
    return this.http.post(this.baseUrl + 'Transaction/Create', _data);
  }

  updateTransaction(_data: transaction) {
    return this.http.put(this.baseUrl + 'Transaction/Update?code=' + _data.code, _data);
  }

  deleteTransaction(code: number) {
    return this.http.delete(this.baseUrl + 'Transaction/Remove?code=' + code);
  }
}
