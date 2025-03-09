describe("Profile Modal - Core Functionality", () => {
  beforeEach(() => {
    // Log all GET requests to debug
    cy.intercept("GET", "*", (req) => {
      console.log("GET request intercepted:", req.url);
    }).as("anyGetRequest");

    // Intercept dynamic fields API (mock response if it occurs)
    cy.intercept("GET", "http://43.204.236.103:8000/api/dynamic-fields/", {
      statusCode: 200,
      body: {
        profile_fields: [
          {
            id: 5,
            name: "Age",
            type: "integer",
            placeholder: "Enter your age",
            is_required: true,
            min_value: 1,
            max_value: 80,
            choices: null,
          },
          {
            id: 6,
            name: "Gender",
            type: "choice",
            placeholder: "Enter your Gender",
            is_required: true,
            choices: ["Male", "Female", "Others"],
          },
          {
            id: 9,
            name: "State",
            type: "choice",
            placeholder: "Enter your state of residence",
            is_required: true,
            choices: ["Karnataka", "Tamil Nadu", "Maharashtra"],
          },
          {
            id: 13,
            name: "Occupation",
            type: "choice",
            placeholder: null,
            is_required: false,
            choices: ["Employed", "Unemployed", "Student"],
          },
          {
            id: 14,
            name: "Income",
            type: "integer",
            placeholder: null,
            is_required: false,
            min_value: 1,
            max_value: 1200000,
            choices: null,
          },
        ],
      },
    }).as("getProfileFields");

    // Intercept login request
    cy.intercept("POST", "http://43.204.236.103:8000/api/login/", (req) => {
      console.log("Login request intercepted:", req);
    }).as("loginRequest");

    // Login process
    cy.visit("http://localhost:3000/login");
    cy.get("#email")
      .should("be.visible")
      .type("kolli.c23csai@nst.rishihood.edu.in");
    cy.get("#password").should("be.visible").type("kolli6505");
    cy.get('button[type="submit"]').should("be.visible").click();
    cy.log("Login form submitted");

    // Wait for login and stabilization
    cy.wait("@loginRequest", { timeout: 10000 })
      .its("response.statusCode")
      .should("eq", 200); // Wait for dashboard to settle

    // Open profile modal
    cy.get("button")
      .contains("Profile")
      .should("be.visible")
      .as("profileButton");
    cy.get("@profileButton").click();
    
    cy.get("@getProfileFields");
  });

  it("should login, open profile modal, fill and submit form, and confirm profile update", () => {
    // Fill in the form
    cy.get('input[name="age"]').should("be.visible").type("25");
    cy.get('select[name="gender"]').should("be.visible").select("Male");
    cy.get('select[name="state"]').should("be.visible").select("Karnataka");
    cy.get('select[name="occupation"]').should("be.visible").select("Employed");
    cy.get('input[name="income"]').should("be.visible").type("500000");

    // Intercept profile update request
    cy.intercept(
      "PUT",
      "http://43.204.236.103:8000/api/user/profile/",
      (req) => {
        console.log("Profile update request intercepted:", req);
      }
    ).as("updateProfile");

    // Save the modal
    cy.get("button").contains("Save").should("be.visible").click();

    // Verify profile update
    cy.wait("@updateProfile", { timeout: 10000 })
      .its("response.statusCode")
      .should("eq", 200);
    cy.get(".bg-[#3431BB]", { timeout: 10000 })
      .should("have.css", "width")
      .and("match", /66\.6667%/);
  });
});
