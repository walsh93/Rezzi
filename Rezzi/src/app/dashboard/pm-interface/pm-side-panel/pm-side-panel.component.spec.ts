import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmSidePanelComponent } from './pm-side-panel.component';

describe('PmSidePanelComponent', () => {
  let component: PmSidePanelComponent;
  let fixture: ComponentFixture<PmSidePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmSidePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmSidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
