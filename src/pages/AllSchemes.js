import NavBarScheme from "@/components/SchmesNavbar";
import Tabs from "@/components/Tabs";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import DepartmentDropdownMenu from "../components/Dropdowns/DepartmentDropDown";
import SponsorsDropdownMenu from "@/components/Dropdowns/SponsorDropdown";
import BeneficiariesDropdown from "@/components/Dropdowns/BeneficiariesDropdown";
import FilterContext from "@/Context/FilterContext";
import SchemeVerifiedStatus from "@/components/SchemeEmailVerification";
import img from '../assets/img.png';
import Footer from "@/components/Footer";
import FeedbackButton from "@/components/feedBack";

const SchemesAll = () => {
  const {
    states,
    setStates,
    departments,
    setDepartments,
    beneficiaries,
    setBeneficiaries,
    setFundingBy,
    sponsoredBy,
    setSponsoredBy,
  } = useContext(FilterContext);

  const [bannerImage, setBannerImage] = useState("");
  const [dropDownStates, setDropDownStates] = useState({
    dropDownOpen: false,
    departmentOpen: false,
    beneficiaryOpen: false,
    sponsoredOpen: false,
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedStates, setSelectedStates] =useState([]);

  const handleStatesChange = (states) => {
    setSelectedStates(states);
  };

  const backUpBannerImage =
    "/_next/image?url=http%3A%2F%2F65.0.103.91%2Fmedia%2Fbanners%2FScheme_details_page_banner_TvdKXuh.png&w=3840&q=75";

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banners/`)
      .then((response) => response.json())
      .then((data) => {
        const activeBanner = data.find((banner) => banner.is_active);
        if (activeBanner) {
          setBannerImage(activeBanner.image);
        }
      })
      .catch((error) => console.error("Error fetching banner image:", error));
  }, []);

  const toggleDropdown = (key) => {
    setDropDownStates((prevState) => {
      const newState = { ...prevState, [key]: !prevState[key] };
      if (!prevState[key]) {
        // Close other dropdowns when opening a new one
        Object.keys(prevState).forEach((dropdownKey) => {
          if (dropdownKey !== key) {
            newState[dropdownKey] = false;
          }
        });
      }
      return newState;
    });
  };

  const clearAllFilters = () => {
    setStates([]);
    setDepartments({});
    setBeneficiaries([]);
    setSponsoredBy([]);
    setDropDownStates({
      sponsoredOpen: false,
      departmentOpen: false,
      beneficiaryOpen: false,
    });
  };


  const isDepartmentVisible = (states.length > 0 && states[0].length > 0 )  || (sponsoredBy[0]?.[0] === 2 );
  const isBeneficiaryVisible = (states.length > 0 && states[0].length > 0 ) || sponsoredBy[0]?.[0] === 2;




  const handleFilterButtonClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  // console.log("new state added", sponsoredBy);

  return (
    <div className="overflow-y-auto">
      <NavBarScheme />
      <SchemeVerifiedStatus />

      {/* Banner Image */}
      <div className="relative max-w-[90%] mx-auto mb-[16px] sm:mb-8 mt-[2rem] sm:block hidden">
        <div className="relative w-full ">
          <Image
            src={img || bannerImage || backUpBannerImage}
            alt="Loading Image..."
            layout="responsive"
            width={100}
            height={50}
            className="rounded-[15px] object-contain "
          />
        </div>
      </div>

      <div className="max-w-[90%] mx-auto flex flex-col md:flex-row ">
        <div className="flex-1 md:max-w-[25%] p-4 md:mr-2 order-2 md:order-1 hidden md:block py-[1rem]">
          <div className="sticky bg-white z-0 top-0">
            <div className="flex justify-between items-center">
              <h1 className="m-0 font-semibold ml-2">Filters</h1>
              <button
                className="text-[#3431BB] font-semibold hover:rounded-lg m-0 hidden md:block"
                onClick={clearAllFilters}
              >
                Clear all filters
              </button>
            </div>
            <hr className="my-4 border-t border-gray-300" />
          </div>

          {/* Filters Section with Scrollable Content, no scrollbar */}
          <div className="flex space-between ml-1 hidden md:block max-h-[70vh] overflow-y-auto scrollbar-none">
            {/* Sponsored By Dropdown */}
            <div
              data-testid="sponsored-button"
              className="flex justify-between items-center hover:bg-[#EEEEFF] hover:rounded-md hover:text-onclick-btnblue p-[4px] pb-2 pr-2"
              onClick={() => toggleDropdown("sponsoredOpen")}
            >
              <span>Sponsored By</span>
              {dropDownStates.sponsoredOpen ? (
                <IoIosArrowUp className="text-black" />
              ) : (
                <IoIosArrowDown className="text-black" />
              )}
            </div>
            {dropDownStates.sponsoredOpen && (
              <SponsorsDropdownMenu onStatesChange={handleStatesChange} />
            )}

            {/* Department Dropdown */}
            {isDepartmentVisible && (
              <div
                data-testid="department-button"
                className="flex justify-between items-center hover:bg-[#EEEEFF] hover:rounded-md hover:text-onclick-btnblue p-[4px] pr-2 pb-2"
                onClick={() => toggleDropdown("departmentOpen")}
              >
                <span>Department</span>
                {dropDownStates.departmentOpen ? (
                  <IoIosArrowUp className="text-black" />
                ) : (
                  <IoIosArrowDown className="text-black" />
                )}
              </div>
            )}
            {isDepartmentVisible && dropDownStates.departmentOpen && (
              <DepartmentDropdownMenu/>
            )}

            {/* Beneficiaries Dropdown */}
            {isBeneficiaryVisible && (
              <div
                data-testid="beneficiaries-button"
                className="flex justify-between items-center hover:bg-[#EEEEFF] hover:rounded-md hover:text-onclick-btnblue p-[4px] pr-2 pb-2"
                onClick={() => toggleDropdown("beneficiaryOpen")}
              >
                <span>Beneficiaries</span>
                {dropDownStates.beneficiaryOpen ? (
                  <IoIosArrowUp className="text-black" />
                ) : (
                  <IoIosArrowDown className="text-black" />
                )}
              </div>
            )}
            {isBeneficiaryVisible && dropDownStates.beneficiaryOpen && (
              <BeneficiariesDropdown />
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="flex-1 md:max-w-[75%] order-1 md:order-2">
          <Tabs />
        </div>
      </div>

      <div className="mt-[1rem]">
        <Footer />
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button
          className="bg-[#3431BB] text-white py-2 px-4 rounded-full"
          onClick={handleFilterButtonClick}
        >
          Filter
        </button>
      </div>

      {/* Filter Modal (Mobile only) */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] sm:w-[50%] max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button
                onClick={handleCloseFilterModal}
                className="text-red-500 hover:text-red-700"
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              {/* Sponsored By Dropdown */}
              <div
                className="flex justify-between items-center"
                onClick={() => toggleDropdown("sponsoredOpen")}
              >
                <span>Sponsored By</span>
                {dropDownStates.sponsoredOpen ? (
                  <IoIosArrowUp className="text-black" />
                ) : (
                  <IoIosArrowDown className="text-black" />
                )}
              </div>
              {dropDownStates.sponsoredOpen && <SponsorsDropdownMenu />}

              {/* Department Dropdown */}
              {isDepartmentVisible && (
                <div
                  className="flex justify-between items-center"
                  onClick={() => toggleDropdown("departmentOpen")}
                >
                  <span>Department</span>
                  {dropDownStates.departmentOpen ? (
                    <IoIosArrowUp className="text-black" />
                  ) : (
                    <IoIosArrowDown className="text-black" />
                  )}
                </div>
              )}
              {isDepartmentVisible && dropDownStates.departmentOpen && (
                <DepartmentDropdownMenu />
              )}

              {/* Beneficiaries Dropdown */}
              {isBeneficiaryVisible && (
                <div
                  className="flex justify-between items-center"
                  onClick={() => toggleDropdown("beneficiaryOpen")}
                >
                  <span>Beneficiaries</span>
                  {dropDownStates.beneficiaryOpen ? (
                    <IoIosArrowUp className="text-black" />
                  ) : (
                    <IoIosArrowDown className="text-black" />
                  )}
                </div>
              )}
              {isBeneficiaryVisible && dropDownStates.beneficiaryOpen && (
                <BeneficiariesDropdown />
              )}
            </div>

            {/* Clear All Filters Button */}
            <div className="mt-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-full w-full sm:hidden"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemesAll;
