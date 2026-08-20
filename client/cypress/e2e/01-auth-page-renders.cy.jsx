describe("The auth page", () => {
  it("renders the HistoCrypt heading and the login form", () => {
    cy.visit("/");
    cy.get("h1").should("contain.text", "HistoCrypt");
    cy.get("input[name='username']").should("exist");
    cy.get("input[name='password']").should("exist");
    cy.get("button[type='submit']").should("contain.text", "Log In");
  });
});
