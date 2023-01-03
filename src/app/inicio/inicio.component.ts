
import { Component, ElementRef, HostListener, Inject, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ClientesService } from "../clientes.service"
import { Cliente } from "../cliente"
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemePalette } from '@angular/material/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Item } from '../item';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InventarioService } from '../inventario.service';
import { Sale } from '../sale';
import { PersonalService } from '../personal.service';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Product } from '../product';

import * as pdfjsLib from 'pdfjs-dist';
import { keyframes } from '@angular/animations';
import { Key } from 'protractor';
import { Visit } from '../visit';
import { VisitRepeated } from '../visitRepeated';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  encapsulation:ViewEncapsulation.None,
})
export class InicioComponent implements OnInit {

  cliente: Cliente = new Cliente('','','','','','','','','','','','');

  clientes: Cliente[] = [];

  @ViewChild("content",{static:true}) content:ElementRef;

  ludopatas=[];

  dni_ce: string;

  docInputText;
  disableDocInput;

  sala;

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


  dataSourceSale: MatTableDataSource<Item>;

  dataSourceProducts: MatTableDataSource<Product>;

  doc = new jsPDF();
  img = new Image();

  @ViewChildren(MatPaginator) paginator= new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort= new QueryList<MatSort>();



  constructor(private clientsService: ClientesService, private dialogo: MatDialog,
    private snackBar: MatSnackBar, private router: Router,
    public dialog: MatDialog,
    private inventarioService: InventarioService,
    private toastr: ToastrService,
  ) { }



