describe("The game board", () => {
  it("loads a puzzle and accepts a letter in the board", () => {
    cy.visit("/");
    cy.get("input[name='username']").type("simon");
    cy.get("input[name='password']").type("HistoCrypt2026");
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/home");

    cy.contains("a", "Game").click();
    cy.url().should("include", "/game");

    cy.get(".letter-box", { timeout: 15000 }).should("have.length.greaterThan", 0);

    cy.get(".letter-box").first().type("A");

    cy.get(".letter-box").first().should("have.value", "A");
  });
});
