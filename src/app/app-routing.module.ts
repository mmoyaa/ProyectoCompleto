import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Paso1Component } from './componentes/paso-1/paso-1.component';


const routes: Routes = [
  // {path : '' , redirectTo : '/paso1 ' , pathMatch : 'full'},

  {path:'paso1',component:Paso1Component},

  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
