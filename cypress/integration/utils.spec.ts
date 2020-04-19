// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
import { parseNHK } from '@backend/utils'

it('can parse correctly formed json', () => {
	cy.fixture('small.json').then((data) => {
		const parsed = parseNHK(data[0].nhk)
		cy.wrap(parsed.hiragana).should('be.deep.equal', [ 'ある' ])
		cy.wrap(parsed.katakana).should('be.deep.equal', [ 'アル' ])
		cy.wrap(parsed.kanji).should('be.deep.equal', [ '有る', '在る' ])
		cy.wrap(parsed.readings.length).should('be.equal', 1)
		cy.wrap(parsed.readings[0].audioFile).should('be.equal', 'ある.yomi000142BB_0596.wav')
		cy.wrap(parsed.readings[0].downstep).should('be.equal', -1)
	})
})

it('it return null if given null', () => {
	expect(parseNHK(null)).to.be.null
})
