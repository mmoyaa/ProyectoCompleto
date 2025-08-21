import { Component, Input } from '@angular/core';
import { EvaluacionSensorial } from '../../services/evaluacion.service';

@Component({
  selector: 'app-detalle-evaluacion',
  templateUrl: './detalle-evaluacion.component.html',
  styleUrls: ['./detalle-evaluacion.component.css']
})
export class DetalleEvaluacionComponent {
  @Input() evaluacion: EvaluacionSensorial | null = null;
}
