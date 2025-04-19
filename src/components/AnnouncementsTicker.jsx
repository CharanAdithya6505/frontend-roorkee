import React, { useEffect, useState, useRef } from 'react';

const AnnouncementsTicker = () => {
  const [announcements, setAnnouncements] = useState([]);
  const tickerRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/announcements/`)
      .then(res => res.json())
      .then(data => setAnnouncements(data))
      .catch(err => console.error(err));
  }, []);
  const isActiveAnnouncements = announcements.filter(item=>item.is_active)
  if (isActiveAnnouncements.length === 0) return null;

  const tickerItems = isActiveAnnouncements.map((item, index) =>(
    <span
      key={index}
      className="mx-8 text-[15px] md:text-base flex-shrink-0 text-gray-800 whitespace-nowrap"
    >
      <strong className="text-blue-800">{item.title}:</strong> {item.description}
      {item.view_link && (
        <a
          href={item.view_link}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-blue-600 underline hover:text-blue-900"
        >
          Click here to View
        </a>
      )}
      {item.apply_link && (
        <a
          href={item.apply_link}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-emerald-600 underline hover:text-emerald-800"
        >
          Click here to Apply
        </a>
      )}
    </span>
));

  return (
    <div className="w-full bg-gradient-to-r from-white via-slate-50 to-white border-t-4 border-blue-800 shadow-inner">
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>

      <div className="flex items-center py-2 overflow-hidden w-full">
        <div
          className="flex animate-scroll whitespace-nowrap"
          style={{
            animation: 'scroll 40s linear infinite',
            width: 'max-content',
          }}
          ref={tickerRef}
        >
          {/* Duplicate items for seamless loop */}
          {[...tickerItems, ...tickerItems]}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsTicker;
