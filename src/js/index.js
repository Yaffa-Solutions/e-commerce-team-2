import {
  buildProductForm,
  saveProduct,
  updateProduct,
} from "./components/add-product.js";

import {
  getProductsFromStorage,
  setProductsToCards,
} from "./components/show-products.js";

import { createHtmlElement, customAppendChild } from "./dom.js";
import {
  createNavbar,
  createFooter,
  updateCartCount,
} from "./components/layout.js";
import {
  createHomeSection,
  CreateAboutUsSection,
  createGallerySection,
} from "./components/home.js";

const links = ["Home", "Dashboard", "Items"];

document.addEventListener("DOMContentLoaded", () => {
  document.body.prepend(createNavbar(links));
  document.body.appendChild(createFooter());

  window.addEventListener("hashchange", () => renderRoute());
  renderRoute();
});

const onSubmit = async (e, form, getProductDataFromForm, saveProduct) => {
  e.preventDefault();
  const product = await getProductDataFromForm(form);

  const price = parseFloat(product.price);
  const discount = parseFloat(product.discount);

  if (isNaN(price) || price <= 0) {
    alert("Price must be a positive number.");
    return;
  }

  if (isNaN(discount) || discount < 0) {
    alert("Discount must be a non-negative number.");
    return;
  }

  saveProduct(product);

  const isUpdate = !!form.dataset.id;
  alert(
    isUpdate ? "Product updated successfully!" : "Product added successfully!"
  );

  form.reset();
  renderProductList();
};

export const renderProductList = (seller) => {
  const existingWrapper = document.getElementById("product-list");
  if (existingWrapper) existingWrapper.remove();

  const wrapper = createHtmlElement(
    "div",
    " mx-auto p-4 mb-[100px] flex flex-col items-center justify-center",
    "",
    { id: "product-list" }
  );

  const btnContainer = createHtmlElement(
    "div",
    "w-full flex justify-between mb-4"
  );
  const searchInput = createHtmlElement(
    "input",
    "px-3 py-2 border border-gray-300 round-md w-1/3 mr-4",
    "",
    {
      placeholder: "Search by name or category...",
      type: "text",
      id: "search-input",
    },
    {
      input: (e) => {
        const keyword = e.target.value.toLowerCase();

        const allProducts = JSON.parse(
          localStorage.getItem("products") || "[]"
        );

        const filteredProducts = allProducts.filter((product) => {
          return (
            product.name.toLowerCase().includes(keyword) ||
            product.category.toLowerCase().includes(keyword)
          );
        });

        const productListContainer = wrapper.querySelector("#product-list");
        productListContainer.innerHTML = "";

        const newCards = setProductsToCards(filteredProducts, seller);
        productListContainer.replaceWith(newCards);
      },
    }
  );

  customAppendChild(btnContainer, searchInput);

  const addBtn = createHtmlElement(
    "button",
    " py-2 px-3 mb-[10px] bg-blue-600 text-white rounded hover:bg-blue-700 transition",
    "➕ Add Product",
    {},
    {
      click: () => {
        openProductModal();
      },
    }
  );

  if (seller) {
    customAppendChild(btnContainer, addBtn);
  }

  const cardsContainer = getProductsFromStorage(seller);

  customAppendChild(wrapper, btnContainer, cardsContainer);

  const main = document.querySelector("main");
  customAppendChild(main, wrapper);
};

export const openProductModal = (product = null) => {
  const overlay = createHtmlElement(
    "div",
    "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50",
    "",
    { id: "modal-overlay" }
  );

  const modalContent = createHtmlElement(
    "div",
    "bg-white max-h-[90vh] overflow-y-auto w-full max-w-xl p-6 rounded shadow-lg relative"
  );

  const closeBtn = createHtmlElement(
    "button",
    "absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold",
    "×",
    {},
    {
      click: () => overlay.remove(),
    }
  );

  const isUpdate = product !== null;

  const formTitle = createHtmlElement(
    "h2",
    "text-2xl font-bold mb-6 text-center text-gray-800",
    isUpdate ? "Update Product" : "Add New Product"
  );

  const form = buildProductForm(
    onSubmit,
    product,
    isUpdate ? updateProduct : saveProduct
  );

  customAppendChild(modalContent, closeBtn, formTitle, form);
  customAppendChild(overlay, modalContent);
  customAppendChild(document.body, overlay);
};

export const openCartModal = () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const overlay = createHtmlElement(
    "div",
    "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
  );

  const modal = createHtmlElement(
    "div",
    "bg-white w-full max-w-2xl p-6 rounded shadow-lg relative"
  );

  const closeBtn = createHtmlElement(
    "button",
    "absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold",
    "×",
    {},
    {
      click: () => overlay.remove(),
    }
  );

  const title = createHtmlElement(
    "h2",
    "text-2xl font-bold mb-4 text-center text-gray-800",
    "🛒 Your Cart"
  );

  const list = createHtmlElement("div", "grid grid-cols-1 gap-4");

  let total = 0;

  cart.forEach((product) => {
    const discountedPrice = product.discount
      ? (product.price * (100 - product.discount)) / 100
      : product.price;

    total += discountedPrice;

    const card = createHtmlElement(
      "div",
      "border p-4 rounded shadow-sm flex justify-between items-center"
    );

    const left = createHtmlElement("div");
    const name = createHtmlElement("h3", "font-bold", product.name);
    const price = createHtmlElement(
      "p",
      "text-green-600",
      `$${discountedPrice.toFixed(2)}`
    );
    customAppendChild(left, name, price);

    const removeBtn = createHtmlElement(
      "button",
      "text-red-500 hover:underline text-sm",
      "Remove",
      {},
      {
        click: () => {
          removeFromCart(product);
          overlay.remove();
          openCartModal();
        },
      }
    );

    customAppendChild(card, left, removeBtn);
    customAppendChild(list, card);
  });

  const totalView = createHtmlElement(
    "p",
    "text-right font-bold text-lg mt-4",
    `Total: $${total.toFixed(2)}`
  );

  customAppendChild(modal, closeBtn, title, list, totalView);
  customAppendChild(overlay, modal);
  customAppendChild(document.body, overlay);
};

const removeFromCart = (productToRemove) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const updatedCart = cart.filter(
    (item) =>
      !(
        item.name === productToRemove.name &&
        item.price === productToRemove.price
      )
  );

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  updateCartCount();
};

const renderHomePage = () => {
  createHomeSection();
  CreateAboutUsSection();
  createGallerySection();
};

const renderRoute = () => {
  const main = document.querySelector("main");
  const hash = window.location.hash || "#home";
  main.innerHTML = "";

  switch (hash) {
    case "#Dashboard":
      renderProductList(true);
      break;
    case "#Items":
      renderProductList(false);
      break;
    default:
      renderHomePage();
      break;
  }
};
