import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Paso1Component } from './componentes/paso-1/paso-1.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Pagina1Component } from './componentes/pagina1/pagina1.component';
import { Pagina2Component } from './componentes/pagina2/pagina2.component';
import { NavbarComponent } from './componentes/share/navbar/navbar.component';
import { FooterComponent } from './componentes/share/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './componentes/share/home/home.component';
import { ListaEvaluacionesComponent } from './componentes/lista-evaluaciones/lista-evaluaciones.component';
import { GraficosComponent } from './componentes/graficos/graficos.component';
import { Formulario612Component } from './componentes/formulario-6-12/formulario-6-12.component';
import { Grafico612Component } from './componentes/grafico6-12/grafico6-12.component';
import { Formulario13Component } from './componentes/formulario-1-3/formulario-1-3.component';

import { AllFormulariosComponent } from './componentes/all-formularios/all-formularios.component';
import { Pagina5Component } from './componentes/pagina5/pagina5.component';
import { DetalleEvaluacionComponent } from './componentes/lista-evaluaciones/detalle-evaluacion.component';
import { ProbandoComponent } from './componentes/probando/probando.component';
import { DocumentosComponent } from './componentes/documentos/documentos.component';


  @NgModule({
    declarations: [
    AppComponent,
    Paso1Component,
    Pagina1Component,
    Pagina2Component,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    ListaEvaluacionesComponent,
    GraficosComponent,
  Formulario612Component,
  Grafico612Component,
  Formulario13Component,
  AllFormulariosComponent,
  Pagina5Component,
  DetalleEvaluacionComponent,
  ProbandoComponent,
  DocumentosComponent,
    
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,HttpClientModule, FormsModule,  ReactiveFormsModule, NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
