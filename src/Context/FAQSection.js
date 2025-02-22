import { useState ,useEffect } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useRouter } from "next/router"; 

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [displayText, setDisplayText] = useState("");
  const [categories, setCategories] = useState([]);
    const router = useRouter();

  const handleTabChange = (e) => {
    setActiveIndex(e.index === activeIndex ? null : e.index);
  };

  useEffect(() => {
      async function fetchCategories() {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/layout-items/`
          );
          const data = await response.json();
  
          if (Array.isArray(data)) {
            const sortedCategories = data.sort((a, b) => a.order - b.order);
            const availableCategories = sortedCategories.map((item) => item.column_name);
  
            setCategories(availableCategories);
  
            // Determine dynamic text based on available categories
            const textParts = [];
            if (availableCategories.includes("schemes")) textParts.push("schemes");
            if (availableCategories.includes("jobs")) textParts.push("jobs");
            if (availableCategories.includes("scholarships")) textParts.push("scholarships");
  
            setDisplayText(textParts.length > 0 ? textParts.join(", ") : "opportunities");
            
            setCategories(sortedCategories.map((item) => ({
              name: item.column_name,
              label: item.column_name.toUpperCase(),
        
            })));
       
          }
        } catch (error) {
          console.error("Error fetching category data:", error);
        }
      }
  
      fetchCategories();
    }, [router.query, setCategories ]);
  



  const renderHeader = (title, isExpanded) => (
    <div className="flex items-center justify-between sm:w-[150px] rounded-lg cursor-pointer py-3 px-4 border-b border-gray-300 gap-[28px]">
      <span className="text-black font-inter text-base font-normal leading-normal">{title}</span>
      
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-gradient-to-b sm:p-10  sm:p-12  overflow-hidden">
      <div className="self-stretch flex justify-center">
        <h1 className="text-black text-center font-inter text-[18px] sm:text-2xl font-semibold leading-[150%] mb-6 py-[10px] mt-[20px]">
          Frequently Asked Questions
        </h1>
      </div>
      <Accordion
        className="mt-4 w-full sm:w-full   mx-auto "
        activeIndex={activeIndex}
        onTabChange={handleTabChange}
      >

       
        <AccordionTab header={renderHeader("What is the launchpad?", activeIndex === 0)}>
          <div className=" p-4 sm:p-6 p-[20px]">
            <p className="mx-auto sm:w-[200px]">
              The launchpad is an all-inclusive platform that provides tailored information on various government {displayText} for individuals across India.
            </p>
          </div>
        </AccordionTab>

        <AccordionTab header={renderHeader("How will this help me?", activeIndex === 1)}>
          <div className="  p-4 sm:p-6">
            <p className="mx-auto sm:w-[200px]">
              By using our platform, you can easily discover relevant {displayText} that match your qualifications and needs. This can help you access opportunities and resources that you might not have found otherwise.
            </p>
          </div>
        </AccordionTab>

        <AccordionTab header={renderHeader("Can I get all information regarding Govt and State?", activeIndex === 2)}>
          <div className=" p-4 sm:p-6">
            <p className="mx-auto sm:w-[200px]">
              Yes, our platform aggregates information from both central and state government sources to provide comprehensive details on {categories[0]} and benefits available across different regions.
            </p>
          </div>
        </AccordionTab>
        
        <AccordionTab header={renderHeader(`How can I apply for ${displayText}?`, activeIndex === 3)}>
          <div className="  p-4 sm:p-6">
            <p className="mx-auto sm:w-[200px]">
              You can apply by following the application instructions provided for each {displayText}. This usually involves submitting your details through an online portal or contacting the relevant office directly.
            </p>
          </div>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default FAQSection;
