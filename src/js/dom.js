import { renderRoute } from "./index.js";

export const createHtmlElement = (
  tag,
  className = "",
  content = "",
  attributes = {},
  events = {}
) => {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (content && tag !== "img" && tag !== "input") {
    element.textContent = content;
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  Object.entries(events).forEach(([eventName, handler]) => {
    element.addEventListener(eventName, handler);
  });

  return element;
};

export const customAppendChild = (parent, ...children) => {
  children.forEach((child) => parent.appendChild(child));
};

export const createInput = (
  text,
  inputName,
  inputType,
  isRequired = true,
  accept = null
) => {
  let label = createHtmlElement(
    "label",
    "block mb-1 font-semibold text-gray-700",
    text
  );

  let input = createHtmlElement(
    "input",
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  );

  input.required = isRequired;
  input.type = inputType;
  input.name = inputName;

  if (accept) input.setAttribute("accept", accept);
  let div = createHtmlElement("div", "mb-4");

  customAppendChild(div, label, input);
  return div;
};

export const createSubmitBtn = (text) => {
  let btn = createHtmlElement(
    "button",
    "w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition-colors",
    "Submit"
  );
  btn.type = "submit";
  btn.textContent = text;
  return btn;
};

export const fetchFromLocalStorage = (key) => {
  let data = JSON.parse(localStorage.getItem(key)) || [];
  return data;
};

export const setToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const showMessageDialog = (
  message,
  type = "success",
  onConfirm = null
) => {
  const overlay = createHtmlElement(
    "div",
    "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000]"
  );

  let colorClass = "";
  switch (type) {
    case "success":
      colorClass = "text-green-600 border-green-600";
      break;
    case "warning":
    case "confirm":
      colorClass = "text-red-600 border-red-600";
      break;
    default:
      colorClass = "text-gray-700 border-gray-400";
  }

  const dialog = createHtmlElement(
    "div",
    `bg-white border-l-4 ${colorClass} max-w-md w-full p-6 rounded shadow-lg flex flex-col gap-4 items-start`
  );

  const textEl = createHtmlElement("p", "text-sm font-medium", message);

  if (type === "confirm" && typeof onConfirm === "function") {
    const btnContainer = createHtmlElement("div", "self-end flex gap-3");

    const yesBtn = createHtmlElement(
      "button",
      "px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition",
      "Yes",
      {},
      {
        click: () => {
          overlay.remove();
          onConfirm(true);
        },
      }
    );

    const noBtn = createHtmlElement(
      "button",
      "px-4 py-1 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 transition",
      "No",
      {},
      {
        click: () => {
          overlay.remove();
          onConfirm(false);
        },
      }
    );

    customAppendChild(btnContainer, noBtn, yesBtn);
    customAppendChild(dialog, textEl, btnContainer);
  } else {
    const okBtn = createHtmlElement(
      "button",
      "self-end mt-2 px-4 py-1 rounded bg-black text-white hover:bg-gray-800 transition",
      "OK",
      {},
      {
        click: () => {
          overlay.remove();
          renderRoute();
        },
      }
    );

    customAppendChild(dialog, textEl, okBtn);
  }

  customAppendChild(overlay, dialog);
  document.body.appendChild(overlay);
};
