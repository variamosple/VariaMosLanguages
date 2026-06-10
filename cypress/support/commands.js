// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to mock guest user session
Cypress.Commands.add('mockGuestSession', () => {
  cy.window().then((win) => {
    // Mock the session context that useSession() expects
    const mockUser = {
      id: 'guest-user',
      name: 'Guest',
      email: 'guest@example.com',
      roles: ['guest'],
      isGuest: true
    };
    
    // Store mock user in window for the session provider
    win.mockUser = mockUser;
    
    // Also set in localStorage as backup
    win.localStorage.setItem('mockUser', JSON.stringify(mockUser));
  });
});

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
