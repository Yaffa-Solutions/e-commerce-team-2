import { createHtmlElement, customAppendChild } from "../dom.js";
import { openProductModal } from "../index.js";
import { deleteProduct } from "./addproduct.js";

export const createCard = (product) => {
  const card = createHtmlElement(
    "div",
    "relative p-[50px] bg-white rounded-lg shadow-md "
  );

  const image = createHtmlElement(
    "img",
    "w-full h-40 object-cover rounded-md mb-4",
    "",
    {
      src: product.image,
      alt: product.name,
    }
  );
  const discountedPrice = (product.price * (100 - product.discount)) / 100;

  const name = createHtmlElement(
    "h3",
    "text-lg font-semibold mb-1",
    product.name
  );
  const price = createHtmlElement(
    "p",
    "text-gray-600 line-through mb-1",
    `Price: $${product.price}`
  );
  const priceAfterDiscount = createHtmlElement(
    "p",
    "text-green-600 font-semibold mb-1",
    `Discounted Price: $${discountedPrice.toFixed(2)}`
  );
  const category = createHtmlElement(
    "p",
    "text-gray-600",
    `Category: ${product.category}`
  );

  const editBtn = createHtmlElement(
    "button",
    "absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition",
    "Edit",
    {},
    {
      click: () => openProductModal(product),
    }
  );

  const deleteBtn = createHtmlElement(
    "button",
    "absolute top-2 right-2  text-white px-3 py-1 rounded  transition",
    "❌ ",
    {},
    {
      click: () => {
        if (confirm("Are you sure you want to delete this product?"))
          deleteProduct(product);
      },
    }
  );

  customAppendChild(
    card,
    image,
    name,
    price,
    priceAfterDiscount,
    category,
    editBtn,
    deleteBtn
  );

  return card;
};

export const getProductsFromStorage = () => {
  const products = localStorage.getItem("products") || "[]";
  const container = setProductsToCards(JSON.parse(products));
  return container;
};

export const setProductsToCards = (products = []) => {
  const container = createHtmlElement(
    "div",
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8",
    "",
    { id: "product-list" }
  );
  products.forEach((product) => {
    const card = createCard(product);
    customAppendChild(container, card);
  });
  return container;
};
