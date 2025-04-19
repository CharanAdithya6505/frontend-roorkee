import React, { useEffect, useState } from 'react';

const RelatedSchemesModal = ({ schemeId }) => {
    const [relatedSchemes, setRelatedSchemes] = useState([]);

    useEffect(() => {
        const fetchSchemeData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/scheme/${schemeId}/recommendations/`);
                const data = await response.json();
                const limitedSchemes = data.recommended_schemes.slice(0, 6);
                setRelatedSchemes(limitedSchemes);
            } catch (error) {
                console.error('Error fetching scheme data:', error);
            }
        };

        fetchSchemeData();
    }, [schemeId]);

    if (relatedSchemes.length === 0) {
        return null;
    }

    const frontendUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(':8000','')

    return (
        <div className="w-full bg-white shadow-lg rounded-lg p-6 md:p-8 border border-gray-200">
            <p className="text-xl font-bold text-indigo-700 mb-6 border-b border-gray-300 pb-2">
                Related Schemes
            </p>
            <ol className="list-decimal pl-5 space-y-4 text-gray-800">
                {relatedSchemes.map((scheme) => (
                    <li key={scheme.id} className="text-md font-medium">
                        <a
                            href={`${frontendUrl}/AllSchemes?tab=schemes&scheme_id=${scheme.id}&modal_open=true`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#3431BB] hover:text-blue-900 transition-colors underline underline-offset-2"
                        >
                            {scheme.title}
                        </a>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default RelatedSchemesModal;
