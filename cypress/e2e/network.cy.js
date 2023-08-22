// Network trace testing

// In this scenario, before we test a page, https://www.demoblaze.com/, we define 3 intercepts into aliases
// Then we make sure that these calls return correctly by making sure that their return length is not 0

describe('Network trace loads appropriate files', () => {

    it('Network trace loads CSS, JS and entries file', () => {

        cy.intercept('GET', 'https://www.demoblaze.com/node_modules/bootstrap/dist/css/bootstrap.min.css').as('BootstrapCSSCall')
        cy.intercept('GET', 'https://www.demoblaze.com/node_modules/jquery/dist/jquery.min.js').as('JQueryJSCall')
        cy.intercept('GET', 'https://api.demoblaze.com/entries').as('PhoneList')

        cy.visit("https://www.demoblaze.com/")

        cy.wait('@BootstrapCSSCall').then((BootstrapCSSCall) => {
            console.log((JSON.stringify(BootstrapCSSCall)).length)
            expect((JSON.stringify(BootstrapCSSCall)).length).to.be.greaterThan(0)
        })

        cy.wait('@JQueryJSCall').then((JQueryJSCall) => {
            console.log((JSON.stringify(JQueryJSCall)).length)
            expect((JSON.stringify(JQueryJSCall)).length).to.be.greaterThan(0)
        })

        cy.wait('@PhoneList').then((PhoneList) => {
            console.log((JSON.stringify(PhoneList)).length)
            expect((JSON.stringify(PhoneList)).length).to.be.greaterThan(0)
        })

    })

})