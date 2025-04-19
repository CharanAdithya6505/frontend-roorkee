import React, { useState, useEffect } from "react";
import { useAuth } from "@/Context/AuthContext";

const VerifiedStatus = () => {
  const { authState } = useAuth();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const checkEmailVerification = async () => {
      if (!authState.token || localStorage.getItem("emailVerifiedDismissed")) {
        return;
      }

      try {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          redirect: "follow",
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me/`,
          requestOptions
        );

        const data = await response.json();

        if (data && !data.is_email_verified) {
          setShowMessage(true);
        }
      } catch (error) {
        console.error("Failed to check email verification", error);
      }
    };

    checkEmailVerification();
  }, [authState.token]);

  const handleClose = () => {
    setShowMessage(false);
    localStorage.setItem("emailVerifiedDismissed", "true");
  };

  return (
    showMessage && (
      <div className="relative w-full flex items-center justify-between p-4 bg-violet-100 text-black border border-violet-800 rounded mx-auto sm:w-full">
        <span className="ml-4 text-sm">
          Email has been sent to your mail, please verify
        </span>
        <button
          onClick={handleClose}
          className="bg-transparent border-none text-2xl font-bold leading-none cursor-pointer text-violet-800 sm:text-xl"
        >
          &times;
        </button>
      </div>
    )
  );
};

export default VerifiedStatus;
