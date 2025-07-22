export const createHtmlElement = (ele, className, content) => {
  const element = document.createElement(ele);
  element.className = className;
  if (content) {
    element.textContent = content;
  }
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
    'label',
    'block mb-1 font-semibold text-gray-700',
    text
  );

  let input = createHtmlElement(
    'input',
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
  );

  input.required = isRequired;
  input.type = inputType;
  input.name = inputName;

  if (accept) input.setAttribute('accept', accept);
  let div = createHtmlElement('div', 'mb-4');
  // div.appendChild(label);
  // div.appendChild(input);

  customAppendChild(div, label, input);
  return div;
};

export function createSubmitBtn() {
  let btn = createHtmlElement(
    'button',
    'w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition-colors',
    'Submit'
  );
  btn.type = 'submit';
  return btn;
}
