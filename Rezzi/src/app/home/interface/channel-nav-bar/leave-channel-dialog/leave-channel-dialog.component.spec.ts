import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveChannelDialogComponent } from './leave-channel-dialog.component';

describe('LeaveChannelDialogComponent', () => {
  let component: LeaveChannelDialogComponent;
  let fixture: ComponentFixture<LeaveChannelDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveChannelDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveChannelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
