/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatrizItemsComponent } from './matriz-items.component';

describe('MatrizItemsComponent', () => {
  let component: MatrizItemsComponent;
  let fixture: ComponentFixture<MatrizItemsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MatrizItemsComponent],
      providers: [
        MessageService,
        DatePipe,
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
    fixture = TestBed.createComponent(MatrizItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
