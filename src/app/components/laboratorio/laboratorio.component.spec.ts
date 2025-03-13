import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';


import { DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LaboratorioComponent } from './laboratorio.component';
import { ProductService } from './product.service';

describe('LaboratorioComponent', () => {
  let component: LaboratorioComponent;
  let fixture: ComponentFixture<LaboratorioComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ProductService],
      declarations: [],

    })
    .compileComponents();

    fixture = TestBed.createComponent(LaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatMenuModule, ProductService],
      declarations: [LaboratorioComponent],
      providers: [
        DatePipe,
        ProductService,
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


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
