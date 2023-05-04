import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "markdown",
  standalone: true,
})
export class MarkdownPipe implements PipeTransform {
  async transform(content: string): Promise<string> {
    const { marked } = await import("marked");
    return marked(content, { sanitize: true });
  }
}
