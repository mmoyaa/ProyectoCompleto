import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComunService } from 'src/app/services/comun.service';
import { PacienteService, Paciente, PacienteConRepresentante } from 'src/app/services/paciente.service';

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
  tieneRepresentante = false;
  
  // Variables para el modal de pacientes
  mostrarModalPacientes = false;
  listaPacientes: any[] = [];
  loadingPacientes = false;

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
      // Campos del paciente
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellidoMaterno: ['', [Validators.maxLength(100)]],
      rut: ['', [Validators.required, Validators.pattern(/^\d{7,8}-[\dkK]$/)]],
      telefono: ['', [Validators.pattern(/^\+?[\d\s\-\(\)]{7,15}$/)]],
      correo: ['', [Validators.email, Validators.maxLength(150)]],
      direccion: ['', [Validators.maxLength(255)]],
      nacionalidad: ['Chilena', [Validators.maxLength(50)]],
      
      // Control para activar/desactivar representante
      tieneRepresentante: [false],
      
      // Campos del representante (se activarán condicionalmente)
      nombreRepresentante: [''],
      apellidoRepresentante: [''],
      rutRepresentante: [''],
      telefonoRepresentante: [''],
      correoRepresentante: [''],
      direccionRepresentante: [''],
      relacionRepresentante: [''],
      nacionalidadRepresentante: ['Chilena']
    });

    // Observar cambios en el checkbox de representante
    this.pacienteForm.get('tieneRepresentante')?.valueChanges.subscribe(value => {
      this.tieneRepresentante = value;
      this.actualizarValidacionesRepresentante(value);
    });
  }

  private actualizarValidacionesRepresentante(tieneRepresentante: boolean): void {
    const camposRepresentante = [
      'nombreRepresentante', 
      'apellidoRepresentante', 
      'rutRepresentante', 
      'relacionRepresentante'
    ];

    if (tieneRepresentante) {
      // Agregar validaciones para campos obligatorios del representante
      this.pacienteForm.get('nombreRepresentante')?.setValidators([
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(100)
      ]);
      this.pacienteForm.get('apellidoRepresentante')?.setValidators([
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(100)
      ]);
      this.pacienteForm.get('rutRepresentante')?.setValidators([
        Validators.required, 
        Validators.pattern(/^\d{7,8}-[\dkK]$/)
      ]);
      this.pacienteForm.get('relacionRepresentante')?.setValidators([
        Validators.required, 
        Validators.maxLength(50)
      ]);
      this.pacienteForm.get('correoRepresentante')?.setValidators([
        Validators.email, 
        Validators.maxLength(150)
      ]);
      this.pacienteForm.get('telefonoRepresentante')?.setValidators([
        Validators.pattern(/^\+?[\d\s\-\(\)]{7,15}$/)
      ]);
      this.pacienteForm.get('direccionRepresentante')?.setValidators([
        Validators.maxLength(255)
      ]);
      this.pacienteForm.get('nacionalidadRepresentante')?.setValidators([
        Validators.maxLength(50)
      ]);
    } else {
      // Remover validaciones de los campos del representante
      camposRepresentante.forEach(campo => {
        this.pacienteForm.get(campo)?.clearValidators();
        this.pacienteForm.get(campo)?.setValue('');
      });
      // También limpiar campos opcionales
      this.pacienteForm.get('correoRepresentante')?.clearValidators();
      this.pacienteForm.get('telefonoRepresentante')?.clearValidators();
      this.pacienteForm.get('direccionRepresentante')?.clearValidators();
      this.pacienteForm.get('nacionalidadRepresentante')?.clearValidators();
      this.pacienteForm.get('correoRepresentante')?.setValue('');
      this.pacienteForm.get('telefonoRepresentante')?.setValue('');
      this.pacienteForm.get('direccionRepresentante')?.setValue('');
      this.pacienteForm.get('nacionalidadRepresentante')?.setValue('Chilena');
    }

    // Actualizar validaciones
    this.pacienteForm.get('nombreRepresentante')?.updateValueAndValidity();
    this.pacienteForm.get('apellidoRepresentante')?.updateValueAndValidity();
    this.pacienteForm.get('rutRepresentante')?.updateValueAndValidity();
    this.pacienteForm.get('relacionRepresentante')?.updateValueAndValidity();
    this.pacienteForm.get('correoRepresentante')?.updateValueAndValidity();
    this.pacienteForm.get('telefonoRepresentante')?.updateValueAndValidity();
    this.pacienteForm.get('direccionRepresentante')?.updateValueAndValidity();
    this.pacienteForm.get('nacionalidadRepresentante')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.pacienteForm.valid) {
      this.loading = true;
      this.mensaje = '';
      this.tipoMensaje = '';

      if (this.tieneRepresentante) {
        // Crear paciente con representante
        const pacienteConRepresentante: PacienteConRepresentante = {
          // Datos del paciente
          nombre: this.pacienteForm.value.nombre.trim(),
          apellidoPaterno: this.pacienteForm.value.apellidoPaterno.trim(),
          apellidoMaterno: this.pacienteForm.value.apellidoMaterno?.trim() || undefined,
          rut: this.pacienteForm.value.rut.trim(),
          telefono: this.pacienteForm.value.telefono?.trim() || undefined,
          correo: this.pacienteForm.value.correo?.trim() || undefined,
          direccion: this.pacienteForm.value.direccion?.trim() || undefined,
          nacionalidad: this.pacienteForm.value.nacionalidad?.trim() || 'Chilena',
          
          // Datos del representante
          nombreRepresentante: this.pacienteForm.value.nombreRepresentante.trim(),
          apellidoRepresentante: this.pacienteForm.value.apellidoRepresentante.trim(),
          rutRepresentante: this.pacienteForm.value.rutRepresentante.trim(),
          telefonoRepresentante: this.pacienteForm.value.telefonoRepresentante?.trim() || undefined,
          correoRepresentante: this.pacienteForm.value.correoRepresentante?.trim() || undefined,
          direccionRepresentante: this.pacienteForm.value.direccionRepresentante?.trim() || undefined,
          relacionRepresentante: this.pacienteForm.value.relacionRepresentante.trim(),
          nacionalidadRepresentante: this.pacienteForm.value.nacionalidadRepresentante?.trim() || 'Chilena'
        };

        this.pacienteService.crearPacienteConRepresentante(pacienteConRepresentante).subscribe({
          next: (response) => {
            console.log('Paciente con representante creado exitosamente:', response);
            this.mensaje = `Paciente y representante creados correctamente. ID Paciente: ${response.idPaciente}, ID Representante: ${response.idRepresentante}`;
            this.tipoMensaje = 'success';
            this.resetForm();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al crear paciente con representante:', error);
            this.mensaje = error.error?.error || 'Error al crear el paciente con representante';
            this.tipoMensaje = 'error';
            this.loading = false;
          }
        });
      } else {
        // Crear paciente sin representante (flujo original)
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
      }
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
      nacionalidad: 'Chilena',
      nacionalidadRepresentante: 'Chilena',
      tieneRepresentante: false
    });
    this.tieneRepresentante = false;
    this.actualizarValidacionesRepresentante(false);
  }

  // Método para formatear RUT mientras el usuario escribe (tanto para paciente como representante)
  formatearRut(event: any, campo: string = 'rut'): void {
    let rut = event.target.value.replace(/[^0-9kK]/g, '');
    
    if (rut.length > 1) {
      const cuerpo = rut.slice(0, -1);
      const dv = rut.slice(-1);
      rut = `${cuerpo}-${dv}`;
    }
    
    const patchObject: any = {};
    patchObject[campo] = rut;
    this.pacienteForm.patchValue(patchObject);
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
      nacionalidad: 'Nacionalidad',
      nombreRepresentante: 'Nombre del Representante',
      apellidoRepresentante: 'Apellido del Representante',
      rutRepresentante: 'RUT del Representante',
      telefonoRepresentante: 'Teléfono del Representante',
      correoRepresentante: 'Correo del Representante',
      direccionRepresentante: 'Dirección del Representante',
      relacionRepresentante: 'Relación con el Paciente',
      nacionalidadRepresentante: 'Nacionalidad del Representante'
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
  
  // Método para abrir el modal de pacientes
  abrirModalPacientes(): void {
    this.mostrarModalPacientes = true;
    this.cargarListaPacientes();
  }

  // Método para cerrar el modal de pacientes
  cerrarModalPacientes(): void {
    this.mostrarModalPacientes = false;
    this.listaPacientes = [];
  }

  // Método para cargar la lista de pacientes
  cargarListaPacientes(): void {
    this.loadingPacientes = true;
    
    this.pacienteService.obtenerPacientesCompletos().subscribe({
      next: (pacientes) => {
        this.listaPacientes = pacientes;
        this.loadingPacientes = false;
        console.log('Lista de pacientes cargada:', pacientes);
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
        this.loadingPacientes = false;
        this.mensaje = 'Error al cargar la lista de pacientes';
        this.tipoMensaje = 'error';
      }
    });
  }

  // Método para formatear fecha
  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CL');
  }

  // Método para formatear nombre completo
  formatearNombreCompleto(paciente: any): string {
    const nombres = [paciente.nombre, paciente.apellidoPaterno, paciente.apellidoMaterno]
      .filter(n => n && n.trim() !== '')
      .join(' ');
    return nombres || 'N/A';
  }

  // Método para cargar un paciente seleccionado en el formulario
  cargarPacienteEnFormulario(paciente: any): void {
    // Limpiar mensajes previos
    this.limpiarMensaje();
    
    // Determinar si tiene representante
    const tieneRepresentante = paciente.idRepresentante !== null && paciente.idRepresentante !== undefined;
    
    // Cargar datos del paciente
    this.pacienteForm.patchValue({
      // Datos del paciente
      nombre: paciente.nombre || '',
      apellidoPaterno: paciente.apellidoPaterno || '',
      apellidoMaterno: paciente.apellidoMaterno || '',
      rut: paciente.rut || '',
      telefono: paciente.telefono || '',
      correo: paciente.correo || '',
      direccion: paciente.direccion || '',
      nacionalidad: paciente.nacionalidad || 'Chilena',
      
      // Control de representante
      tieneRepresentante: tieneRepresentante
    });

    // Si tiene representante, cargar sus datos
    if (tieneRepresentante) {
      // El endpoint ahora devuelve el nombre completo concatenado, necesitamos separarlo
      const nombreCompletoRepresentante = paciente.nombreRepresentante || '';
      const partesNombre = nombreCompletoRepresentante.split(' ');
      
      // Asumir que el primer elemento es el nombre y el resto son apellidos
      const nombreRep = partesNombre[0] || '';
      const apellidoRep = partesNombre.slice(1).join(' ') || '';
      
      this.pacienteForm.patchValue({
        nombreRepresentante: nombreRep,
        apellidoRepresentante: apellidoRep,
        rutRepresentante: paciente.rutRepresentante || '', // Ahora sí está disponible
        telefonoRepresentante: paciente.telefonoRepresentante || '',
        correoRepresentante: paciente.correoRepresentante || '',
        direccionRepresentante: paciente.direccionRepresentante || '',
        relacionRepresentante: paciente.relacionRepresentante || '',
        nacionalidadRepresentante: paciente.nacionalidadRepresentante || 'Chilena'
      });
    }

    // Actualizar estado del checkbox de representante
    this.tieneRepresentante = tieneRepresentante;
    this.actualizarValidacionesRepresentante(tieneRepresentante);

    // Cerrar el modal
    this.cerrarModalPacientes();

    // Mostrar mensaje de confirmación
    this.mensaje = `Datos de ${this.formatearNombreCompleto(paciente)} cargados en el formulario`;
    this.tipoMensaje = 'success';

    // Scroll hacia arriba para ver el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log('Paciente cargado en formulario:', paciente);
    
    // Si tiene representante y hay datos completos, mostrar confirmación
    if (tieneRepresentante && paciente.rutRepresentante) {
      setTimeout(() => {
        this.mensaje += ' ✓ Datos del representante cargados correctamente.';
      }, 1500);
    } else if (tieneRepresentante && !paciente.rutRepresentante) {
      setTimeout(() => {
        this.mensaje += ' ⚠️ Algunos datos del representante pueden estar incompletos.';
      }, 1500);
    }
  }
}
