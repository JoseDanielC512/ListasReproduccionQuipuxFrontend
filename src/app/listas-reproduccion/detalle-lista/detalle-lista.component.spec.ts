import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleListaComponent } from './detalle-lista.component';

describe('DetalleListaComponent', () => {
  let component: DetalleListaComponent;
  let fixture: ComponentFixture<DetalleListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
