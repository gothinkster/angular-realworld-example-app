import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArticleListComponent } from "../../article/components/article-list.component";
import { ProfileService } from "../services/profile.service";
import { Profile } from "../models/profile.model";
import { ArticleListConfig } from "../../article/models/article-list-config.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-profile-articles",
  template: `<app-article-list [limit]="10" [config]="articlesConfig" />`,
  imports: [ArticleListComponent],
  standalone: true,
})
export default class ProfileArticlesComponent implements OnInit {
  profile!: Profile;
  articlesConfig!: ArticleListConfig;
  destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private readonly profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.profileService
      .get(this.route.snapshot.params["username"])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile: Profile) => {
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
