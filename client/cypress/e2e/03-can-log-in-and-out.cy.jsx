describe("The session", () => {
  it("logs in, reaches the home page, and logs out again", () => {
    cy.visit("/");

    cy.get("input[name='username']").type("simon");
    cy.get("input[name='password']").type("HistoCrypt2026");
    cy.get("button[type='submit']").click();

    cy.url().should("include", "/home");
    cy.contains("simon").should("exist");
    cy.contains("a", "Game").should("exist");

    cy.contains("button", "Log Out").click();

    cy.url().should("not.include", "/home");
    cy.get("input[name='password']").should("exist");
  });
});