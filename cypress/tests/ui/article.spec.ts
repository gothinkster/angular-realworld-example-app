import { faker } from "@faker-js/faker";

const username = faker.random.alphaNumeric(10);
const email = faker.internet.email(username);
const password = faker.random.alphaNumeric(10);

describe("Article", function () {
  beforeEach(() => {
    cy.clearCookies();
  });

  before(function () {
    cy.visit("http://localhost:4200/");

    // Create new user
    cy.signup(username, email, password);
  });

  it("should create an article, verify it exists and then delete it.", function () {
    cy.getBySel("nav-newArticle").click();
    cy.location("pathname").should("equal", "/editor");

    cy.createArticle(
      "Testing",
      "All about testing",
      "Cypress is awesome",
      "e2e cypress typescript"
    );

    cy.get("h1").should("have.text", "Testing");

    // Delete using top button
    cy.getBySel("article-deleteButtonTop").click();
  });

  it("should create an article, verify it exists and then delete it using second button.", function () {
    cy.login(email, password);

    cy.getBySel("nav-newArticle").click();
    cy.location("pathname").should("equal", "/editor");

    cy.createArticle(
      "Testing",
      "All about testing",
      "Cypress is awesome",
      "e2e cypress typescript"
    );

    cy.get("h1").should("have.text", "Testing");

    // // Delete using down button
    cy.getBySel("article-deleteButtonDown").click();
  });

  it("should create an article, edit it's content and verify.", function () {
    cy.login(email, password);

    cy.getBySel("nav-newArticle").click();
    cy.location("pathname").should("equal", "/editor");

    cy.createArticle(
      "Testing",
      "All about testing",
      "Cypress is awesome",
      "e2e cypress typescript"
    );

    cy.getBySel("article-editButtonTop").click();

    cy.createArticle(
      "Edited title",
      "Edited about",
      "Edited body",
      "e2e cypress typescript edited",
      true
    );

    cy.get("h1").should("have.text", "Edited title");
    cy.get("p").should("have.text", "Edited body");

    // Delete
    cy.getBySel("article-deleteButtonTop").click();
  });

  it("should create an article, edit it's content using second button and verify.", function () {
    cy.login(email, password);

    cy.getBySel("nav-newArticle").click();
    cy.location("pathname").should("equal", "/editor");

    cy.createArticle(
      "Testing",
      "All about testing",
      "Cypress is awesome",
      "e2e cypress typescript"
    );

    cy.getBySel("article-editButtonDown").click();

    // Edit
    cy.createArticle(
      "Edited title",
      "Edited about",
      "Edited body",
      "e2e cypress typescript edited",
      true
    );

    cy.get("h1").should("have.text", "Edited title");
    cy.get("p").should("have.text", "Edited body");

    // Delete
    cy.getBySel("article-deleteButtonTop").click();

    cy.location("pathname").should("equal", "/");
  });

  it("should show errors while creating a form with invalid inputs", function () {
    cy.login(email, password);

    cy.getBySel("nav-newArticle").click();

    cy.createArticle(
      "Testing",
      "All about testing",
      "Cypress is awesome",
      "e2e cypress typescript"
    );

    cy.intercept("POST", "/api/articles").as("postArticles");

    cy.wait("@postArticles");

    cy.getBySel("nav-home").click();
    cy.getBySel("nav-newArticle").click();

    cy.getBySel("article-title").type("Testing");
    cy.getBySel("article-about").type("Hello there");
    cy.getBySel("article-body").type("Testing 1");
    cy.getBySel("article-tags").type("Testing 2");

    cy.getBySel("article-formSubmit").click();

    cy.getBySel("error-message").should("contain.text", "title must be unique");
    cy.getBySel("article-title").clear();

    cy.getBySel("article-formSubmit").click();
    cy.getBySel("error-message").should("contain.text", "title can't be blank");
    cy.getBySel("article-title").type("TestingRandom");

    cy.getBySel("article-about").clear();
    cy.getBySel("article-formSubmit").click();

    cy.getBySel("error-message").should(
      "contain.text",
      "description can't be blank"
    );

    cy.getBySel("article-about").type("TestingRandomfwefewefw");

    cy.getBySel("article-body").clear();
    cy.getBySel("article-formSubmit").click();

    cy.getBySel("error-message").should("contain.text", "body can't be blank");

    cy.getBySel("nav-home").click();
  });
});
