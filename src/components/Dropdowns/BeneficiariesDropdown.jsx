import React, { useContext, useEffect, useRef, useState } from "react";
import FilterContext from "@/Context/FilterContext";
import PageContext from "@/Context/PageContext";
const DropdownMenu = () => {
  const { setCurrentPage } = useContext(PageContext);
  const uniqueCategories = ["EWS", "OBC", "SC", "ST"];

  const { beneficiaries, setBeneficiaries } = useContext(FilterContext);
  const handleItemClick = (value) => {
    setCurrentPage(1);
    // const value = item == "SC / ST" ? "SC" : item;
    if (beneficiaries.includes(value)) {
      setBeneficiaries((prev) => prev.filter((option) => option !== value));
    } else {
      setBeneficiaries((prev) => [...prev, value]);
    }
  };
  return (
    <div 
    data-testid="beneficiaries-dropdown"
    className="text-[#616161] bg-[rgb(255,255,255)] w-[200] max-w-[600px] flex flex-col whitespace-wrap z-50 text-[14px] mt-0 ">
      <ul className="flex flex-col font-sans list-none p-0 m-0 gap-0 pb-[18px]">
        {uniqueCategories.map((item, index) => (
          <li
            key={item + index}
            className="flex items-center justify-between hover:bg-gray-100 p-[8px] cursor-pointer hover:rounded-[8px]"
            onClick={() => handleItemClick(item == "SC / ST" ? "SC" : item)}
          >
            <div>
              <p className="leading-5 overflow-hidden overflow-ellipsis line-clamp-2 max-h-10">
                {item}
              </p>
            </div>
            <div className="w-[16.5] h-[16.5]">
              <input
                type="checkbox"
                value={item}
                checked={beneficiaries.includes(
                  item == "SC / ST" ? "SC" : item
                )}
                className="ml-10 custom-checkbox pointer-events-none w-full h-full"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;
