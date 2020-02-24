import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelPanelComponent } from './channel-panel.component';

describe('ChannelPanelComponent', () => {
  let component: ChannelPanelComponent;
  let fixture: ComponentFixture<ChannelPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
