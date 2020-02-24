import { TestBed } from '@angular/core/testing';

import { CreateRezziService } from './create-rezzi.service';

describe('CreateRezziService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateRezziService = TestBed.get(CreateRezziService);
    expect(service).toBeTruthy();
  });
});
