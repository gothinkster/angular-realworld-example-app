import { FormPage } from "../page-objects/formPage";
import { HomePage } from "../page-objects/homePage";
import { NavigateTo } from "./navigateTo";

const navigateTo = new NavigateTo();
const formPage = new FormPage();
const homePage = new HomePage();

export class User {
  signUp(username: string, email: string, password: string) {
    navigateTo.homePage();

    homePage.navSignUpButton.click();
    formPage.usernameInput.type(username);
    formPage.emailInput.type(email);
    formPage.passwordInput.type(password);
    cy.intercept("POST", "*").as("signup");

    formPage.formSubmitButton.click();

    cy.wait("@signup");
  }

  signIn(username: string, password: string) {
    navigateTo.homePage();

    homePage.navSignInButton.click();

    formPage.emailInput.type(username);

    formPage.passwordInput.type(password);

    formPage.formSubmitButton.click();
  }

  createArticle(title: string, about: string, body: string, tag?: string) {
    homePage.articleTitleInput.clear().type(title);
    homePage.articleAboutInput.clear().type(about);
    homePage.articleBodyInput.clear().type(body);
    if (tag) {
      homePage.articleTagsInput.clear().type(tag);
    }

    homePage.articleFormSubmitButton.click();
  }
}
