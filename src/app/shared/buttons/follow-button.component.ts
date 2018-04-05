import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Profile, ProfilesService, UserService } from '../../core';
import { concatMap } from 'rxjs/operators/concatMap';
import { tap } from 'rxjs/operators/tap';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html'
})
export class FollowButtonComponent {
  constructor(
    private profilesService: ProfilesService,
    private router: Router,
    private userService: UserService
  ) {}

  @Input() profile: Profile;
  @Output() toggle = new EventEmitter<boolean>();
  isSubmitting = false;

  toggleFollowing() {
    this.isSubmitting = true;
    // TODO: remove nested subscribes, use mergeMap

    this.userService.isAuthenticated.pipe(concatMap(
      (authenticated) => {
        // Not authenticated? Push to login screen
        if (!authenticated) {
          this.router.navigateByUrl('/login');
          return of(null);
        }

        // Follow this profile if we aren't already
        if (!this.profile.following) {
          return this.profilesService.follow(this.profile.username)
          .pipe(tap(
            data => {
              this.isSubmitting = false;
              this.toggle.emit(true);
            },
            err => this.isSubmitting = false
          ));

        // Otherwise, unfollow this profile
        } else {
          return this.profilesService.unfollow(this.profile.username)
          .pipe(tap(
            data => {
              this.isSubmitting = false;
              this.toggle.emit(false);
            },
            err => this.isSubmitting = false
          ));
        }
      }
    )).subscribe();
  }
}
