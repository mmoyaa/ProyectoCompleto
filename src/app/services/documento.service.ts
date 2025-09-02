import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TipoDocumento {
  idTipo: number;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface FormatoDocumento {
  idFormato: number;
  nombre: string;
  extension: string;
  activo?: boolean;
}

export interface DocumentoCCMM {
  idDocumento?: number;
  nombreArchivo: string;
  archivo: string; // Base64 o ruta del archivo
  idTipo: number;
  idFormato: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  tamano?: number;
  activo?: boolean;
}

export interface DocumentoResponse {
  message: string;
  idDocumento: number;
  nombreArchivo: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Obtener tipos de documento
  obtenerTiposDocumento(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(`${this.apiUrl}/tipos-documento`);
  }

  // Obtener formatos de documento
  obtenerFormatos(): Observable<FormatoDocumento[]> {
    return this.http.get<FormatoDocumento[]>(`${this.apiUrl}/formatos-documento`);
  }

  // Subir documento
  subirDocumento(documento: DocumentoCCMM, archivo: File): Observable<DocumentoResponse> {
    const formData = new FormData();
    
    // Agregar el archivo
    formData.append('archivo', archivo);
    
    // Agregar los datos del documento
    formData.append('nombreArchivo', documento.nombreArchivo);
    formData.append('idTipo', documento.idTipo.toString());
    formData.append('idFormato', documento.idFormato.toString());
    
    return this.http.post<DocumentoResponse>(`${this.apiUrl}/documentos`, formData);
  }

  // Obtener todos los documentos
  obtenerDocumentos(): Observable<DocumentoCCMM[]> {
    return this.http.get<DocumentoCCMM[]>(`${this.apiUrl}/documentos`);
  }

  // Obtener documento por ID
  obtenerDocumentoPorId(idDocumento: number): Observable<DocumentoCCMM> {
    return this.http.get<DocumentoCCMM>(`${this.apiUrl}/documentos/${idDocumento}`);
  }

  // Descargar documento
  descargarDocumento(idDocumento: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/documentos/${idDocumento}/download`, {
      responseType: 'blob'
    });
  }

  // Eliminar documento
  eliminarDocumento(idDocumento: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/documentos/${idDocumento}`);
  }

  // Validar formato de archivo
  validarFormato(archivo: File, formatosPermitidos: FormatoDocumento[]): boolean {
    const extension = archivo.name.split('.').pop()?.toLowerCase();
    return formatosPermitidos.some(formato => 
      formato.extension.toLowerCase() === extension
    );
  }

  // Obtener tamaño del archivo en formato legible
  formatearTamano(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
