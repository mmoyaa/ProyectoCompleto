import { Component } from '@angular/core';

@Component({
  selector: 'app-formulario-completo',
  templateUrl: './formulario-completo.component.html',
  styleUrls: ['./formulario-completo.component.css']
})
export class FormularioCompletoComponent {

  pasoActual = 1;

  siguientePaso() {
    this.pasoActual++;
  }

  pasoAnterior() {
    this.pasoActual--;
  }



  
}
