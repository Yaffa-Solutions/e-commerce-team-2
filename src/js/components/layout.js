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
