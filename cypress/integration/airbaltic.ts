import { root } from "../objects/airbaltic/mainPage";
import { userdata } from "../fixtures/userdata";

//Set load timeout to have possibility to slowdown the test if requred / to film a video for demo
let localTimeoutMS = 2000;

//To handle an exception
Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe("Test for airbaltic.lv", () => {
    //Create json object do test insertion
    let suggestedflightJson = {};
    suggestedflightJson.flightInformation = [];

    it('Collect data in a json object and print the final json object in the console', () => {

        // Preconditions
        //Step 1 - open the main page
        cy.visit(Cypress.env("env").AIRBALTIC_BASEURL)
        cy.wait(localTimeoutMS)

        //Step 2 - close cookie pop-up
        cy.get(root.body.close_cookie_popup).should('be.visible').click()
        cy.wait(localTimeoutMS)

        //Step 3 - close low price pop-up
        cy.get(root.body.close_low_price_popup).should('be.visible').click()
        cy.wait(localTimeoutMS)

        //Step 4 - change language to English
        cy.get(root.body.click_language).should('be.visible').click()
        cy.get(root.body.select_language).click()
        cy.wait(localTimeoutMS)


        //Step 5 - press Login button
        cy.get(root.body.click_login).click()
        cy.wait(localTimeoutMS)

        //Step 6 - enter test account credentials
        cy.get(root.body.email_input_click).click().type(userdata.body.user1login)
        cy.get(root.body.email_input_password_click).click().type(userdata.body.user1password)
        cy.wait(localTimeoutMS)
        //Subbmit
        cy.get(root.body.login_submit_button).click()


        // Main test procedure body

        //Step 7 - select 'one-way flight'
        cy.get(root.body.oneway_dropdown).click()
        cy.wait(localTimeoutMS)
        cy.get(root.body.oneway_select).click()
        cy.wait(localTimeoutMS)

        //Step 8 - input From* 'London (LON)'
        cy.get(root.body.book_flight_origin_input).click().wait(500).type('London (LON){enter}')
        cy.wait(localTimeoutMS)

        //Step 9- input To* 'Riga (RIX)'
        cy.get(root.body.book_flight_destination_input).click().wait(500).type('Riga (RIX){enter}')
        cy.wait(localTimeoutMS)

        //Step 10 - press button 'Select dates'
        cy.get(root.body.button_select_dates).click()
        cy.wait(localTimeoutMS)
        //redirecting to the next page


        //Step 11 - select departure date
        cy.scrollTo('center')
        cy.get(root.body.select_departure_date).click({ force: true })
        cy.wait(localTimeoutMS)

        //BECAUSE OF THE CAPTCHA LET'S TAKE SUGGESTED FLIGHTS FROM THE MAIN PAGE
        //Step 12 - scroll to Top
        cy.scrollTo('top')
        //Step 13 - click Logo, navigate to home page
        cy.get(root.body.click_header_logo).click()
        cy.wait(localTimeoutMS)

        //Step 14 - scroll to center
        cy.scrollTo('center')

        //Define required variables
        let depart;
        let arrive;
        let price;

        //Step 15 - Loop throught all records returned
        let counter = 4;
        // for (let i = 1; i < counter; i++) {
        cy.get(root.body.get_banner).each((theElement, row) => {

            //Get suggested flights
            //Get Depart
            depart = theElement.find(root.body.find_destination).text();
            //not you can use article
            cy.log("depart: " + depart)
            // });

            // cy.get(':nth-child(2) > .wrap > .item-wrapper > .VueCarousel > .VueCarousel-wrapper > .VueCarousel-inner > .VueCarousel-slide-active > :nth-child(' + counter + ') > .info > .content > .left-block > .origin').then((theElement) => {
            arrive = theElement.find(root.body.find_origin).text();
            //not you can use article
            cy.log("arrive: " + arrive)
            // });

            // cy.get(':nth-child(2) > .wrap > .item-wrapper > .VueCarousel > .VueCarousel-wrapper > .VueCarousel-inner > .VueCarousel-slide-active > :nth-child(' + counter + ') > .info > .content > .price-block > .number').then((theElement) => {
            price = theElement.find(root.body.find_price).text();
            //not you can use article
            cy.log("price: " + price);


            //Write parsed data into json object
            suggestedflightJson.flightInformation.push({ "depart": depart, "arrive": arrive, "price": price });

        }).then(() => {
            //Step 16 - Print filled in json
            cy.log(JSON.stringify(suggestedflightJson));
        });

    });
});

