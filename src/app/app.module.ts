import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Paso1Component } from './componentes/paso-1/paso-1.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


  @NgModule({
    declarations: [
    AppComponent,
    Paso1Component,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,HttpClientModule, FormsModule,  ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
