import { Component } from '@angular/core';

@Component({
  selector: 'app-grafico6-12',
  templateUrl: './grafico6-12.component.html',
  styleUrls: ['./grafico6-12.component.css']
})
export class Grafico612Component {
  percentiles6_12 = [
    { percentile: 80, t: '37-40', soc: '37-40', vis: '35-44', hea: '29-32', tou: '34-40', bod: '36-40', bal: '35-34', pla: '33-36', tot: '170-224' },
    { percentile: 75, t: '32', soc: '32', vis: '28-29', hea: '23', tou: '32', bod: '29', bal: '27-28', pla: '29', tot: '137-139' },
    // ...agrega más filas según la imagen...
  ];

  areas6_12 = [
    { nombre: 'SOC', valor: 32 },
    { nombre: 'VIS', valor: 28 },
    { nombre: 'HEA', valor: 23 },
    { nombre: 'TOU', valor: 32 },
    { nombre: 'BOD', valor: 29 },
    { nombre: 'BAL', valor: 27 },
    { nombre: 'PLA', valor: 29 },
  ];

  total6_12 = 137;
}
