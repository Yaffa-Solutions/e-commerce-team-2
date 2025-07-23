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

export const CreateAboutUsSection = () => {
  const section = createHtmlElement(
    "section",
    "w-full py-16 px-6 text-black mb-[100px]",
    ""
  );
  section.style.backgroundColor = "rgb(255, 127, 48)";

  const container = createHtmlElement(
    "div",
    "max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8"
  );

  const leftSide = createHtmlElement("div", "md:w-1/2");

  const title = createHtmlElement(
    "h2",
    "font2 md:text-4xl font-bold mb-4",
    "About Us"
  );

  const subtitle = createHtmlElement("p", "font5 font-medium", "Our Mission");

  const rightSide = createHtmlElement("div", "md:w-1/2");

  const paragraph = createHtmlElement(
    "p",
    "text-base leading-relaxed",
    `At A. Choi, we are dedicated to providing photography enthusiasts with a wide selection of cameras, lenses, and accessories. Our commitment to expert guidance ensures that photographers of all levels can find the perfect gear to capture their vision. Explore our curated collection and elevate your photography experience with us.`
  );

  customAppendChild(leftSide, title, subtitle);
  customAppendChild(rightSide, paragraph);
  customAppendChild(container, leftSide, rightSide);
  section.appendChild(container);

  const main = document.querySelector("main");
  customAppendChild(main, section);
};
