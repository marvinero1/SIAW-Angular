/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ArchivoComponent } from './archivo.component';

describe('ArchivoComponent', () => {
  let component: ArchivoComponent;
  let fixture: ComponentFixture<ArchivoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatMenuModule],
      declarations: [ArchivoComponent],
      providers: [
        DatePipe,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: { open: () => { } } }, 
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: { open: () => { } } },
        { provide: ToastrService, useValue: { success: () => { }, error: () => { } } }
      ] 
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
