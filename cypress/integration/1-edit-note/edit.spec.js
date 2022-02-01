/// <reference types="cypress" />

describe('edit notes', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:3000/notes/aee09178-4c18-46a1-b0c0-a8bdfbb07d43'
    );
  });

  it('can add bold text', () => {
    cy.get('[data-test=editor]').type('{cmd}+b');
    cy.get('[data-test=editor]').type('hello');

    cy.get('[data-test=editor]').should(
      'contain.html',
      '<strong><span data-slate-string="true">hello'
    );
  });

  it('can add italic text', () => {
    cy.get('[data-test=editor]').type('{cmd}i');
    cy.get('[data-test=editor]').type('italic');

    cy.get('[data-test=editor]').should(
      'contain.html',
      '<em><span data-slate-string="true">italic'
    );
  });
});
