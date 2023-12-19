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
import { ArticlesService } from "../../core/services/articles.service";
import { UserService } from "../../core/services/user.service";
import { Article } from "../../core/models/article.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-favorite-button",
  templateUrl: "./favorite-button.component.html",
  imports: [NgClass],
  standalone: true,
})
export class FavoriteButtonComponent {
  destroyRef = inject(DestroyRef);
  isSubmitting = false;

  @Input() article!: Article;
  @Output() toggle = new EventEmitter<boolean>();

  constructor(
    private readonly articleService: ArticlesService,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  toggleFavorite(): void {
    this.isSubmitting = true;

    this.userService.isAuthenticated
      .pipe(
        switchMap((authenticated) => {
          if (!authenticated) {
            void this.router.navigate(["/login"]);
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
