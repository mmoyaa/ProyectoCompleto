import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalizacionComponent } from './fiscalizacion.component';

describe('FiscalizacionComponent', () => {
  let component: FiscalizacionComponent;
  let fixture: ComponentFixture<FiscalizacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiscalizacionComponent]
    });
    fixture = TestBed.createComponent(FiscalizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
