/* eslint-disable @typescript-eslint/no-unused-vars */
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {HeaderComponent} from './header.component';
import { Store } from '@ngrx/store';
import { MatMenuModule } from '@angular/material/menu';
import { OrderByPipe } from 'ngx-pipes';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [StoreModule.forRoot({}), MatMenuModule],
                providers: [
                    DatePipe,
                    provideHttpClient(),
                    provideHttpClientTesting(),
                    { provide: MatSnackBar, useValue: { open: () => { } } },
                    { provide: MatDialog, useValue: { open: () => { } } },
                    { provide: MatDialogRef, useValue: {} },
                    { provide: ToastrService, useValue: { success: () => { }, error: () => { } } },
                    { provide: MAT_DIALOG_DATA, useValue: {} }
                ],
                declarations: [HeaderComponent, OrderByPipe]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
