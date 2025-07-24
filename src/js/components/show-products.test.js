import { test, beforeEach } from "node:test";
import assert from "node:assert";
import { saveProduct } from "./add-product.js";
import { fetchFromLocalStorage, setToLocalStorage } from "../dom.js";

global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
};

beforeEach(() => {
  localStorage.clear();
});

test("saveProduct adds a product to localStorage", () => {
  const product = {
    id: "1",
    name: "Camera",
    price: "200",
    discount: "5",
    detail: "A nice camera",
    image: "image.png",
    category: "Electronics",
  };

  let productsBefore = fetchFromLocalStorage("products");
  assert.strictEqual(Array.isArray(productsBefore), true);
  assert.strictEqual(productsBefore.length, 0);

  saveProduct(product);

  const productsAfter = fetchFromLocalStorage("products");
  assert.strictEqual(productsAfter.length, 1);
  assert.deepStrictEqual(productsAfter[0], product);
});
