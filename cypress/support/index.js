// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Handle Guest authentication before each test
beforeEach(() => {
  // Clear localStorage to ensure clean state
  cy.clearLocalStorage();
  
  // Mock guest session
  cy.mockGuestSession();
  
  // Set guest authentication in localStorage
  cy.window().then((win) => {
    win.localStorage.setItem('isGuest', 'true');
    win.localStorage.setItem('userRole', 'guest');
    win.localStorage.setItem('authToken', 'guest-token');
    win.localStorage.setItem('user', JSON.stringify({
      id: 'guest-user',
      name: 'Guest',
      email: 'guest@example.com',
      roles: ['guest'],
      isGuest: true
    }));
  });
});

// Intercept all authentication requests before any test
before(() => {
  // Intercept session-info request (used by AuthWrapper)
  cy.intercept('GET', '**/auth/session-info', (req) => {
    req.reply({
      statusCode: 200,
      body: {
        success: true,
        data: {
          user: {
            id: 'guest-user',
            name: 'Guest',
            email: 'guest@example.com',
            role: 'guest',
            isGuest: true
          },
          authenticated: true,
          token: 'guest-token'
        }
      }
    });
  }).as('sessionInfo');

  // Intercept login requests
  cy.intercept('POST', '**/login', (req) => {
    req.reply({
      statusCode: 200,
      body: {
        user: {
          id: 'guest-user',
          name: 'Guest',
          role: 'guest',
          isGuest: true
        },
        token: 'guest-token'
      }
    });
  }).as('loginRequest');

  // Intercept all other auth requests
  cy.intercept('**/auth/**', (req) => {
    req.reply({
      statusCode: 200,
      body: {
        authenticated: true,
        user: {
          id: 'guest-user',
          name: 'Guest',
          role: 'guest',
          isGuest: true
        }
      }
    });
  }).as('authRequest');
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
