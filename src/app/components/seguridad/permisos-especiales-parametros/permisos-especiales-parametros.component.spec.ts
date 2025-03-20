/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PermisosEspecialesParametrosComponent } from './permisos-especiales-parametros.component';
import { ModalGenerarAutorizacionComponent } from '../modal-generar-autorizacion/modal-generar-autorizacion.component';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { LogService } from '@services/log-service.service';

describe('PermisosEspecialesParametrosComponent', () => {
  let component: PermisosEspecialesParametrosComponent;
  let fixture: ComponentFixture<PermisosEspecialesParametrosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [
        PermisosEspecialesParametrosComponent,
        ModalGenerarAutorizacionComponent  // 🔹 Agregar el componente aquí
      ],
      providers: [
        DatePipe,
        MessageService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: { open: () => { } } },
        { provide: MatDialog, useValue: { open: () => { } } },
        { provide: MatDialogRef, useValue: {} },
        { provide: ToastrService, useValue: { success: () => { }, error: () => { } } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: LogService, useValue: { /* Mock o implementación */ } },
        { provide: ServicioalmacenService, useValue: { /* Mock o implementación */ } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisosEspecialesParametrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
