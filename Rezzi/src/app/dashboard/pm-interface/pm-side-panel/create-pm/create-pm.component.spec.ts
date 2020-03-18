import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePmComponent } from './create-pm.component';

describe('CreatePmComponent', () => {
  let component: CreatePmComponent;
  let fixture: ComponentFixture<CreatePmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
