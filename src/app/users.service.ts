
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from "./user";
import { environment } from "../environments/environment";
import { Observable } from 'rxjs';
import { Item } from './item';

import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = environment.baseUrl
  respuesta;
  urlconsulta;

  constructor(private http: HttpClient, private cookies: CookieService) { }


  getUser(username, password) {
    return this.http.get(`${this.baseUrl}/getUser.php?username=${username}&password=${password}`);
  }

  getUserById(user_id) {
    return this.http.get(`${this.baseUrl}/getUserById.php?user_id=${user_id}`);
  }

  updateUser(u: User) {
    return this.http.put(`${this.baseUrl}/updateUser.php`, u);
  }

  getAllCampus() {
    return this.http.get(`${this.baseUrl}/getAllCampus.php`);
  }

  getCampusByName(campus_name: string) {
    return this.http.get(`${this.baseUrl}/getCampusByName.php?campus_name=${campus_name}`);
  }

  getCampusActiveByName(campus_name: string) {
    return this.http.get(`${this.baseUrl}/getCampusActiveByName.php?campus_name=${campus_name}`);
  }

  getPaymentByClientId(client_id: number) {
    return this.http.get(
      `${this.baseUrl}/getPaymentByClientId.php?client_id=${client_id}`
    );
  }

}
