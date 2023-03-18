import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ArticleListConfig, TagsService } from '../core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private tagsService: TagsService,
    private route:ActivatedRoute
    ) {}

  isAuthenticated: boolean;
  listConfig: ArticleListConfig = {
    type: 'all',
    filters: {}
  };
  tags: Array<string> = [];
  tagsLoaded = false;

  ngOnInit() {
    this.route.data.subscribe((data: { isAuthenticated: boolean }) =>{
      this.isAuthenticated = data.isAuthenticated;
        // set the article list accordingly
        if (data.isAuthenticated) {
          this.setListTo('feed');
        } else {
          this.setListTo('all');
        }
    });

    this.tagsService.getAll()
    .subscribe(tags => {
      this.tags = tags;
      this.tagsLoaded = true;
    });
  }

  setListTo(type: string = '', filters: Object = {}) {
    // If feed is requested but user is not authenticated, redirect to login
    if (type === 'feed' && !this.isAuthenticated) {
      this.router.navigateByUrl('/login');
      return;
    }

    // Otherwise, set the list object
    this.listConfig = {type: type, filters: filters};
  }
}
