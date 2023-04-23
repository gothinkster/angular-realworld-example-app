import { faker } from "@faker-js/faker";
import { HomePage } from "../page-objects/homePage";
import { SettingsPage } from "../page-objects/settingsPage";
import { ProfilePage } from "../page-objects/profilePage";
import { User } from "../workflow/user";

const homePage = new HomePage();
const settingsPage = new SettingsPage();
const profilePage = new ProfilePage();
const user = new User();

const username = faker.random.alphaNumeric(10);
const email = faker.internet.email(username);
const password = faker.random.alphaNumeric(10);

const newUsername = faker.random.alphaNumeric(10);
const newEmail = faker.internet.email(username);
const newPassword = faker.random.alphaNumeric(10);

const imageUrl =
  "https://static5.depositphotos.com/1007168/472/i/950/depositphotos_4725473-stock-photo-hot-summer-sun-wearing-shades.jpg";

describe("User Settings", () => {
  before(() => {
    user.signUp(username, email, password);
  });

  it("should get the user settings form", () => {
    user.signIn(email, password);
    homePage.navSettingsButton.click();
    cy.location("pathname").should("include", "/settings");
  });

  it("should update user settings", () => {
    cy.intercept("PUT", "*").as("update");

    user.signIn(email, password);
    homePage.navSettingsButton.click();

    settingsPage.imageUrl.clear().type(imageUrl);

    settingsPage.username.clear().type(newUsername);
    settingsPage.bio.clear().type("Short bio");
    settingsPage.email.clear().type(newEmail);
    settingsPage.newPassword.clear().type(newPassword);

    settingsPage.updateButton.click();

    cy.wait("@update");

    profilePage.username.should("have.text", newUsername);

    profilePage.bio.should("have.text", "Short bio");

    homePage.navSettingsButton.first().click();

    settingsPage.logout.click();

    // Login with New Details
    user.signIn(newEmail, newPassword);

    cy.location("pathname").should("contain", "");

    homePage.navUsername.should("contain.text", newUsername);
  });
});
