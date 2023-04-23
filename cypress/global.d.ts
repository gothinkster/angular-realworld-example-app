// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    getBySel(value: string): Chainable<Element>;

    login(username: string, password: string): Chainable<Element>;

    signup(
      username: string,
      email: string,
      password: string
    ): Chainable<Element>;

    createArticle(
      title?: string,
      about?: string,
      body?: string,
      tags?: string,
      clear?: boolean
    ): Chainable<Element>;
  }
}
