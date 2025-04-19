<<<<<<< HEAD
import { useState ,useEffect } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useRouter } from "next/router"; 
=======
import { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
>>>>>>> upstream/main

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/faqs/`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setFaqs(data);
        }
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
      }
    }

    fetchFAQs();
  }, [router.query]);

  return (
    <div className="flex flex-col items-center  bg-[#2F329114]   sm:px-8 lg:px-16 xl:px-24 overflow-hidden w-full">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-black font-inter text-[20px] sm:text-3xl font-semibold leading-[150%] mb-8 border-b-4 border-gray-300 inline-block px-4">
          Frequently Asked Questions
        </h1>
      </div>
      <div className="w-full max-w-48 space-y-4">
        {faqs.map((faq, index) => (
          <Disclosure key={index}>
            {({ open }) => (
              <div className="border bg-[#2F329114] border-gray-300 rounded-lg bg-white transition-all duration-300 ">
                <Disclosure.Button className=" bg-[#2F329114] flex justify-between w-full px-4 py-4 text-left text-sm sm:text-[16px] sm:w-full  font-semibold text-black rounded-t-lg focus:outline-none hover:bg-gray-200 transition-all duration-300">
                  {faq.question}
                  <ChevronUpIcon
                    className={`w-6 h-6 text-gray-600 transform transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="overflow-hidden transition-all duration-300 px-5 py-3 bg-gray-50">
                  <p className="text-gray-700 text-sm sm:text-base p-4">{faq.answer}</p>
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
