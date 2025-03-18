import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { PrimeNGConfig } from 'primeng/api';

import { DatePipe } from '@angular/common';
import { ToastrConfig, TOAST_CONFIG } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';


const CUSTOM_TOAST_CONFIG: Partial<ToastrConfig> = {
    timeOut: 3000,
    positionClass: 'toast-top-right'
};

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;

    beforeEach(() => {
        const mockSessionStorage = {
            getItem: (key: string) => key === 'agencia_logueado' ? JSON.stringify({ name: 'AgenciaTest' }) : null,
            setItem: (key: string, value: string) => { }
        };

        spyOn(window.sessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);

        TestBed.configureTestingModule({
            imports: [
                ToastrModule.forRoot({ preventDuplicates: true }) // 🔹 Se configura aquí
            ],
            declarations: [AppComponent],
            providers: [
                PrimeNGConfig,
                DatePipe,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: MatSnackBar, useValue: { open: () => { } } },
                { provide: MatDialog, useValue: { open: () => { } } },
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: TOAST_CONFIG, useValue: CUSTOM_TOAST_CONFIG } // 🔹 Se usa un objeto válido
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
    });

    it('should render title in a h1 tag', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('title').textContent).toContain('Pertec SIAW');
    });
});


