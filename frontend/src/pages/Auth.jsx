import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ReCAPTCHA from 'react-google-recaptcha';
import Lottie from 'lottie-react';
import toast, { Toaster } from 'react-hot-toast';

const LOTTIE_URL = "https://assets9.lottiefiles.com/packages/lf20_q5pk6p1k.json";

const Auth = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const mode = searchParams.get('mode') || 'login';
    const isLogin = mode === 'login';

    const [animationData, setAnimationData] = useState(null);
    useEffect(() => {
        fetch(LOTTIE_URL)
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(() => {});
    }, []);

    const [form, setForm] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
        phone: '' 
    });
    
    const [captchaToken, setCaptchaToken] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
             toast.error('Invalid Email Formatted String');
             return;
        }

        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!form.phone || form.phone.length < 7) {
            toast.error('Please enter a valid phone number');
            return;
        }

        if (!captchaToken) {
            toast.error('Please verify the ReCaptcha');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Building account...');
        try {
            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
                phone: form.phone,
                captchaToken: captchaToken
            };

            const { data } = await api.post('/auth/signup', payload);
            
            toast.success('Welcome to BuildYourCV.io!', { id: toastId });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!captchaToken) {
            toast.error('Please verify the ReCaptcha');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Authenticating...');
        try {
            const { data } = await api.post('/auth/login', {
                email: form.email,
                password: form.password,
                captchaToken
            });
            toast.success('Logged in successfully!', { id: toastId });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isSignupPasswordInvalid = !isLogin && form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-12 relative z-10 cursor-none">
            <Toaster position="top-right" />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`glass-dark p-8 rounded-2xl w-full flex flex-col md:flex-row gap-8 shadow-2xl border border-slate-700/50 ${isLogin ? 'max-w-md' : 'max-w-4xl'}`}
            >
                {!isLogin && animationData && (
                    <div className="hidden md:flex flex-1 items-center justify-center border-r border-slate-700/50 pr-8">
                        <Lottie animationData={animationData} loop={true} />
                    </div>
                )}

                <div className="flex-1 flex flex-col justify-center w-full">
                    <h2 className="text-3xl font-bold text-center text-white mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-sm text-center text-gray-400 mb-8">
                        {isLogin ? 'Sign in to access your dashboard' : 'Join thousands of professionals today'}
                    </p>

                    <form onSubmit={isLogin ? handleLogin : handleSignup} className="flex flex-col gap-4">
                        {!isLogin && (
                            <>
                                <input 
                                    type="text" 
                                    placeholder="Full Name" 
                                    className="bg-slate-900/50 border border-slate-700 p-3 rounded text-white focus:outline-none focus:border-primary transition"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                                <PhoneInput
                                    country={'us'}
                                    value={form.phone}
                                    onChange={phone => setForm({ ...form, phone })}
                                    containerClass="!bg-transparent text-black"
                                    inputClass="!w-full !h-[50px] !bg-slate-900/50 !border-slate-700 !text-white focus:!outline-none focus:!border-primary !pl-[50px]"
                                    buttonClass="!bg-slate-800 !border-slate-700"
                                    dropdownClass="text-black"
                                    inputProps={{ required: true }}
                                />
                            </>
                        )}
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            className="bg-slate-900/50 border border-slate-700 p-3 rounded text-white focus:outline-none focus:border-primary transition"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <div className="flex flex-col gap-1 w-full">
                            <input 
                                type="password" 
                                placeholder={isLogin ? "Password" : "Enter Password"} 
                                className="bg-slate-900/50 border border-slate-700 p-3 rounded text-white w-full focus:outline-none focus:border-primary transition"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                        
                        {!isLogin && (
                            <div className="flex flex-col gap-1 w-full">
                                <input 
                                    type="password" 
                                    placeholder="Confirm Password" 
                                    className={`bg-slate-900/50 border p-3 rounded text-white w-full focus:outline-none transition ${
                                        isSignupPasswordInvalid 
                                        ? 'border-red-500 focus:border-red-500 bg-red-500/5' 
                                        : 'border-slate-700 focus:border-primary'
                                    }`}
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                    required
                                />
                                {isSignupPasswordInvalid && (
                                    <span className="text-red-500 text-xs font-bold mt-1">Passwords do not match!</span>
                                )}
                            </div>
                        )}

                        <div className="flex justify-center my-3 overflow-hidden rounded shadow-sm border border-slate-700">
                            <ReCAPTCHA
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                                onChange={(val) => setCaptchaToken(val)}
                                theme="dark"
                            />
                        </div>
                        
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting || isSignupPasswordInvalid}
                            className="mt-2 py-3 bg-primary rounded font-semibold text-white shadow-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLogin ? (isSubmitting ? 'Logging in...' : 'Log In') : (isSubmitting ? 'Creating Account...' : 'Complete Signup')}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center text-gray-400 text-sm border-t border-slate-700/50 pt-6">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            onClick={() => {
                                setCaptchaToken(null);
                                navigate(`/auth?mode=${isLogin ? 'signup' : 'login'}`);
                            }}
                            className="text-primary hover:underline ml-1 font-semibold"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
