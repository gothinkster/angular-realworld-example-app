import { faker } from "@faker-js/faker";
import { HomePage } from "../page-objects/homePage";
import { User } from "../workflow/user";

const username = faker.random.alphaNumeric(10);
const email = faker.internet.email(username);
const password = faker.random.alphaNumeric(10);

const homePage = new HomePage();
const user = new User();

describe("Articles", () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  before(function () {
    // Create new user
    user.signUp(username, email, password);
  });

  it("should create an article, verify it exists and then delete it.", () => {
    homePage.navNewArticleButton.click();

    user.createArticle("Testing", "All about testing", "Cypress is awesome");

    cy.get("h1").should("have.text", "Testing");

    // Delete using top button
    homePage.articleDeleteTopButton.click();
  });

  it("should create an article, verify it exists and then delete it using second button.", function () {
    user.signIn(email, password);

    homePage.navNewArticleButton.click();

    user.createArticle(
      "Testing",
      "All about testing",
      "Cypress is awesome",
      "e2e cypress typescript"
    );

    cy.get("h1").should("have.text", "Testing");

    // Delete using down button
    homePage.articleDeleteBottomButton.click();
  });

  it("should create an article, edit it's content and verify.", () => {
    user.signIn(email, password);

    homePage.navNewArticleButton.click();

    user.createArticle(
      "Testing",
      "All about testing",
      "Cypress is awesome",
      "e2e cypress typescript"
    );

    cy.intercept("GET", "/api/articles/*").as("fetchArticle");

    homePage.articleEditTopButton.click();

    // Wait until article information is fetched and shown inside inputs
    cy.wait("@fetchArticle");

    // Workaround to wait until inputs have data
    cy.get(".tag-default").should("exist");

    user.createArticle(
      "Edited title",
      "Edited about",
      "Edited body",
      "e2e cypress typescript edited"
    );

    cy.get("h1").should("have.text", "Edited title");
    cy.get("p").should("have.text", "Edited body");

    // Delete
    homePage.articleDeleteTopButton.click();
  });

  it("should create an article, edit it's content using second button and verify.", function () {
    user.signIn(email, password);

    homePage.navNewArticleButton.click();

    user.createArticle(
      "Testing 2",
      "All about testing",
      "Cypress is awesome",
      "e2e cypress typescript"
    );

    homePage.articleEditTopButton.click();

    // Workaround to wait until inputs have data
    cy.get(".tag-default").should("exist");

    // Edit
    user.createArticle(
      "Edited title 2",
      "Edited about",
      "Edited body",
      "e2e cypress typescript edited"
    );

    cy.get("h1").should("have.text", "Edited title 2");
    cy.get("p").should("have.text", "Edited body");

    // Delete
    homePage.articleDeleteTopButton.click();
  });

  it("should show errors while creating a form with invalid inputed data", () => {
    // Login
    user.signIn(email, password);

    // Create a new article
    homePage.navNewArticleButton.click();
    user.createArticle(
      "Testing",
      "All about testing",
      "Cypress is awesome",
      "e2e cypress typescript"
    );
    cy.intercept("POST", "/api/articles").as("postArticles");
    cy.wait("@postArticles");

    // Try to create a new one with similar title
    homePage.navHomeButton.click();
    homePage.navNewArticleButton.click();
    homePage.articleTitleInput.type("Testing");
    homePage.articleAboutInput.type("Hello there");
    homePage.articleBodyInput.type("Testing 1");
    homePage.articleTagsInput.type("Testing 2");

    homePage.articleFormSubmitButton.click();

    homePage.errorMessage.should("contain.text", "title must be unique");

    // Try to create one without title
    homePage.articleTitleInput.clear();
    homePage.articleFormSubmitButton.click();
    homePage.errorMessage.should("contain.text", "title can't be blank");

    // Restore title
    homePage.articleTitleInput.type("TestingRandom");

    // Try to create one without descriptioon
    homePage.articleAboutInput.clear();
    homePage.articleFormSubmitButton.click();
    homePage.errorMessage.should("contain.text", "description can't be blank");

    // Restore about
    homePage.articleAboutInput.type("TestingRandomfwefewefw");

    // Try to create one without body
    homePage.articleBodyInput.clear();
    homePage.articleFormSubmitButton.click();
    homePage.errorMessage.should("contain.text", "body can't be blank");

    homePage.navHomeButton.click();
  });
});
