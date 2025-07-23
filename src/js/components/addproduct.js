import categories from "../data/category.js";
import {
  createInput,
  createSubmitBtn,
  createHtmlElement,
  customAppendChild,
  fetchFromLocalStorage,
  setToLocalStorage,
} from "../dom.js";

import { renderProductList } from "../index.js";

const inputFelid = [
  {
    title: "Product Name",
    inputName: "name",
    inputType: "text",
  },
  {
    title: "Product Detail",
    inputName: "detail",
    inputType: "text",
  },
  {
    title: "Price",
    inputName: "price",
    inputType: "number",
  },
  {
    title: "Discount",
    inputName: "discount",
    inputType: "number",
  },
  {
    title: "Image URL",
    inputName: "image",
    inputType: "file",
    accept: "image",
  },
];

export const getProductDataFromForm = (form) => {
  let formData = new FormData(form);

  const file = formData.get("image");

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      const product = {
        id: form.dataset.id || crypto.randomUUID(),
        name: formData.get("name"),
        price: formData.get("price"),
        discount: formData.get("discount"),
        detail: formData.get("detail"),
        image: reader.result, // Base64 string
        category: formData.get("category"),
      };
      resolve(product);
    };

    if (file && file.name) {
      reader.readAsDataURL(file);
    }
  });
};

export const createCategoryDropdown = (categories) => {
  let label = createHtmlElement(
    "label",
    "block mb-1 font-semibold text-gray-700",
    "Category"
  );

  const select = createHtmlElement(
    "select",
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  );
  select.name = "category";

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  const div = createHtmlElement("div", "mb-4");
  customAppendChild(div, label, select);
  return div;
};

export const buildProductForm = (onSubmit, product = null, saveProduct) => {
  const form = document.createElement("form");

  let inputs = inputFelid.map(
    ({ title, inputName, inputType, accept = null }) => {
      const inputGroup = createInput(title, inputName, inputType, accept);

      if (product && product[inputName] !== undefined) {
        const input = inputGroup.querySelector("input");
        if (input && input.type !== "file") {
          input.value = product[inputName];
        }
      }

      return inputGroup;
    }
  );

  if (product && product.id) {
    form.dataset.id = product.id;
  }

  const categoryDropdown = createCategoryDropdown(categories);
  if (product && product.category) {
    const select = categoryDropdown.querySelector("select");
    if (select) {
      select.value = product.category;
    }
  }

  const submitBtn = createSubmitBtn(product ? "Update Product" : "Add Product");

  inputs = [...inputs, categoryDropdown, submitBtn];

  if (product && product.image) {
    const currentImgLabel = createHtmlElement(
      "p",
      "mb-1 font-semibold text-gray-700",
      "Current Image:"
    );
    const previewImg = createHtmlElement(
      "img",
      "mb-4 h-32 w-full object-contain rounded border",
      "",
      { src: product.image, alt: product.name }
    );
    customAppendChild(form, currentImgLabel, previewImg);
  }

  customAppendChild(form, ...inputs);

  form.addEventListener("submit", (e) => {
    console.log("Calling saveProduct/updateProduct:", saveProduct);

    onSubmit(e, form, getProductDataFromForm, saveProduct);
    document.getElementById("modal-overlay")?.remove();
    document.getElementById("product-list")?.remove();
  });

  return form;
};

export const saveProduct = (product) => {
  let products = fetchFromLocalStorage("products");
  products.push(product);
  setToLocalStorage("products", products);
};

export const updateProduct = (updatedProduct) => {
  let products = fetchFromLocalStorage("products");
  const index = products.findIndex((p) => p.id === updatedProduct.id);
  if (index !== -1) {
    products[index] = updatedProduct;
    setToLocalStorage("products", products);
  }
};

export const deleteProduct = (product) => {
  let products = fetchFromLocalStorage("products");
  products = products.filter((p) => p.id !== product.id);
  setToLocalStorage("products", products);
  renderProductList();
};
