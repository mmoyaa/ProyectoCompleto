import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-radio',
  template: `
    <div style="padding: 20px;">
      <h2>🧪 Test de Radio Buttons</h2>
      
      <div style="margin: 20px 0;">
        <h3>Pregunta 1: ¿Con qué frecuencia tienes dolor de cabeza?</h3>
        <div>
          <input type="radio" id="q1_nunca" name="pregunta1" value="nunca">
          <label for="q1_nunca">Nunca</label>
        </div>
        <div>
          <input type="radio" id="q1_ocasionalmente" name="pregunta1" value="ocasionalmente">
          <label for="q1_ocasionalmente">Ocasionalmente</label>
        </div>
        <div>
          <input type="radio" id="q1_frecuentemente" name="pregunta1" value="frecuentemente">
          <label for="q1_frecuentemente">Frecuentemente</label>
        </div>
      </div>

      <div style="margin: 20px 0;">
        <h3>Pregunta 2: ¿Sientes náuseas?</h3>
        <div>
          <input type="radio" id="q2_nunca" name="pregunta2" value="nunca">
          <label for="q2_nunca">Nunca</label>
        </div>
        <div>
          <input type="radio" id="q2_ocasionalmente" name="pregunta2" value="ocasionalmente">
          <label for="q2_ocasionalmente">Ocasionalmente</label>
        </div>
        <div>
          <input type="radio" id="q2_frecuentemente" name="pregunta2" value="frecuentemente">
          <label for="q2_frecuentemente">Frecuentemente</label>
        </div>
      </div>

      <div style="margin: 20px 0;">
        <button (click)="testLoadResponses()" style="padding: 10px 20px; margin: 5px;">
          🧪 Test: Cargar Respuestas
        </button>
        <button (click)="clearAll()" style="padding: 10px 20px; margin: 5px;">
          🗑️ Limpiar Todo
        </button>
        <button (click)="showSelected()" style="padding: 10px 20px; margin: 5px;">
          👁️ Mostrar Seleccionadas
        </button>
      </div>

      <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; font-family: monospace;">
        <h4>🔍 Debug Log:</h4>
        <div id="debug-log">Listo para testing...</div>
      </div>
    </div>
  `,
  styles: []
})
export class TestRadioComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.debugLog('✅ Componente inicializado');
  }

  testLoadResponses(): void {
    this.debugLog('🧪 === INICIANDO TEST ===');
    
    const respuestasEjemplo = [
      { name: 'pregunta1', respuesta: 'frecuentemente' },
      { name: 'pregunta2', respuesta: 'ocasionalmente' }
    ];

    this.debugLog('📋 Respuestas a cargar: ' + JSON.stringify(respuestasEjemplo));

    setTimeout(() => {
      let cargadas = 0;
      
      respuestasEjemplo.forEach((respuesta, index) => {
        this.debugLog(`🔍 Procesando: ${respuesta.name} = ${respuesta.respuesta}`);
        
        const selector = `input[name="${respuesta.name}"][value="${respuesta.respuesta}"]`;
        const radioInput = document.querySelector(selector) as HTMLInputElement;
        
        if (radioInput) {
          radioInput.checked = true;
          cargadas++;
          this.debugLog(`✅ CARGADA: ${respuesta.name} = ${respuesta.respuesta}`);
        } else {
          this.debugLog(`❌ NO ENCONTRADA: ${respuesta.name} = ${respuesta.respuesta}`);
        }
      });
      
      this.debugLog(`📊 Resultado: ${cargadas}/${respuestasEjemplo.length} respuestas cargadas`);
      
    }, 100);
  }

  clearAll(): void {
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach((radio: any) => {
      radio.checked = false;
    });
    this.debugLog('🗑️ Todas las selecciones limpiadas');
  }

  showSelected(): void {
    const checked = document.querySelectorAll('input[type="radio"]:checked');
    this.debugLog(`👁️ Selecciones actuales: ${checked.length}`);
    checked.forEach((radio: any, index) => {
      this.debugLog(`  ${index + 1}. ${radio.name} = ${radio.value}`);
    });
  }

  private debugLog(message: string): void {
    const debugDiv = document.getElementById('debug-log');
    if (debugDiv) {
      debugDiv.innerHTML += '<br>' + new Date().toLocaleTimeString() + ' - ' + message;
    }
    console.log(message);
  }
}
