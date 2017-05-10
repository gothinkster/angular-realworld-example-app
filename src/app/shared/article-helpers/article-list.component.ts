import { Component, Input } from '@angular/core';

import { Article, ArticleListConfig } from '../models';
import { ArticlesService } from '../services';

@Component({
  selector: 'article-list',
  templateUrl: './article-list.component.html'
})
export class ArticleListComponent {
  constructor (
    private articlesService: ArticlesService
  ) {}

  @Input() limit: number;
  @Input()
  set config(config: ArticleListConfig) {
    if (config) {
      this.query = config;
      this.currentPage = 1;
      this.runQuery();
    }
  }

  query: ArticleListConfig;
  results: Article[];
  loading: boolean = false;
  currentPage: number = 1;
  totalPages: Array<number> = [1];
  visiblePages: number = 10;
  pagesCount: number = 1;


  setPageTo(pageNumber) {
    this.currentPage = pageNumber;
    this.runQuery();
  }

  getNextPages(pageNumber) {
   this.setPageTo((pageNumber == this.pagesCount) ? this.pagesCount: ++pageNumber);
  }

  getPrevPages(pageNumber){
   this.setPageTo((pageNumber == 1) ? 1: --pageNumber);
  }

  runQuery() {
    this.loading = true;
    this.results = [];

    // Create limit and offset filter (if necessary)
    if (this.limit) {
      this.query.filters.limit = this.limit;
      this.query.filters.offset =  (this.limit * (this.currentPage - 1))
    }

    this.articlesService.query(this.query)
    .subscribe(data => {
      this.loading = false;
      this.results = data.articles;
      this.pagesCount = Math.ceil(data.articlesCount / this.limit);

      // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
      this.totalPages = Array.from(new Array(this.visiblePages),(val,index)=>index + this.currentPage).filter(e => e <= this.pagesCount);
    });
  }
}
