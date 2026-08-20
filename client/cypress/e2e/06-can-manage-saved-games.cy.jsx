describe("Saved games", () => {
  it("saves a game, lists it, and deletes it", () => {
    cy.visit("/");
    cy.get("input[name='username']").type("simon");
    cy.get("input[name='password']").type("HistoCrypt2026");
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/home");

    cy.contains("a", "Game").click();
    cy.get(".letter-box", { timeout: 15000 }).should("have.length.greaterThan", 0);

    cy.contains("button", "Game Options").click();
    cy.contains("button", "Save").click();

    cy.contains("a", "Saved Games").click();
    cy.url().should("include", "/game/saved");

    cy.get(".saved-row", { timeout: 10000 }).should("have.length.greaterThan", 0);

    cy.get(".saved-row").first().contains("button", "Delete").click();
  });
});
