import {
  buildProductForm,
  saveProduct,
  updateProduct,
} from "./components/add-product.js";

import {
  getProductsFromStorage,
  renderProducts,
} from "./components/show-products.js";

import { createHtmlElement, customAppendChild } from "./dom.js";
import { createNavbar, createFooter } from "./components/layout.js";
import {
  createHomeSection,
  CreateAboutUsSection,
  createGallerySection,
} from "./components/home.js";

const links = ["Home", "Dashboard", "AllProducts"];

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

export const renderProductList = (seller = false) => {
  const existingWrapper = document.getElementById("product-list");
  if (existingWrapper) existingWrapper.remove();

  const wrapper = createHtmlElement(
    "div",
    "mx-auto p-4 mb-[100px] flex flex-col items-center justify-center",
    "",
    { id: "product-list" }
  );

  const btnContainer = createHtmlElement("div", "w-full flex justify-end mb-4");

  const priceRange = createHtmlElement(
    "input",
    "w-1/3 mr-4",
    "",
    {
      type: "range",
      min: 0,
      max: 1000,
      value: 1000,
    }
  );
  priceRange.addEventListener("input", (e) => {
    renderProducts({ maxPrice: Number(e.target.value) });
  });

  const searchInput = createHtmlElement(
    "input",
    "px-3 py-2 border border-gray-300 round-md w-1/3 mr-4",
    "",
    {
      placeholder: "Search by name...",
      type: "text",
    }
  );
  searchInput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    renderProducts({ name: keyword });
  });

  customAppendChild(btnContainer, priceRange, searchInput);

  const addBtn = createHtmlElement(
    "button",
    "py-2 px-3 mb-[10px] bg-blue-600 text-white rounded hover:bg-blue-700 transition",
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
    
  const filterContainer = createHtmlElement(
    "div",
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8",
    "",
    { id: "FilterContainer" }
  );

  const cardsContainer = getProductsFromStorage(seller);
  cardsContainer.id = "CardsContainer";

  customAppendChild(wrapper, btnContainer, filterContainer, cardsContainer);

  const main = document.querySelector("main");
  main.innerHTML = "";
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



const renderRoute = () => {
  const main = document.querySelector("main");
  const hash = window.location.hash || "#home";
  main.innerHTML = "";

  switch (hash) {
    case "#Dashboard":
      renderProductList(true);
      break;
    case "#AllProducts":
      renderProductList(false);
      break;
    default:
      renderHomePage();
      break;
  }
};
