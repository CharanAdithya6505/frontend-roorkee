import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';

const WelfarePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Data for the carousel
  const schemeCards = [
    {
      title: "Adi Dravidar and Tribal Welfare Department",
      department: "Welfare Department",
      description: "Free education up to 12th Std. to all i.e. tuition fee will not be collected and the amount will be reimbursed by the government",
      tags: ["TamilNadu", "Student", "SC/ ST"]
    },
    {
      title: "Rural Employment Scheme",
      department: "Welfare Department",
      description: "100 days of guaranteed wage employment to rural households whose adult members volunteer to do unskilled manual work",
      tags: ["Rural", "Employment", "MGNREGA"]
    },
    {
      title: "Women Development Program",
      department: "Welfare Department",
      description: "Financial assistance for women entrepreneurs to start small businesses and become self-reliant",
      tags: ["Women", "Entrepreneur", "Financial Aid"]
    }
  ];

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === schemeCards.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-1/2 bg-[#FEF6F0] relative flex items-center justify-center hidden lg:block sm:hidden md:hidden">
      <div className="absolute top-0 mt-28 ml-8 mr-8">
        <h1 className="text-[#3431BB] font-inter italic text-3xl mb-4 w-[100%]">
          "For the Indians by the Indians"
        </h1>
        <p className="text-[#939292] font-inter text-[22px] text-base font-medium w-3/4 opacity-0.4">
          Find all the details about government schemes, scholarships, and job
          openings for all states in one place.
        </p>

        {/* bg div images - keeping these static as in your design */}
        <div className="absolute w-[446.08px] h-[446.08px] rotate-[-51.369deg] flex-shrink-0 opacity-5 bg-[#DF8317] ml-[530px] mt-[-150px] z-0"></div>
        <div className="absolute w-[446.08px] h-[446.08px] rotate-[-51.369deg] flex-shrink-0 rounded-[55px] bg-[rgba(223,131,23,0.2)] ml-[230px] mt-[300px] z-0"></div>
        <div className="absolute w-[446.08px] h-[446.08px] rotate-[-51.369deg] flex-shrink-0 opacity-5 bg-[#DF8317] rounded-[55px] ml-[-340px] mt-[500px] z-0"></div>

        {/* Static card - Opening for bank staff */}
        <div className="absolute w-[266px] h-auto p-[10.8px] items-center rounded-[8.102px] border border-[#EEF] bg-[#FFF] shadow-[0px_0px_9.791px_rgba(5,2,160,0.08)] top-[305px] ml-[35px]">
          <p className="self-stretch text-[#000] mb-[5px] font-inter text-[9.452px] font-semibold leading-normal">
            Opening for bank staff
          </p>
          <p className="self-stretch text-[#616161] font-inter text-[6.751px] font-normal leading-normal underline">
            Welfare Department
          </p>
        </div>

        {/* Carousel for the middle card only */}
        <div className="absolute w-[326px] p-[10.802px] items-center gap-[8.102px] rounded-[8.102px] border border-[#EEF] bg-[#FFF] shadow-[0px_0px_9.791px_rgba(5,2,160,0.08)] top-[450px] mr-[295px]">
          <div className="flex">
            <p className="text-[10.584px] mb-[10px] font-semibold mr-12">
              {schemeCards[currentIndex].title}
            </p>
            <Bookmark className="w-4 h-4" />
          </div>
          <p className="self-stretch text-[#616161] font-inter text-[8.274px] font-semibold leading-normal opacity-60 mb-[9.93px] line-clamp-2">
            <span className="font-bold">Description:</span> {schemeCards[currentIndex].description}
          </p>
          <p className="self-stretch text-[#616161] font-inter text-[8.274px] font-normal leading-normal opacity-60 mb-[10px] line-clamp-2 underline">
            {schemeCards[currentIndex].department}
          </p>
          <div className="flex mt-[-7px]">
            {schemeCards[currentIndex].tags.map((tag, index) => (
              <div key={index} className="flex items-center justify-center pr-2 pl-2 py-[5px] ml-[-15px] first:ml-[-15px] border border-onclick-btnblue rounded bg-white text-onclick-btnblue font-inter text-xs font-medium scale-[.6]">
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Static card - Scholarships for female student */}
        <div className="absolute w-[266px] p-[7.919px] items-center rounded-[8.102px] border border-[#EEF] bg-[#FFF] shadow-[0px_0px_9.791px_rgba(5,2,160,0.08)] bottom-[175px] mr-[270px] scale-[.8]">
          <p className="self-stretch text-[#000] font-inter text-[8.929px] font-semibold leading-normal mb-[5.939px]">
            Scholarships for female student
          </p>
          <p className="self-stretch text-[#616161] font-inter text-[6.649px] font-semibold leading-normal opacity-60 line-clamp-2">
            <span className="font-bold">Description:</span> Free education upto 12th Std. to all i.e. tution fee will not be collected and the amount will be reimbursed by government
          </p>
        </div>

        {/* Placeholder for the image that would be part of a carousel */}
        <div className="absolute bottom-0 right-4">
          <div className="w-[360px] h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Person Image</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelfarePage;