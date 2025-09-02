
import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from 'src/app/services/paciente.service';
import { EvaluacionService, EvaluacionSensorial } from 'src/app/services/evaluacion.service';

@Component({
  selector: 'app-pagina5',
  templateUrl: './pagina5.component.html',
  styleUrls: ['./pagina5.component.css']
})
export class Pagina5Component implements OnInit, AfterViewInit, OnChanges {
  formularioEvaluacion!: FormGroup;
  loading = false;
  mensaje = '';
  tipoMensaje: 'success' | 'error' | '' = '';
  listaPacientes: any[] = [];
  loadingPacientes = false;
  @Input() paciente: any = null;
  @Input() evaluacionData: EvaluacionSensorial | null = null;

  // Variables de progreso
  totalQuestions = 80;
  answeredQuestions = 0;
  progressPercentage = 0;

  opcionesRespuesta = [
    { valor: 'N', texto: 'Nunca' },
    { valor: 'O', texto: 'Ocasionalmente' },
    { valor: 'F', texto: 'Frecuentemente' },
    { valor: 'S', texto: 'Siempre' }
  ];

  preguntasVision = [
    { id: 1, texto: 'Se fastidia con la luz brillante' },
    { id: 2, texto: 'Tiene problemas para encontrar un objeto en medio de otros' },
    { id: 3, texto: 'Se angustia en lugares donde el ambiente visual es poco común como en habitaciones de espejos' },
    { id: 4, texto: 'Tiene dificultad siguiendo a objetos que se mueven con la vista' },
    { id: 5, texto: 'Tiene dificultad para reconocer cómo se parecen o cómo difieren los objetos en base a sus colores, formas, o tamaños' },
    { id: 6, texto: 'Se fascina con ciertos tipos de iluminación como luces estroboscópicas, luces parpadeantes, o luces fluorescentes' },
    { id: 7, texto: 'Mira a objetos con el rabillo del ojo' },
    { id: 8, texto: 'Se presume o se distrae en lugares donde hay demasiadas tiendas por todas las cosas que se ven en las vitrinas' },
    { id: 9, texto: 'Se distrae con objetos o gente que están visibles' },
    { id: 10, texto: 'Busca áreas que están oscuras' }
  ];
  preguntasAuditivo = [
    { id: 11, texto: 'Se distrae con los sonidos caseros comunes como el de una aspiradora' },
    { id: 12, texto: 'Responde a las voces escondidos, llorando, o poniéndose las manos sobre los oídos' },
    { id: 13, texto: 'No nota los sonidos que otros niños notan' },
    { id: 14, texto: 'Parece estar intensamente interesado/a en sonidos que otros no notan' },
    { id: 15, texto: 'Se asusta o se molesta a los demás no les molestan' },
    { id: 16, texto: 'Se distrae o se fastidia con ruidos en el ambiente que otros ignoran como una máquina de cortar el césped o el ruido de aire acondicionado' },
    { id: 17, texto: 'Gusta hacer ciertos sonidos repetidamente como tararear o jalar la cadena de la taza del baño' },
    { id: 18, texto: 'Se angustia cuando hay sonidos agudos como silbatos o aparatos para hacer ruido en las fiestas' },
    { id: 19, texto: 'Se queja frecuentemente de ruidos específicos por ruidos irreconocidos' },
    { id: 20, texto: 'Evita los lugares donde hay música o ruido fuerte' }
  ];
  preguntasTactil = [
    { id: 21, texto: 'Come cuando la/lo tocan ligeramente o inesperadamente' },
    { id: 22, texto: 'Se angustia con las actividades diarias de higiene personal' },
    { id: 23, texto: 'Se esquiva cuando le cortan las uñas de las manos o de los pies' },
    { id: 24, texto: 'Se fastidia cuando alguien le toca la cara' },
    { id: 25, texto: 'Evita tocar o jugar con cosas que ensucian como la pintura o la goma de pegar' },
    { id: 26, texto: 'Tiene una gran capacidad para tolerar el dolor y heridas pequeñas, demuestra nada o poca molestia' },
    { id: 27, texto: 'Se restriega contra los dientes' },
    { id: 28, texto: 'Tiene dificultad para encontrar cosas en un bolsillo, una bolsa, o una mochila sin mirar' },
    { id: 29, texto: 'Evita caminar descalzo(a), especialmente en la arena o en la comida de la casa' },
    { id: 30, texto: 'Se queja de que las camisas están "demasiado calientes" o "demasiado frías"' }
  ];
  preguntasGustoOlfato = [
    { id: 31, texto: 'Huele objetos no alimenticios' },
    { id: 32, texto: 'Se fastidia con olores que no les molestan a los demás' },
    { id: 33, texto: 'No nota los olores fuertes' },
    { id: 34, texto: 'Come objetos nuevos de cosas nuevas antes de usarlos' },
    { id: 35, texto: 'Nota fragancias u olores que otros no notan' },
    { id: 36, texto: 'Se fastidia con el sabor de ciertas comidas' },
    { id: 37, texto: 'Insiste en comer sólo ciertas comidas o ciertas marcas de alimentos' },
    { id: 38, texto: 'Evita probar nuevas comidas' },
    { id: 39, texto: 'Evita baños públicos debido a los olores' },
    { id: 40, texto: 'No distingue sabores ni expresa preferencias entre ellos' }
  ];
  preguntasConcienciaCorporal = [
    { id: 41, texto: 'Busca oportunidades para que se/lo/la columnen en superficial que no sostuvo demandad suelto e demasiado fuerte este el/la compañero' },
    { id: 42, texto: 'Agarra objetos, como un lápiz o una cuchara, de una manera demasiado fuerte o demasiado suave para poder escribir o comer fácilmente' },
    { id: 43, texto: 'Usa demasiada fuerza para ciertas cosas, por ejemplo cerrando puertas o pisando de escalón muy fuerte' },
    { id: 44, texto: 'Salta mucho' },
    { id: 45, texto: 'Juega con sus compañeros/as de una manera demasiado ruda' },
    { id: 46, texto: 'Rompe las cosas al presionarlas, jaladas, o empujarlas demasiado fuerte' },
    { id: 47, texto: 'Pone demasiada comida en su boca' },
    { id: 48, texto: 'Se golpea la cabeza a propósito con algún objeto contra la pared' },
    { id: 49, texto: 'Derrama o voltea las cosas' },
    { id: 50, texto: 'Tira la pelota con mucha o con muy poca fuerza' }
  ];
  preguntasEquilibrioMovimiento = [
    { id: 51, texto: 'Le tiene miedo a ciertos movimientos típicos de columpios y el deslizarse en el tobogán' },
    { id: 52, texto: 'Se mantiene en movimiento, de una actividad a otra' },
    { id: 53, texto: 'Evita escaleras sobre sujetar fuerzas que requieren equilibrio cuando exista el riesgo de caerse' },
    { id: 54, texto: 'Busca los juegos que tienen cambio de posición' },
    { id: 55, texto: 'No se queda quieto en una posición para que tuvo fuerzas mientras que este en clase de o varias o cuaderno o' },
    { id: 56, texto: 'Muestra poca coordinación en el tipo de los dos lados de su cuerpo como hay que tener para saltar y usar' },
    { id: 57, texto: 'Se apoya contra las paredes, los muebles, o la gente para mantenerse de mejor sostenerse' },
    { id: 58, texto: 'Se pone como la cabeza y está algo desorientado/a' },
    { id: 59, texto: 'Busca oportunidades para estar de cabeza' },
    { id: 60, texto: 'Tiene dificultad en saber algo mientras su cabeza está en movimiento como el juego para atrapar una pelota' }
  ];
  preguntasPlanificacionIdeas = [
    { id: 61, texto: 'Tiene dificultad para planear cómo cargar varios objetos a la vez' },
    { id: 62, texto: 'Tiene dificultad para sus pertenencias en su lugar como el poner la ropa' },
    { id: 63, texto: 'No descompone la secuencia lógica de acciones necesarias en la rutina de la cena como servir o poner la mesa' },
    { id: 64, texto: 'No planifica bien o reacciona contra objetivos hacia los siguientes pasos' },
    { id: 65, texto: 'Tiene dificultad imitando movimientos, sonidos, o expresiones correspondientes' },
    { id: 66, texto: 'Tiene dificultad para copiar un modelo al construir con bloques o con Legos' },
    { id: 67, texto: 'Tiene dificultad para generar nuevas determinación de los tipos y lugares que para obtener las ideas' },
    { id: 68, texto: 'Necesita más práctica que los demás para adquirir una habilidad nueva' },
    { id: 69, texto: 'Toma demasiado tiempo para completar las tareas rutinarias' },
    { id: 70, texto: 'Tiene dificultad para generar ideas sobre qué construir como cuando juega con bloques o con materiales de artesanía' }
  ];
  preguntasParticipacionSocial = [
    { id: 71, texto: 'Colabora con sus amigos sin mucha dificultad cuando juega con ellos' },
    { id: 72, texto: 'Participa de manera apropiada con padres y otros adultos' },
    { id: 73, texto: 'Comparte las cosas cuando se le piden' },
    { id: 74, texto: 'Conversa con otros sin pararse o sentarse demasiado cerca de ellos' },
    { id: 75, texto: 'Mantiene contacto visual apropiado al conversar' },
    { id: 76, texto: 'Se une al juego con otros sin alterar lo que está transcurriendo' },
    { id: 77, texto: 'Interrumpe y necesita demasiada ayuda para participar en la conversación durante las comidas' },
    { id: 78, texto: 'Participa de manera apropiada en reuniones y salidas con la familia' },
    { id: 79, texto: 'Se expresa cuando su rutina o su plan cambian' },
    { id: 80, texto: 'Coopera con miembros de la familia mientras hacen recados' }
  ];

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private evaluacionService: EvaluacionService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.cargarListaPacientes();
    this.setupProgressTracking();
    
