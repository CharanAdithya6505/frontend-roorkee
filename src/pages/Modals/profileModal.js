import { useEffect, useRef, useState, useContext } from "react";
import { MdClose } from "react-icons/md";
import { useAuth } from "../../Context/AuthContext";
import { MdVerified } from "react-icons/md";
import { VscUnverified } from "react-icons/vsc";
import FilterContext from "@/Context/FilterContext";
import { values } from "lodash";
import { useProfile } from "@/Context/ProfileContext";

const ProfileModal = ({ onClose }) => {
  const { profileData, setProfileData } = useProfile();
  const { setStates, setBeneficiaries, statesFromApi } =
    useContext(FilterContext);

  const { authState } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailData, setEmailData] = useState(null);
  const [sentEmailText, setSentEmailText] = useState(false);
  const modalRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [fields, setFields] = useState([]);

  const fieldsCount = Object.keys(profileData).length;

  const resendEmail = async () => {
    setSentEmailText(true);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/resend-verification-email/`,
        requestOptions
      );

      if (response.ok) {
        setTimeout(() => {
          setSentEmailText(false);
        }, 3000); // Change button text back after 3 seconds
      }
    } catch (error) {
      console.error("Error resending email:", error);
      setSentEmailText(false); // Ensure the button resets even if there's an error
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (authState.token) {
        setLoading(true);
        try {
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
          console.log(pData, "fetching Saved data");

          setProfileData({
            ...profileData,
            name: pData.name || "",
            ...Object.entries(pData.dynamic_fields || {}).reduce(
              (acc, [key, value]) => {
                acc[key.toLowerCase().replace(" ", "_")] = value;
                return acc;
              },
              {}
            ),
          });
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [authState.token, isSaved]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const fetchEmailData = async () => {
      if (authState.token) {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          redirect: "follow",
        };

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile/`,
            requestOptions
          );
          const data = await response.json();
          setEmailData(data);
        } catch (error) {
          console.error("Error fetching email data:", error);
        }
      }
    };

    fetchEmailData();
  }, [authState.token]);

  useEffect(() => {
    const filledFields = Object.values(profileData).filter(
      (value) => typeof value === "string" && value.trim() !== ""
    ).length;
    console.log(profileData);

    const percentage = Math.round((filledFields / fieldsCount) * 100);
    setProgress(percentage);
  }, [profileData]);

  useEffect(() => {
    const fetchProfileFields = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dynamic-fields/`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch fields: ${response.statusText}`);
        }
        const data = await response.json();
        setFields(data.profile_fields);
      } catch (error) {
        console.error("Failed to fetch profile fields", error);
      }
    };

    fetchProfileFields();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (authState.token) {
      const dynamicFields = fields.reduce((acc, field) => {
        const key = field.name;
        const value = profileData[key.toLowerCase().replace(" ", "_")];
        if (value) acc[key] = value;
        return acc;
      }, {});

      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({
          name: profileData.name,
          dynamic_fields: dynamicFields, // Add dynamic fields here
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

        setIsSaved(true);
        onClose();
      } catch (error) {
        console.error("Error saving profile data:", error);
      }
    }
  };

  const handleSliderChange = (e) => {
    const { value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      income: value,
    }));
  };

  const renderField = (field) => {
    switch (field.type) {
      case "choice":
        return (
          <div key={field.id} className="flex-1">
            <label className="block mb-2 text-[14px] font-semibold text-[#000000]">
              {field.name}
            </label>
            <select
              name={field.name.toLowerCase().replace(" ", "_")}
              className="w-full h-[44px] border border-gray-300 p-2 rounded-lg text-[14px] font-semibold text-[#757575]"
              value={
                profileData[field.name.toLowerCase().replace(" ", "_")] || ""
              }
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
          <div key={field.id} className="flex-1">
            <label className="block mb-2 text-[14px] font-semibold text-[#000000]">
              {field.name}
            </label>
            <input
              type="number"
              name={field.name.toLowerCase().replace(" ", "_")}
              className="w-full h-[44px] border border-gray-300 p-2 rounded-lg text-sm font-semibold text-[#757575]"
              placeholder={field.placeholder || `Enter your ${field.name}`}
              value={
                profileData[field.name.toLowerCase().replace(" ", "_")] || ""
              }
              onChange={(e) => handleChange(e, field)}
              min={field.min_value}
              max={field.max_value}
            />
          </div>
        );
      case "char":
        return (
          <div key={field.id} className="flex-1">
            <label className="block mb-2 text-[14px] font-semibold text-[#000000]">
              {field.name}
            </label>
            <input
              type="text"
              name={field.name.toLowerCase().replace(" ", "_")}
              className="w-full h-[44px] border border-gray-300 p-2 rounded-lg text-sm font-semibold text-[#757575]"
              placeholder={field.placeholder || `Enter your ${field.name}`}
              value={
                profileData[field.name.toLowerCase().replace(" ", "_")] || ""
              }
              onChange={(e) => handleChange(e, field)}
            />
          </div>
        );
      case "boolean":
        return (
          <div key={field.id} className="flex-1">
            <label className="block mb-2 text-[14px] font-semibold text-[#000000]">
              {field.name}
            </label>
            <select
              name={field.name.toLowerCase().replace(" ", "_")}
              className="w-full h-[44px] border border-gray-300 p-2 rounded-lg text-[14px] font-semibold text-[#757575]"
              value={
                profileData[field.name.toLowerCase().replace(" ", "_")] || ""
              }
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
          <div key={field.id} className="flex-1">
            <label className="block mb-2 text-[14px] font-semibold text-[#000000]">
              {field.name}
            </label>
            <input
              type="date"
              name={field.name.toLowerCase().replace(" ", "_")}
              className="w-full h-[44px] border border-gray-300 p-2 rounded-lg text-sm font-semibold text-[#757575]"
              value={
                profileData[field.name.toLowerCase().replace(" ", "_")] || ""
              }
              onChange={(e) => handleChange(e, field)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center   bg-black bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-[90%] sm:w-[720px] max-h-[90vh] overflow-y-auto p-6 flex flex-col items-start relative"
      >
        <div className="flex justify-between items-center mb-2 -mt-2 w-full">
          <h2 className="text-2xl font-semibold text-[#000000]">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        <hr className="w-full inline-block" />

        <div className="gap-4 w-full mt-[1rem]">
          <label className="block text-[14px] font-semibold text-[#1E1E1E] mb-2">
            Profile Completion
          </label>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#3431BB] h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm font-semibold text-gray-500  mt-[1rem]">
            {progress}% completed
          </p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-8 h-8 border-4 border-t-transparent border-[#3431BB] border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* First Div */}

            {/* Second Div */}
            <div
              id="scroll-container"
              className="space-y-4 mt-4 w-full overflow-y-auto flex-1"
            >
              <div>
                <label className="block mb-2 text-[14px] font-semibold text-[#000000]">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full h-[44px] border border-gray-300 p-2 rounded-lg  text-sm font-semibold text-[#757575]"
                  placeholder="Enter your name"
                  value={profileData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="gap-4 w-full ">
                <label className="block mb-2 text-[14px] font-semibold text-[#000000]">
                  Email
                </label>
                <div className="flex flex-col sm:flex-row gap-4 w-full ">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      className="w-full h-[44px] border border-gray-300 p-2 rounded-lg  text-sm font-semibold text-[#757575] px-[2rem]"
                      value={emailData?.email || ""}
                      onChange={handleChange}
                      readOnly
                    />
                    {emailData?.is_email_verified ? (
                      <MdVerified className="absolute top-3 left-3 text-green-500" />
                    ) : (
                      <VscUnverified className="absolute top-3 left-3   text-red-500" />
                    )}
                  </div>
                  {!emailData?.is_email_verified && (
                    <button
                      className="flex-shrink-0 px-4 py-2 rounded-lg border border-transparent bg-[#3431BB] text-white hover:bg-blue-700 text-sm"
                      onClick={resendEmail}
                    >
                      {sentEmailText
                        ? "sending..."
                        : "Resend verification email"}
                    </button>
                  )}
                </div>
              </div>

              <div
                id="scroll-container"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full overflow-y-auto flex-1"
              >
                {fields.map((field) => renderField(field))}
              </div>
            </div>

            <hr className="w-full mt-[2rem] mb-[2rem]" />
            <div className="flex justify-end mt-2 gap-4 w-full">
              <button
                onClick={onClose}
                className="px-[24px] py-[10px]  text-[14px]  rounded-[12px] border border-gray-300 bg-gray-100 text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-[24px] py-[10px] text-[14px] rounded-[12px] border border-transparent bg-[#3431BB] text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
