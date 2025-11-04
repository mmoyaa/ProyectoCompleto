import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-ejemplos',
  templateUrl: './ejemplos.component.html',
  styleUrls: ['./ejemplos.component.css']
})
export class EjemplosComponent implements OnInit {
  
  // Formulario reactivo
  calculadoraForm!: FormGroup;
  
  // Bandera para mostrar si los datos fueron cargados
  datosSimulados = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  // Inicializar el formulario reactivo
  inicializarFormulario(): void {
    this.calculadoraForm = this.fb.group({
      valor1: ['', [Validators.required, this.validadorNumerico]],
      valor2: ['', [Validators.required, this.validadorNumerico]],
      valorTotal: [{ value: '', disabled: true }, [Validators.required]]
    }, { validators: [this.validadorSuma] });

    // Suscribirse a cambios en los valores para formatear
    this.calculadoraForm.get('valor1')?.valueChanges.subscribe(valor => {
      if (valor && !this.esFormatoValido(valor)) {
        this.formatearCampo('valor1', valor);
      }
    });

    this.calculadoraForm.get('valor2')?.valueChanges.subscribe(valor => {
      if (valor && !this.esFormatoValido(valor)) {
        this.formatearCampo('valor2', valor);
      }
    });
  }

  // Validador personalizado para números
  validadorNumerico(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;
    
    const numeroLimpio = control.value.toString().replace(/\./g, '');
    const esNumero = /^\d+$/.test(numeroLimpio);
    
    return esNumero ? null : { 'noEsNumero': { value: control.value } };
  }

  // Validador personalizado para la suma
  validadorSuma(group: AbstractControl): { [key: string]: any } | null {
    if (!(group instanceof FormGroup)) return null;
    
    const valor1Control = group.get('valor1');
    const valor2Control = group.get('valor2');
    const valorTotalControl = group.get('valorTotal');

    if (!valor1Control || !valor2Control || !valorTotalControl) return null;

    const valor1 = convertirANumero(valor1Control.value);
    const valor2 = convertirANumero(valor2Control.value);
    const total = convertirANumero(valorTotalControl.value);

    const suma = valor1 + valor2;

    if (suma > total && total > 0) {
      // Marcar los campos individuales como inválidos
      valor1Control.setErrors({ ...valor1Control.errors, 'sumaExcedida': true });
      valor2Control.setErrors({ ...valor2Control.errors, 'sumaExcedida': true });
      
      return { 'sumaExcedida': { suma, total, diferencia: suma - total } };
    } else {
      // Limpiar errores de suma excedida si existen
      if (valor1Control.errors) {
        delete valor1Control.errors['sumaExcedida'];
        if (Object.keys(valor1Control.errors).length === 0) {
          valor1Control.setErrors(null);
        }
      }
      if (valor2Control.errors) {
        delete valor2Control.errors['sumaExcedida'];
        if (Object.keys(valor2Control.errors).length === 0) {
          valor2Control.setErrors(null);
        }
      }
    }

    return null;
  }

  // Cargar datos simulados
  cargarDatos(): void {
    this.calculadoraForm.patchValue({
      valor1: this.formatearNumero(150000),
      valor2: this.formatearNumero(250000),
      valorTotal: this.formatearNumero(500000)
    });
    
    this.datosSimulados = true;
  }

