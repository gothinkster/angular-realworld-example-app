import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { UserService } from '../auth/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../auth/user.model';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let currentUserSubject: BehaviorSubject<User | null>;

  const mockUser: User = {
    email: 'test@example.com',
    token: 'test-token',
    username: 'testuser',
    bio: 'Test bio',
    image: 'https://example.com/avatar.jpg'
  };

  beforeEach(async () => {
    currentUserSubject = new BehaviorSubject<User | null>(null);
    const userServiceSpy = jasmine.createSpyObj('UserService', [], {
      currentUser: currentUserSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should have currentUser$ observable', () => {
      expect(component.currentUser$).toBeDefined();
    });

    it('should inject UserService', () => {
      expect(userService).toBeDefined();
    });

    it('should subscribe to currentUser from UserService', (done) => {
      component.currentUser$.subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });
  });

  describe('Logged out state', () => {
    beforeEach(() => {
      currentUserSubject.next(null);
      fixture.detectChanges();
    });

    it('should display brand link', () => {
      const brandLink = fixture.nativeElement.querySelector('.navbar-brand');
      expect(brandLink).toBeTruthy();
      expect(brandLink.textContent).toContain('conduit');
    });

    it('should display Home link', () => {
      const homeLink = fixture.nativeElement.querySelector('a[routerLink="/"]');
      expect(homeLink).toBeTruthy();
    });

    it('should display Sign in link', () => {
      const signInLink = fixture.nativeElement.querySelector('a[routerLink="/login"]');
      expect(signInLink).toBeTruthy();
      expect(signInLink.textContent).toContain('Sign in');
    });

    it('should display Sign up link', () => {
      const signUpLink = fixture.nativeElement.querySelector('a[routerLink="/register"]');
      expect(signUpLink).toBeTruthy();
      expect(signUpLink.textContent).toContain('Sign up');
    });

    it('should not display New Article link', () => {
      const newArticleLink = fixture.nativeElement.querySelector('a[routerLink="/editor"]');
      expect(newArticleLink).toBeFalsy();
    });

    it('should not display Settings link', () => {
      const settingsLink = fixture.nativeElement.querySelector('a[routerLink="/settings"]');
      expect(settingsLink).toBeFalsy();
    });

    it('should not display profile link', () => {
      const profileLinks = fixture.nativeElement.querySelectorAll('a[routerLink^="/profile/"]');
      expect(profileLinks.length).toBe(0);
    });
  });

  describe('Logged in state', () => {
    beforeEach(() => {
      currentUserSubject.next(mockUser);
      fixture.detectChanges();
    });

    it('should display brand link', () => {
      const brandLink = fixture.nativeElement.querySelector('.navbar-brand');
      expect(brandLink).toBeTruthy();
    });

    it('should display Home link', () => {
      const homeLink = fixture.nativeElement.querySelector('a[routerLink="/"]');
      expect(homeLink).toBeTruthy();
    });

    it('should display New Article link', () => {
      const newArticleLink = fixture.nativeElement.querySelector('a[routerLink="/editor"]');
      expect(newArticleLink).toBeTruthy();
      expect(newArticleLink.textContent).toContain('New Article');
    });

    it('should display Settings link', () => {
      const settingsLink = fixture.nativeElement.querySelector('a[routerLink="/settings"]');
      expect(settingsLink).toBeTruthy();
      expect(settingsLink.textContent).toContain('Settings');
    });

    it('should display profile link with username', () => {
      const profileLink = fixture.nativeElement.querySelector(`a[routerLink="/profile/${mockUser.username}"]`);
      expect(profileLink).toBeTruthy();
      expect(profileLink.textContent).toContain(mockUser.username);
    });

    it('should not display Sign in link', () => {
      const signInLink = fixture.nativeElement.querySelector('a[routerLink="/login"]');
      expect(signInLink).toBeFalsy();
    });

    it('should not display Sign up link', () => {
      const signUpLink = fixture.nativeElement.querySelector('a[routerLink="/register"]');
      expect(signUpLink).toBeFalsy();
    });

    it('should display ion-compose icon for New Article', () => {
      const newArticleLink = fixture.nativeElement.querySelector('a[routerLink="/editor"]');
      const icon = newArticleLink?.querySelector('i.ion-compose');
      expect(icon).toBeTruthy();
    });

    it('should display ion-gear-a icon for Settings', () => {
      const settingsLink = fixture.nativeElement.querySelector('a[routerLink="/settings"]');
      const icon = settingsLink?.querySelector('i.ion-gear-a');
      expect(icon).toBeTruthy();
    });
  });

  describe('Navigation structure', () => {
    it('should have navbar with correct classes', () => {
      fixture.detectChanges();
      const navbar = fixture.nativeElement.querySelector('nav.navbar.navbar-light');
      expect(navbar).toBeTruthy();
    });

    it('should have container div', () => {
      fixture.detectChanges();
      const container = fixture.nativeElement.querySelector('.container');
      expect(container).toBeTruthy();
    });

    it('should have nav list with correct classes', () => {
      fixture.detectChanges();
      const navList = fixture.nativeElement.querySelector('ul.nav.navbar-nav');
      expect(navList).toBeTruthy();
    });

    it('should have nav items as list items', () => {
      fixture.detectChanges();
      const navItems = fixture.nativeElement.querySelectorAll('li.nav-item');
      expect(navItems.length).toBeGreaterThan(0);
    });

    it('should have nav links with correct classes', () => {
      fixture.detectChanges();
      const navLinks = fixture.nativeElement.querySelectorAll('a.nav-link');
      expect(navLinks.length).toBeGreaterThan(0);
    });
  });

  describe('State transitions', () => {
    it('should update when user logs in', () => {
      currentUserSubject.next(null);
      fixture.detectChanges();

      let signInLink = fixture.nativeElement.querySelector('a[routerLink="/login"]');
      expect(signInLink).toBeTruthy();

      currentUserSubject.next(mockUser);
      fixture.detectChanges();

      signInLink = fixture.nativeElement.querySelector('a[routerLink="/login"]');
      expect(signInLink).toBeFalsy();

      const settingsLink = fixture.nativeElement.querySelector('a[routerLink="/settings"]');
      expect(settingsLink).toBeTruthy();
    });

    it('should update when user logs out', () => {
      currentUserSubject.next(mockUser);
      fixture.detectChanges();

      let settingsLink = fixture.nativeElement.querySelector('a[routerLink="/settings"]');
      expect(settingsLink).toBeTruthy();

      currentUserSubject.next(null);
      fixture.detectChanges();

      settingsLink = fixture.nativeElement.querySelector('a[routerLink="/settings"]');
      expect(settingsLink).toBeFalsy();

      const signInLink = fixture.nativeElement.querySelector('a[routerLink="/login"]');
      expect(signInLink).toBeTruthy();
    });

    it('should handle rapid state changes', () => {
      for (let i = 0; i < 10; i++) {
        currentUserSubject.next(i % 2 === 0 ? mockUser : null);
        fixture.detectChanges();
      }

      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('Router integration', () => {
    it('should have routerLink directives', () => {
      fixture.detectChanges();
      const routerLinks = fixture.nativeElement.querySelectorAll('[routerLink]');
      expect(routerLinks.length).toBeGreaterThan(0);
    });

    it('should have routerLinkActive on appropriate links', () => {
      fixture.detectChanges();
      const activeLinks = fixture.nativeElement.querySelectorAll('[routerLinkActive]');
      expect(activeLinks.length).toBeGreaterThan(0);
    });

    it('should have exact match option on home link when logged in', () => {
      currentUserSubject.next(mockUser);
      fixture.detectChanges();

      const homeLink = fixture.nativeElement.querySelector('a[routerLink="/"][routerLinkActiveOptions]');
      expect(homeLink).toBeTruthy();
    });
  });

  describe('User profile display', () => {
    it('should display username in profile link', () => {
      currentUserSubject.next(mockUser);
      fixture.detectChanges();

      const profileLink = fixture.nativeElement.querySelector(`a[routerLink="/profile/${mockUser.username}"]`);
      expect(profileLink?.textContent).toContain(mockUser.username);
    });

    it('should handle username with special characters', () => {
      const userWithSpecialChars = { ...mockUser, username: 'user-name_123' };
      currentUserSubject.next(userWithSpecialChars);
      fixture.detectChanges();

      const profileLink = fixture.nativeElement.querySelector(`a[routerLink="/profile/${userWithSpecialChars.username}"]`);
      expect(profileLink).toBeTruthy();
    });

    it('should handle very long username', () => {
      const userWithLongName = { ...mockUser, username: 'a'.repeat(50) };
      currentUserSubject.next(userWithLongName);
      fixture.detectChanges();

      const profileLink = fixture.nativeElement.querySelector(`a[routerLink="/profile/${userWithLongName.username}"]`);
      expect(profileLink).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic nav element', () => {
      fixture.detectChanges();
      const nav = fixture.nativeElement.querySelector('nav');
      expect(nav).toBeTruthy();
    });

    it('should have list structure for navigation', () => {
      fixture.detectChanges();
      const ul = fixture.nativeElement.querySelector('ul');
      expect(ul).toBeTruthy();
    });

    it('should have anchor tags for all links', () => {
      fixture.detectChanges();
      const links = fixture.nativeElement.querySelectorAll('a');
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link: HTMLElement) => {
        expect(link.tagName).toBe('A');
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle null user gracefully', () => {
      currentUserSubject.next(null);
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle user with missing properties', () => {
      const incompleteUser = { ...mockUser, bio: undefined, image: undefined } as any;
      currentUserSubject.next(incompleteUser);
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle component destruction', () => {
      fixture.detectChanges();
      expect(() => fixture.destroy()).not.toThrow();
    });

    it('should handle multiple change detections', () => {
      expect(() => {
        for (let i = 0; i < 100; i++) {
          fixture.detectChanges();
        }
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      fixture.detectChanges();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle rapid user changes efficiently', () => {
      const startTime = performance.now();

      for (let i = 0; i < 50; i++) {
        currentUserSubject.next(i % 2 === 0 ? mockUser : null);
        fixture.detectChanges();
      }

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
