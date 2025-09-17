import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { IComment } from "../models/comment.model";

@Injectable({ providedIn: "root" })
export class CommentsApi {
  constructor(private readonly http: HttpClient) {}

  getAll(slug: string): Observable<IComment[]> {
    return this.http
      .get<{ comments: IComment[] }>(`/articles/${slug}/comments`)
      .pipe(map((data) => data.comments));
  }

  add(slug: string, payload: string): Observable<IComment> {
    return this.http
      .post<{ comment: IComment }>(`/articles/${slug}/comments`, {
        comment: { body: payload },
      })
      .pipe(map((data) => data.comment));
  }

  delete(commentId: string, slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}/comments/${commentId}`);
  }
}
