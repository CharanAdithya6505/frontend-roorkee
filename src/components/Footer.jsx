import { useRouter } from "next/router";
import { FeedbackButtonFooter } from "./feedBack";
import FeedbackButton from "./feedBack";
import { useState, useEffect } from "react";
import TermsAndConditions from "@/pages/Terms-conditions";
import PrivacyPolicy from "@/pages/privacy-policy";

const Footer = () => {
  const router = useRouter();
  const [displayText, setDisplayText] = useState("");
  const [categories, setCategories] = useState([]);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handlePrivacyPolicy = () => {
    router.push("/privacy-policy");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closePrivacyModal = () => {
    setIsPrivacyModalOpen(false);
  };

  const handleAboutUs = () => {
    router.push("/AboutUs");
  };

  const handleTermsConditions = () => {
    router.push("/Terms-conditions");
  };

  const handleResources = () => {
    router.push("/Resources");
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/layout-items/`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          const sortedCategories = data.sort((a, b) => a.order - b.order);
          const availableCategories = sortedCategories.map(
            (item) => item.column_name
          );

          setCategories(availableCategories);

          const textParts = [];
          if (availableCategories.includes("schemes"))
            textParts.push("schemes");
          if (availableCategories.includes("jobs")) textParts.push("jobs");
          if (availableCategories.includes("scholarships"))
            textParts.push("scholarships");

          setDisplayText(
            textParts.length > 0 ? textParts.join(", ") : "opportunities"
          );

          setCategories(
            sortedCategories.map((item) => ({
              name: item.column_name,
              label: item.column_name.toUpperCase(),
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    }

    fetchCategories();
  }, [router.query, setCategories]);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch("http://43.204.236.103:8000/api/company-meta/");
        const json = await res.json();
        setMeta(json);
      } catch (err) {
        console.error("Error fetching company metadata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeta();
  }, []);

  if (loading) return <div className="text-center p-4">Loading footer...</div>;

  if (!meta)
    return (
      <div className="text-center p-4 text-red-500">
        Failed to load footer info.
      </div>
    );

  return (
    <>
      <footer className="text-black bg-[#343435] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Logo */}
          <h1 className="text-3xl block sm:hidden font-semibold mb-6 text-[#F58220]">
            Empower Hub
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo and Description - Desktop */}
            <div className="hidden sm:block">
              <h1 className="text-3xl font-semibold mb-4 text-[#F58220]">
                Empower Hub
              </h1>
              <h1 className="text-lg font-bold mb-4 text-white">Follow Us</h1>

              <div className="flex space-x-4">
                {meta.facebook_url && (
                  <a
                    href={meta.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.5 0C5.5965 0 0 5.5965 0 12.5C0 18.362 4.036 23.281 9.4805 24.632V16.32H6.903V12.5H9.4805V10.854C9.4805 6.5995 11.406 4.6275 15.583 4.6275C16.375 4.6275 17.7415 4.783 18.3005 4.938V8.4005C18.0055 8.3695 17.493 8.354 16.8565 8.354C14.807 8.354 14.015 9.1305 14.015 11.149V12.5H18.098L17.3965 16.32H14.015V24.9085C20.2045 24.161 25.0005 18.891 25.0005 12.5C25 5.5965 19.4035 0 12.5 0Z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  </a>
                )}
                {meta.instagram_url && (
                  <a
                    href={meta.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="#FFFFFF"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <path
                          d="M12.5 2.25098C15.8398 2.25098 16.2354 2.26562 17.5488 2.32422C18.7695 2.37793 19.4287 2.58301 19.8682 2.75391C20.4492 2.97852 20.8691 3.25195 21.3037 3.68652C21.7432 4.12598 22.0117 4.54102 22.2363 5.12207C22.4072 5.56152 22.6123 6.22559 22.666 7.44141C22.7246 8.75977 22.7393 9.15527 22.7393 12.4902C22.7393 15.8301 22.7246 16.2256 22.666 17.5391C22.6123 18.7598 22.4072 19.4189 22.2363 19.8584C22.0117 20.4395 21.7383 20.8594 21.3037 21.2939C20.8643 21.7334 20.4492 22.002 19.8682 22.2266C19.4287 22.3975 18.7646 22.6025 17.5488 22.6563C16.2305 22.7148 15.835 22.7295 12.5 22.7295C9.16016 22.7295 8.76465 22.7148 7.45117 22.6563C6.23047 22.6025 5.57129 22.3975 5.13184 22.2266C4.55078 22.002 4.13086 21.7285 3.69629 21.2939C3.25684 20.8545 2.98828 20.4395 2.76367 19.8584C2.59277 19.4189 2.3877 18.7549 2.33398 17.5391C2.27539 16.2207 2.26074 15.8252 2.26074 12.4902C2.26074 9.15039 2.27539 8.75488 2.33398 7.44141C2.3877 6.2207 2.59277 5.56152 2.76367 5.12207C2.98828 4.54102 3.26172 4.12109 3.69629 3.68652C4.13574 3.24707 4.55078 2.97852 5.13184 2.75391C5.57129 2.58301 6.23535 2.37793 7.45117 2.32422C8.76465 2.26562 9.16016 2.25098 12.5 2.25098ZM12.5 0C9.10645 0 8.68164 0.0146484 7.34863 0.0732422C6.02051 0.131836 5.10742 0.34668 4.31641 0.654297C3.49121 0.976562 2.79297 1.40137 2.09961 2.09961C1.40137 2.79297 0.976562 3.49121 0.654297 4.31152C0.34668 5.10742 0.131836 6.01562 0.0732422 7.34375C0.0146484 8.68164 0 9.10645 0 12.5C0 15.8936 0.0146484 16.3184 0.0732422 17.6514C0.131836 18.9795 0.34668 19.8926 0.654297 20.6836C0.976562 21.5088 1.40137 22.207 2.09961 22.9004C2.79297 23.5938 3.49121 24.0234 4.31152 24.3408C5.10742 24.6484 6.01562 24.8633 7.34375 24.9219C8.67676 24.9805 9.10156 24.9951 12.4951 24.9951C15.8887 24.9951 16.3135 24.9805 17.6465 24.9219C18.9746 24.8633 19.8877 24.6484 20.6787 24.3408C21.499 24.0234 22.1973 23.5938 22.8906 22.9004C23.584 22.207 24.0137 21.5088 24.3311 20.6885C24.6387 19.8926 24.8535 18.9844 24.9121 17.6563C24.9707 16.3232 24.9854 15.8984 24.9854 12.5049C24.9854 9.11133 24.9707 8.68652 24.9121 7.35352C24.8535 6.02539 24.6387 5.11231 24.3311 4.32129C24.0234 3.49121 23.5986 2.79297 22.9004 2.09961C22.207 1.40625 21.5088 0.976563 20.6885 0.65918C19.8926 0.351562 18.9844 0.136719 17.6562 0.078125C16.3184 0.0146484 15.8936 0 12.5 0Z"
                          fill="#FFFFFF"
                        />
                        <path
                          d="M12.5 6.0791C8.95508 6.0791 6.0791 8.95508 6.0791 12.5C6.0791 16.0449 8.95508 18.9209 12.5 18.9209C16.0449 18.9209 18.9209 16.0449 18.9209 12.5C18.9209 8.95508 16.0449 6.0791 12.5 6.0791ZM12.5 16.665C10.2002 16.665 8.33496 14.7998 8.33496 12.5C8.33496 10.2002 10.2002 8.33496 12.5 8.33496C14.7998 8.33496 16.665 10.2002 16.665 12.5C16.665 14.7998 14.7998 16.665 12.5 16.665Z"
                          fill="#FFFFFF"
                        />
                        <path
                          d="M20.6738 5.82514C20.6738 6.65522 20 7.32416 19.1748 7.32416C18.3447 7.32416 17.6758 6.65033 17.6758 5.82514C17.6758 4.99506 18.3496 4.32611 19.1748 4.32611C20 4.32611 20.6738 4.99994 20.6738 5.82514Z"
                          fill="#FFFFFF"
                        />
                      </g>
                    </svg>
                  </a>
                )}
                {meta.linkedin_url && (
                  <a
                    href={meta.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M23.1494 0H1.8457C0.825195 0 0 0.805664 0 1.80176V23.1934C0 24.1895 0.825195 25 1.8457 25H23.1494C24.1699 25 25 24.1895 25 23.1982V1.80176C25 0.805664 24.1699 0 23.1494 0ZM7.41699 21.3037H3.70605V9.37012H7.41699V21.3037ZM5.56152 7.74414C4.37012 7.74414 3.4082 6.78223 3.4082 5.5957C3.4082 4.40918 4.37012 3.44727 5.56152 3.44727C6.74805 3.44727 7.70996 4.40918 7.70996 5.5957C7.70996 6.77734 6.74805 7.74414 5.56152 7.74414ZM21.3037 21.3037H17.5977V15.5029C17.5977 14.1211 17.5732 12.3389 15.6689 12.3389C13.7402 12.3389 13.4473 13.8477 13.4473 15.4053V21.3037H9.74609V9.37012H13.3008V11.001H13.3496C13.8428 10.0635 15.0537 9.07227 16.8555 9.07227C20.6104 9.07227 21.3037 11.543 21.3037 14.7559V21.3037Z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  </a>
                )}
                {meta.twitter_url && (
                  <a
                    href={meta.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M24.751 7.50006C24.751 7.50006 24.5068 5.77643 23.7549 5.01959C22.8027 4.0235 21.7383 4.01862 21.25 3.96002C17.7539 3.70612 12.5049 3.70612 12.5049 3.70612H12.4951C12.4951 3.70612 7.24609 3.70612 3.75 3.96002C3.26172 4.01862 2.19727 4.0235 1.24512 5.01959C0.493164 5.77643 0.253906 7.50006 0.253906 7.50006C0.253906 7.50006 0 9.52643 0 11.5479V13.4424C0 15.4639 0.249023 17.4903 0.249023 17.4903C0.249023 17.4903 0.493164 19.2139 1.24023 19.9708C2.19238 20.9669 3.44238 20.9327 3.99902 21.0401C6.00098 21.2305 12.5 21.2891 12.5 21.2891C12.5 21.2891 17.7539 21.2794 21.25 21.0303C21.7383 20.9717 22.8027 20.9669 23.7549 19.9708C24.5068 19.2139 24.751 17.4903 24.751 17.4903C24.751 17.4903 25 15.4688 25 13.4424V11.5479C25 9.52643 24.751 7.50006 24.751 7.50006ZM9.91699 15.7422V8.71588L16.6699 12.2413L9.91699 15.7422Z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="text-xl font-semibold mb-4 text-[#F58220]">
                Navigation
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-white hover:text-[#F58220]">
                    Home
                  </a>
                </li>

                {displayText.includes("schemes") && (
                  <li>
                    <a
                      href="AllSchemes?tab=schemes"
                      className="text-white hover:text-[#F58220]"
                    >
                      Schemes
                    </a>
                  </li>
                )}
                {displayText.includes("jobs") && (
                  <li>
                    <a
                      href="/AllSchemes?tab=jobs"
                      className="text-white hover:text-[#F58220]"
                    >
                      Job openings
                    </a>
                  </li>
                )}
                {displayText.includes("scholarships") && (
                  <li>
                    <a
                      href="/AllSchemes?tab=Scholarships"
                      className="text-white hover:text-[#F58220]"
                    >
                      Scholarships
                    </a>
                  </li>
                )}
                <li>
                  <a
                    href="/AllSchemes?tab=Saved"
                    className="text-white hover:text-[#F58220]"
                  >
                    Saved
                  </a>
                </li>
              </ul>
            </div>

            {/* Important Links */}
            <div>
              <h4 className="text-xl font-semibold mb-4 text-[#F58220]">
                Important Links
              </h4>
              <ul className="space-y-2 text-white">
                <li>
                  <a className="hover:text-[#F58220] cursor-pointer">FAQ's</a>
                </li>
                <li>
                  <FeedbackButton className="hover:text-[#F58220]" />
                </li>
                <li>
                  <button
                    onClick={handlePrivacyPolicy}
                    className="hover:text-[#F58220]"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={handleTermsConditions}
                    className="hover:text-[#F58220]"
                  >
                    Terms and Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={handleAboutUs}
                    className="hover:text-[#F58220]"
                  >
                    About us
                  </a>
                </li>
                <li onClick={handleResources}>
                  <a className="hover:text-[#F58220] cursor-pointer">
                    Resources
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-xl font-semibold mb-4 text-[#F58220]">
                Contact Us
              </h4>
              <div className="space-y-2 text-white">
                <h3 className="font-semibold">{meta.name || "Company Name"}</h3>
                <p className="text-sm">{meta.tagline}</p>

                <div className="mt-4">
                  <h3 className="font-semibold">Contact</h3>
                  {meta.email && (
                    <p className="hover:text-[#F58220]">
                      <a href={`mailto:${meta.email}`}>{meta.email}</a>
                    </p>
                  )}
                  {meta.phone && (
                    <p className="hover:text-[#F58220]">
                      <a href={`tel:${meta.phone}`}>{meta.phone}</a>
                    </p>
                  )}
                  {meta.support_email && (
                    <p className="hover:text-[#F58220]">
                      Support:{" "}
                      <a href={`mailto:${meta.support_email}`}>
                        {meta.support_email}
                      </a>
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold">Address</h3>
                  <p>{meta.address_line1}</p>
                  <p>{meta.address_line2}</p>
                  <p>
                    {meta.city}, {meta.state} {meta.postal_code}
                  </p>
                  <p>{meta.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-white">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Empower Hub. All Rights Reserved.
            </p>
          </div>
        </div>

        {/* Modals */}
        {isModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={closeModal}
            data-testid="terms-modal-overlay"
          >
            <div
              data-testid="terms-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <TermsAndConditions handleClose={closeModal} />
            </div>
          </div>
        )}

        {isPrivacyModalOpen && (
          <div
            data-testid="privacy-modal-overlay"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={closePrivacyModal}
          >
            <div
              className="z-50"
              onClick={(e) => e.stopPropagation()}
              data-testid="privacy-modal-content"
            >
              <PrivacyPolicy handleClose={closePrivacyModal} />
            </div>
          </div>
        )}
      </footer>
    </>
  );
};

export default Footer;
