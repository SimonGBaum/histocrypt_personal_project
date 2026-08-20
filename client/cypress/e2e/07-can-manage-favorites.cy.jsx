describe("Favorites", () => {
  it("lists favorites, searches them, and saves a note", () => {
    cy.visit("/");
    cy.get("input[name='username']").type("simon");
    cy.get("input[name='password']").type("HistoCrypt2026");
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/home");

    cy.contains("a", "User Area").click();
    cy.url().should("include", "/user");

    cy.contains("button", "Favorites").click();
    cy.get(".favorite-row", { timeout: 10000 }).should("have.length.greaterThan", 0);

    cy.get("input[placeholder='Find']").type("the");
    cy.contains("button", "Search").click();

    cy.contains("button", "Clear").click();

    cy.get(".favorite-row").first().contains("button", "Comment").click();
    cy.get("textarea").type("Added by Cypress.");
    cy.get(".favorite-comment").contains("button", "Save").click();

    cy.contains("Added by Cypress.").should("exist");
  });
});
