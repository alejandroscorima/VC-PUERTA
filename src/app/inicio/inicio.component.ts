
import { Component, ElementRef, HostListener, Inject, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ClientesService } from "../clientes.service"
import { Person } from "../person"
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemePalette } from '@angular/material/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Item } from '../item';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sale } from '../sale';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Product } from '../product';
import * as pdfjsLib from 'pdfjs-dist';
import { keyframes } from '@angular/animations';
import { Key } from 'protractor';
import { Visit } from '../visit';
import { VisitRepeated } from '../visitRepeated';
import { LudopatiaService } from '../ludopatia.service';
import { Ludopata } from '../ludopata';
import { CookiesService } from '../cookies.service';
import { UsersService } from '../users.service';
import { User } from '../user';
import { AccesPoint } from '../access-point';
import { table } from 'console';
import { ICON_REGISTRY_PROVIDER } from '@angular/material/icon';
import { Payment } from '../payment';
import { initFlowbite } from 'flowbite';
import { Vehicle } from '../vehicle';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  encapsulation:ViewEncapsulation.None,
})
export class InicioComponent implements OnInit {

  person: Person = new Person('','','','','','','','','','','','','','','','','','','','','',0,0,'','');

  persons: Person[] = [];

  @ViewChild("content",{static:true}) content:ElementRef;

  ludopatas=[];

  searchResult: string = '';

  dni_ce: string;

  docInputText;
  disableDocInput;

  accessPoint: AccesPoint = new AccesPoint('','','','');

  accessPoint_name = '';
  accessPoint_id = 0;

  linkTitle;

  fecha;
  fecha_cumple;
  fechaString;
  horaString;

  dia;
  mes;
  anio;

  hora;
  min;
  seg;

  dia_aux;
  mes_aux;
  anio_aux;


  hideDoc;
  hideLoad;

  hideAll;
  hideBirthCeleb;

  name_result = '';
  doc_result = '';
  house_result = '';
  type_result = '';

  age_result = 0;

  hideCheck=false;
  hideBlock=false;
  hideBirth=false;
  hideObs=false;
  hideWarn=false;
  hideVip=false;


  dataSourceSale: MatTableDataSource<Item>;

  dataSourceProducts: MatTableDataSource<Product>;

  doc = new jsPDF();
  img = new Image();

  @ViewChildren(MatPaginator) paginator= new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort= new QueryList<MatSort>();



  constructor(private clientsService: ClientesService, private dialogo: MatDialog,
    private snackBar: MatSnackBar, private router: Router,
    public dialog: MatDialog,
    private ludopatiaService: LudopatiaService,
    private userService: UsersService,
    private cookies: CookiesService,
    private toastr: ToastrService,
    private usersService: UsersService,
  ) { }

  async loadLudop(){


    pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305/build/pdf.worker.js';

    var loadingTask = pdfjsLib.getDocument('http://52.5.47.64/Sistema consulta de Ludopatía.pdf');
    this.ludopatas = await loadingTask.promise.then(function(pdf) {

      var pages=pdf.numPages;

      var lista=[];

      for(let i=1;i<=pages;i++){
        pdf.getPage(i).then(function(page) {
          page.getTextContent().then(txt=>{
            txt.items.forEach(function(word,ind){

              if(String(word['str']).includes('Dni')){
                lista.push(txt.items[ind+1]['str']);
              }
              else if(String(word['str']).includes('Carnet')){
                lista.push(txt.items[ind+2]['str']);
              }

            })
          })
        });
      }
      return lista;
    });

  }

  verifyEnter(e){
    this.dni_ce = String(e.trim());
    document.getElementById('btnSearch').click();
  }

