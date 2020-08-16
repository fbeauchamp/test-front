// https://docs.cypress.io/api/introduction/api.html

describe('Calendar component test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'Demo of calendar component')
  })
  it('Should answer to click', () => {
    cy.visit('/')
    cy.get(':nth-child(3) > td:nth-child(4)').click().should('have.class', 'selected')
    // click again, should be deselected
    cy.get(':nth-child(3) > td:nth-child(4)').click().should('not.have.class', 'selected')
  })
  it('Should answer to click on a header', () => {
    cy.visit('/')
    cy.get('th:nth-child(4)').click()
    cy.get(' td:nth-child(4)').should('have.class', 'selected')

    // click again, should be deselected
    cy.get('th:nth-child(4)').click()
    cy.get('td:nth-child(4)').should('not.have.class', 'selected')
  })
  it('Should be able to change month', () => {
    cy.visit('/')
    cy.get('select.month-selector').select('2020-12')
  })

  it('Should answer to drag', () => {
    cy.visit('/')
    cy.get(':nth-child(3) > td:nth-child(4)').trigger('mousedown')
    cy.get(':nth-child(4) > td:nth-child(6)').trigger('mouseover')
    cy.get(':nth-child(4) > td:nth-child(6)').trigger('mouseup')
    cy.get('.selected').should('have.length', 10)

    cy.get(':nth-child(3) > td:nth-child(5)').trigger('mousedown')
    cy.get(':nth-child(4) > td:nth-child(4)').trigger('mouseover')
    cy.get(':nth-child(4) > td:nth-child(4)').trigger('mouseup')
    cy.get('.selected').should('have.length', 3)
  })
  it('should change language', ()=>{
    cy.visit('/')
    cy.get('#language').select('fr')
    cy.get('thead > tr > :nth-child(1) > button').should('have.text', ' lun. ')

    cy.get('#language').select('fr-ca')
    cy.get('thead > tr > :nth-child(1) > button').should('have.text', ' dim. ')
  })
})
