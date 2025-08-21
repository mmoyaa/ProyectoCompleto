import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { PacienteService } from 'src/app/services/paciente.service';
import { EvaluacionService } from 'src/app/services/evaluacion.service';

@Component({
  selector: 'app-formulario-6-12',
  templateUrl: './formulario-6-12.component.html',
  styleUrls: ['./formulario-6-12.component.css']
})
export class Formulario612Component implements OnInit {
  @Input() paciente: any;
  formularioParticipacion!: FormGroup;
  loading = false;
  mensaje = '';
  tipoMensaje: 'success' | 'error' | '' = '';
  
  // Variables para el modal de pacientes
  mostrarModalPacientes = false;
  listaPacientes: any[] = [];
  loadingPacientes = false;

  // Preguntas de participación social
  preguntasParticipacion = [
    {
      id: 1,
      texto: 'Juega con amigos/as de manera cooperativa (sin muchos argumentos).'
    },
    {
      id: 2,
      texto: 'Se relaciona de modo apropiado con padres de familia y otros adultos importantes (se comunica bien, sigue las instrucciones, demuestra respeto, etc.).'
    },
    {
      id: 3,
      texto: 'Comparte cosas cuando se le pide.'
    },
    {
      id: 4,
      texto: 'Puede conversar sin pararse ni sentarse demasiado cerca de los demás.'
    },
    {
      id: 5,
      texto: 'Mantiene contacto visual apropiado mientras conversa.'
    },
    {
      id: 6,
      texto: 'Se une a jugar con otros sin perturbar lo que están haciendo.'
    },
    {
      id: 7,
      texto: 'Participa en conversaciones e interacciones apropiadas durante las comidas.'
    },
    {
      id: 8,
      texto: 'Participa apropiadamente en salidas familiares, como yendo a comer a un restaurante o yendo al parque o al museo.'
    },
    {
      id: 9,
      texto: 'Participa apropiadamente en reuniones familiares, como las de días feriados, bodas, o cumpleaños.'
    },
    {
      id: 10,
      texto: 'Participa apropiadamente en actividades con amigos, tal como fiestas, yendo al centro comercial, y montando bicicletas/monopatines/escúteres.'
    }
  ];

  // Preguntas de visión
  preguntasVision = [
    {
      id: 11,
      texto: 'Parece sentir molestia por la luz, especialmente luz fuerte (pestaña, cierra o entrecierra los ojos, llora, etc.).'
    },
    {
      id: 12,
      texto: 'Tiene problemas encontrando un objeto cuando este forma parte de un grupo de otras cosas.'
    },
    {
      id: 13,
      texto: 'Cierra un ojo o ladea la cabeza cuando mira algo o a alguien.'
    },
    {
      id: 14,
      texto: 'Se angustia en ambientes que son visualmente inusuales, como un cuarto con mucha luz y colores vivos o un cuarto con muy poca luz.'
    },
    {
      id: 15,
      texto: 'Tiene dificultad controlando el movimiento de sus ojos cuando sigue los movimientos de objetos, como una pelota, con los ojos.'
    },
    {
      id: 16,
      texto: 'Tiene dificultad en reconocer la similitud o diferencia entre objetos en base a sus colores, formas, o tamaños.'
    },
    {
      id: 17,
      texto: 'Disfruta más que la mayoría de niños de su edad mirando objetos que giran o que se mueven.'
    },
    {
      id: 18,
      texto: 'Se tropieza con objetos o con gente como si no estuvieran allí.'
    },
    {
      id: 19,
      texto: 'Disfruta prendiendo y apagando los interruptores de la luz repetidamente.'
    },
    {
      id: 20,
      texto: 'Tiene aversión a ciertos tipos de luces, como el sol de mediodía, luces que parpadean, o luces estroboscópicas o fluorescentes.'
    },
    {
      id: 21,
      texto: 'Disfruta mirando de reojo a objetos en movimiento.'
    }
  ];

