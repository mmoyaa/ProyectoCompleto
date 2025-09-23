import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapuertoComponent } from './capuerto.component';

describe('CapuertoComponent', () => {
  let component: CapuertoComponent;
  let fixture: ComponentFixture<CapuertoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CapuertoComponent]
    });
    fixture = TestBed.createComponent(CapuertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
