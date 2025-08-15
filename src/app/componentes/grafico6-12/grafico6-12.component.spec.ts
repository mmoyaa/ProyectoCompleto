import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Grafico612Component } from './grafico6-12.component';

describe('Grafico612Component', () => {
  let component: Grafico612Component;
  let fixture: ComponentFixture<Grafico612Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Grafico612Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Grafico612Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
