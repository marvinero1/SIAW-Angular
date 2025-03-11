/* eslint-disable @typescript-eslint/no-unused-vars */
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {ProfileComponent} from './profile.component';

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ProfileComponent],
                providers: [
                    DatePipe,
                    provideHttpClient(),
                    provideHttpClientTesting(),
                    { provide: MatSnackBar, useValue: { open: () => { } } },
                    { provide: MatDialog, useValue: { open: () => { } } },
                    { provide: ToastrService, useValue: { success: () => { }, error: () => { } } }
                ]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
