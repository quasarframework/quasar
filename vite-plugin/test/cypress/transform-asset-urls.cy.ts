/**
 * @see https://stackoverflow.com/a/58641462/9260314
 */
const assertImageLoaded = (imgSelector: string) => cy.get(imgSelector).should('be.visible').its('naturalWidth').should('be.gt', 0);

describe('Vue Transform Asset URLs', () => {
  const logoAsset = '/assets/logo.png'

  beforeEach(() => {
    cy.visit('/')
  })

  it('should apply asset transform to QImg with src', async () => {
    cy.get('#qimg-src img').its('src').should('be', logoAsset)

    assertImageLoaded('#qimg-src img')
  })

  it('should apply asset transform to QImg with placeholder-src', async () => {
    cy.get('#qimg-placeholder-src img').its('src').should('be', logoAsset)

    assertImageLoaded('#qimg-placeholder-src img')
  })

  it('should apply asset transform to QParallax with src', async () => {
    cy.get('#qparallax-src img').its('src').should('be', logoAsset)

    assertImageLoaded('#qparallax-src img')
  })
})
