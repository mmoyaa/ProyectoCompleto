import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../services/paciente.service';
import { EvaluacionService, EvaluacionSensorial } from '../../services/evaluacion.service';
import { DocumentoService, DocumentoCCMM } from '../../services/documento.service';

interface PacienteCompleto {
  idPaciente?: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  rut: string;
  telefono?: string;
  correo?: string;
  nombreCompleto?: string;
}

@Component({
  selector: 'app-resumen-pago',
  templateUrl: './resumen-pago.component.html',
  styleUrls: ['./resumen-pago.component.css']
})
export class ResumenPagoComponent implements OnInit {
  tipoSeleccionado = '';
  
  // Datos para las tablas
  pacientes: PacienteCompleto[] = [];
  evaluaciones: EvaluacionSensorial[] = [];
  documentos: DocumentoCCMM[] = [];
  
  // Estados de carga
  cargandoPacientes = false;
  cargandoEvaluaciones = false;
  cargandoDocumentos = false;
  
  // Estados de error
  errorPacientes = '';
  errorEvaluaciones = '';
  errorDocumentos = '';

  // Datos de selección para UTM (Proporcional UTM)
  pacienteSeleccionado: PacienteCompleto | null = null;
  nombreSeleccionado = '';
  telefonoSeleccionado = '';

  // Datos de selección para IPC
  evaluacionSeleccionada: EvaluacionSensorial | null = null;
  nombrePacienteSeleccionado = '';
  fechaSeleccionada = '';

  constructor(
    private pacienteService: PacienteService,
    private evaluacionService: EvaluacionService,
    private documentoService: DocumentoService
  ) { }

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
      case 'capuerto':
        this.cargarDocumentos();
        break;
      case 'arancel':
        // Por ahora no tiene funcionalidad específica
        break;
    }
  }

  private limpiarDatos(): void {
    this.pacientes = [];
    this.evaluaciones = [];
    this.documentos = [];
    this.errorPacientes = '';
    this.errorEvaluaciones = '';
    this.errorDocumentos = '';
    // Limpiar selecciones
    this.limpiarSelecciones();
  }

  private limpiarSelecciones(): void {
    this.pacienteSeleccionado = null;
    this.nombreSeleccionado = '';
    this.telefonoSeleccionado = '';
    this.evaluacionSeleccionada = null;
    this.nombrePacienteSeleccionado = '';
    this.fechaSeleccionada = '';
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

  private cargarDocumentos(): void {
    this.cargandoDocumentos = true;
    this.errorDocumentos = '';
    
    this.documentoService.obtenerDocumentos().subscribe({
      next: (data) => {
        this.documentos = data || [];
        this.cargandoDocumentos = false;
      },
      error: (error) => {
        console.error('Error al cargar documentos:', error);
        this.errorDocumentos = 'Error al cargar la información de documentos';
        this.cargandoDocumentos = false;
      }
    });
  }

  // Métodos utilitarios para las vistas
  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CL');
  }

  obtenerNombreCompleto(item: PacienteCompleto | any): string {
    if (item.nombreCompleto) return item.nombreCompleto;
    if (item.nombre && item.apellidoPaterno) {
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

  seleccionarEvaluacion(evaluacion: EvaluacionSensorial): void {
    this.evaluacionSeleccionada = evaluacion;
    this.nombrePacienteSeleccionado = evaluacion.nombreCompleto || 'Sin nombre';
    this.fechaSeleccionada = this.formatearFecha(evaluacion.fechaEvaluacion || '');
  }

  descargarDocumento(idDocumento: number): void {
    if (!idDocumento) return;
    
    this.documentoService.descargarDocumento(idDocumento).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `documento_${idDocumento}`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al descargar documento:', error);
        alert('Error al descargar el documento');
      }
    });
  }
}
