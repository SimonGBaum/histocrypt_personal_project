describe("Registration", () => {
  it("creates an account and returns to the login form", () => {
    const username = "cytest_" + Date.now();

    cy.visit("/");
    cy.contains("button", "Do not have an account").click();

    cy.get("input[name='first_name']").type("Cypress");
    cy.get("input[name='last_name']").type("Tester");
    cy.get("input[name='username']").type(username);
    cy.get("input[name='email']").type(username + "@test.com");
    cy.get("input[name='password']").type("HistoCrypt2026");

    cy.get("button[type='submit']").click();

    cy.get("button[type='submit']").should("contain.text", "Log In");
  });
});
