import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRezziComponent } from './create-rezzi.component';

describe('CreateRezziComponent', () => {
  let component: CreateRezziComponent;
  let fixture: ComponentFixture<CreateRezziComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRezziComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRezziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
