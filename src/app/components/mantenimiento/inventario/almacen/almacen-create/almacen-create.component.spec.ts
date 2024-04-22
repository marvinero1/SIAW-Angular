import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenCreateComponent } from './almacen-create.component';

describe('AlmacenCreateComponent', () => {
  let component: AlmacenCreateComponent;
  let fixture: ComponentFixture<AlmacenCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlmacenCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlmacenCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
