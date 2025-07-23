import { createHtmlElement, customAppendChild } from "../dom.js";

export const createHomeSection = () => {
  const homeSection = createHtmlElement(
    "section",
    "flex flex-col mb-[100px] items-center justify-center py-10 px-6"
  );

  const topPart = createHtmlElement(
    "div",
    "relative w-full   flex justify-between"
  );

  const headsContainer = createHtmlElement("div", "max-w-[600px]");

  const head = createHtmlElement(
    "h1",
    "font2 md:font0 text-3xl md:text-4xl mb-6",
    "Capture Your Vision with Us"
  );

  const subHead = createHtmlElement(
    "p",
    "font5 text-lg text-gray-700",
    "Your Destination for Photography"
  );

  const btn = createHtmlElement(
    "button",
    "bg-[#00001A] rounded-3xl hidden md:block absolute hover:text-black hover:bg-white transition-all transform-gpu duration-200 text-center  bottom-0 px-[30px] py-[10px] right-0   text-white",
    "Shop Now"
  );

  const imagePart = createHtmlElement(
    "div",
    "w-full mt-10 rounded-2xl overflow-hidden"
  );

  const image = createHtmlElement("img", "w-full h-auto object-cover", "", {
    src: "../../public/images/Section1.jpg",
    alt: "Photography Hero",
  });

  customAppendChild(headsContainer, head, subHead);
  customAppendChild(topPart, headsContainer, btn);
  customAppendChild(imagePart, image);
  customAppendChild(homeSection, topPart, imagePart);

  const main = document.querySelector("main");
  customAppendChild(main, homeSection);
};
