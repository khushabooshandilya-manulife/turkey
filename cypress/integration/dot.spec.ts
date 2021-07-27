import {
  dot_mode_coordinates,
  dot_mode_coordinates_2,
  waiting_time,
} from "../fixtures/constants";
import { testReposition, testReset } from "../support/shared_tests";

describe("Dot annotation mode", () => {
  before(() => {
    cy.visit("/localDemo");
    cy.wait(waiting_time.page_ready);
    cy.matchImageSnapshot("original_state");
  });

  testReposition();

  it("by default selects dot mode", () => {
    cy.getById("mode_button").should("have.value", "Mode: Dot");
  });

  describe("buttons", () => {
    beforeEach(() => {
      cy.visit("/localDemo");
      cy.wait(waiting_time.page_ready);
      dot_mode_coordinates.forEach((coordinate) => {
        cy.get("canvas").click(coordinate.x, coordinate.y);
      });
    });

    it("can change class", () => {
      cy.getById("label_class").select("class1");
      dot_mode_coordinates_2.forEach((coordinate) => {
        cy.get("canvas").click(coordinate.x, coordinate.y);
      });
      cy.get("canvas").matchImageSnapshot("multi_class");
    });

    it("allows annotation", () => {
      cy.get("canvas").matchImageSnapshot("3_dots");
    });

    describe("undo", () => {
      it("can undo by clicking the button", () => {
        cy.getById("undo_button").click();
        cy.get("canvas").matchImageSnapshot("2_dots");
      });

      it("can undo by keyboard shortcut", () => {
        cy.get("body").type("{ctrl}z");
        cy.get("canvas").matchImageSnapshot("2_dots");
      });
    });

    describe("delete", () => {
      it("can delete by clicking the button", () => {
        cy.getById("delete_button").click();
        cy.get("canvas").click(
          dot_mode_coordinates[2].x,
          dot_mode_coordinates[2].y
        );
        cy.getById("annotate_button").click();
        cy.get("canvas").matchImageSnapshot("2_dots");
      });

      it("can delete by keyboard shortcut", () => {
        cy.get("body").type("d");
        cy.get("canvas").click(
          dot_mode_coordinates[2].x,
          dot_mode_coordinates[2].y
        );
        cy.get("body").type("d");
        cy.get("canvas").matchImageSnapshot("2_dots");
      });
    });

    testReset();
  });
});
