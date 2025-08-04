import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComunService } from 'src/app/services/comun.service';
import { PacienteService, Paciente } from 'src/app/services/paciente.service';

@Component({
  selector: 'app-pagina1',
  templateUrl: './pagina1.component.html',
  styleUrls: ['./pagina1.component.css']
})
export class Pagina1Component implements OnInit {
  pacienteForm!: FormGroup;
  loading = false;
  mensaje = '';
  tipoMensaje: 'success' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private comunService: ComunService,
    private pacienteService: PacienteService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Inicialización adicional si es necesaria
  }

  private initializeForm(): void {
    this.pacienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellidoMaterno: ['', [Validators.maxLength(100)]],
      rut: ['', [Validators.required, Validators.pattern(/^\d{7,8}-[\dkK]$/)]],
      telefono: ['', [Validators.pattern(/^\+?[\d\s\-\(\)]{7,15}$/)]],
      correo: ['', [Validators.email, Validators.maxLength(150)]],
      direccion: ['', [Validators.maxLength(255)]],
      nacionalidad: ['Chilena', [Validators.maxLength(50)]]
    });
  }

  onSubmit(): void {
    if (this.pacienteForm.valid) {
      this.loading = true;
      this.mensaje = '';
      this.tipoMensaje = '';

      const pacienteData: Paciente = {
        nombre: this.pacienteForm.value.nombre.trim(),
        apellidoPaterno: this.pacienteForm.value.apellidoPaterno.trim(),
        apellidoMaterno: this.pacienteForm.value.apellidoMaterno?.trim() || undefined,
        rut: this.pacienteForm.value.rut.trim(),
        telefono: this.pacienteForm.value.telefono?.trim() || undefined,
        correo: this.pacienteForm.value.correo?.trim() || undefined,
        direccion: this.pacienteForm.value.direccion?.trim() || undefined,
        nacionalidad: this.pacienteForm.value.nacionalidad?.trim() || 'Chilena'
      };

      this.pacienteService.crearPaciente(pacienteData).subscribe({
        next: (response) => {
          console.log('Paciente creado exitosamente:', response);
          this.mensaje = `Paciente creado correctamente. ID: ${response.idPaciente}`;
          this.tipoMensaje = 'success';
          this.resetForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al crear paciente:', error);
          this.mensaje = error.error?.error || 'Error al crear el paciente';
          this.tipoMensaje = 'error';
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.mensaje = 'Por favor, complete todos los campos obligatorios correctamente';
      this.tipoMensaje = 'error';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.pacienteForm.controls).forEach(key => {
      const control = this.pacienteForm.get(key);
      control?.markAsTouched();
    });
  }

  resetForm(): void {
    this.pacienteForm.reset();
    this.pacienteForm.patchValue({
      nacionalidad: 'Chilena'
    });
  }

  // Método para formatear RUT mientras el usuario escribe
  formatearRut(event: any): void {
    let rut = event.target.value.replace(/[^0-9kK]/g, '');
    
    if (rut.length > 1) {
      const cuerpo = rut.slice(0, -1);
      const dv = rut.slice(-1);
      rut = `${cuerpo}-${dv}`;
    }
    
    this.pacienteForm.patchValue({ rut: rut });
  }

  // Validación en tiempo real para mostrar errores
  getErrorMessage(fieldName: string): string {
    const control = this.pacienteForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} es obligatorio`;
      }
      if (control.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} no puede tener más de ${control.errors['maxlength'].requiredLength} caracteres`;
      }
      if (control.errors['pattern']) {
        if (fieldName === 'rut') {
          return 'Formato de RUT inválido (ej: 12345678-9)';
        }
        if (fieldName === 'telefono') {
          return 'Formato de teléfono inválido';
        }
      }
      if (control.errors['email']) {
        return 'Formato de correo electrónico inválido';
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      nombre: 'Nombre',
      apellidoPaterno: 'Apellido Paterno',
      apellidoMaterno: 'Apellido Materno',
      rut: 'RUT',
      telefono: 'Teléfono',
      correo: 'Correo Electrónico',
      direccion: 'Dirección',
      nacionalidad: 'Nacionalidad'
    };
    return displayNames[fieldName] || fieldName;
  }

  // Método para limpiar mensajes
  limpiarMensaje(): void {
    this.mensaje = '';
    this.tipoMensaje = '';
  }

  // Método para probar la conexión con el backend
  probarConexion(): void {
    this.loading = true;
    this.mensaje = '';
    this.tipoMensaje = '';

    const datosTest = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Probando conexión desde Angular'
    };

    this.pacienteService.testConectividad(datosTest).subscribe({
      next: (response) => {
        console.log('Respuesta del test:', response);
        this.mensaje = 'Conexión con el backend exitosa';
        this.tipoMensaje = 'success';
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en test de conexión:', error);
        this.mensaje = 'Error al conectar con el backend. Verifique que el servidor esté funcionando.';
        this.tipoMensaje = 'error';
        this.loading = false;
      }
    });
  }
}
