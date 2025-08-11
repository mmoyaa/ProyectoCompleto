import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formulario612Component } from './formulario-6-12.component';

describe('Formulario612Component', () => {
  let component: Formulario612Component;
  let fixture: ComponentFixture<Formulario612Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Formulario612Component]
    });
    fixture = TestBed.createComponent(Formulario612Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