  applyFilterCompra(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceSale.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceSale.paginator) {
      this.dataSourceSale.paginator.firstPage();
    }
  }

  applyFilterProductos(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProducts.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceProducts.paginator) {
      this.dataSourceProducts.paginator.firstPage();
    }
  }

  async loadLudop(){


    pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305/build/pdf.worker.js';

    //var loadingTask = pdfjsLib.getDocument('http://192.168.4.250/Sistema consulta de Ludopatía.pdf');
    var loadingTask = pdfjsLib.getDocument('http://34.207.60.246/Sistema consulta de Ludopatía.pdf');
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

      if(this.ludopatas.indexOf(this.dni_ce)>=0){

        var dialogRef;

        dialogRef=this.dialog.open(DialogResultado,{
          data:{result:'denied',
          name_result:'LUDÓPATA'}
        })

        dialogRef.afterClosed().subscribe(result => {
          this.limpiar();
        })

        this.toastr.error('Prohibido por ludopatía','PROHIBIDO');

        var vis = new Visit('','',0,'','','','','',0);
        var visR = new VisitRepeated('','','','','','');

        vis.doc_number=this.dni_ce;
        vis.name='LUDOPATA';
        vis.gender='SN';
        vis.age=0;
        vis.date_entrance=this.fechaString;
        vis.hour_entrance=this.horaString;
        vis.obs='DENEGADO';
        vis.address='SN';
        vis.visits=1;

        this.clientsService.getVisit(this.dni_ce).subscribe((v:Visit)=>{
          if(v && v.date_entrance==this.fechaString){
            visR.doc_number=vis.doc_number;
            visR.name=vis.name;
            visR.date_entrance=v.date_entrance;
            visR.hour_entrance=v.hour_entrance;
            visR.obs=v.obs;
            visR.sala='SAN JUAN III';
            vis.visits=parseInt(String(v.visits))+1;
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

          var vis = new Visit('','',0,'','','','','',0);
          var visR = new VisitRepeated('','','','','','');

          if(c){

            vis.doc_number=this.dni_ce;
            vis.name=c.client_name;
            vis.gender=c.gender;
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
            vis.date_entrance=this.fechaString;
            vis.hour_entrance=this.horaString;
            vis.address=c.departamento+'-'+c.provincia+'-'+c.distrito;
            vis.visits=1;

            if(c.condicion=='RESTRINGIDO'){

              var dialogRef;

              dialogRef=this.dialog.open(DialogResultado,{
                data:{result:'warn',
                name_result:c.client_name},
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

              this.clientsService.getVisit(this.dni_ce).subscribe((v:Visit)=>{
                if(v && v.date_entrance==this.fechaString){
                  visR.doc_number=vis.doc_number;
                  visR.name=vis.name;
                  visR.date_entrance=v.date_entrance;
                  visR.hour_entrance=v.hour_entrance;
                  visR.obs=v.obs;
                  visR.sala='SAN JUAN III';
                  vis.visits=parseInt(String(v.visits))+1;
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
            else if(c.condicion=='DESTACADO'){
              if(c.birth_date.includes(this.fecha_cumple)){

                var dialogRef;

                dialogRef=this.dialog.open(DialogResultado,{
                  data:{result:'birth',
                  name_result:c.client_name}
                })

                dialogRef.afterClosed().subscribe(result => {
                  this.limpiar();
                })

                this.toastr.info('Cliente de cumpleaños','CUMPLEAÑOS');

                vis.obs='DESTACADO';

                this.clientsService.getVisit(this.dni_ce).subscribe((v:Visit)=>{
                  if(v && v.date_entrance==this.fechaString){
                    visR.doc_number=vis.doc_number;
                    visR.name=vis.name;
                    visR.date_entrance=v.date_entrance;
                    visR.hour_entrance=v.hour_entrance;
                    visR.obs=v.obs;
                    visR.sala='SAN JUAN III';
                    vis.visits=parseInt(String(v.visits))+1;
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
                  name_result:c.client_name}
                })

                dialogRef.afterClosed().subscribe(result => {
                  this.limpiar();
                })

                this.toastr.info('Cliente sin restricciones','DESTACADO');

                vis.obs='DESTACADO';

                this.clientsService.getVisit(this.dni_ce).subscribe((v:Visit)=>{
                  if(v && v.date_entrance==this.fechaString){
                    visR.doc_number=vis.doc_number;
                    visR.name=vis.name;
                    visR.date_entrance=v.date_entrance;
                    visR.hour_entrance=v.hour_entrance;
                    visR.obs=v.obs;
                    visR.sala='SAN JUAN III';
                    vis.visits=parseInt(String(v.visits))+1;
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
              if(c.birth_date.includes(this.fecha_cumple)){

                var dialogRef;

                dialogRef=this.dialog.open(DialogResultado,{
                  data:{result:'birth',
                  name_result:c.client_name}
                })

                dialogRef.afterClosed().subscribe(result => {
                  this.limpiar();
                })

                this.toastr.info('Cliente de cumpleaños','CUMPLEAÑOS');

                vis.obs='PERMITIDO';

                this.clientsService.getVisit(this.dni_ce).subscribe((v:Visit)=>{
                  if(v && v.date_entrance==this.fechaString){
                    visR.doc_number=vis.doc_number;
                    visR.name=vis.name;
                    visR.date_entrance=v.date_entrance;
                    visR.hour_entrance=v.hour_entrance;
                    visR.obs=v.obs;
                    visR.sala='SAN JUAN III';
                    vis.visits=parseInt(String(v.visits))+1;
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
                  data:{result:'allowed',
                  name_result:c.client_name}
                })

                dialogRef.afterClosed().subscribe(result => {
                  this.limpiar();
                })

                this.toastr.success('Cliente sin restricciones','PERMITIDO');

                vis.obs='PERMITIDO';

                this.clientsService.getVisit(this.dni_ce).subscribe((v:Visit)=>{
                  if(v && v.date_entrance==this.fechaString){
                    visR.doc_number=vis.doc_number;
                    visR.name=vis.name;
                    visR.date_entrance=v.date_entrance;
                    visR.hour_entrance=v.hour_entrance;
                    visR.obs=v.obs;
                    visR.sala='SAN JUAN III';
                    vis.visits=parseInt(String(v.visits))+1;
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
          }
          else{
            var dialogRef;

            dialogRef=this.dialog.open(DialogResultado,{
              data:{result:'allowed',
              name_result:c.client_name}
            })

            dialogRef.afterClosed().subscribe((result:Item) => {
              this.limpiar();
            })

            this.toastr.success('Cliente sin restricciones','PERMITIDO');
            this.clientsService.getClientFromReniec(this.dni_ce).subscribe(res=>{

              var clienteNew = new Cliente('','','','','','','','','','','','');

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
                clienteNew.sala_registro = 'SAN JUAN III';
                clienteNew.fecha_registro = this.fechaString;

                let snackBarRef = this.snackBar.open(clienteNew.client_name,'X',{duration:4000});

                vis.doc_number=this.dni_ce;
                vis.name=clienteNew.client_name;
                vis.gender=clienteNew.gender;
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
                vis.date_entrance=this.fechaString;
                vis.hour_entrance=this.horaString;
                vis.address=clienteNew.departamento+'-'+clienteNew.provincia+'-'+clienteNew.distrito;
                vis.visits=1;

                vis.obs='PERMITIDO';

                this.clientsService.getVisit(this.dni_ce).subscribe((v:Visit)=>{
                  if(v && v.date_entrance==this.fechaString){
                    visR.doc_number=vis.doc_number;
                    visR.name=vis.name;
                    visR.date_entrance=v.date_entrance;
                    visR.hour_entrance=v.hour_entrance;
                    visR.obs=v.obs;
                    visR.sala='SAN JUAN III';
                    vis.visits=parseInt(String(v.visits))+1;
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

                  this.clientsService.addCliente(clienteNew).subscribe(m=>{

                  });
                })

              }
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
                clienteNew.sala_registro = 'SAN JUAN III';
                clienteNew.fecha_registro = this.fechaString;

                let snackBarRef = this.snackBar.open('NO SE OBTUVO DATOS DE RENIEC','X',{duration:4000});

                vis.doc_number=this.dni_ce;
                vis.name=clienteNew.client_name;
                vis.gender=clienteNew.gender;
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
                vis.date_entrance=this.fechaString;
                vis.hour_entrance=this.horaString;
                vis.address='SN';

                vis.visits=1;

                vis.obs='PERMITIDO';

                this.clientsService.getVisit(this.dni_ce).subscribe((v:Visit)=>{
                  if(v && v.date_entrance==this.fechaString){
                    visR.doc_number=vis.doc_number;
                    visR.name=vis.name;
                    visR.date_entrance=v.date_entrance;
                    visR.hour_entrance=v.hour_entrance;
                    visR.obs=v.obs;
                    visR.sala='SAN JUAN III';
                    vis.visits=parseInt(String(v.visits))+1;
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

      setTimeout(()=>{
        document.getElementById("docInput").focus();
      }, 500)

    }, 100);
  }

  ngOnInit() {

    this.loadLudop().then(function(){ });

    this.disableDocInput=false;

    this.hideDoc=false;
    this.hideLoad=true;

    this.hideAll=false;
    this.hideBirthCeleb=true;


    this.linkTitle='assets/titulo3.png'

    setTimeout(()=>{
      document.getElementById("docInput").focus();
    }, 1000)


  }




/*    actualizar(){
    setTimeout(() => {
      this.obtenerClientes();
      this.actualizar();
    }, 1000000);
  } */


}

@Component({
  selector: 'dialog-revalidar',
  templateUrl: 'dialog-revalidar.html',
  styleUrls: ['./inicio.component.css']
})
export class DialogRevalidar implements OnInit {


  btnRevalidarEnabled ;


  fecha;

  anio;
  mes;
  dia;
  diaSemana;
  hora;
  mesIndex;

  fechaSorteo;
  horaSorteo;
  horaLongSorteo;
  direccionSorteo;
  nombreSorteo;
  nombreDeSorteo;
  premioSorteo;
  premioLongSorteo: string;
  doc_number: string;
  cupon_number: string;
  fechaLongSorteo;
  sala;
  admin_nombre;
  admin_doc;
  adj_nombre;
  adj_doc;
  seguridad_nombre;
  estado;

  linkLogo:string;

  letterSize;
  tituloSala;
  posTituloSala;
  direccionSala;
  posDireccionSala;


  doc = new jsPDF();
  img = new Image();

  constructor(
    public dialogRef: MatDialogRef<DialogRevalidar>,
    @Inject(MAT_DIALOG_DATA) public data:Product,
    private fb: FormBuilder,
    private personalService: PersonalService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {

    this.btnRevalidarEnabled=true;
/*     this.personalService.getPersonales(this.data.sala).subscribe((lista:Personal[]) => {

            //this.volver();
      });
    }); */

  }

  btnRevalidar(){
    this.dialogRef.close(this.data);
  }

  btnRechazar(){
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
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

  hideCheck=false;
  hideBlock=false;
  hideBirth=false;
  hideVip=false;
  hideWarn=false;

  urlResult;

  constructor(
    public dialogRef: MatDialogRef<DialogResultado>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private fb: FormBuilder,
    private personalService: PersonalService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {

    this.hideCheck=true;
    this.hideBlock=true;
    this.hideBirth=true;
    this.hideVip=true;
    this.hideWarn=true;

    this.name_result=this.data['name_result'];


    if(this.data['result']=='allowed'){
      this.hideCheck=false;
    }
    if(this.data['result']=='denied'){
      this.hideBlock=false;
    }
    if(this.data['result']=='birth'){
      this.hideBirth=false;
    }
    if(this.data['result']=='vip'){
      this.hideVip=false;
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
