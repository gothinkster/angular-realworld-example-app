export class ProfilePage {
  get username() {
    return cy.get('[data-test="profile-username"]');
  }

  get bio() {
    return cy.get('[data-test="profile-bio"]');
  }
}
