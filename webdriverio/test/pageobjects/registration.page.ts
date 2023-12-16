import { $, browser, expect } from "@wdio/globals";
import { BasePage } from "./base.page.ts";
import { setupBrowser } from "@testing-library/webdriverio";

class RegistrationPage extends BasePage {
  constructor() {
    super();
    setupBrowser(browser);
  }

  public get username() {
    return browser.getByPlaceholderText("Username");
  }
  public get email() {
    return browser.getByPlaceholderText("Email");
  }
  public get password() {
    return browser.getByPlaceholderText("Password");
  }

  public get emailError() {
    return browser.getByText("email has already been taken");
  }
  public get usernameError() {
    return browser.getByText("username has already been taken");
  }

  async navigateTo() {
    await browser.url("/register");
    await this.waitTillLoaded();
  }

  async waitTillLoaded() {
    expect(await this.username).toBeDisplayed();
    expect(await this.email).toBeDisplayed();
    expect(await this.password).toBeDisplayed();
  }

  async fillUsername(username: string) {
    const field = await this.username;
    await field.setValue(username);
  }

  async fillEmail(email: string) {
    const field = await this.email;
    await field.setValue(email);
  }

  async fillPassword(password: string) {
    const field = await this.password;
    await field.setValue(password);
  }

  async submit() {
    await $('button[type="submit"]').click();
  }

  async attemptRegister(username: string, email: string, password: string) {
    await Promise.all([
      this.fillUsername(username),
      this.fillEmail(email),
      this.fillPassword(password),
    ]);
    await this.submit();
  }

  async assertEmailError() {
    const emailError = await this.emailError;
    expect(emailError).toBeDisplayed();
  }
  async assertPasswordError() {
    const passwordError = await this.password;
    expect(passwordError).toBeDisplayed();
  }
}

export default new RegistrationPage();
