import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Article } from '../../core';

@Component({
  selector: 'app-article-meta',
  templateUrl: './article-meta.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleMetaComponent {
  @Input() article: Article;
}
