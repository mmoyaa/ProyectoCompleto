import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PacienteService } from '../../services/paciente.service';
import { EvaluacionService, EvaluacionSensorial } from '../../services/evaluacion.service';

interface PacienteCompleto {
  idPaciente?: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  rut: string;
  telefono?: string;
  correo?: string;
  nombreCompleto?: string;
  direccion?: string;
  nacionalidad?: string;
  idRepresentante?: number;
}

interface Representante {
  idRepresentante: number;
  nombre: string;
  apellido: string;
  rut: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}

interface PacienteConRepresentante {
  paciente: PacienteCompleto;
  representante?: Representante;
}

@Component({
  selector: 'app-resumen-pago',
  templateUrl: './resumen-pago.component.html',
  styleUrls: ['./resumen-pago.component.css']
})
export class ResumenPagoComponent implements OnInit {
  tipoSeleccionado = '';
  
  // Inyección de dependencias usando inject()
  private pacienteService = inject(PacienteService);
  private evaluacionService = inject(EvaluacionService);
  private http = inject(HttpClient);
  
  // Datos para las tablas
  pacientes: PacienteCompleto[] = [];
  evaluaciones: EvaluacionSensorial[] = [];
  
  // Estados de carga
  cargandoPacientes = false;
  cargandoEvaluaciones = false;
  
  // Estados de error
  errorPacientes = '';
  errorEvaluaciones = '';

  // Datos de selección para UTM (Proporcional UTM)
  pacienteSeleccionado: PacienteCompleto | null = null;
  nombreSeleccionado = '';
  telefonoSeleccionado = '';
  
  // Información detallada del paciente y representante
  informacionDetallada: PacienteConRepresentante | null = null;
  cargandoInformacionDetallada = false;
  errorInformacionDetallada = '';
  
  // Estado para eliminación
  eliminandoPaciente = false;
  confirmandoEliminacion = false;
  
  // Estado para edición
  modoEdicion = false;
  guardandoCambios = false;
  datosEditados: PacienteCompleto | null = null;

  // Datos de selección para IPC
  evaluacionSeleccionada: EvaluacionSensorial | null = null;
  nombrePacienteSeleccionado = '';
  fechaSeleccionada = '';

  ngOnInit(): void {
    // El componente inicia vacío hasta que el usuario seleccione una opción
    console.log('Componente ResumenPago inicializado');
  }

  onTipoSeleccionado(tipo: string): void {
    this.tipoSeleccionado = tipo;
    this.limpiarDatos();
    
    switch(tipo) {
      case 'utm':
        this.cargarPacientes();
        break;
      case 'ipc':
        this.cargarEvaluaciones();
        break;
      case 'arancel':
        // Por ahora no tiene funcionalidad específica
        break;
    }
  }

  private limpiarDatos(): void {
    this.pacientes = [];
    this.evaluaciones = [];
    this.errorPacientes = '';
    this.errorEvaluaciones = '';
  }

  private limpiarSelecciones(): void {
    this.pacienteSeleccionado = null;
    this.nombreSeleccionado = '';
    this.telefonoSeleccionado = '';
    this.evaluacionSeleccionada = null;
    this.nombrePacienteSeleccionado = '';
    this.fechaSeleccionada = '';
    
    // Limpiar información detallada
    this.informacionDetallada = null;
    this.errorInformacionDetallada = '';
    this.cargandoInformacionDetallada = false;
    
    // Limpiar estados de eliminación
    this.eliminandoPaciente = false;
    this.confirmandoEliminacion = false;
    
    // Limpiar estados de edición
    this.modoEdicion = false;
    this.guardandoCambios = false;
    this.datosEditados = null;
  }

  private cargarPacientes(): void {
    this.cargandoPacientes = true;
    this.errorPacientes = '';
    
    this.pacienteService.obtenerPacientesCompletos().subscribe({
      next: (data) => {
        this.pacientes = data || [];
        this.cargandoPacientes = false;
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
        this.errorPacientes = 'Error al cargar la información de pacientes';
        this.cargandoPacientes = false;
        
        // Fallback a obtener pacientes simples
        this.pacienteService.obtenerPacientes().subscribe({
          next: (data) => {
            this.pacientes = data || [];
            this.errorPacientes = '';
          },
          error: (fallbackError) => {
            console.error('Error en fallback de pacientes:', fallbackError);
            this.errorPacientes = 'No se pudo conectar con el servicio de pacientes';
          }
        });
      }
    });
  }

  private cargarEvaluaciones(): void {
    this.cargandoEvaluaciones = true;
    this.errorEvaluaciones = '';
    
    this.evaluacionService.obtenerEvaluaciones().subscribe({
      next: (data) => {
        this.evaluaciones = data || [];
        this.cargandoEvaluaciones = false;
      },
      error: (error) => {
        console.error('Error al cargar evaluaciones:', error);
        this.errorEvaluaciones = 'Error al cargar la información de evaluaciones';
        this.cargandoEvaluaciones = false;
      }
    });
  }

