import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UserPlus, FileEdit, Download, Eye, LayoutTemplate, ShieldCheck, FileDown } from 'lucide-react';
import HeroScene from '../components/three/HeroScene';
import CanvasErrorBoundary from '../components/three/CanvasErrorBoundary';
import Typewriter from '../components/Typewriter';

const steps = [
    { icon: UserPlus, title: 'Create your account', desc: 'Sign up in seconds with a secure, verified account.' },
    { icon: FileEdit, title: 'Fill in your details', desc: 'Add your experience, education, skills and projects section by section.' },
    { icon: Download, title: 'Export your CV', desc: 'Pick a template and download a polished, professional PDF instantly.' },
];

const features = [
    { icon: Eye, title: 'Live Preview', desc: 'Watch your CV update in real time as you type.' },
    { icon: LayoutTemplate, title: 'Multiple Templates', desc: 'Switch between Modern, Classic and Minimal layouts.' },
    { icon: ShieldCheck, title: 'Secure by Default', desc: 'JWT authentication and reCAPTCHA keep your account safe.' },
    { icon: FileDown, title: 'One-Click PDF', desc: 'Generate a print-ready, recruiter-friendly PDF instantly.' },
];

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center w-full px-4">
            {/* Hero */}
            <section className="w-full max-w-7xl min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 pt-24 pb-16 lg:pt-0">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="glass-dark p-10 md:p-12 rounded-3xl max-w-xl w-full text-center lg:text-left"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4 leading-tight">
                        Build Your Professional CV
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-2 h-8">
                        For every <Typewriter className="text-white font-semibold" />
                    </p>
                    <p className="text-base md:text-lg text-gray-400 mb-10">
                        Create a stunning, fully interactive portfolio and generate professional quality CVs in PDF format with just a few clicks.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                        <Link to="/auth?mode=signup">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-accent rounded-full text-white font-bold text-lg shadow-lg hover:shadow-primary/50 transition-all cursor-pointer"
                            >
                                Get Started
                            </motion.button>
                        </Link>
                        <Link to="/auth?mode=login">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-8 py-4 glass text-white font-bold text-lg rounded-full shadow-lg cursor-pointer"
                            >
                                Log In
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="w-full max-w-lg h-[360px] md:h-[460px] lg:h-[520px]"
                >
                    <CanvasErrorBoundary fallback={null}>
                        <HeroScene />
                    </CanvasErrorBoundary>
                </motion.div>
            </section>

            {/* How it works */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={stagger}
                className="w-full max-w-6xl py-20"
            >
                <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white text-center mb-14">
                    How it works
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.title}
                            variants={fadeUp}
                            className="glass-dark rounded-2xl p-8 flex flex-col items-center text-center gap-4 relative"
                        >
                            <div className="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg">
                                {i + 1}
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
                                <step.icon className="text-primary" size={30} />
                            </div>
                            <h3 className="text-xl font-bold text-white">{step.title}</h3>
                            <p className="text-gray-400">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Features */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={stagger}
                className="w-full max-w-6xl py-10 pb-28"
            >
                <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white text-center mb-14">
                    Everything you need
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={fadeUp}
                            whileHover={{ y: -6 }}
                            className="glass rounded-2xl p-6 flex flex-col gap-3 transition-shadow hover:shadow-xl hover:shadow-primary/20"
                        >
                            <feature.icon className="text-accent" size={28} />
                            <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                            <p className="text-gray-300 text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <footer className="w-full max-w-6xl border-t border-slate-700/50 py-8 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} buildyourcv.io — Built with React, Three.js & Tailwind.
            </footer>
        </div>
    );
};

export default LandingPage;
