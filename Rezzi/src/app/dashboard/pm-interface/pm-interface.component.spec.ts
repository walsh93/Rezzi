import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmInterfaceComponent } from './pm-interface.component';

describe('PmInterfaceComponent', () => {
  let component: PmInterfaceComponent;
  let fixture: ComponentFixture<PmInterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmInterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
