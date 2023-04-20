import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ArticleListComponent} from '../../shared/article-helpers/article-list.component';
import {switchMap, takeUntil} from 'rxjs/operators';
import {ProfileService} from '../../core/services/profile.service';
import {Profile} from '../../core/models/profile.model';
import {ArticleListConfig} from '../../core/models/article-list-config.model';
import {Subject} from 'rxjs';


@Component({
  selector: 'app-profile-articles',
  templateUrl: './profile-articles.component.html',
  imports: [
    ArticleListComponent
  ],
  standalone: true
})
export class ProfileArticlesComponent implements OnInit, OnDestroy {
  profile!: Profile;
  articlesConfig!: ArticleListConfig;
  destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private readonly profileService: ProfileService
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({username}) => this.profileService.get(username)),
      takeUntil(this.destroy$)
    ).subscribe({
        next: (profile: Profile) => {
          this.profile = profile;
          this.articlesConfig = {
            type: 'all',
            filters: {
              author: this.profile.username
            }
          };
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
