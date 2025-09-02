    // ...existing code...

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-probando',
  templateUrl: './probando.component.html',
  styleUrls: ['./probando.component.css']
})
export class ProbandoComponent implements OnInit {
  public nacionalidad: string = '';
  public probandoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.probandoForm = this.createForm();
  }

  ngOnInit(): void {
    this.setupFormValidations();
  }

  /**
   * Crea y configura el formulario con todos los controles necesarios
   */
  private createForm(): FormGroup {
    return this.fb.group({
      // Información básica
      nacionalidad: [{ value: 'chileno', disabled: true }],
      tipoPersona: [{ value: 'natural', disabled: true }],
      
      // Controles de identificación por tipo
      rutSinDv: [{ value: '', disabled: true }],
      rutJuridico: [{ value: '', disabled: true }],
      taxId: [{ value: '', disabled: true }],
      pasaporteNatural: [{ value: '', disabled: true }],
      pais: [{ value: '', disabled: true }],
      
      // Controles legacy (mantener compatibilidad)
      rut: [{ value: '', disabled: true }, Validators.required],
      pasaporte: [{ value: '', disabled: true }],
      
      // Datos personales
      primerNombre: [{ value: '', disabled: true }, Validators.required],
      primerApellido: [{ value: '', disabled: true }, Validators.required],
      segundoApellido: [{ value: '', disabled: true }, Validators.required],
      
      // Información de contacto
      direccion: [{ value: '', disabled: true }],
      oficinaDepto: [{ value: '', disabled: true }],
      celular: [{ value: '', disabled: true }],
      comuna: [{ value: '', disabled: true }],
      oficina: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      telefonoFijo: [{ value: '', disabled: true }],
      poderNotarial: [{ value: '', disabled: true }],
      
      // Control de representante
      existeRepresentante: [{ value: false, disabled: true }],
      
      // Datos del representante
      nacionalidadRepresentante: [{ value: '', disabled: true }],
      rutSinDvRepresentante: [{ value: '', disabled: true }],
      rutRepresentante: [{ value: '', disabled: true }],
      pasaporteRepresentante: [{ value: '', disabled: true }],
      estadoCivilRepresentante: [{ value: '', disabled: true }],
      nombreRepresentante: [{ value: '', disabled: true }],
      celularCodPaiRepresentante: [{ value: '', disabled: true }],
      celularAreaRepresentante: [{ value: '', disabled: true }],
      celularNumeroRepresentante: [{ value: '', disabled: true }],
      apellidosRepresentante: [{ value: '', disabled: true }],
      emailRepresentante: [{ value: '', disabled: true }],
      profesionRepresentante: [{ value: '', disabled: true }]
    });
  }

  /**
   * Configura todas las validaciones y suscripciones del formulario
   */
  private setupFormValidations(): void {
    this.setupNacionalidadValidation();
    this.setupRepresentanteValidation();
    this.setupPaisValidation();
    this.setupNacionalidadRepresentanteSubscription();
  }

  /**
   * Configura la validación condicional para nacionalidad (rut/pasaporte)
   */
  private setupNacionalidadValidation(): void {
    this.probandoForm.get('nacionalidad')?.valueChanges.subscribe((valor: string) => {
      const rutControl = this.probandoForm.get('rut');
      const pasaporteControl = this.probandoForm.get('pasaporte');
      
      this.clearValidators([rutControl, pasaporteControl]);
      
      if (valor === 'chileno') {
        rutControl?.setValidators([Validators.required]);
      } else if (valor === 'extranjero') {
        pasaporteControl?.setValidators([Validators.required]);
      }
      
      this.updateValidators([rutControl, pasaporteControl]);
    });
  }

  /**
   * Configura la validación condicional para representante
   */
  private setupRepresentanteValidation(): void {
    this.probandoForm.get('existeRepresentante')?.valueChanges.subscribe((existe: boolean) => {
      const requiredControls = [
        'rutRepresentante',
        'nombreRepresentante',
        'apellidosRepresentante'
      ];

      requiredControls.forEach(controlName => {
        const control = this.probandoForm.get(controlName);
        if (control) {
          if (existe) {
            control.setValidators([Validators.required]);
          } else {
            control.clearValidators();
          }
          control.updateValueAndValidity();
        }
      });
    });
  }

  /**
   * Configura la validación condicional para país
   */
  private setupPaisValidation(): void {
    this.probandoForm.get('nacionalidad')?.valueChanges.subscribe((valor: string) => {
      this.nacionalidad = valor;
      const paisControl = this.probandoForm.get('pais');
      
      if (valor === 'extranjero') {
        paisControl?.setValidators([Validators.required]);
      } else {
        paisControl?.clearValidators();
      }
      paisControl?.updateValueAndValidity();
    });
  }

  /**
   * Suscripción para debugging del representante
   */
  private setupNacionalidadRepresentanteSubscription(): void {
    const nacionalidadRepControl = this.probandoForm.get('nacionalidadRepresentante');
    nacionalidadRepControl?.valueChanges.subscribe((valor: string) => {
      console.log('Valor nacionalidadRepresentante:', valor);
    });
  }

  /**
   * Limpia validadores de una lista de controles
   */
  private clearValidators(controls: (AbstractControl | null)[]): void {
    controls.forEach(control => control?.clearValidators());
  }

  /**
   * Actualiza validadores de una lista de controles
   */
  private updateValidators(controls: (AbstractControl | null)[]): void {
    controls.forEach(control => control?.updateValueAndValidity());
  }

  /**
   * Habilita todos los controles del formulario
   */
  public habilitarFormulario(): void {
    Object.keys(this.probandoForm.controls).forEach(key => {
      this.probandoForm.get(key)?.enable();
    });
  }

  /**
   * Getter para el control de país
   */
  public get paisControl(): AbstractControl | null {
    return this.probandoForm.get('pais');
  }
}
