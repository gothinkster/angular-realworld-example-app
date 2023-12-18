import { BasePage } from "./base.page.ts";
import { expect } from "@wdio/globals";

class SignInPage extends BasePage {
  get emailField() {
    return browser.findByPlaceholderText("Email");
  }
  get passwordField() {
    return browser.findByPlaceholderText("Password");
  }
  get signInButton() {
    return browser.findByRole("button", { name: "Sign in" }, { timeout: 2000 });
  }
  async navigateTo() {
    await browser.url("/login");
    this.waitTillLoaded();
  }
  async waitTillLoaded() {
    await expect(this.emailField).toBeDisplayed();
    await expect(this.passwordField).toBeDisplayed();
    await expect(this.signInButton).toBeDisplayed();
  }

  async attemptLogin(email: string, password: string) {
    const emailField = await this.emailField;
    await emailField.setValue(email);
    const passwordField = await this.passwordField;
    await passwordField.setValue(password);
    const signinButton = await this.signInButton;
    await signinButton.click();
  }
}

export default new SignInPage();
