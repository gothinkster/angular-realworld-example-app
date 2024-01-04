import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArticleListComponent } from "../../article/components/article-list.component";
import { ProfileService } from "../services/profile.service";
import { Profile } from "../models/profile.model";
import { ArticleListConfig } from "../../article/models/article-list-config.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-profile-favorites",
  template: `<app-article-list [limit]="10" [config]="favoritesConfig" />`,
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
