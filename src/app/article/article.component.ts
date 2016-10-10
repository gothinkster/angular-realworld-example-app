import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Article,
  ArticlesService,
  Comment,
  CommentsService,
  User,
  UserService
} from '../shared';

@Component({
  selector: 'article-page',
  templateUrl: './article.component.html'
})
export class ArticleComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private articlesService: ArticlesService,
    private commentsService: CommentsService,
    private router: Router,
    private userService: UserService
  ) {}

  article: Article;
  currentUser: User;
  canModify: boolean;
  comments: Comment[];
  commentBody = '';
  commentFormErrors = {};
  isSubmitting = false;
  isDeleting = false;

  ngOnInit() {
    // Retreive the prefetched article
    this.route.data.subscribe(
      (data: {article: Article}) => {
        this.article = data.article;

        // Load the comments on this article
        this.populateComments();
      }
    );

    // Load the current user's data
    this.userService.currentUser.subscribe(
      (userData: User) => {
        this.currentUser = userData;

        this.canModify = (this.currentUser.username === this.article.author.username);
      }
    );
  }

  onToggleFavorite(favorited: boolean) {
    this.article.favorited = favorited;

    if (favorited) {
      this.article.favoritesCount++;
    } else {
      this.article.favoritesCount--;
    }
  }

  onToggleFollowing(following: boolean) {
    this.article.author.following = following;
  }

  deleteArticle() {
    this.isDeleting = true;

    this.articlesService.destroy(this.article.slug)
    .subscribe(
      success => {
        this.router.navigateByUrl('/');
      }
    );
  }

  populateComments() {
    this.commentsService.getAll(this.article.slug)
    .subscribe(comments => this.comments = comments);
  }

  addComment() {
    this.isSubmitting = true;
    this.commentFormErrors = {};

     this.commentsService
     .add(this.article.slug, this.commentBody)
     .subscribe(
       comment => {
         this.comments.unshift(comment);
         this.commentBody = '';
         this.isSubmitting = false;
       },
       errors => {
         this.isSubmitting = false;
         this.commentFormErrors = errors;
       }
     )
  }

  onDeleteComment(comment) {
    this.commentsService.destroy(comment.id, this.article.slug)
    .subscribe(
      success => {
        this.comments = this.comments.filter((item) => item != comment);
      }
    );
  }

}
