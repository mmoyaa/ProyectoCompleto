import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from 'src/app/services/paciente.service';
import { EvaluacionService, EvaluacionSensorial } from 'src/app/services/evaluacion.service';

@Component({
  selector: 'app-formulario-6-12',
  templateUrl: './formulario-6-12.component.html',
  styleUrls: ['./formulario-6-12.component.css']
})
export class Formulario612Component implements OnInit, AfterViewInit, OnChanges {
  @Input() paciente: any;
  @Input() evaluacionData: EvaluacionSensorial | null = null;
  formularioParticipacion!: FormGroup;
  loading = false;
  mensaje = '';
  tipoMensaje: 'success' | 'error' | '' = '';
  
  // Variables para el modal de pacientes
  mostrarModalPacientes = false;
  listaPacientes: any[] = [];
  loadingPacientes = false;

  // Variables de progreso
  totalQuestions = 75; // Total de preguntas en formulario 6-12
  answeredQuestions = 0;
  progressPercentage = 0;

  // Preguntas de participación social
  preguntasParticipacion = [
    { id: 1, texto: 'Juega con amigos/as de manera cooperativa (sin muchos argumentos).' },
    { id: 2, texto: 'Se relaciona de modo apropiado con padres de familia y otros adultos importantes (se comunica bien, sigue las instrucciones, demuestra respeto, etc.).' },
    { id: 3, texto: 'Comparte cosas cuando se le pide.' },
    { id: 4, texto: 'Puede conversar sin pararse ni sentarse demasiado cerca de los demás.' },
    { id: 5, texto: 'Mantiene contacto visual apropiado mientras conversa.' },
    { id: 6, texto: 'Se une a jugar con otros sin perturbar lo que están haciendo.' },
    { id: 7, texto: 'Participa en conversaciones e interacciones apropiadas durante las comidas.' },
    { id: 8, texto: 'Participa apropiadamente en salidas familiares, como yendo a comer a un restaurante o yendo al parque o al museo.' },
    { id: 9, texto: 'Participa apropiadamente en reuniones familiares, como las de días feriados, bodas, o cumpleaños.' },
    { id: 10, texto: 'Participa apropiadamente en actividades con amigos, tal como fiestas, yendo al centro comercial, y montando bicicletas/monopatines/escúteres.' }
  ];

  // Preguntas de visión
  preguntasVision = [
    { id: 11, texto: 'Parece sentir molestia por la luz, especialmente luz fuerte (pestaña, cierra o entrecierra los ojos, llora, etc.).' },
    { id: 12, texto: 'Tiene problemas encontrando un objeto cuando este forma parte de un grupo de otras cosas.' },
    { id: 13, texto: 'Cierra un ojo o ladea la cabeza cuando mira algo o a alguien.' },
    { id: 14, texto: 'Se angustia en ambientes que son visualmente inusuales, como un cuarto con mucha luz y colores vivos o un cuarto con muy poca luz.' },
    { id: 15, texto: 'Tiene dificultad controlando el movimiento de sus ojos cuando sigue los movimientos de objetos, como una pelota, con los ojos.' },
    { id: 16, texto: 'Tiene dificultad en reconocer la similitud o diferencia entre objetos en base a sus colores, formas, o tamaños.' },
    { id: 17, texto: 'Disfruta más que la mayoría de niños de su edad mirando objetos que giran o que se mueven.' },
    { id: 18, texto: 'Se tropieza con objetos o con gente como si no estuvieran allí.' },
    { id: 19, texto: 'Disfruta prendiendo y apagando los interruptores de la luz repetidamente.' },
    { id: 20, texto: 'Tiene aversión a ciertos tipos de luces, como el sol de mediodía, luces que parpadean, o luces estroboscópicas o fluorescentes.' },
    { id: 21, texto: 'Disfruta mirando de reojo a objetos en movimiento.' }
  ];

