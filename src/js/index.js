import { buildAddProductForm } from "./components/addproduct.js";

import { getProductsFromStorage,renderProducts } from "./components/showproducts.js";

import { createHtmlElement, customAppendChild } from "./dom.js";

document.addEventListener("DOMContentLoaded", () => {
  renderProductList();
});

const onSubmit = async (e, form, getProductDataFromForm, saveProduct) => {
  e.preventDefault();
  const product = await getProductDataFromForm(form);
  saveProduct(product);
  alert("Product added successfully!");
  form.reset();
};

export const renderProductList = () => {
  const wrapper = createHtmlElement(
    "div",
    "max-w-7xl mx-auto p-4 flex flex-col items-center justify-center"
  );
const productList = createHtmlElement("div", "", "", { id: "product-list" });
customAppendChild(wrapper, productList);

  const btnContainer = createHtmlElement("div", "w-full flex justify-end mb-4");
const priceRange = createHtmlElement(
  "input",
  "w-1/3 mr-4",
  "",
  {
    type: "range",
    min: 0,
    max: 1000,
    value: 1000
  }
);

priceRange.addEventListener("input", (e) => {
  renderProducts({ maxPrice: Number(e.target.value) });
});
customAppendChild(btnContainer, priceRange);

const searcinput=createHtmlElement("input","px-3 py-2 border border-gray-300 round-md w-1/3 mr-4",
  "",
{
  placeholder: "Search by name...",
    type: "text"
}
)
searcinput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  renderProducts({ name: keyword });
});
customAppendChild(btnContainer, searcinput);


  const addBtn = createHtmlElement(
    "button",
    " py-2 px-3 mb-[10px] bg-blue-600 text-white rounded hover:bg-blue-700 transition",
    "➕ Add Product"
  );

  addBtn.addEventListener("click", openAddProductModal);

  customAppendChild(btnContainer, addBtn);
//////////////////////
const Cartbtn = createHtmlElement(
    "button",
    " py-2 px-3 mb-[10px] mx-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition",
    "Cart"
  );
Cartbtn.addEventListener("click", openCartModal); 

  customAppendChild(btnContainer, Cartbtn);
////////////////////////////////
  const cardsContainer = getProductsFromStorage();

  customAppendChild(wrapper, btnContainer, cardsContainer);

  customAppendChild(document.body, wrapper);
};

const openAddProductModal = () => {
  const overlay = createHtmlElement(
    "div",
    "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50",
    "",
    { id: "modal-overlay" }
  );

  const modalContent = createHtmlElement(
    "div",
    "bg-white w-full max-w-xl p-6 rounded shadow-lg relative"
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

  const formTitle = createHtmlElement(
    "h2",
    "text-2xl font-bold  mb-6 text-center text-gray-800",
    "Add New Product"
  );

  const form = buildAddProductForm(onSubmit);

  customAppendChild(modalContent, closeBtn, formTitle, form);
  customAppendChild(overlay, modalContent);
  customAppendChild(document.body, overlay);
};





const openCartModal = () => {
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
      !(item.name === productToRemove.name && item.price === productToRemove.price)
  );

  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

