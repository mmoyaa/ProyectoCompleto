import { Component, OnInit } from '@angular/core';
import { PacienteService, Paciente } from '../../services/paciente.service';

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

  constructor(private pacienteService: PacienteService) { }

  ngOnInit(): void {
    this.pacienteService.obtenerPacientes().subscribe((data: any) => {
      this.pacientes = data;
    });
  }
}
