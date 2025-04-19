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

<<<<<<< HEAD:src/pages/Modals/profileModal.js
=======
    
  
>>>>>>> upstream/main:src/components/Modals/profileModal.js
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
<<<<<<< HEAD:src/pages/Modals/profileModal.js
          console.log(pData, "fetching Saved data");
=======
          // console.log(pData, "fetching Saved data")
>>>>>>> upstream/main:src/components/Modals/profileModal.js

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
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me/`,
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

<<<<<<< HEAD:src/pages/Modals/profileModal.js
=======
  // console.log(sentEmailText)

console.log(" this is emaildata", emailData)
>>>>>>> upstream/main:src/components/Modals/profileModal.js
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
              type="text"
              inputMode="numeric" 
              name={field.name.toLowerCase().replace(" ", "_")}
              className="w-full h-[44px] border border-gray-300 p-2 rounded-lg text-sm font-semibold text-[#757575]"
              placeholder={field.placeholder || `Enter your ${field.name}`}
<<<<<<< HEAD:src/pages/Modals/profileModal.js
              value={
                profileData[field.name.toLowerCase().replace(" ", "_")] || ""
              }
              onChange={(e) => handleChange(e, field)}
              min={field.min_value}
              max={field.max_value}
=======
              value={profileData[field.name.toLowerCase().replace(" ", "_")] ?? ""}
              onChange={(e) => {
                let rawValue = e.target.value;

                // Remove non-numeric characters (except "-" for negative numbers)
                rawValue = rawValue.replace(/[^0-9-]/g, "");

                // Prevent multiple "-" signs or "-" in the wrong place
                if (rawValue.includes("-") && rawValue.indexOf("-") !== 0) {
                  rawValue = rawValue.replace("-", "");
                }

                // Convert to number (ignores empty or invalid values)
                let value = rawValue === "-" ? rawValue : Number.parseInt(rawValue, 10);

                // Prevent NaN (invalid number)
                if (isNaN(value)) {
                  value = "";
                }

                // Apply min/max limits
                if (value !== "" && field.min_value !== undefined) value = Math.max(field.min_value, value);
                if (value !== "" && field.max_value !== undefined) value = Math.min(field.max_value, value);

                handleChange({ target: { name: e.target.name, value } }, field);
              }}
>>>>>>> upstream/main:src/components/Modals/profileModal.js
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
        className="bg-white rounded-lg w-[90%] sm:w-[720px] max-h-[90vh] overflow-y-auto flex flex-col items-start relative"
      >
<<<<<<< HEAD:src/pages/Modals/profileModal.js
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
=======
        

<div className="flex justify-between items-center mb-2 -mt-2 p-4 w-full  shadow-md">
<div className="flex items-center ">
<div
          className="sm:text-[16px] font-semibold text-[#3431BB] text-sm hover:text-blue-700 cursor-pointer"
       
        >
          <svg
            viewBox="0 0 1528 580"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-auto h-[40px] sm:h-[50px] md:h-[60px] lg:h-[70px] xl:h-[80px]"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect x="1" width="1527" height="500" fill="white" />
            <path
              d="M1354.95 384.112C1354.95 480.159 508.998 539.5 665.259 539.5C821.52 539.5 1473.5 519.159 1473.5 423.112C1473.5 327.065 1024.26 183 868 183C711.739 183 1354.95 288.065 1354.95 384.112Z"
              fill="#008000"
            />
            <path
              d="M845.623 438V434.16H857.783V345.328H845.623V341.488H890.551V345.328H878.007V386.288H914.231V345.328H901.687V341.488H946.871V345.328H934.455V434.16H946.871V438H901.687V434.16H914.231V390.128H878.007V434.16H890.551V438H845.623ZM977.229 439.664C972.023 439.664 967.842 438.299 964.685 435.568C961.613 432.752 960.077 429.381 960.077 425.456V382.32H977.741V423.792C977.741 427.291 978.21 429.765 979.149 431.216C980.173 432.667 981.709 433.392 983.757 433.392C986.658 433.392 989.175 432.325 991.309 430.192C993.442 427.973 995.106 424.987 996.301 421.232C997.581 417.477 998.221 413.296 998.221 408.688L1000.78 427.888H997.709C996.173 431.387 993.485 434.245 989.645 436.464C985.89 438.597 981.751 439.664 977.229 439.664ZM998.221 438V434.16H1026V438H998.221ZM950.093 384.24V380.4H977.741V384.24H950.093ZM998.221 436.08V382.32H1015.88V436.08H998.221ZM987.725 384.24V380.4H1015.88V384.24H987.725ZM1075.44 439.536C1071.52 439.536 1078.06 438.683 1065.07 436.976C1062.09 435.269 1059.87 433.136 1058.42 430.576H1055.34L1057.9 411.12C1057.9 419.141 1059.31 425.072 1062.13 428.912C1064.94 432.667 1068.44 434.544 1072.62 434.544C1074.84 434.544 1076.68 433.904 1078.13 432.624C1079.58 431.259 1080.65 428.784 1081.33 425.2C1082.01 421.531 1082.35 416.283 1082.35 409.456C1082.35 402.459 1081.97 397.125 1081.2 393.456C1080.52 389.787 1079.45 387.269 1078 385.904C1076.55 384.539 1074.72 383.856 1072.5 383.856C1068.32 383.856 1064.82 385.776 1062 389.616C1059.27 393.456 1057.9 399.344 1057.9 407.28L1055.34 387.824H1058.42C1059.87 385.264 1062.09 383.131 1065.07 381.424C1068.14 379.717 1071.64 378.864 1075.57 378.864C1080.26 378.864 1084.61 380.144 1088.62 382.704C1092.72 385.179 1096.01 388.72 1098.48 393.328C1100.96 397.851 1102.19 403.141 1102.19 409.2C1102.19 415.259 1100.91 420.592 1098.35 425.2C1095.88 429.723 1092.59 433.264 1088.5 435.824C1084.49 438.299 1080.13 439.536 1075.44 439.536ZM1029.87 438V434.16H1057.9V438H1029.87ZM1040.24 436.08V343.536H1057.9V436.08H1040.24ZM1029.87 345.328V341.488H1057.9V345.328H1029.87Z"
              fill="#3333DD"
            />
            <path
              d="M119.046 282.612C119.046 378.659 965.002 438 808.741 438C652.48 438 0.5 417.659 0.5 321.612C0.5 225.565 449.739 81.5 606 81.5C762.261 81.5 119.046 186.565 119.046 282.612Z"
              fill="#FFA500"
            />
            <path
              d="M483.498 320V316.16H537.642C542.42 316.16 546.474 314.88 549.802 312.32C553.13 309.76 555.69 306.389 557.482 302.208C559.359 298.027 560.34 293.504 560.426 288.64H565.546V320H483.498ZM495.658 318.08V223.488H515.882V318.08H495.658ZM538.794 292.352C538.708 288.256 537.898 284.885 536.362 282.24C534.826 279.595 532.351 277.632 528.938 276.352C525.524 275.072 521.002 274.432 515.37 274.432V270.592C521.002 270.592 525.524 269.995 528.938 268.8C532.351 267.605 534.826 265.771 536.362 263.296C537.898 260.821 538.708 257.707 538.794 253.952H543.914V292.352H538.794ZM558.506 249.088C558.42 245.163 557.524 241.579 555.818 238.336C554.196 235.008 551.85 232.363 548.778 230.4C545.706 228.352 541.994 227.328 537.642 227.328H483.498V223.488H563.626V249.088H558.506ZM658.895 318.08V272.896C658.895 268.629 656.975 266.496 653.135 266.496C650.489 266.496 648.057 267.648 645.839 269.952C643.62 272.256 641.828 275.413 640.463 279.424C639.183 283.349 638.543 287.829 638.543 292.864L635.983 273.024H639.055C640.676 269.269 643.023 266.325 646.095 264.192C649.252 261.973 653.22 260.864 657.999 260.864C663.545 260.864 668.025 262.229 671.439 264.96C674.852 267.605 676.559 270.891 676.559 274.816V318.08H658.895ZM572.623 320V316.16H608.975V320H572.623ZM582.991 318.08V264.448H600.655V318.08H582.991ZM612.303 320V316.16H646.735V320H612.303ZM572.623 266.24V262.4H600.655V266.24H572.623ZM621.007 318.08V272.896C621.007 268.629 619.087 266.496 615.247 266.496C612.601 266.496 610.169 267.648 607.951 269.952C605.732 272.256 603.94 275.413 602.575 279.424C601.295 283.349 600.655 287.829 600.655 292.864L598.095 273.024H601.167C602.788 269.269 605.135 266.325 608.207 264.192C611.364 261.973 615.332 260.864 620.111 260.864C625.657 260.864 630.137 262.229 633.551 264.96C636.964 267.605 638.671 270.891 638.671 274.816V318.08H621.007ZM650.191 320V316.16H684.623V320H650.191ZM733.191 321.536C729.265 321.536 725.809 320.683 722.823 318.976C719.836 317.269 717.617 315.136 716.167 312.576H713.095L715.655 293.12C715.655 301.227 717.063 307.157 719.879 310.912C722.78 314.667 726.321 316.544 730.503 316.544C732.807 316.544 734.641 315.861 736.007 314.496C737.457 313.131 738.481 310.656 739.079 307.072C739.761 303.403 740.103 298.197 740.103 291.456C740.103 284.544 739.761 279.253 739.079 275.584C738.481 271.829 737.457 269.269 736.007 267.904C734.556 266.539 732.679 265.856 730.375 265.856C726.193 265.856 722.695 267.733 719.879 271.488C717.063 275.243 715.655 281.173 715.655 289.28L713.095 269.824H716.167C717.617 267.264 719.836 265.131 722.823 263.424C725.895 261.717 729.393 260.864 733.319 260.864C738.012 260.864 742.364 262.144 746.375 264.704C750.471 267.179 753.756 270.72 756.231 275.328C758.705 279.851 759.943 285.141 759.943 291.2C759.943 297.259 758.663 302.592 756.103 307.2C753.628 311.723 750.343 315.264 746.247 317.824C742.236 320.299 737.884 321.536 733.191 321.536ZM688.519 360.192V356.352H728.455V360.192H688.519ZM697.991 358.272V264.448H715.655V358.272H697.991ZM687.623 266.24V262.4H715.655V266.24H687.623ZM803.944 321.664C799.507 321.664 795.369 320.939 791.529 319.488C787.689 318.037 784.318 315.947 781.417 313.216C778.515 310.485 776.211 307.285 774.505 303.616C772.883 299.861 772.073 295.723 772.073 291.2C772.073 286.763 772.883 282.709 774.505 279.04C776.211 275.285 778.515 272.085 781.417 269.44C784.318 266.709 787.689 264.619 791.529 263.168C795.369 261.632 799.507 260.864 803.944 260.864C808.382 260.864 812.521 261.632 816.361 263.168C820.201 264.619 823.571 266.709 826.473 269.44C829.459 272.085 831.763 275.285 833.385 279.04C835.091 282.709 835.945 286.763 835.945 291.2C835.945 295.723 835.091 299.861 833.385 303.616C831.763 307.285 829.459 310.485 826.473 313.216C823.571 315.947 820.201 318.037 816.361 319.488C812.521 320.939 808.382 321.664 803.944 321.664ZM803.944 317.184C806.931 317.184 809.321 316.501 811.113 315.136C812.905 313.771 814.185 311.253 814.953 307.584C815.721 303.829 816.105 298.411 816.105 291.328C816.105 284.245 815.721 278.827 814.953 275.072C814.185 271.317 812.905 268.757 811.113 267.392C809.321 266.027 806.931 265.344 803.944 265.344C800.958 265.344 798.569 266.027 796.777 267.392C795.07 268.757 793.833 271.317 793.065 275.072C792.297 278.827 791.913 284.245 791.913 291.328C791.913 298.411 792.297 303.829 793.065 307.584C793.833 311.253 795.07 313.771 796.777 315.136C798.569 316.501 800.958 317.184 803.944 317.184ZM865.928 321.664L844.68 266.24H837.767V262.4H872.072V266.24H864.52L874.76 296.064H875.272L887.688 262.4H892.296L906.248 296.064H906.76L916.616 266.24H906.504V262.4H930.568V266.24H921.224L902.024 321.664H898.312L883.72 285.952H883.208L869.64 321.664H865.928ZM964.323 321.664C959.885 321.664 955.704 320.811 951.779 319.104C947.939 317.397 944.525 315.093 941.539 312.192C938.637 309.291 936.376 306.005 934.755 302.336C933.133 298.667 932.323 294.827 932.323 290.816C932.323 285.867 933.603 281.131 936.163 276.608C938.723 272 942.349 268.245 947.043 265.344C951.736 262.357 957.24 260.864 963.555 260.864C968.675 260.864 973.24 261.888 977.251 263.936C981.347 265.984 984.547 268.928 986.851 272.768C989.24 276.523 990.435 281.003 990.435 286.208V287.616H946.019V283.776H972.387V275.968C972.387 268.629 969.315 264.96 963.171 264.96C960.525 264.96 958.392 265.771 956.771 267.392C955.149 269.013 953.955 271.787 953.187 275.712C952.504 279.552 952.163 284.843 952.163 291.584C952.163 298.496 952.547 303.829 953.315 307.584C954.083 311.253 955.405 313.771 957.283 315.136C959.16 316.501 961.72 317.184 964.963 317.184C969.485 317.184 973.581 316.075 977.251 313.856C981.005 311.637 984.12 307.797 986.595 302.336H990.819C989.027 308.224 985.741 312.917 980.963 316.416C976.269 319.915 970.723 321.664 964.323 321.664ZM997.873 320V316.16H1008.24V266.24H997.873V262.4H1025.9V272.256H1026.42C1029.23 267.477 1032.22 264.405 1035.38 263.04C1038.53 261.589 1041.35 260.864 1043.82 260.864C1047.75 260.864 1050.78 261.888 1052.91 263.936C1055.05 265.899 1056.11 268.757 1056.11 272.512C1056.11 276.181 1055.17 278.869 1053.3 280.576C1051.5 282.283 1049.24 283.136 1046.51 283.136C1044.04 283.136 1041.78 282.411 1039.73 280.96C1037.77 279.509 1036.78 277.333 1036.78 274.432C1036.78 272.725 1037.04 271.488 1037.55 270.72C1038.15 269.952 1038.45 269.355 1038.45 268.928C1038.45 268.757 1038.36 268.629 1038.19 268.544C1038.11 268.373 1037.85 268.288 1037.42 268.288C1036.06 268.288 1034.44 269.184 1032.56 270.976C1030.77 272.768 1029.19 275.115 1027.82 278.016C1026.54 280.917 1025.9 284.075 1025.9 287.488V316.16H1034.22V320H997.873Z"
              fill="#3333DD"
            />
            <rect
              x="242"
              y="183"
              width="224"
              height="358"
              fill="url(#pattern0_3080_5131)"
            />
          </svg>
        </div>

        
    </div>
  
             
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            <hr className="w-full inline-block"/>

        <div className="gap-4 w-full mt-[1rem] px-6 ">
        <h2 className="lg:text-2xl md:text-2xl  text-xl font-semibold text-[#000000] mb-2">Profile</h2>
              <label className="block text-[14px] font-semibold text-[#1E1E1E] mb-2">Profile Completion</label>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#3431BB] h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm font-semibold text-gray-500  mt-[1rem]">{progress}% completed</p>
            </div>
>>>>>>> upstream/main:src/components/Modals/profileModal.js
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
              className="space-y-4 mt-4 w-full overflow-y-auto flex-1 px-6 "
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
                      <MdVerified className="absolute top-3.5 left-3 text-green-500" />
                    ) : (
                      <VscUnverified className="absolute top-3.5 left-3   text-red-500" />
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
<<<<<<< HEAD:src/pages/Modals/profileModal.js
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
=======
            <div className="flex justify-end mt-2 gap-4 w-full p-4">
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

>>>>>>> upstream/main:src/components/Modals/profileModal.js
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
