import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { EvaluacionService, EvaluacionSensorial } from '../../services/evaluacion.service';

@Component({
  selector: 'app-pagina2',
  templateUrl: './pagina2.component.html',
  styleUrls: ['./pagina2.component.css']
})
export class Pagina2Component implements OnInit {

  totalQuestions = 80;
  answeredQuestions = 0;
  progressPercentage = 0;
  circumference = 2 * Math.PI * 34; // radio = 34
  strokeDashoffset = this.circumference;
  showFloatingProgress = true;

  // Datos del paciente y evaluación
  selectedPatient: any = null;
  patients: any[] = [];
  evaluationData: any = {};
  patientIdFromRoute: string | null = null;

  sectionProgress = [
    { id: 'seccion-vision', name: 'Visión', color: '#ec4899', answered: 0, total: 10, completed: false },
    { id: 'seccion-auditivo', name: 'Auditivo', color: '#667eea', answered: 0, total: 10, completed: false },
    { id: 'seccion-tactil', name: 'Táctil', color: '#f59e0b', answered: 0, total: 10, completed: false },
    { id: 'seccion-gusto-olfato', name: 'Gusto/Olfato', color: '#10b981', answered: 0, total: 10, completed: false },
    { id: 'seccion-conciencia-corporal', name: 'Conciencia', color: '#ef4444', answered: 0, total: 10, completed: false },
    { id: 'seccion-equilibrio-movimiento', name: 'Equilibrio', color: '#8b5cf6', answered: 0, total: 10, completed: false },
    { id: 'seccion-planificacion-ideas', name: 'Planificación', color: '#f97316', answered: 0, total: 10, completed: false },
    { id: 'seccion-participacion-social', name: 'Participación', color: '#06b6d4', answered: 0, total: 10, completed: false }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private evaluacionService: EvaluacionService
  ) {}

  ngOnInit() {
    this.loadPatients();
    this.checkForPatientId();
    this.setupProgressTracking();
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  }

  toggleFloatingProgress(): void {
    this.showFloatingProgress = !this.showFloatingProgress;
    const floatingElement = document.querySelector('.floating-progress') as HTMLElement;
    if (floatingElement) {
      floatingElement.classList.toggle('hidden');
    }
  }

  // Métodos para manejo de pacientes
  private loadPatients(): void {
    this.pacienteService.obtenerPacientesCompletos().subscribe({
      next: (patients: any) => {
        this.patients = patients;
      },
      error: (error: any) => {
        console.error('Error cargando pacientes:', error);
        // Cargar pacientes desde localStorage como fallback
        this.loadPatientsFromStorage();
      }
    });
  }

  private loadPatientsFromStorage(): void {
    const storedPatients = localStorage.getItem('pacientes');
    if (storedPatients) {
      this.patients = JSON.parse(storedPatients);
    }
  }

  private checkForPatientId(): void {
    this.route.queryParams.subscribe(params => {
      this.patientIdFromRoute = params['pacienteId'];
      if (this.patientIdFromRoute) {
        this.selectPatientById(this.patientIdFromRoute);
      }
    });
  }

  private selectPatientById(patientId: string): void {
    const patient = this.patients.find(p => p.id === patientId);
    if (patient) {
      this.selectedPatient = patient;
    }
  }

  onPatientSelect(event: any): void {
    const patientId = event.target.value;
    this.selectedPatient = this.patients.find(p => p.id === patientId);
  }

  saveEvaluation(): void {
    if (!this.selectedPatient) {
      alert('Por favor, selecciona un paciente antes de guardar la evaluación.');
      return;
    }

    if (this.answeredQuestions === 0) {
      alert('Por favor, responde al menos una pregunta antes de guardar.');
      return;
    }

    // Recopilar todas las respuestas
    const responses = this.collectResponses();
    const progreso = this.totalQuestions > 0 ? Math.round((this.answeredQuestions / this.totalQuestions) * 100) : 0;
    
    // Determinar el estado de la evaluación
    const estado = progreso === 100 ? 'Completada' : 'En Progreso';
    
    const evaluacionData: EvaluacionSensorial = {
      idPaciente: parseInt(this.selectedPatient.idPaciente || this.selectedPatient.id),
      progreso: progreso,
      respuestas: responses,
      evaluadorNombre: '', // Podrías agregar un campo para esto
      evaluadorCorreo: '', // Podrías agregar un campo para esto
      observaciones: '', // Podrías agregar un campo para esto
      estado: estado
    };

    // Guardar en base de datos
    console.log('Guardando evaluación en base de datos...', evaluacionData);
    
    this.evaluacionService.guardarEvaluacion(evaluacionData).subscribe({
      next: (response) => {
        console.log('Evaluación guardada exitosamente:', response);
        alert(`✅ Evaluación guardada exitosamente en la base de datos para ${this.selectedPatient.nombre}\nProgreso: ${progreso}%\nEstado: ${estado}`);
        
        // También mantener copia en localStorage como respaldo
        this.saveEvaluationToStorage({
          pacienteId: this.selectedPatient.id,
          pacienteNombre: this.selectedPatient.nombre,
          fechaEvaluacion: new Date().toISOString(),
          preguntasRespondidas: this.answeredQuestions,
          porcentajeCompletado: progreso,
          respuestas: responses,
          seccionesCompletadas: this.sectionProgress.filter(s => s.completed).length,
          estado: estado
        });
      },
      error: (error) => {
        console.error('Error al guardar evaluación:', error);
        alert(`❌ Error al guardar la evaluación en la base de datos.\n\nDetalles: ${error.message}\n\nLa evaluación se guardará localmente como respaldo.`);
        
        // En caso de error, guardar solo localmente
        this.saveEvaluationToStorage({
          pacienteId: this.selectedPatient.id,
          pacienteNombre: this.selectedPatient.nombre,
          fechaEvaluacion: new Date().toISOString(),
          preguntasRespondidas: this.answeredQuestions,
          porcentajeCompletado: progreso,
          respuestas: responses,
          seccionesCompletadas: this.sectionProgress.filter(s => s.completed).length,
          estado: estado,
          guardadoLocal: true
        });
      }
    });
  }

