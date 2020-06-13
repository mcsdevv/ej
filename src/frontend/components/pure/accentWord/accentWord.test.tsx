/// <reference types="cypress" />
import React from 'react'
import { mount } from 'cypress-react-unit-test'
import { none } from 'fp-ts/lib/Option'
import AccentWord from './container'

describe('interactive', () => {
    it('renders', () => {
        mount(
            <AccentWord
                kana='ダイガク'
                downStep={none}
                interactive={true}
                particle={none}
            />,
        )
        cy.get('text').should('contain.text', 'ダイガク')
    })

    it('responds to input', () => {
        mount(
            <AccentWord
                kana='ダイガク'
                downStep={none}
                interactive={true}
                particle={none}
            />,
        )
        cy.get('.low').should('contain.text', 'ダイガク')
        cy.contains('イ').click({ force: true })
        cy.get('.high').should('contain.text', 'イ')
        cy.contains('イ').click({ force: true })
        cy.get('.high').should('not.exist')
        cy.get('.low').should('contain.text', 'ダイガク')
    })

    it('can be set to correct', () => {
        mount(
            <AccentWord
                kana='ダイガク'
                downStep={none}
                interactive={true}
                particle={none}
            />,
        )

        cy.contains('イ').click({ force: true })
        cy.contains('ガ').click({ force: true })
        cy.contains('ク').click({ force: true })
    })
})
