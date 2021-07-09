import { root } from "../objects/airbaltic/mainPage";
import { userdata } from "../fixtures/userdata";

//Set loal timeout to have possibility to slowdown the test if requred / to film a video for demo
let localTimeoutMS = 1000;

//To handle an expection
Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe("Test for airbaltic.lv", () => {
    //Create json object do test insertion
    let suggestedflightJson = {};
    suggestedflightJson.flightInformation = [];

    it('Collect data in a json object and print the final json object in the console', () => {


        //Step 1 - open the main page
        cy.visit(Cypress.env("env").AIRBALTIC_BASEURL)
        cy.wait(localTimeoutMS)

        //Step 2 - close cookie pop-up
        cy.get('.close').should('be.visible').click()
        cy.wait(localTimeoutMS)

        //Step 3 - close low price pop-up
        cy.get('.right-content > .close-icon').should('be.visible').click()
        cy.wait(localTimeoutMS)

        //Step 4 - change language to English
        cy.get(root.body.click_language).should('be.visible').click()
        cy.get(root.body.select_language).click()


        //Press Login button
        cy.get('.new > .header-wrapper > .label').click()
        cy.wait(localTimeoutMS)

        //Enter test account credentials
        cy.get('.email > input').click().type(userdata.body.user1login)
        cy.get('.password > input').click().type(userdata.body.user1password)
        //Subbmit
        cy.get('.login-form > .btn > button').click()


        //--- Main test procedure body ---
        cy.get(root.body.click_language).should('be.visible').click()
        cy.wait(localTimeoutMS)

        cy.get(root.body.select_language).click()
        cy.wait(localTimeoutMS)

        //Step 5 - select 'one-way flight'
        cy.get(root.body.oneway_dropdown).click()
        cy.wait(localTimeoutMS)

        cy.get(root.body.oneway_select).click()
        cy.wait(localTimeoutMS)

        //Step 6 - input From* 'London (LON))'
        cy.get(root.body.book_flight_origin_input).click().wait(1000).type('London (LON){enter}')//.should('contain', 'London')
        cy.wait(localTimeoutMS)

        //Step 7- input To* 'Riga (RIX))'
        cy.get(root.body.book_flight_destination_input).click().wait(1000).type('Riga (RIX){enter}')//.should('contain', 'Riga')
        cy.wait(localTimeoutMS)

        //Step 8 - press button 'Select dates'
        cy.get(root.body.button_select_dates).click()
        cy.wait(localTimeoutMS)
        //redirecting to the next page


        //Select depart date
        cy.scrollTo('center')
        cy.get('.calendar_072021 > .calendar__table > tbody > :nth-child(4) > :nth-child(5) > div > [data-testid=day-container] > .calendar__day-number').click({ force: true })
        cy.wait(localTimeoutMS)

        cy.log('We are here!')

        //Click check-box "I am not a robot"
        //cy.get('.flightlock__checkbox').click()
        cy.wait(localTimeoutMS)
        //redirecting to the next page

        //BECAUSE OF THE CAPCHA LET'S TAEK SUGGESTED FLYGHTS FROM THE MAIN PAGE
        //Scroll Top
        cy.scrollTo('top')
        //Click Logo
        cy.get('.logo__img').click()
        //cy.get('.header-logo-wrap > a').click()
        cy.wait(localTimeoutMS)



        //Scroll 
        cy.scrollTo('center')

        //Define required variables
        let depart;
        let arrive;
        let price;

        //Loop throught all records returned
        let counter = 4;
        // for (let i = 1; i < counter; i++) {
        cy.get(':nth-child(2) > .wrap > .item-wrapper > .VueCarousel > .VueCarousel-wrapper > .VueCarousel-inner > .VueCarousel-slide-active .banner-item').each((theElement, row) => {
            //Get suggested flights
            //Get Depart
            // cy.get(':nth-child(2) > .wrap > .item-wrapper > .VueCarousel > .VueCarousel-wrapper > .VueCarousel-inner > .VueCarousel-slide-active > :nth-child('+counter+') > .info > .content > .left-block > .destination').then((theElement) => {
            // bannerElement.find('.info > .content > .left-block > .destination').then(
            depart = theElement.find('.info > .content > .left-block > .destination').text();
            //not you can use article
            cy.log("depart: " + depart)
            // });

            // cy.get(':nth-child(2) > .wrap > .item-wrapper > .VueCarousel > .VueCarousel-wrapper > .VueCarousel-inner > .VueCarousel-slide-active > :nth-child(' + counter + ') > .info > .content > .left-block > .origin').then((theElement) => {
            arrive = theElement.find('.info > .content > .left-block > .origin').text();
            //not you can use article
            cy.log("arrive: " + arrive)
            // });

            // cy.get(':nth-child(2) > .wrap > .item-wrapper > .VueCarousel > .VueCarousel-wrapper > .VueCarousel-inner > .VueCarousel-slide-active > :nth-child(' + counter + ') > .info > .content > .price-block > .number').then((theElement) => {
            price = theElement.find('.info > .actions > .price-block > .number').text();
            //not you can use article
            cy.log("price: " + price);


            //Write parsed data into json object
            suggestedflightJson.flightInformation.push({ "depart": depart, "arrive": arrive, "price": price });

        }).then(() => {
            //Print filled in json
            cy.log(JSON.stringify(suggestedflightJson));
        });





        //Logout after each test
        //cy.get('.new > .header-wrapper > .label').click()
        //cy.wait(localTimeoutMS)
        //cy.get('.log-out > a').click()
        //cy.wait(localTimeoutMS)

    });
});

