import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fisca',
  templateUrl: './fisca.component.html',
  styleUrls: ['./fisca.component.css']
})
export class FiscaComponent implements OnInit {

  // Formulario reactivo
  fiscalizacionForm: FormGroup;

  // Datos del concesionario
  rutConcesionario = '69711002';
  nombreConcesionario = 'SERVICIO NACIONAL DE PESCA';
  reparticion = 'CAPITANIA DE PUERTO CHACABUCO';
  objeto = 'Continuar amparando un área de manejo y explotación de recursos bentónicos - Puerto Aysén Sector B.';

  // Contadores de caracteres
  contadorObservaciones = 0;
  contadorAcciones = 0;
  contadorResultado = 0;

  // Control de observaciones
  hayObservaciones: boolean | null = null; // null = no ha decidido, true = sí hay, false = no hay
  observacionesHabilitadas = false;

  fb = inject(FormBuilder);

  constructor() {
    this.fiscalizacionForm = this.fb.group({
      numeroKardex: ['', Validators.required],
      fechaFiscalizacion: ['', Validators.required],
      observaciones: ['', [Validators.required, Validators.minLength(200)]],
      plazoCumplimiento: [''],
      accionesAdoptadas: ['', Validators.minLength(200)],
      fechaCumplimiento: [''],
      resultado: ['', Validators.minLength(200)]
    });
  }

  ngOnInit(): void {
    // Establecer fecha actual por defecto
    const today = new Date().toISOString().split('T')[0];
    this.fiscalizacionForm.patchValue({
      fechaFiscalizacion: today
    });

    // Suscribirse a cambios para contar caracteres
    this.fiscalizacionForm.get('observaciones')?.valueChanges.subscribe(value => {
      this.contadorObservaciones = value ? value.length : 0;
    });

    this.fiscalizacionForm.get('accionesAdoptadas')?.valueChanges.subscribe(value => {
      this.contadorAcciones = value ? value.length : 0;
    });

    this.fiscalizacionForm.get('resultado')?.valueChanges.subscribe(value => {
      this.contadorResultado = value ? value.length : 0;
    });
  }

  // Getters para acceder fácilmente a los controles del formulario
  get numeroKardex() { return this.fiscalizacionForm.get('numeroKardex'); }
  get fechaFiscalizacion() { return this.fiscalizacionForm.get('fechaFiscalizacion'); }
  get observaciones() { return this.fiscalizacionForm.get('observaciones'); }
  get plazoCumplimiento() { return this.fiscalizacionForm.get('plazoCumplimiento'); }
  get accionesAdoptadas() { return this.fiscalizacionForm.get('accionesAdoptadas'); }
  get fechaCumplimiento() { return this.fiscalizacionForm.get('fechaCumplimiento'); }
  get resultado() { return this.fiscalizacionForm.get('resultado'); }

  usarFormatoFecha(tipo: string): void {
    const today = new Date();
    const fechaFormateada = today.toISOString().split('T')[0];
    
    switch (tipo) {
      case 'observacion':
        this.fiscalizacionForm.patchValue({ fechaFiscalizacion: fechaFormateada });
        break;
      case 'plazo': {
        // Agregar 30 días para plazo de cumplimiento
        const fechaPlazo = new Date(today);
        fechaPlazo.setDate(fechaPlazo.getDate() + 30);
        this.fiscalizacionForm.patchValue({ 
          plazoCumplimiento: fechaPlazo.toISOString().split('T')[0] 
        });
        break;
      }
      case 'cumplimiento':
        this.fiscalizacionForm.patchValue({ fechaCumplimiento: fechaFormateada });
        break;
    }
  }

  formularioValido(): boolean {
    // Verificar que se haya seleccionado si hay observaciones o no
    if (this.hayObservaciones === null) {
      return false;
    }
    
    // Verificar fecha de fiscalización (siempre requerida)
    const fechaValida = this.fiscalizacionForm.get('fechaFiscalizacion')?.valid;
    if (!fechaValida) {
      return false;
    }
    
    // Si no hay observaciones, solo se requiere la fecha
    if (this.hayObservaciones === false) {
      return true;
    }
    
    // Si hay observaciones, validar todos los campos necesarios
    if (this.hayObservaciones === true) {
      const observacionesValue = this.fiscalizacionForm.get('observaciones')?.value || '';
      const accionesValue = this.fiscalizacionForm.get('accionesAdoptadas')?.value || '';
      const resultadoValue = this.fiscalizacionForm.get('resultado')?.value || '';
      const plazoValido = this.fiscalizacionForm.get('plazoCumplimiento')?.value;
      
      return observacionesValue.length >= 200 && 
             accionesValue.length >= 200 && 
             resultadoValue.length >= 200 && 
             plazoValido;
    }
    
    return false;
  }

  grabarFiscalizacion(): void {
    if (this.formularioValido()) {
      const fiscalizacionData = this.fiscalizacionForm.value;
      
      console.log('Fiscalización guardada:', fiscalizacionData);
      alert('Fiscalización guardada exitosamente');
      
      // Aquí se puede agregar la lógica para enviar al backend
    } else {
      alert('Por favor complete todos los campos obligatorios con el mínimo de caracteres requeridos');
    }
  }

  // Métodos para controlar observaciones
  seleccionarObservaciones(hayObs: boolean): void {
    this.hayObservaciones = hayObs;
    this.observacionesHabilitadas = hayObs;
    
    if (hayObs) {
      // Si hay observaciones, habilitar y limpiar el campo
      this.fiscalizacionForm.get('observaciones')?.enable();
      this.fiscalizacionForm.get('observaciones')?.setValue('');
      this.fiscalizacionForm.get('accionesAdoptadas')?.enable();
      this.fiscalizacionForm.get('resultado')?.enable();
    } else {
      // Si no hay observaciones, deshabilitar y poner valores por defecto
      this.fiscalizacionForm.get('observaciones')?.disable();
      this.fiscalizacionForm.get('observaciones')?.setValue('Sin observación');
      this.fiscalizacionForm.get('accionesAdoptadas')?.disable();
      this.fiscalizacionForm.get('accionesAdoptadas')?.setValue('-');
      this.fiscalizacionForm.get('resultado')?.disable();
      this.fiscalizacionForm.get('resultado')?.setValue('-');
    }
  }

  sinObservaciones(): void {
    this.seleccionarObservaciones(false);
  }

  buscarKardex(): void {
    const numeroKardex = this.numeroKardex?.value;
    if (numeroKardex) {
      console.log('Buscando Kardex:', numeroKardex);
      // Aquí se puede agregar la lógica para buscar por número Kardex
      alert(`Buscando información para Kardex: ${numeroKardex}`);
    }
  }

}
