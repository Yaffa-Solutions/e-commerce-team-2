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