import { TestBed } from '@angular/core/testing';

import { ConsultCepService } from './consult-cep.service';

describe('ConsultCepService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsultCepService = TestBed.get(ConsultCepService);
    expect(service).toBeTruthy();
  });
});
