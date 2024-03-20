//Importing the Login page file
const LoginPage = require('../pages/page_login.js')
const loginpage = new LoginPage()

// Importing the Configs and Selectors
const configs = require('../helpers/configs.js')
const selectors = require('../helpers/selectors.js')

describe('Footer Scenarios', () => {

    it('Footer is visible when logged in', () => {
        loginpage.login(configs.ValidUser, configs.Password)
        cy.get(selectors.Footer).should('exist')
    })



    it('Footer is not visible when logged out', () => {
        cy.visit(configs.MainURL)
        cy.get(selectors.Footer).should('not.exist')
    })



    it('Footer links are correct', () => {
        loginpage.login(configs.ValidUser, configs.Password)

        cy.get(selectors.TwitterRedirect).should('have.attr', 'href').then((href) => {
            var redirectedLink = href
            expect(redirectedLink).to.eq("https://twitter.com/saucelabs")
        })

        cy.get(selectors.FacebookRedirect).should('have.attr', 'href').then((href) => {
            var redirectedLink = href
            expect(redirectedLink).to.eq("https://www.facebook.com/saucelabs")
        })

        cy.get(selectors.LinkedInRedirect).should('have.attr', 'href').then((href) => {
            var redirectedLink = href
            expect(redirectedLink).to.eq("https://www.linkedin.com/company/sauce-labs/")
        })

    })

})