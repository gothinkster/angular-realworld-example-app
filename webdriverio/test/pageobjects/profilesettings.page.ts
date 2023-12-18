import { BasePage } from "./base.page.ts";
import { expect } from "@wdio/globals";
import HomePage from "./home.page.ts";

class ProfilesettingsPage extends BasePage {
  heading = () => {
    return $("h1");
  };
  logoutButton = () => {
    return browser.findByText("Or click here to logout.");
  };

  async navigateTo() {
    await browser.url("/settings");
    await this.waitTillLoaded();
  }
  async waitTillLoaded() {
    //Could be improved to rely on a translation file
    expect(this.heading).toContain("Your Settings");
    expect(this.logoutButton()).toBeDisplayed();
  }

  async clickLogout() {
    const logoutButton = await this.logoutButton();
    await logoutButton.click();
    await HomePage.waitTillLoaded();
  }
}

export default new ProfilesettingsPage();
