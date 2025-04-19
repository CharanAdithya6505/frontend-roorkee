import React, { useContext, useEffect, useState, useRef } from "react";
import FilterContext from "@/Context/FilterContext";
import PageContext from "@/Context/PageContext";

const DepartmentDropdownMenu = () => {
  const { setCurrentPage } = useContext(PageContext);
  const [allDepartments, setAllDepartments] = useState({});
  const { departments, setDepartments } = useContext(FilterContext);
  const onlyDepartments = useRef([]);
  const ids = useRef([]);

  useEffect(() => {
    async function fetchDepartments() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/departments/`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      } else {
        const data = await res.json();
        const onlyGroup = {};
        data.forEach((i) => {
          if (!Object.keys(onlyGroup).includes(i.group)) {
            onlyGroup[i.group] = [];
          }
          onlyGroup[i.group].push(i.id);
        });
        setAllDepartments(onlyGroup);
      }
    }
    fetchDepartments();
  }, []);

  // Loading state
  if (Object.keys(allDepartments).length === 0)
    return (
      <div className="text-onclick-btnblue text-[16px] mt-[-15px] mb-[7px]">
        loading...
      </div>
    );

  const uniqueCategories = Object.keys(allDepartments).sort((a, b) =>
    a.localeCompare(b)
  );

  const handleItemClick = (value) => {
    setCurrentPage(1); // Reset the current page to 1 on category selection
    const updatedDepartments = { ...departments };

    if (updatedDepartments[value]) {
      delete updatedDepartments[value]; // Remove category if already selected
    } else {
      updatedDepartments[value] = allDepartments[value]; // Add selected category
    }

    setDepartments(updatedDepartments); // Update the state in context
  };

  return (
    <div className="text-[#616161] bg-[rgb(255,255,255)] w-[200] max-w-[600px] flex flex-col whitespace-wrap z-50 text-[14px] mt-0"
    data-testid="department-dropdown" >
      <ul
        id="scroll-container"
        className="flex flex-col font-sans list-none m-0 gap-0 max-h-[300px] overflow-y-auto"
      >
        {uniqueCategories.map((item, index) => (
          <li
            key={item + index}
            className="flex items-center justify-between hover:bg-gray-100 p-[8px] cursor-pointer hover:rounded-[8px]"
            onClick={() => handleItemClick(item)}
          >
            <div>
              <p className="leading-5 overflow-hidden overflow-ellipsis line-clamp-2 max-h-10">
                {item}
              </p>
            </div>
            <div className="w-[16.5] h-[16.5]">
              <input
                type="checkbox"
                value={item.sort}
                checked={departments.hasOwnProperty(item)}
                className="ml-10 custom-checkbox pointer-events-none w-full h-full"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentDropdownMenu;
