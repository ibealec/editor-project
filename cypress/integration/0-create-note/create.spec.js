/// <reference types="cypress" />

describe('create notes', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('can toggle add note button', () => {
    cy.get('[data-test=toggle-add-button]').click();

    cy.get('[data-test=create-note-input]').should('be.visible');

    cy.get('[data-test=toggle-add-button]').click();
  });

  it('can select different notes', () => {
    cy.contains('test').click();
    cy.location('pathname').should('contain', '/notes/');
  });

  it('can enter text', () => {
    cy.contains('test').click();
    cy.get('[data-test=editor]').type('hello');

    cy.should('contain.text', 'hello');
  });

  // it('can add note', () => {
  //   const newItem = 'Feed the cat';
  //   cy.get('[data-test=toggle-add-button]').click();

  //   cy.get('[data-test=create-note-input]').type(`${newItem}{enter}`);

  //   cy.get('[data-test=add-button]').click();

  //   cy.location('pathname').should('contain', '/notes/');
  // });
});
