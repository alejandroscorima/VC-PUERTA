import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Person } from './person';

@Injectable({
  providedIn: 'root'
})
export class PuertaService {

  baseUrl = environment.baseUrl
  respuesta;
  urlconsulta;
  person = new Person('','','','','','','','','','','','');

  constructor(private http: HttpClient,
  ) { }
  
}
