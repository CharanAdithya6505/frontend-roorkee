describe("Profile Modal Tests", () => {
    beforeEach(() => {
      cy.intercept("GET", "**/api/user/profile/", { fixture: "profile.json" }).as("getProfile");
      cy.intercept("PUT", "**/api/user/profile/", { statusCode: 200 }).as("saveProfile");
  
      cy.visit("/profile");
      cy.get('[data-testid="profile-modal"]').should("be.visible");
    });
  
    it("should allow editing the name field", () => {
      cy.get('[name="name"]').clear().type("New Name");
      cy.get('[name="name"]').should("have.value", "New Name");
    });
  
    it("should allow editing the email field", () => {
      cy.get('[name="email"]').clear().type("newemail@example.com");
      cy.get('[name="email"]').should("have.value", "newemail@example.com");
    });
  
    it("should allow selecting a choice field", () => {
      cy.get("select[name='education']").select("Bachelor's");
      cy.get("select[name='education']").should("have.value", "Bachelor's");
    });
  
    it("should display the correct progress percentage", () => {
      cy.get('[data-testid="profile-progress"]').invoke("text").then((text) => {
        expect(text).to.match(/\d+% completed/);
      });
    });
  
    it("should allow saving the profile with an updated email", () => {
      cy.get('[name="email"]').clear().type("updated@example.com");
      cy.get('[data-testid="save-button"]').click();
      cy.wait("@saveProfile").its("response.statusCode").should("eq", 200);
    });
  
    it("should close the modal when clicking outside", () => {
      cy.get("body").click(0, 0);
      cy.get('[data-testid="profile-modal"]').should("not.exist");
    });
  });
  