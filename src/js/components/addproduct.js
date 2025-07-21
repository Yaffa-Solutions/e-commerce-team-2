
import categories from '../data/category.js'
import {
    createInput,
    createLabel,
    createSubmitbtn
} from '../dom.js'


export function getProductDataFromForm(form)
{
    let formData = new FormData(form);
    let product={
        name:formData.get("name"),
        price:formData.get("price"),
        discount:formData.get("discount"),
        description:formData.get("detail"),
        image:formData.get("image"),
        category:formData.get("category"),
    };

    return product;
}

export function createCategoryDropdown(categories) {

    const label = createLabel("Category")

    const select = document.createElement('select');
    select.name = 'category';
    select.className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });

    const div = document.createElement('div');
    div.className = "mb-4";
    div.appendChild(label);
    div.appendChild(select);

    return div;
}


export function createFormTitle(titleText) {
  const title = document.createElement("h2");
  title.textContent = titleText;
  title.style.marginBottom = "10px";
  title.className = "text-2xl font-bold mb-6 text-center text-gray-800";

  return title;
}

export function buildAddProductForm() {
    const form = document.createElement('form');

    form.appendChild(createInput('Product Name','name', 'text'));
    form.appendChild(createInput('Product Detail', 'detail', 'text'));
    form.appendChild(createInput('Price', 'price', 'number'));
    form.appendChild(createInput('Discount', 'discount', 'number'));
    form.appendChild(createInput('Image URL', 'image', 'file',"image"));
    form.appendChild(createCategoryDropdown(categories))
    form.appendChild(createSubmitbtn('Add Product'));

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const product = getProductDataFromForm(form);
        saveProduct(product);
        alert('Product added successfully!');
        form.reset();
    });

    return form;
}

function saveProduct(product) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
}
