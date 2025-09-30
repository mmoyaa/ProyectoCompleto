import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fechas',
  templateUrl: './fechas.component.html',
  styleUrls: ['./fechas.component.css']
})
export class FechasComponent implements OnInit {

  fechaActual: string = '';
  anoActual: number = 2025;
  
  // Títulos dinámicos para los semestres
  tituloSemestreRenta = 'Formularios Primer Semestre de Renta';
  tituloSemestreTarifa = 'Formularios Primer Semestre de Tarifa';

  ngOnInit(): void {
    this.establecerFechaActual();
    this.calcularDiasCobro();
  }

  private establecerFechaActual(): void {
    const fecha = new Date();
    this.fechaActual = fecha.toLocaleDateString('es-ES');
    this.anoActual = fecha.getFullYear();
    
    console.log('Fecha actual establecida:', this.fechaActual);
    console.log('Año actual:', this.anoActual);
  }

  onSemestreRentaChange(semestre: string): void {
    if (semestre === '1') {
      this.tituloSemestreRenta = 'Formularios Primer Semestre de Renta';
      this.establecerFechasPrimerSemestre('renta');
    } else if (semestre === '2') {
      this.tituloSemestreRenta = 'Formularios Segundo Semestre de Renta';
      this.establecerFechasSegundoSemestre('renta');
    }
    this.calcularDiasCobro();
  }

  onSemestreTarifaChange(semestre: string): void {
    if (semestre === '1') {
      this.tituloSemestreTarifa = 'Formularios Primer Semestre de Tarifa';
      this.establecerFechasPrimerSemestre('tarifa');
    } else if (semestre === '2') {
      this.tituloSemestreTarifa = 'Formularios Segundo Semestre de Tarifa';
      this.establecerFechasSegundoSemestre('tarifa');
    }
    this.calcularDiasCobro();
  }

  calcularDiasCobro(): void {
    // Calcular días para Renta
    this.calcularDiasCobroPorTipo('renta');
    // Calcular días para Tarifa
    this.calcularDiasCobroPorTipo('tarifa');
  }

  private calcularDiasCobroPorTipo(tipo: string): void {
    const inicioId = tipo === 'renta' ? 'rentaFechaInicioCobro' : 'tarifaFechaInicioCobro';
    const terminoId = tipo === 'renta' ? 'rentaFechaTerminoCobro' : 'tarifaFechaTerminoCobro';
    const diasId = tipo === 'renta' ? 'rentaDiasCobro' : 'tarifaDiasCobro';

    const inicioInput = document.getElementById(inicioId) as HTMLInputElement;
    const terminoInput = document.getElementById(terminoId) as HTMLInputElement;
    const diasInput = document.getElementById(diasId) as HTMLInputElement;

    if (inicioInput && terminoInput && inicioInput.value && terminoInput.value) {
      const fechaInicio = new Date(inicioInput.value);
      const fechaTermino = new Date(terminoInput.value);
      
      // Calcular diferencia en días
      const diferenciaTiempo = fechaTermino.getTime() - fechaInicio.getTime();
      const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
      
      if (diasInput && diferenciaDias >= 0) {
        diasInput.value = diferenciaDias.toString();
      }
    }
  }

  calcularFechas(): void {
    console.log('Calculando fechas...');
    // Aquí se puede agregar lógica para calcular fechas
  }

  limpiarFormulario(): void {
    console.log('Limpiando formulario...');
    // Aquí se puede agregar lógica para limpiar el formulario
  }

  private establecerFechasPrimerSemestre(tipo: string): void {
    const inicioFecha = `${this.anoActual}-01-01`;
    const terminoFecha = `${this.anoActual}-06-30`;
    
    if (tipo === 'renta') {
      const inicioInput = document.getElementById('rentaFechaInicioCobro') as HTMLInputElement;
      const terminoInput = document.getElementById('rentaFechaTerminoCobro') as HTMLInputElement;
      
      if (inicioInput) inicioInput.value = inicioFecha;
      if (terminoInput) terminoInput.value = terminoFecha;
    } else if (tipo === 'tarifa') {
      const inicioInput = document.getElementById('tarifaFechaInicioCobro') as HTMLInputElement;
      const terminoInput = document.getElementById('tarifaFechaTerminoCobro') as HTMLInputElement;
      
      if (inicioInput) inicioInput.value = inicioFecha;
      if (terminoInput) terminoInput.value = terminoFecha;
    }

    // Calcular días después de establecer las fechas
    setTimeout(() => {
      this.calcularDiasCobroPorTipo(tipo);
    }, 100);
  }

  private establecerFechasSegundoSemestre(tipo: string): void {
    const inicioFecha = `${this.anoActual}-07-01`;
    const terminoFecha = `${this.anoActual}-12-31`;
    
    if (tipo === 'renta') {
      const inicioInput = document.getElementById('rentaFechaInicioCobro') as HTMLInputElement;
      const terminoInput = document.getElementById('rentaFechaTerminoCobro') as HTMLInputElement;
      
      if (inicioInput) inicioInput.value = inicioFecha;
      if (terminoInput) terminoInput.value = terminoFecha;
    } else if (tipo === 'tarifa') {
      const inicioInput = document.getElementById('tarifaFechaInicioCobro') as HTMLInputElement;
      const terminoInput = document.getElementById('tarifaFechaTerminoCobro') as HTMLInputElement;
      
      if (inicioInput) inicioInput.value = inicioFecha;
      if (terminoInput) terminoInput.value = terminoFecha;
    }

    // Calcular días después de establecer las fechas
    setTimeout(() => {
      this.calcularDiasCobroPorTipo(tipo);
    }, 100);
  }

}
