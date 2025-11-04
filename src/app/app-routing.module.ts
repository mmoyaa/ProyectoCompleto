import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Paso1Component } from './componentes/paso-1/paso-1.component';
import { Pagina1Component } from './componentes/pagina1/pagina1.component';
import { Pagina2Component } from './componentes/pagina2/pagina2.component';
import { HomeComponent } from './componentes/share/home/home.component';
import { ListaEvaluacionesComponent } from './componentes/lista-evaluaciones/lista-evaluaciones.component';
import { GraficosComponent } from './componentes/graficos/graficos.component';
import { Grafico612Component } from './componentes/grafico6-12/grafico6-12.component';
import { Formulario612Component } from './componentes/formulario-6-12/formulario-6-12.component';
import { AllFormulariosComponent } from './componentes/all-formularios/all-formularios.component';
import { Formulario13Component } from './componentes/formulario-1-3/formulario-1-3.component';
import { Pagina5Component } from './componentes/pagina5/pagina5.component';
import { ProbandoComponent } from './componentes/probando/probando.component';
import { DocumentosComponent } from './componentes/documentos/documentos.component';
import { ResumenPagoComponent } from './componentes/resumen-pago/resumen-pago.component';
import { EjemplosComponent } from './componentes/ejemplos/ejemplos.component';


const routes: Routes = [
  { path: '', redirectTo: '/all-formularios', pathMatch: 'full' },
  { path:'paso1', component: Paso1Component },
  { path:'agregarPaciente', component: Pagina1Component },
  { path:'pagina2', component: Pagina2Component },
  { path:'evaluaciones', component: ListaEvaluacionesComponent },
  { path:'graficos', component: GraficosComponent },
  { path:'home', component: HomeComponent },
  { path:'formulario-6-12', component: Formulario612Component },
  { path:'grafico6-12', component: Grafico612Component },
  { path:'all-formularios', component: AllFormulariosComponent },
  { path:'formulario6-13', component:Formulario13Component },
  { path:'pagina5', component: Pagina5Component },
  { path:'probando', component: ProbandoComponent },
  { path:'documentos', component: DocumentosComponent },
  { path:'resumenes', component: ResumenPagoComponent },
  { path:'ejemplos', component: EjemplosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
