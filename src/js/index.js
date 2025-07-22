import { buildAddProductForm } from './components/addproduct.js';
import { createHtmlElement } from './dom.js';

const onSubmit = (e, form, getProductDataFromForm, saveProduct) => {
  e.preventDefault();
  const product = getProductDataFromForm(form);
  saveProduct(product);
  alert('Product added successfully!');
  form.reset();
};

document.addEventListener('DOMContentLoaded', () => {
  renderAddProductForm();
});

function renderAddProductForm() {
  const container = createHtmlElement(
    'div',
    'mx-auto h-lvh mt-16 p-6 bg-white rounded-lg shadow-md '
  );

  const title = createHtmlElement(
    'h2',
    'text-2xl font-bold mb-6 text-center text-gray-800',
    'Add New Product'
  );
  title.style.marginBottom = '10px';
  const form = buildAddProductForm(onSubmit);

  container.appendChild(title);
  container.appendChild(form);
  document.body.appendChild(container);
}
