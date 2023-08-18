//Importing the POM file
const LoginPage = require('../pages/page_login.js')
const loginpage = new LoginPage()
const CheckoutPage = require('../pages/page_checkout.js')
const checkoutpage = new CheckoutPage()


// Importing the Selectors and Config files
const selectors = require('../helpers/selectors.js')
const configs = require('../helpers/configs.js')


describe('Product Checkout', () => {

    it('I can buy a product and checkout', () => {
        loginpage.login(configs.ValidUser, configs.Password)
        cy.get(selectors.Backpack).click()
        cy.get(selectors.Onesie).click()
        checkoutpage.FillDetailsToContinue()
        cy.get(selectors.FinishButton).click()
        cy.get(selectors.CheckoutBanner).should('have.text', 'Thank you for your order!')
    })

    it('Tax is calculated at 8%', () => {

        loginpage.login(configs.ValidUser, configs.Password)
        cy.get(selectors.Backpack).click()
        cy.get(selectors.Onesie).click()
        checkoutpage.FillDetailsToContinue()       

        cy.get(selectors.TotalPrice).then(($Price) => {
            var PriceInUI = $Price.text()
            var TaxCalculated = Number(PriceInUI.slice(13)) * 0.08
            var TotalWithTax = TaxCalculated + Number(PriceInUI.slice(13))
            var TotalWithTaxRounded = Math.round(TotalWithTax * 100) / 100
            cy.writeFile("cypress\\fixtures\\tempData.json", {TotalWithTaxRounded})
        }) 

        cy.get(selectors.FinalPrice).then(($Price) => {
            var PriceInUI = $Price.text()
            cy.readFile("cypress\\fixtures\\tempData.json").then( Price => {
                expect(Price.TotalWithTaxRounded).to.eq(Number(PriceInUI.slice(8).trim()))
            })
        })
    })
})