  // Preguntas de oído
  preguntasOido = [
    { id: 22, texto: 'Parece fastidiarse con sonidos comunes de la casa, como la aspiradora, secadora de pelo, o el sonido de jalar la cadena del wáter.' },
    { id: 23, texto: 'Responde de manera negativa a ruidos fuertes, ausentándose, llorando, o tapándose las orejas con las manos.' },
    { id: 24, texto: 'Parece no oír ciertos sonidos.' },
    { id: 25, texto: 'Parece perturbarse por, o estar intensamente interesado/a en, sonidos que otros generalmente no notan.' },
    { id: 26, texto: 'Parece temerle a sonidos que no angustian a otros chicos de su edad.' },
    { id: 27, texto: 'Parece distraerse fácilmente por ruidos del ambiente, como una segadora, un acondicionador de aire, un refrigerador, o luces fluorescentes.' },
    { id: 28, texto: 'Disfruta al hacer que ciertos sonidos sucedan repetidamente, como jalando la cadena del wáter varias veces.' },
    { id: 29, texto: 'Demuestra angustia ante sonidos agudos o metálicos, como pitos, juguetes ruidosos, flautas, y trompetas.' }
  ];

  // Preguntas de tacto
  preguntasTacto = [
    { id: 30, texto: 'Se zafa al ser tocado/a levemente.' },
    { id: 31, texto: 'Parece no estar consciente, como es normal, cuando lo/la tocan.' },
    { id: 32, texto: 'Se angustia con la sensación de la ropa nueva.' },
    { id: 33, texto: 'Prefiere tocar a ser tocado/a.' },
    { id: 34, texto: 'Se angustia cuando se le cortan las uñas de las manos o de los pies.' },
    { id: 35, texto: 'Parece fastidiarse cuando alguien le toca la cara.' },
    { id: 36, texto: 'Evita tocar o jugar con pinturas, pasta, arena, arcilla, barro, pegamento, u otras cosas sucias.' },
    { id: 37, texto: 'Tolera dolores fuertes sin problema.' },
    { id: 38, texto: 'Tiene aversión a cepillarse los dientes, más que a la mayoría de niños de su edad.' },
    { id: 39, texto: 'Parece disfrutar de sensaciones que deberían causar dolor, como al tirarse al suelo o golpear su propio cuerpo.' },
    { id: 40, texto: 'Tiene dificultad encontrando algo en un bolsillo, en una bolsa, o en una mochila solo al tacto (sin mirar).' }
  ];

  // Preguntas de gusto y olfato
  preguntasGustoOlfato = [
    { id: 41, texto: 'Disfruta probando cosas que no son de comer, como pegamento o pintura.' },
    { id: 42, texto: 'Siente náuseas al pensar en comida que no lo agrada, como espinacas cocidas.' },
    { id: 43, texto: 'Disfruta oliendo cosas que no son de comer o oliendo a las personas.' },
    { id: 44, texto: 'Se angustia con olores ante los cuales otros niños no reaccionan.' },
    { id: 45, texto: 'Parece ignorar o no notar olores fuertes a los cuales otros niños reaccionan.' }
  ];

  // Preguntas de conciencia del cuerpo
  preguntasConcienciaCuerpo = [
    { id: 46, texto: 'Agarra objetos (como un lápiz o una cuchara) tan ceñidamente que le es difícil usarlos.' },
    { id: 47, texto: 'Parece estar impulsado/a hacia actividades como empujar, jalar, arrastrar, levantar, o saltar.' },
    { id: 48, texto: 'Parece no estar seguro/a de cuanto elevar o bajar su cuerpo al hacer movimientos como sentarse o pasar por encima de un objeto.' },
    { id: 49, texto: 'Agarra objetos (como un lápiz o una cuchara) tan levemente que le es difícil usarlos.' },
    { id: 50, texto: 'Parece ejercer demasiada presión para lo que hace, como caminando muy pesadamente, tirando puertas, o presionando muy fuerte al usar lápices o crayones.' },
    { id: 51, texto: 'Salta muy a menudo.' },
    { id: 52, texto: 'Tiende a acariciar animales mascotas con demasiada fuerza.' },
    { id: 53, texto: 'Se tropieza con otros niños o los empuja.' },
    { id: 54, texto: 'Mastica juguetes, ropa, u otros objetos más que otros niños.' },
    { id: 55, texto: 'Rompe cosas al presionarlas o empujarlas demasiado fuerte.' }
  ];

