
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person } from "./person";
import { environment } from "../environments/environment";
import { Observable } from 'rxjs';

import * as pdfjsLib from 'pdfjs-dist';
import { Visit } from './visit';
import { VisitRepeated } from './visitRepeated';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  baseUrl = environment.baseUrl
  respuesta;
  urlconsulta;
  cliente = new Person('','','','','','','','','','','','','','','','','','','','','',0,0,'','');

  constructor(private http: HttpClient,

  ) { }


  getClientes(fecha_cumple: string) {
    return this.http.get(`${this.baseUrl}/getAll.php?fecha_cumple=${fecha_cumple}`);
  }

  getPersons() {
    return this.http.get(`${this.baseUrl}/getAllPersons.php`);
  }

  getPerson(doc_number: string) {
    return this.http.get(`${this.baseUrl}/getPerson.php?doc_number=${doc_number}`);
  }

  getVehicle(plate: string) {
    return this.http.get(`${this.baseUrl}/getVehicle.php?plate=${plate}`);
  }

  getVisit(doc_number: string, table_entrance: string) {

    return this.http.get(`${this.baseUrl}/getVisit.php?doc_number=${doc_number}&table_entrance=${table_entrance}`);
  }

/*   getClientFromReniec(doc_number: string) {

    this.urlconsulta = 'https://apiperu.dev/api/dni/'+doc_number+'?api_token=e9f647e67d492cdee675bfb2b365c09393611b5141144a60da34cab5429b55e8';
    return this.http.get(this.urlconsulta);

  } */

  getClientFromReniec(doc_number: string) {

    this.urlconsulta = 'https://my.apidev.pro/api/dni/'+doc_number+'?api_token=e9cc47e67d492cdee675bfb2b365c09393611b5141144aa0da34cab5429bb5e8';
    return this.http.get(this.urlconsulta);

  }

  addPerson(person: Person) {
    return this.http.post(`${this.baseUrl}/postPerson.php`, person);
  }

  addLudop(ludop) {
    return this.http.post(`${this.baseUrl}/postLudop.php`, ludop);
  }

  deleteCliente(cliente: Person) {
    //return this.http.delete(`${this.baseUrl}/delete.php?idCliente=${cliente.id}`);
  }

  updateCliente(cliente: Person) {
    return this.http.put(`${this.baseUrl}/update.php`, cliente);
  }

  addVisit(visit: Visit) {
    return this.http.post(`${this.baseUrl}/postVisit.php`, visit);
  }

  deleteVisit(visit: Visit) {
    return this.http.post(`${this.baseUrl}/deleteVisit.php`, visit);
  }

  addVisitRepeated(visitR: VisitRepeated) {
    return this.http.post(`${this.baseUrl}/postVisitRepeated.php`, visitR);
  }
}
