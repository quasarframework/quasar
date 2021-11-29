/// <reference types="Cypress" />
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('menu')
       *            .checkVerticalPosition('wrapper', 'bottom')
       */
      checkVerticalPosition<E extends Node = HTMLElement>(
        anchor: string,
        anchorOrigin: "bottom" | "top" | "center",
        selfOrigin: "bottom" | "top" | "center",
        offset: number = 0
      ): Chainable<JQuery<E>>;
  
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('menu')
       *            .checkHorizontalPosition('wrapper', 'left')
       */
      checkHorizontalPosition<E extends Node = HTMLElement>(
        anchor: string,
        anchorOrigin: "left" | "middle" | "right",
        selfOrigin: "left" | "middle" | "right",
        offset: number = 0
      ): Chainable<JQuery<E>>;
    }
  }

}