  // Métodos utilitarios para las vistas
  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CL');
  }

  obtenerNombreCompleto(item: PacienteCompleto | EvaluacionSensorial): string {
    if (item.nombreCompleto) return item.nombreCompleto;
    
    // Type guard para PacienteCompleto
    if ('nombre' in item && 'apellidoPaterno' in item) {
      return `${item.nombre} ${item.apellidoPaterno} ${item.apellidoMaterno || ''}`.trim();
    }
    
    return 'Sin nombre';
  }

  // Métodos para seleccionar registros
  seleccionarPaciente(paciente: PacienteCompleto): void {
    this.pacienteSeleccionado = paciente;
    this.nombreSeleccionado = this.obtenerNombreCompleto(paciente);
    this.telefonoSeleccionado = paciente.telefono || 'Sin teléfono';
  }

  // Método para obtener información detallada del paciente y representante
  obtenerInformacionDetallada(idPaciente: number): void {
    console.log(`🔍 Obteniendo información detallada para paciente ID: ${idPaciente}`);
    
    this.cargandoInformacionDetallada = true;
    this.errorInformacionDetallada = '';
    this.informacionDetallada = null;

    // Validar que el ID sea válido
    if (!idPaciente || idPaciente <= 0) {
      this.errorInformacionDetallada = 'ID de paciente no válido';
      this.cargandoInformacionDetallada = false;
      return;
    }

    // Buscamos el paciente en la lista actual
    const pacienteEncontrado = this.pacientes.find(p => p.idPaciente === idPaciente);
    
    if (pacienteEncontrado) {
      console.log(`✅ Paciente encontrado en lista local:`, pacienteEncontrado);
      
      if (pacienteEncontrado.idRepresentante) {
        console.log(`🔗 Paciente tiene representante con ID: ${pacienteEncontrado.idRepresentante}`);
        // Si tiene representante, obtenemos la información completa del backend
        this.obtenerPacienteConRepresentante(idPaciente);
      } else {
        console.log(`ℹ️ Paciente sin representante, mostrando solo datos del paciente`);
        // Si no tiene representante, mostramos solo la información del paciente
        this.informacionDetallada = {
          paciente: pacienteEncontrado,
          representante: undefined
        };
        this.cargandoInformacionDetallada = false;
      }
    } else {
      console.error(`❌ Paciente con ID ${idPaciente} no encontrado en la lista local`);
      this.errorInformacionDetallada = `Paciente con ID ${idPaciente} no encontrado`;
      this.cargandoInformacionDetallada = false;
    }
  }

  // Método para obtener paciente con representante
  private obtenerPacienteConRepresentante(idPaciente: number): void {
    const url = `http://localhost:3000/api/pacientes/${idPaciente}/con-representante`;
    console.log(`🌐 Llamando al endpoint: ${url}`);
    
    // Usar HttpClient en lugar de fetch para mantener consistencia
    this.http.get<PacienteConRepresentante>(url).subscribe({
      next: (data: PacienteConRepresentante) => {
        console.log('✅ Información detallada obtenida del backend:', data);
        this.informacionDetallada = data;
        this.cargandoInformacionDetallada = false;
        
        if (data.representante) {
          console.log(`👥 Representante encontrado: ${data.representante.nombre} ${data.representante.apellido}`);
        } else {
          console.log(`ℹ️ No se encontró representante en la respuesta del backend`);
        }
      },
      error: (error: Error) => {
        console.error('❌ Error al obtener información detallada:', error);
        console.error('📍 URL que falló:', url);
        
        // Proporcionar más detalles del error
        let mensajeError = 'Error al cargar la información completa del paciente';
        if (error.message?.includes('404')) {
          mensajeError = 'Paciente no encontrado en el servidor';
        } else if (error.message?.includes('500')) {
          mensajeError = 'Error interno del servidor';
        } else if (error.message?.includes('connection')) {
          mensajeError = 'Error de conexión con el servidor';
        }
        
        this.errorInformacionDetallada = mensajeError;
        this.cargandoInformacionDetallada = false;
      }
    });
  }

  // Método para confirmar eliminación
  confirmarEliminacion(): void {
    this.confirmandoEliminacion = true;
  }

  // Método para cancelar eliminación
  cancelarEliminacion(): void {
    this.confirmandoEliminacion = false;
  }

  // Método para eliminar paciente
  eliminarPaciente(): void {
    if (!this.informacionDetallada?.paciente?.idPaciente) {
      console.error('❌ No hay paciente seleccionado para eliminar');
      return;
    }

    const idPaciente = this.informacionDetallada.paciente.idPaciente;
    console.log(`🗑️ Iniciando eliminación del paciente ID: ${idPaciente}`);

    this.eliminandoPaciente = true;
    this.confirmandoEliminacion = false;

    // Llamar al endpoint de eliminación
    const url = `http://localhost:3000/api/pacientes/${idPaciente}`;
    
    this.http.delete(url).subscribe({
      next: (response) => {
        console.log('✅ Paciente eliminado exitosamente:', response);
        
        // Remover el paciente de la lista local
        this.pacientes = this.pacientes.filter(p => p.idPaciente !== idPaciente);
        
        // Limpiar la información detallada
        this.informacionDetallada = null;
        this.eliminandoPaciente = false;
        
        // Mostrar mensaje de éxito (puedes agregar un toast o alert aquí)
        // alert('Paciente eliminado exitosamente');
      },
      error: (error) => {
        console.error('❌ Error al eliminar paciente:', error);
        this.eliminandoPaciente = false;
        
        // Mostrar mensaje de error específico
        let mensajeError = 'Error al eliminar el paciente';
        if (error.status === 404) {
          mensajeError = 'Paciente no encontrado';
        } else if (error.status === 409) {
          mensajeError = 'No se puede eliminar: el paciente tiene registros relacionados';
        } else if (error.status === 500) {
          mensajeError = 'Error interno del servidor';
        }
        
        alert(`Error: ${mensajeError}`);
      }
    });
  }

  // Métodos para edición de datos
  iniciarEdicion(): void {
    if (!this.informacionDetallada?.paciente) {
      console.error('❌ No hay paciente para editar');
      return;
    }

    console.log('✏️ Iniciando modo de edición');
    this.modoEdicion = true;
    
    // Crear una copia de los datos del paciente para editar
    this.datosEditados = { ...this.informacionDetallada.paciente };
  }

  cancelarEdicion(): void {
    console.log('❌ Cancelando edición');
    this.modoEdicion = false;
    this.datosEditados = null;
  }

  guardarCambios(): void {
    if (!this.datosEditados || !this.informacionDetallada?.paciente?.idPaciente) {
      console.error('❌ No hay datos para guardar');
      return;
    }

    console.log('💾 Guardando cambios del paciente');
    this.guardandoCambios = true;

    const idPaciente = this.informacionDetallada.paciente.idPaciente;
    const url = `http://localhost:3000/api/pacientes/${idPaciente}`;

    // Preparar datos para enviar (sin el ID)
    const datosParaActualizar = {
      nombre: this.datosEditados.nombre,
      apellidoPaterno: this.datosEditados.apellidoPaterno,
      apellidoMaterno: this.datosEditados.apellidoMaterno,
      rut: this.datosEditados.rut,
      telefono: this.datosEditados.telefono,
      correo: this.datosEditados.correo,
      direccion: this.datosEditados.direccion,
      nacionalidad: this.datosEditados.nacionalidad
    };

    this.http.put(url, datosParaActualizar).subscribe({
      next: (response) => {
        console.log('✅ Paciente actualizado exitosamente:', response);
        
        // Actualizar la información detallada con los nuevos datos
        if (this.informacionDetallada && this.datosEditados) {
          this.informacionDetallada.paciente = { ...this.datosEditados };
        }
        
        // Actualizar también en la lista de pacientes
        const index = this.pacientes.findIndex(p => p.idPaciente === idPaciente);
        if (index !== -1 && this.datosEditados) {
          this.pacientes[index] = { ...this.datosEditados };
        }
        
        // Salir del modo edición
        this.modoEdicion = false;
        this.datosEditados = null;
        this.guardandoCambios = false;
        
        alert('Datos del paciente actualizados exitosamente');
      },
      error: (error) => {
        console.error('❌ Error al actualizar paciente:', error);
        this.guardandoCambios = false;
        
        let mensajeError = 'Error al actualizar los datos del paciente';
        if (error.status === 404) {
          mensajeError = 'Paciente no encontrado';
        } else if (error.status === 409) {
          mensajeError = 'Conflicto: RUT ya existe en otro paciente';
        } else if (error.status === 400) {
          mensajeError = 'Datos inválidos';
        } else if (error.status === 500) {
          mensajeError = 'Error interno del servidor';
        }
        
        alert(`Error: ${mensajeError}`);
      }
    });
  }

  seleccionarEvaluacion(evaluacion: EvaluacionSensorial): void {
    this.evaluacionSeleccionada = evaluacion;
    this.nombrePacienteSeleccionado = evaluacion.nombreCompleto || 'Sin nombre';
    this.fechaSeleccionada = this.formatearFecha(evaluacion.fechaEvaluacion || '');
  }
}
