import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MuteMembersComponent } from './mute-members.component';

describe('MuteMembersComponent', () => {
  let component: MuteMembersComponent;
  let fixture: ComponentFixture<MuteMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MuteMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MuteMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
