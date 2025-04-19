import { useEffect, useState, useContext, useMemo } from "react";
import Categories from "./Categories";
import PageContext from "@/Context/PageContext";
import FilterContext from "@/Context/FilterContext";
import { useTabContext } from "@/Context/TabContext";
import SchemeCount from "./ComponentsUtils/SchemeCount";
import Footer from "./Footer";
import { data } from "autoprefixer";
import { useRouter } from "next/router.js";

export default function Schemes() {
  const { query } = useTabContext();
  const { states, departments, beneficiaries, sponsoredBy, profileFieldData } =
    useContext(FilterContext);
  const { currentPage } = useContext(PageContext);

  const [dataOfApi, setDataOfApi] = useState({ count: 0, results: [] });
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const router = useRouter();

  const departmentIds = useMemo(() => {
    return Object.keys(departments).reduce(
      (acc, i) => [...acc, ...departments[i]],
      []
    );
  }, [departments]);

  useEffect(() => {
    const fetchState = async () => {
      try {
        setError(null);
        setDataOfApi({});
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/schemes/multi-state-departments/?limit=10&page=${currentPage}`;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          state_ids: states.length ? states[0] : [],
          department_ids: departmentIds,
          sponsor_ids:
            sponsoredBy.length && sponsoredBy[0][0] === 2 ? sponsoredBy[0] : [],
          beneficiary_keywords: beneficiaries,
          search_query: query,
          user_profile: profileFieldData,
        });

        const response = await fetch(url, {
          method: "POST",
          headers: myHeaders,
          body: raw,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setDataOfApi(data);
        setTotalPages(Math.ceil(data.count / 10));
        localStorage.setItem(url, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Unable to load schemes. Please try again later.");
      }
    };

    fetchState();
  }, [query, currentPage, sponsoredBy, states, departmentIds, beneficiaries]);

  console.log(dataOfApi);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (dataOfApi.count === 0 && (states.length || departments.length)) {
    return (
      <div className="flex justify-center text-[14px] sm:text-[18px] items-center mt-[8rem] ">
        No schemes found based on your preference
      </div>
    );
  }

  return (
    <>
      <div className="bg-white font-sans">
        <SchemeCount dataFromApi={dataOfApi} />
        <Categories
          ffff={"schemes"}
          dataFromApi={dataOfApi}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}
