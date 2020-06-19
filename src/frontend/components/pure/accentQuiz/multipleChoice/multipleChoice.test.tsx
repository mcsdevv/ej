/// <reference types="cypress" />
import React from 'react'
import { mount } from 'cypress-react-unit-test'
import { none, some } from 'fp-ts/lib/Option'
import MVQ from './index'

describe('interactive', () => {
    let clickHandler: any

    beforeEach(() => {
        clickHandler = cy.stub()
    })

    it('renders', () => {
        mount(
            <MVQ
                audioFile={'someAudio'}
                katakana='ダイガク'
                downStep={none}
                particle={none}
                onClickNext={clickHandler}
            />,
        )
    })
})
