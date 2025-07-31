import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paso1Component } from './paso-1.component';

describe('Paso1Component', () => {
  let component: Paso1Component;
  let fixture: ComponentFixture<Paso1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Paso1Component]
    });
    fixture = TestBed.createComponent(Paso1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
