import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarPanelComponent } from './calendar-panel.component';

describe('CalendarPanelComponent', () => {
  let component: CalendarPanelComponent;
  let fixture: ComponentFixture<CalendarPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
