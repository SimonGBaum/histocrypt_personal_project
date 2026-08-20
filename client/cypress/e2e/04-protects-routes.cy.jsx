describe("Protected routes", () => {
  it("sends a logged out visitor from the game page to the login page", () => {
    cy.visit("/game");

    cy.url().should("not.include", "/game");
    cy.get("input[name='password']").should("exist");
  });

  it("sends a logged out visitor from the user page to the login page", () => {
    cy.visit("/user");

    cy.url().should("not.include", "/user");
    cy.get("input[name='password']").should("exist");
  });
});