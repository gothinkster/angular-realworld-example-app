import { BasePage } from "./base.page.ts";
import { expect } from "@wdio/globals";
import { Key } from "webdriverio";

class NewArticlePage extends BasePage {
  titleField = () => {
    return browser.findByPlaceholderText("Article Title");
  };
  descriptionField = () => {
    return browser.findByPlaceholderText("What's this article about?");
  };
  contentField = () => {
    return browser.findByPlaceholderText("Write your article (in markdown)");
  };
  tagsField = () => {
    return browser.findByPlaceholderText("Enter tags");
  };

  submitButton = () => {
    return browser.findByRole("button", { name: "Publish Article" });
  };

  async navigateTo() {
    await browser.url("/editor");
    await this.waitTillLoaded();
  }
  async waitTillLoaded() {
    expect(this.titleField()).toBeDisplayed();
    expect(this.descriptionField()).toBeDisplayed();
    expect(this.contentField()).toBeDisplayed();
    expect(this.tagsField()).toBeDisplayed();
  }

  async fillTitle(title: string) {
    const titleField = await this.titleField();
    await titleField.setValue(title);
  }

  async fillDescription(description: string) {
    const descriptionField = await this.descriptionField();
    await descriptionField.setValue(description);
  }

  async fillContent(content: string) {
    const contentField = await this.contentField();
    await contentField.setValue(content);
  }

  async fillTags(tags: string[]) {
    for (const tag of tags) {
      const tagsField = await this.tagsField();
      await tagsField.setValue(tag);
      await browser.keys([Key.Enter]);
    }
  }

  async clickSubmit() {
    const submitButton = await this.submitButton();
    await submitButton.click();
  }
}

export default new NewArticlePage();
