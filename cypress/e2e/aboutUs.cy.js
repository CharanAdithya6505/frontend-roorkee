describe('About Us Page', () => {
    beforeEach(() => {
      cy.visit('/AboutUs');
    });
  
    it('should load the About Us page with correct title', () => {
      cy.get('h1').contains('About Us').should('be.visible');
    });
  
    it('should display the mission statement', () => {
      cy.get('p').contains('bridging the information gap and promoting equal opportunities').should('be.visible');
    });
  
    it('should display the "Why Choose Us?" section with all key points', () => {
      cy.get('h2').contains('Why Choose Us?').should('be.visible');
      
      const features = [
        'Comprehensive Resources',
        'User-Friendly Interface',
        'Regular Updates',
        'Accessible Anytime, Anywhere'
      ];
      
      features.forEach(feature => {
        cy.get('h3').contains(feature).should('be.visible');
      });
    });
  
    it('should have a functional navbar and footer', () => {
      cy.get('nav').should('be.visible');
      cy.get('footer').should('be.visible');
    });
  });
  