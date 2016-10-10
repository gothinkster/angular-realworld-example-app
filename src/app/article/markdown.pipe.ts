import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked';

@Pipe({name: 'markdown'})
export class MarkdownPipe implements PipeTransform {
  transform(content: string): string {
    return marked(content, { sanitize: true });
  }
}
