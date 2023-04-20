import {Component, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormGroup, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ListErrorsComponent} from '../../shared/list-errors.component';
import {NgForOf} from '@angular/common';
import {Article} from '../../core/models/article.model';
import {ArticlesService} from '../../core/services/articles.service';
import {combineLatest, filter, Subject, switchMap} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {UserService} from '../../core/services/user.service';
import {Errors} from '../../core/models/errors.model';

interface ArticleForm {
  title: FormControl<string>;
  description: FormControl<string>;
  body: FormControl<string>;
}

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor.component.html',
  imports: [
    ListErrorsComponent,
    ReactiveFormsModule,
    NgForOf
  ],
  standalone: true
})
export class EditorComponent implements OnInit, OnDestroy {
  tagList: string[] = [];
  articleForm: UntypedFormGroup = new FormGroup<ArticleForm>({
    title: new FormControl('', {nonNullable: true}),
    description: new FormControl('', {nonNullable: true}),
    body: new FormControl('', {nonNullable: true}),
  });
  tagField = new FormControl<string>('', {nonNullable: true});

  errors: Errors | null = null;
  isSubmitting = false;
  destroy$ = new Subject<void>();

  constructor(
    private readonly articleService: ArticlesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      filter(({slug}) => !!slug),
      switchMap(({slug}) => combineLatest([
        this.articleService.get(slug),
        this.userService.getCurrentUser()
      ])),
      map(([article, {user}]) => {
        if (user.username === article.author.username) {
          return article;
        } else {
          void this.router.navigateByUrl('/');
          return null;
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe((article: Article | null) => {
      if (article) {
        this.tagList = article.tagList;
        this.articleForm.patchValue(article);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addTag() {
    // retrieve tag control
    const tag = this.tagField.value;
    // only add tag if it does not exist yet
    if (tag != null && tag.trim() != '' && this.tagList.indexOf(tag) < 0) {
      this.tagList.push(tag);
    }
    // clear the input
    this.tagField.reset('');
  }

  removeTag(tagName: string): void {
    this.tagList = this.tagList.filter(tag => tag !== tagName);
  }

  submitForm(): void {
    this.isSubmitting = true;

    // update any single tag
    this.addTag();

    // post the changes
    this.articleService.create({
      ...this.articleForm.value,
      tagList: this.tagList
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
          next: article => this.router.navigateByUrl('/article/' + article.slug),
          error: err => {
            this.errors = err;
            this.isSubmitting = false;
          }
        }
      );
  }
}
