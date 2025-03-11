/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DatePipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LineasPorcentajeDesctComponent } from './lineas-porcentaje-desct.component';

describe('LineasPorcentajeDesctComponent', () => {
  let component: LineasPorcentajeDesctComponent;
  let fixture: ComponentFixture<LineasPorcentajeDesctComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatAutocompleteModule],
      declarations: [LineasPorcentajeDesctComponent],
      providers: [
        DatePipe,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: { open: () => { } } },
        { provide: MatDialog, useValue: { open: () => { } } },
        { provide: ToastrService, useValue: { success: () => { }, error: () => { } } },
        { provide: MatDialogRef, useValue: {} }, 
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineasPorcentajeDesctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