    // Si hay datos de evaluación, cargarlos después de que el formulario esté inicializado
    if (this.evaluacionData) {
      setTimeout(() => {
        console.log('📋 Ejecutando carga de datos de evaluación desde ngOnInit...');
        this.cargarDatosEvaluacion();
      }, 100);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cuando cambien los datos de evaluación desde el componente padre
    if (changes['evaluacionData'] && changes['evaluacionData'].currentValue) {
      console.log('📋 Datos de evaluación cambiaron desde componente padre');
      setTimeout(() => {
        this.cargarDatosEvaluacion();
      }, 200);
    }
  }

  ngAfterViewInit(): void {
    console.log('✅ Vista inicializada - Configurando event listeners para pagina5');
    this.updateProgress();
    this.setupRadioEventListeners();
  }

  private setupProgressTracking(): void {
    // Configurar después de un pequeño delay para asegurar que el DOM esté cargado
    setTimeout(() => {
      this.updateProgress();
      this.attachRadioListeners();
    }, 100);
  }

  private setupRadioEventListeners(): void {
    console.log('🔧 Configurando event listeners para radio buttons en pagina5...');
    
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
    console.log('🔄 Actualizando progreso en pagina5...');
    
    // Contar todas las preguntas con respuestas seleccionadas
    const allRadioGroups = document.querySelectorAll('input[type="radio"]:checked');
    this.answeredQuestions = allRadioGroups.length;
    
    console.log(`📝 Preguntas respondidas encontradas: ${this.answeredQuestions}`);
    
    // Calcular porcentaje
    this.progressPercentage = Math.round((this.answeredQuestions / this.totalQuestions) * 100);
    
    console.log(`📊 Progreso actualizado: ${this.answeredQuestions}/${this.totalQuestions} = ${this.progressPercentage}%`);
  }

