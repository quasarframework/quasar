const types = [
  'basic',
  'imports',
  'aliased-imports',
  'custom',
  'custom-with-imports',
  'custom-with-aliased-imports',
  'only-custom-with-imports',
  'only-custom-with-aliased-imports',
  'mixed-case',
  'mixed-case-with-duplicates',
  'mixed-case-with-duplicates-and-aliased-imports'
]

describe('Script Transform', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad (win) {
        cy.spy(win.console, 'warn').as('consoleWarn')
      }
    })

    cy.get('@consoleWarn').should('not.have.been.called')
  })

  it('should transform <script setup> correctly', () => {
    types.forEach((type) => {
      cy.get(`#script-setup-${ type }`)
        .find('*')
        .each(($el) => {
          expect($el.prop('tagName')).not.to.match(/^[qQ]/)
        })
    })
  })

  it('should transform <script> correctly', () => {
    types.forEach((type) => {
      cy.get(`#script-${ type }`)
        .find('*')
        .each(($el) => {
          expect($el.prop('tagName')).not.to.match(/^[qQ]/)
        })
    })
  })
})
