import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  formData: any = {
    rut: '',
    nombre: '',
    profesion: '',
    direccion: '',
    estadoSalud: ''
  };
  getData() {
    return this.formData;
  }
  updateData(newData: Partial<typeof this.formData>) {
    this.formData = { ...this.formData, ...newData };
  }

  reset() {
    this.formData = {
      rut: '',
      nombre: '',
      profesion: '',
      direccion: '',
      estadoSalud: ''
    };
  }
  constructor() { }
}
