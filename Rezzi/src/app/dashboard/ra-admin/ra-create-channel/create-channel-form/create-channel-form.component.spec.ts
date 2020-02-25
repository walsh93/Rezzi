import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChannelFormComponent } from './create-channel-form.component';

describe('CreateChannelFormComponent', () => {
  let component: CreateChannelFormComponent;
  let fixture: ComponentFixture<CreateChannelFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateChannelFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChannelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
