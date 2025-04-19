import FilterContext from "@/Context/FilterContext";
import PageContext from "@/Context/PageContext";
import { useTabContext } from "@/Context/TabContext";
import { useContext, useEffect, useState } from "react";
import Categories from "../Categories";
import JobCount from "./JobCount";

export default function JobOpenings() {
  const { searchQuery } = useTabContext();
  const { states, departments, beneficiaries, sponsoredBy, profileFieldData } =
    useContext(FilterContext);
  const { currentPage } = useContext(PageContext);
  const [dataOfApi, setDataOfApi] = useState({});
  const [totalPages, setTotalPages] = useState(0);

  // console.log(states,"states")
  useEffect(() => {
    const fetchState = async () => {
      try {
        setDataOfApi({});
        let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/schemes/multi-state-departments/?limit=10&page=${currentPage}`;

        // const cachedData = localStorage.getItem(url);
        // if (cachedData) {
        //   setDataOfApi(JSON.parse(cachedData));
        // } else {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          state_ids: states.length !== 0 ? states[0] : [],
          department_ids: Object.keys(departments).reduce((acc, i) => {
            return [...acc, ...departments[i]];
          }, []),
          sponsor_ids:
            sponsoredBy.length !== 0 && sponsoredBy[0][0] === 2
              ? sponsoredBy[0]
              : [],
          beneficiary_keywords: beneficiaries,
          search_query: searchQuery,
          tag: "job",
          user_profile: profileFieldData
          // ordering: "-title",
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
        let data = await response.json();
        setDataOfApi(data);
        setTotalPages(Math.ceil(data.count / 10));
        localStorage.setItem(url, JSON.stringify(data));
        // }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchState();
  }, [
    searchQuery,
    currentPage,
    sponsoredBy,
    states,
    departments,
    beneficiaries,
  ]);

  // console.log(dataOfApi,'shemesdata');
  if (
    dataOfApi.count === 0 &&
    (states.length !== 0 || departments.length !== 0)
  ) {
    return (
      <div className="flex justify-center text-[14px] sm:text-[18px] items-center mt-[8rem]">
        No Job Openings found based on your preference
      </div>
    );
  }

  return (
    <div className="bg-white font-sans">
      <JobCount dataFromApi={dataOfApi} />
      <Categories
        ffff={"jobopening"}
        dataFromApi={dataOfApi}
        totalPages={totalPages}
      />
    </div>
  );
}
