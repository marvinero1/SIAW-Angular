import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlSidebarComponent } from './control-sidebar.component';
import { StoreModule } from '@ngrx/store';

describe('ControlSidebarComponent', () => {
  let component: ControlSidebarComponent;
  let fixture: ComponentFixture<ControlSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [ ControlSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
