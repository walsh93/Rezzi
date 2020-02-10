import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaCreateChannelComponent } from './ra-create-channel.component';

describe('RaCreateChannelComponent', () => {
  let component: RaCreateChannelComponent;
  let fixture: ComponentFixture<RaCreateChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaCreateChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaCreateChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
