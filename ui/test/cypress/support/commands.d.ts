/// <reference types="Cypress" />
import { VueWrapper } from "@vue/test-utils";

declare namespace Cypress {
  interface Chainer<Subject> {
    /**
     * @example
     *    cy.get('foo').should('have.color', 'white')
     *    cy.get('foo').should('have.color', '#fff')
     *    cy.get('foo').should('have.color', 'var(--q-primary)')
     */
    (chainer: "have.color", type: string): Chainable<Subject>;
    /**
     * @example
     *    cy.get('foo').should('have.backgroundColor', 'black')
     *    cy.get('foo').should('have.backgroundColor', '#000')
     *    cy.get('foo').should('have.backgroundColor', 'var(--q-dark)')
     */
    (chainer: "have.backgroundColor", type: string): Chainable<Subject>;
  }

  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    dataCy<E extends Node = HTMLElement>(
      value: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Chainable<JQuery<E>>;

    /**
     * Custom command to get the vue wrapper from a cypress instance.
     * @example cy.dataCy('greeting').vue()
     *
     */
    vue<E extends Node = HTMLElement>(): Chainable<VueWrapper>;

    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('menu')
     *            .checkVerticalPosition('wrapper', 'bottom')
     */
    checkVerticalPosition<E extends Node = HTMLElement>(
      anchor: string,
      anchorOrigin: "bottom" | "top" | "center",
      selfOrigin: "bottom" | "top" | "center" = "bottom"
      // offset: [number, number] = [0, 0]
    ): Chainable<JQuery<E>>;

    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('menu')
     *            .checkHorizontalPosition('wrapper', 'left')
     */
    checkHorizontalPosition<E extends Node = HTMLElement>(
      anchor: string,
      anchorOrigin: "left" | "middle" | "right",
      selfOrigin: "left" | "middle" | "right" = "left"
      // offset: [number, number] = [0, 0]
    ): Chainable<JQuery<E>>;
  }
}