  // Preguntas de oído
  preguntasOido = [
    {
      id: 22,
      texto: 'Parece fastidiarse con sonidos comunes de la casa, como la aspiradora, secadora de pelo, o el sonido de jalar la cadena del wáter.'
    },
    {
      id: 23,
      texto: 'Responde de manera negativa a ruidos fuertes, ausentándose, llorando, o tapándose las orejas con las manos.'
    },
    {
      id: 24,
      texto: 'Parece no oír ciertos sonidos.'
    },
    {
      id: 25,
      texto: 'Parece perturbarse por, o estar intensamente interesado/a en, sonidos que otros generalmente no notan.'
    },
    {
      id: 26,
      texto: 'Parece temerle a sonidos que no angustian a otros chicos de su edad.'
    },
    {
      id: 27,
      texto: 'Parece distraerse fácilmente por ruidos del ambiente, como una segadora, un acondicionador de aire, un refrigerador, o luces fluorescentes.'
    },
    {
      id: 28,
      texto: 'Disfruta al hacer que ciertos sonidos sucedan repetidamente, como jalando la cadena del wáter varias veces.'
    },
    {
      id: 29,
      texto: 'Demuestra angustia ante sonidos agudos o metálicos, como pitos, juguetes ruidosos, flautas, y trompetas.'
    }
  ];

  // Preguntas de tacto
  preguntasTacto = [
    {
      id: 30,
      texto: 'Se zafa al ser tocado/a levemente.'
    },
    {
      id: 31,
      texto: 'Parece no estar consciente, como es normal, cuando lo/la tocan.'
    },
    {
      id: 32,
      texto: 'Se angustia con la sensación de la ropa nueva.'
    },
    {
      id: 33,
      texto: 'Prefiere tocar a ser tocado/a.'
    },
    {
      id: 34,
      texto: 'Se angustia cuando se le cortan las uñas de las manos o de los pies.'
    },
    {
      id: 35,
      texto: 'Parece fastidiarse cuando alguien le toca la cara.'
    },
    {
      id: 36,
      texto: 'Evita tocar o jugar con pinturas, pasta, arena, arcilla, barro, pegamento, u otras cosas sucias.'
    },
    {
      id: 37,
      texto: 'Tolera dolores fuertes sin problema.'
    },
    {
      id: 38,
      texto: 'Tiene aversión a cepillarse los dientes, más que a la mayoría de niños de su edad.'
    },
    {
      id: 39,
      texto: 'Parece disfrutar de sensaciones que deberían causar dolor, como al tirarse al suelo o golpear su propio cuerpo.'
    },
    {
      id: 40,
      texto: 'Tiene dificultad encontrando algo en un bolsillo, en una bolsa, o en una mochila solo al tacto (sin mirar).'
    }
  ];

  // Preguntas de gusto y olfato
  preguntasGustoOlfato = [
    {
      id: 41,
      texto: 'Disfruta probando cosas que no son de comer, como pegamento o pintura.'
    },
    {
      id: 42,
      texto: 'Siente náuseas al pensar en comida que no lo agrada, como espinacas cocidas.'
    },
    {
      id: 43,
      texto: 'Disfruta oliendo cosas que no son de comer o oliendo a las personas.'
    },
    {
      id: 44,
      texto: 'Se angustia con olores ante los cuales otros niños no reaccionan.'
    },
    {
      id: 45,
      texto: 'Parece ignorar o no notar olores fuertes a los cuales otros niños reaccionan.'
    }
  ];

  // Preguntas de conciencia del cuerpo
  preguntasConcienciaCuerpo = [
    {
      id: 46,
      texto: 'Agarra objetos (como un lápiz o una cuchara) tan ceñidamente que le es difícil usarlos.'
    },
    {
      id: 47,
      texto: 'Parece estar impulsado/a hacia actividades como empujar, jalar, arrastrar, levantar, o saltar.'
    },
    {
      id: 48,
      texto: 'Parece no estar seguro/a de cuanto elevar o bajar su cuerpo al hacer movimientos como sentarse o pasar por encima de un objeto.'
    },
    {
      id: 49,
      texto: 'Agarra objetos (como un lápiz o una cuchara) tan levemente que le es difícil usarlos.'
    },
    {
      id: 50,
      texto: 'Parece ejercer demasiada presión para lo que hace, como caminando muy pesadamente, tirando puertas, o presionando muy fuerte al usar lápices o crayones.'
    },
    {
      id: 51,
      texto: 'Salta muy a menudo.'
    },
    {
      id: 52,
      texto: 'Tiende a acariciar animales mascotas con demasiada fuerza.'
    },
    {
      id: 53,
      texto: 'Se tropieza con otros niños o los empuja.'
    },
    {
      id: 54,
      texto: 'Mastica juguetes, ropa, u otros objetos más que otros niños.'
    },
    {
      id: 55,
      texto: 'Rompe cosas al presionarlas o empujarlas demasiado fuerte.'
    }
  ];

