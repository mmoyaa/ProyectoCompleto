import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjemplosComponent } from './ejemplos.component';

describe('EjemplosComponent', () => {
  let component: EjemplosComponent;
  let fixture: ComponentFixture<EjemplosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjemplosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjemplosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});