
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';


const routes: Routes = [
  { path: "", component: InicioComponent },
  //{ path: "", redirectTo: "/clientes", pathMatch: "full" },// Cuando es la raíz
  //{ path: "**", redirectTo: "/clientes" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
