import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { JwtService } from './jwt.service';
import { User } from '../user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let jwtService: jasmine.SpyObj<JwtService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = {
    email: 'test@example.com',
    token: 'test-jwt-token',
    username: 'testuser',
    bio: 'Test bio',
    image: 'https://example.com/avatar.jpg'
  };

  beforeEach(() => {
    const jwtServiceSpy = jasmine.createSpyObj('JwtService', ['saveToken', 'destroyToken', 'getToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: JwtService, useValue: jwtServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    jwtService = TestBed.inject(JwtService) as jasmine.SpyObj<JwtService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('currentUser observable', () => {
    it('should emit null initially', (done) => {
      service.currentUser.subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });

    it('should emit distinct values only', (done) => {
      const emissions: (User | null)[] = [];
      
      service.currentUser.subscribe(user => {
        emissions.push(user);
        
        if (emissions.length === 2) {
          expect(emissions).toEqual([null, mockUser]);
          done();
        }
      });

      service.setAuth(mockUser);
      service.setAuth(mockUser); // Should not emit again
    });
  });

  describe('isAuthenticated observable', () => {
    it('should emit false when no user is authenticated', (done) => {
      service.isAuthenticated.subscribe(isAuth => {
        expect(isAuth).toBe(false);
        done();
      });
    });

    it('should emit true when user is authenticated', (done) => {
      let emissionCount = 0;
      
      service.isAuthenticated.subscribe(isAuth => {
        emissionCount++;
        if (emissionCount === 1) {
          expect(isAuth).toBe(false);
        } else if (emissionCount === 2) {
          expect(isAuth).toBe(true);
          done();
        }
      });

      service.setAuth(mockUser);
    });
  });

  describe('login', () => {
    it('should send POST request to /users/login', () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      
      service.login(credentials).subscribe();

      const req = httpMock.expectOne('/users/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ user: credentials });
      
      req.flush({ user: mockUser });
    });

    it('should call setAuth with returned user', (done) => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      
      service.login(credentials).subscribe(() => {
        expect(jwtService.saveToken).toHaveBeenCalledWith(mockUser.token);
        done();
      });

      const req = httpMock.expectOne('/users/login');
      req.flush({ user: mockUser });
    });

    it('should update currentUser after successful login', (done) => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      let emissionCount = 0;
      
      service.currentUser.subscribe(user => {
        emissionCount++;
        if (emissionCount === 2) {
          expect(user).toEqual(mockUser);
          done();
        }
      });

      service.login(credentials).subscribe();

      const req = httpMock.expectOne('/users/login');
      req.flush({ user: mockUser });
    });

    it('should handle login error', (done) => {
      const credentials = { email: 'test@example.com', password: 'wrong' };
      const errorResponse = { status: 401, statusText: 'Unauthorized' };
      
      service.login(credentials).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          done();
        }
      });

      const req = httpMock.expectOne('/users/login');
      req.flush('Invalid credentials', errorResponse);
    });
  });

  describe('register', () => {
    it('should send POST request to /users', () => {
      const credentials = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      };
      
      service.register(credentials).subscribe();

      const req = httpMock.expectOne('/users');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ user: credentials });
      
      req.flush({ user: mockUser });
    });

    it('should call setAuth with returned user', (done) => {
      const credentials = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      };
      
      service.register(credentials).subscribe(() => {
        expect(jwtService.saveToken).toHaveBeenCalledWith(mockUser.token);
        done();
      });

      const req = httpMock.expectOne('/users');
      req.flush({ user: mockUser });
    });

    it('should handle registration error', (done) => {
      const credentials = {
        username: 'existing',
        email: 'existing@example.com',
        password: 'password123'
      };
      const errorResponse = { status: 422, statusText: 'Unprocessable Entity' };
      
      service.register(credentials).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(422);
          done();
        }
      });

      const req = httpMock.expectOne('/users');
      req.flush('User already exists', errorResponse);
    });
  });

  describe('logout', () => {
    it('should call purgeAuth', () => {
      service.logout();
      
      expect(jwtService.destroyToken).toHaveBeenCalled();
    });

    it('should navigate to home page', () => {
      service.logout();
      
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should clear currentUser', (done) => {
      // First set a user
      service.setAuth(mockUser);
      
      let emissionCount = 0;
      service.currentUser.subscribe(user => {
        emissionCount++;
        if (emissionCount === 3) {
          expect(user).toBeNull();
          done();
        }
      });

      service.logout();
    });
  });

  describe('getCurrentUser', () => {
    it('should send GET request to /user', () => {
      service.getCurrentUser().subscribe();

      const req = httpMock.expectOne('/user');
      expect(req.request.method).toBe('GET');
      
      req.flush({ user: mockUser });
    });

    it('should call setAuth on success', (done) => {
      service.getCurrentUser().subscribe(() => {
        expect(jwtService.saveToken).toHaveBeenCalledWith(mockUser.token);
        done();
      });

      const req = httpMock.expectOne('/user');
      req.flush({ user: mockUser });
    });

    it('should call purgeAuth on error', (done) => {
      const errorResponse = { status: 401, statusText: 'Unauthorized' };
      
      service.getCurrentUser().subscribe({
        next: () => fail('should have failed'),
        error: () => {
          expect(jwtService.destroyToken).toHaveBeenCalled();
          done();
        }
      });

      const req = httpMock.expectOne('/user');
      req.flush('Unauthorized', errorResponse);
    });

    it('should share replay the result', () => {
      const observable = service.getCurrentUser();
      
      observable.subscribe();
      observable.subscribe();

      // Should only make one HTTP request
      const requests = httpMock.match('/user');
      expect(requests.length).toBe(1);
      
      requests[0].flush({ user: mockUser });
    });
  });

  describe('update', () => {
    it('should send PUT request to /user', () => {
      const updates: Partial<User> = {
        bio: 'Updated bio',
        image: 'https://example.com/new-avatar.jpg'
      };
      
      service.update(updates).subscribe();

      const req = httpMock.expectOne('/user');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ user: updates });
      
      req.flush({ user: { ...mockUser, ...updates } });
    });

    it('should update currentUser with new values', (done) => {
      const updates: Partial<User> = { bio: 'Updated bio' };
      const updatedUser = { ...mockUser, ...updates };
      
      let emissionCount = 0;
      service.currentUser.subscribe(user => {
        emissionCount++;
        if (emissionCount === 2) {
          expect(user).toEqual(updatedUser);
          done();
        }
      });

      service.update(updates).subscribe();

      const req = httpMock.expectOne('/user');
      req.flush({ user: updatedUser });
    });

    it('should handle update error', (done) => {
      const updates: Partial<User> = { bio: 'Updated bio' };
      const errorResponse = { status: 422, statusText: 'Unprocessable Entity' };
      
      service.update(updates).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(422);
          done();
        }
      });

      const req = httpMock.expectOne('/user');
      req.flush('Invalid data', errorResponse);
    });
  });

  describe('setAuth', () => {
    it('should save token to JwtService', () => {
      service.setAuth(mockUser);
      
      expect(jwtService.saveToken).toHaveBeenCalledWith(mockUser.token);
    });

    it('should update currentUser subject', (done) => {
      let emissionCount = 0;
      
      service.currentUser.subscribe(user => {
        emissionCount++;
        if (emissionCount === 2) {
          expect(user).toEqual(mockUser);
          done();
        }
      });

      service.setAuth(mockUser);
    });
  });

  describe('purgeAuth', () => {
    it('should destroy token in JwtService', () => {
      service.purgeAuth();
      
      expect(jwtService.destroyToken).toHaveBeenCalled();
    });

    it('should set currentUser to null', (done) => {
      // First set a user
      service.setAuth(mockUser);
      
      let emissionCount = 0;
      service.currentUser.subscribe(user => {
        emissionCount++;
        if (emissionCount === 3) {
          expect(user).toBeNull();
          done();
        }
      });

      service.purgeAuth();
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete authentication flow', (done) => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const emissions: (User | null)[] = [];
      
      service.currentUser.subscribe(user => {
        emissions.push(user);
      });

      // Login
      service.login(credentials).subscribe(() => {
        expect(emissions[1]).toEqual(mockUser);
        
        // Logout
        service.logout();
        
        setTimeout(() => {
          expect(emissions[2]).toBeNull();
          done();
        }, 0);
      });

      const req = httpMock.expectOne('/users/login');
      req.flush({ user: mockUser });
    });

    it('should maintain authentication state across multiple operations', (done) => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      
      service.login(credentials).subscribe(() => {
        service.isAuthenticated.subscribe(isAuth => {
          expect(isAuth).toBe(true);
          
          const updates = { bio: 'New bio' };
          service.update(updates).subscribe(() => {
            service.isAuthenticated.subscribe(stillAuth => {
              expect(stillAuth).toBe(true);
              done();
            });
          });

          const updateReq = httpMock.expectOne('/user');
          updateReq.flush({ user: { ...mockUser, ...updates } });
        });
      });

      const loginReq = httpMock.expectOne('/users/login');
      loginReq.flush({ user: mockUser });
    });
  });
});
