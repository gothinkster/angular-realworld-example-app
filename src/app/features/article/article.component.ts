import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { User } from "../../core/models/user.model";
import { Article } from "../../core/models/article.model";
import { ArticlesService } from "../../core/services/articles.service";
import { CommentsService } from "../../core/services/comments.service";
import { UserService } from "../../core/services/user.service";
import { ArticleMetaComponent } from "../../shared/article-helpers/article-meta.component";
import { AsyncPipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { FollowButtonComponent } from "../../shared/buttons/follow-button.component";
import { FavoriteButtonComponent } from "../../shared/buttons/favorite-button.component";
import { MarkdownPipe } from "./markdown.pipe";
import { ListErrorsComponent } from "../../shared/list-errors.component";
import { ArticleCommentComponent } from "./article-comment.component";
import { catchError, takeUntil } from "rxjs/operators";
import { Subject, combineLatest, throwError } from "rxjs";
import { Comment } from "../../core/models/comment.model";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";
import { Errors } from "../../core/models/errors.model";
import { Profile } from "../../core/models/profile.model";

@Component({
  selector: "app-article-page",
  templateUrl: "./article.component.html",
  imports: [
    ArticleMetaComponent,
    RouterLink,
    NgClass,
    FollowButtonComponent,
    FavoriteButtonComponent,
    NgForOf,
    MarkdownPipe,
    AsyncPipe,
    ListErrorsComponent,
    FormsModule,
    ArticleCommentComponent,
    ReactiveFormsModule,
    ShowAuthedDirective,
    NgIf,
  ],
  standalone: true,
})
export class ArticleComponent implements OnInit, OnDestroy {
  article!: Article;
  currentUser!: User | null;
  comments: Comment[] = [];
  canModify: boolean = false;

  commentControl = new FormControl<string>("", { nonNullable: true });
  commentFormErrors: Errors | null = null;

  isSubmitting = false;
  isDeleting = false;
  destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly articleService: ArticlesService,
    private readonly commentsService: CommentsService,
    private readonly router: Router,
    private readonly userService: UserService
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
          return throwError(err);
        })
      )
      .subscribe(([article, comments, currentUser]) => {
        this.article = article;
        this.comments = comments;
        this.currentUser = currentUser;
        this.canModify = currentUser?.username === article.author.username;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleFavorite(favorited: boolean): void {
    this.article.favorited = favorited;

    if (favorited) {
      this.article.favoritesCount++;
    } else {
      this.article.favoritesCount--;
    }
  }

  toggleFollowing(profile: Profile): void {
    this.article.author.following = profile.following;
  }

  deleteArticle(): void {
    this.isDeleting = true;

    this.articleService
      .delete(this.article.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        void this.router.navigate(["/"]);
      });
  }

  addComment() {
    this.isSubmitting = true;
    this.commentFormErrors = null;

    this.commentsService
      .add(this.article.slug, this.commentControl.value)
      .pipe(takeUntil(this.destroy$))
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

  deleteComment(comment: Comment): void {
    this.commentsService
      .delete(comment.id, this.article.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.comments = this.comments.filter((item) => item !== comment);
      });
  }

  trackById(index: number, item: Comment): string {
    return item.id;
  }
}
