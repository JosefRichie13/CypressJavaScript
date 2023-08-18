// Importing the Configs and Selectors
const configs = require('../helpers/configs.js')
const selectors = require('../helpers/selectors.js')

class loginpage {

    // Empty Constructor
    constructor(){
    }

    // This method logs in a user using 2 params, username and password.
    // The cy.intercept is for an issue with the Website under test, 
    // https://github.com/cypress-io/cypress/issues/27501
    login(username, password){

        cy.visit(configs.MainURL)
        cy.intercept('/service-worker.js', {
            body: undefined
           })

        if (password.length === 0){
            cy.get(selectors.UserName).type(username)
        }
        else if (username.length === 0){
            cy.get(selectors.Password).type(password)
        }
        else {
            cy.get(selectors.UserName).type(username)
            cy.get(selectors.Password).type(password)
        }

        cy.get(selectors.LoginButton).click()
    }


    // This method logs out a user
    logout(){
        cy.get(selectors.Menu).click()
        cy.get(selectors.LogoutButton).click()
    }

}
module.exports = loginpage