import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import SectionHeader from "../SectionHeader";
import Badge from "../Badge";
import ProgramCard from "../ProgramCard";
import ProgramDetail from "../ProgramDetail";
import { programs } from "../../../data";

const ProgramsSection = () => {
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProgramClick = (program) => {
        setSelectedProgram(program);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setSelectedProgram(null);
        }, 400);
    };

    const handleProgramSwitch = (newProgram) => {
        setSelectedProgram(newProgram);
    };

    return (
        <>
            <section id="programs" className="py-20 bg-white relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/10 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <SectionHeader
                        badge={
                            <Badge icon={BookOpen}>Academic Excellence</Badge>
                        }
                        title={
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Our Programs
                            </span>
                        }
                        description="Discover world-class programs designed to prepare you for success in the modern world"
                    />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {programs.map((program, index) => (
                            <div
                                key={program.id}
                                onClick={() => handleProgramClick(program)}
                                className="cursor-pointer"
                            >
                                <ProgramCard
                                    {...program}
                                    isModalOpen={isModalOpen}
                                    onLearnMore={() =>
                                        handleProgramClick(program)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <ProgramDetail
                program={selectedProgram}
                programs={programs}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onProgramSwitch={handleProgramSwitch}
            />
        </>
    );
};

export default ProgramsSection;