  search(e){

    this.dni_ce = String(e.trim());
    this.disableDocInput = true;
    this.hideDoc = true;
    this.hideLoad = false;

    this.fecha = new Date();

    this.dia = this.fecha.getDate();
    this.mes = this.fecha.getMonth()+1;
    this.anio = this.fecha.getFullYear();

    this.hora = this.fecha.getHours();
    this.min = this.fecha.getMinutes();
    this.seg = this.fecha.getSeconds();

    if(this.mes<10){
      this.mes = '0'+this.mes;
    }

    if(this.dia<10){
      this.dia = '0'+this.dia;
    }

    this.fecha_cumple= '-'+this.mes+'-'+this.dia;
    this.fechaString = this.anio+'-'+this.mes+'-'+this.dia;

    if(this.hora<10){
      this.hora = '0'+this.hora;
    }

    if(this.min<10){
      this.min = '0'+this.min;
    }

    if(this.seg<10){
      this.seg = '0'+this.seg;
    }

    this.horaString = this.hora+':'+this.min+':'+this.seg;

    //Cuando tenemos cantidad de dígitos mayor o menor de lo necesario
    if(this.dni_ce.length<6||this.dni_ce.length>11){
      this.toastr.warning('Intente de nuevo');
      setTimeout(()=>{
        this.docInputText='';
        this.disableDocInput=false;

        this.hideDoc=false;
        this.hideLoad=true;

        this.hideAll=false;
        this.hideBirthCeleb=true;

        setTimeout(()=>{
          document.getElementById("docInput").focus();
        }, 300)

      }, 300);
    }
    //Cuando la cantidad de dígitos es correcta
    else{

      var vis = new Visit(0,0,'','','',0,'','','');
      var visR = new VisitRepeated(0,'','','','','');

      //El cdogio ingresado es de una persona
      if(this.dni_ce.length>=8){
        this.type_result='PERSON';
        vis.type='PERSONA';
        visR.type='PERSONA';
        this.clientsService.getPerson(this.dni_ce).subscribe((p:Person)=>{
          //La persona se encuentra en la DB
          if(p){

            this.doc_result=this.dni_ce;
            this.house_result=p.house_address;
  
            console.log('esta en DB');
  
            vis.visitant_id=p.user_id;
            //No tiene dato de fecha de nacimiento
            if(p.birth_date==null){
              vis.age=0;
              this.toastr.warning('NO SE PUDO CALCULAR LA EDAD','VERIFICAR');
            }
            //Tiene dato de fecha de nacimiento
            else{
              var birthArray=p.birth_date.split('-');
              vis.age=parseInt(this.anio)-parseInt(birthArray[0]);
              if(parseInt(this.mes)<parseInt(birthArray[1])){
                vis.age-=1;
              }
              if(parseInt(this.mes)==parseInt(birthArray[1])){
                if(parseInt(this.dia)<parseInt(birthArray[2])){
                  vis.age-=1;
                }
              }
            }
  
            vis.date_entrance=this.fechaString;
            vis.hour_entrance=this.horaString;
            vis.visits=1;
            vis.table_entrance=this.accessPoint.table_entrance;
  
            if(p.status=='DENEGADO'){
              console.log('denegado');
  
              this.searchResult='denied'; 
              this.name_result= p.first_name+' '+p.paternal_surname+' '+p.maternal_surname;
              this.age_result= vis.age;
              this.hideBlock=false;
  
              var message = 'Persona denegada'
              console.log(p);
              if(String(p.reason)!=''){
                message+='\n Motivo: '+String(p.reason);
              }
              this.toastr.warning(message,'DENEGADO');
  
              vis.obs='DENEGADO';
  
            }
            else if(p.status=='RESTRINGIDO'){
              console.log('restringido');
  
              this.searchResult='warn';
              this.name_result= p.first_name+' '+p.paternal_surname+' '+p.maternal_surname;
              this.age_result= vis.age;
              this.hideWarn=false;
  
              var message = 'Persona con restricción'
              console.log(p);
              if(String(p.reason)!=''){
                message+='\n Motivo: '+String(p.reason);
              }
              this.toastr.warning(message,'RESTRINGIDO');
  
              vis.obs='RESTRINGIDO';

            }
            else if(p.status=='VIP'){
              console.log('vip');
              if(p.birth_date && p.birth_date.includes(this.fecha_cumple)){
  
                this.searchResult='birth';
                this.name_result= p.first_name+' '+p.paternal_surname+' '+p.maternal_surname;
                this.age_result= vis.age;
                this.hideBirth=false;
  
                var message = 'Persona VIP cumpleañero'

                this.toastr.info(message,'VIP CUMPLEAÑERO');
                vis.obs='VIP';
  

              }
              else{
  
                this.searchResult='vip';
                this.name_result= p.first_name+' '+p.paternal_surname+' '+p.maternal_surname;
                this.age_result= vis.age;
                this.hideVip=false;
  
                var message='Persona VIP';
                console.log(p);
                if(String(p.reason)!=''){
                  message+='\n Motivo: '+String(p.reason);
                }
                this.toastr.info(message,'VIP');
                vis.obs='VIP';
  
              }
  
            }
            else if(p.status=='OBSERVADO'){
              console.log('observado');
              if(p.birth_date && p.birth_date.includes(this.fecha_cumple)){
  
                this.searchResult='birth';
                this.name_result= p.first_name+' '+p.paternal_surname+' '+p.maternal_surname;
                this.age_result= vis.age;
                this.hideBirth=false;

  
                var message = 'Persona para seguimiento'

                this.toastr.info(message,'OBSERVADO DE CUMPLEAÑOS');
                vis.obs='OBSERVADO';
  
  

              }
              else{
  
                this.searchResult = 'obs';
                this.name_result= p.first_name+' '+p.paternal_surname+' '+p.maternal_surname;
                this.age_result= vis.age;
                this.hideObs=false;
  
                var message='Persona para seguimiento';
                console.log(p);
                if(String(p.reason)!=''){
                  message+='\n Motivo: '+String(p.reason);
                }
                this.toastr.info(message,'OBSERVADO');
                vis.obs='EN OBSERVACIÓN';
  
              }
  
            }
            else{
  
              console.log('ni restringido ni destacado');
              if(p.birth_date!=null){
                if(p.birth_date && p.birth_date.includes(this.fecha_cumple)){
                  console.log('cumpleañero');
  
                  this.searchResult='birth';
                  this.name_result= p.first_name+' '+p.paternal_surname+' '+p.maternal_surname;
                  this.age_result= vis.age;
                  this.hideBirth=false;
  
                  this.toastr.info('Persona de cumpleaños','CUMPLEAÑOS');
  
                  vis.obs='PERMITIDO';
  
                }
                else{
  
                  this.searchResult='allowed';
                  this.name_result= p.first_name+' '+p.paternal_surname+' '+p.maternal_surname;
                  this.age_result= vis.age;
                  this.hideCheck=false;
  
                  console.log('normal');

  
                  this.toastr.success('Persona sin restricciones','PERMITIDO');
  
                  vis.obs='PERMITIDO';
  
                  console.log(this.accessPoint.table_entrance);
  
  
                }
              }
              else{
  
                this.searchResult='allowed';
                this.name_result= p.first_name+' '+p.paternal_surname+' '+p.maternal_surname;
                this.age_result= vis.age;
                this.hideCheck=false;
  
                console.log('normal');

                this.toastr.success('Persona sin restricciones','PERMITIDO');
  
                vis.obs='PERMITIDO';
  
                console.log(this.accessPoint.table_entrance);
  
              }
  
            }

            document.getElementById('btnResultModal')?.click();
            this.limpiar();

            this.clientsService.getVisit(this.dni_ce,this.accessPoint.table_entrance).subscribe((v:Visit)=>{
              console.log('getVisit:',v);
              if(v && v.date_entrance==this.fechaString){
                console.log('visita encontrada:',v);
                visR.visitant_id=vis.visitant_id;
                //visR.name=vis.name;
                visR.date_entrance=v.date_entrance;
                visR.hour_entrance=v.hour_entrance;
                visR.obs=v.obs;
                visR.sala=this.accessPoint_name;
                //vis.visits=parseInt(String(v.visits))+1;

                v.table_entrance=this.accessPoint.table_entrance;

                this.clientsService.deleteVisit(v).subscribe(a=>{
                  console.log('Resultado borrar visita',a);
                  this.clientsService.addVisit(vis).subscribe(resp=>{
                    if(resp){
                      this.clientsService.addVisitRepeated(visR).subscribe();
                    }
                  })
                });
              }
              else{
                console.log('Visita no encontrada');
                this.clientsService.addVisit(vis).subscribe();
              }
            })
          }
          //La persona no se encuentra en la DB
          else{
            this.doc_result=this.dni_ce;
            this.house_result='SN';
            console.log('no esta en DB');
  
            if(this.dni_ce.length>8){
  
              this.toastr.info('SIN DATOS','Documento distinto a DNI');
  
              var personNew = new Person('','','','','','','','','','','','','','','','','','','','','',0,0,'','');
  
              personNew.type_doc = 'CE';
              personNew.doc_number = this.dni_ce;
              personNew.first_name = 'EXTRANJERO';
              personNew.paternal_surname = 'SN';
              personNew.maternal_surname = 'SN';
              personNew.gender = 'SN';
              personNew.birth_date = 'SN';
              personNew.civil_status = 'SN';
              personNew.profession = 'SN';
              personNew.cel_number = 'SN';
              personNew.email = 'SN';
              personNew.address = 'SN';
              personNew.district = 'SN';
              personNew.province = 'SN';
              personNew.region = 'SN';
              personNew.username = 'SN';
              personNew.password = 'SN';
              personNew.entrance_role = 'SN';
              personNew.latitud = 'SN';
              personNew.longitud = 'SN';
              personNew.photo_url = 'SN';
              personNew.house_id = 0;
              personNew.status = 'DENEGADO';
              personNew.reason = 'SN';
              personNew.colab_id = 0;

              this.searchResult='denied';
              this.name_result= p.first_name+' '+p.paternal_surname+' '+p.maternal_surname;
              this.age_result= vis.age;
              this.hideBlock=false;
  
              document.getElementById('btnResultModal')?.click();
  
              this.limpiar();

              this.clientsService.addPerson(personNew).subscribe(resAddNewPerson=>{
                if(resAddNewPerson&&resAddNewPerson['lastId']){
                  vis.visitant_id=resAddNewPerson['lastId'];
                  vis.age=0
                  vis.date_entrance=this.fechaString;
                  vis.hour_entrance=this.horaString;
                  vis.visits=1;
                  vis.table_entrance=this.accessPoint.table_entrance
                  vis.obs='DENEGADO';
    
                  this.toastr.error('Persona sin autorización','DENEGADO');
      
                  this.clientsService.getVisit(this.dni_ce, this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                    if(v && v.date_entrance==this.fechaString){
                      visR.visitant_id=vis.visitant_id;
                      visR.date_entrance=v.date_entrance;
                      visR.hour_entrance=v.hour_entrance;
                      visR.obs=v.obs;
                      visR.sala=this.accessPoint_name;
                      vis.visits=parseInt(String(v.visits))+1;
      
                      v.table_entrance=this.accessPoint.table_entrance;
      
                      this.clientsService.deleteVisit(v).subscribe(a=>{
                        this.clientsService.addVisit(vis).subscribe(resp=>{
                          if(resp){
                            this.clientsService.addVisitRepeated(visR).subscribe();
                          }
                        })
                      }); 
                    }
                    //NUEVO REGISTRO
                    else{
                      this.clientsService.addVisit(vis).subscribe();
                    }
                  })
                }
              })
  
  
            }
            else{
  
              
              this.clientsService.getClientFromReniec(this.dni_ce).subscribe(res=>{
  
                var personNew = new Person('','','','','','','','','','','','','','','','','','','','','',0,0,'','');
  
                //CLIENTE CON DATOS EN RENIEC
                if(res['success']){


                  personNew.type_doc = 'DNI';
                  personNew.doc_number = res['data']['numero'];
                  personNew.first_name = res['data']['nombres'];
                  personNew.paternal_surname = res['data']['apellido_paterno'];
                  personNew.maternal_surname = res['data']['apellido_materno'];
                  personNew.gender = res['data']['sexo'];
                  personNew.birth_date = res['data']['fecha_nacimiento'];
                  personNew.civil_status = res['data']['estado_civil'];
                  personNew.profession = 'SN';
                  personNew.cel_number = 'SN';
                  personNew.email = 'SN';
                  personNew.address = res['data']['direccion'];
                  personNew.district = res['data']['distrito'];
                  personNew.province = res['data']['provincia'];
                  personNew.region = res['data']['departamento'];
                  personNew.username = 'SN';
                  personNew.password = 'SN';
                  personNew.entrance_role = 'SN';
                  personNew.latitud = 'SN';
                  personNew.longitud = 'SN';
                  personNew.photo_url = 'SN';
                  personNew.house_id = 0;
                  personNew.status = 'DENEGADO';
                  personNew.reason = 'SN';
                  personNew.colab_id = 0;
  
                  let snackBarRef = this.snackBar.open(personNew.first_name,'X',{duration:4000});
  
                  vis.visitant_id=personNew.user_id;

                  if(personNew.birth_date==null){
                    vis.age=0;
                    this.toastr.warning('NO SE PUDO CALCULAR LA EDAD','VERIFICAR')
                  }
                  else{
                    var birthArray=personNew.birth_date.split('-');
                    vis.age=parseInt(this.anio)-parseInt(birthArray[0]);
                    if(parseInt(this.mes)<parseInt(birthArray[1])){
                      vis.age-=1;
                    }
                    if(parseInt(this.mes)==parseInt(birthArray[1])){
                      if(parseInt(this.dia)<parseInt(birthArray[2])){
                        vis.age-=1;
                      }
                    }
                  }
  
                  vis.date_entrance=this.fechaString;
                  vis.hour_entrance=this.horaString;
                  vis.visits=1;
                  vis.table_entrance=this.accessPoint.table_entrance;
                  //MOSTRANDO LA VALIDACIÓN
                  vis.obs='DENEGADO';
  
                  this.searchResult='denied';
                  this.name_result= p.first_name+' '+p.paternal_surname+' '+p.maternal_surname;
                  this.age_result= vis.age;
                  this.hideBlock=false;

                  document.getElementById('btnResultModal')?.click();
      
                  this.limpiar();
  

                  this.toastr.warning('Persona no autorizada','DENEGADO');
                  //
                  this.clientsService.getVisit(this.dni_ce, this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                    //VISITAS REPETIDAS
                    if(v && v.date_entrance==this.fechaString){
                      visR.visitant_id=vis.visitant_id;
                      //visR.name=vis.name;
                      visR.date_entrance=v.date_entrance;
                      visR.hour_entrance=v.hour_entrance;
                      visR.obs=v.obs;
                      visR.sala=this.accessPoint_name;
                      vis.visits=parseInt(String(v.visits))+1;
  
                      v.table_entrance=this.accessPoint.table_entrance;
                      this.clientsService.deleteVisit(v).subscribe(a=>{
                        this.clientsService.addVisit(vis).subscribe(resp=>{
                          if(resp){
                            this.clientsService.addVisitRepeated(visR).subscribe();
                          }
                        })
                      });
                    }
                    //NUEVO INGRESO
                    else{
                      this.clientsService.addVisit(vis).subscribe();
                    }
  
                    this.clientsService.addPerson(personNew).subscribe(m=>{
  
                    });
                  })
  
                } 
                //CLIENTES SIN DATOS EN RENIEC
                else{
                  personNew.type_doc = 'DNI';
                  personNew.doc_number = this.dni_ce;
                  personNew.first_name = 'PERUANO';
                  personNew.paternal_surname = 'SN';
                  personNew.maternal_surname = 'SN';
                  personNew.gender = 'SN';
                  personNew.birth_date = 'SN';
                  personNew.civil_status = 'SN';
                  personNew.profession = 'SN';
                  personNew.cel_number = 'SN';
                  personNew.email = 'SN';
                  personNew.address = 'SN';
                  personNew.district = 'SN';
                  personNew.province = 'SN';
                  personNew.region = 'SN';
                  personNew.username = 'SN';
                  personNew.password = 'SN';
                  personNew.entrance_role = 'SN';
                  personNew.latitud = 'SN';
                  personNew.longitud = 'SN';
                  personNew.photo_url = 'SN';
                  personNew.house_id = 0;
                  personNew.status = 'DENEGADO';
                  personNew.reason = 'SN';
                  personNew.colab_id = 0;
  
                  let snackBarRef = this.snackBar.open('NO SE OBTUVO DATOS DE RENIEC','X',{duration:4000});
  
                  vis.visitant_id=personNew.user_id;

                  vis.age=0
                  vis.date_entrance=this.fechaString;
                  vis.hour_entrance=this.horaString;
  
                  vis.visits=1;
                  vis.table_entrance=this.accessPoint.table_entrance
                  
                  vis.obs='DENEGADO';
  
                  this.searchResult='denied';
                  this.name_result= p.first_name+' '+p.paternal_surname+' '+p.maternal_surname;
                  this.age_result= vis.age;
                  this.hideBlock=false;
  
                  document.getElementById("btnResultModal")?.click();
                  this.limpiar();

                  this.toastr.warning('Persona no autorizada','DENEGADO');
  
                  this.clientsService.getVisit(this.dni_ce, this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                    //VISITAS REPETIDAS
                    if(v && v.date_entrance==this.fechaString){
                      visR.visitant_id=vis.visitant_id;
                      //visR.name=vis.name;
                      visR.date_entrance=v.date_entrance;
                      visR.hour_entrance=v.hour_entrance;
                      visR.obs=v.obs;
                      visR.sala=this.accessPoint_name;
                      vis.visits=parseInt(String(v.visits))+1;
  
                      v.table_entrance=this.accessPoint.table_entrance;
  
                      this.clientsService.deleteVisit(v).subscribe(a=>{
                        this.clientsService.addVisit(vis).subscribe(resp=>{
                          if(resp){
                            this.clientsService.addVisitRepeated(visR).subscribe();
                          }
                        })
                      });
                    }
                    //NUEVO REGISTRO
                    else{
                      this.clientsService.addVisit(vis).subscribe();
                    }
                  })
  
                }
              })
            }
  
          }
        })
      }

      //El codigo ingresado es de un vehículo
      else{
        this.type_result='VEHICLE';
        vis.type='VEHICULO';
        visR.type='VEHICULO';
        this.clientsService.getVehicle(this.dni_ce).subscribe((v:Vehicle)=>{
          console.log('consulta Vehicle',v);
          if(v){
            this.doc_result=this.dni_ce;
            this.house_result=v.house_address;

            console.log('esta en BD');

            vis.visitant_id=v.vehicle_id;
            vis.age=0;
  
            vis.date_entrance=this.fechaString;
            vis.hour_entrance=this.horaString;
            vis.visits=1;
            vis.table_entrance=this.accessPoint.table_entrance;
  
            if(v.status=='DENEGADO'){
              console.log('denegado');
  
              this.searchResult='denied'; 
              this.name_result= v.type;
              this.age_result= vis.age;
              this.hideBlock=false;


              var message = 'Vehiculo denegado'
              console.log(v);
              if(String(v.reason)!=''){
                message+='\n Motivo: '+String(v.reason);
              }
              this.toastr.warning(message,'DENEGADO');
  
              vis.obs='DENEGADO';
  
            }
            else if(v.status=='RESTRINGIDO'){
              console.log('restringido');
  
              this.searchResult='warn';
              this.name_result= v.type;
              this.age_result= vis.age;
              this.hideWarn=false;

  
              var message = 'Vehciculo con restricción'
              console.log(v);
              if(String(v.reason)!=''){
                message+='\n Motivo: '+String(v.reason);
              }
              this.toastr.warning(message,'RESTRINGIDO');
  
              vis.obs='RESTRINGIDO';

            }
            else if(v.status=='VIP'){
              console.log('vip');
              this.searchResult='vip';
              this.name_result= v.type;
              this.age_result= vis.age;
              this.hideVip=false;

              var message='Vehiculo VIP';
              console.log(v);
              if(String(v.reason)!=''){
                message+='\n Motivo: '+String(v.reason);
              }
              this.toastr.info(message,'VIP');
              vis.obs='VIP';
  
            }
            else if(v.status=='OBSERVADO'){
              console.log('observado');
              this.searchResult = 'obs';
              this.name_result= v.type
              this.age_result= vis.age;
              this.hideObs=false;

              var message='Vehiculo para seguimiento';
              console.log(v);
              if(String(v.reason)!=''){
                message+='\n Motivo: '+String(v.reason);
              }
              this.toastr.info(message,'OBSERVADO');
              vis.obs='EN OBSERVACIÓN';
  
            }
            else{
  
              console.log('ni restringido ni destacado');
              this.searchResult='allowed';
              this.name_result= v.type;
              this.age_result= vis.age;
              this.hideCheck=false;

              console.log('normal');

              this.toastr.success('Vehiculo sin restricciones','PERMITIDO');

              vis.obs='PERMITIDO';

              console.log(this.accessPoint.table_entrance);
  
            }

            document.getElementById('btnResultModal')?.click();
            this.limpiar();

            this.clientsService.getVisit(this.dni_ce,this.accessPoint.table_entrance).subscribe((v:Visit)=>{
              console.log('getVisit:',v);
              if(v && v.date_entrance==this.fechaString){
                console.log('visita encontrada:',v);
                visR.visitant_id=vis.visitant_id;
                //visR.name=vis.name;
                visR.date_entrance=v.date_entrance;
                visR.hour_entrance=v.hour_entrance;
                visR.obs=v.obs;
                visR.sala=this.accessPoint_name;
                vis.visits=parseInt(String(v.visits))+1;

                v.table_entrance=this.accessPoint.table_entrance;

                this.clientsService.deleteVisit(v).subscribe(a=>{
                  console.log('Resultado borrar visita',a);
                  this.clientsService.addVisit(vis).subscribe(resp=>{
                    if(resp){
                      this.clientsService.addVisitRepeated(visR).subscribe();
                    }
                  })
                });
              }
              else{
                console.log('Visita no encontrada');
                this.clientsService.addVisit(vis).subscribe();
              }
            })
          }
          else{
            this.doc_result=this.dni_ce;
            this.house_result='SN';

            console.log('no esta en BD')

            this.toastr.info('SIN DATOS');
  
            var vehicleNew = new Vehicle('',0,'','','');

            vehicleNew.house_id=0;
            vehicleNew.plate=this.dni_ce;
            vehicleNew.type='SN';
            vehicleNew.status='DENEGADO';
            vehicleNew.reason='SN';

            this.searchResult='denied';
            this.name_result= vehicleNew.type;
            this.age_result= vis.age;
            this.hideBlock=false;

            document.getElementById('btnResultModal')?.click();

            this.limpiar();

            this.clientsService.addVehicle(vehicleNew).subscribe(resAddNewVehicle=>{
              if(resAddNewVehicle&&resAddNewVehicle['lastId']){
                vis.visitant_id=resAddNewVehicle['lastId'];
                vis.age=0
                vis.date_entrance=this.fechaString;
                vis.hour_entrance=this.horaString;
                vis.visits=1;
                vis.table_entrance=this.accessPoint.table_entrance
                vis.obs='DENEGADO';
  
                this.toastr.error('Persona sin autorización','DENEGADO');
    
                this.clientsService.getVisit(this.dni_ce, this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                  //VISITAS REPETIDAS
                  if(v && v.date_entrance==this.fechaString){
                    visR.visitant_id=vis.visitant_id;
                    //visR.name=vis.name;
                    visR.date_entrance=v.date_entrance;
                    visR.hour_entrance=v.hour_entrance;
                    visR.obs=v.obs;
                    visR.sala=this.accessPoint_name;
                    vis.visits=parseInt(String(v.visits))+1;
    
                    v.table_entrance=this.accessPoint.table_entrance;
    
                    // this.clientsService.deleteVisit(v).subscribe(a=>{
                      this.clientsService.addVisit(vis).subscribe(resp=>{
                        //if(resp){
                          //this.clientsService.addVisitRepeated(visR).subscribe();
                        //}
                      })
                    //}); 
                  }
                  //NUEVO REGISTRO
                  else{
                    this.clientsService.addVisit(vis).subscribe();
                  }
                })
              }
            })
  
          }


        })

      }
    }

  }

  limpiar(){
    setTimeout(()=>{
      this.hideDoc=false;
      this.hideLoad=true;

      this.hideAll=false;
      this.hideBirthCeleb=true;

      this.docInputText='';
      this.disableDocInput=false;

      this.hideCheck=true;
      this.hideBlock=true;
      this.hideBirth=true;
      this.hideObs=true;
      this.hideWarn=true;
      this.hideVip=true;
  
      this.name_result='';
  
      this.age_result=0;

      document.getElementById('btnResultModal')?.click();

      setTimeout(()=>{
        document.getElementById("docInput").focus();
      }, 500)

    }, 3000);
  }

  ngOnInit() {

    initFlowbite();

    this.disableDocInput=false;

    this.hideDoc=false;
    this.hideLoad=true;

    this.hideAll=false;
    this.hideBirthCeleb=true;

    this.hideCheck=true;
    this.hideBlock=true;
    this.hideBirth=true;
    this.hideObs=true;
    this.hideWarn=true;
    this.hideVip=true;


    this.linkTitle='assets/titulo3.png';

    if(this.cookies.checkToken('accessPoint_id')&&this.cookies.checkToken('onSession')){

      this.accessPoint_id=parseInt(this.cookies.getToken('accessPoint_id'));

      this.userService.getAccessPointById(this.accessPoint_id).subscribe((cam:AccesPoint)=>{
        if(cam){
          this.accessPoint=cam;
          setTimeout(()=>{
            document.getElementById("docInput").focus();
          }, 1000)
        }
        else{
          this.cookies.deleteToken("user_id");
          this.cookies.deleteToken("user_role");
          this.cookies.deleteToken('accessPoint_id');
          this.cookies.deleteToken('onSession');
          this.toastr.error('Sala no existe');
          this.router.navigateByUrl('/');
          location.reload();
        }
      })
  
    }
    else{

      if(this.cookies.checkToken('accessPoint_id')){

        this.accessPoint_id=parseInt(this.cookies.getToken('accessPoint_id'));

        var dialogRef2;
  
        dialogRef2=this.dialog.open(DialogValidate,{
          data:this.accessPoint_name,
          disableClose:true,
          width:'500px'
        })
  
        dialogRef2.afterClosed().subscribe(result => {
          if(result){
            location.reload();
          }
        })
      }

      else{
        var dialogRef;
  
        dialogRef=this.dialog.open(DialogSelectSala,{
          data:'',
          panelClass: ['w-5/6', 'sm:w-3/5', 'items-center', 'content-center', 'justify-center'],
          disableClose:true
        })
  
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            this.accessPoint_id=parseInt(this.cookies.getToken('accessPoint_id'));
            var dialogRef2;
    
            dialogRef2=this.dialog.open(DialogValidate,{
              data:this.accessPoint_name,
              disableClose:true,
              width:'500px'
            })
      
            dialogRef2.afterClosed().subscribe(result => {
              if(result){
                location.reload();
              }
            })
          }
        })
      }
      


    }
  }


}


