import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-capuerto',
  templateUrl: './capuerto.component.html',
  styleUrls: ['./capuerto.component.css']
})
export class CapuertoComponent implements OnInit {

  formularioCobro!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formularioCobro = this.fb.group({
      // Renta - Sección 1
      rentaAnual: [{ value: '', disabled: true }],
      rentaSemestral: ['', [Validators.required, Validators.min(0)]],
      rentaTotal: ['', [Validators.required, Validators.min(0)]],
      semestreSeleccionadoRenta: ['1', Validators.required],
      
      // Renta - Fechas y días
      rentaFechaNotificacion: ['', Validators.required],
      rentaFechaInicioCobro: ['', Validators.required],
      rentaFechaTerminoCobro: ['', Validators.required],
      rentaDiasCobro: [{ value: null, disabled: true }],

      // Tarifa - Sección 2 (con número 2 al final)
      tarifaAnual2: [{ value: '', disabled: true }],
      tarifaSemestral2: ['342234', [Validators.required, Validators.min(0)]],
      tarifaTotal2: ['', [Validators.required, Validators.min(0)]],
      semestreSeleccionadoTarifa2: ['1', Validators.required],
      
      // Tarifa - Fechas y días (con número 2 al final)
      tarifaFechaNotificacion2: ['2025-09-09', Validators.required],
      tarifaFechaInicioCobro2: ['2025-10-04', Validators.required],
      tarifaFechaTerminoCobro2: ['2025-09-12', Validators.required],
      tarifaDiasCobro2: [{ value: null, disabled: true }],

      // Campos adicionales
      totalPagarUTM: ['', [Validators.required, Validators.min(0)]],
      valorUTM: ['', [Validators.required, Validators.min(0)]],
      totalPagar: [{ value: '', disabled: true }]
    });

