import { faker } from "@faker-js/faker";
import { SettingsPage } from "../page-objects/settingsPage";
import { HomePage } from "../page-objects/homePage";
import { FormPage } from "../page-objects/formPage";
import { NavigateTo } from "../workflow/navigateTo";
import { User } from "../workflow/user";

const username = faker.random.alphaNumeric(10);
const email = faker.internet.email(username);
const password = faker.random.alphaNumeric(10);

const settingsPage = new SettingsPage();
const homePage = new HomePage();
const formPage = new FormPage();
const navigateTo = new NavigateTo();

const user = new User();

describe("Authentication", () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it("should signup, login and logout", function () {
    // Signup
    user.signUp(username, email, password);

    // Logout
    homePage.navSettingsButton.click();
    settingsPage.logout.click();

    // Login
    user.signIn(email, password);

    // Check userInfo if correct
    homePage.navUsername.should("contain", username);
    homePage.navNewArticleButton.should("be.visible");
    homePage.navSettingsButton.should("be.visible");
    homePage.navSignInButton.should("not.exist");
    homePage.navSignUpButton.should("not.exist");

    // Logout
    homePage.navSettingsButton.click();
    settingsPage.logout.click();

    // Check if login and logout button exists and also check uri location
    homePage.navSignInButton.should("exist");
    homePage.navSignUpButton.should("exist");
  });

  it("should display login errors", () => {
    navigateTo.homePage();

    // Get login page
    homePage.navSignInButton.click();

    // Check if button is disabled
    formPage.formSubmitButton.should("be.disabled");

    // Enter dummy username / password
    formPage.emailInput.type("dumy@test.com");
    formPage.passwordInput.type("passdummy");

    // Sign in button should be enabled
    formPage.formSubmitButton.should("be.enabled");
    formPage.formSubmitButton.click();

    // Check if error shows with non-existing username
    homePage.errorMessage.should("have.length", "1");
  });

  it("should display signup errors", () => {
    navigateTo.homePage();

    homePage.navSignUpButton.click();

    // Check if button is disabled
    formPage.formSubmitButton.should("be.disabled");

    // Add existing data
    formPage.usernameInput.type(username);
    formPage.emailInput.type(email);
    formPage.passwordInput.type(password);

    formPage.formSubmitButton.click();

    homePage.errorMessage
      .find("li")
      .should("have.length", "2")
      .and("contain.text", "already been taken");
  });
});