  // Preguntas de equilibrio y movimiento
  preguntasEquilibrioMovimiento = [
    { id: 56, texto: 'Parece tenerle excesivo temor a movimientos, como subir y bajar escaleras, columpiarse, o jugar en los sube y baja, los toboganes, u otros equipos del campo de recreo.' },
    { id: 57, texto: 'Tiene buen equilibrio.' },
    { id: 58, texto: 'Evita actividades que requieren equilibrio, como caminar en el bordillo de la acera o en un suelo desigual.' },
    { id: 59, texto: 'Se cae de la silla al mover su cuerpo.' },
    { id: 60, texto: 'No puede sujetarse al caerse.' },
    { id: 61, texto: 'Parece no marearse cuando otros generalmente se marean.' },
    { id: 62, texto: 'Gira o le da vueltas a su cuerpo más que otros niños.' },
    { id: 63, texto: 'Demuestra angustia cuando su cabeza se ladea y no está en la posición erguida y vertical.' },
    { id: 64, texto: 'Demuestra mala coordinación y parece ser torpe.' },
    { id: 65, texto: 'Parece tener miedo de subir en ascensores o escaleras mecánicas.' },
    { id: 66, texto: 'Se apoya en otra gente o en un mueble al sentarse o al tratar de pararse.' }
  ];

  // Preguntas de planificación e ideas
  preguntasPlanificacionIdeas = [
    { id: 67, texto: 'Se desempeña inconsecuentemente en las tareas de la vida diaria.' },
    { id: 68, texto: 'Tiene problemas decidiendo como cargar varios objetos al mismo tiempo.' },
    { id: 69, texto: 'Parece confundirse sobre como guardar materiales o pertenencias en los lugares apropiados.' },
    { id: 70, texto: 'No hace las tareas, como vestirse o poner la mesa, siguiendo una secuencia apropiada.' },
    { id: 71, texto: 'No completa las tareas que requieren varios pasos.' },
    { id: 72, texto: 'Tiene dificultad imitando acciones que se le demuestran, como juegos o canciones con movimiento.' },
    { id: 73, texto: 'Tiene dificultad construyendo a base de un modelo, como al usar Legos o bloques para construir algo semejante al modelo.' },
    { id: 74, texto: 'Tiene dificultad para inventar ideas para nuevos juegos y actividades.' },
    { id: 75, texto: 'Tiende a jugar en lo mismo repetidamente en vez de cambiar a nuevas actividades cuando se le ofrece la oportunidad.' }
  ];

  // Opciones de respuesta
  opcionesRespuesta = [
    { valor: 'N', texto: 'Nunca' },
    { valor: 'O', texto: 'Ocasionalmente' },
    { valor: 'F', texto: 'Frecuentemente' },
    { valor: 'S', texto: 'Siempre' }
  ];

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private evaluacionService: EvaluacionService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.cargarListaPacientes();
    this.setupProgressTracking();
    
    // Marcar el formulario como pristine y untouched para evitar mostrar errores al inicio
    this.formularioParticipacion.markAsUntouched();
    this.formularioParticipacion.markAsPristine();
    
    // Si hay datos de evaluación, cargarlos después de que el formulario esté inicializado
    if (this.evaluacionData) {
      setTimeout(() => {
        console.log('📋 Ejecutando carga de datos de evaluación desde ngOnInit (6-12)...');
        this.cargarDatosEvaluacion();
      }, 100);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cuando cambien los datos de evaluación desde el componente padre
    if (changes['evaluacionData'] && changes['evaluacionData'].currentValue) {
      console.log('📋 Datos de evaluación cambiaron desde componente padre (6-12)');
      setTimeout(() => {
        this.cargarDatosEvaluacion();
      }, 200);
    }
  }

