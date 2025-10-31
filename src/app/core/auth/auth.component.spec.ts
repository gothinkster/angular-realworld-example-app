import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import AuthComponent from './auth.component';
import { UserService } from './services/user.service';
import { ListErrorsComponent } from '../../shared/components/list-errors.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  const mockUser = {
    email: 'test@example.com',
    token: 'test-token',
    username: 'testuser',
    bio: 'Test bio',
    image: 'https://example.com/avatar.jpg'
  };

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['login', 'register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AuthComponent, ReactiveFormsModule, ListErrorsComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: [{ path: 'login' }]
            }
          }
        }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with empty form', () => {
      expect(component.authForm).toBeDefined();
      expect(component.authForm.get('email')?.value).toBe('');
      expect(component.authForm.get('password')?.value).toBe('');
    });

    it('should set authType to login on init', () => {
      fixture.detectChanges();
      expect(component.authType).toBe('login');
    });

    it('should set title to "Sign in" for login', () => {
      fixture.detectChanges();
      expect(component.title).toBe('Sign in');
    });

    it('should not have username field for login', () => {
      fixture.detectChanges();
      expect(component.authForm.get('username')).toBeUndefined();
    });

    it('should initialize errors as empty object', () => {
      expect(component.errors).toEqual({ errors: {} });
    });

    it('should initialize isSubmitting as false', () => {
      expect(component.isSubmitting).toBe(false);
    });
  });

  describe('Register mode', () => {
    beforeEach(() => {
      activatedRoute.snapshot.url = [{ path: 'register' }];
      fixture = TestBed.createComponent(AuthComponent);
      component = fixture.componentInstance;
    });

    it('should set authType to register', () => {
      fixture.detectChanges();
      expect(component.authType).toBe('register');
    });

    it('should set title to "Sign up" for register', () => {
      fixture.detectChanges();
      expect(component.title).toBe('Sign up');
    });

    it('should add username field for register', () => {
      fixture.detectChanges();
      expect(component.authForm.get('username')).toBeDefined();
    });

    it('should require username for register', () => {
      fixture.detectChanges();
      const usernameControl = component.authForm.get('username');
      expect(usernameControl?.hasError('required')).toBe(true);
    });
  });

  describe('Form validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should require email', () => {
      const emailControl = component.authForm.get('email');
      expect(emailControl?.hasError('required')).toBe(true);
    });

    it('should require password', () => {
      const passwordControl = component.authForm.get('password');
      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should be invalid when empty', () => {
      expect(component.authForm.valid).toBe(false);
    });

    it('should be valid with email and password', () => {
      component.authForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(component.authForm.valid).toBe(true);
    });

    it('should accept valid email', () => {
      component.authForm.get('email')?.setValue('test@example.com');
      expect(component.authForm.get('email')?.valid).toBe(true);
    });

    it('should accept any password', () => {
      component.authForm.get('password')?.setValue('pass');
      expect(component.authForm.get('password')?.valid).toBe(true);
    });
  });

  describe('Login submission', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.authForm.patchValue({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should call userService.login with form values', () => {
      userService.login.and.returnValue(of({ user: mockUser }));

      component.submitForm();

      expect(userService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should set isSubmitting to true', () => {
      userService.login.and.returnValue(of({ user: mockUser }));

      component.submitForm();

      expect(component.isSubmitting).toBe(true);
    });

    it('should clear errors on submit', () => {
      component.errors = { errors: { email: ['Invalid'] } };
      userService.login.and.returnValue(of({ user: mockUser }));

      component.submitForm();

      expect(component.errors).toEqual({ errors: {} });
    });

    it('should navigate to home on success', (done) => {
      userService.login.and.returnValue(of({ user: mockUser }));

      component.submitForm();

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/']);
        done();
      }, 0);
    });

    it('should handle login error', (done) => {
      const error = { errors: { 'email or password': ['is invalid'] } };
      userService.login.and.returnValue(throwError(() => error));

      component.submitForm();

      setTimeout(() => {
        expect(component.errors).toEqual(error);
        expect(component.isSubmitting).toBe(false);
        done();
      }, 0);
    });
  });

  describe('Register submission', () => {
    beforeEach(() => {
      activatedRoute.snapshot.url = [{ path: 'register' }];
      fixture = TestBed.createComponent(AuthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.authForm.patchValue({
        email: 'new@example.com',
        password: 'password123',
        username: 'newuser'
      });
    });

    it('should call userService.register with form values', () => {
      userService.register.and.returnValue(of({ user: mockUser }));

      component.submitForm();

      expect(userService.register).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        username: 'newuser'
      });
    });

    it('should navigate to home on success', (done) => {
      userService.register.and.returnValue(of({ user: mockUser }));

      component.submitForm();

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/']);
        done();
      }, 0);
    });

    it('should handle register error', (done) => {
      const error = { errors: { email: ['has already been taken'] } };
      userService.register.and.returnValue(throwError(() => error));

      component.submitForm();

      setTimeout(() => {
        expect(component.errors).toEqual(error);
        expect(component.isSubmitting).toBe(false);
        done();
      }, 0);
    });
  });

  describe('Form controls', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should update email value', () => {
      const email = 'updated@example.com';
      component.authForm.get('email')?.setValue(email);
      expect(component.authForm.get('email')?.value).toBe(email);
    });

    it('should update password value', () => {
      const password = 'newpassword';
      component.authForm.get('password')?.setValue(password);
      expect(component.authForm.get('password')?.value).toBe(password);
    });

    it('should handle empty email', () => {
      component.authForm.get('email')?.setValue('');
      expect(component.authForm.get('email')?.hasError('required')).toBe(true);
    });

    it('should handle empty password', () => {
      component.authForm.get('password')?.setValue('');
      expect(component.authForm.get('password')?.hasError('required')).toBe(true);
    });
  });

  describe('Edge cases', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle multiple submissions', () => {
      userService.login.and.returnValue(of({ user: mockUser }));
      component.authForm.patchValue({
        email: 'test@example.com',
        password: 'password'
      });

      component.submitForm();
      component.submitForm();

      expect(userService.login).toHaveBeenCalledTimes(2);
    });

    it('should handle very long email', () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      component.authForm.get('email')?.setValue(longEmail);
      expect(component.authForm.get('email')?.value).toBe(longEmail);
    });

    it('should handle special characters in password', () => {
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      component.authForm.get('password')?.setValue(specialPassword);
      expect(component.authForm.get('password')?.value).toBe(specialPassword);
    });
  });

  describe('Component lifecycle', () => {
    it('should call ngOnInit', () => {
      spyOn(component, 'ngOnInit');
      fixture.detectChanges();
      expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should handle component destruction', () => {
      fixture.detectChanges();
      expect(() => fixture.destroy()).not.toThrow();
    });
  });

  describe('Error handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.authForm.patchValue({
        email: 'test@example.com',
        password: 'password'
      });
    });

    it('should display network errors', (done) => {
      const networkError = { errors: { network: ['Connection failed'] } };
      userService.login.and.returnValue(throwError(() => networkError));

      component.submitForm();

      setTimeout(() => {
        expect(component.errors).toEqual(networkError);
        done();
      }, 0);
    });

    it('should display validation errors', (done) => {
      const validationError = {
        errors: {
          email: ['is invalid'],
          password: ['is too short']
        }
      };
      userService.login.and.returnValue(throwError(() => validationError));

      component.submitForm();

      setTimeout(() => {
        expect(component.errors).toEqual(validationError);
        done();
      }, 0);
    });
  });
});
