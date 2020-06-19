describe('Cypress', () => {
  const randomEmail = Math.random().toString(32).slice(2) + '@mail.com';
  const randomPassword = Math.random().toString(32).slice(2);

  it('visits the register page', () => {
    cy.visit('http://localhost:8080/register');
  });
  it('accepts register form input', () => {
    cy.get('input[name=email]')
      .type(randomEmail)
      .should('have.value', randomEmail);

    cy.get('input[name=password]')
      .type(randomPassword)
      .should('have.value', randomPassword);
    cy.get('input[name=repeatPassword]')
      .type(randomPassword)
      .should('have.value', randomPassword);
  });
  it('click register form submit button', () => {
    cy.get('button[type=submit]').click();
    cy.wait(1000);
  });
  it('accepts login form input', () => {
    cy.get('input[name=email]')
      .type(randomEmail)
      .should('have.value', randomEmail);

    cy.get('input[name=password]')
      .type(randomPassword)
      .should('have.value', randomPassword);
  });
  it('click login form submit button', () => {
    cy.get('button[type=submit]').click();
    cy.wait(1000);
  });
  it('add todo', () => {
    for (let n = 0; n < 5; n++) {
      const randomText = Math.random().toString(32).slice(2);

      cy.get('.input-group input')
        .type(randomText)
        .should('have.value', randomText);

      cy.get('.input-group button').click();
      cy.wait(1000);
    }
  });
  it('remove todo', () => {
    for (let n = 0; n < 5; n++) {
      cy.get('.list-group .list-group-item .btn-danger').first().click();
      cy.wait(250);
    }
  });
  it('empty control', () => {
    cy.get('.list-group .list-group-item').its('length').should('eq', 1);
  });
});
