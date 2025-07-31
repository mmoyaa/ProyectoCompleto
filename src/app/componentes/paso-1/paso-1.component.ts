import { Component, OnInit } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { ComunService } from 'src/app/services/comun.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
@Component({
  selector: 'app-paso-1',
  templateUrl: './paso-1.component.html',
  styleUrls: ['./paso-1.component.css'],
})
export class Paso1Component implements OnInit {
  miFormulario!: FormGroup;
  ComunasAll: any[] = [];
  Relaciones: any[] = [];

  constructor(private comunasService: ComunService) {}

  ngOnInit(): void {
    this.cargarRelaciones();
  
    this.miFormulario = new FormGroup({
      idComuna: new FormControl(null),
      idReparticion: new FormControl(null),
    });

  
    this.getComunas();
    this.getreparticion();
  }
  getComunas(): void {
    this.comunasService.getComunas().subscribe((data) => {
      this.ComunasAll = data;
      console.log('estas son las comunas', data);
    });
  }
  cargarRelaciones(): void {
    this.comunasService.getRelaciones().subscribe({
      next: (data) => {
        this.Relaciones = data;
        console.log('Relaciones cargadas:', this.Relaciones);
      },
      error: (err) => {
        console.error('Error al cargar relaciones:', err);
      },
    });
  }

  ReparticionesAll: any[] = [];
  getreparticion(): void {
    this.comunasService.getreparticion().subscribe((data) => {
      this.ReparticionesAll = data;
      console.log('Reparticiones', data);
    });
  }
  guardarRelacion(): void {
    const idReparticion = this.miFormulario.get('idReparticion')?.value;
    const idComuna = this.miFormulario.get('idComuna')?.value;

    if (!idReparticion || !idComuna) {
      alert('Debe seleccionar repartición y comuna');
      return;
    }

    const datos = {
      idReparticion,
      idComuna,
    };

    this.comunasService.guardarRelacion(datos).subscribe({
      next: (res) => {
        console.log('Relación guardada:', res);
        alert('Relación guardada correctamente');
          this.cargarRelaciones();
      },
      error: (err) => {
        console.error('Error al guardar relación:', err);
        alert('Error al guardar la relación');
      },
    });
     this.cargarRelaciones();
  
  }
get relacionesExpiradas() {
  return this.Relaciones.filter(r =>
    r.fechaExpiracion !== null &&
    r.fechaExpiracion !== undefined &&
    r.fechaExpiracion !== '' &&
    r.fechaExpiracion !== 'null'
  );
}

  expirarRelacion(relacion: any): void {
    const datos = {
      idReparticion: relacion.idReparticion,
      idComuna: relacion.idComuna,
    };

    this.comunasService.expirarRelacion(datos).subscribe({
      next: (res) => {
        alert('Relación expirada correctamente');
        this.cargarRelaciones();
      },
      error: (err) => {
        alert('Error al expirar la relación');
      },
    });
  }



 
}
