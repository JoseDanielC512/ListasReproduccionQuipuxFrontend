import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancionFormComponent } from './cancion-form.component';

describe('CancionFormComponent', () => {
  let component: CancionFormComponent;
  let fixture: ComponentFixture<CancionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
