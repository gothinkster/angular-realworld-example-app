import { BasePage } from "./base.page.ts";
import FeedPage from "./components/feed.component.ts";
import { expect } from "@wdio/globals";

class ProfilePage extends BasePage {
  editProfileSettingsButton = () => {
    return browser.findByText("Edit Profile Settings");
  };

  async navigateTo(username: string) {
    await browser.url(`profile/${username}`);
    await this.waitTillLoaded();
  }
  async waitTillLoaded() {
    await expect(this.editProfileSettingsButton).toBeDisplayed();
    await expect(FeedPage.yourFeedTab).toBeDisplayed();
    await expect(FeedPage.globalFeedTab).toBeDisplayed();
  }

  async goToProfileSettings() {
    const editProfileSettingsButton = await this.editProfileSettingsButton();
    await editProfileSettingsButton.click();
  }
}

export default new ProfilePage();
