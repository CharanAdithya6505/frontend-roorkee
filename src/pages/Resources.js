import NavBar from "@/components/NavBar";
import { useRouter } from "next/router";
import React, { useContext, useState, useEffect, useRef } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function Resources() {
  const router = useRouter();
  const linkScrollContainer = useRef()
  const [expandedCategory, setExpandedCategory] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [stateLinks, setStateLinks] = useState([]);
  const [statesFromApi,setStatesFromApi]  = useState([])

  useEffect(()=>{
    async function fetchStateResources() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/states/`)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      else{
        const data = await res.json()
        setStatesFromApi(data)
      }
    }
    fetchStateResources()
  },[])


  useEffect(() => {
    // Every time we change the scroll of the links should be at the top
    if(linkScrollContainer.current){
      linkScrollContainer.current.scrollTop = 0;
    }
    if (selectedState) {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/schemes/resources/state/${selectedState.id}`)
        .then((res) => res.json())
        .then((data) => {
          const validLinks = new Set(
          data
            .map((item) => item.resource_link)
            .filter((link) => link && link.trim() !== "")
          )
          setStateLinks([...validLinks]);
        })
        .catch((err) => {
          console.error("Error fetching state links:", err);
          setStateLinks([]);
        });
    }
  }, [selectedState]);
  

  return (
    <>
      <NavBar />
      <div className="w-full min-h-screen bg-[#EEEEFF] flex items-center justify-center px-4">
        <div className="w-[95%] max-w-2xl min-h-[600px] sm:min-h-[500px] bg-white shadow-xl rounded-xl flex flex-col p-6 overflow-hidden">

          <button
            type="button"
            className="flex items-center gap-2 mb-5 text-lg sm:text-xl font-medium"
            onClick={() => router.back()}
          >
            <FaArrowLeftLong className="mt-1" />
            Back
          </button>

          <h1 className="text-2xl sm:text-3xl text-[#3330BA] font-bold text-center w-full mb-5">
            Resources
          </h1>

          <div className="relative w-full">
            <button
              className="flex items-center justify-between w-full p-4 border rounded-lg bg-gray-100 shadow-md text-black"
              onClick={() => setExpandedCategory(!expandedCategory)}
            >
              <p className="text-lg">{selectedState ? selectedState.state_name : "Select a State"}</p>
              {expandedCategory ? <IoIosArrowUp className="text-black" /> : <IoIosArrowDown className="text-black" />}
            </button>

            {expandedCategory && (
              <div className="absolute w-full mt-1 bg-white shadow-lg rounded-lg max-h-64 overflow-y-auto z-10">
                {statesFromApi.map((state) => (
                  <div
                    key={state.id}
                    className="p-4 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSelectedState(state);
                      setExpandedCategory(false);
                    }}
                  >
                    <p className="text-black">{state.state_name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedState && (
            <div className="mt-5  p-4  border rounded-lg bg-gray-100 shadow-md w-full">
              <h2 className="text-xl font-semibold text-[#3330BA] mb-3">Resources Links</h2>
              <div 
              className="max-h-60 overflow-y-auto pr-2"
              ref={linkScrollContainer}
              >
              <ol className="list-decimal list-item pl-8">
                {stateLinks.length > 0 ? (
                  stateLinks.map((link, index) => {
                    const formattedLink = link.startsWith("http") ? link : `https://${link}`; 
                    return (
                      <li key={index} className="text-black">
                        <a href={formattedLink} target="_blank" rel="noopener noreferrer" className="text-[#3330BA] p-4 hover:underline break-words block">
                          {formattedLink}
                        </a>
                      </li>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-600">No links available.</p>
                )}
              </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
