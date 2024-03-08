
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

  cliente: Person = new Person('','','','','','','','','','','','','','','','','','','','','',0,0,'','');

  clientes: Person[] = [];

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

    //var loadingTask = pdfjsLib.getDocument('http://192.168.4.250/Sistema consulta de Ludopatía.pdf');
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


/*   search(e){

    this.dni_ce = String(e.trim());
    this.disableDocInput=true;
    this.hideDoc=true;
    this.hideLoad=false;

    this.fecha= new Date();

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


    if(this.dni_ce.length<8||this.dni_ce.length>11){
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
    else{

      this.ludopatiaService.getLudopataxDoc(this.dni_ce).subscribe((l:Ludopata)=>{
        if(l){

          var dialogRef;
  
          dialogRef=this.dialog.open(DialogResultado,{
            data:{result:'denied',
            name_result:l.name,
            age_result:'NO APLICA'}
          })
  
          dialogRef.afterClosed().subscribe(result => {
            this.limpiar();
          })
  
          this.toastr.error('Prohibido por ludopatía','PROHIBIDO');
  
          var vis = new Visit('','',0,'','','','','',0,'');
          var visR = new VisitRepeated('','','','','','');
  
          vis.doc_number=this.dni_ce;
          vis.name=l.name;
          vis.gender='SN';
          vis.age=0;
          vis.date_entrance=this.fechaString;
          vis.hour_entrance=this.horaString;
          vis.obs='DENEGADO';
          vis.address='SN';
          vis.visits=1;
          vis.table_entrance=this.sala.table_entrance;
  
          this.clientsService.getVisit(this.dni_ce,this.sala.table_entrance).subscribe((v:Visit)=>{
            if(v && v.date_entrance==this.fechaString){
              visR.doc_number=vis.doc_number;
              visR.name=vis.name;
              visR.date_entrance=v.date_entrance;
              visR.hour_entrance=v.hour_entrance;
              visR.obs=v.obs;
              visR.sala=this.sala_name;
              vis.visits=parseInt(String(v.visits))+1;

              v.table_entrance=this.sala.table_entrance;

              this.clientsService.deleteVisit(v).subscribe(a=>{
                this.clientsService.addVisit(vis).subscribe(resp=>{
                  if(resp){
                    this.clientsService.addVisitRepeated(visR).subscribe();
                  }
                })
              });
            }
            else{
              this.clientsService.addVisit(vis).subscribe();
            }
          })
  
        }
        else{
          this.clientsService.getClient(this.dni_ce).subscribe((c:Cliente)=>{
  
            var vis = new Visit('','',0,'','','','','',0,'');
            var visR = new VisitRepeated('','','','','','');
  
            if(c){

              console.log('esta en BD')
  
              vis.doc_number=this.dni_ce;
              vis.name=c.client_name;
              vis.gender=c.gender;
              if(c.birth_date==null){
                vis.age=0;
                this.toastr.warning('NO SE PUDO CALCULAR LA EDAD','VERIFICAR');
              }
              else{
                var birthArray=c.birth_date.split('-');
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
              vis.address=c.departamento+'-'+c.provincia+'-'+c.distrito;
              vis.visits=1;
              vis.table_entrance=this.sala.table_entrance;
  
              if(c.condicion=='RESTRINGIDO'){
                console.log('restringido');
  
                var dialogRef;
  
                dialogRef=this.dialog.open(DialogResultado,{
                  data:{result:'warn',
                  name_result:c.client_name,
                  age_result:vis.age
                },
                  
                })
  
                dialogRef.afterClosed().subscribe(result => {
                  this.limpiar();
                })
  
                var message = 'Cliente con restricción'
                if(String(c.motivo)!=''){
                  message+='\n Motivo: '+String(c.motivo);
                }
                this.toastr.warning(message,'RESTRINGIDO');
  
                vis.obs='RESTRINGIDO';
  
                this.clientsService.getVisit(this.dni_ce,this.sala.table_entrance).subscribe((v:Visit)=>{
                  if(v && v.date_entrance==this.fechaString){
                    visR.doc_number=vis.doc_number;
                    visR.name=vis.name;
                    visR.date_entrance=v.date_entrance;
                    visR.hour_entrance=v.hour_entrance;
                    visR.obs=v.obs;
                    visR.sala=this.sala_name;
                    vis.visits=parseInt(String(v.visits))+1;

                    v.table_entrance=this.sala.table_entrance;

                    this.clientsService.deleteVisit(v).subscribe(a=>{
                      this.clientsService.addVisit(vis).subscribe(resp=>{
                        if(resp){
                          this.clientsService.addVisitRepeated(visR).subscribe();
                        }
                      })
                    });
                  }
                  else{
                    this.clientsService.addVisit(vis).subscribe();
                  }
                })
  
              }
              else if(c.condicion=='VIP'){
                console.log('vip');
                if(c.birth_date && c.birth_date.includes(this.fecha_cumple)){
  
                  var dialogRef;
  
                  dialogRef=this.dialog.open(DialogResultado,{
                    data:{result:'birth',
                    name_result:c.client_name,
                    age_result:vis.age}
                  })
  
                  dialogRef.afterClosed().subscribe(result => {
                    this.limpiar();
                  })
  
                  var message = 'Cliente VIP cumpleañero'

                  if(String(c.motivo)!=''){
                    message+='\n Motivo: '+String(c.motivo);
                  }
                  this.toastr.info(message,'VIP CUMPLEAÑERO');
                  vis.obs='VIP';
  
  
                  this.clientsService.getVisit(this.dni_ce, this.sala.table_entrance).subscribe((v:Visit)=>{
                    if(v && v.date_entrance==this.fechaString){
                      visR.doc_number=vis.doc_number;
                      visR.name=vis.name;
                      visR.date_entrance=v.date_entrance;
                      visR.hour_entrance=v.hour_entrance;
                      visR.obs=v.obs;
                      visR.sala=this.sala_name;
                      vis.visits=parseInt(String(v.visits))+1;

                      v.table_entrance=this.sala.table_entrance;

                      this.clientsService.deleteVisit(v).subscribe(a=>{
                        this.clientsService.addVisit(vis).subscribe(resp=>{
                          if(resp){
                            this.clientsService.addVisitRepeated(visR).subscribe();
                          }
                        })
                      });
                    }
                    else{
                      this.clientsService.addVisit(vis).subscribe();
                    }
                  })
  
                }
                else{
  
                  var dialogRef;
  
                  dialogRef=this.dialog.open(DialogResultado,{
                    data:{result:'vip',
                    name_result:c.client_name,
                    age_result:vis.age}
                  })
  
                  dialogRef.afterClosed().subscribe(result => {
                    this.limpiar();
                  })
  
                  var message='Cliente VIP';

                  if(String(c.motivo)!=''){
                    message+='\n Motivo: '+String(c.motivo);
                  }
                  this.toastr.info(message,'VIP');
                  vis.obs='VIP';
  
                  this.clientsService.getVisit(this.dni_ce, this.sala.table_entrance).subscribe((v:Visit)=>{
                    if(v && v.date_entrance==this.fechaString){
                      visR.doc_number=vis.doc_number;
                      visR.name=vis.name;
                      visR.date_entrance=v.date_entrance;
                      visR.hour_entrance=v.hour_entrance;
                      visR.obs=v.obs;
                      visR.sala=this.sala_name;
                      vis.visits=parseInt(String(v.visits))+1;

                      v.table_entrance=this.sala.table_entrance;

                      this.clientsService.deleteVisit(v).subscribe(a=>{
                        this.clientsService.addVisit(vis).subscribe(resp=>{
                          if(resp){
                            this.clientsService.addVisitRepeated(visR).subscribe();
                          }
                        })
                      });
                    }
                    else{
                      this.clientsService.addVisit(vis).subscribe();
                    }
                  })
  
                }
  
              }
              else if(c.condicion=='OBSERVADO'){
                console.log('observado');
                if(c.birth_date && c.birth_date.includes(this.fecha_cumple)){
  
                  var dialogRef;
  
                  dialogRef=this.dialog.open(DialogResultado,{
                    data:{result:'birth',
                    name_result:c.client_name,
                    age_result:vis.age}
                  })
  
                  dialogRef.afterClosed().subscribe(result => {
                    this.limpiar();
                  })
  
                  var message = 'Cliente para seguimiento'

                  if(String(c.motivo)!=''){
                    message+='\n Motivo: '+String(c.motivo);
                  }
                  this.toastr.info(message,'OBSERVADO DE CUMPLEAÑOS');
                  vis.obs='OBSERVADO';
  
  
                  this.clientsService.getVisit(this.dni_ce, this.sala.table_entrance).subscribe((v:Visit)=>{
                    if(v && v.date_entrance==this.fechaString){
                      visR.doc_number=vis.doc_number;
                      visR.name=vis.name;
                      visR.date_entrance=v.date_entrance;
                      visR.hour_entrance=v.hour_entrance;
                      visR.obs=v.obs;
                      visR.sala=this.sala_name;
                      vis.visits=parseInt(String(v.visits))+1;

                      v.table_entrance=this.sala.table_entrance;

                      this.clientsService.deleteVisit(v).subscribe(a=>{
                        this.clientsService.addVisit(vis).subscribe(resp=>{
                          if(resp){
                            this.clientsService.addVisitRepeated(visR).subscribe();
                          }
                        })
                      });
                    }
                    else{
                      this.clientsService.addVisit(vis).subscribe();
                    }
                  })
  
                }
                else{
  
                  var dialogRef;
  
                  dialogRef=this.dialog.open(DialogResultado,{
                    data:{result:'obs',
                    name_result:c.client_name,
                    age_result:vis.age}
                  })
  
                  dialogRef.afterClosed().subscribe(result => {
                    this.limpiar();
                  })
  
                  var message='Cliente para seguimiento';

                  if(String(c.motivo)!=''){
                    message+='\n Motivo: '+String(c.motivo);
                  }
                  this.toastr.info(message,'OBSERVADO');
                  vis.obs='EN OBSERVACIÓN';
  
                  this.clientsService.getVisit(this.dni_ce, this.sala.table_entrance).subscribe((v:Visit)=>{
                    if(v && v.date_entrance==this.fechaString){
                      visR.doc_number=vis.doc_number;
                      visR.name=vis.name;
                      visR.date_entrance=v.date_entrance;
                      visR.hour_entrance=v.hour_entrance;
                      visR.obs=v.obs;
                      visR.sala=this.sala_name;
                      vis.visits=parseInt(String(v.visits))+1;

                      v.table_entrance=this.sala.table_entrance;

                      this.clientsService.deleteVisit(v).subscribe(a=>{
                        this.clientsService.addVisit(vis).subscribe(resp=>{
                          if(resp){
                            this.clientsService.addVisitRepeated(visR).subscribe();
                          }
                        })
                      });
                    }
                    else{
                      this.clientsService.addVisit(vis).subscribe();
                    }
                  })
  
                }
  
              }
              else{

                console.log('ni restringido ni destacado');
                if(c.birth_date!=null){
                  if(c.birth_date && c.birth_date.includes(this.fecha_cumple)){
                    console.log('cumpleañero');
    
                    var dialogRef;
    
                    dialogRef=this.dialog.open(DialogResultado,{
                      data:{result:'birth',
                      name_result:c.client_name,
                      age_result:vis.age}
                    })
    
                    dialogRef.afterClosed().subscribe(result => {
                      this.limpiar();
                    })
    
                    this.toastr.info('Cliente de cumpleaños','CUMPLEAÑOS');
    
                    vis.obs='PERMITIDO';
    
                    this.clientsService.getVisit(this.dni_ce, this.sala.table_entrance).subscribe((v:Visit)=>{
                      if(v && v.date_entrance==this.fechaString){
                        visR.doc_number=vis.doc_number;
                        visR.name=vis.name;
                        visR.date_entrance=v.date_entrance;
                        visR.hour_entrance=v.hour_entrance;
                        visR.obs=v.obs;
                        visR.sala=this.sala_name;
                        vis.visits=parseInt(String(v.visits))+1;
  
                        v.table_entrance=this.sala.table_entrance;
  
                        this.clientsService.deleteVisit(v).subscribe(a=>{
                          this.clientsService.addVisit(vis).subscribe(resp=>{
                            if(resp){
                              this.clientsService.addVisitRepeated(visR).subscribe();
                            }
                          })
                        });
                      }
                      else{
                        this.clientsService.addVisit(vis).subscribe();
                      }
                    })
    
                  }
                  else{
  
                    console.log('normal');
                    var dialogRef;
    
                    dialogRef=this.dialog.open(DialogResultado,{
                      data:{result:'allowed',
                      name_result:c.client_name,
                      age_result:vis.age}
                    })
    
                    dialogRef.afterClosed().subscribe(result => {
                      this.limpiar();
                    })
    
                    this.toastr.success('Cliente sin restricciones','PERMITIDO');
    
                    vis.obs='PERMITIDO';
  
                    console.log(this.sala.table_entrance);
    
                    this.clientsService.getVisit(this.dni_ce, this.sala.table_entrance).subscribe((v:Visit)=>{
                      console.log(v);
                      console.log(this.fechaString);
                      if(v && v.date_entrance==this.fechaString){
                        visR.doc_number=vis.doc_number;
                        visR.name=vis.name;
                        visR.date_entrance=v.date_entrance;
                        visR.hour_entrance=v.hour_entrance;
                        visR.obs=v.obs;
                        visR.sala=this.sala_name;
                        vis.visits=parseInt(String(v.visits))+1;
  
                        v.table_entrance=this.sala.table_entrance;
                        
                        console.log('listo para borrar');
                        this.clientsService.deleteVisit(v).subscribe(a=>{
                          console.log(a);
                          console.log('visita borrada');
                          this.clientsService.addVisit(vis).subscribe(resp=>{
                            console.log('llegamos aqui')
                            console.log(resp);
                            if(resp){
                              this.clientsService.addVisitRepeated(visR).subscribe();
                            }
                          })
                        });
                      }
                      else{
                        console.log(vis);
                        this.clientsService.addVisit(vis).subscribe(resp=>{
                          console.log('llegamos aqui siii')
                          console.log(resp);
                        });
                      }
                    })
    
    
                  }
                }
                else{
  
                  console.log('normal');
                  var dialogRef;
  
                  dialogRef=this.dialog.open(DialogResultado,{
                    data:{result:'allowed',
                    name_result:c.client_name,
                    age_result:vis.age}
                  })
  
                  dialogRef.afterClosed().subscribe(result => {
                    this.limpiar();
                  })
  
                  this.toastr.success('Cliente sin restricciones','PERMITIDO');
  
                  vis.obs='PERMITIDO';

                  console.log(this.sala.table_entrance);
  
                  this.clientsService.getVisit(this.dni_ce, this.sala.table_entrance).subscribe((v:Visit)=>{
                    console.log(v);
                    console.log(this.fechaString);
                    if(v && v.date_entrance==this.fechaString){
                      visR.doc_number=vis.doc_number;
                      visR.name=vis.name;
                      visR.date_entrance=v.date_entrance;
                      visR.hour_entrance=v.hour_entrance;
                      visR.obs=v.obs;
                      visR.sala=this.sala_name;
                      vis.visits=parseInt(String(v.visits))+1;

                      v.table_entrance=this.sala.table_entrance;
                      
                      console.log('listo para borrar');
                      this.clientsService.deleteVisit(v).subscribe(a=>{
                        console.log(a);
                        console.log('visita borrada');
                        this.clientsService.addVisit(vis).subscribe(resp=>{
                          console.log('llegamos aqui')
                          console.log(resp);
                          if(resp){
                            this.clientsService.addVisitRepeated(visR).subscribe();
                          }
                        })
                      });
                    }
                    else{
                      console.log(vis);
                      this.clientsService.addVisit(vis).subscribe(resp=>{
                        console.log('llegamos aqui siii')
                        console.log(resp);
                      });
                    }
                  })

                }

  
              }
            }
            //CLIENTE PERMITIDO
            else{
              console.log('no esta en BD')
              var dialogRef;

              if(this.dni_ce.length>8){

                this.toastr.info('SIN DATOS','Documento distinto a DNI');

                var clienteNew = new Cliente('','','','','','','','','','','','');

                clienteNew.doc_number = this.dni_ce;
                clienteNew.client_name = 'JUGADOR';
                clienteNew.birth_date = 'SN';
                clienteNew.gender = 'SN';
                clienteNew.departamento = 'SN';
                clienteNew.provincia = 'SN';
                clienteNew.distrito = 'SN';
                clienteNew.address = 'SN';
                clienteNew.condicion = 'PERMITIDO';
                clienteNew.motivo = ' ';
                clienteNew.sala_registro = this.sala_name;
                clienteNew.fecha_registro = this.fechaString;

                vis.doc_number=this.dni_ce;
                vis.name=clienteNew.client_name;
                vis.gender=clienteNew.gender;
                vis.age=0
                vis.date_entrance=this.fechaString;
                vis.hour_entrance=this.horaString;
                vis.address='SN';

                vis.visits=1;
                vis.table_entrance=this.sala.table_entrance
                //
                vis.obs='PERMITIDO';

                dialogRef=this.dialog.open(DialogResultado,{
                  data:{result:'allowed',
                  name_result:vis.name,
                  age_result:vis.age}
                })
    
                dialogRef.afterClosed().subscribe((result:Item) => {
                  this.limpiar();
                })
                this.toastr.success('Cliente sin restricciones','PERMITIDO');

                this.clientsService.getVisit(this.dni_ce, this.sala.table_entrance).subscribe((v:Visit)=>{
                  //VISITAS REPETIDAS
                  if(v && v.date_entrance==this.fechaString){
                    visR.doc_number=vis.doc_number;
                    visR.name=vis.name;
                    visR.date_entrance=v.date_entrance;
                    visR.hour_entrance=v.hour_entrance;
                    visR.obs=v.obs;
                    visR.sala=this.sala_name;
                    vis.visits=parseInt(String(v.visits))+1;

                    v.table_entrance=this.sala.table_entrance;

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
              else{
                this.toastr.info('Cliente nuevo!','REGISTRANDO...');







                
                this.clientsService.getClientFromReniec(this.dni_ce).subscribe(res=>{
  
                  var clienteNew = new Cliente('','','','','','','','','','','','');
    
                  //CLIENTE CON DATOS EN RENIEC
                  if(res['success']){
                    clienteNew.doc_number = res['data']['numero'];
                    clienteNew.client_name = res['data']['nombre_completo'];
                    clienteNew.birth_date = res['data']['fecha_nacimiento'];
                    clienteNew.gender = res['data']['sexo'];
                    clienteNew.departamento = res['data']['departamento'];
                    clienteNew.provincia = res['data']['provincia'];
                    clienteNew.distrito = res['data']['distrito'];
                    clienteNew.address = res['data']['direccion'];
                    clienteNew.condicion = 'PERMITIDO';
                    clienteNew.motivo = ' ';
                    clienteNew.sala_registro = this.sala_name;
                    clienteNew.fecha_registro = this.fechaString;
    
                    let snackBarRef = this.snackBar.open(clienteNew.client_name,'X',{duration:4000});
    
                    vis.doc_number=this.dni_ce;
                    vis.name=clienteNew.client_name;
                    vis.gender=clienteNew.gender;
                    if(clienteNew.birth_date==null){
                      vis.age=0;
                      this.toastr.warning('NO SE PUDO CALCULAR LA EDAD','VERIFICAR')
                    }
                    else{
                      var birthArray=clienteNew.birth_date.split('-');
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
                    vis.address=clienteNew.departamento+'-'+clienteNew.provincia+'-'+clienteNew.distrito;
                    vis.visits=1;
                    vis.table_entrance=this.sala.table_entrance;
                    //MOSTRANDO LA VALIDACIÓN
                    vis.obs='PERMITIDO';
                    dialogRef=this.dialog.open(DialogResultado,{
                      data:{result:'allowed',
                      name_result:vis.name,
                      age_result:vis.age}
                    })
        
                    dialogRef.afterClosed().subscribe((result:Item) => {
                      this.limpiar();
                    })
                    this.toastr.success('Cliente sin restricciones','PERMITIDO');
                    this.clientsService.getVisit(this.dni_ce, this.sala.table_entrance).subscribe((v:Visit)=>{
                      //VISITAS REPETIDAS
                      if(v && v.date_entrance==this.fechaString){
                        visR.doc_number=vis.doc_number;
                        visR.name=vis.name;
                        visR.date_entrance=v.date_entrance;
                        visR.hour_entrance=v.hour_entrance;
                        visR.obs=v.obs;
                        visR.sala=this.sala_name;
                        vis.visits=parseInt(String(v.visits))+1;
  
                        v.table_entrance=this.sala.table_entrance;
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
    
                      this.clientsService.addCliente(clienteNew).subscribe(m=>{
    
                      });
                    })
    
                  } 
                  //CLIENTES SIN DATOS EN RENIEC
                  else{
                    clienteNew.doc_number = this.dni_ce;
                    clienteNew.client_name = 'JUGADOR';
                    clienteNew.birth_date = 'SN';
                    clienteNew.gender = 'SN';
                    clienteNew.departamento = 'SN';
                    clienteNew.provincia = 'SN';
                    clienteNew.distrito = 'SN';
                    clienteNew.address = 'SN';
                    clienteNew.condicion = 'PERMITIDO';
                    clienteNew.motivo = ' ';
                    clienteNew.sala_registro = this.sala_name;
                    clienteNew.fecha_registro = this.fechaString;
    
                    let snackBarRef = this.snackBar.open('NO SE OBTUVO DATOS DE RENIEC','X',{duration:4000});
    
                    vis.doc_number=this.dni_ce;
                    vis.name=clienteNew.client_name;
                    vis.gender=clienteNew.gender;
                    vis.age=0
                    vis.date_entrance=this.fechaString;
                    vis.hour_entrance=this.horaString;
                    vis.address='SN';
    
                    vis.visits=1;
                    vis.table_entrance=this.sala.table_entrance

                    vis.obs='PERMITIDO';
  
                    dialogRef=this.dialog.open(DialogResultado,{
                      data:{result:'allowed',
                      name_result:vis.name,
                      age_result:vis.age}
                    })
        
                    dialogRef.afterClosed().subscribe((result:Item) => {
                      this.limpiar();
                    })
                    this.toastr.success('Cliente sin restricciones','PERMITIDO');
 
    
                    this.clientsService.getVisit(this.dni_ce, this.sala.table_entrance).subscribe((v:Visit)=>{
                      //VISITAS REPETIDAS
                      if(v && v.date_entrance==this.fechaString){
                        visR.doc_number=vis.doc_number;
                        visR.name=vis.name;
                        visR.date_entrance=v.date_entrance;
                        visR.hour_entrance=v.hour_entrance;
                        visR.obs=v.obs;
                        visR.sala=this.sala_name;
                        vis.visits=parseInt(String(v.visits))+1;
  
                        v.table_entrance=this.sala.table_entrance;
  
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
      })
    }

  } */






  search(e){

    this.dni_ce= String(e.trim());
    this.disableDocInput=true;
    this.hideDoc=true;
    this.hideLoad=false;

    this.fecha= new Date();

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
    else{

      if(this.dni_ce.length>=8){
        this.clientsService.getPerson(this.dni_ce).subscribe((c:Person)=>{
  
          var vis = new Visit(0,0,'','','',0,'','');
          var visR = new VisitRepeated(0,0,'','','','','');
  
          if(c){
  
            console.log('esta en BD');
  
            vis.person_id=c.user_id;
            if(c.birth_date==null){
              vis.age=0;
              this.toastr.warning('NO SE PUDO CALCULAR LA EDAD','VERIFICAR');
            }
            else{
              var birthArray=c.birth_date.split('-');
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
            //vis.address=c.region+'-'+c.province+'-'+c.district;
            vis.visits=1;
            vis.table_entrance=this.accessPoint.table_entrance;
  
            if(c.status=='DENEGADO'){
              console.log('denegado');
  
              this.searchResult='denied';
              this.hideBlock=false;

              document.getElementById('btnResultModal')?.click();
              this.limpiar();

  
              var message = 'Cliente denegado'
              console.log(c);
              if(String(c.reason)!=''){
                message+='\n Motivo: '+String(c.reason);
              }
              this.toastr.warning(message,'DENEGADO');
  
              vis.obs='DENEGADO';
  
              this.clientsService.getVisit(this.dni_ce,this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                if(v && v.date_entrance==this.fechaString){
                  visR.person_id=vis.person_id;
                  //visR.name=vis.name;
                  visR.date_entrance=v.date_entrance;
                  visR.hour_entrance=v.hour_entrance;
                  visR.obs=v.obs;
                  visR.sala=this.accessPoint_name;
                  //vis.visits=parseInt(String(v.visits))+1;
  
                  v.table_entrance=this.accessPoint.table_entrance;
  
                  this.clientsService.deleteVisit(v).subscribe(a=>{
                    this.clientsService.addVisit(vis).subscribe(resp=>{
                      if(resp){
                        this.clientsService.addVisitRepeated(visR).subscribe();
                      }
                    })
                  });
                }
                else{
                  this.clientsService.addVisit(vis).subscribe();
                }
              })
  
            }
            else if(c.status=='RESTRINGIDO'){
              console.log('restringido');
  
              this.searchResult='warn';
              this.hideWarn=false;

              document.getElementById('btnResultModal')?.click();
              this.limpiar();

  
              var message = 'Cliente con restricción'
              console.log(c);
              if(String(c.reason)!=''){
                message+='\n Motivo: '+String(c.reason);
              }
              this.toastr.warning(message,'RESTRINGIDO');
  
              vis.obs='RESTRINGIDO';
  
              this.clientsService.getVisit(this.dni_ce,this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                if(v && v.date_entrance==this.fechaString){
                  visR.person_id=vis.person_id;
                  //visR.name=vis.name;
                  visR.date_entrance=v.date_entrance;
                  visR.hour_entrance=v.hour_entrance;
                  visR.obs=v.obs;
                  visR.sala=this.accessPoint_name;
                  //vis.visits=parseInt(String(v.visits))+1;
  
                  v.table_entrance=this.accessPoint.table_entrance;
  
                  this.clientsService.deleteVisit(v).subscribe(a=>{
                    this.clientsService.addVisit(vis).subscribe(resp=>{
                      if(resp){
                        this.clientsService.addVisitRepeated(visR).subscribe();
                      }
                    })
                  });
                }
                else{
                  this.clientsService.addVisit(vis).subscribe();
                }
              })
  
            }
            else if(c.status=='VIP'){
              console.log('vip');
              if(c.birth_date && c.birth_date.includes(this.fecha_cumple)){
  
                this.searchResult='birth';
                this.hideBirth=false;
  
                document.getElementById('btnResultModal')?.click();
                this.limpiar();
  
                var message = 'Cliente VIP cumpleañero'
                // console.log(c);
  /*               if(String(c.motivo)!=''){
                  message+='\n Motivo: '+String(c.motivo);
                } */
                this.toastr.info(message,'VIP CUMPLEAÑERO');
                vis.obs='VIP';
  
  
                this.clientsService.getVisit(this.dni_ce, this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                  if(v && v.date_entrance==this.fechaString){
                    visR.person_id=vis.person_id;
                    //visR.name=vis.name;
                    visR.date_entrance=v.date_entrance;
                    visR.hour_entrance=v.hour_entrance;
                    visR.obs=v.obs;
                    visR.sala=this.accessPoint_name;
                    //vis.visits=parseInt(String(v.visits))+1;
  
                    v.table_entrance=this.accessPoint.table_entrance;
  
                    this.clientsService.deleteVisit(v).subscribe(a=>{
                      this.clientsService.addVisit(vis).subscribe(resp=>{
                        if(resp){
                          this.clientsService.addVisitRepeated(visR).subscribe();
                        }
                      })
                    });
                  }
                  else{
                    this.clientsService.addVisit(vis).subscribe();
                  }
                })
  
              }
              else{
  
                this.searchResult='vip';
                this.hideVip=false;
  
                document.getElementById('btnResultModal')?.click();
                this.limpiar();
  
                var message='Cliente VIP';
                console.log(c);
                if(String(c.reason)!=''){
                  message+='\n Motivo: '+String(c.reason);
                }
                this.toastr.info(message,'VIP');
                vis.obs='VIP';
  
                this.clientsService.getVisit(this.dni_ce, this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                  if(v && v.date_entrance==this.fechaString){
                    visR.person_id=vis.person_id;
                    //visR.name=vis.name;
                    visR.date_entrance=v.date_entrance;
                    visR.hour_entrance=v.hour_entrance;
                    visR.obs=v.obs;
                    visR.sala=this.accessPoint_name;
                    //vis.visits=parseInt(String(v.visits))+1;
  
                    v.table_entrance=this.accessPoint.table_entrance;
  
                    this.clientsService.deleteVisit(v).subscribe(a=>{
                      this.clientsService.addVisit(vis).subscribe(resp=>{
                        if(resp){
                          this.clientsService.addVisitRepeated(visR).subscribe();
                        }
                      })
                    });
                  }
                  else{
                    this.clientsService.addVisit(vis).subscribe();
                  }
                })
  
              }
  
            }
            else if(c.status=='OBSERVADO'){
              console.log('observado');
              if(c.birth_date && c.birth_date.includes(this.fecha_cumple)){
  
                this.searchResult='birth';
                this.hideBirth=false;
  
                document.getElementById('btnResultModal')?.click();
                this.limpiar();
  
                var message = 'Cliente para seguimiento'
                // console.log(c);
  /*               if(String(c.motivo)!=''){
                  message+='\n Motivo: '+String(c.motivo);
                } */
                this.toastr.info(message,'OBSERVADO DE CUMPLEAÑOS');
                vis.obs='OBSERVADO';
  
  
                this.clientsService.getVisit(this.dni_ce, this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                  if(v && v.date_entrance==this.fechaString){
                    visR.person_id=vis.person_id;
                    //visR.name=vis.name;
                    visR.date_entrance=v.date_entrance;
                    visR.hour_entrance=v.hour_entrance;
                    visR.obs=v.obs;
                    visR.sala=this.accessPoint_name;
                    //vis.visits=parseInt(String(v.visits))+1;
  
                    v.table_entrance=this.accessPoint.table_entrance;
  
                    this.clientsService.deleteVisit(v).subscribe(a=>{
                      this.clientsService.addVisit(vis).subscribe(resp=>{
                        if(resp){
                          this.clientsService.addVisitRepeated(visR).subscribe();
                        }
                      })
                    });
                  }
                  else{
                    this.clientsService.addVisit(vis).subscribe();
                  }
                })
  
              }
              else{
  
                this.searchResult = 'obs';
                this.hideObs=false;
  
                document.getElementById('btnResultModal')?.click();
                this.limpiar();
  
                var message='Cliente para seguimiento';
                console.log(c);
                if(String(c.reason)!=''){
                  message+='\n Motivo: '+String(c.reason);
                }
                this.toastr.info(message,'OBSERVADO');
                vis.obs='EN OBSERVACIÓN';
  
                this.clientsService.getVisit(this.dni_ce, this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                  if(v && v.date_entrance==this.fechaString){
                    visR.person_id=vis.person_id;
                    //visR.name=vis.name;
                    visR.date_entrance=v.date_entrance;
                    visR.hour_entrance=v.hour_entrance;
                    visR.obs=v.obs;
                    visR.sala=this.accessPoint_name;
                    //vis.visits=parseInt(String(v.visits))+1;
  
                    v.table_entrance=this.accessPoint.table_entrance;
  
                    this.clientsService.deleteVisit(v).subscribe(a=>{
                      this.clientsService.addVisit(vis).subscribe(resp=>{
                        if(resp){
                          this.clientsService.addVisitRepeated(visR).subscribe();
                        }
                      })
                    });
                  }
                  else{
                    this.clientsService.addVisit(vis).subscribe();
                  }
                })
  
              }
  
            }
            else{
  
              console.log('ni restringido ni destacado');
              if(c.birth_date!=null){
                if(c.birth_date && c.birth_date.includes(this.fecha_cumple)){
                  console.log('cumpleañero');
  
                  this.searchResult='birth';
                  this.hideBirth=false;
  
                  document.getElementById('btnResultModal')?.click();
                  this.limpiar();
  
                  this.toastr.info('Cliente de cumpleaños','CUMPLEAÑOS');
  
                  vis.obs='PERMITIDO';
  
                  this.clientsService.getVisit(this.dni_ce, this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                    if(v && v.date_entrance==this.fechaString){
                      visR.person_id=vis.person_id;
                      //visR.name=vis.name;
                      visR.date_entrance=v.date_entrance;
                      visR.hour_entrance=v.hour_entrance;
                      visR.obs=v.obs;
                      visR.sala=this.accessPoint_name;
                      //vis.visits=parseInt(String(v.visits))+1;
  
                      v.table_entrance=this.accessPoint.table_entrance;
  
                      this.clientsService.deleteVisit(v).subscribe(a=>{
                        this.clientsService.addVisit(vis).subscribe(resp=>{
                          if(resp){
                            this.clientsService.addVisitRepeated(visR).subscribe();
                          }
                        })
                      });
                    }
                    else{
                      this.clientsService.addVisit(vis).subscribe();
                    }
                  })
  
                }
                else{
  
                  this.searchResult='allowed';
                  this.hideCheck=false;
  
                  console.log('normal');

                  document.getElementById('btnResultModal')?.click();
                  this.limpiar();
  
                  this.toastr.success('Cliente sin restricciones','PERMITIDO');
  
                  vis.obs='PERMITIDO';
  
                  console.log(this.accessPoint.table_entrance);
  
                  this.clientsService.getVisit(this.dni_ce, this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                    console.log(v);
                    console.log(this.fechaString);
                    if(v && v.date_entrance==this.fechaString){
                      visR.person_id=vis.person_id;
                      //visR.name=vis.name;
                      visR.date_entrance=v.date_entrance;
                      visR.hour_entrance=v.hour_entrance;
                      visR.obs=v.obs;
                      visR.sala=this.accessPoint_name;
                      //vis.visits=parseInt(String(v.visits))+1;
  
                      v.table_entrance=this.accessPoint.table_entrance;
                      
                      console.log('listo para borrar');
                      this.clientsService.deleteVisit(v).subscribe(a=>{
                        console.log(a);
                        console.log('visita borrada');
                        this.clientsService.addVisit(vis).subscribe(resp=>{
                          console.log('llegamos aqui')
                          console.log(resp);
                          if(resp){
                            this.clientsService.addVisitRepeated(visR).subscribe();
                          }
                        })
                      });
                    }
                    else{
                      console.log(vis);
                      this.clientsService.addVisit(vis).subscribe(resp=>{
                        console.log('llegamos aqui siii')
                        console.log(resp);
                      });
                    }
                  })
  
  
                }
              }
              else{
  
                this.searchResult='allowed';
                this.hideCheck=false;
  
                console.log('normal');

                document.getElementById('btnResultModal')?.click();
                this.limpiar();
  
                this.toastr.success('Cliente sin restricciones','PERMITIDO');
  
                vis.obs='PERMITIDO';
  
                console.log(this.accessPoint.table_entrance);
  
                this.clientsService.getVisit(this.dni_ce, this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                  console.log(v);
                  console.log(this.fechaString);
                  if(v && v.date_entrance==this.fechaString){
                    visR.person_id=vis.person_id;
                    //visR.name=vis.name;
                    visR.date_entrance=v.date_entrance;
                    visR.hour_entrance=v.hour_entrance;
                    visR.obs=v.obs;
                    visR.sala=this.accessPoint_name;
                    //vis.visits=parseInt(String(v.visits))+1;
  
                    v.table_entrance=this.accessPoint.table_entrance;
                    
                    console.log('listo para borrar');
                    this.clientsService.deleteVisit(v).subscribe(a=>{
                      console.log(a);
                      console.log('visita borrada');
                      this.clientsService.addVisit(vis).subscribe(resp=>{
                        console.log('llegamos aqui')
                        console.log(resp);
                        if(resp){
                          this.clientsService.addVisitRepeated(visR).subscribe();
                        }
                      })
                    });
                  }
                  else{
                    console.log(vis);
                    this.clientsService.addVisit(vis).subscribe(resp=>{
                      console.log('llegamos aqui siii')
                      console.log(resp);
                    });
                  }
                })
  
              }
  
  
            }
          }
          else{
            console.log('no esta en BD')
            var dialogRef;
  
            if(this.dni_ce.length>8){
  
              this.toastr.info('SIN DATOS','Documento distinto a DNI');
  
              var clienteNew = new Person('','','','','','','','','','','','','','','','','','','','','',0,0,'','');
  
              clienteNew.doc_number = this.dni_ce;
              clienteNew.first_name = 'JUGADOR';
              clienteNew.birth_date = 'SN';
              clienteNew.gender = 'SN';
              clienteNew.region = 'SN';
              clienteNew.province = 'SN';
              clienteNew.district = 'SN';
              clienteNew.address = 'SN';
              clienteNew.status = 'PERMITIDO';
              //clienteNew.motivo = ' ';
              //clienteNew.sala_registro = this.accessPoint_name;
              //clienteNew.fecha_registro = this.fechaString;
  
              vis.person_id=clienteNew.user_id;
              //vis.name=clienteNew.first_name;
              //vis.gender=clienteNew.gender;
              vis.age=0
              vis.date_entrance=this.fechaString;
              vis.hour_entrance=this.horaString;
              //vis.address='SN';
  
              vis.visits=1;
              vis.table_entrance=this.accessPoint.table_entrance
              //
              vis.obs='DENEGADO';
  
              this.searchResult='denied';
              this.hideBlock=false;
  
              document.getElementById('btnResultModal')?.click();
  
              /* dialogRef=this.dialog.open(DialogResultado,{
                data:{result:this.searchResult,
                name_result:clienteNew.first_name,
                age_result:vis.age}
              }) */
  
              //dialogRef.afterClosed().subscribe((result:Item) => {
                this.limpiar();
              //})
              this.toastr.error('Persona sin autorización','DENEGADO');
              //
  
              this.clientsService.getVisit(this.dni_ce, this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                //VISITAS REPETIDAS
                if(v && v.date_entrance==this.fechaString){
                  visR.person_id=vis.person_id;
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
            else{
              this.toastr.info('Cliente nuevo!','REGISTRANDO...');
  
              //Para salvar el dia
  
              /*var clienteNew = new Cliente('','','','','','','','','','','','');
  
              console.log(this.dni_ce);
              clienteNew.doc_number = this.dni_ce;
              console.log('doc asignado')
              clienteNew.client_name = 'JUGADOR';
              clienteNew.birth_date = 'SN';
              clienteNew.gender = 'SN';
              clienteNew.departamento = 'SN';
              clienteNew.provincia = 'SN';
              clienteNew.distrito = 'SN';
              clienteNew.address = 'SN';
              clienteNew.condicion = 'PERMITIDO';
              clienteNew.motivo = ' ';
              clienteNew.sala_registro = this.sala_name;
              clienteNew.fecha_registro = this.fechaString;
  
              let snackBarRef = this.snackBar.open('NOMBRE NO DISPONIBLE TEMPORALMENTE','X',{duration:4000});
  
              vis.doc_number=this.dni_ce;
              vis.name=clienteNew.client_name;
              vis.gender=clienteNew.gender;
              vis.age=0
              vis.date_entrance=this.fechaString;
              vis.hour_entrance=this.horaString;
              vis.address='SN';
  
              vis.visits=1;
              vis.table_entrance=this.sala.table_entrance
              
              vis.obs='PERMITIDO';
  
              dialogRef=this.dialog.open(DialogResultado,{
                data:{result:'allowed',
                name_result:vis.name,
                age_result:vis.age}
              })
  
              dialogRef.afterClosed().subscribe((result:Item) => {
                this.limpiar();
              })
              this.toastr.success('Cliente sin restricciones','PERMITIDO');
  
              this.clientsService.getVisit(this.dni_ce, this.sala.table_entrance).subscribe((v:Visit)=>{
                //VISITAS REPETIDAS
                if(v && v.date_entrance==this.fechaString){
                  visR.doc_number=vis.doc_number;
                  visR.name=vis.name;
                  visR.date_entrance=v.date_entrance;
                  visR.hour_entrance=v.hour_entrance;
                  visR.obs=v.obs;
                  visR.sala=this.sala_name;
                  vis.visits=parseInt(String(v.visits))+1;
  
                  v.table_entrance=this.sala.table_entrance;
  
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
              })*/
  
  
  
  
  
  
  
  
  
  
  
  
  
              
              this.clientsService.getClientFromReniec(this.dni_ce).subscribe(res=>{
  
                var clienteNew = new Person('','','','','','','','','','','','','','','','','','','','','',0,0,'','');
  
                //CLIENTE CON DATOS EN RENIEC
                if(res['success']){
                  clienteNew.doc_number = res['data']['numero'];
                  clienteNew.first_name = res['data']['nombre_completo'];
                  clienteNew.birth_date = res['data']['fecha_nacimiento'];
                  clienteNew.gender = res['data']['sexo'];
                  clienteNew.region = res['data']['departamento'];
                  clienteNew.province = res['data']['provincia'];
                  clienteNew.district = res['data']['distrito'];
                  clienteNew.address = res['data']['direccion'];
                  clienteNew.status = 'PERMITIDO';
                  //clienteNew.motivo = ' ';
                  //clienteNew.sala_registro = this.accessPoint_name;
                  //clienteNew.fecha_registro = this.fechaString;
  
                  let snackBarRef = this.snackBar.open(clienteNew.first_name,'X',{duration:4000});
  
                  vis.person_id=clienteNew.user_id;
                  //vis.name=clienteNew.first_name;
                  //vis.gender=clienteNew.gender;
                  if(clienteNew.birth_date==null){
                    vis.age=0;
                    this.toastr.warning('NO SE PUDO CALCULAR LA EDAD','VERIFICAR')
                  }
                  else{
                    var birthArray=clienteNew.birth_date.split('-');
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
                  //vis.address=clienteNew.region+'-'+clienteNew.province+'-'+clienteNew.district;
                  vis.visits=1;
                  vis.table_entrance=this.accessPoint.table_entrance;
                  //MOSTRANDO LA VALIDACIÓN
                  vis.obs='PERMITIDO';
  
                  this.searchResult='allowed';
                  this.hideCheck=false;
  
  
                  dialogRef=this.dialog.open(DialogResultado,{
                    data:{result:this.searchResult,
                    name_result:clienteNew.first_name,
                    age_result:vis.age}
                  })
      
                  dialogRef.afterClosed().subscribe((result:Item) => {
                    this.limpiar();
                  })
                  this.toastr.success('Cliente sin restricciones','PERMITIDO');
                  //
                  this.clientsService.getVisit(this.dni_ce, this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                    //VISITAS REPETIDAS
                    if(v && v.date_entrance==this.fechaString){
                      visR.person_id=vis.person_id;
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
  
                    this.clientsService.addCliente(clienteNew).subscribe(m=>{
  
                    });
                  })
  
                } 
                //CLIENTES SIN DATOS EN RENIEC
                else{
                  clienteNew.doc_number = this.dni_ce;
                  clienteNew.first_name = 'JUGADOR';
                  clienteNew.birth_date = 'SN';
                  clienteNew.gender = 'SN';
                  clienteNew.region = 'SN';
                  clienteNew.province = 'SN';
                  clienteNew.district = 'SN';
                  clienteNew.address = 'SN';
                  clienteNew.status = 'PERMITIDO';
                  //clienteNew.motivo = ' ';
                  //clienteNew.sala_registro = this.accessPoint_name;
                  //clienteNew.fecha_registro = this.fechaString;
  
                  let snackBarRef = this.snackBar.open('NO SE OBTUVO DATOS DE RENIEC','X',{duration:4000});
  
                  vis.person_id=clienteNew.user_id;
                  //vis.name=clienteNew.first_name;
                  //vis.gender=clienteNew.gender;
                  vis.age=0
                  vis.date_entrance=this.fechaString;
                  vis.hour_entrance=this.horaString;
                  //vis.address='SN';
  
                  vis.visits=1;
                  vis.table_entrance=this.accessPoint.table_entrance
                  //
                  vis.obs='PERMITIDO';
  
                  this.searchResult='allowed';
                  this.hideCheck=false;
  
                  dialogRef=this.dialog.open(DialogResultado,{
                    data:{result:this.searchResult,
                    name_result:clienteNew.first_name,
                    age_result:vis.age}
                  })
      
                  dialogRef.afterClosed().subscribe((result:Item) => {
                    this.limpiar();
                  })
                  this.toastr.success('Cliente sin restricciones','PERMITIDO');
                  //
  
                  this.clientsService.getVisit(this.dni_ce, this.accessPoint.table_entrance).subscribe((v:Visit)=>{
                    //VISITAS REPETIDAS
                    if(v && v.date_entrance==this.fechaString){
                      visR.person_id=vis.person_id;
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
      else{
        this.clientsService.getVehicle(this.dni_ce).subscribe((v:Vehicle)=>{
          if(v){
            this.toastr.success('Vehiculo:'+v.type+'encontrado');
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

/*     this.usersService.getPaymentByClientId(1).subscribe((resPay:Payment)=>{
      console.log(resPay);
      if(resPay.error){
        this.cookies.deleteToken("user_id");
        this.cookies.deleteToken("user_role");
        this.cookies.deleteToken('sala');
        this.cookies.deleteToken('onSession');
        console.error('Error al obtener el pago:', resPay.error);
        this.toastr.error('Error al obtener la licencia: '+resPay.error);

      }
      this.disableDocInput=false;

      this.hideDoc=false;
      this.hideLoad=true;
  
      this.hideAll=false;
      this.hideBirthCeleb=true;
  
  
      this.linkTitle='assets/titulo3.png';
  
      if(this.cookies.checkToken('sala')&&this.cookies.checkToken('onSession')){
  
        this.sala_name=this.cookies.getToken('sala');
  
        this.userService.getCampusByName(this.sala_name).subscribe((cam:Campus)=>{
          if(cam){
            this.sala=cam;
            setTimeout(()=>{
              document.getElementById("docInput").focus();
            }, 1000)
          }
        })
    
      }
      else{
  
        if(this.cookies.checkToken('sala')){
  
          this.sala_name=this.cookies.getToken('sala');
  
          var dialogRef2;
    
          dialogRef2=this.dialog.open(DialogValidate,{
            data:this.sala_name,
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
            disableClose:true
          })
    
          dialogRef.afterClosed().subscribe(result => {
            if(result){
              this.sala_name=this.cookies.getToken('sala');
              var dialogRef2;
      
              dialogRef2=this.dialog.open(DialogValidate,{
                data:this.sala_name,
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
    },
    (error) => {
    
      this.cookies.deleteToken("user_id");
      this.cookies.deleteToken("user_role");
      console.error('Error al obtener el pago:', error);

      // Maneja el error aquí según tus necesidades
      this.toastr.error('Error al obtener la licencia: '+error);
      this.router.navigateByUrl('/login');
    }); */

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

  username='';
  password='';

  constructor(
    public dialogRef: MatDialogRef<DialogValidate>,
    @Inject(MAT_DIALOG_DATA) public data:string,
    private fb: FormBuilder,
    private userService: UsersService,
    private toastr: ToastrService,
    private cookies: CookiesService,
    private router: Router,
    private usersService: UsersService,
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
        if(this.username.trim()!=''&&this.password.trim()!=''){
          this.userService.getUser(this.username.trim(),this.password.trim()).subscribe((us:User)=>{
            if(us){
              if(us.entrance_role!='NINGUNO'){
                this.cookies.setToken("onSession",'Y');
                this.cookies.setToken("user_id",String(us.user_id));
                this.toastr.success('Correcto!')
                setTimeout(()=>{
                  this.dialogRef.close(true);
                },500)
              }
              else{
                this.toastr.warning('El usuario  no tiene permisos');
              }
            }
            else{
              this.toastr.warning('Contraseña incorrecta');
            }
          })
        }
        else{
          this.toastr.warning('No ha proporcionado las credenciales');
        }
      }
    },
    (error) => {
    
      this.cookies.deleteToken("user_id");
      this.cookies.deleteToken("user_role");
      console.error('Error al obtener el pago:', error);

      // Maneja el error aquí según tus necesidades
      this.toastr.error('Error al obtener la licencia: '+error);
      this.router.navigateByUrl('/');
    });

  }

}
