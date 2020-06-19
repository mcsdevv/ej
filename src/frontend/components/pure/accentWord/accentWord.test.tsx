/// <reference types="cypress" />
import React from 'react'
import { mount } from 'cypress-react-unit-test'
import { none, some } from 'fp-ts/lib/Option'
import AccentWord from './accentWord'

describe('interactive', () => {
    it('renders', () => {
        mount(
            <AccentWord
                katakana='ダイガク'
                downStep={none}
                interactive={true}
                particle={none}
            />,
        )
        cy.get('text').should('contain.text', 'ダイガク')
        cy.get('.incorrect').should('exist')
        cy.get('.correct').should('not.exist')
    })

    it('responds to input', () => {
        mount(
            <AccentWord
                katakana='ダイガク'
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
                katakana='ダイガク'
                downStep={none}
                interactive={true}
                particle={none}
            />,
        )
        cy.contains('イ').click({ force: true })
        cy.contains('ガ').click({ force: true })
        cy.contains('ク').click({ force: true })
        cy.get('.incorrect').should('not.exist')
        cy.get('.correct').should('exist')
    })
})

describe('non interactive', () => {
    it('renders', () => {
        mount(
            <AccentWord
                katakana='ダイガク'
                downStep={none}
                interactive={false}
                particle={none}
            />,
        )
        cy.get('text').should('contain.text', 'ダイガク')
        cy.get('.incorrect').should('not.exist')
        cy.get('.correct').should('not.exist')
    })

    it('renders with a downstep', () => {
        mount(
            <AccentWord
                katakana='ダイガク'
                downStep={some(2)}
                interactive={false}
                particle={none}
            />,
        )
        cy.get('text').should('contain.text', 'ダイガク')
        cy.get('.low').should('contain.text', 'ダク')
    })

    it('renders with a particle', () => {
        mount(
            <AccentWord
                katakana='ダイガク'
                downStep={none}
                interactive={false}
                particle={some('オ')}
            />,
        )
        cy.get('text').should('contain.text', 'ダイガクオ')
    })
})