    // Suscribirse a cambios en las fechas para calcular días automáticamente
    this.setupDateListeners();
  }

  private setupDateListeners(): void {
    // Para Renta
    this.formularioCobro.get('rentaFechaInicioCobro')?.valueChanges.subscribe((value) => {
      console.log('Cambio en rentaFechaInicioCobro:', value);
      this.calcularDiasCobro();
    });
    this.formularioCobro.get('rentaFechaTerminoCobro')?.valueChanges.subscribe((value) => {
      console.log('Cambio en rentaFechaTerminoCobro:', value);
      this.calcularDiasCobro();
    });

    // Para Tarifa (con número 2)
    this.formularioCobro.get('tarifaFechaInicioCobro2')?.valueChanges.subscribe((value) => {
      console.log('Cambio en tarifaFechaInicioCobro2:', value);
      this.calcularDiasCobro2();
    });
    this.formularioCobro.get('tarifaFechaTerminoCobro2')?.valueChanges.subscribe((value) => {
      console.log('Cambio en tarifaFechaTerminoCobro2:', value);
      this.calcularDiasCobro2();
    });

    // Calcular días iniciales si ya hay fechas
    setTimeout(() => {
      console.log('Calculando días iniciales...');
      this.calcularDiasCobro();
      this.calcularDiasCobro2();
    }, 100);

    // Listeners para calcular Total a Pagar
    this.setupTotalPagarListeners();
  }

  private setupTotalPagarListeners(): void {
    // Listener para Total a Pagar UTM
    this.formularioCobro.get('totalPagarUTM')?.valueChanges.subscribe((value) => {
      console.log('Cambio en totalPagarUTM:', value);
      this.calcularTotalPagar();
    });

    // Listener para Valor UTM
    this.formularioCobro.get('valorUTM')?.valueChanges.subscribe((value) => {
      console.log('Cambio en valorUTM:', value);
      this.calcularTotalPagar();
    });

    // Calcular total inicial si ya hay valores
    setTimeout(() => {
      this.calcularTotalPagar();
    }, 150);
  }

  private calcularDiasCobro(): void {
    console.log('Calculando días para sección RENTA');
    
    const fechaInicio = this.formularioCobro.get('rentaFechaInicioCobro')?.value;
    const fechaTermino = this.formularioCobro.get('rentaFechaTerminoCobro')?.value;

    console.log(`Fechas RENTA - Inicio: ${fechaInicio}, Término: ${fechaTermino}`);

    if (fechaInicio && fechaTermino) {
      const inicio = new Date(fechaInicio);
      const termino = new Date(fechaTermino);
      
      console.log(`Fechas parseadas RENTA - Inicio: ${inicio}, Término: ${termino}`);
      
      // Calcular diferencia: término - inicio
      const diferenciaTiempo = termino.getTime() - inicio.getTime();
      const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));
      
      console.log(`Diferencia en días para RENTA: ${diferenciaDias}`);
      
      // Actualizar el campo correspondiente
      const diasControl = this.formularioCobro.get('rentaDiasCobro');
      const valorFinal = diferenciaDias >= 0 ? diferenciaDias : 0;
      
      console.log(`Actualizando rentaDiasCobro con valor: ${valorFinal}`);
      
      if (diasControl) {
        // Habilitar temporalmente el control para poder actualizarlo
        diasControl.enable();
        diasControl.setValue(valorFinal);
        diasControl.disable();
        console.log('Control rentaDiasCobro actualizado exitosamente');
      } else {
        console.error('No se encontró el control rentaDiasCobro');
      }
    } else {
      console.log('Faltan fechas para calcular días en sección RENTA');
      // Si no hay fechas, limpiar el campo de días
      const diasControl = this.formularioCobro.get('rentaDiasCobro');
      if (diasControl) {
        diasControl.enable();
        diasControl.setValue(null);
        diasControl.disable();
      }
    }
  }

  private calcularDiasCobro2(): void {
    console.log('Calculando días para sección TARIFA');
    
    const fechaInicio = this.formularioCobro.get('tarifaFechaInicioCobro2')?.value;
    const fechaTermino = this.formularioCobro.get('tarifaFechaTerminoCobro2')?.value;

    console.log(`Fechas TARIFA - Inicio: ${fechaInicio}, Término: ${fechaTermino}`);

    if (fechaInicio && fechaTermino) {
      const inicio = new Date(fechaInicio);
      const termino = new Date(fechaTermino);
      
      console.log(`Fechas parseadas TARIFA - Inicio: ${inicio}, Término: ${termino}`);
      
      // Calcular diferencia: término - inicio
      const diferenciaTiempo = termino.getTime() - inicio.getTime();
      const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));
      
      console.log(`Diferencia en días para TARIFA: ${diferenciaDias}`);
      
      // Actualizar el campo correspondiente
      const diasControl = this.formularioCobro.get('tarifaDiasCobro2');
      const valorFinal = diferenciaDias >= 0 ? diferenciaDias : 0;
      
      console.log(`Actualizando tarifaDiasCobro2 con valor: ${valorFinal}`);
      
      if (diasControl) {
        // Habilitar temporalmente el control para poder actualizarlo
        diasControl.enable();
        diasControl.setValue(valorFinal);
        diasControl.disable();
        console.log('Control tarifaDiasCobro2 actualizado exitosamente');
      } else {
        console.error('No se encontró el control tarifaDiasCobro2');
      }
    } else {
      console.log('Faltan fechas para calcular días en sección TARIFA');
      // Si no hay fechas, limpiar el campo de días
      const diasControl = this.formularioCobro.get('tarifaDiasCobro2');
      if (diasControl) {
        diasControl.enable();
        diasControl.setValue(null);
        diasControl.disable();
      }
    }
  }

  private calcularTotalPagar(): void {
    console.log('Calculando Total a Pagar');
    
    const totalPagarUTM = this.formularioCobro.get('totalPagarUTM')?.value;
    const valorUTM = this.formularioCobro.get('valorUTM')?.value;

    console.log(`Total a Pagar UTM: ${totalPagarUTM}, Valor UTM: ${valorUTM}`);

    if (totalPagarUTM && valorUTM && !isNaN(totalPagarUTM) && !isNaN(valorUTM)) {
      // Calcular: Total a Pagar UTM × Valor UTM
      const totalPagar = parseFloat(totalPagarUTM) * parseFloat(valorUTM);
      
      console.log(`Total a Pagar calculado: ${totalPagar}`);
      
      // Actualizar el campo Total a Pagar
      const totalPagarControl = this.formularioCobro.get('totalPagar');
      
      if (totalPagarControl) {
        // Habilitar temporalmente el control para poder actualizarlo
        totalPagarControl.enable();
        totalPagarControl.setValue(totalPagar.toFixed(2)); // Redondear a 2 decimales
        totalPagarControl.disable();
        console.log('Total a Pagar actualizado exitosamente');
      } else {
        console.error('No se encontró el control totalPagar');
      }
    } else {
      console.log('Faltan valores para calcular Total a Pagar o los valores no son números válidos');
      // Si no hay valores válidos, limpiar el campo
      const totalPagarControl = this.formularioCobro.get('totalPagar');
      if (totalPagarControl) {
        totalPagarControl.enable();
        totalPagarControl.setValue('');
        totalPagarControl.disable();
      }
    }
  }

  onSubmit(): void {
    if (this.formularioCobro.valid) {
      console.log('Formulario válido:', this.formularioCobro.value);
      // Aquí puedes agregar la lógica para enviar los datos
    } else {
      console.log('Formulario inválido');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.formularioCobro.controls).forEach(key => {
      const control = this.formularioCobro.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.formularioCobro.reset();
    // Restaurar valores por defecto
    this.formularioCobro.patchValue({
      semestreSeleccionadoRenta: '1',
      semestreSeleccionadoTarifa2: '1',
      tarifaSemestral2: '342234',
      tarifaFechaNotificacion2: '2025-09-09',
      tarifaFechaInicioCobro2: '2025-10-04',
      tarifaFechaTerminoCobro2: '2025-09-12'
    });
    
    // Recalcular días después de restaurar valores
    setTimeout(() => {
      this.calcularDiasCobro();
      this.calcularDiasCobro2();
      this.calcularTotalPagar();
    }, 50);
  }

  // Método para verificar si un campo tiene errores
  hasError(fieldName: string): boolean {
    const field = this.formularioCobro.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Método para obtener el mensaje de error de un campo
  getErrorMessage(fieldName: string): string {
    const field = this.formularioCobro.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['min']) {
        return 'El valor debe ser mayor a 0';
      }
    }
    return '';
  }

  // Método de debug para verificar el estado del formulario
  debugFormulario(): void {
    console.log('=== DEBUG FORMULARIO ===');
    console.log('Formulario completo:', this.formularioCobro.value);
    console.log('Controles del formulario:', Object.keys(this.formularioCobro.controls));
    
    // Verificar específicamente los campos de días
    console.log('=== CAMPOS DE DÍAS ===');
    console.log('rentaDiasCobro:', this.formularioCobro.get('rentaDiasCobro')?.value);
    console.log('tarifaDiasCobro2:', this.formularioCobro.get('tarifaDiasCobro2')?.value);
    
    // Forzar recálculo
    console.log('=== FORZANDO RECÁLCULO ===');
    this.calcularDiasCobro();
    this.calcularDiasCobro2();
    this.calcularTotalPagar();
  }

}
