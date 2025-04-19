import React, { useContext, useEffect, useRef, useState } from "react";
import FilterContext from "@/Context/FilterContext";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import PageContext from "@/Context/PageContext";
import DropdownMenu from "@/components/Dropdowns/Dropdowns";

const SponsorDropdownMenu = () => {
  const { setCurrentPage } = useContext(PageContext);
  const { sponsoredBy, setSponsoredBy, states, setStates, statesFromApi } =
    useContext(FilterContext);

  const uniqueCategories = [
    [2, "Central"],
    [1, "State"],
  ];

  const handleItemClick = (value) => {
    setCurrentPage(1);
    if (sponsoredBy.length !== 0 && sponsoredBy[0].includes(value[0])) {
      setSponsoredBy([]); // Deselect if already selected
    } else {
      if (value[0] === 2) {
        setStates([]); // Clear states if Central is selected
      }
      setSponsoredBy([[value[0]], [value[1]]]); // Set new selection
    }
  };

  // console.log(states);

  return (
    <div 
    data-testid="sponsored-dropdown"
    className="text-[#616161] bg-[rgb(255,255,255)] w-[200] max-w-[600px] flex flex-col whitespace-wrap z-50 text-[14px] mt-0 ">
      <ul className="flex flex-col font-sans list-none p-0 m-0 gap-0 pb-[18px]">
        {uniqueCategories.map((item, index) => (
          <li
            key={item + index}
            data-testid='sponsored-option'
            className="flex items-center justify-between hover:bg-gray-100 p-[8px] cursor-pointer hover:rounded-[8px]"
            onClick={() => handleItemClick(item)}
          >
            <div data-testid="sponsored-option">
              <p className="flex leading-5 overflow-hidden overflow-ellipsis line-clamp-2 max-h-10 text-black">
                {item[1]}
                {item[1] === "State" &&
                states.length > 0 &&
                states[1]?.[0]?.length > 0 ? (
                  <span className="w-5 h-5 bg-[#EEEEFF] text-onclick-btnblue text-[12px] font-semibold rounded-full flex items-center justify-center ml-2">
                    {states[1].length}
                  </span>
                ) : (
                  <></>
                )}
              </p>
            </div>

            {item[0] !== 1 && (
              <div className="w-[16.5] h-[16.5]">
                <input
                  type="checkbox"
                  value={item}
                  checked={
                    sponsoredBy.length !== 0
                      ? sponsoredBy[0].includes(item[0])
                      : false
                  }
                  className="ml-10 custom-checkbox pointer-events-none w-full h-full"
                />
              </div>
            )}

            {item[0] === 1 &&
              sponsoredBy.length !== 0 &&
              sponsoredBy[0][0] === 1 && (
                <IoIosArrowUp className="text-black" />
              )}

            {item[0] === 1 &&
              ((sponsoredBy.length !== 0 && sponsoredBy[0][0] !== 1) ||
                sponsoredBy.length === 0) && (
                <IoIosArrowDown className="text-black" />
              )}
          </li>
        ))}

        {sponsoredBy.length !== 0 && sponsoredBy[0][0] === 1 && (
          <DropdownMenu
            staticOptions={statesFromApi.map((state) => ({
              label: state.state_name,
              value: state.id,
            }))}
            contextState={states}
            setContextState={setStates}
          />
        )}
      </ul>
    </div>
  );
};

export default SponsorDropdownMenu;
