export class FormPage {
  get usernameInput() {
    return cy.get('[data-test="form-username"]');
  }

  get emailInput() {
    return cy.get('[data-test="form-email"]');
  }

  get passwordInput() {
    return cy.get('[data-test="form-password"]');
  }

  get formSubmitButton() {
    return cy.get('[data-test="form-submit"]');
  }
}
