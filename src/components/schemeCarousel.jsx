import { Carousel } from "primereact/carousel";
import { CiBookmark } from "react-icons/ci";

const schemes = [
  {
    title: "National Means Cum Merit Scholarship (NMMS)",
    description:
      "MHRD’s aim is: i)To provide Scholarship to meritorious students belonging to the economically weaker sections of the society ii)Arrest drop-out rates at Class VIII and encourage them to continue their studies at Secondary Stage",
    tags: ["Meghalaya", "Students"],
  },
  {
    title: "Social Welfare Schemes for Differently Abled and Blind in Nagaland",
    description:
      "The Ministry of Social Justice and Empowerment, and the Nagaland Department of Social Welfare, offer several schemes for the differently abled, blind, and other marginalized sections. Among them, the Indira Gandhi National Disability Pension Scheme (IGNDPS) provides monthly pensions to 1276 differently abled persons. A scholarship scheme supports 208 differently abled students from Class-A to Class-VIII. Financial assistance is also given to 1625 blind individuals. The department further facilitates loans for differently abled persons to pursue various trades and provides Grant-in-Aid to several NGOs working for the welfare of differently abled. A District Disability Rehabilitation Centre (DDRC) in Dimapur offers comprehensive rehabilitation services.",
    tags: ["Nagaland", "Blind"],
  },
  {
    title: "Scholarships for Female Students",
    description:
      "Free education up to 12th Std. to all i.e. tuition fee will not be collected and the amount will be reimbursed by the government",
    department: "Education Department",
    tags: ["Scholarship", "Girls", "Education"],
  },
  {
    title: "Assistance for Purchase of Agriculture Inputs",
    description:
      "To provide financial boost to ST farmers for taking up agriculture for their economic upliftment and encourage youths from the communities for self employment. To build up the confidence among the ST farmers against price inflation of inputs and to motivate farmers to use recommended Package of Practices.",
    tags: ["Goa", "Scheduled Tribe Farmers"],
  },
  {
    title: "Free education scholarship for Professional Courses (Engineering, Medical, Agriculture, Veterinary and Law)",
    description:
      "Tuition fee, Special fee and other non-refundable compulsory fees are paid as prescribed by Government and Examination fee in full.",
    tags: ["Tamilnadu", "BC/MBC"],
  }
];

const schemeTemplate = (scheme) => (
  <div className="p-[10.802px] w-3/4 border rounded-[8.102px] bg-white shadow-[0px_0px_9.791px_rgba(5,2,160,0.08)] border-[#EEF]">
    <div className="flex justify-between items-center p-2 pt-0 pl-0">
      <p className="text-[10.584px] font-semibold">{scheme.title}</p>
      <CiBookmark />
    </div>

    <p className="text-[#616161] text-[8.274px] font-semibold opacity-60 mb-[9.93px] line-clamp-2">
      <span className="font-bold">Description:</span> {scheme.description}
    </p>

    <p className="text-[#616161] text-[8.274px] font-normal opacity-60 underline mb-[10px]">
      {scheme.department}
    </p>

    <div className="flex mt-[-7px] gap-1">
      {scheme.tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center justify-center px-2 py-[5px] border border-onclick-btnblue rounded bg-white text-onclick-btnblue font-inter text-xs font-medium scale-[.6]"
        >
          {tag}
        </div>
      ))}
    </div>
  </div>
);

const SchemeCarousel = () => {
  return (
    <div className="w-4/6">
      <Carousel
        value={schemes}
        itemTemplate={schemeTemplate}
        numVisible={1}
        numScroll={1}
        circular
        autoplayInterval={3000}
        showNavigators={false}
      />
    </div>
  );
};

export default SchemeCarousel;
