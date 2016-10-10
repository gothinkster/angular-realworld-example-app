import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Article, ArticlesService } from '../shared';

@Component({
  selector: 'editor-page',
  templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit {
  constructor(
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  article: Article = new Article();
  errors: Object = {};
  tagField: string;
  isSubmitting: boolean = false;

  ngOnInit() {
    // If there's an article prefetched, load it
    this.route.data.subscribe(
      (data: {article: Article}) => {
        if (data.article) {
          this.article = data.article;
        }
      }
    );
  }

  addTag(event) {
    if (event.keyCode === 13) {
      this.article.tagList.push(this.tagField);
      this.tagField = '';
    }
  }

  removeTag(tagName) {
    this.article.tagList = this.article.tagList.filter((slug) => slug != tagName);
  }

  submitForm() {
    this.isSubmitting = true;

    this.articlesService
    .save(this.article)
    .subscribe(
      article => this.router.navigateByUrl('/article/' + article.slug),
      err => {
        this.errors = err;
        this.isSubmitting = false;
      }
    );
  }
}
