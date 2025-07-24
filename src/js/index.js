import {
  buildProductForm,
  saveProduct,
  updateProduct,
} from "./components/add-product.js";

import {
  getProductsFromStorage,
  setProductsToCards,
} from "./components/show-products.js";

import {
  createHtmlElement,
  customAppendChild,
  showMessageDialog,
} from "./dom.js";
import {
  createNavbar,
  createFooter,
  updateCartCount,
} from "./components/layout.js";
import {
  createHomeSection,
  CreateAboutUsSection,
  createGallerySection,
  createFAQSection,
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
    showMessageDialog("Price must be a positive number.", "warning");
    return;
  }

  if (isNaN(discount) || discount < 0) {
    showMessageDialog("Discount must be a non-negative number.", "warning");
    return;
  }

  if (discount >= 100) {
    showMessageDialog("Discount must be a less than 100", "warning");
    return;
  }

  saveProduct(product);

  const isUpdate = !!form.dataset.id;
  showMessageDialog(
    isUpdate ? "Product updated successfully!" : "Product added successfully!",
    "success"
  );

  form.reset();
  renderRoute();
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

  const btnContainer = createHtmlElement("div", "w-full flex justify-between items-center mb-4");

  const searchInput = createHtmlElement(
    "input",
    "px-3 py-2 border border-gray-300 rounded-md w-1/3 mr-4",
    "",
    {
      placeholder: "Search by name or category...",
      type: "text",
      id: "search-input",
    },
    {
      input: (e) => {
        const keyword = e.target.value.toLowerCase();
        const allProducts = JSON.parse(localStorage.getItem("products") || "[]");

        const filteredProducts = allProducts.filter((product) =>
          product.name.toLowerCase().includes(keyword) ||
          product.category.toLowerCase().includes(keyword)
        );

        const cards = setProductsToCards(filteredProducts, seller);
        const container = document.getElementById("CardsContainer");
        container.replaceWith(cards);
        cards.id = "CardsContainer";
      },
    }
  );

  const priceRangeContainer = createHtmlElement("div", "flex items-center gap-2 w-1/3");
  const priceValueLabel = createHtmlElement("span", "text-gray-600 text-sm", "$1000");

  const priceRange = createHtmlElement(
    "input",
    "w-full",
    "",
    {
      type: "range",
      min: 0,
      max: 1000,
      value: 1000,
    },
    {
      input: (e) => {
        const maxPrice = Number(e.target.value);
        priceValueLabel.textContent = `$${maxPrice}`;

        const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
        const filtered = allProducts.filter(p => p.price <= maxPrice);

        const cards = setProductsToCards(filtered, seller);
        const container = document.getElementById("CardsContainer");
        container.replaceWith(cards);
        cards.id = "CardsContainer";
      },
    }
  );

  customAppendChild(priceRangeContainer, priceRange, priceValueLabel);

  const addBtn = createHtmlElement(
    "button",
    "py-2 px-3 mb-[10px] bg-black text-white rounded border border-transparent hover:bg-white hover:text-black hover:border-black transition",
    "➕ Add Product",
    {},
    {
      click: () => openProductModal(),
    }
  );

  const controlsWrapper = createHtmlElement("div", "flex gap-4 w-full justify-between");
  customAppendChild(controlsWrapper, searchInput, priceRangeContainer);

  if (seller) {
    customAppendChild(btnContainer, controlsWrapper, addBtn);
  } else {
    customAppendChild(btnContainer, controlsWrapper);
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

const renderHomePage = () => {
  createHomeSection();
  CreateAboutUsSection();
  createGallerySection();
  createFAQSection();
};

export const renderRoute = () => {
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
