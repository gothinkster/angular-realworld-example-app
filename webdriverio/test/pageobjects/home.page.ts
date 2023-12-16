import { browser, expect } from "@wdio/globals";
import FeedPage from "./components/feed.component.ts";
import NavigationComponent from "./components/navigation.component.ts";
import { BasePage } from "./base.page.ts";

class HomePage extends BasePage {
  async navigateTo(): Promise<void> {
    await browser.url("/");
  }
  waitTillLoaded(): void {
    expect(FeedPage.yourFeedTab).toBeDisplayed();
    expect(FeedPage.globalFeedTab).toBeDisplayed();
  }

  public get navigation() {
    return NavigationComponent;
  }
}

export default new HomePage();
