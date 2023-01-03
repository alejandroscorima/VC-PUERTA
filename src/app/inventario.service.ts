import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Item } from './item';
import { Cliente } from './cliente';
import { Product } from './product';
import { Sale } from './sale';

interface area {
  nombre: string;
  ruta: string;
}

interface lugar {
  nombre: string;
  ruta: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  baseUrl = environment.baseUrl

  lugares: lugar[] = [{ nombre: 'MEGA', ruta:'mega' },
  { nombre: 'PRO', ruta:'pro' },
  { nombre: 'HUARAL', ruta:'huaral' },
  { nombre: 'OFICINA', ruta:'oficina' },
  { nombre: 'MEGABET', ruta:'megabet' },
  { nombre: 'COCHERA', ruta:'cochera' }];

  mega_indice: area[] = [{ nombre: 'MAQUINAS', ruta: 'maquinas' },
  { nombre: 'SALA', ruta: 'sala' },
  { nombre: 'CAJA', ruta: 'caja' },
  { nombre: 'SOTANO', ruta: 'sotano' },
  { nombre: 'PASADIZO Y ESCALERAS', ruta: 'pasadizo_escaleras' },
  { nombre: 'AUDITORIO', ruta: 'auditorio' },
  { nombre: 'COCINA', ruta: 'cocina' },
  { nombre: 'LAVANDERIA', ruta: 'lavanderia' },
  { nombre: 'SSHH', ruta: 'sshh' },
  { nombre: 'AZOTEA', ruta: 'azotea' },
  { nombre: 'ALMACEN PATRIMONIO', ruta: 'almacen_patrimonio' },
  { nombre: 'VIDEO', ruta: 'video' },
  { nombre: 'RECAUDO', ruta: 'recaudo' },
  { nombre: 'SERVICIOS GENERALES', ruta: 'servicios_generales' },
  { nombre: 'ALMACEN TECNICO', ruta: 'almacen_tecnico' },
  { nombre: 'ALMACEN DE INSUMOS', ruta: 'almacen_insumos' },
  { nombre: 'AREA TECNICA', ruta: 'area_tecnica' }];

  pro_indice: area[] = [{ nombre: 'MAQUINAS', ruta: 'maquinas' },
  { nombre: 'SALA', ruta: 'sala'},
  { nombre: 'SSHH', ruta: 'sshh'},
  { nombre: 'CAJA', ruta: 'caja'},
  { nombre: 'ZONA DE CORTESIA', ruta: 'zona_cortesia'},
  { nombre: 'ADMINISTRACION', ruta: 'administracion'},
  { nombre: 'VESTUARIO', ruta: 'vestuario'},
  { nombre: 'AZOTEA', ruta: 'azotea'},
  { nombre: 'INGRESO Y ESCALERAS', ruta: 'ingreso_escaleras'},
  { nombre: 'AIRE ACONDICIONADO', ruta: 'aire_acondicionado'},
  { nombre: 'ESCENARIO', ruta: 'escenario'},
  { nombre: 'VIDEO', ruta: 'video'},
  { nombre: 'RECAUDO', ruta: 'recaudo'},
  { nombre: 'AREA TECNICA', ruta: 'area_tecnica'}];

  huaral_indice: area[] = [{nombre: 'MAQUINAS', ruta: 'maquinas'},
  { nombre: 'CAJA', ruta: 'caja'},
  { nombre: 'SALA', ruta: 'sala'},
  { nombre: 'SSHH', ruta: 'sshh'},
  { nombre: 'ADMINISTRACION', ruta: 'administracion'},
  { nombre: 'ALMACEN', ruta: 'almacen'},
  { nombre: 'VESTUARIO', ruta: 'vestuario'},
  { nombre: 'AZOTEA', ruta: 'azotea'},
  { nombre: 'COCINA', ruta: 'cocina' },
  { nombre: 'ZONA DE CORTESIA', ruta: 'zona_cortesia'},
  { nombre: 'VIDEO', ruta: 'video'},
  { nombre: 'RECAUDO', ruta: 'recaudo'}];

