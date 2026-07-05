import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api, { resolveAssetUrl } from '../services/api';
import toast from 'react-hot-toast';

const emptyProfileForm = (data) => ({
    address: data?.address || '',
    headline: data?.headline || '',
    summary: data?.summary || '',
    linkedin: data?.linkedin || '',
    github: data?.github || '',
    website: data?.website || '',
});

export const ProfileForm = ({ user, data, refresh, onNext, onSkip }) => {
    const [form, setForm] = useState(() => emptyProfileForm(data));
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(data?.image ? resolveAssetUrl(data.image) : null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                toast.error('Only JPG/PNG images are allowed');
                return;
            }
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveAndContinue = async (e) => {
        e.preventDefault();

        // Allow saving without strict validation so users can move to the next section freely

        try {
            const formData = new FormData();
            formData.append('address', form.address);
            formData.append('headline', form.headline);
            formData.append('summary', form.summary);
            formData.append('linkedin', form.linkedin);
            formData.append('github', form.github);
            formData.append('website', form.website);
            if (profileImage) {
                formData.append('image', profileImage);
            }

            // Must post as multipart since we're handling images dynamically now here
            await api.post('/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Basic info saved successfully!');
            await refresh();
            
            // Navigate forward cleanly
            if (onNext) onNext();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save profile data.');
        }
    };

    const handleSkip = () => {
        // Discard any local modifications explicitly before skipping
        setForm(emptyProfileForm(data));
        setProfileImage(null);
        if (onSkip) onSkip();
    };

    return (
        <form onSubmit={handleSaveAndContinue} className="flex flex-col gap-6 w-full">
            <h3 className="text-xl font-bold text-white mb-2">Basic Info</h3>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center shrink-0 gap-3">
                    <div className="w-32 h-32 rounded-full border border-slate-600 bg-slate-800 overflow-hidden flex items-center justify-center shadow-lg cursor-pointer group relative"
                         onClick={() => document.getElementById('profileImageDashboardInput').click()}
                    >
                        {imagePreview ? (
                            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover group-hover:opacity-50 transition" />
                        ) : (
                            <span className="text-slate-400 text-sm group-hover:text-white">Upload</span>
                        )}
                    </div>
                    <label className="text-xs text-primary font-semibold hover:underline cursor-pointer">
                        Upload Image (JPG/PNG)
                        <input id="profileImageDashboardInput" type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={handleImageChange} />
                    </label>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Name</label>
                        <input value={user?.name || ''} readOnly className="bg-slate-800 p-3 rounded text-gray-400 cursor-not-allowed border border-slate-700" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Email</label>
                        <input value={user?.email || ''} readOnly className="bg-slate-800 p-3 rounded text-gray-400 cursor-not-allowed border border-slate-700" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Phone Number</label>
                        <input value={user?.phone || ''} readOnly className="bg-slate-800 p-3 rounded text-gray-400 cursor-not-allowed border border-slate-700" />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-gray-300 text-sm font-semibold">Professional Headline</label>
                        <input
                            value={form.headline}
                            onChange={e => setForm({ ...form, headline: e.target.value })}
                            className="bg-slate-900 border border-slate-600 p-3 rounded text-white focus:outline-none focus:border-primary"
                            placeholder="e.g. Full-Stack Developer"
                        />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2 mt-2">
                        <label className="text-gray-300 text-sm font-semibold">Address</label>
                        <textarea
                            value={form.address}
                            onChange={e => setForm({...form, address: e.target.value})}
                            className="bg-slate-900 border border-slate-600 p-3 rounded text-white min-h-[100px] focus:outline-none focus:border-primary"
                            placeholder="Enter your full address"
                        />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2 mt-2">
                        <label className="text-gray-300 text-sm font-semibold">Professional Summary</label>
                        <textarea
                            value={form.summary}
                            onChange={e => setForm({ ...form, summary: e.target.value })}
                            className="bg-slate-900 border border-slate-600 p-3 rounded text-white min-h-[100px] focus:outline-none focus:border-primary"
                            placeholder="A short 2-3 sentence summary of your experience and goals"
                        />
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                        <label className="text-gray-400 text-sm">LinkedIn URL</label>
                        <input
                            value={form.linkedin}
                            onChange={e => setForm({ ...form, linkedin: e.target.value })}
                            className="bg-slate-900 border border-slate-700 p-3 rounded text-white focus:outline-none focus:border-primary"
                            placeholder="https://linkedin.com/in/..."
                        />
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                        <label className="text-gray-400 text-sm">GitHub URL</label>
                        <input
                            value={form.github}
                            onChange={e => setForm({ ...form, github: e.target.value })}
                            className="bg-slate-900 border border-slate-700 p-3 rounded text-white focus:outline-none focus:border-primary"
                            placeholder="https://github.com/..."
                        />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2 mt-2">
                        <label className="text-gray-400 text-sm">Portfolio / Website URL</label>
                        <input
                            value={form.website}
                            onChange={e => setForm({ ...form, website: e.target.value })}
                            className="bg-slate-900 border border-slate-700 p-3 rounded text-white focus:outline-none focus:border-primary"
                            placeholder="https://yourdomain.com"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-700 mt-4 pt-6 flex justify-between items-center">
                <button type="button" onClick={handleSkip} className="px-6 py-2 rounded font-semibold text-gray-400 hover:text-white transition cursor-pointer">
                    Skip
                </button>
                <button 
                    type="submit" 
                    className="px-8 py-3 rounded font-bold transition shadow-lg bg-primary text-white hover:bg-blue-600 cursor-pointer"
                >
                    Save & Continue
                </button>
            </div>
        </form>
    );
};

