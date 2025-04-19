describe("Filters Component", () => {
    beforeEach(() => {
      cy.visit("/AllSchemes"); 
    });
  
    // Rendering Tests
    it("should render the 'Filters' title", () => {
      cy.contains("Filters").should("be.visible");
    });
  
    it("should display the 'Clear all filters' button", () => {
      cy.get("button").contains("Clear all filters").should("be.visible");
    });
  
    it("should initially hide dropdowns for 'Sponsored By,' 'Department,' and 'Beneficiaries'", () => {
      cy.get("[data-testid=sponsored-dropdown]").should("not.exist");
      cy.get("[data-testid=department-dropdown]").should("not.exist");
      cy.get("[data-testid=beneficiaries-dropdown]").should("not.exist");
    });
  
    // Dropdown Interactions
    it("should toggle 'Sponsored By' dropdown when clicked", () => {
      cy.get("[data-testid=sponsored-button]").click();
      cy.get("[data-testid=sponsored-dropdown]").should("be.visible");
  
      cy.get("[data-testid=sponsored-button]").click();
      cy.get("[data-testid=sponsored-dropdown]").should("not.exist");
    });
  
    it("should toggle 'Department' dropdown only if isDepartmentVisible is true", () => {
      cy.get("[data-testid=sponsored-button]").click();
      cy.get("[data-testid=sponsored-option]").first().click();
      // need to select state or central option for department to be visible 
      cy.get("[data-testid=department-button]").click();
      cy.get("[data-testid=department-dropdown]").should("be.visible");
    });
  
    it("should toggle 'Beneficiaries' dropdown only if isBeneficiaryVisible is true", () => {
      cy.get("[data-testid=sponsored-button]").click();
      cy.get("[data-testid=sponsored-option]").first().click();
      // need to select state or central option for beneficiary to be visible 
      cy.get("[data-testid=beneficiaries-button]").click();
      cy.get("[data-testid=beneficiaries-dropdown]").should("be.visible");
    });
  
    // Clearing Filters
    it("should reset all selected filters when clicking 'Clear all filters'", () => {
      cy.get("[data-testid=sponsored-button]").click();
      cy.get("[data-testid=sponsored-dropdown]").should("be.visible");
      cy.get("[data-testid=sponsored-option]").first().click();
      cy.get("[data-testid=selected-filter]").should("exist");
  
      cy.get("button").contains("Clear all filters").click();
      cy.get("[data-testid=selected-filter]").should("not.exist");
    });
  
    it("should hide all filter buttons after clearing filters", () => {
      cy.get("button").contains("Clear all filters").click();
      cy.get("[data-testid=selected-filter]").should("not.exist");
    });
  
    // Selected Filters Display
    it("should display selected filters under 'Selected Filters'", () => {
      cy.get("[data-testid=sponsored-button]").click();
      cy.get("[data-testid=sponsored-dropdown]").should("be.visible");
      cy.get("[data-testid=sponsored-option]").first().click();
      cy.get("[data-testid=selected-filter]").should("exist");
    });
  
    it("should remove a filter when clicking '✕' next to it", () => {
      cy.get("[data-testid=sponsored-button]").click();
      cy.get("[data-testid=sponsored-dropdown]").should("be.visible");
      cy.get("[data-testid=sponsored-option]").first().click();
      cy.get("[data-testid=selected-filter]").should("exist");
  
      cy.get("[data-testid=remove-filter]").first().click();
      cy.get("[data-testid=selected-filter]").should("not.exist");
    });
  
    // Show More / Show Less
    it("should show 'Show All' if more than 3 filters are applied", () => {
      cy.get("[data-testid=sponsored-button]").click();
      cy.get("[data-testid=sponsored-dropdown]").should("be.visible");
      for (let i = 0; i < 7; i++) {
        cy.get("[data-testid=sponsored-option]").eq(i).click();
      }
      cy.get("button").contains("Show All").should("be.visible");
    });
  
    it("should expand to show all filters when 'Show All' is clicked", () => {
      cy.get("button").contains("Show All").click();
      cy.get("[data-testid=selected-filter]").should("have.length.greaterThan", 3);
    });
  
    it("should collapse filters when 'Show Less' is clicked", () => {
      cy.get("button").contains("Show Less").click();
      cy.get("[data-testid=selected-filter]").should("have.length", 3);
    });
  
    // Authentication-based Actions
    it("should redirect to login when unauthenticated user clicks 'Apply Default Filters'", () => {
      cy.clearCookies();
      cy.get("button").contains("Apply Default Filters").click();
      cy.url().should("include", "/login");
    });
  
    it("should apply preferences to selected filters when authenticated", () => {
      cy.login(); 
      cy.get("button").contains("Apply Default Filters").click();
      cy.get("[data-testid=selected-filter]").should("have.length.greaterThan", 0);
    });
  
    it("should remove preference-based filters when 'Apply Default Filters' is clicked again", () => {
      cy.get("button").contains("Apply Default Filters").click();
      cy.get("[data-testid=selected-filter]").should("not.exist");
    });
  });
  