import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Importamos HttpClientModule
import { HttpTestingController } from '@angular/common/http/testing'; // Importamos HttpTestingController

describe('ApiService', () => {
    let service: ApiService;
    let httpMock: HttpTestingController;  // Para controlar las solicitudes HTTP

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],  // Importamos HttpClientModule
            providers: [ApiService,
                DatePipe,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: MatSnackBar, useValue: { open: () => { } } },
                { provide: MatDialog, useValue: { open: () => { } } },
                { provide: MatDialogRef, useValue: {} },
                { provide: ToastrService, useValue: { success: () => { }, error: () => { } } },
                { provide: MAT_DIALOG_DATA, useValue: {} }
            ]  // Proveemos ApiService
        });
        service = TestBed.inject(ApiService);
        httpMock = TestBed.inject(HttpTestingController);  // Inyectamos HttpTestingController
    });

    afterEach(() => {
        httpMock.verify();  // Verificamos si todas las solicitudes han sido realizadas
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
