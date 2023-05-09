const types = [
  'basic',
  'imports',
  'aliased-imports',
  'custom',
  'custom-with-imports',
  'custom-with-aliased-imports',
  'only-custom-with-imports',
  'only-custom-with-aliased-imports'
]

describe('Script Transform', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should transform <script setup> correctly', () => {
    types.forEach((type) => {
      cy.get(`#script-setup-${type}`)
        .find('*')
        .each(($el) => {
          expect($el.prop('tagName')).not.to.match(/^q-/)
        })
    })
  })

  it('should transform <script> correctly', () => {
    types.forEach((type) => {
      cy.get(`#script-${type}`)
        .find('*')
        .each(($el) => {
          expect($el.prop('tagName')).not.to.match(/^q-/)
        })
    })
  })
})
