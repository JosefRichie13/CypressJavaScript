//Importing the POM file
const LoginPage = require('../pages/page_login.js')
const loginpage = new LoginPage()

// Importing the Selectors and Config files
const selectors = require('../helpers/selectors.js')
const configs = require('../helpers/configs.js')

describe('Login Test cases', () => {

    it('Valid User can Login', () => {
        loginpage.login(configs.ValidUser, configs.Password)
        cy.get(selectors.HomePageTitle).should('have.text', 'Swag Labs')
    })

    it('Locked out user cannot Login', () => {
        loginpage.login(configs.LockedUser, configs.Password)
        cy.get(selectors.ErrorMessage).should('include.text', 'Sorry, this user has been locked out')
    })

    it ('Cannot login withot a Username', () =>{
        loginpage.login('', configs.Password)
        cy.get(selectors.ErrorMessage).should('include.text', 'Username is required')
    })

    it ('Cannot login without a Password', () =>{
        loginpage.login(configs.ValidUser, '')
        cy.get(selectors.ErrorMessage).should('include.text', 'Password is required')
    })

    it ('Cannot login with a wrong Username', () => {
        loginpage.login(configs.WrongUser, configs.Password)
        cy.get(selectors.ErrorMessage).should('include.text', 'Username and password do not match any user in this service')
    })

    it ('Cannot login with a wrong Password', () => {
        loginpage.login(configs.ValidUser, configs.WrongPassword)
        cy.get(selectors.ErrorMessage).should('include.text', 'Username and password do not match any user in this service')
    })

    it ('Valid user can login and logout', () => {
        loginpage.login(configs.ValidUser, configs.Password)
        cy.get(selectors.HomePageTitle).should('have.text', 'Swag Labs')
        loginpage.logout()
        cy.get(selectors.LoginPageTitle).should('have.text', 'Swag Labs')
    })
  })