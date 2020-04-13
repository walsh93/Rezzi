import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveUsersComponent } from './move-users.component';

describe('MoveUsersComponent', () => {
  let component: MoveUsersComponent;
  let fixture: ComponentFixture<MoveUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
