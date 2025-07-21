
import categories from '../../data/category.js'


export function createLabel(labelText)
{
  let label=document.createElement("label");
  label.textContent=labelText;
  label.className = "block mb-1 font-semibold text-gray-700";

  return label;
}

export function createInput(text,inputName,inputType,accept=null)
{
  let label=createLabel(text);
  
  let input=document.createElement("input");
  input.required=true;
  input.type=inputType;
  input.name=inputName
  input.className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

  if(accept)
    input.setAttribute('accept', accept);

  let div=document.createElement("div");
  div.appendChild(label);
  div.appendChild(input)
  div.className = "mb-4";

  
  return div;
}

export function createSubmitbtn()
{
    let btn=document.createElement("button");
    btn.textContent="Submit";
    btn.type="submit";
    btn.className = "w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition-colors";

    return btn;
}


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
    console.log(product);
    console.log(products);
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
}
