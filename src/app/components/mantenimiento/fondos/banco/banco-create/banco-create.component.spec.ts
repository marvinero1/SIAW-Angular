import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BancoCreateComponent } from './banco-create.component';

describe('BancoCreateComponent', () => {
  let component: BancoCreateComponent;
  let fixture: ComponentFixture<BancoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BancoCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BancoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
