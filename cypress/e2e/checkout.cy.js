//Importing the POM file
const LoginPage = require('../pages/page_login.js')
const loginpage = new LoginPage()

const HelperMethods = require('../helpers/helpermethods.js')

// Importing the Selectors and Config files
const selectors = require('../helpers/selectors.js')
const configs = require('../helpers/configs.js')


describe('Product Checkout', () => {

    it('I can buy a product and checkout', () => {
        loginpage.login(configs.ValidUser, configs.Password)
        cy.get(selectors.Backpack).click()
        cy.get(selectors.Onesie).click()
        cy.get(selectors.Cart).click()
        cy.get(selectors.Checkout).click()
        cy.get(selectors.FirstName).type("John")
        cy.get(selectors.LastName).type("Doe")
        cy.get(selectors.ZipCode).type("37188")
        cy.get(selectors.ContinueButton).click()
        cy.get(selectors.FinishButton).click()
        cy.get(selectors.CheckoutBanner).should('have.text', 'Thank you for your order!')
    })

})