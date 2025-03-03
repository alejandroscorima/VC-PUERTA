
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
import { Visitor } from '../visitor';
import { VisitRepeated } from '../visitRepeated';
import { LudopatiaService } from '../ludopatia.service';
import { Ludopata } from '../ludopata';
import { CookiesService } from '../cookies.service';
import { UsersService } from '../users.service';
import { User } from '../user';
import { AccessPoint } from '../access-point';
import { Console, log, table } from 'console';
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

  

  @ViewChild("content",{static:true}) content:ElementRef;

  ludopatas=[];

  searchResult: string = '';

  dni_ce_plate: string;

  docInputText;
  disableDocInput;

  accessPoint: AccessPoint = new AccessPoint('','','','');
  categories: string[] = ['PROPIETARIO','RESIDENTE','INQUILINO'];
  temp_visit_type:string[]=['DELIVERY','COLECTIVO','TAXI'];
  accessPoint_name = '';
  accessPoint_id = 0;
  operario_id=0;
  
  linkTitle;

  fecha;
  fecha_cumple;
  fechaString;
  fechaLarga

  horaString;

  day;
  month;
  year;

  hour;
  min;
  sec;

  dia_aux;
  mes_aux;
  anio_aux;


  hideDoc;
  hideLoad;

  hideAll;
  hideBirthCeleb;

  name_result = '';
  doc_result = '';
  house_result;
  type_result = '';

  age_result = 0;

  hideCheck=false;
  hideBlock=false;
  hideBirth=false;
  hideObs=false;
  hideWarn=false;
  hideVip=false;

  visitorType='';

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
  ) { }
  
  ngOnInit() {
    initFlowbite();

    this.initializeVisibility();
    this.linkTitle = 'assets/titulo3.png';

    if (this.isUserAuthenticated()) {
        this.loadAccessPoint();
    } else {
        this.handleUnauthenticatedUser();
    }
  }

  verifyEnter(e){
    this.dni_ce_plate = String(e.trim());
    document.getElementById('btnSearch').click();
  }

  search(e){
// 1. Inicialización de variables
    this.dni_ce_plate = String(e.trim());
    this.disableDocInput = true;
    this.hideDoc = true;
    this.hideLoad = false;
// 2. Obtener fecha actual y hora actual, luego formatearla
    this.initializeDateTime();

//3. Validar si longitud de DNI es correcto
    if (this.isDniCeValid(this.dni_ce_plate)) {
// 4. Validar DNI para saber si es 5.PERSONA O 9.VEHÍCULO
      this.processDocument(this.dni_ce_plate);
    } else {
      //Si no cumple ni PERSONA ni VEHICULO
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
  }

// 2. Obtener fecha actual y hora actual, luego formatearla
  initializeDateTime() {
    this.fecha = new Date();

    // Formateo manual para fecha
    this.year = this.fecha.getFullYear();
    this.month = (this.fecha.getMonth() + 1).toString().padStart(2, '0'); // MM
    this.day = this.fecha.getDate().toString().padStart(2, '0'); // DD

    // Formateo manual para hora
    this.hour = this.fecha.getHours().toString().padStart(2, '0'); // HH
    this.min = this.fecha.getMinutes().toString().padStart(2, '0'); // MM
    this.sec = this.fecha.getSeconds().toString().padStart(2, '0'); // SS

    // Formatos específicos
    this.fecha_cumple = `${this.month}-${this.day}`; // MM-DD
    this.fechaString = `${this.year}-${this.month}-${this.day}`; // YYYY-MM-DD
    this.horaString = `${this.hour}:${this.min}:${this.sec}`; // HH:MM:SS

    console.log('Fecha para almacenamiento:', this.fechaString);
    console.log('Hora para almacenamiento:', this.horaString);

    // Formateo amigable para mostrar al usuario
    const opciones = { day: '2-digit', month: 'long' };
    this.fechaLarga = this.fecha.toLocaleDateString('es-ES', opciones); // Día y mes largos

    console.log('Fecha amigable para el usuario:', this.fechaLarga);
  }

//3. Validar si longitud de DNI es correcto
  isDniCeValid(dni_ce_plate: string): boolean {
    return dni_ce_plate.length >= 6 && dni_ce_plate.length <= 11;
  }

// 4. Validar DNI para saber si es 5.PERSONA O 9.VEHÍCULO
  processDocument(dni_ce_plate: string) {
    const vis = new Visitor(0, '', '', '',0,'', 0, '','', '','', '','', 0, '', 0, '', '', '', '', '',0, 0, 0, '', '', '', '', '', '', '');
    if (dni_ce_plate.length >= 8) {
        this.handlePersonSearch(vis,dni_ce_plate);
        console.log(vis);
    } else {
        this.handleVehicleSearch(vis,dni_ce_plate);
        console.log(vis);
    }
  }

// 5. Si el documento es una persona
// 6. Verificar si el documento es un DNI o un CE
  handlePersonSearch(vis:Visitor,dni_ce_plate: string) {
    this.type_result = 'PERSON';
    vis.type = 'PERSONA';

    this.clientsService.getUserByDocNumber(dni_ce_plate).subscribe((u: User) => {
        if (u.doc_number==this.docInputText) {
            this.handlePersonFound(vis, u);
        } else {
            this.handlePersonNotFound(vis, u);
        }
    });
  }

/*
- PERSONA ENCONTRADA EN SISTEMA
    - PERUANO REGISTRADO EN VC5
        -PERMITIDO
        -DENEGADO
        -RESTRINGIDO
        -EN OBSERVACIÓN
- PERSONA NO ENCONTRADA EN SISTEMA
    - EXTRANJERO INDOCUMENTADO
        -DENEGADO
    - PERUANO REGISTRADO EN RENIEC
        -DENEGADO
    - PERUANO INDOCUMNETADO
        -DENEGADO
- VEHÍCULO ENCONTRADO EN SISTEMA
    - VEHÍCULO REGISTRADO EN VC5
        -PERMITIDO
        -DENEGADO
        -RESTRINGIDO
        -EN OBSERVACIÓN
- VEHÍCULO NO ENCONTRADO EN SISTEMA
    - DENEGADO
*/

// 7. Si la persona se encuentra en la base de datos 
  handlePersonFound(vis: Visitor, u: User,){
    console.log('esta en DB');

    vis.visitor_id = u.user_id;
    vis.date_entry = this.fechaString +' '+ this.horaString;
    vis.ap_id=this.accessPoint_id;
    vis.operator_id=parseInt(this.cookies.getToken('user_id'));
    console.log(vis.operator_id);
    vis.age = this.calculateAge(u.birth_date);
    vis.log_type=this.selectLogTable(u.property_category);
    vis.vehicle_id=null;
    vis.doc_number=this.dni_ce_plate;

    // Asignar información común
    this.name_result = `${u.first_name} ${u.paternal_surname} ${u.maternal_surname}`;
    this.age_result = vis.age;
    this.doc_result = this.dni_ce_plate.toUpperCase();
    this.house_result = 'Mz: '+u.block_house+' Lt: '+u.lot;
    // Manejar estados
    switch (u.status_validated) {
        case 'DENEGADO':
            console.log('denegado');
            this.hideBlock = false;
            this.displayMessage('denied', 'DENEGADO', `Persona denegada${u.status_reason ? '\n Motivo: ' + u.status_reason : ''}`);
            vis.status_validated = 'DENEGADO';
            break;

        case 'RESTRINGIDO':
            console.log('restringido');
            this.hideWarn = false;
            this.displayMessage('warn', 'RESTRINGIDO', `Persona con restricción${u.status_reason ? '\n Motivo: ' + u.status_reason : ''}`);
            vis.status_validated = 'RESTRINGIDO';
            break;

        case 'OBSERVADO':
            console.log('observado');
            this.hideObs = false;
            this.displayMessage('obs', 'OBSERVADO', `Persona para seguimiento${u.status_reason ? '\n Motivo: ' + u.status_reason : ''}`);
            vis.status_validated = 'EN OBSERVACIÓN';
            break;

        default:
            console.log('ni restringido ni destacado');
            

            if (u.birth_date && u.birth_date.includes(this.fecha_cumple)) {
                console.log('cumpleañero');
                this.searchResult = 'birth allowed';
                this.hideBirth=false;
                this.toastr.info('Persona de cumpleaños', 'CUMPLEAÑOS');
            } else {
                console.log('normal');
                this.searchResult = 'allowed';
                this.hideCheck = false;
                this.toastr.success('Persona sin restricciones', 'PERMITIDO');
            }

            vis.status_validated = 'PERMITIDO';
            break;

            
    }

    document.getElementById('btnResultModal')?.click();
    this.clientsService.addVisitor(vis).subscribe();
    console.log(vis);
    console.log('PERUANO REGISTRADO EN VC5');
    this.limpiar();

  }

// 8. Si la persona no se encuentra en la base de datos  
  handlePersonNotFound(vis: Visitor, u: User, ){
    console.log('no esta en DB');
    //Es chamo, agregar como vacío
    if(this.dni_ce_plate.length>8){

      this.toastr.info('SIN DATOS','Documento distinto a DNI');
      // Configurar visitante genérico
      vis.visitor_id = 0; // Asumimos que aún no tiene un ID
      vis.age = 0;
      vis.ap_id=this.accessPoint_id;
      vis.operator_id=parseInt(this.cookies.getToken('user_id'));
      console.log(vis.operator_id);
      vis.date_entry = this.fechaString +' '+ this.horaString;
      vis.vehicle_id=null;
      vis.log_type=this.selectLogTable(this.visitorType); 
      console.log(vis.log_type);
      vis.doc_number=this.dni_ce_plate;
      vis.status_validated = 'DENEGADO';
      vis.type_doc='CE';
      vis.role_system='NINGUNO';
      vis.status_system='INACTIVO';
      vis.name='EXTRANJERO SN';
      vis.paternal_surname='SN';
      vis.maternal_surname='SN';

      // Mostrar modal de negación
      this.searchResult = 'denied';
      this.name_result = 'EXTRANJERO SN SN';
      this.age_result = vis.age;
      this.hideBlock = false;
      this.doc_result=this.dni_ce_plate.toUpperCase();
      this.house_result='SN';

      document.getElementById('btnResultModal')?.click();
      
      console.log(vis);
      this.clientsService.addPerson(vis).subscribe(r=>{
        this.clientsService.getUserByDocNumber(vis.doc_number).subscribe((usr:User)=>{
          vis.visitor_id=usr.user_id;
          this.clientsService.addVisitor(vis).subscribe();
          console.log('visita añadida');
          console.log('ya lárgate!');
        })
        console.log('Persona añadida, añadiendo visita...');
      });
      console.log('EXTRANEJRO INDOCUMENTADO');
      this.toastr.warning('persona no autorizada','DENEGADO')
      this.limpiar();
    }
    //Es perucho, obtener info de RENIEC
    else{   
      this.clientsService.getUserFromReniec(this.dni_ce_plate).subscribe(res=>{
        //CLIENTE CON DATOS EN RENIEC
        if(res['success']){
          u.type_doc = 'DNI';
          u.doc_number = res['data']['numero'];
          u.first_name = res['data']['nombres'];
          u.paternal_surname = res['data']['apellido_paterno'];
          u.maternal_surname = res['data']['apellido_materno'];
          u.gender = res['data']['sexo'];
          u.birth_date = res['data']['fecha_nacimiento'];
          u.civil_status = res['data']['estado_civil'];
          u.profession = 'SN';
          u.cel_number = 'SN';
          u.email = 'SN';
          u.address_reniec = res['data']['direccion'];
          u.district = res['data']['distrito'];
          u.province = res['data']['provincia'];
          u.region = res['data']['departamento'];
          u.username_system = 'SN';
          u.password_system = 'SN';
          u.role_system = 'NINGUNO';
          u.photo_url = 'SN';
          u.house_id = 0;
          u.status_validated = 'DENEGADO';
          u.status_reason = 'SN';

          let snackBarRef = this.snackBar.open(u.first_name,'X',{duration:4000});

          if(u.birth_date==null){
            vis.age=0;
            this.toastr.warning('NO SE PUDO CALCULAR LA EDAD','VERIFICAR')
          }
          else{
            vis.age = this.calculateAge(u.birth_date);
          };
          vis.visitor_id=0;
          vis.ap_id=this.accessPoint_id;
          vis.operator_id=parseInt(this.cookies.getToken('user_id'));
          console.log(vis.operator_id);
          vis.date_entry = this.fechaString +' '+ this.horaString;
          vis.vehicle_id=null;
          vis.log_type=this.selectLogTable(this.visitorType);
          vis.doc_number=this.dni_ce_plate;
          vis.status_validated=u.status_validated;
          vis.type_doc=u.type_doc;
          vis.role_system=u.role_system;
          vis.status_system='INACTIVO';
          vis.address_reniec=u.address_reniec;
          vis.name=u.first_name;
          vis.paternal_surname=u.paternal_surname;
          vis.maternal_surname=u.maternal_surname;

          this.searchResult='denied';
          this.name_result= u.first_name+' '+u.paternal_surname+' '+u.maternal_surname;
          this.age_result= vis.age;
          this.hideBlock=false;
          
          document.getElementById('btnResultModal')?.click();
          this.clientsService.addPerson(vis).subscribe(r=>{
            this.clientsService.getUserByDocNumber(vis.doc_number).subscribe((usr:User)=>{
              vis.visitor_id=usr.user_id;
              this.clientsService.addVisitor(vis).subscribe();
              console.log('visita añadida');
              console.log('ya lárgate!');
            })
            console.log('Persona añadida, añadiendo visita...');
          });
          console.log('PERUANO REGISTRADO EN RENIEC');
          this.toastr.warning('Persona no autorizada','DENEGADO');
          this.limpiar();
        } 
        //CLIENTES SIN DATOS EN RENIEC
        else{
          u.type_doc = 'DNI';
          u.doc_number = this.dni_ce_plate;
          u.first_name = 'SN';
          u.paternal_surname = 'SN';
          u.maternal_surname = 'SN';
          u.gender = 'SN';
          u.birth_date = 'SN';
          u.civil_status = 'SN';
          u.profession = 'SN';
          u.cel_number = 'SN';
          u.email = 'SN';
          u.address_reniec = 'SN';
          u.district = 'SN';
          u.province = 'SN';
          u.region = 'SN';
          u.username_system = 'SN';
          u.password_system = 'SN';
          u.role_system = 'NINGUNO';
          u.photo_url = 'SN';
          u.house_id = 0;
          u.status_validated = 'DENEGADO';
          u.status_reason = 'SN';

          let snackBarRef = this.snackBar.open('NO SE OBTUVO DATOS DE RENIEC','X',{duration:4000});

          vis.visitor_id=0;
          vis.age=0;
          vis.ap_id=this.accessPoint_id;
          vis.operator_id=parseInt(this.cookies.getToken('user_id'));
          console.log(vis.operator_id);
          vis.date_entry = this.fechaString +' '+ this.horaString;
          vis.vehicle_id=null;
          vis.log_type=this.selectLogTable(this.visitorType);
          console.log(vis.log_type);
          vis.doc_number=this.dni_ce_plate;
          vis.status_validated = u.status_validated;
          vis.type_doc=u.type_doc;
          vis.role_system=u.role_system;
          vis.status_system='INACTIVO';
          vis.address_reniec=u.address_reniec;
          vis.name=u.first_name;
          vis.paternal_surname=u.paternal_surname;
          vis.name=u.maternal_surname;
          
          
          this.searchResult='denied';
          this.name_result= 'PERUANO SN SN';
          this.age_result= vis.age;
          this.hideBlock=false;

          document.getElementById("btnResultModal")?.click();
          this.clientsService.addPerson(vis).subscribe(r=>{
            this.clientsService.getUserByDocNumber(vis.doc_number).subscribe((usr:User)=>{
              vis.visitor_id=usr.user_id;
              this.clientsService.addVisitor(vis).subscribe();
              console.log('visita añadida');
              console.log('ya lárgate!');
            })
            console.log('Persona añadida, añadiendo visita...');
          });
          console.log('PERUANO INDOCUMENTADO');
          this.toastr.warning('Persona no autorizada','DENEGADO');
          this.limpiar();
          
        }
      })
    }
  }

// 9. Si el documento es un vehículo
  handleVehicleSearch(vis:Visitor, dni_ce_plate: string) {
      this.type_result = 'VEHICLE';
      vis.type = 'VEHICULO';

      this.clientsService.getVehicleByPlate(this.dni_ce_plate.toUpperCase()).subscribe((v: Vehicle) => {
          if (v.license_plate==this.docInputText.toUpperCase()) {
              this.handleVehicleFound(vis, v);
          } else {
              this.handleVehicleNotFound(vis, v);
          }
      });
  }

// 10. Si el vehículo se encuentra en la base de datos
  handleVehicleFound(vis: Visitor, v: Vehicle){
    console.log('esta en BD');    

    vis.visitor_id=v.vehicle_id;
    vis.age=0;
    vis.date_entry = this.fechaString +' '+ this.horaString;
    vis.ap_id=this.accessPoint_id;
    vis.operator_id=parseInt(this.cookies.getToken('user_id'));
    vis.log_type=this.selectLogTable(v.category_entry);
    vis.type_vehicle=v.type_vehicle;
    vis.vehicle_id=v.vehicle_id;
    vis.house_id=v.house_id;
    vis.license_plate=this.dni_ce_plate.toUpperCase();
    
    
    this.name_result= vis.type_vehicle;
    this.age_result= vis.age;
    this.doc_result=this.dni_ce_plate.toUpperCase();
    this.house_result='Mz: '+v.block_house+' Lt: '+v.lot;
    // Manejar estados
    switch (v.status_validated) {
      case 'DENEGADO':
          console.log('denegado');
          this.hideBlock = false;
          this.displayMessage('denied', 'DENEGADO', `vehículo denegado${v.status_reason ? '\n Motivo: ' + v.status_reason : ''}`);
          vis.status_validated = 'DENEGADO';
          break;

      case 'RESTRINGIDO':
          console.log('restringido');
          this.hideWarn = false;
          this.displayMessage('warn', 'RESTRINGIDO', `Vechículo con restricción${v.status_reason ? '\n Motivo: ' + v.status_reason : ''}`);
          vis.status_validated = 'RESTRINGIDO';
          break;

      case 'OBSERVADO':
          console.log('observado');
          this.hideObs = false;
          this.displayMessage('obs', 'OBSERVADO', `Vehículo para seguimiento${v.status_reason ? '\n Motivo: ' + v.status_reason : ''}`);
          vis.status_validated = 'EN OBSERVACIÓN';
          break;

      default:
          console.log('ni restringido ni destacado');
          this.searchResult = 'allowed';
          this.hideCheck = false;
          this.toastr.success('Vehículo sin restricciones', 'PERMITIDO');
          vis.status_validated = 'PERMITIDO';
          break;
    }
    document.getElementById('btnResultModal')?.click();
    this.clientsService.addVisitor(vis).subscribe();
    console.log(vis);
    console.log('VEHICULO REGISTRADO EN VC5');
    this.limpiar();
  }

// 11. Si el vehículo no se encuentra en la base de datos
  handleVehicleNotFound(vis: Visitor,v:Vehicle,){
    console.log('no esta en BD')
    this.toastr.info('SIN DATOS');

    vis.visitor_id=0;
    vis.age=0;
    vis.date_entry = this.fechaString +' '+ this.horaString;
    vis.ap_id=this.accessPoint_id;
    vis.operator_id=parseInt(this.cookies.getToken('user_id'));
    vis.log_type=this.selectLogTable(this.visitorType);
    vis.type_vehicle='VEHÍCULO SN';
    vis.vehicle_id=0;
    vis.house_id=0;
    vis.status_validated='DENEGADO';
    vis.status_system='INACTIVO';
    vis.license_plate=this.dni_ce_plate.toUpperCase();

    this.doc_result=this.dni_ce_plate.toUpperCase();
    this.house_result='SN';
    this.searchResult='denied';
    this.name_result= vis.type_vehicle;
    this.age_result= vis.age;
    this.hideBlock=false;

    document.getElementById('btnResultModal')?.click();
    console.log(vis);
    this.clientsService.addPerson(vis).subscribe(r=>{
      this.clientsService.getVehicleByPlate(vis.license_plate).subscribe((vhcl:Vehicle)=>{
        vis.visitor_id=vhcl.vehicle_id;
        vis.vehicle_id=vhcl.vehicle_id;
        this.clientsService.addVisitor(vis).subscribe();
        console.log('visita añadida');
        console.log('ya lárgate!');
      })
      console.log('Persona añadida, añadiendo visita...');
    });
    console.log('VEHÍCULO NO ENCONTRADO');
    this.limpiar();
  }
  
  private selectLogTable(lt:string):string {
    // Comparar con las categorías
    if (this.categories.includes(lt)) {
      let logTable = 'access_logs';
      return logTable;
    } 
    else if (this.temp_visit_type.includes(lt)) {
      let logTable = 'temporary_access_logs';
      return logTable;
    } 
    // Caso predeterminado si no coincide con ninguna categoría
    else {
      // Manejar el caso de error o asignar un valor por defecto
      let logTable = 'access_logs';
      return logTable;
    }
  }

  private displayMessage(searchResult: string, toastTitle: string, message: string) {
    this.searchResult = searchResult;
    this.toastr[searchResult === 'denied' ? 'warning' : 'info'](message, toastTitle);
  }

  private calculateAge(birthDate: string | null): number {
    if (!birthDate) {
        this.toastr.warning('No se pudo calcular la edad', 'VERIFICAR');
        return 0;
    }

    const [birthYear, birthMonth, birthDay] = birthDate.split('-').map(Number);
    let age = parseInt(this.year) - birthYear;

    if (parseInt(this.month) < birthMonth || (parseInt(this.month) === birthMonth && parseInt(this.day) < birthDay)) {
        age--;
    }

    return age;
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


  private initializeVisibility() {
    this.disableDocInput = false;
    this.hideDoc = false;
    this.hideLoad = true;
    this.hideAll = false;
    this.hideBirthCeleb = true;
    this.hideCheck = true;
    this.hideBlock = true;
    this.hideBirth = true;
    this.hideObs = true;
    this.hideWarn = true;
    this.hideVip = true;
  }

  private isUserAuthenticated(): boolean {
    return this.cookies.checkToken('accessPoint_id') && this.cookies.checkToken('onSession');
  }

  private loadAccessPoint() {
    this.accessPoint_id = parseInt(this.cookies.getToken('accessPoint_id'));
    
    this.userService.getAccessPointById(this.accessPoint_id).subscribe(
        (accessPoint: AccessPoint) => this.handleAccessPointResponse(accessPoint),
        (error) => this.handleAccessPointError(error)
    );
  }

  private handleAccessPointResponse(cam: AccessPoint) {
    if (cam) {
        this.accessPoint = cam;
        this.focusDocInput();
    } else {
        this.handleInvalidAccessPoint();
    }
  }

  private handleAccessPointError(error: any) {
    this.toastr.error('Error al obtener el punto de acceso');
    this.router.navigateByUrl('/');
  }

  private handleInvalidAccessPoint() {
    this.clearCookiesAndRedirect();
    this.toastr.error('Sala no existe');
  }

  private clearCookiesAndRedirect() {
    this.cookies.deleteToken('user_id');
    this.cookies.deleteToken('user_role');
    this.cookies.deleteToken('accessPoint_id');
    this.cookies.deleteToken('onSession');
    this.router.navigateByUrl('/');
  }

  private focusDocInput() {
    setTimeout(() => {
        const docInput = document.getElementById("docInput");
        if (docInput) {
            docInput.focus();
        }
    }, 1000);
  }

  private handleUnauthenticatedUser() {
    if (this.cookies.checkToken('accessPoint_id')) {
        this.accessPoint_id = parseInt(this.cookies.getToken('accessPoint_id'));
        this.openValidateDialog();
    } else {
        this.openSelectSalaDialog();
    }
  }

  private openValidateDialog() {
    const dialogRef = this.dialog.open(DialogValidate, {
      data: this.accessPoint_name,
      disableClose: true,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.operario_id = parseInt(this.cookies.getToken('user_id'));
        this.router.navigateByUrl('/'); // Mejor opción que location.reload()
        location.reload()
      }
    });
  }

  private openSelectSalaDialog() {
    const dialogRef = this.dialog.open(DialogSelectSala, {
        data: '',
        panelClass: ['w-5/6', 'sm:w-3/5', 'items-center', 'content-center', 'justify-center'],
        disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            this.accessPoint_id = parseInt(this.cookies.getToken('accessPoint_id'));
            this.openValidateDialog();
        }
    });
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

  campus: AccessPoint[] = [];

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
    this.userService.getAccessPointsByStatus().subscribe((campusList:AccessPoint[])=>{
      if(campusList){
        this.campus=campusList;
      }
    })
  }

  select(ap:AccessPoint){
    this.cookies.setToken("accessPoint_id",String(ap.ap_id));
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
              this.cookies.setToken('onSession','Y')
              this.cookies.setToken('user_id',String(this.user.user_id));
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
