import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { MatMenuModule } from '@angular/material/menu';
import { TipocambiovalidacionComponent } from './tipocambiovalidacion.component';

describe('TipocambiovalidacionComponent', () => {
  let component: TipocambiovalidacionComponent;
  let fixture: ComponentFixture<TipocambiovalidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TipocambiovalidacionComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DatePipe,
        MessageService,
        { provide: ToastrService, useValue: { success: () => { }, error: () => { } } },
        { provide: MatSnackBar, useValue: { open: () => { } } },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: { open: () => { } } },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipocambiovalidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
