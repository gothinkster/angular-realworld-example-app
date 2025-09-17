import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArticleList } from "../../article/components/article-list";
import { UserProfileApi } from "../services/user-profile-api";
import { IArticleListConfig } from "../../article/models/article-list-config.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IUserProfile } from "../models/user-profile.model";

@Component({
  selector: "app-profile-articles",
  template: `<app-article-list [limit]="10" [config]="articlesConfig" />`,
  imports: [ArticleList],
})
export default class UserProfileArticles implements OnInit {
  profile!: IUserProfile;
  articlesConfig!: IArticleListConfig;
  destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private readonly profileService: UserProfileApi,
  ) {}

  ngOnInit(): void {
    this.profileService
      .get(this.route.snapshot.params["username"])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile: IUserProfile) => {
          this.profile = profile;
          this.articlesConfig = {
            type: "all",
            filters: {
              author: this.profile.username,
            },
          };
        },
      });
  }
}
