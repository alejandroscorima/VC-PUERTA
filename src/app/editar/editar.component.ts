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


@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display:'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EditarComponent implements OnInit {

  expandedElement: Item ;

  lugar;
  area;

  tipo;

  tipos: string[] = [];

  itemCode;

  item: Item = new Item('','',0,'','','','','','','','','','','','','');

  items: Item[] = [new Item('','',0,'','','','','','','','','','','','','')];

  dataSourceItems: MatTableDataSource<Item>;

  @ViewChildren(MatPaginator) paginator= new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort= new QueryList<MatSort>();

  constructor(    private inventarioService: InventarioService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
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
    this.inventarioService.getAllMaquinas().subscribe((maqList:Item[])=>{
      this.items=maqList;
      this.inventarioService.getAllActivos().subscribe((actList:Item[])=>{
        actList.forEach((a:Item)=>{
          this.items.push(a);
        })

        this.dataSourceItems = new MatTableDataSource(this.items);
        this.dataSourceItems.paginator = this.paginator.toArray()[0];
        this.dataSourceItems.sort = this.sort.toArray()[0];
      });
      this.dataSourceItems = new MatTableDataSource(this.items);
      this.dataSourceItems.paginator = this.paginator.toArray()[0];
      this.dataSourceItems.sort = this.sort.toArray()[0];
    });
    this.tipos=['MAQUINAS','ACTIVOS'];
  }

  onSubmit() {
  }

  edit(code){
    var dialogRef;

    var index = this.items.findIndex(m=>m.codigo==code);

    dialogRef=this.dialog.open(DialogEdit,{
      data:this.items[index],
    })
  }

}



@Component({
  selector: 'dialog-edit',
  templateUrl: 'dialog-edit.html',
  styleUrls: ['./editar.component.css']
})
export class DialogEdit implements OnInit {

  biometricoChecked;
  noMultasChecked;
  noCaducadoChecked;

  btnValidarEnabled ;
  btnRechazarEnabled ;

  constructor(
    public dialogRef: MatDialogRef<DialogEdit>,
    @Inject(MAT_DIALOG_DATA) public data:Item,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {


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