  private collectResponses(): any {
    const responses: any = {};
    
    for (let i = 1; i <= this.totalQuestions; i++) {
      const radioButtons = document.querySelectorAll(`input[name="pregunta${i}"]`);
      const selectedRadio = Array.from(radioButtons).find((radio: any) => radio.checked) as any;
      
      if (selectedRadio) {
        responses[`pregunta${i}`] = selectedRadio.value;
      }
    }
    
    return responses;
  }

  private saveEvaluationToStorage(evaluationData: any): void {
    const existingEvaluations = JSON.parse(localStorage.getItem('evaluaciones') || '[]');
    
    // Verificar si ya existe una evaluación para este paciente
    const existingIndex = existingEvaluations.findIndex((evaluation: any) => evaluation.pacienteId === evaluationData.pacienteId);
    
    if (existingIndex >= 0) {
      // Actualizar evaluación existente
      existingEvaluations[existingIndex] = evaluationData;
    } else {
      // Agregar nueva evaluación
      existingEvaluations.push(evaluationData);
    }
    
    localStorage.setItem('evaluaciones', JSON.stringify(existingEvaluations));
  }

  private setupProgressTracking(): void {
    // Configurar después de un pequeño delay para asegurar que el DOM esté cargado
    setTimeout(() => {
      this.updateProgress();
      this.attachRadioListeners();
    }, 100);
  }

  private attachRadioListeners(): void {
    // Obtener todos los radio buttons del formulario
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    
    radioButtons.forEach(radio => {
      radio.addEventListener('change', () => {
        this.updateProgress();
      });
    });
  }

  private updateProgress(): void {
    // Obtener todas las preguntas (grupos de radio buttons)
    const questions = document.querySelectorAll('.question-item');
    let answered = 0;

    questions.forEach(question => {
      const radioButtons = question.querySelectorAll('input[type="radio"]');
      const isAnswered = Array.from(radioButtons).some((radio: any) => radio.checked);
      
      if (isAnswered) {
        answered++;
      }
    });

    this.answeredQuestions = answered;
    this.progressPercentage = Math.round((this.answeredQuestions / this.totalQuestions) * 100);
    
    // Actualizar progreso circular
    this.updateCircularProgress();

    // Actualizar progreso por secciones
    this.updateSectionProgress();

    // Actualizar el DOM del progreso principal
    this.updateProgressUI();
  }

  private updateCircularProgress(): void {
    const progress = this.progressPercentage / 100;
    this.strokeDashoffset = this.circumference - progress * this.circumference;
  }

  private updateSectionProgress(): void {
    this.sectionProgress.forEach((section, index) => {
      const startQuestion = (index * 10) + 1;
      const endQuestion = startQuestion + 9;
      const answered = this.getSectionAnsweredQuestions(startQuestion, endQuestion);
      
      section.answered = answered;
      section.completed = answered === section.total;
    });
  }

  private updateProgressUI(): void {
    // Actualizar el texto del progreso
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
      progressText.textContent = `${this.answeredQuestions}/${this.totalQuestions} preguntas completadas`;
    }

    // Actualizar la barra de progreso
    const progressFill = document.querySelector('.progress-fill') as HTMLElement;
    if (progressFill) {
      progressFill.style.width = `${this.progressPercentage}%`;
    }

    // Actualizar indicadores de sección
    this.updateSectionIndicators();
  }

  private updateSectionIndicators(): void {
    const sections = [
      { name: 'vision', start: 1, end: 10 },
      { name: 'auditory', start: 11, end: 20 },
      { name: 'tactile', start: 21, end: 30 },
      { name: 'taste-smell', start: 31, end: 40 },
      { name: 'body-awareness', start: 41, end: 50 },
      { name: 'balance-movement', start: 51, end: 60 },
      { name: 'planning-ideas', start: 61, end: 70 },
      { name: 'social-participation', start: 71, end: 80 }
    ];

    sections.forEach(section => {
      const sectionElement = document.querySelector(`.section-indicator.${section.name}`);
      if (sectionElement) {
        const sectionQuestions = this.getSectionAnsweredQuestions(section.start, section.end);
        const totalSectionQuestions = section.end - section.start + 1;
        
        if (sectionQuestions === totalSectionQuestions) {
          sectionElement.classList.add('completed');
        } else {
          sectionElement.classList.remove('completed');
        }
      }
    });
  }

  private getSectionAnsweredQuestions(startQuestion: number, endQuestion: number): number {
    let answered = 0;
    
    for (let i = startQuestion; i <= endQuestion; i++) {
      const radioButtons = document.querySelectorAll(`input[name="pregunta${i}"]`);
      const isAnswered = Array.from(radioButtons).some((radio: any) => radio.checked);
      
      if (isAnswered) {
        answered++;
      }
    }
    
    return answered;
  }

  // Método para verificar si hay respuestas guardadas
  hasAnswers(): boolean {
    return this.totalQuestions > 0 && this.answeredQuestions > 0;
  }

  // Método para obtener el progreso actual
  get currentProgress(): number {
    return this.totalQuestions > 0 ? Math.round((this.answeredQuestions / this.totalQuestions) * 100) : 0;
  }

}
