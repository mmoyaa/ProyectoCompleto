import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-pagina3',
  templateUrl: './pagina3.component.html',
  styleUrls: ['./pagina3.component.css']
})
export class Pagina3Component implements OnInit {

  formUserConcesion: FormGroup;
  nacionalidadSeleccionada: string = '0';
  tipoPersonaSeleccionada: string = 'natural';
  buscarInput: FormControl = new FormControl('');
  buscarRut: FormControl = new FormControl('');
  rutControl: FormControl = new FormControl('');
  digitoverif: FormControl = new FormControl('');
  
  // Arrays para selectores
  paisesAll: any[] = [];
  profesiones: any[] = [];
  EstadosCiviles: any[] = [];
  
  // Objeto general simulado para mantener la estructura
  general = {
    ccmActual: {
      numConcesion: '123456789',
      idTramite: 1
    }
  };

  constructor(private formBuilder: FormBuilder) {
    this.formUserConcesion = this.formBuilder.group({
      cdnacionalidadCs: ['0', Validators.required],
      cdpaisCs: [''],
      nombre: [''],
      apellido1: [''],
      apellido2: [''],
      cdprofesionCs: [''],
      cdestadocivilCs: [''],
      razonSocial: [''],
      paisFjoCs: ['']
    });
  }

  ngOnInit(): void {
    // Inicialización del componente
    this.formUserConcesion.get('cdnacionalidadCs')?.valueChanges.subscribe(value => {
      this.nacionalidadSeleccionada = value;
    });
    
    // Inicializar datos de ejemplo
    this.initializeDummyData();
  }

  initializeDummyData(): void {
    // Datos de ejemplo para países
    this.paisesAll = [
      { cdcodigo: 'AR', MNombre: 'Argentina' },
      { cdcodigo: 'BR', MNombre: 'Brasil' },
      { cdcodigo: 'PE', MNombre: 'Perú' },
      { cdcodigo: 'CO', MNombre: 'Colombia' },
      { cdcodigo: 'US', MNombre: 'Estados Unidos' }
    ];
    
    // Datos de ejemplo para profesiones
    this.profesiones = [
      { CDTPProfesion: '1', GLTPProfesion: 'Ingeniero' },
      { CDTPProfesion: '2', GLTPProfesion: 'Médico' },
      { CDTPProfesion: '3', GLTPProfesion: 'Abogado' },
      { CDTPProfesion: '4', GLTPProfesion: 'Contador' },
      { CDTPProfesion: '5', GLTPProfesion: 'Otro' }
    ];
    
    // Datos de ejemplo para estados civiles
    this.EstadosCiviles = [
      { CDEstadoCivil: '1', GLEstadoCivil: 'Soltero' },
      { CDEstadoCivil: '2', GLEstadoCivil: 'Casado' },
      { CDEstadoCivil: '3', GLEstadoCivil: 'Divorciado' },
      { CDEstadoCivil: '4', GLEstadoCivil: 'Viudo' }
    ];
  }

  onNacionalidadChange(event: any): void {
    this.nacionalidadSeleccionada = event.target.value;
    this.formUserConcesion.patchValue({
      cdnacionalidadCs: event.target.value
    });
    console.log('Nacionalidad seleccionada:', this.nacionalidadSeleccionada);
  }

  setTipoPersona(tipo: string): void {
    this.tipoPersonaSeleccionada = tipo;
    console.log('Tipo de persona seleccionado:', this.tipoPersonaSeleccionada);
  }

  permitirSoloNumerosInputs(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  permitirLetrasyNumeros(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Permitir números (48-57), letras mayúsculas (65-90), letras minúsculas (97-122), guiones (45), espacios (32)
    if ((charCode >= 48 && charCode <= 57) || 
        (charCode >= 65 && charCode <= 90) || 
        (charCode >= 97 && charCode <= 122) || 
        charCode === 45 || charCode === 32) {
      return true;
    }
    return false;
  }

  buscarPersonaBackendnatural(): void {
    let valorBusqueda = '';
    
    // Determinar qué campo usar según el tipo de persona y nacionalidad
    if (this.tipoPersonaSeleccionada === 'natural' && this.nacionalidadSeleccionada === '0') {
      valorBusqueda = this.buscarInput.value;
    } else {
      valorBusqueda = this.buscarRut.value;
    }

    if (valorBusqueda && valorBusqueda.trim() !== '') {
      console.log('Buscando persona con valor:', valorBusqueda);
      console.log('Tipo persona:', this.tipoPersonaSeleccionada);
      console.log('Nacionalidad:', this.nacionalidadSeleccionada);
      
      // Aquí iría la lógica para buscar en el backend
      const tipoDocumento = this.getTipoDocumento();
      alert(`Buscando ${this.tipoPersonaSeleccionada} con ${tipoDocumento}: ${valorBusqueda}`);
    } else {
      alert('Por favor ingrese un valor válido para buscar');
    }
  }

  getTipoDocumento(): string {
    if (this.nacionalidadSeleccionada === '0') {
      return this.tipoPersonaSeleccionada === 'natural' ? 'RUT' : 'RUT Jurídico';
    } else {
      return this.tipoPersonaSeleccionada === 'natural' ? 'Pasaporte' : 'Tax ID';
    }
  }

  letrasNumeroEspacio(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Permitir números (48-57), letras mayúsculas (65-90), letras minúsculas (97-122), espacios (32)
    if ((charCode >= 48 && charCode <= 57) || 
        (charCode >= 65 && charCode <= 90) || 
        (charCode >= 97 && charCode <= 122) || 
        charCode === 32) {
      return true;
    }
    return false;
  }

  prueba(): void {
    console.log('Datos del formulario:', this.formUserConcesion.value);
    console.log('RUT:', this.rutControl.value);
    console.log('DV:', this.digitoverif.value);
    alert('Datos del formulario mostrados en consola');
  }
}
