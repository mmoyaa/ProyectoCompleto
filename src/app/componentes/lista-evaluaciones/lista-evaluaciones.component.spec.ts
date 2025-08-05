import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ListaEvaluacionesComponent } from './lista-evaluaciones.component';

describe('ListaEvaluacionesComponent', () => {
  let component: ListaEvaluacionesComponent;
  let fixture: ComponentFixture<ListaEvaluacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaEvaluacionesComponent],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    fixture = TestBed.createComponent(ListaEvaluacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
