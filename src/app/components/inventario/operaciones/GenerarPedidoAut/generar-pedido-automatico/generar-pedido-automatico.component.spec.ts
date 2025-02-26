import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarPedidoAutomaticoComponent } from './generar-pedido-automatico.component';

describe('GenerarPedidoAutomaticoComponent', () => {
  let component: GenerarPedidoAutomaticoComponent;
  let fixture: ComponentFixture<GenerarPedidoAutomaticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarPedidoAutomaticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerarPedidoAutomaticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
