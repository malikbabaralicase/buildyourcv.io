import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { motion } from 'framer-motion';
import ModernTemplate from './cv-templates/ModernTemplate';
import ClassicTemplate from './cv-templates/ClassicTemplate';
import MinimalTemplate from './cv-templates/MinimalTemplate';

const TEMPLATES = {
    modern: { label: 'Modern', component: ModernTemplate },
    classic: { label: 'Classic', component: ClassicTemplate },
    minimal: { label: 'Minimal', component: MinimalTemplate },
};

const CVPreview = ({ profileData, template, setTemplate }) => {
    const cvRef = useRef();
    const [internalTemplate, setInternalTemplate] = useState('modern');

    const activeTemplate = template ?? internalTemplate;
    const changeTemplate = setTemplate ?? setInternalTemplate;

    const generatePDF = () => {
        const element = cvRef.current;
        const opt = {
            margin:       0,
            filename:     `${profileData.user?.name || 'User'}_CV.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        // A4 height is ~297mm. If content overflows heavily, it may clip.
        html2pdf().set(opt).from(element).save();
    };

    if (!profileData) return <div className="text-white">Loading...</div>;

    const TemplateComponent = TEMPLATES[activeTemplate]?.component || ModernTemplate;

    return (
        <div className="flex flex-col items-center gap-6 pb-20">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-2 z-10">
                <div className="flex gap-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-full p-1.5">
                    {Object.entries(TEMPLATES).map(([key, { label }]) => (
                        <button
                            key={key}
                            onClick={() => changeTemplate(key)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                                activeTemplate === key
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generatePDF}
                    className="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-primary/30 cursor-pointer"
                >
                    Download PDF
                </motion.button>
            </div>

            {/* CV Holder constraints A4 sizing aspect roughly */}
            <div className="bg-white text-gray-900 w-[210mm] min-h-[297mm] shadow-2xl relative overflow-hidden text-[11pt]">
                <div ref={cvRef} className="h-full w-full">
                    <TemplateComponent profileData={profileData} />
                </div>
            </div>
        </div>
    );
};

export default CVPreview;
