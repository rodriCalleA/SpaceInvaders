import { TestBed } from '@angular/core/testing';

import { AuthTokenInterceptorService } from './interceptor.service';

describe('AuthTokenInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthTokenInterceptorService = TestBed.get(AuthTokenInterceptorService);
    expect(service).toBeTruthy();
  });
});
