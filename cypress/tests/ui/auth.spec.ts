import { faker } from "@faker-js/faker";

const username = faker.random.alphaNumeric(10);
const email = faker.internet.email(username);
const password = faker.random.alphaNumeric(10);

describe("User Sign-up and Login", function () {
  beforeEach(function () {
    cy.clearCookies();
  });

  it("should allow a visitor to signup, login and logout", function () {
    // Signup
    cy.signup(username, email, password);

    cy.location("pathname").should("equal", "/");

    // Logout
    cy.getBySel("nav-settings").click();
    cy.getBySel("settings-logout").click();

    // Login
    cy.login(email, password);

    // Check userInfo if correct
    cy.getBySel("username").should("contain", username);
    cy.getBySel("nav-newArticle").should("be.visible");
    cy.getBySel("nav-settings").should("be.visible");
    cy.getBySel("nav-signin").should("not.exist");
    cy.getBySel("nav-signup").should("not.exist");

    // Logout
    cy.getBySel("nav-settings").click();
    cy.getBySel("settings-logout").click();

    // Check if login and logout button exists and also check uri location
    cy.getBySel("nav-signin").should("exist");
    cy.getBySel("nav-signup").should("exist");
    cy.location("pathname").should("equal", "/");
  });

  it("should display login errors", function () {
    // Get login page
    cy.getBySel("nav-signin").click();

    // Check if button is disabled
    cy.getBySel("form-button").should("be.disabled");

    // Enter dummy username / password
    cy.getBySel("form-email").type("dumy");
    cy.getBySel("form-password").type("passdummy");

    // Sign in button should be enabled
    cy.getBySel("form-button").should("be.enabled");

    cy.getBySel("form-button").click();

    // Check if error shows with non-existing username
    cy.getBySel("error-message").should("have.length", "1");

    // Check if error shows with existing username
    cy.getBySel("form-email").clear().type(email);

    cy.getBySel("form-password").clear().type("pass");

    cy.getBySel("form-button").click();

    cy.getBySel("error-message").should("have.length", "1");
  });

  it("should display signup errors", function () {
    cy.getBySel("nav-signup").click();

    // Check if button is disabled
    cy.getBySel("form-button").should("be.disabled");

    // Add existing data
    cy.getBySel("form-username").type("test");
    cy.getBySel("form-email").type("test@pokemail.net");
    cy.getBySel("form-password").type("password");

    cy.getBySel("form-button").click();

    cy.getBySel("error-message")
      .should("have.length", "2")
      .and("contain.text", "already been taken");
  });
});
