import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { User } from "../../../../core/auth/user.model";
import { IArticle } from "../../models/article.model";
import { ArticlesApi } from "../../services/articles-api";
import { CommentsApi } from "../../services/comments-api";
import { UserService } from "../../../../core/auth/services/user.service";
import { ArticleMeta } from "../../components/article-meta";
import { AsyncPipe, NgClass } from "@angular/common";
import { MarkdownPipe } from "../../../../shared/pipes/markdown-pipe";
import { ErrorList } from "../../../../shared/components/error-list";
import { ArticleComment } from "../../components/article-comment";
import { catchError } from "rxjs/operators";
import { combineLatest, throwError } from "rxjs";
import { IComment } from "../../models/comment.model";
import { IfAuthenticated } from "../../../../core/auth/if-authenticated";
import { Errors } from "../../../../core/models/errors.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FavoriteButton } from "../../components/favorite-button";
import { FollowButton } from "../../../user-profile/components/follow-button";
import { IUserProfile } from "../../../user-profile/models/user-profile.model";

@Component({
  selector: "app-article-page",
  templateUrl: "./article.html",
  imports: [
    ArticleMeta,
    RouterLink,
    NgClass,
    FollowButton,
    FavoriteButton,
    MarkdownPipe,
    AsyncPipe,
    ErrorList,
    FormsModule,
    ArticleComment,
    ReactiveFormsModule,
    IfAuthenticated,
  ],
})
export default class Article implements OnInit {
  article!: IArticle;
  currentUser!: User | null;
  comments: IComment[] = [];
  canModify: boolean = false;

  commentControl = new FormControl<string>("", { nonNullable: true });
  commentFormErrors: Errors | null = null;

  isSubmitting = false;
  isDeleting = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly articleService: ArticlesApi,
    private readonly commentsService: CommentsApi,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.params["slug"];
    combineLatest([
      this.articleService.get(slug),
      this.commentsService.getAll(slug),
      this.userService.currentUser,
    ])
      .pipe(
        catchError((err) => {
          void this.router.navigate(["/"]);
          return throwError(() => err);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([article, comments, currentUser]) => {
        this.article = article;
        this.comments = comments;
        this.currentUser = currentUser;
        this.canModify = currentUser?.username === article.author.username;
      });
  }

  onToggleFavorite(favorited: boolean): void {
    this.article.favorited = favorited;

    if (favorited) {
      this.article.favoritesCount++;
    } else {
      this.article.favoritesCount--;
    }
  }

  toggleFollowing(profile: IUserProfile): void {
    this.article.author.following = profile.following;
  }

  deleteArticle(): void {
    this.isDeleting = true;

    this.articleService
      .delete(this.article.slug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.router.navigate(["/"]);
      });
  }

  addComment() {
    this.isSubmitting = true;
    this.commentFormErrors = null;

    this.commentsService
      .add(this.article.slug, this.commentControl.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (comment) => {
          this.comments.unshift(comment);
          this.commentControl.reset("");
          this.isSubmitting = false;
        },
        error: (errors) => {
          this.isSubmitting = false;
          this.commentFormErrors = errors;
        },
      });
  }

  deleteComment(comment: IComment): void {
    this.commentsService
      .delete(comment.id, this.article.slug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.comments = this.comments.filter((item) => item !== comment);
      });
  }
}
