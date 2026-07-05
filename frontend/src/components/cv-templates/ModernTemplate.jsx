import React from 'react';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Code, Award, Languages, FolderGit2, Link2, Code2, Globe } from 'lucide-react';
import { resolveAssetUrl } from '../../services/api';

const SkillBar = ({ label, level = 3 }) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`h-1.5 flex-1 rounded-full ${i < level ? 'bg-primary' : 'bg-slate-200'}`} />
            ))}
        </div>
    </div>
);

const ModernTemplate = ({ profileData }) => {
    const { user, profile, education, experience, skills, projects, certifications, languages } = profileData;

    return (
        <div className="bg-white p-10 h-full w-full box-border font-sans">
            {/* Header */}
            <header className="flex items-center gap-6 border-b-4 border-slate-900 pb-8 mb-8">
                {profile?.image && (
                    <img
                        src={resolveAssetUrl(profile.image)}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-slate-100 object-cover shadow-sm"
                    />
                )}
                <div className="flex flex-col flex-1 mt-2">
                    <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter shrink-0">{user?.name}</h1>
                    {profile?.headline && <div className="text-lg font-semibold text-primary mt-1">{profile.headline}</div>}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-slate-600 font-medium text-sm">
                        {user?.email && <span className="flex items-center gap-2"><Mail size={16} className="text-primary"/> {user.email}</span>}
                        {user?.phone && <span className="flex items-center gap-2"><Phone size={16} className="text-primary"/> {user.phone}</span>}
                        {profile?.address && <span className="flex items-center gap-2"><MapPin size={16} className="text-primary"/> {profile.address}</span>}
                        {profile?.linkedin && <span className="flex items-center gap-2"><Link2 size={16} className="text-primary"/> {profile.linkedin}</span>}
                        {profile?.github && <span className="flex items-center gap-2"><Code2 size={16} className="text-primary"/> {profile.github}</span>}
                        {profile?.website && <span className="flex items-center gap-2"><Globe size={16} className="text-primary"/> {profile.website}</span>}
                    </div>
                </div>
            </header>

            {profile?.summary && (
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-3 uppercase tracking-wide">Summary</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{profile.summary}</p>
                </section>
            )}

            {/* Content Grid Stacked */}
            <div className="grid grid-cols-12 gap-8">

                {/* Left Column - 4 cols wide */}
                <div className="col-span-4 flex flex-col gap-8 border-r border-slate-200 pr-6">

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <Code size={20} className="text-primary"/> Skills
                            </h2>
                            <div className="flex flex-col gap-3">
                                {skills.map(s => (
                                    <SkillBar key={s.id} label={s.skill_name} level={s.level} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Languages */}
                    {languages && languages.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <Languages size={20} className="text-primary"/> Languages
                            </h2>
                            <ul className="flex flex-col gap-3">
                                {languages.map(l => (
                                    <li key={l.id} className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-slate-800">{l.language}</span>
                                        <span className="text-slate-500 italic bg-primary/10 px-2 rounded-xl text-[10px]">{l.proficiency}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-2 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <Award size={20} className="text-primary"/> Certifications
                            </h2>
                            <ul className="flex flex-col gap-4">
                                {certifications.map(c => (
                                    <li key={c.id}>
                                        <div className="font-bold text-slate-800 text-sm leading-tight mb-1">{c.name}</div>
                                        <div className="text-xs text-slate-500">{c.issuer}</div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                {/* Right Column - 8 cols wide */}
                <div className="col-span-8 flex flex-col gap-8">

                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-300 pb-2 mb-5 flex items-center gap-2 uppercase tracking-wide">
                                <Briefcase size={24} className="text-primary" strokeWidth={2.5}/> Experience
                            </h2>
                            <div className="flex flex-col gap-6">
                                {experience.map(exp => (
                                    <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200">
                                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-lg text-slate-900 tracking-tight">{exp.title}</h3>
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{exp.duration}</span>
                                        </div>
                                        <div className="text-sm text-primary font-semibold tracking-wide mb-2">{exp.company}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-300 pb-2 mb-5 flex items-center gap-2 uppercase tracking-wide">
                                <FolderGit2 size={24} className="text-primary" strokeWidth={2.5}/> Projects
                            </h2>
                            <div className="flex flex-col gap-6">
                                {projects.map(p => (
                                    <div key={p.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-base text-slate-900">{p.title}</h3>
                                            {p.link && (
                                                <a href={p.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">Link</a>
                                            )}
                                        </div>

                                        {p.tech_stack && (
                                            <div className="text-xs text-primary font-semibold mb-2">{p.tech_stack}</div>
                                        )}

                                        <p className="text-sm text-slate-600 leading-relaxed mb-3">{p.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-300 pb-2 mb-5 flex items-center gap-2 uppercase tracking-wide">
                                <GraduationCap size={24} className="text-primary" strokeWidth={2.5}/> Education
                            </h2>
                            <div className="flex flex-col gap-5">
                                {education.map(edu => (
                                    <div key={edu.id} className="flex justify-between items-start group">
                                        <div>
                                            <h3 className="font-bold text-base text-slate-900">{edu.degree}</h3>
                                            <div className="text-sm text-slate-600 font-medium">{edu.institute}</div>
                                        </div>
                                        <span className="text-xs font-bold text-primary mt-1">{edu.year}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ModernTemplate;
