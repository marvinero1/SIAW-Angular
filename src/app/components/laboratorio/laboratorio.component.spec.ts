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
import { of } from 'rxjs';

describe('LaboratorioComponent', () => {
  let component: LaboratorioComponent;
  let fixture: ComponentFixture<LaboratorioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatMenuModule],
      declarations: [LaboratorioComponent],
      providers: [
        DatePipe,
        { provide: ProductService, useValue: { getProducts: () => of([]) } }, // Mock básico
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
    fixture = TestBed.createComponent(LaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // 🔹 Asegurar que Angular detecte los cambios
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // 🔹 Si sigue fallando, loguear component
  });

});