  // Preguntas de equilibrio y movimiento
  preguntasEquilibrioMovimiento = [
    {
      id: 56,
      texto: 'Parece tenerle excesivo temor a movimientos, como subir y bajar escaleras, columpiarse, o jugar en los sube y baja, los toboganes, u otros equipos del campo de recreo.'
    },
    {
      id: 57,
      texto: 'Tiene buen equilibrio.'
    },
    {
      id: 58,
      texto: 'Evita actividades que requieren equilibrio, como caminar en el bordillo de la acera o en un suelo desigual.'
    },
    {
      id: 59,
      texto: 'Se cae de la silla al mover su cuerpo.'
    },
    {
      id: 60,
      texto: 'No puede sujetarse al caerse.'
    },
    {
      id: 61,
      texto: 'Parece no marearse cuando otros generalmente se marean.'
    },
    {
      id: 62,
      texto: 'Gira o le da vueltas a su cuerpo más que otros niños.'
    },
    {
      id: 63,
      texto: 'Demuestra angustia cuando su cabeza se ladea y no está en la posición erguida y vertical.'
    },
    {
      id: 64,
      texto: 'Demuestra mala coordinación y parece ser torpe.'
    },
    {
      id: 65,
      texto: 'Parece tener miedo de subir en ascensores o escaleras mecánicas.'
    },
    {
      id: 66,
      texto: 'Se apoya en otra gente o en un mueble al sentarse o al tratar de pararse.'
    }
  ];

  // Preguntas de planificación e ideas
  preguntasPlanificacionIdeas = [
    {
      id: 67,
      texto: 'Se desempeña inconsecuentemente en las tareas de la vida diaria.'
    },
    {
      id: 68,
      texto: 'Tiene problemas decidiendo como cargar varios objetos al mismo tiempo.'
    },
    {
      id: 69,
      texto: 'Parece confundirse sobre como guardar materiales o pertenencias en los lugares apropiados.'
    },
    {
      id: 70,
      texto: 'No hace las tareas, como vestirse o poner la mesa, siguiendo una secuencia apropiada.'
    },
    {
      id: 71,
      texto: 'No completa las tareas que requieren varios pasos.'
    },
    {
      id: 72,
      texto: 'Tiene dificultad imitando acciones que se le demuestran, como juegos o canciones con movimiento.'
    },
    {
      id: 73,
      texto: 'Tiene dificultad construyendo a base de un modelo, como al usar Legos o bloques para construir algo semejante al modelo.'
    },
    {
      id: 74,
      texto: 'Tiene dificultad para inventar ideas para nuevos juegos y actividades.'
    },
    {
      id: 75,
      texto: 'Tiende a jugar en lo mismo repetidamente en vez de cambiar a nuevas actividades cuando se le ofrece la oportunidad.'
    }
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
    // Cargar la lista de pacientes automáticamente
    this.cargarListaPacientes();
  }

