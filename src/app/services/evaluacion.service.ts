import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Interfaces para las evaluaciones
export interface EvaluacionSensorial {
  idEvaluacion?: number;
  idPaciente: number;
  fechaEvaluacion?: string;
  progreso: number;
  respuestas: any;
  tipoFormulario?: string; // '1-3' o '6-12'
  evaluador?: string; // compatibilidad con formulario 1-3
  evaluadorNombre?: string;
  evaluadorCorreo?: string;
  observaciones?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  estado?: string;
  nombreCompleto?: string;
  rut?: string;
  telefono?: string;
  correo?: string;
}

export interface EvaluacionEstadisticas {
  totalEvaluaciones: number;
  pacientesConEvaluaciones: number;
  progresoPromedio: number;
  evaluacionesCompletadas: number;
  evaluacionesEnProgreso: number;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las evaluaciones
   */
  obtenerEvaluaciones(): Observable<EvaluacionSensorial[]> {
    return this.http.get<EvaluacionSensorial[]>(`${this.apiUrl}/evaluaciones`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtener evaluaciones por paciente
   */
  obtenerEvaluacionesPorPaciente(idPaciente: number): Observable<EvaluacionSensorial[]> {
    return this.http.get<EvaluacionSensorial[]>(`${this.apiUrl}/evaluaciones/paciente/${idPaciente}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtener una evaluación específica
   */
  obtenerEvaluacionPorId(idEvaluacion: number): Observable<EvaluacionSensorial> {
    return this.http.get<EvaluacionSensorial>(`${this.apiUrl}/evaluaciones/${idEvaluacion}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Crear nueva evaluación
   */
  crearEvaluacion(evaluacion: EvaluacionSensorial): Observable<any> {
    const evaluacionData = {
      idPaciente: evaluacion.idPaciente,
      progreso: evaluacion.progreso,
      respuestas: evaluacion.respuestas,
      tipoFormulario: evaluacion.tipoFormulario,
      evaluadorNombre: evaluacion.evaluadorNombre,
      evaluadorCorreo: evaluacion.evaluadorCorreo,
      observaciones: evaluacion.observaciones,
      estado: evaluacion.estado || 'En Progreso'
    };

    return this.http.post<any>(`${this.apiUrl}/evaluaciones`, evaluacionData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Actualizar evaluación existente
   */
  actualizarEvaluacion(idEvaluacion: number, evaluacion: EvaluacionSensorial): Observable<any> {
    const evaluacionData = {
      progreso: evaluacion.progreso,
      respuestas: evaluacion.respuestas,
      tipoFormulario: evaluacion.tipoFormulario,
      evaluadorNombre: evaluacion.evaluadorNombre,
      evaluadorCorreo: evaluacion.evaluadorCorreo,
      observaciones: evaluacion.observaciones,
      estado: evaluacion.estado
    };

    return this.http.put<any>(`${this.apiUrl}/evaluaciones/${idEvaluacion}`, evaluacionData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Eliminar evaluación
   */
  eliminarEvaluacion(idEvaluacion: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/evaluaciones/${idEvaluacion}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtener estadísticas de evaluaciones
   */
  obtenerEstadisticas(): Observable<EvaluacionEstadisticas> {
    return this.http.get<EvaluacionEstadisticas>(`${this.apiUrl}/evaluaciones-stats`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Guardar evaluación en base de datos
   * Método helper que detecta si es crear o actualizar
   */
  guardarEvaluacion(evaluacion: EvaluacionSensorial): Observable<any> {
    if (evaluacion.idEvaluacion) {
      // Actualizar evaluación existente
      return this.actualizarEvaluacion(evaluacion.idEvaluacion, evaluacion);
    } else {
      // Crear nueva evaluación
      return this.crearEvaluacion(evaluacion);
    }
  }

  /**
   * Obtener la última evaluación de un paciente
   */
  obtenerUltimaEvaluacionPaciente(idPaciente: number): Observable<EvaluacionSensorial | null> {
    return this.obtenerEvaluacionesPorPaciente(idPaciente)
      .pipe(
        map(evaluaciones => {
          if (evaluaciones && evaluaciones.length > 0) {
            // Retornar la más reciente (ya están ordenadas por fecha desc)
            return evaluaciones[0];
          }
          return null;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Guardar evaluación completa del formulario 6-12
   */
  guardarEvaluacionFormulario612(datosFormulario: any): Observable<any> {
    // Convertir el formato del formulario al formato esperado por el backend
    const evaluacionData: EvaluacionSensorial = {
      idPaciente: datosFormulario.idPaciente, // Usar el ID real del paciente
      progreso: 100, // Evaluación completa
      respuestas: {
        informacionNino: datosFormulario.informacionNino,
        respuestasParticipacion: datosFormulario.respuestasParticipacion,
        respuestasVision: datosFormulario.respuestasVision,
        respuestasOido: datosFormulario.respuestasOido,
        respuestasTacto: datosFormulario.respuestasTacto,
        respuestasGustoOlfato: datosFormulario.respuestasGustoOlfato,
        respuestasConcienciaCuerpo: datosFormulario.respuestasConcienciaCuerpo,
        respuestasEquilibrioMovimiento: datosFormulario.respuestasEquilibrioMovimiento,
        respuestasPlanificacionIdeas: datosFormulario.respuestasPlanificacionIdeas
      },
      tipoFormulario: '6-12',
      evaluadorNombre: datosFormulario.informacionNino?.evaluador,
      observaciones: datosFormulario.informacionNino?.observaciones,
      estado: 'Completada'
    };

    return this.crearEvaluacion(evaluacionData);
  }

  /**
   * Test de conectividad para evaluaciones
   */
  testConectividadEvaluacion(datos: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/test-evaluacion`, datos)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
      
      if (error.error && error.error.details) {
        errorMessage += `\nDetalles: ${error.error.details}`;
      }
    }
    
    console.error('Error en EvaluacionService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
