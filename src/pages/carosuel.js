'use client';
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { useRouter } from "next/router";
import Image from "next/image";
import bannerfirst from "../assets/bannerfirst.jpeg";
import bannerthird from "../assets/csecond.jpeg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import mobilebanner from "../assets/mobilebanner.jpeg";
import mobilebanner1 from "../assets/mobilebanner1.jpeg";
import { useAuth } from "@/Context/AuthContext";

const Carousel = () => {
    const router = useRouter();
    const { authState } = useAuth();
    const [categories, setCategories] = useState([]);
    const [displayText, setDisplayText] = useState("");
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // Fetch announcement data from the API
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/announcements/`);
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    setAnnouncements(data);
                }
            } catch (error) {
                console.error("Error fetching announcements:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/layout-items/`
                );
                const data = await response.json();
                if (Array.isArray(data)) {
                    const sortedCategories = data.sort((a, b) => a.order - b.order);
                    const availableCategories = sortedCategories.map((item) => item.column_name);
                    setDisplayText(availableCategories);
                    setCategories(sortedCategories.map((item) => ({
                        name: item.column_name,
                        label: item.column_name.toUpperCase(),
                    })));
                }
            } catch (error) {
                console.error("Error fetching category data:", error);
            }
        }
        fetchCategories();
    }, [router.query]);

    useEffect(() => {
        if (announcements.length > 1) {
            const interval = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % announcements.length);
            }, 9000);
            return () => clearInterval(interval);
        }
    }, [announcements]);

    const handleClickGetStarted = () => {
        router.push("/login");
    };

    const handleClickAfterLogin = () => {
        router.push("/AllSchemes");
    };

    const firstCategory = categories.length > 0 ? categories[0]?.name : "opportunity";

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
    };

    return (
        <div className="relative w-full max-w-[1200px] mt-5 mx-auto z-0">
            <Slider {...settings}>
                {/* Slide 1 */}
                <div className="relative">
                    {/* Desktop Banner */}
                    <div className="hidden md:hidden lg:block ">
                        <Image
                            src={bannerfirst}
                            alt="Desktop Banner"
                            className="w-full h-auto"
                            priority
                            width={1200}
                            height={400}
                        />
                    </div>
                    {/* Mobile Banner */}
                    <div className="block md:block lg:hidden">
                        <Image
                            src={mobilebanner}
                            alt="Mobile Banner"
                            className="w-full h-auto"
                            priority
                            width={600}
                            height={300}
                        />
                    </div>
                    
                    {/* Text Content - Hidden on mobile */}
                    <div className="hidden md:hidden lg:block lg:flex absolute inset-0 flex-col items-start justify-center px-8">
                        <h1 className="text-[#3330BA] text-3xl lg:text-4xl font-semibold">
                            Empowering the marginalized <br /> community
                        </h1>
                        <p className="text-[#3330BA] text-base lg:text-lg mt-4 max-w-2xl drop-shadow-lg">
                            Helping all communities across India find personalized scholarships based on eligibility.
                        </p>
                    </div>
                </div>

                {/* Slide 3 */}
                <div className="relative">
                    {/* Desktop Banner */}
                    <div className="hidden md:hidden lg:block">
                        <Image
                            src={bannerthird}
                            alt="Desktop Banner"
                            className="w-full h-auto"
                            width={1200}
                            height={400}
                        />
                    </div>
                    {/* Mobile Banner */}
                    <div className="block md:block lg:hidden">
                        <Image
                            src={mobilebanner1}
                            alt="Mobile Banner"
                            className="w-full h-auto"
                            width={600}
                            height={300}
                        />
                    </div>

                    {/* Text Content - Hidden on mobile */}
                    <div className="hidden md:hidden lg:flex absolute bottom-1/4 left-6 transform -translate-y-1/2 flex-col items-start gap-4">
                        <h1 className="text-[#3330BA] text-xl font-semibold">
                            Strengthening India by supporting dreams from every corner of the nation.
                        </h1>

                        {/* Text Box */}
                        <div className="bg-white px-6 py-4 rounded-lg shadow-md flex flex-row items-center gap-4">
                            {displayText.includes("schemes") && (
                                <div className="text-[#000000] font-inter text-sm font-bold pr-4 border-r border-[#808080]">
                                    Thousands of schemes
                                </div>
                            )}
                            {displayText.includes("jobs") && (
                                <div className={`text-[#000000] font-inter text-sm font-bold px-4 ${displayText.includes("scholarships") ? 'border-r border-[#808080]' : ''}`}>
                                    100+ job postings
                                </div>
                            )}
                            {displayText.includes("scholarships") && (
                                <div className="text-[#000000] font-inter text-sm font-bold pl-4">
                                    Multiple scholarships
                                </div>
                            )}
                        </div>

                        {/* Button - Hidden on mobile */}
                        <button
                            className="hidden md:flex h-[44px] px-[44px] py-2 justify-center items-center gap-2 rounded-lg bg-[#F58220] text-white text-base"
                            onClick={authState.token ? handleClickAfterLogin : handleClickGetStarted}
                        >
                            {authState.token ? `My ${firstCategory}` : "Get Started"}
                        </button>
                    </div>
                </div>
            </Slider>
        </div>
    );
};

export default Carousel;