export const ListManager = ({ title, endpoint, fields, dataList, refresh, onNext, onSkip }) => {
    const defaultForm = fields.reduce((acc, field) => {
        if (field.type === 'file') return { ...acc, [field.name]: [] };
        if (field.type === 'range') return { ...acc, [field.name]: field.default ?? field.min ?? 3 };
        return { ...acc, [field.name]: field.options ? field.options[0] : '' };
    }, {});

    const [form, setForm] = useState(defaultForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Determines if any inputs have data. If yes, the user has initiated tracking
    const isFormPartiallyFilled = () => {
        return fields.some(f => {
            if (f.type === 'file') return form[f.name].length > 0;
            if (f.type === 'select' || f.type === 'range') return false;
            return form[f.name].trim() !== '';
        });
    };

    const isFormFullyFilled = () => {
        return fields.every(f => {
            if (f.required === false) return true;
            if (f.type === 'file') return form[f.name].length > 0;
            if (f.type === 'range') return true;
            return form[f.name].trim() !== '';
        });
    };

    const handleAdd = async (e) => {
        if (e) e.preventDefault();

        if (!isFormFullyFilled()) {
            toast.error("Please fill all required fields to add this item.");
            return false;
        }

        setIsSubmitting(true);
        const toastId = toast.loading(`Adding ${title}...`);
        try {
            if (fields.some(f => f.type === 'file')) {
                const formData = new FormData();
                let hasValidImages = true;

                fields.forEach(f => {
                    if (f.type === 'file') {
                        Array.from(form[f.name]).forEach(file => {
                            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                                toast.error('Only JPG/PNG images are allowed', { id: toastId });
                                hasValidImages = false;
                            }
                            formData.append(f.name, file);
                        });
                    } else {
                        formData.append(f.name, form[f.name]);
                    }
                });

                if (!hasValidImages) {
                    setIsSubmitting(false);
                    return false;
                }

                await api.post(`/profile/${endpoint}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post(`/profile/${endpoint}`, form);
            }

            setForm(defaultForm);
            await refresh();
            toast.success(`${title} added!`, { id: toastId });
            setIsSubmitting(false);
            return true;
        } catch (error) {
            console.error(error);
            toast.error(`Failed to add ${title}.`, { id: toastId });
            setIsSubmitting(false);
            return false;
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/profile/${endpoint}/${id}`);
            toast.success(`${title} entry removed.`);
            refresh();
        } catch (error) {
            console.error(error);
            toast.error("Deletion failed.");
        }
    };

    const handleSaveAndContinue = async () => {
        if (isFormPartiallyFilled()) {
            // If they tried continuing but didn't finish the text blocks.
            if (!isFormFullyFilled()) {
                toast.error("Please fill all required fields to save this item, or clear them to continue.");
                return;
            }
            
            // If they legally filled everything dynamically on their way explicitly clicking 'Save & Continue'
            const success = await handleAdd();
            if (success && onNext) onNext();
        } else {
            // Nothing was partially inputted, we assume they are just navigating explicitly ahead to CV block
            // (Functioning organically like a strict 'next' behavior)
            if (onNext) onNext();
        }
    };

    const executeSkip = () => {
        // Drop any unsaved data visually, resetting the bounds strictly.
        setForm(defaultForm);
        if (onSkip) onSkip();
    };

    return (
        <div className="w-full">
            <div className="space-y-4 mb-8">
                <AnimatePresence>
                    {dataList?.map((item, index) => (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={item.id || index} 
                            className="bg-slate-800 p-5 rounded-xl flex justify-between items-start border border-slate-700 shadow-md"
                        >
                            <div className="flex flex-col gap-2">
                                {fields.map(f => (
                                    f.type !== 'file' && (
                                        <div key={f.name} className="flex gap-3 items-center">
                                            <span className="text-gray-400 font-medium min-w-[100px]">{f.label}:</span>
                                            {f.type === 'range' ? (
                                                <div className="flex gap-1">
                                                    {Array.from({ length: f.max ?? 5 }).map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`w-4 h-2 rounded-sm ${i < (item[f.name] ?? 0) ? 'bg-primary' : 'bg-slate-600'}`}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-100 font-semibold">{item[f.name]}</span>
                                            )}
                                        </div>
                                    )
                                ))}
                                {item.images && item.images.length > 0 && (
                                    <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                                        {item.images.map(img => (
                                            <img key={img.id} src={resolveAssetUrl(img.image_path)} alt="Project" className="w-20 h-20 object-cover rounded shadow" />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 font-bold p-2 bg-red-400/10 rounded-lg transition-colors cursor-pointer">✕</button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {(!dataList || dataList.length === 0) && (
                    <div className="text-center p-8 border-2 border-dashed border-slate-700 rounded-xl text-gray-500">
                        No {title.toLowerCase()} items added yet. Fill the form below to add one.
                    </div>
                )}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="bg-slate-800/40 border border-slate-700 p-6 rounded-xl flex flex-col gap-4">
                <h4 className="text-white font-bold mb-2">Add New {title} Item</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.map(f => (
                        <div key={f.name} className={`flex flex-col gap-1 ${f.name === 'description' ? 'md:col-span-2' : ''}`}>
                            <label className="text-gray-400 text-sm">{f.label}</label>
                            
                            {f.type === 'textarea' || f.name === 'description' ? (
                                <textarea 
                                    placeholder={f.label}
                                    value={form[f.name]}
                                    onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                                    className="bg-slate-900 border border-slate-700 p-3 rounded text-white focus:outline-none focus:border-primary min-h-[80px]"
                                    // Notice: Native req blocks disabled to use manual react-hot-toast popups instead
                                />
                            ) : f.type === 'select' ? (
                                <select 
                                    value={form[f.name]}
                                    onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                                    className="bg-slate-900 border border-slate-700 p-3 rounded text-white focus:outline-none focus:border-primary"
                                >
                                    {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            ) : f.type === 'file' ? (
                                <input
                                    type="file"
                                    multiple={f.multiple}
                                    accept={f.accept}
                                    onChange={e => setForm({ ...form, [f.name]: e.target.files })}
                                    className="text-gray-400 file:bg-slate-700 file:border-none file:text-white file:px-4 file:py-2 file:rounded hover:file:bg-slate-600 transition cursor-pointer"
                                />
                            ) : f.type === 'range' ? (
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min={f.min ?? 1}
                                        max={f.max ?? 5}
                                        value={form[f.name]}
                                        onChange={e => setForm({ ...form, [f.name]: Number(e.target.value) })}
                                        className="flex-1 accent-primary cursor-pointer"
                                    />
                                    <span className="text-white font-bold w-6 text-center">{form[f.name]}</span>
                                </div>
                            ) : (
                                <input 
                                    type={f.type || 'text'}
                                    placeholder={f.label}
                                    value={form[f.name]}
                                    onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                                    className="bg-slate-900 border border-slate-700 p-3 rounded text-white focus:outline-none focus:border-primary"
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-2">
                    <button type="submit" disabled={isSubmitting} className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 border border-slate-500 text-white px-6 py-2 rounded font-semibold transition cursor-pointer">
                        + Add to {title} List
                    </button>
                </div>
            </form>

            <div className="border-t border-slate-700 mt-10 pt-6 flex justify-between items-center">
                <button type="button" onClick={executeSkip} className="px-6 py-2 rounded font-semibold text-gray-400 hover:text-white transition cursor-pointer">
                    Skip
                </button>
                <button 
                    type="button"
                    onClick={handleSaveAndContinue}
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-blue-600 disabled:opacity-50 px-8 py-3 rounded font-bold text-white shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                    {isSubmitting ? 'Saving...' : 'Save & Continue'}
                </button>
            </div>
        </div>
    );
};
