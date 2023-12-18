import { BasePage } from "./base.page.ts";
import { $, expect } from "@wdio/globals";
import CommentComponent from "./components/comment.component.ts";
import commentComponent from "./components/comment.component.ts";

class ViewArticlePage extends BasePage {
  articleTitle = () => {
    return $("h1");
  };

  commentComponent = CommentComponent;

  async navigateTo(articleId: string) {
    await browser.url(`/article/${articleId}`);
    await this.waitTillLoaded();
  }
  async waitTillLoaded() {
    expect(this.articleTitle()).toBeDisplayed();
    await commentComponent.waitTillLoaded();
  }

  async assertPageTitle(title: string) {
    expect(this.articleTitle()).toHaveText(title);
  }
}

export default new ViewArticlePage();
