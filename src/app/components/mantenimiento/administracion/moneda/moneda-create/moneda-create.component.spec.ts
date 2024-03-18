import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonedaCreateComponent } from './moneda-create.component';

describe('MonedaCreateComponent', () => {
  let component: MonedaCreateComponent;
  let fixture: ComponentFixture<MonedaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonedaCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonedaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
