describe("Scheme Modal Tests", () => {
  beforeEach(() => {
    cy.intercept("GET", "*", (req) => {
      console.log("GET request intercepted:", req.url);
    }).as("anyGetRequest");

    cy.intercept("POST", "http://43.204.236.103:8000/api/login/", (req) => {
      console.log("Login request intercepted:", req);
    }).as("loginRequest");

    cy.visit("http://localhost:3000/login");
    cy.get("#email")
      .should("be.visible")
      .type("kolli.c23csai@nst.rishihood.edu.in");
    cy.get("#password").should("be.visible").type("kolli6505");
    cy.get('button[type="submit"]').should("be.visible").click();
    cy.log("Login form submitted");

    cy.wait("@loginRequest", { timeout: 10000 })
      .its("response.statusCode")
      .should("eq", 200);
  });

  it("Should open the Scheme Modal when clicking on a scheme card", () => {
    cy.intercept("POST", "**/api/schemes/**").as("fetchSchemes");

    cy.wait("@fetchSchemes", { timeout: 15000 });

  });
});