  private initializeForm(): void {
    const controls: any = {};
    
    // Campos de información del niño
  controls['nombreNino'] = [''];
  controls['edad'] = ['', [Validators.min(6), Validators.max(12)]];
  controls['fechaEvaluacion'] = [new Date().toISOString().split('T')[0]];
  controls['evaluador'] = [''];
    controls['observaciones'] = [''];
    
    // Agregar controles para participación social
    this.preguntasParticipacion.forEach(pregunta => {
      controls[`pregunta_${pregunta.id}`] = [''];
    });
    
    // Agregar controles para visión
    this.preguntasVision.forEach(pregunta => {
      controls[`pregunta_${pregunta.id}`] = [''];
    });
    
    // Agregar controles para oído
    this.preguntasOido.forEach(pregunta => {
      controls[`pregunta_${pregunta.id}`] = [''];
    });
    
    // Agregar controles para tacto
    this.preguntasTacto.forEach(pregunta => {
      controls[`pregunta_${pregunta.id}`] = [''];
    });
    
    // Agregar controles para gusto y olfato
    this.preguntasGustoOlfato.forEach(pregunta => {
      controls[`pregunta_${pregunta.id}`] = [''];
    });
    
    // Agregar controles para conciencia del cuerpo
    this.preguntasConcienciaCuerpo.forEach(pregunta => {
      controls[`pregunta_${pregunta.id}`] = [''];
    });
    
    // Agregar controles para equilibrio y movimiento
    this.preguntasEquilibrioMovimiento.forEach(pregunta => {
      controls[`pregunta_${pregunta.id}`] = [''];
    });
    
    // Agregar controles para planificación e ideas
    this.preguntasPlanificacionIdeas.forEach(pregunta => {
      controls[`pregunta_${pregunta.id}`] = [''];
    });
    
    this.formularioParticipacion = this.fb.group(controls);
  }

