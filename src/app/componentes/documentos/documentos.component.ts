import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentoService, TipoDocumento, FormatoDocumento, DocumentoCCMM } from '../../services/documento.service';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {
  formularioDocumento!: FormGroup;
  tiposDocumento: TipoDocumento[] = [];
  formatosDocumento: FormatoDocumento[] = [];
  documentos: DocumentoCCMM[] = [];
  
  archivoSeleccionado: File | null = null;
  previsualizacion: string | null = null;
  
  // Variables para vista previa de documentos
  documentoVistaPrevia: DocumentoCCMM | null = null;
  urlVistaPrevia: SafeResourceUrl | string | null = null;
  cargandoVistaPrevia = false;
  errorVistaPrevia: string | null = null;
  
  loading = false;
  loadingTipos = false;
  loadingFormatos = false;
  loadingDocumentos = false;
  
  mensaje = '';
  tipoMensaje: 'success' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    public documentoService: DocumentoService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.cargarTiposDocumento();
    this.cargarFormatos();
    this.cargarDocumentos();
  }

  private initializeForm(): void {
    this.formularioDocumento = this.fb.group({
      tipoDocumento: ['', Validators.required],
      formato: ['', Validators.required],
      nombreArchivo: ['', Validators.required]
    });
  }

  cargarTiposDocumento(): void {
    this.loadingTipos = true;
    this.documentoService.obtenerTiposDocumento().subscribe({
      next: (tipos) => {
        this.tiposDocumento = tipos;
        this.loadingTipos = false;
        console.log('✅ Tipos de documento cargados:', tipos);
      },
      error: (error) => {
        console.error('❌ Error al cargar tipos de documento:', error);
        this.tiposDocumento = [
          { idTipo: 1, nombre: 'Fotos', descripcion: 'Fotografías' },
          { idTipo: 2, nombre: 'Documentos', descripcion: 'Documentos generales' },
          { idTipo: 3, nombre: 'Decretos', descripcion: 'Decretos oficiales' },
          { idTipo: 4, nombre: 'Resolución', descripcion: 'Resoluciones' }
        ];
        this.loadingTipos = false;
      }
    });
  }

  cargarFormatos(): void {
    this.loadingFormatos = true;
    this.documentoService.obtenerFormatos().subscribe({
      next: (formatos) => {
        this.formatosDocumento = formatos;
        this.loadingFormatos = false;
        console.log('✅ Formatos cargados:', formatos);
      },
      error: (error) => {
        console.error('❌ Error al cargar formatos:', error);
        this.formatosDocumento = [
          { idFormato: 1, nombre: 'JPEG', extension: 'jpg' },
          { idFormato: 2, nombre: 'PDF', extension: 'pdf' },
          { idFormato: 3, nombre: 'JPEG', extension: 'jpeg' }
        ];
        this.loadingFormatos = false;
      }
    });
  }

  cargarDocumentos(): void {
    this.loadingDocumentos = true;
    this.documentoService.obtenerDocumentos().subscribe({
      next: (documentos) => {
        this.documentos = documentos;
        this.loadingDocumentos = false;
        console.log('✅ Documentos cargados:', documentos);
      },
      error: (error) => {
        console.error('❌ Error al cargar documentos:', error);
        this.documentos = [];
        this.loadingDocumentos = false;
      }
    });
  }

  onArchivoSeleccionado(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      // Validar formato si hay formatos seleccionados
      const formatoSeleccionado = this.formularioDocumento.get('formato')?.value;
      if (formatoSeleccionado) {
        const formato = this.formatosDocumento.find(f => f.idFormato == formatoSeleccionado);
        if (formato && !this.documentoService.validarFormato(archivo, [formato])) {
          this.mostrarMensaje(`El archivo debe ser de formato ${formato.extension.toUpperCase()}`, 'error');
          event.target.value = '';
          return;
        }
      }

      this.archivoSeleccionado = archivo;
      
      // Autocompletar nombre del archivo si está vacío
      if (!this.formularioDocumento.get('nombreArchivo')?.value) {
        this.formularioDocumento.patchValue({
          nombreArchivo: archivo.name.split('.')[0]
        });
      }

      // Crear previsualización para imágenes
      if (archivo.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previsualizacion = e.target?.result as string;
        };
        reader.readAsDataURL(archivo);
      } else {
        this.previsualizacion = null;
      }

      console.log('📁 Archivo seleccionado:', {
        nombre: archivo.name,
        tamaño: this.documentoService.formatearTamano(archivo.size),
        tipo: archivo.type
      });
    }
  }

  onFormatoChange(): void {
    // Si hay un archivo seleccionado, validar que coincida con el formato
    if (this.archivoSeleccionado) {
      const formatoSeleccionado = this.formularioDocumento.get('formato')?.value;
      if (formatoSeleccionado) {
        const formato = this.formatosDocumento.find(f => f.idFormato == formatoSeleccionado);
        if (formato && !this.documentoService.validarFormato(this.archivoSeleccionado, [formato])) {
          this.mostrarMensaje(`El archivo seleccionado no coincide con el formato ${formato.extension.toUpperCase()}`, 'error');
          this.limpiarArchivo();
        }
      }
    }
  }

  subirDocumento(): void {
    if (this.formularioDocumento.valid && this.archivoSeleccionado) {
      this.loading = true;
      this.mensaje = '';

      const documento: DocumentoCCMM = {
        nombreArchivo: this.formularioDocumento.get('nombreArchivo')?.value,
        archivo: '', // Se enviará como FormData
        idTipo: parseInt(this.formularioDocumento.get('tipoDocumento')?.value),
        idFormato: parseInt(this.formularioDocumento.get('formato')?.value)
      };

      this.documentoService.subirDocumento(documento, this.archivoSeleccionado).subscribe({
        next: (response) => {
          this.mostrarMensaje(`Documento "${response.nombreArchivo}" subido correctamente`, 'success');
          this.loading = false;
          this.limpiarFormulario();
          this.cargarDocumentos(); // Recargar la lista
        },
        error: (error) => {
          console.error('❌ Error al subir documento:', error);
          this.mostrarMensaje('Error al subir el documento: ' + (error.error?.message || error.message), 'error');
          this.loading = false;
        }
      });
    } else {
      this.mostrarMensaje('Por favor, complete todos los campos y seleccione un archivo', 'error');
    }
  }

  descargarDocumento(documento: DocumentoCCMM): void {
    if (documento.idDocumento) {
      this.documentoService.descargarDocumento(documento.idDocumento).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = documento.nombreArchivo;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('❌ Error al descargar documento:', error);
          this.mostrarMensaje('Error al descargar el documento', 'error');
        }
      });
    }
  }

  eliminarDocumento(documento: DocumentoCCMM): void {
    if (documento.idDocumento && confirm(`¿Está seguro de eliminar el documento "${documento.nombreArchivo}"?`)) {
      this.documentoService.eliminarDocumento(documento.idDocumento).subscribe({
        next: () => {
          this.mostrarMensaje('Documento eliminado correctamente', 'success');
          this.cargarDocumentos();
        },
        error: (error) => {
          console.error('❌ Error al eliminar documento:', error);
          this.mostrarMensaje('Error al eliminar el documento', 'error');
        }
      });
    }
  }

  private limpiarFormulario(): void {
    this.formularioDocumento.reset();
    this.limpiarArchivo();
  }

  public limpiarFormularioPublico(): void {
    this.limpiarFormulario();
  }

  private limpiarArchivo(): void {
    this.archivoSeleccionado = null;
    this.previsualizacion = null;
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.mensaje = mensaje;
    this.tipoMensaje = tipo;
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      this.mensaje = '';
      this.tipoMensaje = '';
    }, 5000);
  }

  getTipoDocumentoNombre(idTipo: number): string {
    const tipo = this.tiposDocumento.find(t => t.idTipo === idTipo);
    return tipo ? tipo.nombre : 'Desconocido';
  }

  getFormatoNombre(idFormato: number): string {
    const formato = this.formatosDocumento.find(f => f.idFormato === idFormato);
    return formato ? formato.extension.toUpperCase() : 'Desconocido';
  }

  // ==================== MÉTODOS PARA VISTA PREVIA ====================

  previsualizarDocumento(documento: DocumentoCCMM): void {
    if (!documento.idDocumento) {
      this.mostrarMensaje('No se puede previsualizar este documento', 'error');
      return;
    }

    this.documentoVistaPrevia = documento;
    this.cargandoVistaPrevia = true;
    this.errorVistaPrevia = null;
    this.urlVistaPrevia = null;

    // Obtener documento completo con el archivo base64
    this.documentoService.obtenerDocumentoPorId(documento.idDocumento).subscribe({
      next: (documentoCompleto) => {
        this.procesarVistaPrevia(documentoCompleto);
        this.abrirModalVistaPrevia();
      },
      error: (error) => {
        console.error('❌ Error al obtener documento para vista previa:', error);
        this.errorVistaPrevia = 'Error al cargar el documento: ' + (error.error?.message || error.message);
        this.cargandoVistaPrevia = false;
        this.abrirModalVistaPrevia();
      }
    });
  }

  private procesarVistaPrevia(documento: any): void {
    try {
      if (!documento.archivo) {
        this.errorVistaPrevia = 'El documento no contiene datos del archivo';
        this.cargandoVistaPrevia = false;
        return;
      }

      const formato = this.formatosDocumento.find(f => f.idFormato === documento.idFormato);
      if (!formato) {
        this.errorVistaPrevia = 'Formato de documento no reconocido';
        this.cargandoVistaPrevia = false;
        return;
      }

      // Crear blob desde base64
      const binaryData = atob(documento.archivo);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }

      const blob = new Blob([arrayBuffer], { type: formato.mimeType });
      const url = URL.createObjectURL(blob);

      if (this.esPdf(documento)) {
        // Para PDFs, usar el sanitizer para iframe
        this.urlVistaPrevia = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      } else if (this.esImagen(documento)) {
        // Para imágenes, usar directamente la URL
        this.urlVistaPrevia = url;
      }

      this.cargandoVistaPrevia = false;
    } catch (error) {
      console.error('❌ Error al procesar vista previa:', error);
      this.errorVistaPrevia = 'Error al procesar el archivo para vista previa';
      this.cargandoVistaPrevia = false;
    }
  }

  esImagen(documento: DocumentoCCMM): boolean {
    const formato = this.formatosDocumento.find(f => f.idFormato === documento.idFormato);
    if (!formato) return false;
    
    const extensionesImagen = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    return extensionesImagen.includes(formato.extension.toLowerCase());
  }

  esPdf(documento: DocumentoCCMM): boolean {
    const formato = this.formatosDocumento.find(f => f.idFormato === documento.idFormato);
    if (!formato) return false;
    
    return formato.extension.toLowerCase() === 'pdf';
  }

  private abrirModalVistaPrevia(): void {
    const modalElement = document.getElementById('modalVistaPrevia');
    if (modalElement) {
      // Usar Bootstrap modal sin importar bootstrap
      const modal = (window as any).bootstrap?.Modal?.getOrCreateInstance(modalElement) || 
                   new (window as any).bootstrap.Modal(modalElement);
      modal.show();
      
      // Limpiar URL cuando se cierre el modal
      modalElement.addEventListener('hidden.bs.modal', () => {
        if (this.urlVistaPrevia && typeof this.urlVistaPrevia === 'string') {
          URL.revokeObjectURL(this.urlVistaPrevia);
        }
        this.documentoVistaPrevia = null;
        this.urlVistaPrevia = null;
        this.errorVistaPrevia = null;
      }, { once: true });
    }
  }

  reintentar(): void {
    if (this.documentoVistaPrevia) {
      this.previsualizarDocumento(this.documentoVistaPrevia);
    }
  }

  // Método seguro para formatear tamaño
  formatearTamanoSeguro(tamano: number | undefined): string {
    if (tamano && tamano > 0) {
      return this.documentoService.formatearTamano(tamano);
    }
    return 'N/A';
  }
}
