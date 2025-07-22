import { createHtmlElement, customAppendChild } from "../dom.js";

export const createCard = (product) => {
  const card = createHtmlElement("div", "bg-white rounded-lg shadow-md p-4");

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
const addToCartBtn = createHtmlElement(
  "button",
  "mt-2 text-sm text-blue-600 hover:underline",
  "Add to Cart",
  {},
  {
    click: () => addToCart(product),
  }
);

  customAppendChild(card, image, name, price, priceAfterDiscount, category,addToCartBtn);

  return card;
};

export const addToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const isAlreadyInCart = cart.some(
    (item) => item.name === product.name && item.price === product.price
  );

  if (isAlreadyInCart) {
    alert("This product is already in your cart.");
    return;
  }

  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(" Product added to cart!");
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



export const renderProducts = (filters = {}) => {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  let products = getProductsFromStorage();

  if (filters.name) {
    products = products.filter((p) =>
      p.name.toLowerCase().includes(filters.name.toLowerCase())
    );
  }

  if (filters.maxPrice !== undefined) {
    products = products.filter((p) => Number(p.price) <= filters.maxPrice);
  }

  products.forEach((product) => {
    const displayProduct = {
      ...product,
      price: product.discount
        ? (product.price * (100 - product.discount)) / 100
        : product.price,
      oldPrice: product.discount ? product.price : null,
    };

    container.appendChild(createCard(displayProduct));
  });
};
