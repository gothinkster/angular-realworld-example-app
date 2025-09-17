import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArticleList } from "../../article/components/article-list";
import { UserProfileApi } from "../services/user-profile-api";
import { IArticleListConfig } from "../../article/models/article-list-config.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IUserProfile } from "../models/user-profile.model";

@Component({
  selector: "app-profile-favorites",
  template: `<app-article-list [limit]="10" [config]="favoritesConfig" />`,
  imports: [ArticleList],
})
export default class UserProfileFavorites implements OnInit {
  profile!: IUserProfile;
  favoritesConfig!: IArticleListConfig;
  destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private readonly profileService: UserProfileApi,
  ) {}

  ngOnInit() {
    this.profileService
      .get(this.route.parent?.snapshot.params["username"])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile: IUserProfile) => {
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
