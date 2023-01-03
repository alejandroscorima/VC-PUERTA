import { Component, ElementRef, HostListener, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ClientesService } from "../clientes.service"
import { Cliente } from "../cliente"
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemePalette } from '@angular/material/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../item';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sale } from '../sale';
import { PersonalService } from '../personal.service';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Product } from '../product';
import { InventarioService } from '../inventario.service';
import { animate, state, style, transition, trigger } from '@angular/animations';


interface lugar{
  nombre: string;
  ruta: string;
}

interface area{
  nombre: string;
  ruta: string;
}

@Component({
  selector: 'app-lista-activos',
  templateUrl: './lista-activos.component.html',
  styleUrls: ['./lista-activos.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display:'none'})),
      state('expanded', style({height: '*'})),
      transition('collapsed <=> expanded', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListaActivosComponent implements OnInit {

  expandedElement: Item ;

  lugar;
  area;

  itemCode;

  item: Item = new Item('','',0,'','','','','','','','','','','','','');

  items: Item[] = [new Item('','',0,'','','','','','','','','','','','','')];

  dataSourceItems: MatTableDataSource<Item>;

  @ViewChildren(MatPaginator) paginator= new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort= new QueryList<MatSort>();

  constructor(private route: ActivatedRoute,
    private inventarioService: InventarioService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  searchItem(){

  }

  saveCheck(){

  }

  applyFilterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceItems.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceItems.paginator) {
      this.dataSourceItems.paginator.firstPage();
    }
  }

  ngOnInit() {
    this.lugar = this.route.snapshot.paramMap.get('lugar');
    this.area = this.route.snapshot.paramMap.get('area');
    this.inventarioService.getItems(this.lugar, this.area).subscribe((itemList:Item[])=>{
      this.items=itemList;
/*       if(this.area=='maquinas'){
        this.items.forEach(it=>{
          it.tipo==
        })
      } */
      this.dataSourceItems = new MatTableDataSource(this.items);
      this.dataSourceItems.paginator = this.paginator.toArray()[0];
      this.dataSourceItems.sort = this.sort.toArray()[0];
    });
  }

  onSubmit() {
  }

  edit(code){
    var dialogRef;

    var index = this.items.findIndex(m=>m.codigo==code);

    dialogRef=this.dialog.open(DialogNewEdit,{
      data:this.items[index],
    })


  }

  new(){
    var dialogRef;

    dialogRef=this.dialog.open(DialogNewEdit,{
      data:this.item,
    })


  }

  move(code){
    var dialogRef;

    var index = this.items.findIndex(m=>m.codigo==code);

    dialogRef=this.dialog.open(DialogMove,{
      data:this.items[index],
    })


  }

}


@Component({
  selector: 'dialog-new-edit',
  templateUrl: 'dialog-new-edit.html',
  styleUrls: ['./lista-activos.component.css']
})
export class DialogNewEdit implements OnInit {

  biometricoChecked;
  noMultasChecked;
  noCaducadoChecked;

  title;

  btnValidarEnabled ;
  btnRechazarEnabled ;

  constructor(
    public dialogRef: MatDialogRef<DialogNewEdit>,
    @Inject(MAT_DIALOG_DATA) public data:Item,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    if(this.data.codigo==''&&this.data.descripcion==''){
      this.title='NUEVO'
    }
    else{
      this.title='EDITAR'
    }

    //this.btnValidarEnabled=this.biometricoChecked&&this.noMultasChecked&&this.noCaducadoChecked&&this.data.seguridad_nombre;
    //this.btnRechazarEnabled=Boolean(this.data.seguridad_nombre);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onKeyUpEvent(event:any){

  }

  btnSave(){
    this.data.area=this.data.area.toUpperCase();
    this.data.codigo=this.data.codigo.toUpperCase();
    this.data.descripcion=this.data.descripcion.toUpperCase();
    this.data.estado=this.data.estado.toUpperCase();
    this.data.fabricante=this.data.fabricante.toUpperCase();
    this.data.lugar=this.data.lugar.toUpperCase();
    this.data.marca=this.data.marca.toUpperCase();
    this.data.modelo=this.data.modelo.toUpperCase();
    this.data.numero=this.data.numero.toUpperCase();
    this.data.observacion=this.data.observacion.toUpperCase();
    this.data.propietario=this.data.propietario.toUpperCase();
    this.data.registro=this.data.registro.toUpperCase();
    this.data.serie=this.data.serie.toUpperCase();
    this.data.tipo=this.data.tipo.toUpperCase();
    this.data.ubicacion=this.data.ubicacion.toUpperCase();
    this.dialogRef.close(this.data);
  }

}


@Component({
  selector: 'dialog-move',
  templateUrl: 'dialog-move.html',
  styleUrls: ['./lista-activos.component.css']
})
export class DialogMove implements OnInit {

  sala;
  lugares: lugar[]=[];
  areas: area[]=[];

  biometricoChecked;
  noMultasChecked;
  noCaducadoChecked;

  btnValidarEnabled ;
  btnRechazarEnabled ;

  constructor(
    public dialogRef: MatDialogRef<DialogMove>,
    @Inject(MAT_DIALOG_DATA) public data:Item,
    private inventarioService: InventarioService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    console.log(this.data);

    this.lugares=this.inventarioService.getLugares();
    this.areas=this.inventarioService.getIndice(this.data.lugar);

    //this.btnValidarEnabled=this.biometricoChecked&&this.noMultasChecked&&this.noCaducadoChecked&&this.data.seguridad_nombre;
    //this.btnRechazarEnabled=Boolean(this.data.seguridad_nombre);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onKeyUpEvent(event:any){

  }

  cambioSala(e){

  }

  btnSave(){
    this.data.area=this.data.area.toUpperCase();
    this.data.lugar=this.data.lugar.toUpperCase();
    this.data.ubicacion=this.data.ubicacion.toUpperCase();
    this.dialogRef.close(this.data);
  }

}
