/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { ModalGenerarAutorizacionComponent } from './modal-generar-autorizacion.component';
import { LogService } from '@services/log-service.service';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';

describe('ModalGenerarAutorizacionComponent', () => {
  let component: ModalGenerarAutorizacionComponent;
  let fixture: ComponentFixture<ModalGenerarAutorizacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule, // Importa MatDialogModule para que funcione el MatDialog
      ],
      declarations: [ModalGenerarAutorizacionComponent],
      providers: [
        LogService,
        ServicioalmacenService,
        provideHttpClient(),
        provideHttpClientTesting(),
        DatePipe,
        MessageService,
        { provide: ToastrService, useValue: { success: () => { }, error: () => { } } },
        { provide: MatSnackBar, useValue: { open: () => { } } },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: { open: () => { } } },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGenerarAutorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
