import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { GenerarPedidoAutomaticoComponent } from './generar-pedido-automatico.component';

describe('GenerarPedidoAutomaticoComponent', () => {
  let component: GenerarPedidoAutomaticoComponent;
  let fixture: ComponentFixture<GenerarPedidoAutomaticoComponent>;

  beforeEach(waitForAsync(async () => {
     TestBed.configureTestingModule({
      imports: [GenerarPedidoAutomaticoComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DatePipe,
        MessageService,
        { provide: ToastrService, useValue: { success: () => { }, error: () => { } } },
        { provide: MatSnackBar, useValue: { open: () => { } } },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: { open: () => { } } },
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerarPedidoAutomaticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
