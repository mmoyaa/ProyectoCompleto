    // ...existing code...
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-probando',
  templateUrl: './probando.component.html',
  styleUrls: ['./probando.component.css']
})
export class ProbandoComponent {
  nacionalidad: string = '';
  probandoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.probandoForm = this.fb.group({
  taxId: [{value: '', disabled: true}],
  pasaporteNatural: [{value: '', disabled: true}],
  rutJuridico: [{value: '', disabled: true}],
  rutSinDv: [{value: '', disabled: true}],
      nacionalidad: [{value: 'chileno', disabled: true}],
      tipoPersona: [{value: 'natural', disabled: true}],
      pais: [{value: '', disabled: true}],
      existeRepresentante: [{value: false, disabled: true}],
      rut: [{value: '', disabled: true}, Validators.required],
      pasaporte: [{value: '', disabled: true}],
      primerNombre: [{value: '', disabled: true}, Validators.required],
      primerApellido: [{value: '', disabled: true}, Validators.required],
      segundoApellido: [{value: '', disabled: true}, Validators.required],
      direccion: [{value: '', disabled: true}],
      oficinaDepto: [{value: '', disabled: true}],
      celular: [{value: '', disabled: true}],
      comuna: [{value: '', disabled: true}],
      oficina: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      telefonoFijo: [{value: '', disabled: true}],
      poderNotarial: [{value: '', disabled: true}],
      nacionalidadRepresentante: [{value: '', disabled: true}],
      rutSinDvRepresentante: [{value: '', disabled: true}],
      rutRepresentante: [{value: '', disabled: true}],
      pasaporteRepresentante: [{value: '', disabled: true}],
      estadoCivilRepresentante: [{value: '', disabled: true}],
      nombreRepresentante: [{value: '', disabled: true}],
      celularCodPaiRepresentante: [{value: '', disabled: true}],
      celularAreaRepresentante: [{value: '', disabled: true}],
      celularNumeroRepresentante: [{value: '', disabled: true}],
      apellidosRepresentante: [{value: '', disabled: true}],
      emailRepresentante: [{value: '', disabled: true}],
      profesionRepresentante: [{value: '', disabled: true}]
    });

    // Validación condicional para rut y pasaporte principal
    this.probandoForm.get('nacionalidad')?.valueChanges.subscribe((valor: string) => {
      const rutControl = this.probandoForm.get('rut');
      const pasaporteControl = this.probandoForm.get('pasaporte');
      if (valor === 'chileno') {
        rutControl?.setValidators([Validators.required]);
        pasaporteControl?.clearValidators();
      } else if (valor === 'extranjero') {
        pasaporteControl?.setValidators([Validators.required]);
        rutControl?.clearValidators();
      } else {
        rutControl?.clearValidators();
        pasaporteControl?.clearValidators();
      }
      rutControl?.updateValueAndValidity();
      pasaporteControl?.updateValueAndValidity();
    });

    // Mostrar por consola el valor de nacionalidadRepresentante
    const nacionalidadRepControl = this.probandoForm.get('nacionalidadRepresentante');
    if (nacionalidadRepControl) {
      nacionalidadRepControl.valueChanges.subscribe((valor: string) => {
        console.log('Valor nacionalidadRepresentante:', valor);
      });
    }

    // Validadores condicionales para representante
    this.probandoForm.get('existeRepresentante')?.valueChanges.subscribe((existe: boolean) => {
      const controls = [
        { name: 'rutRepresentante', validator: Validators.required },
        { name: 'nombreRepresentante', validator: Validators.required },
        { name: 'apellidosRepresentante', validator: Validators.required }
      ];
      controls.forEach(ctrl => {
        const control = this.probandoForm.get(ctrl.name);
        if (control) {
          if (existe) {
            control.setValidators([ctrl.validator]);
          } else {
            control.clearValidators();
          }
          control.updateValueAndValidity();
        }
      });
    });

    this.probandoForm.get('nacionalidad')?.valueChanges.subscribe((valor: string) => {
      this.nacionalidad = valor;
      if (valor === 'extranjero') {
        this.probandoForm.get('pais')?.setValidators([Validators.required]);
      } else {
        this.probandoForm.get('pais')?.clearValidators();
      }
      this.probandoForm.get('pais')?.updateValueAndValidity();
    });
  }

  habilitarFormulario() {
    Object.keys(this.probandoForm.controls).forEach(key => {
      this.probandoForm.get(key)?.enable();
    });
  }

  get paisControl() {
    return this.probandoForm.get('pais');
  }
}
