import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PacienteService } from '../../services/paciente.service';
import { EvaluacionService, EvaluacionSensorial } from '../../services/evaluacion.service';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit, AfterViewInit {
  
  // Variables para datos
  patients: any[] = [];
  selectedPatient: any = null;
  evaluaciones: EvaluacionSensorial[] = [];
  selectedEvaluacion: EvaluacionSensorial | null = null;
  
  // Variables para el gráfico
  chart: Chart | null = null;
  loading: boolean = false;
  
  // Configuración de secciones sensoriales
  secciones = [
    { nombre: 'Visión', preguntas: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], color: '#ec4899' },
    { nombre: 'Auditivo', preguntas: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], color: '#667eea' },
    { nombre: 'Táctil', preguntas: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30], color: '#f59e0b' },
    { nombre: 'Gusto/Olfato', preguntas: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40], color: '#10b981' },
    { nombre: 'Conciencia Corporal', preguntas: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50], color: '#ef4444' },
    { nombre: 'Equilibrio/Movimiento', preguntas: [51, 52, 53, 54, 55, 56, 57, 58, 59, 60], color: '#8b5cf6' },
    { nombre: 'Planificación/Ideas', preguntas: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70], color: '#f97316' },
    { nombre: 'Participación Social', preguntas: [71, 72, 73, 74, 75, 76, 77, 78, 79, 80], color: '#06b6d4' }
  ];

  constructor(
    private pacienteService: PacienteService,
    private evaluacionService: EvaluacionService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  ngAfterViewInit(): void {
    // Esperar a que el DOM esté completamente cargado
    setTimeout(() => {
      this.initializeChart();
    }, 500); // Aumentamos el tiempo de espera
  }

  private loadPatients(): void {
    console.log('📊 Cargando pacientes para gráficos...');
    
    this.pacienteService.obtenerPacientesCompletos().subscribe({
      next: (patients: any) => {
        this.patients = patients;
        console.log(`✅ ${patients.length} pacientes cargados`);
        console.log('📋 Estructura de pacientes:', patients.map((p: any) => ({
          id: p.id,
          idPaciente: p.idPaciente,
          nombre: p.nombre,
          rut: p.rut
        })));
      },
      error: (error: any) => {
        console.error('❌ Error cargando pacientes:', error);
        // Fallback a localStorage
        const storedPatients = localStorage.getItem('pacientes');
        if (storedPatients) {
          this.patients = JSON.parse(storedPatients);
          console.log('📋 Pacientes cargados desde localStorage:', this.patients.length);
        }
      }
    });
  }

  onPatientChange(event: any): void {
    const patientId = event.target.value;
    console.log(`👤 Paciente seleccionado: ${patientId}`);
    console.log(`📋 Tipo de valor: ${typeof patientId}`);
    console.log(`📋 Pacientes disponibles:`, this.patients.map(p => ({ id: p.id || p.idPaciente, nombre: p.nombre })));
    
    if (!patientId || patientId === '') {
      this.selectedPatient = null;
      this.evaluaciones = [];
      this.selectedEvaluacion = null;
      this.clearChart();
      return;
    }

    // Convertir a número para comparación consistente
    const patientIdNum = parseInt(patientId);
    this.selectedPatient = this.patients.find(p => {
      const pid = p.idPaciente || p.id;
      return pid === patientIdNum || pid === patientId;
    });
    
    console.log(`✅ Paciente encontrado:`, this.selectedPatient);
    
    if (this.selectedPatient) {
      this.loadEvaluaciones(patientIdNum);
    } else {
      console.error(`❌ No se encontró paciente con ID: ${patientId}`);
    }
  }

  private loadEvaluaciones(patientId: string | number): void {
    const patientIdNum = typeof patientId === 'string' ? parseInt(patientId) : patientId;
    console.log(`📋 Cargando evaluaciones para paciente ${patientIdNum}...`);
    this.loading = true;

    this.evaluacionService.obtenerEvaluacionesPorPaciente(patientIdNum).subscribe({
      next: (evaluaciones) => {
        this.evaluaciones = evaluaciones;
        this.selectedEvaluacion = null;
        this.loading = false;
        console.log(`✅ ${evaluaciones.length} evaluaciones cargadas`);
        
        if (evaluaciones.length === 0) {
          console.log(`⚠️ No se encontraron evaluaciones para el paciente ${patientIdNum}`);
        } else {
          console.log(`📋 Evaluaciones encontradas:`, evaluaciones.map(e => ({
            id: e.idEvaluacion,
            fecha: e.fechaEvaluacion,
            progreso: e.progreso
          })));
        }
        
        this.clearChart();
      },
      error: (error) => {
        console.error('❌ Error cargando evaluaciones:', error);
        this.evaluaciones = [];
        this.loading = false;
        this.clearChart();
      }
    });
  }

  onEvaluacionChange(event: any): void {
    const evaluacionId = event.target.value;
    console.log(`📋 Evaluación seleccionada: ${evaluacionId}`);
    
    if (!evaluacionId) {
      this.selectedEvaluacion = null;
      this.clearChart();
      return;
    }

    this.selectedEvaluacion = this.evaluaciones.find(e => e.idEvaluacion === parseInt(evaluacionId)) || null;
    
    if (this.selectedEvaluacion) {
      this.generateChart();
    }
  }

  private initializeChart(): void {
    console.log('🎨 Inicializando gráfico...');
    
    const canvas = document.getElementById('evaluacionChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('❌ No se encontró el canvas del gráfico');
      return;
    }

    console.log('✅ Canvas encontrado:', canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ No se pudo obtener el contexto 2D del canvas');
      return;
    }

    console.log('✅ Contexto 2D obtenido');

    // Destruir gráfico existente si hay uno
    if (this.chart) {
      this.chart.destroy();
    }

    // Configuración inicial del gráfico vacío
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: ['Visión', 'Auditivo', 'Táctil', 'Gusto/Olfato', 'Conciencia Corporal', 'Equilibrio/Movimiento', 'Planificación/Ideas', 'Participación Social'],
        datasets: [{
          label: 'Datos de ejemplo',
          data: [3, 2, 4, 3, 2, 3, 4, 3],
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#667eea',
          pointBorderColor: '#667eea',
          pointRadius: 8,
          pointHoverRadius: 10,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Evaluación Sensorial - Resultados por Sección',
            font: {
              size: 18,
              weight: 'bold'
            },
            padding: 20
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            min: 0,
            title: {
              display: true,
              text: 'Puntaje Promedio',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            },
            ticks: {
              stepSize: 1,
              callback: function(value) {
                const labels = ['', 'Nunca', 'Casi Nunca', 'A Veces', 'Frecuentemente', 'Siempre'];
                return labels[Number(value)] || value;
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Secciones Sensoriales',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    try {
      this.chart = new Chart(ctx, config);
      console.log('✅ Gráfico inicializado exitosamente con datos de ejemplo');
    } catch (error) {
      console.error('❌ Error inicializando gráfico:', error);
    }
  }

  private generateChart(): void {
    if (!this.chart || !this.selectedEvaluacion) {
      console.error('❌ No hay gráfico o evaluación seleccionada');
      return;
    }

    console.log('📊 Generando gráfico para evaluación:', this.selectedEvaluacion.idEvaluacion);

    try {
      // Parsear las respuestas
      let respuestas: any[] = [];
      if (typeof this.selectedEvaluacion.respuestas === 'string') {
        respuestas = JSON.parse(this.selectedEvaluacion.respuestas);
      } else {
        respuestas = this.selectedEvaluacion.respuestas || [];
      }

      console.log(`📝 Total respuestas: ${respuestas.length}`);

      // Calcular promedios por sección
      const promediosSeccion = this.calcularPromediosPorSeccion(respuestas);
      
      // Preparar datos para el gráfico
      const labels = this.secciones.map(s => s.nombre);
      const data = this.secciones.map(s => promediosSeccion[s.nombre] || 0);
      const colors = this.secciones.map(s => s.color);

      // Actualizar el gráfico
      this.chart.data.labels = labels;
      this.chart.data.datasets = [{
        label: `Evaluación del ${new Date(this.selectedEvaluacion.fechaEvaluacion || '').toLocaleDateString()}`,
        data: data,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: colors,
        pointBorderColor: colors,
        pointRadius: 8,
        pointHoverRadius: 10,
        tension: 0.4
      }];

      this.chart.update();
      
      console.log('✅ Gráfico actualizado exitosamente');
      console.log('📊 Datos del gráfico:', { labels, data });

    } catch (error) {
      console.error('❌ Error generando gráfico:', error);
      alert('Error al generar el gráfico. Verifique los datos de la evaluación.');
    }
  }

  private calcularPromediosPorSeccion(respuestas: any[]): { [key: string]: number } {
    const promedios: { [key: string]: number } = {};

    this.secciones.forEach(seccion => {
      const respuestasSeccion = respuestas.filter(respuesta => {
        // Extraer número de pregunta del name (ej: "pregunta1" -> 1)
        const numeroPregunta = this.extraerNumeroPregunta(respuesta.name);
        return seccion.preguntas.includes(numeroPregunta);
      });

      if (respuestasSeccion.length > 0) {
        const sumaPuntajes = respuestasSeccion.reduce((suma, respuesta) => {
          return suma + this.convertirRespuestaAPuntaje(respuesta.respuesta);
        }, 0);
        
        promedios[seccion.nombre] = Number((sumaPuntajes / respuestasSeccion.length).toFixed(2));
      } else {
        promedios[seccion.nombre] = 0;
      }

      console.log(`📊 ${seccion.nombre}: ${respuestasSeccion.length} respuestas, promedio: ${promedios[seccion.nombre]}`);
    });

    return promedios;
  }

  private extraerNumeroPregunta(name: string): number {
    // Extraer número de strings como "pregunta1", "pregunta2", etc.
    const match = name.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  private convertirRespuestaAPuntaje(respuesta: string): number {
    switch(respuesta.toLowerCase()) {
      case 'nunca': return 1;
      case 'casi-nunca': return 2;
      case 'a-veces': return 3;
      case 'frecuentemente': return 4;
      case 'siempre': return 5;
      default: return 3; // Valor por defecto
    }
  }

  private clearChart(): void {
    if (this.chart) {
      this.chart.data.labels = [];
      this.chart.data.datasets = [];
      this.chart.update();
    }
  }

  // Método para exportar el gráfico como imagen
  exportChart(): void {
    if (!this.chart) {
      alert('No hay gráfico para exportar');
      return;
    }

    const url = this.chart.toBase64Image();
    const link = document.createElement('a');
    link.download = `evaluacion_${this.selectedPatient?.nombre}_${new Date().getTime()}.png`;
    link.href = url;
    link.click();
  }

  // Método para imprimir el gráfico
  printChart(): void {
    if (!this.chart) {
      alert('No hay gráfico para imprimir');
      return;
    }

    const url = this.chart.toBase64Image();
    const windowContent = `
      <html>
        <head><title>Evaluación Sensorial - ${this.selectedPatient?.nombre}</title></head>
        <body style="margin: 20px;">
          <h2>Evaluación Sensorial</h2>
          <p><strong>Paciente:</strong> ${this.selectedPatient?.nombre} ${this.selectedPatient?.apellidoPaterno}</p>
          <p><strong>Fecha:</strong> ${new Date(this.selectedEvaluacion?.fechaEvaluacion || '').toLocaleDateString()}</p>
          <p><strong>Progreso:</strong> ${this.selectedEvaluacion?.progreso}%</p>
          <img src="${url}" style="max-width: 100%; height: auto;">
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(windowContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  }
}
