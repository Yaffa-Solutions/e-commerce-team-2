import { createHtmlElement, customAppendChild } from "../dom.js";

export const createNavbar = (links = []) => {
  const nav = createHtmlElement("nav", " text-black shadow-md");

  const container = createHtmlElement(
    "div",
    "max-w-7xl relative mx-auto px-4 py-3 flex justify-between items-center"
  );

  const title = createHtmlElement("img", "w-[220px]", "", {
    src: "../../public/images/logo.png",
  });

  const menu = createHtmlElement(
    "button",
    "text-[28px] mr-[30px]  md:hidden flex justify-center align-center",
    "☰",
    {
      id: "menuToggle",
    },
    {
      click: () => showMenuModal(links),
    }
  );

  const ul = createHtmlElement(
    "ul",
    "md:flex hidden md:block space-x-6 text-sm font-medium"
  );

  links.forEach((text) => {
    const li = createHtmlElement("li");
    const a = createHtmlElement("a", "hover:underline", text, {
      href: "#",
    });
    customAppendChild(li, a);
    customAppendChild(ul, li);
  });

  const ul2 = createHtmlElement(
    "ul",
    "flex hidden md:block space-x-6 text-sm font-medium"
  );

  const loginBtn = createHtmlElement(
    "button",
    "text-sm px-3 py-1 border border-black rounded hover:bg-black hover:text-white transition",
    "Login"
  );

  const cartIcon = createHtmlElement("span", "text-xl", "🛒");
cartIcon.addEventListener("click", openCartModal); 
  customAppendChild(ul2, loginBtn, cartIcon);

  customAppendChild(container, title, ul, ul2, menu);
  nav.appendChild(container);
  return nav;
};

export const createFooter = () => {
  const footer = createHtmlElement(
    "footer",
    "text-black shadow-md text-gray-700 border-t mt-[100px]"
  );

  const wrapper = createHtmlElement(
    "div",
    "max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4 md:gap-6"
  );

  const topSection = createHtmlElement(
    "div",
    "flex flex-col md:flex-row justify-between items-center gap-4"
  );

  const logo = createHtmlElement("img", "w-[160px]", "", {
    src: "../../public/images/logo.png",
    alt: "MyShop Logo",
  });

  const linksList = ["Home", "Products", "About", "Contact"];
  const linksContainer = createHtmlElement(
    "ul",
    "flex gap-6 text-sm font-medium"
  );

  linksList.forEach((text) => {
    const li = createHtmlElement("li");
    const a = createHtmlElement("a", "hover:underline", text, {
      href: "#",
    });
    customAppendChild(li, a);
    customAppendChild(linksContainer, li);
  });

  customAppendChild(topSection, logo, linksContainer);

  const bottomSection = createHtmlElement("div", "text-center");

  const copyright = createHtmlElement(
    "p",
    "text-sm",
    "CameraScope. All rights reserved."
  );

  customAppendChild(bottomSection, copyright);

  customAppendChild(wrapper, topSection, bottomSection);
  footer.appendChild(wrapper);
  return footer;
};

const showMenuModal = (links) => {
  if (document.getElementById("mobile-menu-overlay")) return;

  const overlay = createHtmlElement(
    "div",
    "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end",
    "",
    { id: "mobile-menu-overlay" }
  );

  const menu = createHtmlElement(
    "div",
    "bg-white w-[250px] h-full p-6 shadow-lg flex flex-col gap-4"
  );

  const topBar = createHtmlElement(
    "div",
    "flex justify-between items-center mb-4"
  );

  const closeBtn = createHtmlElement(
    "button",
    "text-2xl text-gray-600 hover:text-black",
    "×",
    {},
    {
      click: () => overlay.remove(),
    }
  );

  const cartIcon = createHtmlElement("span", "text-2xl", "🛒");

  customAppendChild(topBar, cartIcon, closeBtn);

  const ul = createHtmlElement("ul", "flex flex-col gap-4");

  links.forEach((text) => {
    const li = createHtmlElement("li");
    const a = createHtmlElement("a", "text-lg hover:underline", text, {
      href: "#",
    });
    customAppendChild(li, a);
    customAppendChild(ul, li);
  });

  const loginBtn = createHtmlElement(
    "button",
    "mt-6 text-sm px-3 py-1 border border-black rounded hover:bg-black hover:text-white transition",
    "Login"
  );

  customAppendChild(menu, topBar, ul, loginBtn);
  customAppendChild(overlay, menu);
  document.body.appendChild(overlay);
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


