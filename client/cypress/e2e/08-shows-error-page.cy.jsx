describe("The error page", () => {
  it("shows a 404 page for an unknown url and returns home", () => {
    cy.visit("/this-route-does-not-exist");

    cy.contains("404 Page Not Found").should("exist");
    cy.get("h1").should("have.length", 1);

    cy.contains("a", "Home").click();
    cy.get("input[name='password']").should("exist");
  });
});
