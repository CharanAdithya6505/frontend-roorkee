describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('/login')
    // Clear local storage before each test
    cy.clearLocalStorage()
  });

// Tests to check all the UI Elements exists and toggle password visibility
  describe('UI Elements', () => {
    it('should display all required elements', () => {
      cy.get('input[type="email"]').should('exist')
      cy.get('input[type="password"]').should('exist')
      cy.contains('button', 'Continue').should('exist')
      cy.contains('Forgot password?').should('exist')
      cy.contains('Create new account').should('exist')
      cy.get('svg').should('exist') // Logo should be present
      cy.contains('button', 'Back').should('exist')
    });

    it('should toggle password visibility', () => {
      cy.get('input#password').should('have.attr', 'type', 'password');
      cy.get('[data-testid="toggle-password-visibility"]').click();
      cy.get('input#password').should('have.attr', 'type', 'text');
      cy.get('[data-testid="toggle-password-visibility"]').click();
      cy.get('input#password').should('have.attr', 'type', 'password');
    });    
  });

//Tests all the Navigation from login page
  describe('Navigation', () => {
    it('should navigate to signup page', () => {
      cy.contains('Create new account').click()
      cy.url().should('include', '/Signup')
    });

    it('should navigate to forgot password page', () => {
      cy.contains('Forgot password?').click()
      cy.url().should('include', '/ResetEmailPassword')
    });

    it('should navigate back when clicking back button', () => {
      cy.contains('button', 'Back').click()
      cy.url().should('not.include', '/login')
    }); 
  });
//Tests for Validation of empty fields and email format
  describe('Form Validation', () => {
    it('should show validation for empty fields', () => {
      cy.contains('button', 'Continue').click()
      cy.get('form').should('exist')
      cy.get('[data-testid="email-error"]').should('exist')
      cy.get('[data-testid="password-error"]').should('exist')
      // Verify no POST request was made
      cy.intercept('POST', `${Cypress.env('apiUrl')}/api/login`).as('loginRequest');
      cy.wait(2000); 
      cy.get('@loginRequest.all').should('have.length', 0); 
      
    });

    it('should validate email format', () => {
      cy.get('input[type="email"]').type('invalid-email')
      cy.contains('button', 'Continue').click()
      cy.get('[data-testid="email-error"]').should('exist')
    });
     
  });
// Tests for checking login feature 
  describe('API Integration', () => {
    it('should successfully log in with valid credentials', () => {
      const validEmail = 'test@example.com'
      const validPassword = 'password1231'

      cy.intercept('POST', `${Cypress.env('apiUrl')}/api/login/`, {
        statusCode: 200,
        body: {
          access: 'fake-jwt-token'
        }
      }).as('loginRequest')

      cy.get('input[type="email"]').type(validEmail)
      cy.get('input[type="password"]').type(validPassword)
      cy.contains('button', 'Continue').click()

      cy.wait('@loginRequest').then((interception) => {
        expect(interception.request.body).to.deep.equal({
          email: validEmail.toLowerCase(),
          password: validPassword
        })
      })

      // Should redirect to Home page
      cy.url().should('include', '/')
    });

    it('should handle login failure', () => {
      cy.intercept('POST', `${Cypress.env('apiUrl')}/api/login/`, {
        statusCode: 401,
        body: {
          message: 'Email or password is invalid'
        }
      }).as('loginFailure')

      cy.get('input[type="email"]').type('wrong@email.com')
      cy.get('input[type="password"]').type('wrongpassword')
      cy.contains('button', 'Continue').click()

      cy.wait('@loginFailure')
      cy.get('[data-test-id="login-error"]').should('exist')
    });

    it('should show loading state during API call', () => {
      cy.intercept('POST', `${Cypress.env('apiUrl')}/api/login/`, {
        delay: 1000,
        statusCode: 200,
        body: {
          access: 'fake-jwt-token'
        }
      }).as('delayedLogin')

      cy.get('input[type="email"]').type('test@example.com')
      cy.get('input[type="password"]').type('password123')
      cy.contains('button', 'Continue').click()

      cy.contains('Loading...').should('be.visible')
      cy.get('.animate-spin').should('be.visible')
    });
  });
// Test when loggined user hits login page 
  describe('Authentication State', () => {
    it('should redirect to Home Page if already authenticated', () => {
      // Set up authenticated state
      localStorage.setItem('token', 'fake-jwt-token')
      cy.visit('/login')
      cy.url().should('include', '/')
    });
  });

// Tests responsive design 
  describe('Responsive Design', () => {
    it('should display correctly on mobile viewport', () => {
      cy.viewport('iphone-x')
      cy.get('.flex').should('be.visible')
    });

    it('should display correctly on tablet viewport', () => {
      cy.viewport('ipad-2')
      cy.get('.flex').should('be.visible')
    });
    
    it("image should be visible on large screens", () => {
      cy.viewport(1200, 800); 
      cy.get('img[alt="Design Background"]').should("be.visible");
    });
 });
});