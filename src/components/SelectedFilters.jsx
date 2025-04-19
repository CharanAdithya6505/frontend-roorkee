import React, { useContext, useEffect, useState, useMemo } from "react";
import FilterContext from "@/Context/FilterContext";
import { useAuth } from "@/Context/AuthContext";
import ToolTips from "./ComponentsUtils/tooltips";
import PreferenceContext from "@/Context/preferenceContext";
import { useRouter } from "next/router";
import { useProfile } from "@/Context/ProfileContext";

function SelectedFilters() {
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [isPreferenceApplied, setIsPreferenceApplied] = useState(false)
  const MAX_VISIBLE_FILTERS = 3; 
  
  // Helper function to render a filter button
const renderFilterButton = (filterValue, filterType) => {
  return (
    <button
      key={filterValue}
      data-testid='selected-filter'
      className="flex items-center justify-center px-2 py-[5px] border border-gray-400 rounded-[8px] bg-white text-[#3330BA] font-inter text-xs font-medium hover:border-onclick-btnblue hover:text-onclick-btnblue whitespace-nowrap"
      data-full-text={filterValue}
    >
      <span>
        {filterValue.length > 30 ? `${filterValue.substring(0, 30)}...` : filterValue}
      </span>
      <span
      data-testid="remove-filter"
        className="ml-2 text-gray-500 hover:text-red-500 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation(); // Prevents triggering parent button click
          handleRemoveFilter(filterType, filterValue);
        }}
      >
        ✕
      </span>
    </button>
  );
};
  
  const { profileData, setProfileData } = useProfile();
  const router = useRouter();



  const {
    states,
    setStates,
    statesFromApi,
    departments,
    setDepartments,
    beneficiaries,
    setBeneficiaries,
    sponsoredBy,
    setSponsoredBy,
    setFundingBy,
    handleRemoveFilter,
    setProfileFieldData
  } = useContext(FilterContext);
  // console.log(states);
  const { authState } = useAuth();
  const newSponser = useMemo(
    () => (sponsoredBy[1] && sponsoredBy[1][0] !== "State" ? sponsoredBy[1] : []),
    [sponsoredBy]
  );
  
  const newState = useMemo(() => states[1] || [], [states]);
  
  const newDepartment = useMemo(() => Object.keys(departments), [departments]);
  

  useEffect(() => {
    const fetchEmailData = async () => {
      if (authState.token) {
      }
    };

    fetchEmailData();
  }, []);

  const clearAllFilters = () => {
    setStates([]);
    setDepartments({});
    setBeneficiaries([]);
    setFundingBy([]);
    setSponsoredBy([]);
    setShowAllFilters(false); 
  };

  const handleDefaultFilter = () => {
    if (!authState.token) {
      router.push("/login");
      return;
    }

    if (isPreferenceApplied){
      setIsPreferenceApplied(false)
      setProfileFieldData({})
      setBeneficiaries([])
      setStates([])
      return;
    }
    setIsPreferenceApplied(true)
    const preferenceData = profileData;
    if (!preferenceData) {
      return;
    }
    if (preferenceData){
      setProfileFieldData(preferenceData)
    }

    // Apply user preferences
    if (preferenceData?.community) {
      setBeneficiaries([preferenceData.community]);
    }

    const selectedValue = preferenceData?.state;
    const selectedState = statesFromApi.find(
      (it) => it.state_name === selectedValue
    );

    if (selectedState) {
      setStates([[selectedState.id], [selectedState.state_name]]);
    } else {
      setStates([]);
    }
  };
  const logUserEvent = async (eventType, schemeId = null, details = {}) => {
    const eventBody = {
      event_type: eventType,
      ...(schemeId && { scheme_id: schemeId }),
      details: details,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/log/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify(eventBody),
        }
      );

      if (!response.ok) {
        console.error("Failed to log event");
      }

      const data = await response.json();
      console.log("Event logged successfully:", data);
    } catch (error) {
      console.error("Error logging event:", error);
    }
  };
  if (
    newSponser.length > 0 ||
    newState.length > 0 ||
    newDepartment.length > 0 ||
    beneficiaries.length > 0
  ) {
    logUserEvent("filter", null, {
      newSponser,
      newState,
      newDepartment,
      beneficiaries,
    });
  }

  return newSponser.length > 0 ||
  newState.length > 0 ||
  newDepartment.length > 0 ||
  beneficiaries.length > 0 ? (
  <div className="flex justify-between">
    {/* Left side with filters */}
    <div className="flex-1 mr-4 overflow-hidden">
      <p className="text-gray-600 sm:text-sm mb-1 mt-[1rem] text-[16px]">
        Selected Filters
      </p>
      {/* Scrollable container for filters */}
      <div className="mt-0 mb-5 overflow-x-auto pb-2 pr-2">
        <div className="flex gap-2 flex-wrap">
          {/* Combine all filters for easier management */}
          {(() => {
            // Combine all filters into one array with their types
            const allFilters = [
              ...newState.map(state => ({ value: state, type: "state" })),
              ...newDepartment.map(dept => ({ value: dept, type: "department" })),
              ...beneficiaries.map(ben => ({ value: ben, type: "beneficiaries" })),
              ...newSponser.map(sponsor => ({ value: sponsor, type: "sponsoredBy" }))
            ];
            
            const totalFilters = allFilters.length;
            const filtersToDisplay = showAllFilters ? allFilters : allFilters.slice(0, MAX_VISIBLE_FILTERS);
            
            return (
              <>
                {filtersToDisplay.map(filter => renderFilterButton(filter.value, filter.type))}
                
                <div className="block w-full">
  {totalFilters > MAX_VISIBLE_FILTERS && (
    <button
      onClick={() => setShowAllFilters(!showAllFilters)}
      className="text-[12px] text-gray-600 px-1 py-0 font-medium translate-y-1"
    >
      {showAllFilters ? `Show Less` : `Show All (${totalFilters - MAX_VISIBLE_FILTERS})`}
    </button>
  )}
</div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
    
    {/* Right side with preference button - fixed width */}
    <div className="flex-shrink-0 w-[140px] mt-4 z-10">
      <ToolTips tooltip="Set Your Preferences Here">
        <button
          className="w-full px-4 py-2 rounded-lg border border-gray-400 bg-[#3330BA] text-white font-inter text-[12px] font-medium sm:text-sm"
          onClick={handleDefaultFilter}
        >
          My Preference
        </button>
      </ToolTips>
    </div>
  </div>
) : (
  <div className="flex justify-between mt-[1rem]">
    <div className="mt-0 mb-5 flex gap-2 flex-wrap">
      <div>
        <p className="text-gray-600 sm:text-sm mb-1 text-[16px]">
          Selected Filters
        </p>
        <button className="flex items-center justify-center pr-2 pl-2 py-[4px] border border-gray-400 rounded-[8px] bg-white text-[#3330BA] font-inter text-xs font-medium hover:border-onclick hover:text-onclick-btnblue">
          None
        </button>
      </div>
    </div>
    <div className="flex-shrink-0 w-[140px] z-0">
      <ToolTips tooltip={`${isPreferenceApplied ? "Clear your preferences" : "Apply your preference"}`}>
        <button
          className={`w-full px-4 py-2 font-inter text-[12px] font-medium sm:text-sm rounded-lg
          ${isPreferenceApplied ? 'bg-[#3330BA] text-white border-gray-400 hover:border-onclick-btnblue hover:bg-[#3330BA]'
        : 'border border-gray-400 bg-white text-[#3330BA]'}`}
          onClick={handleDefaultFilter}
        >
          My Preference
        </button>
      </ToolTips>
    </div>
  </div>
);

}
export default SelectedFilters
