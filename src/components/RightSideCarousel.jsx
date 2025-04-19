import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import image from '../assets/image copy.png'

const images = [
    image,
    image,
    image
];

const WelfareCarousel = () => {
  return (
    <div className="absolute bottom-0 right-0 w-full h-full object-cover z-10">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="w-full h-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="w-full h-full">
            <img
              src={src.src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default WelfareCarousel;





// "use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import { Pagination } from "swiper/modules";
// import Image from "next/image";
// import { CiBookmark } from "react-icons/ci";

// const schemes = [
//   {
//     id: 1,
//     title: "Adi Dravidar and Tribal Welfare Department",
//     description:
//       "Free education up to 12th Std. to all. Tuition fee will not be collected and the amount will be reimbursed by the government.",
//     category: "Welfare Department",
//     tags: ["Tamil Nadu", "Student", "SC/ST"],
//     image: "/path-to-image1.jpg",
//   },
//   {
//     id: 2,
//     title: "Scholarships for Female Students",
//     description:
//       "Free education up to 12th Std. Tuition fee will not be collected and the amount will be reimbursed by the government.",
//     category: "Scholarships",
//     tags: ["Education", "Girls", "Support"],
//     image: "/path-to-image2.jpg",
//   },
// ];

// const SchemeCarousel = () => {
//   return (
//     <Swiper
//       slidesPerView={1}
//       spaceBetween={10}
//       pagination={{ clickable: true }}
//       modules={[Pagination]}
//       className="w-full max-w-md"
//       autoplay={{ delay: 3000 }}
//     >
//       {schemes.map((scheme) => (
//         <SwiperSlide key={scheme.id}>
//           <div className="p-[10px] border rounded-lg shadow-lg bg-white">
//             <div className="flex justify-between items-center">
//               <p className="text-sm font-semibold">{scheme.title}</p>
//               <CiBookmark />
//             </div>
//             <p className="text-xs text-gray-600 opacity-70 line-clamp-2">
//               <span className="font-bold">Description:</span> {scheme.description}
//             </p>
//             <p className="text-xs underline text-gray-500">{scheme.category}</p>

//             <div className="flex gap-1 mt-2">
//               {scheme.tags.map((tag) => (
//                 <div
//                   key={tag}
//                   className="px-2 py-1 border text-xs rounded text-blue-600 border-blue-600 bg-white"
//                 >
//                   {tag}
//                 </div>
//               ))}
//             </div>

//             <Image
//               src={scheme.image}
//               alt={scheme.title}
//               width={250}
//               height={150}
//               className="mt-2 rounded"
//             />
//           </div>
//         </SwiperSlide>
//       ))}
//     </Swiper>
//   );
// };

// export default SchemeCarousel;
