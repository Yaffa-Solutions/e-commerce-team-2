import {
    buildAddProductForm,
    createFormTitle
}
from './components/seller/addproduct.js';


document.addEventListener("DOMContentLoaded",() => { 
  
    renderAddProductForm();
});



function renderAddProductForm() {
  const container = document.createElement("div");
  container.className = " mx-auto h-lvh mt-16 p-6 bg-white rounded-lg shadow-md ";

  const title = createFormTitle("Add New Product");
  const form = buildAddProductForm();

  container.appendChild(title);
  container.appendChild(form);
  document.body.appendChild(container);
}
