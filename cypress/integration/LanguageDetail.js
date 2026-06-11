// LanguageDetail.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('LanguageDetail Component', () => {
  beforeEach(() => {
    // Visit the application before each test
    cy.visit('http://localhost:3000/variamos_languages');
  });

  describe('Navigation to Language Detail', () => {
    it('should navigate to language detail page when a language is selected', () => {
      // Click on public languages
      cy.contains('publicLanguages').click();
      // Click on a specific language
      cy.contains('Adaptive AML').click();
      // Verify we're on the detail page
      cy.url().should('include', '/variamos_languages');
    });
  });

  describe('UI Elements', () => {
    beforeEach(() => {
      cy.contains('publicLanguages').click();
      cy.contains('Adaptive AML').click();
    });

    it('should display action buttons', () => {
      cy.contains('Cancel').should('be.visible');
      cy.contains('Save').should('be.visible');
    });

    it('should display tabs', () => {
      cy.contains('Information').should('be.visible');
      cy.contains('Syntax').should('be.visible');
      cy.contains('Semantics').should('be.visible');
      cy.contains('Comments').should('be.visible');
    });

    it('should display form fields in Information tab', () => {
      cy.contains('Name').should('be.visible');
      cy.contains('Status').should('be.visible');
    });
  });

  describe('Tab Navigation', () => {
    beforeEach(() => {
      cy.contains('publicLanguages').click();
      cy.contains('Adaptive AML').click();
    });

    it('should switch between tabs', () => {
      // Click on Syntax tab
      cy.contains('Syntax').click();
      cy.contains('Syntax').should('have.class', 'active');

      // Click on Semantics tab
      cy.contains('Semantics').click();
      cy.contains('Semantics').should('have.class', 'active');

      // Click on Comments tab
      cy.contains('Comments').click();
      cy.contains('Comments').should('have.class', 'active');

      // Click back to Information tab
      cy.contains('Information').click();
      cy.contains('Information').should('have.class', 'active');
    });
  });

  describe('Form Interactions', () => {
    beforeEach(() => {
      cy.contains('publicLanguages').click();
      cy.contains('Adaptive AML').click();
    });

    it('should allow editing language name', () => {
      cy.get('input[aria-label="Default"]').first().clear().type('Test Language Name');
      cy.get('input[aria-label="Default"]').first().should('have.value', 'Test Language Name');
    });

    it('should allow changing language type', () => {
      cy.get('select[aria-label="Default"]').first().select('Domain');
      cy.get('select[aria-label="Default"]').first().should('have.value', 'Domain');
    });
  });

  describe('Cancel Button', () => {
    beforeEach(() => {
      cy.contains('publicLanguages').click();
      cy.contains('Adaptive AML').click();
    });

    it('should show confirmation modal when cancel is clicked', () => {
      cy.contains('Cancel').click();
      // Check for confirmation modal
      cy.contains('Are you sure').should('be.visible');
    });
  });

  describe('Syntax Tab', () => {
    beforeEach(() => {
      cy.contains('publicLanguages').click();
      cy.contains('Adaptive AML').click();
      cy.contains('Syntax').click();
    });

    it('should display syntax mode buttons', () => {
      cy.contains('Textual').should('be.visible');
      cy.contains('Graphical').should('be.visible');
    });
  });

  describe('Comments Tab', () => {
    beforeEach(() => {
      cy.contains('publicLanguages').click();
      cy.contains('Adaptive AML').click();
      cy.contains('Comments').click();
    });

    it('should display comment form', () => {
      cy.contains('New comment').should('be.visible');
      cy.contains('Add Comment').should('be.visible');
    });

    it('should show message when no review is active', () => {
      cy.contains('Create a new review').should('be.visible');
    });
  });
});
