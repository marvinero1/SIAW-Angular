/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { provideHttpClient } from '@angular/common/http'; 
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CatalogoMovimientoMercaderiaComponent } from './catalogo-movimiento-mercaderia.component';

describe('CatalogoMovimientoMercaderiaComponent', () => {
  let component: CatalogoMovimientoMercaderiaComponent;
  let fixture: ComponentFixture<CatalogoMovimientoMercaderiaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogoMovimientoMercaderiaComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(), 
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoMovimientoMercaderiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
