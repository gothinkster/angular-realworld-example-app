import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { Article, ArticlesService, UserService } from '../shared';

@Injectable()
export class EditableArticleResolver implements Resolve<Article> {
  constructor(
    private articlesService: ArticlesService,
    private router: Router,
    private userService: UserService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {

    return this.articlesService.get(route.params['slug'])
           .map(
             article => {
               if (this.userService.getCurrentUser().username === article.author.username) {
                 return article;
               } else {
                 this.router.navigateByUrl('/');
               }

             }
           )
           .catch((err) => this.router.navigateByUrl('/'));

  }
}
