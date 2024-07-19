import React, { useState, useEffect } from "react";
import Image from "next/image";
import IndialImg from "../assets/ind2.png";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';
import loginperson from "../assets/image.png";
import { FaAngleDown, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/router";
import { useFormData } from "../Context/FormContext";
import { useAuth } from "../Context/AuthContext";

const validationSchema = Yup.object({
  qualification: Yup.string().required('Highest education qualification is required'),
  occupation: Yup.string().required('Occupation is required'),
  income: Yup.string().required('Annual income is required'),
  minority: Yup.boolean().required('Minority status is required'),
  disability: Yup.boolean().required('Disability status is required'),
  bpl_card_holder: Yup.boolean().required('BPL Card Holder status is required'),
});

const CreateAcc03 = () => {
  const router = useRouter();
  const { formData, updateFormData } = useFormData();
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log("User token:", authState.token);
  }, [authState.token]);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    updateFormData(values);
    const completeData = { ...formData, ...values };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(completeData),
      });

      if (response.ok) {
        router.push("/accCreatedsucc");
        setTimeout(() => {
          router.push("/HeroPageLoginsucc");
        }, 2000);
      } else {
        console.error("Error submitting form");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    if (authState.token) {
      router.push("/accCreatedsucc");
      setTimeout(() => {
        router.push("/HeroPageLoginsucc");
      }, 2000);
    } else {
      console.error("User token not available.");
      // Handle case where token is not available
    }
  };

  return (
    <div className="flex h-screen overflow-hidden -mb-6">
      <div className="w-1/2 bg-[#151280] relative flex items-center justify-center">
        <div className="absolute top-0 text-white mt-20 ml-8 mr-8">
          <h1 className="text-purple-400 font-inter italic font-bold text-3xl mb-4 w-[500px]">
            “For the Indians by the Indians”
          </h1>
          <p className="text-white font-inter text-[22px] text-base font-medium w-[500px]">
            Find all the details about government schemes, scholarships, and job
            openings for all states in one place.
          </p>
        </div>
        <div className="absolute bottom-0 right-0">
          <Image
            className="z-10 image-opacity transform -scale-x-100"
            src={loginperson}
            alt="Login Person Image"
            width={400}
            height={200}
          />
        </div>
        <div className="absolute bottom-8">
          <Image
            className="z-0 image-opacity opacity-20"
            src={IndialImg}
            alt="India Image"
            width={600}
            height={200}
          />
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <Formik
          initialValues={{
            qualification: formData.qualification || "",
            occupation: formData.occupation || "",
            income: formData.income || "",
            minority: false,
            disability: false,
            bpl_card_holder: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="w-full h-full ml-20 mr-24 relative mt-60">
              <h1 className="text-2xl font-bold">
                Tell us a little about yourself
              </h1>
              <p>Knowing about you will help us find the right schemes for you.</p>
              <div className="mt-12">
                <div className="flex mb-4">
                  <div className="w-1/2 mr-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="qualification"
                    >
                      Highest education qualification
                    </label>
                    <Field
                      as="select"
                      className="block appearance-none w-full bg-white border border-gray-400 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
                      id="qualification"
                      name="qualification"
                    >
                      <option value="">Education qualification</option>
                      <option value="occupation01">Matriculate</option>
                      <option value="occupation02">Intermediate</option>
                      <option value="occupation03">Under Graduate</option>
                      <option value="occupation04">Post Graduate</option>
                      <option value="occupation05">P.H.D</option>
                    </Field>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaAngleDown />
                    </div>
                    {/* <ErrorMessage name="qualification" component="div" className="text-red-500 text-sm mt-1" /> */}
                  </div>
                  <div className="w-1/2 relative">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="occupation"
                    >
                      Occupation
                    </label>
                    <Field
                      as="select"
                      className="block appearance-none w-full bg-white border border-gray-400 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
                      id="occupation"
                      name="occupation"
                    >
                      <option value="">Select your occupation</option>
                      <option value="occupation01">Farmer</option>
                      <option value="occupation02">HouseWife</option>
                      <option value="occupation03">Student</option>
                      {/* <option value="occupation04">occupation04</option>
                      <option value="occupation05">occupation05</option> */}
                    </Field>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaAngleDown />
                    </div>
                    {/* <ErrorMessage name="occupation" component="div" className="text-red-500 text-sm mt-1" /> */}
                  </div>
                </div>
                <div className="flex mb-4">
                  <div className="w-1/2 mr-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="income"
                    >
                      Annual income
                    </label>
                    <Field
                      as="select"
                      className="block appearance-none w-full bg-white border border-gray-400 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
                      id="income"
                      name="income"
                    >
                      <option value="">Select your income range</option>
                      <option value="income01">0 - 1 lakh</option>
                      <option value="income02">1 - 2 lakhs</option>
                      <option value="income03">2 - 4 lakhs</option>
                      <option value="income04">4 - 6 lakhs</option>
                      <option value="income05">6 lakhs and above</option>
                    </Field>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FaAngleDown />
                    </div>
                    {/* <ErrorMessage name="income" component="div" className="text-red-500 text-sm mt-1" /> */}
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="minority"
                    >
                      Minority
                    </label>
                    <Field
                      as="select"
                      className="block appearance-none w-full bg-white border border-gray-400 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
                      id="minority"
                      name="minority"
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </Field>
                    {/* <ErrorMessage name="minority" component="div" className="text-red-500 text-sm mt-1" /> */}
                  </div>
                </div>
                <div className="flex mb-4">
                  <div className="w-1/2 mr-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="disability"
                    >
                      Disability
                    </label>
                    <Field
                      as="select"
                      className="block appearance-none w-full bg-white border border-gray-400 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
                      id="disability"
                      name="disability"
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </Field>
                    {/* <ErrorMessage name="disability" component="div" className="text-red-500 text-sm mt-1" /> */}
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="bpl_card_holder"
                    >
                      BPL Card Holder
                    </label>
                    <Field
                      as="select"
                      className="block appearance-none w-full bg-white border border-gray-400 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
                      id="bpl_card_holder"
                      name="bpl_card_holder"
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </Field>
                    {/* <ErrorMessage name="bpl_card_holder" component="div" className="text-red-500 text-sm mt-1" /> */}
                  </div>
                </div>
              </div>
              
              {Object.keys(errors).length > 0 && (
                <div className="mb-4 mt-4">
                  <div className="bg-[#FFE6E6] text-[#DC0000] py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                    All fields are required.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between absolute bottom-[200px] w-full px-4">
                <span className="text-gray-600">3/3</span>
                <div className="flex items-center gap-4">
                  <button
                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    type="button"
                    onClick={handleSkip}
                  >
                    Skip For Now
                  </button>
                  <button
                    className="bg-[#3431BB] hover:bg text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isLoading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      "Continue"
                    )}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateAcc03;
