
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from "./cliente";
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
  cliente = new Cliente('','','','','','','','','','','','');

  constructor(private http: HttpClient,

  ) { }


  getClientes(fecha_cumple: string) {
    return this.http.get(`${this.baseUrl}/getAll.php?fecha_cumple=${fecha_cumple}`);
  }

  getClients() {
    return this.http.get(`${this.baseUrl}/getAllClients.php`);
  }

  getClient(doc_number: string) {

    return this.http.get(`${this.baseUrl}/getClient.php?doc_number=${doc_number}`);
  }

  getVisit(doc_number: string) {

    return this.http.get(`${this.baseUrl}/getVisit.php?doc_number=${doc_number}`);
  }

  getClientFromReniec(doc_number: string) {

    this.urlconsulta = 'https://apiperu.dev/api/dni/'+doc_number+'?api_token=e9f647e67d492cdee675bfb2b365c09393611b5141144a60da34cab5429b55e8';
    return this.http.get(this.urlconsulta);

  }

  addCliente(cliente: Cliente) {
    return this.http.post(`${this.baseUrl}/postClient.php`, cliente);
  }

  addLudop(ludop) {
    return this.http.post(`${this.baseUrl}/postLudop.php`, ludop);
  }

  deleteCliente(cliente: Cliente) {
    //return this.http.delete(`${this.baseUrl}/delete.php?idCliente=${cliente.id}`);
  }

  updateCliente(cliente: Cliente) {
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