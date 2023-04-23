export class HomePage {
  get navHomeButton() {
    return cy.get('[data-test="nav-home"]');
  }

  get navNewArticleButton() {
    return cy.get('[data-test="nav-new-article"]');
  }

  get navSettingsButton() {
    return cy.get('[data-test="nav-settings"]');
  }

  get navUsername() {
    return cy.get('[data-test="nav-username"]');
  }

  get navSignInButton() {
    return cy.get('[data-test="nav-signin"]');
  }

  get navSignUpButton() {
    return cy.get('[data-test="nav-signup"]');
  }

  get articleDeleteTopButton() {
    return cy.get('[data-test="article-deleteButtonTop"]');
  }

  get articleDeleteBottomButton() {
    return cy.get('[data-test="article-deleteButtonDown"]');
  }

  get articleEditTopButton() {
    return cy.get('[data-test="article-editButtonTop"]');
  }

  get articleTitleInput() {
    return cy.get('[data-test="article-title"]');
  }
  get articleAboutInput() {
    return cy.get('[data-test="article-about"]');
  }
  get articleBodyInput() {
    return cy.get('[data-test="article-body"]');
  }
  get articleTagsInput() {
    return cy.get('[data-test="article-tags"]');
  }

  get articleFormSubmitButton() {
    return cy.get('[data-test="article-formSubmit"]');
  }

  get errorMessage() {
    return cy.get('[data-test="error-message"]');
  }
}
