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
        cy.get(selectors.BoltTShirt).click()
        checkoutpage.FillDetailsToContinue()       

        // Putting the Total Tax calculation into a alias
        // which we will use to compare against
        cy.get(selectors.TotalPrice).then((Price) => {
            var PriceInUI = Price.text()
            var TaxCalculated = Number(PriceInUI.slice(13)) * 0.08
            var TotalWithTax = TaxCalculated + Number(PriceInUI.slice(13))
            var TotalWithTaxRounded = Math.round(TotalWithTax * 100) / 100
            cy.wrap(TotalWithTaxRounded).as('TotalWithTaxRounded')
        }) 

        // Get the total price with Tax in the UI and assert against the price that we calculated
        cy.get(selectors.FinalPrice).then((Price) => {
            var FinalPriceInUI = Price.text()
            var FinalPriceWithTrim = Number(FinalPriceInUI.slice(8).trim())
            cy.get('@TotalWithTaxRounded').then(TotalWithTaxRounded => {
                expect(TotalWithTaxRounded).to.eq(FinalPriceWithTrim)
            })
        })

        //The same Tax calculation logic, but using fixtures
        //  cy.get(selectors.TotalPrice).then(($Price) => {
        //     var PriceInUI = $Price.text()
        //     var TaxCalculated = Number(PriceInUI.slice(13)) * 0.08
        //     var TotalWithTax = TaxCalculated + Number(PriceInUI.slice(13))
        //     var TotalWithTaxRounded = Math.round(TotalWithTax * 100) / 100
        //     cy.writeFile("cypress\\fixtures\\tempData.json", {TotalWithTaxRounded})
        // }) 

        // cy.get(selectors.FinalPrice).then(($Price) => {
        //     var PriceInUI = $Price.text()
        //     cy.readFile("cypress\\fixtures\\tempData.json").then( Price => {
        //         expect(Price.TotalWithTaxRounded).to.eq(Number(PriceInUI.slice(8).trim()))
        //     })
        // })
        
    })


    it('Sum of individual items is equal to the total sum', () => {

        loginpage.login(configs.ValidUser, configs.Password)
        cy.get(selectors.Backpack).click()
        cy.get(selectors.Onesie).click()
        cy.get(selectors.BoltTShirt).click()
        checkoutpage.FillDetailsToContinue() 

        // Gets each price to sum it and put it in TotalCalculatedPrice variable
        // Then asserts that the summed price in TotalCalculatedPrice is
        // equal to the total sum displayed 
        var TotalCalculatedPrice = 0
        cy.get(selectors.IndividualPrices).each((Price) => {
            TotalCalculatedPrice = TotalCalculatedPrice + parseFloat(Price.text().slice(1))

            cy.get(selectors.TotalPrice).then((TotalPrice) => {
                expect(TotalCalculatedPrice).to.eq(parseFloat(TotalPrice.text().slice(13)))
            })
        })
    })


    // Logic here is to put all the prices/names into a list, RawPricesBeforeSort/RawNamesBeforeSort
    // Then click on the sorter. which will sort the UI
    // Then put all the sorted prices/names into a new list, RawPricesAfterSort/RawNamesAfterSort
    // Then apply JavaScript sort methods on the original list, RawPricesBeforeSort/RawNamesBeforeSort
    // Finally compare if RawPricesBeforeSort/RawNamesBeforeSort is equal to RawPricesBeforeSort/RawNamesBeforeSort
    // This ensures that the JS sorted method and UI return the same order
    it('Sort by various options returns the correct value', () => {

        loginpage.login(configs.ValidUser, configs.Password)

        // Calls the method, RawPrices and gets the variable, @RawPrices which is 'returned' by the method 
        // It puts it into a new variable, RawPricesBeforeSort
        // Then clicks on the sort option in the homepage
        // Calls the method, RawPrices, again and gets the variable, @RawPrices which is 'returned' by the method 
        // It puts it into a new variable, RawPricesAfterSort
        // Finally compares if both RawPricesBeforeSort and RawPricesAfterSort are same 
        // after sorting RawPricesBeforeSort from High to Low
        checkoutpage.RawPrices()
        cy.get('@RawPrices').then(RawPricesBeforeSort => {
            cy.get(selectors.SortOption).select("Price (high to low)")
            checkoutpage.RawPrices()
            cy.get('@RawPrices').then(RawPricesAfterSort => { 
                expect(JSON.stringify(RawPricesBeforeSort.sort(function(a,b) { return b - a;}))).to.eq(JSON.stringify(RawPricesAfterSort))            
            })
        })

        // Compares if both RawPricesBeforeSort and RawPricesAfterSort are same 
        // after sorting RawPricesBeforeSort from Low to High
        checkoutpage.RawPrices()
        cy.get('@RawPrices').then(RawPricesBeforeSort => {
            cy.get(selectors.SortOption).select("Price (low to high)")
            checkoutpage.RawPrices()
            cy.get('@RawPrices').then(RawPricesAfterSort => { 
                expect(JSON.stringify(RawPricesBeforeSort.sort(function(a,b) { return a - b;}))).to.eq(JSON.stringify(RawPricesAfterSort))            
            })
        })

        // Compares if both RawNamesBeforeSort and RawNamesAfterSort are same 
        // after sorting RawNamesBeforeSort from Name (A to Z)
        checkoutpage.RawNames()
        cy.get('@RawNames').then(RawNamesBeforeSort => {
            cy.get(selectors.SortOption).select("Name (A to Z)")
            checkoutpage.RawNames()
            cy.get('@RawNames').then(RawNamesAfterSort => { 
                expect(JSON.stringify(RawNamesBeforeSort.sort())).to.eq(JSON.stringify(RawNamesAfterSort))            
            })
        })

        // Compares if both RawNamesBeforeSort and RawNamesAfterSort are same 
        // after sorting RawNamesBeforeSort from Name (Z to A)
        checkoutpage.RawNames()
        cy.get('@RawNames').then(RawNamesBeforeSort => {
            cy.get(selectors.SortOption).select("Name (Z to A)")
            checkoutpage.RawNames()
            cy.get('@RawNames').then(RawNamesAfterSort => { 
                expect(JSON.stringify(RawNamesBeforeSort.reverse())).to.eq(JSON.stringify(RawNamesAfterSort))            
            })
        })
    })
    
})