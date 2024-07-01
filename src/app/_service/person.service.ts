import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { person } from '../_model/person.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl;

  getAll(code:number) {
    return this.http.get<person[]>(this.baseUrl + 'Person/GetAll?code='+code);
  }

  filterData(searchTerm: string, pageSize: number) {
    // Implement filtering logic here
    // This is a placeholder function; you'll need to adjust it based on your data structure
    return this.getAll(0).pipe(
      map(data => data.filter(item => item.name.includes(searchTerm)))
    );
  }

  getByCode(code:number) {
    return this.http.get<person>(this.baseUrl + 'Person/GetByCode?code='+code);
  }

  createPerson(_data: person) {
    return this.http.post(this.baseUrl + 'Person/Create', _data);
  }

  updatePerson(_data: person) {
    return this.http.put(this.baseUrl + 'Person/Update?code=' + _data.code, _data);
  }

  deletePerson(code: number) {
    return this.http.delete(this.baseUrl + 'Person/Remove?code=' + code);
  }
}
