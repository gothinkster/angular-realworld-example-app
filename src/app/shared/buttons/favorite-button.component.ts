import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { EMPTY, Subject, switchMap } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NgClass } from "@angular/common";
import { ArticlesService } from "../../core/services/articles.service";
import { UserService } from "../../core/services/user.service";
import { Article } from "../../core/models/article.model";

@Component({
  selector: "app-favorite-button",
  templateUrl: "./favorite-button.component.html",
  imports: [NgClass],
  standalone: true,
})
export class FavoriteButtonComponent implements OnDestroy {
  destroy$ = new Subject<void>();
  isSubmitting = false;

  @Input() article!: Article;
  @Output() toggle = new EventEmitter<boolean>();

  constructor(
    private readonly articleService: ArticlesService,
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

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
        takeUntil(this.destroy$)
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
