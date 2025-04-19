import { useAuth } from "@/Context/AuthContext";
import FilterContext from "@/Context/FilterContext";
import PageContext from "@/Context/PageContext";
import { useTabContext } from "@/Context/TabContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Categories from "../components/Categories";

export default function Saved() {
  const { query } = useTabContext();
  const { states, departments, beneficiaries, sponsoredBy } =
    useContext(FilterContext);
  const { currentPage, removeSaved } = useContext(PageContext);
  const { authState } = useAuth();
  const [dataOfApi, setDataOfApi] = useState({});
  const router = useRouter();
  const [totalPages, setTotalPages] = useState(0);

  const handleLogin = () => {
    router.push("/login");
  };

  // console.log(authState.token, "authtoken")

  useEffect(() => {
    if (!authState.token) {
      return;
    }

    const fetchState = async () => {
      try {
        setDataOfApi({});

        let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/saved-schemes/filter/?limit=10&page=${currentPage}`;

        const myHeaders = new Headers();

        myHeaders.append("Authorization", `Bearer ${authState.token}`);
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
          q: query,
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
        // console.log(data, "saveddata")
        setDataOfApi(data);
        setTotalPages(Math.ceil(data.count / 10));
        console.log("Data fetched and state updated:", data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchState();
  }, [
    authState.token,
    query,
    currentPage,
    sponsoredBy,
    states,
    departments,
    beneficiaries,
    removeSaved,
  ]);

  if (!authState.token) {
    return (
      <div className="flex justify-center items-center mt-8">
        Please
        <span
          className="mx-1 text-[#3431BB] hover:text-blue-600 cursor-pointer"
          onClick={handleLogin}
        >
          log in
        </span>
        to see your saved data.
      </div>
    );
  }

  if (dataOfApi.count === 0 && sponsoredBy.length !== 0) {
    return (
      <div className="flex justify-center text-[14px] sm:text-[18px] items-center mt-[8rem]">
        No saved schemes found based on your preference.
      </div>
    );
  }
  if (authState.token && dataOfApi.count === 0 && sponsoredBy.length === 0) {
    return (
      <div className="flex justify-center items-center mt-[8rem]">
        No Saved Schemes
      </div>
    );
  }

  return (
    <div className="bg-white font-sans">
      <Categories
        ffff={"saved"}
        dataFromApi={dataOfApi}
        totalPages={totalPages}
      />
    </div>
  );
}
