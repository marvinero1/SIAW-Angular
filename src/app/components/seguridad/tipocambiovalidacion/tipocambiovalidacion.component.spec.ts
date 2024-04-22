import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocambiovalidacionComponent } from './tipocambiovalidacion.component';

describe('TipocambiovalidacionComponent', () => {
  let component: TipocambiovalidacionComponent;
  let fixture: ComponentFixture<TipocambiovalidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipocambiovalidacionComponent ]
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
