import FilterContext from "@/Context/FilterContext";
import Router from "next/router";
import { useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";


const PreferencesModal = () => {
const { states, setStates, statesFromApi, setBeneficiaries } = useContext(FilterContext);
const { authState } = useAuth();
const [profileData, setProfileData] = useState({});
const [loading, setLoading] = useState(true);
const [fields, setFields] = useState([]);
const [showConfirmDialog, setShowConfirmDialog] = useState(false);
const modalRef = useRef(null);

const handleOnClickApplyPreferences = () => {
    handleSave();
    Router.push("/AllSchemes");
};

const handleSkip = () => {
    setShowConfirmDialog(true);
};

const handleConfirmSkip = () => {
    setShowConfirmDialog(false);
    Router.push("/AllSchemes");
};


useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
    document.body.classList.remove("overflow-hidden");
    };
}, []);



useEffect(() => {
    const fetchProfileData = async () => {
    setLoading(true);
    try {
        // Only fetch profile data if user is logged in
        if (authState.token) {
        const requestOptions = {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
            },
        };

        const profileResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile/`,
            requestOptions
        );
        const pData = await profileResponse.json();

        setProfileData({
            ...profileData,
            ...Object.entries(pData.dynamic_fields || {}).reduce((acc, [key, value]) => {
            acc[key.toLowerCase().replace(" ", "_")] = value;
            return acc;
            }, {}),
        });
        }
    } catch (error) {
        console.error("Error fetching profile data:", error);
    } finally {
        setLoading(false);
    }
    };

    fetchProfileData();
}, [authState.token]);

useEffect(() => {
    const fetchProfileFields = async () => {
    setLoading(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dynamic-fields/`);
        if (!response.ok) {
        throw new Error(`Failed to fetch fields: ${response.statusText}`);
        }
        const data = await response.json();
        setFields(data.profile_fields);
    } catch (error) {
        console.error("Failed to fetch profile fields", error);
    } finally {
        setLoading(false);
    }
    };

    fetchProfileFields();
}, []);

const handleChange = (e, field) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
    ...prevData,
    [name]: value,
    }));

    // Handle special cases for beneficiaries and states
    if (name === 'community' || name === 'category') {
    setBeneficiaries([value]);
    } else if (name === 'state') {
    statesFromApi.forEach((it) => {
        if (value === it.id) {
        setStates([[it.id], [it.state_name]]);
        }
    });
    }
};