  private initializeForm(): void {
    const controls: any = {};
    controls['nombreNino'] = ['', Validators.required];
    controls['edad'] = ['', [Validators.required, Validators.min(1), Validators.max(12)]];
    controls['fechaEvaluacion'] = [new Date().toISOString().split('T')[0], Validators.required];
    controls['evaluador'] = ['', Validators.required];
    controls['observaciones'] = [''];

    [...this.preguntasVision, ...this.preguntasAuditivo, ...this.preguntasTactil, ...this.preguntasGustoOlfato,
      ...this.preguntasConcienciaCorporal, ...this.preguntasEquilibrioMovimiento, ...this.preguntasPlanificacionIdeas, ...this.preguntasParticipacionSocial]
      .forEach(pregunta => {
        controls[`pregunta_${pregunta.id}`] = [''];
      });

    this.formularioEvaluacion = this.fb.group(controls);
  }

  // Método para guardar evaluación sin requerir 100% de completitud (como pagina2)
  saveEvaluation(event?: Event): void {
    // Prevenir el comportamiento por defecto del formulario
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // ALERTA INMEDIATA PARA CONFIRMAR QUE SE EJECUTA
    alert('🚀 ¡BOTÓN FUNCIONANDO! - Guardando evaluación (1-3 años) en tabla EvaluacionesSensoriales');
    console.log('🚀 Iniciando saveEvaluation() para pagina5...');

    if (!this.paciente) {
      alert('⚠️ No hay paciente seleccionado. Por favor, selecciona un paciente antes de guardar.');
      return;
    }

    // Actualizar progreso antes de guardar
    this.updateProgress();

    if (this.answeredQuestions === 0) {
      console.error('❌ No hay preguntas respondidas');
      alert('Por favor, responde al menos una pregunta antes de guardar.');
      return;
    }

    console.log('📝 Recopilando respuestas...');
    const responses = this.collectResponses();
    console.log('📋 Respuestas recopiladas:', responses);
    
    const progreso = this.totalQuestions > 0 ? Math.round((this.answeredQuestions / this.totalQuestions) * 100) : 0;
    
    // Determinar el estado de la evaluación
    const estado = progreso === 100 ? 'Completada' : 'En Progreso';
    
    const evaluacionData: EvaluacionSensorial = {
      idPaciente: parseInt(this.paciente.idPaciente || this.paciente.id),
      progreso: progreso,
      respuestas: responses,
      tipoFormulario: '1-3', // Identificar que es el formulario de 1-3 años
      evaluadorNombre: 'Dr. Evaluador (1-3 años)',
      evaluadorCorreo: 'evaluador@test.com',
      observaciones: `Evaluación 1-3 años guardada el ${new Date().toLocaleString()}`,
      estado: estado
    };

    console.log('💾 Datos de evaluación preparados:', evaluacionData);

    // Guardar en base de datos
    console.log('🔄 Enviando a base de datos...');
    
    this.evaluacionService.guardarEvaluacion(evaluacionData).subscribe({
      next: (response) => {
        console.log('✅ Evaluación guardada exitosamente:', response);
        alert(`✅ Evaluación guardada exitosamente para ${this.paciente.nombre}\nProgreso: ${progreso}%\nEstado: ${estado}`);
        
        // También mantener copia en localStorage como respaldo
        this.saveEvaluationToStorage({
          pacienteId: this.paciente.id,
          pacienteNombre: this.paciente.nombre,
          fechaEvaluacion: new Date().toISOString(),
          preguntasRespondidas: this.answeredQuestions,
          porcentajeCompletado: progreso,
          respuestas: responses,
          estado: estado,
          tipoFormulario: '1-3 años'
        });
      },
      error: (error) => {
        console.error('❌ Error al guardar evaluación:', error);
        alert(`❌ Error al guardar la evaluación en la base de datos.\n\nDetalles: ${error.message}\n\nLa evaluación se guardará localmente como respaldo.`);
        
        // En caso de error, guardar solo localmente
        this.saveEvaluationToStorage({
          pacienteId: this.paciente.id,
          pacienteNombre: this.paciente.nombre,
          fechaEvaluacion: new Date().toISOString(),
          preguntasRespondidas: this.answeredQuestions,
          porcentajeCompletado: progreso,
          respuestas: responses,
          estado: estado,
          guardadoLocal: true,
          tipoFormulario: '1-3 años'
        });
      }
    });
  }

