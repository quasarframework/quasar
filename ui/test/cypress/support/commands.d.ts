/// <reference types="Cypress" />

declare namespace Cypress {
  interface Chainable {
      /**
             * Custom command to select DOM element by data-cy attribute.
             * @example cy.dataCy('greeting')
             */
       dataCy<E extends Node = HTMLElement>(value: string): Chainable<JQuery<E>>;
      /**
             * Custom command to select DOM element by data-cy attribute.
             * @example cy.dataCy('menu')
             *            .checkPosition('wrapper')
             */
       checkPosition<E extends Node = HTMLElement>(target: string, position: "bottom" | "top" | "left" | "right"): Chainable<JQuery<E>>;
  }
}