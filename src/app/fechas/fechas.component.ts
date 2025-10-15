import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-fechas',
  templateUrl: './fechas.component.html',
  styleUrls: ['./fechas.component.css']
})
export class FechasComponent implements OnInit {

  fechaActual = '';
  anoActual = 2025;
  
  // Formularios reactivos
  rentaForm: FormGroup;
  tarifaForm: FormGroup;
  
  // Títulos dinámicos para los semestres
  tituloSemestreRenta = 'Formularios Primer Semestre de Renta';
  tituloSemestreTarifa = 'Formularios Primer Semestre de Tarifa';

  // Subtítulos dinámicos
  subtituloRenta = '';
  subtituloTarifa = '';

  // Límites de fecha para validación
  fechaMinSemestre1 = '';
  fechaMaxSemestre1 = '';
  fechaMinSemestre2 = '';
  fechaMaxSemestre2 = '';

  constructor(private formBuilder: FormBuilder) {
    this.rentaForm = this.initializeRentaForm();
    this.tarifaForm = this.initializeTarifaForm();
  }

  // Validador personalizado para fechas de semestre
  semestreValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    
    const fecha = new Date(control.value);
    const formGroup = control.parent;
    if (!formGroup) return null;
    
    const semestreControl = formGroup.get('semestre');
    if (!semestreControl?.value) return null;
    
    const semestre = semestreControl.value;
    const fechaSemestre1Inicio = new Date(`${this.anoActual}-01-01`);
    const fechaSemestre1Fin = new Date(`${this.anoActual}-06-30`);
    const fechaSemestre2Inicio = new Date(`${this.anoActual}-07-01`);
    const fechaSemestre2Fin = new Date(`${this.anoActual}-12-31`);
    
    if (semestre === '1') {
      if (fecha < fechaSemestre1Inicio || fecha > fechaSemestre1Fin) {
        return { 'semestreIncorrecto': true };
      }
    } else if (semestre === '2') {
      if (fecha < fechaSemestre2Inicio || fecha > fechaSemestre2Fin) {
        return { 'semestreIncorrecto': true };
      }
    }
    
