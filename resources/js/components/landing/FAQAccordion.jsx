import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQAccordion = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What are the admission requirements for LOD University?",
            answer: "Admission requirements vary by program, but generally include a completed application, official transcripts, standardized test scores (SAT/ACT), letters of recommendation, and a personal statement. International students may need TOEFL/IELTS scores. Specific requirements for each program can be found on our admissions website.",
        },
        {
            question: "What financial aid options are available?",
            answer: "LOD University offers comprehensive financial aid including merit-based scholarships, need-based grants, work-study programs, and federal student loans. Over 85% of our students receive some form of financial assistance. We also offer payment plans and emergency financial aid for unexpected circumstances.",
        },
        {
            question: "Can I change my major after enrollment?",
            answer: "Yes! We encourage academic exploration. Students can change majors within their first two years without penalty. Our academic advisors work closely with students to ensure a smooth transition and help create a graduation plan that fits their new academic goals.",
        },
        {
            question: "What support services are available for students?",
            answer: "LOD University provides comprehensive support including academic tutoring, career counseling, mental health services, disability support, international student services, and 24/7 campus security. We also offer study abroad programs, internship placement, and alumni networking opportunities.",
        },
        {
            question: "What is campus housing like?",
            answer: "Our campus features modern residence halls with various living options from traditional dorms to apartment-style housing. All rooms include high-speed internet, study areas, and common spaces. First-year students are guaranteed on-campus housing, and upperclassmen can choose from on-campus or nearby off-campus options.",
        },
        {
            question: "How do I schedule a campus visit?",
            answer: "Campus visits can be scheduled through our admissions website or by calling our admissions office. We offer guided tours, information sessions, overnight stays, and virtual tours. Group visits for schools and organizations can also be arranged with advance notice.",
        },
    ];

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