const handleSave = async () => {
    // Apply filters based on selected preferences even for non-logged in users
    const dynamicFields = fields.reduce((acc, field) => {
    const key = field.name;
    const value = profileData[key.toLowerCase().replace(" ", "_")];
    if (value) acc[key] = value;
    return acc;
    }, {});
    
    // Apply local filter changes regardless of authentication
    // Update beneficiaries and states based on profileData
    Object.entries(profileData).forEach(([key, value]) => {
    if (key === 'community' || key === 'category') {
        setBeneficiaries([value]);
    } else if (key === 'state') {
        statesFromApi.forEach((it) => {
        if (value === it.id) {
            setStates([[it.id], [it.state_name]]);
        }
        });
    }
    });
    
    // Only save to API if user is logged in
    if (authState.token) {
    const requestOptions = {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({
        dynamic_fields: dynamicFields,
        }),
    };

    try {
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile/`,
        requestOptions
        );

        if (!response.ok) {
        throw new Error("Failed to save profile data.");
        }
    } catch (error) {
        console.error("Error saving profile data:", error);
    }
    }
    
};

const renderField = (field) => {
    switch (field.type) {
    case "choice":
        return (
        <div key={field.id} className="flex-1 mb-4">
            <label className="block mb-2 text-xs sm:text-sm font-semibold text-gray-700">
            {field.name}
            </label>
            <select
            name={field.name.toLowerCase().replace(" ", "_")}
            className="w-full h-[44px] border border-gray-300 p-2 rounded-lg bg-gray-100 text-sm font-semibold text-black focus:ring focus:ring-blue-300"
            value={profileData[field.name.toLowerCase().replace(" ", "_")] || ""}
            onChange={(e) => handleChange(e, field)}
            >
            <option value="">Select {field.name}</option>
            {field.choices.map((choice) => (
                <option key={choice} value={choice}>
                {choice}
                </option>
            ))}
            </select>
        </div>
        );
    case "integer":
        return (
        <div key={field.id} className="flex-1 mb-4">
            <label className="block mb-2 text-xs sm:text-sm font-semibold text-gray-700">
            {field.name}
            </label>
            <input
            type="text"
            inputMode="numeric" 
            name={field.name.toLowerCase().replace(" ", "_")}
            className="w-full h-[44px] border border-gray-300 p-2 rounded-lg bg-gray-100 text-sm font-semibold text-black focus:ring focus:ring-blue-300"
            placeholder={field.placeholder || `Enter your ${field.name}`}
            value={profileData[field.name.toLowerCase().replace(" ", "_")] ?? ""}
            onChange={(e) => {
                let rawValue = e.target.value;
                rawValue = rawValue.replace(/[^0-9-]/g, "");
                if (rawValue.includes("-") && rawValue.indexOf("-") !== 0) {
                rawValue = rawValue.replace("-", "");
                }
                let value = rawValue === "-" ? rawValue : Number.parseInt(rawValue, 10);
                if (isNaN(value)) {
                value = "";
                }
                if (value !== "" && field.min_value !== undefined) value = Math.max(field.min_value, value);
                if (value !== "" && field.max_value !== undefined) value = Math.min(field.max_value, value);
                handleChange({ target: { name: e.target.name, value } }, field);
            }}
            />
        </div>
        );
    case "char":
        return (
        <div key={field.id} className="flex-1 mb-4">
            <label className="block mb-2 text-xs sm:text-sm font-semibold text-gray-700">
            {field.name}
            </label>
            <input
            type="text"
            name={field.name.toLowerCase().replace(" ", "_")}
            className="w-full h-[44px] border border-gray-300 p-2 rounded-lg bg-gray-100 text-sm font-semibold text-black focus:ring focus:ring-blue-300"
            placeholder={field.placeholder || `Enter your ${field.name}`}
            value={profileData[field.name.toLowerCase().replace(" ", "_")] || ""}
            onChange={(e) => handleChange(e, field)}
            />
        </div>
        );
    case "boolean":
        return (
        <div key={field.id} className="flex-1 mb-4">
            <label className="block mb-2 text-xs sm:text-sm font-semibold text-gray-700">
            {field.name}
            </label>
            <select
            name={field.name.toLowerCase().replace(" ", "_")}
            className="w-full h-[44px] border border-gray-300 p-2 rounded-lg bg-gray-100 text-sm font-semibold text-black focus:ring focus:ring-blue-300"
            value={profileData[field.name.toLowerCase().replace(" ", "_")] || ""}
            onChange={(e) => handleChange(e, field)}
            >
            <option value="">Select {field.name}</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            </select>
        </div>
        );
    case "date":
        return (
        <div key={field.id} className="flex-1 mb-4">
            <label className="block mb-2 text-xs sm:text-sm font-semibold text-gray-700">
            {field.name}
            </label>
            <input
            type="date"
            name={field.name.toLowerCase().replace(" ", "_")}
            className="w-full h-[44px] border border-gray-300 p-2 rounded-lg bg-gray-100 text-sm font-semibold text-black focus:ring focus:ring-blue-300"
            value={profileData[field.name.toLowerCase().replace(" ", "_")] || ""}
            onChange={(e) => handleChange(e, field)}
            />
        </div>
        );
    default:
        return null;
    }
};

// Group fields in pairs for responsive layout
const createFieldPairs = (fieldsArray) => {
    const pairs = [];
    for (let i = 0; i < fieldsArray.length; i += 2) {
    pairs.push(fieldsArray.slice(i, i + 2));
    }
    return pairs;
};

const fieldPairs = createFieldPairs(fields);

return (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md z-50">
  {/* Modal Container */}
  
  <div className="flex flex-col bg-white shadow-xl w-[90%] sm:w-[720px] max-h-[85vh] overflow-hidden animate-fadeIn rounded-xl">
  
  {/* Navbar Inside Modal */}
  <div className="bg-[#EEEEFF] text-black flex items-center justify-between py-2 px-6 shadow-md">
    
    {/* Left Section: Logo & Launchpad */}
    <div className="flex items-center ">
    <div
          className="sm:text-[16px] mt-2 font-semibold text-[#3431BB] text-sm hover:text-blue-700 cursor-pointer flex items-center  gap-2 "
     
        >
         <svg xmlns="http://www.w3.org/2000/svg"  width="50"
            height="50"
            viewBox="0 0 350 350" fill="none">
<line x1="178" y1="224.048" x2="178" y2="182" stroke="white" stroke-width="40"/>
<rect width="350" height="350" fill="#EEEEFF"/>
<path d="M295.5 250.878C295.5 254.069 293.524 258.023 287.813 262.439C282.176 266.797 273.675 270.96 262.679 274.556C240.746 281.729 210.1 286.257 176 286.257C141.9 286.257 111.254 281.729 89.3212 274.556C78.3248 270.96 69.824 266.797 64.1873 262.439C58.4763 258.023 56.5 254.069 56.5 250.878C56.5 247.688 58.4763 243.733 64.1873 239.318C69.824 234.96 78.3248 230.797 89.3212 227.201C111.254 220.028 141.9 215.5 176 215.5C210.1 215.5 240.746 220.028 262.679 227.201C273.675 230.797 282.176 234.96 287.813 239.318C293.524 243.733 295.5 247.688 295.5 250.878Z" stroke="#3330BA" stroke-width="11"/>
<path d="M295.745 189.052C296.816 172.185 294.51 155.271 288.97 139.35C283.43 123.429 274.772 108.836 263.528 96.4695C252.284 84.1026 238.691 74.2221 223.585 67.435C208.479 60.6479 192.178 57.0975 175.684 57.002C159.19 56.9064 142.851 60.2677 127.671 66.8794C112.491 73.491 98.7902 83.2134 87.4105 95.4492C76.0307 107.685 67.2122 122.176 61.4967 138.032C55.7812 153.888 53.2893 170.774 54.1743 187.653L66.2569 186.987C65.4604 171.797 67.7031 156.599 72.847 142.329C77.991 128.058 85.9276 115.017 96.1694 104.004C106.411 92.992 118.742 84.2419 132.404 78.2914C146.066 72.341 160.771 69.3158 175.616 69.4018C190.46 69.4878 205.131 72.6831 218.726 78.7915C232.322 84.8999 244.555 93.7923 254.675 104.923C264.795 116.053 272.587 129.186 277.573 143.515C282.559 157.844 284.634 173.066 283.67 188.247L295.745 189.052Z" fill="#3330BA"/>
<line x1="54" y1="192.5" x2="126" y2="192.5" stroke="#3330BA" stroke-width="11"/>
<line x1="231" y1="192.5" x2="296" y2="192.5" stroke="#3330BA" stroke-width="11"/>
<line x1="127.5" y1="184" x2="127.5" y2="150" stroke="#3330BA" stroke-width="11"/>
<line x1="127.5" y1="198" x2="127.5" y2="156" stroke="#3330BA" stroke-width="11"/>
<path d="M151 191.042L181.369 159.618" stroke="#3330BA" stroke-width="11"/>
<line x1="180.712" y1="166.288" x2="204.754" y2="190.329" stroke="#3330BA" stroke-width="10.5"/>
<line x1="188.304" y1="249.66" x2="277.037" y2="267.987" stroke="#3330BA" stroke-width="11"/>
<line x1="74.8876" y1="268.773" x2="167.66" y2="249.614" stroke="#3330BA" stroke-width="11"/>
<line x1="163.5" y1="255" x2="163.5" y2="223" stroke="#3330BA" stroke-width="11"/>
<line x1="192.5" y1="255" x2="192.5" y2="223" stroke="#3330BA" stroke-width="11"/>
<line x1="178.501" y1="285.089" x2="177.501" y2="223.089" stroke="#3330BA" stroke-width="11"/>
<line x1="203.5" y1="221" x2="203.5" y2="187" stroke="#3330BA" stroke-width="11"/>
<line x1="152.5" y1="221" x2="152.5" y2="187" stroke="#3330BA" stroke-width="11"/>
<path d="M226.5 198V155" stroke="#3330BA" stroke-width="11"/>
<line x1="125.505" y1="154.016" x2="182.505" y2="104.016" stroke="#3330BA" stroke-width="10.6"/>
<line x1="179.854" y1="109.177" x2="228.204" y2="159.177" stroke="#3330BA" stroke-width="11"/>
<line x1="178" y1="205" x2="178" y2="222" stroke="#EEEEFF" stroke-width="40"/>
</svg>

<div className="mt-1">LAUNCHPAD</div>
</div>
</div>

    {/* Center Section: Profile */}
  

    <div></div>
  </div>

  {/* Modal Content */}
  <div className="p-6">
    <h2 className="text-lg sm:text-xl font-semibold mb-4">
      Tell us a little more about yourself
    </h2>
    <p className="text-sm text-gray-600">
      Knowing you will help us find relevant schemes and job opportunities for you.
    </p>
  </div>
        {loading ? (
        <div className="flex items-center justify-center w-full h-32 ">
            <div className="w-8 h-8 border-4 border-t-transparent border-[#3431BB] border-solid rounded-full animate-spin"></div>
        </div>
        ) : (
        <>
            {/* Form Inputs */}
            <div className="p-6 space-y-4 w-full overflow-y-auto flex-1">
            {fieldPairs.map((pair, pairIndex) => (
                <div key={pairIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {pair.map((field) => renderField(field))}
                </div>
            ))}
            </div>

            {/* Footer Message */}
            <div className="flex items-center gap-2 bg-[#EEEEFF] text-gray-700 p-3 rounded-lg mt-4">
            <span>ℹ️</span>
            {authState.token ? 
                "You can edit your details later as well." : 
                "Sign in to save your preferences for future visits."}
            </div>

            {/* Apply and Skip Buttons */}
            <div className="flex justify-between mt-4 gap-4 w-full p-4 pt-0">
            <button
                onClick={handleOnClickApplyPreferences}
                className="w-full sm:w-auto px-6 py-2 rounded-lg bg-[#3431BB] text-white font-semibold hover:bg-blue-700 transition-all"
            >
                Apply preferences
            </button>
            <button
                onClick={handleSkip}
                className="w-full sm:w-auto px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
            >
                Skip
            </button>
            </div>
        </>
        )}
    </div>
    {/* Confirmation Dialog */}
<Transition appear show={showConfirmDialog} as={Fragment}>
  <Dialog as="div" className="relative z-[60]" onClose={() => setShowConfirmDialog(false)}>
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-black bg-opacity-25" />
    </Transition.Child>

    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              Warning
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
              Your preferences won’t be saved, which may affect your recommendations. Do you want to Skip now?
              </p>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none"
                onClick={handleConfirmSkip}
              >
                Skip now
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div>
  </Dialog>
</Transition>
    </div>
);
};

export default PreferencesModal;

