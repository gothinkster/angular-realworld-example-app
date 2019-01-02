import {Component, Input, ViewChild, OnInit, OnDestroy} from '@angular/core';

import { Article, ArticleListConfig, ArticlesService } from '../../core';
import {MatPaginator} from "@angular/material";
import {Subscription} from "rxjs";
@Component({
  selector: 'app-article-list',
  styleUrls: ['article-list.component.scss'],
  templateUrl: './article-list.component.html'
})
export class ArticleListComponent implements OnInit, OnDestroy{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  subscriptions = new Subscription;
  total: number = 0;
  constructor (
    private articlesService: ArticlesService
  ) {}
  ngOnInit(){
    this.subscriptions.add(this.paginator.page.subscribe((page) => {
      this.query.filters.limit = page.pageSize;
      this.query.filters.offset = page.pageIndex*this.query.filters.limit;
      this.runQuery();
    }));
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  @Input() limit: number;
  @Input()
  set config(config: ArticleListConfig) {
    if (config) {
      this.query = config;
      this.query.filters.limit = 10;
      this.runQuery();
    }
  }

  query: ArticleListConfig;
  results: Article[];
  loading = false;


  runQuery() {
    this.loading = true;
    this.subscriptions.add(this.articlesService.query(this.query).subscribe(data => {
      this.loading = false;
      this.results = data.articles;
      this.total = data.articlesCount;
      // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
    }));
  }
}
