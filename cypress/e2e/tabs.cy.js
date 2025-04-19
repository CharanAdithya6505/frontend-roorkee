describe('AllSchemes Page - Tabs Navigation', () => {
  // Mock data for layout items API
  const mockLayoutItems = [
    { id: 1, column_name: 'schemes', order: 1 },
    { id: 2, column_name: 'jobs', order: 2 },
    { id: 3, column_name: 'scholarships', order: 3 },
    { id: 4, column_name: 'courses', order: 4 }
  ];

  beforeEach(() => {
        // Intercept API request for layout items
    cy.intercept('GET', '**/api/layout-items/**', {
      statusCode: 200,
      body: mockLayoutItems
    }).as('getLayoutItems');
        // Visit the page
        cy.visit('/AllSchemes');
    
        // Wait for the layout items API call
        cy.wait('@getLayoutItems');
  });

  it('should render tabs in the correct order from API response', () => {
    // Get all tab elements
    cy.get('.sm\\.flex button').should('have.length.at.least', mockLayoutItems.length);
    
    // Check that tabs are rendered in the correct order
    mockLayoutItems.forEach((item, index) => {
      cy.get('.sm\\.flex button')
        .eq(index)
        .should('contain.text', item.column_name.charAt(0).toUpperCase() + item.column_name.slice(1));
    });
    
    // Verify the first tab is active by default (has the active styling class)
    cy.get('.sm\\.flex button')
      .first()
      .should('have.class', 'bg-[#EEEEFF]')
      .should('have.class', 'border-[#3431BB]')
      .should('contain.text', mockLayoutItems[0].column_name.charAt(0).toUpperCase() + mockLayoutItems[0].column_name.slice(1));
    
    // Verify that the URL reflects the default tab
    cy.url().should('include', `?tab=${mockLayoutItems[0].column_name}`)
  });

  it('should display all tabs and make them active when clicked', () => {
    // Verify all tabs from the API are visible in the UI
    cy.get('.sm\\.flex button').should('have.length.at.least', mockLayoutItems.length);
    
    // Iterate through each tab and verify clickability
    mockLayoutItems.forEach((item, index) => {
      // Click on the tab
      cy.get('.sm\\.flex button')
        .eq(index)
        .click();
      
      // Verify the tab becomes active (has active styling classes)
      cy.get('.sm\\.flex button')
        .eq(index)
        .should('have.class', 'bg-[#EEEEFF]')
        .should('have.class', 'border-[#3431BB]');
      
      // Verify other tabs are not active
      mockLayoutItems.forEach((_, otherIndex) => {
        if (otherIndex !== index) {
          cy.get('.sm\\.flex button')
            .eq(otherIndex)
            .should('not.have.class', 'bg-[#EEEEFF]');
        }
      });
      
      // Verify URL parameter reflects the active tab
      cy.url().should('include', `?tab=${item.column_name}`)
      
      // Verify that content exists (we'll check specific content in another test)
      cy.get('div').should('exist');
    });
  });
  
  it('should apply distinct styling to active tab and default styling to inactive tabs', () => {
    // Get all tab elements to identify active and inactive ones
    cy.get('.sm\\.flex button').should('have.length.at.least', mockLayoutItems.length);
    
    // First tab should be active by default, check its styling
    cy.get('.sm\\.flex button')
      .first()
      .should('have.class', 'bg-[#EEEEFF]')
      .should('have.class', 'border-b-[3px]')
      .should('have.class', 'border-[#3431BB]');
    
    // Check that inactive tabs have default styling (should have hover classes instead of active)
    cy.get('.sm\\.flex button')
      .eq(1) // Check the second tab, which should be inactive
      .should('not.have.class', 'bg-[#EEEEFF]')
      .should('have.class', 'hover:bg-[#EEEEFF]')
      .should('have.class', 'hover:border-b-[3px]')
      .should('have.class', 'hover:border-[#3431BB]');
    
    // Click on the second tab to make it active
    cy.get('.sm\\.flex button')
      .eq(1)
      .click();
    
    // Verify that the second tab now has active styling
    cy.get('.sm\\.flex button')
      .eq(1)
      .should('have.class', 'bg-[#EEEEFF]')
      .should('have.class', 'border-b-[3px]')
      .should('have.class', 'border-[#3431BB]');
    
    // Verify that the first tab now has inactive styling
    cy.get('.sm\\.flex button')
      .eq(0)
      .should('not.have.class', 'bg-[#EEEEFF]')
      .should('have.class', 'hover:bg-[#EEEEFF]')
      .should('have.class', 'hover:border-b-[3px]')
      .should('have.class', 'hover:border-[#3431BB]');
    
    // Click on another tab to ensure styling changes apply consistently
    cy.get('.sm\\.flex button')
      .eq(2)
      .click();
    
    // Verify the newly active tab has active styling
    cy.get('.sm\\.flex button')
      .eq(2)
      .should('have.class', 'bg-[#EEEEFF]')
      .should('have.class', 'border-b-[3px]')
      .should('have.class', 'border-[#3431BB]');
    
    // Verify all other tabs have inactive styling
    cy.get('.sm\\.flex button').each(($tab, index) => {
      if (index !== 2) {
        cy.wrap($tab)
          .should('not.have.class', 'bg-[#EEEEFF]')
          .should('have.class', 'hover:bg-[#EEEEFF]');
      }
    });
  });
  
  it('should update URL when clicking tabs and persist active tab after page reload', () => {
    // Click on the second tab
    cy.get('.sm\\.flex button')
      .eq(1)
      .click();
    
    // Verify URL contains correct query parameter
    cy.url().should('include', `?tab=${mockLayoutItems[1].column_name}`);
    
    // Reload the page
    cy.reload();
    
    // Wait for the layout items API call to complete after reload
    cy.wait('@getLayoutItems');
    
    // Verify query parameter persists after reload
    cy.url().should('include', `?tab=${mockLayoutItems[1].column_name}`);
    
    // Verify the second tab is still active after reload
    cy.get('.sm\\.flex button')
      .eq(1)
      .should('have.class', 'bg-[#EEEEFF]')
      .should('have.class', 'border-[#3431BB]');
    
    // Click on the third tab
    cy.get('.sm\\.flex button')
      .eq(2)
      .click();
    
    // Verify URL contains correct query parameter
    cy.url().should('include', `?tab=${mockLayoutItems[2].column_name}`);
    
    // Reload the page again
    cy.reload();
    
    // Wait for the layout items API call to complete after reload
    cy.wait('@getLayoutItems');
    
    // Verify query parameter persistence after second reload
    cy.url().should('include', `?tab=${mockLayoutItems[2].column_name}`);
    
    // Verify the third tab is still active
    cy.get('.sm\\.flex button')
      .eq(2)
      .should('have.class', 'bg-[#EEEEFF]')
      .should('have.class', 'border-[#3431BB]');
  });

  it('should display the correct content when switching between tabs', () => {
    // Define expected content identifiers for each tab based on the components
    // from renderTabContent() in the Tabs component
    const tabContentMap = [
      { column_name: 'schemes', componentClass: '.schemes-component' },
      { column_name: 'jobs', componentClass: '.job-openings-component' },
      { column_name: 'scholarships', componentClass: '.scholarships-component' }
    ];
    
    // Intercept API requests that each tab component might make
    cy.intercept('**/api/schemes/**', { body: [] }).as('schemesApi');
    cy.intercept('**/api/jobs/**', { body: [] }).as('jobsApi');
    cy.intercept('**/api/scholarships/**', { body: [] }).as('scholarshipsApi');
    
    // First tab (schemes) should be active by default
    cy.get('.sm\\.flex button')
      .first()
      .should('have.class', 'bg-[#EEEEFF]');
    
    // Verify Schemes component exists (even if empty)
    cy.get('.schemes-filter-wrapper').should('exist');
    
    // Click through each tab and verify content updates
    tabContentMap.forEach((tabInfo, index) => {
      // Skip first tab in the first iteration as it's already active by default
      if (index === 0) return;
      
      // Click the tab
      cy.get('.sm\\.flex button')
        .eq(index)
        .click();
      
      // Verify URL contains the tab's column_name
      cy.url().should('include', `?tab=${tabInfo.column_name}`);
      
      // Verify specific components are rendered based on the tab
      // These selectors should be updated to match the actual components
      if (tabInfo.column_name === 'jobs') {
        // Job Openings component
        cy.get('.search-jobs-wrapper').should('exist');
      } else if (tabInfo.column_name === 'scholarships') {
        // Scholarships component
        cy.get('.scholarship-filter-wrapper').should('exist');
      }
    });
    
    // Go back to first tab (schemes) and verify content updates
    cy.get('.sm\\.flex button')
      .first()
      .click();
    
    // Verify URL contains the schemes tab
    cy.url().should('include', '?tab=schemes');
    
    // Verify Schemes component is visible again
    cy.get('.schemes-filter-wrapper').should('exist');
  });

  it('should handle responsive layouts correctly', () => {
    // Test mobile view
    cy.viewport(375, 667);
    
    // Verify mobile layout classes
    cy.get('.sm\\.flex').should('not.be.visible');
    cy.get('hr.sm\\:hidden').should('be.visible');
    
    // Test desktop view
    cy.viewport(1024, 768);
    
    // Verify desktop layout classes
    cy.get('.sm\\.flex').should('be.visible');
    cy.get('.sm\\.flex').should('have.class', 'justify-center');
    cy.get('.sm\\.flex').should('have.class', 'items-center');
    cy.get('hr.sm\\:hidden').should('not.be.visible');
    
    // Verify tab functionality in desktop view
    cy.get('.sm\\.flex button').each(($button, index) => {
      if (index < mockLayoutItems.length) {
        // Click each tab
        cy.wrap($button).click();
        
        // Verify active state
        cy.wrap($button)
          .should('have.class', 'bg-[#EEEEFF]')
          .should('have.class', 'border-[#3431BB]');
          
        // Verify URL updates
        cy.url().should('include', `?tab=${mockLayoutItems[index].column_name}`);
      }
    });
  });
});



