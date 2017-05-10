import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ArticleListConfig, Profile } from '../shared';

@Component({
  selector: 'profile-articles',
  templateUrl: './profile-articles.component.html'
})
export class ProfileArticlesComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  profile: Profile;
  articlesConfig: ArticleListConfig = new ArticleListConfig();

  ngOnInit() {
    this.route.parent.data.subscribe(
      (data: {profile: Profile}) => {
        this.profile = data.profile;
        this.articlesConfig = new ArticleListConfig(); // Only method I found to refresh article load on swap
        this.articlesConfig.filters.author = this.profile.username;
      }
    );
  }

}
