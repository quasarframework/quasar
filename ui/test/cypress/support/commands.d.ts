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
