import { createHtmlElement, customAppendChild } from "../dom.js";
import { openProductModal } from "../index.js";
import { deleteProduct } from "./add-product.js";
import { updateCartCount } from "./layout.js";

export const createCard = (product, seller = false) => {
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
    "absolute top-2 right-2 text-white px-3 py-1 rounded transition",
    "❌",
    {},
    {
      click: () => {
        if (confirm("Are you sure you want to delete this product?"))
          deleteProduct(product);
      },
    }
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

  if (seller) {
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
  } else {
    customAppendChild(
      card,
      image,
      name,
      price,
      priceAfterDiscount,
      category,
      addToCartBtn
    );
  }

  return card;
};

export const getProductsFromStorage = (seller = false) => {
  const products = localStorage.getItem("products") || "[]";
  const container = setProductsToCards(JSON.parse(products), seller);
  return container;
};

export const setProductsToCards = (products = [], seller = false) => {
  const container = createHtmlElement(
    "div",
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8",
    "",
    { id: "product-list" }
  );
  products.forEach((product) => {
    const card = createCard(product, seller);
    customAppendChild(container, card);
  });
  return container;
};

export const getProductsFromStoragearray = () => {
  return JSON.parse(localStorage.getItem("products") || "[]");
};

export const renderProducts = (filters = {}) => {
  const filterContainer = document.getElementById("FilterContainer");
  const allProductsContainer = document.getElementById("CardsContainer");

  filterContainer.innerHTML = "";
  let products = getProductsFromStoragearray();

  if (filters.name) {
    products = products.filter((p) =>
      p.name.toLowerCase().includes(filters.name.toLowerCase())
    );
  }

  if (filters.maxPrice !== undefined) {
    products = products.filter((p) => Number(p.price) <= filters.maxPrice);
  }

  if (products.length > 0) {
    allProductsContainer.style.display = "none";
    filterContainer.style.display = "grid";

    products.forEach((product) => {
      const displayProduct = {
        ...product,
        price: product.discount
          ? (product.price * (100 - product.discount)) / 100
          : product.price,
        oldPrice: product.discount ? product.price : null,
      };

      filterContainer.appendChild(createCard(displayProduct));
    });
  } else {
    allProductsContainer.style.display = "grid";
    filterContainer.style.display = "none";
  }
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
  updateCartCount();
  alert("Product added to cart!");
};
