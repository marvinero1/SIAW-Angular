/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DescuentosEspecialesComponent } from './descuentos-especiales.component';

describe('DescuentosEspecialesComponent', () => {
  let component: DescuentosEspecialesComponent;
  let fixture: ComponentFixture<DescuentosEspecialesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DescuentosEspecialesComponent],
      providers: [
        DatePipe,
        MessageService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: { open: () => { } } }, 
        { provide: MatDialog, useValue: { open: () => { } } },
        { provide: MatDialogRef, useValue: {} },
        { provide: ToastrService, useValue: { success: () => { }, error: () => { } } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescuentosEspecialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
