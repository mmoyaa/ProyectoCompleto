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
  
  // Variables para el resumen de secciones
  sumasSeccion: { [key: string]: number } = {};
  promediosSeccion: { [key: string]: number } = {};
  sumaTotal: number = 0;
  promedioGeneral: number = 0;
  totalPreguntasRespondidas: number = 0;
  porcentajeCompletitud: number = 0;

  // Datos de la tabla de percentiles
  percentilesData: any[] = [];
  
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
    this.initializePercentilesData();
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
          data: [2.5, 2, 3, 2.5, 2, 2.5, 3, 2.5],
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
            max: 4,
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
                const labels = ['', 'Nunca (N)', 'Ocasionalmente (O)', 'Frecuentemente (F)', 'Siempre (S)'];
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

      // Calcular promedios y sumas por sección
      this.calcularEstadisticasPorSeccion(respuestas);
      
      // Preparar datos para el gráfico
      const labels = this.secciones.map(s => s.nombre);
      const data = this.secciones.map(s => this.promediosSeccion[s.nombre] || 0);
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

  private calcularEstadisticasPorSeccion(respuestas: any[]): void {
    // Reinicializar variables
    this.sumasSeccion = {};
    this.promediosSeccion = {};
    this.sumaTotal = 0;
    this.totalPreguntasRespondidas = respuestas.length;

    this.secciones.forEach(seccion => {
      const respuestasSeccion = respuestas.filter(respuesta => {
        const numeroPregunta = this.extraerNumeroPregunta(respuesta.name);
        return seccion.preguntas.includes(numeroPregunta);
      });

      if (respuestasSeccion.length > 0) {
        // Calcular suma total de la sección
        const sumaPuntajes = respuestasSeccion.reduce((suma, respuesta) => {
          const numeroPregunta = this.extraerNumeroPregunta(respuesta.name);
          return suma + this.convertirRespuestaAPuntaje(respuesta.respuesta, numeroPregunta);
        }, 0);
        
        this.sumasSeccion[seccion.nombre] = sumaPuntajes;
        this.promediosSeccion[seccion.nombre] = Number((sumaPuntajes / respuestasSeccion.length).toFixed(2));
        this.sumaTotal += sumaPuntajes;
      } else {
        this.sumasSeccion[seccion.nombre] = 0;
        this.promediosSeccion[seccion.nombre] = 0;
      }

      console.log(`📊 ${seccion.nombre}: ${respuestasSeccion.length} respuestas, suma: ${this.sumasSeccion[seccion.nombre]}, promedio: ${this.promediosSeccion[seccion.nombre]}`);
    });

    // Calcular estadísticas generales
    this.promedioGeneral = this.totalPreguntasRespondidas > 0 ? 
      Number((this.sumaTotal / this.totalPreguntasRespondidas).toFixed(2)) : 0;
    
    this.porcentajeCompletitud = Number(((this.totalPreguntasRespondidas / 80) * 100).toFixed(1));

    console.log('📊 Estadísticas generales:', {
      sumaTotal: this.sumaTotal,
      promedioGeneral: this.promedioGeneral,
      totalPreguntasRespondidas: this.totalPreguntasRespondidas,
      porcentajeCompletitud: this.porcentajeCompletitud
    });
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
          const numeroPregunta = this.extraerNumeroPregunta(respuesta.name);
          return suma + this.convertirRespuestaAPuntaje(respuesta.respuesta, numeroPregunta);
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

  private convertirRespuestaAPuntaje(respuesta: string, numeroPregunta?: number): number {
    // Verificar si es una pregunta de Participación Social (71-80)
    const esParticipacionSocial = numeroPregunta && numeroPregunta >= 71 && numeroPregunta <= 80;
    
    switch(respuesta.toLowerCase()) {
      case 'nunca': 
      case 'n': 
        return esParticipacionSocial ? 4 : 1;
      case 'ocasionalmente': 
      case 'ocasional':
      case 'o': 
        return esParticipacionSocial ? 3 : 2;
      case 'frecuentemente': 
      case 'f': 
        return esParticipacionSocial ? 2 : 3;
      case 'siempre': 
      case 's': 
        return esParticipacionSocial ? 1 : 4;
      // Mantener compatibilidad con formato anterior
      case 'casi-nunca': 
        return esParticipacionSocial ? 3 : 2;
      case 'a-veces': 
        return esParticipacionSocial ? 3 : 2;
      default: 
        return esParticipacionSocial ? 3 : 2; // Valor por defecto
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

  // Inicializar datos de percentiles basados en la imagen
  private initializePercentilesData(): void {
    this.percentilesData = [
      { percentile: '>99', t: 80, soc: '', vis: '', hea: '', tou: '', bod: '', bal: '', pla: '', tot: '153-232' },
      { percentile: 99, t: 79, soc: '26-32', vis: '38-44', hea: '30-36', tou: '36-56', bod: '27-36', bal: '33-44', pla: '20-36', tot: '151-152' },
      { percentile: 98, t: 78, soc: 27, vis: 37, hea: 29, tou: '', bod: 26, bal: '', pla: 28, tot: '149-150' },
      { percentile: 97, t: 77, soc: '', vis: '', hea: 28, tou: '', bod: 25, bal: '', pla: 27, tot: 148 },
      { percentile: 76, t: 76, soc: 26, vis: '35-36', hea: 27, tou: 35, bod: 24, bal: 32, pla: '25-26', tot: '141-147' },
      { percentile: 75, t: 75, soc: 25, vis: '32-34', hea: 26, tou: 34, bod: 23, bal: '28-31', pla: '23-24', tot: 140 },
      { percentile: 74, t: 74, soc: '', vis: '30-31', hea: 25, tou: '', bod: '', bal: '24-27', pla: '21-22', tot: 139 },
      { percentile: 73, t: 73, soc: 24, vis: 29, hea: 24, tou: 33, bod: 22, bal: 23, pla: '', tot: '137-138' },
      { percentile: 72, t: 72, soc: '', vis: '26-27', hea: '22-23', tou: 32, bod: 21, bal: 22, pla: 20, tot: '119-136' },
      { percentile: 71, t: 71, soc: 23, vis: 25, hea: 21, tou: 31, bod: 20, bal: 21, pla: 19, tot: '113-118' },
      { percentile: 70, t: 70, soc: 22, vis: 24, hea: 20, tou: 30, bod: '', bal: 20, pla: '', tot: '111-112' },
      { percentile: 69, t: 69, soc: 21, vis: 23, hea: 19, tou: 29, bod: 19, bal: '', pla: 18, tot: '106-110' },
      { percentile: 68, t: 68, soc: 20, vis: '', hea: '', tou: 28, bod: 18, bal: 19, pla: '', tot: '104-105' },
      { percentile: 67, t: 67, soc: 19, vis: 22, hea: 18, tou: 27, bod: '', bal: '17-18', pla: 17, tot: '99-103' },
      { percentile: 66, t: 66, soc: 18, vis: 21, hea: 17, tou: 26, bod: 17, bal: '', pla: '', tot: '95-98' },
      { percentile: 65, t: 65, soc: '', vis: '', hea: '', tou: 25, bod: 16, bal: 16, pla: '16', tot: '93-94' },
      { percentile: 64, t: 64, soc: '', vis: 20, hea: 16, tou: 24, bod: '', bal: 15, pla: 15, tot: '91-92' },
      { percentile: 63, t: 63, soc: 17, vis: '', hea: 15, tou: 23, bod: '', bal: '', pla: '', tot: '89-90' },
      { percentile: 62, t: 62, soc: '', vis: 19, hea: '', tou: 22, bod: 15, bal: 15, pla: '', tot: 88 },
      { percentile: 61, t: 61, soc: '', vis: '', hea: '', tou: '', bod: '', bal: '', pla: 14, tot: '86-87' },
      { percentile: 60, t: 60, soc: '', vis: 18, hea: 14, tou: 21, bod: 14, bal: '', pla: '', tot: '84-85' },
      { percentile: 59, t: 59, soc: 16, vis: '', hea: '', tou: '', bod: '', bal: '', pla: '', tot: '82-83' },
      { percentile: 58, t: 58, soc: '', vis: 17, hea: 13, tou: 20, bod: '', bal: 14, pla: 13, tot: '80-81' },
      { percentile: 57, t: 57, soc: '', vis: '', hea: '', tou: '', bod: 13, bal: '', pla: '', tot: 79 },
      { percentile: 56, t: 56, soc: 15, vis: 16, hea: '', tou: '', bod: '', bal: '', pla: '', tot: '77-78' },
      { percentile: 55, t: 55, soc: '', vis: '', hea: 12, tou: 19, bod: '', bal: 13, pla: 12, tot: 76 },
      { percentile: 54, t: 54, soc: 14, vis: '', hea: '', tou: '', bod: 12, bal: '', pla: '', tot: 75 },
      { percentile: 53, t: 53, soc: '', vis: 15, hea: '', tou: 18, bod: '', bal: '', pla: '', tot: 74 },
      { percentile: 52, t: 52, soc: 13, vis: '', hea: 11, tou: '', bod: '', bal: 11, pla: '', tot: '72-73' },
      { percentile: 51, t: 51, soc: '', vis: '', hea: '', tou: '', bod: '', bal: '', pla: '', tot: 71 },
      { percentile: 50, t: 50, soc: 12, vis: 14, hea: '', tou: '', bod: 11, bal: 12, pla: '', tot: 70 },
      { percentile: 49, t: 49, soc: '', vis: '', hea: '', tou: 17, bod: '', bal: '', pla: '', tot: 69 },
      { percentile: 48, t: 48, soc: '', vis: '', hea: '', tou: '', bod: '', bal: 10, pla: '', tot: 68 },
      { percentile: 47, t: 47, soc: 11, vis: 13, hea: 10, tou: '', bod: '', bal: '', pla: '', tot: 67 },
      { percentile: 46, t: 46, soc: '', vis: '', hea: '', tou: 16, bod: 10, bal: '', pla: '', tot: 66 },
      { percentile: 45, t: 45, soc: '', vis: '', hea: '', tou: '', bod: '', bal: '', pla: '', tot: 65 },
      { percentile: 44, t: 44, soc: 10, vis: '', hea: '', tou: '', bod: '', bal: '', pla: '', tot: '' },
      { percentile: 43, t: 43, soc: '', vis: 12, hea: '', tou: 15, bod: '', bal: '', pla: '', tot: 64 },
      { percentile: 42, t: 42, soc: '', vis: '', hea: '', tou: '', bod: '', bal: 11, pla: '', tot: 63 },
      { percentile: 41, t: 41, soc: '', vis: '', hea: '', tou: '', bod: '', bal: '', pla: '', tot: '' },
      { percentile: 40, t: 40, soc: '8-9', vis: 11, hea: 9, tou: 14, bod: 9, bal: '', pla: 9, tot: '58-62' },
      { percentile: 16, t: 16, soc: 'SOC', vis: 'VIS', hea: 'HEA', tou: 'TOU', bod: 'BOD', bal: 'BAL', pla: 'PLA', tot: 'TOT' }
    ];
  }

  // Verificar si una fila debe ser resaltada
  shouldHighlightRow(row: any): boolean {
    return row.percentile === 40 || row.percentile === 16;
  }

  // Verificar si es la fila de puntajes actuales
  isCurrentScoreRow(row: any): boolean {
    return false; // Por ahora no implementado
  }

  // Verificar si el valor actual coincide con el de la tabla
  isCurrentValue(column: string, value: any): boolean {
    if (!this.selectedEvaluacion || !value) return false;
    
    let currentValue = 0;
    switch(column) {
      case 'SOC': currentValue = this.sumasSeccion['Participación Social'] || 0; break;
      case 'VIS': currentValue = this.sumasSeccion['Visión'] || 0; break;
      case 'HEA': currentValue = this.sumasSeccion['Auditivo'] || 0; break;
      case 'TOU': currentValue = this.sumasSeccion['Táctil'] || 0; break;
      case 'BOD': currentValue = this.sumasSeccion['Conciencia Corporal'] || 0; break;
      case 'BAL': currentValue = this.sumasSeccion['Equilibrio/Movimiento'] || 0; break;
      case 'PLA': currentValue = this.sumasSeccion['Planificación/Ideas'] || 0; break;
      case 'TOT': currentValue = this.sumaTotal || 0; break;
    }

    // Convertir value a string y verificar si coincide
    const valueStr = value.toString().trim();
    
    // Si el valor está vacío o es no numérico, no hay coincidencia
    if (!valueStr || valueStr === '' || isNaN(Number(valueStr.charAt(0)))) {
      return false;
    }
    
    if (valueStr.includes('-')) {
      const parts = valueStr.split('-');
      if (parts.length !== 2) return false;
      
      const min = parseInt(parts[0]);
      const max = parseInt(parts[1]);
      
      // Verificar que ambos valores sean válidos
      if (isNaN(min) || isNaN(max)) return false;
      
      return currentValue >= min && currentValue <= max;
    } else {
      const numValue = parseInt(valueStr);
      if (isNaN(numValue)) return false;
      
      return currentValue === numValue;
    }
  }
}
