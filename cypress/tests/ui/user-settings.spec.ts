import { faker } from "@faker-js/faker";

const username = faker.random.alphaNumeric(10);
const email = faker.internet.email(username);
const password = faker.random.alphaNumeric(10);

describe("User Settings", function () {
  before(function () {
    cy.visit("http://localhost:4200/");

    cy.signup(username, email, password);
  });

  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("should get the user settings form", function () {
    cy.login(email, password);
    cy.getBySel("nav-settings").click();
    cy.location("pathname").should("include", "/settings");
  });

  it("should update user settings form", function () {
    const newUsername = faker.random.alphaNumeric(10);
    const newEmail = faker.internet.email(username);
    const newPassword = faker.random.alphaNumeric(10);

    cy.intercept("PUT", "*").as("update");

    cy.login(email, password);
    cy.getBySel("nav-settings").click();
    cy.getBySel("settings-imageUrl")
      .clear()
      .type(
        "https://static5.depositphotos.com/1007168/472/i/950/depositphotos_4725473-stock-photo-hot-summer-sun-wearing-shades.jpg"
      );

    cy.getBySel("settings-username").clear().type(newUsername);
    cy.getBySel("settings-bio").clear().type("Short bio");
    cy.getBySel("settings-email").clear().type(newEmail);
    cy.getBySel("settings-newPassword").clear().type(newPassword);

    cy.getBySel("settings-updateButton").click();

    cy.wait("@update");

    cy.location("pathname").should("include", "/profile");

    cy.getBySel("profile-username").should("have.text", newUsername);

    cy.getBySel("profile-bio").should("have.text", "Short bio");

    cy.getBySel("nav-settings").click();

    cy.getBySel("settings-logout").click();

    // Login with New Details
    cy.login(newEmail, newPassword);

    cy.location("pathname").should("contain", "");

    cy.getBySel("username").should("contain.text", newUsername);
  });
});
