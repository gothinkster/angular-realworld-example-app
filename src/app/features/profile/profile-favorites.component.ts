import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArticleListComponent } from "../../shared/article-helpers/article-list.component";
import { ProfileService } from "../../core/services/profile.service";
import { Profile } from "../../core/models/profile.model";
import { ArticleListConfig } from "../../core/models/article-list-config.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-profile-favorites",
  templateUrl: "./profile-favorites.component.html",
  imports: [ArticleListComponent],
  standalone: true,
})
export default class ProfileFavoritesComponent implements OnInit {
  profile!: Profile;
  favoritesConfig!: ArticleListConfig;
  destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private readonly profileService: ProfileService,
  ) {}

  ngOnInit() {
    this.profileService
      .get(this.route.parent?.snapshot.params["username"])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile: Profile) => {
          this.profile = profile;
          this.favoritesConfig = {
            type: "all",
            filters: {
              favorited: this.profile.username,
            },
          };
        },
      });
  }
}