  private collectResponses(): any[] {
    console.log('📝 Recopilando respuestas...');
    
    const responses: any[] = [];
    const checkedInputs = document.querySelectorAll('input[type="radio"]:checked');
    
    console.log(`📊 Radio buttons seleccionados encontrados: ${checkedInputs.length}`);
    
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
    
    console.log(`📊 Total de respuestas recopiladas: ${responses.length}`);
    return responses;
  }

  // Método auxiliar para obtener puntaje
  private getScoreFromValue(value: string): number {
    switch(value) {
      case 'N': return 1;  // Nunca
      case 'O': return 2;  // Ocasionalmente
      case 'F': return 3;  // Frecuentemente
      case 'S': return 4;  // Siempre
      default: return 2;
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

  // Método original onSubmit (mantenido para compatibilidad con formularios que requieren 100%)
  onSubmit(): void {
    if (this.formularioEvaluacion.valid) {
      this.loading = true;
      this.mensaje = '';
      this.tipoMensaje = '';

      if (!this.paciente) {
        this.mensaje = 'Error: No hay paciente seleccionado.';
        this.tipoMensaje = 'error';
        this.loading = false;
        return;
      }

      const totalPreguntas = 80;
      let preguntasRespondidas = 0;
      [...this.preguntasVision, ...this.preguntasAuditivo, ...this.preguntasTactil, ...this.preguntasGustoOlfato,
        ...this.preguntasConcienciaCorporal, ...this.preguntasEquilibrioMovimiento, ...this.preguntasPlanificacionIdeas, ...this.preguntasParticipacionSocial]
        .forEach(pregunta => {
          if (this.formularioEvaluacion.value[`pregunta_${pregunta.id}`]) {
            preguntasRespondidas++;
          }
        });
      const progreso = Math.round((preguntasRespondidas / totalPreguntas) * 100);

      const datosEvaluacion = {
        idPaciente: this.paciente.idPaciente || this.paciente.id || this.paciente.rut,
        informacionNino: {
          nombre: this.formularioEvaluacion.value.nombreNino,
          edad: this.formularioEvaluacion.value.edad,
          fechaEvaluacion: this.formularioEvaluacion.value.fechaEvaluacion,
          evaluador: this.formularioEvaluacion.value.evaluador,
          observaciones: this.formularioEvaluacion.value.observaciones
        },
        respuestas: [...this.preguntasVision, ...this.preguntasAuditivo, ...this.preguntasTactil, ...this.preguntasGustoOlfato,
          ...this.preguntasConcienciaCorporal, ...this.preguntasEquilibrioMovimiento, ...this.preguntasPlanificacionIdeas, ...this.preguntasParticipacionSocial]
          .map(pregunta => ({
            preguntaId: pregunta.id,
            preguntaTexto: pregunta.texto,
            respuesta: this.formularioEvaluacion.value[`pregunta_${pregunta.id}`] || 'Sin respuesta'
          })),
        progreso: progreso
      };

      this.evaluacionService.guardarEvaluacion(datosEvaluacion).subscribe({
        next: (response) => {
          this.mensaje = `Evaluación sensorial guardada correctamente.`;
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
    } else {
      this.markFormGroupTouched();
      this.mensaje = 'Por favor, complete los campos obligatorios.';
      this.tipoMensaje = 'error';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.formularioEvaluacion.controls).forEach(key => {
      const control = this.formularioEvaluacion.get(key);
      control?.markAsTouched();
    });
  }

  cargarListaPacientes(): void {
    this.loadingPacientes = true;
    this.pacienteService.obtenerPacientesCompletos().subscribe({
      next: (pacientes) => {
        this.listaPacientes = pacientes;
        this.loadingPacientes = false;
      },
      error: (error) => {
        this.loadingPacientes = false;
        this.mensaje = 'Error al cargar la lista de pacientes';
        this.tipoMensaje = 'error';
      }
    });
  }

  cargarPacienteEnFormulario(paciente: any): void {
    this.paciente = paciente;
    this.formularioEvaluacion.patchValue({
      nombreNino: paciente.nombre + ' ' + paciente.apellidoPaterno,
      edad: paciente.edad || '',
      fechaEvaluacion: new Date().toISOString().split('T')[0],
      evaluador: '',
      observaciones: `Evaluación para paciente ID: ${paciente.idPaciente} - RUT: ${paciente.rut}`
    });
    this.mensaje = `Datos de ${paciente.nombre} cargados en el formulario.`;
    this.tipoMensaje = 'success';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private cargarDatosEvaluacion(): void {
    if (!this.evaluacionData) return;

    console.log('🔄 Cargando datos de evaluación existente:', this.evaluacionData);
    console.log('📋 Estructura completa:', JSON.stringify(this.evaluacionData, null, 2));

    // Cargar información básica del paciente desde evaluacionData directamente
    if (this.evaluacionData.nombreCompleto) {
      this.formularioEvaluacion.patchValue({
        nombreNino: this.evaluacionData.nombreCompleto || '',
        edad: '', // No está en la estructura actual
        fechaEvaluacion: this.evaluacionData.fechaEvaluacion ? this.evaluacionData.fechaEvaluacion.split('T')[0] : '',
        evaluador: this.evaluacionData.evaluadorNombre || '',
        observaciones: this.evaluacionData.observaciones || ''
      });
      console.log('📝 Información básica cargada desde evaluacionData directamente');
    }

    // Cargar respuestas - la estructura principal es un string JSON
    let respuestasCargadas = 0;
    if (this.evaluacionData.respuestas) {
      try {
        let respuestasArray: any[] = [];
        
        // Si respuestas es un string, parsearlo
        if (typeof this.evaluacionData.respuestas === 'string') {
          console.log('🔄 Parseando respuestas desde string JSON...');
          respuestasArray = JSON.parse(this.evaluacionData.respuestas);
        }
        // Si ya es un array
        else if (Array.isArray(this.evaluacionData.respuestas)) {
          respuestasArray = this.evaluacionData.respuestas;
        }
        // Si es un objeto con propiedad respuestas
        else if (this.evaluacionData.respuestas.respuestas) {
          respuestasArray = this.evaluacionData.respuestas.respuestas;
        }

        console.log('� Array de respuestas procesado:', respuestasArray);

        // Mapear las respuestas al formulario
        respuestasArray.forEach((respuesta: any) => {
          if (respuesta.id && respuesta.respuesta) {
            const controlName = `pregunta_${respuesta.id}`;
            
            // Mapear el valor "on" a los valores correctos del formulario
            let valorMapeado = respuesta.respuesta;
            
            // Si el valor es "on", necesitamos determinar el valor correcto
            // Basándome en el puntaje, podemos inferir la respuesta
            if (respuesta.respuesta === 'on') {
              if (respuesta.puntaje === 1) valorMapeado = 'N';      // Nunca
              else if (respuesta.puntaje === 2) valorMapeado = 'O';  // Ocasionalmente  
              else if (respuesta.puntaje === 3) valorMapeado = 'F';  // Frecuentemente
              else if (respuesta.puntaje === 4) valorMapeado = 'S';  // Siempre
              else valorMapeado = 'O'; // Valor por defecto
            }
            
            this.formularioEvaluacion.patchValue({
              [controlName]: valorMapeado
            });
            respuestasCargadas++;
            console.log(`✅ Cargada respuesta: ${controlName} = ${valorMapeado} (puntaje: ${respuesta.puntaje}, original: ${respuesta.respuesta})`);
          }
        });

      } catch (error) {
        console.error('❌ Error al parsear respuestas:', error);
        console.log('📋 Respuestas raw:', this.evaluacionData.respuestas);
      }
    }

    console.log(`📊 Total de respuestas cargadas: ${respuestasCargadas}`);

    // Forzar actualización del DOM y progreso después de cargar las respuestas
    setTimeout(() => {
      console.log('🎨 Paso 1: Iniciando marcado visual de radio buttons...');
      this.marcarRadioButtonsVisualmente();
      this.updateProgress();
    }, 500);

    // Intentar de nuevo después de más tiempo para asegurar que el DOM esté listo
    setTimeout(() => {
      console.log('🎨 Paso 2: Segundo intento de marcado visual...');
      this.marcarRadioButtonsVisualmente();
      this.forzarActualizacionFormulario();
      this.updateProgress();
      this.setupRadioEventListeners();
    }, 1000);

    console.log('✅ Datos de evaluación cargados en el formulario');
  }

  private forzarActualizacionFormulario(): void {
    console.log('🔄 Forzando actualización del formulario...');
    
    // Forzar detección de cambios en Angular
    const formValue = this.formularioEvaluacion.value;
    Object.keys(formValue).forEach(controlName => {
      if (controlName.startsWith('pregunta_') && formValue[controlName]) {
        const control = this.formularioEvaluacion.get(controlName);
        if (control) {
          // Forzar que el control se marque como "touched" y disparar cambios
          control.markAsTouched();
          control.updateValueAndValidity();
          console.log(`🔄 Control actualizado: ${controlName} = ${control.value}`);
        }
      }
    });
    
    // Forzar actualización de todo el formulario
    this.formularioEvaluacion.updateValueAndValidity();
    console.log('✅ Formulario actualizado completamente');
  }

  private marcarRadioButtonsVisualmente(): void {
    console.log('🎨 Marcando radio buttons visualmente...');
    
    const formValue = this.formularioEvaluacion.value;
    let radiosMarcados = 0;
    let radiosEncontrados = 0;
    
    // Verificar primero cuántos radio buttons hay en total
    const totalRadiosEnDOM = document.querySelectorAll('input[type="radio"]').length;
    console.log(`📊 Total de radio buttons en DOM: ${totalRadiosEnDOM}`);
    
    Object.keys(formValue).forEach(controlName => {
      if (controlName.startsWith('pregunta_') && formValue[controlName]) {
        radiosEncontrados++;
        console.log(`🔍 Buscando: ${controlName} = ${formValue[controlName]}`);
        
        // Método 1: Buscar por name y value exactos
        let radioButton = document.querySelector(`input[name="${controlName}"][value="${formValue[controlName]}"]`) as HTMLInputElement;
        
        if (radioButton) {
          radioButton.checked = true;
          // Disparar evento change para asegurar que Angular lo detecte
          radioButton.dispatchEvent(new Event('change', { bubbles: true }));
          radiosMarcados++;
          console.log(`✅ Marcado radio button (método 1): ${controlName} = ${formValue[controlName]}`);
        } else {
          console.warn(`⚠️ No encontrado por name/value: ${controlName} = ${formValue[controlName]}`);
          
          // Método 2: Buscar por id más específico
          radioButton = document.querySelector(`input[id="${controlName}_${formValue[controlName]}"]`) as HTMLInputElement;
          if (radioButton) {
            radioButton.checked = true;
            radioButton.dispatchEvent(new Event('change', { bubbles: true }));
            radiosMarcados++;
            console.log(`✅ Marcado radio button (método 2): ${controlName} = ${formValue[controlName]}`);
          } else {
            // Método 3: Buscar todos los radio buttons del grupo y marcar el correcto
            const radiosDelGrupo = document.querySelectorAll(`input[name="${controlName}"]`);
            console.log(`🔍 Radio buttons del grupo ${controlName}:`, radiosDelGrupo.length);
            
            radiosDelGrupo.forEach((radio: any) => {
              console.log(`   - Radio encontrado: value="${radio.value}", id="${radio.id}"`);
              if (radio.value === formValue[controlName]) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change', { bubbles: true }));
                radiosMarcados++;
                console.log(`✅ Marcado radio button (método 3): ${controlName} = ${formValue[controlName]}`);
              }
            });
          }
        }
      }
    });
    
    console.log(`🎨 Resultado del marcado:`);
    console.log(`   - Controles procesados: ${radiosEncontrados}`);
    console.log(`   - Radio buttons marcados: ${radiosMarcados}`);
    
    // Verificar estado final
    const radiosChecked = document.querySelectorAll('input[type="radio"]:checked').length;
    console.log(`📊 Estado final: ${radiosChecked} radio buttons marcados de ${totalRadiosEnDOM} totales`);
    
    // Si no se marcó ninguno, listar todos los radio buttons disponibles para debug
    if (radiosMarcados === 0 && radiosEncontrados > 0) {
      console.log('🔍 DEBUG: Listando todos los radio buttons para análisis...');
      const todosLosRadios = document.querySelectorAll('input[type="radio"]');
      todosLosRadios.forEach((radio: any, index) => {
        console.log(`   ${index}: name="${radio.name}", value="${radio.value}", id="${radio.id}"`);
      });
    }
  }
}
