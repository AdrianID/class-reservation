import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data";

const FAQAccordion = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <div key={index} className="group">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <button
                            onClick={() => toggleAccordion(index)}
                            className="w-full flex items-center justify-between p-6 text-left transition-all duration-300 group focus:outline-none"
                        >
                            <h3 className="text-lg font-semibold text-[#365b6d] pr-4 group-hover:text-[#2a4a5a] transition-colors">
                                {faq.question}
                            </h3>
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#365b6d] to-[#2a4a5a] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                                        openIndex === index
                                            ? "rotate-180"
                                            : "rotate-0"
                                    }`}
                                />
                            </div>
                        </button>
                        <div
                            className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                openIndex === index
                                    ? "max-h-96 opacity-100"
                                    : "max-h-0 opacity-0"
                            }`}
                        >
                            <div className="px-6 pb-6">
                                <div className="h-px bg-gradient-to-r from-transparent via-[#365b6d]/20 to-transparent mb-4"></div>
                                <p className="text-gray-700 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FAQAccordion;
