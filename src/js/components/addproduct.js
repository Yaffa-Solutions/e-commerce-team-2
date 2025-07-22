
import categories from '../data/category.js'
import {
  createInput,
  createSubmitBtn,
  createHtmlElement,
  customAppendChild,
} from '../dom.js'



const inputFelid = [
  {
    title: 'Product Name',
    inputName: 'name',
    inputType: 'text',
  },
  {
    title: 'Product Detail',
    inputName: 'detail',
    inputType: 'text',
  },
  {
    title: 'Price',
    inputName: 'price',
    inputType: 'number',
  },
  {
    title: 'Discount',
    inputName: 'discount',
    inputType: 'number',
  },
  {
    title: 'Image URL',
    inputName: 'image',
    inputType: 'file',
    accept: 'image',
  },
];

export const getProductDataFromForm = (form) =>
{
    let formData = new FormData(form);

    const file = formData.get("image");
    
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = () => {
            const product = {
                name: formData.get("name"),
                price: formData.get("price"),
                discount: formData.get("discount"),
                description: formData.get("detail"),
                image: reader.result, // Base64 string
                category: formData.get("category"),
            };
            resolve(product);
        };

        if (file && file.name) {
            reader.readAsDataURL(file);
        }
    });
}



export const createCategoryDropdown = (categories) =>  {
  let label = createHtmlElement(
    'label',
    'block mb-1 font-semibold text-gray-700',
    'Category'
  );

  const select = createHtmlElement(
    'select',
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
  );
  select.name = 'category';

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  const div = createHtmlElement('div', 'mb-4');
  customAppendChild(div, label, select);
  return div;
}




export const  buildAddProductForm = (onSubmit) => {
  const form = document.createElement('form');
  let inputs = inputFelid.map(
    ({ title, inputName, inputType, accept = null }) => {
      return createInput(title, inputName, inputType, accept);
    }
  );

  inputs = [
    ...inputs,
    createCategoryDropdown(categories),
    createSubmitBtn('Add Product'),
  ];

  customAppendChild(form, ...inputs);

  form.addEventListener('submit', (e) =>{
    onSubmit(e, form, getProductDataFromForm, saveProduct)

   document.getElementById("modal-overlay")?.remove();
   document.getElementById("product-list")?.remove();
     document.location.reload()

  }
  
  );

  return form;
}

const saveProduct = (product) => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
}
