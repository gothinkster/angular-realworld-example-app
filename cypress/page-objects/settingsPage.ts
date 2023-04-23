export class SettingsPage {
  get logout() {
    return cy.get('[data-test="settings-logout"]');
  }

  get imageUrl() {
    return cy.get('[data-test="settings-imageUrl"]');
  }

  get username() {
    return cy.get('[data-test="settings-username"]');
  }

  get bio() {
    return cy.get('[data-test="settings-bio"]');
  }

  get email() {
    return cy.get('[data-test="settings-email"]');
  }

  get newPassword() {
    return cy.get('[data-test="settings-newPassword"]');
  }

  get updateButton() {
    return cy.get('[data-test="settings-updateButton"]');
  }
}
