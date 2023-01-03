
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaActivosComponent } from './lista-activos/lista-activos.component';
import { InicioComponent } from './inicio/inicio.component';
import { EditarComponent } from './editar/editar.component';
import { MoverComponent } from './mover/mover.component';

const routes: Routes = [
  { path: "", component: InicioComponent },
  { path: "lista/:lugar/:area", component: ListaActivosComponent  },
  { path: "editar", component: EditarComponent  },
  { path: "movimiento", component: MoverComponent },
  //{ path: "", redirectTo: "/clientes", pathMatch: "full" },// Cuando es la raíz
  //{ path: "**", redirectTo: "/clientes" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
