import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useAuth } from "../../Context/AuthContext";
// import '.custom-slide

const ProfileModal = ({ onClose }) => {
  const { authState } = useAuth();
  const [stateOptions, setStateOptions] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);
  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    gender: "",
    community: "",
    minority: "",
    state: "",
    bpl_card_holder: "",
    education: "",
    disability: "",
    occupation: "",
    income: "",
  });
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null)

  const modalRef = useRef(null);
  console.log(authState, "in profile modal")
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
            `http://65.0.103.91:80/api/user/profile/`,
            requestOptions
          );
          const pData = await profileResponse.json();


          setProfileData((prev)=>{return{
            name: pData.name || "",
            age: pData.age || "",
            gender: pData.gender || "",
            community: pData.category || "",
            minority: pData.minority === true ? "Yes" : "No",
            state: pData.state_of_residence || "",
            bpl_card_holder:
              pData.bpl_card_holder === true ? "Yes" : "No",
            education: pData.education || "",
            disability: pData.disability === true ? "Yes" : "No",
            occupation: pData.occupation || "",
            income: pData.income || "",
          }});
        } catch (error) {
          console.error("Error fetching profile data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchProfileData();
  }, [authState.token]);


  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  useEffect(() => {
    const fetchStateOptions = async () => {
      try {
        const response = await fetch(`http://65.0.103.91:80/api/choices/state/`);
        const data = await response.json();
        const formattedData = data.map((item) => item[0]);
        setStateOptions(formattedData);
      } catch (error) {
        console.error("Error fetching state options:", error);
      }
    };

    const fetchEducationOptions = async () => {
      try {
        const response = await fetch(`http://65.0.103.91:80/api/choices/education/`);
        const data = await response.json();
        const formattedData = data.map((item) => item[0]);
        setEducationOptions(formattedData);
      } catch (error) {
        console.error("Error fetching education options:", error);
      }
    };

    fetchStateOptions();
    fetchEducationOptions();
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfileData((prevData) =>{return ({
      ...prevData,
      [name]: value,
    })});
  };

  
  const handleSave = async () => {
    if (authState.token) {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      };

      try {
        await fetch(
          `http://65.0.103.91:80/api/user/profile/`,
          {
            ...requestOptions,
            body: JSON.stringify({
              name: profileData.name,
              gender: profileData.gender,
              age: profileData.age,
              category: profileData.community,
              state_of_residence: profileData.state,
              minority: profileData.minority === "Yes",
              disability: profileData.disability === "Yes",
              bpl_card_holder: profileData.bpl_card_holder === "Yes",
              education: profileData.education,
              occupation: profileData.occupation,
              income: profileData.income,
            }),
          }
        );

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

  console.log("authstate in profile", authState)
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-[560px] h-[750px] p-6 flex flex-col items-start flex-shrink-0 relative"
      >
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* First Div */}
            <div className="flex justify-between items-center mb-2 w-full">
              <h2 className="text-2xl font-semibold text-[#0A0A0A]">Profile</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            <hr className="w-full" />

            {/* Second Div */}
        <div className="space-y-4 mt-4 w-full">
          <div>
            <label className="block mb-2 text-[12px] font-semibold text-black">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full h-[44px] border border-gray-30 p-2 rounded-lg bg-gray-10 text-[12px] font-semibold text-black"
              placeholder="Enter your name"
              value={profileData.name}
              onChange={handleChange}
            />
          </div>
          {/*  */}
          <label className="block mb-2 text-[12px] font-semibold text-black">
              Email
            </label>
            <input
              type="text"
              name="name"
              className="w-full h-[44px] border border-gray-30 p-2 rounded-lg bg-gray-10 text-[12px] font-semibold text-black"
              // placeholder="Enter your name"
              value={email}
              // onChange={handleChange}
            />
          {/*  */}
          <div className="flex gap-4 w-full">
            <div className="flex-1">
              <label className="block mb-2 text-[12px] font-semibold text-black">
                Age
              </label>
              <input
                type="number"
                name="age"
                className="w-full h-[44px] border border-gray-30 p-2 rounded-lg bg-gray-10 text-[12px] font-semibold text-black"
                placeholder="Enter your age"
                value={profileData.age}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-[12px] font-semibold text-black">
                Gender
              </label>
              <select
                name="gender"
                className="w-full h-[44px] border border-gray-30 p-2 rounded-lg bg-gray-10 text-[12px] font-semibold text-black"
                value={profileData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <div className="flex-1">
              <label className="block mb-2 text-[12px] font-semibold text-black">
                Category
              </label>
              <select
                name="community"
                className="w-full h-[44px] border border-gray-30 p-2 rounded-lg bg-gray-10 text-[12px] font-semibold text-black"
                value={profileData.community}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-[12px] font-semibold text-black">
                Minority
              </label>
              <select
                name="minority"
                className="w-full h-[44px] border border-gray-30 p-2 rounded-lg bg-gray-10 text-[12px] font-semibold text-black"
                value={profileData.minority}
                onChange={handleChange}
              >
                <option value="">Select minority status</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <div className="flex-1">
              <label className="block mb-2 text-[12px] font-semibold text-black">
                State of Residence
              </label>
              <select
                name="state"
                className="w-full h-[44px] border border-gray-30 p-2 rounded-lg bg-gray-10 text-[12px] font-semibold text-black"
                value={profileData.state}
                onChange={handleChange}
              >
                <option value="">Select state</option>
                {stateOptions.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-[12px] font-semibold text-black">
                BPL Card Holder
              </label>
              <select
                name="bpl_card_holder"
                className="w-full h-[44px] border border-gray-30 p-2 rounded-lg bg-gray-10 text-[12px] font-semibold text-black"
                value={profileData.bpl_card_holder}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <div className="flex-1">
              <label className="block mb-2 text-[12px] font-semibold text-black">
                Education
              </label>
              <select
                    name="education"
                    className="w-full h-[44px] border border-gray-30 p-2 rounded-lg bg-gray-10 text-[12px] font-semibold text-black"
                    value={profileData.education}
                    onChange={handleChange}
                  >
                    <option value="">Select education</option>
                    {educationOptions.map((education) => (
                      <option key={education} value={education}>
                        {education}
                      </option>
                    ))}
                  </select>
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-[12px] font-semibold text-black">
                Disability
              </label>
              <select
                name="disability"
                className="w-full h-[44px] border border-gray-30 p-2 rounded-lg bg-gray-10 text-[12px] font-semibold text-black"
                value={profileData.disability}
                onChange={handleChange}
              >
                <option value="">Select disability status</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <div className="flex-1">
              <label className="block mb-2 text-[12px] font-semibold text-black">
                Occupation
              </label>
              <select
                name="occupation"
                className="w-full h-[44px] border border-gray-30 p-2 rounded-lg bg-gray-10 text-[12px] font-semibold text-black"
                value={profileData.occupation}
                onChange={handleChange}
              >
                <option value="">Select occupation</option>
                <option value="Farmer">Farmer</option>
                <option value="HouseWife">Housewife</option>
                <option value="Student">Student</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Engineering">Engineering</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Arts & Design">Arts & Design</option>
                <option value="Construction">Construction</option>
                <option value="Legal">Legal</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Transportation">Transportation</option>
                <option value="Social Services">Social Services</option>
                <option value="Science & Research">Science & Research</option>
                <option value="Administration">Administration</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Retail">Retail</option>
                <option value="Maintenance & Repair">Maintenance & Repair</option>
                <option value="Public Safety">Public Safety</option>
                <option value="Government">Government</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Media & Communication">Media & Communication</option>
                <option value="Skilled Trades">Skilled Trades</option>
                <option value="Consulting">Consulting</option>
                <option value="Sports & Recreation">Sports & Recreation</option>
                <option value="Non-Profit">Non-Profit</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Energy & Utilities">Energy & Utilities</option>
                <option value="Environment & Natural Resources">Environment & Natural Resources</option>
              </select>
            </div>
            <div className="flex-1">
      <label className="block mb-2 text-[12px] font-semibold text-black">
        Annual Income (in lakhs)
      </label>
      <input
        type="text"
        name="income"
        className="w-full h-[44px] border border-gray-300 p-2 rounded-lg bg-gray-100 text-[12px] font-semibold text-black"
        placeholder="Enter your income"
        value={profileData.income}
        onChange={handleChange}
      />
      <input
  type="range"
  name="incomeRange"
  min="0"
  max="10"
  step="1"
  value={profileData.income}
  onChange={handleSliderChange}
  className="w-full mt-2 custom-slide"
/>

    </div>
          </div>
        </div>

        <hr className="w-full mt-8" />

        {/* Third Div */}
        <div className="flex justify-end mt-4 gap-4 w-full">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg border border-transparent bg-[#3431BB] text-white hover:bg-blue-700"
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
