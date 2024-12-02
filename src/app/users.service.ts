
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

  //login
  getUser(username_system, password_system) {
    return this.http.get(`${this.baseUrl}/getUser.php?username_system=${username_system}&password_system=${password_system}`);
  }

  getUserById(user_id) {
    return this.http.get(`${this.baseUrl}/getUserById.php?user_id=${user_id}`);
  }

  updateUser(u: User) {
    return this.http.put(`${this.baseUrl}/updateUser.php`, u);
  }

  getAccessPointsByStatus() {
    return this.http.get(`${this.baseUrl}/getAccessPointsByStatus.php`);
  }

  getCampusByName(campus_name: string) {
    return this.http.get(`${this.baseUrl}/getCampusByName.php?campus_name=${campus_name}`);
  }

  getAccessPointById(accessPoint_id: number) {
    return this.http.get(`${this.baseUrl}/getAccessPointById.php?accessPoint_id=${accessPoint_id}`);
  }

  getPaymentByClientId(client_id: number) {
    return this.http.get(
      `${this.baseUrl}/getPaymentByClientId.php?client_id=${client_id}`
    );
  }

}
