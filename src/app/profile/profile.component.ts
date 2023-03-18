import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User, UserService, Profile } from '../core';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  profile: Profile;
  currentUser: User;
  isUser: boolean;

  ngOnInit() {
    this.route.data.pipe(
      map(data => data.profile),
      switchMap((profile: Profile) => {
        this.profile = profile;

        // Load the current user's data.
        return this.userService.currentUser;
      })
    ).subscribe(
      (user: User) => {
        this.currentUser = user;
        this.isUser = (this.currentUser.username === this.profile.username);
    });
  }

  onToggleFollowing(following: boolean) {
    this.profile.following = following;
  }

}
