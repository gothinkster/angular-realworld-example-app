import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { EMPTY } from "rxjs";
import { ProfileService } from "../../core/services/profile.service";
import { UserService } from "../../core/services/user.service";
import { Profile } from "../../core/models/profile.model";
import { NgClass } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-follow-button",
  templateUrl: "./follow-button.component.html",
  imports: [NgClass],
  standalone: true,
})
export class FollowButtonComponent {
  @Input() profile!: Profile;
  @Output() toggle = new EventEmitter<Profile>();
  isSubmitting = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly profileService: ProfileService,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  toggleFollowing(): void {
    this.isSubmitting = true;

    this.userService.isAuthenticated
      .pipe(
        switchMap((isAuthenticated: boolean) => {
          if (!isAuthenticated) {
            void this.router.navigate(["/login"]);
            return EMPTY;
          }

          if (!this.profile.following) {
            return this.profileService.follow(this.profile.username);
          } else {
            return this.profileService.unfollow(this.profile.username);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (profile) => {
          this.isSubmitting = false;
          this.toggle.emit(profile);
        },
        error: () => (this.isSubmitting = false),
      });
  }
}
