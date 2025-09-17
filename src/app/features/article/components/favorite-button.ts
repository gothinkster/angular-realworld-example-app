import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { EMPTY, switchMap } from "rxjs";
import { NgClass } from "@angular/common";
import { ArticlesApi } from "../services/articles-api";
import { UserService } from "../../../core/auth/services/user.service";
import { IArticle } from "../models/article.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-favorite-button",
  template: `
    <button
      class="btn btn-sm"
      [ngClass]="{
        disabled: isSubmitting,
        'btn-outline-primary': !article.favorited,
        'btn-primary': article.favorited
      }"
      (click)="toggleFavorite()"
    >
      <i class="ion-heart"></i> <ng-content></ng-content>
    </button>
  `,
  imports: [NgClass],
})
export class FavoriteButton {
  destroyRef = inject(DestroyRef);
  isSubmitting = false;

  @Input() article!: IArticle;
  @Output() toggle = new EventEmitter<boolean>();

  constructor(
    private readonly articleService: ArticlesApi,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  toggleFavorite(): void {
    this.isSubmitting = true;

    this.userService.isAuthenticated
      .pipe(
        switchMap((authenticated) => {
          if (!authenticated) {
            void this.router.navigate(["/register"]);
            return EMPTY;
          }

          if (!this.article.favorited) {
            return this.articleService.favorite(this.article.slug);
          } else {
            return this.articleService.unfavorite(this.article.slug);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.toggle.emit(!this.article.favorited);
        },
        error: () => (this.isSubmitting = false),
      });
  }
}
