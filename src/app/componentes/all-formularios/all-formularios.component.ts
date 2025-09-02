import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PacienteService, Paciente } from '../../services/paciente.service';
import { EvaluacionService, EvaluacionSensorial } from '../../services/evaluacion.service';

@Component({
  selector: 'app-all-formularios',
  templateUrl: './all-formularios.component.html',
  styleUrls: ['./all-formularios.component.css']
})
export class AllFormulariosComponent implements OnInit {
  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente | null = null;
  tipoFormularios = [
    { value: '1-3', label: '1 a 3' },
    { value: '6-12', label: '6 a 12' }
  ];
  tipoFormularioSeleccionado: string | null = null;
  evaluacionId: string | null = null;
  evaluacionData: EvaluacionSensorial | null = null;

  constructor(
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private evaluacionService: EvaluacionService
  ) { }

  ngOnInit(): void {
    this.pacienteService.obtenerPacientes().subscribe((data: any) => {
      this.pacientes = data;
      
      // Después de cargar pacientes, verificar parámetros de ruta
      this.checkRouteParams();
    });
  }

  private checkRouteParams(): void {
    this.route.queryParams.subscribe(params => {
      const pacienteId = params['pacienteId'];
      const evaluacionId = params['evaluacionId'];
      const tipoFormulario = params['tipoFormulario'];
      
      console.log('📋 Parámetros de ruta recibidos:', {
        pacienteId,
        evaluacionId,
        tipoFormulario
      });

      if (pacienteId) {
        // Buscar y seleccionar el paciente por RUT
        const paciente = this.pacientes.find(p => 
          p.rut === pacienteId
        );
        
        if (paciente) {
          this.pacienteSeleccionado = paciente;
          console.log('✅ Paciente seleccionado:', paciente);
        }
      }

      if (tipoFormulario) {
        this.tipoFormularioSeleccionado = tipoFormulario;
        console.log('✅ Tipo de formulario seleccionado:', tipoFormulario);
      }

      if (evaluacionId) {
        this.evaluacionId = evaluacionId;
        console.log('✅ ID de evaluación para editar:', evaluacionId);
        
        // Cargar los datos de la evaluación
        this.evaluacionService.obtenerEvaluacionPorId(parseInt(evaluacionId)).subscribe(
          (evaluacion: EvaluacionSensorial) => {
            this.evaluacionData = evaluacion;
            console.log('✅ Datos de evaluación cargados:', evaluacion);
            console.log('📋 Estructura de respuestas:', evaluacion.respuestas);
            console.log('📊 Tipo de formulario detectado:', evaluacion.tipoFormulario);
          },
          (error: any) => {
            console.error('❌ Error al cargar evaluación:', error);
          }
        );
      }
    });
  }
}
