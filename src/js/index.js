import {
  buildProductForm,
  saveProduct,
  updateProduct,
} from "./components/addproduct.js";

import { getProductsFromStorage } from "./components/showproducts.js";

import { createHtmlElement, customAppendChild } from "./dom.js";

document.addEventListener("DOMContentLoaded", () => {
  renderProductList();
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

export const renderProductList = () => {
  const existingWrapper = document.getElementById("product-list");
  if (existingWrapper) existingWrapper.remove();

  const wrapper = createHtmlElement(
    "div",
    "max-w-7xl mx-auto p-4 flex flex-col items-center justify-center",
    "",
    { id: "product-list" }
  );

  const btnContainer = createHtmlElement("div", "w-full flex justify-end mb-4");

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

  customAppendChild(btnContainer, addBtn);

  const cardsContainer = getProductsFromStorage();

  customAppendChild(wrapper, btnContainer, cardsContainer);

  customAppendChild(document.body, wrapper);
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
