import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComunService {
  private URL = 'http://localhost:3000/api/comunas';  

  private apiUrl = 'http://localhost:3000/api/reparticion';

 
  constructor(private http: HttpClient) { }



  getComunas(): Observable<any> {
    return this.http.get<any>(this.URL);
  }


  addComuna(comuna: { Nombre: string; idReparticion: number }): Observable<any> {
    return this.http.post<any>(this.URL, comuna);
  }


  agregarComuna(datos: any) {
    return this.http.post('http://localhost:3000/api/comunas', datos);
  }



  getreparticion(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }


guardarRelacion(data: { idReparticion: number, idComuna: number }): Observable<any> {
  return this.http.post('http://localhost:3000/api/reparticion-comuna', data);
}

expirarRelacion(data: { idReparticion: number, idComuna: number }): Observable<any> {
  return this.http.post('http://localhost:3000/api/reparticion-comuna/expirar', data);
}

getRelaciones(): Observable<any> {
  return this.http.get<any>('http://localhost:3000/api/reparticion-comuna');
}


agregarPacienteConTutor(data: any): Observable<any> {
  return this.http.post<any>('http://localhost:3000/api/pacientes/simple', data);
}
}
