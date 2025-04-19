/// <reference types="cypress" />
<<<<<<< HEAD
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
Cypress.Commands.add('login', () => {
    cy.visit('/login', { timeout: 20000 });
  
    // Intercept any POST request that contains 'login' in the URL
    cy.intercept('POST', '**/login**').as('loginRequest');
  
    cy.get('#email', { timeout: 10000 }).should('be.visible').type('test@example.com');
    cy.get('#password', { timeout: 10000 }).should('be.visible').type('password123');
  
    cy.get('button[type="submit"]').should('be.visible').click();
  
    // Wait for the API request and check the response
    cy.wait('@loginRequest', { timeout: 15000 }).then((interception) => {
      if (!interception.response) {
        throw new Error('Login request was never sent or intercepted.');
      }
      cy.log(`Login API responded with status: ${interception.response.statusCode}`);
      expect(interception.response.statusCode).to.eq(200);
    });
  
    // Ensure successful login by checking if redirected
    cy.url().should('not.include', '/login', { timeout: 15000 });
  });
  
  
=======
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password1231') => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/api/login/`, {
      statusCode: 200,
      body: {
        access: 'fake-jwt-token'
      }
    }).as('loginRequest')
  
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.contains('button', 'Continue').click()
  
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        email: email.toLowerCase(),
        password: password
      })
    })
  })
  
>>>>>>> upstream/main
