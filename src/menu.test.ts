import { describe, expect, it } from "vitest";
import { addItem, decrementItem, EMPTY_CART, filterByTags, formatPrice, itemCount, MENU, priceOf, totals } from "./menu";

describe("cart", () => {
  it("adds items and keeps a running subtotal", () => {
    let cart = addItem(EMPTY_CART, "flat-white");
    cart = addItem(cart, "flat-white");
    cart = addItem(cart, "croissant");
    expect(cart.lines).toEqual([{ id: "flat-white", qty: 2 }, { id: "croissant", qty: 1 }]);
    expect(cart.subtotal).toBe(priceOf("flat-white") * 2 + priceOf("croissant"));
    expect(itemCount(cart)).toBe(3);
  });

  it("decrements, dropping the line at zero", () => {
    let cart = addItem(addItem(EMPTY_CART, "chai"), "chai");
    cart = decrementItem(cart, "chai");
    expect(cart.lines).toEqual([{ id: "chai", qty: 1 }]);
    cart = decrementItem(cart, "chai");
    expect(cart.lines).toEqual([]);
    expect(cart.subtotal).toBe(0);
  });

  it("adds tax to the total", () => {
    const t = totals(addItem(EMPTY_CART, "oat-latte"));
    expect(t).toEqual({ subtotal: 500, tax: 40, total: 540 });
    expect(formatPrice(t.total)).toBe("$5.40");
  });
});

describe("dietary filters", () => {
  it("keeps only items with every selected tag", () => {
    expect(filterByTags(MENU, [])).toHaveLength(MENU.length);
    expect(filterByTags(MENU, ["vegan"]).map((m) => m.id)).toEqual(["oat-latte", "cold-brew", "chai", "banana-bread"]);
    expect(filterByTags(MENU, ["vegan", "gluten-free"]).map((m) => m.id)).toEqual(["oat-latte", "cold-brew", "chai"]);
  });
});
