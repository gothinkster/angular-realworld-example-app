// cypress/support/global.d.ts

// @ts-ignore
Cypress.Commands.add("getBySel", (value) => {
  return cy.get(`[data-test="${value}"]`);
});

Cypress.Commands.add("signup", (username, email, password) => {
  cy.visit("http://localhost:4200/");

  cy.getBySel("nav-signup").click();
  cy.getBySel("form-username").type(username);
  cy.getBySel("form-email").type(email);
  cy.getBySel("form-password").type(password);
  cy.intercept("POST", "*").as("signup");

  cy.getBySel("form-button").click();

  cy.wait("@signup");
});

Cypress.Commands.add("login", (username, password) => {
  cy.visit("http://localhost:4200/");

  cy.getBySel("nav-signin").click();
  cy.getBySel("form-email").type(username);
  cy.getBySel("form-password").type(password);
  cy.getBySel("form-button").click();
});

Cypress.Commands.add(
  "createArticle",
  (title?, about?, body?, tags?, clear?) => {
    if (clear) {
      cy.getBySel("article-title").clear().type(title);
      cy.getBySel("article-about").clear().type(about);
      cy.getBySel("article-body").clear().type(body);
      cy.getBySel("article-tags").clear().type(tags);
      cy.getBySel("article-formSubmit").click();
    } else {
      cy.getBySel("article-title").type(title);
      cy.getBySel("article-about").type(about);
      cy.getBySel("article-body").type(body);
      cy.getBySel("article-tags").type(tags);
      cy.getBySel("article-formSubmit").click();
    }
  }
);
