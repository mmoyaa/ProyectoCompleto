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
    const observacionesValue = this.observaciones?.value || '';
    
    // Si es "Sin observación", solo validar campos básicos
    if (observacionesValue === 'Sin observación') {
      return this.fiscalizacionForm.get('fechaFiscalizacion')?.valid || false;
    }
    
    // Si hay observaciones, validar todos los campos necesarios
    if (observacionesValue.length >= 200) {
      const accionesValue = this.accionesAdoptadas?.value || '';
      const resultadoValue = this.resultado?.value || '';
      const fechaValida = this.fiscalizacionForm.get('fechaFiscalizacion')?.valid;
      const plazoValido = this.fiscalizacionForm.get('plazoCumplimiento')?.value;
      
      return fechaValida && 
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

  sinObservaciones(): void {
    this.fiscalizacionForm.patchValue({
      observaciones: 'Sin observación',
      accionesAdoptadas: '-',
      resultado: '-'
    });
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
