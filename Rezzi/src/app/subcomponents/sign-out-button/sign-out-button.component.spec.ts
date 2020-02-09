import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOutButtonComponent } from './sign-out-button.component';

describe('SignOutButtonComponent', () => {
  let component: SignOutButtonComponent;
  let fixture: ComponentFixture<SignOutButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignOutButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignOutButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
