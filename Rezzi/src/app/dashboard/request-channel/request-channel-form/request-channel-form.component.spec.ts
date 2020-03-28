import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestChannelFormComponent } from './request-channel-form.component';

describe('RequestChannelFormComponent', () => {
  let component: RequestChannelFormComponent;
  let fixture: ComponentFixture<RequestChannelFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestChannelFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestChannelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
