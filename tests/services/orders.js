const chai = require("chai");
const expect = chai.expect;
const ordersServices = require("../../services/orders");

describe("Orders Service", () => {
  describe("when the order is processed", () => {
    describe("and there is no conflict between customers", () => {
      before(() => {
        orders = [
          {
            customerName: "Customer1",
            items: [
              { id: "sourdough_round", type: "round", flavor: "sourdough" },
              { id: "sourdough_round", type: "pan", flavor: "banana" },
            ],
          },
          {
            customerName: "Customer2",
            items: [{ id: "banana_pan", type: "pan", flavor: "banana" }],
          },
        ];
      });
      it("should return the correct correct baking list", () => {
        const { itemIds } = ordersServices.process(orders);
        expect(itemIds).to.deep.equal(["sourdough_round", "banana_pan"]);
      });
    });
    describe("and there is a conflict in the same order", () => {
      before(() => {
        orders = [
          {
            customerName: "Customer1",
            items: [
              { id: "sourdough_pan", type: "pan", flavor: "sourdough" },
              { id: "sourdough_round", type: "round", flavor: "sourdough" },
            ],
          },
          {
            customerName: "Customer2",
            items: [{ id: "banana_pan", type: "pan", flavor: "banana" }],
          },
        ];
      });

      it("should throw an error with the customerName that are in conflict", () => {
        try {
          ordersServices.process(orders);
          throw new Error("Call not expected to succeed");
        } catch (error) {
          expect(error.conflictedCustomerNames).to.deep.equal(["Customer1"]);
        }
      });
    });
    describe("and there is a conflict", () => {
      describe("and it can be solved without optimization", () => {
        before(() => {
          orders = [
            {
              customerName: "Customer1",
              items: [
                { id: "sourdough_round", type: "round", flavor: "sourdough" },
              ],
            },
            {
              customerName: "Customer2",
              items: [
                { id: "banana_round", type: "round", flavor: "banana" },
                { id: "whole_grain_pan", type: "pan", flavor: "whole_grain" },
              ],
            },
            {
              customerName: "Customer3",
              items: [
                {
                  id: "whole_grain_round",
                  type: "round",
                  flavor: "whole_grain",
                },
                { id: "sourdough_pan", type: "pan", flavor: "sourdough" },
              ],
            },
          ];
        });
        it("should return the correct baking list", () => {
          const { itemIds } = ordersServices.process(orders);
          expect(itemIds).to.deep.equal([
            "sourdough_round",
            "banana_round",
            "whole_grain_round",
          ]);
        });
      });
      describe("and it can be solved with optimization", () => {
        before(() => {
          orders = [
            {
              customerName: "Customer1",
              items: [
                { id: "sourdough_round", type: "round", flavor: "sourdough" },
              ],
            },
            {
              customerName: "Customer2",
              items: [
                { id: "banana_round", type: "round", flavor: "banana" },
                {
                  id: "whole_grain_round",
                  type: "round",
                  flavor: "whole_grain",
                },
              ],
            },
            {
              customerName: "Customer3",
              items: [
                {
                  id: "whole_grain_pan",
                  type: "pan",
                  flavor: "whole_grain",
                },
                { id: "sourdough_pan", type: "pan", flavor: "sourdough" },
              ],
            },
          ];
        });
        it("should return the correct baking list", () => {
          const { itemIds } = ordersServices.process(orders);
          expect(itemIds).to.deep.equal([
            "sourdough_round",
            "banana_round",
            "whole_grain_pan",
          ]);
        });
      });
      describe("and it can be solved", () => {
        before(() => {
          orders = [
            {
              customerName: "Customer1",
              items: [
                { id: "sourdough_pan", type: "pan", flavor: "sourdough" },
              ],
            },
            {
              customerName: "Customer2",
              items: [{ id: "banana_round", type: "round", flavor: "banana" }],
            },
            {
              customerName: "Customer3",
              items: [
                {
                  id: "whole_grain_round",
                  type: "round",
                  flavor: "whole_grain",
                },
                { id: "sourdough_round", type: "round", flavor: "sourdough" },
              ],
            },
          ];
        });
        it("should return the correct baking list", () => {
          const { itemIds } = ordersServices.process(orders);
          expect(itemIds).to.deep.equal([
            "sourdough_pan",
            "banana_round",
            "whole_grain_round",
          ]);
        });
      });
      describe("and it can be solved and optimize", () => {
        before(() => {
          orders = [
            {
              customerName: "Customer1",
              items: [
                { id: "sourdough_pan", type: "pan", flavor: "sourdough" },
              ],
            },
            {
              customerName: "Customer2",
              items: [
                { id: "banana_round", type: "round", flavor: "banana" },
                { id: "sourdough_round", type: "round", flavor: "sourdough" },
              ],
            },
          ];
        });
        it("should return the correct baking list", () => {
          const { itemIds } = ordersServices.process(orders);
          expect(itemIds).to.deep.equal(["sourdough_pan", "banana_round"]);
        });
      });
      describe("and it cannot be solved", () => {
        before(() => {
          orders = [
            {
              customerName: "Customer1",
              items: [
                { id: "sourdough_round", type: "round", flavor: "sourdough" },
              ],
            },
            {
              customerName: "Customer2",
              items: [
                { id: "sourdough_pad", type: "pan", flavor: "sourdough" },
              ],
            },
          ];
        });
        it("should throw an error with customesNames that are in conflict", () => {
          try {
            ordersServices.process(orders);
            throw new Error("Call not expected to succeed");
          } catch (error) {
            expect(error.conflictedCustomerNames).to.deep.equal([
              "Customer1",
              "Customer2",
            ]);
          }
        });
      });
    });
  });
});
