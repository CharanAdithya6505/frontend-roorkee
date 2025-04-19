describe("Resources Page", () => {
    beforeEach(() => {
        cy.intercept("GET", "**/api/states/").as("getStates");
        cy.intercept("GET", "**/api/schemes/resources/state/*").as("getStateResources");
      cy.visit("/Resources");
    });
  
    it("should load the page with default elements", () => {
      cy.contains("Resources").should("exist");
      cy.contains("Select a State").should("exist");
      cy.get("button").contains("Back").should("exist");
    });
  
    it("should display the state dropdown when clicked", () => {
      cy.get("button").contains("Select a State").click();
      cy.wait("@getStates");
      cy.get(".absolute.w-full.mt-1.bg-white").should("exist");
    });
  
    it("should select a state and fetch resources", () => {
      cy.get("button").contains("Select a State").click();
      cy.wait("@getStates");
      cy.get(".absolute.w-full.mt-1.bg-white div").first().click();
      cy.wait("@getStateResources");
      cy.get("h2").contains("Resources Links").should("exist");
    });
  
    it("should display resource links when a state is selected", () => {
      cy.get("button").contains("Select a State").click();
      cy.wait("@getStates");
      cy.get(".absolute.w-full.mt-1.bg-white div").first().click();
      cy.wait("@getStateResources");
      cy.get("ol.list-decimal li").should("have.length.above", 0);
    });
  
    it("should navigate back when clicking the back button", () => {
      cy.get("button").contains("Back").click();
      cy.url().should("not.include", "/resources");
    });
  });
  