// Importing the Configs and Selectors
const configs = require('../helpers/configs.js')
const selectors = require('../helpers/selectors.js')

class checkoutpage {

    // Empty Constructor
    constructor(){
    }

    // This clicks on the cart, checksout and fills the customer details to continue
    FillDetailsToContinue(){

        cy.get(selectors.Cart).click()
        cy.get(selectors.Checkout).click()
        cy.get(selectors.FirstName).type("John")
        cy.get(selectors.LastName).type("Doe")
        cy.get(selectors.ZipCode).type("37188")
        cy.get(selectors.ContinueButton).click()
    }    


}
module.exports = checkoutpage    