  // Formatear número a formato CLP con puntos como separadores de miles
  formatearNumero(valor: number): string {
    if (isNaN(valor) || valor === null || valor === undefined) {
      return '';
    }
    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Convertir string formateado a número
  convertirANumero(valorFormateado: string): number {
    if (!valorFormateado) return 0;
    // Remover puntos y convertir a número
    const valorLimpio = valorFormateado.replace(/\./g, '');
    return parseInt(valorLimpio) || 0;
  }

  // Verificar si el formato ya es válido (tiene puntos)
  esFormatoValido(valor: string): boolean {
    if (!valor) return false;
    // Si tiene puntos en posiciones correctas, considerarlo válido
    const sinPuntos = valor.replace(/\./g, '');
    const conPuntos = this.formatearNumero(parseInt(sinPuntos));
    return valor === conPuntos;
  }

  // Formatear campo específico
  formatearCampo(campo: string, valor: string): void {
    // Remover caracteres no numéricos excepto puntos
    const valorLimpio = valor.replace(/[^\d]/g, '');
    
    if (valorLimpio) {
      const numeroFormateado = this.formatearNumero(parseInt(valorLimpio));
      
      // Actualizar el valor sin disparar el evento de cambio
      this.calculadoraForm.get(campo)?.setValue(numeroFormateado, { emitEvent: false });
    }
  }

  // Manejar entrada de texto en inputs
  onInputChange(campo: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const valor = target.value;
    
    // Remover caracteres no numéricos
    const valorLimpio = valor.replace(/[^\d]/g, '');
    
    if (valorLimpio) {
      const numeroFormateado = this.formatearNumero(parseInt(valorLimpio));
      // Actualizar el control del formulario
      this.calculadoraForm.get(campo)?.setValue(numeroFormateado);
      // Actualizar el input visualmente
      target.value = numeroFormateado;
    } else {
      this.calculadoraForm.get(campo)?.setValue('');
    }
  }

  // Getters para facilitar el acceso a los controles
  get valor1Control() { return this.calculadoraForm.get('valor1'); }
  get valor2Control() { return this.calculadoraForm.get('valor2'); }
  get valorTotalControl() { return this.calculadoraForm.get('valorTotal'); }

  // Verificar si un campo específico es válido
  esCampoValido(campo: string): boolean {
    const control = this.calculadoraForm.get(campo);
    return control ? control.valid && control.touched : false;
  }

  // Verificar si un campo específico es inválido
  esCampoInvalido(campo: string): boolean {
    const control = this.calculadoraForm.get(campo);
    return control ? control.invalid && control.touched : false;
  }

  // Verificar si tiene error de suma excedida
  tieneSumaExcedida(campo: string): boolean {
    const control = this.calculadoraForm.get(campo);
    return control ? control.hasError('sumaExcedida') : false;
  }

  // Obtener la suma actual
  get sumaActual(): number {
    const valor1 = this.convertirANumero(this.valor1Control?.value || '');
    const valor2 = this.convertirANumero(this.valor2Control?.value || '');
    return valor1 + valor2;
  }

  // Verificar si la suma es válida
  get sumValida(): boolean {
    return !this.calculadoraForm.hasError('sumaExcedida');
  }

  // Verificar si el botón guardar debe estar habilitado
  get puedeGuardar(): boolean {
    return this.calculadoraForm.valid && this.datosSimulados;
  }

  // Simular guardado
  guardar(): void {
    if (this.puedeGuardar) {
      const formValues = this.calculadoraForm.value;
      const num1 = this.convertirANumero(formValues.valor1);
      const num2 = this.convertirANumero(formValues.valor2);
      
      alert(`Datos guardados exitosamente con Formularios Reactivos:
      Valor 1: $${formValues.valor1}
      Valor 2: $${formValues.valor2}
      Total: $${this.calculadoraForm.get('valorTotal')?.value}
      Suma: $${this.formatearNumero(num1 + num2)}
      
      Estado del formulario: ${this.calculadoraForm.valid ? 'VÁLIDO' : 'INVÁLIDO'}`);
    }
  }

  // Limpiar formulario
  limpiar(): void {
    this.calculadoraForm.reset();
    this.datosSimulados = false;
  }

}

// Función helper fuera de la clase
function convertirANumero(valorFormateado: string): number {
  if (!valorFormateado) return 0;
  const valorLimpio = valorFormateado.replace(/\./g, '');
  return parseInt(valorLimpio) || 0;
}