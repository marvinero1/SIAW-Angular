/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DatePipe } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { ModificarProformaComponent } from './modificar-proforma.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { MatMenuModule } from '@angular/material/menu';

describe('ModificarProformaComponent', () => {
  let component: ModificarProformaComponent;
  let fixture: ComponentFixture<ModificarProformaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatMenuModule],
      declarations: [ModificarProformaComponent],
      providers: [
        { provide: ToastrService, useValue: { success: () => { }, error: () => { } } },
        { provide: MatSnackBar, useValue: { open: () => { } } },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: { open: () => { } } },
        provideHttpClient(),
        provideHttpClientTesting(),
        DatePipe,
        MessageService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
