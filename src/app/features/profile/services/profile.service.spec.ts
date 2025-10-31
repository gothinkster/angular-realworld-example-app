import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';
import { Profile } from '../models/profile.model';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  const mockProfile: Profile = {
    username: 'testuser',
    bio: 'Test bio',
    image: 'https://example.com/avatar.jpg',
    following: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService]
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should fetch profile by username', (done) => {
      const username = 'testuser';

      service.get(username).subscribe(profile => {
        expect(profile).toEqual(mockProfile);
        done();
      });

      const req = httpMock.expectOne(`/profiles/${username}`);
      expect(req.request.method).toBe('GET');
      req.flush({ profile: mockProfile });
    });

    it('should extract profile from response wrapper', (done) => {
      const username = 'testuser';

      service.get(username).subscribe(profile => {
        expect(profile).toEqual(mockProfile);
        expect((profile as any).profile).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne(`/profiles/${username}`);
      req.flush({ profile: mockProfile });
    });

    it('should handle profile not found', (done) => {
      const username = 'nonexistent';
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.get(username).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`/profiles/${username}`);
      req.flush('Profile not found', errorResponse);
    });

    it('should handle username with special characters', () => {
      const username = 'user-name_123';

      service.get(username).subscribe();

      const req = httpMock.expectOne(`/profiles/${username}`);
      req.flush({ profile: { ...mockProfile, username } });
    });

    it('should share replay the result', () => {
      const username = 'testuser';
      const observable = service.get(username);

      observable.subscribe();
      observable.subscribe();

      const requests = httpMock.match(`/profiles/${username}`);
      expect(requests.length).toBe(1);

      requests[0].flush({ profile: mockProfile });
    });

    it('should handle profile with null bio', (done) => {
      const username = 'testuser';
      const profileWithNullBio = { ...mockProfile, bio: null };

      service.get(username).subscribe(profile => {
        expect(profile.bio).toBeNull();
        done();
      });

      const req = httpMock.expectOne(`/profiles/${username}`);
      req.flush({ profile: profileWithNullBio });
    });

    it('should handle profile with empty image', (done) => {
      const username = 'testuser';
      const profileWithEmptyImage = { ...mockProfile, image: '' };

      service.get(username).subscribe(profile => {
        expect(profile.image).toBe('');
        done();
      });

      const req = httpMock.expectOne(`/profiles/${username}`);
      req.flush({ profile: profileWithEmptyImage });
    });

    it('should handle following status true', (done) => {
      const username = 'followeduser';
      const followedProfile = { ...mockProfile, username, following: true };

      service.get(username).subscribe(profile => {
        expect(profile.following).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`/profiles/${username}`);
      req.flush({ profile: followedProfile });
    });

    it('should handle unauthorized access', (done) => {
      const username = 'privateuser';
      const errorResponse = { status: 401, statusText: 'Unauthorized' };

      service.get(username).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          done();
        }
      });

      const req = httpMock.expectOne(`/profiles/${username}`);
      req.flush('Unauthorized', errorResponse);
    });

    it('should handle server error', (done) => {
      const username = 'testuser';
      const errorResponse = { status: 500, statusText: 'Server Error' };

      service.get(username).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne(`/profiles/${username}`);
      req.flush('Server error', errorResponse);
    });
  });

  describe('follow', () => {
    it('should follow a user', (done) => {
      const username = 'usertofollow';
      const followedProfile = { ...mockProfile, username, following: true };

      service.follow(username).subscribe(profile => {
        expect(profile.following).toBe(true);
        expect(profile.username).toBe(username);
        done();
      });

      const req = httpMock.expectOne(`/profiles/${username}/follow`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush({ profile: followedProfile });
    });

    it('should extract profile from response wrapper', (done) => {
      const username = 'testuser';
      const followedProfile = { ...mockProfile, following: true };

      service.follow(username).subscribe(profile => {
        expect((profile as any).profile).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne(`/profiles/${username}/follow`);
      req.flush({ profile: followedProfile });
    });

    it('should handle already following', (done) => {
      const username = 'alreadyfollowed';
      const alreadyFollowedProfile = { ...mockProfile, username, following: true };

      service.follow(username).subscribe(profile => {
        expect(profile.following).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`/profiles/${username}/follow`);
      req.flush({ profile: alreadyFollowedProfile });
    });

    it('should handle follow error', (done) => {
      const username = 'cannotfollow';
      const errorResponse = { status: 403, statusText: 'Forbidden' };

      service.follow(username).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(403);
          done();
        }
      });

      const req = httpMock.expectOne(`/profiles/${username}/follow`);
      req.flush('Cannot follow', errorResponse);
    });

    it('should handle unauthorized follow', (done) => {
      const username = 'someuser';
      const errorResponse = { status: 401, statusText: 'Unauthorized' };

      service.follow(username).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          done();
        }
      });

      const req = httpMock.expectOne(`/profiles/${username}/follow`);
      req.flush('Must be logged in', errorResponse);
    });

    it('should handle user not found', (done) => {
      const username = 'nonexistent';
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.follow(username).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`/profiles/${username}/follow`);
      req.flush('User not found', errorResponse);
    });

    it('should send empty body in POST request', () => {
      const username = 'testuser';

      service.follow(username).subscribe();

      const req = httpMock.expectOne(`/profiles/${username}/follow`);
      expect(req.request.body).toEqual({});
      req.flush({ profile: { ...mockProfile, following: true } });
    });
  });

  describe('unfollow', () => {
    it('should unfollow a user', (done) => {
      const username = 'usertounfollow';
      const unfollowedProfile = { ...mockProfile, username, following: false };

      service.unfollow(username).subscribe(profile => {
        expect(profile.following).toBe(false);
        expect(profile.username).toBe(username);
        done();
      });

      const req = httpMock.expectOne(`/profiles/${username}/follow`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ profile: unfollowedProfile });
    });

    it('should extract profile from response wrapper', (done) => {
      const username = 'testuser';
      const unfollowedProfile = { ...mockProfile, following: false };

      service.unfollow(username).subscribe(profile => {
        expect((profile as any).profile).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne(`/profiles/${username}/follow`);
      req.flush({ profile: unfollowedProfile });
    });

    it('should handle already not following', (done) => {
      const username = 'notfollowed';
      const notFollowedProfile = { ...mockProfile, username, following: false };

      service.unfollow(username).subscribe(profile => {
        expect(profile.following).toBe(false);
        done();
      });

      const req = httpMock.expectOne(`/profiles/${username}/follow`);
      req.flush({ profile: notFollowedProfile });
    });

    it('should handle unfollow error', (done) => {
      const username = 'cannotunfollow';
      const errorResponse = { status: 403, statusText: 'Forbidden' };

      service.unfollow(username).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(403);
          done();
        }
      });

      const req = httpMock.expectOne(`/profiles/${username}/follow`);
      req.flush('Cannot unfollow', errorResponse);
    });

    it('should handle unauthorized unfollow', (done) => {
      const username = 'someuser';
      const errorResponse = { status: 401, statusText: 'Unauthorized' };

      service.unfollow(username).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          done();
        }
      });

      const req = httpMock.expectOne(`/profiles/${username}/follow`);
      req.flush('Must be logged in', errorResponse);
    });

    it('should handle user not found', (done) => {
      const username = 'nonexistent';
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.unfollow(username).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`/profiles/${username}/follow`);
      req.flush('User not found', errorResponse);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle follow then unfollow sequence', (done) => {
      const username = 'testuser';
      
      service.follow(username).subscribe(profile => {
        expect(profile.following).toBe(true);

        service.unfollow(username).subscribe(unfollowedProfile => {
          expect(unfollowedProfile.following).toBe(false);
          done();
        });

        const unfollowReq = httpMock.expectOne(`/profiles/${username}/follow`);
        unfollowReq.flush({ profile: { ...mockProfile, following: false } });
      });

      const followReq = httpMock.expectOne(`/profiles/${username}/follow`);
      followReq.flush({ profile: { ...mockProfile, following: true } });
    });

    it('should handle get then follow sequence', (done) => {
      const username = 'testuser';

      service.get(username).subscribe(profile => {
        expect(profile.following).toBe(false);

        service.follow(username).subscribe(followedProfile => {
          expect(followedProfile.following).toBe(true);
          done();
        });

        const followReq = httpMock.expectOne(`/profiles/${username}/follow`);
        followReq.flush({ profile: { ...mockProfile, following: true } });
      });

      const getReq = httpMock.expectOne(`/profiles/${username}`);
      getReq.flush({ profile: mockProfile });
    });

    it('should handle multiple profile fetches with shareReplay', () => {
      const username = 'testuser';
      const observable = service.get(username);

      observable.subscribe();
      observable.subscribe();
      observable.subscribe();

      const requests = httpMock.match(`/profiles/${username}`);
      expect(requests.length).toBe(1);

      requests[0].flush({ profile: mockProfile });
    });
  });

  describe('Edge cases', () => {
    it('should handle username with numbers', () => {
      const username = 'user123';

      service.get(username).subscribe();

      const req = httpMock.expectOne(`/profiles/${username}`);
      req.flush({ profile: { ...mockProfile, username } });
    });

    it('should handle username with hyphens', () => {
      const username = 'user-name';

      service.get(username).subscribe();

      const req = httpMock.expectOne(`/profiles/${username}`);
      req.flush({ profile: { ...mockProfile, username } });
    });

    it('should handle username with underscores', () => {
      const username = 'user_name';

      service.get(username).subscribe();

      const req = httpMock.expectOne(`/profiles/${username}`);
      req.flush({ profile: { ...mockProfile, username } });
    });

    it('should handle very long username', () => {
      const username = 'a'.repeat(50);

      service.get(username).subscribe();

      const req = httpMock.expectOne(`/profiles/${username}`);
      req.flush({ profile: { ...mockProfile, username } });
    });

    it('should handle profile with very long bio', (done) => {
      const longBio = 'a'.repeat(1000);
      const profileWithLongBio = { ...mockProfile, bio: longBio };

      service.get('testuser').subscribe(profile => {
        expect(profile.bio).toBe(longBio);
        done();
      });

      const req = httpMock.expectOne('/profiles/testuser');
      req.flush({ profile: profileWithLongBio });
    });
  });
});
