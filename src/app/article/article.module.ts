import { NgModule } from '@angular/core';

import { ArticleComponent } from './article.component';
import { ArticleCommentComponent } from './article-comment.component';
import { MarkdownPipe } from './markdown.pipe';
import { SharedModule } from '../shared';
import { ArticleRoutingModule } from './article-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ArticleRoutingModule
  ],
  declarations: [
    ArticleComponent,
    ArticleCommentComponent,
    MarkdownPipe
  ],

  providers: [
  ]
})
export class ArticleModule {}
