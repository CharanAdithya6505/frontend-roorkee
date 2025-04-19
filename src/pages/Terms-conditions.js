import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/router";
import { IoClose } from "react-icons/io5";

export default function TermsAndConditions() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <>
      <NavBar />
      <div className="bg-[#e8e6e6]">
      <div className="flex justify-center lg:px-8 xl:px-8  md:px-8">
      <div className="w-full lg:max-w-7xl md:max-w-5xl max-w-full bg-white shadow-lg rounded-xl p-8 sm:p-10  lg:mt-[5rem]  md:mb-[5rem] md:mt-[5rem] xl:mt-[5rem] xl:mb-[5rem] lg:mb-[5rem]">
        <div className="flex items-center justify-center relative mb-6">
          
          <h1 className="lg:text-3xl md:text-2xl text-xl  text-[#2B3E80] font-extrabold text-center w-full">
            Terms and Conditions 
          </h1>
          <button
                type="button"
                className=" absolute left-0 flex gap-[10px] text-sm font-inter  items-center justify-between "
                onClick={() => router.back()}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5005 10.0003C17.5005 10.1661 17.4346 10.3251 17.3174 10.4423C17.2002 10.5595 17.0413 10.6253 16.8755 10.6253H4.63409L9.19268 15.1832C9.25075 15.2412 9.29681 15.3102 9.32824 15.386C9.35966 15.4619 9.37584 15.5432 9.37584 15.6253C9.37584 15.7075 9.35966 15.7888 9.32824 15.8647C9.29681 15.9405 9.25075 16.0095 9.19268 16.0675C9.13461 16.1256 9.06567 16.1717 8.9898 16.2031C8.91393 16.2345 8.83261 16.2507 8.75049 16.2507C8.66837 16.2507 8.58705 16.2345 8.51118 16.2031C8.43531 16.1717 8.36637 16.1256 8.3083 16.0675L2.6833 10.4425C2.62519 10.3845 2.57909 10.3156 2.54764 10.2397C2.51619 10.1638 2.5 10.0825 2.5 10.0003C2.5 9.91821 2.51619 9.83688 2.54764 9.76101C2.57909 9.68514 2.62519 9.61621 2.6833 9.55816L8.3083 3.93316C8.42558 3.81588 8.58464 3.75 8.75049 3.75C8.91634 3.75 9.0754 3.81588 9.19268 3.93316C9.30996 4.05044 9.37584 4.2095 9.37584 4.37535C9.37584 4.5412 9.30996 4.70026 9.19268 4.81753L4.63409 9.37535H16.8755C17.0413 9.37535 17.2002 9.4412 17.3174 9.55841C17.4346 9.67562 17.5005 9.83459 17.5005 10.0003Z" fill="black"/>
            </svg>

              </button>
        </div>

          <div className="text-gray-700 space-y-6 text-sm sm:text-base leading-relaxed">
           

            <section>
              <h2 className="font-semibold mb-1 text-[#2B3E80]">1. Acceptance of Terms</h2>
              <p>
                By using our website and services, you agree to comply with and be bound by these
                Terms and Conditions and all applicable laws. If you do not agree, please do not use
                our services.
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-1 text-[#2B3E80]">2. Services Provided</h2>
              <p>
                We provide an interface to view and apply for government schemes, jobs, and scholarships.
                We are not responsible for managing or approving these schemes.
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-1 text-[#2B3E80]">3. User Account</h2>
              <p>
                You must create an account to access certain features. Provide accurate details and
                safeguard your credentials. Report any unauthorized access immediately.
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-1 text-[#2B3E80]">4. Use of the Portal</h2>
              <p>
                We only facilitate access to government schemes. Success or approval is not guaranteed.
                Users must follow official application processes.
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-1 text-[#2B3E80]">5. User Responsibilities</h2>
              <p>
                Use the platform lawfully, provide accurate data, and do not disrupt or misuse the portal.
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-1 text-[#2B3E80]">6. Privacy and Data Collection</h2>
              <p>
                Your use of the platform is subject to our Privacy Policy, which outlines how your
                data is collected, used, and protected.
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-1 text-[#2B3E80]">7. Disclaimers</h2>
              <p>
                We do not guarantee success in applications. Users should verify details on official
                government websites.
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-1 text-[#2B3E80]">8. Limitation of Liability</h2>
              <p>
                Empower Hub and partners are not liable for any losses or damages related to the use
                or content of this platform.
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-1 text-[#2B3E80]">9. Intellectual Property</h2>
              <p>
                All content on this platform is owned by Empower Hub or its licensors. Do not copy or
                distribute without permission.
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-1 text-[#2B3E80]">10. Modification of Terms</h2>
              <p>
                We may change these Terms at any time. Continued use means you accept the updates.
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-1 text-[#2B3E80]">11. Termination of Account</h2>
              <p>
                We may suspend or terminate accounts for violations. You may also request account deletion.
              </p>
            </section>

            <section>
              <h2 className="font-semibold mb-1 text-[#2B3E80]">12. Governing Law</h2>
              <p>
                These terms are governed by the laws of [Insert Jurisdiction]. Disputes will be resolved
                in courts of [Insert Jurisdiction].
              </p>
            </section>

           
          </div>
        </div>
      </div>
      <Footer/>
      </div>
    </>
  );
}