    return null;
  }

  private initializeRentaForm(): FormGroup {
    return this.formBuilder.group({
      semestre: ['', Validators.required],
      fechaInicioSemestre: ['', [Validators.required, this.semestreValidator]],
      fechaFinalSemestre: ['', [Validators.required, this.semestreValidator]]
    });
  }

  private initializeTarifaForm(): FormGroup {
    return this.formBuilder.group({
      semestre: ['', Validators.required],
      fechaInicioSemestre: ['', [Validators.required, this.semestreValidator]],
      fechaFinalSemestre: ['', [Validators.required, this.semestreValidator]]
    });
  }

  ngOnInit(): void {
    this.establecerFechaActual();
    this.establecerLimitesFecha();
    this.calcularDiasCobro();
  }

  private establecerFechaActual(): void {
    const fecha = new Date();
    this.fechaActual = fecha.toLocaleDateString('es-ES');
    this.anoActual = fecha.getFullYear();
    
    console.log('Fecha actual establecida:', this.fechaActual);
    console.log('Año actual:', this.anoActual);
  }

  private establecerLimitesFecha(): void {
    // Límites para semestre 1 (enero - junio)
    this.fechaMinSemestre1 = `${this.anoActual}-01-01`;
    this.fechaMaxSemestre1 = `${this.anoActual}-06-30`;
    
    // Límites para semestre 2 (julio - diciembre)
    this.fechaMinSemestre2 = `${this.anoActual}-07-01`;
    this.fechaMaxSemestre2 = `${this.anoActual}-12-31`;
    
    console.log('Límites de fecha establecidos:');
    console.log('Semestre 1:', this.fechaMinSemestre1, 'a', this.fechaMaxSemestre1);
    console.log('Semestre 2:', this.fechaMinSemestre2, 'a', this.fechaMaxSemestre2);
  }

  onSemestreRentaChange(semestre: string): void {
    this.rentaForm.patchValue({ semestre: semestre });
    
    if (semestre === '1') {
      this.tituloSemestreRenta = 'Formularios Primer Semestre de Renta';
      this.subtituloRenta = 'Primer Semestre';
      this.establecerFechasSemestreRenta(1);
      this.establecerFechasPrimerSemestre('renta');
    } else if (semestre === '2') {
      this.tituloSemestreRenta = 'Formularios Segundo Semestre de Renta';
      this.subtituloRenta = 'Segundo Semestre';
      this.establecerFechasSemestreRenta(2);
      this.establecerFechasSegundoSemestre('renta');
    }
    this.calcularDiasCobro();
  }

  onSemestreTarifaChange(semestre: string): void {
    this.tarifaForm.patchValue({ semestre: semestre });
    
    if (semestre === '1') {
      this.tituloSemestreTarifa = 'Formularios Primer Semestre de Tarifa';
      this.subtituloTarifa = 'Primer Semestre';
      this.establecerFechasSemestreTarifa(1);
      this.establecerFechasPrimerSemestre('tarifa');
    } else if (semestre === '2') {
      this.tituloSemestreTarifa = 'Formularios Segundo Semestre de Tarifa';
      this.subtituloTarifa = 'Segundo Semestre';
      this.establecerFechasSemestreTarifa(2);
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
      
      // Obtener semestre seleccionado desde el formulario reactivo
      const semestreSeleccionado = tipo === 'renta' 
        ? this.rentaForm.get('semestre')?.value 
        : this.tarifaForm.get('semestre')?.value;
      
      if (!this.validarFechaEnSemestre(fechaInicio, semestreSeleccionado) || 
          !this.validarFechaEnSemestre(fechaTermino, semestreSeleccionado)) {
        console.warn(`Fechas fuera del rango del semestre ${semestreSeleccionado}`);
        if (diasInput) diasInput.value = '';
        return;
      }
      
      // Calcular diferencia en días
      const diferenciaTiempo = fechaTermino.getTime() - fechaInicio.getTime();
      const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
      
      if (diasInput && diferenciaDias >= 0) {
        diasInput.value = diferenciaDias.toString();
      }
    }
  }

  private validarFechaEnSemestre(fecha: Date, semestre: string): boolean {
    const mes = fecha.getMonth() + 1; // getMonth() devuelve 0-11, necesitamos 1-12
    
    if (semestre === '1') {
      // Primer semestre: enero (1) a junio (6)
      return mes >= 1 && mes <= 6;
    } else if (semestre === '2') {
      // Segundo semestre: julio (7) a diciembre (12)
      return mes >= 7 && mes <= 12;
    }
    
    return false;
  }

  calcularFechas(): void {
    console.log('Calculando fechas...');
    // Aquí se puede agregar lógica para calcular fechas
  }

  limpiarFormulario(): void {
    console.log('Limpiando formulario...');
    
    // Limpiar formularios reactivos
    this.rentaForm.reset();
    this.tarifaForm.reset();
    
    // Limpiar subtítulos
    this.subtituloRenta = '';
    this.subtituloTarifa = '';
    
    // Resetear títulos a valores por defecto
    this.tituloSemestreRenta = 'Formularios Primer Semestre de Renta';
    this.tituloSemestreTarifa = 'Formularios Primer Semestre de Tarifa';
    
    // Limpiar campos de fecha y remover restricciones
    const campos = [
      'rentaFechaInicioCobro', 'rentaFechaTerminoCobro', 'rentaDiasCobro',
      'tarifaFechaInicioCobro', 'tarifaFechaTerminoCobro', 'tarifaDiasCobro'
    ];
    
    campos.forEach(campoId => {
      const elemento = document.getElementById(campoId) as HTMLInputElement;
      if (elemento) {
        elemento.value = '';
        // Remover restricciones min/max
        elemento.removeAttribute('min');
        elemento.removeAttribute('max');
      }
    });
  }

  private establecerFechasPrimerSemestre(tipo: string): void {
    const inicioFecha = this.fechaMinSemestre1;
    const terminoFecha = this.fechaMaxSemestre1;
    
    if (tipo === 'renta') {
      const inicioInput = document.getElementById('rentaFechaInicioCobro') as HTMLInputElement;
      const terminoInput = document.getElementById('rentaFechaTerminoCobro') as HTMLInputElement;
      
      if (inicioInput) {
        inicioInput.value = inicioFecha;
        inicioInput.setAttribute('min', this.fechaMinSemestre1);
        inicioInput.setAttribute('max', this.fechaMaxSemestre1);
      }
      if (terminoInput) {
        terminoInput.value = terminoFecha;
        terminoInput.setAttribute('min', this.fechaMinSemestre1);
        terminoInput.setAttribute('max', this.fechaMaxSemestre1);
      }
    } else if (tipo === 'tarifa') {
      const inicioInput = document.getElementById('tarifaFechaInicioCobro') as HTMLInputElement;
      const terminoInput = document.getElementById('tarifaFechaTerminoCobro') as HTMLInputElement;
      
      if (inicioInput) {
        inicioInput.value = inicioFecha;
        inicioInput.setAttribute('min', this.fechaMinSemestre1);
        inicioInput.setAttribute('max', this.fechaMaxSemestre1);
      }
      if (terminoInput) {
        terminoInput.value = terminoFecha;
        terminoInput.setAttribute('min', this.fechaMinSemestre1);
        terminoInput.setAttribute('max', this.fechaMaxSemestre1);
      }
    }

    // Calcular días después de establecer las fechas
    setTimeout(() => {
      this.calcularDiasCobroPorTipo(tipo);
    }, 100);
  }

  private establecerFechasSegundoSemestre(tipo: string): void {
    const inicioFecha = this.fechaMinSemestre2;
    const terminoFecha = this.fechaMaxSemestre2;
    
    if (tipo === 'renta') {
      const inicioInput = document.getElementById('rentaFechaInicioCobro') as HTMLInputElement;
      const terminoInput = document.getElementById('rentaFechaTerminoCobro') as HTMLInputElement;
      
      if (inicioInput) {
        inicioInput.value = inicioFecha;
        inicioInput.setAttribute('min', this.fechaMinSemestre2);
        inicioInput.setAttribute('max', this.fechaMaxSemestre2);
      }
      if (terminoInput) {
        terminoInput.value = terminoFecha;
        terminoInput.setAttribute('min', this.fechaMinSemestre2);
        terminoInput.setAttribute('max', this.fechaMaxSemestre2);
      }
    } else if (tipo === 'tarifa') {
      const inicioInput = document.getElementById('tarifaFechaInicioCobro') as HTMLInputElement;
      const terminoInput = document.getElementById('tarifaFechaTerminoCobro') as HTMLInputElement;
      
      if (inicioInput) {
        inicioInput.value = inicioFecha;
        inicioInput.setAttribute('min', this.fechaMinSemestre2);
        inicioInput.setAttribute('max', this.fechaMaxSemestre2);
      }
      if (terminoInput) {
        terminoInput.value = terminoFecha;
        terminoInput.setAttribute('min', this.fechaMinSemestre2);
        terminoInput.setAttribute('max', this.fechaMaxSemestre2);
      }
    }

    // Calcular días después de establecer las fechas
    setTimeout(() => {
      this.calcularDiasCobroPorTipo(tipo);
    }, 100);
  }

  // Métodos para establecer fechas de semestre en los formularios reactivos
  private establecerFechasSemestreRenta(semestre: number): void {
    if (semestre === 1) {
      this.rentaForm.patchValue({
        fechaInicioSemestre: `${this.anoActual}-01-01`,
        fechaFinalSemestre: `${this.anoActual}-06-30`
      });
    } else if (semestre === 2) {
      this.rentaForm.patchValue({
        fechaInicioSemestre: `${this.anoActual}-07-01`,
        fechaFinalSemestre: `${this.anoActual}-12-31`
      });
    }
  }

  private establecerFechasSemestreTarifa(semestre: number): void {
    if (semestre === 1) {
      this.tarifaForm.patchValue({
        fechaInicioSemestre: `${this.anoActual}-01-01`,
        fechaFinalSemestre: `${this.anoActual}-06-30`
      });
    } else if (semestre === 2) {
      this.tarifaForm.patchValue({
        fechaInicioSemestre: `${this.anoActual}-07-01`,
        fechaFinalSemestre: `${this.anoActual}-12-31`
      });
    }
  }

}
