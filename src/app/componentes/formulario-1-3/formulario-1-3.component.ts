import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluacionService } from '../../services/evaluacion.service';

@Component({
  selector: 'app-formulario-1-3',
  templateUrl: './formulario-1-3.component.html',
  styleUrls: ['./formulario-1-3.component.css']
})

export class Formulario13Component implements OnInit {
  // Propiedades para progreso y visualización
  answeredQuestions: number = 0;
  totalQuestions: number = 80;
  progressPercentage: number = 0;
  circumference: number = 2 * Math.PI * 34;
  strokeDashoffset: number = 0;
  sectionProgress: any[] = [];

  // Métodos requeridos por el template
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleFloatingProgress(): void {
    // Aquí puedes agregar lógica para mostrar/ocultar el progreso flotante
  }

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  saveEvaluation(): void {
    this.onSubmit();
  }
  @Input() paciente: any;
  formularioParticipacion!: FormGroup;
  loading = false;
  mensaje = '';
  tipoMensaje: 'success' | 'error' | '' = '';

  // Preguntas y opciones para 1-3 años (puedes adaptar los textos)
  preguntasParticipacion = [
    { id: 1, texto: 'Juega con otros niños de manera cooperativa.' },
    { id: 2, texto: 'Se comunica apropiadamente con adultos.' },
    { id: 3, texto: 'Comparte juguetes cuando se le pide.' },
    { id: 4, texto: 'Mantiene contacto visual durante la conversación.' },
    { id: 5, texto: 'Participa en actividades grupales.' }
    // ...agrega más preguntas según tu formulario 1-3
  ];
  preguntasVision = [
    { id: 6, texto: 'Reacciona a la luz brillante.' },
    { id: 7, texto: 'Sigue objetos en movimiento con la vista.' }
    // ...agrega más preguntas
  ];
  preguntasOido = [
    { id: 8, texto: 'Se distrae con sonidos fuertes.' },
    { id: 9, texto: 'Responde a voces familiares.' }
    // ...agrega más preguntas
  ];
  preguntasTacto = [
    { id: 10, texto: 'Reacciona al tacto inesperado.' }
    // ...agrega más preguntas
  ];
  preguntasGustoOlfato = [
    { id: 11, texto: 'Reacciona a sabores nuevos.' }
    // ...agrega más preguntas
  ];
  preguntasConcienciaCuerpo = [
    { id: 12, texto: 'Identifica partes de su cuerpo.' }
    // ...agrega más preguntas
  ];
  preguntasEquilibrioMovimiento = [
    { id: 13, texto: 'Mantiene el equilibrio al caminar.' }
    // ...agrega más preguntas
  ];
  preguntasPlanificacionIdeas = [
    { id: 14, texto: 'Planifica actividades simples.' }
    // ...agrega más preguntas
  ];

  opcionesRespuesta = [
    { valor: 'N', texto: 'Nunca' },
    { valor: 'O', texto: 'Ocasionalmente' },
    { valor: 'F', texto: 'Frecuentemente' },
    { valor: 'S', texto: 'Siempre' }
  ];

  constructor(
    private fb: FormBuilder,
    private evaluacionService: EvaluacionService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const controls: any = {};
    // Información básica
  controls['fechaEvaluacion'] = [new Date().toISOString().split('T')[0]];
  controls['evaluador'] = [''];
    controls['observaciones'] = [''];
    // Preguntas
    [...this.preguntasParticipacion, ...this.preguntasVision, ...this.preguntasOido, ...this.preguntasTacto, ...this.preguntasGustoOlfato, ...this.preguntasConcienciaCuerpo, ...this.preguntasEquilibrioMovimiento, ...this.preguntasPlanificacionIdeas].forEach(pregunta => {
  controls[`pregunta_${pregunta.id}`] = [''];
    });
    this.formularioParticipacion = this.fb.group(controls);
  }

  onSubmit(): void {
    this.loading = true;
    this.mensaje = '';
    this.tipoMensaje = '';
    if (!this.paciente) {
      this.mensaje = 'Error: No hay paciente seleccionado.';
      this.tipoMensaje = 'error';
      this.loading = false;
      return;
    }
    // Calcular progreso
    const totalPreguntas = [...this.preguntasParticipacion, ...this.preguntasVision, ...this.preguntasOido, ...this.preguntasTacto, ...this.preguntasGustoOlfato, ...this.preguntasConcienciaCuerpo, ...this.preguntasEquilibrioMovimiento, ...this.preguntasPlanificacionIdeas].length;
    const respondidas = totalPreguntas - Object.values(this.formularioParticipacion.value).filter(v => v === '').length;
    const progreso = totalPreguntas > 0 ? Math.round((respondidas / totalPreguntas) * 100) : 0;
    // Preparar datos para enviar
    const datosEvaluacion = {
      idPaciente: this.paciente.idPaciente || this.paciente.id || this.paciente.rut,
      fechaEvaluacion: this.formularioParticipacion.value.fechaEvaluacion,
      evaluador: this.formularioParticipacion.value.evaluador,
      observaciones: this.formularioParticipacion.value.observaciones,
      progreso: progreso,
      tipoFormulario: '1-3',
      respuestas: [...this.preguntasParticipacion, ...this.preguntasVision, ...this.preguntasOido, ...this.preguntasTacto, ...this.preguntasGustoOlfato, ...this.preguntasConcienciaCuerpo, ...this.preguntasEquilibrioMovimiento, ...this.preguntasPlanificacionIdeas].map(pregunta => ({
        preguntaId: pregunta.id,
        preguntaTexto: pregunta.texto,
        respuesta: this.formularioParticipacion.value[`pregunta_${pregunta.id}`] || 'Sin respuesta'
      }))
    };
    this.evaluacionService.guardarEvaluacion(datosEvaluacion).subscribe({
      next: (response) => {
        this.mensaje = `Evaluación guardada correctamente.`;
        this.tipoMensaje = 'success';
        this.loading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        this.mensaje = `Error al guardar la evaluación: ${error.error?.message || error.message || 'Error desconocido'}`;
        this.tipoMensaje = 'error';
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.formularioParticipacion.controls).forEach(key => {
      const control = this.formularioParticipacion.get(key);
      control?.markAsTouched();
    });
  }

  resetForm(): void {
    this.formularioParticipacion.reset();
    this.formularioParticipacion.patchValue({
      fechaEvaluacion: new Date().toISOString().split('T')[0]
    });
    this.mensaje = '';
    this.tipoMensaje = '';
  }

  getErrorMessage(fieldName: string): string {
    const control = this.formularioParticipacion.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Este campo es obligatorio';
      }
    }
    return '';
  }
}