  ngAfterViewInit(): void {
    console.log('✅ Vista inicializada - Configurando event listeners para formulario-6-12');
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
    console.log('🔧 Configurando event listeners para radio buttons en formulario-6-12...');
    
    // Usar setTimeout para asegurar que el DOM esté completamente renderizado
    setTimeout(() => {
      const radioButtons = document.querySelectorAll('input[type="radio"]');
      console.log(`📊 Configurando listeners para ${radioButtons.length} radio buttons (6-12)`);
      
      radioButtons.forEach((radio: any) => {
        radio.addEventListener('change', () => {
          console.log(`🔘 Radio button cambiado (6-12): ${radio.name} = ${radio.value}`);
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
    console.log('🔄 Actualizando progreso en formulario-6-12...');
    
    // Contar todas las preguntas con respuestas seleccionadas
    const allRadioGroups = document.querySelectorAll('input[type="radio"]:checked');
    this.answeredQuestions = allRadioGroups.length;
    
    console.log(`📝 Preguntas respondidas encontradas (6-12): ${this.answeredQuestions}`);
    
    // Calcular porcentaje
    this.progressPercentage = Math.round((this.answeredQuestions / this.totalQuestions) * 100);
    
    console.log(`📊 Progreso actualizado (6-12): ${this.answeredQuestions}/${this.totalQuestions} = ${this.progressPercentage}%`);
  }

  private initializeForm(): void {
    const controls: any = {};
    
    // Campos de información del niño
    controls['nombreNino'] = [''];
    controls['edad'] = ['', [Validators.min(6), Validators.max(12)]];
    controls['fechaEvaluacion'] = [new Date().toISOString().split('T')[0]];
    controls['evaluador'] = [''];
    controls['observaciones'] = [''];
    
    // Agregar controles para todas las preguntas
    [...this.preguntasParticipacion, ...this.preguntasVision, ...this.preguntasOido, 
     ...this.preguntasTacto, ...this.preguntasGustoOlfato, ...this.preguntasConcienciaCuerpo,
     ...this.preguntasEquilibrioMovimiento, ...this.preguntasPlanificacionIdeas].forEach(pregunta => {
      controls[`pregunta_${pregunta.id}`] = [''];
    });
    
    this.formularioParticipacion = this.fb.group(controls);
  }

  // Método para guardar evaluación sin requerir 100% de completitud
  saveEvaluation(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const accion = this.evaluacionData ? 'Actualizando' : 'Guardando';
    console.log(`🚀 ${accion} evaluación (6-12 años) en tabla EvaluacionesSensoriales`);

    if (!this.paciente) {
      alert('⚠️ No hay paciente seleccionado. Por favor, selecciona un paciente antes de guardar.');
      return;
    }

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
    const estado = progreso === 100 ? 'Completada' : 'En Progreso';
    
    const evaluacionData: EvaluacionSensorial = {
      idEvaluacion: this.evaluacionData?.idEvaluacion,
      idPaciente: parseInt(this.paciente.idPaciente || this.paciente.id),
      progreso: progreso,
      respuestas: responses,
      tipoFormulario: '6-12',
      evaluadorNombre: this.formularioParticipacion.value.evaluador || 'Dr. Evaluador (6-12 años)',
      evaluadorCorreo: 'evaluador@test.com',
      observaciones: this.formularioParticipacion.value.observaciones || `Evaluación 6-12 años ${accion.toLowerCase()} el ${new Date().toLocaleString()}`,
      estado: estado
    };

    console.log('💾 Datos de evaluación preparados:', evaluacionData);

    this.evaluacionService.guardarEvaluacion(evaluacionData).subscribe({
      next: (response) => {
        console.log(`✅ Evaluación ${accion.toLowerCase()} exitosamente:`, response);
        const mensaje = this.evaluacionData 
          ? `✅ Evaluación actualizada exitosamente para ${this.paciente.nombre}`
          : `✅ Evaluación guardada exitosamente para ${this.paciente.nombre}`;
        
        alert(`${mensaje}\nProgreso: ${progreso}%\nEstado: ${estado}`);
      },
      error: (error) => {
        console.error(`❌ Error al ${accion.toLowerCase()} evaluación:`, error);
        alert(`❌ Error al ${accion.toLowerCase()} la evaluación en la base de datos.\n\nDetalles: ${error.message}`);
      }
    });
  }

  private collectResponses(): any[] {
    console.log('📝 Recopilando respuestas (6-12)...');
    console.log('📋 Estado actual del formulario:', this.formularioParticipacion.value);
    
    const responses: any[] = [];
    const formValue = this.formularioParticipacion.value;
    
    Object.keys(formValue).forEach(controlName => {
      if (controlName.startsWith('pregunta_') && formValue[controlName]) {
        const preguntaId = controlName.replace('pregunta_', '');
        const valor = formValue[controlName];
        const preguntaTexto = this.findQuestionText(parseInt(preguntaId));
        
        responses.push({
          id: parseInt(preguntaId),
          name: controlName,
          pregunta: preguntaTexto,
          respuesta: valor,
          puntaje: this.getScoreFromValue(valor)
        });
        
        console.log(`📝 Respuesta desde FormGroup (6-12): ${controlName} = ${valor}`);
      }
    });
    
    // Si no hay respuestas del FormGroup, usar el DOM como respaldo
    if (responses.length === 0) {
      const checkedInputs = document.querySelectorAll('input[type="radio"]:checked');
      console.log(`📊 Usando respuestas del DOM como respaldo (6-12): ${checkedInputs.length}`);
      
      checkedInputs.forEach((input: any, index) => {
        const match = input.name.match(/pregunta_(\d+)/);
        const preguntaId = match ? parseInt(match[1]) : index + 1;
        const preguntaTexto = this.findQuestionText(preguntaId);
        
        responses.push({
          id: preguntaId,
          name: input.name,
          pregunta: preguntaTexto,
          respuesta: input.value,
          puntaje: this.getScoreFromValue(input.value)
        });
      });
    }
    
    console.log(`📊 Total de respuestas recopiladas (6-12): ${responses.length}`);
    return responses;
  }

  private findQuestionText(preguntaId: number): string {
    const todasLasPreguntas = [
      ...this.preguntasParticipacion, ...this.preguntasVision, ...this.preguntasOido,
      ...this.preguntasTacto, ...this.preguntasGustoOlfato, ...this.preguntasConcienciaCuerpo,
      ...this.preguntasEquilibrioMovimiento, ...this.preguntasPlanificacionIdeas
    ];
    
    const pregunta = todasLasPreguntas.find(p => p.id === preguntaId);
    return pregunta ? `${preguntaId}. ${pregunta.texto}` : `Pregunta ${preguntaId}`;
  }

  private getScoreFromValue(value: string): number {
    switch(value) {
      case 'N': return 1;  // Nunca
      case 'O': return 2;  // Ocasionalmente
      case 'F': return 3;  // Frecuentemente
      case 'S': return 4;  // Siempre
      default: return 2;
    }
  }

  hasAnswers(): boolean {
    const checkedInputs = document.querySelectorAll('input[type="radio"]:checked');
    const hasAnswers = checkedInputs.length > 0;
    console.log(`🔍 hasAnswers() verificando (6-12)... ${checkedInputs.length} respuestas encontradas`);
    return hasAnswers;
  }

  get currentProgress(): number {
    const progress = this.totalQuestions > 0 ? Math.round((this.answeredQuestions / this.totalQuestions) * 100) : 0;
    console.log(`📊 currentProgress (6-12): ${progress}% (${this.answeredQuestions}/${this.totalQuestions})`);
    return progress;
  }

  debugFormState(): void {
    console.log('🔧 === DEBUG: Estado del Formulario (6-12) ===');
    console.log('📋 FormGroup valid:', this.formularioParticipacion.valid);
    console.log('📋 FormGroup value:', this.formularioParticipacion.value);
    
    const preguntaControls = Object.keys(this.formularioParticipacion.controls)
      .filter(key => key.startsWith('pregunta_'));
    
    console.log(`📊 Controles de preguntas encontrados (6-12): ${preguntaControls.length}`);
    
    let controlsWithValues = 0;
    preguntaControls.forEach(controlName => {
      const control = this.formularioParticipacion.get(controlName);
      if (control && control.value) {
        controlsWithValues++;
        console.log(`✅ ${controlName}: ${control.value}`);
      }
    });
    
    console.log(`📊 Controles con valores (6-12): ${controlsWithValues}/${preguntaControls.length}`);
    
    const checkedRadios = document.querySelectorAll('input[type="radio"]:checked');
    console.log(`🔘 Radio buttons marcados en DOM (6-12): ${checkedRadios.length}`);
    console.log('🔧 === FIN DEBUG (6-12) ===');
  }

  private cargarDatosEvaluacion(): void {
    if (!this.evaluacionData) return;

    console.log('🔄 Cargando datos de evaluación existente (6-12):', this.evaluacionData);
    console.log('📋 Estructura completa de respuestas (6-12):', this.evaluacionData.respuestas);

    // Cargar información básica
    if (this.evaluacionData.nombreCompleto) {
      this.formularioParticipacion.patchValue({
        nombreNino: this.evaluacionData.nombreCompleto || '',
        edad: '',
        fechaEvaluacion: this.evaluacionData.fechaEvaluacion ? this.evaluacionData.fechaEvaluacion.split('T')[0] : '',
        evaluador: this.evaluacionData.evaluadorNombre || '',
        observaciones: this.evaluacionData.observaciones || ''
      });
      console.log('📝 Información básica cargada (6-12)');
    }

    // Preparar objeto para patchValue
    const formValues: any = {};
    let respuestasCargadas = 0;

    if (this.evaluacionData.respuestas) {
      try {
        let respuestasArray: any[] = [];
        
        // Parsear respuestas según el formato
        if (typeof this.evaluacionData.respuestas === 'string') {
          const parsedData = JSON.parse(this.evaluacionData.respuestas);
          console.log('📋 Datos parseados desde string (6-12):', parsedData);
          respuestasArray = parsedData;
        } else if (Array.isArray(this.evaluacionData.respuestas)) {
          respuestasArray = this.evaluacionData.respuestas;
        } else if (this.evaluacionData.respuestas.respuestas) {
          respuestasArray = this.evaluacionData.respuestas.respuestas;
        }

        console.log('📋 Array de respuestas final para procesar (6-12):', respuestasArray);
        console.log('📊 Cantidad de respuestas a procesar (6-12):', respuestasArray.length);

        // Mapear respuestas al formato del formulario
        respuestasArray.forEach((respuesta: any, index: number) => {
          console.log(`🔍 Procesando respuesta ${index + 1} (6-12):`, respuesta);
          
          let preguntaId = null;
          let valorRespuesta = null;
          
          // Buscar diferentes estructuras posibles
          if (respuesta.id && respuesta.respuesta) {
            preguntaId = respuesta.id;
            valorRespuesta = respuesta.respuesta;
          } else if (respuesta.preguntaId && respuesta.respuesta) {
            preguntaId = respuesta.preguntaId;
            valorRespuesta = respuesta.respuesta;
          } else if (respuesta.name && respuesta.respuesta) {
            const match = respuesta.name.match(/pregunta[_]?(\d+)/);
            if (match) {
              preguntaId = parseInt(match[1]);
              valorRespuesta = respuesta.respuesta;
            }
          } else if (respuesta.respuesta && !preguntaId) {
            preguntaId = index + 1;
            valorRespuesta = respuesta.respuesta;
          }

          if (preguntaId && valorRespuesta) {
            const controlName = `pregunta_${preguntaId}`;
            
            // Limpiar y validar el valor de respuesta
            let valorMapeado = valorRespuesta.toString().trim().toUpperCase();
            
            if (valorMapeado === 'ON' || valorMapeado === 'TRUE') {
              if (respuesta.puntaje) {
                switch(respuesta.puntaje) {
                  case 1: valorMapeado = 'N'; break;
                  case 2: valorMapeado = 'O'; break;
                  case 3: valorMapeado = 'F'; break;
                  case 4: valorMapeado = 'S'; break;
                  default: valorMapeado = 'O'; break;
                }
              } else {
                valorMapeado = 'O';
              }
            }
            
            if (['N', 'O', 'F', 'S'].includes(valorMapeado)) {
              formValues[controlName] = valorMapeado;
              respuestasCargadas++;
              console.log(`✅ Respuesta ${respuestasCargadas} (6-12): ${controlName} = ${valorMapeado}`);
            } else {
              console.warn(`⚠️ Valor inválido para ${controlName}: ${valorMapeado}`);
            }
          } else {
            console.warn(`⚠️ No se pudo procesar respuesta ${index + 1} (6-12):`, respuesta);
          }
        });

      } catch (error) {
        console.error('❌ Error al parsear respuestas (6-12):', error);
      }
    }

    console.log(`📊 Total de respuestas procesadas (6-12): ${respuestasCargadas}`);
    console.log('📋 Valores preparados para el formulario (6-12):', formValues);

    // Aplicar todos los valores de una vez usando patchValue
    if (Object.keys(formValues).length > 0) {
      this.formularioParticipacion.patchValue(formValues);
      console.log(`✅ ${respuestasCargadas} respuestas aplicadas al formulario (6-12)`);
      
      // Forzar detección de cambios y actualización del progreso
      setTimeout(() => {
        this.updateProgress();
        console.log('✅ Progreso actualizado después de cargar datos (6-12)');
        
        // Verificar que los radio buttons están seleccionados
        const checkedRadios = document.querySelectorAll('input[type="radio"]:checked');
        console.log(`🔘 Radio buttons seleccionados después de cargar (6-12): ${checkedRadios.length}`);
      }, 300);
    } else {
      console.warn('⚠️ No se aplicaron valores al formulario (6-12)');
    }

    console.log('✅ Carga de datos de evaluación completada (6-12)');
  }

  // Método original onSubmit (mantenido para compatibilidad)
  onSubmit(): void {
    if (this.formularioParticipacion.valid) {
      this.loading = true;
      this.mensaje = '';
      this.tipoMensaje = '';

      if (!this.paciente) {
        this.mensaje = 'Error: No hay paciente seleccionado.';
        this.tipoMensaje = 'error';
        this.loading = false;
        return;
      }

      // Preparar datos para enviar (formato específico para evaluaciones)
      const datosEvaluacion = {
        idPaciente: this.paciente.idPaciente || this.paciente.id || this.paciente.rut,
        informacionNino: {
          nombre: this.formularioParticipacion.value.nombreNino,
          edad: this.formularioParticipacion.value.edad,
          fechaEvaluacion: this.formularioParticipacion.value.fechaEvaluacion,
          evaluador: this.formularioParticipacion.value.evaluador,
          observaciones: this.formularioParticipacion.value.observaciones
        },
        respuestasParticipacion: this.preguntasParticipacion.map(pregunta => ({
          preguntaId: pregunta.id,
          preguntaTexto: pregunta.texto,
          respuesta: this.formularioParticipacion.value[`pregunta_${pregunta.id}`] || 'Sin respuesta'
        })),
        respuestasVision: this.preguntasVision.map(pregunta => ({
          preguntaId: pregunta.id,
          preguntaTexto: pregunta.texto,
          respuesta: this.formularioParticipacion.value[`pregunta_${pregunta.id}`] || 'Sin respuesta'
        })),
        respuestasOido: this.preguntasOido.map(pregunta => ({
          preguntaId: pregunta.id,
          preguntaTexto: pregunta.texto,
          respuesta: this.formularioParticipacion.value[`pregunta_${pregunta.id}`] || 'Sin respuesta'
        })),
        respuestasTacto: this.preguntasTacto.map(pregunta => ({
          preguntaId: pregunta.id,
          preguntaTexto: pregunta.texto,
          respuesta: this.formularioParticipacion.value[`pregunta_${pregunta.id}`] || 'Sin respuesta'
        })),
        respuestasGustoOlfato: this.preguntasGustoOlfato.map(pregunta => ({
          preguntaId: pregunta.id,
          preguntaTexto: pregunta.texto,
          respuesta: this.formularioParticipacion.value[`pregunta_${pregunta.id}`] || 'Sin respuesta'
        })),
        respuestasConcienciaCuerpo: this.preguntasConcienciaCuerpo.map(pregunta => ({
          preguntaId: pregunta.id,
          preguntaTexto: pregunta.texto,
          respuesta: this.formularioParticipacion.value[`pregunta_${pregunta.id}`] || 'Sin respuesta'
        })),
        respuestasEquilibrioMovimiento: this.preguntasEquilibrioMovimiento.map(pregunta => ({
          preguntaId: pregunta.id,
          preguntaTexto: pregunta.texto,
          respuesta: this.formularioParticipacion.value[`pregunta_${pregunta.id}`] || 'Sin respuesta'
        })),
        respuestasPlanificacionIdeas: this.preguntasPlanificacionIdeas.map(pregunta => ({
          preguntaId: pregunta.id,
          preguntaTexto: pregunta.texto,
          respuesta: this.formularioParticipacion.value[`pregunta_${pregunta.id}`] || 'Sin respuesta'
        }))
      };

      console.log('Datos a enviar:', datosEvaluacion);

      this.evaluacionService.guardarEvaluacionFormulario612(datosEvaluacion).subscribe({
        next: (response) => {
          console.log('Evaluación sensorial guardada exitosamente:', response);
          this.mensaje = `Evaluación sensorial de ${this.formularioParticipacion.value.nombreNino} guardada correctamente en la base de datos.`;
          this.tipoMensaje = 'success';
          this.loading = false;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (error) => {
          console.error('Error al guardar evaluación:', error);
          this.mensaje = `Error al guardar la evaluación: ${error.error?.message || error.message || 'Error desconocido'}`;
          this.tipoMensaje = 'error';
          this.loading = false;
        }
      });

    } else {
      this.markFormGroupTouched();
      this.mensaje = 'Por favor, complete los campos de información básica (Nombre, Edad, Fecha de Evaluación y Evaluador)';
      this.tipoMensaje = 'error';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.formularioParticipacion.controls).forEach(key => {
      const control = this.formularioParticipacion.get(key);
      control?.markAsDirty();
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
    if (control?.errors && (control.dirty || control.touched)) {
      if (control.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (control.errors['min']) {
        return `El valor mínimo es ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `El valor máximo es ${control.errors['max'].max}`;
      }
    }
    return '';
  }

  limpiarMensaje(): void {
    this.mensaje = '';
    this.tipoMensaje = '';
  }

  // Método para navegar al tope del componente
  scrollToTop(): void {
    try {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    } catch (error) {
      // Fallback para navegadores más antiguos
      window.scrollTo(0, 0);
    }
  }

  irAlInicio(): void {
    this.scrollToTop();
  }

  // Métodos de pacientes (mantenidos del original)
  abrirModalPacientes(): void {
    console.log('Abriendo modal de pacientes...');
    this.mostrarModalPacientes = true;
    this.cargarListaPacientes();
  }

  cerrarModalPacientes(): void {
    console.log('Cerrando modal de pacientes...');
    this.mostrarModalPacientes = false;
    this.listaPacientes = [];
  }

  cargarListaPacientes(): void {
    this.loadingPacientes = true;
    
    this.pacienteService.obtenerPacientesCompletos().subscribe({
      next: (pacientes) => {
        this.listaPacientes = pacientes;
        this.loadingPacientes = false;
        console.log('Lista de pacientes cargada:', pacientes);
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
        this.loadingPacientes = false;
        this.mensaje = 'Error al cargar la lista de pacientes';
        this.tipoMensaje = 'error';
      }
    });
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CL');
  }

  formatearNombreCompleto(paciente: any): string {
    const nombres = [paciente.nombre, paciente.apellidoPaterno, paciente.apellidoMaterno]
      .filter(n => n && n.trim() !== '')
      .join(' ');
    return nombres || 'N/A';
  }

  cargarPacienteEnFormulario(paciente: any): void {
    this.limpiarMensaje();
    
    this.formularioParticipacion.patchValue({
      nombreNino: this.formatearNombreCompleto(paciente),
      edad: this.calcularEdad(paciente.fechaNacimiento) || '',
      fechaEvaluacion: new Date().toISOString().split('T')[0],
      evaluador: '',
      observaciones: `Evaluación para paciente ID: ${paciente.idPaciente} - RUT: ${paciente.rut}`
    });

    this.cerrarModalPacientes();
    this.mensaje = `Datos de ${this.formatearNombreCompleto(paciente)} cargados en el formulario de evaluación`;
    this.tipoMensaje = 'success';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('Paciente cargado en formulario de evaluación:', paciente);
  }

  onPacienteSeleccionado(event: any): void {
    const nombreSeleccionado = event.target.value;
    
    if (nombreSeleccionado) {
      const pacienteSeleccionado = this.listaPacientes.find(p => 
        this.formatearNombreCompleto(p) === nombreSeleccionado
      );
      
      if (pacienteSeleccionado) {
        this.formularioParticipacion.patchValue({
          edad: this.calcularEdad(pacienteSeleccionado.fechaNacimiento) || '',
          fechaEvaluacion: new Date().toISOString().split('T')[0],
          observaciones: `Evaluación para paciente ID: ${pacienteSeleccionado.idPaciente} - RUT: ${pacienteSeleccionado.rut}`
        });
        
        this.mensaje = `Datos de ${nombreSeleccionado} cargados correctamente`;
        this.tipoMensaje = 'success';
        console.log('Paciente seleccionado desde dropdown:', pacienteSeleccionado);
      }
    } else {
      this.formularioParticipacion.patchValue({
        edad: '',
        observaciones: ''
      });
      this.limpiarMensaje();
    }
  }

  private calcularEdad(fechaNacimiento: string): number | null {
    if (!fechaNacimiento) return null;
    
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimiento = nacimiento.getMonth();
    
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }

  irAEvaluacion(pacienteId: number): void {
    console.log('Cargando evaluación para paciente ID:', pacienteId);
    
    const paciente = this.listaPacientes.find(p => p.idPaciente === pacienteId);
    if (paciente) {
      this.cargarPacienteEnFormulario(paciente);
    } else {
      this.mensaje = 'No se pudo cargar los datos del paciente';
      this.tipoMensaje = 'error';
    }
  }
}
