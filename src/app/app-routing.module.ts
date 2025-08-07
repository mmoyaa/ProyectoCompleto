import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Paso1Component } from './componentes/paso-1/paso-1.component';
import { Pagina1Component } from './componentes/pagina1/pagina1.component';
import { Pagina2Component } from './componentes/pagina2/pagina2.component';
import { HomeComponent } from './componentes/share/home/home.component';
import { ListaEvaluacionesComponent } from './componentes/lista-evaluaciones/lista-evaluaciones.component';
import { TestRadioComponent } from './componentes/test-radio/test-radio.component';
import { GraficosComponent } from './componentes/graficos/graficos.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path:'paso1', component: Paso1Component },
  { path:'pagina1', component: Pagina1Component },
  { path:'pagina2', component: Pagina2Component },
  { path:'evaluaciones', component: ListaEvaluacionesComponent },
  { path:'graficos', component: GraficosComponent },
  { path:'home', component: HomeComponent },
  { path:'test-radio', component: TestRadioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
