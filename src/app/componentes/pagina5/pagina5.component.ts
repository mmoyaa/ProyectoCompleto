
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from 'src/app/services/paciente.service';
import { EvaluacionService } from 'src/app/services/evaluacion.service';



@Component({
  selector: 'app-pagina5',
  templateUrl: './pagina5.component.html',
  styleUrls: ['./pagina5.component.css']
})
export class Pagina5Component implements OnInit {
  formularioEvaluacion!: FormGroup;
  loading = false;
  mensaje = '';
  tipoMensaje: 'success' | 'error' | '' = '';
  listaPacientes: any[] = [];
  loadingPacientes = false;
  @Input() paciente: any = null;

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
}
