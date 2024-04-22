import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuImportacionesComponent } from './menu-importaciones.component';

describe('MenuImportacionesComponent', () => {
  let component: MenuImportacionesComponent;
  let fixture: ComponentFixture<MenuImportacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuImportacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuImportacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
