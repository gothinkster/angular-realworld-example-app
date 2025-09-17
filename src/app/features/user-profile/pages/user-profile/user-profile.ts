import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { catchError, switchMap } from "rxjs/operators";
import { combineLatest, of, throwError } from "rxjs";
import { UserService } from "../../../../core/auth/services/user.service";

import { UserProfileApi } from "../../services/user-profile-api";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FollowButton } from "../../components/follow-button";
import { IUserProfile } from "../../models/user-profile.model";

@Component({
  selector: "app-profile-page",
  templateUrl: "./user-profile.html",
  imports: [
    FollowButton,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    FollowButton,
  ],
})
export class UserProfile implements OnInit {
  profile!: IUserProfile;
  isUser: boolean = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly profileService: UserProfileApi,
  ) {}

  ngOnInit() {
    this.profileService
      .get(this.route.snapshot.params["username"])
      .pipe(
        catchError((error) => {
          void this.router.navigate(["/"]);
          return throwError(() => error);
        }),
        switchMap((profile) => {
          return combineLatest([of(profile), this.userService.currentUser]);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([profile, user]) => {
        this.profile = profile;
        this.isUser = profile.username === user?.username;
      });
  }

  onToggleFollowing(profile: IUserProfile) {
    this.profile = profile;
  }
}