  onSubmit(): void {
    if (this.formularioParticipacion.valid) {
      this.loading = true;
      this.mensaje = '';
      this.tipoMensaje = '';

      // Usar el paciente recibido por @Input()
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

      // Guardar usando el servicio de evaluación específico
      this.evaluacionService.guardarEvaluacionFormulario612(datosEvaluacion).subscribe({
        next: (response) => {
          console.log('Evaluación sensorial guardada exitosamente:', response);
          this.mensaje = `Evaluación sensorial de ${this.formularioParticipacion.value.nombreNino} guardada correctamente en la base de datos.`;
          this.tipoMensaje = 'success';
          this.loading = false;
          
          // Scroll hacia arriba para mostrar el mensaje
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

  // Método para obtener errores de validación
  getErrorMessage(fieldName: string): string {
    const control = this.formularioParticipacion.get(fieldName);
    if (control?.errors && control.touched) {
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

  // Método para limpiar mensajes
  limpiarMensaje(): void {
    this.mensaje = '';
    this.tipoMensaje = '';
  }

  // Método para calcular puntuación (opcional)
  calcularPuntuacion(): void {
    // Calcular puntuación de Participación Social
    const respuestasParticipacion = this.preguntasParticipacion.map(pregunta => 
      this.formularioParticipacion.value[`pregunta_${pregunta.id}`]
    );

    const puntuacionesParticipacion: number[] = respuestasParticipacion.map(respuesta => {
      switch(respuesta) {
        case 'N': return 0;
        case 'O': return 1;
        case 'F': return 2;
        case 'S': return 3;
        default: return 0;
      }
    });

    // Calcular puntuación de Visión
    const respuestasVision = this.preguntasVision.map(pregunta => 
      this.formularioParticipacion.value[`pregunta_${pregunta.id}`]
    );

    const puntuacionesVision: number[] = respuestasVision.map(respuesta => {
      switch(respuesta) {
        case 'N': return 0;
        case 'O': return 1;
        case 'F': return 2;
        case 'S': return 3;
        default: return 0;
      }
    });

    // Calcular puntuación de Oído
    const respuestasOido = this.preguntasOido.map(pregunta => 
      this.formularioParticipacion.value[`pregunta_${pregunta.id}`]
    );

    const puntuacionesOido: number[] = respuestasOido.map(respuesta => {
      switch(respuesta) {
        case 'N': return 0;
        case 'O': return 1;
        case 'F': return 2;
        case 'S': return 3;
        default: return 0;
      }
    });

    // Calcular puntuación de Tacto
    const respuestasTacto = this.preguntasTacto.map(pregunta => 
      this.formularioParticipacion.value[`pregunta_${pregunta.id}`]
    );

    const puntuacionesTacto: number[] = respuestasTacto.map(respuesta => {
      switch(respuesta) {
        case 'N': return 0;
        case 'O': return 1;
        case 'F': return 2;
        case 'S': return 3;
        default: return 0;
      }
    });

    // Calcular puntuación de Gusto y Olfato
    const respuestasGustoOlfato = this.preguntasGustoOlfato.map(pregunta => 
      this.formularioParticipacion.value[`pregunta_${pregunta.id}`]
    );

    const puntuacionesGustoOlfato: number[] = respuestasGustoOlfato.map(respuesta => {
      switch(respuesta) {
        case 'N': return 0;
        case 'O': return 1;
        case 'F': return 2;
        case 'S': return 3;
        default: return 0;
      }
    });

    // Calcular puntuación de Conciencia del Cuerpo
    const respuestasConcienciaCuerpo = this.preguntasConcienciaCuerpo.map(pregunta => 
      this.formularioParticipacion.value[`pregunta_${pregunta.id}`]
    );

    const puntuacionesConcienciaCuerpo: number[] = respuestasConcienciaCuerpo.map(respuesta => {
      switch(respuesta) {
        case 'N': return 0;
        case 'O': return 1;
        case 'F': return 2;
        case 'S': return 3;
        default: return 0;
      }
    });

    // Calcular puntuación de Equilibrio y Movimiento
    const respuestasEquilibrioMovimiento = this.preguntasEquilibrioMovimiento.map(pregunta => 
      this.formularioParticipacion.value[`pregunta_${pregunta.id}`]
    );

    const puntuacionesEquilibrioMovimiento: number[] = respuestasEquilibrioMovimiento.map(respuesta => {
      switch(respuesta) {
        case 'N': return 0;
        case 'O': return 1;
        case 'F': return 2;
        case 'S': return 3;
        default: return 0;
      }
    });

    // Calcular puntuación de Planificación e Ideas
    const respuestasPlanificacionIdeas = this.preguntasPlanificacionIdeas.map(pregunta => 
      this.formularioParticipacion.value[`pregunta_${pregunta.id}`]
    );

    const puntuacionesPlanificacionIdeas: number[] = respuestasPlanificacionIdeas.map(respuesta => {
      switch(respuesta) {
        case 'N': return 0;
        case 'O': return 1;
        case 'F': return 2;
        case 'S': return 3;
        default: return 0;
      }
    });

    const puntuacionTotalParticipacion: number = puntuacionesParticipacion.reduce((sum: number, puntuacion: number) => sum + puntuacion, 0);
    const puntuacionMaximaParticipacion = this.preguntasParticipacion.length * 3;
    const porcentajeParticipacion = Math.round((puntuacionTotalParticipacion / puntuacionMaximaParticipacion) * 100);

    const puntuacionTotalVision: number = puntuacionesVision.reduce((sum: number, puntuacion: number) => sum + puntuacion, 0);
    const puntuacionMaximaVision = this.preguntasVision.length * 3;
    const porcentajeVision = Math.round((puntuacionTotalVision / puntuacionMaximaVision) * 100);

    const puntuacionTotalOido: number = puntuacionesOido.reduce((sum: number, puntuacion: number) => sum + puntuacion, 0);
    const puntuacionMaximaOido = this.preguntasOido.length * 3;
    const porcentajeOido = Math.round((puntuacionTotalOido / puntuacionMaximaOido) * 100);

    const puntuacionTotalTacto: number = puntuacionesTacto.reduce((sum: number, puntuacion: number) => sum + puntuacion, 0);
    const puntuacionMaximaTacto = this.preguntasTacto.length * 3;
    const porcentajeTacto = Math.round((puntuacionTotalTacto / puntuacionMaximaTacto) * 100);

    const puntuacionTotalGustoOlfato: number = puntuacionesGustoOlfato.reduce((sum: number, puntuacion: number) => sum + puntuacion, 0);
    const puntuacionMaximaGustoOlfato = this.preguntasGustoOlfato.length * 3;
    const porcentajeGustoOlfato = Math.round((puntuacionTotalGustoOlfato / puntuacionMaximaGustoOlfato) * 100);

    const puntuacionTotalConcienciaCuerpo: number = puntuacionesConcienciaCuerpo.reduce((sum: number, puntuacion: number) => sum + puntuacion, 0);
    const puntuacionMaximaConcienciaCuerpo = this.preguntasConcienciaCuerpo.length * 3;
    const porcentajeConcienciaCuerpo = Math.round((puntuacionTotalConcienciaCuerpo / puntuacionMaximaConcienciaCuerpo) * 100);

    const puntuacionTotalEquilibrioMovimiento: number = puntuacionesEquilibrioMovimiento.reduce((sum: number, puntuacion: number) => sum + puntuacion, 0);
    const puntuacionMaximaEquilibrioMovimiento = this.preguntasEquilibrioMovimiento.length * 3;
    const porcentajeEquilibrioMovimiento = Math.round((puntuacionTotalEquilibrioMovimiento / puntuacionMaximaEquilibrioMovimiento) * 100);

    const puntuacionTotalPlanificacionIdeas: number = puntuacionesPlanificacionIdeas.reduce((sum: number, puntuacion: number) => sum + puntuacion, 0);
    const puntuacionMaximaPlanificacionIdeas = this.preguntasPlanificacionIdeas.length * 3;
    const porcentajePlanificacionIdeas = Math.round((puntuacionTotalPlanificacionIdeas / puntuacionMaximaPlanificacionIdeas) * 100);

    const puntuacionTotalGeneral = puntuacionTotalParticipacion + puntuacionTotalVision + puntuacionTotalOido + puntuacionTotalTacto + puntuacionTotalGustoOlfato + puntuacionTotalConcienciaCuerpo + puntuacionTotalEquilibrioMovimiento + puntuacionTotalPlanificacionIdeas;
    const puntuacionMaximaGeneral = puntuacionMaximaParticipacion + puntuacionMaximaVision + puntuacionMaximaOido + puntuacionMaximaTacto + puntuacionMaximaGustoOlfato + puntuacionMaximaConcienciaCuerpo + puntuacionMaximaEquilibrioMovimiento + puntuacionMaximaPlanificacionIdeas;
    const porcentajeGeneral = Math.round((puntuacionTotalGeneral / puntuacionMaximaGeneral) * 100);

    console.log('Puntuación calculada:', {
      participacionSocial: {
        puntuacion: puntuacionTotalParticipacion,
        maximo: puntuacionMaximaParticipacion,
        porcentaje: `${porcentajeParticipacion}%`
      },
      vision: {
        puntuacion: puntuacionTotalVision,
        maximo: puntuacionMaximaVision,
        porcentaje: `${porcentajeVision}%`
      },
      oido: {
        puntuacion: puntuacionTotalOido,
        maximo: puntuacionMaximaOido,
        porcentaje: `${porcentajeOido}%`
      },
      tacto: {
        puntuacion: puntuacionTotalTacto,
        maximo: puntuacionMaximaTacto,
        porcentaje: `${porcentajeTacto}%`
      },
      gustoOlfato: {
        puntuacion: puntuacionTotalGustoOlfato,
        maximo: puntuacionMaximaGustoOlfato,
        porcentaje: `${porcentajeGustoOlfato}%`
      },
      concienciaCuerpo: {
        puntuacion: puntuacionTotalConcienciaCuerpo,
        maximo: puntuacionMaximaConcienciaCuerpo,
        porcentaje: `${porcentajeConcienciaCuerpo}%`
      },
      equilibrioMovimiento: {
        puntuacion: puntuacionTotalEquilibrioMovimiento,
        maximo: puntuacionMaximaEquilibrioMovimiento,
        porcentaje: `${porcentajeEquilibrioMovimiento}%`
      },
      planificacionIdeas: {
        puntuacion: puntuacionTotalPlanificacionIdeas,
        maximo: puntuacionMaximaPlanificacionIdeas,
        porcentaje: `${porcentajePlanificacionIdeas}%`
      },
      general: {
        puntuacion: puntuacionTotalGeneral,
        maximo: puntuacionMaximaGeneral,
        porcentaje: `${porcentajeGeneral}%`
      }
    });

    this.mensaje = `Total: ${porcentajeGeneral}% | Participación: ${porcentajeParticipacion}% | Visión: ${porcentajeVision}% | Oído: ${porcentajeOido}% | Tacto: ${porcentajeTacto}% | Gusto/Olfato: ${porcentajeGustoOlfato}% | Conciencia: ${porcentajeConcienciaCuerpo}% | Equilibrio: ${porcentajeEquilibrioMovimiento}% | Planificación: ${porcentajePlanificacionIdeas}%`;
    this.tipoMensaje = 'success';
  }

  // Métodos para manejo de pacientes (igual que en pagina1)
  
  // Método para abrir el modal de pacientes
  abrirModalPacientes(): void {
    console.log('Abriendo modal de pacientes...');
    this.mostrarModalPacientes = true;
    this.cargarListaPacientes();
  }

  // Método para cerrar el modal de pacientes
  cerrarModalPacientes(): void {
    console.log('Cerrando modal de pacientes...');
    this.mostrarModalPacientes = false;
    this.listaPacientes = [];
  }

  // Método para cargar la lista de pacientes
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

  // Método para formatear fecha
  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CL');
  }

  // Método para formatear nombre completo
  formatearNombreCompleto(paciente: any): string {
    const nombres = [paciente.nombre, paciente.apellidoPaterno, paciente.apellidoMaterno]
      .filter(n => n && n.trim() !== '')
      .join(' ');
    return nombres || 'N/A';
  }

  // Método para cargar un paciente seleccionado en el formulario
  cargarPacienteEnFormulario(paciente: any): void {
    // Limpiar mensajes previos
    this.limpiarMensaje();
    
    // Cargar datos del paciente en el formulario de evaluación
    this.formularioParticipacion.patchValue({
      nombreNino: this.formatearNombreCompleto(paciente),
      edad: this.calcularEdad(paciente.fechaNacimiento) || '',
      fechaEvaluacion: new Date().toISOString().split('T')[0],
      evaluador: '',
      observaciones: `Evaluación para paciente ID: ${paciente.idPaciente} - RUT: ${paciente.rut}`
    });

    // Cerrar el modal
    this.cerrarModalPacientes();

    // Mostrar mensaje de confirmación
    this.mensaje = `Datos de ${this.formatearNombreCompleto(paciente)} cargados en el formulario de evaluación`;
    this.tipoMensaje = 'success';

    // Scroll hacia arriba para ver el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log('Paciente cargado en formulario de evaluación:', paciente);
  }

  // Método para manejar la selección de paciente desde el dropdown
  onPacienteSeleccionado(event: any): void {
    const nombreSeleccionado = event.target.value;
    
    if (nombreSeleccionado) {
      // Buscar el paciente completo en la lista
      const pacienteSeleccionado = this.listaPacientes.find(p => 
        this.formatearNombreCompleto(p) === nombreSeleccionado
      );
      
      if (pacienteSeleccionado) {
        // Cargar los datos adicionales del paciente
        this.formularioParticipacion.patchValue({
          edad: this.calcularEdad(pacienteSeleccionado.fechaNacimiento) || '',
          fechaEvaluacion: new Date().toISOString().split('T')[0],
          observaciones: `Evaluación para paciente ID: ${pacienteSeleccionado.idPaciente} - RUT: ${pacienteSeleccionado.rut}`
        });
        
        // Mostrar mensaje de confirmación
        this.mensaje = `Datos de ${nombreSeleccionado} cargados correctamente`;
        this.tipoMensaje = 'success';
        
        console.log('Paciente seleccionado desde dropdown:', pacienteSeleccionado);
      }
    } else {
      // Si no hay selección, limpiar los campos relacionados
      this.formularioParticipacion.patchValue({
        edad: '',
        observaciones: ''
      });
      this.limpiarMensaje();
    }
  }

  // Método para calcular edad (si tienes fecha de nacimiento)
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

  // Método para navegar a la evaluación de un paciente específico
  irAEvaluacion(pacienteId: number): void {
    console.log('Cargando evaluación para paciente ID:', pacienteId);
    
    // Buscar el paciente en la lista
    const paciente = this.listaPacientes.find(p => p.idPaciente === pacienteId);
    if (paciente) {
      this.cargarPacienteEnFormulario(paciente);
    } else {
      this.mensaje = 'No se pudo cargar los datos del paciente';
      this.tipoMensaje = 'error';
    }
  }
}