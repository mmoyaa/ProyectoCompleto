import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscaComponent } from './fisca.component';

describe('FiscaComponent', () => {
  let component: FiscaComponent;
  let fixture: ComponentFixture<FiscaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiscaComponent]
    });
    fixture = TestBed.createComponent(FiscaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
