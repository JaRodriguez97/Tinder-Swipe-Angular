import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  urlApi = 'https://randomuser.me/api/';

  constructor(private http: HttpClient) {}

  getUsersApi() {
    return this.http.get(this.urlApi);
  }
}
