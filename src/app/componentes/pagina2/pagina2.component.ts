import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { EvaluacionService, EvaluacionSensorial } from '../../services/evaluacion.service';

@Component({
  selector: 'app-pagina2',
  templateUrl: './pagina2.component.html',
  styleUrls: ['./pagina2.component.css']
})
export class Pagina2Component implements OnInit, AfterViewInit {

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
  evaluacionIdFromRoute: string | null = null;
  isEditMode: boolean = false;
  currentEvaluacion: any = null;

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
    this.checkForRouteParams();
    this.setupProgressTracking();
    this.ensureTestPatientAvailable();
  }

  ngAfterViewInit(): void {
    console.log('✅ Vista inicializada - Configurando event listeners');
    this.updateProgress();
    this.setupRadioEventListeners();
    this.checkForRouteParams();
  }

  private setupRadioEventListeners(): void {
    console.log('🔧 Configurando event listeners para radio buttons...');
    
    // Usar setTimeout para asegurar que el DOM esté completamente renderizado
    setTimeout(() => {
      const radioButtons = document.querySelectorAll('input[type="radio"]');
      console.log(`📊 Configurando listeners para ${radioButtons.length} radio buttons`);
      
      radioButtons.forEach((radio: any) => {
        radio.addEventListener('change', () => {
          console.log(`🔘 Radio button cambiado: ${radio.name} = ${radio.value}`);
          this.updateProgress();
        });
      });
    }, 100);
  }

  private ensureTestPatientAvailable(): void {
    console.log('🧪 Verificando disponibilidad de paciente de prueba...');
    
    // Si no hay pacientes cargados, crear uno de prueba
    if (!this.patients || this.patients.length === 0) {
      console.log('🔄 No hay pacientes disponibles, creando paciente de prueba...');
      
      const testPatient = {
        idPaciente: '999',
        id: '999',
        nombre: 'Paciente',
        apellidoPaterno: 'DePrueba',
        apellidoMaterno: 'Test',
        rut: '12345678-9',
        telefono: '+56912345678',
        correo: 'test@test.com'
      };
      
      this.patients = [testPatient];
      this.selectedPatient = testPatient;
      
      console.log('✅ Paciente de prueba creado y seleccionado:', testPatient);
    } else if (!this.selectedPatient && this.patients.length > 0) {
      // Si hay pacientes pero ninguno seleccionado, seleccionar el primero
      this.selectedPatient = this.patients[0];
      console.log('✅ Paciente seleccionado automáticamente:', this.selectedPatient);
    }
  }

  setupQuestionListeners() {
    console.log('🎯 Configurando listeners para radio buttons...');
    
    // Obtener todos los radio buttons del formulario
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    console.log(`📻 Radio buttons encontrados: ${radioButtons.length}`);
    
    radioButtons.forEach((radio, index) => {
      radio.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        console.log(`✅ Respuesta seleccionada: ${target.name} = ${target.value}`);
        
        // Actualizar progreso inmediatamente
        this.updateProgress();
        
        // Log para debug
        console.log(`📊 Progreso actualizado: ${this.answeredQuestions}/${this.totalQuestions} (${this.progressPercentage}%)`);
      });
    });
    
    // Verificar estado inicial
    this.updateProgress();
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

  private checkForRouteParams(): void {
    this.route.queryParams.subscribe(params => {
      this.patientIdFromRoute = params['pacienteId'];
      this.evaluacionIdFromRoute = params['evaluacionId'];
      
      console.log('📋 Parámetros de ruta:', {
        pacienteId: this.patientIdFromRoute,
        evaluacionId: this.evaluacionIdFromRoute
      });

      if (this.evaluacionIdFromRoute) {
        // Modo edición: cargar evaluación existente
        this.isEditMode = true;
        this.loadExistingEvaluation(this.evaluacionIdFromRoute);
      } else if (this.patientIdFromRoute) {
        // Modo nuevo: solo seleccionar paciente
        this.isEditMode = false;
        this.selectPatientById(this.patientIdFromRoute);
      }
    });
  }

  private loadExistingEvaluation(evaluacionId: string): void {
    console.log('📖 Cargando evaluación existente:', evaluacionId);
    
    this.evaluacionService.obtenerEvaluacionPorId(parseInt(evaluacionId)).subscribe({
      next: (evaluacion) => {
        console.log('✅ Evaluación cargada:', evaluacion);
        this.currentEvaluacion = evaluacion;
        
        // Seleccionar el paciente
        this.selectPatientById(evaluacion.idPaciente.toString());
        
        // Cargar las respuestas en el formulario
        this.loadResponsesIntoForm(evaluacion.respuestas);
        
        alert(`📖 Cargando evaluación existente de ${evaluacion.nombreCompleto}\nProgreso: ${evaluacion.progreso}%\nEstado: ${evaluacion.estado}`);
      },
      error: (error) => {
        console.error('❌ Error al cargar evaluación:', error);
        alert(`Error al cargar la evaluación: ${error.message}`);
        // En caso de error, redirigir a nueva evaluación
        this.isEditMode = false;
        if (this.patientIdFromRoute) {
          this.selectPatientById(this.patientIdFromRoute);
        }
      }
    });
  }

  private loadResponsesIntoForm(respuestasJson: string): void {
    try {
      console.log('📝 === INICIANDO CARGA DE RESPUESTAS ===');
      console.log('📝 Datos recibidos:', respuestasJson);
      
      let respuestas: any[];
      
      // Parsear las respuestas (pueden estar como string JSON)
      if (typeof respuestasJson === 'string') {
        respuestas = JSON.parse(respuestasJson);
      } else {
        respuestas = respuestasJson;
      }
      
      console.log('📋 Respuestas parseadas:', respuestas);
      console.log('📊 Total de respuestas a cargar:', respuestas.length);
      
      // Múltiples intentos con diferentes tiempos de espera
      this.loadResponsesWithMultipleAttempts(respuestas, 0);
      
    } catch (error) {
      console.error('❌ Error al cargar respuestas:', error);
      alert('Error al cargar las respuestas de la evaluación. Se iniciará una nueva evaluación.');
    }
  }

  private loadResponsesWithMultipleAttempts(respuestas: any[], attemptNumber: number): void {
    const maxAttempts = 3;
    const delays = [500, 1000, 2000]; // Tiempos de espera incrementales
    
    if (attemptNumber >= maxAttempts) {
      console.log('❌ Se agotaron los intentos de carga');
      alert('⚠️ No se pudieron cargar completamente las respuestas anteriores.\nSe iniciará una nueva evaluación.');
      return;
    }

    const delay = delays[attemptNumber];
    console.log(`🔄 Intento ${attemptNumber + 1}/${maxAttempts} - Esperando ${delay}ms...`);
    
    setTimeout(() => {
      let respuestasCargadas = 0;
      let respuestasNoEncontradas = 0;
      
      console.log(`🔍 === INTENTO ${attemptNumber + 1}: BÚSQUEDA DE RADIO BUTTONS ===`);
      
      // Inventario completo de radio buttons disponibles
      const todosLosRadios = document.querySelectorAll('input[type="radio"]');
      console.log(`📊 Total radio buttons disponibles: ${todosLosRadios.length}`);
      
      if (todosLosRadios.length === 0) {
        console.log('⚠️ No se encontraron radio buttons, reintentando...');
        this.loadResponsesWithMultipleAttempts(respuestas, attemptNumber + 1);
        return;
      }
      
      // Mostrar algunos ejemplos de radio buttons disponibles
      if (attemptNumber === 0) {
        console.log('📋 Ejemplos de radio buttons disponibles:');
        Array.from(todosLosRadios).slice(0, 8).forEach((radio: any, index) => {
          console.log(`  ${index + 1}. name="${radio.name}" value="${radio.value}" id="${radio.id}"`);
        });
      }
      
      // Intentar cargar cada respuesta
      respuestas.forEach((respuesta: any, index) => {
        if (!respuesta.name) {
          console.log(`❌ Respuesta ${index + 1}: Sin atributo 'name'`);
          respuestasNoEncontradas++;
          return;
        }
        
        console.log(`🔍 Procesando respuesta ${index + 1}: ${respuesta.name} = ${respuesta.respuesta}`);
        
        // Estrategia 1: Buscar por name y value exactos
        let radioInput = document.querySelector(`input[name="${respuesta.name}"][value="${respuesta.respuesta}"]`) as HTMLInputElement;
        
        // Estrategia 2: Si no se encuentra, buscar por ID construido
        if (!radioInput) {
          const constructedId = `q${respuesta.name.replace('pregunta', '')}_${respuesta.respuesta}`;
          radioInput = document.getElementById(constructedId) as HTMLInputElement;
          console.log(`🔍 Búsqueda alternativa por ID: ${constructedId}`);
        }
        
        // Estrategia 3: Buscar usando querySelectorAll y filtrar
        if (!radioInput) {
          const radiosWithName = document.querySelectorAll(`input[name="${respuesta.name}"]`);
          Array.from(radiosWithName).forEach(radio => {
            if ((radio as HTMLInputElement).value === respuesta.respuesta) {
              radioInput = radio as HTMLInputElement;
              console.log(`🔍 Encontrado mediante búsqueda filtrada`);
            }
          });
        }
        
        if (radioInput) {
          // Verificar que el elemento sea realmente un radio button
          if (radioInput.type === 'radio') {
            radioInput.checked = true;
            respuestasCargadas++;
            console.log(`✅ Respuesta ${index + 1} CARGADA: ${respuesta.name} = ${respuesta.respuesta}`);
            
            // Disparar múltiples eventos para asegurar que Angular detecte el cambio
            const events = ['change', 'input', 'click'];
            events.forEach(eventType => {
              const event = new Event(eventType, { bubbles: true });
              radioInput.dispatchEvent(event);
            });
            
            // También intentar con eventos nativos
            if (radioInput.onchange) {
              radioInput.onchange(new Event('change') as any);
            }
          } else {
            console.log(`⚠️ Elemento encontrado no es un radio button: ${radioInput.type}`);
            respuestasNoEncontradas++;
          }
        } else {
          respuestasNoEncontradas++;
          console.log(`⚠️ Respuesta ${index + 1} NO ENCONTRADA: ${respuesta.name} = ${respuesta.respuesta}`);
          
          // Diagnóstico: buscar elementos similares
          const radiosWithSameName = document.querySelectorAll(`input[name="${respuesta.name}"]`);
          if (radiosWithSameName.length > 0) {
            console.log(`   📋 Radio buttons disponibles para ${respuesta.name}:`);
            radiosWithSameName.forEach((radio: any, i) => {
              console.log(`     ${i + 1}. value="${radio.value}" (buscado: "${respuesta.respuesta}")`);
            });
          } else {
            console.log(`   ❌ No existe ningún radio button con name="${respuesta.name}"`);
          }
        }
      });
      
      console.log(`\n📊 === RESUMEN INTENTO ${attemptNumber + 1} ===`);
      console.log(`✅ Respuestas cargadas: ${respuestasCargadas}`);
      console.log(`❌ Respuestas no encontradas: ${respuestasNoEncontradas}`);
      console.log(`📊 Total procesadas: ${respuestas.length}`);
      
      // Si cargamos al menos algunas respuestas o es el último intento, continuar
      if (respuestasCargadas > 0 || attemptNumber === maxAttempts - 1) {
        console.log('🔄 Actualizando progreso...');
        this.updateProgress();
        
        // Mostrar mensaje al usuario
        const totalCargadas = respuestasCargadas;
        const totalNoEncontradas = respuestasNoEncontradas;
        
        if (totalCargadas > 0) {
          let mensaje = `✅ Se cargaron ${totalCargadas} de ${respuestas.length} respuestas de la evaluación anterior.\n\n`;
          
          if (totalNoEncontradas > 0) {
            mensaje += `⚠️ ${totalNoEncontradas} respuestas no se pudieron cargar.\n\n`;
          }
          
          mensaje += 'Puedes continuar completando la evaluación.';
          alert(mensaje);
        } else {
          alert('⚠️ No se pudieron cargar las respuestas anteriores.\nSe iniciará una nueva evaluación.');
        }
        
        console.log(`🎉 Proceso completado después de ${attemptNumber + 1} intentos`);
      } else {
        // Si no se cargó nada, reintentar
        console.log(`🔄 No se cargaron respuestas, reintentando (intento ${attemptNumber + 2})...`);
        this.loadResponsesWithMultipleAttempts(respuestas, attemptNumber + 1);
      }
      
    }, delay);
  }

  private checkForPatientId(): void {
    // Este método ya no se usa, se reemplaza por checkForRouteParams
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

  saveEvaluation(event?: Event): void {
    // Prevenir el comportamiento por defecto del formulario
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // ALERTA INMEDIATA PARA CONFIRMAR QUE SE EJECUTA
    alert('🚀 ¡BOTÓN FUNCIONANDO! - Guardando en tabla EvaluacionesSensoriales');
    console.log('🚀 Iniciando saveEvaluation()...');
    console.log('📊 Estado actual completo:', {
      selectedPatient: this.selectedPatient,
      answeredQuestions: this.answeredQuestions,
      totalQuestions: this.totalQuestions,
      patients: this.patients,
      patientIdFromRoute: this.patientIdFromRoute
    });

    // Verificar estado del paciente con más detalle
    if (!this.selectedPatient) {
      console.warn('⚠️ No hay paciente seleccionado, intentando recuperar...');
      
      // Intentar recuperar paciente de la lista si hay uno disponible
      if (this.patients && this.patients.length > 0) {
        console.log('🔄 Intentando usar el primer paciente disponible...');
        this.selectedPatient = this.patients[0];
        console.log('✅ Paciente recuperado:', this.selectedPatient);
      } else if (this.patientIdFromRoute) {
        console.log('🔄 Intentando usar ID de ruta:', this.patientIdFromRoute);
        // Aquí podrías hacer una llamada al servicio para obtener el paciente
      } else {
        alert('⚠️ No hay paciente seleccionado. Por favor, selecciona un paciente antes de guardar.');
      }
    }

    if (this.answeredQuestions === 0) {
      console.error('❌ No hay preguntas respondidas');
      alert('Por favor, responde al menos una pregunta antes de guardar.');
      return;
    }

    // Recopilar todas las respuestas
    console.log('📝 Recopilando respuestas...');
    const responses = this.collectResponses();
    console.log('📋 Respuestas recopiladas:', responses);
    
    const progreso = this.totalQuestions > 0 ? Math.round((this.answeredQuestions / this.totalQuestions) * 100) : 0;
    
    // Determinar el estado de la evaluación
    const estado = progreso === 100 ? 'Completada' : 'En Progreso';
    
    const evaluacionData: EvaluacionSensorial = {
      idPaciente: parseInt(this.selectedPatient.idPaciente || this.selectedPatient.id),
      progreso: progreso,
      respuestas: responses,
      evaluadorNombre: this.isEditMode && this.currentEvaluacion ? this.currentEvaluacion.evaluadorNombre : 'Dr. Evaluador',
      evaluadorCorreo: this.isEditMode && this.currentEvaluacion ? this.currentEvaluacion.evaluadorCorreo : 'evaluador@test.com',
      observaciones: this.isEditMode && this.currentEvaluacion ? 
        `${this.currentEvaluacion.observaciones || ''} - Actualizado el ${new Date().toLocaleString()}` : 
        `Evaluación guardada el ${new Date().toLocaleString()}`,
      estado: estado
    };

    // Si estamos en modo edición, agregar el ID de la evaluación
    if (this.isEditMode && this.currentEvaluacion) {
      evaluacionData.idEvaluacion = this.currentEvaluacion.idEvaluacion;
    }

    console.log('💾 Datos de evaluación preparados:', evaluacionData);
    console.log(`📝 Modo: ${this.isEditMode ? 'ACTUALIZAR' : 'CREAR'} evaluación`);

    // Guardar en base de datos
    console.log('🔄 Enviando a base de datos...');
    
    this.evaluacionService.guardarEvaluacion(evaluacionData).subscribe({
      next: (response) => {
        console.log('✅ Evaluación guardada exitosamente:', response);
        const accion = this.isEditMode ? 'actualizada' : 'guardada';
        alert(`✅ Evaluación ${accion} exitosamente en la base de datos para ${this.selectedPatient.nombre}\nProgreso: ${progreso}%\nEstado: ${estado}`);
        
        // Actualizar el estado local si estamos editando
        if (this.isEditMode && response.evaluacion) {
          this.currentEvaluacion = response.evaluacion;
        }
        
        // También mantener copia en localStorage como respaldo
        this.saveEvaluationToStorage({
          pacienteId: this.selectedPatient.id,
          pacienteNombre: this.selectedPatient.nombre,
          fechaEvaluacion: new Date().toISOString(),
          preguntasRespondidas: this.answeredQuestions,
          porcentajeCompletado: progreso,
          respuestas: responses,
          seccionesCompletadas: this.sectionProgress.filter(s => s.completed).length,
          estado: estado,
          modoEdicion: this.isEditMode
        });
      },
      error: (error) => {
        console.error('❌ Error al guardar evaluación:', error);
        const accion = this.isEditMode ? 'actualizar' : 'guardar';
        alert(`❌ Error al ${accion} la evaluación en la base de datos.\n\nDetalles: ${error.message}\n\nLa evaluación se guardará localmente como respaldo.`);
        
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
          guardadoLocal: true,
          modoEdicion: this.isEditMode
        });
      }
    });
  }

  private collectResponses(): any[] {
    console.log('� Recopilando respuestas...');
    
    const responses: any[] = [];
    const checkedInputs = document.querySelectorAll('input[type="radio"]:checked');
    
    console.log(`� Radio buttons seleccionados encontrados: ${checkedInputs.length}`);
    
    checkedInputs.forEach((input: any, index) => {
      const questionElement = input.closest('.question-card, .question-item');
      const questionText = questionElement?.querySelector('.question-text, .pregunta-titulo')?.textContent || `Pregunta ${index + 1}`;
      
      responses.push({
        id: index + 1,
        name: input.name,
        pregunta: questionText.trim(),
        respuesta: input.value,
        puntaje: this.getScoreFromValue(input.value)
      });
      
      console.log(`📝 Respuesta ${index + 1}: ${input.name} = ${input.value}`);
    });
    
    console.log(`� Total de respuestas recopiladas: ${responses.length}`);
    return responses;
  }

  // Método auxiliar para obtener puntaje
  private getScoreFromValue(value: string): number {
    switch(value) {
      case 'nunca': return 1;
      case 'casi-nunca': return 2;
      case 'a-veces': return 3;
      case 'frecuentemente': return 4;
      case 'siempre': return 5;
      default: return 3;
    }
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
    console.log('🔄 Actualizando progreso...');
    
    // Contar todas las preguntas con respuestas seleccionadas
    const allRadioGroups = document.querySelectorAll('input[type="radio"]:checked');
    this.answeredQuestions = allRadioGroups.length;
    
    console.log(`📝 Preguntas respondidas encontradas: ${this.answeredQuestions}`);
    
    // Calcular porcentaje
    this.progressPercentage = Math.round((this.answeredQuestions / this.totalQuestions) * 100);
    
    // Actualizar progreso circular
    this.updateCircularProgress();

    // Actualizar progreso por secciones
    this.updateSectionProgress();

    // Actualizar el DOM del progreso principal
    this.updateProgressUI();
    
    console.log(`📊 Progreso actualizado: ${this.answeredQuestions}/${this.totalQuestions} = ${this.progressPercentage}%`);
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

  // Método para verificar si hay respuestas (usado en el HTML)
  hasAnswers(): boolean {
    // Verificar si hay radio buttons seleccionados
    const checkedInputs = document.querySelectorAll('input[type="radio"]:checked');
    const hasAnswers = checkedInputs.length > 0;
    
    console.log(`🔍 hasAnswers() verificando... ${checkedInputs.length} respuestas encontradas`);
    console.log(`📊 hasAnswers(): ${hasAnswers} (answeredQuestions: ${this.answeredQuestions})`);
    
    return hasAnswers;
  }

  // Método para obtener el progreso actual (usado en el HTML)  
  get currentProgress(): number {
    const progress = this.totalQuestions > 0 ? Math.round((this.answeredQuestions / this.totalQuestions) * 100) : 0;
    console.log(`📊 currentProgress: ${progress}% (${this.answeredQuestions}/${this.totalQuestions})`);
    return progress;
  }

  // Método de debug simple para verificar que el botón funciona
  // Método de debug (opcional, se puede eliminar en producción)
  testButton(): void {
    console.log('🧪 Test button - Funcionalidad de debug');
    alert('Funcionalidad de debug activada. Ver consola para detalles.');
  }

  // Método para ir al inicio del componente
  scrollToTop(): void {
    // Hacer scroll suave hacia el inicio del componente
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
