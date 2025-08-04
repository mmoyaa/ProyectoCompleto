import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paciente {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  rut: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  nacionalidad?: string;
}

export interface PacienteResponse {
  message: string;
  idPaciente: number;
}

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Crear paciente adulto (sin tutor)
  crearPaciente(paciente: Paciente): Observable<PacienteResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<PacienteResponse>(`${this.apiUrl}/pacientes`, paciente, { headers });
  }

  // Crear paciente simple (solo nombre y apellido) - para testing
  crearPacienteSimple(datos: { nombre: string; apellido: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<any>(`${this.apiUrl}/pacientes/simple`, datos, { headers });
  }

  // Obtener todos los pacientes (si existe el endpoint GET)
  obtenerPacientes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pacientes`);
  }

  // Test de conectividad
  testConectividad(datos: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<any>(`${this.apiUrl}/pacientes/test`, datos, { headers });
  }
}
