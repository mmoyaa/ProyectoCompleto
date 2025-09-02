import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EvaluacionService, EvaluacionSensorial, EvaluacionEstadisticas } from '../../services/evaluacion.service';

@Component({
  selector: 'app-lista-evaluaciones',
  templateUrl: './lista-evaluaciones.component.html',
  styleUrls: ['./lista-evaluaciones.component.css']
})
export class ListaEvaluacionesComponent implements OnInit {
  evaluaciones: EvaluacionSensorial[] = [];
  estadisticas: EvaluacionEstadisticas | null = null;
  loading = false;
  error = '';
  evaluacionSeleccionada: EvaluacionSensorial | null = null;

  constructor(
    private evaluacionService: EvaluacionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarEvaluaciones();
    this.cargarEstadisticas();
  }

  cargarEvaluaciones(): void {
    this.loading = true;
    this.error = '';
    
    this.evaluacionService.obtenerEvaluaciones().subscribe({
      next: (evaluaciones) => {
        this.evaluaciones = evaluaciones;
        this.loading = false;
        console.log('Evaluaciones cargadas:', evaluaciones);
      },
      error: (error) => {
        this.error = `Error al cargar evaluaciones: ${error.message}`;
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  cargarEstadisticas(): void {
    this.evaluacionService.obtenerEstadisticas().subscribe({
      next: (stats) => {
        this.estadisticas = stats;
        console.log('Estadísticas cargadas:', stats);
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });
  }

  verDetalle(evaluacion: EvaluacionSensorial): void {
    this.evaluacionSeleccionada = evaluacion;
  }

  editarEvaluacion(evaluacion: EvaluacionSensorial): void {
    // Determinar qué formulario usar según el tipoFormulario
    let rutaFormulario = '/pagina2'; // Por defecto 6-12 años (pagina2)
    
    if (evaluacion.tipoFormulario === '1-3') {
      // Para evaluaciones de 1-3 años, usar all-formularios con parámetros específicos
      this.router.navigate(['/all-formularios'], { 
        queryParams: { 
          pacienteId: evaluacion.rut || evaluacion.idPaciente,
          evaluacionId: evaluacion.idEvaluacion,
          tipoFormulario: '1-3'
        } 
      });
      return;
    } else if (evaluacion.tipoFormulario === '6-12') {
      // Para evaluaciones de 6-12 años, usar all-formularios también
      this.router.navigate(['/all-formularios'], { 
        queryParams: { 
          pacienteId: evaluacion.rut || evaluacion.idPaciente,
          evaluacionId: evaluacion.idEvaluacion,
          tipoFormulario: '6-12'
        } 
      });
      return;
    } else {
      // Si no se especifica el tipo, intentar determinar por el número de respuestas o estructura
      console.log('Tipo de formulario no especificado, determinando automáticamente...');
      
      // Si tiene respuestas en formato de pagina5 (1-3 años), usar all-formularios
      if (this.esFormulario13Anos(evaluacion)) {
        this.router.navigate(['/all-formularios'], { 
          queryParams: { 
            pacienteId: evaluacion.rut || evaluacion.idPaciente,
            evaluacionId: evaluacion.idEvaluacion,
            tipoFormulario: '1-3'
          } 
        });
        return;
      }
    }
    
    // Navegar al formulario de evaluación correspondiente
    this.router.navigate([rutaFormulario], { 
      queryParams: { 
        pacienteId: evaluacion.rut || evaluacion.idPaciente,
        evaluacionId: evaluacion.idEvaluacion 
      } 
    });
  }

  // Método auxiliar para determinar si es formulario de 1-3 años
  private esFormulario13Anos(evaluacion: EvaluacionSensorial): boolean {
    try {
      const respuestas = typeof evaluacion.respuestas === 'string' 
        ? JSON.parse(evaluacion.respuestas) 
        : evaluacion.respuestas;
      
      // Si las respuestas son un array (formato de pagina5), es 1-3 años
      if (Array.isArray(respuestas)) {
        return true;
      }
      
      // Si tiene la estructura de informacionNino, es 6-12 años
      if (respuestas && respuestas.informacionNino) {
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('Error al determinar tipo de formulario:', error);
      return false;
    }
  }

  eliminarEvaluacion(evaluacion: EvaluacionSensorial): void {
    const confirmacion = confirm(
      `¿Estás seguro de que deseas eliminar la evaluación de ${evaluacion.nombreCompleto}?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmacion && evaluacion.idEvaluacion) {
      this.evaluacionService.eliminarEvaluacion(evaluacion.idEvaluacion).subscribe({
        next: () => {
          alert('Evaluación eliminada exitosamente');
          this.cargarEvaluaciones();
          this.cargarEstadisticas();
        },
        error: (error) => {
          alert(`Error al eliminar evaluación: ${error.message}`);
        }
      });
    }
  }

  nuevaEvaluacion(): void {
    this.router.navigate(['/pagina2']);
  }

  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return 'N/A';
    
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  }

  obtenerColorProgreso(progreso: number): string {
    if (progreso >= 100) return '#22c55e'; // Verde
    if (progreso >= 75) return '#f59e0b';  // Amarillo
    if (progreso >= 50) return '#ef4444';  // Naranja
    return '#6b7280'; // Gris
  }

  obtenerClaseEstado(estado: string | undefined): string {
    if (!estado) return 'estado-sin-estado';
    return 'estado-' + estado.toLowerCase().replace(' ', '-');
  }

  obtenerIconoEstado(estado: string | undefined): string {
    switch (estado) {
      case 'Completada': return '✅';
      case 'En Progreso': return '🔄';
      default: return '📝';
    }
  }

  obtenerIniciales(nombreCompleto: string | undefined): string {
    if (!nombreCompleto) return '??';
    
    const palabras = nombreCompleto.trim().split(' ').filter(palabra => palabra.length > 0);
    
    if (palabras.length === 0) return '??';
    if (palabras.length === 1) return palabras[0].charAt(0).toUpperCase();
    
    // Tomar la primera letra de la primera palabra y la primera letra de la segunda palabra
    const primera = palabras[0].charAt(0).toUpperCase();
    const segunda = palabras[1].charAt(0).toUpperCase();
    
    return primera + segunda;
  }
}
