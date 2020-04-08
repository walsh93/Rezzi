import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPrivilegsComponent } from './assign-privilegs.component';

describe('AssignPrivilegsComponent', () => {
  let component: AssignPrivilegsComponent;
  let fixture: ComponentFixture<AssignPrivilegsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPrivilegsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPrivilegsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