@Component({
  selector: 'dialog-resultado',
  templateUrl: 'dialog-resultado.html',
  styleUrls: ['./inicio.component.css']
})
export class DialogResultado implements OnInit {

  doc = new jsPDF();
  img = new Image();
  name_result = '';
  age_result = 0;

  hideCheck=false;
  hideBlock=false;
  hideBirth=false;
  hideObs=false;
  hideWarn=false;
  hideVip=false;

  urlResult;

  constructor(
    public dialogRef: MatDialogRef<DialogResultado>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {

    this.hideCheck=true;
    this.hideBlock=true;
    this.hideBirth=true;
    this.hideObs=true;
    this.hideWarn=true;
    this.hideVip=true;

    this.name_result=this.data['name_result'];

    this.age_result=this.data['age_result'];

    if(this.data['result']=='allowed'){
      this.hideCheck=false;
    }
    if(this.data['result']=='vip'){
      this.hideVip=false;
    }
    if(this.data['result']=='denied'){
      this.hideBlock=false;
    }
    if(this.data['result']=='birth'){
      this.hideBirth=false;
    }
    if(this.data['result']=='obs'){
      this.hideObs=false;
    }
    if(this.data['result']=='warn'){
      this.hideWarn=false;
    }

    setTimeout(() => {
      this.onNoClick();
    }, 3000);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}





@Component({
  selector: 'dialog-select-sala',
  templateUrl: 'dialog-select-sala.html',
  styleUrls: ['./inicio.component.css']
})
export class DialogSelectSala implements OnInit {

  campus: AccesPoint[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogSelectSala>,
    @Inject(MAT_DIALOG_DATA) public data:string,
    private fb: FormBuilder,
    private userService: UsersService,
    private toastr: ToastrService,
    private cookies: CookiesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userService.getAccessPointsByStatus().subscribe((campusList:AccesPoint[])=>{
      if(campusList){
        this.campus=campusList;
/*         this.campus.forEach((c:AccesPoint)=>{
          c.image_url='http://52.5.47.64/Logistica/assets/logo'+c.name+'.png';
        }) */
      }
    })
  }

  select(ap:AccesPoint){
    this.cookies.setToken("accessPoint_id",String(ap.id));
    this.dialogRef.close(true);
  }

}



@Component({
  selector: 'dialog-validate',
  templateUrl: 'dialog-validate.html',
  styleUrls: ['./inicio.component.css']
})
export class DialogValidate implements OnInit {

  user: User = new User('','','','','','','','','','','','','',0,'','','','','','','','','','','',0,'',0);
  username_system='';
  password_system='';

  constructor(
    public dialogRef: MatDialogRef<DialogValidate>,
    @Inject(MAT_DIALOG_DATA) public data:string,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private cookies: CookiesService,
    private router: Router,
    private usersService: UsersService,
    private cookiesService: CookiesService,
  ) {}

  ngOnInit(): void {
    console.log(this.data)
  }

  changeCampus(){
    this.cookies.deleteToken('accessPoint_id');
    this.cookies.deleteToken('onSession');
    this.dialogRef.close(true);
  }

  validate(){

    this.usersService.getPaymentByClientId(1).subscribe((resPay:Payment)=>{
      console.log(resPay);
      if(resPay.error){
        this.cookies.deleteToken("user_id");
        this.cookies.deleteToken("user_role");
        this.cookies.deleteToken('sala');
        this.cookies.deleteToken('onSession');
        console.error('Error al obtener el pago:', resPay.error);
        this.toastr.error('Error al obtener la licencia: '+resPay.error);
        this.router.navigateByUrl('/');
        console.log('No cumple licencia en APP MODULE');

      }
      else{

        this.username_system=this.username_system.trim();
        this.password_system=this.password_system.trim();
        this.usersService.getUser(this.username_system,this.password_system).subscribe((res:User)=>{
        console.log(res);
          if(res){
            this.user=res;
            if(this.user.role_system!='NINGUNO'){
              this.cookiesService.setToken('onSession','Y')
              this.cookiesService.setToken('user_id',String(this.user.user_id));
              this.toastr.success('Inicio de sesión exitoso')
              setTimeout(()=>{
                this.dialogRef.close(true);
              })
            }
            else{
              this.toastr.warning('El usuario no tiene permisos');
            }
  
    
          }
          else{
            if(this.username_system==''||this.password_system==''){
              this.toastr.warning('Ingresa un usuario y contraseña');
            }
            else{
              this.toastr.error('Usuario y/o contraseña incorrecto(s)');
            }
    
          }
        })
      }
    },
    (error) => {
      this.cookies.deleteToken("user_id");
      this.cookies.deleteToken("user_role");
      this.cookies.deleteToken('sala');
      console.error('Error al obtener el pago:', error);

      // Maneja el error aquí según tus necesidades
      this.toastr.error('Error al obtener la licencia: '+error);
      this.router.navigateByUrl('/');
    });

  }

}
