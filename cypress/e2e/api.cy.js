// Simple API testing using https://restful-booker.herokuapp.com/apidoc/index.html

// Follows this flow
// --> Create a booking
// --> Get the booking details
// --> Delete the booking
// --> Get the booking details again

describe('API Scenarios', () => { 

    // I create a booking via a POST request using a pre specified API Body, 
    // then write the response to a file. 
    // The response contains a Booking ID
    it('Create a booking', () => { 

        cy.readFile("cypress\\fixtures\\apibody.json").then(DataFromFile => {

            cy.request('POST', 'https://restful-booker.herokuapp.com/booking', DataFromFile).then((response) => {
                var responseBodyFromAPI = JSON.stringify(response.body)
                cy.writeFile("cypress\\fixtures\\apiresponse.json", responseBodyFromAPI)
            })
        })
    })


    // I get the Booking ID from the saved file and using it get the booking details  
    // Then I confirm whether the Data returned is the same 
    // as the data that I used to create the booking in the first scenario
    it('Get the booking details', () => {

        cy.readFile("cypress\\fixtures\\apiresponse.json").then(DataFromFile => {

            cy.request('GET', 'https://restful-booker.herokuapp.com/booking/' + DataFromFile.bookingid).then((response) => {
                var responseBodyFromAPI = JSON.stringify(response.body)
                expect(JSON.stringify(DataFromFile.booking)).to.equal(responseBodyFromAPI)
            })
        })
    })


    // I get a token using which I delete the created booking
    it('Delete the booking', () => {

        cy.request('POST', 'https://restful-booker.herokuapp.com/auth', {"username":"admin","password":"password123"}).then((response) => {
            var TokenDetails = response.body

            cy.readFile("cypress\\fixtures\\apiresponse.json").then(DataFromFile => {

                cy.request({method: 'DELETE', url: 'https://restful-booker.herokuapp.com/booking/' + DataFromFile.bookingid, headers: {'Cookie': 'token=' + TokenDetails.token} }).then((response) => {
                    expect(response.status).to.equal(201)
                })
            })
        })
    })


    // I re-get the booking using the Booking ID
    // This will result in a 404, cause the booking is already deleted.
    it('Get the Deleted booking', () => {

        cy.readFile("cypress\\fixtures\\apiresponse.json").then(DataFromFile => {

            cy.request({method: 'GET', url: 'https://restful-booker.herokuapp.com/booking/' + DataFromFile.bookingid, failOnStatusCode: false} ).then((response) => {
                expect(response.status).to.equal(404)
            })
        })

    })
})