import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { MdClose } from "react-icons/md";
import { useAuth } from "@/Context/AuthContext";

import step1 from "../../assets/step1.jpeg";
import step1mobile from "../../assets/step1mobile.jpeg";
import step2 from "../../assets/step2.jpeg";
import step3 from "../../assets/step3.jpeg";
import step1withpdf from "../../assets/mainSchemewithpdf.jpeg";
import step2withpdf from "../../assets/withpdf.jpeg";
import step1withoutpdf from "../../assets/mainSchemewithoutpdf.jpeg";
import step2withoutpdf from "../../assets/withoutpdf.jpeg";

const HowToApply = ({ closeModal, schemeId, scheme }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [procedures, setProcedures] = useState([]);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { authState } = useAuth();

  const hasPDF = scheme?.pdf_url;

  const steps = [
    {
      title: "STEP - 1",
      content: "Go to the schemes page and select the preferred scheme.",
      image: isMobile
        ? (hasPDF
            ? "/images/pdf-step1-mobile.jpeg"
            : "/_next/static/media/step1mobile.09d6da3d.jpeg")
        : (hasPDF
            ? "/_next/static/media/mainSchemewithpdf.047c8485.jpeg"
            : "/_next/static/media/mainSchemewithoutpdf.033eabba.jpeg"),
    },
    {
      title: "STEP - 2",
      content:
        "After clicking on the preferred scheme, click on the 'Apply' button on the scheme description page to apply for the scheme.",
      image: isMobile
        ? (hasPDF
            ? "/images/pdf-step2-mobile.jpeg"
            : "/_next/static/media/step2.64e5a384.jpeg")
        : (hasPDF
            ? "/_next/static/media/withpdf.ea49d16a.jpeg"
            : "/_next/static/media/withoutpdf.87e6cb49.jpeg"),
    },
    {
      title: "STEP - 3",
      content:
        "If you are not currently applying but wish to apply for the scheme in the future, you can use the 'Save for Later' button.",
      image: isMobile
        ? (hasPDF
            ? "/images/pdf-step3-mobile.jpeg"
            : "/_next/static/media/step2.64e5a384.jpeg")
        : (hasPDF
            ? "/_next/static/media/withpdf.ea49d16a.jpeg"
            : "/_next/static/media/withoutpdf.87e6cb49.jpeg"),
    },
  ];

  const fetchProcedures = (schemeId) => {
    if (!schemeId) return;

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/schemes/${schemeId}/procedures/`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setProcedures(data))
      .catch((err) => console.error("Error fetching procedures:", err));
  };

  useEffect(() => {
    if (schemeId && authState.token) {
      fetchProcedures(schemeId);
    }
  }, [schemeId, authState.token]);

  const nextStep = () => {
    const totalSteps = steps.length + (procedures.length > 0 ? 1 : 0);
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
      <div className="bg-white rounded-xl shadow-lg h-[70vh] w-[90%] md:w-[650px] p-6 flex flex-col relative animate-fade-in transition-all">
        {/* Header */}
        <div className="flex justify-center items-center mb-2 relative">
          <h2 className="text-[20px] sm:text-2xl font-semibold text-[#3431BB] text-center">
            How to Apply for Schemes
          </h2>
          <button
            onClick={closeModal}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Step Content */}
        <div className="flex-grow overflow-y-auto transition-opacity duration-300 ease-in-out">
          <div className="flex flex-col py-6 h-full">
            <div className="w-full animate-fade-in">
              {currentStep <= steps.length ? (
                <>
                  <div className="border border-[#3431BB] rounded-lg p-6 w-full">
                    <h3 className="text-center text-[16px] font-bold">
                      {steps[currentStep - 1].title}
                    </h3>
                    <p className="text-center text-[16px] mt-2">
                      {steps[currentStep - 1].content}
                    </p>
                  </div>

                  {/* Scrollable Image Container */}
                  {steps[currentStep - 1].image && (
                    <div className="mt-4 max-h-[300px] overflow-y-auto border rounded-lg shadow-inner p-2">
                      <img
                        src={steps[currentStep - 1].image}
                        alt={`Step ${currentStep}`}
                        className="w-full object-contain rounded-md"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="border border-[#3431BB] rounded-lg p-6 w-full animate-fade-in">
                  <h3 className="text-[16px] font-bold text-center">SCHEME RELATED STEPS</h3>
                  <ul className="list-disc mt-2 px-4 text-[16px]">
                    {procedures.map((procedure, index) => (
                      <li key={index}>{procedure.step_description}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t flex justify-between">
          <button
            onClick={prevStep}
            className={`px-4 py-2 rounded-lg text-sm ${
              currentStep === 1
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-[#3431BB] text-white hover:bg-blue-700"
            }`}
            disabled={currentStep === 1}
          >
            Previous
          </button>

          <button
            onClick={nextStep}
            className={`px-4 py-2 rounded-lg text-sm ${
              (procedures.length > 0 && currentStep === steps.length + 1) ||
              (procedures.length === 0 && currentStep === steps.length)
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-[#3431BB] text-white hover:bg-blue-700"
            }`}
            disabled={
              (procedures.length > 0 && currentStep === steps.length + 1) ||
              (procedures.length === 0 && currentStep === steps.length)
            }
          >
            Next
          </button>
        </div>
      </div>


      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
};

export default HowToApply;
