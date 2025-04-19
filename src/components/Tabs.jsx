import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import PageContext from "@/Context/PageContext";
import { useTabContext } from "@/Context/TabContext";
import JobOpenings from "./ComponentsUtils/JobOpenings";
import Schemes from "./Schemes";
import Scholarships from "./Scholarships";
import SearchInput from "./ComponentsUtils/SearchInput";
import SelectedFilters from "./SelectedFilters";
import Saved from "./savedForLoginuser";
import React from "react";

export default function Tabs() {
  const router = useRouter();
  const { activeTab, setActiveTab } = useTabContext();
  const { currentPage, setCurrentPage } = useContext(PageContext);
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tabs from API and maintain order
  useEffect(() => {
    if (!router.isReady) return;
    async function fetchTabs() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/layout-items/`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          const sortedTabs = data.sort((a, b) => a.order - b.order);
          setTabs(sortedTabs);

          const { tab } = router.query;
          if (tab && sortedTabs.some((t) => t.column_name === tab)) {
            setActiveTab(tab);
          } else if (!tab) {
            const defaultTab = sortedTabs[0]?.column_name;
            setActiveTab(defaultTab);
            router.replace(
              {
                pathname: router.pathname,
                query: { ...router.query, tab: defaultTab },
              },
              undefined,
              { shallow: true }
            );
          }
        }
      } catch (error) {
        console.error("Error fetching tab data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTabs();
  }, [router.pathname, router.query]);

  const handleTabClick = (tabName) => {
    if (activeTab !== tabName) {
      setActiveTab(tabName);
      setCurrentPage(1);
      router.push(
        {
          pathname: router.pathname,
          query: { tab: tabName },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const getButtonClass = (tabName) => {
    return `sticky top-0 flex-grow text-center border-b-[2px] font-sm p-[12px] rounded-t-[8px] text-semibold text-[14px] cursor-pointer font-sans ${
      activeTab === tabName
        ? "bg-[#FADFC9] border-b-[3px] border-[#F58220]"
        : "hover:bg-[#FADFC9] hover:border-b-[3px] hover:border-[#F58220]"
    }`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "scholarships":
        return <Scholarships />;
      case "schemes":
        return <Schemes />;
      case "jobs":
        return <JobOpenings />;
      case "Saved":
        return <Saved />;
      default:
        return null;
    }
  };

  if (!tabs.some((tab) => tab.column_name === "Saved")) {
    tabs.push({
      column_name: "Saved",
      order: Math.max(...tabs.map((tab) => tab.order), 1) + 1,
    });
  }

  return (
    <div>
      <SearchInput />
      <SelectedFilters />

      {/* Tabs for Larger Screens */}
      <div className="sticky top-[180px] z-0 bg-white sm:flex justify-center items-center gap-[5px] sm:block hidden">
        {!loading &&
          tabs.map((tab) => (
            <button
              key={tab.column_name}
              className={getButtonClass(tab.column_name)}
              onClick={() => handleTabClick(tab.column_name)}
            >
              {tab.column_name.charAt(0).toUpperCase() +
                tab.column_name.slice(1)}
            </button>
          ))}
      </div>

      <hr className="sm:hidden" />

      {renderTabContent()}
    </div>
  );
}