  oficina_indice: area[] = [{nombre: 'LOGISTICA', ruta: 'logistica'},
  {nombre: 'COSTOS', ruta:'costos'},
  {nombre: 'PATRIMONIO', ruta: 'patrimonio'},
  {nombre: 'ESTADISTICA', ruta: 'estadistica'},
  {nombre: 'ACCIONISTA SURQUILLO', ruta: 'accionista_surquillo'},
  {nombre: 'ASISTENTE DE ACCIONISTA', ruta: 'asistente_accionista'},
  {nombre: 'ASISTENTE DE LOGISTICA', ruta: 'asistente_logistica'},
  {nombre: 'DISEÑO Y MARKETING', ruta: 'diseno_marketing'},
  {nombre: 'ASISTENTE DE OPERACIONES', ruta: 'asistente_operaciones'},
  {nombre: 'DIGITALIZACION', ruta: 'digitalizacion'},
  {nombre: 'AREA MEDICA', ruta: 'area_medica'},
  {nombre: 'SALA DE JUNTAS', ruta: 'sala_juntas'},
  {nombre: 'SSHH', ruta: 'sshh'},
  {nombre: 'GERENCIA DE OPERACIONES', ruta: 'gerencia_operaciones'},
  {nombre: 'GERENCIA GENERAL APODERADO', ruta: 'gerencia_general_apoderado'},
  {nombre: 'GERENCIA GENERAL', ruta: 'gerencia_general'},
  {nombre: 'AREA DE SISTEMAS', ruta: 'sistemas'},
  {nombre: 'AREA LEGAL', ruta: 'area_legal'},
  {nombre: 'SEGURIDAD Y SALUD', ruta: 'seguridad_salud'},
  {nombre: 'LACTARIO', ruta: 'lactario'},
  {nombre: 'TESORERIA', ruta: 'tesoreria'},
  {nombre: 'AREA CONTABLE', ruta: 'area_contable'},
  {nombre: 'RECAUDO', ruta: 'recaudo'},
  {nombre: 'RECURSOS HUMANOS', ruta: 'recursos_humanos'},
  {nombre: 'RECEPCION', ruta: 'recepcion'},
  {nombre: 'MANTENIMIENTO', ruta: 'mantenimiento'}];


  megabet_indice: area[] = [{nombre: 'MEGABET', ruta: 'megabet'}];
  cochera_indice: area[] = [{nombre: 'COCHERA', ruta: 'cochera'}];

  constructor(private http: HttpClient) { }

  getActas(estado:string) {
    return this.http.get(`${this.baseUrl}/getAllActas.php?estado=${estado}`);
  }

  getItems(lugar:string, area:string) {
    if(area=='maquinas'){
      return this.http.get(`${this.baseUrl}/getMaquinas.php?lugar=${lugar}`);
    }
    else{
      return this.http.get(`${this.baseUrl}/getActivos.php?lugar=${lugar}&area=${area}`);
    }

  }

  getAllMaquinas() {
      return this.http.get(`${this.baseUrl}/getAllMaquinas.php`);

  }

  getAllActivos() {
      return this.http.get(`${this.baseUrl}/getAllActivos.php`);

  }

  getSaleId(code:string) {
    return this.http.get(`${this.baseUrl}/getSaleId.php?code=${code}`);
  }

  getProduct(id) {
    return this.http.get(`${this.baseUrl}/getProduct.php?id=${id}`);
  }

  updateProduct(product: Product) {
    return this.http.put(`${this.baseUrl}/updateProduct.php`, product);
  }

  deleteProduct(product: Product) {
    return this.http.put(`${this.baseUrl}/deleteProduct.php`, product);
  }

  getSorteo(sala: string, dia: string, hora: string) {
    return this.http.get(`${this.baseUrl}/getSorteo.php?sala=${sala}&dia=${dia}&hora=${hora}`);
  }

  getPersonal(doc_number: string, date_entrance: string, selectedSala: string) {
    return this.http.get(`${this.baseUrl}/get.php?doc_number=${doc_number}&date_entrance=${date_entrance}&selectedSala=${selectedSala}`);
  }

  addProduct(product: Product) {
    return this.http.post(`${this.baseUrl}/postProduct.php`, product);
  }

  addSaleDetail(saleDetail: Item) {
    return this.http.post(`${this.baseUrl}/postSaleDetail.php`, saleDetail);
  }

  addSale(sale: Sale) {
    return this.http.post(`${this.baseUrl}/postSale.php`, sale);
  }

  deleteCliente(cliente: Cliente) {
    //return this.http.delete(`${this.baseUrl}/delete.php?idCliente=${cliente.id}`);
  }

  updateCliente(cliente: Cliente) {
    return this.http.put(`${this.baseUrl}/update.php`, cliente);
  }

  getIndice(lugar: string) {
    switch (lugar) {
      case 'mega':
        return this.mega_indice;
      case 'pro':
        return this.pro_indice;
      case 'huaral':
        return this.huaral_indice;
      case 'oficina':
        return this.oficina_indice;
      case 'megabet':
        return this.megabet_indice;
      case 'cochera':
        return this.cochera_indice;

    }

  }

  getLugares(){
    return this.lugares;
  }
}
