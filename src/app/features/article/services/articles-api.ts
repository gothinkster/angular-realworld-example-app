import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { IArticleListConfig } from "../models/article-list-config.model";
import { IArticle } from "../models/article.model";

@Injectable({ providedIn: "root" })
export class ArticlesApi {
  constructor(private readonly http: HttpClient) {}

  query(
    config: IArticleListConfig,
  ): Observable<{ articles: IArticle[]; articlesCount: number }> {
    // Convert any filters over to Angular's URLSearchParams
    let params = new HttpParams();

    Object.keys(config.filters).forEach((key) => {
      // @ts-ignore
      params = params.set(key, config.filters[key]);
    });

    return this.http.get<{ articles: IArticle[]; articlesCount: number }>(
      "/articles" + (config.type === "feed" ? "/feed" : ""),
      { params },
    );
  }

  get(slug: string): Observable<IArticle> {
    return this.http
      .get<{ article: IArticle }>(`/articles/${slug}`)
      .pipe(map((data) => data.article));
  }

  delete(slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}`);
  }

  create(article: Partial<IArticle>): Observable<IArticle> {
    return this.http
      .post<{ article: IArticle }>("/articles/", { article: article })
      .pipe(map((data) => data.article));
  }

  update(article: Partial<IArticle>): Observable<IArticle> {
    return this.http
      .put<{ article: IArticle }>(`/articles/${article.slug}`, {
        article: article,
      })
      .pipe(map((data) => data.article));
  }

  favorite(slug: string): Observable<IArticle> {
    return this.http
      .post<{ article: IArticle }>(`/articles/${slug}/favorite`, {})
      .pipe(map((data) => data.article));
  }

  unfavorite(slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}/favorite`);
  }
}
