import React, { useEffect } from "react";
import { useTabContext } from "@/Context/TabContext";
import { IoCloseSharp } from "react-icons/io5";
import { useAuth } from "@/Context/AuthContext";

function SearchInput() {
  const { query, setquery } = useTabContext();
  const { authState } = useAuth();
  console.log("query", query);
  const logUserEvent = async (eventType, schemeId = null, details = {}) => {
    const eventBody = {
      event_type: eventType,
      ...(schemeId && { scheme_id: schemeId }),
      details: details,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/log/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify(eventBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to log event");
      }

      const data = await response.json();
      console.log("Event logged successfully:", data);
    } catch (error) {
      console.error("Error logging event:", error);
    }
  };

  // Use useEffect to log search events whenever query changes

  const DEBOUNCE_DELAY = 500;

  useEffect(() => {
    if (!query.trim()) return;

    const handler = setTimeout(() => {
      logUserEvent("search", null, { query });
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="sticky top-0 z-0 flex items-center gap-3 h-14 px-3 rounded-lg border border-gray-300 bg-white hidden sm:flex">
      {/* Search Icon */}
      <svg
        className="w-5 h-5 text-gray-500"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20 20l-4.585-4.585M10 17a7 7 0 100-14 7 7 0 000 14z"></path>
      </svg>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search schemes, job openings or scholarships"
        className="flex-1 px-2 text-sm bg-transparent focus:outline-none placeholder-[#616161]"
        value={query}
        onChange={(e) => setquery(e.target.value)}
      />

      {/* Clear Input Icon */}
      <div className="cursor-pointer hover:scale-110">
        {query && (
          <IoCloseSharp
            className="text-gray-500 w-5 h-5"
            onClick={() => setquery("")}
          />
        )}
      </div>
    </div>
  );
}

export default SearchInput;
