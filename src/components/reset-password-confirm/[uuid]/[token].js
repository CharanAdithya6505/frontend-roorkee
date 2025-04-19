import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as Yup from "yup";


const ResPass = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { uuid, token } = router.query;

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], "Passwords must match")
      .required("Confirm Password is required")
  });

  const handlePasswordReset = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/password-reset-confirm/`;

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        uid: uuid,
        token: token,
        new_password: values.password
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Redirect to HeroPage on successful password reset
      router.push("../../login");
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-[59px] w-[400px]">
        <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
          <div className="flex items-center justify-center max-w-lg w-full">
            <h1 className="font-bold text-36px">Reset your password</h1>
          </div>

          <div className="text-center mt-4 max-w-lg w-auto">
            <h1>Enter a new password below to change your password</h1>
          </div>

          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handlePasswordReset}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 w-full flex flex-col gap-4">
                <div className="flex flex-col w-full relative">
                  <p className="font-medium mb-1">New Password</p>
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your new password"
                    className="px-4 py-2 border rounded-lg w-full"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500" />
                  <div
                    className="absolute inset-y-[48px] right-4 flex items-center cursor-pointer "
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                <div className="flex flex-col w-full relative">
                  <p className="font-medium mb-1">Confirm Password</p>
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="px-4 py-2 border rounded-lg w-full"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
                  <div
                    className="absolute inset-y-[48px] right-4 flex items-center cursor-pointer "
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>

                <div className="bg-[#3431BB] px-8 py-4 rounded-[13px] mt-8 max-w-lg w-full flex justify-center cursor-pointer hover:bg-[#282797]">
                  <button
                    type="submit"
                    className="text-white px-4 hover:bg-[#282797]"
                    disabled={isSubmitting || loading}
                  >
                    {loading ? "Loading..." : "Reset password"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ResPass;
