/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/readings')
    })

    // https://on.cypress.io/interacting-with-elements

    it('.type() - type into a DOM element', () => {
        cy.get('.jsx-816540582').click()
        cy.wait(1000)
        cy.get('.jsx-816540582').click()
        cy.wait(1000)
        cy.get('.jsx-816540582').click()
        cy.wait(1000)
        cy.get('.jsx-816540582').click()
        cy.wait(1000)
        cy.get('.jsx-816540582').click()
    })
})
