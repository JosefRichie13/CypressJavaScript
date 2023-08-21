// Importing the Configs and Selectors
const configs = require('../helpers/configs.js')
const selectors = require('../helpers/selectors.js')

class checkoutpage {

    // Empty Constructor
    constructor(){
    }

    // This method adds a product to the cart.
    // It gets the list of product names, then uses the Cypress each command, 
    // Each accepts 2 variables, Product and index
    // The IF condition checks for the name of the Product then
    // clicks on the Add To Cart button of the index returned
    AddAProductToCart(ProductName){

        cy.get(selectors.ProductList).each((Product, index) => {
            if(Product.text() === ProductName){
                cy.get(selectors.AddToCartNew).eq(index).click()
            }
        })
    }

    // This method clicks on the cart, checksout and fills the customer details to continue
    FillDetailsToContinue(){

        cy.get(selectors.Cart).click()
        cy.get(selectors.Checkout).click()
        cy.get(selectors.FirstName).type("John")
        cy.get(selectors.LastName).type("Doe")
        cy.get(selectors.ZipCode).type("37188")
        cy.get(selectors.ContinueButton).click()
    }   
    

    // This method will get all the prices from the home page, slice off the $ symbol, convert 
    // them into floats and put them into a list.
    // Then wraps them into a variable that can be used elsewhere
    RawPrices(){
        
        var RawPrices = []
        cy.get(selectors.IndividualPrices).each((Price) =>{
            RawPrices.push(parseFloat(Price.text().slice(1)))
        })
        cy.wrap(RawPrices).as('RawPrices')
    }

    // This method will get all the Names from the home page and put them into a list.
    // Then wraps them into a variable that can be used elsewhere
    RawNames(){
        
        var RawNames = []
        cy.get(selectors.ProductList).each((Name) =>{
            RawNames.push(Name.text())
        })
        cy.wrap(RawNames).as('RawNames')
    }


}
module.exports = checkoutpage    