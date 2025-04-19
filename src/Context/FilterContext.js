import { createContext, useState, useEffect } from 'react';

const FilterContext = createContext();

function FilterProvider({ children }) {
    const [states, setStates] = useState([]);
    const [departments, setDepartments] = useState({});
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [profileFieldData, setProfileFieldData] = useState({});
    const [fundingBy, setFundingBy] = useState([]);
    const [sponsoredBy, setSponsoredBy] = useState([]);
    const [statesFromApi, setStatesFromApi] = useState([]);

    useEffect(() => {
        async function fetchedStates() {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/states/`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            } else {
                const data = await res.json();
                const dataFromLocalStorage = JSON.parse(localStorage.getItem("profiledata"));

                if (dataFromLocalStorage?.community) {
                    setBeneficiaries([dataFromLocalStorage.community]);
                } else {
                    setBeneficiaries([]);
                }

                const selectedValue = dataFromLocalStorage?.state;
                const selectedState = data.find(it => it.state_name === selectedValue);
                if (selectedState) {
                    setStates([[selectedState.id], [selectedState.state_name]]);
                } else {
                    setStates([]);
                }

                setStatesFromApi(data);
            }
        }
        fetchedStates();
    }, []);

    const handleRemoveFilter = (filterType, value) => {
      switch (filterType) {
        case "state":
          setStates((prev) => {
            if (!prev[1] || prev[1].length === 0) return prev; // No change if empty
    
            const indexToRemove = prev[1].indexOf(value); // Find index of state name
            if (indexToRemove === -1) return prev; // Value not found, no change
    
            const updatedIds = [...prev[0]];
            const updatedNames = [...prev[1]];
            
            updatedIds.splice(indexToRemove, 1); // Remove the corresponding ID
            updatedNames.splice(indexToRemove, 1); // Remove the name
    
            return updatedNames.length > 0 ? [updatedIds, updatedNames] : [[], []]; // Keep structure intact
          });
          break;
    
        case "department":
          setDepartments((prev) => {
            const newDepartments = { ...prev };
            delete newDepartments[value];
            return newDepartments;
          });
          break;
          case "sponsoredBy":
            setSponsoredBy((prev) => {
              if (!prev.length || !prev[1]) return []; // If empty, reset everything
          
              const updatedSponsors = prev[1].filter((item) => item !== value);
          
              if (updatedSponsors.length === 0) {
                return []; // Clear sponsoredBy when all are removed
              }
          
              return [prev[0], updatedSponsors]; // Keep the first part, update second
            });
            break;
          
        case "beneficiaries":
          setBeneficiaries((prev) => prev.filter((item) => item !== value));
          break;
        default:
          break;
      }
    };
    
            

    return (
        <FilterContext.Provider value={{
            states, setStates,
            departments, setDepartments,
            beneficiaries, setBeneficiaries,
            fundingBy, setFundingBy,
            sponsoredBy, setSponsoredBy,
            statesFromApi, setStatesFromApi,
            profileFieldData, setProfileFieldData,
            handleRemoveFilter 
        }}>
            {children}
        </FilterContext.Provider>
    );
};

export default FilterContext;
export { FilterProvider };
