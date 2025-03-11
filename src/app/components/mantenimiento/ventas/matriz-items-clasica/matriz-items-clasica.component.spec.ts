/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog'; 
import { of } from 'rxjs'; 

import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { MatrizItemsClasicaComponent } from './matriz-items-clasica.component';

describe('MatrizItemsClasicaComponent', () => {
  let component: MatrizItemsClasicaComponent;
  let fixture: ComponentFixture<MatrizItemsClasicaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MatrizItemsClasicaComponent],
      providers: [
        DatePipe,
        MessageService,
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
    fixture = TestBed.createComponent(MatrizItemsClasicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
